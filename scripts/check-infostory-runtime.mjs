import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failures = 0;

const fail = message => {
  failures += 1;
  console.error(`FAIL ${message}`);
};
const pass = message => console.log(`PASS ${message}`);

function read(file) {
  const resolved = path.join(root, file);
  if (!fs.existsSync(resolved)) {
    fail(`${file} missing`);
    return '';
  }
  return fs.readFileSync(resolved, 'utf8');
}

function requireText(body, text, label) {
  body.includes(text) ? pass(`${label} includes ${text}`) : fail(`${label} missing ${text}`);
}

function excludeText(body, text, label) {
  body.includes(text) ? fail(`${label} contains ${text}`) : pass(`${label} excludes ${text}`);
}

const home = read('index.html');
const runtime = read('scripts/igor-story-cinema-20260716.js');
const guide = read('scripts/7ya-experience-guide-20260716.js');

const chapterIds = ['opening', 'origins', 'service', 'voice', 'human', 'starton', 'system'];
for (const id of chapterIds) {
  requireText(home, `id="${id}"`, 'Infostory homepage');
  if (id !== 'system') requireText(home, `href="#${id}"`, 'Infostory chapter navigation');
}

const chapterCount = (home.match(/data-scene=/g) || []).length;
chapterCount >= 7 ? pass('Infostory has at least seven scenes') : fail(`Infostory has ${chapterCount} scenes`);

for (const marker of [
  "matchMedia('(prefers-reduced-motion: reduce)')",
  'IntersectionObserver', 'updatePage', 'is-visible'
]) requireText(runtime, marker, 'Infostory runtime');

for (const forbidden of [
  'dataset.yaSignalKeyAssets',
  'innerHTML',
  'localStorage',
  'OPENAI_API_KEY',
  'NVIDIA_API_KEY',
]) excludeText(runtime, forbidden, 'Infostory runtime');

for (const marker of [
  '7 / השומר', "sessionStorage.setItem('7ya-guide-path'",
  'history-song-records-', 'public-universe-records-20260715.json',
  'replaceChildren', 'canonicalUrl',
]) requireText(guide, marker, 'Experience guide');
for (const forbidden of ['innerHTML', 'localStorage', 'OPENAI_API_KEY']) excludeText(guide, forbidden, 'Experience guide');

if (failures) {
  console.error(`\nINFOSTORY_RUNTIME_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nINFOSTORY_RUNTIME_GATE: PASS');
