(() => {
  if (window.__7yaSignalKeyLoaded) return;
  window.__7yaSignalKeyLoaded = true;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rtl = document.documentElement.dir === 'rtl' || /^he|^ar|^fa/.test(document.documentElement.lang || '');
  const root = document.createElement('section');
  root.className = 'ya-signal-key';
  root.dir = rtl ? 'rtl' : 'ltr';
  root.setAttribute('data-7ya-signal-key', '20260715');

  const launcher = document.createElement('button');
  launcher.type = 'button';
  launcher.className = 'ya-signal-launcher';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'ya-signal-panel');
  launcher.setAttribute('aria-label', rtl ? 'פתחו את מדריך 7YA' : 'Open the 7YA guide');

  const mark = document.createElement('span');
  mark.className = 'ya-signal-mark';
  mark.textContent = '7';
  const launcherCopy = document.createElement('span');
  launcherCopy.className = 'ya-signal-launcher-copy';
  const launcherTitle = document.createElement('b');
  launcherTitle.textContent = '7YA AI';
  const launcherStatus = document.createElement('small');
  launcherStatus.textContent = rtl ? 'מדריך חי' : 'Live guide';
  launcherCopy.append(launcherTitle, launcherStatus);
  launcher.append(mark, launcherCopy);

  const panel = document.createElement('div');
  panel.id = 'ya-signal-panel';
  panel.className = 'ya-signal-panel';
  panel.hidden = true;
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'false');
  panel.setAttribute('aria-label', rtl ? 'מדריך 7YA' : '7YA guide');

  const header = document.createElement('header');
  header.className = 'ya-signal-header';
  const headingWrap = document.createElement('div');
  const eyebrow = document.createElement('span');
  eyebrow.textContent = 'SIGNAL KEY / EVIDENCE FIRST';
  const heading = document.createElement('strong');
  heading.textContent = rtl ? 'מה תרצו להבין או ליצור?' : 'What do you want to understand or create?';
  headingWrap.append(eyebrow, heading);
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'ya-signal-close';
  close.setAttribute('aria-label', rtl ? 'סגירה' : 'Close');
  close.textContent = '×';
  header.append(headingWrap, close);

  const modeRow = document.createElement('div');
  modeRow.className = 'ya-signal-modes';
  const guideButton = document.createElement('button');
  guideButton.type = 'button';
  guideButton.dataset.mode = 'guide';
  guideButton.className = 'active';
  guideButton.textContent = rtl ? 'הבנת המערכת' : 'Understand';
  const creatorButton = document.createElement('button');
  creatorButton.type = 'button';
  creatorButton.dataset.mode = 'creator';
  creatorButton.textContent = rtl ? 'יצירה והגשמה' : 'Create';
  modeRow.append(guideButton, creatorButton);

  const messages = document.createElement('div');
  messages.className = 'ya-signal-messages';
  messages.setAttribute('aria-live', 'polite');
  const welcome = document.createElement('div');
  welcome.className = 'ya-signal-message bot';
  welcome.textContent = rtl
    ? 'אני מדריך ציבורי מבוסס־ראיות. אפשר לשאול על איגור, StartOn, 7YA, תוכן, השפעה או הצעד הבא שלכם.'
    : 'I am an evidence-aware public guide. Ask about Igor, StartOn, 7YA, content, impact, or your next step.';
  messages.append(welcome);

  const quick = document.createElement('div');
  quick.className = 'ya-signal-quick';
  const prompts = location.pathname.startsWith('/starton')
    ? ['מהו StartOn?', 'איך מציעים שותפות?', 'אילו טענות מאומתות?']
    : location.pathname.startsWith('/evidence')
      ? ['איך עובד אימות?', 'מה ההבדל בין מקור לטענה?', 'הצג מסלולים מרכזיים']
      : ['מי זה איגור?', 'מהי 7YA?', 'עזור לי להפוך רעיון לצעד'];
  prompts.forEach((prompt) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = prompt;
    button.dataset.prompt = prompt;
    quick.append(button);
  });

  const form = document.createElement('form');
  form.className = 'ya-signal-form';
  const label = document.createElement('label');
  label.htmlFor = 'ya-signal-input';
  label.textContent = rtl ? 'השאלה שלכם' : 'Your question';
  const input = document.createElement('textarea');
  input.id = 'ya-signal-input';
  input.name = 'message';
  input.rows = 2;
  input.maxLength = 1600;
  input.placeholder = rtl ? 'כתבו כאן — בלי מידע פרטי או סודות…' : 'Write here — no private information or secrets…';
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.textContent = rtl ? 'שליחה' : 'Send';
  form.append(label, input, submit);

  const footer = document.createElement('footer');
  footer.className = 'ya-signal-footer';
  const provider = document.createElement('span');
  provider.textContent = rtl ? 'מצב בטוח מקומי' : 'Safe local mode';
  const privacy = document.createElement('span');
  privacy.textContent = rtl ? 'לא להזין מידע רגיש' : 'Do not enter sensitive data';
  footer.append(provider, privacy);

  panel.append(header, modeRow, messages, quick, form, footer);
  root.append(panel, launcher);
  document.body.append(root);

  let mode = 'guide';
  let busy = false;

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    root.classList.toggle('open', open);
    if (open) setTimeout(() => input.focus(), reduceMotion ? 0 : 80);
  }

  function addMessage(text, kind = 'bot') {
    const item = document.createElement('div');
    item.className = `ya-signal-message ${kind}`;
    item.textContent = text;
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
    return item;
  }

  function addLinks(links) {
    if (!Array.isArray(links) || !links.length) return;
    const row = document.createElement('div');
    row.className = 'ya-signal-links';
    links.slice(0, 3).forEach((link) => {
      if (!link || typeof link.href !== 'string' || !link.href.startsWith('/')) return;
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.label || link.href;
      row.append(anchor);
    });
    if (row.childElementCount) messages.append(row);
  }

  function creatorSummary(data) {
    const lines = [data.reflection, data.next_step && `${rtl ? 'הצעד הבא' : 'Next'}: ${data.next_step}`, data.today && `${rtl ? 'היום' : 'Today'}: ${data.today}`].filter(Boolean);
    return lines.join('\n\n');
  }

  async function ask(text) {
    if (busy || !text.trim()) return;
    busy = true;
    input.disabled = true;
    submit.disabled = true;
    addMessage(text.trim(), 'user');
    const waiting = addMessage(rtl ? 'מנתח מסלול, מקור והקשר…' : 'Analyzing route, source, and context…', 'waiting');
    try {
      const response = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          path: location.pathname,
          mode,
          creator_mode: mode === 'creator' ? 'create' : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || `HTTP ${response.status}`);
      waiting.remove();
      addMessage(mode === 'creator' ? creatorSummary(data) : (data.answer || (rtl ? 'לא התקבלה תשובה.' : 'No answer received.')));
      addLinks(data.links);
      const label = data.provider === 'nvidia'
        ? `NVIDIA · ${data.model || 'NIM'}`
        : data.provider === 'openai'
          ? `OpenAI · ${data.model || 'AI'}`
          : (rtl ? 'מצב בטוח מקומי' : 'Safe local mode');
      provider.textContent = label;
      launcherStatus.textContent = data.provider === 'nvidia' ? 'NVIDIA NIM' : (rtl ? 'מדריך חי' : 'Live guide');
    } catch (error) {
      waiting.textContent = rtl
        ? 'החיבור החכם אינו זמין כרגע. המדריך המקומי נשאר פעיל דרך עמודי הראיות והמערכת.'
        : 'The smart connection is unavailable. Use the evidence and system pages.';
      provider.textContent = rtl ? 'מצב בטוח מקומי' : 'Safe local mode';
      console.warn('7YA Signal Key fallback', error?.message || error);
    } finally {
      busy = false;
      input.disabled = false;
      submit.disabled = false;
      input.value = '';
      input.focus();
    }
  }

  launcher.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });
  modeRow.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-mode]');
    if (!button) return;
    mode = button.dataset.mode === 'creator' ? 'creator' : 'guide';
    modeRow.querySelectorAll('button').forEach((item) => item.classList.toggle('active', item === button));
    input.placeholder = mode === 'creator'
      ? (rtl ? 'מה אתם רוצים ליצור או לשנות?' : 'What do you want to create or change?')
      : (rtl ? 'שאלו על איגור, StartOn, 7YA או הראיות…' : 'Ask about Igor, StartOn, 7YA, or evidence…');
  });
  quick.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-prompt]');
    if (button) ask(button.dataset.prompt || '');
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    ask(input.value);
  });
})();
