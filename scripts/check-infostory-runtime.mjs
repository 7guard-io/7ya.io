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
const runtime = read('scripts/igor-infostory-20260716.js');
const signalKey = read('scripts/7ya-signal-key-20260715.js');

const chapterIds = ['chapter-human', 'chapter-origins', 'chapter-voice', 'chapter-creator', 'chapter-system'];
for (const id of chapterIds) {
  requireText(home, `id="${id}"`, 'Infostory homepage');
  requireText(home, `data-story-jump="${id}"`, 'Infostory chapter navigation');
}

const chapterCount = (home.match(/data-story-chapter/g) || []).length;
chapterCount === 5 ? pass('Infostory has exactly five chapters') : fail(`Infostory has ${chapterCount} chapters`);

for (const marker of [
  "window.matchMedia('(prefers-reduced-motion: reduce)')",
  "button.setAttribute('aria-current', 'step')",
  'window.requestAnimationFrame(updateStoryProgress)',
  "style.setAttribute('data-7ya-signal-key-assets', '20260715')",
  "script.setAttribute('data-7ya-signal-key-assets', '20260715')",
  "window.dispatchEvent(new CustomEvent('7ya:creator-seed'",
  "window.location.assign('/create/')",
]) requireText(runtime, marker, 'Infostory runtime');

for (const forbidden of [
  'dataset.yaSignalKeyAssets',
  'innerHTML',
  'localStorage',
  'OPENAI_API_KEY',
  'NVIDIA_API_KEY',
]) excludeText(runtime, forbidden, 'Infostory runtime');

for (const marker of [
  "creatorMode: 'create'",
  "creatorMode: 'momentum'",
  "creatorMode: 'impact'",
  "fetch('/api/guide'",
  "window.addEventListener('7ya:creator-seed'",
  'navigator.clipboard.writeText',
]) requireText(signalKey, marker, 'Signal Key');

if (failures) {
  console.error(`\nINFOSTORY_RUNTIME_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nINFOSTORY_RUNTIME_GATE: PASS');
