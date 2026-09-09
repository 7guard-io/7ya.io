import test from 'node:test';
import assert from 'node:assert/strict';
import {
  LEGACY_COMPENDIUM_RELEASE,
  legacyCompendiumPublicSnapshot,
  validateLegacyCompendiumSnapshot,
} from '../src/compendium.js';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

test('validated legacy snapshot exposes life, digital, people and echo graph records', () => {
  const snapshot = validateLegacyCompendiumSnapshot(legacyCompendiumPublicSnapshot);
  assert.equal(snapshot.release, LEGACY_COMPENDIUM_RELEASE);
  assert.ok(snapshot.activities.some((item) => item.id === 'ACT-2011-000001'));
  assert.ok(snapshot.digitalObjects.some((item) => item.id === 'DOBJ-000002' && item.nativeObjectId === 'feGSc663qww'));
  assert.ok(snapshot.digitalObjects.some((item) => item.id === 'DOBJ-000004' && item.accountHandle === 'UNRESOLVED_2012_ACCOUNT'));
  assert.ok(snapshot.relations.some((item) => item.id === 'REL-000027' && item.predicate === 'distributed_as'));
});

test('public snapshot rejects private provenance locators', () => {
  const candidate = clone(legacyCompendiumPublicSnapshot);
  candidate.sources[0].url = 'GMAIL://private-message';
  assert.throws(() => validateLegacyCompendiumSnapshot(candidate), /private locator|https/i);
});

test('public snapshot rejects missing provenance and non-public-safe records', () => {
  const missing = clone(legacyCompendiumPublicSnapshot);
  missing.activities[0].sourceIds = [];
  assert.throws(() => validateLegacyCompendiumSnapshot(missing), /provenance/i);
  const restricted = clone(legacyCompendiumPublicSnapshot);
  restricted.digitalObjects[0].publicSafety = 'RESTRICTED';
  assert.throws(() => validateLegacyCompendiumSnapshot(restricted), /PUBLIC_SAFE/i);
});

test('digital lineage and echo relations must resolve without inventing identities', () => {
  const candidate = clone(legacyCompendiumPublicSnapshot);
  const firstVideo = candidate.digitalObjects.find((item) => item.id === 'DOBJ-000002')!;
  firstVideo.parentObjectId = 'DOBJ-NOT-FOUND';
  assert.throws(() => validateLegacyCompendiumSnapshot(candidate), /parent does not resolve/i);
  const instagram = legacyCompendiumPublicSnapshot.digitalObjects.find((item) => item.id === 'DOBJ-000004')!;
  assert.equal(instagram.accountHandle, 'UNRESOLVED_2012_ACCOUNT');
  assert.equal(instagram.status, 'CANONICAL_OPEN_IDENTITY');
});

test('time-varying metrics require dated source-bound snapshots', () => {
  const candidate = clone(legacyCompendiumPublicSnapshot);
  candidate.activities[0].metrics = [{ metricType: 'views', value: 1, unit: 'views', snapshotDate: '', sourceId: 'SRC-016' }];
  assert.throws(() => validateLegacyCompendiumSnapshot(candidate), /dated metric provenance/i);
});
