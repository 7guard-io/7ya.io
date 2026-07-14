import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const canonicalRoutes = [
  '', 'history', 'igor-vepretski', 'journey', 'starton', 'influence', 'evidence',
  '7ya', 'speaker', 'talk', 'media', 'articles', 'contact', 'delta-audit'
];
const aliases = new Map([
  ['about', '/igor-vepretski/'],
  ['social', '/influence/'],
  ['oracle', '/evidence/'],
  ['business', '/7ya/'],
  ['pass', '/7ya/'],
  ['radar', '/evidence/'],
  ['work', '/#tracklist'],
  ['systems', '/7ya/'],
  ['public-service', '/journey/'],
  ['music', '/influence/'],
]);

let failures = 0;
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);

function filePath(file) {
  return path.join(root, file);
}

function read(file) {
  const resolved = filePath(file);
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

function validateHtmlShell(file, html) {
  requireText(html, '<!doctype html>', file);
  /<html[^>]+lang="[^"]+"/i.test(html) ? pass(`${file} includes language`) : fail(`${file} missing language`);
  /<meta\s+name="viewport"/i.test(html) ? pass(`${file} includes viewport`) : fail(`${file} missing viewport`);
  /<title>[^<]+<\/title>/i.test(html) ? pass(`${file} includes title`) : fail(`${file} missing title`);
  /<meta\s+name="description"/i.test(html) ? pass(`${file} includes description`) : fail(`${file} missing description`);
}

function parseJson(file) {
  const raw = read(file);
  try {
    const parsed = JSON.parse(raw);
    pass(`${file} parses as JSON`);
    return parsed;
  } catch (error) {
    fail(`${file} invalid JSON: ${error.message}`);
    return null;
  }
}

for (const route of canonicalRoutes) {
  const file = route ? `${route}/index.html` : 'index.html';
  const html = read(file);
  const url = `https://7ya.io/${route ? `${route}/` : ''}`;
  validateHtmlShell(file, html);
  /<meta\s+name="robots"\s+content="index,\s*follow/i.test(html)
    ? pass(`${file} is indexable`)
    : fail(`${file} missing index, follow robots directive`);
  requireText(html, `<link rel="canonical" href="${url}"`, file);
  if (/noindex/i.test(html)) fail(`${file} contains noindex`);
}

for (const [route, target] of aliases) {
  const file = `${route}/index.html`;
  const html = read(file);
  const canonical = `https://7ya.io${target}`;
  validateHtmlShell(file, html);
  /<meta\s+name="robots"\s+content="noindex,\s*follow/i.test(html)
    ? pass(`${file} is noindex follow`)
    : fail(`${file} missing noindex, follow`);
  requireText(html, `<link rel="canonical" href="${canonical}"`, file);
  requireText(html, 'http-equiv="refresh"', file);
  requireText(html, 'location.replace(', file);
}

const home = read('index.html');
for (const required of [
  'איגור ופרצקי', 'IGOR VEPRETSKI', 'שיר', 'היסטוריה',
  'כל פוסט הוא שורה.', 'הפלטפורמה מחלקת נראות.',
  'ההיסטוריה נכנסה לישראל בתוך מזוודות.', 'הפירורים הפכו לארכיון.',
  'Evidence Ledger', 'history-song-editorial-archive-20260714-1',
  'id="archiveGrid"', 'id="archiveSearch"', 'data-filter="Facebook"'
]) requireText(home, required, 'homepage');

for (const technical of [
  'width=device-width, initial-scale=1, viewport-fit=cover',
  '/assets/igor-home-portrait-20260712.webp',
  '/assets/igor-home-portrait-20260712.jpg',
  '/styles/history-song-20260714.css?v=1',
  '/scripts/history-song-20260714.js',
  '7ya-history-song-cache-20260714',
  'navigator.serviceWorker.getRegistrations()',
  'Promise.allSettled(tasks)'
]) requireText(home, technical, 'homepage technical contract');

for (const sourceProof of [
  'makorrishon.co.il', 'holon.mynet.co.il', 'prod.13tv.co.il',
  'facebook.com/lan2lan.sta2sim', 'i.ytimg.com/vi/EsaD-lVsKHc',
  'starton.org.il/wp-content/uploads', 'www.zman.co.il/352289/'
]) requireText(home, sourceProof, 'homepage source proof');

const h1Count = (home.match(/<h1\b/gi) || []).length;
h1Count === 1 ? pass('homepage has exactly one H1') : fail(`homepage has ${h1Count} H1 elements`);
const publicImages = (home.match(/<img\b/gi) || []).length;
publicImages >= 10 ? pass(`homepage has ${publicImages} image placements`) : fail(`homepage has only ${publicImages} image placements`);

for (const forbidden of [
  'maximum-scale=1', 'http-equiv="Cache-Control"', 'http-equiv="Pragma"',
  'http-equiv="Expires"', 'rel="manifest"', 'bottom-navigation', 'floating-bot',
  '5.1B+', 'Billions of impressions', '50,000+ empowered', '100K+',
  'Microsoft-backed', 'official partner', 'candidate for Knesset'
]) excludeText(home, forbidden, 'homepage');

const history = read('history/index.html');
for (const required of [
  'שיר ההיסטוריה — ארכיון מלא', 'history-song-archive-20260714-1',
  'id="archiveGrid"', 'id="archiveSearch"', '/styles/history-song-20260714.css?v=1',
  '/scripts/history-song-20260714.js'
]) requireText(history, required, 'history archive');

const shardFiles = [1, 2, 3, 4].map(part => `knowledge/history-song-records-${part}.json`);
const records = [];
for (const file of shardFiles) {
  const shard = parseJson(file);
  if (!shard) continue;
  Array.isArray(shard.records)
    ? records.push(...shard.records)
    : fail(`${file} missing records array`);
}
records.length === 36 ? pass('History Song archive has 36 records') : fail(`History Song archive has ${records.length} records`);
const ids = new Set();
for (const record of records) {
  if (!record?.id || !record?.title || !record?.url || !record?.platform || !record?.evidence_tier) {
    fail(`invalid archive record: ${JSON.stringify(record)}`);
    continue;
  }
  ids.has(record.id) ? fail(`duplicate archive record ID ${record.id}`) : ids.add(record.id);
  /^https:\/\//.test(record.url) ? pass(`${record.id} has public HTTPS source`) : fail(`${record.id} source is not HTTPS`);
  ['TIER_1', 'TIER_2', 'TIER_3'].includes(record.evidence_tier)
    ? pass(`${record.id} has valid evidence tier`)
    : fail(`${record.id} has invalid evidence tier`);
  if (record.metric && !record.metric.as_of) fail(`${record.id} metric missing as_of date`);
}

for (const file of [
  'assets/igor-home-portrait-20260712.webp',
  'assets/igor-home-portrait-20260712.jpg',
  'assets/igor-home-og-20260712.jpg',
  'styles/history-song-20260714.css',
  'scripts/history-song-20260714.js',
  ...shardFiles,
  'favicon.svg', '404.html', 'sw.js', 'service-worker.js', 'release.json'
]) read(file);

const sitemap = read('sitemap.xml');
for (const route of canonicalRoutes) {
  const loc = `https://7ya.io/${route ? `${route}/` : ''}`;
  requireText(sitemap, loc, 'sitemap');
}
for (const route of aliases.keys()) excludeText(sitemap, `https://7ya.io/${route}/`, 'sitemap aliases');
excludeText(sitemap, 'https://7ya.io/legacy/', 'sitemap legacy');

const robots = read('robots.txt');
for (const snippet of ['User-agent: *', 'Allow: /', 'Sitemap: https://7ya.io/sitemap.xml']) {
  requireText(robots, snippet, 'robots');
}

const release = parseJson('release.json');
if (release) {
  release.service === '7ya-frontend' ? pass('release service is canonical') : fail('release service mismatch');
  release.environment === 'production' ? pass('release environment is production') : fail('release environment mismatch');
}

for (const route of ['igor-vepretski', 'starton', 'evidence', 'talk', 'contact']) {
  const file = `${route}/index.html`;
  const body = read(file);
  for (const required of ['IGOR VEPRETSKI', 'לתיאום שיחה', 'לצפייה בראיות']) {
    requireText(body, required, file);
  }
}

if (failures) {
  console.error(`\nSITE_PROCESS_HEALTH: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nSITE_PROCESS_HEALTH: PASS');