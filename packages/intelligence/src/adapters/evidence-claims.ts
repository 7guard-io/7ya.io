import { readFile } from 'node:fs/promises';
import { canonicalize } from '../../../evidence-oracle/src/canonicalize.js';
import { sha256Hex } from '../../../evidence-oracle/src/crypto.js';
import type { NormalizedSourceRecord, SourceAdapter, SourceScanInput } from '../adapter.js';

function visibilityFor(classification: unknown, status: unknown): NormalizedSourceRecord['visibility'] {
  const normalized = String(classification || status || '').trim().toUpperCase();
  if (normalized === 'PUBLIC') return 'public';
  if (normalized === 'PRIVATE') return 'private';
  return 'restricted';
}

function publicSourceLink(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
}

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
        : (/self|first.?person|founder|personal history|personal narrative/i.test(sourceType) ? 'self-report' : 'independent-source');

      yield {
        sourceId: `evidence-claim:${id}`,
        sourceType,
        canonicalUrl: publicSourceLink(row.sourceLink ?? row.url),
        title: row.title ? String(row.title) : undefined,
        observedAt: String(row.lastChecked || row.date || '1970-01-01T00:00:00.000Z'),
        content: String(row.explanation || row.claim || row.content || row.title || row.description || ''),
        entities: [],
        topics: row.category ? [String(row.category)] : [],
        claims: [],
        kind: 'claim',
        visibility: visibilityFor(row.classification, row.status),
        verification: { level: verificationLevel },
        sourceRecordHash: sha256Hex(canonicalize(row)),
        metadata: { ...row, originalStatus: status },
      };
    }
  }
}
