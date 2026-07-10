import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const routes = ['', 'museum', 'igor-vepretski', 'evidence', 'journey', 'starton', 'oracle', 'business', 'talk', 'contact', 'social', 'pass', 'radar'];
let failures = 0;
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);

function read(file) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) {
    fail(`${file} missing`);
    return '';
  }
  pass(`${file} exists`);
  return fs.readFileSync(target, 'utf8');
}

for (const route of routes) {
  const file = route ? `${route}/index.html` : 'index.html';
  const html = read(file);
  const url = `https://7ya.io/${route ? `${route}/` : ''}`;
  for (const snippet of ['<!doctype html>', '<meta name="viewport"', '<title>', '<meta name="description"', '<meta name="robots" content="index, follow', `<link rel="canonical" href="${url}"`]) {
    html.includes(snippet) ? pass(`${file} includes ${snippet}`) : fail(`${file} missing ${snippet}`);
  }
  if (html.includes('noindex')) fail(`${file} contains noindex`);
}

const home = read('index.html');
for (const text of ['Igor Vepretski.', 'The person behind the system.', 'Evidence before amplification.', 'Enter Igor\'s digital museum']) {
  home.includes(text) ? pass(`homepage includes ${text}`) : fail(`homepage missing ${text}`);
}

const museum = read('museum/index.html');
for (const text of ['המוזיאון הדיגיטלי של איגור ופרצקי', 'החיים שלי', 'BROADCAST ARCHIVE', 'THE EDITORIAL DESK', 'SUPERNOAH', 'מרשם המקורות של המוזיאון']) {
  museum.includes(text) ? pass(`museum includes ${text}`) : fail(`museum missing ${text}`);
}
if (!museum.includes('lang="he" dir="rtl"')) fail('museum must declare Hebrew RTL');
if (!museum.includes('/data/museum-sources.json')) fail('museum must expose public source registry');

for (const asset of ['styles/museum.css', 'scripts/museum.js', 'data/museum-sources.json']) read(asset);
try {
  const registry = JSON.parse(read('data/museum-sources.json'));
  if (!Array.isArray(registry.sources) || registry.sources.length < 12) fail('museum source registry must contain at least 12 sources');
  else pass(`museum source registry contains ${registry.sources.length} sources`);
} catch (error) {
  fail(`museum source registry invalid JSON: ${error.message}`);
}

const sitemap = read('sitemap.xml');
for (const route of routes) {
  const loc = `https://7ya.io/${route ? `${route}/` : ''}`;
  sitemap.includes(loc) ? pass(`sitemap includes ${loc}`) : fail(`sitemap missing ${loc}`);
}

const robots = read('robots.txt');
for (const snippet of ['User-agent: *', 'Allow: /', 'Sitemap: https://7ya.io/sitemap.xml']) {
  robots.includes(snippet) ? pass(`robots includes ${snippet}`) : fail(`robots missing ${snippet}`);
}

for (const file of ['index.html', 'museum/index.html', 'igor-vepretski/index.html', 'evidence/index.html', 'journey/index.html', 'starton/index.html', 'oracle/index.html', 'business/index.html', 'talk/index.html', 'contact/index.html', 'social/index.html', 'pass/index.html', 'radar/index.html']) {
  const body = read(file);
  for (const bad of ['5.1B+', '10,000+', 'Knesset Candidate', 'Microsoft-backed', 'candidate for Knesset', 'verified leader', 'official partner']) {
    if (body.includes(bad)) fail(`${file} contains unsupported snippet: ${bad}`);
  }
}

if (failures) {
  console.error(`\nSITE_PROCESS_HEALTH: FAIL (${failures})`);
  process.exit(1);
}
console.log('\nSITE_PROCESS_HEALTH: PASS');
