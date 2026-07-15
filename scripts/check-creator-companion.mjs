import fs from 'node:fs';

let failures = 0;
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);

function read(file) {
  if (!fs.existsSync(file)) {
    fail(`${file} missing`);
    return '';
  }
  pass(`${file} exists`);
  return fs.readFileSync(file, 'utf8');
}

function requireText(body, text, label) {
  body.includes(text) ? pass(`${label} includes ${text}`) : fail(`${label} missing ${text}`);
}

const html = read('create/index.html');
const css = read('styles/creator-companion-20260715.css');
const js = read('scripts/creator-companion-20260715.js');
const policyRaw = read('knowledge/creator-companion-policy-20260715.json');

for (const required of [
  '<!doctype html>',
  '<html lang="he" dir="rtl">',
  '<meta name="viewport"',
  '<meta name="robots" content="index,follow',
  '<link rel="canonical" href="https://7ya.io/create/"',
  'creator-companion-foundation-20260715-1',
  '7YA SIGNAL KEY',
  'מלווה שעוזר ליצור',
  'data-mode="create"',
  'data-mode="clarify"',
  'data-mode="build"',
  'data-mode="reflect"',
  'data-mode="verify"',
  'id="companionForm"',
  'id="outputContent"',
  'אין פרסום אוטומטי',
  '/knowledge/creator-companion-policy-20260715.json',
  '/scripts/creator-companion-20260715.js',
  '/styles/creator-companion-20260715.css?v=1'
]) requireText(html, required, 'creator page');

for (const forbidden of [
  'מחליף טיפול',
  'מפרסם אוטומטית',
  'guaranteed success',
  'guru',
  'maximum-scale=1',
  'noindex'
]) {
  html.includes(forbidden) ? fail(`creator page contains forbidden text: ${forbidden}`) : pass(`creator page excludes ${forbidden}`);
}

for (const required of [
  'history-song-records-${part}.json',
  'classifyClaim',
  'findSources',
  'makePackage',
  'localStorage.setItem',
  'USER_PROVIDED',
  'SOURCE_VISIBLE',
  'ASPIRATION',
  'PRIVATE',
  'ONE STORY → MANY ASSETS'
]) requireText(js, required, 'creator script');

for (const required of [
  '@media(max-width:760px)',
  '@media(prefers-reduced-motion:reduce)',
  '.workspace',
  '.chat-panel',
  '.output-panel',
  '.claim-chip'
]) requireText(css, required, 'creator styles');

try {
  const policy = JSON.parse(policyRaw);
  pass('creator policy parses as JSON');
  policy.name === '7YA Signal Key / Creator Companion'
    ? pass('creator policy name is canonical')
    : fail('creator policy name mismatch');
  const modeIds = new Set((policy.modes || []).map(mode => mode.id));
  for (const mode of ['create', 'clarify', 'build', 'reflect', 'verify']) {
    modeIds.has(mode) ? pass(`creator policy includes ${mode}`) : fail(`creator policy missing ${mode}`);
  }
  policy.safety?.does_not_publish_without_approval === true
    ? pass('creator policy blocks unapproved publication')
    : fail('creator policy publication safety missing');
  policy.safety?.private_by_default === true
    ? pass('creator policy is private by default')
    : fail('creator policy privacy default missing');
  policy.local_foundation?.network_generation === false
    ? pass('creator foundation honestly declares local generation')
    : fail('creator foundation provider state is ambiguous');
} catch (error) {
  fail(`creator policy invalid JSON: ${error.message}`);
}

const sitemap = read('sitemap.xml');
requireText(sitemap, 'https://7ya.io/create/', 'sitemap');

if (failures) {
  console.error(`\nCREATOR_COMPANION_CONTRACT: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nCREATOR_COMPANION_CONTRACT: PASS');
