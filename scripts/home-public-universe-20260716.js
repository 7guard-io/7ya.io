(() => {
  'use strict';

  if (window.__7yaHomeUniverseLoaded || !['/', '/index.html'].includes(location.pathname)) return;
  window.__7yaHomeUniverseLoaded = true;

  const SOURCE = '/knowledge/public-universe-records-20260715.json';
  const PAGE_SIZE = 12;
  const state = { records: [], query: '', filter: 'all', visible: PAGE_SIZE };

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function safeText(value, fallback = '') {
    return typeof value === 'string' ? value.trim() : fallback;
  }

  function safeUrl(value) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  }

  function canonicalUrl(value) {
    const url = safeUrl(value);
    if (!url) return null;
    const parsed = new URL(url);
    parsed.hash = '';
    for (const key of [...parsed.searchParams.keys()]) {
      if (key.startsWith('utm_') || ['fbclid', 'gclid', 'si'].includes(key)) parsed.searchParams.delete(key);
    }
    return parsed.href.replace(/\/$/, '');
  }

  function classify(record) {
    const haystack = [record.platform, record.type, record.act, ...(Array.isArray(record.themes) ? record.themes : [])].join(' ').toLowerCase();
    if (/youtube|video|television|tiktok|reel|clip/.test(haystack)) return 'video';
    if (/press|news|media|עיתונות|כתבה|publisher/.test(haystack)) return 'press';
    if (/music|spotify|song|מוזיקה|קליפ/.test(haystack)) return 'music';
    if (/writing|article|linkedin|מאמר|כתיבה|research|academy/.test(haystack)) return 'writing';
    if (/starton|youth|נוער|community/.test(haystack)) return 'starton';
    if (/facebook|instagram|threads|x.com|social|syndication/.test(haystack)) return 'social';
    return 'other';
  }

  function recordTime(record) {
    if (record.date && !Number.isNaN(Date.parse(record.date))) return Date.parse(record.date);
    return Number.isFinite(Number(record.year)) ? Date.UTC(Number(record.year), 0, 1) : 0;
  }

  function normalize(records) {
    const seen = new Set();
    return records
      .filter(record => record && record.verification !== 'QUARANTINED')
      .map(record => ({ ...record, canonical_url: canonicalUrl(record.url), category: classify(record) }))
      .filter(record => {
        if (!record.id || !record.title || !record.canonical_url) return false;
        if (seen.has(record.canonical_url)) return false;
        seen.add(record.canonical_url);
        return true;
      })
      .sort((a, b) => recordTime(b) - recordTime(a) || safeText(a.title).localeCompare(safeText(b.title), 'he'));
  }

  const section = element('section', 'personal-section home-universe-section');
  section.id = 'universe';
  section.setAttribute('aria-labelledby', 'home-universe-title');

  const head = element('div', 'personal-section-head home-universe-head reveal');
  const headingWrap = element('div');
  const small = element('small', '', '03 / PUBLIC UNIVERSE');
  const heading = element('h2', '', 'לא 36 פוסטים.\nיקום שממשיך להתרחב.');
  heading.id = 'home-universe-title';
  headingWrap.append(small, heading);
  const intro = element('p', '', 'ליבת 66 הרשומות נשארת שכבת הראיות. כאן מופיעה שכבת הגילוי הנוספת: חשבונות, מראות הפצה, ראיונות, מוזיקה, מחקר ומקורות ציבוריים חדשים — בלי תקרת תוכן קבועה.');
  head.append(headingWrap, intro);

  const stats = element('div', 'home-universe-stats');
  const statNodes = {};
  [['records', 'מקורות נוספים'], ['platforms', 'פלטפורמות'], ['years', 'טווח שנים'], ['external', 'מקורות חיצוניים']].forEach(([key, label]) => {
    const card = element('div');
    const value = element('b', '', '—');
    statNodes[key] = value;
    card.append(value, element('span', '', label));
    stats.append(card);
  });

  const tools = element('div', 'home-universe-tools');
  const searchLabel = element('label', 'home-universe-search');
  searchLabel.append(element('span', '', 'חיפוש בכל השכבה הנוספת'));
  const search = document.createElement('input');
  search.type = 'search';
  search.placeholder = 'וידאו, הורות, StartOn, מוזיקה, מחקר…';
  search.autocomplete = 'off';
  searchLabel.append(search);
  const filters = element('div', 'home-universe-filters');
  filters.setAttribute('role', 'group');
  filters.setAttribute('aria-label', 'סינון מקורות');
  const filterOptions = [
    ['all', 'הכול'], ['video', 'וידאו'], ['press', 'עיתונות'], ['social', 'הפצה'],
    ['music', 'מוזיקה'], ['writing', 'כתיבה ומחקר'], ['starton', 'StartOn ונוער'],
  ];
  filterOptions.forEach(([id, label], index) => {
    const button = element('button', index === 0 ? 'active' : '', label);
    button.type = 'button';
    button.dataset.universeFilter = id;
    button.setAttribute('aria-pressed', String(index === 0));
    filters.append(button);
  });
  tools.append(searchLabel, filters);

  const status = element('p', 'home-universe-status', 'טוען את Public Universe…');
  status.setAttribute('aria-live', 'polite');
  const grid = element('div', 'home-universe-grid');
  const more = element('button', 'home-universe-more', 'הציגו עוד');
  more.type = 'button';
  more.hidden = true;

  const actions = element('div', 'home-universe-actions');
  const museumLink = element('a', 'primary', 'למוזיאון המלא');
  museumLink.href = '/museum/';
  const createLink = element('a', '', 'לסטודיו היצירה');
  createLink.href = '/create/';
  const evidenceLink = element('a', 'quiet', 'לבדיקת הראיות');
  evidenceLink.href = '/evidence/';
  actions.append(museumLink, createLink, evidenceLink);

  section.append(head, stats, tools, status, grid, more, actions);
  const work = document.querySelector('#work');
  if (!work) return;
  work.insertAdjacentElement('afterend', section);

  const nav = document.querySelector('.site-header nav');
  if (nav && !nav.querySelector('a[href="#universe"]')) {
    const link = element('a', '', 'התוכן');
    link.href = '#universe';
    const partner = nav.querySelector('a[href="#partners"]');
    partner ? nav.insertBefore(link, partner) : nav.append(link);
  }

  function searchable(record) {
    return [record.title, record.summary, record.platform, record.publisher, record.type, record.language, record.act, ...(Array.isArray(record.themes) ? record.themes : [])].join(' ').toLowerCase();
  }

  function selected() {
    const query = state.query.trim().toLowerCase();
    return state.records.filter(record => (state.filter === 'all' || record.category === state.filter) && (!query || searchable(record).includes(query)));
  }

  function cardFor(record) {
    const card = element('article', 'home-universe-card');
    const imageUrl = safeUrl(record.image);
    if (imageUrl) {
      const media = element('a', 'home-universe-media');
      media.href = record.canonical_url;
      media.target = '_blank';
      media.rel = 'noopener noreferrer';
      const image = document.createElement('img');
      image.src = imageUrl;
      image.alt = '';
      image.loading = 'lazy';
      media.append(image);
      card.append(media);
    } else {
      const sourceMark = element('div', 'home-universe-source-mark');
      sourceMark.append(element('b', '', safeText(record.platform, 'PUBLIC')), element('span', '', String(record.year || 'ARCHIVE')));
      card.append(sourceMark);
    }

    const body = element('div', 'home-universe-card-body');
    const meta = element('div', 'home-universe-meta');
    meta.append(element('span', '', safeText(record.platform, 'Public source')), element('span', '', safeText(record.evidence_tier, 'SOURCE')));
    body.append(meta, element('h3', '', safeText(record.title, 'רשומה ציבורית')), element('p', '', safeText(record.summary, 'מקור ציבורי נוסף במפת התוכן.')));

    if (record.metric?.value && record.metric?.as_of) {
      body.append(element('span', 'home-universe-metric', `${record.metric.value} · ${record.metric.as_of}`));
    }

    const footer = element('div', 'home-universe-card-actions');
    const source = element('a', '', 'פתיחת המקור ↗');
    source.href = record.canonical_url;
    source.target = '_blank';
    source.rel = 'noopener noreferrer';
    const create = element('button', '', 'צור מזה');
    create.type = 'button';
    create.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('7ya:creator-seed', {
        detail: { prompt: `המקור: “${safeText(record.title)}”. עזור לי להפוך אותו לתוכן חדש ומדויק בלי להעתיק, עם זווית חדשה, Hook, מבנה ובדיקת אמת.` },
      }));
    });
    footer.append(source, create);
    body.append(footer);
    card.append(body);
    return card;
  }

  function render() {
    const matches = selected();
    const visible = matches.slice(0, state.visible);
    grid.replaceChildren(...visible.map(cardFor));
    status.textContent = matches.length
      ? `מוצגות ${visible.length} מתוך ${matches.length} רשומות נוספות. כל מקור ניתן לפתיחה, וכל רעיון ניתן להעברה ישירה למלווה היצירה.`
      : 'לא נמצאו רשומות מתאימות. נסו מסנן או חיפוש אחר.';
    more.hidden = visible.length >= matches.length;
    if (!more.hidden) more.textContent = `הציגו עוד ${Math.min(PAGE_SIZE, matches.length - visible.length)} רשומות`;
  }

  function renderStats() {
    const platforms = new Set(state.records.map(record => safeText(record.platform)).filter(Boolean));
    const years = state.records.map(record => Number(record.year)).filter(Number.isFinite);
    statNodes.records.textContent = String(state.records.length);
    statNodes.platforms.textContent = String(platforms.size);
    statNodes.years.textContent = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '—';
    statNodes.external.textContent = String(state.records.filter(record => record.evidence_tier === 'TIER_1').length);
  }

  search.addEventListener('input', event => {
    state.query = event.target.value;
    state.visible = PAGE_SIZE;
    render();
  });
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-universe-filter]');
    if (!button) return;
    state.filter = button.dataset.universeFilter || 'all';
    state.visible = PAGE_SIZE;
    filters.querySelectorAll('button').forEach(item => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    render();
  });
  more.addEventListener('click', () => {
    state.visible += PAGE_SIZE;
    render();
  });

  fetch(SOURCE, { headers: { Accept: 'application/json' }, cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(payload => {
      state.records = normalize(Array.isArray(payload.records) ? payload.records : []);
      renderStats();
      render();
    })
    .catch(error => {
      console.error('HOME_PUBLIC_UNIVERSE_LOAD_FAILED', error);
      status.textContent = 'שכבת Public Universe לא נטענה כרגע. המוזיאון המלא נשאר זמין.';
      const fallback = element('a', 'home-universe-fallback', 'פתחו את המוזיאון →');
      fallback.href = '/museum/';
      grid.replaceChildren(fallback);
    });
})();