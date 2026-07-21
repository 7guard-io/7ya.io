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

const museum = read('museum/index.html');
const influence = read('influence/index.html');
const css = read('styles/public-archive-v2-20260721.css');
const client = read('scripts/public-content-museum-20260715.js');
const jsonRaw = read('knowledge/igor-drive-forensic-archive-20260721.json');

let archive = null;
try {
  archive = JSON.parse(jsonRaw);
  pass('forensic archive parses');
} catch (error) {
  fail(`forensic archive invalid JSON: ${error.message}`);
}

for (const required of [
  'igor-public-archive-v2-20260721',
  '/styles/public-archive-v2-20260721.css?v=1',
  'https://drive.google.com/thumbnail?id=1WKhOrE4Ppq5RFb7vd5uFRShUDZMGiK1W&sz=w1600',
  'id="museumForensicCount"',
  'id="museumTikTokLedger"',
  'id="museumScreenshotCount"',
  'צילום מסך אמיתי מסומן כצילום',
  '66 רשומות הן ליבת האימות',
]) requireText(museum, required, 'museum');

excludeText(museum, 'class="hero-source', 'museum portrait overlays');
requireText(influence, '/museum/', 'influence full library link');
requireText(influence, '66 הן ליבת אימות', 'influence scope disclosure');

for (const required of [
  '.archive-intelligence',
  '.source-wall',
  'grid-template-columns:repeat(12',
  '.weight-feature',
  '.capture-badge',
  '.source-poster',
  '.tiktok-ledger-row',
  '.hero-source{display:none!important}',
]) requireText(css, required, 'archive stylesheet');

for (const required of [
  'PUBLIC_UNIVERSE',
  'VERIFIED_CORE',
  'DRIVE_FORENSIC',
  'canonicalSourceKey',
  'public-universe-records-20260715.json',
  'igor-drive-forensic-archive-20260721.json',
  'coreRecords.length < 66',
  'SOURCE CARD · NOT A SCREENSHOT',
  'renderTikTokLedger',
  'replaceChildren',
]) requireText(client, required, 'archive client');

excludeText(client, '<iframe', 'archive client');
excludeText(client, 'autoplay', 'archive client');
excludeText(client, 'localStorage', 'archive client');

if (archive) {
  const records = Array.isArray(archive.records) ? archive.records : [];
  records.length >= 15 ? pass(`forensic archive has ${records.length} records`) : fail(`forensic archive has only ${records.length} records`);
  archive.stats?.tiktok_exported_posts === 904 ? pass('TikTok export count is 904') : fail('TikTok export count mismatch');
  archive.stats?.facebook_graph_nodes === 17 ? pass('Facebook graph count is 17') : fail('Facebook graph count mismatch');
  archive.stats?.screenshot_queue_open === 7 ? pass('screenshot queue count is 7') : fail('screenshot queue count mismatch');
  Array.isArray(archive.tiktok_ledger) && archive.tiktok_ledger.length === 10
    ? pass('TikTok ledger has 10 ranked records')
    : fail('TikTok ledger must have 10 ranked records');

  const ids = new Set();
  for (const record of records) {
    if (!record.id || !record.title || !record.url || !record.platform || !record.evidence_tier || !record.capture_status) {
      fail(`invalid forensic record: ${JSON.stringify(record)}`);
      continue;
    }
    if (ids.has(record.id)) fail(`duplicate forensic ID ${record.id}`);
    ids.add(record.id);
    /^https:\/\//.test(record.url) ? pass(`${record.id} has HTTPS source`) : fail(`${record.id} source is not HTTPS`);
    ['TIER_1', 'TIER_2', 'TIER_3'].includes(record.evidence_tier)
      ? pass(`${record.id} has valid tier`)
      : fail(`${record.id} has invalid tier`);
    if (record.metric && !record.metric.as_of) fail(`${record.id} metric missing as_of`);
  }
}

if (failures) {
  console.error(`\nPUBLIC_ARCHIVE_V2_CONTRACT: FAIL (${failures})`);
  process.exit(1);
}
console.log('\nPUBLIC_ARCHIVE_V2_CONTRACT: PASS');
