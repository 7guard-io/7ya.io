import { readFile } from 'node:fs/promises';
import type { NormalizedSourceRecord, SourceAdapter, SourceScanInput } from '../adapter.js';

export class CollectorAdapter implements SourceAdapter {
  readonly id = 'collector';

  async *scan(input: SourceScanInput): AsyncIterable<NormalizedSourceRecord> {
    const payload = JSON.parse(await readFile(input.inputPath, 'utf8')) as {
      generated_at?: string;
      records?: Record<string, unknown>[];
    };

    for (const record of payload.records ?? []) {
      yield {
        sourceId: String(record.canonical_url || record.final_url || record.target || ''),
        sourceType: 'public-web',
        platform: 'web',
        canonicalUrl: String(record.canonical_url || record.final_url || record.target || ''),
        title: record.title ? String(record.title) : undefined,
        observedAt: payload.generated_at || new Date().toISOString(),
        content: String(record.text_excerpt || record.description || record.title || ''),
        entities: [],
        topics: [],
        claims: [],
        kind: 'document',
        visibility: 'public',
        verification: { level: 'independent-source' },
        sourceRecordHash: String(record.content_sha256 || ''),
        metadata: record,
      };
    }
  }
}
