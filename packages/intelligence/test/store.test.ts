import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { FileSystemAtomStore, IngestManifestStore } from '../src/store.js';

test('filesystem stores reject identifiers that could escape their configured roots', async () => {
  const root = await mkdtemp(path.join(tmpdir(), '7ya-store-'));
  const outside = path.join(root, 'outside.json');
  await writeFile(outside, '{"private":true}\n');
  const atoms = new FileSystemAtomStore(path.join(root, 'atoms'));
  const manifests = new IngestManifestStore(path.join(root, 'manifests'));

  await assert.rejects(() => atoms.get('../outside'), /atomId/i);
  await assert.rejects(() => manifests.read('../outside'), /adapterId/i);
});
