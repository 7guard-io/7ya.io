import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import type { NormalizedSourceRecord } from '../src/adapter.js';
import { DescriptAdapter } from '../src/adapters/descript.js';

async function temp(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), '7ya-descript-'));
}

async function scan(snapshot: unknown): Promise<NormalizedSourceRecord[]> {
  const root = await temp();
  const input = path.join(root, 'descript.json');
  await writeFile(input, JSON.stringify(snapshot));
  const rows: NormalizedSourceRecord[] = [];
  for await (const row of new DescriptAdapter().scan({ inputPath: input, subjectId: 'igor-vepretski' })) rows.push(row);
  return rows;
}

test('descript adapter keeps unlisted share URL private and preserves derivative lineage', async () => {
  const rows = await scan({
    schemaVersion: 1,
    observedAt: '2026-09-07T14:30:00Z',
    project: { ref: 'project-103fm', name: 'Igor Vepretski — Spoken Corpus 103FM Drive' },
    sourceAsset: { ref: 'asset-103fm', name: '103FM Barak Seri', mediaType: 'video', durationSeconds: 250 },
    compositions: [{
      ref: 'clip-why-i-joined',
      name: '7YA Clip — 103FM — Why I Joined',
      durationSeconds: 28.618,
      publication: { state: 'unlisted', url: 'https://share.descript.com/view/DO-NOT-EXPOSE' },
      derivative: { relationship: 'parentOf', parentRef: 'asset-103fm', timestampStart: 0, timestampEnd: 28.618 },
      claims: ['Igor explains why he joined'],
      topics: ['public service'],
      entities: ['Igor Vepretski'],
    }],
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].visibility, 'restricted');
  assert.equal(rows[0].canonicalUrl, undefined);
  assert.equal(rows[0].verification.level, 'derived');
  assert.equal(rows[0].metadata.derivative && typeof rows[0].metadata.derivative === 'object'
    ? (rows[0].metadata.derivative as Record<string, unknown>).relationship
    : undefined, 'parentOf');
  assert.equal(JSON.stringify(rows[0].metadata).includes('DO-NOT-EXPOSE'), false);
});

test('descript adapter exposes a canonical URL only for explicitly public publication', async () => {
  const rows = await scan({
    schemaVersion: 1,
    observedAt: '2026-09-07T14:30:00Z',
    project: { ref: 'project-starton', name: 'Starton - Tech Centers for Youth at Risk' },
    sourceAsset: { ref: 'asset-starton', name: 'StartOn source', mediaType: 'video', durationSeconds: 74.936 },
    compositions: [{
      ref: 'composition-starton',
      name: 'Starton - Tech Centers for Youth at Risk',
      durationSeconds: 74.936,
      publication: { state: 'public', url: 'https://example.test/public-starton' },
      derivative: { relationship: 'parentOf', parentRef: 'asset-starton' },
      generated: true,
    }],
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].visibility, 'public');
  assert.equal(rows[0].canonicalUrl, 'https://example.test/public-starton');
  assert.equal(rows[0].kind, 'media');
  assert.equal(rows[0].metadata.generated, true);
  assert.match(rows[0].sourceRecordHash, /^[a-f0-9]{64}$/);
});

test('descript adapter fails closed for unknown publication state', async () => {
  const rows = await scan({
    schemaVersion: 1,
    observedAt: '2026-09-07T14:30:00Z',
    project: { ref: 'project-field-note', name: 'Field note' },
    sourceAsset: { ref: 'asset-field-note', name: 'Field note source', mediaType: 'audio' },
    compositions: [{
      ref: 'composition-field-note',
      name: 'Field note composition',
      publication: { state: 'unknown', url: 'https://example.test/should-not-leak' },
    }],
  });

  assert.equal(rows.length, 1);
  assert.equal(rows[0].visibility, 'private');
  assert.equal(rows[0].canonicalUrl, undefined);
  assert.equal(JSON.stringify(rows[0].metadata).includes('should-not-leak'), false);
});
