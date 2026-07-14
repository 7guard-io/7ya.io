import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const canonicalRoutes = [
  '', 'igor-vepretski', 'journey', 'starton', 'influence', 'evidence',
  '7ya', 'speaker', 'talk', 'media', 'articles', 'contact', 'delta-audit'
];
const aliases = new Map([
  ['about', '/igor-vepretski/'],
  ['social', '/influence/'],
  ['oracle', '/evidence/'],
  ['business', '/7ya/'],
  ['pass', '/7ya/'],
  ['radar', '/evidence/'],
  ['work', '/#creations'],
  ['systems', '/7ya/'],
  ['public-service', '/journey/'],
  ['music', '/influence/'],
]);
const mirroredPages = ['igor-vepretski', 'starton', 'evidence', 'talk', 'contact'];

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

function normalizeRecoveryMirror(body) {
  return body
    .replace('/creatorverse-depth-20260714.css?v=1', '/styles/creatorverse-depth-20260714.css?v=1')
    .replace(/\r\n/g, '\n')
    .trim();
}

function validateHtmlShell(file, html) {
  requireText(html, '<!doctype html>', file);
  /<meta\s+name="viewport"/i.test(html) ? pass(`${file} includes viewport`) : fail(`${file} missing viewport`);
  /<title>[^<]+<\/title>/i.test(html) ? pass(`${file} includes title`) : fail(`${file} missing title`);
}

for (const route of canonicalRoutes) {
  const file = route ? `${route}/index.html` : 'index.html';
  const html = read(file);
  const url = `https://7ya.io/${route ? `${route}/` : ''}`;

  validateHtmlShell(file, html);
  /<meta\s+name="description"/i.test(html) ? pass(`${file} includes description`) : fail(`${file} missing description`);
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
    ? pass(`${file} is a noindex follow alias`)
    : fail(`${file} missing noindex, follow`);
  requireText(html, `<link rel="canonical" href="${canonical}"`, file);
  requireText(html, 'http-equiv="refresh"', file);
  requireText(html, 'location.replace(', file);
  for (const retired of ['Living Proof System', 'Public trust shell', 'Private strategic command room']) {
    excludeText(html, retired, file);
  }
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

for (const route of mirroredPages) {
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

const identity = read('igor-vepretski/index.html');
for (const required of [
  'אדם אחד.', 'IDENTITY MAP', 'לא להיראות מושלם.', 'SELF-ATTESTED',
  'הביוגרפיה אינה', 'PERSON · MISSION · SYSTEM · EVIDENCE'
]) requireText(identity, required, 'identity');

const contact = read('contact/index.html');
for (const required of [
  'hello@7ya.io', 'שש דרכי פנייה', 'PRIVACY CONTRACT',
  'לא לשלוח במייל הראשון', 'המערכת מנתבת. האדם מחליט.'
]) requireText(contact, required, 'contact');

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
for (const route of canonicalRoutes) {
  const loc = `https://7ya.io/${route ? `${route}/` : ''}`;
  requireText(sitemap, loc, 'sitemap');
}
for (const route of aliases.keys()) {
  excludeText(sitemap, `https://7ya.io/${route}/`, 'sitemap aliases');
}
excludeText(sitemap, 'https://7ya.io/legacy/', 'sitemap legacy');

const robots = read('robots.txt');
for (const snippet of ['User-agent: *', 'Allow: /', 'Sitemap: https://7ya.io/sitemap.xml']) {
  requireText(robots, snippet, 'robots');
}

for (const route of canonicalRoutes) {
  const file = route ? `${route}/index.html` : 'index.html';
  const body = read(file);
  for (const bad of [
    '5.1B+', '10,000+', 'Knesset Candidate', 'Microsoft-backed',
    'candidate for Knesset', 'verified leader', 'official partner',
    'Ido Vepretski', 'Igor Ido Vepretski', 'עידו ופרצקי'
  ]) {
    if (body.includes(bad)) fail(`${file} contains unsupported snippet: ${bad}`);
  }
}

const recoveryHome = read('ops/vercel-recovery/index.html');
for (const unsupportedAlias of ['Ido Vepretski', 'Igor Ido Vepretski', 'עידו ופרצקי']) {
  excludeText(recoveryHome, unsupportedAlias, 'recovery homepage identity aliases');
}

for (const file of [
  'ops/vercel-recovery/creatorverse-depth-20260714.css',
  ...mirroredPages.map(route => `ops/vercel-recovery/${route}/index.html`),
]) {
  const body = read(file);
  if (file.endsWith('index.html')) {
    requireText(body, 'creatorverse-depth-20260714-1', file);
    requireText(body, '/creatorverse-depth-20260714.css?v=1', file);
  }
}

for (const route of mirroredPages) {
  const source = read(`${route}/index.html`).replace(/\r\n/g, '\n').trim();
  const recovery = normalizeRecoveryMirror(read(`ops/vercel-recovery/${route}/index.html`));
  source === recovery
    ? pass(`${route} recovery artifact exactly mirrors canonical source`)
    : fail(`${route} recovery artifact diverges from canonical source`);
}

const vercelPath = 'ops/vercel-recovery/vercel.json';
const vercelRaw = read(vercelPath);
let vercelConfig = {};
try {
  vercelConfig = JSON.parse(vercelRaw);
  pass(`${vercelPath} parses as JSON`);
} catch (error) {
  fail(`${vercelPath} invalid JSON: ${error.message}`);
}

const redirects = Array.isArray(vercelConfig.redirects) ? vercelConfig.redirects : [];
const rewrites = Array.isArray(vercelConfig.rewrites) ? vercelConfig.rewrites : [];
const headerRules = Array.isArray(vercelConfig.headers) ? vercelConfig.headers : [];
const headerMap = new Map(headerRules.map(rule => [rule.source, new Map((rule.headers || []).map(header => [header.key, header.value]))]));

for (const [route, target] of aliases) {
  const rule = redirects.find(candidate => candidate.source === `/${route}/`);
  rule?.destination === target && rule.permanent === true
    ? pass(`Vercel recovery redirects /${route}/ to ${target}`)
    : fail(`Vercel recovery missing permanent redirect for /${route}/`);
}

for (const route of mirroredPages) {
  const staticRoute = `/${route}/`;
  const isRewritten = rewrites.some(rule => rule.source === staticRoute);
  !isRewritten
    ? pass(`${staticRoute} served as static Creatorverse page`)
    : fail(`${staticRoute} still rewritten through generic renderer`);

  const routeHeaders = headerMap.get(staticRoute);
  routeHeaders?.get('X-Robots-Tag') === 'index, follow'
    ? pass(`${staticRoute} preserves X-Robots-Tag`)
    : fail(`${staticRoute} missing X-Robots-Tag: index, follow`);
  routeHeaders?.get('Cache-Control') === 'public, max-age=0, must-revalidate'
    ? pass(`${staticRoute} preserves revalidation cache policy`)
    : fail(`${staticRoute} missing must-revalidate cache policy`);
}

const globalHeaders = headerMap.get('/(.*)');
for (const [key, value] of [
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()']
]) {
  globalHeaders?.get(key) === value
    ? pass(`Vercel global header ${key} preserved`)
    : fail(`Vercel global header ${key} missing or incorrect`);
}

const proxy = read('ops/vercel-canonical-proxy/api/proxy.js');
for (const [route, target] of aliases) {
  requireText(proxy, `['${route}', '${target}']`, 'canonical proxy aliases');
}
for (const required of ['response.statusCode = 308', "response.setHeader('Location', destination)", "'noindex, follow'"]) {
  requireText(proxy, required, 'canonical proxy redirects');
}

if (failures) {
  console.error(`\nSITE_PROCESS_HEALTH: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nSITE_PROCESS_HEALTH: PASS');
