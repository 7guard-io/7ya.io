'use strict';

(() => {
  const MANIFEST_URL = '/knowledge/igor-public-content-map-20260714.json';
  const root = document.getElementById('impact-results');
  const search = document.getElementById('impact-search');
  const count = document.getElementById('impact-result-count');
  const totalNodes = document.querySelectorAll('[data-impact-count]');
  const filterButtons = [...document.querySelectorAll('[data-filter]')];

  if (!root) return;

  const state = { records: [], filter: 'all', query: '' };

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const normalize = value => String(value ?? '')
    .normalize('NFKD')
    .toLocaleLowerCase('he-IL')
    .replace(/[\u0591-\u05C7]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const typeGroup = record => {
    const type = String(record.type || '').toLowerCase();
    if (type === 'viral' || type.includes('viral')) return 'viral';
    if (['video', 'broadcast'].includes(type) || type.includes('video')) return 'video';
    if (type === 'press' || type.includes('press')) return 'press';
    if (type === 'article' || type.includes('article')) return 'article';
    if (type === 'podcast' || type.includes('podcast')) return 'podcast';
    if (type === 'music' || type.includes('music')) return 'music';
    return type || 'other';
  };

  const matchesFilter = record => {
    if (state.filter === 'all') return true;
    const type = String(record.type || '').toLowerCase();
    const group = typeGroup(record);
    if (state.filter === 'press') return group === 'press' || type === 'broadcast';
    if (state.filter === 'video') return group === 'video' || type === 'broadcast';
    return group === state.filter;
  };

  const matchesQuery = record => {
    if (!state.query) return true;
    const haystack = normalize([
      record.title,
      record.summary,
      record.platform,
      record.language,
      record.status,
      ...(Array.isArray(record.themes) ? record.themes : []),
    ].join(' '));
    return haystack.includes(state.query);
  };

  const labelFor = record => ({
    viral: 'VIRAL POST',
    video: 'VIDEO',
    broadcast: 'BROADCAST',
    press: 'PRESS',
    article: 'WRITING',
    podcast: 'PODCAST',
    music: 'MUSIC',
    milestone: 'TIMELINE',
  }[record.type] || String(record.type || 'PUBLIC').toUpperCase());

  const initialsFor = record => {
    const parts = String(record.platform || '7YA').trim().split(/[\s/·-]+/).filter(Boolean);
    return parts.slice(0, 2).map(part => part[0]).join('').toUpperCase() || '7';
  };

  const renderCard = record => {
    const title = escapeHtml(record.title);
    const summary = escapeHtml(record.summary);
    const platform = escapeHtml(record.platform);
    const date = escapeHtml(record.date || 'תאריך בשחזור');
    const status = escapeHtml(record.status || 'PUBLIC_LINK');
    const credit = escapeHtml(record.credit || 'מקור ציבורי');
    const url = escapeHtml(record.url || '#');
    const image = record.image
      ? `<div class="atlas-card-image"><img src="${escapeHtml(record.image)}" alt="${title}" loading="lazy"></div>`
      : `<div class="atlas-card-image atlas-card-fallback" aria-hidden="true"><span>${escapeHtml(initialsFor(record))}</span></div>`;
    const themes = Array.isArray(record.themes)
      ? record.themes.slice(0, 3).map(theme => `<span>${escapeHtml(theme)}</span>`).join('')
      : '';

    return `<a class="atlas-card" href="${url}" target="_blank" rel="noopener noreferrer" data-type="${escapeHtml(typeGroup(record))}">
      ${image}
      <div class="atlas-card-body">
        <div class="atlas-card-meta"><span>${escapeHtml(labelFor(record))}</span><time>${date}</time></div>
        <h3>${title}</h3>
        <p>${summary}</p>
        <div class="atlas-tags">${themes}</div>
        <div class="atlas-source"><span>${platform}</span><b>${status}</b></div>
        <small>${credit}</small>
      </div>
    </a>`;
  };

  const sortedRecords = records => [...records].sort((a, b) => {
    const featured = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    if (featured) return featured;
    const yearA = Number(a.year || String(a.date || '').slice(0, 4) || 0);
    const yearB = Number(b.year || String(b.date || '').slice(0, 4) || 0);
    if (yearB !== yearA) return yearB - yearA;
    return String(a.title || '').localeCompare(String(b.title || ''), 'he');
  });

  const render = () => {
    const visible = sortedRecords(state.records.filter(record => matchesFilter(record) && matchesQuery(record)));
    root.innerHTML = visible.length
      ? visible.map(renderCard).join('')
      : '<div class="atlas-empty"><b>לא נמצאו פריטים בהתאמה.</b><span>נסו נושא אחר או חזרו לתצוגת הכול.</span></div>';
    if (count) count.textContent = `${visible.length} מתוך ${state.records.length} רשומות ציבוריות`;
  };

  const load = async () => {
    try {
      const response = await fetch(MANIFEST_URL, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Manifest HTTP ${response.status}`);
      const data = await response.json();
      if (!data || !Array.isArray(data.records)) throw new Error('Manifest records missing');
      state.records = data.records.filter(record => record && record.title && record.url);
      totalNodes.forEach(node => { node.textContent = String(state.records.length); });
      render();
    } catch (error) {
      console.error('7YA impact atlas load failed', error);
      root.innerHTML = `<div class="atlas-empty"><b>הארכיון הדינמי אינו זמין כרגע.</b><span>מקורות הליבה והקישורים הציבוריים נשארים פתוחים בהמשך העמוד.</span><a href="${MANIFEST_URL}">פתיחת מניפסט המקורות</a></div>`;
      if (count) count.textContent = 'מצב גיבוי פעיל';
    }
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      state.filter = button.dataset.filter || 'all';
      filterButtons.forEach(candidate => {
        const active = candidate === button;
        candidate.classList.toggle('is-active', active);
        candidate.setAttribute('aria-pressed', String(active));
      });
      render();
    });
  });

  search?.addEventListener('input', event => {
    state.query = normalize(event.currentTarget.value);
    render();
  });

  load();
})();
