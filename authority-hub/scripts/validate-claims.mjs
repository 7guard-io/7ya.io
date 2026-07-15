import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const file = path.join(root, 'src/data/claims.json');
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const statuses = new Set(['VERIFIED', 'VERIFIED_WITH_ATTRIBUTION', 'DATED_BASELINE', 'QUARANTINED', 'CAPTURE_REQUIRED']);
const locales = ['he', 'en', 'ru'];
const failures = [];

if (data.schemaVersion !== 1) failures.push('schemaVersion must equal 1');
if (!Array.isArray(data.claims) || data.claims.length === 0) failures.push('claims must be a non-empty array');

const ids = new Set();
for (const [index, claim] of (data.claims || []).entries()) {
  const label = claim.id || `row-${index + 1}`;
  if (!/^C\d{3}$/.test(claim.id || '')) failures.push(`${label}: id must match C001 format`);
  if (ids.has(claim.id)) failures.push(`${label}: duplicate id`);
  ids.add(claim.id);
  if (!statuses.has(claim.status)) failures.push(`${label}: invalid status ${claim.status}`);
  for (const key of ['entity', 'evidenceClass', 'sourceId', 'sourceName', 'sourceUrl']) {
    if (typeof claim[key] !== 'string' || !claim[key].trim()) failures.push(`${label}: missing ${key}`);
  }
  for (const field of ['title', 'whatItProves', 'whatItDoesNotProve']) {
    for (const locale of locales) {
      if (typeof claim[field]?.[locale] !== 'string' || !claim[field][locale].trim()) failures.push(`${label}: missing ${field}.${locale}`);
    }
  }
  if (claim.status === 'DATED_BASELINE' && !/^\d{4}-\d{2}-\d{2}$/.test(claim.snapshotDate || '')) {
    failures.push(`${label}: DATED_BASELINE requires snapshotDate`);
  }
  if (claim.status === 'QUARANTINED' && !claim.sourceUrl.startsWith('internal://')) {
    failures.push(`${label}: quarantined source must remain internal`);
  }
}

if (failures.length) {
  failures.forEach((failure) => console.error(`FAIL ${failure}`));
  console.error(`CLAIMS_CONTRACT: FAIL (${failures.length})`);
  process.exit(1);
}

console.log(`CLAIMS_CONTRACT: PASS (${data.claims.length} claims)`);
