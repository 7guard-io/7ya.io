const fs = require('fs');
const path = require('path');

const SHA_PATTERN = /^[0-9a-f]{40}$/i;
const MANIFEST_PATH = path.join(__dirname, '..', 'release-manifest.json');
const DEFAULT_RELEASE = 'p0-integrity-20260714';
const PROVIDER_PROVENANCE = new Set(['VERCEL_GIT_COMMIT_SHA', 'GITHUB_SHA']);
const CRITICAL_ROUTES = [
  '/', '/igor-vepretski/', '/talk/', '/social/', '/pass/',
  '/evidence/', '/starton/', '/contact/', '/radar/',
];

function readManifest() {
  try { return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8')); }
  catch { return {}; }
}
function validSha(value) {
  const normalized = String(value || '').trim();
  return SHA_PATTERN.test(normalized) ? normalized : null;
}
function runtimeProviderSha() {
  return validSha(process.env.VERCEL_GIT_COMMIT_SHA) || validSha(process.env.GITHUB_SHA);
}
function respond(response, statusCode, body) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.end(JSON.stringify(body));
}

module.exports = (_request, response) => {
  const manifest = readManifest();
  const sourceSha = validSha(manifest.source_sha);
  const provenanceSource = String(manifest.provenance_source || '');
  const environment = String(manifest.environment || process.env.VERCEL_ENV || 'unknown');
  const runtimeSha = runtimeProviderSha();

  if (!sourceSha) {
    respond(response, 503, {
      service: '7ya-frontend', provider: 'vercel', status: 'PROVENANCE_UNBOUND',
      production_verified: false, release: manifest.release || DEFAULT_RELEASE,
      source_repository: '7guard-io/7ya.io', source_path: 'ops/vercel-recovery',
      repair: 'Build from a provider-linked Git deployment so the manifest receives a provider-generated commit SHA.',
    });
    return;
  }

  if (!PROVIDER_PROVENANCE.has(provenanceSource)) {
    respond(response, 503, {
      service: '7ya-frontend', provider: 'vercel', status: 'PROVENANCE_NOT_PROVIDER_BOUND',
      production_verified: false, release: manifest.release || DEFAULT_RELEASE,
      source_repository: '7guard-io/7ya.io', source_path: 'ops/vercel-recovery',
      source_sha: sourceSha, environment, provenance_source: provenanceSource || 'unknown',
      repair: 'Redeploy from the linked Git repository. Manual SOURCE_SHA values cannot produce READY.',
    });
    return;
  }

  if (runtimeSha && runtimeSha !== sourceSha) {
    respond(response, 503, {
      service: '7ya-frontend', provider: 'vercel', status: 'PROVENANCE_MISMATCH',
      production_verified: false, release: manifest.release || DEFAULT_RELEASE,
      source_repository: '7guard-io/7ya.io', source_sha: sourceSha,
      runtime_source_sha: runtimeSha, environment, provenance_source: provenanceSource,
      repair: 'Rebuild the deployment from one immutable source SHA.',
    });
    return;
  }

  const productionVerified = environment === 'production';
  respond(response, 200, {
    service: '7ya-frontend', provider: 'vercel',
    status: productionVerified ? 'READY' : 'PREVIEW_READY',
    production_verified: productionVerified,
    experience: 'IGOR_CREATORVERSE_UNIFIED_PUBLIC_ARCHIVE',
    release: manifest.release || DEFAULT_RELEASE,
    source_repository: '7guard-io/7ya.io', source_branch: manifest.source_branch || null,
    source_path: 'ops/vercel-recovery', source_sha: sourceSha,
    build_time: manifest.build_time || null, environment,
    provenance_source: provenanceSource, ai_endpoint: '/api/guide',
    critical_routes: CRITICAL_ROUTES,
    crawl_controls: ['/robots.txt', '/sitemap.xml'],
  });
};
