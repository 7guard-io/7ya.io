# 7YA vNext Total Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile the live AppDeploy v95 application and rebuild 7YA as one coherent, permanent-memory product: one person → one story → one graph → one archive → one experience.

**Architecture:** Preserve the current live corpus, graph, discovery, visual-registry, social, media, Companion and growth capabilities behind adapters. Add an append-only permanent archive and placement layer, then rebuild all public surfaces as projections of shared contracts rather than independent hard-coded datasets.

**Tech Stack:** React 19, Vite 6, TypeScript 5.7, AppDeploy frontend client, AppDeploy backend SDK, AppDeploy DB + Storage behind repository interfaces, existing Canonical Corpus v2, Content Graph v3, social OAuth/feed code, Visual Registry and Discovery Library.

**Spec:** `docs/superpowers/specs/2026-08-23-7ya-vnext-total-reset-design.md`

## Global Constraints

- Production baseline is AppDeploy v95, version `1787465482461`; GitHub `main` is not a safe source baseline until reconciliation completes.
- Never delete or retire a legacy presentation/data layer before source, URL, media, metric and unresolved-lead parity is proven.
- Storage is complete; presentation is curated.
- Once a public object is discovered, normal operation must never depend on rediscovering it to render its archival record.
- Real public/source-linked media takes precedence over generic assets.
- Home must remain a human editorial story, not a database/dashboard.
- One canonical event may have many archive objects, mirrors, metrics and placements; never duplicate the event merely to represent distribution.
- Existing indexed routes remain functional during migration.
- Mobile is the primary acceptance viewport; interactive targets must be at least 44 px and no horizontal page overflow is allowed.
- Hebrew, English and Russian remain first-class; existing Spanish route continuity is preserved.
- Large binary media belongs in object storage, not Git.
- AppDeploy server SDK is backend-only; `@appdeploy/client` is frontend-only.
- All protected write operations retain authentication/admin gates and dry-run behavior where currently present.
- No production deployment is part of this implementation plan until the repository source baseline, automated checks and migration gates are green.

---

## Target File Structure

The following structure is the intended end state after v95 source reconciliation. Existing files remain until their replacement passes parity gates.

```text
shared/vnext/
  archive-contract.ts       # ArchiveObject, ArchiveVersion, ArchiveAsset metadata
  event-contract.ts         # CanonicalEvent extension/link contract
  placement-contract.ts     # SurfacePlacement and chapter roles
  normalize.ts              # URL/text/date normalizers
  dedup.ts                  # identity keys and duplicate/mirror resolution
  projection.ts             # home/archive/media projection types

backend/vnext/
  archive-store.ts          # paginated append-only DB repository
  archive-assets.ts         # AppDeploy Storage repository
  ingest-service.ts         # capture receipt + normalize + hash + version
  resolution-service.ts     # archive object ↔ canonical event linking
  placement-store.ts        # curated placement persistence/read
  search-service.ts         # unified canonical + archive search
  projection-service.ts     # home/event/route projections
  legacy-adapters.ts        # corpus/discovery/social/public-register adapters

src/vnext/
  api.ts                    # typed API client only
  VNextHome.tsx             # seven-chapter composition
  vnext.css                 # coherent editorial system tokens/layout
  chapters/
    IgorChapter.tsx
    LifeChapter.tsx
    SignalChapter.tsx
    WorkChapter.tsx
    IdeasChapter.tsx
    ArchiveGateway.tsx
    YouChapter.tsx
  archive/
    ArchiveExplorer.tsx
    ArchiveObjectView.tsx
  media/
    MediaProjection.tsx
  components/
    StoryHero.tsx
    ChronologyChapter.tsx
    DocumentaryFrame.tsx
    VideoMoment.tsx
    SourceObject.tsx
    EchoChain.tsx
    ReactionField.tsx
    ProjectChapter.tsx
    IdeaEssay.tsx
    ContextRail.tsx
    NextMovePanel.tsx

tests/vnext/
  normalize.test.ts
  dedup.test.ts
  archive-store.test.ts
  ingest-service.test.ts
  legacy-parity.test.ts
  search-service.test.ts
  projection-service.test.ts
  home-contract.test.ts

tests/vnext-acceptance.txt
```

---

### Task 0: Reconcile AppDeploy v95 into a version-controlled source baseline

**Files:**
- Create after export: `docs/architecture/appdeploy-v95-reconciliation.md`
- Verify against live source: `package.json`, `backend/**`, `shared/**`, `src/**`, `public/**`, `tests/**`
- Do not modify production behavior in this task.

**Interfaces:**
- Consumes: AppDeploy app `697a008fddc309b142`, version `1787465482461`.
- Produces: one version-controlled source tree byte/line-equivalent for all application source files and a reconciliation report.

- [ ] **Step 1: Export the complete v95 source snapshot into an isolated reconciliation branch/worktree.**

The export must include every path returned by the AppDeploy source manifest, not a hand-selected subset.

- [ ] **Step 2: Prove the export contains the live release markers.**

Run:

```bash
rg -n "7ya-public-ingestion-20260823-2|CANONICAL-CORPUS-20260823-2|canonical_corpus_overlay|DISCOVERY_NOT_CANONICAL" backend shared src
```

Expected: all four live markers are found.

- [ ] **Step 3: Prove the stale GitHub baseline is not silently mixed into the export.**

Run:

```bash
git status --short
git diff --stat main...HEAD
```

Expected: reconciliation differences are explicit and reviewable; no untracked source files.

- [ ] **Step 4: Build the exact reconciled v95 source before any vNext changes.**

Run:

```bash
npm ci
npm run build
```

Expected: PASS.

- [ ] **Step 5: Record parity metadata.**

`docs/architecture/appdeploy-v95-reconciliation.md` must contain:

```text
AppDeploy app: 697a008fddc309b142
Version: 1787465482461
Release: 7ya-public-ingestion-20260823-2
Source alignment before reconciliation: APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT
Git baseline before reconciliation: main@ad98380bb1f3b588aa33b7a974ff3eb3b5bda901
Build result: PASS/FAIL with command output reference
```

- [ ] **Step 6: Commit only the reconciliation baseline.**

```bash
git add -A
git commit -m "chore: reconcile AppDeploy v95 source baseline"
```

No vNext feature code belongs in this commit.

---

### Task 1: Add executable test infrastructure before production code

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tests/vnext/smoke.test.ts`
- Rewrite: `tests/tests.txt` only after preserving its existing four cases in the migration report.

**Interfaces:**
- Produces: `npm run test:run` and `npm run ci:vnext`.

- [ ] **Step 1: Write a failing smoke test that imports the not-yet-created vNext contracts.**

```ts
import {describe,expect,it} from 'vitest';
import {VNEXT_SCHEMA_VERSION} from '../../shared/vnext/archive-contract';

describe('vNext contracts',()=>{
  it('pins schema version 1',()=>expect(VNEXT_SCHEMA_VERSION).toBe(1));
});
```

- [ ] **Step 2: Add Vitest and scripts.**

Target scripts:

```json
{
  "test":"vitest",
  "test:run":"vitest run",
  "ci:vnext":"npm run test:run && npm run build"
}
```

- [ ] **Step 3: Run and verify RED.**

```bash
npm run test:run
```

Expected: FAIL because `shared/vnext/archive-contract.ts` does not exist.

- [ ] **Step 4: Do not implement the contract yet. Commit only test infrastructure.**

```bash
git add package.json package-lock.json vitest.config.ts tests/vnext/smoke.test.ts
git commit -m "test: establish vNext contract test harness"
```

---

### Task 2: Implement vNext shared contracts and canonical normalization

**Files:**
- Create: `shared/vnext/archive-contract.ts`
- Create: `shared/vnext/event-contract.ts`
- Create: `shared/vnext/placement-contract.ts`
- Create: `shared/vnext/normalize.ts`
- Create: `tests/vnext/normalize.test.ts`

**Interfaces:**
- Produces:
  - `ArchiveObject`
  - `ArchiveAsset`
  - `ArchiveVersion`
  - `SurfacePlacement`
  - `normalizePublicUrl(url:string):string`
  - `archiveIdentityKey(input:{canonicalUrl:string;sourcePlatform:string;objectType:string}):string`

- [ ] **Step 1: Write failing normalization tests.**

Tests must prove:

```ts
expect(normalizePublicUrl('https://example.com/a/?utm_source=x&fbclid=1#frag')).toBe('https://example.com/a');
expect(normalizePublicUrl('https://www.youtube.com/watch?v=abc123&utm_source=x')).toBe('https://www.youtube.com/watch?v=abc123');
expect(normalizePublicUrl('https://www.instagram.com/p/ABC/?igsh=xyz')).toBe('https://www.instagram.com/p/ABC');
```

- [ ] **Step 2: Run RED.**

```bash
npm run test:run -- tests/vnext/normalize.test.ts
```

- [ ] **Step 3: Implement minimal typed contracts and normalization.**

Do not embed storage-provider-specific fields except the neutral `storageKey`.

- [ ] **Step 4: Run GREEN.**

```bash
npm run test:run -- tests/vnext/normalize.test.ts tests/vnext/smoke.test.ts
```

- [ ] **Step 5: Commit.**

```bash
git add shared/vnext tests/vnext
 git commit -m "feat(vnext): add archive event and placement contracts"
```

---

### Task 3: Implement duplicate and mirror resolution

**Files:**
- Create: `shared/vnext/dedup.ts`
- Create: `tests/vnext/dedup.test.ts`

**Interfaces:**
- Produces:
  - `dedupArchiveObjects(objects:ArchiveObject[]):DedupResult`
  - `DedupResult={primary:ArchiveObject[];duplicates:DuplicateRelation[]}`

- [ ] **Step 1: Write failing tests for three identities.**

Cases:
1. same normalized URL + tracking parameters → one object;
2. same content hash on different publisher URLs → retain both URLs and emit `mirror` relation;
3. same story with different source-local metrics → never merge metric snapshots into one metric.

- [ ] **Step 2: Run RED.**

```bash
npm run test:run -- tests/vnext/dedup.test.ts
```

- [ ] **Step 3: Implement deterministic dedup.**

The algorithm may collapse URL aliases but must preserve historically meaningful distribution as relationships.

- [ ] **Step 4: Run GREEN and commit.**

```bash
npm run test:run -- tests/vnext/dedup.test.ts
git add shared/vnext/dedup.ts tests/vnext/dedup.test.ts
git commit -m "feat(vnext): preserve distribution while deduplicating archive objects"
```

---

### Task 4: Build legacy adapters and a parity report before persistence migration

**Files:**
- Create: `backend/vnext/legacy-adapters.ts`
- Create: `tests/vnext/legacy-parity.test.ts`
- Create at runtime/build step: `artifacts/vnext-parity.json` (do not commit if generated)

**Interfaces:**
- Consumes current v95:
  - `readCanonicalCorpus()`
  - Content Graph projection
  - Discovery Library records
  - Social Feed records
  - Visual Registry records
  - public-register merge
- Produces `LegacyPublicObject[]` and parity counts.

- [ ] **Step 1: Write a failing test that requires every canonical public source URL to appear in adapter output.**

- [ ] **Step 2: Add adapter projections without changing live routes.**

Every adapter row must include `originSystem` and source status.

- [ ] **Step 3: Generate parity counts.**

Required JSON fields:

```json
{
  "canonicalEvents":0,
  "canonicalSourceUrls":0,
  "discoveryObjects":0,
  "socialLiveObjects":0,
  "visualObjects":0,
  "uniqueNormalizedUrls":0,
  "unresolved":0
}
```

- [ ] **Step 4: Fail the task if any canonical public source disappears from adapter output.**

- [ ] **Step 5: Commit adapters/tests only.**

---

### Task 5: Implement append-only permanent archive persistence

**Files:**
- Create: `backend/vnext/archive-store.ts`
- Create: `backend/vnext/archive-assets.ts`
- Create: `backend/vnext/ingest-service.ts`
- Create: `tests/vnext/archive-store.test.ts`
- Create: `tests/vnext/ingest-service.test.ts`

**Interfaces:**
- DB collections:
  - `vnext_archive_objects`
  - `vnext_archive_versions`
  - `vnext_archive_relations`
  - `vnext_ingest_receipts`
- Storage prefix: `vnext/archive-assets/`
- Produces:
  - `ingestArchiveCandidate(candidate,actor):Promise<IngestReceipt>`
  - `getArchiveObject(id):Promise<ArchiveObject|undefined>`
  - `listArchiveObjects(query):Promise<PaginatedArchiveResult>`

- [ ] **Step 1: Write RED tests for append-only behavior.**

Must prove:
- first ingest creates object + version 1;
- identical re-ingest updates `lastSeenAt` without duplicate version;
- changed content hash creates next version;
- source disappearance changes availability state but never deletes history;
- pagination is required; there is no global `MAX_OVERLAY_ROWS=100` equivalent.

- [ ] **Step 2: Implement DB repository with pagination tokens.**

No archive API may require reading the entire collection into memory.

- [ ] **Step 3: Implement storage repository.**

Binary assets are written under a deterministic archive/object/version path and referenced by storage key + sha256.

- [ ] **Step 4: Add protected dry-run ingestion path in service tests.**

Dry-run computes identity, hashes and intended operations without DB/storage mutation.

- [ ] **Step 5: Run GREEN and commit.**

---

### Task 6: Ingest existing v95 public memory into the permanent archive

**Files:**
- Modify: `backend/vnext/legacy-adapters.ts`
- Create: `backend/vnext/migrate-legacy.ts`
- Create: `tests/vnext/migration.test.ts`

**Interfaces:**
- Produces migration result:
  - `before`
  - `migrated`
  - `deduplicated`
  - `unresolved`
  - `excluded`
  - `errors`

- [ ] **Step 1: Write a RED test requiring `before === migrated + deduplicated + excluded + errors`.**

- [ ] **Step 2: Run migration in dry-run mode.**

Expected: no writes; counts and representative IDs available for review.

- [ ] **Step 3: Resolve deterministic URL duplicates and preserve distribution relations.**

- [ ] **Step 4: Execute migration only on the isolated development environment.**

Do not run against production data until the deployment/migration approval gate is explicitly reached.

- [ ] **Step 5: Verify every current canonical source URL maps to an ArchiveObject ID.**

---

### Task 7: Add vNext event links and surface placements

**Files:**
- Create: `backend/vnext/resolution-service.ts`
- Create: `backend/vnext/placement-store.ts`
- Create: `tests/vnext/resolution-service.test.ts`

**Interfaces:**
- DB collections:
  - `vnext_event_archive_links`
  - `vnext_surface_placements`
- Produces:
  - `linkArchiveObject(eventId,archiveId,relation)`
  - `readEventBundle(eventId)`
  - `readPlacements(surface,locale)`

- [ ] **Step 1: RED test one-event-many-traces.**

Use fatherhood as fixture: original/mirror/press/reaction/metric traces resolve to one event bundle.

- [ ] **Step 2: Implement link semantics.**

Allowed relations include `origin`, `mirror`, `coverage`, `reaction`, `metric`, `visual`, `follow-up`, `context`.

- [ ] **Step 3: Implement placements separately from event truth.**

Changing a homepage rank must not mutate canonical event or archive history.

- [ ] **Step 4: GREEN + commit.**

---

### Task 8: Build the unified vNext API surface

**Files:**
- Create: `backend/vnext/projection-service.ts`
- Create: `backend/vnext/search-service.ts`
- Modify: `backend/index.ts` only to register new routes and imports.
- Create: `tests/vnext/search-service.test.ts`
- Create: `tests/vnext/projection-service.test.ts`

**Interfaces:**

```text
GET /api/vnext/home
GET /api/vnext/events
GET /api/vnext/events/:id
GET /api/vnext/archive
GET /api/vnext/archive/:id
GET /api/vnext/search
GET /api/vnext/now
POST /api/vnext/ingest       # protected
POST /api/vnext/resolve      # protected
```

- [ ] **Step 1: RED tests for universal search.**

Queries must support examples: `2023`, `אבהות`, `StartOn`, `משטרה`, `רוסית`; structured filters must support year/platform/type/topic/entity/language/verification/media/metric-presence.

- [ ] **Step 2: Search both canonical events and unresolved archive objects.**

Return `resultKind: 'event'|'archive-object'` and explicit truth/source state.

- [ ] **Step 3: Build home projection from placements.**

The projection returns chapter IDs exactly in this order:

```text
igor → life → signal → work → ideas → archive → you
```

- [ ] **Step 4: Register routes without removing any legacy API.**

- [ ] **Step 5: GREEN + commit.**

---

### Task 9: Build one presentation engine and seven-chapter Home

**Files:**
- Create: `src/vnext/api.ts`
- Create: `src/vnext/VNextHome.tsx`
- Create: `src/vnext/vnext.css`
- Create chapter/component files listed in Target File Structure.
- Modify: `src/App.tsx` behind a development-only vNext route/flag first.
- Create: `tests/vnext/home-contract.test.ts`

**Interfaces:**
- Home consumes only `/api/vnext/home` plus `/api/vnext/now` for live-now enrichment.
- No chapter imports `deep-media-data`, `web-discovery-data`, `InfluenceMemory` static records or other legacy arrays directly.

- [ ] **Step 1: RED contract test.**

Require seven ordered chapters and prohibit duplicate primary `eventId` anchors.

- [ ] **Step 2: Build `IGOR`.**

One dominant authentic portrait/video, concise current identity, immediate path choices. No metrics wall above the fold.

- [ ] **Step 3: Build `LIFE`.**

Chronological narrative; documentary frames; geography only when meaningful; every major chapter has a source/evidence action.

- [ ] **Step 4: Build `SIGNAL`.**

Compose source → distribution → response as one visual story instead of repeated cards.

- [ ] **Step 5: Build `WORK`.**

Service, StartOn, public/civic work and projects as chapters tied to source bundles.

- [ ] **Step 6: Build `IDEAS`.**

Writing/research/frameworks with clear publication/status boundaries.

- [ ] **Step 7: Build `ARCHIVE`.**

Gateway into full Archive Explorer; show depth without dumping the entire register onto Home.

- [ ] **Step 8: Build `YOU`.**

Companion/Create/Growth handoff. Visitor action is visibly separate from Igor’s biography.

- [ ] **Step 9: Verify visual grammar.**

Within any five consecutive major sections, at least three distinct narrative component families must be used; no repeated card-grid monoculture.

- [ ] **Step 10: GREEN + build + commit.**

---

### Task 10: Replace fragmented archive/search UX with Archive Explorer

**Files:**
- Create: `src/vnext/archive/ArchiveExplorer.tsx`
- Create: `src/vnext/archive/ArchiveObjectView.tsx`
- Modify route wiring only after feature-flag parity.

**Interfaces:**
- Consumes `/api/vnext/search`, `/api/vnext/archive`, `/api/vnext/events/:id`.

- [ ] **Step 1: Add URL-synchronized filters.**

Free text, year/range, platform/publisher, object type, topic/domain, person/org/place, language, verification, media type, metric presence.

- [ ] **Step 2: Visually distinguish event result vs unresolved archive object.**

- [ ] **Step 3: Event view expands all traces without duplicating the event.**

- [ ] **Step 4: Retain source URL, archived asset, first/last seen, versions and provenance in detail view.**

- [ ] **Step 5: Verify browser back/forward and shareable filtered URLs.**

---

### Task 11: Convert Media, Museum, Research, StartOn, Speaker and Evidence into graph projections

**Files:**
- Create thin projection components under `src/vnext/`.
- Modify existing route handlers incrementally.
- Keep old components until parity checks pass.

**Interfaces:**
- Every route consumes the same vNext event/archive APIs with surface-specific placements.

- [ ] **Step 1: Media projection.**
- [ ] **Step 2: Museum chronological/album projection.**
- [ ] **Step 3: Research projection.**
- [ ] **Step 4: StartOn projection.**
- [ ] **Step 5: Speaker/press conversion projection.**
- [ ] **Step 6: Evidence/provenance projection.**
- [ ] **Step 7: Verify canonical/hreflang/meta continuity for all pre-existing public routes.**

No route may reintroduce independent truth arrays.

---

### Task 12: Ground Companion in vNext and remove duplicate public biography ownership

**Files:**
- Modify: `backend/index.ts`
- Modify: `src/StoryCompanion.tsx`
- Create: `tests/vnext/companion-grounding.test.ts`

**Interfaces:**
- GUIDE uses vNext search/event/archive.
- REFLECT and BUILD preserve current visitor-first behavior.

- [ ] **Step 1: RED test that public biography/content answers invoke vNext retrieval before final response.**
- [ ] **Step 2: Replace hard-coded factual public-profile/surface copies where equivalent vNext projection exists.**
- [ ] **Step 3: Retain action routes and privacy guardrails.**
- [ ] **Step 4: Exact evidence action must open the corresponding event/archive object, not a generic archive page.**
- [ ] **Step 5: GREEN + commit.**

---

### Task 13: Rewrite visual and functional acceptance tests around the approved product

**Files:**
- Rewrite: `tests/tests.txt`
- Create: `tests/vnext-acceptance.txt`
- Extend: `src/VisualInspector.tsx` only if needed to inspect new selectors.

**Acceptance cases:**

1. Mobile Home presents IGOR → LIFE → SIGNAL → WORK → IDEAS → ARCHIVE → YOU in order.
2. No fixed layer obscures Companion, navigation, filters or source actions.
3. Search for `אבהות` returns one canonical event with multiple traces, not several unrelated primary stories.
4. Archive object remains visible from stored record when live source is temporarily unavailable.
5. No horizontal overflow at 320, 375, 390, 430, 768, 1024, 1440 widths.
6. Major touch targets are ≥44 px.
7. Documentary surfaces contain no generic portrait pretending to document an event.
8. Repeated image detector flags same image reused across distinct event cards unless explicitly marked contextual reuse.
9. HE/EN/RU all render the same story order; ES continuity does not break.
10. Legacy media, archive and SEO routes remain reachable.

- [ ] **Step 1: Run automated tests.**

```bash
npm run test:run
```

- [ ] **Step 2: Run production build.**

```bash
npm run build
```

- [ ] **Step 3: Run browser acceptance at mobile and desktop.**

Record PASS/FAIL per case; screenshots are evidence, not substitutes for assertions.

---

### Task 14: Parity gate and deliberate legacy retirement

**Files:**
- Create: `docs/architecture/vnext-migration-report.md`
- Delete legacy files only in separate, reviewable commits after parity is proven.

**Interfaces:**
- Migration report requires counts: `before`, `migrated`, `deduplicated`, `unresolved`, `excluded`.

- [ ] **Step 1: Produce source/URL parity table.**
- [ ] **Step 2: Produce media parity table.**
- [ ] **Step 3: Produce metric snapshot parity table.**
- [ ] **Step 4: Produce unresolved-lead parity table.**
- [ ] **Step 5: Verify no current indexed route becomes 404.**
- [ ] **Step 6: Retire duplicate Home variants.**
- [ ] **Step 7: Retire duplicate Archive/PublicRecord/Discovery presentation renderers while keeping needed adapters.**
- [ ] **Step 8: Remove legacy static content arrays only when every record has a mapped vNext home.**
- [ ] **Step 9: Run full test/build/acceptance suite again after deletions.**

---

## Final Release Gate

The release candidate is eligible for the existing production deployment workflow only when all are true:

```text
[ ] v95 source reconciliation complete
[ ] automated vNext tests green
[ ] production build green
[ ] legacy parity report has zero unexplained losses
[ ] archive migration dry-run reconciles mathematically
[ ] seven-chapter Home acceptance passes mobile + desktop
[ ] search/event dedup acceptance passes
[ ] route/SEO continuity passes
[ ] Visual QA has no P0 failures
[ ] no production mutation has occurred outside the approved deployment workflow
```

The implementation sequence deliberately builds the replacement beside the existing system, proves parity, then switches and retires. It never begins by deleting old components or by restyling the current overlap in place.
