/**
 * CLI: builds public/data/igor-meta-projection.json from the reconciled
 * Meta ledger. Build-time only; no network; exits non-zero on any hard error.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildMetaProjection, serializeProjection } from '../dist/src/core/project/build-meta-projection.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ledgerPath = process.argv[2] ?? path.join(root, 'knowledge', 'meta-source-ledger-20260917.json');
const outPath = process.argv[3] ?? path.join(root, 'public', 'data', 'igor-meta-projection.json');

const raw = fs.readFileSync(ledgerPath, 'utf8');
try {
  const { projection, warnings } = buildMetaProjection(raw, path.basename(ledgerPath));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, serializeProjection(projection));
  console.log(`Meta projection written: ${outPath}`);
  console.log(`records: ${projection.counts.projected} projected / ${projection.counts.ingested} ingested / ${projection.counts.withheldDiscoveryOnly} withheld / ${projection.counts.quarantined} quarantined`);
  for (const warning of warnings) console.warn(`WARN: ${warning}`);
} catch (error) {
  console.error(`Meta projection build FAILED: ${error.message}`);
  process.exit(1);
}
