import assert from 'node:assert/strict';
import test from 'node:test';
import { buildRagIndex, chunkDocument, searchRagIndex, type RagDocument } from '../src/index.js';

const documents: RagDocument[] = [
  {
    id: 'starton',
    title: 'StartOn youth hubs',
    sourceUrl: 'https://7ya.io/starton/',
    text: 'StartOn builds technology and media hubs for youth at risk. בני נוער בסיכון מקבלים מרחב, מיומנויות ומנטורים.',
    metadata: { classification: 'public' },
  },
  {
    id: 'evidence',
    title: 'Evidence Ledger',
    sourceUrl: 'https://7ya.io/evidence/',
    text: 'The Evidence Ledger preserves sourced claims, verification status, and append-only integrity proofs.',
  },
  {
    id: 'museum',
    title: 'Digital Museum',
    sourceUrl: 'https://7ya.io/journey/',
    text: 'Цифровой музей сохраняет историю, документы и проверяемые источники.',
  },
];

test('builds a deterministic index independent of input order', () => {
  const forward = buildRagIndex(documents);
  const reverse = buildRagIndex([...documents].reverse());
  assert.deepEqual(reverse, forward);
});

test('retrieves multilingual evidence with source citations', () => {
  const index = buildRagIndex(documents);
  const hebrew = searchRagIndex(index, 'נוער בסיכון');
  const russian = searchRagIndex(index, 'цифровой музей');

  assert.equal(hebrew[0]?.citation.documentId, 'starton');
  assert.equal(hebrew[0]?.citation.sourceUrl, 'https://7ya.io/starton/');
  assert.equal(russian[0]?.citation.documentId, 'museum');

  const source = documents.find((document) => document.id === hebrew[0]?.citation.documentId);
  assert.ok(source);
  assert.equal(source.text.slice(hebrew[0].citation.start, hebrew[0].citation.end), hebrew[0].text);
});

test('returns no result when the index contains none of the query terms', () => {
  const index = buildRagIndex(documents);
  assert.deepEqual(searchRagIndex(index, 'quantum pineapple'), []);
});

test('round-trips through JSON without changing retrieval', () => {
  const index = buildRagIndex(documents);
  const restored = JSON.parse(JSON.stringify(index));
  assert.deepEqual(searchRagIndex(restored, 'append only integrity'), searchRagIndex(index, 'append only integrity'));
});

test('creates bounded overlapping chunks with exact source offsets', () => {
  const text = Array.from({ length: 30 }, (_, index) => `Sentence ${index + 1} explains a verifiable event.`).join(' ');
  const chunks = chunkDocument({ id: 'timeline', text }, { maxChars: 240, overlapChars: 40 });

  assert.ok(chunks.length > 1);
  for (const chunk of chunks) {
    assert.ok(chunk.text.length <= 240);
    assert.equal(text.slice(chunk.start, chunk.end), chunk.text);
  }
  for (let index = 1; index < chunks.length; index += 1) {
    assert.ok(chunks[index].start < chunks[index - 1].end);
    assert.ok(chunks[index].start > chunks[index - 1].start);
  }
});

test('rejects duplicate document ids and unsafe chunk settings', () => {
  assert.throws(() => buildRagIndex([documents[0], documents[0]]), /duplicate document id/);
  assert.throws(() => buildRagIndex(documents, { maxChars: 100 }), /maxChars/);
  assert.throws(() => buildRagIndex(documents, { maxChars: 300, overlapChars: 300 }), /overlapChars/);
});
