const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'release-manifest.json');
const SHA_PATTERN = /^[0-9a-f]{40}$/i;
const DEFAULT_RELEASE = 'p0-integrity-20260714';

function validSha(value) {
  const normalized = String(value || '').trim();
  return SHA_PATTERN.test(normalized) ? normalized : null;
}
function providerProvenance() {
  const vercelSha = validSha(process.env.VERCEL_GIT_COMMIT_SHA);
  if (vercelSha) return { sourceSha: vercelSha, provenanceSource: 'VERCEL_GIT_COMMIT_SHA' };
  const githubSha = validSha(process.env.GITHUB_SHA);
  if (githubSha) return { sourceSha: githubSha, provenanceSource: 'GITHUB_SHA' };
  return null;
}
function manualPreviewProvenance(environment) {
  if (process.env.ALLOW_MANUAL_SOURCE_SHA !== 'true') return null;
  if (environment === 'production') {
    throw new Error('Manual source SHA is forbidden for production releases. Deploy from a provider-linked Git commit.');
  }
  const sourceSha = validSha(process.env.SOURCE_SHA) || validSha(process.env.RELEASE_SOURCE_SHA);
  return sourceSha ? { sourceSha, provenanceSource: 'MANUAL_PREVIEW_SOURCE_SHA' } : null;
}

const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown';
const provenance = providerProvenance() || manualPreviewProvenance(environment);
if (!provenance) {
  throw new Error('Release provenance is unbound. Production requires VERCEL_GIT_COMMIT_SHA or GITHUB_SHA. Manual preview binding additionally requires ALLOW_MANUAL_SOURCE_SHA=true.');
}

const sourceBranch = process.env.VERCEL_GIT_COMMIT_REF || process.env.GITHUB_REF_NAME || null;
const productionVerified = environment === 'production' && ['VERCEL_GIT_COMMIT_SHA', 'GITHUB_SHA'].includes(provenance.provenanceSource);
const manifest = {
  source_sha: provenance.sourceSha,
  source_branch: sourceBranch,
  source_repository: '7guard-io/7ya.io',
  source_path: 'ops/vercel-recovery',
  release: process.env.RELEASE_ID || DEFAULT_RELEASE,
  build_time: new Date().toISOString(),
  environment,
  provenance_source: provenance.provenanceSource,
  production_verified: productionVerified,
};
fs.writeFileSync(OUTPUT, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`⚡ ${manifest.release} bound to ${manifest.source_sha} via ${manifest.provenance_source} (${manifest.environment}, production_verified=${manifest.production_verified})`);
