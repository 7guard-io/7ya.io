import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPublicCompendiumExport,
  validatePublicCompendiumRecord,
  type CompendiumRecord,
} from '../src/compendium.js';

const valid: CompendiumRecord = {
  id: 'ACT-2022-000001',
  recordType: 'activity',
  title: 'Personal interview — StartOn origin story',
  sourceIds: ['SRC-006'],
  provenance: {
    sourceSystem: 'MASTER_EVIDENCE_LEDGER',
    sourceRecordId: 'SRC-006',
    observedAt: '2026-09-09T00:00:00+03:00',
  },
  publicSafety: 'PUBLIC_SAFE',
  verificationStatus: 'VERIFIED_PUBLIC_SOURCE',
  metrics: [
    {
      metricType: 'views',
      value: 100,
      unit: 'views',
      snapshotDate: '2026-09-09',
      sourceId: 'SRC-006',
    },
  ],
};

test('public gate rejects missing provenance', () => {
  const record = { ...valid, provenance: undefined } as unknown as CompendiumRecord;
  const result = validatePublicCompendiumRecord(record);
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.reasons.includes('missing-provenance'));
});

test('public gate rejects records without PUBLIC_SAFE clearance', () => {
  const result = validatePublicCompendiumRecord({ ...valid, publicSafety: 'RESTRICTED' });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.reasons.includes('not-public-safe'));
});

test('public gate rejects VERIFY_BEFORE_PUBLISHING records', () => {
  const result = validatePublicCompendiumRecord({ ...valid, verificationStatus: 'VERIFY_BEFORE_PUBLISHING' });
  assert.equal(result.ok, false);
  if (!result.ok) assert.ok(result.reasons.includes('verification-blocked'));
});

test('public export accepts a compliant record and preserves dated metric snapshots', () => {
  const result = validatePublicCompendiumRecord(valid);
  assert.deepEqual(result, { ok: true });
  const exported = buildPublicCompendiumExport([valid], '2026-09-09T01:00:00+03:00');
  assert.equal(exported.records.length, 1);
  assert.equal(exported.records[0]?.id, valid.id);
  assert.equal(exported.records[0]?.metrics?.[0]?.snapshotDate, '2026-09-09');
  assert.equal(exported.rejectedCount, 0);
});

test('public export excludes invalid rows instead of silently promoting them', () => {
  const restricted: CompendiumRecord = { ...valid, id: 'ACT-RESTRICTED', publicSafety: 'RESTRICTED' };
  const exported = buildPublicCompendiumExport([valid, restricted], '2026-09-09T01:00:00+03:00');
  assert.deepEqual(exported.records.map((record) => record.id), [valid.id]);
  assert.equal(exported.rejectedCount, 1);
  assert.equal(exported.rejectionReasons['not-public-safe'], 1);
});
