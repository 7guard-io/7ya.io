const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT, 'release-manifest.json');
const ENV_KEYS = [
  'VERCEL_GIT_COMMIT_SHA',
  'GITHUB_SHA',
  'SOURCE_SHA',
  'RELEASE_SOURCE_SHA',
  'VERCEL_ENV',
];

function invokeRelease() {
  delete require.cache[require.resolve('../api/release.js')];
  const handler = require('../api/release.js');
  const headers = {};
  let body = '';
  const response = {
    statusCode: 200,
    setHeader(name, value) {
      headers[name.toLowerCase()] = value;
    },
    end(value) {
      body = String(value || '');
    },
  };
  handler({}, response);
  return { statusCode: response.statusCode, headers, body: JSON.parse(body) };
}

const previousEnv = Object.fromEntries(ENV_KEYS.map((key) => [key, process.env[key]]));
const previousManifest = fs.existsSync(MANIFEST_PATH) ? fs.readFileSync(MANIFEST_PATH) : null;

try {
  ENV_KEYS.forEach((key) => delete process.env[key]);
  if (fs.existsSync(MANIFEST_PATH)) fs.unlinkSync(MANIFEST_PATH);

  const unbound = invokeRelease();
  assert.equal(unbound.statusCode, 503);
  assert.equal(unbound.body.status, 'PROVENANCE_UNBOUND');

  const sha = '0123456789abcdef0123456789abcdef01234567';
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify({
    source_sha: sha,
    release: 'test-release',
    build_time: '2026-07-14T00:00:00.000Z',
    environment: 'test',
    provenance_source: 'bundled_manifest',
  }));

  const bound = invokeRelease();
  assert.equal(bound.statusCode, 200);
  assert.equal(bound.body.status, 'READY');
  assert.equal(bound.body.source_sha, sha);
  assert.equal(bound.body.provenance_source, 'bundled_manifest');
  assert.equal(bound.headers['x-content-type-options'], 'nosniff');

  process.env.VERCEL_GIT_COMMIT_SHA = 'fedcba9876543210fedcba9876543210fedcba98';
  const hostBound = invokeRelease();
  assert.equal(hostBound.statusCode, 200);
  assert.equal(hostBound.body.source_sha, process.env.VERCEL_GIT_COMMIT_SHA);
  assert.equal(hostBound.body.provenance_source, 'VERCEL_GIT_COMMIT_SHA');

  console.log('RELEASE_PROVENANCE_TEST: PASS');
} finally {
  if (previousManifest) fs.writeFileSync(MANIFEST_PATH, previousManifest);
  else if (fs.existsSync(MANIFEST_PATH)) fs.unlinkSync(MANIFEST_PATH);

  for (const [key, value] of Object.entries(previousEnv)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
}
