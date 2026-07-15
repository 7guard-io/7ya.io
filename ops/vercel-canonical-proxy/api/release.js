'use strict';

const payload = {
  release_id: 'igor-signal-key-creator-universe-20260716',
  source_repository: '7guard-io/7ya.io',
  source_branch: 'main',
  source_sha: '9d56ab62fb1216515d00b3b7e602f9e3642bdd22',
  pull_request: 241,
  architecture: 'canonical-github-sha-proxy',
  deployed_surface: '7ya-static-site',
  experience: 'IGOR_PERSONAL_PUBLIC_SYSTEM_CREATOR_COMPANION_PUBLIC_UNIVERSE',
  homepage_build: 'igor-personal-production-20260715',
  archive_record_count: 66,
  public_universe: {
    additional_record_count: 26,
    combined_source_records_before_url_dedupe: 92,
    source_path: '/knowledge/public-universe-records-20260715.json',
    homepage_explorer: true,
    search_and_filters: true,
    controlled_pagination: true,
    runtime_url_deduplication: true,
    content_to_creator_bridge: true,
    fixed_ceiling: false,
    collections: ['VERIFIED_CORE', 'PUBLIC_UNIVERSE'],
  },
  visual_system: {
    enabled: true,
    script: '/scripts/history-song-20260714.js',
    hero_asset: '/assets/igor-hero-storm-20260715.webp',
    modes: ['sentinel', 'creator', 'founder', 'architect'],
    evidence_content_stable_across_modes: true,
  },
  response_signal_count: 11,
  positive_external_signal_count: 3,
  validated_tiktok_live_comment_records: 10273,
  smart_guide: {
    enabled: true,
    public_name: '7YA Signal Key',
    role: 'positive creator and fulfilment companion',
    modes: ['understand', 'create', 'fulfilment', 'impact'],
    structured_plan_fields: ['reflection', 'goal', 'next_step', 'today', 'this_week', 'hook', 'angle', 'outline', 'evidence_notes'],
    route_aware_prompts: true,
    copyable_action_plan: true,
    creator_seed_bridge: true,
    prompt_persistence: false,
    automatic_publishing: false,
    provider_order: ['nvidia', 'openai', 'local'],
    nvidia_activation: 'Requires NVIDIA_API_KEY or NVIDIA_NIM_API_KEY in the deployment environment.',
    default_nvidia_model: 'nvidia/nemotron-3-nano-30b-a3b',
    provider_transparency: true,
    local_evidence_fallback: true,
  },
  critical_routes: [
    '/', '/museum/', '/entity/', '/create/', '/history/', '/igor-vepretski/',
    '/journey/', '/7ya/', '/starton/', '/influence/', '/response-ai/',
    '/evidence/', '/speaker/', '/talk/', '/media/', '/articles/', '/contact/'
  ],
  critical_assets: [
    '/styles/history-song-20260714.css',
    '/scripts/history-song-20260714.js',
    '/scripts/history-song-core-20260714.js',
    '/assets/igor-hero-storm-20260715.webp',
    '/styles/7ya-signal-key-20260715.css',
    '/scripts/7ya-signal-key-20260715.js',
    '/styles/home-public-universe-20260716.css',
    '/scripts/home-public-universe-20260716.js',
    '/knowledge/public-universe-records-20260715.json',
  ],
  stance_controls: [
    'POSITIVE_EXTERNAL_FRAMING', 'CONSTRUCTIVE_EXTERNAL_FRAMING',
    'UNDETERMINED_FROM_AGGREGATES', 'HUMAN_REVIEW_REQUIRED'
  ],
  claim_controls: [
    'VERIFIED', 'DOCUMENTED', 'SELF_ATTESTED', 'CONCEPT', 'PROTOTYPE',
    'SOURCE_PENDING', 'PRIVATE'
  ],
  cache_policy: {
    html: 'revalidate immediately during canonical-domain cutover',
    versioned_assets: 'immutable',
    release_metadata: 'revalidate immediately',
  },
  raw_comment_text_publication: false,
  human_review_required_for_comment_text: true,
  private_family_identifiers_published: false,
  private_minor_identifiers_published: false,
  quarantined_records_published: false,
  nvidia_partnership_claimed: false,
  domain_cutover: {
    target_domains: ['7ya.io', 'www.7ya.io'],
    required_project: '7ya-static-site',
    project_id: 'prj_xpcMFC96JcnasigrvetZetEa1XzU',
    custom_domain_attached: false,
    dns_provider: 'Cloudflare',
    preserve_mail_records: true,
  },
  generated_at: '2026-07-16T01:48:50+03:00',
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