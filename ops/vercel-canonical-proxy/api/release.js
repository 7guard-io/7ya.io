'use strict';

const payload = {
  release_id: 'igor-public-universe-20260715',
  source_repository: '7guard-io/7ya.io',
  source_branch: 'main',
  source_sha: 'a4e2123d14a6b5f69654ab55a6444b9b1bb78ce7',
  pull_request: 229,
  architecture: 'canonical-github-sha-proxy',
  deployed_surface: '7ya-static-site',
  experience: 'IGOR_VERIFIED_CORE_EXPANDING_PUBLIC_UNIVERSE_SIGNAL_KEY_NVIDIA_ROUTER',
  archive_record_count: 66,
  public_universe: {
    additional_record_count: 26,
    combined_source_records_before_url_dedupe: 92,
    source_path: '/knowledge/public-universe-records-20260715.json',
    runtime_url_deduplication: true,
    fixed_ceiling: false,
    collections: ['VERIFIED_CORE', 'PUBLIC_UNIVERSE'],
  },
  response_signal_count: 11,
  positive_external_signal_count: 3,
  validated_tiktok_live_comment_records: 10273,
  distinct_entity_visual_sources: 5,
  smart_guide: {
    enabled: true,
    public_name: '7YA Signal Key',
    provider_order: ['nvidia', 'openai', 'local'],
    nvidia_activation: 'Requires NVIDIA_API_KEY or NVIDIA_NIM_API_KEY in the deployment environment.',
    default_nvidia_model: 'nvidia/nemotron-3-nano-30b-a3b',
    provider_transparency: true,
    local_evidence_fallback: true,
  },
  collector: {
    workflow: 'digital-museum-collector.yml',
    cadence: '17 minutes past every 12th UTC hour',
    approved_target_registry: 'data/collector-targets.json',
    diff_only_commit: true,
    private_network_targets_blocked: true,
    publication_approval_inferred: false,
  },
  critical_routes: [
    '/', '/museum/', '/entity/', '/create/', '/history/', '/igor-vepretski/',
    '/journey/', '/7ya/', '/starton/', '/influence/', '/response-ai/',
    '/evidence/', '/speaker/', '/talk/', '/media/', '/articles/', '/contact/'
  ],
  critical_public_universe_assets: [
    '/styles/public-universe-20260715.css',
    '/scripts/public-content-museum-20260715.js',
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
  raw_comment_text_publication: false,
  human_review_required_for_comment_text: true,
  private_family_identifiers_published: false,
  private_minor_identifiers_published: false,
  quarantined_records_published: false,
  nvidia_partnership_claimed: false,
  custom_domain_attached: false,
  generated_at: '2026-07-15T19:06:08+03:00',
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
