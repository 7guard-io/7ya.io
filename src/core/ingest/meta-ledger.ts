/**
 * Meta Ledger Reader — 7YA build-time ingestion (Phase 1)
 *
 * Implements docs/superpowers/specs/2026-09-17-meta-ledger-ingestion-design.md
 * section B: loads the reconciled Meta source ledger, validates its schema,
 * rejects constructed/unapproved source URLs, preserves null/UNKNOWN instead
 * of inventing fields, and normalizes Meta search-internal identifiers into
 * `metaSearchInternalId` (they are never Graph API identifiers).
 *
 * No network calls. The raw ledger is never imported directly by public
 * components; this module is the only sanctioned read path.
 */

export const PUBLIC_RECONCILIATION_ACTIONS = [
  'ADD_SOURCE',
  'MERGE',
  'KEEP_VERIFY',
  'MEDIA_ONLY',
] as const;

export const WITHHELD_RECONCILIATION_ACTIONS = ['DISCOVERY_ONLY'] as const;

export const REJECTED_RECONCILIATION_ACTIONS = [
  'REJECT_WRONG_SOURCE',
  'REJECT_WRONG_ENTITY',
] as const;

const ALLOWED_SOURCE_HOSTS = new Set([
  'instagram.com',
  'www.instagram.com',
  'facebook.com',
  'www.facebook.com',
  'threads.com',
  'www.threads.com',
]);

/** Identifier keys Meta search may surface; normalized, never Graph ids. */
const SEARCH_ID_KEYS = [
  'meta_search_internal_id',
  'search_internal_id',
] as const;

export interface LedgerMetricCapture {
  captured_at?: string;
  likes?: number | null;
  comments?: number | null;
  scope?: string;
  change?: string;
}

export interface LedgerRecord {
  id: string;
  platform: string;
  account: string;
  url: string;
  published_at: string;
  type: string;
  reconciliation_action: string;
  links_to_existing_core?: string[];
  evidence_state?: string;
  metric_capture?: LedgerMetricCapture;
  metric_captures?: LedgerMetricCapture[];
  canon_note?: string;
  contains_candidate_objects?: string[];
  owned_original_required?: boolean;
  privacy_note?: string;
  existing_creative?: string;
  existing_canonical_source?: string;
  existing_object?: string;
  verification_needed?: string[];
  metaSearchInternalId?: string;
  [key: string]: unknown;
}

export interface LedgerCorrection {
  id: string;
  status?: string;
  action?: string;
  rejected_url?: string;
  claims?: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface MetaLedger {
  schema_version: string;
  generated_at: string;
  subject: { name: string; canonical_url?: string; [key: string]: unknown };
  purpose?: string;
  policy: { principles?: string[]; allowed_reconciliation_actions?: string[] };
  baseline?: Record<string, unknown>;
  canonical_corrections: LedgerCorrection[];
  reconciled_records: LedgerRecord[];
  open_verification_queue?: Array<Record<string, unknown>>;
  ingestion_status?: Record<string, unknown>;
}

export interface QuarantinedRecord {
  id: string;
  reason: string;
}

export interface LedgerReadResult {
  ledger: MetaLedger;
  /** Records held back from any downstream flow with the reason why. */
  quarantine: QuarantinedRecord[];
  /** URLs rejected by canonical corrections; must never be ingested. */
  rejectedUrls: string[];
}

export class LedgerValidationError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Loads and validates the reconciled Meta ledger from raw JSON text.
 * Throws LedgerValidationError when the build must fail (malformed JSON,
 * missing top-level schema fields, disallowed reconciliation action, or a
 * record pointing at a rejected/constructed source URL).
 */
export function loadMetaLedger(raw: string): LedgerReadResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new LedgerValidationError(`Meta ledger is not valid JSON: ${String(error)}`);
  }
  if (!isRecord(parsed)) {
    throw new LedgerValidationError('Meta ledger must be a JSON object');
  }
  const ledger = parsed as unknown as MetaLedger;

  if (ledger.schema_version !== '1.0') {
    throw new LedgerValidationError(`Unsupported Meta ledger schema_version: ${String(ledger.schema_version)}`);
  }
  if (typeof ledger.generated_at !== 'string' || ledger.generated_at.length === 0) {
    throw new LedgerValidationError('Meta ledger is missing generated_at');
  }
  if (!isRecord(ledger.subject) || typeof ledger.subject.name !== 'string') {
    throw new LedgerValidationError('Meta ledger is missing subject.name');
  }
  if (!isRecord(ledger.policy) || !Array.isArray(ledger.policy.allowed_reconciliation_actions)) {
    throw new LedgerValidationError('Meta ledger is missing policy.allowed_reconciliation_actions');
  }
  if (!Array.isArray(ledger.canonical_corrections)) {
    throw new LedgerValidationError('Meta ledger canonical_corrections must be an array');
  }
  if (!Array.isArray(ledger.reconciled_records)) {
    throw new LedgerValidationError('Meta ledger reconciled_records must be an array');
  }

  const rejectedUrls = ledger.canonical_corrections
    .filter((correction) => correction.action === 'REJECT_WRONG_SOURCE' && typeof correction.rejected_url === 'string')
    .map((correction) => correction.rejected_url as string);

  const allowedActions = new Set(ledger.policy.allowed_reconciliation_actions);
  const quarantine: QuarantinedRecord[] = [];

  for (const record of ledger.reconciled_records) {
    validateRequiredRecordFields(record);
    if (!allowedActions.has(record.reconciliation_action)) {
      throw new LedgerValidationError(
        `Record ${record.id} uses reconciliation action ${record.reconciliation_action} which the ledger policy does not allow`,
      );
    }
    if (rejectedUrls.includes(record.url)) {
      throw new LedgerValidationError(
        `Record ${record.id} points at rejected source URL ${record.url}; rejected sources must never be ingested`,
      );
    }
    validateSourceUrl(record.url, record.id);
    normalizeSearchIdentifiers(record);
  }

  return { ledger, quarantine, rejectedUrls };
}

function validateRequiredRecordFields(record: LedgerRecord): void {
  if (!isRecord(record)) {
    throw new LedgerValidationError('Ledger records must be objects');
  }
  const required: Array<[string, 'string' | 'array']> = [
    ['id', 'string'],
    ['platform', 'string'],
    ['account', 'string'],
    ['url', 'string'],
    ['published_at', 'string'],
    ['type', 'string'],
    ['reconciliation_action', 'string'],
  ];
  for (const [field, kind] of required) {
    const value = (record as Record<string, unknown>)[field];
    if (typeof value !== kind || (kind === 'string' && (value as string).length === 0)) {
      throw new LedgerValidationError(`Ledger record is missing required field ${field}`);
    }
  }
}

function validateSourceUrl(url: string, recordId: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new LedgerValidationError(`Record ${recordId} has an unparseable source URL: ${url}`);
  }
  if (parsed.protocol !== 'https:') {
    throw new LedgerValidationError(`Record ${recordId} source URL must use https: ${url}`);
  }
  if (!ALLOWED_SOURCE_HOSTS.has(parsed.hostname)) {
    throw new LedgerValidationError(`Record ${recordId} source URL host is not an approved platform host: ${url}`);
  }
  // Constructed/guessed locators: spaces or known-fake slugs are rejected.
  if (/\s/.test(url) || /BIZZI-premiere/i.test(url)) {
    throw new LedgerValidationError(`Record ${recordId} appears to use a constructed source URL: ${url}`);
  }
}

/**
 * Meta search-internal identifiers are normalized into `metaSearchInternalId`
 * only. They are explicitly NOT Graph API identifiers and no `graphApiId` key
 * is ever produced.
 */
function normalizeSearchIdentifiers(record: LedgerRecord): void {
  for (const key of SEARCH_ID_KEYS) {
    const value = record[key];
    if (typeof value === 'string' && value.length > 0) {
      record.metaSearchInternalId = value;
      delete record[key];
    }
  }
  if ('graphApiId' in record) {
    throw new LedgerValidationError(
      `Record ${record.id} carries a graphApiId field; Meta search identifiers must never be treated as Graph API ids`,
    );
  }
}
