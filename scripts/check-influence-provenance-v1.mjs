import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const policyPath = path.join(root, 'knowledge/influence-provenance-policy-v1.json');
const graphPath = path.join(root, 'knowledge/influence-graph-v1.json');
let failures = 0;
const fail = message => { failures += 1; console.error(`FAIL ${message}`); };
const pass = message => console.log(`PASS ${message}`);

if (!fs.existsSync(policyPath)) fail('influence provenance policy missing');
if (!fs.existsSync(graphPath)) fail('influence graph missing');
if (failures) process.exit(1);

let policy;
let graphRaw = '';
try {
  policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  graphRaw = fs.readFileSync(graphPath, 'utf8');
  pass('provenance policy parses as JSON');
} catch (error) {
  fail(`provenance input invalid: ${error.message}`);
  process.exit(1);
}

policy.schema_version === '1.0' ? pass('provenance schema is 1.0') : fail('provenance schema must be 1.0');
policy.private_drive_material_publication === false ? pass('private Drive publication disabled') : fail('private Drive publication must be false');
policy.private_source_urls_publication === false ? pass('private source URL publication disabled') : fail('private source URL publication must be false');
policy.deduplication?.enabled === true ? pass('source deduplication enabled') : fail('source deduplication must be enabled');
policy.deduplication?.selection_rule === 'MOST_RECENT_VERIFIED_CANONICAL' ? pass('canonical selection rule is conservative') : fail('canonical selection rule mismatch');
policy.claim_resolution?.prefer_stronger_number === false ? pass('stronger-number bias disabled') : fail('must not prefer stronger number');
policy.claim_resolution?.quarantine_conflicts === true ? pass('metric conflicts quarantined') : fail('metric conflicts must be quarantined');

const requiredClasses = new Set(['DRIVE_FORENSIC_WORKBOOK','DRIVE_CANONICAL_WORK_INDEX','DRIVE_HISTORICAL_MASTER_CANON','DRIVE_EVIDENCE_REGISTRY','OWNER_EXPORT','PUBLIC_WEB']);
const classes = new Map((policy.source_classes || []).map(item => [item.id, item]));
for (const id of requiredClasses) {
  const item = classes.get(id);
  if (!item) {
    fail(`missing source class ${id}`);
    continue;
  }
  if (id.startsWith('DRIVE_') && item.public_reference_mode !== 'INTERNAL_SOURCE_KEY_ONLY') fail(`${id} must use internal source keys only`);
  if (id.startsWith('DRIVE_') && item.public_safe !== false) fail(`${id} must be private by default`);
}

for (const forbidden of ['drive.google.com', 'docs.google.com']) {
  graphRaw.includes(forbidden) ? fail(`public graph leaks private Drive URL marker ${forbidden}`) : pass(`public graph excludes ${forbidden}`);
}

const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
emailPattern.test(graphRaw) ? fail('public graph contains an email address') : pass('public graph contains no email address');

const privateMarkers = policy.public_graph_forbidden_markers || [];
for (const marker of privateMarkers) {
  if (!marker) continue;
  graphRaw.includes(marker) ? fail(`public graph contains forbidden marker ${marker}`) : pass(`public graph excludes forbidden marker ${marker}`);
}

if (failures) {
  console.error(`\nINFLUENCE_PROVENANCE_GATE: FAIL (${failures})`);
  process.exit(1);
}
console.log('\nINFLUENCE_PROVENANCE_GATE: PASS');
