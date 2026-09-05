import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createEvidenceAtom } from '../src/atom.js';
import { FileSystemAtomStore } from '../src/store.js';
import { LexicalRetriever, rebuildLexicalIndex } from '../src/retrieve.js';

const make = (
  id: string,
  content: string,
  extra: Partial<Parameters<typeof createEvidenceAtom>[0]> = {},
) => createEvidenceAtom({
  subjectId: 'igor-vepretski',
  kind: 'statement',
  content,
  source: {
    sourceId: id,
    sourceType: 'fixture',
    observedAt: '2026-09-05T10:00:00Z',
    title: id === 'source:b' ? 'StartOn youth program' : undefined,
  },
  entities: [],
  topics: [],
  claims: [],
  visibility: 'public',
  verification: { level: 'independent-source' },
  provenance: {
    adapter: 'fixture',
    sourceRecordHash: `hash:${id}:${content}`,
    ingestedAt: '2026-09-05T11:00:00Z',
  },
  ...extra,
});

async function setup() {
  const root = await mkdtemp(path.join(tmpdir(), '7ya-ret-'));
  const store = new FileSystemAtomStore(path.join(root, 'atoms'));
  return { root, store };
}

test('exact phrase and metadata outrank loose body matches, while public retrieval excludes private atoms', async () => {
  const { store } = await setup();
  await store.put(make('source:a', 'StartOn supports youth and community work.'));
  await store.put(make('source:b', 'The program works directly with youth at risk.'));
  await store.put(make('source:private', 'youth at risk confidential', { visibility: 'private' }));
  const results = await new LexicalRetriever(store).search({ query: 'youth at risk', subjectId: 'igor-vepretski', limit: 10, scope: 'public' });
  assert.equal(results[0].source.sourceId, 'source:b');
  assert(!results.some(result => result.source.sourceId === 'source:private'));
  assert(results[0].rankingReasons.length > 0);
});

test('date tokens are searchable and source diversity keeps multiple sources near the top', async () => {
  const { store } = await setup();
  for (let index = 0; index < 4; index++) {
    await store.put(make('source:a', `Committee 2026-08-31 youth at risk note ${index}`));
  }
  await store.put(make('source:b', 'Committee 2026-08-31 youth at risk summary'));
  const results = await new LexicalRetriever(store).search({ query: '2026-08-31 youth at risk', subjectId: 'igor-vepretski', limit: 3, scope: 'public' });
  assert(results.some(result => result.source.sourceId === 'source:a'));
  assert(results.some(result => result.source.sourceId === 'source:b'));
});

test('lexical index is rebuildable entirely from atom storage', async () => {
  const { root, store } = await setup();
  await store.put(make('source:a', 'StartOn youth at risk 2026-08-31'));
  const output = path.join(root, 'index.json');
  const index = await rebuildLexicalIndex(store, output);
  const disk = JSON.parse(await readFile(output, 'utf8'));
  assert.equal(index.version, 1);
  assert.deepEqual(disk, index);
  assert.equal(Object.keys(index.atoms).length, 1);
});
