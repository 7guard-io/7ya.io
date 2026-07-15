(() => {
  'use strict';

  const state = { records: [], filter: 'All', query: '', coreCount: 0, universeCount: 0 };
  const grid = document.querySelector('#museumGrid');
  const count = document.querySelector('#museumCount');
  const coreCount = document.querySelector('#museumCoreCount');
  const universeCount = document.querySelector('#museumUniverseCount');
  const scopeNote = document.querySelector('#museumScopeNote');
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

  const collectionLabel = collection => collection === 'PUBLIC_UNIVERSE'
    ? 'PUBLIC UNIVERSE'
    : 'VERIFIED CORE';

  const yearLabel = record => record.date?.slice(0, 4) || record.year || 'ללא תאריך';

  function canonicalSourceKey(record) {
    try {
      const url = new URL(record.url);
      url.hash = '';
      for (const key of [...url.searchParams.keys()]) {
        if (/^(utm_|trk$|mibextid$|hl$|pid$)/i.test(key)) url.searchParams.delete(key);
      }
      const host = url.hostname.replace(/^www\./, '').toLowerCase();
      const path = url.pathname.replace(/\/+$/, '') || '/';
      const query = [...url.searchParams.entries()].sort().map(([key, value]) => `${key}=${value}`).join('&');
      return `${host}${path}${query ? `?${query}` : ''}`;
    } catch {
      return `id:${record.id}`;
    }
  }

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
      <a class="source-capture" data-tier="${escapeHtml(record.evidence_tier)}" data-collection="${escapeHtml(record.collection)}" href="${escapeHtml(record.url)}" target="_blank" rel="noopener noreferrer">
        <div class="capture-browser"><i></i><i></i><i></i><span>${escapeHtml(host)}</span></div>
        ${media(record)}
        <div class="capture-body">
          <div class="capture-meta"><span>${escapeHtml(record.platform)} · ${escapeHtml(record.id)}</span><span>${escapeHtml(yearLabel(record))}</span></div>
          <div class="capture-collection">${escapeHtml(collectionLabel(record.collection))}</div>
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
      record.type, record.language, record.act, record.verification, record.collection,
      ...(record.themes || [])
    ].join(' '));
    return haystack.includes(state.query);
  }

  function render() {
    if (!grid) return;
    const records = state.records
      .filter(matches)
      .sort((a, b) => {
        const ad = String(a.date || a.year || '');
        const bd = String(b.date || b.year || '');
        if (ad !== bd) return bd.localeCompare(ad);
        return String(a.title || '').localeCompare(String(b.title || ''), 'he');
      });
    grid.innerHTML = records.map(card).join('');
    if (count) count.textContent = String(records.length);
    if (coreCount) coreCount.textContent = String(state.coreCount);
    if (universeCount) universeCount.textContent = String(state.universeCount);
    if (empty) empty.hidden = records.length !== 0;
  }

  async function fetchJson(path, required = true) {
    const response = await fetch(path, {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
      if (required) throw new Error(`Museum archive fetch failed: ${path} · ${response.status}`);
      return null;
    }
    return response.json();
  }

  async function load() {
    if (!grid) return;
    const corePaths = [1, 2, 3, 4, 5].map(part => `/knowledge/history-song-records-${part}.json`);
    const universePath = '/knowledge/public-universe-records-20260715.json';

    try {
      const coreShards = await Promise.all(corePaths.map(path => fetchJson(path, true)));
      const coreRecords = coreShards.flatMap(shard => Array.isArray(shard.records) ? shard.records : []);
      if (coreRecords.length < 66) throw new Error(`Verified core is incomplete: ${coreRecords.length}`);

      let universeRecords = [];
      try {
        const universe = await fetchJson(universePath, false);
        universeRecords = Array.isArray(universe?.records) ? universe.records : [];
      } catch (error) {
        console.warn('Public Universe layer unavailable; serving verified core only.', error);
      }

      const merged = [
        ...coreRecords.map(record => ({ ...record, collection: 'VERIFIED_CORE' })),
        ...universeRecords.map(record => ({ ...record, collection: 'PUBLIC_UNIVERSE' }))
      ];

      const unique = new Map();
      for (const record of merged) {
        const key = canonicalSourceKey(record);
        if (!unique.has(key)) unique.set(key, record);
      }

      state.records = [...unique.values()];
      state.coreCount = state.records.filter(record => record.collection === 'VERIFIED_CORE').length;
      state.universeCount = state.records.filter(record => record.collection === 'PUBLIC_UNIVERSE').length;
      if (scopeNote) {
        scopeNote.textContent = `ליבת ראיות: ${state.coreCount} · מקורות והדהודים נוספים: ${state.universeCount} · האינדקס ממשיך להתרחב`;
      }
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
