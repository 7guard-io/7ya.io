const fs = require('fs');
const path = require('path');

const SHA_PATTERN = /^[0-9a-f]{40}$/i;
const MANIFEST_PATH = path.join(__dirname, '..', 'release-manifest.json');
const DEFAULT_RELEASE = '2026-07-14.6-creatorverse-archive';
const ROOT_EXPERIENCE_RELEASE = '2026-07-14.5-creatorverse';
const CRITICAL_ROUTES = [
  '/',
  '/igor-vepretski/',
  '/journey/',
  '/work/',
  '/starton/',
  '/systems/',
  '/public-service/',
  '/evidence/',
  '/influence/',
  '/music/',
  '/speaker/',
  '/talk/',
  '/social/',
  '/pass/',
  '/radar/',
  '/contact/',
];

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  } catch {
    return {};
  }
}

function firstValidSha(...values) {
  return values.find((value) => SHA_PATTERN.test(String(value || '').trim())) || null;
}

module.exports = (_request, response) => {
  const manifest = readManifest();
  const sourceSha = firstValidSha(
    process.env.VERCEL_GIT_COMMIT_SHA,
    process.env.GITHUB_SHA,
    process.env.SOURCE_SHA,
    process.env.RELEASE_SOURCE_SHA,
    manifest.source_sha,
  );

  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.setHeader('X-Content-Type-Options', 'nosniff');

  if (!sourceSha) {
    response.statusCode = 503;
    response.end(JSON.stringify({
      service: '7ya-frontend',
      provider: 'vercel',
      status: 'PROVENANCE_UNBOUND',
      release: manifest.release || DEFAULT_RELEASE,
      root_experience_release: ROOT_EXPERIENCE_RELEASE,
      source_repository: '7guard-io/7ya.io',
      source_path: 'ops/vercel-recovery',
      repair: 'Deploy from Git or inject a full 40-character SOURCE_SHA at build and runtime.',
    }));
    return;
  }

  response.statusCode = 200;
  response.end(JSON.stringify({
    service: '7ya-frontend',
    provider: 'vercel',
    status: 'READY',
    experience: 'IGOR_CREATORVERSE_COMPLETE_ARCHIVE',
    release: manifest.release || DEFAULT_RELEASE,
    root_experience_release: ROOT_EXPERIENCE_RELEASE,
    source_repository: '7guard-io/7ya.io',
    source_path: 'ops/vercel-recovery',
    source_sha: sourceSha,
    build_time: manifest.build_time || null,
    environment: process.env.VERCEL_ENV || manifest.environment || 'unknown',
    provenance_source:
      process.env.VERCEL_GIT_COMMIT_SHA ? 'VERCEL_GIT_COMMIT_SHA' :
      process.env.GITHUB_SHA ? 'GITHUB_SHA' :
      process.env.SOURCE_SHA ? 'SOURCE_SHA' :
      process.env.RELEASE_SOURCE_SHA ? 'RELEASE_SOURCE_SHA' :
      manifest.provenance_source || 'bundled_manifest',
    ai_endpoint: '/api/guide',
    ai_mode: process.env.OPENAI_API_KEY ? 'openai-with-local-fallback' : 'local-guide',
    model_default: process.env.OPENAI_MODEL || 'gpt-5.6',
    route_aliases: { '/7ya/': '/systems/' },
    critical_routes: CRITICAL_ROUTES,
  }));
};
