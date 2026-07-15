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
  '<title>עם איגור ופרצקי',
  'igor-guided-positive-creator-20260715-2',
  'IGOR VEPRETSKI × 7YA',
  'THE IGOR METHOD',
  '/assets/igor-home-portrait-20260712.webp',
  'id="creatorForm"',
  'id="creatorInput"',
  'id="chatLog"',
  'id="buildJourney"',
  'id="journeyStatus"',
  'data-journey-key="starting_point"',
  'data-journey-key="expression"',
  'data-journey-key="horizon"',
  'data-mode="clarify"',
  'data-mode="create"',
  'data-mode="momentum"',
  'data-mode="impact"',
  'NVIDIA Developer Program + NGC',
  'Microsoft for Startups',
  'TOOLS IN USE · NOT PARTNERS',
  'PRIVATE BY DEFAULT',
  'אדם לפני AI',
]) requireText(page, required, 'creator page');

const promptCount = (page.match(/data-prompt=/g) || []).length;
promptCount >= 10 ? pass(`creator page has ${promptCount} guided prompts`) : fail(`creator page has only ${promptCount} guided prompts`);

for (const required of [
  '@media(max-width:680px)',
  '@media(prefers-reduced-motion:reduce)',
  '.chat-shell',
  '.composer',
  '.igor-presence',
  '.journey-builder',
  '.tools-good',
  '.impact-lab',
]) requireText(css, required, 'creator stylesheet');

for (const required of [
  "mode: 'creator'",
  "creator_mode: selectedMode",
  "mode: 'local-coach'",
  "selectedMode === 'impact'",
  'journeySelections',
  "get('prompt')",
  'isImpact',
  'isTech',
  'localCoach',
  'evidence_notes',
  'content_seed',
]) requireText(client, required, 'creator client');
excludeText(client, 'localStorage', 'creator client persistence');
excludeText(client, 'sessionStorage', 'creator client persistence');

for (const [label, body] of [['proxy guide', proxyGuide], ['recovery guide', recoveryGuide]]) {
  for (const required of [
    "request.body?.mode === 'creator'",
    "['clarify', 'create', 'momentum', 'impact']",
    'localCreatorCoach',
    'store: false',
    'OPENAI_API_KEY',
    'positive and practical creator companion',
    'public method and work of Igor Vepretski',
    'one beneficiary and one validated need',
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
  'Igor-led personal guidance',
  'PERSON → VALIDATED NEED → SMALL SAFE EXPERIMENT',
  'NVIDIA Developer Program + NGC',
  'Microsoft for Startups',
  'TOOLS IN USE',
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
  'TOOLS FOR GOOD',
  'NVIDIA DEVELOPER PROGRAM + NGC',
  'MICROSOFT FOR STARTUPS',
  'TOOLS · NOT PARTNERS',
]) requireText(systemMap, required, '7YA system map');

requireText(sitemap, 'https://7ya.io/create/', 'sitemap');

if (failures) {
  console.error(`\nPOSITIVE_CREATOR_CONTRACT: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nPOSITIVE_CREATOR_CONTRACT: PASS');
