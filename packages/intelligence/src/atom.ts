import { canonicalize } from '../../evidence-oracle/src/canonicalize.js';
import { sha256Hex } from '../../evidence-oracle/src/crypto.js';

export type EvidenceKind = 'fact' | 'claim' | 'statement' | 'event' | 'document' | 'media' | 'observation' | 'inference' | 'opinion' | 'unknown';
export type VerificationLevel = 'primary-source' | 'official-record' | 'independent-source' | 'self-report' | 'derived' | 'unverified';
export type Visibility = 'public' | 'private' | 'restricted';
export type SourceLocator = { page?: number; lineStart?: number; lineEnd?: number; timestampStart?: number; timestampEnd?: number };

export type EvidenceAtomSource = {
  sourceId: string;
  sourceType: string;
  platform?: string;
  canonicalUrl?: string;
  title?: string;
  author?: string;
  publishedAt?: string;
  observedAt: string;
  locator?: SourceLocator;
};

export type EvidenceAtom = {
  atomId: string;
  schemaVersion: 1;
  subjectId: string;
  kind: EvidenceKind;
  content: string;
  language?: string;
  source: EvidenceAtomSource;
  eventDate?: string;
  entities: string[];
  topics: string[];
  claims: string[];
  visibility: Visibility;
  verification: { level: VerificationLevel; confidence?: number; notes?: string };
  provenance: {
    adapter: string;
    sourceRecordHash: string;
    contentHash: string;
    ingestedAt: string;
    evidenceRecordId?: string;
  };
};

export type CreateEvidenceAtomInput = Omit<EvidenceAtom, 'atomId' | 'schemaVersion' | 'provenance'> & {
  provenance: Omit<EvidenceAtom['provenance'], 'contentHash'>;
};

function required(value: string, field: string): string {
  const normalized = value.trim();
  if (!normalized) throw new TypeError(`${field} is required`);
  return normalized;
}

export function normalizeAtomContent(value: string): string {
  return required(value.replace(/\s+/g, ' '), 'content');
}

export function computeAtomContentHash(input: Pick<CreateEvidenceAtomInput, 'kind' | 'content' | 'language' | 'entities' | 'topics' | 'claims'>): string {
  return sha256Hex(canonicalize({
    kind: input.kind,
    content: normalizeAtomContent(input.content),
    language: input.language,
    entities: input.entities,
    topics: input.topics,
    claims: input.claims,
  }));
}

export function computeAtomId(input: Pick<CreateEvidenceAtomInput, 'subjectId' | 'kind' | 'content' | 'source'>): string {
  const identity = canonicalize({
    subjectId: required(input.subjectId, 'subjectId'),
    kind: input.kind,
    content: normalizeAtomContent(input.content),
    sourceId: required(input.source.sourceId, 'source.sourceId'),
    locator: input.source.locator,
  });
  return sha256Hex(`7ya:atom:v1:${identity}`);
}

export function createEvidenceAtom(input: CreateEvidenceAtomInput): EvidenceAtom {
  required(input.source.sourceType, 'source.sourceType');
  required(input.source.observedAt, 'source.observedAt');
  required(input.provenance.adapter, 'provenance.adapter');
  required(input.provenance.sourceRecordHash, 'provenance.sourceRecordHash');
  required(input.provenance.ingestedAt, 'provenance.ingestedAt');
  const content = normalizeAtomContent(input.content);
  return {
    ...input,
    content,
    atomId: computeAtomId({ ...input, content }),
    schemaVersion: 1,
    provenance: {
      ...input.provenance,
      contentHash: computeAtomContentHash({ ...input, content }),
    },
  };
}
