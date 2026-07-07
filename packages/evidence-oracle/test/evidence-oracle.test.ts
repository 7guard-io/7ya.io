import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  canonicalize,
  computePayloadHash,
  createEvidenceRecord,
  getMerkleProof,
  buildMerkleRoot,
  verifyMerkleProof,
  safeLog,
  verifyEvidenceRecord,
  parseEvidenceOracleClaim,
  isEvidenceClaimSafeToPublish,
  findBlockedClaimPhrases,
} from '../src/index.js';

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

test('source_pending Evidence Oracle claim can be parsed with honest public language and no evidence refs', () => {
  const claim = parseEvidenceOracleClaim({
    id: 'claim-views-aggregate',
    title: 'Aggregate public influence claim',
    claim: 'Aggregate views claim is pending source verification.',
    source_status: 'source_pending',
    evidence_refs: [],
    approved_language: ['reported aggregate pending source verification'],
    blocked_phrases: ['verified 5.9B'],
    created_at: '2026-07-08T00:00:00.000Z',
  });

  assert.equal(claim.source_status, 'source_pending');
  assert.equal(isEvidenceClaimSafeToPublish(claim, 'reported aggregate pending source verification'), true);
});

test('verified/source_visible claims require at least one evidence ref', () => {
  assert.throws(() => parseEvidenceOracleClaim({
    id: 'claim-without-source',
    title: 'Broken verified claim',
    claim: 'This claim is incorrectly marked as verified.',
    source_status: 'verified',
    evidence_refs: [],
    approved_language: ['verified with source'],
    created_at: '2026-07-08T00:00:00.000Z',
  }));
});

test('blocked claim phrases prevent publication', () => {
  const claim = parseEvidenceOracleClaim({
    id: 'claim-language-guard',
    title: 'Language guard',
    claim: 'A public claim with a controlled wording surface.',
    source_status: 'source_visible',
    evidence_refs: [{ id: 'source-1', label: 'Visible public source', url: 'https://7ya.io/evidence' }],
    approved_language: ['source-visible public claim'],
    blocked_phrases: ['guaranteed viral empire'],
    created_at: '2026-07-08T00:00:00.000Z',
  });

  assert.deepEqual(findBlockedClaimPhrases(claim, 'This is a guaranteed viral empire.'), ['guaranteed viral empire']);
  assert.equal(isEvidenceClaimSafeToPublish(claim, 'This is a guaranteed viral empire.'), false);
});
