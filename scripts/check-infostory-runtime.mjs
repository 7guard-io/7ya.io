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
const wall = read('scripts/public-voices-wall-20261127.js');
const style = read('styles/forever-runtime-20260913.css');

const sectionIds = ['home', 'story', 'work', 'topics', 'media'];
for (const id of sectionIds) {
  requireText(home, `id="${id}"`, 'Personal homepage');
}

const imageTags = home.match(/<img\s[^>]*>/gi) || [];
const verifiedPortraitCount = imageTags.filter(tag => tag.includes('/assets/igor-home-portrait-20260712.webp')).length;
verifiedPortraitCount === 1 && imageTags.length >= 8
  ? pass('Personal homepage includes verified hero portrait and seven gallery images')
  : fail(`Personal homepage has ${imageTags.length} image tags and ${verifiedPortraitCount} verified local portraits`);
for (const forbiddenImageHost of ['scontent.fbcdn.net', 'media.licdn.com', 'storage.hidabroot.org', 'pic1.yitweb.co.il']) {
  excludeText(home, forbiddenImageHost, 'Personal homepage image sources');
}

for (const marker of [
  "fetch('/knowledge/social-corpus-20260918.json'",
  'replaceChildren', 'textContent', 'section.dataset.socialCorpusLoaded'
]) requireText(runtime, marker, 'Personal homepage runtime');

requireText(runtime, 'item?.media?.thumbnail', 'Personal homepage approved media resolver');
for (const forbidden of ['innerHTML','localStorage','OPENAI_API_KEY','NVIDIA_API_KEY','img.src=sourceMedia']) excludeText(runtime, forbidden, 'Personal homepage runtime');
for (const marker of ['const fallbackRecords = grid ?','!withheldRecordIds.has(item.id)','let records = fallbackRecords;','records = remoteRecords.length ? remoteRecords : fallbackRecords;','if (fallbackRecords.length) render();']) requireText(wall, marker, 'Public voices fallback runtime');

for (const marker of [
  '.hero', '.story-path', '.work-grid', '.topics', '.contact',
  '@media(max-width:620px)', '@media(prefers-reduced-motion:reduce)'
]) requireText(style, marker, 'Personal homepage style');

if (failures) {
  console.error(`\nINFOSTORY_RUNTIME_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nPERSONAL_HOMEPAGE_RUNTIME_GATE: PASS');
