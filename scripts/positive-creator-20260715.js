(() => {
  'use strict';

  const form = document.querySelector('#creatorForm');
  const input = document.querySelector('#creatorInput');
  const log = document.querySelector('#chatLog');
  const send = form?.querySelector('.send');
  const promptButtons = [...document.querySelectorAll('[data-prompt]')];
  const modeButtons = [...document.querySelectorAll('[data-mode]')];
  let mode = 'clarify';

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const normalize = value => String(value ?? '').trim();

  const links = {
    history: { label: 'שיר ההיסטוריה', href: '/history/' },
    evidence: { label: 'בדיקת ראיות', href: '/evidence/' },
    influence: { label: 'מפת ההשפעה', href: '/influence/' },
    talk: { label: 'שיחה אנושית', href: '/talk/' },
    starton: { label: 'StartOn', href: '/starton/' },
  };

  function appendUser(text) {
    if (!log) return;
    const article = document.createElement('article');
    article.className = 'message user';
    article.innerHTML = `<span>YOU</span><p>${escapeHtml(text)}</p>`;
    log.append(article);
    log.scrollTop = log.scrollHeight;
  }

  function appendWaiting() {
    if (!log) return null;
    const article = document.createElement('article');
    article.className = 'message assistant';
    article.innerHTML = '<span>7YA CREATE</span><p>מזקק כוונה, סיפור וצעד מעשי…</p>';
    log.append(article);
    log.scrollTop = log.scrollHeight;
    return article;
  }

  function renderAnswer(data) {
    if (!log) return;
    const article = document.createElement('article');
    article.className = 'message assistant';
    const outline = Array.isArray(data?.content_seed?.outline)
      ? `<ul>${data.content_seed.outline.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : '';
    const evidence = Array.isArray(data?.evidence_notes) && data.evidence_notes.length
      ? `<section><b>בדיקת אמת</b><ul>${data.evidence_notes.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>`
      : '';
    const answerLinks = Array.isArray(data?.links)
      ? `<div class="answer-links">${data.links.slice(0, 3).map(item => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join('')}</div>`
      : '';
    const seed = data?.content_seed && (data.content_seed.hook || data.content_seed.angle || outline)
      ? `<section><b>זרע לתוכן</b>${data.content_seed.hook ? `<p><strong>Hook:</strong> ${escapeHtml(data.content_seed.hook)}</p>` : ''}${data.content_seed.angle ? `<p><strong>זווית:</strong> ${escapeHtml(data.content_seed.angle)}</p>` : ''}${outline}</section>`
      : '';

    article.innerHTML = `
      <span>7YA CREATE · ${escapeHtml(data.mode || 'local-coach')}</span>
      <p>${escapeHtml(data.reflection || 'הכוונה ברורה. עכשיו הופכים אותה לצעד.')}</p>
      <div class="answer-grid">
        <section><b>המטרה</b><p>${escapeHtml(data.goal || 'לזקק מסר אחד שניתן ליצור ולפרסם.')}</p></section>
        <section><b>עכשיו</b><p>${escapeHtml(data.next_step || 'כתבו משפט אחד שמסביר מה אתם רוצים שהקהל יבין או יעשה.')}</p></section>
        ${data.today ? `<section><b>היום</b><p>${escapeHtml(data.today)}</p></section>` : ''}
        ${data.this_week ? `<section><b>השבוע</b><p>${escapeHtml(data.this_week)}</p></section>` : ''}
        ${seed}
        ${evidence}
      </div>
      ${answerLinks}`;
    log.append(article);
    log.scrollTop = log.scrollHeight;
  }

  function inferGoal(text) {
    const first = text.split(/[.!?\n]/).find(Boolean)?.trim();
    return first || 'להפוך כוונה לתוכן ברור ולצעד מעשי.';
  }

  function localCoach(message, selectedMode) {
    const text = normalize(message);
    const lower = text.toLowerCase();
    const isVideo = /וידאו|סרטון|reel|tiktok|ריל/.test(lower);
    const isPost = /פוסט|מאמר|טקסט|linkedin|facebook/.test(lower);
    const isBlocked = /מפחד|פחד|חושש|תקוע|מחסום|ביקורת|לא יודע|לא מצליח/.test(lower);
    const isDistribution = /הפצה|פלטפורמ|אינסטגרם|טיקטוק|פייסבוק|לינקדאין|telegram|newsletter/.test(lower);
    const isPersonal = /סיפור אישי|עברתי|ילדות|משפחה|חוויה|שינוי/.test(lower);
    const hasNumbers = /\d/.test(text);

    let reflection = 'יש כאן כוונה אמיתית, אבל היא עדיין רחבה. נצמצם אותה לתוצאה אחת שאפשר ליצור.';
    let nextStep = 'כתבו משפט אחד: “אחרי שהתוכן הזה יסתיים, אני רוצה שהאדם שמולו יחשוב, ירגיש או יעשה ___”.';
    let today = 'הקליטו לעצמכם דקה קולית חופשית. אל תערכו. הוציאו ממנה את המשפט החזק ביותר.';
    let thisWeek = 'פרסמו גרסה אחת, אספו תגובה איכותית אחת ושפרו רק את הפתיחה.';
    let hook = 'יש רגע שבו מפסיקים לחכות לאישור ומתחילים לבנות.';
    let angle = 'סיפור אישי קצר שמוביל לבחירה מעשית בהווה.';
    let outline = ['פתיחה חדה', 'רגע קונקרטי', 'מה השתנה', 'מה הקהל יכול לעשות עכשיו'];
    const evidenceNotes = [];
    const selectedLinks = [links.influence, links.evidence, links.talk];

    if (isBlocked) {
      reflection = 'הבעיה אינה שאין לכם מה לומר; הבעיה היא שהביקורת קיבלה זכות וטו לפני שהיצירה בכלל נולדה.';
      nextStep = 'כתבו גרסה פרטית של 120 מילים שאסור לפרסם. המטרה היא להוציא אמת, לא להרשים.';
      today = 'בחרו רק משפט אחד מהגרסה הפרטית והפכו אותו לפתיחה ניטרלית ובטוחה.';
      thisWeek = 'פרסמו ניסוי קטן לקהל מוגבל או בפורמט קצר, בלי להעמיס עליו את כל הסיפור.';
      hook = 'כמעט לא פרסמתי את זה, לא כי אין לי מה לומר — אלא כי ידעתי שתהיה ביקורת.';
      angle = 'להפוך פחד מהתגובה לבחירה מודעת בגבולות ובדיוק.';
    }

    if (isVideo) {
      nextStep = 'צלמו עכשיו 20 שניות: משפט פתיחה אחד, דוגמה אחת וסיום עם פעולה אחת.';
      hook = 'אם הייתי צריך להתחיל מחדש היום, זה הדבר הראשון שלא הייתי עושה.';
      angle = 'וידאו קצר עם קונפליקט מיידי, סיפור בגוף ראשון ולקח שימושי.';
      outline = ['0–3 שניות: משפט עוצר', '3–12: מה קרה', '12–18: מה הבנתם', '18–25: פעולה לקהל'];
    } else if (isPost) {
      nextStep = 'פתחו את הפוסט ברגע אחד, לא בהסבר. תנו לקורא לראות סצנה לפני שאתם מסבירים אותה.';
      hook = 'הטלפון הגיע בדיוק ברגע שבו חשבתי שהכול סוף־סוף הסתדר.';
      angle = 'פוסט סצנה → מתח → בחירה → מסקנה.';
    }

    if (isDistribution) {
      reflection = 'אותו רעיון לא צריך להעתיק בין פלטפורמות; הוא צריך להחליף צורה בלי לאבד אמת.';
      nextStep = 'בחרו מקור אחד מאושר והגדירו משפט ליבה שאסור לשנות בין הפלטפורמות.';
      today = 'הכינו ארבע נגזרות: Hook ל־TikTok, Caption ל־Instagram, פוסט עומק ל־Facebook ופסקת תובנה ל־LinkedIn.';
      thisWeek = 'פרסמו בסדר מדורג, תעדו תאריך ותוצאה, ואל תשנו את העובדות כדי “לעבוד טוב יותר”.';
      angle = 'מקור אחד, ארבעה קצבים, משמעות אחת.';
      selectedLinks.splice(0, selectedLinks.length, links.history, links.influence, links.evidence);
    }

    if (isPersonal) {
      evidenceNotes.push('הפרידו בין זיכרון אישי לבין עובדה שניתנת לאימות. זיכרון יכול להיות אמיתי גם בלי להציגו כראיה חיצונית.');
      evidenceNotes.push('אל תחשפו פרטים מזהים של ילדים, בני משפחה או אנשים שלא נתנו הסכמה.');
    }
    if (hasNumbers) evidenceNotes.push('כל מספר ציבורי צריך מקור ותאריך observation. אין להציג snapshot כמספר נצחי.');
    if (/שותף|מיקרוסופט|ממשלה|עירייה|תפקיד|מועמד|רשמי/.test(lower)) evidenceNotes.push('בדקו אם מדובר בשותפות, חברות בתוכנית, תמיכה, פגישה או כוונה. אלה אינם אותו דבר.');

    if (selectedMode === 'create') {
      reflection = isBlocked ? reflection : 'יש מספיק חומר כדי ליצור. עכשיו מפסיקים להסביר את הרעיון ומתחילים לבנות את החוויה.';
    }
    if (selectedMode === 'momentum') {
      reflection = 'המטרה כרגע אינה יצירת המופת. המטרה היא רצף שמייצר ביטחון, חומר ולמידה.';
      nextStep = 'הגדירו משימה של 15 דקות בלבד וסיימו אותה לפני שאתם משפרים.';
      today = 'צרו טיוטה אחת ושמרו אותה בשם ברור עם תאריך.';
      thisWeek = 'השלימו שלושה ניסויים קטנים במקום פרויקט אחד ענק שלא יוצא לאור.';
    }

    return {
      reflection,
      goal: inferGoal(text),
      next_step: nextStep,
      today,
      this_week: thisWeek,
      content_seed: { hook, angle, outline },
      evidence_notes: evidenceNotes,
      links: selectedLinks,
      mode: 'local-coach',
    };
  }

  async function askApi(message, selectedMode) {
    const response = await fetch('/api/guide', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, path: location.pathname, mode: 'creator', creator_mode: selectedMode }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data || typeof data !== 'object') throw new Error('Invalid response');
    return data;
  }

  promptButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (!input) return;
      input.value = button.dataset.prompt || '';
      input.focus();
    });
  });

  modeButtons.forEach(button => {
    button.addEventListener('click', () => {
      modeButtons.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      mode = button.dataset.mode || 'clarify';
    });
  });

  form?.addEventListener('submit', async event => {
    event.preventDefault();
    const message = normalize(input?.value);
    if (!message || !input || !send) return;

    appendUser(message);
    input.value = '';
    input.disabled = true;
    send.disabled = true;
    const waiting = appendWaiting();

    try {
      const data = await askApi(message, mode);
      waiting?.remove();
      renderAnswer(data);
    } catch (error) {
      console.warn('7YA Create local fallback', error);
      waiting?.remove();
      renderAnswer(localCoach(message, mode));
    } finally {
      input.disabled = false;
      send.disabled = false;
      input.focus();
    }
  });
})();