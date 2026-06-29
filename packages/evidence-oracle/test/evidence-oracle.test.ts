import assert from 'node:assert/strict';
import { test } from 'node:test';
import { canonicalize, computePayloadHash, createEvidenceRecord, getMerkleProof, buildMerkleRoot, verifyMerkleProof, safeLog, verifyEvidenceRecord } from '../src/index.js';

test('canonicalization returns same output for same object with different key order', () => {
  assert.equal(canonicalize({ b: 2, a: { d: 4, c: 3 } }), canonicalize({ a: { c: 3, d: 4 }, b: 2 }));
});

test('payload tampering changes payloadHash', () => {
  assert.notEqual(computePayloadHash({ amount: 7 }), computePayloadHash({ amount: 8 }));
});

test('valid generated Merkle proof verifies true for a 4-leaf tree', () => {
  const leaves = ['a', 'b', 'c', 'd'].map(computePayloadHash);
  const proof = getMerkleProof(leaves, 0);
  assert.equal(proof.length, 2);
  assert.deepEqual(proof[0], { position: 'right', hash: leaves[1] });
  assert.equal(proof[1].position, 'right');
  assert.equal(verifyMerkleProof(leaves[0], proof, buildMerkleRoot(leaves)), true);
});

test('invalid proof verifies false', () => {
  const leaves = ['a', 'b', 'c', 'd'].map(computePayloadHash);
  const proof = getMerkleProof(leaves, 0);
  assert.equal(verifyMerkleProof(leaves[0], [{ ...proof[0], hash: computePayloadHash('evil') }, proof[1]], buildMerkleRoot(leaves)), false);
});

test('3-leaf odd tree proof verifies true', () => {
  const leaves = ['a', 'b', 'c'].map(computePayloadHash);
  assert.equal(verifyMerkleProof(leaves[2], getMerkleProof(leaves, 2), buildMerkleRoot(leaves)), true);
});

test('safeLog redacts sk-* keys, API key strings, bearer tokens, and authorization headers', () => {
  const original = console.log;
  const calls: string[] = [];
  console.log = (...args: unknown[]) => { calls.push(args.join(' ')); };
  try {
    safeLog('secret test', {
      openai: 'sk-1234567890abcdef',
      text: 'api_key=abc123 Bearer eyJhbGciOi.secret Authorization: Basic abc',
      headers: { authorization: 'Bearer topsecret', 'x-api-key': 'abc123' },
    });
  } finally {
    console.log = original;
  }
  const output = calls.join('\n');
  assert.match(output, /\[REDACTED\]/);
  assert.doesNotMatch(output, /sk-1234567890abcdef|abc123|topsecret|eyJhbGciOi\.secret|Basic abc/);
});

test('chainHash changes if chainPrevHash changes', () => {
  const base = { payload: { ok: true }, metadata: {}, createdAt: '2026-06-29T00:00:00.000Z', source: 'unit-test' };
  assert.notEqual(createEvidenceRecord({ ...base, chainPrevHash: 'one' }).chainHash, createEvidenceRecord({ ...base, chainPrevHash: 'two' }).chainHash);
});

test('verifyEvidenceRecord returns false after tampering with source/status/metadataHash/payloadHash', () => {
  const record = createEvidenceRecord({ payload: { x: 1 }, metadata: { y: 2 }, createdAt: '2026-06-29T00:00:00.000Z', source: 'unit-test', status: 'created' });
  assert.equal(verifyEvidenceRecord(record), true);
  assert.equal(verifyEvidenceRecord({ ...record, source: 'other' }), false);
  assert.equal(verifyEvidenceRecord({ ...record, status: 'revoked' }), false);
  assert.equal(verifyEvidenceRecord({ ...record, metadataHash: computePayloadHash({ y: 3 }) }), false);
  assert.equal(verifyEvidenceRecord({ ...record, payloadHash: computePayloadHash({ x: 9 }) }), false);
});
