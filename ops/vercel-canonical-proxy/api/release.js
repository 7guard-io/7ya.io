'use strict';

const SHA_PATTERN = /^[0-9a-f]{40}$/i;

function validSha(value) {
  const normalized = String(value || '').trim();
  return SHA_PATTERN.test(normalized) ? normalized : null;
}

function sourceBinding() {
  const canonical = validSha(process.env.CANONICAL_SOURCE_SHA);
  if (canonical) return { sourceSha: canonical, provenanceSource: 'CANONICAL_SOURCE_SHA' };
  const vercel = validSha(process.env.VERCEL_GIT_COMMIT_SHA);
  if (vercel) return { sourceSha: vercel, provenanceSource: 'VERCEL_GIT_COMMIT_SHA' };
  const github = validSha(process.env.GITHUB_SHA);
  if (github) return { sourceSha: github, provenanceSource: 'GITHUB_SHA' };
  return null;
}

function send(response, request, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  if (payload.source_sha) response.setHeader('X-7YA-Source-SHA', payload.source_sha);
  if (request.method === 'HEAD') response.end();
  else response.end(JSON.stringify(payload, null, 2));
}

module.exports = (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET, HEAD');
    response.end();
    return;
  }

  const binding = sourceBinding();
  if (!binding) {
    send(response, request, 503, {
      service: '7ya-canonical-proxy',
      status: 'PROVENANCE_UNBOUND',
      production_verified: false,
      source_repository: '7guard-io/7ya.io',
      architecture: 'canonical-github-sha-proxy',
      repair: 'Bind CANONICAL_SOURCE_SHA to the exact tested commit or deploy from a provider-linked Git commit.',
    });
    return;
  }

  send(response, request, 200, {
    service: '7ya-canonical-proxy',
    status: 'SOURCE_BOUND',
    production_verified: false,
    source_repository: '7guard-io/7ya.io',
    source_sha: binding.sourceSha,
    provenance_source: binding.provenanceSource,
    environment: process.env.VERCEL_ENV || 'unknown',
    architecture: 'canonical-github-sha-proxy',
    deployed_surface: '7ya-static-site',
    custom_domain_attached: false,
    note: 'A bound proxy source is not proof that the canonical domain serves this commit. Production acceptance requires live DNS, TLS, route and release verification.',
  });
};
