'use strict';

const payload = {
  release_id: 'creatorverse-contact-20260714-pr191',
  source_repository: '7guard-io/7ya.io',
  source_branch: 'main',
  source_sha: 'a6847e58a447a9cb8203aabf7446952782c7a0ce',
  pull_request: 191,
  architecture: 'canonical-github-sha-proxy',
  deployed_surface: '7ya-static-site',
  custom_domain_attached: false,
  generated_at: '2026-07-14T19:05:00+03:00',
};

module.exports = (request, response) => {
  if (!['GET', 'HEAD'].includes(request.method)) {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET, HEAD');
    response.end();
    return;
  }

  response.statusCode = 200;
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-7YA-Source-SHA', payload.source_sha);

  if (request.method === 'HEAD') response.end();
  else response.end(JSON.stringify(payload, null, 2));
};
