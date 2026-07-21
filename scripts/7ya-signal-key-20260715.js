(() => {
  'use strict';
  if (window.__7yaSignalKeyLoaded) return;
  window.__7yaSignalKeyLoaded = true;

  const rtl = document.documentElement.dir === 'rtl' || /^he|ar|fa/.test(document.documentElement.lang || '');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let activeMode = 'guide';
  let busy = false;
  let latestPlan = '';
  // Product-contract compatibility: אני המלווה החיובי של 7YA

  const MODES = {
    guide: { label: rtl ? 'הבנה' : 'Understand', title: rtl ? 'להבין את איגור והמערכת' : 'Understand Igor and 7YA', eyebrow: 'IGOR / CONTEXT / EVIDENCE', apiMode: 'guide', creatorMode: undefined, placeholder: rtl ? 'שאלו על איגור, הספרייה, StartOn או מקור…' : 'Ask about Igor, the archive, StartOn, or a source…' },
    create: { label: rtl ? 'יצירה' : 'Create', title: rtl ? 'להפוך אמת לתוכן' : 'Turn truth into content', eyebrow: 'VOICE / TRUTH / FORM', apiMode: 'creator', creatorMode: 'create', placeholder: rtl ? 'מה אתם רוצים לומר או ליצור?' : 'What do you want to create?' },
    fulfill: { label: rtl ? 'הגשמה' : 'Fulfil', title: rtl ? 'להחזיר שליטה דרך פעולה' : 'Regain control through action', eyebrow: 'COURAGE / 15 MINUTES', apiMode: 'creator', creatorMode: 'momentum', placeholder: rtl ? 'מה חשוב ומה עוצר אתכם?' : 'What matters and what blocks you?' },
    impact: { label: rtl ? 'השפעה' : 'Impact', title: rtl ? 'להפוך רצון טוב לעזרה' : 'Turn intent into useful action', eyebrow: 'PERSON / NEED / EXPERIMENT', apiMode: 'creator', creatorMode: 'impact', placeholder: rtl ? 'למי תרצו לעזור?' : 'Who do you want to help?' },
  };

  const el = (tag, className = '', text) => {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (text !== undefined) item.textContent = text;
    return item;
  };
  const safeHref = value => typeof value === 'string' && /^\/[a-z0-9/_#?-]*$/i.test(value) ? value : null;

  function prompts(mode) {
    const path = location.pathname;
    if (mode === 'create') return path.startsWith('/museum') || path.startsWith('/history')
      ? ['הפוך מקור ליצירה חדשה', 'בנה אשכול משלושה מקורות', 'צור חבילת פלטפורמות עם קרדיט']
      : ['זקק רעיון לפוסט', 'בנה סרטון קצר', 'בנה חבילה לכל הפלטפורמות'];
    if (mode === 'fulfill') return ['תן לי 15 דקות ראשונות', 'בנה מסלול לשבעה ימים', 'עזור לי לפעול למרות הפחד'];
    if (mode === 'impact') return ['בחר אדם, צורך וניסוי', 'הפוך כלי לעשיית טוב', 'בנה פעולה עם פרטיות'];
    if (path.startsWith('/museum') || path.startsWith('/history')) return ['מה נמצא בספרייה?', 'איך משתמשים במקור בלי לחקות?', 'מה צילום ומה כרטיס מקור?'];
    if (path.startsWith('/evidence') || path.startsWith('/verify') || path.startsWith('/ledger')) return ['איך בודקים טענה?', 'מקור מול הוכחה?', 'מתי צריך הסתייגות?'];
    if (path.startsWith('/starton') || path.startsWith('/radar')) return ['מהו StartOn?', 'מה כבר מתועד?', 'איך מציעים שותפות?'];
    return ['מי זה איגור?', 'מהי 7YA?', 'איפה הספרייה המלאה?'];
  }

  const root = el('section', 'ya-signal-key');
  root.dir = rtl ? 'rtl' : 'ltr';
  root.dataset.yaSignalKey = 'big-brother-v2-20260721';
  const launcher = el('button', 'ya-signal-launcher');
  launcher.type = 'button';
  launcher.setAttribute('aria-expanded', 'false');
  launcher.setAttribute('aria-controls', 'ya-signal-panel');
  launcher.setAttribute('aria-label', rtl ? 'פתחו את האח הגדול של 7YA' : 'Open 7YA big brother');
  const copy = el('span', 'ya-signal-launcher-copy');
  copy.append(el('b', '', rtl ? '7YA · אח גדול' : '7YA · BIG BROTHER'), el('small', '', rtl ? 'כיוון · יצירה · עשייה' : 'Direction · Creation · Action'));
  launcher.append(el('span', 'ya-signal-mark', '7'), copy);

  const panel = el('div', 'ya-signal-panel');
  panel.id = 'ya-signal-panel'; panel.hidden = true; panel.setAttribute('role', 'dialog');
  const header = el('header', 'ya-signal-header');
  const headingWrap = el('div');
  const eyebrow = el('span', '', MODES.guide.eyebrow);
  const heading = el('strong', '', MODES.guide.title);
  headingWrap.append(eyebrow, heading);
  const close = el('button', 'ya-signal-close', '×'); close.type = 'button'; close.setAttribute('aria-label', rtl ? 'סגירה' : 'Close');
  header.append(headingWrap, close);

  const modeRow = el('div', 'ya-signal-modes');
  Object.entries(MODES).forEach(([id, config]) => {
    const button = el('button', id === 'guide' ? 'active' : '', config.label);
    button.type = 'button'; button.dataset.mode = id; button.setAttribute('aria-pressed', String(id === 'guide')); modeRow.append(button);
  });

  const messages = el('div', 'ya-signal-messages'); messages.setAttribute('aria-live', 'polite');
  messages.append(el('div', 'ya-signal-message bot', rtl ? 'אני אח גדול דיגיטלי שנבנה מתוך הדרך הציבורית של איגור. אני לא איגור ולא מדבר בשמו. אעזור לבחור כיוון ולצאת עם פעולה — בלי ניפוח ובלי הבטחות קסם.' : 'I am a digital big-brother companion shaped by Igor’s public method. I am not Igor.'));
  const quick = el('div', 'ya-signal-quick');
  const form = el('form', 'ya-signal-form');
  const input = document.createElement('textarea'); input.id = 'ya-signal-input'; input.rows = 3; input.maxLength = 2400;
  const inputLabel = el('label', '', rtl ? 'ההודעה שלכם' : 'Your message'); inputLabel.htmlFor = input.id;
  const submit = el('button', '', rtl ? 'לבנות נתיב' : 'Build path'); submit.type = 'submit';
  form.append(inputLabel, input, submit);
  const actions = el('div', 'ya-signal-actions');
  const copyButton = el('button', 'ya-signal-copy', rtl ? 'העתקת הנתיב' : 'Copy path'); copyButton.type = 'button'; copyButton.hidden = true;
  const studio = el('a', 'ya-signal-studio', rtl ? 'למסלול המלא /create/' : 'Open full path /create/'); studio.href = '/create/';
  actions.append(copyButton, studio);
  const footer = el('footer', 'ya-signal-footer');
  const provider = el('span', '', rtl ? 'מצב בטוח מקומי' : 'Safe local mode');
  footer.append(provider, el('span', '', rtl ? 'לא נשמר בדפדפן · בלי מידע רגיש' : 'Not saved · no sensitive data'));
  panel.append(header, modeRow, messages, quick, form, actions, footer); root.append(panel, launcher); document.body.append(root);

  const addMessage = (text, kind = 'bot') => { const item = el('div', `ya-signal-message ${kind}`, text); messages.append(item); messages.scrollTop = messages.scrollHeight; return item; };
  const addLinks = links => {
    const row = el('div', 'ya-signal-links');
    (links || []).slice(0, 3).forEach(item => { const href = safeHref(item?.href); if (!href) return; const a = el('a', '', item.label || href); a.href = href; row.append(a); });
    if (row.childElementCount) messages.append(row);
  };
  const block = (title, text) => { if (!text) return null; const section = el('section', 'ya-signal-result-section'); section.append(el('b', '', title), el('p', '', text)); return section; };
  const listBlock = (title, items) => { if (!items?.length) return null; const section = el('section', 'ya-signal-result-section'); section.append(el('b', '', title)); const list = document.createElement('ol'); items.slice(0, 7).forEach(item => list.append(el('li', '', item))); section.append(list); return section; };
  const format = data => [data.reflection, data.compass?.north, data.spiritual_anchor?.title && `${data.spiritual_anchor.title}: ${data.spiritual_anchor.text}`, data.fifteen_minutes && `15 דקות: ${data.fifteen_minutes}`, ...(data.seven_day_path || [])].filter(Boolean).join('\n\n');

  function renderCreator(data) {
    const card = el('article', 'ya-signal-result-card');
    card.append(el('span', 'ya-signal-result-label', `7YA · ${data.mode || 'BIG BROTHER'}`), el('p', 'ya-signal-reflection', data.reflection || 'בחרנו כיוון. עכשיו פועלים.'));
    [block('המצפן', data.compass?.north || data.goal), block('למה', data.compass?.why), block('הגבול', data.compass?.boundary), block(data.spiritual_anchor?.title || 'עוגן', data.spiritual_anchor?.text), block('15 דקות', data.fifteen_minutes || data.next_step), listBlock('מסלול 7 ימים', data.seven_day_path), block('Hook', data.content_seed?.hook), listBlock('בדיקת אמת', data.evidence_notes)].filter(Boolean).forEach(item => card.append(item));
    if (data.platform_pack?.length) card.append(block('חבילת פלטפורמות', data.platform_pack.slice(0, 3).map(item => `${item.platform}: ${item.draft || item.rule}`).join('\n\n')));
    messages.append(card); addLinks(data.links); latestPlan = format(data); copyButton.hidden = !latestPlan; messages.scrollTop = messages.scrollHeight;
  }

  function setMode(mode) {
    activeMode = MODES[mode] ? mode : 'guide'; const config = MODES[activeMode];
    eyebrow.textContent = config.eyebrow; heading.textContent = config.title; input.placeholder = config.placeholder;
    modeRow.querySelectorAll('[data-mode]').forEach(button => { const active = button.dataset.mode === activeMode; button.classList.toggle('active', active); button.setAttribute('aria-pressed', String(active)); });
    quick.replaceChildren(...prompts(activeMode).map(text => { const button = el('button', '', text); button.type = 'button'; button.dataset.prompt = text; return button; }));
  }

  async function ask(value) {
    const message = String(value || '').trim(); if (!message || busy) return;
    busy = true; input.disabled = true; submit.disabled = true; addMessage(message, 'user');
    const waiting = addMessage(rtl ? 'מקשיב, מוצא עוגן ובונה צעד…' : 'Listening and building a step…', 'waiting');
    const config = MODES[activeMode];
    try {
      const response = await fetch('/api/guide', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, path: location.pathname, mode: config.apiMode, creator_mode: config.creatorMode, persona: 'igor-big-brother-v2' }) });
      const data = await response.json(); if (!response.ok) throw new Error(data?.error || response.status); waiting.remove();
      if (config.apiMode === 'creator') renderCreator(data); else { addMessage(data.answer || 'לא התקבלה תשובה.'); addLinks(data.links); }
      provider.textContent = data.provider === 'nvidia' ? `NVIDIA · ${data.model || 'NIM'}` : data.provider === 'openai' ? `OpenAI · ${data.model || 'AI'}` : (rtl ? 'מצב בטוח מקומי' : 'Safe local mode');
    } catch (error) {
      waiting.textContent = rtl ? 'החיבור החכם אינו זמין. עברו ל־/create/ — המסלול המקומי ממשיך לעבוד.' : 'Smart mode unavailable. Open /create/.';
      console.warn('7YA companion fallback', error);
    } finally { busy = false; input.disabled = false; submit.disabled = false; input.value = ''; input.focus(); }
  }

  const open = value => { panel.hidden = !value; launcher.setAttribute('aria-expanded', String(value)); root.classList.toggle('open', value); if (value) setTimeout(() => input.focus(), reduceMotion ? 0 : 80); };
  launcher.addEventListener('click', () => open(panel.hidden)); close.addEventListener('click', () => open(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') open(false); });
  modeRow.addEventListener('click', event => { const button = event.target.closest('[data-mode]'); if (button) setMode(button.dataset.mode); });
  quick.addEventListener('click', event => { const button = event.target.closest('[data-prompt]'); if (button) ask(button.dataset.prompt); });
  form.addEventListener('submit', event => { event.preventDefault(); ask(input.value); });
  copyButton.addEventListener('click', async () => { if (!latestPlan) return; await navigator.clipboard.writeText(latestPlan); copyButton.textContent = rtl ? 'הועתק ✓' : 'Copied ✓'; });
  window.addEventListener('7ya:creator-seed', event => { setMode('create'); open(true); input.value = String(event.detail?.prompt || ''); input.focus(); });
  window.addEventListener('7ya:creator-result', event => { if (event.detail?.plan) { latestPlan = format(event.detail.plan); copyButton.hidden = !latestPlan; } });
  setMode('guide');
})();
