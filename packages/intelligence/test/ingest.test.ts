import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { CollectorAdapter } from '../src/adapters/collector.js';
import { LocalCorpusAdapter } from '../src/adapters/local-corpus.js';
import { FileSystemAtomStore, IngestManifestStore } from '../src/store.js';
import { ingestAdapter } from '../src/ingest.js';

async function temp(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), '7ya-intel-'));
}

test('collector ingest is incremental and preserves prior changed versions', async () => {
  const root = await temp();
  const input = path.join(root, 'collector.json');
  const store = new FileSystemAtomStore(path.join(root, 'atoms'));
  const manifests = new IngestManifestStore(path.join(root, 'manifests'));
  const base = {
    schema_version: 1,
    generated_at: '2026-09-05T10:00:00Z',
    records: [{
      target: 'https://example.test/a',
      final_url: 'https://example.test/a',
      canonical_url: 'https://example.test/a',
      title: 'StartOn',
      text_excerpt: 'Work with youth at risk',
      content_sha256: 'hash-a',
      http_status: 200,
      content_type: 'text/html',
    }],
  };
  await writeFile(input, JSON.stringify(base));
  const first = await ingestAdapter(new CollectorAdapter(), { inputPath: input, subjectId: 'igor-vepretski' }, { store, manifests, now: () => '2026-09-05T11:00:00Z' });
  const second = await ingestAdapter(new CollectorAdapter(), { inputPath: input, subjectId: 'igor-vepretski' }, { store, manifests, now: () => '2026-09-05T11:01:00Z' });
  assert.equal(first.created, 1);
  assert.equal(second.skipped, 1);

  base.records[0].text_excerpt = 'Expanded work with youth at risk';
  base.records[0].content_sha256 = 'hash-b';
  await writeFile(input, JSON.stringify(base));
  const third = await ingestAdapter(new CollectorAdapter(), { inputPath: input, subjectId: 'igor-vepretski' }, { store, manifests, now: () => '2026-09-05T11:02:00Z' });
  assert.equal(third.created, 1);

  const atoms = [];
  for await (const atom of store.list()) atoms.push(atom);
  assert.equal(atoms.length, 2);
  assert(atoms.some(atom => atom.source.canonicalUrl === 'https://example.test/a'));
});

test('local corpus keeps private visibility and malformed record does not advance manifest', async () => {
  const root = await temp();
  const input = path.join(root, 'local.ndjson');
  const store = new FileSystemAtomStore(path.join(root, 'atoms'));
  const manifests = new IngestManifestStore(path.join(root, 'manifests'));
  const good = {
    sourceId: 'chat:1',
    sourceType: 'chat-export',
    content: 'Private note',
    observedAt: '2026-09-05T10:00:00Z',
    visibility: 'private',
    verification: { level: 'self-report' },
    kind: 'statement',
    sourceRecordHash: 'local-1',
  };
  await writeFile(input, `${JSON.stringify(good)}\n`);
  const ok = await ingestAdapter(new LocalCorpusAdapter(), { inputPath: input, subjectId: 'igor-vepretski' }, { store, manifests, now: () => '2026-09-05T11:00:00Z' });
  assert.equal(ok.created, 1);
  const before = JSON.parse(await readFile(path.join(root, 'manifests', 'local.json'), 'utf8'));

  await writeFile(input, `${JSON.stringify({ ...good, sourceId: 'chat:2', content: '' })}\n`);
  const bad = await ingestAdapter(new LocalCorpusAdapter(), { inputPath: input, subjectId: 'igor-vepretski' }, { store, manifests, now: () => '2026-09-05T11:01:00Z' });
  assert.equal(bad.rejected, 1);
  const after = JSON.parse(await readFile(path.join(root, 'manifests', 'local.json'), 'utf8'));
  assert.deepEqual(after, before);
});
