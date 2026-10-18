import { readFile } from 'node:fs/promises';
import { canonicalize } from '../../../evidence-oracle/src/canonicalize.js';
import { sha256Hex } from '../../../evidence-oracle/src/crypto.js';
import type { NormalizedSourceRecord, SourceAdapter, SourceScanInput } from '../adapter.js';

type PublicationState = 'private' | 'unlisted' | 'public' | 'unknown';
type MediaType = 'audio' | 'video' | 'image' | 'document';
type DerivativeRelationship = 'parentOf' | 'componentOf' | 'inputTo';

type DescriptSnapshot = {
  schemaVersion: 1;
  observedAt: string;
  project: { ref: string; name: string };
  sourceAsset: {
    ref: string;
    name: string;
    mediaType: MediaType;
    durationSeconds?: number;
  };
  compositions: Array<{
    ref: string;
    name: string;
    durationSeconds?: number;
    language?: string;
    publication?: {
      state?: PublicationState | string;
      url?: string;
      publishedAt?: string;
    };
    derivative?: {
      relationship?: DerivativeRelationship | string;
      parentRef?: string;
      timestampStart?: number;
      timestampEnd?: number;
    };
    generated?: boolean;
    claims?: string[];
    topics?: string[];
    entities?: string[];
  }>;
};

const publicationStates = new Set<PublicationState>(['private', 'unlisted', 'public', 'unknown']);
const mediaTypes = new Set<MediaType>(['audio', 'video', 'image', 'document']);
const derivativeRelationships = new Set<DerivativeRelationship>(['parentOf', 'componentOf', 'inputTo']);

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function requiredString(value: unknown, field: string): string {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${field} is required`);
  return value.trim();
}

function finiteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string').map(item => item.trim()).filter(Boolean)
    : [];
}

function publicationState(value: unknown): PublicationState {
  return typeof value === 'string' && publicationStates.has(value as PublicationState)
    ? value as PublicationState
    : 'unknown';
}

function publicHttpUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function parseSnapshot(value: unknown): DescriptSnapshot {
  if (!isObject(value) || value.schemaVersion !== 1) throw new TypeError('descript snapshot schemaVersion must be 1');
  if (!isObject(value.project) || !isObject(value.sourceAsset) || !Array.isArray(value.compositions)) {
    throw new TypeError('descript snapshot project, sourceAsset and compositions are required');
  }

  const mediaType = requiredString(value.sourceAsset.mediaType, 'sourceAsset.mediaType');
  if (!mediaTypes.has(mediaType as MediaType)) throw new TypeError('sourceAsset.mediaType is invalid');

  return {
    schemaVersion: 1,
    observedAt: requiredString(value.observedAt, 'observedAt'),
    project: {
      ref: requiredString(value.project.ref, 'project.ref'),
      name: requiredString(value.project.name, 'project.name'),
    },
    sourceAsset: {
      ref: requiredString(value.sourceAsset.ref, 'sourceAsset.ref'),
      name: requiredString(value.sourceAsset.name, 'sourceAsset.name'),
      mediaType: mediaType as MediaType,
      durationSeconds: finiteNumber(value.sourceAsset.durationSeconds),
    },
    compositions: value.compositions as DescriptSnapshot['compositions'],
  };
}

export class DescriptAdapter implements SourceAdapter {
  readonly id = 'descript';

  async *scan(input: SourceScanInput): AsyncIterable<NormalizedSourceRecord> {
    const snapshot = parseSnapshot(JSON.parse(await readFile(input.inputPath, 'utf8')));

    for (const raw of snapshot.compositions) {
      if (!isObject(raw)) throw new TypeError('descript composition must be an object');
      const ref = requiredString(raw.ref, 'composition.ref');
      const name = requiredString(raw.name, 'composition.name');
      const durationSeconds = finiteNumber(raw.durationSeconds);
      const publication = isObject(raw.publication) ? raw.publication : {};
      const state = publicationState(publication.state);
      const canonicalUrl = state === 'public' ? publicHttpUrl(publication.url) : undefined;
      const visibility: NormalizedSourceRecord['visibility'] = state === 'public'
        ? 'public'
        : state === 'unlisted'
          ? 'restricted'
          : 'private';

      const derivativeRaw = isObject(raw.derivative) ? raw.derivative : undefined;
      const relationship = derivativeRaw && typeof derivativeRaw.relationship === 'string'
        && derivativeRelationships.has(derivativeRaw.relationship as DerivativeRelationship)
        ? derivativeRaw.relationship as DerivativeRelationship
        : undefined;
      const derivative = derivativeRaw && relationship
        ? {
            relationship,
            parentRef: requiredString(derivativeRaw.parentRef, 'composition.derivative.parentRef'),
            timestampStart: finiteNumber(derivativeRaw.timestampStart),
            timestampEnd: finiteNumber(derivativeRaw.timestampEnd),
          }
        : undefined;

      const claims = stringArray(raw.claims);
      const topics = stringArray(raw.topics);
      const entities = stringArray(raw.entities);
      const generated = raw.generated === true;
      const language = typeof raw.language === 'string' && raw.language.trim() ? raw.language.trim() : undefined;
      const publishedAt = typeof publication.publishedAt === 'string' && publication.publishedAt.trim()
        ? publication.publishedAt.trim()
        : undefined;
      const sanitizedPublication = {
        state,
        ...(canonicalUrl ? { url: canonicalUrl } : {}),
        ...(publishedAt ? { publishedAt } : {}),
      };
      const sanitizedMetadata = {
        provider: 'descript',
        providerProjectRef: snapshot.project.ref,
        providerProjectName: snapshot.project.name,
        providerCompositionRef: ref,
        sourceAsset: snapshot.sourceAsset,
        ...(durationSeconds !== undefined ? { durationSeconds } : {}),
        ...(derivative ? { derivative } : {}),
        publication: sanitizedPublication,
        generated,
      };
      const durationLabel = durationSeconds !== undefined ? ` (${durationSeconds}s)` : '';
      const lineageLabel = derivative ? ` derived from ${snapshot.sourceAsset.name}` : '';
      const content = `Descript composition ${name}${durationLabel}${lineageLabel}.`;
      const hashPayload = {
        sourceId: `descript:${snapshot.project.ref}:${ref}`,
        observedAt: snapshot.observedAt,
        content,
        language,
        claims,
        topics,
        entities,
        visibility,
        metadata: sanitizedMetadata,
      };

      yield {
        sourceId: `descript:${snapshot.project.ref}:${ref}`,
        sourceType: 'descript-composition',
        platform: 'Descript',
        canonicalUrl,
        title: name,
        publishedAt,
        observedAt: snapshot.observedAt,
        content,
        language,
        entities,
        topics,
        claims,
        kind: 'media',
        visibility,
        verification: { level: 'derived', notes: generated ? 'Composition includes generated or AI-assisted media.' : undefined },
        sourceRecordHash: sha256Hex(canonicalize(hashPayload)),
        metadata: sanitizedMetadata,
      };
    }
  }
}
