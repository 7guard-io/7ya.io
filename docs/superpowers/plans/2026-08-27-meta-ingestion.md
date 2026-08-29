# 7YA Meta Ingestion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the active `7YA_graph` Meta Business Integration into a secure, additive Facebook Pages + linked Instagram Professional ingestion source for the 7YA corpus and Impact Broadcast.

**Architecture:** Meta stays server-side. A Graph client discovers owner-authorized Pages and linked Instagram Professional accounts, pure adapters normalize provider responses, AppDeploy DB stores durable content identities + append-only metric observations + cursors, and `/api/public-projection` reads those stored records as an additive `LIVE` source. Canon keeps precedence, and the site never calls Meta during rendering.

**Tech Stack:** TypeScript, AppDeploy SDK (`router`, `db`, `secrets`, auth guards), Meta Graph API, existing Vite/React frontend, AppDeploy `tests/tests.txt` QA, canonical GitHub `npm run ci:local` release gate.

**Spec:** `docs/superpowers/specs/2026-08-27-meta-ingestion-design.md`

## Global Constraints

- No user token, Page token, app secret, Authorization header, token-debug payload or token-bearing URL may reach browser code, public APIs, logs, GitHub, screenshots or fixtures.
- Secrets live only in AppDeploy secret storage.
- Resolve API version once from `META_GRAPH_API_VERSION`, falling back in one place only to `v24.0`.
- Ingest only IDs present in `META_ALLOWED_PAGE_IDS` and `META_ALLOWED_INSTAGRAM_IDS`.
- Every metric requires an ISO `asOf` timestamp and `scope:'source-local'`.
- Never create synthetic cross-platform reach or sum incompatible metric classes.
- Meta failure must not blank Canon, Public Register, Discovery, homepage, `/library/`, `/history/` or `/influence/`.
- Existing YouTube, TikTok, LinkedIn and secondary Instagram behavior remains intact.
- Meta v1 is read-only: no publishing, messages, comment moderation or ads permissions.
- `apply_app_version`, `main` push and production promotion remain blocked until the user explicitly says `בצע את שרשרת הפריסה`.
- `npm run ci:local` is the canonical release gate; AppDeploy runtime QA is separate evidence.

## File Map

### AppDeploy source
- Create `shared/social-ingest.ts` — normalized contract and validators.
- Create `backend/meta/client.ts` — secure Graph client + error classification.
- Create `backend/meta/capabilities.ts` — `/me/accounts`, allowlists, sanitized capability report.
- Create `backend/meta/facebook-adapter.ts` — Page post normalization.
- Create `backend/meta/instagram-adapter.ts` — Instagram media + bounded insights normalization.
- Create `backend/meta/store.ts` — records, metric snapshots, checkpoints, sanitized run state.
- Create `backend/meta/sync.ts` — probe/dry-run/sync orchestration.
- Modify `backend/index.ts` — imports, admin routes, cron export, projection merge.
- Modify `cron.json` — add hourly Meta sync.
- Modify `tests/tests.txt` — Meta security/dedupe/failure-isolation tests.

### Canonical GitHub
- Create `scripts/check-meta-ingestion.mjs` — exported-source security/integrity gate.
- Modify `package.json` — add checker to `check-all`.
- Create `appdeploy-live/META-CANDIDATE.json` during candidate export; do **not** move `appdeploy-live/CURRENT.json` away from production until the explicit production chain succeeds.

---

### Task 1: Provider-Neutral Contract

**Files:**
- Create: `shared/social-ingest.ts`
- Modify: `tests/tests.txt`

**Interfaces:**
- Produces `SocialIngestMetric`, `SocialIngestRecord`, `validateSocialIngestRecord`, `dedupeSocialMetrics`, `socialRecordKey`.
- Consumed by all Meta adapters/store/projection integration.

- [ ] **Step 1: Write the failing acceptance contract**

Append `Test 10 - Keep Meta ingestion source-local and secret-free` to `tests/tests.txt`:

```text
Expected: Meta-enriched public records expose only canonical public URLs, media metadata, owner-authorized provenance and dated source-local metrics. Public payloads contain no access token, Page token, app secret, Authorization header, token-debug payload or raw Graph body. Unlike metric classes are never summed into one reach figure.
```

Expected before implementation: FAIL because no Meta projection records exist.

- [ ] **Step 2: Implement the exact shared types**

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
  provenance:{source:'owner-authorized-api';fetchedAt:string;apiVersion:string};
  metrics:SocialIngestMetric[];
};
```

`validateSocialIngestRecord()` must reject missing IDs, non-HTTPS canonical URLs, non-ISO timestamps, negative/non-finite metrics and metric rows without `scope:'source-local'`; cap text at 5000 chars and return only declared fields.

`socialRecordKey(record)` returns `meta:${record.providerObjectId}`.

`dedupeSocialMetrics()` dedupes by `name|unit|asOf`, retaining the last observation for that exact key.

- [ ] **Step 3: Build the AppDeploy draft**

Run the standard draft build/typecheck. Expected: PASS with no TypeScript errors.

- [ ] **Step 4: Review secret boundary**

Search `shared/social-ingest.ts` for `token`, `secret`, `authorization`, `raw`. Expected: none are fields in exported record types.

- [ ] **Step 5: Checkpoint**

Commit/export message: `feat: define Meta social ingestion contract`.

---

### Task 2: Secure Graph Client + Capability Discovery

**Files:**
- Create: `backend/meta/client.ts`
- Create: `backend/meta/capabilities.ts`
- Modify: `backend/index.ts`
- Modify: `tests/tests.txt`

**Interfaces:**

```ts
export type MetaErrorCode=
  'AUTH_EXPIRED'|'MISSING_SCOPE'|'RATE_LIMITED'|'PROVIDER_TEMPORARY'|'OBJECT_REMOVED'|'SCHEMA_CHANGED';

export type MetaConfig={
  apiVersion:string;
  userAccessToken:string;
  appId?:string;
  appSecret?:string;
  allowedPageIds:Set<string>;
  allowedInstagramIds:Set<string>;
  enabled:boolean;
};

export class MetaProviderError extends Error{
  constructor(public code:MetaErrorCode,message:string,public status?:number){super(message)}
}
```

Produces `loadMetaConfig`, `metaFetchJson`, `sanitizeMetaError`, `discoverMetaCapabilities`, `resolveAllowedCapabilities`.

- [ ] **Step 1: Write failing capability QA**

Append `Test 11 - Probe Meta capabilities without exposing credentials`:

```text
Expected: credential absence produces a typed credential-required admin state; a successful probe returns only sanitized Page/Instagram IDs, names, task/scope labels and timestamps. No token or token-bearing URL appears in response or runtime logs.
```

- [ ] **Step 2: Load only these secret names**

```text
META_USER_ACCESS_TOKEN
META_GRAPH_API_VERSION
META_APP_ID
META_APP_SECRET
META_ALLOWED_PAGE_IDS
META_ALLOWED_INSTAGRAM_IDS
META_INGEST_ENABLED
```

`META_INGEST_ENABLED` is true only when its secret value lowercases to `true`.

- [ ] **Step 3: Implement bearer-only Graph requests**

```ts
const url=new URL(`https://graph.facebook.com/${config.apiVersion}/${path.replace(/^\//,'')}`);
for(const [key,value] of Object.entries(params||{}))url.searchParams.set(key,value);
const response=await fetch(url,{
  headers:{accept:'application/json',Authorization:`Bearer ${tokenOverride||config.userAccessToken}`},
  cache:'no-store',
  signal:AbortSignal.timeout(10_000)
});
```

Do not permit an `access_token` key in `params`; throw `MetaProviderError('SCHEMA_CHANGED',...)` if attempted.

Classify 401/invalid-token Graph errors as `AUTH_EXPIRED`, permission errors as `MISSING_SCOPE`, 429/app-usage limits as `RATE_LIMITED`, 5xx as `PROVIDER_TEMPORARY`, missing object as `OBJECT_REMOVED`, malformed expected shape as `SCHEMA_CHANGED`.

- [ ] **Step 4: Discover managed Pages and linked Instagram accounts**

Call:

```text
/me/accounts?fields=id,name,tasks,access_token,instagram_business_account{id,username}&limit=100
```

Define an internal-only resolved Page object containing `pageAccessToken`. Convert it immediately to a sanitized report before persistence/response:

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

- [ ] **Step 5: Add protected routes**

Add to `backend/index.ts`:

```text
GET  /api/meta/admin/status
POST /api/meta/admin/probe
```

Both require `requireAuth()` and `requireAdminEmailAllowlist(ADMIN_EMAILS)`. A pre-auth `GET /api/meta/admin/status?dryRun=1` may return only `{protected:true,route:'GET /api/meta/admin/status'}`.

- [ ] **Step 6: Verify**

No credentials → HTTP 200 sanitized state, site unchanged. Missing scope → sanitized `missing-scope`. Ready → only admin sees discovered IDs/names/tasks. Search logs for `Bearer`, `access_token`, token value fragments: zero matches.

- [ ] **Step 7: Checkpoint**

Commit/export message: `feat: add secure Meta capability discovery`.

---

### Task 3: Facebook + Instagram Adapters

**Files:**
- Create: `backend/meta/facebook-adapter.ts`
- Create: `backend/meta/instagram-adapter.ts`
- Modify: `tests/tests.txt`

**Interfaces:**

```ts
export type MetaBatch={records:SocialIngestRecord[];nextCursor:string|null;fetchedAt:string};
```

Produces `normalizeFacebookPost`, `fetchFacebookPageBatch`, `normalizeInstagramMedia`, `fetchInstagramMediaBatch`, `fetchInstagramInsights`.

- [ ] **Step 1: Write failing adapter test**

Append `Test 12 - Normalize Meta objects deterministically`:

```text
Expected: identical provider objects produce identical stable IDs/canonical URLs; invalid/unsupported rows are skipped; missing Instagram insight permission preserves the media record with base metrics only.
```

- [ ] **Step 2: Fetch Facebook posts**

For an allowlisted Page, use its in-memory Page token:

```text
/{pageId}/posts?fields=id,message,created_time,permalink_url,full_picture,attachments{media_type,type,url,media,target}&limit=50
```

When resuming, add `after=<checkpoint cursor>`.

Normalize exactly:

```ts
{
  id:`meta:facebook:${id}`,
  provider:'meta',
  platform:'Facebook',
  providerObjectId:id,
  accountObjectId:pageId,
  canonicalUrl:permalink_url,
  publishedAt:created_time,
  text:message?.slice(0,5000),
  mediaType:attachmentVideo?'video':full_picture?'image':'post',
  thumbnailUrl:httpsFullPictureOrUndefined,
  provenance:{source:'owner-authorized-api',fetchedAt,apiVersion},
  metrics:[]
}
```

Skip rows without HTTPS `permalink_url`.

- [ ] **Step 3: Fetch Instagram Professional media**

```text
/{igId}/media?fields=id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp,username,like_count,comments_count&limit=50
```

Media mapping: IMAGE→image, CAROUSEL_ALBUM→carousel, VIDEO or reel-like media product→video; unsupported rows are skipped.

Map finite `like_count` and `comments_count` to `likes` and `comments` metrics with `unit:'count'`, the fetch timestamp as `asOf`, and `scope:'source-local'`.

- [ ] **Step 4: Fetch a bounded optional insight set**

Use only the newest 8 normalized Instagram records per account in each sync. For each of those records, call the media insights endpoint one metric at a time with `Promise.allSettled` for this fixed list:

```ts
const META_MEDIA_INSIGHT_METRICS=['reach','views','total_interactions','saved','shares'] as const;
```

Request form:

```text
/{igMediaId}/insights?metric=reach
/{igMediaId}/insights?metric=views
/{igMediaId}/insights?metric=total_interactions
/{igMediaId}/insights?metric=saved
/{igMediaId}/insights?metric=shares
```

Persist only numeric returned values. Unsupported metric or missing `instagram_manage_insights` becomes an ignored rejected result plus sanitized error class; it never fails the media record.

- [ ] **Step 5: Verify**

Repeated raw object → same normalized ID. No Page token in output. `media_url`/`thumbnail_url` may be retained as transient presentation references, but `canonicalUrl` is always permalink. Insight failure leaves base record intact.

- [ ] **Step 6: Checkpoint**

Commit/export message: `feat: normalize Meta Facebook and Instagram media`.

---

### Task 4: Durable Store + Checkpoints

**Files:**
- Create: `backend/meta/store.ts`
- Modify: `tests/tests.txt`

**Interfaces:**

```ts
saveMetaCapabilityReport(report:MetaCapabilityReport):Promise<void>
upsertMetaRecords(records:SocialIngestRecord[]):Promise<{inserted:number;updated:number}>
appendMetaMetricSnapshots(records:SocialIngestRecord[]):Promise<number>
readMetaProjectionRecords(limit?:number):Promise<SocialIngestRecord[]>
readMetaCheckpoint(key:string):Promise<string|null>
writeMetaCheckpoint(key:string,cursor:string|null):Promise<void>
recordMetaSyncRun(run:MetaSyncRun):Promise<void>
readMetaHealth():Promise<MetaHealthSummary>
```

Collections:

```text
meta_capability_state
meta_ingest_records
meta_metric_snapshots
meta_sync_checkpoints
meta_sync_runs
```

- [ ] **Step 1: Write failing dedupe QA**

Append `Test 13 - Repeated Meta sync enriches instead of duplicating`:

```text
Expected: one durable content row per provider object; exact duplicate metric observations are ignored; newer observations append; cursors resume; existing public corpus stays intact.
```

- [ ] **Step 2: Upsert content by stable provider key**

Store:

```ts
type MetaStoredRecord={
  providerKey:string;
  record:SocialIngestRecord;
  firstSeenAt:number;
  lastSeenAt:number;
  availability:'active'|'unavailable';
};
```

`providerKey` is `meta:${providerObjectId}`. Preserve `firstSeenAt`; update mutable normalized fields and `lastSeenAt`.

- [ ] **Step 3: Append metric observations**

Store:

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

Exact dedupe key: `providerKey|metricName|unit|asOf`.

- [ ] **Step 4: Persist cursors only after successful batch persistence**

Checkpoint keys:

```text
facebook:<pageId>:posts
instagram:<igId>:media
```

Never advance a cursor if its content/metric write failed.

- [ ] **Step 5: Expose sanitized health only**

```ts
export type MetaHealthSummary={
  lastSuccessfulProbe:string|null;
  discoveredPages:number;
  allowlistedPages:number;
  linkedInstagramAccounts:number;
  lastSuccessfulFacebookSync:string|null;
  lastSuccessfulInstagramSync:string|null;
  recordsInserted:number;
  recordsUpdated:number;
  mostRecentErrorClass:string|null;
};
```

- [ ] **Step 6: Verify DB failure isolation**

A Meta collection read/write failure must fail only Meta sync/store operations. `/api/public-projection` must still return Canon/Discovery/social fallback.

- [ ] **Step 7: Checkpoint**

Commit/export message: `feat: persist Meta content metrics and checkpoints`.

---

### Task 5: Probe, Dry-Run, Incremental Sync + Cron

**Files:**
- Create: `backend/meta/sync.ts`
- Modify: `backend/index.ts`
- Modify: `cron.json`
- Modify: `tests/tests.txt`

**Interfaces:**

```ts
runMetaProbe(options:{persist:boolean}):Promise<MetaProbeResult>
runMetaSync(options:{dryRun:boolean;maxPagesPerAccount:number}):Promise<MetaSyncResult>
metaSyncHourly():Promise<{statusCode:number;body?:string}>
```

- [ ] **Step 1: Write failing operational QA**

Append `Test 14 - Meta sync is gated, bounded and resumable`:

```text
Expected: feature flag off means zero writes; dry-run fetches/normalizes with zero writes; live sync is admin/cron only; page count is bounded; successful cursors resume from previous position.
```

- [ ] **Step 2: Implement probe**

`runMetaProbe({persist:false})` discovers and sanitizes only. `persist:true` stores only sanitized capability state.

- [ ] **Step 3: Implement sync algorithm**

```text
load config
→ credential absent: credential-required
→ discover capabilities
→ apply both allowlists
→ no allowed object: no-allowlisted-objects
→ fetch each allowed Page, max N cursor pages
→ fetch each allowed linked IG account, max N cursor pages
→ normalize + bounded insights
→ dryRun: return counts + public-safe sample IDs/URLs, zero writes
→ enabled false: return disabled, zero writes
→ upsert records
→ append metrics
→ advance successful cursors
→ record sanitized run summary
```

Default `maxPagesPerAccount=2`; hard cap `10`.

- [ ] **Step 4: Add protected routes**

```text
POST /api/meta/admin/sync
GET  /api/meta/admin/health
```

Both require admin auth. Sync body:

```json
{"dryRun":true,"maxPagesPerAccount":2}
```

- [ ] **Step 5: Add hourly cron**

Export:

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

Retain agent mesh and add this exact cron entry:

```json
{"name":"meta-sync-hourly","cron":"37 * * * *","handler":"metaSyncHourly","timezone":"Asia/Jerusalem","payload":{"mode":"incremental"}}
```

- [ ] **Step 6: Verify modes**

Dry-run ⇒ `writePerformed:false`. Flag off ⇒ `status:'disabled'`. Flag on + valid allowlists ⇒ bounded writes and cursor progress. Provider failure ⇒ sanitized status and HTTP 200 cron return.

- [ ] **Step 7: Checkpoint**

Commit/export message: `feat: orchestrate bounded Meta sync`.

---

### Task 6: Public Projection Enrichment + Failure Isolation

**Files:**
- Modify: `backend/index.ts`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes `readMetaProjectionRecords(5000)`.
- Keeps the current `ProjectionLayer` vocabulary; Meta records use `LIVE` + `OWNER-AUTHORIZED-API` trust.

- [ ] **Step 1: Write failing projection test**

Append `Test 15 - Meta enriches Public Projection but can never blank it`:

```text
Expected: persisted Meta objects can appear in /api/public-projection; matching Canon URLs keep Canon identity; Meta metrics remain source-local; simulated Meta auth/store failure removes only Meta enrichment and never empties homepage/library/history/influence.
```

- [ ] **Step 2: Read persisted Meta alongside current settled sources**

```ts
const [canonResult,discoveryResult,socialResult,metaResult]=await Promise.allSettled([
  readCanonicalCorpus({limit:5000}),
  buildDiscoveryLibrary(),
  getSocialFeed(),
  readMetaProjectionRecords(5000)
]);
```

Never call Graph from `publicProjectionPayload()`.

- [ ] **Step 3: Map Meta to ProjectionItem**

Use:

```text
layer: LIVE
trust: OWNER-AUTHORIZED-API
sourceKind: owner-authorized-api
origins: meta-owner-authorized
```

Extend projection metric shape additively with `scope?:'source-local'` and map `asOf → date` only at this boundary.

- [ ] **Step 4: Merge metrics instead of winner-takes-nonempty**

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

Canon remains content winner by current layer ranking; merged `origins` and source-local metrics survive the collision.

- [ ] **Step 5: Verify regressions**

Run existing Test 4, Test 7 and Test 8 plus Test 15. Expected: public fallbacks remain non-empty; Impact Universe metric classes remain separate; repeated Meta sync does not increase unique URL count.

- [ ] **Step 6: Checkpoint**

Commit/export message: `feat: enrich public projection from Meta snapshots`.

---

### Task 7: Canonical CI Gate for Meta Export

**Files:**
- Create: `scripts/check-meta-ingestion.mjs`
- Modify: `package.json`

**Interfaces:**
- Reads `appdeploy-live/META-CANDIDATE.json`, then scans only the candidate export's Meta files and projection integration anchors.

- [ ] **Step 1: Write checker before candidate export**

`META-CANDIDATE.json` is intentionally absent at first. `node scripts/check-meta-ingestion.mjs` must fail with `Meta candidate pointer missing`.

- [ ] **Step 2: Implement exact checker behavior**

Candidate pointer shape:

```json
{"snapshot":"1787999999999","production_applied":false}
```

The number above is a parser example only and is never committed as the actual candidate ID; the checker reads the real snapshot value from the pointer created by AppDeploy execution.

The checker requires these paths under `appdeploy-live/${snapshot}/`:

```text
shared/social-ingest.ts
backend/meta/client.ts
backend/meta/capabilities.ts
backend/meta/facebook-adapter.ts
backend/meta/instagram-adapter.ts
backend/meta/store.ts
backend/meta/sync.ts
backend/index.ts
cron.json
tests/tests.txt
```

Fail if any `backend/meta/*.ts` contains:

```text
access_token=
console.log(config)
console.log(token)
JSON.stringify(rawGraph
```

Require Meta subsystem/projection source to contain:

```text
META_ALLOWED_PAGE_IDS
META_ALLOWED_INSTAGRAM_IDS
META_INGEST_ENABLED
owner-authorized-api
source-local
Promise.allSettled
Authorization
Bearer
```

- [ ] **Step 3: Wire checker into CI**

Add:

```json
"check-meta-ingestion":"node scripts/check-meta-ingestion.mjs"
```

and include `npm run check-meta-ingestion` in `check-all`.

- [ ] **Step 4: Verify pre-export failure**

Run `npm run check-meta-ingestion`. Expected: FAIL only because candidate pointer/export is not yet present.

- [ ] **Step 5: Checkpoint**

Commit message: `test: gate Meta ingestion export integrity`.

---

### Task 8: Real Capability Probe, Dry-Run Candidate, QA, Export and Release Stop

**Files:**
- AppDeploy secrets: names only; never values in source/chat.
- Create candidate export under the actual draft version directory.
- Create `appdeploy-live/META-CANDIDATE.json`.
- Create candidate `CUTOVER-MANIFEST.json` and `RELEASE-RECEIPT.md`.
- Do not change `appdeploy-live/CURRENT.json` before explicit production deployment succeeds.

**Interfaces:**
- Uses `/api/meta/admin/status`, `/api/meta/admin/probe`, `/api/meta/admin/sync`, `/api/meta/admin/health`.

- [ ] **Step 1: Check secret-name presence only**

Check for the seven Meta secret names from Task 2 without printing values.

- [ ] **Step 2: Run authenticated probe**

Valid credential ⇒ sanitized Page IDs/names/tasks + linked Instagram IDs/usernames. Missing/expired/scope failure ⇒ stop with typed state; do not enable writes.

- [ ] **Step 3: Configure exact allowlists from probe output**

Set `META_ALLOWED_PAGE_IDS` and `META_ALLOWED_INSTAGRAM_IDS` from discovered IDs only. Do not infer IDs from handles/names.

- [ ] **Step 4: Run dry-run sync**

```json
{"dryRun":true,"maxPagesPerAccount":2}
```

Expected: `writePerformed:false`, normalized counts, public-safe sample IDs/URLs only, zero raw/token material.

- [ ] **Step 5: Enable writes only after dry-run gates pass**

Set `META_INGEST_ENABLED=true`, execute one bounded admin sync, then immediately repeat the same bounded sync. Expected: durable record count does not duplicate; only new metric observations append.

- [ ] **Step 6: Run draft AppDeploy QA**

Run Tests 10–15 and regressions 4, 7, 8. Public navigation with Meta unavailable must report `0 frontend / 0 backend / 0 network` ordinary-route errors; Meta provider errors are sanitized operational states.

- [ ] **Step 7: Export the actual draft version without applying it**

Set shell/runtime variable from the AppDeploy-created version ID:

```bash
APPDEPLOY_DRAFT_VERSION="$(printf '%s' "$APPDEPLOY_DRAFT_VERSION")"
test -n "$APPDEPLOY_DRAFT_VERSION"
```

Export changed files to `appdeploy-live/${APPDEPLOY_DRAFT_VERSION}/` and create:

```json
{
  "app_id":"697a008fddc309b142",
  "snapshot_from_runtime_variable":"APPDEPLOY_DRAFT_VERSION",
  "canonical_repository":"7guard-io/7ya.io",
  "feature":"meta-owner-authorized-ingestion",
  "production_applied":false,
  "meta_policy":"server-only-additive",
  "public_projection_required_baseline":true,
  "rollback_snapshot":"1787823326631"
}
```

The manifest writer replaces `snapshot_from_runtime_variable` with the actual numeric version value before committing; no invented version ID is used.

Create `appdeploy-live/META-CANDIDATE.json` with the actual numeric snapshot and `production_applied:false`.

- [ ] **Step 8: Run canonical candidate gates**

```bash
npm run check-meta-ingestion
npm run ci:local
```

Both must PASS before production is considered.

- [ ] **Step 9: Commit targeted candidate evidence**

Commit the spec, plan, checker, package change, candidate pointer and actual candidate export. Do not update `CURRENT.json` and do not apply the AppDeploy version.

- [ ] **Step 10: STOP at the explicit release boundary**

Until the exact user command `בצע את שרשרת הפריסה` appears: no production apply, no production claim, no `CURRENT.json` promotion.

When that command appears, execute the standing release sequence: rerun `npm run ci:local` → fix until green → targeted git staging/commit/branch flow → apply/promote the already-green AppDeploy candidate → monitor app `697a008fddc309b142` to `READY` → verify live source/readback/runtime/visual QA → then update/export `appdeploy-live/CURRENT.json` to the actually applied version and write the final release receipt. Rollback source remains production snapshot `1787823326631` until the new release is verified.

---

## Self-Review

**Spec coverage:** Tasks 1–2 cover secret isolation and capability discovery; Task 3 covers Facebook/Instagram normalization and optional insights; Task 4 covers durable identity, append-only metrics and cursors; Task 5 covers probe/dry-run/live sync and cron; Task 6 covers projection/fallback behavior; Task 7 adds canonical CI enforcement; Task 8 covers real authorization, candidate QA/export and the explicit production gate.

**Placeholder scan:** No unresolved implementation placeholder is used. Runtime-generated AppDeploy version IDs are carried through the named variable `APPDEPLOY_DRAFT_VERSION`; the plan never invents a release ID. The JSON number in Task 7 is explicitly parser-example data and is not a candidate value.

**Type consistency:** `SocialIngestRecord.metrics` is always `SocialIngestMetric[]`; internal metric time is `asOf`, public projection time is `date`; provider key is always `meta:<providerObjectId>`; Page tokens exist only in internal request-scope capability objects; adapters fetch/normalize only; `runMetaSync` owns persistence/checkpoints; `/api/public-projection` reads stored Meta data and never calls Graph live.
