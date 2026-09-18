/**
 * Acceptance tests for the Meta ledger ingestion subsystem.
 * Mirrors the ten tests required by
 * docs/superpowers/specs/2026-09-17-meta-ledger-ingestion-design.md.
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import {
  LedgerValidationError,
  loadMetaLedger,
} from '../ingest/meta-ledger.js';
import {
  ReconciliationError,
  assertNoEvidencePromotion,
  reconcileMetaToCore,
} from '../reconcile/meta-to-core.js';
import {
  buildMetaProjection,
  serializeProjection,
} from '../project/build-meta-projection.js';

const LEDGER_PATH = path.join(process.cwd(), 'knowledge', 'meta-source-ledger-20260917.json');
const REJECTED_BIZZI_URL = 'https://www.youtube.com/watch?v=BIZZI-premiere-2025-08-15';
const CANONICAL_BIZZI_URL = 'https://www.youtube.com/watch?v=jRjZjpqAgEw';

function ledgerText(): string {
  return readFileSync(LEDGER_PATH, 'utf8');
}

function baseRecord(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    id: 'meta-src-fixture-0001',
    platform: 'Instagram',
    account: '@fixture',
    url: 'https://www.instagram.com/p/AAAAAAAAAA/',
    published_at: '2026-01-01T00:00:00+03:00',
    type: 'fixture-type',
    reconciliation_action: 'ADD_SOURCE',
    evidence_state: 'FIRST_PARTY',
    ...overrides,
  };
}

function fixtureLedger(records: Record<string, unknown>[], extra: Record<string, unknown> = {}): string {
  return JSON.stringify({
    schema_version: '1.0',
    generated_at: '2026-09-17T16:22:00+03:00',
    subject: { name: 'Igor Vepretski', canonical_url: 'https://7ya.io/igor-vepretski/' },
    policy: { allowed_reconciliation_actions: ['ADD_SOURCE', 'MERGE', 'KEEP_VERIFY', 'MEDIA_ONLY', 'DISCOVERY_ONLY', 'REJECT_WRONG_SOURCE', 'REJECT_WRONG_ENTITY'] },
    canonical_corrections: [],
    reconciled_records: records,
    ...extra,
  });
}

// 1. Raw ledger parses successfully.
test('raw reconciled ledger parses and validates', () => {
  const read = loadMetaLedger(ledgerText());
  assert.equal(read.ledger.reconciled_records.length, 10);
  assert.equal(read.quarantine.length, 0);
});

// 2. Rejected BIZZI guessed URL never appears in projection.
test('rejected BIZZI guessed URL never appears in projection', () => {
  const { projection } = buildMetaProjection(ledgerText());
  const serialized = JSON.stringify(projection);
  assert.ok(!serialized.includes(REJECTED_BIZZI_URL));
  assert.ok(!serialized.includes('BIZZI-premiere'));
});

test('a record pointing at a rejected URL fails ingestion loudly', () => {
  const ledger = fixtureLedger([baseRecord({ url: REJECTED_BIZZI_URL.replace('youtube.com', 'instagram.com') })], {
    canonical_corrections: [
      { id: 'corr-bizzi-url', status: 'APPLIED', action: 'REJECT_WRONG_SOURCE', rejected_url: REJECTED_BIZZI_URL.replace('youtube.com', 'instagram.com') },
    ],
  });
  assert.throws(() => loadMetaLedger(ledger), LedgerValidationError);
});

// 3. Canonical BIZZI YouTube URL remains jRjZjpqAgEw.
test('BIZZI Instagram record maps to the canonical creative and YouTube source', () => {
  const { projection } = buildMetaProjection(ledgerText());
  const bizzi = projection.records.find((record) => record.id === 'meta-src-bizzi-instagram-20260605');
  assert.ok(bizzi);
  assert.equal(bizzi.reconciliationAction, 'MERGE');
  assert.equal(bizzi.creativeId, 'BIZZI — Nawan1 feat. Vepretski');
  assert.equal(bizzi.canonicalSourceUrl, CANONICAL_BIZZI_URL);
  assert.equal(bizzi.objectType, 'DISTRIBUTION_ITEM');
});

// 4. C005a and C005b remain separate and unresolved.
test('police-duration conflict C005a vs C005b survives intact and unresolved', () => {
  const { projection } = buildMetaProjection(ledgerText());
  const conflict = projection.openConflicts.find((entry) => entry.id === 'corr-police-duration');
  assert.ok(conflict);
  assert.equal(conflict.status, 'OPEN_CONFLICT');
  const claimIds = conflict.claims.map((claim) => claim.claim_id).sort();
  assert.deepEqual(claimIds, ['C005a', 'C005b']);
  const serialized = JSON.stringify(projection);
  assert.ok(serialized.includes('Do not merge durations'));
});

// 5. Meta search IDs never appear as Graph API IDs.
test('Meta search identifiers are normalized and never surfaced as Graph API ids', () => {
  const read = loadMetaLedger(fixtureLedger([baseRecord({ meta_search_internal_id: 'srch-internal-777' })]));
  const record = read.ledger.reconciled_records[0] as Record<string, unknown>;
  assert.equal(record.metaSearchInternalId, 'srch-internal-777');
  assert.equal('meta_search_internal_id' in record, false);
  const { projection } = buildMetaProjection(fixtureLedger([baseRecord({ meta_search_internal_id: 'srch-internal-777' })]));
  const serialized = serializeProjection(projection);
  assert.ok(!serialized.includes('graphApiId'));
});

test('a graphApiId field is rejected outright', () => {
  assert.throws(() => loadMetaLedger(fixtureLedger([baseRecord({ graphApiId: '17841400000000000' })])), LedgerValidationError);
});

// 6. SELF_ATTESTED / FIRST_PARTY evidence is never upgraded by repeated posts.
test('first-party evidence states pass through unchanged', () => {
  const { projection } = buildMetaProjection(ledgerText());
  for (const record of projection.records) {
    assert.ok(!['VERIFIED_INDEPENDENT', 'VERIFIED'].includes(record.evidenceState ?? ''));
  }
  assert.ok(projection.records.every((record) => record.evidenceState === null || record.evidenceState.startsWith('FIRST_PARTY')));
});

test('evidence promotion attempt fails the build', () => {
  assert.throws(() => assertNoEvidencePromotion('SELF_ATTESTED', 'VERIFIED_INDEPENDENT'), ReconciliationError);
  assert.throws(() => assertNoEvidencePromotion('FIRST_PARTY', 'CANON_READY'), ReconciliationError);
  // unchanged states never throw
  assertNoEvidencePromotion('FIRST_PARTY', 'FIRST_PARTY');
  assertNoEvidencePromotion(undefined, null);
});

// 7. Different posts are not merged solely by broad content cluster.
test('records without an explicit creative relationship stay separate distribution items', () => {
  const { projection } = buildMetaProjection(fixtureLedger([
    baseRecord({ id: 'lipsync-1', type: 'video', evidence_state: 'FIRST_PARTY_MEDIA' }),
    baseRecord({ id: 'lipsync-2', url: 'https://www.instagram.com/p/CCCCCCCCCC/', type: 'video', evidence_state: 'FIRST_PARTY_MEDIA' }),
  ]));
  assert.equal(projection.records.length, 2);
  assert.ok(projection.records.every((record) => record.creativeId === null));
});

test('MERGE without an explicit existing creative/object fails the build', () => {
  const ledger = fixtureLedger([baseRecord({ reconciliation_action: 'MERGE' })]);
  const read = loadMetaLedger(ledger);
  assert.throws(() => reconcileMetaToCore(read.ledger), ReconciliationError);
});

// 8. REJECT_WRONG_SOURCE / REJECT_WRONG_ENTITY records never reach public projection.
test('rejected records never reach public projection', () => {
  const ledger = fixtureLedger([
    baseRecord({ id: 'good-1' }),
    baseRecord({ id: 'bad-source', url: 'https://www.instagram.com/p/DDDDDDDDDD/', reconciliation_action: 'REJECT_WRONG_SOURCE' }),
    baseRecord({ id: 'bad-entity', url: 'https://www.instagram.com/p/EEEEEEEEEE/', reconciliation_action: 'REJECT_WRONG_ENTITY' }),
  ]);
  const read = loadMetaLedger(ledger);
  assert.throws(() => reconcileMetaToCore(read.ledger), ReconciliationError);
});

// 9. Projection generation is deterministic and idempotent.
test('projection generation is deterministic and idempotent', () => {
  const first = buildMetaProjection(ledgerText());
  const second = buildMetaProjection(ledgerText());
  assert.deepEqual(first.projection, second.projection);
  assert.equal(serializeProjection(first.projection), serializeProjection(second.projection));
});

// 10. Existing public routes still build when the Meta projection is empty or unavailable.
test('empty ledger produces a valid empty projection', () => {
  const { projection } = buildMetaProjection(fixtureLedger([]));
  assert.equal(projection.records.length, 0);
  assert.equal(projection.counts.projected, 0);
  assert.equal(projection.counts.ingested, 0);
});

test('DISCOVERY_ONLY items are withheld from the public projection with a warning', () => {
  const { projection, warnings } = buildMetaProjection(fixtureLedger([
    baseRecord({ id: 'discovery-1', url: 'https://www.instagram.com/p/FFFFFFFFFF/', reconciliation_action: 'DISCOVERY_ONLY' }),
  ]));
  assert.equal(projection.records.length, 0);
  assert.equal(projection.counts.withheldDiscoveryOnly, 1);
  assert.ok(warnings.some((warning) => warning.includes('discovery-1')));
});

test('malformed JSON fails the build', () => {
  assert.throws(() => loadMetaLedger('{not json'), LedgerValidationError);
});

test('unknown action is quarantined/fails rather than projected', () => {
  const ledger = fixtureLedger([baseRecord({ reconciliation_action: 'TELEPORT' })], {
    policy: { allowed_reconciliation_actions: ['ADD_SOURCE'] },
  });
  assert.throws(() => loadMetaLedger(ledger), LedgerValidationError);
});
