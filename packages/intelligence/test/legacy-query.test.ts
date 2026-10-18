import test from 'node:test';
import assert from 'node:assert/strict';
import { queryLegacyGraph } from '../src/legacy-query.js';

test('legacy query retrieves the 2011 digital-origin evidence neighborhood', () => {
  const result = queryLegacyGraph({ q: 'YouTube', from: '2011-01-01', to: '2011-12-31' });
  assert.ok(result.activities.some((item) => item.id === 'ACT-2011-000001'));
  assert.ok(result.digitalObjects.some((item) => item.id === 'DOBJ-000002'));
  assert.ok(result.sources.some((item) => item.id === 'SRC-017'));
});

test('legacy object query returns echo edges without resolving an unknown identity', () => {
  const result = queryLegacyGraph({ objectId: 'DOBJ-000004' });
  const object = result.digitalObjects.find((item) => item.id === 'DOBJ-000004');
  assert.equal(object?.accountHandle, 'UNRESOLVED_2012_ACCOUNT');
  assert.ok(result.relations.some((item) => item.id === 'REL-000027'));
});

test('root person query returns activities attached to the canonical person node', () => {
  const result = queryLegacyGraph({ personId: 'PER-IGOR' });
  assert.ok(result.activities.some((item) => item.id === 'ACT-2011-000001'));
  assert.ok(result.people.some((item) => item.id === 'PER-IGOR'));
});

test('predicate query returns typed graph edges', () => {
  const result = queryLegacyGraph({ predicate: 'belongs_to_account' });
  assert.deepEqual(result.relations.map((item) => item.id), ['REL-000028']);
  assert.ok(result.digitalObjects.some((item) => item.id === 'DOBJ-000002'));
  assert.ok(result.digitalObjects.some((item) => item.id === 'DOBJ-000003'));
});
