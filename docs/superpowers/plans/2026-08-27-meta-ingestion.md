# 7YA Meta Ingestion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing `7YA_graph` Meta Business Integration into a secure, additive Facebook Pages + linked Instagram Professional ingestion source that enriches the unified 7YA public projection without making the public site depend on Meta availability.

**Architecture:** Keep Meta entirely server-side. A focused Meta client discovers capabilities from an owner-authorized user token, adapters normalize Facebook/Instagram objects into one provider-neutral contract, AppDeploy DB stores durable content identities + append-only metric snapshots + checkpoints, and `/api/public-projection` merges those records as an additive `LIVE`/owner-authorized source while preserving Canon precedence and public fallbacks. Meta fetches happen only in admin probe/sync routes and cron jobs, never in browser render paths.

**Tech Stack:** TypeScript, AppDeploy SDK (`router`, `db`, `secrets`, auth guards), Meta Graph API, existing Vite/React frontend, AppDeploy `tests/tests.txt` QA runner, canonical GitHub `npm run ci:local` release gate.

**Spec:** `docs/superpowers/specs/2026-08-27-meta-ingestion-design.md`

## Global Constraints

- No access token, app secret, Page token, token-debug payload, or token-bearing URL may reach browser code, public API responses, logs, GitHub, screenshots, or QA fixtures.
- `META_USER_ACCESS_TOKEN`, `META_APP_ID`, `META_APP_SECRET`, allowlists and enable flags live only in AppDeploy secret storage.
- Graph API version is resolved once through `META_GRAPH_API_VERSION`; use one code default (`v24.0`) only when that secret is absent.
- Only explicitly allowlisted Page IDs and Instagram Professional account IDs may be ingested.
- Capability discovery may reveal sanitized Page/Instagram IDs to authenticated admin routes so the allowlists can be configured; public endpoints never expose them.
- A missing/expired/revoked Meta credential must not remove or blank existing Canon, Public Register, Discovery, social fallback, `/library/`, `/history/`, `/influence/`, or homepage content.
- Every metric observation requires `asOf` and `scope: 'source-local'`; no cross-platform synthetic reach is introduced.
- Provider raw payloads are not public contracts and are not persisted wholesale.
- Existing TikTok, LinkedIn, YouTube, secondary Instagram and public-projection fallbacks keep working throughout the rollout.
- Meta sync is read-only. No publishing, messaging, comment moderation, ad management or account mutation permissions are added.
- Production `apply_app_version`, canonical `main` push, and the full deployment chain remain blocked until the user explicitly says `בצע את שרשרת הפריסה`.
- Canonical release gate remains `npm run ci:local`; runtime AppDeploy QA does not substitute for that gate.

---

## File Map

### AppDeploy working source
- Create `shared/social-ingest.ts` — provider-neutral Meta ingestion contracts, validators, metric dedupe helpers and safe projection conversion types.
- Create `backend/meta/client.ts` — Meta Graph request wrapper, config loading, token redaction and typed provider errors.
- Create `backend/meta/capabilities.ts` — `/me/accounts` discovery, allowlist resolution and sanitized capability report.
- Create `backend/meta/facebook-adapter.ts` — Page post parsing/normalization.
- Create `backend/meta/instagram-adapter.ts` — Instagram Professional media + optional insights parsing/normalization.
- Create `backend/meta/store.ts` — AppDeploy DB persistence for content, metric snapshots, checkpoints and sanitized sync runs.
- Create `backend/meta/sync.ts` — probe/dry-run/sync orchestration, bounded pagination and feature-flag behavior.
- Modify `backend/index.ts` — import Meta subsystem, remove Meta-specific logic from the monolithic social block where replaced, add admin routes, cron handler and public-projection merge.
- Modify `cron.json` — add hourly Meta incremental sync at a different minute from agent mesh.
- Modify `tests/tests.txt` — add Meta security, failure-isolation, dedupe and projection-enrichment acceptance scenarios.

### Canonical GitHub repository
- Create `scripts/check-meta-ingestion.mjs` — source/export integrity checker for the newest AppDeploy snapshot.
- Modify `package.json` — include `check-meta-ingestion` in `check-all` before build/typecheck.
- Export the final draft AppDeploy source delta under a new `appdeploy-live/<version>/` snapshot and update `appdeploy-live/CURRENT.json` only during the explicit release/export stage, not during feature construction.

---

### Task 1: Provider-Neutral Ingestion Contract

**Files:**
- Create: `shared/social-ingest.ts`
- Modify: `tests/tests.txt`

**Interfaces:**
- Produces:
  - `type SocialIngestMetric`
  - `type SocialIngestRecord`
  - `type SocialIngestProjectionMetric`
  - `validateSocialIngestRecord(value: unknown): SocialIngestRecord`
  - `dedupeSocialMetrics(metrics: SocialIngestMetric[]): SocialIngestMetric[]`
  - `socialRecordKey(record: Pick<SocialIngestRecord,'provider'|'providerObjectId'>): string`
- Consumed by: Facebook adapter, Instagram adapter, store, sync and public projection integration.

- [ ] **Step 1: Add a failing QA contract before implementation**

Append a new section to `tests/tests.txt` named `Test 10 - Keep Meta ingestion source-local and secret-free` with these observable expectations:

```text
Expected: Meta-enriched projection items expose only canonical URL, public media metadata, owner-authorized provenance and dated source-local metrics; no access token, app secret, Page token, authorization header, token-debug payload or raw Graph response is present in any public response; unlike metric classes are never summed into one reach value.
```

This test should fail initially because no Meta ingestion contract/projection exists yet.

- [ ] **Step 2: Create the exact shared contract**

Implement `shared/social-ingest.ts` with this public shape:

```ts
export type SocialIngestMetric={
  name:string;
  value:number;
  unit:string;
  asOf:string;
  scope:'source-local';
};

export type SocialIngestRecord={
  id:string;
  provider:'meta';
  platform:'Facebook'|'Instagram';
  providerObjectId:string;
  accountObjectId:string;
  canonicalUrl:string;
  publishedAt:string;
  text?:string;
  mediaType:'video'|'image'|'carousel'|'post';
  mediaUrl?:string;
  thumbnailUrl?:string;
  provenance:{
    source:'owner-authorized-api';
    fetchedAt:string;
    apiVersion:string;
  };
  metrics:SocialIngestMetric[];
};

export type SocialIngestProjectionMetric={
  label:string;
  value:string;
  unit:string;
  date:string;
  scope:'source-local';
};
```

Validation rules:

```ts
const HTTPS=/^https:\/\//i;
const ISO_DATE=/^\d{4}-\d{2}-\d{2}T/;

// reject empty providerObjectId/accountObjectId/canonicalUrl/publishedAt
// reject non-HTTPS canonicalUrl
// reject metrics without finite non-negative numeric values
// reject metrics without ISO-like asOf
// coerce no provider-specific raw payload into the returned object
// cap text at 5000 characters
```

`socialRecordKey()` must return `meta:<providerObjectId>`. `dedupeSocialMetrics()` must dedupe by `name|asOf|unit` and preserve the last observation supplied for the same key.

- [ ] **Step 3: Build/typecheck the draft source**

Validation action: create an AppDeploy draft version from the current applied source and run the standard AppDeploy build/typecheck. Expected: no TypeScript errors from `shared/social-ingest.ts`.

- [ ] **Step 4: Review the contract against the spec**

Confirm all metric entries have `asOf` and `scope: 'source-local'`, no token field exists in `SocialIngestRecord`, and provider raw payload types are not exported.

- [ ] **Step 5: Checkpoint commit/export**

Do not apply production. Record the draft change in the feature branch/export workflow with message:

```bash
git commit -m "feat: define Meta social ingestion contract"
```

---

### Task 2: Secure Meta Graph Client and Capability Discovery

**Files:**
- Create: `backend/meta/client.ts`
- Create: `backend/meta/capabilities.ts`
- Modify: `backend/index.ts`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: `secrets` from `@appdeploy/sdk`.
- Produces from `client.ts`:
  - `type MetaErrorCode='AUTH_EXPIRED'|'MISSING_SCOPE'|'RATE_LIMITED'|'PROVIDER_TEMPORARY'|'OBJECT_REMOVED'|'SCHEMA_CHANGED'`
  - `class MetaProviderError extends Error { code: MetaErrorCode; status?: number }`
  - `loadMetaConfig(): Promise<MetaConfig|null>`
  - `metaFetchJson<T>(config: MetaConfig, path: string, params?: Record<string,string>, tokenOverride?: string): Promise<T>`
  - `sanitizeMetaError(error: unknown): {code:string;message:string}`
- Produces from `capabilities.ts`:
  - `type MetaPageCapability`
  - `type MetaCapabilityReport`
  - `discoverMetaCapabilities(config: MetaConfig): Promise<MetaCapabilityReport>`
  - `resolveAllowedCapabilities(report: MetaCapabilityReport, config: MetaConfig): MetaCapabilityReport`

- [ ] **Step 1: Add failing capability/security QA scenarios**

Append `Test 11 - Probe Meta capabilities without exposing credentials` to `tests/tests.txt`:

```text
Steps:
1. Call the authenticated Meta admin status/probe route with credentials absent.
2. Configure sanitized test capability fixtures or real owner-authorized credentials in secret storage and call probe again.
3. Inspect the JSON response and runtime logs.
Expected: absent credentials return a typed credential-required state without breaking the site; successful probe returns only sanitized Page/Instagram IDs, names, task/scope labels and timestamps; no access token or token-bearing URL appears in response or logs.
```

- [ ] **Step 2: Implement centralized config loading**

Use exactly these secret names:

```ts
export type MetaConfig={
  apiVersion:string;
  userAccessToken:string;
  appId?:string;
  appSecret?:string;
  allowedPageIds:Set<string>;
  allowedInstagramIds:Set<string>;
  enabled:boolean;
};
```

Secret mapping:

```text
META_USER_ACCESS_TOKEN
META_GRAPH_API_VERSION
META_APP_ID
META_APP_SECRET
META_ALLOWED_PAGE_IDS        # comma-separated numeric/string IDs
META_ALLOWED_INSTAGRAM_IDS   # comma-separated numeric/string IDs
META_INGEST_ENABLED          # literal "true" enables writes/cron
```

`loadMetaConfig()` returns `null` if `META_USER_ACCESS_TOKEN` is absent. Resolve API version once: secret value if present, otherwise `v24.0`.

- [ ] **Step 3: Implement secret-safe HTTP behavior**

`metaFetchJson()` must:

```ts
const url=new URL(`https://graph.facebook.com/${config.apiVersion}/${path.replace(/^\//,'')}`);
for(const [key,value] of Object.entries(params||{}))url.searchParams.set(key,value);
const response=await fetch(url,{headers:{accept:'application/json',Authorization:`Bearer ${tokenOverride||config.userAccessToken}`},cache:'no-store',signal:AbortSignal.timeout(10_000)});
```

Never append `access_token` to query strings. Never log `url.toString()` after a token-bearing param. Normalize Graph errors by HTTP/code/subcode into the declared `MetaErrorCode`; keep the public/admin message generic and token-free.

- [ ] **Step 4: Implement `/me/accounts` discovery**

Call:

```text
/me/accounts?fields=id,name,tasks,access_token,instagram_business_account{id,username}&limit=100
```

Use the returned Page token only in memory inside the capability object used during the current request; define an internal `MetaResolvedPage` containing `pageAccessToken`, but strip that field from `MetaCapabilityReport` before returning or persisting it.

Sanitized report shape:

```ts
export type MetaPageCapability={
  pageId:string;
  pageName:string;
  tasks:string[];
  allowed:boolean;
  instagram?:{id:string;username:string;allowed:boolean};
};

export type MetaCapabilityReport={
  checkedAt:string;
  apiVersion:string;
  pages:MetaPageCapability[];
  discoveredPageCount:number;
  allowedPageCount:number;
  linkedInstagramCount:number;
  allowedInstagramCount:number;
  state:'ready'|'credential-required'|'missing-scope'|'unavailable';
  errorClass?:string;
};
```

- [ ] **Step 5: Add authenticated admin routes**

Add to `backend/index.ts` router:

```text
GET  /api/meta/admin/status
POST /api/meta/admin/probe
```

Both use `requireAuth()` + `requireAdminEmailAllowlist(ADMIN_EMAILS)`. `GET status?dryRun=1` may return only `{protected:true,route:'GET /api/meta/admin/status'}` before auth, matching existing dry-run route conventions; it must not return discovered IDs publicly.

- [ ] **Step 6: Verify failure and success paths**

Expected checks:
- No credential: authenticated status = `credential-required`, HTTP 200, site unchanged.
- Missing scope: probe returns sanitized `missing-scope` state, not raw Graph body.
- Ready: sanitized Pages/linked IG objects visible only to admin.
- Runtime logs contain only error class + safe message.

- [ ] **Step 7: Checkpoint commit/export**

```bash
git commit -m "feat: add secure Meta capability discovery"
```

---

### Task 3: Facebook and Instagram Normalization Adapters

**Files:**
- Create: `backend/meta/facebook-adapter.ts`
- Create: `backend/meta/instagram-adapter.ts`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: `MetaConfig`, `MetaResolvedPage`, `metaFetchJson`, `SocialIngestRecord`.
- Produces:
  - `normalizeFacebookPost(raw: unknown, ctx: MetaNormalizeContext): SocialIngestRecord|null`
  - `fetchFacebookPageBatch(ctx: MetaPageFetchContext): Promise<MetaBatch>`
  - `normalizeInstagramMedia(raw: unknown, ctx: MetaNormalizeContext): SocialIngestRecord|null`
  - `fetchInstagramMediaBatch(ctx: MetaInstagramFetchContext): Promise<MetaBatch>`
  - `fetchInstagramInsights(recordId: string, ctx: MetaInstagramFetchContext): Promise<SocialIngestMetric[]>`

Shared batch contract:

```ts
type MetaBatch={
  records:SocialIngestRecord[];
  nextCursor:string|null;
  fetchedAt:string;
};
```

- [ ] **Step 1: Add failing adapter QA cases**

Append `Test 12 - Normalize Facebook and Instagram objects deterministically`:

```text
Expected: repeated fetches of the same provider object produce the same stable record ID and canonical URL; unsupported/invalid rows are skipped rather than emitted; Instagram insight permission failure preserves the media record with an empty metrics array.
```

- [ ] **Step 2: Implement Facebook Page batch fetch**

Fetch only allowlisted Pages, using each Page token in memory:

```text
/{page-id}/posts?fields=id,message,created_time,permalink_url,full_picture,attachments{media_type,type,url,media,target}&limit=50&after=<cursor>
```

Normalize:

```ts
id:`meta:facebook:${providerObjectId}`
platform:'Facebook'
providerObjectId:String(raw.id)
accountObjectId:pageId
canonicalUrl:String(raw.permalink_url)
publishedAt:String(raw.created_time)
text:String(raw.message||'').slice(0,5000)
mediaType: derived from attachment type, else 'post'
thumbnailUrl: full_picture when HTTPS
metrics: [] // content identity first; metric collection remains explicit
```

If a Page does not return `permalink_url`, skip it rather than invent a URL.

- [ ] **Step 3: Implement Instagram media batch fetch**

For each linked, allowlisted Instagram Professional account use Graph API with the in-memory Page token:

```text
/{ig-user-id}/media?fields=id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,username,like_count,comments_count&limit=50&after=<cursor>
```

Normalize media type:
- `VIDEO` or `REELS`/reel-like `media_product_type` → `video`
- `CAROUSEL_ALBUM` → `carousel`
- `IMAGE` → `image`
- otherwise skip unsupported rows.

Map `like_count` and `comments_count` only when finite and present, each with the fetch timestamp as `asOf` and `scope:'source-local'`.

- [ ] **Step 4: Add optional Instagram insights fetch**

Only attempt insights when the capability/scope state indicates `instagram_manage_insights` is available. Request a conservative metric set supported by the current API/version for the media type. Convert only numeric values into `SocialIngestMetric`. Any permission/metric incompatibility returns `[]` and a sanitized warning class; it must not fail media ingestion.

- [ ] **Step 5: Verify adapter boundaries**

Check:
- no adapter accepts a non-allowlisted account context;
- Page access token never appears in returned records;
- provider `media_url` is treated as transient and never substituted for `canonicalUrl`;
- repeated same object produces same `id` and `providerObjectId`.

- [ ] **Step 6: Checkpoint commit/export**

```bash
git commit -m "feat: normalize Meta Facebook and Instagram media"
```

---

### Task 4: Durable Meta Store, Metric Snapshots and Checkpoints

**Files:**
- Create: `backend/meta/store.ts`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: `SocialIngestRecord`, `SocialIngestMetric`, sanitized `MetaCapabilityReport`.
- Produces:
  - `saveMetaCapabilityReport(report: MetaCapabilityReport): Promise<void>`
  - `upsertMetaRecords(records: SocialIngestRecord[]): Promise<{inserted:number;updated:number}>`
  - `appendMetaMetricSnapshots(records: SocialIngestRecord[]): Promise<number>`
  - `readMetaProjectionRecords(limit?: number): Promise<SocialIngestRecord[]>`
  - `readMetaCheckpoint(key:string): Promise<string|null>`
  - `writeMetaCheckpoint(key:string,cursor:string|null): Promise<void>`
  - `recordMetaSyncRun(run: MetaSyncRun): Promise<void>`
  - `readMetaHealth(): Promise<MetaHealthSummary>`

DB collections:

```text
meta_capability_state
meta_ingest_records
meta_metric_snapshots
meta_sync_checkpoints
meta_sync_runs
```

- [ ] **Step 1: Add failing persistence/dedupe QA scenario**

Append `Test 13 - Repeated Meta sync enriches instead of duplicating`:

```text
Steps:
1. Run one bounded dry-run/sync against the same source page twice.
2. Compare normalized record counts and provider IDs.
3. Compare metric snapshot history.
Expected: content identity stays one record per provider object; a changed caption/media field updates the durable content row; metric observations are append-only by metric/asOf and exact duplicate observations are ignored; sync checkpoints advance without dropping existing public corpus data.
```

- [ ] **Step 2: Implement content upsert by stable provider key**

Persist a row shape like:

```ts
type MetaStoredRecord={
  providerKey:string; // meta:<providerObjectId>
  record:SocialIngestRecord;
  firstSeenAt:number;
  lastSeenAt:number;
  availability:'active'|'unavailable';
};
```

Use bounded reads. If collection size exceeds the declared safety window, fail the Meta sync only and leave public projection fallback untouched.

- [ ] **Step 3: Implement append-only metric snapshots**

Persist:

```ts
type MetaMetricSnapshot={
  providerKey:string;
  platform:'Facebook'|'Instagram';
  accountObjectId:string;
  metricName:string;
  value:number;
  unit:string;
  asOf:string;
  scope:'source-local';
  createdAt:number;
};
```

Deduplicate exact `providerKey|metricName|unit|asOf`. Never overwrite a historical metric observation with a newer value.

- [ ] **Step 4: Implement checkpoints and health summary**

Checkpoint key format:

```text
facebook:<pageId>:posts
instagram:<igId>:media
```

Health summary returns only:

```ts
{
  lastSuccessfulProbe:string|null,
  discoveredPages:number,
  allowlistedPages:number,
  linkedInstagramAccounts:number,
  lastSuccessfulFacebookSync:string|null,
  lastSuccessfulInstagramSync:string|null,
  recordsInserted:number,
  recordsUpdated:number,
  mostRecentErrorClass:string|null
}
```

Do not include tokens, raw Graph payloads, email addresses or secret values.

- [ ] **Step 5: Verify bounded failure behavior**

Simulate a DB failure or bounded-window rejection. Expected: Meta route reports a sanitized store failure; existing `/api/public-projection` continues from Canon/Discovery/social fallback.

- [ ] **Step 6: Checkpoint commit/export**

```bash
git commit -m "feat: persist Meta content metrics and checkpoints"
```

---

### Task 5: Probe, Dry-Run, Incremental Sync and Hourly Cron

**Files:**
- Create: `backend/meta/sync.ts`
- Modify: `backend/index.ts`
- Modify: `cron.json`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: capability discovery, adapters and store.
- Produces:
  - `runMetaProbe({persist}:{persist:boolean}): Promise<MetaProbeResult>`
  - `runMetaSync(options: {dryRun:boolean;maxPagesPerAccount:number}): Promise<MetaSyncResult>`
  - `metaSyncHourly(): Promise<{statusCode:number}>`

- [ ] **Step 1: Add failing operational QA scenario**

Append `Test 14 - Meta sync is gated, bounded and resumable`:

```text
Expected: META_INGEST_ENABLED absent/false means sync writes are skipped; dry-run fetches/normalizes and returns counts but performs zero DB writes; live sync is restricted to authenticated admin/manual route or cron, processes at most the requested bounded pages per account, persists checkpoints, and resumes without restarting from page one.
```

- [ ] **Step 2: Implement probe orchestration**

`runMetaProbe({persist:false})` performs capability discovery and returns sanitized report only. `persist:true` writes only the sanitized capability report.

- [ ] **Step 3: Implement sync orchestration**

Algorithm:

```text
load config
→ if no credential: return credential-required
→ discover capabilities
→ resolve allowlists
→ if no allowed objects: return no-allowlisted-objects
→ for each allowed Page: fetch ≤ maxPagesPerAccount pages from checkpoint
→ for each allowed linked IG account: fetch ≤ maxPagesPerAccount pages from checkpoint
→ normalize
→ if dryRun: return counts + sample public-safe IDs/URLs only, no writes
→ if META_INGEST_ENABLED != true: return disabled-with-zero-writes
→ upsert content
→ append metrics
→ update checkpoints only after successful persistence of the corresponding batch
→ record sanitized run summary
```

Default `maxPagesPerAccount=2`; hard cap `10`.

- [ ] **Step 4: Add authenticated manual routes**

Add:

```text
POST /api/meta/admin/sync
GET  /api/meta/admin/health
```

Both require auth/admin allowlist. Body for sync:

```json
{"dryRun":true,"maxPagesPerAccount":2}
```

A non-dry sync must also require `META_INGEST_ENABLED === true`.

- [ ] **Step 5: Add cron handler without touching production apply state**

Export from `backend/index.ts`:

```ts
export const metaSyncHourly=async()=>{
  try{
    const result=await runMetaSync({dryRun:false,maxPagesPerAccount:2});
    return {statusCode:200,body:JSON.stringify({status:result.status})};
  }catch(error){
    console.warn('Meta hourly sync failed',sanitizeMetaError(error));
    return {statusCode:200};
  }
};
```

Update `cron.json` to retain agent mesh and add:

```json
{"name":"meta-sync-hourly","cron":"37 * * * *","handler":"metaSyncHourly","timezone":"Asia/Jerusalem","payload":{"mode":"incremental"}}
```

Cron must return 200 even on provider failure so one provider outage does not destabilize AppDeploy scheduling.

- [ ] **Step 6: Verify dry-run and disabled modes**

Expected:
- `dryRun:true` => fetched/normalized counts, `writePerformed:false`.
- feature flag off => `status:'disabled'`, zero writes.
- feature flag on + valid allowlist => bounded writes/checkpoint progress.

- [ ] **Step 7: Checkpoint commit/export**

```bash
git commit -m "feat: orchestrate bounded Meta sync"
```

---

### Task 6: Public Projection Integration Without Fallback Regression

**Files:**
- Modify: `backend/index.ts`
- Modify: `shared/social-ingest.ts`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: `readMetaProjectionRecords()`.
- Produces: Meta-enriched `ProjectionItem` records while retaining existing `/api/public-projection` response shape plus optional metric `scope`.

- [ ] **Step 1: Add failing projection/failure-isolation QA scenario**

Append `Test 15 - Meta enriches Public Projection but can never blank it`:

```text
QA Faults: force Meta provider/auth path to fail while leaving Canon/Discovery available.
Expected: /api/public-projection remains populated and status may become partial; Meta-derived records disappear only from the additive stream; matching canonical URLs keep their Canon identity; homepage/library/history/influence remain non-empty.
```

- [ ] **Step 2: Read persisted Meta records independently from live provider calls**

Change `publicProjectionPayload()` to include store read, not Graph network access:

```ts
const [canonResult,discoveryResult,socialResult,metaResult]=await Promise.allSettled([
  readCanonicalCorpus({limit:5000}),
  buildDiscoveryLibrary(),
  getSocialFeed(),
  readMetaProjectionRecords(5000)
]);
```

A Meta store read failure is one rejected settled result; it must not throw the whole projection.

- [ ] **Step 3: Convert Meta records into ProjectionItems**

Use:

```text
layer: LIVE
trust: OWNER-AUTHORIZED-API
sourceKind: owner-authorized-api
origins: [meta-owner-authorized]
```

Map `SocialIngestMetric` into:

```ts
{label:metric.name,value:String(metric.value),unit:metric.unit,date:metric.asOf,scope:'source-local'}
```

Extend `ProjectionItem.metrics` with optional `scope?:'source-local'` so current consumers remain compatible.

- [ ] **Step 4: Fix metric merging for canonical URL collisions**

Replace the current winner-takes-nonempty-metrics logic in `mergeProjection()` with deterministic metric merge:

```ts
function mergeProjectionMetrics(a:ProjectionItem['metrics'],b:ProjectionItem['metrics']){
  const map=new Map<string,ProjectionItem['metrics'][number]>();
  for(const metric of [...a,...b]){
    const key=[metric.label,metric.unit,metric.date,metric.scope||''].join('|');
    map.set(key,metric);
  }
  return [...map.values()].sort((x,y)=>x.date.localeCompare(y.date)||x.label.localeCompare(y.label));
}
```

Canon remains the winning content identity when URL matches, but Meta source-local metric observations and `origins` are retained.

- [ ] **Step 5: Preserve social-feed compatibility**

Do not make `getSocialFeed()` depend on the new Meta store. Existing live social/fallback behavior remains available. The new Meta ingestion is an additional durable enrichment path, not a replacement for YouTube/TikTok/secondary-account behavior in this task.

- [ ] **Step 6: Verify projection invariants**

Check:
- repeated Meta sync does not increase unique projection count for the same canonical URL;
- Canon > Live precedence remains unchanged;
- source-local Meta metrics survive a Canon collision;
- no Meta result means existing projection totals/content still render;
- public projection contains no account IDs unless already public in canonical provenance fields, and never returns tokens.

- [ ] **Step 7: Checkpoint commit/export**

```bash
git commit -m "feat: enrich public projection from Meta snapshots"
```

---

### Task 7: Canonical CI Security Gate for the Exported AppDeploy Snapshot

**Files:**
- Create: `scripts/check-meta-ingestion.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `appdeploy-live/CURRENT.json` and exported source snapshot files.
- Produces: process exit 0 on compliant export, non-zero on security/architecture regression.

- [ ] **Step 1: Write the failing checker first**

Create `scripts/check-meta-ingestion.mjs` and initially assert that the CURRENT export contains these files:

```text
shared/social-ingest.ts
backend/meta/client.ts
backend/meta/capabilities.ts
backend/meta/facebook-adapter.ts
backend/meta/instagram-adapter.ts
backend/meta/store.ts
backend/meta/sync.ts
```

Before export, `node scripts/check-meta-ingestion.mjs` must fail with a clear missing-file message.

- [ ] **Step 2: Encode exact static security invariants**

The checker must fail if any `backend/meta/*.ts` exported file contains:

```text
access_token=
META_USER_ACCESS_TOKEN=<literal value>
META_APP_SECRET=<literal value>
console.log(config)
console.log(token)
JSON.stringify(rawGraph
```

It must require presence of:

```text
Authorization:`Bearer ${...}`
META_ALLOWED_PAGE_IDS
META_ALLOWED_INSTAGRAM_IDS
META_INGEST_ENABLED
owner-authorized-api
source-local
Promise.allSettled
```

Do not scan unrelated legacy source for old token-query patterns; scope these assertions to the new Meta subsystem and the projection integration anchors.

- [ ] **Step 3: Wire into canonical CI**

Add script:

```json
"check-meta-ingestion":"node scripts/check-meta-ingestion.mjs"
```

Update `check-all` so `npm run check-meta-ingestion` runs before `typecheck`/build in `ci:local`.

- [ ] **Step 4: Verify failing-before-export behavior**

Run:

```bash
npm run check-meta-ingestion
```

Expected before the final snapshot export: FAIL because CURRENT does not yet point to an export containing the subsystem. This is intentional and proves the gate is active.

- [ ] **Step 5: Commit the gate on the feature branch**

```bash
git add scripts/check-meta-ingestion.mjs package.json
git commit -m "test: gate Meta ingestion export integrity"
```

---

### Task 8: Capability Probe and Dry-Run Validation With Real Secret State

**Files:**
- No new public files.
- May update only server-side AppDeploy secrets through the platform secret manager; never via GitHub or chat.

**Interfaces:**
- Uses: `/api/meta/admin/status`, `/api/meta/admin/probe`, `/api/meta/admin/sync`.
- Produces: sanitized capability and dry-run evidence needed before enabling writes.

- [ ] **Step 1: Verify secret names without reading values into chat/logs**

Confirm whether these names exist in AppDeploy secret storage:

```text
META_USER_ACCESS_TOKEN
META_GRAPH_API_VERSION
META_APP_ID
META_APP_SECRET
META_ALLOWED_PAGE_IDS
META_ALLOWED_INSTAGRAM_IDS
META_INGEST_ENABLED
```

Do not print values.

- [ ] **Step 2: Run authenticated capability probe**

Expected outcome when owner credential is valid: list sanitized discovered Page IDs/names/tasks and linked Instagram IDs/usernames. If token is absent/expired/missing scope, stop at the typed state and do not enable writes.

- [ ] **Step 3: Configure allowlists from the sanitized discovery output**

Set `META_ALLOWED_PAGE_IDS` to only the intended 7YA/Igor Page IDs. Set `META_ALLOWED_INSTAGRAM_IDS` to only the linked professional account IDs intended for ingestion.

Do not infer IDs from names or handles.

- [ ] **Step 4: Run dry-run sync**

Request:

```json
{"dryRun":true,"maxPagesPerAccount":2}
```

Expected:
- `writePerformed:false`;
- normalized record counts > 0 when content exists;
- sample output contains only provider object IDs, canonical URLs, timestamps, media type and metric names/counts;
- no secrets/raw payloads.

- [ ] **Step 5: Revoke/disable simulation**

Temporarily exercise the credential-missing/invalid path without altering production public data. Expected: typed error state, no projection blanking, zero writes.

- [ ] **Step 6: Do not enable live writes yet unless all dry-run gates pass**

`META_INGEST_ENABLED` remains absent/false until Tasks 1–8 are green.

---

### Task 9: Draft Runtime QA and AppDeploy Version Verification

**Files:**
- Modify: `tests/tests.txt` only if QA exposes a missing explicit assertion.

**Interfaces:**
- Consumes: complete Meta subsystem in a non-production AppDeploy draft version.
- Produces: build/runtime/QA evidence; no production cutover.

- [ ] **Step 1: Run the full AppDeploy build for the draft version**

Expected: TypeScript/build success, no backend import errors, cron handler resolves, no frontend bundle depends on `backend/meta/*`.

- [ ] **Step 2: Execute Tests 10–15 plus existing regression tests**

Required existing regressions:
- Test 4: Public Projection failure fallback.
- Test 7: Corpus API failure fallback.
- Test 8: Impact Universe metric-class separation.

Required new Meta tests:
- Test 10: source-local + secret-free.
- Test 11: secure capability probe.
- Test 12: deterministic normalization.
- Test 13: repeated sync dedupe.
- Test 14: bounded/resumable feature-gated sync.
- Test 15: projection enrichment/failure isolation.

- [ ] **Step 3: Inspect runtime errors**

Expected: `0 frontend / 0 backend / 0 network` for ordinary public navigation with Meta disabled or unavailable. Meta admin probe failures may be reported as sanitized operational states, not unhandled runtime errors.

- [ ] **Step 4: Verify public payload leak boundary**

Inspect `/api/public-projection`, `/api/social-feed`, `/api/release`, `/api/agent-mesh`, `/api/meta/admin/status?dryRun=1`. Search serialized output for strings matching `access_token`, `Bearer `, app secret values, Page token patterns and raw token-debug fields. Expected: zero matches.

- [ ] **Step 5: Keep version unapplied**

Do not call `apply_app_version`. Record the draft version ID and QA result for the eventual explicit release chain.

---

### Task 10: Export Draft Source, Run Canonical CI, Then Wait for Explicit Deployment Command

**Files:**
- Create: `appdeploy-live/<draft-version>/...` exported changed source files.
- Modify: `appdeploy-live/CURRENT.json` only when the export is intended to become the canonical source pointer for the release candidate.
- Create: `appdeploy-live/<draft-version>/CUTOVER-MANIFEST.json`
- Create: `appdeploy-live/<draft-version>/RELEASE-RECEIPT.md`

**Interfaces:**
- Consumes: green draft AppDeploy version from Task 9.
- Produces: reconstructable GitHub source export and release-candidate evidence.

- [ ] **Step 1: Export exact changed AppDeploy files**

Export the new Meta subsystem plus modified `backend/index.ts`, `cron.json`, `tests/tests.txt`, `shared/social-ingest.ts` into `appdeploy-live/<draft-version>/` using the existing snapshot convention.

- [ ] **Step 2: Write cutover manifest**

Include at minimum:

```json
{
  "app_id":"697a008fddc309b142",
  "snapshot":"<draft-version>",
  "canonical_repository":"7guard-io/7ya.io",
  "feature":"meta-owner-authorized-ingestion",
  "production_applied":false,
  "meta_policy":"server-only-additive",
  "public_projection_required_baseline":true,
  "rollback_snapshot":"1787823326631"
}
```

The actual numeric draft version replaces `<draft-version>` during execution; do not invent one in advance.

- [ ] **Step 3: Write release receipt with exact evidence**

Record:
- capability state (`ready`, `missing-scope`, etc.) without secrets;
- allowlisted object counts, not access tokens;
- dry-run normalized record count;
- dedupe result;
- AppDeploy draft build/QA result;
- explicit `production_applied:false`;
- rollback snapshot `1787823326631`;
- CI result separately from AppDeploy runtime QA.

- [ ] **Step 4: Run the canonical Meta checker**

```bash
npm run check-meta-ingestion
```

Expected after export/CURRENT pointer update to the release candidate: PASS.

- [ ] **Step 5: Run the full canonical release gate**

```bash
npm run ci:local
```

Expected: PASS. If any step fails, fix until green before any push/deployment claim.

- [ ] **Step 6: Commit only the targeted release candidate files**

```bash
git add docs/superpowers/specs/2026-08-27-meta-ingestion-design.md \
  docs/superpowers/plans/2026-08-27-meta-ingestion.md \
  scripts/check-meta-ingestion.mjs package.json \
  appdeploy-live/CURRENT.json appdeploy-live/<draft-version>/
git commit -m "feat: add owner-authorized Meta ingestion"
```

- [ ] **Step 7: STOP before production chain unless the explicit phrase is present**

Do not push `main`, promote/apply AppDeploy, or claim live deployment until the user explicitly says:

```text
בצע את שרשרת הפריסה
```

When that phrase is given, follow the standing release sequence: `npm run ci:local` → fix until green → targeted `git add` → commit → push canonical branch/PR flow as currently required → monitor AppDeploy app `697a008fddc309b142` to terminal `READY` → verify live source/readback and visual/runtime QA → record release receipt.

---

## Plan Self-Review

### Spec coverage
- Server-only credentials and no browser token exposure: Tasks 2, 7, 9.
- Capability discovery + Page/linked IG allowlisting: Tasks 2, 8.
- Facebook adapter: Task 3.
- Instagram adapter + graceful insight permission handling: Task 3.
- Provider-neutral normalized record: Task 1.
- Durable content + append-only metric snapshots + tombstone-ready availability: Task 4.
- Bounded incremental pagination/checkpoints: Tasks 4–5.
- Probe/dry-run/live sync modes + hourly cadence: Task 5.
- Public projection enrichment + Canon precedence + fallback isolation: Task 6.
- Source/date/scope integrity and no synthetic reach: Tasks 1, 6, 9.
- Security/observability admin-only health: Tasks 2, 4–5.
- Rollout phases and production gate: Tasks 8–10.

### Placeholder scan
The only angle-bracket token in this plan is the intentionally execution-resolved AppDeploy draft version path `<draft-version>` in Task 10. It is not an implementation ambiguity: the version ID does not exist until AppDeploy creates the draft. All code interfaces, secret names, route names, DB collection names, gates and current rollback snapshot are fixed.

### Type consistency
- `SocialIngestRecord.metrics` always uses `SocialIngestMetric[]`.
- Metrics always use `asOf` internally and map to projection `date` only at the projection boundary.
- Provider key is always `meta:<providerObjectId>`.
- Capability public/admin report never contains the internal Page token.
- `runMetaSync()` owns writes/checkpoint advancement; adapters are fetch/normalize only.
- `/api/public-projection` reads persisted Meta records and never calls Meta live.
