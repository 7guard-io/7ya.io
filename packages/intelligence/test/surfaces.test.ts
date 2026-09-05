import test from 'node:test';
import assert from 'node:assert/strict';
import { parseIngestArgs, parseQueryArgs } from '../src/cli.js';
import { validatePublicQueryBody } from '../src/query.js';

test('CLI parser accepts only known adapters and required arguments', () => {
  assert.deepEqual(
    parseIngestArgs(['--adapter', 'collector', '--input', 'data/a.json', '--subject', 'igor-vepretski', '--json']),
    { adapter: 'collector', inputPath: 'data/a.json', subjectId: 'igor-vepretski', json: true },
  );
  assert.throws(() => parseIngestArgs(['--adapter', 'evil', '--input', 'x']), /adapter/i);
  assert.deepEqual(
    parseQueryArgs(['--q', 'youth at risk', '--subject', 'igor-vepretski', '--limit', '12']),
    { query: 'youth at risk', subjectId: 'igor-vepretski', limit: 12, json: false },
  );
});

test('public API contract rejects private visibility and bounds limit', () => {
  assert.throws(
    () => validatePublicQueryBody({ query: 'x', subjectId: 'igor-vepretski', visibility: 'private' }),
    /visibility/i,
  );
  assert.deepEqual(
    validatePublicQueryBody({ query: 'youth', subjectId: 'igor-vepretski', limit: 500 }),
    { query: 'youth', subjectId: 'igor-vepretski', limit: 50, visibility: 'public' },
  );
  assert.throws(
    () => validatePublicQueryBody({ query: 'x'.repeat(2001), subjectId: 'igor-vepretski' }),
    /query must be at most 2000 characters/i,
  );
  assert.throws(
    () => validatePublicQueryBody({ query: 'youth', subjectId: 'x'.repeat(201) }),
    /subjectId must be at most 200 characters/i,
  );
});
