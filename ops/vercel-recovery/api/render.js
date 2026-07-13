const fs = require('fs');
const path = require('path');
const routes = require('../routes.json');

const portrait = 'https://raw.githubusercontent.com/7guard-io/7ya.io/main/assets/igor-home-portrait-20260712.jpg';
const manifestPath = path.join(__dirname, '..', 'release-manifest.json');
const nav = [
  ['/', 'בית'],
  ['/igor-vepretski/', 'איגור'],
  ['/work/', 'עשייה'],
  ['/starton/', 'StartOn'],
  ['/systems/', 'מערכות'],
  ['/evidence/', 'ראיות'],
  ['/speaker/', 'במה'],
  ['/contact/', 'קשר'],
];

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>\"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  })[character]);
}

function normalizePath(value) {
  let result = String(value || '/');
  if (!result.startsWith('/')) result = `/${result}`;
  if (result !== '/' && !result.endsWith('/')) result += '/';
  return result;
}

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return {};
  }
}

function releaseContext() {
  const manifest = readManifest();
  return {
    release: manifest.release || process.env.RELEASE_ID || '2026-07-14.5-public-archive',
    sourceSha:
      process.env.VERCEL_GIT_COMMIT_SHA ||
      process.env.GITHUB_SHA ||
      process.env.SOURCE_SHA ||
      process.env.RELEASE_SOURCE_SHA ||
      manifest.source_sha ||
      'PROVENANCE_UNBOUND',
  };
}

function renderNavigation(currentPath) {
  return nav
    .map(([href, label]) => `<a href="${href}"${href === currentPath ? ' aria-current="page"' : ''}>${escapeHtml(label)}</a>`)
    .join('');
}

function renderAction(action, className = '') {
  if (!Array.isArray(action) || !action[0] || !action[1]) return '';
  const [label, href] = action;
  const attrs = href === '#ai' ? ' href="#ai" data-open-ai' : ` href="${escapeHtml(href)}"`;
  return `<a class="button ${className}"${attrs}>${escapeHtml(label)}</a>`;
}

function renderItems(items = []) {
  if (!items.length) return '';
  return `<section class="content-section" aria-labelledby="work-map-title">
    <div class="section-heading"><p>PUBLIC WORK MAP</p><h2 id="work-map-title">עשייה עם סטטוס, הקשר וגבולות.</h2></div>
    <div class="item-grid">${items.map(([status, title, text, href], index) => {
      const tag = `<span class="status status-${escapeHtml(String(status).toLowerCase().replace(/[^a-z0-9]+/g, '-'))}">${escapeHtml(status)}</span>`;
      const inner = `<div class="item-top">${tag}<b>${String(index + 1).padStart(2, '0')}</b></div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p>${href ? '<span class="item-link">לפרטים ←</span>' : ''}`;
      return href ? `<a class="work-item" href="${escapeHtml(href)}">${inner}</a>` : `<article class="work-item">${inner}</article>`;
    }).join('')}</div>
  </section>`;
}

function renderFacts(facts = []) {
  if (!facts.length) return '';
  return `<section class="facts" aria-label="עובדות וסטטוסים">${facts.map(([label, value, status]) => `<article><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><em>${escapeHtml(status)}</em></article>`).join('')}</section>`;
}

function renderTimeline(timeline = []) {
  if (!timeline.length) return '';
  return `<section class="content-section timeline-section" aria-labelledby="timeline-title">
    <div class="section-heading"><p>TRACEABLE JOURNEY</p><h2 id="timeline-title">ציר זמן בלי למחוק מורכבות.</h2></div>
    <ol class="timeline">${timeline.map(([date, status, title, text]) => `<li><div class="timeline-marker"><span>${escapeHtml(date)}</span><em>${escapeHtml(status)}</em></div><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></div></li>`).join('')}</ol>
  </section>`;
}

function renderPage(currentPath, data) {
  const canonical = `https://7ya.io${currentPath}`;
  const { release, sourceSha } = releaseContext();
  const home = currentPath === '/';
  const titleMarkup = home
    ? '<span>כל מה שבניתי.</span><em>במקום אחד.</em>'
    : escapeHtml(data.heading);

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>${escapeHtml(data.title)}</title>
  <meta name="description" content="${escapeHtml(data.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#050505">
  <meta name="7ya-release" content="${escapeHtml(release)}">
  <meta name="7ya-source-sha" content="${escapeHtml(sourceSha)}">
  <link rel="canonical" href="${canonical}">
  <link rel="stylesheet" href="/site-ai.css">
  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="7YA.IO">
  <meta property="og:title" content="${escapeHtml(data.title)}">
  <meta property="og:description" content="${escapeHtml(data.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${portrait}">
  <meta name="twitter:card" content="summary_large_image">
</head>
<body data-route="${currentPath}" class="${home ? 'is-home' : 'is-inner'}">
  <a class="skip" href="#main">דלג לתוכן</a>
  <header class="site-header">
    <a class="brand" href="/"><span>7</span><b>IGOR VEPRETSKI</b></a>
    <nav aria-label="ניווט ראשי">${renderNavigation(currentPath)}</nav>
    <button class="ai-top" type="button" data-open-ai>ASK 7YA AI</button>
  </header>
  <main id="main">
    <section class="hero ${home ? 'home-hero' : 'inner-hero'}">
      <figure class="portrait"><img src="${portrait}" alt="איגור ופרצקי" width="1600" height="1600" fetchpriority="high"></figure>
      <div class="hero-shade"></div>
      <div class="hero-copy">
        <p class="eyebrow">${escapeHtml(data.eyebrow)}</p>
        <h1>${titleMarkup}</h1>
        <p class="lead">${escapeHtml(data.lead)}</p>
        <div class="actions">${renderAction(data.primary, 'primary')}${renderAction(data.secondary)}</div>
        <div class="release-signal"><i></i><span>${escapeHtml(release)} · ${escapeHtml(sourceSha.slice(0, 12))}</span></div>
      </div>
      <div class="mission-rail">HUMAN FIRST · EVIDENCE FIRST</div>
    </section>
    ${renderFacts(data.facts)}
    ${renderItems(data.items)}
    ${renderTimeline(data.timeline)}
    <section class="status-legend" aria-label="מקרא סטטוסי ראיות">
      <div><span>VERIFIED / BUILT</span><p>מקור ישיר או מערכת שניתנת לבדיקה.</p></div>
      <div><span>DOCUMENTED / ARCHIVE</span><p>תיעוד קיים עם הקשר, אך לא בהכרח אימות מוסדי מלא.</p></div>
      <div><span>SELF-ATTESTED</span><p>ביוגרפיה ציבורית של איגור שממתינה להצמדת מקור ישיר.</p></div>
      <div><span>MISSION / DESIGN / PILOT</span><p>חזון, תכנון או פיילוט — לא תוצאה שהושלמה.</p></div>
    </section>
    <section class="final-cta">
      <p>THE ARCHIVE IS ALIVE</p>
      <h2>לא מבקשים אמון עיוור.<br>בונים משהו שאפשר לבדוק.</h2>
      <div class="actions"><a class="button primary" href="/evidence/">בדקו את הראיות</a><button class="button" type="button" data-open-ai>שאלו את 7YA AI</button></div>
    </section>
  </main>
  <footer class="site-footer"><b>IGOR VEPRETSKI / 7YA.IO</b><span>Release ${escapeHtml(release)} · <a href="/release.json">Provenance</a></span></footer>
  <script src="/ai-guide.js" defer></script>
</body>
</html>`;
}

module.exports = (request, response) => {
  const currentPath = normalizePath(request.query.route || '/');
  const data = routes[currentPath];
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.setHeader('X-Robots-Tag', data ? 'index, follow' : 'noindex');
  response.statusCode = data ? 200 : 404;
  response.end(data ? renderPage(currentPath, data) : '<!doctype html><html lang="he" dir="rtl"><head><meta name="robots" content="noindex"><title>404 | 7YA</title></head><body><h1>העמוד לא נמצא</h1><a href="/">חזרה לבית</a></body></html>');
};
