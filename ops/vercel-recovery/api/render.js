const routes = require('../routes.json');

const navigation = [
  ['/', 'בית'],
  ['/igor-vepretski/', 'איגור'],
  ['/journey/', 'המסע'],
  ['/starton/', 'StartOn'],
  ['/evidence/', 'ראיות'],
  ['/talk/', 'במה'],
  ['/contact/', 'קשר'],
];

function escapeHtml(value) {
  return String(value).replace(/[&<>\"]/g, (character) => ({
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
    .map(([href, label]) => {
      const current = href === path ? ' aria-current="page"' : '';
      return `<a href="${href}"${current}>${escapeHtml(label)}</a>`;
    })
    .join('');
}

function renderCards(cards) {
  return cards
    .map(([status, title], index) => `
      <article class="card">
        <div class="card-top"><span class="s">${escapeHtml(status)}</span><b>0${index + 1}</b></div>
        <h2>${escapeHtml(title)}</h2>
        <p>המידע מוצג בהתאם למצב המקור וללא הרחבה שאינה נתמכת.</p>
      </article>`)
    .join('');
}

function renderPage(path, data) {
  const canonical = `https://7ya.io${path}`;
  const sourceSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.SOURCE_SHA || 'unbound';
  const isHome = path === '/';
  const visualLabel = isHome ? 'KHARKIV → ISRAEL → FIELD → BUILD' : `${data.eyebrow} · 7YA`;

  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>${escapeHtml(data.title)}</title>
  <meta name="description" content="${escapeHtml(data.description)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#09090a">
  <meta name="7ya-release" content="${escapeHtml(sourceSha)}">
  <link rel="canonical" href="${canonical}">
  <link rel="stylesheet" href="/site.css">
  <meta property="og:type" content="profile">
  <meta property="og:site_name" content="7YA.IO">
  <meta property="og:title" content="${escapeHtml(data.title)}">
  <meta property="og:description" content="${escapeHtml(data.description)}">
  <meta property="og:url" content="${canonical}">
  <meta name="twitter:card" content="summary_large_image">
</head>
<body>
  <a class="skip" href="#main">דלג לתוכן</a>
  <header class="top-shell">
    <div class="w top">
      <a class="brand" href="/" aria-label="Igor Vepretski — 7YA home"><span class="brand-seven">7</span><span><b>IGOR VEPRETSKI</b><small>PERSONAL PUBLIC SYSTEM</small></span></a>
      <nav class="nav" aria-label="ניווט ראשי">${renderNavigation(path)}</nav>
      <a class="contact-pill" href="/contact/">דברו איתי</a>
    </div>
  </header>

  <main id="main">
    <section class="hero w">
      <div class="hero-copy">
        <span class="tag">${escapeHtml(data.eyebrow)}</span>
        <h1>${escapeHtml(data.heading)}</h1>
        <p class="lead">${escapeHtml(data.lead)}</p>
        <div class="actions">
          <a class="btn primary" href="${isHome ? '/journey/' : '/evidence/'}">${isHome ? 'הסיפור שלי' : 'לראיות'}</a>
          <a class="btn" href="/contact/">ראיון, הרצאה או שותפות</a>
        </div>
        <div class="live"><i></i><span><b>NOW BUILDING</b> · StartOn · 7YA · public trust systems</span></div>
      </div>

      <aside class="identity-panel" aria-label="Igor Vepretski identity panel">
        <span class="rail">${escapeHtml(visualLabel)}</span>
        <div class="giant-seven">7</div>
        <div class="identity-copy"><small>HUMAN FIRST</small><strong>IGOR</strong><span>Founder · Speaker · Public builder</span></div>
      </aside>
    </section>

    <section class="marquee" aria-label="עקרונות פעולה"><div><span>HUMAN FIRST</span><i></i><span>BUILD FROM EXPERIENCE</span><i></i><span>EVIDENCE BEFORE AMPLIFICATION</span><i></i><span>STARTON</span><i></i><span>7YA</span></div></section>

    <section class="w content">
      <div class="section-head"><span>PUBLIC MAP</span><h2>${isHome ? 'שלושה מסלולים. משימה אחת.' : 'מקורות, הקשר ופעולה.'}</h2></div>
      <div class="grid">${renderCards(data.cards)}</div>
      <div class="note"><b>Evidence discipline</b><span>טענה שאינה מגובה במקור ישיר אינה מוצגת כעובדה מאומתת.</span></div>
    </section>

    <section class="cta"><div class="w cta-grid"><div><span>NEXT STEP</span><h2>בואו נבנה משהו שיש לו משמעות.</h2><p>StartOn, תקשורת, הרצאות, שותפויות או תיקוני ראיות — מתחילים בשיחה ברורה.</p></div><a class="btn light" href="/contact/">יצירת קשר</a></div></section>
  </main>

  <footer><div class="w footer-grid"><div><b>IGOR VEPRETSKI / 7YA.IO</b><span>Human first · Evidence before amplification</span></div><div class="release">Source · ${escapeHtml(sourceSha.slice(0, 12))}</div></div></footer>
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
  response.end(data ? renderPage(path, data) : '<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="robots" content="noindex"><title>404 | 7YA</title></head><body><h1>העמוד לא נמצא</h1><a href="/">חזרה לבית</a></body></html>');
};
