const routes = require('../routes.json');

const sourceSha = '2c65a181a666b6fad7f0d431877c2154b7bfd3b5';
const portrait = 'https://raw.githubusercontent.com/7guard-io/7ya.io/main/assets/igor-home-portrait-20260712.jpg';
const navigation = [
  ['/', 'בית'],
  ['/igor-vepretski/', 'איגור'],
  ['/journey/', 'המסע'],
  ['/starton/', 'StartOn'],
  ['/evidence/', 'ראיות'],
  ['/speaker/', 'במה'],
  ['/contact/', 'קשר'],
];

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
  })[character]);
}

function normalizePath(value) {
  let path = String(value || '/');
  if (!path.startsWith('/')) path = `/${path}`;
  if (path !== '/' && !path.endsWith('/')) path += '/';
  return path;
}

function renderNavigation(path) {
  return navigation
    .map(([href, label]) => `<a href="${href}"${href === path ? ' aria-current="page"' : ''}>${escapeHtml(label)}</a>`)
    .join('');
}

function renderCards(items) {
  return items
    .map(([status, title], index) => `
      <article class="card">
        <div class="card-top"><span>${escapeHtml(status)}</span><b>0${index + 1}</b></div>
        <h2>${escapeHtml(title)}</h2>
        <p>המידע מוצג בהתאם למצב המקור וללא הרחבה שאינה נתמכת.</p>
      </article>`)
    .join('');
}

function renderPage(path, data) {
  const canonical = `https://7ya.io${path}`;
  const home = path === '/';
  const structuredData = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Igor Vepretski',
    alternateName: ['איגור ופרצקי', 'Игорь Вепрецкий'],
    url: 'https://7ya.io/',
    image: portrait,
  });

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>${escapeHtml(data.title)}</title>
  <meta name="description" content="${escapeHtml(data.description)}">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="theme-color" content="#080809">
  <meta name="7ya-release" content="2026-07-14.2">
  <link rel="canonical" href="${canonical}">
  <link rel="stylesheet" href="/site.css">
  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="7YA.IO">
  <meta property="og:title" content="${escapeHtml(data.title)}">
  <meta property="og:description" content="${escapeHtml(data.description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${portrait}">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">${structuredData}</script>
</head>
<body>
  <a class="skip" href="#main">דלג לתוכן</a>
  <header>
    <div class="w top">
      <a class="brand" href="/"><span class="seven">7</span><span><b>IGOR VEPRETSKI</b><small>PERSONAL PUBLIC SYSTEM</small></span></a>
      <nav>${renderNavigation(path)}</nav>
      <a class="pill" href="/contact/">דברו איתי</a>
    </div>
  </header>
  <main id="main">
    <section class="hero w">
      <div class="copy">
        <span class="tag">${escapeHtml(data.eyebrow)}</span>
        <h1>${escapeHtml(data.heading)}</h1>
        <p class="lead">${escapeHtml(data.lead)}</p>
        <div class="actions">
          <a class="btn primary" href="${home ? '/journey/' : '/evidence/'}">${home ? 'הסיפור שלי' : 'לראיות'}</a>
          <a class="btn" href="/contact/">ראיון, הרצאה או שותפות</a>
        </div>
        <div class="live"><i></i><span><b>NOW BUILDING</b> · StartOn · 7YA · public trust systems</span></div>
      </div>
      <figure class="portrait">
        <img src="${portrait}" alt="איגור ופרצקי" width="1600" height="1600" fetchpriority="high">
        <figcaption><small>HUMAN FIRST</small><strong>IGOR</strong><span>Founder · Speaker · Public builder</span></figcaption>
      </figure>
    </section>
    <section class="marquee"><div>HUMAN FIRST · BUILD FROM EXPERIENCE · EVIDENCE BEFORE AMPLIFICATION · STARTON · 7YA ·</div></section>
    <section class="w content">
      <div class="section-head"><span>PUBLIC MAP</span><h2>${home ? 'שלושה מסלולים. משימה אחת.' : 'מקורות, הקשר ופעולה.'}</h2></div>
      <div class="grid">${renderCards(data.cards)}</div>
      <div class="note"><b>Evidence discipline</b><span>טענה שאינה מגובה במקור ישיר אינה מוצגת כעובדה מאומתת.</span></div>
    </section>
    <section class="cta">
      <div class="w cta-grid">
        <div><span>NEXT STEP</span><h2>בואו נבנה משהו שיש לו משמעות.</h2><p>StartOn, תקשורת, הרצאות, שותפויות או תיקוני ראיות — מתחילים בשיחה ברורה.</p></div>
        <a class="btn light" href="/contact/">יצירת קשר</a>
      </div>
    </section>
  </main>
  <footer><div class="w foot"><div><b>IGOR VEPRETSKI / 7YA.IO</b><span>Human first · Evidence before amplification</span></div><div>Release · 2026-07-14.2 · ${sourceSha.slice(0, 12)}</div></div></footer>
</body>
</html>`;
}

module.exports = (request, response) => {
  const path = normalizePath(request.query.route || '/');
  const data = routes[path];
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.setHeader('X-Robots-Tag', data ? 'index, follow' : 'noindex');
  response.statusCode = data ? 200 : 404;
  response.end(data
    ? renderPage(path, data)
    : '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>404 | 7YA</title></head><body><h1>העמוד לא נמצא</h1><a href="/">חזרה לבית</a></body></html>');
};
