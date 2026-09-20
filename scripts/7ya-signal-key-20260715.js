(() => {
  'use strict';

  if (window.__7yaSignalKeyLoaded) return;
  window.__7yaSignalKeyLoaded = true;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rawLocale = String(document.documentElement.lang || 'en').toLowerCase();
  const locale = /^he/.test(rawLocale) ? 'he' : /^ru/.test(rawLocale) ? 'ru' : /^ar/.test(rawLocale) ? 'ar' : 'en';
  const rtl = locale === 'he' || locale === 'ar' || document.documentElement.dir === 'rtl';
  const canonicalPath = () => window.__7yaCanonicalPath ? window.__7yaCanonicalPath() : (location.pathname.replace(/^\/(?:en|ru|ar)(?=\/|$)/,'') || '/');
  const localizePath = value => window.__7yaLocalizePath ? window.__7yaLocalizePath(value) : value;
  const conversation = [];
  let busy = false;
  let companionState = null;

  const COPY = {
    he: {
      launcher: 'דברו עם איגור',
      launcherSub: 'שיחה · כיוון · פעולה',
      ariaOpen: 'פתחו שיחה עם איגור AI',
      ariaPanel: 'שיחה עם איגור AI',
      eyebrow: 'IGOR VEPRETSKI · 7YA',
      title: 'דברו עם איגור',
      hello: 'ספרו לי מה אתם מנסים להבין, לבנות, לומר או לשנות. השיחה תעזור לזקק את מה שחשוב לכם, למצוא את הקול שלכם ולהפוך אותו לצעד הבא שאפשר לבצע.',
      placeholder: 'מה עובר עליכם, ומה הייתם רוצים שיקרה מכאן?',
      send: 'שליחה',
      label: 'ההודעה שלכם',
      waiting: 'מקשיב, מחבר ומזקק את הצעד הבא…',
      noAnswer: 'לא התקבלה תשובה. נסו לנסח במשפט אחד מה חשוב לכם עכשיו.',
      fallback: 'נמשיך מכאן: מה הדבר האחד שהכי חשוב לכם להבין, לבטא או לקדם עכשיו?',
      engine: 'AI המבוסס על הקול והעבודה הציבורית של איגור · לא איגור בזמן אמת',
      disclosure: 'עשוי להיעזר בזוהר ובחכמה יהודית, ובכלים מודרניים, כשזה רלוונטי ומסומן · אל תשתפו מידע רגיש',
      prompts: ['אני תקוע — תעזור לי למצוא צעד הבא', 'יש לי רעיון — תעזור לי לבטא אותו', 'מה אני יכול ללמוד מהדרך שלך?'],
      evidencePrompts: ['איך אדע אם מה שאני מאמין בו באמת מבוסס?', 'תעזור לי להפריד בין עובדה לפרשנות', 'איך הופכים אמת מורכבת למסר ברור?'],
      startonPrompts: ['יש לי רעיון לעזור לנוער — מאיפה מתחילים?', 'איך הופכים טכנולוגיה לכלי אנושי?', 'תעזור לי לבנות ניסוי קטן שאפשר לבצע']
    },
    en: {
      launcher: 'SPEAK WITH IGOR',
      launcherSub: 'conversation · direction · action',
      ariaOpen: 'Open Speak with Igor AI',
      ariaPanel: 'Speak with Igor AI',
      eyebrow: 'IGOR VEPRETSKI · 7YA',
      title: 'Speak with Igor',
      hello: 'Tell me what you are trying to understand, build, say, or change. This conversation will help clarify what matters, strengthen your own voice, and turn it into a next move you can actually take.',
      placeholder: 'What is on your mind, and what would you like to happen next?',
      send: 'Send',
      label: 'Your message',
      waiting: 'Listening, connecting the dots, and shaping the next move…',
      noAnswer: 'No answer came back. Try saying in one sentence what matters most right now.',
      fallback: 'We can continue here: what is the one thing you most want to understand, express, or move forward right now?',
      engine: 'AI based on Igor’s public voice and work · not live Igor',
      disclosure: 'May draw on the Zohar/Jewish wisdom and modern tools when relevant and labeled · do not share sensitive information',
      prompts: ['I feel stuck — help me find the next move', 'I have an idea — help me express it', 'What can I learn from your path?'],
      evidencePrompts: ['How do I know if my belief is actually grounded?', 'Help me separate fact from interpretation', 'How do I turn a complex truth into a clear message?'],
      startonPrompts: ['I want to help youth — where do I start?', 'How can technology become a human tool?', 'Help me design one small executable experiment']
    },
    ru: {
      launcher: 'ПОГОВОРИТЬ С ИГОРЕМ',
      launcherSub: 'разговор · направление · действие',
      ariaOpen: 'Открыть разговор с Игорем AI',
      ariaPanel: 'Разговор с Игорем AI',
      eyebrow: 'IGOR VEPRETSKI · 7YA',
      title: 'Поговорить с Игорем',
      hello: 'Расскажите, что вы пытаетесь понять, создать, сказать или изменить. Этот разговор поможет прояснить главное, усилить ваш собственный голос и превратить его в следующий реальный шаг.',
      placeholder: 'Что сейчас у вас в голове и чего вы хотите добиться дальше?',
      send: 'Отправить',
      label: 'Ваше сообщение',
      waiting: 'Слушаю, связываю точки и формирую следующий шаг…',
      noAnswer: 'Ответ не пришёл. Сформулируйте одним предложением, что для вас сейчас важнее всего.',
      fallback: 'Продолжим отсюда: что одно вы больше всего хотите понять, выразить или продвинуть прямо сейчас?',
      engine: 'AI на основе публичного голоса и работы Игоря · это не Игорь в реальном времени',
      disclosure: 'Может обращаться к Зоару/еврейской мудрости и современным инструментам, когда это уместно и обозначено · не делитесь чувствительными данными',
      prompts: ['Я застрял — помоги найти следующий шаг', 'У меня есть идея — помоги выразить её', 'Чему я могу научиться у твоего пути?'],
      evidencePrompts: ['Как понять, на чём реально основано моё убеждение?', 'Помоги отделить факт от интерпретации', 'Как превратить сложную правду в ясный месседж?'],
      startonPrompts: ['Я хочу помочь подросткам — с чего начать?', 'Как сделать технологию человеческим инструментом?', 'Помоги придумать маленький выполнимый эксперимент']
    },
    ar: {
      launcher: 'تحدّث مع إيغور',
      launcherSub: 'حوار · اتجاه · فعل',
      ariaOpen: 'افتح حوارًا مع إيغور AI',
      ariaPanel: 'حوار مع إيغور AI',
      eyebrow: 'IGOR VEPRETSKI · 7YA',
      title: 'تحدّث مع إيغور',
      hello: 'أخبرني ما الذي تحاول فهمه أو بناؤه أو التعبير عنه أو تغييره. تساعدك هذه المحادثة على توضيح ما يهمك، وتقوية صوتك الخاص، وتحويله إلى خطوة تالية قابلة للتنفيذ.',
      placeholder: 'ما الذي يشغلك الآن، وما الذي تريد أن يحدث بعد ذلك؟',
      send: 'إرسال',
      label: 'رسالتك',
      waiting: 'أستمع، أربط النقاط، وأصوغ الخطوة التالية…',
      noAnswer: 'لم يصل رد. حاول أن تقول بجملة واحدة ما هو الأهم لك الآن.',
      fallback: 'نكمل من هنا: ما الشيء الواحد الذي تريد فهمه أو التعبير عنه أو دفعه إلى الأمام الآن؟',
      engine: 'AI مبني على الصوت والعمل العام لإيغور · ليس إيغور مباشرة',
      disclosure: 'قد يستعين بالزوهار/الحكمة اليهودية وبأدوات حديثة عندما يكون ذلك مناسبًا ومُشارًا إليه · لا تشارك معلومات حساسة',
      prompts: ['أنا عالق — ساعدني في إيجاد الخطوة التالية', 'لدي فكرة — ساعدني في التعبير عنها', 'ماذا يمكنني أن أتعلم من مسارك؟'],
      evidencePrompts: ['كيف أعرف أن ما أؤمن به يستند إلى أساس حقيقي؟', 'ساعدني على فصل الحقيقة عن التفسير', 'كيف أحوّل حقيقة معقدة إلى رسالة واضحة؟'],
      startonPrompts: ['أريد مساعدة الشباب — من أين أبدأ؟', 'كيف تصبح التكنولوجيا أداة إنسانية؟', 'ساعدني على تصميم تجربة صغيرة قابلة للتنفيذ']
    }
  };

  const c = COPY[locale];

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function safeInternalHref(value) {
    return typeof value === 'string' && /^\/[a-z0-9/_#?-]*$/i.test(value) ? value : null;
  }

  function routePrompts() {
    const path = canonicalPath();
    if (path.startsWith('/evidence')) return c.evidencePrompts;
    if (path.startsWith('/starton')) return c.startonPrompts;
    return c.prompts;
  }

  const root = element('section', 'ya-signal-key');
  root.dir = rtl ? 'rtl' : 'ltr';
  root.dataset.yaSignalKey = '20260920-speak-with-igor';

  const launcher = element('button', 'ya-signal-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'ya-signal-panel');
  launcher.setAttribute('aria-label', c.ariaOpen);
  const mark = element('span', 'ya-signal-mark', '7');
  const launcherCopy = element('span', 'ya-signal-launcher-copy');
  launcherCopy.append(element('b', '', c.launcher), element('small', '', c.launcherSub));
  launcher.append(mark, launcherCopy);

  const panel = element('div', 'ya-signal-panel');
  panel.id = 'ya-signal-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', c.ariaPanel);

  const header = element('header', 'ya-signal-header');
  const headingWrap = element('div');
  headingWrap.append(element('span', '', c.eyebrow), element('strong', '', c.title));
  const close = element('button', 'ya-signal-close', '×');
  close.type = 'button';
  close.setAttribute('aria-label', locale === 'he' ? 'סגירה' : locale === 'ru' ? 'Закрыть' : locale === 'ar' ? 'إغلاق' : 'Close');
  header.append(headingWrap, close);

  const messages = element('div', 'ya-signal-messages');
  messages.setAttribute('aria-live', 'polite');
  messages.append(element('div', 'ya-signal-message bot', c.hello));

  const quick = element('div', 'ya-signal-quick');

  const form = element('form', 'ya-signal-form');
  const label = element('label', '', c.label);
  label.htmlFor = 'ya-signal-input';
  const input = document.createElement('textarea');
  input.id = 'ya-signal-input';
  input.name = 'message';
  input.rows = 3;
  input.maxLength = 1600;
  input.placeholder = c.placeholder;
  const submit = element('button', '', c.send);
  submit.type = 'submit';
  form.append(label, input, submit);

  const footer = element('footer', 'ya-signal-footer');
  const provider = element('span', '', c.engine);
  const privacy = element('span', '', c.disclosure);
  footer.append(provider, privacy);

  panel.append(header, messages, quick, form, footer);
  root.append(panel, launcher);
  document.body.append(root);

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    root.classList.toggle('open', open);
    if (open) setTimeout(() => input.focus(), reduceMotion ? 0 : 80);
  }

  function addMessage(text, kind = 'bot') {
    const item = element('div', 'ya-signal-message ' + kind, text);
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function addLinks(links) {
    if (!Array.isArray(links) || !links.length) return;
    const row = element('div', 'ya-signal-links');
    links.slice(0, 3).forEach((link) => {
      const href = safeInternalHref(link && link.href);
      if (!href) return;
      const anchor = element('a', '', link.label || href);
      anchor.href = localizePath(href);
      row.append(anchor);
    });
    if (row.childElementCount) messages.append(row);
  }

  function updateQuickPrompts() {
    quick.replaceChildren();
    routePrompts().forEach((prompt) => {
      const button = element('button', '', prompt);
      button.type = 'button';
      button.dataset.prompt = prompt;
      quick.append(button);
    });
  }

  async function ask(text) {
    const message = String(text || '').trim();
    if (busy || !message) return;
    busy = true;
    input.disabled = true;
    submit.disabled = true;
    addMessage(message, 'user');
    conversation.push({ role: 'user', content: message });
    const waiting = addMessage(c.waiting, 'waiting');

    try {
      const response = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          messages: conversation.slice(-10),
          state: companionState,
          locale,
          path: canonicalPath(),
          mode: 'guide',
          experience: 'speak-with-igor'
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error((data && data.error) || ('HTTP ' + response.status));
      waiting.remove();
      if (data.state) companionState = data.state;
      const answer = data.answer || c.noAnswer;
      addMessage(answer);
      addLinks(data.links);
      conversation.push({ role: 'assistant', content: answer.slice(0, 1800) });
      while (conversation.length > 10) conversation.shift();
    } catch (error) {
      waiting.textContent = c.fallback;
      console.warn('Speak with Igor continuity fallback', error && error.message ? error.message : error);
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
  quick.addEventListener('click', event => {
    const button = event.target.closest('button[data-prompt]');
    if (button) ask(button.dataset.prompt || '');
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    ask(input.value);
  });
  window.addEventListener('7ya:creator-seed', event => {
    const seed = String((event.detail && event.detail.prompt) || '').trim();
    setOpen(true);
    input.value = seed;
    input.focus();
  });

  updateQuickPrompts();
  loadHomeUniverse();
})();