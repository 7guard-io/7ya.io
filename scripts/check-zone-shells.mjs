import crypto from 'node:crypto';
import fs from 'node:fs';
import { aliasRoutes, canonicalRoutes } from './site-contract.mjs';

let failures = 0;
const pass = message => console.log(`PASS ${message}`);
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const requireCondition = (condition, message) => condition ? pass(message) : fail(message);

const stableStringify = value => {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
};

const snapshotPath = 'data/7ya-content-v1.snapshot.json';
const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
requireCondition(snapshot.schema_version === '7ya-content-v1', 'zone snapshot uses 7ya-content-v1');
requireCondition(snapshot.source?.runtime_dependency === false, 'snapshot has no runtime Control Plane dependency');
requireCondition(snapshot.payload?.governance?.render_mode === 'build_time_snapshot', 'render mode is build-time snapshot');
requireCondition(
  snapshot.source?.documents?.some(document => document.drive_file_id === '1h5g4rfdUz-Ifxru98VRivb6KojhNrhcrnebg4Spi0R0' && document.retrieval_status === 'retrieved_and_reviewed'),
  'verified Drive ontology source is recorded'
);
requireCondition(
  snapshot.payload?.governance?.claim_policy?.supernoah === 'independent_preprint_not_peer_reviewed',
  'SUPERNOAH disclosure remains conservative'
);

const expectedZones = ['identity', 'ontology', 'starton', 'evidence', 'experience'];
for (const zone of expectedZones) {
  requireCondition(Boolean(snapshot.payload?.zones?.[zone]), `snapshot includes ${zone} zone`);
}

const actualHash = crypto.createHash('sha256').update(stableStringify(snapshot.payload)).digest('hex');
requireCondition(snapshot.payload_hash === `sha256:${actualHash}`, 'snapshot SHA-256 matches canonical payload');

for (const route of ['research', 'radar', 'verify', 'ledger']) {
  requireCondition(canonicalRoutes.includes(route), `${route} is canonical`);
  const html = fs.readFileSync(`${route}/index.html`, 'utf8');
  requireCondition(html.includes('data-zone-shell'), `${route} includes zone shell`);
  requireCondition(html.includes('data-zone-key='), `${route} binds a zone key`);
  requireCondition(html.includes('/scripts/zone-shells-v1.js'), `${route} loads zone shell runtime`);
  requireCondition(!html.includes('[VERIFY BEFORE PUBLISHING]'), `${route} excludes unresolved verification markers`);
}

const research = fs.readFileSync('research/index.html', 'utf8');
for (const required of ['SUPERNOAH — Independent Preprint', 'not peer reviewed', 'Foundation', 'Integration', 'Evolution']) {
  requireCondition(research.includes(required), `research disclosure includes ${required}`);
}
requireCondition(!research.includes('peer-reviewed research'), 'research page does not overstate peer review');

requireCondition(!aliasRoutes.has('radar'), 'radar is no longer an alias');
const runtime = fs.readFileSync('scripts/zone-shells-v1.js', 'utf8');
for (const token of ['loading', 'empty', 'error', 'lkg', 'crypto.subtle', 'replaceChildren']) {
  requireCondition(runtime.includes(token), `zone runtime includes ${token}`);
}
requireCondition(!runtime.includes('innerHTML'), 'zone runtime excludes innerHTML');
requireCondition(!runtime.includes('localStorage'), 'zone runtime excludes localStorage');

if (failures) {
  console.error(`ZONE_SHELLS_CHECK: FAIL (${failures})`);
  process.exit(1);
}
console.log('ZONE_SHELLS_CHECK: PASS');
