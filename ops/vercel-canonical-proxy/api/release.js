'use strict';

const payload = {
  release_id: 'igor-guided-living-os-20260715',
  source_repository: '7guard-io/7ya.io',
  source_branch: 'main',
  source_sha: 'c275ff0557727c99e712ae8d57ebd0736dba79e5',
  pull_request: 211,
  architecture: 'canonical-github-sha-proxy',
  deployed_surface: '7ya-static-site',
  experience: 'IGOR_7YA_LIVING_OS_PERSONAL_GUIDANCE_AND_PUBLIC_GOOD',
  archive_record_count: 66,
  critical_routes: [
    '/', '/museum/', '/create/', '/history/', '/7ya/', '/starton/',
    '/influence/', '/evidence/', '/talk/', '/contact/'
  ],
  custom_domain_attached: false,
  generated_at: '2026-07-15T09:17:23+03:00',
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
