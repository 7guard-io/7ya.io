import { createHash } from 'node:crypto';
import type { RagChunk, RagChunkOptions, RagDocument } from './types.js';
import { tokenize } from './normalize.js';

const DEFAULT_MAX_CHARS = 1_200;
const DEFAULT_OVERLAP_CHARS = 160;
const MIN_MAX_CHARS = 200;
const BREAK_SCAN_CHARS = 180;

export function resolveChunkOptions(options: RagChunkOptions = {}): Required<RagChunkOptions> {
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;
  const overlapChars = options.overlapChars ?? DEFAULT_OVERLAP_CHARS;

  if (!Number.isInteger(maxChars) || maxChars < MIN_MAX_CHARS) {
    throw new Error(`maxChars must be an integer greater than or equal to ${MIN_MAX_CHARS}`);
  }
  if (!Number.isInteger(overlapChars) || overlapChars < 0 || overlapChars >= maxChars) {
    throw new Error('overlapChars must be a non-negative integer smaller than maxChars');
  }

  return { maxChars, overlapChars };
}

function findPreferredEnd(text: string, start: number, maxChars: number): number {
  const target = Math.min(text.length, start + maxChars);
  if (target === text.length) return target;

  const minimum = Math.max(start + Math.floor(maxChars * 0.6), target - BREAK_SCAN_CHARS);

  for (let cursor = target; cursor > minimum; cursor -= 1) {
    const character = text[cursor - 1];
    if (character === '\n' || /[.!?。！？:;)]/u.test(character)) return cursor;
  }

  for (let cursor = target; cursor > minimum; cursor -= 1) {
    if (/\s/u.test(text[cursor - 1])) return cursor;
  }

  return target;
}

function trimOffsets(text: string, start: number, end: number): { start: number; end: number } {
  let adjustedStart = start;
  let adjustedEnd = end;

  while (adjustedStart < adjustedEnd && /\s/u.test(text[adjustedStart])) adjustedStart += 1;
  while (adjustedEnd > adjustedStart && /\s/u.test(text[adjustedEnd - 1])) adjustedEnd -= 1;

  return { start: adjustedStart, end: adjustedEnd };
}

function createChunkId(documentId: string, ordinal: number, start: number, end: number, text: string): string {
  return createHash('sha256')
    .update(`7ya:rag:chunk:${documentId}:${ordinal}:${start}:${end}\0${text}`)
    .digest('hex');
}

export function chunkDocument(document: RagDocument, options: RagChunkOptions = {}): RagChunk[] {
  if (!document.id.trim()) throw new Error('document id must not be empty');
  if (!document.text.trim()) throw new Error(`document ${document.id} has no text`);

  const resolved = resolveChunkOptions(options);
  const chunks: RagChunk[] = [];
  let start = 0;
  let ordinal = 0;

  while (start < document.text.length) {
    const candidateEnd = findPreferredEnd(document.text, start, resolved.maxChars);
    const offsets = trimOffsets(document.text, start, candidateEnd);

    if (offsets.end > offsets.start) {
      const text = document.text.slice(offsets.start, offsets.end);
      chunks.push({
        id: createChunkId(document.id, ordinal, offsets.start, offsets.end, text),
        documentId: document.id,
        text,
        start: offsets.start,
        end: offsets.end,
        length: tokenize(text).length,
        title: document.title,
        sourceUrl: document.sourceUrl,
        metadata: document.metadata,
      });
      ordinal += 1;
    }

    if (candidateEnd >= document.text.length) break;
    start = Math.max(start + 1, candidateEnd - resolved.overlapChars);
  }

  return chunks;
}
