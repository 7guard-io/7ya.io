const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'release-manifest.json');
const SHA_PATTERN = /^[0-9a-f]{40}$/i;
const DEFAULT_RELEASE = '2026-07-14.6-creatorverse-archive';

function readExistingManifest() {
  try {
    return JSON.parse(fs.readFileSync(OUTPUT, 'utf8'));
  } catch {
    return {};
  }
}

function firstValidSha(...values) {
  return values.find((value) => SHA_PATTERN.test(String(value || '').trim())) || null;
}

const existing = readExistingManifest();
const sourceSha = firstValidSha(
  process.env.VERCEL_GIT_COMMIT_SHA,
  process.env.GITHUB_SHA,
  process.env.SOURCE_SHA,
  process.env.RELEASE_SOURCE_SHA,
  existing.source_sha,
);

if (!sourceSha) {
  throw new Error(
    'Release provenance is unbound. Set VERCEL_GIT_COMMIT_SHA, GITHUB_SHA, SOURCE_SHA, RELEASE_SOURCE_SHA, or ship a bound release-manifest.json.',
  );
}

const manifest = {
  source_sha: sourceSha,
  source_repository: '7guard-io/7ya.io',
  source_path: 'ops/vercel-recovery',
  release: process.env.RELEASE_ID || existing.release || DEFAULT_RELEASE,
  build_time: new Date().toISOString(),
  environment: process.env.VERCEL_ENV || process.env.NODE_ENV || existing.environment || 'unknown',
  provenance_source:
    process.env.VERCEL_GIT_COMMIT_SHA ? 'VERCEL_GIT_COMMIT_SHA' :
    process.env.GITHUB_SHA ? 'GITHUB_SHA' :
    process.env.SOURCE_SHA ? 'SOURCE_SHA' :
    process.env.RELEASE_SOURCE_SHA ? 'RELEASE_SOURCE_SHA' :
    'bundled_manifest',
};

fs.writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`⚡ ${manifest.release} bound to ${sourceSha} via ${manifest.provenance_source}`);
