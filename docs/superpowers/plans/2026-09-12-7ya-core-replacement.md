# 7YA Core Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Converge 7YA public content into one runtime Core Store and cut primary public routes over to Core projections without losing public history, Bro Chat or source provenance.

**Architecture:** Seed one `CoreRecord` store from the currently active public corpus/projection, then make all primary routes read only Core projections. Persist route composition separately so ordering, featured content, visibility and copy can change at runtime without React deployments. Keep legacy endpoints only as a temporary migration/enrichment adapter until live parity is verified.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy backend router/database/auth, existing 7YA canonical corpus and public projection as migration inputs.

**Spec:** `docs/superpowers/specs/2026-09-12-7ya-core-replacement-design.md`

## Global Constraints

- Base implementation on the currently applied AppDeploy snapshot, not an assumed GitHub copy.
- User-visible success is the canonical `https://7ya.io` result; build/CI/HTTP success is insufficient.
- One Core record is the public source of truth after migration; legacy systems may only enrich or support migration.
- No private material is auto-published.
- Existing source provenance and trust state must survive migration.
- External social APIs are enrichment, never required to render already-ingested history.
- Runtime composition changes must not require a frontend deploy.
- Maintain Hebrew, English and Russian public presentation.
- Preserve Bro Chat and internal/admin compatibility during the first cutover.
- Do not delete legacy systems until Core parity is verified and rollback remains available.

---

### Task 1: Define the Core contract and migration tests

**Files:**
- Create: `backend/core/types.ts`
- Create: `backend/core/migrate.ts`
- Modify: `tests/tests.txt`

**Interfaces:**
- Produces: `CoreRecord`, `CoreComposition`, `migrateProjectionItems(items)` and deterministic URL-key merging.
- Consumes: current `/api/public-projection` item shape as migration input.

- [ ] **Step 1: Write the failing acceptance tests**

Replace the existing AppDeploy test suite with five coverage-complete workflows that require: Core root rendering, runtime Core route projection, mobile authentic media, Bro Chat continuity, and a negative empty/error state. Exactly one test is marked `[sanity]`.

- [ ] **Step 2: Verify RED against the current production snapshot**

Expected failures before implementation: `/api/core/project/home` does not exist; public pages do not expose the new Core source marker; runtime composition cannot drive route ordering through Core.

- [ ] **Step 3: Implement `backend/core/types.ts`**

Define the approved `CoreRecord`, localized text, media, source, metric, trust/status, route and composition types exactly as specified in the design.

- [ ] **Step 4: Implement pure migration normalization in `backend/core/migrate.ts`**

Rules: merge by canonical ID when present; otherwise generate deterministic public IDs from normalized source URLs; dedupe sources/media/metrics; preserve trust/status; derive route hints/domains without inventing facts; keep only public visibility in the public migration.

- [ ] **Step 5: Verify type/build checks remain clean**

Expected: new pure modules compile but acceptance tests remain red because no Core routes exist yet.

### Task 2: Build the bounded Core Store

**Files:**
- Create: `backend/core/store.ts`

**Interfaces:**
- Consumes: `CoreRecord`, `CoreComposition`, migration normalization.
- Produces: `ensureCoreSeeded()`, `listCoreRecords()`, `getCoreRecord()`, `upsertCoreRecord()`, `getComposition()`, `updateComposition()`.

- [ ] **Step 1: Define bounded storage tables**

Use `core_records_v1` rows shaped `{ key, record, updatedAt, seedVersion }` and `core_composition_v1` with one bounded global row. Never depend on database-generated IDs as public Core IDs.

- [ ] **Step 2: Implement one-time convergence seed**

When Core is empty, fetch the currently live legacy `/api/public-projection` in bounded pages, normalize and batch records, then persist them. After seed, ordinary reads use Core only and do not silently rebuild from legacy on each request.

- [ ] **Step 3: Add default runtime composition**

Provide route order, localized titles/descriptions, domain priority, featured IDs, hidden IDs and limits for `home`, `story`, `media`, `politics`, `starton`, `music`, `research`, `archive`.

- [ ] **Step 4: Add explicit protected refresh/upsert primitives**

Core writes replace/merge the relevant logical record only; no automatic publication of private material.

### Task 3: Build one projection engine and Core API

**Files:**
- Create: `backend/core/projection.ts`
- Create: `backend/core/routes.ts`
- Modify: `backend/index.ts`

**Interfaces:**
- Produces public routes `GET /api/core/records`, `GET /api/core/records/:id`, `GET /api/core/project/:route`, `GET /api/core/composition`.
- Produces protected routes `POST /api/core/admin/record`, `POST /api/core/admin/composition`, `POST /api/core/admin/refresh`.

- [ ] **Step 1: Implement projection rules**

Filter public records by route hints/domains/media type, then order featured IDs first, configured domain priority second, importance third and chronology fourth. Search uses the same Core records.

- [ ] **Step 2: Implement API handlers**

Public handlers return `source: '7ya-core'`, release marker, composition and projected records. Protected mutation handlers use existing owner email allowlist and AppDeploy auth middleware.

- [ ] **Step 3: Register `coreRoutes` in `backend/index.ts`**

Add one import and spread the Core route object into the existing router. Do not restructure unrelated backend code in this cutover step.

- [ ] **Step 4: Verify the Core endpoint contract**

Expected: `GET /api/core/project/home` returns a populated, source-linked record set from Core Store and reports its Core release/source marker.

### Task 4: Build the public Core frontend shell

**Files:**
- Create: `src/core/core-types.ts`
- Create: `src/core/core-client.ts`
- Create: `src/core/Router.tsx`
- Create: `src/core/ExperienceShell.tsx`
- Create: `src/core/PageRenderer.tsx`
- Create: `src/core/BroChat.tsx`
- Create: `src/core/core.css`
- Replace: `src/App.tsx`

**Interfaces:**
- `core-client.ts` uses `api` from `@appdeploy/client` to call `/api/core/project/:route`.
- `Router` maps primary public paths to Core route keys and preserves temporary internal/admin compatibility routes.
- `PageRenderer` renders only data received from Core projection.

- [ ] **Step 1: Implement Core client states**

Expose explicit loading, populated and recoverable error/empty states. Do not fall back to old public React page systems when a Core request fails.

- [ ] **Step 2: Implement `ExperienceShell`**

Provide one navigation system for Home, Story, Media, Politics, StartOn, Music, Research and Archive, with localized labels and no dated repair layer dependency.

- [ ] **Step 3: Implement `PageRenderer`**

Render route title/description, featured/source-linked records, authentic record media, chronology/source metadata and empty/error state. The same component serves every public route.

- [ ] **Step 4: Preserve Bro Chat**

Wrap the existing `StoryCompanion` through `src/core/BroChat.tsx` so the conversation capability survives the cutover without duplicating its backend.

- [ ] **Step 5: Replace the active public entrypoint**

`App.tsx` becomes providers + `Router`. Remove imports for dated public repair CSS layers and the prior public-route special-case tree. Keep explicit compatibility handling only for required internal/admin pages.

### Task 5: Make composition runtime-editable

**Files:**
- Modify: `backend/core/store.ts`
- Modify: `backend/core/routes.ts`
- Modify: `src/core/PageRenderer.tsx`

**Interfaces:**
- Admin composition payload: `{ route, patch: { title?, description?, domainPriority?, featuredIds?, hiddenIds?, limit? } }`.

- [ ] **Step 1: Validate route composition patches**

Reject unknown routes, invalid limits, non-string IDs and non-array domain priorities.

- [ ] **Step 2: Persist composition without deployment**

Update only the selected route configuration while preserving all other composition state.

- [ ] **Step 3: Prove runtime behavior**

Changing domain priority/featured IDs through the protected endpoint changes the next Core projection response without source-code modification or deploy.

### Task 6: Production cutover and user-eye verification

**Files:**
- Modify: `tests/tests.txt` only if QA reveals a test contract mismatch rather than a product defect.

**Interfaces:**
- AppDeploy applied snapshot and canonical `https://7ya.io`.

- [ ] **Step 1: Deploy once from the current applied snapshot**

Send only changed/new files. Preserve previous snapshot as rollback.

- [ ] **Step 2: Poll AppDeploy through terminal QA**

Do not stop at `deploying` or `deployed_and_testing`. If e2e fails, inspect QA run details before any repair.

- [ ] **Step 3: Verify canonical domain, not only AppDeploy preview**

Check desktop and mobile root, media, politics, StartOn, archive and Bro Chat. Confirm visible Core content, authentic media, no blank state, no old duplicate homepage, and no frontend/backend runtime errors.

- [ ] **Step 4: Verify migration parity**

Compare migrated Core record/source/media counts to the legacy projection counts captured immediately before cutover. Any unexplained loss blocks legacy deletion.

- [ ] **Step 5: Verify runtime composition**

Change one non-destructive ordering rule, observe the canonical site/projection change without deploying, then restore or keep the intended ordering.

### Task 7: Freeze and retire legacy public dependencies

**Files:**
- Follow-up changes after parity proof: `backend/index.ts`, obsolete `shared/*` projection registries, obsolete public components/CSS.

**Interfaces:**
- Core endpoints and Core frontend remain unchanged.

- [ ] **Step 1: Inventory actual runtime imports after cutover**

Mark each legacy system as `migration-only`, `integration-only`, or `unused`.

- [ ] **Step 2: Remove unused public-route dependencies in bounded batches**

Delete only modules that have zero Core/runtime dependency and re-run the full user-eye acceptance suite after each bounded cleanup batch.

- [ ] **Step 3: Keep ingestion adapters, not parallel truth stores**

Social/API integrations may transform external objects into Core records but may not create a second public source of truth.

- [ ] **Step 4: Update release truth**

Set release metadata to state that Core Store is the public runtime source of truth and record the rollback snapshot plus remaining migration-only adapters.
