import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
let failures = 0;
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);

function read(relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    fail(`${relative} missing`);
    return '';
  }
  const body = fs.readFileSync(file, 'utf8');
  pass(`${relative} exists`);
  return body;
}

function requireText(body, text, label) {
  body.includes(text) ? pass(`${label} includes ${text}`) : fail(`${label} missing ${text}`);
}

function excludeText(body, text, label) {
  !body.includes(text) ? pass(`${label} excludes ${text}`) : fail(`${label} contains ${text}`);
}

const html = read('response-ai/index.html');
for (const required of [
  '<link rel="canonical" href="https://7ya.io/response-ai/">',
  '<meta name="robots" content="index, follow, max-image-preview:large">',
  'PUBLIC RESPONSE AI',
  'הציבור הגיב.',
  'id="responseQuery"',
  'id="responseGrid"',
  'data-response-mode="positive"',
  '/scripts/public-response-ai-20260715.js',
  '/styles/public-response-ai-20260715.css?v=1',
]) requireText(html, required, 'response AI page');

for (const forbidden of [
  'universal support',
  'כולם תומכים',
  '100% positive',
  'auto publish',
  'private commenter',
]) excludeText(html.toLowerCase(), forbidden.toLowerCase(), 'response AI page');

const h1Count = (html.match(/<h1\b/gi) || []).length;
h1Count === 1 ? pass('response AI page has one H1') : fail(`response AI page has ${h1Count} H1 elements`);

const css = read('styles/public-response-ai-20260715.css');
css.length >= 4000 ? pass('response AI CSS is substantial') : fail('response AI CSS is too thin');
requireText(css, '@media(max-width:900px)', 'response AI CSS');
requireText(css, '@media(prefers-reduced-motion:reduce)', 'response AI CSS');

const script = read('scripts/public-response-ai-20260715.js');
for (const required of [
  "fetch('/knowledge/public-response-signals-20260715.json'",
  'scoreSignal',
  'buildSummary',
  'אין נתונים — אין טענת השפעה',
]) requireText(script, required, 'response AI script');
excludeText(script, 'localStorage', 'response AI script');
excludeText(script, 'sessionStorage', 'response AI script');

let data;
try {
  data = JSON.parse(read('knowledge/public-response-signals-20260715.json'));
  pass('response signal dataset parses as JSON');
} catch (error) {
  fail(`response signal dataset invalid JSON: ${error.message}`);
}

if (data) {
  data.coverage?.canonical_public_records === 66
    ? pass('response dataset preserves 66-record archive count')
    : fail('response dataset archive count mismatch');
  data.coverage?.validated_tiktok_live_comment_records === 10273
    ? pass('response dataset preserves validated LIVE comment count')
    : fail('response dataset LIVE comment count mismatch');
  data.coverage?.raw_comment_text_publication === false
    ? pass('raw comment publication is disabled')
    : fail('raw comment publication must be false');
  const signals = Array.isArray(data.signals) ? data.signals : [];
  signals.length >= 9 ? pass(`response dataset has ${signals.length} signals`) : fail(`response dataset has only ${signals.length} signals`);
  const ids = new Set();
  for (const signal of signals) {
    if (!signal.id || !signal.headline || !signal.interpretation || !signal.source_url || !signal.as_of) {
      fail(`invalid response signal: ${JSON.stringify(signal)}`);
      continue;
    }
    ids.has(signal.id) ? fail(`duplicate response signal ${signal.id}`) : ids.add(signal.id);
    /^https:\/\//.test(signal.source_url) ? pass(`${signal.id} has HTTPS source`) : fail(`${signal.id} source is not HTTPS`);
    ['TIER_1', 'TIER_2', 'TIER_3'].includes(signal.evidence_tier)
      ? pass(`${signal.id} has valid evidence tier`)
      : fail(`${signal.id} evidence tier invalid`);
    ['HIGH', 'MEDIUM', 'LOW'].includes(signal.confidence)
      ? pass(`${signal.id} has confidence label`)
      : fail(`${signal.id} confidence invalid`);
  }
}

const contract = read('scripts/site-contract.mjs');
for (const required of [
  "'entity'",
  "'response-ai'",
  "'master-entity-index-20260715.css'",
  "'public-response-ai-20260715.css'",
  "'public-response-ai-20260715.js'",
  "'knowledge/public-response-signals-20260715.json'",
]) requireText(contract, required, 'site contract');

const sitemap = read('sitemap.xml');
requireText(sitemap, 'https://7ya.io/entity/', 'sitemap');
requireText(sitemap, 'https://7ya.io/response-ai/', 'sitemap');

let release;
try {
  release = JSON.parse(read('release.json'));
  pass('release metadata parses as JSON');
} catch (error) {
  fail(`release metadata invalid JSON: ${error.message}`);
}
if (release) {
  release.critical_surfaces?.includes('/entity/') ? pass('release includes entity atlas') : fail('release missing entity atlas');
  release.critical_surfaces?.includes('/response-ai/') ? pass('release includes response AI') : fail('release missing response AI');
  release.data_contract?.response_signals === '/knowledge/public-response-signals-20260715.json'
    ? pass('release pins response signal dataset')
    : fail('release response signal dataset mismatch');
}

if (failures) {
  console.error(`\nPUBLIC_RESPONSE_AI_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nPUBLIC_RESPONSE_AI_GATE: PASS');
