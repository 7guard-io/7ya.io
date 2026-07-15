(() => {
  'use strict';

  const state = {
    mode: 'create',
    records: [],
    lastPackage: null,
  };

  const els = {
    form: document.querySelector('#companionForm'),
    input: document.querySelector('#companionInput'),
    messages: document.querySelector('#messages'),
    modeTitle: document.querySelector('#modeTitle'),
    modes: [...document.querySelectorAll('[data-mode]')],
    prompts: [...document.querySelectorAll('[data-prompt]')],
    archiveStatus: document.querySelector('#archiveStatus'),
    output: document.querySelector('#outputContent'),
    emptyOutput: document.querySelector('#emptyOutput'),
    save: document.querySelector('#saveDraft'),
    clear: document.querySelector('#clearChat'),
    count: document.querySelector('#characterCount'),
  };

  const modeCopy = {
    create: {
      title: 'CREATE · יצירת תוכן',
      opening: 'נבנה נכס קנוני אחד ואז נגזרות מותאמות. לא מעתיקים אותו טקסט לכל פלטפורמה.',
    },
    clarify: {
      title: 'CLARIFY · חידוד המסר',
      opening: 'נזהה את הליבה, הקהל, המתח, ההוכחה והפעולה — ונוריד רעש שלא משרת את הסיפור.',
    },
    build: {
      title: 'BUILD · תוכנית הגשמה',
      opening: 'נהפוך יעד רחב לצעד של היום, אבני דרך וקריטריון ברור להתקדמות.',
    },
    reflect: {
      title: 'REFLECT · בהירות פנימית',
      opening: 'נשתמש בשאלות מדויקות כדי לחזק בחירה ואחריות, בלי שפת גורו ובלי הבטחות ריקות.',
    },
    verify: {
      title: 'VERIFY · בדיקת טענה',
      opening: 'נפריד בין מקור חיצוני, פרסום עצמי, זיכרון אישי, השערה, שאיפה ומידע פרטי.',
    },
  };

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const normalize = value => String(value ?? '')
    .toLocaleLowerCase('he')
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9א-תа-яё\s-]/giu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokenize = value => normalize(value)
    .split(' ')
    .filter(token => token.length > 2)
    .slice(0, 40);

  const unique = values => [...new Set(values.filter(Boolean))];

  function addMessage(role, title, body) {
    const article = document.createElement('article');
    article.className = `message ${role}`;
    article.innerHTML = `
      <span class="avatar">${role === 'user' ? '●' : '7'}</span>
      <div><b>${escapeHtml(title)}</b><p>${escapeHtml(body)}</p></div>`;
    els.messages.append(article);
    els.messages.scrollTop = els.messages.scrollHeight;
  }

  function classifyClaim(text, sources) {
    const normalized = normalize(text);
    const privateSignals = ['מספר תעודת', 'סיסמה', 'קוד אימות', 'כתובת בית', 'מידע רפואי', 'קטין', 'ילד שלי', 'תיק פלילי'];
    if (privateSignals.some(signal => normalized.includes(normalize(signal)))) {
      return { state: 'PRIVATE', note: 'זוהה תוכן שעלול להיות פרטי או רגיש. אין לפרסם לפני בדיקה ידנית.' };
    }
    if (sources.length) {
      return { state: 'SOURCE_VISIBLE', note: 'נמצאו רשומות ציבוריות קשורות. עדיין צריך לוודא שהמקור מוכיח את הניסוח המדויק.' };
    }
    const aspirationSignals = ['אני רוצה', 'המטרה שלי', 'בעתיד', 'חלום', 'אקים', 'אהפוך', 'נבנה'];
    if (aspirationSignals.some(signal => normalized.includes(normalize(signal)))) {
      return { state: 'ASPIRATION', note: 'זהו יעד או כיוון עתידי, לא תוצאה שהושלמה.' };
    }
    return { state: 'USER_PROVIDED', note: 'החומר מבוסס כרגע על דברי המשתמש. יש לצרף מקור לפני הצגה כעובדה חיצונית.' };
  }

  function findSources(text) {
    if (!state.records.length) return [];
    const tokens = tokenize(text);
    if (!tokens.length) return [];
    return state.records
      .map(record => {
        const haystack = normalize([
          record.title,
          record.summary,
          record.platform,
          record.publisher,
          record.type,
          record.language,
          record.act,
          ...(record.themes || []),
        ].join(' '));
        const score = tokens.reduce((total, token) => total + (haystack.includes(token) ? 1 : 0), 0);
        return { record, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(item => item.record);
  }

  function firstSentence(text) {
    const clean = String(text).trim();
    const sentence = clean.split(/[.!?\n]/).find(Boolean)?.trim();
    return sentence || clean.slice(0, 180);
  }

  function audienceFrom(text) {
    const value = normalize(text);
    if (/נוער|צעירים|תלמיד|teen|youth/.test(value)) return 'נוער, הורים, מחנכים ושותפים חברתיים';
    if (/רשות|עירייה|ממשלה|מדיניות|ציבור/.test(value)) return 'ציבור, מקבלי החלטות ותקשורת';
    if (/יזם|עסק|שותף|משקיע|linkedin/.test(value)) return 'שותפים, יזמים ואנשי מקצוע';
    if (/אבא|אבהות|משפחה|הורות/.test(value)) return 'הורים, משפחות והקהילה הרחבה';
    return 'הקהל הקיים של איגור / 7YA ואנשים שמחפשים סיפור עם פעולה';
  }

  function tensionFrom(text) {
    const value = normalize(text);
    if (/אבל|למרות|מצד אחד|מצד שני/.test(value)) return 'הפער בין מה שנראה מבחוץ לבין מה שהתרחש או נדרש בפועל.';
    if (/עזב|שינוי|התחל|עברתי|מעבר/.test(value)) return 'המעבר בין זהות ישנה לבחירה חדשה והמחיר של השינוי.';
    if (/בעיה|כשל|לא עובד|קשה/.test(value)) return 'הפער בין מערכת קיימת לבין צורך אנושי שלא מקבל מענה.';
    return 'הפער בין רעיון פנימי לבין פעולה ציבורית שאפשר להבין ולבדוק.';
  }

  function buildPlatformDerivatives(core, mode) {
    const short = core.length > 120 ? `${core.slice(0, 117)}…` : core;
    if (mode === 'build') {
      return [
        'Website / private plan: יעד, שלוש אבני דרך, מדד התקדמות וסיכון מרכזי.',
        'LinkedIn: מה נבנה, למה עכשיו ומהו הצעד הראשון.',
        'Instagram Stories: יום 1 / יום 3 / יום 7 עם עדכון אמיתי, לא הצהרת ניצחון.',
      ];
    }
    if (mode === 'reflect') {
      return [
        `Journal card: “${short}” + מה בשליטתי היום?`,
        'Private voice note: שתי דקות של אמת ללא ניסוח שיווקי.',
        'Optional public post only after privacy review: תובנה אחת, לא כל הסיפור.',
      ];
    }
    if (mode === 'verify') {
      return [
        'Claim card: הניסוח המדויק של הטענה.',
        'Evidence row: מקור, תאריך, מפרסם, מה הוא מוכיח ומה לא.',
        'Public wording: גרסה מסויגת שאינה חורגת מהמקור.',
      ];
    }
    return [
      'Canonical website article: פתיחה אישית, הקשר, נקודת שינוי, מקור, פעולה.',
      'Instagram carousel — 7 שקפים: hook, מצב, מתח, רגע שינוי, הוכחה, משמעות, CTA.',
      'Reel / TikTok — 35–50 שניות: משפט פתיחה, סיפור קצר, אמת אחת, צעד לצופה.',
      'LinkedIn — הקשר מקצועי, לקח מערכתי, מקור ושאלה לדיון.',
      'Facebook — גרסה אישית ארוכה יותר עם מקום לרגש ולהקשר.',
      'X / Threads — משפט עיקרון + מקור + קישור לנכס הקנוני.',
    ];
  }

  function makePackage(text) {
    const mode = state.mode;
    const sources = findSources(text);
    const claim = classifyClaim(text, sources);
    const core = firstSentence(text);
    const audience = audienceFrom(text);
    const tension = tensionFrom(text);

    const base = {
      mode,
      storyCore: core,
      audience,
      tension,
      claim,
      sources,
      platforms: buildPlatformDerivatives(core, mode),
      visual: 'פנים או חומר מקור אמיתי במרכז; טקסט קצר; מקור נראה; בלי תמונות מלאי גנריות ובלי אפקטים שמסתירים את הסיפור.',
      cta: 'בקשו מהקהל לבצע פעולה אחת ברורה: לקרוא מקור, לשתף ניסיון, להצטרף לשיחה או לבצע צעד מעשי.',
      review: [
        'האם יש כאן פרט שלא שייך לציבור?',
        'האם הניסוח טוען יותר ממה שהמקור מוכיח?',
        'האם המסר ברור גם למי שלא מכיר את הסיפור?',
        'האם יש פעולה אמיתית בסוף, ולא רק השראה?',
      ],
      nextAction: '',
    };

    if (mode === 'clarify') {
      base.nextAction = `כתבו מחדש את הרעיון במשפט אחד: “אני רוצה ש־${audience} יבינו ש־${core} — ולכן הצעד הבא הוא ____.”`;
    } else if (mode === 'build') {
      base.nextAction = 'פתחו מסמך או משימה אחת בשם היעד, והגדירו תוצאה של 7 ימים שאפשר לצלם או למדוד.';
    } else if (mode === 'reflect') {
      base.nextAction = 'ענו עכשיו במשפט אחד: מה מתוך הדבר הזה נמצא בשליטתי ב־24 השעות הקרובות?';
    } else if (mode === 'verify') {
      base.nextAction = sources.length
        ? 'פתחו את המקור הראשון ובדקו מה הוא מוכיח במדויק, מילה במילה, לפני ניסוח ציבורי.'
        : 'הוסיפו מקור ציבורי או סמנו את הטענה במפורש כזיכרון אישי / שאיפה.';
    } else {
      base.nextAction = 'בחרו נכס קנוני אחד בלבד — מאמר, Reel או קרוסלה — וכתבו לו טיוטת פתיחה של שלושה משפטים.';
    }

    return base;
  }

  function renderPackage(pkg) {
    const sourceHtml = pkg.sources.length
      ? pkg.sources.map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} · ${escapeHtml(source.platform)} ↗</a>`).join('')
      : '<p>לא נמצא מקור ישיר בארכיון הפתיחה. אין להציג את החומר כעובדה חיצונית ללא מקור נוסף.</p>';

    els.output.innerHTML = `
      <section class="output-block">
        <small>STORY CORE</small>
        <h3>${escapeHtml(pkg.storyCore)}</h3>
        <p><b>קהל:</b> ${escapeHtml(pkg.audience)}</p>
        <p><b>המתח:</b> ${escapeHtml(pkg.tension)}</p>
      </section>
      <section class="output-block">
        <small>CLAIM STATE</small>
        <h3>${escapeHtml(pkg.claim.state)}</h3>
        <p>${escapeHtml(pkg.claim.note)}</p>
        <span class="claim-chip ${pkg.claim.state === 'SOURCE_VISIBLE' ? 'verified' : 'pending'}">${escapeHtml(pkg.claim.state)}</span>
      </section>
      <section class="output-block source-list">
        <small>ARCHIVE CONTEXT</small>
        <h3>מקורות קשורים</h3>
        ${sourceHtml}
      </section>
      <section class="output-block">
        <small>ONE STORY → MANY ASSETS</small>
        <h3>חבילת נגזרות</h3>
        <ul>${pkg.platforms.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </section>
      <section class="output-block">
        <small>VISUAL DIRECTION</small>
        <h3>כיוון חזותי</h3>
        <p>${escapeHtml(pkg.visual)}</p>
      </section>
      <section class="output-block">
        <small>REVIEW GATE</small>
        <h3>לפני פרסום</h3>
        <ul>${pkg.review.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </section>
      <section class="output-block next-action">
        <small>ONE CONCRETE NEXT ACTION</small>
        <h3>הצעד הבא</h3>
        <p>${escapeHtml(pkg.nextAction)}</p>
      </section>`;

    els.emptyOutput.hidden = true;
    els.output.hidden = false;
    els.save.disabled = false;
  }

  function summarizeForChat(pkg) {
    const sourceText = pkg.sources.length
      ? `מצאתי ${pkg.sources.length} רשומות ארכיון קשורות.`
      : 'לא מצאתי מקור ישיר בארכיון הפתיחה, ולכן סימנתי את החומר בזהירות.';
    return `${modeCopy[pkg.mode].opening}\n\nליבת הסיפור: ${pkg.storyCore}\nמצב: ${pkg.claim.state}. ${sourceText}\n\nהצעד הבא: ${pkg.nextAction}`;
  }

  async function loadArchive() {
    const paths = [1, 2, 3, 4].map(part => `/knowledge/history-song-records-${part}.json`);
    try {
      const responses = await Promise.all(paths.map(path => fetch(path, { cache: 'no-store', headers: { Accept: 'application/json' } })));
      if (responses.some(response => !response.ok)) throw new Error('archive response failed');
      const parts = await Promise.all(responses.map(response => response.json()));
      state.records = parts.flatMap(part => Array.isArray(part.records) ? part.records : []);
      els.archiveStatus.classList.add('ready');
      els.archiveStatus.querySelector('b').textContent = `${state.records.length} רשומות ארכיון מחוברות`;
    } catch (error) {
      console.error(error);
      els.archiveStatus.classList.add('error');
      els.archiveStatus.querySelector('b').textContent = 'מצב מקומי — הארכיון לא נטען';
    }
  }

  els.modes.forEach(button => {
    button.addEventListener('click', () => {
      state.mode = button.dataset.mode || 'create';
      els.modes.forEach(item => item.classList.toggle('active', item === button));
      els.modeTitle.textContent = modeCopy[state.mode].title;
      addMessage('assistant', modeCopy[state.mode].title, modeCopy[state.mode].opening);
      els.input.focus();
    });
  });

  els.prompts.forEach(button => {
    button.addEventListener('click', () => {
      els.input.value = `${button.dataset.prompt || ''}${els.input.value}`;
      els.input.dispatchEvent(new Event('input'));
      els.input.focus();
    });
  });

  els.input.addEventListener('input', () => {
    els.count.textContent = `${els.input.value.length} / 4000`;
  });

  els.form.addEventListener('submit', event => {
    event.preventDefault();
    const text = els.input.value.trim();
    if (!text) {
      els.input.focus();
      return;
    }
    addMessage('user', 'החומר שלך', text);
    const pkg = makePackage(text);
    state.lastPackage = { created_at: new Date().toISOString(), input: text, ...pkg };
    renderPackage(pkg);
    addMessage('assistant', modeCopy[state.mode].title, summarizeForChat(pkg));
    els.input.value = '';
    els.input.dispatchEvent(new Event('input'));
  });

  els.save.addEventListener('click', () => {
    if (!state.lastPackage) return;
    try {
      localStorage.setItem('7ya-creator-companion-draft', JSON.stringify(state.lastPackage));
      els.save.textContent = 'נשמר בדפדפן';
      setTimeout(() => { els.save.textContent = 'שמור מקומית'; }, 1800);
    } catch {
      els.save.textContent = 'השמירה נכשלה';
    }
  });

  els.clear.addEventListener('click', () => {
    els.messages.innerHTML = `
      <article class="message assistant">
        <span class="avatar">7</span>
        <div><b>התחלה חדשה.</b><p>כתבו חומר אמיתי. נבנה ממנו מסר, מקור וצעד מעשי.</p></div>
      </article>`;
    els.output.hidden = true;
    els.emptyOutput.hidden = false;
    els.save.disabled = true;
    state.lastPackage = null;
    els.input.value = '';
    els.input.dispatchEvent(new Event('input'));
  });

  loadArchive();
})();
