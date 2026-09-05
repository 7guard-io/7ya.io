import test from 'node:test';
import assert from 'node:assert/strict';
import { createEvidenceAtom } from '../src/atom.js';

const base = {
  subjectId: 'igor-vepretski',
  kind: 'statement' as const,
  content: 'StartOn   works with youth at risk.',
  source: {
    sourceId: 'fixture:statement:1',
    sourceType: 'fixture',
    observedAt: '2026-09-05T12:00:00.000Z',
  },
  entities: ['StartOn'],
  topics: ['youth-at-risk'],
  claims: [],
  visibility: 'public' as const,
  verification: { level: 'self-report' as const },
  provenance: {
    adapter: 'fixture',
    sourceRecordHash: 'source-hash-1',
    ingestedAt: '2026-09-05T12:01:00.000Z',
  },
};

test('equivalent atom identity is deterministic and normalizes whitespace', () => {
  const one = createEvidenceAtom(base);
  const two = createEvidenceAtom({
    ...base,
    content: 'StartOn works with youth at risk.',
    provenance: { ...base.provenance, ingestedAt: '2026-09-05T12:02:00.000Z' },
  });
  assert.equal(one.atomId, two.atomId);
  assert.equal(one.provenance.contentHash, two.provenance.contentHash);
  assert.equal(one.content, 'StartOn works with youth at risk.');
});
