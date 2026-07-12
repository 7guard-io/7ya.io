import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const routes = [
  '',
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
  'articles'
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
  'איש שטח, מייסד StartOn ובונה 7YA.',
  'Evidence Ledger',
  'Human first'
]) {
  home.includes(text) ? pass(`homepage includes ${text}`) : fail(`homepage missing ${text}`);
}

for (const technical of [
  'width=device-width, initial-scale=1, viewport-fit=cover',
  '/assets/igor-home-portrait-20260712.webp',
  '/assets/igor-home-portrait-20260712.jpg',
  '/styles/igor-home-20260712.css?v=2',
  'igor-first-mobile-20260712-2',
  '7ya-legacy-cache-retired-20260712',
  'navigator.serviceWorker.getRegistrations()',
  'Promise.allSettled(tasks)'
]) {
  home.includes(technical)
    ? pass(`homepage includes ${technical}`)
    : fail(`homepage missing ${technical}`);
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
  'upload.wikimedia.org/wikipedia/commons/7/7e/Igor_vepretski'
]) {
  !home.includes(forbidden)
    ? pass(`homepage excludes ${forbidden}`)
    : fail(`homepage still includes ${forbidden}`);
}

for (const file of [
  'assets/igor-home-portrait-20260712.webp',
  'assets/igor-home-portrait-20260712.jpg',
  'assets/igor-home-og-20260712.jpg',
  'styles/igor-home-20260712.css',
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
    'official partner',
    'Igor Ido Vepretski',
    'Ido Vepretski',
    'עידו ופרצקי'
  ]) {
    if (body.includes(bad)) fail(`${file} contains unsupported snippet: ${bad}`);
  }
}

if (failures) {
  console.error(`\nSITE_PROCESS_HEALTH: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nSITE_PROCESS_HEALTH: PASS');
