import { readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';
import { buildRagIndex } from './indexer.js';
import type { RagDocument } from './types.js';

function usage(): never {
  console.error('Usage: node dist/packages/rag-core/src/cli.js <documents.json> <index.json>');
  process.exit(2);
}

function parseDocuments(value: unknown): RagDocument[] {
  const documents = Array.isArray(value)
    ? value
    : value && typeof value === 'object' && Array.isArray((value as { documents?: unknown }).documents)
      ? (value as { documents: unknown[] }).documents
      : null;

  if (!documents) throw new Error('input must be an array or an object containing a documents array');
  return documents as RagDocument[];
}

async function main(): Promise<void> {
  const [, , inputPath, outputPath] = process.argv;
  if (!inputPath || !outputPath) usage();

  const input = JSON.parse(await readFile(inputPath, 'utf8')) as unknown;
  const index = buildRagIndex(parseDocuments(input));
  await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
  console.log(`RAG_INDEX_OK documents=${index.documents.length} chunks=${index.chunks.length} output=${outputPath}`);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`RAG_INDEX_FAIL ${message}`);
  process.exitCode = 1;
});
