(() => {
  'use strict';

  const state = { data: null, filter: 'ALL', query: '' };
  const historicalStatuses = new Set(['RENAMED', 'BLOCKED', 'REMOVED', 'INACTIVE', 'UNKNOWN_HISTORICAL']);
  const statusLabels = {
    ACTIVE: 'פעיל', RENAMED: 'שונה / הוחלף', BLOCKED: 'חסום', REMOVED: 'הוסר', INACTIVE: 'לא פעיל', UNKNOWN_HISTORICAL: 'היסטורי / דורש אימות'
  };
  const dimensions = {
    EXPOSURE: { title: 'חשיפה', body: 'Views, reach וכניסות. מוכיחים שהמסר הגיע למסך — לא שהוא שינה עמדה.' },
    RESONANCE: { title: 'תהודה', body: 'תגובות, saves, זמן צפייה ואינטראקציה. מודדים עצירה והשתתפות, בלי להניח שכל תגובה חיובית.' },
    PROPAGATION: { title: 'הפצה', body: 'Shares, reposts, mirrors, syndication וכתבות. זה השלב שבו אדם או גוף מעביר את המסר לקהל חדש.' },
    TRANSFORMATION: { title: 'שינוי / פעולה', body: 'הצהרה פומבית על כוונה, הצטרפות, שיתוף פעולה או פעולה. זו השכבה המחמירה ביותר.' }
  };

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const normalize = value => String(value ?? '').toLocaleLowerCase('he').normalize('NFKD').replace(/\p{Diacritic}/gu, '');
  const fmt = value => new Intl.NumberFormat('en-US', { notation: value >= 1000000 ? 'compact' : 'standard', maximumFractionDigits: 1 }).format(value);
  const sourceLabel = source => source.evidence_class.replaceAll('_', ' ');

  function renderCoverage() {
    const target = $('#coverageGrid');
    if (!target || !state.data) return;
    const c = state.data.coverage || {};
    const cards = [
      [c.audited_visible_views_floor, 'צפיות נראות — רצפה מאומתת', c.audited_floor_as_of],
      [c.audited_visible_engagement_floor, 'אירועי engagement — רצפה מאומתת', c.audited_floor_as_of],
      [c.publication_instance_floor, 'רשומות פרסום מתועדות — platform instances', 'לא אנשים ייחודיים'],
      [c.grand_total_unique_people, 'אנשים ייחודיים שהושפעו', 'לא מחושב בלי deduplication']
    ];
    target.innerHTML = cards.map(([value, label, note]) => `<article class="coverage-card"><b>${value === null ? '—' : fmt(value)}</b><span>${escapeHtml(label)}</span><small>${escapeHtml(note || '')}</small></article>`).join('');
  }

  function renderDimensions() {
    const target = $('#dimensionGrid');
    if (!target || !state.data) return;
    const signals = state.data.interaction_signals || [];
    target.innerHTML = Object.entries(dimensions).map(([key, meta], index) => {
      const count = signals.filter(signal => signal.dimension === key).length;
      return `<article class="dimension-card" data-index="0${index + 1}"><h3>${escapeHtml(meta.title)}</h3><p>${escapeHtml(meta.body)}</p><b>${count} אותות מתועדים בגרסת הפתיחה</b></article>`;
    }).join('');
  }

  function surfaceMatches(surface) {
    const historical = historicalStatuses.has(surface.status);
    if (state.filter === 'ACTIVE' && historical) return false;
    if (state.filter === 'HISTORICAL' && !historical) return false;
    if (!state.query) return true;
    return normalize([surface.platform, surface.label, surface.handle, surface.status, surface.historical_note, ...(surface.sources || []).map(source => source.note)].join(' ')).includes(state.query);
  }

  function renderSurfaces() {
    const target = $('#surfaceGrid');
    if (!target || !state.data) return;
    const surfaces = (state.data.surface_nodes || []).filter(surfaceMatches).sort((a, b) => {
      const ah = historicalStatuses.has(a.status) ? 0 : 1;
      const bh = historicalStatuses.has(b.status) ? 0 : 1;
      return ah - bh || String(a.platform).localeCompare(String(b.platform));
    });
    if (!surfaces.length) {
      target.innerHTML = '<div class="empty-state">לא נמצאו משטחים התואמים לסינון.</div>';
      return;
    }
    target.innerHTML = surfaces.map(surface => {
      const historical = historicalStatuses.has(surface.status);
      const metrics = (surface.metrics || []).map(metric => `<div class="metric-chip"><b>${fmt(metric.value)}</b><small>${escapeHtml(metric.unit)} · ${escapeHtml(metric.evidence_class)} · ${escapeHtml(metric.as_of)}</small></div>`).join('');
      const sources = (surface.sources || []).slice(0, 3).map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(sourceLabel(source))} ↗</a>`).join('');
      return `<article class="surface-card${historical ? ' ghost' : ''}"><div class="surface-meta"><span>${escapeHtml(surface.platform)}</span><span class="surface-status">${escapeHtml(statusLabels[surface.status] || surface.status)}</span></div><h3>${escapeHtml(surface.label)}</h3><div class="surface-handle">${escapeHtml(surface.handle || '')}</div>${surface.historical_note ? `<p class="surface-note">${escapeHtml(surface.historical_note)}</p>` : '<p class="surface-note">משטח ציבורי פעיל המחובר לאותה ישות.</p>'}<div class="metric-list">${metrics}</div><div class="source-row">${sources}</div></article>`;
    }).join('');
  }

  function renderCascades() {
    const target = $('#cascadeGrid');
    if (!target || !state.data) return;
    const surfaceMap = new Map((state.data.surface_nodes || []).map(surface => [surface.id, surface]));
    const edges = state.data.propagation_edges || [];
    target.innerHTML = (state.data.content_families || []).map(family => {
      const familyEdges = edges.filter(edge => edge.content_family_id === family.id);
      const pathNodes = family.surface_ids.map(id => surfaceMap.get(id)).filter(Boolean);
      const path = pathNodes.map((surface, index) => `${index ? '<span class="cascade-arrow">←</span>' : ''}<span class="cascade-node">${escapeHtml(surface.platform)} · ${escapeHtml(surface.handle || surface.label)}</span>`).join('');
      return `<article class="cascade-card"><div><h3>${escapeHtml(family.title)}</h3><p>${escapeHtml(family.deduplication_rule || '')}</p><p>${familyEdges.length} propagation edges מאומתים בגרסת הפתיחה</p></div><div class="cascade-path">${path}</div></article>`;
    }).join('');
  }

  function renderOutcomes() {
    const target = $('#outcomeGrid');
    if (!target || !state.data) return;
    const outcomes = state.data.declared_outcomes || [];
    target.innerHTML = outcomes.map(outcome => `<article class="outcome-card"><div class="outcome-type">${escapeHtml(outcome.outcome_type)}</div><h3>${escapeHtml(outcome.public_actor_label)}</h3><p>${escapeHtml(outcome.paraphrase)}</p><a href="${escapeHtml(outcome.source_url)}" target="_blank" rel="noopener noreferrer">פתחו את המקור הציבורי ↗</a></article>`).join('');
  }

  function wireControls() {
    $('#surfaceSearch')?.addEventListener('input', event => { state.query = normalize(event.target.value.trim()); renderSurfaces(); });
    $$('[data-surface-filter]').forEach(button => button.addEventListener('click', () => {
      $$('[data-surface-filter]').forEach(item => item.classList.remove('active'));
      button.classList.add('active');
      state.filter = button.dataset.surfaceFilter || 'ALL';
      renderSurfaces();
    }));
  }

  async function load() {
    try {
      const response = await fetch('/knowledge/influence-graph-v1.json', { headers: { Accept: 'application/json' }, cache: 'no-store' });
      if (!response.ok) throw new Error(`graph fetch failed: ${response.status}`);
      state.data = await response.json();
      if (state.data.coverage?.grand_total_unique_people !== null) throw new Error('unique-person grand total must remain null until deduplicated');
      renderCoverage();
      renderDimensions();
      renderSurfaces();
      renderCascades();
      renderOutcomes();
    } catch (error) {
      console.error(error);
      const target = $('#surfaceGrid');
      if (target) target.innerHTML = '<div class="empty-state">מפת ההשפעה לא נטענה. המערכת נכשלת סגור במקום להציג נתון לא מאומת.</div>';
    }
  }

  wireControls();
  load();
})();
