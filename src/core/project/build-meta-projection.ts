/**
 * Projection Builder — public Meta projection (Phase 1)
 *
 * Implements docs/superpowers/specs/2026-09-17-meta-ledger-ingestion-design.md
 * section D: turns the reconciled Meta ledger into a deterministic,
 * presentation-safe projection at public/data/igor-meta-projection.json.
 * Rejected sources, search-system identifiers and unresolved raw records
 * without safe attribution never reach the projection. Phase 1 changes no
 * public layout; routes consume selectors over this file later.
 */

import { loadMetaLedger, LedgerReadResult } from '../ingest/meta-ledger.js';
import {
  Classification,
  ReconcileResult,
  ReconciliationError,
  reconcileMetaToCore,
} from '../reconcile/meta-to-core.js';

export interface ProjectionMetricCapture {
  capturedAt: string | null;
  likes: number | null;
  comments: number | null;
  scope: string | null;
}

export interface ProjectionRecord {
  id: string;
  canonicalId: string | null;
  objectType: string;
  platform: string;
  account: string;
  sourceUrl: string;
  publishedAt: string;
  mediaType: string;
  title: string | null;
  summary: string | null;
  topics: string[];
  eventId: string | null;
  claimIds: string[] | null;
  creativeId: string | null;
  evidenceState: string | null;
  reconciliationAction: string;
  metricCapture: ProjectionMetricCapture | null;
  ownedOriginalRequired: boolean;
  verificationNeeded: string[] | null;
  canonicalSourceUrl: string | null;
  canonNote: string | null;
  privacyNote: string | null;
}

export interface MetaProjection {
  schemaVersion: string;
  generatedAt: string;
  source: string;
  subject: { name: string; canonicalUrl: string | null };
  counts: {
    ingested: number;
    projected: number;
    withheldDiscoveryOnly: number;
    quarantined: number;
  };
  openConflicts: ReconcileResult['openConflicts'];
  records: ProjectionRecord[];
}

export interface ProjectionBuildResult {
  projection: MetaProjection;
  warnings: string[];
}

/** Build should fail (throw) on malformed input, unsafe records or promotion attempts. */
export function buildMetaProjection(rawLedgerJson: string, sourceName = 'meta-source-ledger-20260917.json'): ProjectionBuildResult {
  const read: LedgerReadResult = loadMetaLedger(rawLedgerJson);
  const reconciled: ReconcileResult = reconcileMetaToCore(read.ledger);

  const records: ProjectionRecord[] = [];
  const warnings: string[] = [...reconciled.warnings];

  for (const classification of reconciled.publicRecords) {
    records.push(projectRecord(classification, warnings));
  }

  records.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));

  const projection: MetaProjection = {
    schemaVersion: '1.0',
    // Deterministic: the projection timestamp comes from the ledger, not the clock.
    generatedAt: read.ledger.generated_at,
    source: sourceName,
    subject: {
      name: read.ledger.subject.name,
      canonicalUrl: read.ledger.subject.canonical_url ?? null,
    },
    counts: {
      ingested: read.ledger.reconciled_records.length,
      projected: records.length,
      withheldDiscoveryOnly: reconciled.withheldRecords.length,
      quarantined: read.quarantine.length,
    },
    openConflicts: reconciled.openConflicts,
    records,
  };

  return { projection, warnings };
}

function projectRecord(classification: Classification, warnings: string[]): ProjectionRecord {
  const record = classification.record;

  const evidenceState = record.evidence_state ?? null;

  const metricCapture = resolveMetricCapture(record);
  if (metricCapture === null) {
    warnings.push(`Record ${record.id} has no public metric capture; metrics remain null`);
  }
  if (record.owned_original_required === true) {
    warnings.push(`Record ${record.id} still requires an owned original before documentary proof upgrades`);
  }

  return {
    id: record.id,
    canonicalId: classification.creativeKey,
    objectType: 'DISTRIBUTION_ITEM',
    platform: record.platform,
    account: record.account,
    sourceUrl: record.url,
    publishedAt: record.published_at,
    mediaType: record.type,
    // Preserve null rather than inventing titles or summaries.
    title: null,
    summary: null,
    topics: Array.isArray(record.links_to_existing_core) ? [...record.links_to_existing_core] : [],
    eventId: null,
    claimIds: null,
    creativeId: classification.creativeKey,
    evidenceState,
    reconciliationAction: classification.action,
    metricCapture,
    ownedOriginalRequired: record.owned_original_required === true,
    verificationNeeded: Array.isArray(record.verification_needed) ? [...record.verification_needed] : null,
    canonicalSourceUrl: classification.canonicalSourceUrl,
    canonNote: typeof record.canon_note === 'string' ? record.canon_note : null,
    privacyNote: typeof record.privacy_note === 'string' ? record.privacy_note : null,
  };
}

/**
 * Uses the latest of repeated metric captures. Public-visible snapshots only;
 * missing metrics stay null (warn), never guessed.
 */
function resolveMetricCapture(record: Classification['record']): ProjectionMetricCapture | null {
  let latest = record.metric_capture ?? null;
  for (const capture of record.metric_captures ?? []) {
    if (latest === null || (capture.captured_at ?? '') >= (latest.captured_at ?? '')) {
      latest = capture;
    }
  }
  if (latest === null) return null;
  return {
    capturedAt: latest.captured_at ?? null,
    likes: latest.likes ?? null,
    comments: latest.comments ?? null,
    scope: latest.scope ?? null,
  };
}

/**
 * Serializes the projection deterministically (idempotent for the same input).
 */
export function serializeProjection(projection: MetaProjection): string {
  return JSON.stringify(projection, null, 2) + '\n';
}
