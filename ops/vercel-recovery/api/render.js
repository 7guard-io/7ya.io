const routes = require('../routes.json');

const navigation = [
  ['/', 'בית'],
  ['/igor-vepretski/', 'איגור'],
  ['/evidence/', 'ראיות'],
  ['/starton/', 'StartOn'],
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

function renderPage(path, data) {
  const canonical = `https://7ya.io${path}`;
  const navigationHtml = navigation
    .map(([href, label]) => `<a href="${href}">${escapeHtml(label)}</a>`)
    .join('');
  const cardsHtml = data.cards
    .map(([status, title]) => `<article class="card"><span class="s">${escapeHtml(status)}</span><h2>${escapeHtml(title)}</h2><p>המידע מוצג בהתאם למצב המקור וללא הרחבה שאינה נתמכת.</p></article>`)
    .join('');
  const sourceSha = process.env.VERCEL_GIT_COMMIT_SHA || process.env.SOURCE_SHA || 'unbound';

  return `<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(data.title)}</title><meta name="description" content="${escapeHtml(data.description)}"><meta name="robots" content="index, follow, max-image-preview:large"><meta name="7ya-release" content="${escapeHtml(sourceSha)}"><link rel="canonical" href="${canonical}"><link rel="stylesheet" href="/site.css"><meta property="og:title" content="${escapeHtml(data.title)}"><meta property="og:description" content="${escapeHtml(data.description)}"><meta property="og:url" content="${canonical}"><meta name="twitter:card" content="summary_large_image"></head><body><header class="w top"><a class="brand" href="/">7YA.IO · IGOR VEPRETSKI</a><nav class="nav">${navigationHtml}</nav></header><main class="w hero"><span class="tag">${escapeHtml(data.eyebrow)}</span><h1>${escapeHtml(data.heading)}</h1><p class="lead">${escapeHtml(data.lead)}</p><div class="a"><a class="btn" href="/evidence/">ראיות</a><a class="btn" href="/contact/">יצירת קשר</a></div><section class="g">${cardsHtml}</section><div class="note">טענה שאינה מגובה במקור ישיר אינה מוצגת כעובדה מאומתת.</div></main><footer><div class="w">© 2026 Igor Vepretski · 7YA · <a href="/sitemap.xml">Sitemap</a> · <a href="/robots.txt">Robots</a></div></footer></body></html>`;
}

module.exports = (request, response) => {
  const path = normalizePath(request.query.route || '/');
  const data = routes[path];
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.setHeader('X-Robots-Tag', data ? 'index, follow' : 'noindex');
  response.statusCode = data ? 200 : 404;
  response.end(data ? renderPage(path, data) : '<!doctype html><title>404 | 7YA</title><h1>Not found</h1>');
};
