(() => {
  'use strict';

  const form = document.querySelector('#responseForm');
  const input = document.querySelector('#responseQuery');
  const grid = document.querySelector('#responseGrid');
  const summary = document.querySelector('#responseSummary');
  const status = document.querySelector('#responseStatus');
  const modeButtons = [...document.querySelectorAll('[data-response-mode]')];
  const countSignals = document.querySelector('#signalCount');
  const countRecords = document.querySelector('#publicRecordCount');
  const countComments = document.querySelector('#commentRecordCount');
  let mode = 'strongest';
  let signals = [];
  let records = [];

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const normalize = value => String(value ?? '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0591-\u05c7]/g, '')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const compact = value => new Intl.NumberFormat('he-IL', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

  function searchableText(signal) {
    return normalize([
      signal.headline,
      signal.interpretation,
      signal.topic,
      signal.platform,
      signal.signal_type,
      signal.stance_status,
      signal.record?.title,
      signal.record?.summary,
      ...(signal.record?.themes || []),
    ].join(' '));
  }

  function queryMatches(signal, query) {
    const terms = normalize(query).split(' ').filter(term => term.length > 1);
    if (!terms.length) return true;
    const text = searchableText(signal);
    return terms.some(term => text.includes(term));
  }

  function modeAllows(signal) {
    const metrics = signal.metrics || {};
    if (mode === 'positive') {
      return ['POSITIVE_EXTERNAL_FRAMING', 'CONSTRUCTIVE_EXTERNAL_FRAMING'].includes(signal.stance_status);
    }
    if (mode === 'discussion') return Number(metrics.comments || metrics.comment_records || 0) > 0;
    if (mode === 'external') return signal.evidence_tier === 'TIER_1';
    return true;
  }

  function scoreSignal(signal, query) {
    const text = searchableText(signal);
    const terms = normalize(query).split(' ').filter(term => term.length > 1);
    const queryScore = terms.reduce((score, term) => score + (text.includes(term) ? 12 : 0), 0);
    const metrics = signal.metrics || {};
    const volume = Object.values(metrics).reduce((sum, value) => sum + (Number(value) || 0), 0);
    const volumeScore = Math.min(40, Math.log10(Math.max(1, volume)) * 9);
    const tierScore = signal.evidence_tier === 'TIER_1' ? 18 : signal.evidence_tier === 'TIER_2' ? 12 : 10;
    const discussionScore = Number(metrics.comments || metrics.comment_records || 0) > 0 ? 8 : 0;
    const modeScore = mode === 'discussion'
      ? Math.min(30, Math.log10(Math.max(1, metrics.comments || metrics.comment_records || 0)) * 10)
      : mode === 'external'
        ? 28
        : mode === 'positive'
          ? 32
          : 14;
    return queryScore + volumeScore + tierScore + discussionScore + modeScore;
  }

  function metricLabel(key) {
    return ({
      views: 'צפיות',
      likes: 'לייקים',
      reactions: 'תגובות',
      comments: 'תגובות־טקסט',
      shares: 'שיתופים',
      saves: 'שמירות',
      comment_records: 'רשומות תגובה',
    })[key] || key;
  }

  function stanceLabel(value) {
    return ({
      POSITIVE_EXTERNAL_FRAMING: 'מסגור חיובי חיצוני',
      CONSTRUCTIVE_EXTERNAL_FRAMING: 'מסגור בונה חיצוני',
      UNDETERMINED_FROM_AGGREGATES: 'עמדה לא נקבעת ממדדים',
      HUMAN_REVIEW_REQUIRED: 'נדרשת בדיקה אנושית',
    })[value] || 'סטטוס עמדה לא מוגדר';
  }

  function renderMetrics(metrics = {}) {
    const entries = Object.entries(metrics).filter(([, value]) => Number(value) > 0);
    if (!entries.length) return '';
    return `<div class="response-metrics">${entries.map(([key, value]) => `<span>${escapeHtml(metricLabel(key))}: ${escapeHtml(compact(Number(value)))}</span>`).join('')}</div>`;
  }

  function renderCard(signal) {
    return `
      <article class="response-card" data-tier="${escapeHtml(signal.evidence_tier)}">
        <span class="signal-kicker">${escapeHtml(signal.platform)} · ${escapeHtml(signal.topic)}</span>
        <h3>${escapeHtml(signal.headline)}</h3>
        <p>${escapeHtml(signal.interpretation)}</p>
        ${renderMetrics(signal.metrics)}
        <div class="response-meta">
          <span>${escapeHtml(signal.evidence_tier)}</span>
          <span>${escapeHtml(stanceLabel(signal.stance_status))}</span>
          <span>${escapeHtml(signal.confidence)} confidence</span>
          <span>${escapeHtml(signal.as_of)}</span>
        </div>
        <a href="${escapeHtml(signal.source_url)}" target="_blank" rel="noopener noreferrer">פתחו מקור ציבורי ↗</a>
      </article>`;
  }

  function buildSummary(results, query) {
    if (!results.length) {
      summary.innerHTML = '<h3>לא נמצא בסיס מספיק</h3><p>המערכת לא תמציא היענות או עמדה. נסו נושא רחב יותר או מצב ניתוח אחר.</p>';
      return;
    }
    const total = results.reduce((acc, item) => {
      for (const [key, value] of Object.entries(item.metrics || {})) acc[key] = (acc[key] || 0) + (Number(value) || 0);
      return acc;
    }, {});
    const topTopics = [...new Set(results.map(item => item.topic))].slice(0, 3).join(' · ');
    const queryText = query ? `לשאילתה “${escapeHtml(query)}”` : 'במאגר הנוכחי';
    const metricParts = Object.entries(total)
      .filter(([, value]) => value > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([key, value]) => `${escapeHtml(compact(value))} ${escapeHtml(metricLabel(key))}`)
      .join(' · ');
    const modeNote = mode === 'positive'
      ? 'התוצאות במצב זה מוגבלות למסגור חיובי או בונה שמופיע במקור חיצוני.'
      : 'זהו ניתוח היענות, לא הוכחה שכל המגיבים הסכימו עם המסר.';
    summary.innerHTML = `<h3>תמונת ההיענות ${queryText}</h3><p>${escapeHtml(results.length)} אותות מתועדים נמצאו. הנושאים הבולטים: ${escapeHtml(topTopics)}.${metricParts ? ` מדדים מצטברים בתוצאות: ${metricParts}.` : ''} ${escapeHtml(modeNote)}</p>`;
  }

  function analyze(query = '') {
    const ranked = signals
      .filter(signal => modeAllows(signal) && queryMatches(signal, query))
      .map(signal => ({ ...signal, score: scoreSignal(signal, query) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
    buildSummary(ranked, query);
    grid.innerHTML = ranked.length ? ranked.map(renderCard).join('') : '<div class="response-empty">לא נמצאו אותות מתועדים עבור החיפוש והמצב שנבחרו.</div>';
    status.textContent = `${ranked.length} אותות מוצגים · ניתוח מקומי מהיר · ללא פרסום אוטומטי`;
  }

  async function load() {
    status.textContent = 'טוען את מאגר ההיענות הציבורית…';
    try {
      const shardUrls = [1, 2, 3, 4, 5].map(part => `/knowledge/history-song-records-${part}.json`);
      const [signalResponse, ...shardResponses] = await Promise.all([
        fetch('/knowledge/public-response-signals-20260715.json', { cache: 'no-store' }),
        ...shardUrls.map(url => fetch(url, { cache: 'no-store' })),
      ]);
      if (!signalResponse.ok || shardResponses.some(response => !response.ok)) throw new Error('response data unavailable');
      const signalData = await signalResponse.json();
      const shards = await Promise.all(shardResponses.map(response => response.json()));
      records = shards.flatMap(shard => Array.isArray(shard.records) ? shard.records : []);
      const byId = new Map(records.map(record => [record.id, record]));
      signals = (signalData.signals || []).map(signal => ({ ...signal, record: byId.get(signal.record_id) || null }));
      if (countSignals) countSignals.textContent = String(signals.length);
      if (countRecords) countRecords.textContent = String(signalData.coverage?.canonical_public_records || records.length);
      if (countComments) countComments.textContent = new Intl.NumberFormat('he-IL').format(signalData.coverage?.validated_tiktok_live_comment_records || 0);
      analyze('');
    } catch (error) {
      console.error(error);
      status.textContent = 'שכבת הנתונים לא נטענה. לא מוצגת טענה חלופית לא מאומתת.';
      summary.innerHTML = '<h3>המאגר לא זמין כרגע</h3><p>7YA נכשלת סגור: אין נתונים — אין טענת השפעה.</p>';
      grid.innerHTML = '<div class="response-empty">נסו שוב מאוחר יותר או עברו ל־Evidence Ledger.</div>';
    }
  }

  modeButtons.forEach(button => button.addEventListener('click', () => {
    modeButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    mode = button.dataset.responseMode || 'strongest';
    analyze(input?.value || '');
  }));

  form?.addEventListener('submit', event => {
    event.preventDefault();
    analyze(input?.value || '');
  });

  load();
})();
