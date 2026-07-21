(() => {
  'use strict';

  const state = {
    records: [],
    filter: 'All',
    query: '',
    coreCount: 0,
    universeCount: 0,
    forensicCount: 0,
    forensic: null,
  };

  const grid = document.querySelector('#museumGrid');
  const count = document.querySelector('#museumCount');
  const coreCount = document.querySelector('#museumCoreCount');
  const universeCount = document.querySelector('#museumUniverseCount');
  const forensicCount = document.querySelector('#museumForensicCount');
  const facebookCount = document.querySelector('#museumFacebookCount');
  const tiktokCount = document.querySelector('#museumTikTokCount');
  const screenshotCount = document.querySelector('#museumScreenshotCount');
  const tiktokLedger = document.querySelector('#museumTikTokLedger');
  const scopeNote = document.querySelector('#museumScopeNote');
  const search = document.querySelector('#museumSearch');
  const empty = document.querySelector('#museumEmpty');
  const buttons = [...document.querySelectorAll('[data-museum-filter]')];
  const progress = document.querySelector('.reading-progress span');

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
    TIER_3: 'Export / Snapshot',
  }[tier] || 'מקור ציבורי');

  const collectionLabel = collection => ({
    VERIFIED_CORE: 'VERIFIED CORE',
    PUBLIC_UNIVERSE: 'PUBLIC UNIVERSE',
    DRIVE_FORENSIC: 'DRIVE FORENSIC',
  }[collection] || 'PUBLIC SOURCE');

  const captureLabel = record => {
    if (record.capture_status === 'CAPTURED') return 'CAPTURED';
    if (record.capture_status === 'OFFICIAL_PAGE') return 'OFFICIAL PAGE';
    if (record.capture_status === 'SCREENSHOT_REQUIRED') return 'SCREENSHOT REQUIRED';
    if (record.capture_status === 'SCREENSHOT_QUEUED') return 'SCREENSHOT QUEUED';
    if (record.image) return 'OFFICIAL THUMBNAIL';
    return 'SOURCE CARD';
  };

  const yearLabel = record => record.date?.slice(0, 4) || record.year || 'ללא תאריך';

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

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

  function youtubeThumbnail(urlValue) {
    try {
      const url = new URL(urlValue);
      let id = '';
      if (url.hostname === 'youtu.be') id = url.pathname.split('/').filter(Boolean)[0] || '';
      if (/youtube\.com$/.test(url.hostname) || url.hostname.endsWith('.youtube.com')) {
        id = url.searchParams.get('v') || '';
        if (!id && url.pathname.startsWith('/shorts/')) id = url.pathname.split('/')[2] || '';
      }
      return id ? `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg` : '';
    } catch {
      return '';
    }
  }

  function visualSource(record) {
    if (record.image) return { src: record.image, label: 'OFFICIAL THUMBNAIL' };
    const youtube = youtubeThumbnail(record.url);
    if (youtube) return { src: youtube, label: 'YOUTUBE THUMBNAIL' };
    return null;
  }

  function sourceHost(record) {
    try { return new URL(record.url).hostname.replace(/^www\./, ''); }
    catch { return 'source'; }
  }

  function visualWeight(record, index) {
    if (['feature', 'wide'].includes(record.visual_weight)) return record.visual_weight;
    if (record.image && index % 7 === 0) return 'wide';
    if (index % 13 === 0) return 'feature';
    return 'standard';
  }

  function appendTags(parent, record) {
    const row = element('div', 'capture-tags');
    for (const tag of (record.themes || []).slice(0, 3)) row.append(element('span', '', tag));
    parent.append(row);
  }

  function appendMetric(parent, record) {
    if (!record.metric) return;
    const metric = element('div', 'capture-metric');
    metric.append(element('b', '', `${record.metric.label}: `));
    metric.append(document.createTextNode(`${record.metric.value} · ${record.metric.as_of}`));
    parent.append(metric);
  }

  function mediaNode(record) {
    const media = element('div', 'capture-media');
    const visual = visualSource(record);
    if (visual) {
      const img = document.createElement('img');
      img.src = visual.src;
      img.alt = record.title || '';
      img.loading = 'lazy';
      img.referrerPolicy = 'no-referrer';
      media.append(img, element('span', 'media-origin', visual.label));
      return media;
    }

    const poster = element('div', `source-poster ${platformClass(record.platform)}`);
    poster.append(
      element('small', '', record.platform || 'SOURCE'),
      element('strong', '', record.title || 'Public source'),
      element('span', '', sourceHost(record)),
    );
    media.append(poster, element('span', 'media-origin', 'SOURCE CARD · NOT A SCREENSHOT'));
    return media;
  }

  function card(record, index) {
    const anchor = element('a', `source-capture weight-${visualWeight(record, index)}`);
    anchor.href = record.url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    anchor.dataset.tier = record.evidence_tier || '';
    anchor.dataset.collection = record.collection || '';
    anchor.dataset.capture = record.capture_status || '';

    const browser = element('div', 'capture-browser');
    browser.append(element('i'), element('i'), element('i'), element('span', '', sourceHost(record)));

    const body = element('div', 'capture-body');
    const meta = element('div', 'capture-meta');
    meta.append(element('span', '', `${record.platform} · ${record.id}`), element('span', '', yearLabel(record)));
    body.append(meta);

    const labels = element('div', 'capture-label-row');
    labels.append(
      element('span', 'capture-collection', collectionLabel(record.collection)),
      element('span', `capture-badge ${platformClass(captureLabel(record))}`, captureLabel(record)),
    );
    body.append(labels, element('h3', '', record.title), element('p', '', record.summary || ''));
    appendTags(body, record);
    appendMetric(body, record);

    const footer = element('div', 'capture-footer');
    footer.append(element('b', '', tierLabel(record.evidence_tier)), element('span', '', `${record.publisher || record.platform} ↗`));
    body.append(footer);

    anchor.append(browser, mediaNode(record), body);
    return anchor;
  }

  function matches(record) {
    if (state.filter !== 'All' && record.platform !== state.filter) return false;
    if (!state.query) return true;
    const haystack = normalize([
      record.id, record.title, record.summary, record.platform, record.publisher,
      record.type, record.language, record.act, record.verification, record.collection,
      record.capture_status, ...(record.themes || []),
    ].join(' '));
    return haystack.includes(state.query);
  }

  function render() {
    if (!grid) return;
    const records = state.records
      .filter(matches)
      .sort((a, b) => {
        const weight = { feature: 3, wide: 2, standard: 1 };
        const aw = weight[a.visual_weight] || 0;
        const bw = weight[b.visual_weight] || 0;
        if (aw !== bw) return bw - aw;
        const ad = String(a.date || a.year || '');
        const bd = String(b.date || b.year || '');
        if (ad !== bd) return bd.localeCompare(ad);
        return String(a.title || '').localeCompare(String(b.title || ''), 'he');
      });

    grid.replaceChildren(...records.map(card));
    if (count) count.textContent = String(records.length);
    if (coreCount) coreCount.textContent = String(state.coreCount);
    if (universeCount) universeCount.textContent = String(state.universeCount);
    if (forensicCount) forensicCount.textContent = String(state.forensicCount);
    if (empty) empty.hidden = records.length !== 0;
  }

  function renderTikTokLedger(forensic) {
    if (!tiktokLedger) return;
    const rows = Array.isArray(forensic?.tiktok_ledger) ? forensic.tiktok_ledger.slice(0, 10) : [];
    if (!rows.length) {
      tiktokLedger.textContent = 'Ledger אינו זמין כרגע.';
      return;
    }
    const fragment = document.createDocumentFragment();
    for (const item of rows) {
      const row = element('div', 'tiktok-ledger-row');
      row.append(
        element('b', '', String(item.rank).padStart(2, '0')),
        element('span', '', item.date),
        element('strong', '', Number(item.likes).toLocaleString('en-US')),
        element('small', '', item.sound),
      );
      fragment.append(row);
    }
    tiktokLedger.replaceChildren(fragment);
  }

  async function fetchJson(path, required = true) {
    const response = await fetch(path, { cache: 'no-store', headers: { Accept: 'application/json' } });
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
    const forensicPath = '/knowledge/igor-drive-forensic-archive-20260721.json';

    try {
      const [coreShards, universe, forensic] = await Promise.all([
        Promise.all(corePaths.map(path => fetchJson(path, true))),
        fetchJson(universePath, false),
        fetchJson(forensicPath, false),
      ]);

      const coreRecords = coreShards.flatMap(shard => Array.isArray(shard.records) ? shard.records : []);
      if (coreRecords.length < 66) throw new Error(`Verified core is incomplete: ${coreRecords.length}`);
      const universeRecords = Array.isArray(universe?.records) ? universe.records : [];
      const forensicRecords = Array.isArray(forensic?.records) ? forensic.records : [];

      const merged = [
        ...coreRecords.map(record => ({ ...record, collection: 'VERIFIED_CORE' })),
        ...universeRecords.map(record => ({ ...record, collection: 'PUBLIC_UNIVERSE' })),
        ...forensicRecords.map(record => ({ ...record, collection: 'DRIVE_FORENSIC' })),
      ];

      const unique = new Map();
      for (const record of merged) {
        const key = canonicalSourceKey(record);
        const existing = unique.get(key);
        if (!existing || record.collection === 'DRIVE_FORENSIC') unique.set(key, record);
      }

      state.records = [...unique.values()];
      state.coreCount = coreRecords.length;
      state.universeCount = universeRecords.length;
      state.forensicCount = forensicRecords.length;
      state.forensic = forensic;

      const stats = forensic?.stats || {};
      if (facebookCount) facebookCount.textContent = String(stats.facebook_graph_nodes ?? state.forensicCount);
      if (tiktokCount) tiktokCount.textContent = String(stats.tiktok_exported_posts ?? 904);
      if (screenshotCount) screenshotCount.textContent = String(stats.screenshot_queue_open ?? 7);
      if (scopeNote) scopeNote.textContent = `ליבת ראיות: ${state.coreCount} · Public Universe: ${state.universeCount} · Drive פורנזי: ${state.forensicCount} · האינדקס ממשיך להתרחב`;

      renderTikTokLedger(forensic);
      render();
    } catch (error) {
      console.error(error);
      const fallback = element('article', 'source-capture archive-error-card');
      fallback.append(
        element('div', 'capture-browser', '7ya.io'),
        element('div', 'capture-media', 'OFFLINE'),
        element('div', 'capture-body', 'קיר התוכן לא נטען כרגע. קובצי המקור נשארים זמינים ואינם מוחלפים בנתונים מומצאים.'),
      );
      grid.replaceChildren(fallback);
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

  const requestedPlatform = new URLSearchParams(window.location.search).get('platform');
  if (requestedPlatform) {
    const requestedButton = buttons.find(button => button.dataset.museumFilter === requestedPlatform);
    if (requestedButton) {
      buttons.forEach(button => button.classList.remove('active'));
      requestedButton.classList.add('active');
      state.filter = requestedPlatform;
    }
  }

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
