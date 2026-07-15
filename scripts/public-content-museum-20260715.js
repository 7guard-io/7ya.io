(() => {
  'use strict';

  const state = { records: [], filter: 'All', query: '' };
  const grid = document.querySelector('#museumGrid');
  const count = document.querySelector('#museumCount');
  const search = document.querySelector('#museumSearch');
  const empty = document.querySelector('#museumEmpty');
  const buttons = [...document.querySelectorAll('[data-museum-filter]')];
  const progress = document.querySelector('.reading-progress span');

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const normalize = value => String(value ?? '')
    .toLocaleLowerCase('he')
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '');

  const platformClass = value => normalize(value)
    .replace(/[^a-z0-9א-ת]+/g, '-')
    .replace(/^-|-$/g, '');

  const tierLabel = tier => ({
    TIER_1: 'מקור חיצוני',
    TIER_2: 'מקור רשמי',
    TIER_3: 'Export / Snapshot'
  }[tier] || 'מקור ציבורי');

  const yearLabel = record => record.date?.slice(0, 4) || record.year || 'ללא תאריך';

  function media(record) {
    if (record.image) {
      return `<div class="capture-media"><img src="${escapeHtml(record.image)}" alt="" loading="lazy" referrerpolicy="no-referrer"></div>`;
    }
    const platform = platformClass(record.platform);
    return `<div class="capture-media"><div class="capture-platform ${platform}">${escapeHtml(record.platform)}</div></div>`;
  }

  function metric(record) {
    if (!record.metric) return '';
    return `<div class="capture-metric"><b>${escapeHtml(record.metric.label)}:</b> ${escapeHtml(record.metric.value)} · ${escapeHtml(record.metric.as_of)}</div>`;
  }

  function card(record) {
    const tags = (record.themes || []).slice(0, 3).map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
    const publisher = record.publisher || record.platform;
    const host = (() => {
      try { return new URL(record.url).hostname.replace(/^www\./, ''); }
      catch { return 'source'; }
    })();
    return `
      <a class="source-capture" data-tier="${escapeHtml(record.evidence_tier)}" href="${escapeHtml(record.url)}" target="_blank" rel="noopener noreferrer">
        <div class="capture-browser"><i></i><i></i><i></i><span>${escapeHtml(host)}</span></div>
        ${media(record)}
        <div class="capture-body">
          <div class="capture-meta"><span>${escapeHtml(record.platform)} · ${escapeHtml(record.id)}</span><span>${escapeHtml(yearLabel(record))}</span></div>
          <h3>${escapeHtml(record.title)}</h3>
          <p>${escapeHtml(record.summary || '')}</p>
          <div class="capture-tags">${tags}</div>
          ${metric(record)}
          <div class="capture-footer"><b>${escapeHtml(tierLabel(record.evidence_tier))}</b><span>${escapeHtml(publisher)} ↗</span></div>
        </div>
      </a>`;
  }

  function matches(record) {
    if (state.filter !== 'All' && record.platform !== state.filter) return false;
    if (!state.query) return true;
    const haystack = normalize([
      record.id, record.title, record.summary, record.platform, record.publisher,
      record.type, record.language, record.act, record.verification, ...(record.themes || [])
    ].join(' '));
    return haystack.includes(state.query);
  }

  function render() {
    if (!grid) return;
    const records = state.records
      .filter(matches)
      .sort((a, b) => {
        const ay = Number(a.year || 0);
        const by = Number(b.year || 0);
        if (ay !== by) return by - ay;
        return String(b.date || '').localeCompare(String(a.date || ''));
      });
    grid.innerHTML = records.map(card).join('');
    if (count) count.textContent = String(records.length);
    if (empty) empty.hidden = records.length !== 0;
  }

  async function load() {
    if (!grid) return;
    const paths = [1, 2, 3, 4, 5].map(part => `/knowledge/history-song-records-${part}.json`);
    try {
      const responses = await Promise.all(paths.map(path => fetch(path, {
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      })));
      const failure = responses.find(response => !response.ok);
      if (failure) throw new Error(`Museum archive fetch failed: ${failure.status}`);
      const shards = await Promise.all(responses.map(response => response.json()));
      state.records = shards.flatMap(shard => Array.isArray(shard.records) ? shard.records : []);
      if (state.records.length !== 66) throw new Error(`Expected 66 records, received ${state.records.length}`);
      render();
    } catch (error) {
      console.error(error);
      grid.innerHTML = `
        <article class="source-capture">
          <div class="capture-browser"><i></i><i></i><i></i><span>7ya.io</span></div>
          <div class="capture-media"><div class="capture-platform press">OFFLINE</div></div>
          <div class="capture-body">
            <div class="capture-meta"><span>ARCHIVE</span><span>FAIL CLOSED</span></div>
            <h3>קיר התוכן לא נטען כרגע</h3>
            <p>המקורות נשארים פתוחים כקובצי JSON ולא מוחלפים בנתונים מומצאים.</p>
            <div class="capture-footer"><b>מקור ציבורי</b><span>פתחו JSON</span></div>
          </div>
        </article>`;
      if (count) count.textContent = '—';
    }
  }

  buttons.forEach(button => button.addEventListener('click', () => {
    buttons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    state.filter = button.dataset.museumFilter || 'All';
    render();
  }));

  search?.addEventListener('input', event => {
    state.query = normalize(event.target.value.trim());
    render();
  });

  const updateProgress = () => {
    if (!progress) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    progress.style.width = `${Math.min(100, window.scrollY / max * 100)}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
  load();
})();
