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
const proxyGuide = read('ops/vercel-canonical-proxy/api/guide.js');
const recoveryGuide = read('ops/vercel-recovery/api/guide.js');
const memory = read('docs/PRODUCT_MEMORY_7YA_LIVING_OS_20260715.md');
const systemMap = read('7ya/index.html');
const sitemap = read('sitemap.xml');

for (const required of [
  '<title>7YA Create',
  'positive-creator-companion-20260715-1',
  'id="creatorForm"',
  'id="creatorInput"',
  'id="chatLog"',
  'data-mode="clarify"',
  'data-mode="create"',
  'data-mode="momentum"',
  'PRIVATE BY DEFAULT',
  'אדם לפני AI',
]) requireText(page, required, 'creator page');

const promptCount = (page.match(/data-prompt=/g) || []).length;
promptCount >= 6 ? pass(`creator page has ${promptCount} guided prompts`) : fail(`creator page has only ${promptCount} guided prompts`);

for (const required of [
  '@media(max-width:680px)',
  '@media(prefers-reduced-motion:reduce)',
  '.chat-shell',
  '.composer',
]) requireText(css, required, 'creator stylesheet');

for (const required of [
  "mode: 'creator'",
  "creator_mode: selectedMode",
  "mode: 'local-coach'",
  'localCreatorCoach',
  'evidence_notes',
  'content_seed',
]) requireText(client, required, 'creator client');
excludeText(client, 'localStorage', 'creator client persistence');
excludeText(client, 'sessionStorage', 'creator client persistence');

for (const [label, body] of [['proxy guide', proxyGuide], ['recovery guide', recoveryGuide]]) {
  for (const required of [
    "request.body?.mode === 'creator'",
    'localCreatorCoach',
    'store: false',
    'OPENAI_API_KEY',
    'positive and practical creator companion',
    'Never claim to be Igor Vepretski',
    'Do not diagnose mental health conditions',
    'reflection',
    'next_step',
    'content_seed',
    'evidence_notes',
  ]) requireText(body, required, label);
  excludeText(body, 'guarantee success', label);
}

for (const required of [
  'Igor Vepretski',
  'StartOn',
  'The History Song',
  'Positive Creator Companion',
  '7YA Radar',
  '7YA Pass',
  'Digital Command',
  'Narrative & Distribution Engine',
  'DISCOVER → FETCH → NORMALIZE → DEDUPLICATE → CLASSIFY → VERIFY → REVIEW → PUBLISH → MEASURE → ARCHIVE',
]) requireText(memory, required, 'product memory');

for (const required of [
  'living-os-system-map-20260715-1',
  '7YA Create',
  '7YA RADAR',
  '7YA PASS',
  'DIGITAL COMMAND',
  'STARTON SEEDS',
  'MEDIA / MUSIC / STUDIO',
  'AGENT COUNCIL',
]) requireText(systemMap, required, '7YA system map');

requireText(sitemap, 'https://7ya.io/create/', 'sitemap');

if (failures) {
  console.error(`\nPOSITIVE_CREATOR_CONTRACT: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nPOSITIVE_CREATOR_CONTRACT: PASS');
