# 7YA Replacement Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the live 7YA AppDeploy application into one repository-traceable, evidence-first system with strict NVIDIA isolation, a normalized Core, authentic-media resolution, a source-bound Scene Engine, and a cinematic public experience that remains functional when AI or social providers fail.

**Architecture:** Preserve the working AppDeploy application and first reconcile its applied source snapshot into Git under `apps/7ya-live/`. Then introduce narrow modules around the existing Canon, media, NVIDIA and story behavior rather than rewriting them. Each release keeps legacy routes available until replacement paths pass unit, integration, build, visual, source-alignment and rollback gates.

**Tech Stack:** React 19, TypeScript, Vite 6, AppDeploy frontend+backend runtime, `@appdeploy/sdk`, Node.js verification scripts, Vitest for new unit/integration coverage, NVIDIA hosted NIM (`integrate.api.nvidia.com`) and NVCF, existing Canon/Public Internet Graph/Discovery/Media services.

**Spec:** `docs/superpowers/specs/2026-09-16-7ya-replacement-architecture-design.md`

## Global Constraints

- `7guard-io/7ya.io` is the canonical source repository.
- AppDeploy app `697a008fddc309b142` remains production runtime during migration.
- Initial source baseline is AppDeploy version `1789293197999`; no behavioral refactor starts until that source is represented in Git.
- Existing root/static-site content remains intact until the live application has its own reproducible workspace and release path under `apps/7ya-live/`.
- Truth flow is `SOURCE -> NORMALIZE -> DISCOVERY -> VERIFY -> CANON`.
- NVIDIA may classify, transcribe, embed, rank and compose; it may not promote model output into verified Canon by itself.
- `NVIDIA_NIM_API_KEY` is used only for hosted NIM/integrate endpoints. `NVCF_API_KEY` is used only for NVCF. `NVIDIA_API_KEY` is never silently interpreted as either after R0.
- Public biography, Canon pages, media, source links and deterministic navigation remain functional with NVIDIA unavailable.
- Personal media priority is Canon personal media -> owner-approved personal media -> verified public personal media -> source-bound preview -> neutral treatment.
- Generic or synthetic imagery must not substitute for missing documentary personal media.
- Primary public navigation converges to `IGOR · LIFE · WORK · MEDIA · STARTON · ASK`.
- Operational/admin surfaces remain behind existing auth/admin boundaries.
- No automatic external social publishing is added.
- No synthetic aggregate reach claim is added.
- Existing public URLs, Canon source links and Canon/Discovery separation are regression-protected.
- Mobile acceptance is mandatory before any production-facing release is complete.
- The immediately previous AppDeploy version is recorded before every production cutover and remains the rollback target until acceptance passes.

---

## File Structure After Migration

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
      nvidia-agent.ts
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
    release-provenance.ts
    visual-locks.ts
    ...existing shared modules
  scripts/
    ...existing build verification scripts
    check-personal-media-policy.mjs
    check-release-provenance.mjs
  test/
    unit/
    integration/
  tests/tests.txt
  .source/
    appdeploy-baseline.json
    source-manifest.json
```

Responsibility boundaries:

- `shared/core-types.ts`: stable Core envelope; no provider/runtime code.
- `backend/core/*`: projections from existing Canon/entities into Core; no UI concerns.
- `backend/intelligence/*`: NVIDIA credentials, provider calls, health/failure taxonomy and agent boundary.
- `backend/media/*`: stable asset identity and authentic-media resolution; AI metadata stays advisory.
- `backend/story/*`: deterministic source-bound composition; no direct provider secrets or social API calls.
- `src/scenes/*`: presentation only; does not decide biography truth or choose substitute media.
- `backend/index.ts`: route wiring/orchestration only for responsibilities touched by this migration.

---

### Task 1: Reconcile the Applied AppDeploy Source into Git

**Files:**
- Create: `apps/7ya-live/**` from AppDeploy version `1789293197999`
- Create: `apps/7ya-live/.source/appdeploy-baseline.json`
- Create: `apps/7ya-live/.source/source-manifest.json`
- Create: `apps/7ya-live/README.md`
- Modify: `.gitignore`
- Modify: `README.md`

**Interfaces:**
- Consumes: AppDeploy app ID `697a008fddc309b142`, version `1789293197999`.
- Produces: a complete Git baseline and a SHA-256 manifest covering every exported file.

- [ ] **Step 1: Inventory the exact applied source**

Enumerate every source path from AppDeploy version `1789293197999`, following source-glob pagination until no continuation token remains. Sort paths before export. The inventory must include the returned Vite entry/config files plus `backend/`, `shared/`, `src/`, `scripts/`, `tests/`, `package.json` and `tsconfig.json`.

- [ ] **Step 2: Export source without changing behavior**

Read every UTF-8 source file from the same AppDeploy version and write it to `apps/7ya-live/<relative-path>` byte-for-byte. Do not reformat, rename modules, alter release strings or change imports.

If AppDeploy reports a file as base64/binary, preserve bytes by decoding locally and creating the Git blob with base64 encoding, then add that blob to the same baseline tree. Do not inline binary bytes into Markdown or UTF-8 source files.

- [ ] **Step 3: Write baseline metadata**

Create `apps/7ya-live/.source/appdeploy-baseline.json` exactly as:

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

Create `source-manifest.json` as a lexicographically sorted array of `{path,sha256}` objects. `sha256` is always a real 64-character lowercase digest calculated from the exported bytes. Example format using the SHA-256 of an empty example file:

```json
[
  {
    "path": "example.txt",
    "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  }
]
```

The committed manifest contains the real AppDeploy paths and digests, not `example.txt`.

- [ ] **Step 4: Document workspace ownership**

Create `apps/7ya-live/README.md` stating that this directory is canonical source for the live AppDeploy application; repository-root static/history material is not the production source. Add a “Canonical live application” section to root `README.md` linking to this workspace without deleting existing history.

- [ ] **Step 5: Protect generated output**

Ensure `.gitignore` contains:

```gitignore
apps/7ya-live/node_modules/
apps/7ya-live/dist/
apps/7ya-live/.vite/
apps/7ya-live/coverage/
```

- [ ] **Step 6: Verify baseline build parity**

Run:

```bash
cd apps/7ya-live
npm install
npm run build
```

Expected: existing source-index, legacy-recovery, first-paint, home-composition and release-coherence checks complete before Vite builds successfully. If unchanged source does not build, resolve only export/build-parity defects and rerun; do not start Task 2.

- [ ] **Step 7: Commit baseline**

```bash
git add apps/7ya-live .gitignore README.md
git commit -m "chore: reconcile live AppDeploy source baseline"
```

Record this commit SHA as the migration base.

---

### Task 2: Add the Live-App Test Harness

**Files:**
- Modify: `apps/7ya-live/package.json`
- Create: `apps/7ya-live/vitest.config.ts`
- Create: `apps/7ya-live/test/unit/baseline.test.ts`

**Interfaces:**
- Consumes: unchanged Task 1 baseline.
- Produces: `npm test`, `npm run test:unit`, `npm run test:integration` without replacing existing build checks.

- [ ] **Step 1: Write the failing baseline test**

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

- [ ] **Step 2: Confirm the expected harness failure**

```bash
npm test
```

Expected before package changes: command fails because the live package has no `test` script/Vitest dependency.

- [ ] **Step 3: Install Vitest and add scripts**

```bash
npm install --save-dev vitest
```

Add scripts:

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

- [ ] **Step 4: Verify harness and existing build checks together**

```bash
npm test
npm run build
```

Expected: baseline test passes; existing AppDeploy/Vite verification scripts still pass.

- [ ] **Step 5: Commit**

```bash
git add apps/7ya-live/package.json apps/7ya-live/package-lock.json apps/7ya-live/vitest.config.ts apps/7ya-live/test
git commit -m "test: add live app unit and integration harness"
```

---

### Task 3: Make NVIDIA Credential Selection Unambiguous

**Files:**
- Create: `apps/7ya-live/backend/intelligence/nvidia-types.ts`
- Create: `apps/7ya-live/backend/intelligence/nvidia-credentials.ts`
- Create: `apps/7ya-live/test/unit/nvidia-credentials.test.ts`
- Modify: `apps/7ya-live/backend/index.ts`

**Interfaces:**
- Consumes: secret names from AppDeploy `secrets.listSecretNames()`.
- Produces: `selectNvidiaCredentialNames(names)` returning `{nimName,nvcfName,legacyPresent}` and never mapping `NVIDIA_API_KEY` implicitly.

- [ ] **Step 1: Write failing policy tests**

```ts
import {describe,expect,it} from 'vitest';
import {selectNvidiaCredentialNames} from '../../backend/intelligence/nvidia-credentials';

describe('selectNvidiaCredentialNames',()=>{
  it('keeps NIM and NVCF credentials separate',()=>{
    expect(selectNvidiaCredentialNames(new Set(['NVIDIA_NIM_API_KEY','NVCF_API_KEY']))).toEqual({
      nimName:'NVIDIA_NIM_API_KEY',nvcfName:'NVCF_API_KEY',legacyPresent:false
    });
  });

  it('does not reinterpret NVIDIA_API_KEY',()=>{
    expect(selectNvidiaCredentialNames(new Set(['NVIDIA_API_KEY']))).toEqual({
      nimName:null,nvcfName:null,legacyPresent:true
    });
  });
});
```

- [ ] **Step 2: Confirm failure**

```bash
npm run test:unit -- nvidia-credentials
```

Expected: module-not-found failure.

- [ ] **Step 3: Implement selector**

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

- [ ] **Step 4: Integrate only name selection**

Replace current `nvcfConfigured`, `nimConfigured`, `readNvcfCredential` and `readNimKey` selection logic in `backend/index.ts`. Old `NVIDIA_API_KEY` becomes inert compatibility status (`legacy-unmapped`), not a provider credential.

Do not delete the old secret yet. Until the user securely binds a correctly scoped replacement credential, NVIDIA-enhanced paths report unavailable/degraded and public behavior falls back safely.

- [ ] **Step 5: Verify**

```bash
npm run test:unit -- nvidia-credentials
npm test
npm run build
```

Inspect `/api/companion/status` via its public-safe path and confirm no key/token/secret value is returned.

- [ ] **Step 6: Commit**

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
- Modify: `apps/7ya-live/backend/intelligence/nvidia-types.ts`
- Create: `apps/7ya-live/test/unit/nvidia-gateway.test.ts`
- Modify: `apps/7ya-live/backend/nvcf.ts`

**Interfaces:**
- Consumes: explicit NIM/NVCF keys, explicit model config and injected `fetch`.
- Produces: provider-neutral `NvidiaGateway`; failures normalize to `auth`, `endpoint`, `rate-limit`, `timeout`, `upstream`, `not-configured`.

- [ ] **Step 1: Write failing classification tests**

```ts
expect(classifyNvidiaHttpStatus(401)).toBe('auth');
expect(classifyNvidiaHttpStatus(403)).toBe('auth');
expect(classifyNvidiaHttpStatus(404)).toBe('endpoint');
expect(classifyNvidiaHttpStatus(410)).toBe('endpoint');
expect(classifyNvidiaHttpStatus(429)).toBe('rate-limit');
expect(classifyNvidiaHttpStatus(503)).toBe('upstream');
```

Add a test proving an unconfigured gateway returns health without a network call.

- [ ] **Step 2: Confirm failure**

```bash
npm run test:unit -- nvidia-gateway
```

- [ ] **Step 3: Define provider-neutral types and interface**

```ts
export type NvidiaProvider='nim'|'nvcf';
export type NvidiaFailureClass='auth'|'endpoint'|'rate-limit'|'timeout'|'upstream'|'not-configured';
export type NvidiaHealth={
  state:'ready'|'degraded'|'not-configured';
  provider:NvidiaProvider|null;
  failureClass:NvidiaFailureClass|null;
  model:string|null;
};

export type NvidiaModelConfig={
  chat:string;
  vision?:string;
  embedding?:string;
  rerank?:string;
};

export interface NvidiaGateway{
  health():Promise<NvidiaHealth>;
  generate(input:GenerateInput):Promise<GenerateResult>;
  vision(input:VisionInput):Promise<VisionResult>;
  embed(input:EmbedInput):Promise<EmbedResult>;
  rerank(input:RerankInput):Promise<RerankResult>;
}
```

`GenerateInput`, `VisionInput`, `EmbedInput`, `RerankInput` and their result types are data-only structures in `nvidia-types.ts`; they contain no credential fields.

Optional capabilities have explicit behavior: if the corresponding model is absent from `NvidiaModelConfig`, the method throws/returns the typed `not-configured` capability failure. It never fabricates a result or silently routes to another model.

- [ ] **Step 4: Implement hosted NIM client**

`nim-client.ts` owns only `integrate.api.nvidia.com`. Health uses `GET /v1/models`; generation uses `POST /v1/chat/completions`. Current chat model remains `nvidia/nemotron-3-super-120b-a12b`. Client functions receive key, model config and fetch implementation as parameters, enabling tests without AppDeploy secrets.

- [ ] **Step 5: Wrap NVCF behind the same boundary**

`nvcf-client.ts` calls existing `discoverNvcf`/`invokeNvcf` exports. It does not fall through to hosted NIM on its own.

- [ ] **Step 6: Implement deterministic gateway selection**

Selection is:

```text
explicit ready NVCF target + NVCF_API_KEY -> NVCF
else NVIDIA_NIM_API_KEY -> hosted NIM
else -> not-configured
```

`NVIDIA_API_KEY` is never a selector input.

- [ ] **Step 7: Verify**

```bash
npm run test:unit -- nvidia-gateway
npm test
npm run build
```

- [ ] **Step 8: Commit**

```bash
git add apps/7ya-live/backend/intelligence apps/7ya-live/backend/nvcf.ts apps/7ya-live/test
git commit -m "feat: add provider-neutral NVIDIA gateway"
```

---

### Task 5: Route Bro Chat and Canaries Through the Gateway

**Files:**
- Create: `apps/7ya-live/backend/intelligence/nvidia-agent.ts`
- Create: `apps/7ya-live/test/integration/nvidia-fallback.test.ts`
- Modify: `apps/7ya-live/backend/index.ts`
- Modify: `apps/7ya-live/cron.json`

**Interfaces:**
- Consumes: Task 4 gateway and existing public evidence tool executor.
- Produces: one grounded NVIDIA agent path; AppDeploy/local deterministic behavior remains available when NVIDIA is absent or degraded.

- [ ] **Step 1: Write failing fallback tests**

Inject gateway health `not-configured` and `degraded/auth`; assert provider orchestration returns the non-NVIDIA answer path without throwing. Recursively inspect response/status objects and assert no property named `key`, `token`, `authorization` or `secret` exists.

- [ ] **Step 2: Confirm failure**

```bash
npm run test:integration -- nvidia-fallback
```

- [ ] **Step 3: Extract current NVIDIA agent loop**

Move current `runNvidiaAgent`/NVIDIA request orchestration from `backend/index.ts` into `backend/intelligence/nvidia-agent.ts`. Preserve Canon-authoritative/Discovery-labeled grounding, evidence-tool requirement for factual Igor questions, bounded turns, hidden-reasoning suppression and retrieval-before-factual-answer behavior.

Agent receives `NvidiaGateway` and tool executor dependencies; it never reads secrets directly.

- [ ] **Step 4: Replace provider status/canary routing**

Wire `/api/companion/status`, NVIDIA canary and agent-mesh status through gateway health. Internal/admin diagnostics distinguish `legacy-unmapped`, `not-configured`, `auth`, `endpoint`, `rate-limit`, `timeout`, `upstream`; public responses stay concise.

- [ ] **Step 5: Keep failed canaries disabled until credentials validate**

Do not re-enable current failed NVIDIA/NVCF cron probes merely because code changed. At rollout, securely bind `NVIDIA_NIM_API_KEY` and/or `NVCF_API_KEY`. Re-enable one bounded canary only after an administrative health probe returns `ready`. Do not copy or guess the old secret value.

- [ ] **Step 6: Verify fallback and build**

```bash
npm run test:integration -- nvidia-fallback
npm test
npm run build
```

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
- Consumes: current `CanonicalEvent`, canonical entities and store reads.
- Produces: read-only `CoreRecord`, stable source refs and relationships; existing Canon store remains unchanged.

- [ ] **Step 1: Write failing adapter tests using real Canon fixtures**

Use `origin-belonging-1990s`, `israel-police-service-2015-2021`, `starton-return-2022`, `fatherhood-viral-2023-02-20`, `7ya-now-snapshot-2026`.

Assert:

```text
Canonical event ID -> moment:<canonical-event-id>
Canonical public source -> source:<canonical-event-id>:<source-id>
verified -> verified
owner-reported -> owner-reported
supported/inferred -> discovery
unresolved -> unresolved
contradicted/quarantined -> quarantined
```

- [ ] **Step 2: Confirm failure**

```bash
npm run test:unit -- core-adapter
```

- [ ] **Step 3: Implement approved Core envelope**

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

Do not mutate current `CanonicalEvent` to fit this contract.

- [ ] **Step 4: Implement adapters**

Canonical events project to `kind:'moment'`. Explicit person/project/institution objects come from entity/project adapters; do not reinterpret event records as entity records. Source/media/relationship IDs are deterministic from canonical identifiers and normalized source identity.

- [ ] **Step 5: Add read-only routes**

```text
GET /api/core
GET /api/core/:id
```

Keep `/api/corpus`, `/api/graph` and `/api/public-internet-graph` unchanged during migration.

- [ ] **Step 6: Verify**

```bash
npm run test:unit -- core-adapter
npm test
npm run build
```

- [ ] **Step 7: Commit**

```bash
git add apps/7ya-live/shared/core-types.ts apps/7ya-live/backend/core apps/7ya-live/backend/index.ts apps/7ya-live/test
git commit -m "feat: add read-only 7YA Core projection"
```

---

### Task 7: Consolidate Media Identity and Personal-Media Policy

**Files:**
- Create: `apps/7ya-live/backend/media/media-types.ts`
- Create: `apps/7ya-live/backend/media/media-id.ts`
- Create: `apps/7ya-live/backend/media/personal-media-policy.ts`
- Create: `apps/7ya-live/backend/media/media-service.ts`
- Create: `apps/7ya-live/test/unit/personal-media-policy.test.ts`
- Create: `apps/7ya-live/scripts/check-personal-media-policy.mjs`
- Modify: `apps/7ya-live/backend/index.ts`

**Interfaces:**
- Consumes: canonical media, visual locks, current Media/Visual registries and owner-approved records.
- Produces: stable `MediaAsset.assetId`, separate verified/proposed metadata, `resolvePersonalMedia(candidates)`.

- [ ] **Step 1: Write failing priority tests**

Assert exact priority:

```text
canon-personal
owner-approved
verified-public
source-bound
neutral
```

Assert `unverified` or generic/synthetic documentary candidates are never selected for an Igor life scene.

- [ ] **Step 2: Confirm failure**

```bash
npm run test:unit -- personal-media-policy
```

- [ ] **Step 3: Implement stable asset ID**

Use Node `createHash('sha256')` over:

```text
canonicalEventId|kind|normalizedSourceUrl|normalizedAssetUrl
```

and expose `media:` plus the first 24 lowercase hex characters. Never use random IDs for imported public media.

- [ ] **Step 4: Implement media contract**

```ts
export type MediaAsset={
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

No code path automatically copies `proposedMetadata` into `verifiedMetadata`.

- [ ] **Step 5: Put existing registries behind one media service**

Keep legacy `/api/media-registry` and `/api/visual-registry` response shapes for compatibility. New Scene Engine code consumes `media-service.ts` only.

- [ ] **Step 6: Add build policy check**

`check-personal-media-policy.mjs` scans the new scene path for prohibited generic/synthetic personal-media placeholders and fails if such a reference is introduced. It does not claim to classify arbitrary remote images.

- [ ] **Step 7: Verify**

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

### Task 8: Build the Source-Bound Scene Engine

**Files:**
- Create: `apps/7ya-live/backend/story/scene-types.ts`
- Create: `apps/7ya-live/backend/story/scene-engine.ts`
- Create: `apps/7ya-live/test/unit/scene-engine.test.ts`
- Modify: `apps/7ya-live/backend/life-scenes.ts`
- Modify: `apps/7ya-live/backend/index.ts`

**Interfaces:**
- Consumes: Core records, existing `compileLifeScenes`, media service and canonical relationships.
- Produces: approved `SceneRequest`, `Scene`, `composeScenes(request)`; every scene resolves to existing Core/source records.

- [ ] **Step 1: Write failing canonical home-sequence test**

Expected ordered chapter keys:

```ts
['opening','origin','jesse-cohen','service','police','human','starton','public-voice','creation','now']
```

Use current canonical anchors:

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

`jesse-cohen` may compose linked origin/StartOn records; it must not invent a separate event.

- [ ] **Step 2: Add truth-boundary assertions**

For every scene assert `sourceRefs.length > 0`; all source refs resolve to public Core source objects; media refs resolve through media service; `nextSceneIds` resolve in returned composition; AI-proposed metadata never becomes factual summary text.

- [ ] **Step 3: Confirm failure**

```bash
npm run test:unit -- scene-engine
```

- [ ] **Step 4: Implement approved scene types**

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

Homepage is deterministic from Canon/Core. Query-driven NVIDIA ordering is only a candidate sequence: server filters every returned ID through Core and discards unknown IDs before emitting scenes.

- [ ] **Step 6: Add read-only scene routes**

```text
GET /api/scenes?intent=homepage&lang=he&viewport=mobile
GET /api/scenes/:id
```

Keep `/api/life-scenes`, `/api/story-path`, `/api/story-composition` operational.

- [ ] **Step 7: Verify**

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

### Task 9: Cut the Public Homepage to the Scene Engine

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
- Consumes: homepage scene API plus resolved media/source objects.
- Produces: cinematic human-first homepage, simplified navigation, deterministic non-blank fallback.

- [ ] **Step 1: Write failing renderer contract test**

With a fixed scene fixture assert visible chapter title/summary, primary authentic media when provided, original-source action, next-scene navigation and absence of operational/debug labels.

- [ ] **Step 2: Confirm failure**

```bash
npm run test:integration -- home-scene-contract
```

- [ ] **Step 3: Implement presentation-only renderer**

`SceneRenderer.tsx` receives `Scene` plus resolved media/source objects. It does not query Canon, choose verification, call NVIDIA or choose substitute media. Missing media renders restrained typography/source treatment rather than generated/stock imagery.

- [ ] **Step 4: Implement journey with deterministic fallback**

`HomepageSceneJourney.tsx` loads scenes once per locale/viewport. On API failure it uses a source-bound fallback derived from existing life/album data; it never returns a blank shell.

- [ ] **Step 5: Cut over only `/`**

Make Scene Engine journey dominant on homepage. Preserve `/library/`, `/media/`, `/starton/`, `/evidence/`, `/moment/...`, `/entity/...` unchanged. Do not delete legacy homepage components yet.

- [ ] **Step 6: Simplify top-level navigation**

Render `IGOR · LIFE · WORK · MEDIA · STARTON · ASK` as primary visitor navigation, mapping to existing stable routes/anchors. Museum/evidence/research/music/library/search remain available as contextual/deep routes.

- [ ] **Step 7: Strengthen build and visual contracts**

Update `check-home-composition.mjs` and `tests/tests.txt` to require scene journey, source actions, authentic/source-bound media, mobile readability and no dashboard-like first experience.

- [ ] **Step 8: Verify before production**

```bash
npm test
npm run build
```

Deploy a non-production candidate through AppDeploy and run existing visual acceptance for `home` mobile and desktop. Expected: meaningful non-blank content, no critical clipping/overflow, multiple authentic/source-bound visuals, clear hierarchy.

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
- Consumes: grounded answer, Core search, Scene Engine.
- Produces: `relatedCoreIds`, `sceneIds`, `mediaRefs`, `sourceRefs` alongside existing companion fields.

- [ ] **Step 1: Write failing grounded-navigation test**

For a fixture question equivalent to “How is StartOn connected to Igor's childhood?”, assert evidence retrieval occurs; returned Core/scene/source IDs resolve; answer still works with NVIDIA disabled via deterministic retrieval/composition.

- [ ] **Step 2: Confirm failure**

```bash
npm run test:integration -- bro-chat-scenes
```

- [ ] **Step 3: Extend response contract safely**

Add optional structured reference fields without breaking `reply`, `intent`, `suggestions`, `actions`, `spotlight`, `checkpoint`, `provider`, `model`. AI-suggested IDs are server-resolved against Core/Scene Engine before response.

- [ ] **Step 4: Add navigation UI**

Render compact “open moment/story” actions from server-resolved IDs. Keep Bro Chat explicitly identified as AI and retain no-first-person-impersonation policy.

- [ ] **Step 5: Verify**

```bash
npm run test:integration -- bro-chat-scenes
npm test
npm run build
```

Run existing `chat` mobile visual acceptance; composer, SEE/ALIGN/ACT controls and story actions must remain reachable without clipping.

- [ ] **Step 6: Commit**

```bash
git add apps/7ya-live/backend apps/7ya-live/src/StoryCompanion.tsx apps/7ya-live/test
git commit -m "feat: connect Bro Chat answers to story scenes"
```

---

### Task 11: Consolidate Control Plane and Protect Public Routes

**Files:**
- Create: `apps/7ya-live/test/integration/control-plane-auth.test.ts`
- Modify: `apps/7ya-live/backend/index.ts`
- Modify: `apps/7ya-live/src/SocialControlPage.tsx`
- Modify: `apps/7ya-live/src/PersonalCommand.tsx`
- Modify: `apps/7ya-live/src/SiteControl.tsx`
- Modify: `apps/7ya-live/src/App.tsx`

**Interfaces:**
- Consumes: existing `requireAuth()` and `requireAdminEmailAllowlist(ADMIN_EMAILS)`.
- Produces: explicit admin-only operations and public-safe read routes; default public scenes never render operational panels.

- [ ] **Step 1: Write failing authorization matrix test**

Cover current Meta admin sync/status, ingestion extract/commit, Corpus admin upsert, UX admin, social OAuth/control and growth admin stats. Assert non-admin requests cannot reach protected handlers. Assert `/api/core`, `/api/scenes`, `/api/corpus`, `/api/public-projection`, `/api/media-registry` remain public-safe reads.

- [ ] **Step 2: Run matrix**

```bash
npm run test:integration -- control-plane-auth
```

Treat any unexpected unprotected operation as a failure to fix before proceeding.

- [ ] **Step 3: Centralize route policy**

Group/admin-map protected operational routes so boundaries are inspectable in one place. Do not weaken existing auth.

- [ ] **Step 4: Remove public operational chrome**

Ensure `SiteControl`, `PersonalCommand`, social diagnostics and system health appear only on explicit admin/control routes, never on default homepage/scene journey.

- [ ] **Step 5: Verify and commit**

```bash
npm run test:integration -- control-plane-auth
npm test
npm run build
git add apps/7ya-live/backend/index.ts apps/7ya-live/src apps/7ya-live/test
git commit -m "refactor: separate public and control planes"
```

---

### Task 12: Establish Git-to-AppDeploy Release Provenance, Visual Gate and Rollback

**Files:**
- Create: `apps/7ya-live/shared/release-provenance.ts`
- Create: `apps/7ya-live/scripts/check-release-provenance.mjs`
- Create: `apps/7ya-live/test/unit/release-provenance.test.ts`
- Create: `apps/7ya-live/RELEASE.md`
- Modify: `apps/7ya-live/scripts/check-release-coherence.mjs`
- Modify: `apps/7ya-live/backend/index.ts`
- Modify: `docs/CI_RUNBOOK.md`

**Interfaces:**
- Consumes: a known Git functional-source commit, AppDeploy candidate version and visual acceptance.
- Produces: production `/api/release` points to the Git functional-source commit; repository release record maps that commit to AppDeploy version; previous version is documented rollback target.

**Provenance semantics:** A Git commit cannot contain its own SHA. Therefore `sourceCommit` means the commit containing all functional source changes before the metadata-only provenance commit. The following metadata commit contains `release-provenance.ts`; production reports the functional-source commit, while repository history proves the metadata commit changed only release metadata. This avoids false self-referential provenance.

- [ ] **Step 1: Write failing provenance test**

`release-provenance.test.ts` imports the metadata module and asserts `sourceCommit` matches `/^[a-f0-9]{40}$/`, repository equals `7guard-io/7ya.io`, AppDeploy app ID equals `697a008fddc309b142`.

- [ ] **Step 2: Confirm failure**

```bash
npm run test:unit -- release-provenance
```

- [ ] **Step 3: Commit functional source before metadata**

Finish Tasks 1-11 with a clean worktree and record:

```bash
git rev-parse HEAD
```

That 40-character SHA becomes `sourceCommit`.

- [ ] **Step 4: Create provenance module**

Create:

```ts
export const releaseProvenance={
  repository:'7guard-io/7ya.io',
  sourceCommit:'0000000000000000000000000000000000000000',
  appDeployAppId:'697a008fddc309b142'
} as const;
```

Before committing, replace the 40-zero sentinel with the exact SHA captured in Step 3. `check-release-provenance.mjs` fails if the sentinel remains or if the SHA is malformed.

- [ ] **Step 5: Return provenance from `/api/release`**

Import `releaseProvenance` in `backend/index.ts`. Replace stale hard-coded Git provenance with `releaseProvenance.sourceCommit`. `source_alignment` may report `GIT_ALIGNED` only after the AppDeploy candidate built from these changes passes live acceptance; before deployment it remains `CANDIDATE_NOT_YET_VERIFIED`.

- [ ] **Step 6: Document exact release/rollback gate**

`RELEASE.md` requires this order:

```text
npm test
npm run build
clean Git worktree
sourceCommit recorded
AppDeploy previous version recorded
AppDeploy candidate deployed
terminal AppDeploy status ready
frontend/backend errors empty
home mobile visual acceptance PASS
home desktop visual acceptance PASS
chat mobile visual acceptance PASS
/api/release sourceCommit matches repository
7ya.io domain proof matches candidate release
```

Rollback is `apply_app_version(app_id, previousVersion)` followed by terminal status and QA verification.

- [ ] **Step 7: Run full local gate and commit metadata**

```bash
npm test
npm run build
git add apps/7ya-live/shared/release-provenance.ts apps/7ya-live/scripts apps/7ya-live/test apps/7ya-live/backend/index.ts apps/7ya-live/RELEASE.md docs/CI_RUNBOOK.md
git commit -m "docs: bind 7YA release provenance and rollback gate"
```

Verify this metadata commit contains no functional migration changes beyond provenance/runbook wiring.

- [ ] **Step 8: Record rollback version and deploy candidate**

Query AppDeploy versions for app `697a008fddc309b142`; record the current last-known-good version before deployment. Apply the Git-reviewed file changes to AppDeploy using its update/deploy mechanism, then poll status in the same execution until terminal state. If QA/runtime fails, fix/redeploy within bounded retries; do not claim success.

- [ ] **Step 9: Run live acceptance**

Verify `7ya.io`, `www.7ya.io`, `/api/health`, `/api/release`, homepage mobile/desktop, Bro Chat mobile, StartOn, one Moment, one Entity, media and evidence. If any gate fails, reapply the recorded previous AppDeploy version first.

- [ ] **Step 10: Record AppDeploy mapping in Git**

After the candidate receives its AppDeploy version, add a release record under `docs/releases/` containing `sourceCommit`, metadata commit, AppDeploy version, acceptance result and rollback version. Commit this record; it is audit history, not application source.

---

### Task 13: Deprecate Superseded Layers Only After Acceptance

**Files:**
- Create: `apps/7ya-live/docs/DEPRECATIONS.md`
- Modify/Delete: only legacy presentation files proven unused after Scene Engine cutover
- Modify: `apps/7ya-live/src/App.tsx`
- Modify: `apps/7ya-live/scripts/check-home-composition.mjs`
- Modify: `apps/7ya-live/backend/intelligence/nvidia-credentials.ts`
- Modify: `apps/7ya-live/tests/tests.txt`

**Interfaces:**
- Consumes: accepted homepage, route coverage, import/reference search and visual gates.
- Produces: no competing homepage engines; old NVIDIA alias removed only after scoped credentials prove ready.

- [ ] **Step 1: Build deprecation evidence**

Search imports/usages of accumulated home/experience components. Record each candidate, replacement and import/route proof in `docs/DEPRECATIONS.md`. A component with a remaining route/import is not a deletion candidate.

- [ ] **Step 2: Add canonical-home regression check**

Make `check-home-composition.mjs` fail if `App.tsx` reintroduces a second public homepage engine alongside `HomepageSceneJourney`.

- [ ] **Step 3: Remove one reviewed batch at a time**

For each batch:

```bash
npm test
npm run build
```

Commit each independently reviewable batch; do not mass-delete similarly named files.

- [ ] **Step 4: Remove legacy NVIDIA alias only after real readiness**

When gateway health has passed using `NVIDIA_NIM_API_KEY` and/or `NVCF_API_KEY`, delete `NVIDIA_API_KEY` compatibility reporting and remove the old AppDeploy secret. Before then it remains inert and labeled legacy; never infer its scope.

- [ ] **Step 5: Run final route and visual regression**

Run all tests/build checks and live visual acceptance for home, chat, library, moment, entity, StartOn, media, evidence. Verify canonical URLs and original-source actions still resolve.

- [ ] **Step 6: Commit final cleanup**

```bash
git add -A apps/7ya-live
git commit -m "refactor: retire superseded 7YA presentation layers"
```

---

## Cross-Task Acceptance Matrix

| Requirement | Tasks | Proof |
| --- | --- | --- |
| Production source exists in canonical Git | 1, 12 | source manifest + release provenance + AppDeploy mapping |
| New behavior has tests | 2-13 | Vitest + existing build checks |
| NVIDIA credentials are unambiguous | 3-5 | selector/gateway tests + health |
| NVIDIA is not a single point of failure | 4, 5, 10 | fallback integration tests |
| Canon remains authoritative | 6, 8, 10 | adapter/scene/chat resolution tests |
| Discovery is not silently promoted | 6 | conservative verification mapping |
| Authentic Igor media is preferred | 7 | media-policy tests + build check |
| Scene Engine cannot invent biography | 8 | Core/source binding assertions |
| Homepage is cinematic/human-first | 9 | renderer contract + mobile/desktop visual acceptance |
| Bro Chat navigates into story | 10 | grounded-navigation integration test |
| Public/admin planes are separated | 11 | auth matrix + public visual regression |
| Rollback is operational | 12 | previous AppDeploy version + apply/verify procedure |
| Legacy layers disappear safely | 13 | usage proof + per-batch gates |

## Final Verification Sequence

From canonical Git workspace:

```bash
cd apps/7ya-live
npm test
npm run build
```

Then production acceptance:

```text
1. AppDeploy terminal status = ready
2. frontend errors = 0
3. backend errors = 0
4. /api/health = success
5. /api/release sourceCommit = recorded functional-source commit
6. NVIDIA health accurately reports ready/degraded/not-configured and exposes no secret values
7. home visual acceptance = PASS on mobile and desktop
8. chat visual acceptance = PASS on mobile
9. library/moment/entity/StartOn/media/evidence render meaningful content
10. domain proof confirms 7ya.io is serving the candidate release
```

If any production gate fails, reapply the recorded last-known-good AppDeploy version first, then diagnose from Git. Never leave a production-only patch unreconciled.
