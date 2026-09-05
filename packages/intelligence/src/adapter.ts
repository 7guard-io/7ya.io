import type { EvidenceKind, VerificationLevel, Visibility } from './atom.js';

export type SourceScanInput = { inputPath: string; subjectId: string };

export type NormalizedSourceRecord = {
  sourceId: string;
  sourceType: string;
  platform?: string;
  canonicalUrl?: string;
  title?: string;
  author?: string;
  publishedAt?: string;
  eventDate?: string;
  observedAt: string;
  content: string;
  language?: string;
  entities: string[];
  topics: string[];
  claims: string[];
  kind: EvidenceKind;
  visibility: Visibility;
  verification: { level: VerificationLevel; confidence?: number; notes?: string };
  sourceRecordHash: string;
  metadata: Record<string, unknown>;
};

export interface SourceAdapter {
  readonly id: string;
  scan(input: SourceScanInput): AsyncIterable<NormalizedSourceRecord>;
}
