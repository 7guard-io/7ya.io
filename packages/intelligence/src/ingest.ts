import type { SourceAdapter, SourceScanInput } from './adapter.js';
import { createEvidenceAtom } from './atom.js';
import type { AtomStore, IngestManifestStore } from './store.js';

export type IngestSummary = {
  created: number;
  unchanged: number;
  skipped: number;
  rejected: number;
  errors: string[];
};

export async function ingestAdapter(
  adapter: SourceAdapter,
  input: SourceScanInput,
  deps: { store: AtomStore; manifests: IngestManifestStore; now?: () => string },
): Promise<IngestSummary> {
  const summary: IngestSummary = { created: 0, unchanged: 0, skipped: 0, rejected: 0, errors: [] };
  const now = deps.now ?? (() => new Date().toISOString());

  try {
    for await (const record of adapter.scan(input)) {
      try {
        if (!record.sourceId.trim() || !record.sourceRecordHash.trim()) {
          throw new TypeError('sourceId and sourceRecordHash are required');
        }
        if (await deps.manifests.get(adapter.id, record.sourceId) === record.sourceRecordHash) {
          summary.skipped++;
          continue;
        }

        const atom = createEvidenceAtom({
          subjectId: input.subjectId,
          kind: record.kind,
          content: record.content,
          language: record.language,
          source: {
            sourceId: record.sourceId,
            sourceType: record.sourceType,
            platform: record.platform,
            canonicalUrl: record.canonicalUrl,
            title: record.title,
            author: record.author,
            publishedAt: record.publishedAt,
            observedAt: record.observedAt,
          },
          eventDate: record.eventDate,
          entities: record.entities,
          topics: record.topics,
          claims: record.claims,
          visibility: record.visibility,
          verification: record.verification,
          provenance: {
            adapter: adapter.id,
            sourceRecordHash: record.sourceRecordHash,
            ingestedAt: now(),
          },
        });

        const result = await deps.store.put(atom);
        summary[result]++;
        await deps.manifests.set(adapter.id, record.sourceId, record.sourceRecordHash);
      } catch (error) {
        summary.rejected++;
        summary.errors.push(error instanceof Error ? error.message : String(error));
      }
    }
  } catch (error) {
    summary.rejected++;
    summary.errors.push(error instanceof Error ? error.message : String(error));
  }

  return summary;
}
