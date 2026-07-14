import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const routes = [
  '',
  'legacy',
  'igor-vepretski',
  'evidence',
  'journey',
  'starton',
  'oracle',
  'business',
  'talk',
  'contact',
  'social',
  'pass',
  'radar',
  'speaker',
  'media',
  '7ya',
  'influence',
  'articles',
  'delta-audit'
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

for (const route of routes) {
  const file = route ? `${route}/index.html` : 'index.html';
  const html = read(file);
  const url = `https://7ya.io/${route ? `${route}/` : ''}`;

  for (const snippet of [
    '<!doctype html>',
    '<meta name="viewport"',
    '<title>',
    '<meta name="description"',
    '<meta name="robots" content="index, follow',
    `<link rel="canonical" href="${url}"`
  ]) {
    html.includes(snippet)
      ? pass(`${file} includes ${snippet}`)
      : fail(`${file} missing ${snippet}`);
  }

  if (html.includes('noindex')) fail(`${file} contains noindex`);
}

const home = read('index.html');
for (const text of [
  'איגור ופרצקי',
  'IGOR VEPRETSKI',
  'ONE PERSON.',
  'StartOn',
  'Evidence Ledger',
  'Human first',
  'לא תמונה אחת. נוכחות אמיתית.',
  'הקול שלי, לא “בלוג”.',
  'לא רק תוכן. תהליך ציבורי.'
]) {
  home.includes(text) ? pass(`homepage includes ${text}`) : fail(`homepage missing ${text}`);
}

for (const technical of [
  'width=device-width, initial-scale=1, viewport-fit=cover',
  '/assets/igor-home-portrait-20260712.webp',
  '/assets/igor-home-portrait-20260712.jpg',
  '/styles/igor-personal-20260713.css?v=1',
  '/styles/creatorverse-20260714.css?v=1',
  '/styles/igor-rich-media-20260714.css?v=1',
  'creatorverse-rich-media-20260714-1',
  '7ya-legacy-cache-retired-20260713',
  'navigator.serviceWorker.getRegistrations()',
  'Promise.allSettled(tasks)'
]) {
  home.includes(technical)
    ? pass(`homepage includes ${technical}`)
    : fail(`homepage missing ${technical}`);
}

for (const visualProof of [
  'pic1.yitweb.co.il',
  'צילום: קובי קואנקס',
  'i.ytimg.com/vi/pzOlz8kGmeU/hqdefault.jpg',
  'open.spotify.com/embed/artist/0fgRoQ6PoCHlVCIr8a5d6u',
  'class="visual-bento"',
  'class="post-grid"',
  'class="process-steps"',
  'class="persona-anchor"'
]) {
  home.includes(visualProof)
    ? pass(`homepage includes visual proof ${visualProof}`)
    : fail(`homepage missing visual proof ${visualProof}`);
}

for (const forbidden of [
  'maximum-scale=1',
  'http-equiv="Cache-Control"',
  'http-equiv="Pragma"',
  'http-equiv="Expires"',
  'rel="manifest"',
  'bottom-navigation',
  'floating-bot',
  'igor-vepretski-portrait.svg',
  'upload.wikimedia.org/wikipedia/commons/7/7e/Igor_vepretski',
  'class="satellite"',
  'class="igor-tile"'
]) {
  !home.includes(forbidden)
    ? pass(`homepage excludes ${forbidden}`)
    : fail(`homepage still includes ${forbidden}`);
}

const articleSignatures = (home.match(/class="author-signature"/g) || []).length;
articleSignatures >= 5
  ? pass(`homepage has ${articleSignatures} signed content cards`)
  : fail(`homepage has only ${articleSignatures} signed content cards`);

const legacy = read('legacy/index.html');
for (const snippet of [
  'Legacy Universe',
  'LEGACY',
  'EVIDENCE GOVERNED',
  '/knowledge/igor-vepretski-legacy.json',
  '/styles/legacy-universe-20260714.css?v=1',
  '/scripts/legacy-universe-20260714.js',
  'igor-legacy-universe-20260714-1'
]) {
  legacy.includes(snippet)
    ? pass(`legacy includes ${snippet}`)
    : fail(`legacy missing ${snippet}`);
}

const legacyData = read('knowledge/igor-vepretski-legacy.json');
for (const snippet of [
  'Evidence before amplification',
  '2026-06-08',
  'StartOn',
  'PILOT_DESIGN',
  'SELF_ATTESTED',
  'Music and creative work by Igor Vepretski',
  'privacy_rules'
]) {
  legacyData.includes(snippet)
    ? pass(`legacy dataset includes ${snippet}`)
    : fail(`legacy dataset missing ${snippet}`);
}

for (const file of [
  'assets/igor-home-portrait-20260712.webp',
  'assets/igor-home-portrait-20260712.jpg',
  'assets/igor-home-og-20260712.jpg',
  'styles/igor-personal-20260713.css',
  'styles/creatorverse-20260714.css',
  'styles/igor-rich-media-20260714.css',
  'styles/legacy-universe-20260714.css',
  'scripts/legacy-universe-20260714.js',
  'knowledge/igor-vepretski-legacy.json',
  'favicon.svg',
  '404.html',
  'sw.js',
  'service-worker.js'
]) {
  read(file);
}

const sitemap = read('sitemap.xml');
for (const route of routes) {
  const loc = `https://7ya.io/${route ? `${route}/` : ''}`;
  sitemap.includes(loc)
    ? pass(`sitemap includes ${loc}`)
    : fail(`sitemap missing ${loc}`);
}

const robots = read('robots.txt');
for (const snippet of [
  'User-agent: *',
  'Allow: /',
  'Sitemap: https://7ya.io/sitemap.xml'
]) {
  robots.includes(snippet)
    ? pass(`robots includes ${snippet}`)
    : fail(`robots missing ${snippet}`);
}

for (const route of routes) {
  const file = route ? `${route}/index.html` : 'index.html';
  const body = read(file);
  for (const bad of [
    '5.1B+',
    '10,000+',
    'Knesset Candidate',
    'Microsoft-backed',
    'candidate for Knesset',
    'verified leader',
    'official partner'
  ]) {
    if (body.includes(bad)) fail(`${file} contains unsupported snippet: ${bad}`);
  }
}

if (failures) {
  console.error(`\nSITE_PROCESS_HEALTH: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nSITE_PROCESS_HEALTH: PASS');
