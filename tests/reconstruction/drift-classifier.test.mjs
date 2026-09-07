import test from 'node:test';
import assert from 'node:assert/strict';
import {classify} from '../../scripts/reconstruction/report-drift.mjs';

test('classifies capture-only runtime source as production-required', () => {
  assert.equal(classify({capture:true, canonical:false, runtimeClass:true}), 'production-runtime-required');
});

test('classifies canonical-only non-runtime source as canonical-newer', () => {
  assert.equal(classify({capture:false, canonical:true, runtimeClass:false}), 'canonical-repository-newer');
});

test('keeps unequal files on both sides unresolved until reviewed', () => {
  assert.equal(classify({capture:true, canonical:true, equal:false}), 'unresolved');
});

test('recognizes equal files and verified binaries deterministically', () => {
  assert.equal(classify({capture:true, canonical:true, equal:true}), 'identical');
  assert.equal(classify({capture:true, canonical:true, binaryVerified:true}), 'binary-verified');
});
