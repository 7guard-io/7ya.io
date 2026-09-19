(() => {
  'use strict';

  if (window.__7yaSignalKeyLoaded) return;
  window.__7yaSignalKeyLoaded = true;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rtl = document.documentElement.dir === 'rtl' || /^he|^ar|^fa/.test(document.documentElement.lang || '');
  const canonicalPath = () => window.__7yaCanonicalPath ? window.__7yaCanonicalPath() : (location.pathname.replace(/^\/(?:en|ru|ar)(?=\/|$)/,'') || '/');
  const localizePath = value => window.__7yaLocalizePath ? window.__7yaLocalizePath(value) : value;
  const conversation = [];
  let activeMode = 'guide';
  let busy = false;
  let latestPlan = '';
  let companionState = null;

  const MODES = {
    guide: {
      label: rtl ? 'הבנה' : 'Understand',
      eyebrow: 'EVIDENCE / CONTEXT',
      title: rtl ? 'להבין את הסיפור והמערכת' : 'Understand the story and system',
      apiMode: 'guide',
      creatorMode: undefined,
      placeholder: rtl ? 'שאלו על איגור, StartOn, 7YA או מקור מסוים…' : 'Ask about Igor, StartOn, 7YA, or a source…',
    },
    create: {
      label: rtl ? 'יצירה' : 'Create',
      eyebrow: 'VOICE / CONTENT',
      title: rtl ? 'להפוך רעיון לתוכן אמיתי' : 'Turn an idea into real content',
      apiMode: 'creator',
      creatorMode: 'create',
      placeholder: rtl ? 'מה אתם רוצים לומר, ליצור או לפרסם?' : 'What do you want to say, create, or publish?',
    },
    fulfill: {
      label: rtl ? 'הגשמה' : 'Fulfil',
      eyebrow: 'CLARITY / MOMENTUM',
      title: rtl ? 'להפוך כוונה למסלול שאפשר לבצע' : 'Turn intention into an executable path',
      apiMode: 'creator',
      creatorMode: 'momentum',
      placeholder: rtl ? 'מה חשוב לכם לקדם, ומה עוצר אתכם כרגע?' : 'What matters now, and what is blocking you?',
    },
    impact: {
      label: rtl ? 'השפעה' : 'Impact',
      eyebrow: 'PERSON / NEED / ACTION',
      title: rtl ? 'להפוך רצון טוב לניסוי בטוח ומדיד' : 'Turn good intent into a safe measurable experiment',
      apiMode: 'creator',
      creatorMode: 'impact',
      placeholder: rtl ? 'למי תרצו לעזור, ומה הצורך שאתם רואים?' : 'Who do you want to help, and what need do you see?',
    },
  };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function safeInternalHref(value) {
    return typeof value === 'string' && /^\/[a-z0-9/_#?-]*$/i.test(value) ? value : null;
  }

  function routePrompts(mode) {
    const path = canonicalPath();
    if (mode === 'create') {
      if (path.startsWith('/museum') || path.startsWith('/history')) {
        return rtl
          ? ['הפוך מקור אחד לפוסט חדש', 'בנה קרוסלה מאשכול תוכן', 'מצא קו חוזר בסיפור']
          : ['Turn one source into a post', 'Build a carousel from a cluster', 'Find the recurring story line'];
      }
      if (path.startsWith('/evidence')) {
        return rtl
          ? ['נסח טענה זהירה ומדויקת', 'הפוך מקור להסבר פשוט', 'בנה פוסט עם מקור ותאריך']
          : ['Write a careful claim', 'Turn a source into a clear explanation', 'Build a sourced post'];
      }
      return rtl
        ? ['זקק לי רעיון לפוסט', 'בנה קונספט לווידאו קצר', 'הפוך סיפור אישי לתוכן בטוח']
        : ['Clarify a post idea', 'Build a short-video concept', 'Turn a personal story into safe content'];
    }

    if (mode === 'fulfill') {
      return rtl
        ? ['בחר לי צעד ראשון של 15 דקות', 'בנה מסלול לשבוע הקרוב', 'עזור לי לצאת מתקיעות בלי לחץ']
        : ['Choose a 15-minute first step', 'Build a plan for this week', 'Help me move without pressure'];
    }

    if (mode === 'impact') {
      if (path.startsWith('/starton')) {
        return rtl
          ? ['בנה ניסוי בטוח לנוער בשבעה ימים', 'נסח הצעה לשותף בלי ניפוח', 'בחר מדד אנושי אחד']
          : ['Build a safe seven-day youth experiment', 'Draft a precise partner proposal', 'Choose one human signal'];
      }
      return rtl
        ? ['בחר אדם, צורך וניסוי קטן', 'הפוך כלי טכנולוגי לעשיית טוב', 'בנה פעולה קהילתית עם גבולות פרטיות']
        : ['Choose one person, need, and experiment', 'Turn a tool into public good', 'Design a privacy-safe community action'];
    }

    if (path.startsWith('/evidence')) {
      return rtl
        ? ['איך בודקים טענה לפני פרסום?', 'מה ההבדל בין מקור להוכחה?', 'איזה ניסוח דורש הסתייגות?']
        : ['How do I verify a claim?', 'What is source vs proof?', 'Which wording needs caution?'];
    }
    if (path.startsWith('/response-ai')) {
      return rtl
        ? ['מהו הד ציבורי אמיתי?', 'איך מפרידים צפייה מהשפעה?', 'הצג מסלולי תגובה מרכזיים']
        : ['What is real public response?', 'Separate views from impact', 'Show key response paths'];
    }
    if (path.startsWith('/starton')) {
      return rtl
        ? ['מהו StartOn?', 'מה כבר מתועד?', 'איך מציעים שותפות?']
        : ['What is StartOn?', 'What is documented?', 'How do I propose a partnership?'];
    }
    return rtl
      ? ['מי זה איגור?', 'מהי מערכת 7YA?', 'איפה נמצאים כל הפוסטים והמקורות?']
      : ['Who is Igor?', 'What is 7YA?', 'Where are all posts and sources?'];
  }

  const root = element('section', 'ya-signal-key');
  root.dir = rtl ? 'rtl' : 'ltr';
  root.dataset.yaSignalKey = '20260716';

  const launcher = element('button', 'ya-signal-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'ya-signal-panel');
  launcher.setAttribute('aria-label', rtl ? 'פתחו את מלווה 7YA' : 'Open the 7YA companion');
  const mark = element('span', 'ya-signal-mark', '7');
  const launcherCopy = element('span', 'ya-signal-launcher-copy');
  launcherCopy.append(element('b', '', '7YA COMPANION'), element('small', '', rtl ? 'יצירה · הגשמה · השפעה' : 'Create · Fulfil · Impact'));
  launcher.append(mark, launcherCopy);

  const panel = element('div', 'ya-signal-panel');
  panel.id = 'ya-signal-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', rtl ? 'מלווה 7YA ליצירה והגשמה' : '7YA creator and fulfilment companion');

  const header = element('header', 'ya-signal-header');
  const headingWrap = element('div');
  const eyebrow = element('span', '', MODES.guide.eyebrow);
  const heading = element('strong', '', MODES.guide.title);
  headingWrap.append(eyebrow, heading);
  const close = element('button', 'ya-signal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', rtl ? 'סגירה' : 'Close');
  header.append(headingWrap, close);

  const modeRow = element('div', 'ya-signal-modes');
  Object.entries(MODES).forEach(([id, config]) => {
    const button = element('button', id === 'guide' ? 'active' : '', config.label);
    button.type = 'button';
    button.dataset.mode = id;
    button.setAttribute('aria-pressed', String(id === 'guide'));
    modeRow.append(button);
  });

  const messages = element('div', 'ya-signal-messages');
  messages.setAttribute('aria-live', 'polite');
  messages.append(element('div', 'ya-signal-message bot', rtl
    ? 'כאן לא רק שואלים. בוחרים כיוון, הופכים אותו לתוצר אמיתי ומסיימים עם צעד שאפשר לבצע. אפשר ללמוד מהדרך של איגור ומהמקורות הציבוריים, ואז לבנות את הדרך שלכם — בלי להמציא הישגים ובלי ללחוץ עליכם.'
    : 'This is not only a Q&A. Choose a direction, turn it into something real, and finish with a step you can execute. Learn from Igor’s public journey and sources, then build your own path without invented claims or pressure.'));

  const quick = element('div', 'ya-signal-quick');

  const form = element('form', 'ya-signal-form');
  const label = element('label', '', rtl ? 'ההודעה שלכם' : 'Your message');
  label.htmlFor = 'ya-signal-input';
  const input = document.createElement('textarea');
  input.id = 'ya-signal-input';
  input.name = 'message';
  input.rows = 3;
  input.maxLength = 1600;
  input.placeholder = MODES.guide.placeholder;
  const submit = element('button', '', rtl ? 'לבנות' : 'Build');
  submit.type = 'submit';
  form.append(label, input, submit);

  const actionRow = element('div', 'ya-signal-actions');
  const copyButton = element('button', 'ya-signal-copy', rtl ? 'העתקת התוכנית' : 'Copy plan');
  copyButton.type = 'button';
  copyButton.hidden = true;
  const studioLink = element('a', 'ya-signal-studio', rtl ? 'לסטודיו המלא /create/' : 'Open full studio /create/');
  studioLink.href = localizePath('/create/');
  actionRow.append(copyButton, studioLink);

  const footer = element('footer', 'ya-signal-footer');
  const provider = element('span', '', rtl ? 'מנוע 7YA מוכן' : '7YA engine ready');
  const privacy = element('span', '', rtl ? 'לא נשמר בדפדפן · לא להזין מידע רגיש' : 'Not saved in browser · no sensitive data');
  footer.append(provider, privacy);

  panel.append(header, modeRow, messages, quick, form, actionRow, footer);
  root.append(panel, launcher);
  document.body.append(root);

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    root.classList.toggle('open', open);
    if (open) setTimeout(() => input.focus(), reduceMotion ? 0 : 80);
  }

  function addMessage(text, kind = 'bot') {
    const item = element('div', `ya-signal-message ${kind}`, text);
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function addLinks(links) {
    if (!Array.isArray(links) || !links.length) return;
    const row = element('div', 'ya-signal-links');
    links.slice(0, 3).forEach((link) => {
      const href = safeInternalHref(link?.href);
      if (!href) return;
      const anchor = element('a', '', link.label || href);
      anchor.href = localizePath(href);
      row.append(anchor);
    });
    if (row.childElementCount) messages.append(row);
  }

  function section(title, body) {
    if (!body) return null;
    const block = element('section', 'ya-signal-result-section');
    block.append(element('b', '', title), element('p', '', body));
    return block;
  }

  function listSection(title, items) {
    if (!Array.isArray(items) || !items.length) return null;
    const block = element('section', 'ya-signal-result-section');
    block.append(element('b', '', title));
    const list = document.createElement('ol');
    items.slice(0, 6).forEach(item => list.append(element('li', '', item)));
    block.append(list);
    return block;
  }

  function formatPlan(data) {
    const lines = [
      data.reflection,
      data.goal && `${rtl ? 'מטרה' : 'Goal'}: ${data.goal}`,
      data.next_step && `${rtl ? 'הצעד הבא' : 'Next step'}: ${data.next_step}`,
      data.today && `${rtl ? 'היום' : 'Today'}: ${data.today}`,
      data.this_week && `${rtl ? 'השבוע' : 'This week'}: ${data.this_week}`,
      data.content_seed?.hook && `${rtl ? 'פתיחה' : 'Hook'}: ${data.content_seed.hook}`,
      data.content_seed?.angle && `${rtl ? 'זווית' : 'Angle'}: ${data.content_seed.angle}`,
      ...(Array.isArray(data.content_seed?.outline) ? data.content_seed.outline.map((item, index) => `${index + 1}. ${item}`) : []),
      ...(Array.isArray(data.evidence_notes) ? data.evidence_notes.map(item => `${rtl ? 'בדיקת אמת' : 'Truth check'}: ${item}`) : []),
    ].filter(Boolean);
    return lines.join('\n\n');
  }

  function addCreatorResult(data) {
    const card = element('article', 'ya-signal-result-card');
    card.append(element('span', 'ya-signal-result-label', `7YA · ${data.mode || 'CREATOR COMPANION'}`));
    if (data.reflection) card.append(element('p', 'ya-signal-reflection', data.reflection));
    [
      section(rtl ? 'המטרה' : 'Goal', data.goal),
      section(rtl ? 'הצעד הבא' : 'Next step', data.next_step),
      section(rtl ? 'היום' : 'Today', data.today),
      section(rtl ? 'השבוע' : 'This week', data.this_week),
      section(rtl ? 'פתיחה' : 'Hook', data.content_seed?.hook),
      section(rtl ? 'זווית' : 'Angle', data.content_seed?.angle),
      listSection(rtl ? 'מבנה' : 'Outline', data.content_seed?.outline),
      listSection(rtl ? 'בדיקת אמת וגבולות' : 'Truth and boundaries', data.evidence_notes),
    ].filter(Boolean).forEach(block => card.append(block));
    messages.append(card);
    addLinks(data.links);
    latestPlan = formatPlan(data);
    copyButton.hidden = !latestPlan;
    messages.scrollTop = messages.scrollHeight;
  }

  function updateQuickPrompts() {
    quick.replaceChildren();
    routePrompts(activeMode).forEach((prompt) => {
      const button = element('button', '', prompt);
      button.type = 'button';
      button.dataset.prompt = prompt;
      quick.append(button);
    });
  }

  function setMode(nextMode) {
    activeMode = MODES[nextMode] ? nextMode : 'guide';
    const config = MODES[activeMode];
    eyebrow.textContent = config.eyebrow;
    heading.textContent = config.title;
    input.placeholder = config.placeholder;
    modeRow.querySelectorAll('button[data-mode]').forEach(button => {
      const active = button.dataset.mode === activeMode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateQuickPrompts();
  }

  async function ask(text) {
    const message = String(text || '').trim();
    if (busy || !message) return;
    busy = true;
    input.disabled = true;
    submit.disabled = true;
    addMessage(message, 'user');
    conversation.push({ role: 'user', content: message });
    const waiting = addMessage(rtl ? 'מקשיב, מזקק ובונה צעד שאפשר לבצע…' : 'Listening, clarifying, and building an actionable step…', 'waiting');
    const config = MODES[activeMode];

    try {
      const response = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          messages: conversation.slice(-8),
          state: companionState,
          locale: String(document.documentElement.lang || (rtl ? 'he' : 'en')).slice(0, 2),
          path: canonicalPath(),
          mode: config.apiMode,
          creator_mode: config.creatorMode,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
      waiting.remove();
      if (data.state) companionState = data.state;
      if (config.apiMode === 'creator') {
        addCreatorResult(data);
        conversation.push({ role: 'assistant', content: formatPlan(data).slice(0, 1200) });
      } else {
        const answer = data.answer || (rtl ? 'לא התקבלה תשובה.' : 'No answer received.');
        addMessage(answer);
        addLinks(data.links);
        conversation.push({ role: 'assistant', content: answer.slice(0, 1200) });
      }
      while (conversation.length > 8) conversation.shift();
      provider.textContent = rtl ? 'מנוע 7YA פעיל' : '7YA engine active';
    } catch (error) {
      const fallbackByMode = {
        guide: rtl ? 'נמשיך כאן. כתבו במשפט אחד מה אתם רוצים להבין או לשנות, ואני אכוון אתכם למקור או לצעד הבא.' : 'We stay here. Write in one sentence what you want to understand or change, and I will point you to the next source or move.',
        create: rtl ? 'מתחילים ליצור עכשיו: הגדירו תוצאה אחת, למי היא מיועדת, ומה הגרסה הקטנה שאפשר לסיים היום.' : 'Start creating now: define one outcome, who it is for, and the smallest version you can finish today.',
        fulfill: rtl ? 'מגדירים יעד אחד לשבוע ואז צעד של 15 דקות שאפשר לבצע עכשיו.' : 'Choose one weekly outcome, then one 15-minute move you can do now.',
        impact: rtl ? 'בוחרים אדם או קהילה אחת, צורך אחד וניסוי קטן עם מדד אנושי אחד.' : 'Choose one person or community, one need, and one small experiment with one human signal.',
      };
      waiting.textContent = fallbackByMode[activeMode] || fallbackByMode.guide;
      provider.textContent = rtl ? 'מנוע 7YA פעיל' : '7YA engine active';
      console.warn('7YA Signal Key continuity fallback', error?.message || error);
    } finally {
      busy = false;
      input.disabled = false;
      submit.disabled = false;
      input.value = '';
      input.focus();
    }
  }

  function loadHomeUniverse() {
    if (canonicalPath() !== '/') return;
    if (!document.querySelector('link[data-home-universe]')) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = '/styles/home-public-universe-20260716.css';
      style.dataset.homeUniverse = '20260716';
      document.head.append(style);
    }
    if (!document.querySelector('script[data-home-universe]')) {
      const script = document.createElement('script');
      script.src = '/scripts/home-public-universe-20260716.js';
      script.defer = true;
      script.dataset.homeUniverse = '20260716';
      document.body.append(script);
    }
  }

  launcher.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });
  modeRow.addEventListener('click', event => {
    const button = event.target.closest('button[data-mode]');
    if (button) setMode(button.dataset.mode);
  });
  quick.addEventListener('click', event => {
    const button = event.target.closest('button[data-prompt]');
    if (button) ask(button.dataset.prompt || '');
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    ask(input.value);
  });
  copyButton.addEventListener('click', async () => {
    if (!latestPlan) return;
    try {
      await navigator.clipboard.writeText(latestPlan);
      copyButton.textContent = rtl ? 'הועתק ✓' : 'Copied ✓';
      setTimeout(() => { copyButton.textContent = rtl ? 'העתקת התוכנית' : 'Copy plan'; }, 1400);
    } catch {
      copyButton.textContent = rtl ? 'העתקה לא זמינה' : 'Copy unavailable';
    }
  });
  window.addEventListener('7ya:creator-seed', event => {
    const seed = String(event.detail?.prompt || '').trim();
    setMode('create');
    setOpen(true);
    input.value = seed;
    input.focus();
  });

  setMode('guide');
  loadHomeUniverse();
})();