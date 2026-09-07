import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const contracts = new URL('../../contracts/runtime/', import.meta.url);
const capture = new URL('../../appdeploy-live/1788809457536/', import.meta.url);
const readJson = async (base, name) => JSON.parse(await readFile(new URL(name, base), 'utf8'));

const requiredRoutes = [
  '/',
  '/igor-vepretski/',
  '/journey/',
  '/starton/',
  '/influence/',
  '/evidence/',
  '/library/',
  '/search/',
  '/media/',
  '/research/',
  '/music/',
  '/speaker/',
  '/blog/',
  '/create/',
  '/contact/'
];

test('public route contract pins critical routes and locales', async () => {
  const routes = await readJson(contracts, 'public-routes.json');
  assert.equal(routes.schemaVersion, 1);
  assert.equal(routes.primaryLocale, 'he');
  assert.deepEqual(routes.firstClassLocales, ['he', 'en', 'ru']);
  assert.deepEqual(routes.requiredRoutes, requiredRoutes);
});

test('SEO contract pins canonical origin and hreflang set', async () => {
  const seo = await readJson(contracts, 'seo-contract.json');
  assert.deepEqual(seo.requiredFields, ['title', 'description', 'canonical']);
  assert.deepEqual(seo.hreflang, ['he', 'en', 'ru', 'es', 'x-default']);
  assert.equal(seo.canonicalOrigin, 'https://7ya.io');
});

test('scheduler contract exactly matches captured active cron source', async () => {
  const expected = await readJson(contracts, 'scheduler-contract.json');
  const actual = JSON.parse(await readFile(new URL('cron.json', capture), 'utf8'));
  const normalized = actual.map(({name, cron, timezone, handler}) => ({name, cron, timezone, handler}));
  assert.deepEqual(normalized, expected.active);
});

test('release contract pins current v97 snapshot and frontend build marker', async () => {
  const release = await readJson(contracts, 'release-contract.json');
  assert.equal(release.appId, '697a008fddc309b142');
  assert.equal(release.capturedSnapshot, '1788809457536');
  assert.equal(release.buildMarker, '7ya-engineering-front-door-20260907-v1');
  assert.equal(release.canonicalDomain, 'https://7ya.io/');
  assert.equal(release.requireLiveBuildMarkerProofBeforeReleaseClaim, true);
  assert.equal(release.e2eClaim, null);
  const app = await readFile(new URL('src/App.tsx', capture), 'utf8');
  assert.ok(app.includes(release.buildMarker), 'captured App.tsx must expose the pinned build marker');
});
