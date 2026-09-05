import { readFile } from 'node:fs/promises';
import { canonicalize } from '../../../evidence-oracle/src/canonicalize.js';
import { sha256Hex } from '../../../evidence-oracle/src/crypto.js';
import type { NormalizedSourceRecord, SourceAdapter, SourceScanInput } from '../adapter.js';

export class EvidenceClaimsAdapter implements SourceAdapter {
  readonly id = 'claims';

  async *scan(input: SourceScanInput): AsyncIterable<NormalizedSourceRecord> {
    const parsed = JSON.parse(await readFile(input.inputPath, 'utf8')) as unknown;
    const rows = Array.isArray(parsed) ? parsed : ((parsed as { claims?: unknown[] })?.claims ?? []);

    for (const value of rows) {
      const row = value as Record<string, unknown>;
      const id = String(row.id || '');
      const sourceType = String(row.sourceType || row.source_type || 'evidence-claim');
      const status = String(row.status || '');
      const verificationLevel: NormalizedSourceRecord['verification']['level'] = /official|government|court|municipal/i.test(sourceType)
        ? (status.toUpperCase() === 'VERIFIED' ? 'official-record' : 'unverified')
        : (/self|first.?person/i.test(sourceType) ? 'self-report' : 'independent-source');

      yield {
        sourceId: `evidence-claim:${id}`,
        sourceType,
        canonicalUrl: row.url ? String(row.url) : undefined,
        title: row.title ? String(row.title) : undefined,
        observedAt: String(row.lastChecked || row.date || '1970-01-01T00:00:00.000Z'),
        content: String(row.claim || row.title || row.content || row.description || ''),
        entities: [],
        topics: row.category ? [String(row.category)] : [],
        claims: [],
        kind: 'claim',
        visibility: 'public',
        verification: { level: verificationLevel },
        sourceRecordHash: sha256Hex(canonicalize(row)),
        metadata: { ...row, originalStatus: status },
      };
    }
  }
}
