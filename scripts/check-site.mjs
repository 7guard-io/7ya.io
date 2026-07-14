import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const routes = [
  '', 'legacy', 'igor-vepretski', 'evidence', 'journey', 'starton', 'oracle',
  'business', 'talk', 'contact', 'social', 'pass', 'radar', 'speaker', 'media',
  '7ya', 'influence', 'articles', 'delta-audit'
];

let failures = 0;
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);

function read(file) {
  const resolved = path.join(root, file);
  if (!fs.existsSync(resolved)) {
    fail(`${file} missing`);
    return '';
  }
  pass(`${file} exists`);
  return fs.readFileSync(resolved, 'utf8');
}

function requireText(body, text, label) {
  body.includes(text) ? pass(`${label} includes ${text}`) : fail(`${label} missing ${text}`);
}

function excludeText(body, text, label) {
  !body.includes(text) ? pass(`${label} excludes ${text}`) : fail(`${label} contains ${text}`);
}

for (const route of routes) {
  const file = route ? `${route}/index.html` : 'index.html';
  const html = read(file);
  const url = `https://7ya.io/${route ? `${route}/` : ''}`;

  requireText(html, '<!doctype html>', file);
  /<meta\s+name="viewport"/i.test(html) ? pass(`${file} includes viewport`) : fail(`${file} missing viewport`);
  /<title>[^<]+<\/title>/i.test(html) ? pass(`${file} includes title`) : fail(`${file} missing title`);
  /<meta\s+name="description"/i.test(html) ? pass(`${file} includes description`) : fail(`${file} missing description`);
  /<meta\s+name="robots"\s+content="index,\s*follow/i.test(html)
    ? pass(`${file} is indexable`)
    : fail(`${file} missing index, follow robots directive`);
  requireText(html, `<link rel="canonical" href="${url}"`, file);
  if (/noindex/i.test(html)) fail(`${file} contains noindex`);
}

const home = read('index.html');
for (const text of [
  'איגור ופרצקי', 'IGOR VEPRETSKI', 'ONE PERSON.', 'StartOn', 'Evidence Ledger',
  'Human first', 'לא תמונה אחת. נוכחות אמיתית.', 'הקול שלי, לא “בלוג”.',
  'לא רק תוכן. תהליך ציבורי.'
]) requireText(home, text, 'homepage');

for (const technical of [
  'width=device-width, initial-scale=1, viewport-fit=cover',
  '/assets/igor-home-portrait-20260712.webp', '/assets/igor-home-portrait-20260712.jpg',
  '/styles/igor-personal-20260713.css?v=1', '/styles/creatorverse-20260714.css?v=1',
  '/styles/igor-rich-media-20260714.css?v=1', 'creatorverse-rich-media-20260714-1',
  '7ya-legacy-cache-retired-20260713', 'navigator.serviceWorker.getRegistrations()',
  'Promise.allSettled(tasks)'
]) requireText(home, technical, 'homepage');

for (const visualProof of [
  'pic1.yitweb.co.il', 'צילום: קובי קואנקס', 'i.ytimg.com/vi/pzOlz8kGmeU/hqdefault.jpg',
  'open.spotify.com/embed/artist/0fgRoQ6PoCHlVCIr8a5d6u', 'class="visual-bento"',
  'class="post-grid"', 'class="process-steps"', 'class="persona-anchor"'
]) requireText(home, visualProof, 'homepage visual proof');

for (const forbidden of [
  'maximum-scale=1', 'http-equiv="Cache-Control"', 'http-equiv="Pragma"',
  'http-equiv="Expires"', 'rel="manifest"', 'bottom-navigation', 'floating-bot',
  'igor-vepretski-portrait.svg', 'upload.wikimedia.org/wikipedia/commons/7/7e/Igor_vepretski',
  'class="satellite"', 'class="igor-tile"'
]) excludeText(home, forbidden, 'homepage');

const signatures = (home.match(/class="author-signature"/g) || []).length;
signatures >= 5 ? pass(`homepage has ${signatures} signed content cards`) : fail(`homepage has only ${signatures} signed content cards`);

const depthPages = ['starton', 'evidence', 'talk'];
for (const route of depthPages) {
  const file = `${route}/index.html`;
  const html = read(file);
  for (const required of [
    'creatorverse-depth-20260714-1', '/styles/creatorverse-depth-20260714.css?v=1',
    'לתיאום שיחה', 'לצפייה בראיות', 'IGOR VEPRETSKI'
  ]) requireText(html, required, file);
  for (const retired of ['Living Proof System', 'Public trust shell', 'Private strategic command room']) {
    excludeText(html, retired, file);
  }
}

const legacy = read('legacy/index.html');
for (const snippet of [
  'Legacy Universe', 'LEGACY', 'EVIDENCE GOVERNED', '/knowledge/igor-vepretski-legacy.json',
  '/styles/legacy-universe-20260714.css?v=1', '/scripts/legacy-universe-20260714.js',
  'igor-legacy-universe-20260714-1'
]) requireText(legacy, snippet, 'legacy');

const legacyData = read('knowledge/igor-vepretski-legacy.json');
for (const snippet of [
  'Evidence before amplification', '2026-06-08', 'StartOn', 'PILOT_DESIGN',
  'SELF_ATTESTED', 'Music and creative work by Igor Vepretski', 'privacy_rules'
]) requireText(legacyData, snippet, 'legacy dataset');

for (const file of [
  'assets/igor-home-portrait-20260712.webp', 'assets/igor-home-portrait-20260712.jpg',
  'assets/igor-home-og-20260712.jpg', 'styles/igor-personal-20260713.css',
  'styles/creatorverse-20260714.css', 'styles/igor-rich-media-20260714.css',
  'styles/creatorverse-depth-20260714.css', 'styles/legacy-universe-20260714.css',
  'scripts/legacy-universe-20260714.js', 'knowledge/igor-vepretski-legacy.json',
  'favicon.svg', '404.html', 'sw.js', 'service-worker.js'
]) read(file);

const sitemap = read('sitemap.xml');
for (const route of routes) {
  const loc = `https://7ya.io/${route ? `${route}/` : ''}`;
  requireText(sitemap, loc, 'sitemap');
}

const robots = read('robots.txt');
for (const snippet of ['User-agent: *', 'Allow: /', 'Sitemap: https://7ya.io/sitemap.xml']) {
  requireText(robots, snippet, 'robots');
}

for (const route of routes) {
  const file = route ? `${route}/index.html` : 'index.html';
  const body = read(file);
  for (const bad of [
    '5.1B+', '10,000+', 'Knesset Candidate', 'Microsoft-backed',
    'candidate for Knesset', 'verified leader', 'official partner'
  ]) {
    if (body.includes(bad)) fail(`${file} contains unsupported snippet: ${bad}`);
  }
}

for (const file of [
  'ops/vercel-recovery/creatorverse-depth-20260714.css',
  'ops/vercel-recovery/starton/index.html',
  'ops/vercel-recovery/evidence/index.html',
  'ops/vercel-recovery/talk/index.html'
]) {
  const body = read(file);
  if (file.endsWith('index.html')) {
    requireText(body, 'creatorverse-depth-20260714-1', file);
    requireText(body, '/creatorverse-depth-20260714.css?v=1', file);
  }
}

const vercel = read('ops/vercel-recovery/vercel.json');
for (const staticRoute of ['/starton/', '/evidence/', '/talk/']) {
  const rewrite = `\"source\": \"${staticRoute}\"`;
  excludeText(vercel, rewrite, 'Vercel static depth routing');
}

if (failures) {
  console.error(`\nSITE_PROCESS_HEALTH: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nSITE_PROCESS_HEALTH: PASS');
