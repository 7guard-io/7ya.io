import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root = new URL('../../appdeploy-live/1788809457536/', import.meta.url);
const required = [
  'index.html',
  'package.json',
  'postcss.config.js',
  'tailwind.config.js',
  'tsconfig.json',
  'vite.config.ts',
  'cron.json',
  'src/App.tsx',
  'src/locale.tsx',
  'src/engineering-home/EngineeringHome.tsx',
  'shared/content-operating-map.ts',
  'tests/tests.txt'
];

test('capture contains critical v97 runtime source', async () => {
  for (const path of required) {
    const value = await readFile(new URL(path, root), 'utf8');
    assert.ok(value.length > 0, `${path} must be captured`);
  }
});

test('oversized backend capture has all ordered v97 source windows', async () => {
  const partsRoot = new URL('backend/index.ts.parts/', root);
  const manifest = JSON.parse(await readFile(new URL('manifest.json', partsRoot), 'utf8'));
  assert.equal(manifest.appId, '697a008fddc309b142');
  assert.equal(manifest.snapshot, '1788809457536');
  assert.equal(manifest.totalLines, 69);
  assert.deepEqual(manifest.parts.map(({offset, limit}) => [offset, limit]), [
    [0, 10], [10, 10], [20, 10], [30, 10], [40, 10], [50, 10], [60, 9]
  ]);
  const contents = [];
  for (const part of manifest.parts) {
    const value = await readFile(new URL(part.file, partsRoot), 'utf8');
    assert.ok(value.length > 0, `${part.file} must be captured`);
    contents.push(value);
  }
  const combined = contents.join('\n');
  for (const sentinel of [
    "from '@appdeploy/sdk'",
    "7ya-sovereign-recovery-20260905-v3-globalfix",
    "GET /api/health",
    "GET /api/content-operating-map",
    'realtimeSubscriptionRoutes});'
  ]) assert.ok(combined.includes(sentinel), `backend capture missing sentinel: ${sentinel}`);
});

test('manifest pins the current source snapshot without an E2E claim', async () => {
  const manifest = JSON.parse(await readFile(new URL('CAPTURE-MANIFEST.json', root), 'utf8'));
  assert.equal(manifest.source.appId, '697a008fddc309b142');
  assert.equal(manifest.source.versionName, 'v97');
  assert.equal(manifest.source.snapshot, '1788809457536');
  assert.equal(manifest.healthAtCapture.e2e, null);
  assert.equal(manifest.secretsExported, false);
});
