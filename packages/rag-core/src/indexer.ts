import { chunkDocument, resolveChunkOptions } from './chunk.js';
import { tokenize } from './normalize.js';
import type { RagDocument, RagIndex, RagPosting, RagChunkOptions } from './types.js';

function assertDocuments(documents: RagDocument[]): void {
  if (!Array.isArray(documents) || documents.length === 0) {
    throw new Error('at least one document is required');
  }

  const ids = new Set<string>();
  for (const document of documents) {
    if (!document || typeof document !== 'object') throw new Error('each document must be an object');
    if (typeof document.id !== 'string' || !document.id.trim()) throw new Error('document id must not be empty');
    if (typeof document.text !== 'string' || !document.text.trim()) {
      throw new Error(`document ${document.id} has no text`);
    }
    if (ids.has(document.id)) throw new Error(`duplicate document id: ${document.id}`);
    ids.add(document.id);
  }
}

export function buildRagIndex(documents: RagDocument[], options: RagChunkOptions = {}): RagIndex {
  assertDocuments(documents);
  const resolved = resolveChunkOptions(options);
  const orderedDocuments = [...documents].sort((left, right) => left.id.localeCompare(right.id));
  const chunks = orderedDocuments.flatMap((document) => chunkDocument(document, resolved));
  const mutablePostings = new Map<string, RagPosting[]>();

  for (const chunk of chunks) {
    const frequencies = new Map<string, number>();
    for (const term of tokenize(chunk.text)) {
      frequencies.set(term, (frequencies.get(term) ?? 0) + 1);
    }

    for (const [term, frequency] of frequencies) {
      const posting = { chunkId: chunk.id, frequency };
      const current = mutablePostings.get(term);
      if (current) current.push(posting);
      else mutablePostings.set(term, [posting]);
    }
  }

  const postings: Record<string, RagPosting[]> = {};
  const documentFrequency: Record<string, number> = {};
  const orderedTerms = [...mutablePostings.keys()].sort((left, right) => left.localeCompare(right));

  for (const term of orderedTerms) {
    const termPostings = mutablePostings.get(term) ?? [];
    termPostings.sort((left, right) => left.chunkId.localeCompare(right.chunkId));
    postings[term] = termPostings;
    documentFrequency[term] = termPostings.length;
  }

  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);

  return {
    version: '7ya-rag-index-v1',
    options: resolved,
    documents: orderedDocuments.map(({ text: _text, ...summary }) => summary),
    chunks,
    postings,
    documentFrequency,
    averageChunkLength: chunks.length === 0 ? 0 : totalLength / chunks.length,
  };
}
