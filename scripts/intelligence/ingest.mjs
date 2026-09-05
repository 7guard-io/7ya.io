#!/usr/bin/env node
import {
  CollectorAdapter,
  EvidenceClaimsAdapter,
  FileSystemAtomStore,
  IngestManifestStore,
  LocalCorpusAdapter,
  ingestAdapter,
  parseIngestArgs,
} from '../../dist/packages/intelligence/src/index.js';

const args = parseIngestArgs(process.argv.slice(2));
const adapters = {
  collector: new CollectorAdapter(),
  claims: new EvidenceClaimsAdapter(),
  local: new LocalCorpusAdapter(),
};
const store = new FileSystemAtomStore(process.env.SEVEN_YA_INTELLIGENCE_ATOMS_DIR || 'data/intelligence/atoms');
const manifests = new IngestManifestStore(process.env.SEVEN_YA_INTELLIGENCE_MANIFESTS_DIR || 'data/intelligence/manifests');
const summary = await ingestAdapter(
  adapters[args.adapter],
  { inputPath: args.inputPath, subjectId: args.subjectId },
  { store, manifests },
);

if (args.json) {
  process.stdout.write(`${JSON.stringify(summary)}\n`);
} else {
  console.log(`7YA Intelligence ingest: created=${summary.created} unchanged=${summary.unchanged} skipped=${summary.skipped} rejected=${summary.rejected}`);
  for (const error of summary.errors) console.error(`- ${error}`);
}

if (summary.rejected > 0) process.exitCode = 1;
