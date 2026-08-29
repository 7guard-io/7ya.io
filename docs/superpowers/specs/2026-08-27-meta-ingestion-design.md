# 7YA Meta Ingestion Design — 2026-08-27

## Goal
Connect the existing `7YA_graph` Meta Business Integration to the 7YA public corpus as an additive, server-side ingestion source for Facebook Pages and linked Instagram Professional accounts, without making the public site depend on Meta availability or OAuth state.

The existing public-projection-first architecture remains authoritative for rendering. Meta live access enriches it with owner-authorized first-party objects, source-local metrics and dated snapshots.

## Non-goals
- Do not expose user, page or app access tokens to the browser, repository, logs or public APIs.
- Do not publish private Facebook/Instagram data, inbox/messages, friends, contacts, or account-management details.
- Do not replace the existing canonical/public-register/discovery corpus.
- Do not create a synthetic cross-platform reach total.
- Do not make live Meta calls during homepage rendering.
- Do not require Meta to be healthy for `/api/public-projection`, `/library/`, `/history/`, `/influence/` or the homepage to render.

## Context
Current production is AppDeploy-backed and already treats live social OAuth as optional enrichment. `/api/public-projection` is the historical/public baseline and must remain populated even if Meta credentials are absent or invalid.

The Meta integration shown in the account is active and grants business-management visibility sufficient to attempt Page discovery. The runtime must still validate the actual token scopes and object access before assuming any API capability.

## Recommended architecture

### 1. Server-only Meta client
Add a focused Meta Graph client module with no UI dependency.

Responsibilities:
- read credentials only from server-side secrets;
- select a configurable Graph API version via `META_GRAPH_API_VERSION`;
- call Graph endpoints with strict timeouts and bounded retries;
- normalize Graph errors into typed provider errors;
- never log raw access tokens or secret-bearing URLs.

Primary configuration:
- `META_USER_ACCESS_TOKEN` — owner-authorized long-lived user token or equivalent secure credential;
- `META_GRAPH_API_VERSION` — explicit version, not hardcoded throughout the codebase;
- optional `META_APP_ID` / `META_APP_SECRET` only when required for token debugging/exchange and only in server secrets.

No secret is committed to GitHub.

### 2. Capability discovery
Before ingestion, run a capability probe rather than assuming the Business Integration UI equals API readiness.

Probe sequence:
1. validate token status/scopes using Meta's supported token-debug mechanism when app credentials are available;
2. call `/me/accounts` with Page fields including `id,name,tasks,access_token,instagram_business_account`;
3. capture all Pages returned by Meta;
4. identify Pages relevant to Igor/7YA through an explicit allowlist once IDs are known;
5. identify linked Instagram Professional account IDs from `instagram_business_account`;
6. store a sanitized capability state: provider, object ID, object type, granted tasks/scopes, last successful probe and error class.

The public API never returns Page access tokens.

### 3. Facebook Page adapter
For each allowlisted Page, ingest only public/owner-authorized Page content required for the public archive.

Normalized fields:
- stable provider object ID;
- platform = `Facebook`;
- canonical permalink;
- created/published timestamp;
- message/title excerpt suitable for the archive;
- media type;
- public picture/thumbnail reference when available;
- source-local engagement fields only when the API exposes them under granted permissions;
- `as_of` timestamp for every metric snapshot;
- Page ID as provenance metadata, never as a public identity claim by itself.

Pagination is cursor-based and bounded per run. Incremental sync uses the newest known provider timestamp/ID and a small overlap window to catch edits or delayed objects.

### 4. Instagram Professional adapter
For every linked Instagram Professional account, ingest media objects through the supported Instagram Graph/Facebook Login path.

Normalized fields:
- stable Instagram media ID;
- media type (`IMAGE`, `VIDEO`, `CAROUSEL_ALBUM`, `REELS`/equivalent when exposed);
- caption/title excerpt;
- permalink;
- timestamp;
- thumbnail/media URL when suitable for transient fetch or snapshot processing;
- username/account ID as provenance;
- comments/likes/views/reach/impressions or other insights only when the relevant permission and metric are supported;
- `as_of` timestamp and metric scope for every snapshot.

Media URLs from Meta are treated as provider references that may expire. 7YA should prefer durable public permalinks and owner-approved snapshots/derived thumbnails for long-term presentation.

### 5. Normalization boundary
Create one provider-neutral ingestion record before data enters the canonical/public projection layer.

Proposed shape:

```ts
type SocialIngestRecord = {
  id: string;
  provider: 'meta';
  platform: 'Facebook' | 'Instagram';
  providerObjectId: string;
  accountObjectId: string;
  canonicalUrl: string;
  publishedAt: string;
  text?: string;
  mediaType: 'video' | 'image' | 'carousel' | 'post';
  mediaUrl?: string;
  thumbnailUrl?: string;
  provenance: {
    source: 'owner-authorized-api';
    fetchedAt: string;
    apiVersion: string;
  };
  metrics?: Array<{
    name: string;
    value: number;
    asOf: string;
    scope: 'source-local';
  }>;
};
```

Provider-specific raw responses never become the public contract.

### 6. Persistence and snapshots
Persist content identity separately from metric snapshots.

Content table/collection responsibilities:
- one durable record per provider object;
- canonical URL and normalized text/media metadata;
- first-seen/last-seen timestamps;
- tombstone/availability state rather than hard deletion when an object disappears.

Metric snapshot responsibilities:
- append-only or versioned observations;
- provider object ID + metric name + value + `as_of`;
- never silently overwrite historical observations;
- never sum unlike metrics into a reach figure.

If the current AppDeploy persistence layer already has graph/public-projection storage primitives, reuse them rather than introduce a parallel database.

### 7. Projection integration
Meta records enter the same projection used by the rest of the site.

Merge order remains conceptually:
`CANON + PUBLIC REGISTER + DISCOVERY + WORLD DISCOVERY + LIVE/OWNER-AUTHORIZED PROVIDERS + GRAPH`

Rules:
- dedupe by stable provider ID first, canonical URL second;
- owner-authorized Meta records may enrich an existing public permalink record instead of creating a duplicate;
- Canon/Discovery provenance is preserved;
- Meta source-local metrics may enrich the matching object but do not upgrade unrelated claims;
- live-provider failure cannot remove an existing canonical/public record.

### 8. Ingestion execution model
Do not call Meta from the browser or on every page request.

Use a server-side sync job with two modes:
- `probe` — validate capabilities and discover managed objects;
- `sync` — incrementally ingest allowlisted Facebook/Instagram objects and metrics.

Recommended cadence after initial backfill: hourly or a few times per day, subject to Meta rate limits and actual change volume. Initial historical backfill runs in bounded pages with checkpoints so it can resume without restarting from zero.

A future webhook path may be added for faster updates, but polling is sufficient for v1 and keeps the initial subsystem smaller.

### 9. Security and privacy
Hard requirements:
- tokens only in secret storage;
- redact `access_token`, `client_secret`, authorization headers and token-bearing query strings from logs;
- no client endpoint returns secrets;
- only allowlisted Page/Instagram IDs are ingested after discovery;
- ignore private messages and non-public personal data;
- do not persist the Facebook user ID visible in the integration settings as public site content;
- store only the minimum account/object metadata needed for provenance and sync;
- fail closed on permission ambiguity.

### 10. Error handling
Provider failures are classified, not flattened into `500`.

Classes:
- `AUTH_EXPIRED` — token expired/revoked;
- `MISSING_SCOPE` — required permission absent;
- `OBJECT_NOT_ALLOWED` — discovered object not on allowlist;
- `RATE_LIMITED` — retry after bounded backoff;
- `PROVIDER_TEMPORARY` — Meta transient/server failure;
- `OBJECT_REMOVED` — provider object no longer accessible;
- `SCHEMA_CHANGED` — response no longer matches adapter expectations.

Every failure records a sanitized operational event and leaves the existing public corpus untouched.

### 11. Observability
Expose a private/admin-safe health summary only:
- last successful Meta probe;
- number of discovered Pages;
- number of allowlisted Pages;
- linked Instagram account count;
- last successful Facebook sync;
- last successful Instagram sync;
- records inserted/updated;
- most recent sanitized error class.

Do not expose tokens, raw Graph payloads or sensitive account metadata.

## API/permission strategy
For the Facebook Login for Business / Instagram Graph path, request only the scopes needed by the implemented read-only use case. The expected baseline includes Page discovery/read scopes such as `pages_show_list` and `pages_read_engagement`, Instagram identity/media access such as `instagram_basic`, and `instagram_manage_insights` only when insights are actually collected.

Do not request publishing, messaging, comment-management or ads permissions unless a separately approved feature requires them.

The runtime treats permissions as capabilities: if insights are unavailable, content ingestion still succeeds without insights.

## Proposed code boundaries
Exact paths may adapt to the current AppDeploy source tree, but the logical units should remain separate:

- `server/meta/client.ts` — authenticated Graph request wrapper;
- `server/meta/capabilities.ts` — token/Page/IG discovery and allowlist resolution;
- `server/meta/facebook-adapter.ts` — Page content normalization;
- `server/meta/instagram-adapter.ts` — IG media/insight normalization;
- `server/meta/sync.ts` — checkpoints, pagination, persistence orchestration;
- `shared/social-ingest.ts` — provider-neutral normalized type/validators;
- existing public-projection/graph merge layer — consume normalized Meta records;
- tests/fixtures — sanitized fixture payloads only, never real tokens.

If the production AppDeploy backend uses a different directory convention, preserve these module boundaries within that convention instead of forcing new top-level folders.

## TDD / acceptance gates
Implementation must begin with failing tests for the contracts below.

1. Token-bearing values are never serialized into public responses or logs.
2. `/me/accounts` discovery maps Pages and linked Instagram accounts correctly from sanitized fixtures.
3. Non-allowlisted discovered Pages are ignored.
4. Facebook objects normalize to stable canonical records.
5. Instagram media normalize to stable canonical records.
6. Cursor pagination resumes from checkpoints and does not duplicate records.
7. A repeated sync enriches an existing object rather than duplicating it.
8. Metrics require `as_of` and remain `source-local`.
9. Missing insight permissions do not prevent content ingestion.
10. Expired/revoked credentials leave `/api/public-projection` populated from existing sources.
11. Meta timeout/rate-limit/provider failure does not blank homepage/library/history/influence data.
12. Public responses contain no user/page access tokens, app secret or token-debug payload.
13. HE/EN/RU presentation remains unchanged when Meta is unavailable.
14. Existing media-corpus and Impact Universe integrity tests continue to pass.

## Rollout
Phase 1 — capability probe only. Confirm actual Page IDs, tasks/scopes and linked Instagram Professional account IDs without publishing any new data.

Phase 2 — dry-run ingestion. Fetch bounded pages, normalize and report counts/dedupe matches without changing public projection.

Phase 3 — persistence and projection integration behind a server-side feature flag.

Phase 4 — historical backfill with checkpoints, then incremental sync.

Phase 5 — production enablement only after the canonical release gate and explicit deployment command.

## Success criteria
- 7YA can discover the authorized Facebook Pages and linked Instagram Professional accounts using server-side credentials.
- New Facebook/Instagram public media can enter the unified corpus automatically when Meta access is healthy.
- Historical/public content still renders when Meta is unavailable.
- Every metric is tied to source, object and date.
- No secret reaches source control or the browser.
- No duplicate Meta/public-permalink objects appear after repeated syncs.
- The subsystem can be disabled without affecting the documentary homepage, public library or Impact Universe.
