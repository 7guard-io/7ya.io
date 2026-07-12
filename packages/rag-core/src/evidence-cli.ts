import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { evidenceClaimsToDocuments } from './evidence-claims.js';
import { buildRagIndex } from './indexer.js';

function usage(): never {
  console.error('Usage: node dist/packages/rag-core/src/evidence-cli.js <evidence-claims.json> <index.json>');
  process.exit(2);
}

async function main(): Promise<void> {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) usage();

  const claims = JSON.parse(await readFile(inputPath, 'utf8')) as unknown;
  const documents = evidenceClaimsToDocuments(claims);
  const index = buildRagIndex(documents);
  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');

  console.log(
    `EVIDENCE_RAG_INDEX_OK documents=${index.documents.length} chunks=${index.chunks.length} output=${outputPath}`,
  );
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`EVIDENCE_RAG_INDEX_FAIL ${message}`);
  process.exitCode = 1;
});
