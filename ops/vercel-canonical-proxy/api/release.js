'use strict';

const payload = {
  release_id: 'igor-master-entity-atlas-20260715',
  source_repository: '7guard-io/7ya.io',
  source_branch: 'main',
  source_sha: '446e54d98ebd04fc1e1a837f98dce94a8904ae55',
  pull_request: 218,
  architecture: 'canonical-github-sha-proxy',
  deployed_surface: '7ya-static-site',
  experience: 'IGOR_MASTER_ENTITY_ATLAS_LIVING_OS',
  archive_record_count: 66,
  distinct_entity_visual_sources: 5,
  critical_routes: [
    '/', '/museum/', '/entity/', '/create/', '/history/', '/igor-vepretski/',
    '/journey/', '/7ya/', '/starton/', '/influence/', '/evidence/',
    '/speaker/', '/talk/', '/media/', '/articles/', '/contact/'
  ],
  claim_controls: [
    'VERIFIED', 'DOCUMENTED', 'SELF_ATTESTED', 'CONCEPT', 'PROTOTYPE',
    'SOURCE_PENDING', 'PRIVATE'
  ],
  private_family_identifiers_published: false,
  custom_domain_attached: false,
  generated_at: '2026-07-15T10:35:00+03:00',
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
