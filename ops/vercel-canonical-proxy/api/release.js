'use strict';

const payload = {
  release_id: 'igor-public-response-ai-20260715',
  source_repository: '7guard-io/7ya.io',
  source_branch: 'main',
  source_sha: '6c179d0bd0cb334de6d03221d3074ee760f134b4',
  pull_request: 219,
  architecture: 'canonical-github-sha-proxy',
  deployed_surface: '7ya-static-site',
  experience: 'IGOR_MASTER_ENTITY_ATLAS_LIVING_OS_PUBLIC_RESPONSE_AI',
  archive_record_count: 66,
  response_signal_count: 11,
  positive_external_signal_count: 3,
  validated_tiktok_live_comment_records: 10273,
  distinct_entity_visual_sources: 5,
  critical_routes: [
    '/', '/museum/', '/entity/', '/create/', '/history/', '/igor-vepretski/',
    '/journey/', '/7ya/', '/starton/', '/influence/', '/response-ai/',
    '/evidence/', '/speaker/', '/talk/', '/media/', '/articles/', '/contact/'
  ],
  stance_controls: [
    'POSITIVE_EXTERNAL_FRAMING', 'CONSTRUCTIVE_EXTERNAL_FRAMING',
    'UNDETERMINED_FROM_AGGREGATES', 'HUMAN_REVIEW_REQUIRED'
  ],
  claim_controls: [
    'VERIFIED', 'DOCUMENTED', 'SELF_ATTESTED', 'CONCEPT', 'PROTOTYPE',
    'SOURCE_PENDING', 'PRIVATE'
  ],
  raw_comment_text_publication: false,
  human_review_required_for_comment_text: true,
  private_family_identifiers_published: false,
  custom_domain_attached: false,
  generated_at: '2026-07-15T10:54:00+03:00',
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
