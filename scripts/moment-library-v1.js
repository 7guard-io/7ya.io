(() => {
  const state = { moments: [], platform: 'all', role: 'all' };
  const grid = document.getElementById('momentGrid');
  const empty = document.getElementById('emptyState');
  const status = document.getElementById('sourceStatus');
  const roleFilter = document.getElementById('roleFilter');
  const platformFilters = document.getElementById('platformFilters');
  const randomButton = document.getElementById('randomMoment');

  const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const yearOf = value => String(value || '').match(/(?:19|20)\d{2}/)?.[0] || 'ללא תאריך';
  const sourceHost = raw => { try { return new URL(raw).hostname.replace(/^www\./, ''); } catch { return ''; } };

  function youtubeId(raw) {
    try {
      const url = new URL(raw);
      if (url.hostname.includes('youtu.be')) return url.pathname.slice(1);
      return url.searchParams.get('v') || '';
    } catch { return ''; }
  }

  function previewUrl(moment) {
    const yt = youtubeId(moment.sourceUrl);
    if (yt) return `https://i.ytimg.com/vi/${encodeURIComponent(yt)}/hqdefault.jpg`;
    return `https://image.thum.io/get/noanimate/width/900/crop/760/maxAge/24/${moment.sourceUrl}`;
  }

  function storyLabel(role) {
    const labels = {
      origin: 'מקור', identity: 'זהות', fatherhood: 'אבהות', starton: 'StartOn', creation: 'יצירה', spirituality: 'רוח', 'public-voice': 'קול ציבורי', 'public-leadership': 'מנהיגות ציבורית', '7ya': '7YA'
    };
    return labels[role] || role || 'רגע';
  }

  function visibleMoments() {
    return state.moments.filter(moment => {
      if (moment.review === 'manual-review-required') return false;
      if (state.platform !== 'all' && moment.platform !== state.platform) return false;
      if (state.role !== 'all') {
        if (state.role === 'origin') return ['origin', 'identity'].includes(moment.storyRole);
        if (moment.storyRole !== state.role) return false;
      }
      return true;
    }).sort((a,b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')));
  }

  function render() {
    const items = visibleMoments();
    empty.hidden = items.length > 0;
    grid.innerHTML = items.map(moment => `
      <article class="moment-card" id="${escapeHtml(moment.id)}" data-platform="${escapeHtml(moment.platform)}" data-role="${escapeHtml(moment.storyRole)}">
        <div class="moment-media" aria-hidden="true"><img loading="lazy" decoding="async" src="${escapeHtml(previewUrl(moment))}" alt=""></div>
        <div class="moment-body">
          <div class="moment-kicker"><span>${escapeHtml(yearOf(moment.publishedAt))} · ${escapeHtml(moment.platform)}</span><span>${escapeHtml(moment.accountRole)}</span></div>
          <h2>${escapeHtml(moment.title)}</h2>
          <div class="moment-meta"><span>${escapeHtml(storyLabel(moment.storyRole))}</span><span>${escapeHtml(moment.trust)}</span><span>${escapeHtml(sourceHost(moment.sourceUrl))}</span></div>
          <a class="moment-source" href="${escapeHtml(moment.sourceUrl)}" target="_blank" rel="noopener noreferrer">פתח את המקור ↗</a>
        </div>
      </article>`).join('');
    status.textContent = `${items.length} רגעים מוצגים · מקור לפני פרשנות · בלי מדיה גנרית`;
  }

  platformFilters?.addEventListener('click', event => {
    const button = event.target.closest('button[data-platform]');
    if (!button) return;
    state.platform = button.dataset.platform;
    platformFilters.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    render();
  });

  roleFilter?.addEventListener('change', () => { state.role = roleFilter.value; render(); });

  randomButton?.addEventListener('click', () => {
    const items = visibleMoments();
    if (!items.length) return;
    const moment = items[Math.floor(Math.random() * items.length)];
    const node = document.getElementById(moment.id);
    if (!node) return;
    document.querySelectorAll('.moment-highlight').forEach(item => item.classList.remove('moment-highlight'));
    node.classList.add('moment-highlight');
    node.scrollIntoView({behavior:'smooth', block:'center'});
    window.setTimeout(() => node.classList.remove('moment-highlight'), 1800);
  });

  fetch('/knowledge/moment-library-social-v1.json', {cache:'no-store'})
    .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(data => {
      state.moments = Array.isArray(data.moments) ? data.moments : [];
      render();
    })
    .catch(error => {
      status.textContent = `ספריית הרגעים לא נטענה: ${error.message}`;
      empty.hidden = false;
    });
})();
