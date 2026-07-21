import fs from 'node:fs';

let failures = 0;
const pass = message => console.log(`PASS ${message}`);
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };

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

function excludeText(body, text, label) {
  !body.includes(text) ? pass(`${label} excludes ${text}`) : fail(`${label} contains ${text}`);
}

const page = read('create/index.html');
const css = read('styles/positive-creator-20260715.css');
const client = read('scripts/positive-creator-20260715.js');
const signal = read('scripts/7ya-signal-key-20260715.js');
const proxy = read('ops/vercel-canonical-proxy/api/guide.js');
const recovery = read('ops/vercel-recovery/api/guide.js');

for (const required of [
  'igor-big-brother-creator-path-v2-20260721',
  'אני אח גדול דיגיטלי',
  'אני לא איגור ולא מדבר בשמו',
  'id="creatorPathDock"',
  'data-handoff="gmail"',
  'data-handoff="calendar"',
  'data-handoff="notion"',
  'data-handoff="github"',
  'data-handoff="download"',
  'data-journey-key="beneficiary"',
  'data-journey-key="anchor"',
  'class="impact-lab"',
  'ONE TRUTH · MANY FORMS',
  'TOOLS IN USE · NOT PARTNERS',
]) requireText(page, required, 'creator page v2');

for (const required of [
  '.action-dock',
  '.dock-actions',
  '.platform-module-grid',
  '.impact-lab',
  '@media(max-width:900px)',
  '@media(prefers-reduced-motion:reduce)',
]) requireText(css, required, 'creator stylesheet v2');

for (const required of [
  'SPIRITUAL_ANCHORS',
  'PLATFORM_CREDITS',
  'HANDOFF_MODULES',
  'fifteen_minutes',
  'seven_day_path',
  'platform_pack',
  'creator_mode: selectedMode',
  "persona: 'igor-big-brother-v2'",
  "window.dispatchEvent(new CustomEvent('7ya:creator-result'",
  'https://mail.google.com/mail/?view=cm',
  'https://calendar.google.com/calendar/render',
  'https://www.notion.so/new',
  'https://github.com/7guard-io/7ya.io/issues/new',
  'navigator.share',
]) requireText(client, required, 'creator client v2');

for (const forbidden of ['localStorage', 'sessionStorage', 'innerHTML', 'document.cookie']) {
  excludeText(client, forbidden, 'creator client privacy');
}

for (const required of [
  '7YA · אח גדול',
  "creatorMode: 'create'",
  "creatorMode: 'momentum'",
  "creatorMode: 'impact'",
  "fetch('/api/guide'",
  'fifteen_minutes',
  'seven_day_path',
  'platform_pack',
  "window.addEventListener('7ya:creator-result'",
]) requireText(signal, required, 'site-wide companion v2');
excludeText(signal, 'localStorage', 'site-wide companion privacy');
excludeText(signal, 'innerHTML', 'site-wide companion rendering');

for (const [label, body] of [['proxy guide', proxy], ['recovery guide', recovery]]) {
  for (const required of [
    '7YA Big Brother',
    'positive and practical creator companion',
    'public method and work of Igor Vepretski',
    'Never claim to be Igor Vepretski',
    'one beneficiary and one validated need',
    'Do not diagnose mental health conditions',
    'Never claim divine certainty',
    'fifteen_minutes',
    'seven_day_path',
    'platform_pack',
    'handoffs',
    'credits',
    'deterministic-big-brother-v2',
    'store: false',
  ]) requireText(body, required, label);
  excludeText(body, 'guarantee success', label);
  excludeText(body, 'direct OAuth write completed', label);
}

if (failures) {
  console.error(`\nCREATOR_PATH_V2_CONTRACT: FAIL (${failures})`);
  process.exit(1);
}
console.log('\nCREATOR_PATH_V2_CONTRACT: PASS');
