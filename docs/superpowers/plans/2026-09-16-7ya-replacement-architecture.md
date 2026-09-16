# 7YA Replacement Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the live 7YA AppDeploy application into a single repository-traceable, evidence-first architecture with strict NVIDIA isolation, one Core model, authentic-media resolution, a source-bound Scene Engine, and a cinematic public experience that remains useful when AI or social providers fail.

**Architecture:** Preserve the currently working AppDeploy application, first reconciling its applied source snapshot into Git under `apps/7ya-live/`. Then introduce narrow modules around the current Canon, media, NVIDIA and scene behavior instead of rewriting them. Each release keeps legacy routes functioning until the replacement path passes unit, integration, build, visual, source-alignment and rollback gates.

**Tech Stack:** React 19, TypeScript, Vite 6, AppDeploy frontend+backend runtime, `@appdeploy/sdk`, Node.js verification scripts, Vitest for new unit/integration coverage, NVIDIA hosted NIM (`integrate.api.nvidia.com`) and NVCF, current Canon/Public Internet Graph/Discovery/Media services.

**Spec:** `docs/superpowers/specs/2026-09-16-7ya-replacement-architecture-design.md`

## Global Constraints

- `7guard-io/7ya.io` is the canonical source repository.
- AppDeploy app `697a008fddc309b142` remains the production runtime during migration.
- The initial source baseline is the applied AppDeploy source version `1789293197999`; no behavioral refactor starts until this source is represented in Git.
- Existing root/static-site content remains untouched until the AppDeploy application has its own reproducible build and release path under `apps/7ya-live/`.
- Truth flow is `SOURCE -> NORMALIZE -> DISCOVERY -> VERIFY -> CANON`.
- NVIDIA may classify, transcribe, embed, rank and compose, but may not promote model output into verified Canon by itself.
- `NVIDIA_NIM_API_KEY` is reserved for hosted NIM/integrate endpoints; `NVCF_API_KEY` is reserved for NVCF. `NVIDIA_API_KEY` must not be silently interpreted as either after R0.
- The public biography must remain functional with NVIDIA unavailable.
- Personal media resolution order is Canon personal media -> owner-approved personal media -> verified public personal media -> source-bound preview -> neutral treatment.
- Generic or synthetic imagery must not substitute for missing documentary personal media.
- Public top-level navigation converges to `IGOR · LIFE · WORK · MEDIA · STARTON · ASK`.
- Operational/admin surfaces remain behind existing auth/admin boundaries.
- No automatic external social publishing is introduced.
- No synthetic aggregate reach claims are introduced.
- Existing public URLs, Canon source links and the distinction between Canon and Discovery are regression-protected.
- Mobile acceptance is required before a production-facing release is considered complete.
- Every production release must identify the Git commit that produced it and keep the immediately previous AppDeploy version available for rollback.

---

## File Structure After Migration

The migration deliberately does not replace the repository root in one move. The live AppDeploy application becomes a self-contained workspace:

```text
apps/7ya-live/
  package.json
  tsconfig.json
  vite.config.*
  src/
    App.tsx
    GlobalNav.tsx
    StoryCompanion.tsx
    scenes/
      HomepageSceneJourney.tsx
      SceneRenderer.tsx
  backend/
    index.ts
    corpus-store.ts
    life-scenes.ts
    nvcf.ts
    intelligence/
      nvidia-types.ts
      nvidia-credentials.ts
      nim-client.ts
      nvcf-client.ts
      nvidia-gateway.ts
    core/
      canonical-adapter.ts
      entity-adapter.ts
      core-service.ts
    media/
      media-types.ts
      media-id.ts
      media-service.ts
      personal-media-policy.ts
    story/
      scene-types.ts
      scene-engine.ts
  shared/
    canonical-corpus.ts
    canonical-entities.ts
    core-types.ts
    life-scenes.ts
    visual-locks.ts
    ...existing shared modules
  scripts/
    ...existing build verification scripts
    check-release-provenance.mjs
    check-personal-media-policy.mjs
  test/
    unit/
    integration/
  tests/tests.txt
  .source/
    appdeploy-baseline.json
    source-manifest.json
```

Responsibilities are fixed as follows:

- `shared/core-types.ts`: stable public Core envelope only; no provider/runtime code.
- `backend/core/*`: adapters from existing Canon/entities into Core records; no UI concerns.
- `backend/intelligence/*`: all NVIDIA credential selection, requests, health classification and fallback boundaries.
- `backend/media/*`: stable asset identity and authentic-media resolution; AI metadata is advisory only.
- `backend/story/*`: deterministic source-bound composition; no direct provider secrets or social API calls.
- `src/scenes/*`: presentation only; renders scene contracts and does not decide biography truth.
- `backend/index.ts`: route wiring/orchestration only after the touched responsibilities are extracted.

---

### Task 1: Reconcile the Applied AppDeploy Source into Git

**Files:**
- Create: `apps/7ya-live/**` from AppDeploy applied version `1789293197999`
- Create: `apps/7ya-live/.source/appdeploy-baseline.json`
- Create: `apps/7ya-live/.source/source-manifest.json`
- Create: `apps/7ya-live/README.md`
- Modify: `.gitignore`
- Modify: `README.md`

**Interfaces:**
- Consumes: AppDeploy app ID `697a008fddc309b142`, version `1789293197999`.
- Produces: a complete, reviewable Git baseline from which every later task branches; `source-manifest.json` maps each exported relative path to a SHA-256 digest.

- [ ] **Step 1: Inventory the exact applied source**

Use the AppDeploy source snapshot, not the older root/static repository tree. Enumerate every file in version `1789293197999` with the source-glob API, following pagination until no continuation token remains. Record the sorted relative paths before writing any Git file.

Expected minimum roots in the inventory: `backend/`, `shared/`, `src/`, `scripts/`, `tests/`, `package.json`, `tsconfig.json` and the Vite entry/config files returned by the snapshot.

- [ ] **Step 2: Export source bytes without changing behavior**

Read each UTF-8 source file from the same AppDeploy version and write it under `apps/7ya-live/<relative-path>`. Do not reformat, rename modules, change release strings or modify imports in this step.

For any binary source asset returned by the snapshot, preserve the exact bytes through a binary-safe path rather than inlining or converting them.

- [ ] **Step 3: Write the baseline metadata**

Create `apps/7ya-live/.source/appdeploy-baseline.json` with this exact shape:

```json
{
  "appId": "697a008fddc309b142",
  "appDeployVersion": "1789293197999",
  "capturedOn": "2026-09-16",
  "canonicalRepository": "7guard-io/7ya.io",
  "sourceRoot": "apps/7ya-live",
  "behaviorChange": false
}
```

Create `source-manifest.json` as a sorted array of objects:

```json
[
  {"path":"backend/index.ts","sha256":"<computed digest>"},
  {"path":"package.json","sha256":"<computed digest>"}
]
```

The actual manifest must contain every exported file and real computed digests; angle-bracket text above is only the schema example and must not appear in the committed manifest.

- [ ] **Step 4: Document workspace ownership**

Create `apps/7ya-live/README.md` stating that this directory is the canonical source of the live AppDeploy application, that the repository root contains legacy/static/history material, and that production changes must be reconciled here before release.

Update root `README.md` with a short “Canonical live application” section linking to `apps/7ya-live/` without deleting the existing historical/static documentation.

- [ ] **Step 5: Protect generated output**

Add these patterns to `.gitignore` if not already present:

```gitignore
apps/7ya-live/node_modules/
apps/7ya-live/dist/
apps/7ya-live/.vite/
apps/7ya-live/coverage/
```

- [ ] **Step 6: Verify the baseline build before any refactor**

Run from `apps/7ya-live/`:

```bash
npm install
npm run build
```

Expected: all existing source-index, legacy-recovery, first-paint, home-composition and release-coherence checks complete before Vite finishes successfully.

If the imported snapshot cannot build unchanged, stop this task and resolve only the export/build-parity defect; do not start Task 2.

- [ ] **Step 7: Commit the source baseline**

```bash
git add apps/7ya-live .gitignore README.md
git commit -m "chore: reconcile live AppDeploy source baseline"
```

Record the resulting commit SHA in the task notes; this becomes the migration base commit.

---

### Task 2: Add a Test Harness and Source-Alignment Gate

**Files:**
- Modify: `apps/7ya-live/package.json`
- Create: `apps/7ya-live/vitest.config.ts`
- Create: `apps/7ya-live/test/unit/baseline.test.ts`
- Create: `apps/7ya-live/scripts/check-release-provenance.mjs`
- Modify: `apps/7ya-live/scripts/check-release-coherence.mjs`
- Modify: `apps/7ya-live/backend/index.ts`

**Interfaces:**
- Consumes: the unchanged source baseline from Task 1.
- Produces: `npm test`, `npm run test:unit`, and a build-time provenance check; `/api/release` exposes `github_provenance_commit` from a build-injected value rather than a stale hard-coded commit.

- [ ] **Step 1: Add the failing baseline unit test**

Create `test/unit/baseline.test.ts`:

```ts
import {describe,expect,it} from 'vitest';
import baseline from '../../.source/appdeploy-baseline.json';

describe('source baseline',()=>{
  it('pins the live AppDeploy application and version',()=>{
    expect(baseline.appId).toBe('697a008fddc309b142');
    expect(baseline.appDeployVersion).toBe('1789293197999');
    expect(baseline.behaviorChange).toBe(false);
  });
});
```

- [ ] **Step 2: Run the test and verify the expected harness failure**

Run:

```bash
npm test
```

Expected before package changes: failure because no `test` script/Vitest harness exists in the live application package.

- [ ] **Step 3: Add Vitest and scripts**

Install Vitest as a development dependency and update `package.json` scripts to include:

```json
{
  "test": "vitest run",
  "test:unit": "vitest run test/unit",
  "test:integration": "vitest run test/integration"
}
```

Create `vitest.config.ts`:

```ts
import {defineConfig} from 'vitest/config';

export default defineConfig({
  test:{
    environment:'node',
    include:['test/**/*.test.ts'],
    clearMocks:true
  }
});
```

- [ ] **Step 4: Run the unit test and build**

```bash
npm test
npm run build
```

Expected: baseline test passes and the existing production build checks remain green.

- [ ] **Step 5: Add release provenance validation**

Create `scripts/check-release-provenance.mjs` to fail unless `GITHUB_PROVENANCE_COMMIT` is a 40-character lowercase hexadecimal SHA when `RELEASE_CHANNEL=production`; allow local development when the channel is absent.

Core assertion:

```js
const sha=process.env.GITHUB_PROVENANCE_COMMIT||'';
const production=process.env.RELEASE_CHANNEL==='production';
if(production&&!/^[a-f0-9]{40}$/.test(sha)){
  console.error('production release requires GITHUB_PROVENANCE_COMMIT');
  process.exit(1);
}
```

Add this script before `vite build` in the production build chain.

- [ ] **Step 6: Replace the hard-coded provenance response**

In `backend/index.ts`, derive release provenance from the build environment:

```ts
const githubProvenanceCommit=process.env.GITHUB_PROVENANCE_COMMIT||'unbound-local';
```

Return that field from `/api/release`. Keep the current source-alignment warning until the first Git-backed deployment actually passes.

- [ ] **Step 7: Commit the harness and provenance gate**

```bash
git add apps/7ya-live
git commit -m "test: add live app harness and release provenance gate"
```

---

### Task 3: Make NVIDIA Credential Selection Unambiguous

**Files:**
- Create: `apps/7ya-live/backend/intelligence/nvidia-types.ts`
- Create: `apps/7ya-live/backend/intelligence/nvidia-credentials.ts`
- Create: `apps/7ya-live/test/unit/nvidia-credentials.test.ts`
- Modify: `apps/7ya-live/backend/index.ts`

**Interfaces:**
- Consumes: secret-name set from AppDeploy `secrets.listSecretNames()`.
- Produces: `selectNvidiaCredentialNames(names)` returning `{nimName,nvcfName,legacyPresent}`; it never maps `NVIDIA_API_KEY` to NIM or NVCF implicitly.

- [ ] **Step 1: Write the failing credential-policy tests**

Create `test/unit/nvidia-credentials.test.ts`:

```ts
import {describe,expect,it} from 'vitest';
import {selectNvidiaCredentialNames} from '../../backend/intelligence/nvidia-credentials';

describe('selectNvidiaCredentialNames',()=>{
  it('keeps hosted NIM and NVCF credentials separate',()=>{
    expect(selectNvidiaCredentialNames(new Set(['NVIDIA_NIM_API_KEY','NVCF_API_KEY']))).toEqual({
      nimName:'NVIDIA_NIM_API_KEY',
      nvcfName:'NVCF_API_KEY',
      legacyPresent:false
    });
  });

  it('does not reinterpret the legacy NVIDIA_API_KEY',()=>{
    expect(selectNvidiaCredentialNames(new Set(['NVIDIA_API_KEY']))).toEqual({
      nimName:null,
      nvcfName:null,
      legacyPresent:true
    });
  });
});
```

- [ ] **Step 2: Run the test and confirm it fails**

```bash
npm run test:unit -- nvidia-credentials
```

Expected: module-not-found failure.

- [ ] **Step 3: Implement the pure selector**

Create `backend/intelligence/nvidia-credentials.ts`:

```ts
export type NvidiaCredentialNames={
  nimName:'NVIDIA_NIM_API_KEY'|null;
  nvcfName:'NVCF_API_KEY'|null;
  legacyPresent:boolean;
};

export function selectNvidiaCredentialNames(names:Set<string>):NvidiaCredentialNames{
  return{
    nimName:names.has('NVIDIA_NIM_API_KEY')?'NVIDIA_NIM_API_KEY':null,
    nvcfName:names.has('NVCF_API_KEY')?'NVCF_API_KEY':null,
    legacyPresent:names.has('NVIDIA_API_KEY')
  };
}
```

Add provider/failure result types to `nvidia-types.ts`; no secret values belong in these public-safe types.

- [ ] **Step 4: Run tests**

```bash
npm run test:unit -- nvidia-credentials
```

Expected: both tests pass.

- [ ] **Step 5: Integrate only the name-selection boundary**

Replace the current `nvcfConfigured`, `nimConfigured`, `readNvcfCredential` and `readNimKey` name-selection logic in `backend/index.ts` so the old `NVIDIA_API_KEY` is reported as `legacyPresent` but is not automatically used by either provider.

Do not delete `NVIDIA_API_KEY` from AppDeploy in this task. Until the user provides correctly scoped replacement credentials, NVIDIA-enhanced paths must report `credential-required`/`legacy-unmapped` and the public site must continue through its non-NVIDIA path.

- [ ] **Step 6: Verify no secret-value exposure**

Run:

```bash
npm test
npm run build
```

Also exercise `/api/companion/status` in a non-secret test path and confirm it returns names/status only, never secret values.

- [ ] **Step 7: Commit**

```bash
git add apps/7ya-live/backend/intelligence apps/7ya-live/backend/index.ts apps/7ya-live/test
git commit -m "refactor: isolate NVIDIA credential policy"
```

---

### Task 4: Introduce the NVIDIA Gateway and Failure Taxonomy

**Files:**
- Create: `apps/7ya-live/backend/intelligence/nim-client.ts`
- Create: `apps/7ya-live/backend/intelligence/nvcf-client.ts`
- Create: `apps/7ya-live/backend/intelligence/nvidia-gateway.ts`
- Create: `apps/7ya-live/test/unit/nvidia-gateway.test.ts`
- Modify: `apps/7ya-live/backend/nvcf.ts`

**Interfaces:**
- Consumes: explicit NIM/NVCF credentials and injected `fetch` implementation.
- Produces: `NvidiaGateway` with `health`, `generate`, `vision`, `embed`, `rerank`; failures normalize to `auth`, `endpoint`, `rate-limit`, `timeout`, `upstream`, `not-configured`.

- [ ] **Step 1: Write failing classification tests**

The unit test must use a fake `fetch` and assert at least these status mappings:

```ts
expect(classifyNvidiaHttpStatus(401)).toBe('auth');
expect(classifyNvidiaHttpStatus(403)).toBe('auth');
expect(classifyNvidiaHttpStatus(404)).toBe('endpoint');
expect(classifyNvidiaHttpStatus(410)).toBe('endpoint');
expect(classifyNvidiaHttpStatus(429)).toBe('rate-limit');
expect(classifyNvidiaHttpStatus(503)).toBe('upstream');
```

Add a test proving an unconfigured gateway returns a health result without making a network call.

- [ ] **Step 2: Run and confirm failure**

```bash
npm run test:unit -- nvidia-gateway
```

Expected: missing gateway/client modules.

- [ ] **Step 3: Implement provider-neutral types**

In `nvidia-types.ts`, define:

```ts
export type NvidiaProvider='nim'|'nvcf';
export type NvidiaFailureClass='auth'|'endpoint'|'rate-limit'|'timeout'|'upstream'|'not-configured';
export type NvidiaHealth={
  state:'ready'|'degraded'|'not-configured';
  provider:NvidiaProvider|null;
  failureClass:NvidiaFailureClass|null;
  model:string|null;
};
```

Keep result payloads free of credential strings.

- [ ] **Step 4: Implement hosted NIM client**

`nim-client.ts` owns only `integrate.api.nvidia.com` calls. Its model-list health probe uses `GET /v1/models`; generation uses `POST /v1/chat/completions`. It accepts the key and fetch implementation as constructor/function inputs so tests never read AppDeploy secrets.

- [ ] **Step 5: Wrap NVCF behind the same boundary**

`nvcf-client.ts` calls the existing `discoverNvcf`/`invokeNvcf` exports from `backend/nvcf.ts`. It must not fall through to hosted NIM by itself.

- [ ] **Step 6: Implement gateway provider selection**

Gateway selection policy is deterministic:

```text
explicit configured NVCF target and key -> NVCF
else explicit hosted NIM key -> NIM
else -> not-configured
```

No provider is selected from `NVIDIA_API_KEY`.

- [ ] **Step 7: Run unit tests and build**

```bash
npm run test:unit -- nvidia-gateway
npm run build
```

Expected: status/fallback tests pass and the existing application still builds.

- [ ] **Step 8: Commit**

```bash
git add apps/7ya-live/backend/intelligence apps/7ya-live/backend/nvcf.ts apps/7ya-live/test
git commit -m "feat: add provider-neutral NVIDIA gateway"
```

---

### Task 5: Move Bro Chat/Canary NVIDIA Calls Through the Gateway

**Files:**
- Modify: `apps/7ya-live/backend/index.ts`
- Create: `apps/7ya-live/backend/intelligence/nvidia-agent.ts`
- Create: `apps/7ya-live/test/integration/nvidia-fallback.test.ts`
- Modify: `apps/7ya-live/cron.json`

**Interfaces:**
- Consumes: `NvidiaGateway` from Task 4 and existing evidence retrieval tools.
- Produces: one NVIDIA agent path with the current grounding policy; deterministic/local/AppDeploy behavior remains available when NVIDIA is unavailable.

- [ ] **Step 1: Write the failing fallback test**

Create an integration test that injects a gateway health result of `not-configured` and verifies provider orchestration returns the non-NVIDIA answer path without throwing. Add a second case with `failureClass:'auth'` and assert the same public-safe fallback behavior.

The test must also assert that the returned status object contains no property named `key`, `token`, `authorization`, or `secret` at any depth.

- [ ] **Step 2: Run and confirm failure**

```bash
npm run test:integration -- nvidia-fallback
```

Expected: orchestration seam does not yet exist.

- [ ] **Step 3: Extract the current NVIDIA agent loop**

Move the logic currently contained in `runNvidiaAgent`/`nvidiaRequest` out of `backend/index.ts` into `backend/intelligence/nvidia-agent.ts`. Preserve:

- Canon-authoritative / Discovery-labeled grounding rules.
- existing public evidence tool definitions.
- maximum bounded turns.
- no hidden reasoning output.
- fallback when factual retrieval was required but not performed.

The extracted agent receives a gateway and tool executor as dependencies; it does not read secrets itself.

- [ ] **Step 4: Replace status/canary routing**

Wire `/api/companion/status`, the NVIDIA canary handler and agent-mesh provider status through the gateway health result. Distinguish `legacy-unmapped`, `not-configured`, `auth`, `endpoint`, `rate-limit`, `timeout` and `upstream` in internal/admin diagnostics while keeping the public response concise.

- [ ] **Step 5: Keep broken canaries disabled until credential validation succeeds**

Do not re-enable the currently disabled NVIDIA/NVCF cron probes merely because code changed. Add one active cron definition only after a manual/administrative health probe returns `ready` with an explicitly scoped credential.

At rollout time the user must securely bind either/both of:

```text
NVIDIA_NIM_API_KEY
NVCF_API_KEY
```

No secret is copied from the old `NVIDIA_API_KEY` because its value cannot be safely read back for migration.

- [ ] **Step 6: Run fallback tests and build**

```bash
npm run test:integration -- nvidia-fallback
npm test
npm run build
```

Expected: public paths remain functional when NVIDIA is absent or rejects auth.

- [ ] **Step 7: Commit**

```bash
git add apps/7ya-live/backend apps/7ya-live/test apps/7ya-live/cron.json
git commit -m "refactor: route NVIDIA agent through gateway"
```

---

### Task 6: Add the Core Envelope and Non-Destructive Canon Adapters

**Files:**
- Create: `apps/7ya-live/shared/core-types.ts`
- Create: `apps/7ya-live/backend/core/canonical-adapter.ts`
- Create: `apps/7ya-live/backend/core/entity-adapter.ts`
- Create: `apps/7ya-live/backend/core/core-service.ts`
- Create: `apps/7ya-live/test/unit/core-adapter.test.ts`
- Modify: `apps/7ya-live/backend/index.ts`

**Interfaces:**
- Consumes: current `CanonicalEvent`, canonical entities and existing store reads.
- Produces: `CoreRecord`, `CoreSourceRef`, `CoreRelationship`; `/api/core` and `/api/core/:id` can project existing data without rewriting the underlying Canon store.

- [ ] **Step 1: Write failing mapping tests against real canonical fixtures**

Use `origin-belonging-1990s`, `israel-police-service-2015-2021`, `starton-return-2022`, `fatherhood-viral-2023-02-20` and `7ya-now-snapshot-2026` from `shared/canonical-corpus.ts`.

Assert:

- each Canon event projects to a stable Core record ID `moment:<canonical-event-id>`;
- public sources become stable source refs `source:<canonical-event-id>:<source-id>`;
- `verified` stays `verified`;
- `owner-reported` stays `owner-reported`;
- `supported` and `inferred` project conservatively as `discovery` rather than `verified`;
- `unresolved` stays `unresolved`;
- `contradicted` and `quarantined` project as `quarantined`.

- [ ] **Step 2: Run and confirm failure**

```bash
npm run test:unit -- core-adapter
```

- [ ] **Step 3: Implement the approved Core envelope**

Create `shared/core-types.ts` with the approved spec contract:

```ts
export type LocalizedText={he:string;en:string;ru:string};
export type CoreKind='person'|'moment'|'media'|'post'|'project'|'place'|'institution'|'source'|'metric';
export type CoreVerification='verified'|'owner-reported'|'discovery'|'unresolved'|'quarantined';
export type CoreRecord={
  id:string;
  kind:CoreKind;
  title:LocalizedText;
  summary:LocalizedText;
  canonicalDate?:string;
  verification:CoreVerification;
  sourceRefs:string[];
  mediaRefs:string[];
  relationshipRefs:string[];
  createdAt:string;
  updatedAt:string;
};
```

Do not mutate `shared/canonical-corpus.ts` to fit this type.

- [ ] **Step 4: Implement adapters**

Canonical events project to `kind:'moment'`; specialized project/person/institution objects come from entity/project adapters rather than pretending every historical event is itself a project or person.

All source/media/relationship references must be deterministic from canonical identifiers, not array positions alone.

- [ ] **Step 5: Add read-only Core service routes**

Wire read-only routes in `backend/index.ts`:

```text
GET /api/core
GET /api/core/:id
```

They are projections only. No Canon write path changes in this task.

- [ ] **Step 6: Run tests and existing Canon build checks**

```bash
npm run test:unit -- core-adapter
npm test
npm run build
```

Expected: current `/api/corpus`, `/api/graph`, `/api/public-internet-graph` behavior remains available.

- [ ] **Step 7: Commit**

```bash
git add apps/7ya-live/shared/core-types.ts apps/7ya-live/backend/core apps/7ya-live/backend/index.ts apps/7ya-live/test
git commit -m "feat: add read-only 7YA Core projection"
```

---

### Task 7: Consolidate Media Identity and Enforce Personal-Media Resolution

**Files:**
- Create: `apps/7ya-live/backend/media/media-types.ts`
- Create: `apps/7ya-live/backend/media/media-id.ts`
- Create: `apps/7ya-live/backend/media/personal-media-policy.ts`
- Create: `apps/7ya-live/backend/media/media-service.ts`
- Create: `apps/7ya-live/test/unit/personal-media-policy.test.ts`
- Create: `apps/7ya-live/scripts/check-personal-media-policy.mjs`
- Modify: `apps/7ya-live/backend/index.ts`

**Interfaces:**
- Consumes: canonical media, `visual-locks`, current Media Registry/Visual Registry and owner-approved records.
- Produces: stable `MediaAsset.assetId`, separate `verifiedMetadata`/`proposedMetadata`, and `resolvePersonalMedia(candidates)` implementing the approved priority order.

- [ ] **Step 1: Write failing priority tests**

Test candidates representing all five levels and assert this exact ordering:

```text
canon-personal
owner-approved
verified-public
source-bound
neutral
```

Also assert an `unverified`/generic candidate is never selected for an Igor documentary scene.

- [ ] **Step 2: Run and confirm failure**

```bash
npm run test:unit -- personal-media-policy
```

- [ ] **Step 3: Implement stable asset IDs**

Create a deterministic ID from normalized media identity:

```ts
assetId = 'media:' + sha256(canonicalEventId+'|'+kind+'|'+normalizedSourceUrl+'|'+normalizedAssetUrl).slice(0,24)
```

Use Node `createHash('sha256')`; do not use random IDs for imported public media.

- [ ] **Step 4: Separate verified and AI-proposed metadata**

Define:

```ts
type MediaAsset={
  assetId:string;
  canonicalEventId:string|null;
  kind:'image'|'video'|'audio'|'document'|'source-card';
  sourceUrl:string;
  assetUrl:string;
  authority:'canon-personal'|'owner-approved'|'verified-public'|'source-bound'|'neutral'|'unverified';
  verifiedMetadata:Record<string,string|number|boolean>;
  proposedMetadata:Record<string,string|number|boolean>;
};
```

No code path may merge `proposedMetadata` into `verifiedMetadata` implicitly.

- [ ] **Step 5: Put existing registries behind `media-service.ts`**

Keep the legacy `/api/media-registry` and `/api/visual-registry` routes for compatibility, but have new scene code consume one service interface. Avoid changing public response shapes until the Scene Engine is ready.

- [ ] **Step 6: Add a build policy check**

`check-personal-media-policy.mjs` scans the new scene configuration/source files for prohibited generic personal-media placeholders and fails if the new documentary scene path references known generic/synthetic placeholders. It does not attempt to classify arbitrary remote images.

- [ ] **Step 7: Run tests/build**

```bash
npm run test:unit -- personal-media-policy
npm test
npm run build
```

- [ ] **Step 8: Commit**

```bash
git add apps/7ya-live/backend/media apps/7ya-live/backend/index.ts apps/7ya-live/test apps/7ya-live/scripts
git commit -m "feat: add stable media identity and personal media policy"
```

---

### Task 8: Build the Source-Bound Scene Engine on Existing Life Scenes

**Files:**
- Create: `apps/7ya-live/backend/story/scene-types.ts`
- Create: `apps/7ya-live/backend/story/scene-engine.ts`
- Create: `apps/7ya-live/test/unit/scene-engine.test.ts`
- Modify: `apps/7ya-live/backend/life-scenes.ts`
- Modify: `apps/7ya-live/backend/index.ts`

**Interfaces:**
- Consumes: Core records, existing `compileLifeScenes`, media service and explicit canonical relationships.
- Produces: approved `SceneRequest`/`Scene` contract and `composeScenes(request)`; every emitted scene contains at least one existing Core record reference and one public source ref.

- [ ] **Step 1: Write failing home-sequence tests**

Tests must assert that the Hebrew homepage composition covers these ordered chapter keys:

```ts
[
  'opening',
  'origin',
  'jesse-cohen',
  'service',
  'police',
  'human',
  'starton',
  'public-voice',
  'creation',
  'now'
]
```

Use existing canonical anchors where available:

```text
origin-belonging-1990s
military-service-2008-2011
israel-police-service-2015-2021
fatherhood-viral-2023-02-20
starton-return-2022
public-voice-2023
life-music-2025
7ya-now-snapshot-2026
```

The Jesse Cohen chapter may reuse linked origin/StartOn records but must not invent a separate historical event.

- [ ] **Step 2: Add truth-boundary tests**

For every emitted scene assert:

- `sourceRefs.length > 0`;
- all source refs resolve to known public Core source objects;
- `primaryMediaRef`, when present, resolves through the media service;
- `nextSceneIds` resolve inside the returned composition;
- no AI-only proposed metadata appears as factual summary text.

- [ ] **Step 3: Run and confirm failure**

```bash
npm run test:unit -- scene-engine
```

- [ ] **Step 4: Implement the scene types**

Use the approved interface exactly:

```ts
export type SceneRequest={
  subject:'igor';
  intent:'homepage'|'moment'|'story'|'starton'|'media';
  locale:'he'|'en'|'ru';
  viewport:'mobile'|'desktop';
  query?:string;
};

export type Scene={
  id:string;
  chapter:string;
  title:{he:string;en:string;ru:string};
  summary:{he:string;en:string;ru:string};
  primaryMediaRef?:string;
  supportingMediaRefs:string[];
  sourceRefs:string[];
  relationshipRefs:string[];
  nextSceneIds:string[];
};
```

- [ ] **Step 5: Implement deterministic composition first**

Homepage composition must be deterministic from Canon/Core. Query-driven story composition may later use NVIDIA to propose ordering, but the final resolver filters every proposed ID through Core before returning it.

- [ ] **Step 6: Add read-only scene routes**

Wire:

```text
GET /api/scenes?intent=homepage&lang=he&viewport=mobile
GET /api/scenes/:id
```

Keep `/api/life-scenes`, `/api/story-path` and `/api/story-composition` operational during migration.

- [ ] **Step 7: Run tests/build**

```bash
npm run test:unit -- scene-engine
npm test
npm run build
```

- [ ] **Step 8: Commit**

```bash
git add apps/7ya-live/backend/story apps/7ya-live/backend/life-scenes.ts apps/7ya-live/backend/index.ts apps/7ya-live/test
git commit -m "feat: add source-bound 7YA Scene Engine"
```

---

### Task 9: Render the Scene Engine as the Public Homepage

**Files:**
- Create: `apps/7ya-live/src/scenes/SceneRenderer.tsx`
- Create: `apps/7ya-live/src/scenes/HomepageSceneJourney.tsx`
- Create: `apps/7ya-live/test/integration/home-scene-contract.test.ts`
- Modify: `apps/7ya-live/src/album/AlbumHome.tsx`
- Modify: `apps/7ya-live/src/App.tsx`
- Modify: `apps/7ya-live/src/GlobalNav.tsx`
- Modify: `apps/7ya-live/scripts/check-home-composition.mjs`
- Modify: `apps/7ya-live/tests/tests.txt`

**Interfaces:**
- Consumes: `/api/scenes?intent=homepage`, MediaAsset refs, source refs.
- Produces: cinematic scene-based homepage with authentic media, source actions, simplified navigation and deterministic fallback when the scene API fails.

- [ ] **Step 1: Write the failing contract test**

The integration test loads a fixed scene fixture and verifies the renderer contract includes:

- visible chapter title/summary;
- primary authentic media when provided;
- original-source action;
- next-scene navigation;
- no operational/debug labels.

- [ ] **Step 2: Run and confirm failure**

```bash
npm run test:integration -- home-scene-contract
```

- [ ] **Step 3: Implement a presentation-only renderer**

`SceneRenderer.tsx` receives `Scene` plus resolved media/source objects. It must not query Canon, choose verification status, call NVIDIA or choose a substitute image.

When no media exists, render a restrained typographic/source treatment; do not call image generation and do not use a generic stock image.

- [ ] **Step 4: Implement the homepage journey with deterministic fallback**

`HomepageSceneJourney.tsx` requests scenes once per locale/viewport. If the API fails, it falls back to a minimal local sequence derived from the already source-bound data exposed by the current album/life path; failure must not produce a blank screen.

- [ ] **Step 5: Cut over the home route only**

Modify `App.tsx`/`AlbumHome.tsx` so `/` renders the Scene Engine journey as the dominant experience. Preserve deep routes (`/library/`, `/media/`, `/starton/`, `/evidence/`, `/moment/...`, `/entity/...`) unchanged.

Do not delete legacy homepage components yet.

- [ ] **Step 6: Simplify top-level public navigation**

Change the visitor-facing primary nav to:

```text
IGOR · LIFE · WORK · MEDIA · STARTON · ASK
```

Map each label to existing stable routes/anchors. Museum/evidence/research/music/library/search remain discoverable from contextual/deep navigation, not equal top-level identities.

- [ ] **Step 7: Update static and visual checks**

Update `check-home-composition.mjs` and `tests/tests.txt` to require the scene journey, authentic/source-bound media, no horizontal overflow, source actions and the personal-album character on mobile/desktop.

- [ ] **Step 8: Run the full pre-deploy gate**

```bash
npm test
npm run build
```

Then deploy to a non-production AppDeploy version/preview and run the existing live visual acceptance routes for `home` on mobile and desktop.

Expected: meaningful content, no blank/mostly-empty viewport, no critical clipping, multiple authentic/source-bound visuals, and no dashboard-like first experience.

- [ ] **Step 9: Commit**

```bash
git add apps/7ya-live/src apps/7ya-live/scripts apps/7ya-live/tests apps/7ya-live/test
git commit -m "feat: cut homepage to cinematic Scene Engine"
```

---

### Task 10: Make Bro Chat Return Navigable Story References

**Files:**
- Create: `apps/7ya-live/test/integration/bro-chat-scenes.test.ts`
- Modify: `apps/7ya-live/backend/intelligence/nvidia-agent.ts`
- Modify: `apps/7ya-live/backend/index.ts`
- Modify: `apps/7ya-live/src/StoryCompanion.tsx`

**Interfaces:**
- Consumes: grounded answer, Core search and Scene Engine.
- Produces: companion response fields `relatedCoreIds`, `sceneIds`, `mediaRefs`, `sourceRefs`; UI can open the relevant scene/moment without treating AI text as evidence.

- [ ] **Step 1: Write the failing grounded-navigation test**

For a fixture question equivalent to “How is StartOn connected to Igor's childhood?”, assert:

- answer generation/retrieval uses public evidence;
- returned IDs resolve to existing Core records;
- returned scene IDs resolve through Scene Engine;
- all source refs are public source objects;
- answer still returns when NVIDIA is disabled, using deterministic retrieval/composition.

- [ ] **Step 2: Run and confirm failure**

```bash
npm run test:integration -- bro-chat-scenes
```

- [ ] **Step 3: Extend the response contract**

Add optional structured fields to the companion result without breaking existing `reply`, `intent`, `suggestions`, `actions`, `spotlight`, `checkpoint`, `provider` and `model` fields.

AI may suggest candidate records, but the server must resolve/filter IDs against Core/Scene Engine before returning them.

- [ ] **Step 4: Add navigation UI**

In `StoryCompanion.tsx`, render compact “open moment/story” actions from server-resolved IDs. Keep Bro Chat explicitly identified as AI and retain the no-first-person-impersonation policy.

- [ ] **Step 5: Run tests/build and visual acceptance**

```bash
npm run test:integration -- bro-chat-scenes
npm test
npm run build
```

Run the existing `chat` mobile visual acceptance path and verify the composer, SEE/ALIGN/ACT controls and new story actions remain reachable without clipping.

- [ ] **Step 6: Commit**

```bash
git add apps/7ya-live/backend apps/7ya-live/src/StoryCompanion.tsx apps/7ya-live/test
git commit -m "feat: connect Bro Chat answers to story scenes"
```

---

### Task 11: Consolidate the Control Plane and Protect Public Routes

**Files:**
- Create: `apps/7ya-live/test/integration/control-plane-auth.test.ts`
- Modify: `apps/7ya-live/backend/index.ts`
- Modify: `apps/7ya-live/src/SocialControlPage.tsx`
- Modify: `apps/7ya-live/src/PersonalCommand.tsx`
- Modify: `apps/7ya-live/src/SiteControl.tsx`
- Modify: `apps/7ya-live/src/App.tsx`

**Interfaces:**
- Consumes: existing `requireAuth()` and `requireAdminEmailAllowlist(ADMIN_EMAILS)` boundaries.
- Produces: clear admin-only operational surfaces for ingestion, verification, NVIDIA, social, analytics and release status; public scenes never render operational panels.

- [ ] **Step 1: Write the failing authorization matrix test**

Create a route matrix for admin operations already present in `backend/index.ts`, including Meta admin sync/status, ingestion commit/extract, Corpus admin upsert, UX admin, social OAuth/control and growth admin stats.

Assert a non-admin request cannot reach the final mutation/read handler for protected operations. Also assert public read routes (`/api/core`, `/api/scenes`, `/api/corpus`, `/api/public-projection`, `/api/media-registry`) remain public-safe.

- [ ] **Step 2: Run and confirm any boundary failures**

```bash
npm run test:integration -- control-plane-auth
```

- [ ] **Step 3: Centralize control-plane route metadata**

Create one route-policy map or grouped router section so admin operations are visibly distinguishable from public read routes. Do not weaken any existing auth requirement.

- [ ] **Step 4: Remove public operational chrome**

Ensure `SiteControl`, `PersonalCommand`, social diagnostics and system health controls appear only on explicit admin/control routes, never as part of the default public homepage/scene journey.

- [ ] **Step 5: Run security regression and build**

```bash
npm run test:integration -- control-plane-auth
npm test
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add apps/7ya-live/backend/index.ts apps/7ya-live/src apps/7ya-live/test
git commit -m "refactor: separate public and control planes"
```

---

### Task 12: Establish Git-Backed AppDeploy Release, Visual Gate and Rollback

**Files:**
- Modify: `apps/7ya-live/scripts/check-release-provenance.mjs`
- Modify: `apps/7ya-live/scripts/check-release-coherence.mjs`
- Modify: `apps/7ya-live/backend/index.ts`
- Create: `apps/7ya-live/RELEASE.md`
- Modify: `docs/CI_RUNBOOK.md`

**Interfaces:**
- Consumes: Git commit SHA, full test/build result, AppDeploy deployable version and visual-acceptance result.
- Produces: a release record linking Git commit -> AppDeploy version -> canonical domain; previous AppDeploy version is recorded before cutover.

- [ ] **Step 1: Write release acceptance criteria into `RELEASE.md`**

The document must require, in order:

```text
npm test
npm run build
Git clean state
GITHUB_PROVENANCE_COMMIT=<40-char commit SHA>
AppDeploy preview/deploy candidate
AppDeploy runtime terminal-ready status
mobile home visual acceptance PASS
desktop home visual acceptance PASS
mobile chat visual acceptance PASS
/api/release reports the same Git SHA
7ya.io domain proof matches the candidate release
```

Rollback procedure must name the previously applied AppDeploy version and use `apply_app_version(app_id, previousVersion)` followed by status/QA checks.

- [ ] **Step 2: Add a release-coherence regression test/check**

The build must fail in production mode if the provenance SHA is absent or malformed. `/api/release` must report `source_alignment:'GIT_ALIGNED'` only when the injected SHA is valid; local builds report a non-production state and never claim alignment.

- [ ] **Step 3: Run the full local gate**

```bash
npm test
npm run build
```

Expected: all unit/integration tests plus existing Vite verification scripts pass.

- [ ] **Step 4: Record the rollback version before deployment**

Query AppDeploy versions for app `697a008fddc309b142`, record the currently applied/last-known-good version in the release notes, and do not overwrite that record during the deploy attempt.

- [ ] **Step 5: Deploy the Git-backed candidate**

Deploy the `apps/7ya-live` source with `GITHUB_PROVENANCE_COMMIT` bound to the exact commit being released. Poll AppDeploy status in the same execution until terminal state; if runtime or E2E/QA fails, fix/redeploy within the bounded retry policy rather than declaring success.

- [ ] **Step 6: Run live acceptance before declaring cutover successful**

Verify `7ya.io`/`www.7ya.io`, `/api/release`, `/api/health`, homepage mobile/desktop, Bro Chat mobile, source actions, StartOn and at least one Moment/Entity route. If any release gate fails, reapply the recorded previous AppDeploy version.

- [ ] **Step 7: Update the repository runbook**

Update `docs/CI_RUNBOOK.md` so the canonical production path points to `apps/7ya-live`, not the old root/static deploy path, while preserving historical context about the older layer.

- [ ] **Step 8: Commit release documentation**

```bash
git add apps/7ya-live/RELEASE.md apps/7ya-live/scripts apps/7ya-live/backend/index.ts docs/CI_RUNBOOK.md
git commit -m "docs: codify Git-backed AppDeploy release gate"
```

---

### Task 13: Deprecate Superseded Presentation Layers Only After Acceptance

**Files:**
- Modify/Delete only after usage proof: selected files under `apps/7ya-live/src/` such as legacy home/experience components confirmed unused by route/search analysis
- Modify: `apps/7ya-live/src/App.tsx`
- Modify: `apps/7ya-live/tests/tests.txt`
- Create: `apps/7ya-live/docs/DEPRECATIONS.md`
- Modify: `apps/7ya-live/backend/intelligence/nvidia-credentials.ts`

**Interfaces:**
- Consumes: accepted Scene Engine homepage, route coverage, import/reference search, live visual gate.
- Produces: smaller presentation surface with no competing homepage engines; legacy NVIDIA alias can be removed after explicit scoped credentials are live.

- [ ] **Step 1: Generate the candidate deprecation list**

Search the live app source for imports/usages of the accumulated home/experience components. Only components with no remaining route/import contract become deletion candidates. Record each candidate, replacement and proof in `docs/DEPRECATIONS.md` before deleting it.

- [ ] **Step 2: Add a regression check for the canonical homepage path**

Update existing home-composition checks so the build fails if `App.tsx` reintroduces a competing public homepage engine alongside `HomepageSceneJourney`.

- [ ] **Step 3: Remove one deprecation batch at a time**

Delete only the first reviewed batch, run:

```bash
npm test
npm run build
```

Then repeat for the next batch. Do not mass-delete every similarly named file in one commit.

- [ ] **Step 4: Remove the legacy NVIDIA alias only after replacement credentials prove ready**

When gateway health has passed using `NVIDIA_NIM_API_KEY` and/or `NVCF_API_KEY`, delete the compatibility reporting for `NVIDIA_API_KEY` and remove the old secret from AppDeploy. Before that point, keep it inert and reported as legacy rather than guessing its scope.

- [ ] **Step 5: Run final route/visual regression**

Run all tests/build checks and the live visual acceptance suite for home, chat, library, moment, entity, StartOn, media and evidence. Verify old canonical URLs still resolve and source actions still point to their original public sources.

- [ ] **Step 6: Commit cleanup**

```bash
git add -A apps/7ya-live
git commit -m "refactor: retire superseded 7YA presentation layers"
```

---

## Cross-Task Acceptance Matrix

| Requirement | Implemented by | Proof |
| --- | --- | --- |
| Production source exists in canonical Git | Tasks 1, 12 | source manifest + provenance SHA + `/api/release` |
| NVIDIA credentials are unambiguous | Tasks 3-5 | unit tests + gateway health |
| NVIDIA is not a single point of failure | Tasks 4-5, 10 | failure/fallback integration tests |
| Canon remains authoritative | Tasks 6, 8, 10 | adapter + scene + chat source-resolution tests |
| Discovery is never silently promoted | Task 6 | conservative verification mapping tests |
| Authentic Igor media is preferred | Task 7 | media-policy tests + build check |
| Scene Engine does not invent biography | Task 8 | Core/source-resolution assertions |
| Homepage is cinematic/human-first | Task 9 | contract + mobile/desktop visual acceptance |
| Bro Chat navigates into story | Task 10 | grounded-navigation integration test |
| Public/admin layers are separated | Task 11 | auth matrix + visual regression |
| Rollback is operational | Task 12 | recorded previous AppDeploy version + reapply procedure |
| Legacy layers disappear safely | Task 13 | usage proof + per-batch build/visual gates |

## Final Verification Sequence

Do not declare the migration complete until this sequence is green from the canonical Git working tree:

```bash
cd apps/7ya-live
npm test
npm run build
```

Then verify the production candidate through AppDeploy:

```text
1. terminal deployment status = ready
2. frontend errors = 0
3. backend errors = 0
4. /api/health = success
5. /api/release Git SHA = released commit
6. NVIDIA health accurately reports ready/degraded/not-configured without exposing secrets
7. home visual acceptance = PASS on mobile and desktop
8. chat visual acceptance = PASS on mobile
9. library/moment/entity/StartOn/media/evidence primary routes render meaningful content
10. domain proof confirms 7ya.io is serving the released build
```

If any production gate fails, reapply the recorded last-known-good AppDeploy version first, then diagnose from Git. Do not patch production-only source and leave it unreconciled.
