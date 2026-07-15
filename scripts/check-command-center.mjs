import fs from 'node:fs';
import path from 'node:path';
import {
  canonicalRoutes,
  criticalArtifactPaths,
  publicRootFiles,
  publicScriptFiles,
  publicStyleFiles,
} from './site-contract.mjs';

const root = process.cwd();
let failures = 0;

const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);
const exists = relative => fs.existsSync(path.join(root, relative));
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

const requiredFiles = [
  'command-center/index.html',
  'data/command-center-status.json',
  'styles/7ya-command-center-20260716.css',
  'scripts/7ya-command-center-20260716.js',
];

for (const file of requiredFiles) {
  exists(file) ? pass(`${file} exists`) : fail(`${file} missing`);
}

if (failures) process.exit(1);

const html = read('command-center/index.html');
const script = read('scripts/7ya-command-center-20260716.js');
const sitemap = read('sitemap.xml');

for (const required of [
  '<!doctype html>',
  'lang="he"',
  'dir="rtl"',
  '<meta name="viewport"',
  '<meta name="robots" content="index, follow',
  '<link rel="canonical" href="https://7ya.io/command-center/"',
  '/styles/7ya-command-center-20260716.css',
  '/scripts/7ya-command-center-20260716.js',
  '/data/command-center-status.json',
  'PUBLIC COMMAND CENTER',
  'Evidence before amplification',
]) {
  html.includes(required) ? pass(`command-center HTML includes ${required}`) : fail(`command-center HTML missing ${required}`);
}

for (const forbidden of [
  '/admin',
  '/api/',
  'password',
  'apiKey',
  'sendEmail',
  'deploy:prod',
  'System Status: Active',
]) {
  !html.includes(forbidden) && !script.includes(forbidden)
    ? pass(`public command center excludes ${forbidden}`)
    : fail(`public command center contains forbidden token ${forbidden}`);
}

canonicalRoutes.includes('command-center')
  ? pass('command-center is a canonical route')
  : fail('command-center missing from canonical routes');

publicRootFiles.includes('data/command-center-status.json')
  ? pass('status JSON is copied into the public artifact')
  : fail('status JSON missing from public root files');

publicStyleFiles.includes('7ya-command-center-20260716.css')
  ? pass('command-center CSS is registered')
  : fail('command-center CSS missing from site contract');

publicScriptFiles.includes('7ya-command-center-20260716.js')
  ? pass('command-center JavaScript is registered')
  : fail('command-center JavaScript missing from site contract');

for (const critical of requiredFiles) {
  criticalArtifactPaths.includes(critical)
    ? pass(`${critical} is a critical artifact path`)
    : fail(`${critical} missing from critical artifact paths`);
}

sitemap.includes('https://7ya.io/command-center/')
  ? pass('sitemap includes command-center')
  : fail('sitemap missing command-center');

let snapshot;
try {
  snapshot = JSON.parse(read('data/command-center-status.json'));
  pass('command-center status parses as JSON');
} catch (error) {
  fail(`command-center status invalid JSON: ${error.message}`);
}

if (snapshot) {
  snapshot.schema_version === 1 ? pass('status schema version is 1') : fail('status schema version mismatch');
  Number.isNaN(Date.parse(snapshot.checked_at)) ? fail('checked_at is not a valid date') : pass('checked_at is a valid date');
  Array.isArray(snapshot.health) ? pass('health is an array') : fail('health must be an array');
  Array.isArray(snapshot.entities) ? pass('entities is an array') : fail('entities must be an array');
  Array.isArray(snapshot.boundaries) ? pass('boundaries is an array') : fail('boundaries must be an array');

  const allowedHealthStates = new Set(['UNKNOWN', 'AVAILABLE', 'DEGRADED', 'STATIC']);
  const healthIds = new Set();
  for (const record of snapshot.health || []) {
    if (!record.id || !record.title || !record.state || !record.summary || !record.source) {
      fail(`invalid health record: ${JSON.stringify(record)}`);
      continue;
    }
    healthIds.has(record.id) ? fail(`duplicate health id ${record.id}`) : healthIds.add(record.id);
    allowedHealthStates.has(record.state)
      ? pass(`${record.id} uses an allowed health state`)
      : fail(`${record.id} uses unsupported health state ${record.state}`);
  }

  const actions = (snapshot.health || []).find(record => record.id === 'github-actions');
  actions?.state === 'DEGRADED' && /Issue #83/.test(actions.source)
    ? pass('GitHub Actions status is scoped to documented Issue #83')
    : fail('GitHub Actions status must remain DEGRADED and sourced to Issue #83');

  const publicSite = (snapshot.health || []).find(record => record.id === 'public-site');
  publicSite?.state === 'UNKNOWN'
    ? pass('public site status remains UNKNOWN pending live verification')
    : fail('public site status must not be promoted without live verification');

  const entityIds = new Set();
  for (const record of snapshot.entities || []) {
    if (!record.id || !record.title || !record.kind || !record.state || !record.summary || !record.source) {
      fail(`invalid entity record: ${JSON.stringify(record)}`);
      continue;
    }
    entityIds.has(record.id) ? fail(`duplicate entity id ${record.id}`) : entityIds.add(record.id);
  }

  const igor = (snapshot.entities || []).find(record => record.id === 'igor-vepretski');
  igor?.state === 'PARTIALLY VERIFIED'
    ? pass('Igor public identity remains partially verified')
    : fail('Igor identity must not be upgraded without stronger evidence');

  const starton = (snapshot.entities || []).find(record => record.id === 'starton');
  starton?.state === 'SOURCE PENDING'
    ? pass('StartOn mission remains source pending')
    : fail('StartOn mission must not be upgraded without attached documentation');

  const oracle = (snapshot.entities || []).find(record => record.id === 'evidence-oracle');
  oracle?.state === 'VERIFIED'
    ? pass('Evidence Oracle is represented as repository-verified')
    : fail('Evidence Oracle status mismatch');
}

if (failures) {
  console.error(`\nCOMMAND_CENTER_QUALITY_GATE: FAIL (${failures})`);
  process.exit(1);
}

console.log('\nCOMMAND_CENTER_QUALITY_GATE: PASS');
