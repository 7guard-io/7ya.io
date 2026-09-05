import test from 'node:test';
import assert from 'node:assert/strict';
import { assertPublicVisibility, canReadVisibility } from '../src/privacy.js';

test('public scope cannot request private visibility', () => {
  assert.throws(() => assertPublicVisibility('private'), /public query/i);
  assert.equal(canReadVisibility('public', 'public'), true);
  assert.equal(canReadVisibility('public', 'private'), false);
  assert.equal(canReadVisibility('internal', 'private', true), true);
  assert.equal(canReadVisibility('internal', 'restricted', false), false);
});
