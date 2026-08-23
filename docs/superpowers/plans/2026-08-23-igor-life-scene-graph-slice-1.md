# IGOR LIFE SCENE GRAPH — Slice 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the hard-coded seven-scene ceiling by introducing a deterministic, read-only Life Scene Graph projection over the current public canon and verified media layer, then render it through the existing `IgorSceneEngine` on Home, Museum and Media without weakening trust or privacy rules.

**Architecture:** Keep `shared/canonical-corpus.ts` as the high-trust source of canonical life facts. Add focused `shared/life-scenes.ts` projection types/compiler that can merge canonical events with verified structured appearances into source-linked `LifeScene` objects. Expose these through read-only backend routes, then replace the primary hard-coded array in `src/IgorSceneEngine.tsx` with API-driven scene data while retaining a small public-safe fallback only for outage resilience.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy backend router, `@appdeploy/client`, current canonical corpus v2.

**Spec:** `docs/superpowers/specs/2026-08-23-igor-life-scene-graph-design.md`

## Global Constraints

- Production source of truth for execution is AppDeploy app `697a008fddc309b142`, applied version `1787486433696`; historical `appdeploy-live/*` GitHub snapshots must not overwrite it.
- Canonical corpus schema v2 remains unchanged in Slice 1.
- Discovery remains non-canonical and is not allowed to manufacture dates, people, opinions or causal claims.
- Private/restricted Drive content is not published.
- SRT references are not full transcripts.
- Person-specific opinion is never invented.
- Host, collaborator, partner, publisher and distributor remain distinct relationship roles.
- Source-local metrics remain source-local; no unsupported aggregate reach.
- HE/EN/RU remain first-class; unsupported first-person language must not be invented.
- No collage-first redesign and no new competing persistent navigation.
- Dynamic source outages must degrade gracefully without erasing the canonical journey.

---

### Task 1: Lock the dynamic-scene acceptance contract

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: current production UI/API behavior.
- Produces: a failing acceptance contract that cannot pass while `IgorSceneEngine` depends on the seven-item hard-coded scene list.

- [ ] **Step 1: Add a new sanity test for dynamic scene coverage**

Append a test requiring:
1. `GET /api/life-scenes?lens=home&limit=50` returns a release id, coverage summary and more than seven public scenes when the current canonical/verified inputs contain more than seven eligible records.
2. Returned scenes include at least one `service`, `starton`, `media/public-action`, `music/creator`, `research`, `7ya/now` bridge when eligible records exist.
3. Every returned scene has at least one public source URL and explicit trust.
4. Home `IGOR / SCENE ENGINE` consumes the API and renders more than the legacy seven selectors over the full dataset while keeping a focused visible subset at once.
5. Media view prioritizes media scenes without losing their related life context.

- [ ] **Step 2: Deploy only the test change as a candidate version and verify RED**

Expected: the new test fails because `/api/life-scenes` does not exist and the current Scene Engine still uses a hard-coded array.

### Task 2: Add deterministic shared scene projection

**Files:**
- Create: `shared/life-scenes.ts`
- Modify: `shared/canonical-corpus.ts` only if an exported helper is strictly required; do not change schema v2.

**Interfaces:**
- Consumes: `CanonicalEvent[]` from the existing corpus and normalized verified appearance records supplied by the backend adapter.
- Produces:
  - `SceneTrust`, `SceneKind`, `SceneLens`, `LifeScene`, `SceneSourceRef`, `SceneMediaRef`, `ScenePersonRef`, `SceneCoverageSummary` types.
  - `compileLifeScenes(input:LifeSceneCompilerInput):LifeSceneProjection`.
  - `projectLifeScenes(scenes:LifeScene[], query:LifeSceneQuery):LifeScene[]`.

- [ ] **Step 1: Write a failing compiler contract test through the AppDeploy acceptance harness**

The test data should prove that two source records sharing a canonical event/URL do not become duplicate scenes, that public canonical events preserve story order, and that a verified appearance can enrich a matching canonical scene without changing canonical trust.

- [ ] **Step 2: Implement the minimal shared types and canonical-event projection**

Rules:
- one canonical public event => one base scene;
- `trust='canonical'` for canonical events;
- scene kind derives deterministically from canonical `type`, surfaces and tags;
- each scene carries public sources only;
- media omits `unverified` objects;
- date/datePrecision/storyOrder are copied, not reinterpreted;
- first-person `narrative` is absent by default unless explicitly supplied by a trusted source adapter.

- [ ] **Step 3: Add verified-appearance enrichment adapter support**

Verified/documented appearances may add source/media/topic/person context. They may create standalone scenes only when the adapter supplies a public URL plus sufficiently resolved identity/date metadata. `requires-confirmation` entries remain supported/discovery trust and do not anchor exact chronology.

- [ ] **Step 4: Add deterministic de-duplication and lens projection**

Deduplicate by canonical event id first, then normalized public URL. Preserve separate events when the duplicate relationship is uncertain. Lens ranking changes order/selection only; it never changes trust.

- [ ] **Step 5: Add coverage summary**

Coverage must expose at least: total scenes, canonical represented, verified appearances represented, scenes by kind, scenes without visual, scenes without exact/year date, and required biography dimensions currently represented.

### Task 3: Expose read-only Life Scene APIs

**Files:**
- Modify: `backend/index.ts`
- Create only if needed for focus: `backend/life-scenes.ts`

**Interfaces:**
- Consumes: `readCanonicalCorpus({limit:100})`, structured appearance data, `compileLifeScenes`.
- Produces:
  - `GET /api/life-scenes`
  - `GET /api/life-scenes/:id`
  - `GET /api/life-coverage`

- [ ] **Step 1: Obtain AppDeploy API SDK constraints before backend edits**

Use the current AppDeploy API reference and follow router/response rules.

- [ ] **Step 2: Implement `lifeScenesPayload(query)`**

Bound `limit` to 200; accept `lens`, `kind`, `trust`, `from`, `to`, `topic`; sanitize all query strings using existing backend `clean` patterns.

- [ ] **Step 3: Implement single-scene lookup**

Return 404 for unknown/non-public scene ids. Return public provenance and related public scenes only.

- [ ] **Step 4: Implement coverage endpoint**

No write side effects. If optional enrichment fails, return canonical projection plus degraded-source metadata instead of an empty result.

- [ ] **Step 5: Verify API GREEN**

Expected: `/api/life-scenes?lens=home&limit=50` returns >7 scenes from current eligible material, no private sources, deterministic trust labels, and coverage counts consistent with returned data.

### Task 4: Replace the hard-coded Scene Engine ceiling

**Files:**
- Modify: `src/IgorSceneEngine.tsx`
- Modify: `src/igor-scene-engine.css` only as required for dynamic selector density.
- Create: `src/life-scenes-client.ts` if it keeps transport/types focused.

**Interfaces:**
- Consumes: `GET /api/life-scenes?lens=<view>`.
- Produces: dynamic scene rendering with canonical/public-safe fallback.

- [ ] **Step 1: Add a typed client fetcher**

`fetchLifeScenes(lens:string, limit:number)` returns `{scenes,coverage}` and throws on malformed/unavailable responses.

- [ ] **Step 2: Replace primary `scenes` / `viewMap` arrays with API state**

Keep only a minimal fallback array sufficient for outage resilience. It must not remain the normal source of the rendered Scene Engine.

- [ ] **Step 3: Map graph scenes into the existing visual grammar**

Render: year/date, kind, title, people/roles, source, media, trust, and aftermath/related context where available. Do not generate a fake `NOW` reflection when a source-backed reflection is absent.

- [ ] **Step 4: Keep the selector usable with dozens of scenes**

Use a bounded, scrollable/virtual-like selector rail or grouped visible window that does not require horizontal overflow to understand the story on mobile. Show total scene count and allow sequential navigation.

- [ ] **Step 5: Preserve deep-route lens behavior**

`music`, `media`, `research`, `museum`, `home` request their corresponding lens; unknown views fall back to `home` lens without changing data trust.

### Task 5: Production verification and release receipt

**Files:**
- Modify as needed only if verification exposes defects.
- Record final release in GitHub using the existing release receipt/snapshot workflow after production validation.

**Interfaces:**
- Consumes: deployed candidate version.
- Produces: applied production version with verified runtime/API/visual behavior.

- [ ] **Step 1: Run full AppDeploy build/e2e acceptance**

Expected: new dynamic-scene test GREEN and existing cinematic, mobile and Digital Igor tests remain GREEN.

- [ ] **Step 2: Inspect backend/frontend/network errors**

Expected: zero new runtime errors on the candidate.

- [ ] **Step 3: Inspect desktop QA screenshot**

Expected: home remains cinematic; Scene Engine is visibly richer and does not read as a dashboard or wall of tiny cards.

- [ ] **Step 4: Inspect mobile QA screenshot**

Expected: no page-level horizontal overflow, no competing dock, readable selectors, dominant media remains intact.

- [ ] **Step 5: Apply the verified candidate version**

Only after test/runtime/visual gates are satisfied.

- [ ] **Step 6: Verify production after apply**

Re-query `/api/life-scenes`, inspect fresh QA/errors, and confirm the canonical domain is serving the new release.

- [ ] **Step 7: Record release receipt in GitHub**

Include applied AppDeploy version, acceptance result, runtime error count, and explicit note that Slice 1 does not yet publish raw transcript archives or expand private content.
