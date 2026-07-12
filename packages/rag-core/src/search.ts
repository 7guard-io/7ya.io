import { tokenize } from './normalize.js';
import type { RagIndex, RagSearchOptions, RagSearchResult } from './types.js';

const BM25_K1 = 1.2;
const BM25_B = 0.75;

export function searchRagIndex(
  index: RagIndex,
  query: string,
  options: RagSearchOptions = {},
): RagSearchResult[] {
  if (index.version !== '7ya-rag-index-v1') throw new Error(`unsupported RAG index version: ${index.version}`);

  const limit = options.limit ?? 5;
  const minimumScore = options.minimumScore ?? 0;
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new Error('limit must be an integer between 1 and 100');
  if (!Number.isFinite(minimumScore) || minimumScore < 0) throw new Error('minimumScore must be a non-negative number');

  const queryFrequencies = new Map<string, number>();
  for (const term of tokenize(query)) {
    queryFrequencies.set(term, (queryFrequencies.get(term) ?? 0) + 1);
  }
  if (queryFrequencies.size === 0 || index.chunks.length === 0) return [];

  const chunksById = new Map(index.chunks.map((chunk) => [chunk.id, chunk]));
  const scores = new Map<string, number>();
  const totalChunks = index.chunks.length;
  const averageLength = index.averageChunkLength || 1;

  for (const [term, queryFrequency] of queryFrequencies) {
    const postings = index.postings[term];
    if (!postings?.length) continue;

    const frequency = index.documentFrequency[term] ?? postings.length;
    const inverseDocumentFrequency = Math.log(1 + (totalChunks - frequency + 0.5) / (frequency + 0.5));
    const queryWeight = 1 + Math.log(queryFrequency);

    for (const posting of postings) {
      const chunk = chunksById.get(posting.chunkId);
      if (!chunk) continue;

      const lengthNormalization = BM25_K1 * (1 - BM25_B + BM25_B * (chunk.length / averageLength));
      const termScore = inverseDocumentFrequency
        * ((posting.frequency * (BM25_K1 + 1)) / (posting.frequency + lengthNormalization))
        * queryWeight;
      scores.set(chunk.id, (scores.get(chunk.id) ?? 0) + termScore);
    }
  }

  const ranked = [...scores.entries()]
    .filter(([, score]) => score >= minimumScore)
    .sort(([leftId, leftScore], [rightId, rightScore]) => rightScore - leftScore || leftId.localeCompare(rightId))
    .slice(0, limit);

  return ranked.map(([chunkId, score], indexPosition) => {
    const chunk = chunksById.get(chunkId);
    if (!chunk) throw new Error(`RAG index references missing chunk: ${chunkId}`);

    return {
      rank: indexPosition + 1,
      score: Number(score.toFixed(6)),
      text: chunk.text,
      citation: {
        documentId: chunk.documentId,
        chunkId: chunk.id,
        title: chunk.title,
        sourceUrl: chunk.sourceUrl,
        start: chunk.start,
        end: chunk.end,
      },
      metadata: chunk.metadata,
    };
  });
}
