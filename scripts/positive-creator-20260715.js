(() => {
  'use strict';

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const form = $('#creatorForm');
  const input = $('#creatorInput');
  const log = $('#chatLog');
  const send = form?.querySelector('.send');
  const journeyGroups = $$('[data-journey-key]');
  const journeyButton = $('#buildJourney');
  const journeyStatus = $('#journeyStatus');
  const modeButtons = $$('[data-mode]');
  const dockActions = $$('[data-handoff]');
  const dockStatus = $('#dockStatus');
  const journeySelections = {};
  let selectedMode = 'clarify';
  let latestPlan = null;

  const links = {
    museum: { label: 'הספרייה הציבורית', href: '/museum/' },
    evidence: { label: 'בדיקת ראיות', href: '/evidence/' },
    influence: { label: 'מפת ההשפעה', href: '/influence/' },
    starton: { label: 'StartOn', href: '/starton/' },
    talk: { label: 'שיחה אנושית', href: '/talk/' },
  };

  const SPIRITUAL_ANCHORS = {
    renewal: ['בריאה מחודשת', 'היום אינו חייב להמשיך את אתמול. בחרו פעולה אחת שמוכיחה מי אתם רוצים להיות עכשיו.'],
    courage: ['גיבור שמתגבר', 'אומץ אינו היעדר פחד. הוא הקטנת הצעד עד שהפחד כבר אינו מנהל את ההחלטה.'],
    covenant: ['ברית של מחויבות', 'שמרו על בחירה קטנה לאורך שבעה ימים. לא שלמות — נאמנות לכיוון.'],
    kindness: ['חסד שמקבל גוף', 'כוונה טובה הופכת להשפעה כשהיא פוגשת אדם, צורך, הסכמה ופעולה ממשית.'],
    truth: ['אמת לפני הגברה', 'אל תשנו סיפור כדי שיראו אותו. בנו צורה חזקה מספיק כדי שהאמת תישמע.'],
  };

  const PLATFORM_CREDITS = [
    ['TikTok', 'עצירה', 'Hook, סצנה ופעולה ב־20–35 שניות.'],
    ['Instagram', 'חוויה', 'Reel או carousel עם רגש, הקשר וקרדיט.'],
    ['Facebook', 'שיחה', 'סיפור מלא שמזמין תגובה וקהילה.'],
    ['LinkedIn', 'משמעות מקצועית', 'בעיה, תהליך, לקח ומקור.'],
    ['YouTube', 'עומק וזיכרון', 'וידאו או שיחה שמחזיקים את הסיפור.'],
    ['X / Threads', 'רעיון חד', 'טענה אחת, גבול אחד וקישור למקור.'],
  ];

  const HANDOFF_MODULES = ['copy', 'gmail', 'calendar', 'notion', 'github', 'download', 'share'];
  const normalize = value => String(value ?? '').trim();

  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function message(text, kind = 'assistant', label = '') {
    const article = node('article', `message ${kind}`);
    article.append(node('span', '', label || (kind === 'user' ? 'YOU' : '7YA · BIG BROTHER')), node('p', '', text));
    log?.append(article);
    if (log) log.scrollTop = log.scrollHeight;
    return article;
  }

  function section(title, text, className = '') {
    if (!text) return null;
    const el = node('section', className);
    el.append(node('b', '', title), node('p', '', text));
    return el;
  }

  function listSection(title, items, className = '') {
    if (!Array.isArray(items) || !items.length) return null;
    const el = node('section', className);
    el.append(node('b', '', title));
    const list = document.createElement('ol');
    items.forEach(item => list.append(node('li', '', item)));
    el.append(list);
    return el;
  }

  function inferGoal(text) {
    return text.split(/[.!?\n]/).find(Boolean)?.trim() || 'להפוך כוונה לכיוון ברור ולצעד שאפשר לבצע.';
  }

  function anchorFor(text, mode) {
    const lower = text.toLowerCase();
    let key = 'renewal';
    if (/פחד|ביקורת|תקוע|אומץ/.test(lower) || mode === 'momentum') key = 'courage';
    else if (/לעזור|קהיל|נוער|חסד|השפעה/.test(lower) || mode === 'impact') key = 'kindness';
    else if (/מחויב|הרגל|משמעת|שבוע|ברית/.test(lower)) key = 'covenant';
    else if (/מקור|עובדה|ראיה|אמת|טענה|מספר/.test(lower)) key = 'truth';
    const [title, textValue] = SPIRITUAL_ANCHORS[key];
    return { title, text: textValue };
  }

  function platformPack(goal, hook, angle) {
    return PLATFORM_CREDITS.map(([platform, role, rule]) => {
      let draft = `${hook} ${angle}`;
      if (platform === 'TikTok') draft = `${hook}\n[סצנה] → [שינוי] → [פעולה]`;
      if (platform === 'Instagram') draft = `Slide 1: ${hook}\nSlide 2–5: רגע → מתח → בחירה → משמעות\nCaption: ${angle}`;
      if (platform === 'Facebook') draft = `${hook}\n\nרגע קונקרטי → בחירה → משמעות → שאלה לקהילה.`;
      if (platform === 'LinkedIn') draft = `${goal}\nבעיה → תהליך → לקח → מקור.`;
      if (platform === 'YouTube') draft = `כותרת: ${goal}\nפתיחה: ${hook}\nהסיפור → ההבנה → הצעד.`;
      if (platform === 'X / Threads') draft = `${hook} ${angle} [מקור]`;
      return { platform, role, rule, draft };
    });
  }

  function localCoach(text, selectedMode = 'clarify') {
    const lower = text.toLowerCase();
    const isVideo = /וידאו|סרטון|reel|tiktok|youtube/.test(lower);
    const isBlocked = /פחד|חושש|תקוע|מחסום|ביקורת|לא מצליח/.test(lower);
    const isImpact = /לעזור|קהיל|נוער|חברתי|השפעה|מיזם/.test(lower);
    const isTech = /nvidia|microsoft|openai|github|ai|טכנולוג/.test(lower);
    const isArchive = /ארכיון|ספרייה|מקור של איגור|עבר/.test(lower);
    const goal = inferGoal(text);
    const spiritual_anchor = anchorFor(text, selectedMode);
    let reflection = 'יש כאן משהו אמיתי שמבקש צורה. לא פותרים הכול; בוחרים את הכיוון הבא.';
    let next_step = 'השלימו: “אחרי הצעד הזה אדם אחד יוכל להבין, להרגיש או לעשות ___”.';
    let fifteen_minutes = 'הפעילו טיימר ל־15 דקות, הקליטו קול חופשי והוציאו משפט אחד שאי אפשר לזייף.';
    let today = 'צרו טיוטה אחת ושמרו אותה בשם ברור עם תאריך.';
    let hook = 'יש רגע שבו מפסיקים לחכות לאישור ומתחילים לבנות.';
    let angle = 'סיפור קצר שמוביל לבחירה מעשית.';
    let outline = ['רגע קונקרטי', 'מה היה חסר', 'הבחירה', 'הפעולה לקהל'];
    let selectedLinks = [links.museum, links.influence, links.evidence];
    const evidence_notes = [];

    if (isBlocked || selectedMode === 'momentum') {
      reflection = 'הביקורת קיבלה זכות וטו לפני שהיצירה נולדה. מחזירים שליטה דרך ניסוי קטן.';
      next_step = 'כתבו גרסה פרטית של 120 מילים שאסור לפרסם.';
      fifteen_minutes = 'כתבו עשר דקות ללא מחיקה וסמנו משפט אחד ששווה להציל.';
      hook = 'כמעט לא פרסמתי את זה — לא כי אין לי מה לומר, אלא כי ידעתי שתהיה ביקורת.';
      angle = 'פחד → גבול → פעולה מדויקת.';
    }
    if (isVideo) {
      next_step = 'צלמו 25 שניות: Hook, דוגמה וסיום עם פעולה.';
      fifteen_minutes = 'צלמו שלוש גרסאות קצרות ואל תערכו עדיין.';
      outline = ['0–3: עצירה', '3–12: מה קרה', '12–20: מה הבנתם', '20–30: פעולה'];
    }
    if (isImpact || selectedMode === 'impact') {
      reflection = 'השפעה מתחילה באדם אחד ובצורך מאומת — לא בכלי.';
      next_step = 'השלימו: “אני רוצה לעזור ל___ שמתמודד/ת עם ___ באמצעות ניסוי של ___”.';
      fifteen_minutes = 'כתבו שלוש שאלות אימות וקיימו שיחה אחת לפני הצעת פתרון.';
      today = 'אמתו מה ייחשב שיפור אמיתי מבחינת האדם עצמו.';
      hook = 'טכנולוגיה לא עושה טוב מעצמה. אנשים בוחרים איזו בעיה היא תשרת.';
      angle = 'אדם → צורך → ניסוי → למידה.';
      selectedLinks = [links.starton, links.evidence, links.talk];
      evidence_notes.push('רצון טוב אינו הוכחת השפעה. תעדו גם תוצאה שלא הצליחה.');
    }
    if (isArchive) {
      reflection = 'העבר אינו מחסן. הוא חומר גלם — עם קרדיט, הקשר ותאריך.';
      next_step = 'בחרו מקור אחד מהספרייה וכתבו מה הוא מלמד אדם היום, בלי לחקות את איגור.';
      fifteen_minutes = 'פתחו את /museum/ ורשמו: מקור, רגע, עיקרון ופעולה חדשה.';
      hook = 'הפוסט נכתב בעבר, אבל השאלה שהוא פתח עדיין חיה.';
      angle = 'מקור היסטורי → משמעות עכשווית → פעולה חדשה.';
    }
    if (isTech) evidence_notes.push('כלי או תוכנית אינם שותפות רשמית; תנו קרדיט וציינו סטטוס לפי תיעוד.');
    if (/\d/.test(text)) evidence_notes.push('כל מספר ציבורי צריך מקור ותאריך observation.');

    const seven_day_path = [
      'יום 1 — מצפן: למה ולמי זה חשוב.',
      'יום 2 — אמת: עובדה, זיכרון, דעה ושאיפה.',
      `יום 3 — חומר: ${fifteen_minutes}`,
      'יום 4 — טיוטה אחת בלי ליטוש אינסופי.',
      'יום 5 — מראה מאדם אמין אחד.',
      'יום 6 — פרסום במקום אחד.',
      'יום 7 — תיעוד תגובה, תיקון והצעד הבא.',
    ];

    return {
      reflection,
      compass: { north: goal, why: isImpact ? 'להועיל באופן שניתן ללמוד ממנו.' : 'לתת לקול אמיתי צורה שמובילה לפעולה.', boundary: isImpact ? 'לא להבטיח תוצאה לפני ניסוי.' : 'לא לשנות אמת כדי להשיג תשומת לב.' },
      spiritual_anchor,
      goal,
      next_step,
      fifteen_minutes,
      today,
      this_week: 'השלימו גרסה, הראו לאדם אחד, פרסמו במקום אחד ותעדו למידה.',
      seven_day_path,
      content_seed: { hook, angle, outline },
      platform_pack: platformPack(goal, hook, angle),
      evidence_notes,
      handoffs: HANDOFF_MODULES.map(id => ({ id, status: 'user-confirmed-handoff' })),
      credits: [
        { role: 'Creator', name: 'The visitor', note: 'בעל הקול וההחלטה הסופית.' },
        { role: 'Method', name: 'Igor Vepretski / 7YA', note: 'אדם, אמת, יצירה, פעולה וראיה.' },
        { role: 'System', name: '7YA Create', note: 'מארגנת ואינה מפרסמת אוטומטית.' },
      ],
      links: selectedLinks,
      mode: 'local-coach',
      generated_at: new Date().toISOString(),
    };
  }

  function renderAnswer(data, original, mode) {
    latestPlan = { ...localCoach(original, mode), ...data, generated_at: data.generated_at || new Date().toISOString() };
    const card = node('article', 'message assistant');
    card.append(node('span', '', `7YA · BIG BROTHER · ${latestPlan.mode || 'CREATOR PATH'}`), node('p', '', latestPlan.reflection));
    const grid = node('div', 'answer-grid');
    [
      section('המצפן', latestPlan.compass?.north),
      section('למה', latestPlan.compass?.why),
      section('הגבול', latestPlan.compass?.boundary),
      section(latestPlan.spiritual_anchor?.title || 'עוגן', latestPlan.spiritual_anchor?.text, 'spiritual-anchor'),
      section('15 דקות', latestPlan.fifteen_minutes || latestPlan.next_step),
      section('היום', latestPlan.today),
      listSection('מסלול 7 ימים', latestPlan.seven_day_path, 'full'),
      section('Hook', latestPlan.content_seed?.hook),
      listSection('מבנה', latestPlan.content_seed?.outline),
      listSection('בדיקת אמת', latestPlan.evidence_notes),
    ].filter(Boolean).forEach(item => grid.append(item));

    if (latestPlan.platform_pack?.length) {
      const wrapper = node('section', 'full');
      wrapper.append(node('b', '', 'חבילת פלטפורמות'));
      const pack = node('div', 'platform-pack');
      latestPlan.platform_pack.forEach(item => {
        const article = node('article');
        article.append(node('strong', '', `${item.platform} · ${item.role || ''}`), node('p', '', item.draft || item.rule || ''));
        pack.append(article);
      });
      wrapper.append(pack);
      grid.append(wrapper);
    }
    card.append(grid);
    const linkRow = node('div', 'answer-links');
    (latestPlan.links || []).slice(0, 3).forEach(item => {
      if (!/^\/[a-z0-9/_#?-]*$/i.test(item.href || '')) return;
      const a = node('a', '', item.label || item.href);
      a.href = item.href;
      linkRow.append(a);
    });
    card.append(linkRow);
    log?.append(card);
    if (log) log.scrollTop = log.scrollHeight;
    dockActions.forEach(button => { button.disabled = false; });
    if (dockStatus) dockStatus.textContent = 'הנתיב מוכן. שום פעולה אינה מפרסמת אוטומטית.';
    window.dispatchEvent(new CustomEvent('7ya:creator-result', { detail: { plan: latestPlan } }));
  }

  function markdown() {
    if (!latestPlan) return '';
    return [
      '# 7YA Creator Path', `> ${latestPlan.reflection}`, '',
      `## מצפן\n- צפון: ${latestPlan.compass?.north || latestPlan.goal}\n- למה: ${latestPlan.compass?.why || ''}\n- גבול: ${latestPlan.compass?.boundary || ''}`, '',
      `## ${latestPlan.spiritual_anchor?.title || 'עוגן'}\n${latestPlan.spiritual_anchor?.text || ''}`, '',
      `## 15 דקות\n${latestPlan.fifteen_minutes || latestPlan.next_step}`, '',
      '## מסלול 7 ימים', ...(latestPlan.seven_day_path || []).map((item, index) => `${index + 1}. ${item}`), '',
      '## חבילת פלטפורמות', ...(latestPlan.platform_pack || []).flatMap(item => [`### ${item.platform}`, item.draft || item.rule || '', '']),
      '## בדיקת אמת', ...(latestPlan.evidence_notes || []).map(item => `- ${item}`), '',
      `Generated: ${latestPlan.generated_at}`,
    ].join('\n');
  }

  async function copy(text) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
    const area = node('textarea');
    area.value = text;
    area.style.position = 'fixed'; area.style.opacity = '0';
    document.body.append(area); area.select(); document.execCommand('copy'); area.remove();
  }

  function calendarDates() {
    const start = new Date(Date.now() + 10 * 60 * 1000); start.setSeconds(0, 0);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const f = date => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    return `${f(start)}/${f(end)}`;
  }

  async function handoff(id) {
    if (!latestPlan) return;
    const body = markdown();
    const title = `הצעד הבא שלי — ${latestPlan.goal}`.slice(0, 120);
    if (id === 'copy') return copy(body);
    if (id === 'gmail') return window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(title)}&body=${encodeURIComponent(body.slice(0,12000))}`, '_blank', 'noopener,noreferrer');
    if (id === 'calendar') return window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${calendarDates()}&details=${encodeURIComponent(latestPlan.fifteen_minutes)}`, '_blank', 'noopener,noreferrer');
    if (id === 'notion') { await copy(body); window.open('https://www.notion.so/new', '_blank', 'noopener,noreferrer'); return; }
    if (id === 'github') return window.open(`https://github.com/7guard-io/7ya.io/issues/new?title=${encodeURIComponent(title)}&body=${encodeURIComponent(body.slice(0,6000))}`, '_blank', 'noopener,noreferrer');
    if (id === 'download') {
      const url = URL.createObjectURL(new Blob([JSON.stringify(latestPlan, null, 2)], { type: 'application/json' }));
      const a = node('a'); a.href = url; a.download = `7ya-creator-path-${new Date().toISOString().slice(0,10)}.json`; document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url); return;
    }
    if (id === 'share') return navigator.share ? navigator.share({ title, text: body.slice(0,5000), url: location.href }) : copy(body);
  }

  async function askApi(messageText, selectedMode) {
    const response = await fetch('/api/guide', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: messageText, path: location.pathname, mode: 'creator', creator_mode: selectedMode, persona: 'igor-big-brother-v2' }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }

  $$('[data-prompt]').forEach(button => button.addEventListener('click', () => { input.value = button.dataset.prompt || ''; input.focus(); }));
  modeButtons.forEach(button => button.addEventListener('click', () => {
    modeButtons.forEach(item => item.classList.remove('active')); button.classList.add('active'); selectedMode = button.dataset.mode || 'clarify';
  }));
  journeyGroups.forEach(group => {
    const key = group.dataset.journeyKey;
    group.querySelectorAll('button[data-value]').forEach(button => button.addEventListener('click', () => {
      group.querySelectorAll('button').forEach(item => { item.classList.remove('selected'); item.setAttribute('aria-pressed', 'false'); });
      button.classList.add('selected'); button.setAttribute('aria-pressed', 'true'); journeySelections[key] = button.dataset.value || '';
      const count = Object.keys(journeySelections).length;
      journeyButton.disabled = count !== journeyGroups.length;
      journeyStatus.textContent = count === journeyGroups.length ? 'הנתיב מוכן. בנו טקסט פתיחה אישי.' : `נבחרו ${count} מתוך ${journeyGroups.length} תחנות.`;
    }));
  });
  journeyButton?.addEventListener('click', () => {
    input.value = `אני מגיע/ה מהמקום הבא: ${journeySelections.starting_point}. דרך הביטוי שלי: ${journeySelections.expression}. הנתיב צריך להועיל ל${journeySelections.beneficiary}. העוגן שלי: ${journeySelections.anchor}. יש לי ${journeySelections.horizon}. בנה מצפן, 15 דקות, שבעה ימים וחבילת פלטפורמות.`;
    input.focus();
  });
  dockActions.forEach(button => button.addEventListener('click', () => handoff(button.dataset.handoff).catch(error => console.warn('7YA handoff', error))));

  const requested = new URLSearchParams(location.search).get('prompt');
  const prompts = { archive: 'עזור לי לבחור מקור מהספרייה של איגור ולהפוך אותו לתוכן חדש עם קרדיט.', platforms: 'בנה מרעיון אחד חבילה לכל הפלטפורמות.', youth: 'בנה ניסוי בטוח ליצירה עם בני נוער.', evidence: 'עזור לי להפריד עובדה, זיכרון, דעה ושאיפה.' };
  if (requested && prompts[requested]) input.value = prompts[requested];

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const text = normalize(input.value);
    if (!text) return;
    message(text, 'user', 'YOU · CREATOR'); input.value = ''; input.disabled = true; send.disabled = true;
    const waiting = message('מקשיב, מוצא עוגן ובונה נתיב שאפשר לבצע…', 'assistant waiting', '7YA · LISTENING');
    try { const data = await askApi(text, selectedMode); waiting.remove(); renderAnswer(data, text, selectedMode); }
    catch (error) { console.warn('7YA local fallback', error); waiting.remove(); renderAnswer(localCoach(text, selectedMode), text, selectedMode); }
    finally { input.disabled = false; send.disabled = false; input.focus(); }
  });
})();
