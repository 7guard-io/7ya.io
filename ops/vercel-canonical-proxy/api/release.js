'use strict';

const payload = {
  release_id: 'igor-command-home-20260718',
  pull_request: 258,
  source_repository: '7guard-io/7ya.io',
  source_branch: 'main',
  source_sha: 'a451e681ea571ad94ebbd84b3f09c5e0e26d137e',
  architecture: 'canonical-github-sha-proxy-v2',
  deployed_surface: '7ya.io',
  experience: 'IGOR_VEPRETSKI_COMMAND_HOMEPAGE',
  homepage_build: 'igor-personal-command-20260718-1',
  canonical_url: 'https://7ya.io/',
  visual_system: {
    palette: 'black, charcoal, cream and warm gold',
    stylesheet: '/styles/igor-personal-hero-20260716.css',
    hero: '/assets/personal-hero-20260716/igor-hero.webp',
    mobile_first: true,
    rtl: true
  },
  content: {
    verified_core_records: 66,
    public_universe_records: 26,
    combined_records_before_url_dedupe: 92,
    runtime_url_deduplication: true,
    evidence_before_amplification: true,
    response_signal_count: 11,
    positive_external_signal_count: 3,
    validated_tiktok_live_comment_records: 10273,
    raw_comment_text_publication: false,
    human_review_required_for_comment_text: true,
    aggregate_stance: 'UNDETERMINED_FROM_AGGREGATES',
    comment_text_stance: 'HUMAN_REVIEW_REQUIRED'
  },
  critical_routes: [
    '/', '/igor-vepretski/', '/journey/', '/starton/', '/influence/',
    '/media/', '/articles/', '/evidence/', '/speaker/', '/talk/',
    '/contact/', '/museum/', '/history/', '/entity/', '/create/',
    '/7ya/', '/response-ai/'
  ],
  domain: {
    apex: '7ya.io',
    www: 'www.7ya.io',
    dns_provider: 'Cloudflare',
    authoritative_nameservers_unchanged: true
  },
  rollback: {
    branch: 'rollback/vercel-proxy-before-personal-20260718',
    prior_live_source_sha: '3f6f1ff5572e0f2776b2bc22ae5f9162f6ae5bd7'
  },
  generated_at: '2026-07-18T14:27:28Z'
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
  response.setHeader('Cache-Control', 'public, max-age=0, s-maxage=0, must-revalidate');
  response.setHeader('CDN-Cache-Control', 'max-age=0, must-revalidate');
  response.setHeader('Vercel-CDN-Cache-Control', 'max-age=0, must-revalidate');
  response.setHeader('X-Content-Type-Options', 'nosniff');
  response.setHeader('X-7YA-Source-SHA', payload.source_sha);

  if (request.method === 'HEAD') response.end();
  else response.end(JSON.stringify(payload, null, 2));
};
