import { readFile } from 'node:fs/promises';
import type { NormalizedSourceRecord, SourceAdapter, SourceScanInput } from '../adapter.js';

export class LocalCorpusAdapter implements SourceAdapter {
  readonly id = 'local';

  async *scan(input: SourceScanInput): AsyncIterable<NormalizedSourceRecord> {
    const raw = await readFile(input.inputPath, 'utf8');
    const trimmed = raw.trim();
    if (!trimmed) return;
    const rows = trimmed.startsWith('[')
      ? JSON.parse(trimmed)
      : trimmed.split(/\r?\n/).filter(Boolean).map(line => JSON.parse(line));

    for (const row of rows as Record<string, unknown>[]) {
      yield {
        sourceId: String(row.sourceId || ''),
        sourceType: String(row.sourceType || ''),
        platform: row.platform ? String(row.platform) : undefined,
        canonicalUrl: row.canonicalUrl ? String(row.canonicalUrl) : undefined,
        title: row.title ? String(row.title) : undefined,
        author: row.author ? String(row.author) : undefined,
        publishedAt: row.publishedAt ? String(row.publishedAt) : undefined,
        eventDate: row.eventDate ? String(row.eventDate) : undefined,
        observedAt: String(row.observedAt || ''),
        content: String(row.content || ''),
        language: row.language ? String(row.language) : undefined,
        entities: Array.isArray(row.entities) ? row.entities.map(String) : [],
        topics: Array.isArray(row.topics) ? row.topics.map(String) : [],
        claims: Array.isArray(row.claims) ? row.claims.map(String) : [],
        kind: (row.kind || 'unknown') as NormalizedSourceRecord['kind'],
        visibility: (row.visibility || 'private') as NormalizedSourceRecord['visibility'],
        verification: (row.verification && typeof row.verification === 'object'
          ? row.verification
          : { level: 'unverified' }) as NormalizedSourceRecord['verification'],
        sourceRecordHash: String(row.sourceRecordHash || ''),
        metadata: row,
      };
    }
  }
}
