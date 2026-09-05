(() => {
  'use strict';

  const GUIDE_IDENTITY = '7 / השומר';
  const GUIDE_BOUNDARY = 'אני לא איגור ולא מדבר במקומו';

  const launcher = document.querySelector('#guideLauncher');
  const panel = document.querySelector('#guidePanel');
  const close = document.querySelector('#guideClose');
  const dialogue = document.querySelector('#guideDialogue');
  const actions = document.querySelector('#guideActions');
  const pathButtons = [...document.querySelectorAll('[data-guide-path]')];
  const results = document.querySelector('#contentResults');
  const search = document.querySelector('#contentSearch');
  const status = document.querySelector('#contentStatus');
  const total = document.querySelector('#contentTotal');
  const filterButtons = [...document.querySelectorAll('[data-content-filter]')];

  const routes = {
    story: { label: 'STORY', text: 'התחילו מהאדם: שורשים, שירות, אבהות, יצירה והבחירות שהפכו ניסיון למערכת.', primary: ['התחילו את המסע', '#origins'], secondary: ['לציר החיים המלא', '/journey/'] },
    starton: { label: 'MISSION', text: 'StartOn הוא המקום שבו הסיפור הופך להזדמנות לנוער: טכנולוגיה, יצירה, שייכות ומבוגר שמאמין.', primary: ['הכירו את StartOn', '/starton/'], secondary: ['הציעו שותפות', '/contact/'] },
    evidence: { label: 'VERIFY', text: 'כאן לא חייבים להאמין לכותרת. אפשר לפתוח מקור, לראות תאריך ולהבין מה מאומת ומה עדיין מחכה לבדיקה.', primary: ['פתחו Evidence Ledger', '/evidence/'], secondary: ['חפשו בארכיון', '#discover'] },
    media: { label: 'EXPLORE', text: 'אספנו וידאו, פוסטים, מוזיקה, כתבות ופודקאסטים למפה אחת. חפשו נושא או בחרו זירה.', primary: ['גלו את כל התוכן', '#discover'], secondary: ['למוזיאון', '/museum/'] },
    build: { label: 'ACT', text: 'המסע אינו מסתיים בצפייה. אפשר ליצור, להזמין שיחה או לבנות שותפות עם יעד מעשי וברור.', primary: ['בואו נבנה', '/contact/'], secondary: ['פתחו את 7YA Create', '/create/'] },
  };

  const setOpen = open => {
    if (!panel || !launcher) return;
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) {
      panel.setAttribute('data-guide-identity', GUIDE_IDENTITY);
      panel.setAttribute('data-guide-boundary', GUIDE_BOUNDARY);
      panel.classList.remove('is-entering');
      requestAnimationFrame(() => panel.classList.add('is-entering'));
      close?.focus({ preventScroll: true });
    } else launcher.focus({ preventScroll: true });
  };

  const appendText = (parent, tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value;
    parent.append(node);
    return node;
  };

  const choosePath = key => {
    const route = routes[key];
    if (!route || !dialogue || !actions) return;
    dialogue.replaceChildren();
    const message = document.createElement('p');
    appendText(message, 'span', '', route.label);
    message.append(document.createTextNode(route.text));
    dialogue.append(message);
    actions.replaceChildren();
    [route.primary, route.secondary].forEach(([label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      actions.append(link);
    });
    try { sessionStorage.setItem('7ya-guide-path', key); } catch {}
    setOpen(true);
  };

  launcher?.addEventListener('click', () => setOpen(panel?.hidden !== false));
  close?.addEventListener('click', () => setOpen(false));
  pathButtons.forEach(button => button.addEventListener('click', () => choosePath(button.dataset.guidePath)));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && panel && !panel.hidden) setOpen(false); });

  try {
    const previous = sessionStorage.getItem('7ya-guide-path');
    if (previous && routes[previous]) choosePath(previous);
  } catch {}

  const state = { records: [], filter: 'all', query: '', failedStreams: 0 };
  const shards = [1, 2, 3, 4, 5].map(part => `/knowledge/history-song-records-${part}.json`);
  const sources = [...shards, '/knowledge/public-universe-records-20260715.json'];

  const normalized = value => String(value || '').toLocaleLowerCase('he-IL');
  const canonicalUrl = value => {
    try {
      const url = new URL(value);
      url.hash = '';
      [...url.searchParams.keys()].forEach(key => { if (/^(utm_|fbclid|gclid)/i.test(key)) url.searchParams.delete(key); });
      return url.toString().replace(/\/$/, '');
    } catch { return String(value || ''); }
  };
  const kindOf = record => {
    const haystack = normalized([record.platform, record.collection, record.title, ...(record.tags || [])].join(' '));
    if (/starton|youth|נוער/.test(haystack)) return 'starton';
    if (/music|spotify|song|מוזיקה/.test(haystack)) return 'music';
    if (/youtube|tiktok|video|television|וידאו|טלוויזיה|reel/.test(haystack)) return 'video';
    if (/press|writing|article|עיתונות|כתבה|מאמר/.test(haystack)) return 'press';
    if (/facebook|instagram|linkedin|threads|social|x.com/.test(haystack)) return 'social';
    return 'story';
  };
  const searchable = record => normalized([record.title, record.subtitle, record.summary, record.platform, record.collection, record.year, ...(record.tags || [])].join(' '));

  const render = () => {
    if (!results) return;
    const visible = state.records.filter(record => {
      const matchesFilter = state.filter === 'all' || kindOf(record) === state.filter;
      return matchesFilter && (!state.query || searchable(record).includes(state.query));
    });
    results.replaceChildren();
    if (!visible.length) {
      appendText(results, 'p', 'content-empty', 'לא נמצאו רשומות מתאימות. נסו מילה אחרת או חזרו לכל התוכן.');
    } else {
      visible.slice(0, 12).forEach(record => {
        const article = document.createElement('article');
        article.className = 'content-card';
        article.dataset.kind = kindOf(record);
        const meta = document.createElement('div');
        meta.className = 'content-card-meta';
        appendText(meta, 'span', '', record.platform || record.collection || 'PUBLIC');
        appendText(meta, 'span', '', String(record.year || record.date || 'ARCHIVE').slice(0, 10));
        article.append(meta);
        appendText(article, 'h3', '', record.title || 'רשומה ציבורית');
        appendText(article, 'p', '', record.summary || record.subtitle || 'מקור ציבורי שנשמר כחלק ממפת התוכן של 7YA.');
        const footer = document.createElement('footer');
        appendText(footer, 'span', '', String(record.evidence_tier || 'SOURCE').replace('_', ' '));
        const link = document.createElement('a');
        link.href = record.url || record.canonical_url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'פתיחת המקור ↗';
        footer.append(link);
        article.append(footer);
        results.append(article);
      });
    }
    results.setAttribute('aria-busy', 'false');
    if (status) {
      const partial = state.failedStreams
        ? ` · ${state.failedStreams} מתוך ${sources.length} זרמי תוכן לא נטענו`
        : '';
      status.textContent = `${visible.length} תוצאות מתוך ${state.records.length} רשומות ציבוריות מאוחדות${partial}`;
    }
  };

  Promise.allSettled(sources.map(async source => {
    const response = await fetch(source, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`${source}: ${response.status}`);
    const data = await response.json();
    return Array.isArray(data.records) ? data.records : [];
  })).then(streams => {
    const loaded = streams.filter(stream => stream.status === 'fulfilled');
    if (!loaded.length) throw new Error('all public content streams failed');
    state.failedStreams = streams.length - loaded.length;

    const seen = new Set();
    state.records = loaded.flatMap(stream => stream.value).filter(record => {
      const key = canonicalUrl(record.url || record.canonical_url);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      record.url = record.url || record.canonical_url;
      return true;
    });
    if (total) total.textContent = String(state.records.length);
    render();
  }).catch(() => {
    if (results) {
      results.replaceChildren();
      const fallback = appendText(results, 'p', 'content-empty', 'הארכיון המלא לא נטען כרגע. ליבת המוזיאון עדיין זמינה במסך הייעודי.');
      const link = document.createElement('a');
      link.href = '/museum/';
      link.textContent = 'פתיחת המוזיאון';
      fallback.append(' ', link);
      results.setAttribute('aria-busy', 'false');
    }
    if (total) total.textContent = '—';
    if (status) status.textContent = 'מצב גיבוי פעיל — ללא המצאת תוצאות.';
  });

  search?.addEventListener('input', () => { state.query = normalized(search.value.trim()); render(); });
  filterButtons.forEach(button => button.addEventListener('click', () => {
    state.filter = button.dataset.contentFilter || 'all';
    filterButtons.forEach(item => item.classList.toggle('is-active', item === button));
    render();
  }));
})();
