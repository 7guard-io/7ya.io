import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvidenceAtom } from '../src/atom.js';
import { groupContradictions } from '../src/contradictions.js';
import { IntelligenceQueryService } from '../src/query.js';
import type { Retriever } from '../src/retrieve.js';

function atom(sourceId: string, value: string) {
  return createEvidenceAtom({
    subjectId: 'igor-vepretski',
    kind: 'claim',
    content: `Role status ${value}`,
    source: { sourceId, sourceType: 'fixture', observedAt: '2026-09-05T10:00:00Z' },
    entities: [],
    topics: ['role'],
    claims: [`igor-vepretski|role|${value}`],
    visibility: 'public',
    verification: { level: 'independent-source' },
    provenance: {
      adapter: 'fixture',
      sourceRecordHash: `hash:${sourceId}`,
      ingestedAt: '2026-09-05T11:00:00Z',
    },
  });
}

test('contradiction grouping preserves both incompatible structured claim values', () => {
  const active = atom('source:a', 'active');
  const inactive = atom('source:b', 'inactive');
  const groups = groupContradictions([active, inactive]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].key, 'igor-vepretski|role');
  assert.deepEqual(groups[0].values.map(value => value.value).sort(), ['active', 'inactive']);
  assert.equal(groups[0].atoms.length, 2);
});

test('query service assembles coverage and contradictions without losing ranking provenance', async () => {
  const active = atom('source:a', 'active');
  const inactive = atom('source:b', 'inactive');
  const retriever: Retriever = {
    search: async () => [
      { ...active, score: 10, rankingReasons: ['exact-phrase'] },
      { ...inactive, score: 9, rankingReasons: ['body:1'] },
    ],
  };
  const pack = await new IntelligenceQueryService(retriever, () => '2026-09-05T12:00:00Z').query({
    query: 'role',
    subjectId: 'igor-vepretski',
    scope: 'public',
  });
  assert.equal(pack.atoms.length, 2);
  assert.equal(pack.contradictions.length, 1);
  assert.deepEqual(pack.coverage.sourceTypes, ['fixture']);
  assert.equal(pack.atoms[0].rankingReasons[0], 'exact-phrase');
});
