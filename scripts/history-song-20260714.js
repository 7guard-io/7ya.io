(() => {
  'use strict';

  const state = { records: [], filter: 'All', query: '' };
  const selectors = {
    grid: document.querySelector('#archiveGrid'),
    count: document.querySelector('#recordCount'),
    empty: document.querySelector('#archiveEmpty'),
    search: document.querySelector('#archiveSearch'),
    filters: [...document.querySelectorAll('[data-filter]')],
    progress: document.querySelector('.progress span')
  };

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

  const platformClass = platform => normalize(platform)
    .replace(/[^a-z0-9א-ת]+/g, '-')
    .replace(/^-|-$/g, '');

  const tierLabel = tier => ({
    TIER_1: 'TIER 1 · מקור חיצוני',
    TIER_2: 'TIER 2 · מקור רשמי',
    TIER_3: 'TIER 3 · snapshot'
  }[tier] || tier || 'SOURCE');

  const getYear = record => record.date ? record.date.slice(0, 4) : (record.year || 'ללא תאריך');

  const buildMedia = record => {
    if (!record.image) return '';
    return `<div class="archive-card-media"><img src="${escapeHtml(record.image)}" alt="" loading="lazy"></div>`;
  };

  const buildMetric = record => {
    if (!record.metric) return '';
    const asOf = record.metric.as_of ? ` · ${escapeHtml(record.metric.as_of)}` : '';
    return `<div class="archive-card-metric"><b>${escapeHtml(record.metric.label)}:</b> ${escapeHtml(record.metric.value)}${asOf}</div>`;
  };

  const buildCard = record => {
    const tags = (record.themes || []).slice(0, 3).map(tag => `<span>${escapeHtml(tag)}</span>`).join('');
    const external = /^https?:\/\//.test(record.url || '');
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const publisher = record.publisher || record.platform;
    return `
      <a class="archive-card platform-${platformClass(record.platform)}" href="${escapeHtml(record.url || '#')}"${attrs}>
        ${buildMedia(record)}
        <div class="archive-card-body">
          <div class="archive-card-meta">
            <span>${escapeHtml(record.platform)} · ${escapeHtml(record.id)}</span>
            <span>${escapeHtml(getYear(record))}</span>
          </div>
          <h3>${escapeHtml(record.title)}</h3>
          <p>${escapeHtml(record.summary || '')}</p>
          <div class="archive-card-tags">${tags}</div>
          ${buildMetric(record)}
          <div class="archive-card-footer">
            <b>${escapeHtml(tierLabel(record.evidence_tier))}</b>
            <span>${escapeHtml(publisher)} ↗</span>
          </div>
        </div>
      </a>`;
  };

  const matchesFilter = record => state.filter === 'All' || record.platform === state.filter;
  const matchesQuery = record => {
    if (!state.query) return true;
    const haystack = normalize([
      record.title, record.summary, record.platform, record.publisher,
      record.type, record.language, record.act, record.verification, ...(record.themes || [])
    ].join(' '));
    return haystack.includes(state.query);
  };

  const render = () => {
    if (!selectors.grid) return;
    const filtered = state.records
      .filter(matchesFilter)
      .filter(matchesQuery)
      .sort((a, b) => {
        const ay = Number(a.year || 0);
        const by = Number(b.year || 0);
        if (ay !== by) return by - ay;
        return String(b.date || '').localeCompare(String(a.date || ''));
      });

    selectors.grid.innerHTML = filtered.map(buildCard).join('');
    if (selectors.count) selectors.count.textContent = String(filtered.length);
    if (selectors.empty) selectors.empty.hidden = filtered.length !== 0;
  };

  const loadArchive = async () => {
    if (!selectors.grid) return;
    const paths = [1, 2, 3, 4, 5].map(part => `/knowledge/history-song-records-${part}.json`);
    try {
      const responses = await Promise.all(paths.map(path => fetch(path, {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      })));
      const failed = responses.find(response => !response.ok);
      if (failed) throw new Error(`archive fetch failed: ${failed.status}`);
      const parts = await Promise.all(responses.map(response => response.json()));
      state.records = parts.flatMap(part => Array.isArray(part.records) ? part.records : []);
      if (state.records.length !== 66) throw new Error(`expected 66 archive records, received ${state.records.length}`);
      render();
    } catch (error) {
      console.error(error);
      selectors.grid.innerHTML = `
        <article class="archive-card">
          <div class="archive-card-body">
            <div class="archive-card-meta"><span>ARCHIVE</span><span>OFFLINE</span></div>
            <h3>הארכיון לא נטען כרגע</h3>
            <p>רשומות הליבה נשארות לאורך העמוד. קובצי המקור פתוחים לבדיקה ישירה.</p>
            <div class="archive-card-footer"><b>FAIL CLOSED</b><a href="/knowledge/history-song-records-1.json">פתחו JSON</a></div>
          </div>
        </article>`;
      if (selectors.count) selectors.count.textContent = '—';
    }
  };

  selectors.filters.forEach(button => {
    button.addEventListener('click', () => {
      selectors.filters.forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      state.filter = button.dataset.filter || 'All';
      render();
    });
  });

  selectors.search?.addEventListener('input', event => {
    state.query = normalize(event.target.value.trim());
    render();
  });

  document.querySelectorAll('[data-scroll]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelector(button.dataset.scroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const updateProgress = () => {
    if (!selectors.progress) return;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    selectors.progress.style.width = `${Math.min(100, (window.scrollY / max) * 100)}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  if ('IntersectionObserver' in window) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          reveal.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px' });
    document.querySelectorAll('.reveal').forEach(element => reveal.observe(element));
  } else {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
  }

  loadArchive();
})();
