import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failures = 0;

const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);
const read = relative => {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    fail(`${relative} missing`);
    return '';
  }
  pass(`${relative} exists`);
  return fs.readFileSync(file, 'utf8');
};

const home = read('index.html');
const script = read('scripts/home-public-universe-20260715.js');
const style = read('styles/home-public-universe-20260715.css');
const contract = read('scripts/site-contract.mjs');
const universeRaw = read('knowledge/public-universe-records-20260715.json');

for (const token of [
  'id="universe"',
  'id="homeUniverseGrid"',
  'id="homeUniverseSearch"',
  'id="homeUniverseFilters"',
  'id="homeUniverseMore"',
  '/styles/home-public-universe-20260715.css?v=1',
  '/scripts/home-public-universe-20260715.js',
]) {
  home.includes(token) ? pass(`homepage includes ${token}`) : fail(`homepage missing ${token}`);
}

for (const token of [
  'HOME_UNIVERSE_SOURCE',
  'normalizeRecords',
  'canonicalUrl',
  'replaceChildren',
  'noopener noreferrer',
  'PAGE_SIZE = 18',
]) {
  script.includes(token) ? pass(`home universe script includes ${token}`) : fail(`home universe script missing ${token}`);
}

for (const forbidden of ['innerHTML', 'insertAdjacentHTML', 'document.write(', 'http://']) {
  !script.includes(forbidden) ? pass(`home universe script excludes ${forbidden}`) : fail(`home universe script contains ${forbidden}`);
}

for (const token of [
  '.home-universe-grid',
  '.universe-card',
  '@media(max-width:680px)',
  '@media(prefers-reduced-motion:reduce)',
]) {
  style.includes(token) ? pass(`home universe style includes ${token}`) : fail(`home universe style missing ${token}`);
}

for (const asset of [
  "'home-public-universe-20260715.css'",
  "'home-public-universe-20260715.js'",
  "'styles/home-public-universe-20260715.css'",
  "'scripts/home-public-universe-20260715.js'",
]) {
  contract.includes(asset) ? pass(`site contract includes ${asset}`) : fail(`site contract missing ${asset}`);
}

try {
  const universe = JSON.parse(universeRaw);
  const records = Array.isArray(universe.records) ? universe.records : [];
  records.length >= 20 ? pass(`Public Universe source has ${records.length} records`) : fail(`Public Universe source too small: ${records.length}`);
  const invalid = records.filter(record => !record?.id || !record?.title || !/^https:\/\//.test(record?.url || ''));
  invalid.length === 0 ? pass('Public Universe records have id, title and HTTPS URL') : fail(`${invalid.length} Public Universe records are invalid`);
} catch (error) {
  fail(`Public Universe JSON invalid: ${error.message}`);
}

if (failures) {
  console.error(`\nHOME_PUBLIC_UNIVERSE_CHECK: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nHOME_PUBLIC_UNIVERSE_CHECK: PASS');
