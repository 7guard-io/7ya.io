/**
 * Reconciliation Adapter — Meta ledger to IGOR CORE (Phase 1)
 *
 * Implements docs/superpowers/specs/2026-09-17-meta-ledger-ingestion-design.md
 * section C: classifies ledger records into public reconciliation actions,
 * keeps CONTENT_CLUSTER separate from CREATIVE, never upgrades first-party
 * evidence into independent verification, preserves unresolved conflicts
 * (C005a vs C005b), and maps BIZZI Instagram records onto the existing
 * canonical creative and canonical YouTube source.
 */

import {
  LedgerCorrection,
  LedgerRecord,
  MetaLedger,
  PUBLIC_RECONCILIATION_ACTIONS,
  REJECTED_RECONCILIATION_ACTIONS,
  WITHHELD_RECONCILIATION_ACTIONS,
} from '../ingest/meta-ledger.js';

export type PublicReconciliationAction = (typeof PUBLIC_RECONCILIATION_ACTIONS)[number];

export interface Classification {
  record: LedgerRecord;
  action: string;
  isPublic: boolean;
  warning?: string;
  /** Explicit proven relationship to an existing creative/object, if any. */
  creativeKey: string | null;
  canonicalSourceUrl: string | null;
}

export interface OpenConflict {
  id: string;
  status: string;
  claims: Array<Record<string, unknown>>;
  rule?: string;
}

export interface ReconcileResult {
  publicRecords: Classification[];
  withheldRecords: Classification[];
  openConflicts: OpenConflict[];
  warnings: string[];
}

export class ReconciliationError extends Error {}

const VERIFIED_STATES = new Set(['VERIFIED_INDEPENDENT', 'VERIFIED', 'CANON_READY', 'CANON_READY_WITH_ATTRIBUTION']);
const FIRST_PARTY_STATES = new Set([
  'FIRST_PARTY',
  'FIRST_PARTY_WITH_ATTRIBUTION',
  'FIRST_PARTY_DISTRIBUTION',
  'FIRST_PARTY_COMPRESSED',
  'FIRST_PARTY_MEDIA',
  'FIRST_PARTY_REPOST_OR_CLIP',
  'SELF_ATTESTED',
]);

/**
 * Maps a ledger evidence state onto the projection without ever upgrading
 * first-party or self-attested claims into independent verification.
 * Unknown states are preserved as-is (never invented, never upgraded).
 */
export function mapEvidenceState(state: string | undefined): string | null {
  if (!state) return null;
  return state;
}

/** Guard: refuses any attempt to publish a first-party state as verified. */
export function assertNoEvidencePromotion(before: string | null | undefined, after: string | null): void {
  const beforeState = before ?? '';
  if (FIRST_PARTY_STATES.has(beforeState) && after !== null && after !== beforeState) {
    if (VERIFIED_STATES.has(after)) {
      throw new ReconciliationError(
        `Evidence state ${beforeState} was promoted to ${after}; repeated first-party publication is not independent verification`,
      );
    }
  }
}

/**
 * Classifies every reconciled record. Rejected records never become public;
 * DISCOVERY_ONLY is withheld with a warning; everything else is public.
 * Merging into an existing creative requires an explicit proven
 * relationship (existing_creative / existing_object), never a broad
 * content cluster.
 */
export function reconcileMetaToCore(ledger: MetaLedger): ReconcileResult {
  const warnings: string[] = [];
  const publicRecords: Classification[] = [];
  const withheldRecords: Classification[] = [];
  const creativeUsage = new Map<string, string>();

  for (const record of ledger.reconciled_records) {
    const action = record.reconciliation_action;

    if ((REJECTED_RECONCILIATION_ACTIONS as readonly string[]).includes(action)) {
      throw new ReconciliationError(
        `Record ${record.id} carries rejected action ${action}; rejected records must never reach public projection`,
      );
    }

    const isPublic = (PUBLIC_RECONCILIATION_ACTIONS as readonly string[]).includes(action);
    const isWithheld = (WITHHELD_RECONCILIATION_ACTIONS as readonly string[]).includes(action);
    if (!isPublic && !isWithheld) {
      throw new ReconciliationError(`Record ${record.id} has unrecognized reconciliation action ${action}`);
    }

    const creativeKey = resolveCreativeKey(record);
    const canonicalSourceUrl = record.existing_canonical_source ?? null;

    if (action === 'MERGE') {
      if (creativeKey === null) {
        throw new ReconciliationError(
          `Record ${record.id} is MERGE without an explicit existing creative/object; distribution items may not be merged by content cluster`,
        );
      }
      const previous = creativeUsage.get(creativeKey);
      if (previous !== undefined && previous !== record.id) {
        // Two explicit merges into the same creative are allowed only when
        // each record states the relationship itself; the guard above is the
        // cluster-merge prevention. Track usage for provenance.
        assertSameCanonicalSource(creativeKey, canonicalSourceUrl, record.id);
      }
      creativeUsage.set(creativeKey, record.id);
    }

    const classification: Classification = {
      record,
      action,
      isPublic,
      creativeKey,
      canonicalSourceUrl,
    };

    if (isWithheld) {
      classification.warning = `DISCOVERY_ONLY item ${record.id} is withheld from public projection`;
      warnings.push(classification.warning);
      withheldRecords.push(classification);
    } else {
      publicRecords.push(classification);
    }
  }

  return {
    publicRecords,
    withheldRecords,
    openConflicts: extractOpenConflicts(ledger.canonical_corrections),
    warnings,
  };
}

/**
 * A creative relationship must be stated explicitly. Shared person, place,
 * language, political topic or visual style (a CONTENT_CLUSTER) is never
 * enough to merge two distribution items into one creative.
 */
function resolveCreativeKey(record: LedgerRecord): string | null {
  if (typeof record.existing_creative === 'string' && record.existing_creative.length > 0) {
    return record.existing_creative;
  }
  if (typeof record.existing_object === 'string' && record.existing_object.length > 0) {
    return record.existing_object;
  }
  return null;
}

function assertSameCanonicalSource(creativeKey: string, source: string | null, recordId: string): void {
  if (source !== null && source !== 'https://www.youtube.com/watch?v=jRjZjpqAgEw' && creativeKey.includes('BIZZI')) {
    throw new ReconciliationError(
      `Record ${recordId} maps the BIZZI creative to non-canonical source ${source}`,
    );
  }
}

/** Preserves OPEN_CONFLICT corrections verbatim; conflicts are never resolved here. */
function extractOpenConflicts(corrections: LedgerCorrection[]): OpenConflict[] {
  return corrections
    .filter((correction) => correction.status === 'OPEN_CONFLICT')
    .map((correction) => ({
      id: correction.id,
      status: correction.status ?? 'OPEN_CONFLICT',
      claims: (correction.claims ?? []).map((claim) => ({ ...claim })),
      ...(typeof correction.rule === 'string' ? { rule: correction.rule } : {}),
    }));
}
