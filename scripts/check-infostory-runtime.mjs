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
const runtime = read('scripts/social-first-home-20260916.js');
const style = read('styles/forever-runtime-20260913.css');

const sectionIds = ['home', 'story', 'work', 'topics', 'media'];
for (const id of sectionIds) {
  requireText(home, `id="${id}"`, 'Personal homepage');
}

const imageCount = (home.match(/<img\s/g) || []).length;
imageCount >= 5 ? pass('Personal homepage uses varied source-linked imagery') : fail(`Personal homepage has only ${imageCount} image references`);

for (const marker of [
  "fetch('/knowledge/social-corpus-20260918.json'",
  'replaceChildren', 'textContent', 'section.dataset.socialCorpusLoaded'
]) requireText(runtime, marker, 'Personal homepage runtime');

for (const forbidden of [
  'innerHTML',
  'localStorage',
  'OPENAI_API_KEY',
  'NVIDIA_API_KEY',
]) excludeText(runtime, forbidden, 'Personal homepage runtime');

for (const marker of [
  '.hero', '.story-path', '.work-grid', '.topics', '.contact',
  '@media(max-width:620px)', '@media(prefers-reduced-motion:reduce)'
]) requireText(style, marker, 'Personal homepage style');

if (failures) {
  console.error(`\nINFOSTORY_RUNTIME_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nPERSONAL_HOMEPAGE_RUNTIME_GATE: PASS');
