import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const failures = [];
const fail = message => failures.push(message);

async function readText(relative) {
  try {
    return await fs.readFile(path.join(root, relative), 'utf8');
  } catch {
    fail(`missing ${relative}`);
    return '';
  }
}

async function exists(relative) {
  try {
    await fs.access(path.join(root, relative));
    return true;
  } catch {
    fail(`missing ${relative}`);
    return false;
  }
}

const datasetPath = 'knowledge/life-atlas-slice-v1.json';
const rendererPath = 'scripts/life-atlas-slice-v1.js';
const stylePath = 'styles/life-atlas-slice-v1.css';

const [siteContract, buildScript, renderer] = await Promise.all([
  readText('scripts/site-contract.mjs'),
  readText('scripts/build-static-site.mjs'),
  readText(rendererPath),
]);

await Promise.all([exists(stylePath), exists(rendererPath), exists(datasetPath)]);

let dataset = null;
try {
  dataset = JSON.parse(await fs.readFile(path.join(root, datasetPath), 'utf8'));
} catch {
  fail(`${datasetPath} must be valid JSON`);
}

const moments = Array.isArray(dataset?.moments) ? dataset.moments : [];
if (moments.length < 10) fail(`expected at least 10 life moments, found ${moments.length}`);

const allowedDateStatus = new Set(['verified', 'owner-reported', 'inferred', 'conflict', 'unresolved']);
const allowedVerification = new Set(['verified', 'corroborated', 'owner-archive', 'public-source', 'unresolved']);
const ids = new Set();

for (const [index, moment] of moments.entries()) {
  const label = `moment[${index}]`;
  if (!moment?.id || typeof moment.id !== 'string') fail(`${label} missing id`);
  else if (ids.has(moment.id)) fail(`${label} duplicate id ${moment.id}`);
  else ids.add(moment.id);

  if (!moment?.dateLabel || typeof moment.dateLabel !== 'string') fail(`${label} missing dateLabel`);
  if (!allowedDateStatus.has(moment?.dateStatus)) fail(`${label} invalid dateStatus`);
  if (!allowedVerification.has(moment?.verification)) fail(`${label} invalid verification`);
  if (!moment?.headline?.he || typeof moment.headline.he !== 'string') fail(`${label} missing headline.he`);
  if (!moment?.livedVoice?.he || typeof moment.livedVoice.he !== 'string') fail(`${label} missing livedVoice.he`);
  if (!moment?.sourceHref || !/^https:\/\//.test(moment.sourceHref)) fail(`${label} sourceHref must be https`);
}

if (!siteContract.includes("'life-atlas-slice-v1.css'")) fail('site contract missing LIFE ATLAS stylesheet');
if (!siteContract.includes("'life-atlas-slice-v1.js'")) fail('site contract missing LIFE ATLAS renderer');
if (!siteContract.includes("'knowledge/life-atlas-slice-v1.json'")) fail('site contract missing LIFE ATLAS dataset as critical artifact');

if (!buildScript.includes("new Set(['index.html', 'museum/index.html'])")) fail('build must scope LIFE ATLAS injection to home and museum');
if (!buildScript.includes('/styles/life-atlas-slice-v1.css')) fail('build missing LIFE ATLAS stylesheet injection');
if (!buildScript.includes('/scripts/life-atlas-slice-v1.js')) fail('build missing LIFE ATLAS renderer injection');

if (!renderer.includes('/knowledge/life-atlas-slice-v1.json')) fail('renderer must fetch canonical LIFE ATLAS dataset');
if (!renderer.includes("'/'") || !renderer.includes("'/museum/'")) fail('renderer must define home and museum projection surfaces');
if (!renderer.includes('data-life-atlas-mount')) fail('renderer must create a LIFE ATLAS mount');

if (failures.length) {
  failures.forEach(message => console.error(`FAIL ${message}`));
  console.error(`LIFE_ATLAS_SLICE: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`LIFE_ATLAS_SLICE: PASS (${moments.length} moments, 2 surfaces)`);