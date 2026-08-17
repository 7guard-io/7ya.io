import fs from 'node:fs';

const ledgerPath = 'data/governance/open-pr-triage-2026-08-04.json';
const policyPath = 'docs/governance/SOURCE_OF_TRUTH.md';
const snapshotPath = 'docs/control/CONTROL_PLANE_2026-08-04.json';

const allowed = new Set(['merge', 'rebase', 'archive', 'close', 'review']);
const records = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

if (!Array.isArray(records) || records.length !== 32) {
  throw new Error(`PR triage ledger must contain the 32 open PRs observed on 2026-08-04; found ${records.length}`);
}

const numbers = new Set();
for (const record of records) {
  for (const key of ['number', 'title', 'classification', 'reason', 'required_action', 'security_sensitive', 'review_after']) {
    if (!(key in record)) throw new Error(`PR record missing ${key}`);
  }
  if (!Number.isInteger(record.number) || record.number <= 0) throw new Error('Invalid PR number');
  if (numbers.has(record.number)) throw new Error(`Duplicate PR #${record.number}`);
  numbers.add(record.number);
  if (!allowed.has(record.classification)) throw new Error(`Invalid classification for #${record.number}`);
  if (typeof record.reason !== 'string' || record.reason.length < 20) throw new Error(`Reason too short for #${record.number}`);
  if (typeof record.required_action !== 'string' || record.required_action.length < 10) throw new Error(`Action too short for #${record.number}`);
  if (typeof record.security_sensitive !== 'boolean') throw new Error(`Invalid security flag for #${record.number}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.review_after)) throw new Error(`Invalid review date for #${record.number}`);
}

const byNumber = new Map(records.map((record) => [record.number, record]));
if (!byNumber.get(283)?.security_sensitive || byNumber.get(283)?.classification === 'merge') {
  throw new Error('PR #283 must remain security-sensitive and unmerged');
}
if (byNumber.get(284)?.classification === 'merge') {
  throw new Error('PR #284 cannot be merge-classified until its production receipt is corrected');
}
for (const number of [55, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68]) {
  if (byNumber.get(number)?.classification !== 'close') {
    throw new Error(`Superseded WIP PR #${number} must be classified close`);
  }
}

const policy = fs.readFileSync(policyPath, 'utf8');
for (const phrase of [
  'GitHub is the canonical code source',
  'AppDeploy is the active production runtime',
  'npm run ci:local',
  'rollback target',
  'No direct feature commits to main'
]) {
  if (!policy.includes(phrase)) throw new Error(`Source policy missing: ${phrase}`);
}

const snapshot = JSON.parse(fs.readFileSync(snapshotPath, 'utf8'));
if (snapshot.app_id !== '697a008fddc309b142') throw new Error('Unexpected AppDeploy app id');
if (snapshot.observed_appdeploy_version !== '1785837698202') throw new Error('Unexpected observed AppDeploy version');
if (snapshot.observed_label !== 'v95') throw new Error('Unexpected observed AppDeploy label');
if (snapshot.github_source_alignment !== 'PENDING_EXPORT_AND_COMPARE') throw new Error('Source alignment must remain pending');
if (snapshot.custom_domains?.['7ya.io'] !== 'active' || snapshot.custom_domains?.['www.7ya.io'] !== 'active') {
  throw new Error('Both canonical hostnames must be recorded as active');
}

console.log(`7YA control-plane contract passed for ${records.length} open PR records`);
