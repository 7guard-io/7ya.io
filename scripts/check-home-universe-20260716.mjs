import fs from 'node:fs';

const files = {
  widget: fs.readFileSync('scripts/7ya-signal-key-20260715.js', 'utf8'),
  universe: fs.readFileSync('scripts/home-public-universe-20260716.js', 'utf8'),
  style: fs.readFileSync('styles/home-public-universe-20260716.css', 'utf8'),
  data: JSON.parse(fs.readFileSync('knowledge/public-universe-records-20260715.json', 'utf8')),
  contract: fs.readFileSync('scripts/site-contract.mjs', 'utf8'),
};

const failures = [];
const requireText = (key, text, message) => { if (!files[key].includes(text)) failures.push(message); };
const forbidText = (key, text, message) => { if (files[key].includes(text)) failures.push(message); };

requireText('widget', 'loadHomeUniverse()', 'Signal Key does not load the homepage Public Universe');
requireText('widget', "window.addEventListener('7ya:creator-seed'", 'creator-seed bridge missing');
requireText('universe', "'/knowledge/public-universe-records-20260715.json'", 'Public Universe source missing');
requireText('universe', "new CustomEvent('7ya:creator-seed'", 'content-to-creator action missing');
requireText('universe', 'textContent', 'safe DOM text rendering missing');
forbidText('universe', 'innerHTML', 'homepage universe must not render source data with innerHTML');
requireText('style', '@media(max-width:650px)', 'mobile universe layout missing');
requireText('style', 'prefers-reduced-motion', 'reduced-motion universe contract missing');
requireText('contract', "'home-public-universe-20260716.css'", 'universe stylesheet absent from artifact contract');
requireText('contract', "'home-public-universe-20260716.js'", 'universe script absent from artifact contract');

const records = Array.isArray(files.data.records) ? files.data.records : [];
if (records.length < 20) failures.push(`Public Universe expansion too small: ${records.length}`);
const urls = new Set();
for (const record of records) {
  if (!record?.id || !record?.title || !record?.url?.startsWith('https://') || !record?.evidence_tier) failures.push(`Invalid universe record: ${record?.id || 'unknown'}`);
  if (record.metric && !record.metric.as_of) failures.push(`Undated metric: ${record.id}`);
  if (urls.has(record.url)) failures.push(`Duplicate exact source URL: ${record.url}`);
  urls.add(record.url);
}

if (failures.length) {
  failures.forEach(message => console.error(`FAIL ${message}`));
  console.error(`HOME_UNIVERSE_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`HOME_UNIVERSE_CONTRACT: PASS (${records.length} expansion records)`);