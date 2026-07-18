import fs from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve(process.argv[2] || 'dist');
const BUILD = 'igor-global-page-repair-20260718-1';
const STYLE = '/styles/7ya-global-page-repair-20260718.css';
const SCRIPT = '/scripts/7ya-global-page-repair-20260718.js';

const header = `
<div class="seven-global-progress" aria-hidden="true"><span id="sevenGlobalProgress"></span></div>
<header class="seven-global-header">
  <a class="seven-global-brand" href="/" aria-label="7YA.IO — Igor Vepretski"><b>7<span>YA</span></b><small>IGOR VEPRETSKI</small></a>
  <nav class="seven-global-nav" aria-label="ניווט ראשי">
    <a href="/journey/">המסע</a><a href="/starton/">StartOn</a><a href="/influence/">השפעה</a><a href="/evidence/">ראיות</a><a href="/speaker/">במה</a><a class="seven-global-cta" href="/contact/">לתיאום שיחה</a>
  </nav>
</header>`;

const footer = `
<footer class="seven-global-footer">
  <strong>7YA.IO</strong>
  <p>המרכז הציבורי של איגור ופרצקי — אדם, StartOn, יצירה ומערכת ראיות פתוחה. כל טענה מהותית צריכה להוביל למקור, לתאריך או לסטטוס ברור.</p>
  <nav aria-label="ניווט תחתון"><a href="/">בית</a><a href="/igor-vepretski/">איגור</a><a href="/journey/">המסע</a><a href="/starton/">StartOn</a><a href="/influence/">השפעה</a><a href="/evidence/">ראיות</a><a href="/contact/">קשר</a></nav>
  <small>7YA GLOBAL PAGE REPAIR · ${BUILD}</small>
</footer>`;

async function walk(directory, prefix = '') {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    const relative = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute, relative));
    else if (entry.isFile()) files.push(relative);
  }
  return files;
}

function mergeBodyClass(opening, additions) {
  const match = opening.match(/\sclass=["']([^"']*)["']/i);
  if (!match) return opening.replace(/>$/, ` class="${additions}">`);
  const classes = new Set(`${match[1]} ${additions}`.split(/\s+/).filter(Boolean));
  return opening.replace(match[0], ` class="${[...classes].join(' ')}"`);
}

const htmlFiles = (await walk(output)).filter((file) => file.endsWith('.html'));
let repaired = 0;

for (const relative of htmlFiles) {
  const absolute = path.join(output, relative);
  let html = await fs.readFile(absolute, 'utf8');
  if (!html.includes('</head>') || !html.includes('</body>')) continue;
  if (html.includes(`name="7ya-global-repair" content="${BUILD}"`)) continue;

  const isHome = relative === 'index.html';
  const isAlias = /http-equiv=["']refresh["']/i.test(html) || (/noindex/i.test(html) && /redirect/i.test(html));
  const bodyClass = isHome ? 'seven-global seven-home' : 'seven-global seven-subpage';

  html = html.replace('</head>', `  <meta name="7ya-global-repair" content="${BUILD}">\n  <link rel="stylesheet" href="${STYLE}">\n</head>`);
  html = html.replace(/<body[^>]*>/i, (opening) => mergeBodyClass(opening, bodyClass));

  if (isHome) {
    html = html.replace(/<body[^>]*>/i, (opening) => `${opening}\n<div class="seven-global-progress" aria-hidden="true"><span id="sevenGlobalProgress"></span></div>`);
  } else if (!isAlias) {
    html = html.replace(/<body[^>]*>/i, (opening) => `${opening}\n${header}`);
  }

  if (!isAlias) html = html.replace('</body>', `${footer}\n<script src="${SCRIPT}" defer></script>\n</body>`);
  else html = html.replace('</body>', `<script src="${SCRIPT}" defer></script>\n</body>`);

  await fs.writeFile(absolute, html, 'utf8');
  repaired += 1;
}

console.log(`GLOBAL_PAGE_REPAIR: PASS (${repaired}/${htmlFiles.length} HTML files updated)`);
