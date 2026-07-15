const HOME_UNIVERSE_SOURCE = '/knowledge/public-universe-records-20260715.json';
const PAGE_SIZE = 18;

const state = {
  records: [],
  query: '',
  filter: 'all',
  visible: PAGE_SIZE,
};

const elements = {
  total: document.querySelector('#homeUniverseCount'),
  platforms: document.querySelector('#homeUniversePlatforms'),
  years: document.querySelector('#homeUniverseYears'),
  external: document.querySelector('#homeUniverseExternal'),
  heroCount: document.querySelector('#homeUniverseHeroCount'),
  search: document.querySelector('#homeUniverseSearch'),
  filters: document.querySelector('#homeUniverseFilters'),
  grid: document.querySelector('#homeUniverseGrid'),
  status: document.querySelector('#homeUniverseStatus'),
  more: document.querySelector('#homeUniverseMore'),
};

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

function recordDate(record) {
  const dated = safeText(record.date);
  if (dated && !Number.isNaN(Date.parse(dated))) return Date.parse(dated);
  const year = Number(record.year);
  return Number.isFinite(year) ? Date.UTC(year, 0, 1) : 0;
}

function classify(record) {
  const haystack = [
    record.platform,
    record.type,
    record.act,
    ...(Array.isArray(record.themes) ? record.themes : []),
  ].join(' ').toLowerCase();

  if (/youtube|video|television|tiktok|reel|clip/.test(haystack)) return 'video';
  if (/press|news|media|עיתונות|כתבה|publisher/.test(haystack)) return 'press';
  if (/music|spotify|song|מוזיקה|קליפ/.test(haystack)) return 'music';
  if (/writing|article|linkedin|מאמר|כתיבה|research|academy/.test(haystack)) return 'writing';
  if (/starton|youth|נוער|social-action|community/.test(haystack)) return 'starton';
  if (/facebook|instagram|threads|x.com|social|syndication/.test(haystack)) return 'social';
  return 'other';
}

function normalizeRecords(records) {
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
    .sort((a, b) => recordDate(b) - recordDate(a) || safeText(a.title).localeCompare(safeText(b.title), 'he'));
}

function searchableText(record) {
  return [
    record.title,
    record.summary,
    record.platform,
    record.publisher,
    record.type,
    record.language,
    record.act,
    ...(Array.isArray(record.themes) ? record.themes : []),
  ].join(' ').toLowerCase();
}

function selectedRecords() {
  const query = state.query.trim().toLowerCase();
  return state.records.filter(record => {
    const filterMatch = state.filter === 'all' || record.category === state.filter;
    const queryMatch = !query || searchableText(record).includes(query);
    return filterMatch && queryMatch;
  });
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function cardFor(record) {
  const card = element('a', 'universe-card');
  card.href = record.canonical_url;
  card.target = '_blank';
  card.rel = 'noopener noreferrer';
  card.setAttribute('aria-label', `${safeText(record.title)} — פתיחת המקור`);

  const meta = element('div', 'universe-card__meta');
  meta.append(
    element('span', '', safeText(record.platform, 'Public source')),
    element('span', '', String(record.year || 'ללא תאריך')),
    element('span', '', safeText(record.language, 'multi')),
  );

  const title = element('h3', '', safeText(record.title, 'רשומה ציבורית'));
  const summary = element('p', '', safeText(record.summary, 'מקור ציבורי שנוסף למפת התוכן של איגור ופרצקי.'));

  card.append(meta, title, summary);

  if (record.metric?.value && record.metric?.as_of) {
    card.append(element('span', 'universe-card__metric', `${record.metric.value} · ${record.metric.as_of}`));
  }

  const themes = (Array.isArray(record.themes) ? record.themes : []).slice(0, 3);
  if (themes.length) {
    const themeRow = element('div', 'universe-card__themes');
    themes.forEach(theme => themeRow.append(element('span', '', safeText(theme))));
    card.append(themeRow);
  }

  const foot = element('div', 'universe-card__foot');
  foot.append(
    element('span', 'universe-card__publisher', safeText(record.publisher, 'Public source')),
    element('span', 'universe-card__tier', safeText(record.evidence_tier, 'SOURCE')),
  );
  card.append(foot);
  return card;
}

function render() {
  if (!elements.grid) return;
  const matches = selectedRecords();
  const visible = matches.slice(0, state.visible);
  elements.grid.replaceChildren(...visible.map(cardFor));

  if (elements.status) {
    elements.status.textContent = matches.length
      ? `מוצגות ${visible.length} מתוך ${matches.length} רשומות מתאימות. כל כרטיס נפתח במקור הציבורי.`
      : 'לא נמצאו רשומות מתאימות. נסו חיפוש או מסנן אחר.';
  }

  if (elements.more) {
    elements.more.hidden = visible.length >= matches.length;
    elements.more.textContent = `הציגו עוד ${Math.min(PAGE_SIZE, matches.length - visible.length)} רשומות`;
  }

  if (!matches.length) {
    const fallback = element('div', 'universe-fallback');
    fallback.append('לא נמצאה התאמה כאן. ');
    const link = element('a', '', 'פתחו את המוזיאון המלא');
    link.href = '/museum/';
    fallback.append(link);
    elements.grid.append(fallback);
  }
}

function renderStats() {
  const platforms = new Set(state.records.map(record => safeText(record.platform)).filter(Boolean));
  const years = state.records.map(record => Number(record.year)).filter(Number.isFinite);
  const external = state.records.filter(record => record.evidence_tier === 'TIER_1').length;
  const yearRange = years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '—';

  if (elements.total) elements.total.textContent = String(state.records.length);
  if (elements.heroCount) elements.heroCount.textContent = String(state.records.length);
  if (elements.platforms) elements.platforms.textContent = String(platforms.size);
  if (elements.years) elements.years.textContent = yearRange;
  if (elements.external) elements.external.textContent = String(external);
}

function bind() {
  elements.search?.addEventListener('input', event => {
    state.query = event.target.value;
    state.visible = PAGE_SIZE;
    render();
  });

  elements.filters?.addEventListener('click', event => {
    const button = event.target.closest('button[data-universe-filter]');
    if (!button) return;
    state.filter = button.dataset.universeFilter;
    state.visible = PAGE_SIZE;
    elements.filters.querySelectorAll('button').forEach(item => {
      item.setAttribute('aria-pressed', String(item === button));
    });
    render();
  });

  elements.more?.addEventListener('click', () => {
    state.visible += PAGE_SIZE;
    render();
  });
}

async function start() {
  if (!elements.grid) return;
  bind();
  elements.status.textContent = 'טוען את שכבת Public Universe…';

  try {
    const response = await fetch(HOME_UNIVERSE_SOURCE, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    state.records = normalizeRecords(Array.isArray(payload.records) ? payload.records : []);
    renderStats();
    render();
  } catch (error) {
    console.error('HOME_PUBLIC_UNIVERSE_LOAD_FAILED', error);
    elements.status.textContent = 'שכבת Public Universe לא נטענה כרגע.';
    const fallback = element('div', 'universe-fallback');
    fallback.append('המאגר המלא עדיין זמין במוזיאון. ');
    const link = element('a', '', 'פתחו את המוזיאון');
    link.href = '/museum/';
    fallback.append(link);
    elements.grid.replaceChildren(fallback);
    if (elements.more) elements.more.hidden = true;
  }
}

start();
