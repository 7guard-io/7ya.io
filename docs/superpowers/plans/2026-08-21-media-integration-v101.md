# 7YA Media Integration V101 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the 7YA homepage visibly more personal, media-led and autobiographical by removing duplicate warehouse modules, strengthening StartOn and NOW with real source media, and preserving evidence provenance.

**Architecture:** Use the existing AppDeploy production snapshot as the runtime source of truth. Keep `PersonalArchive` and `PersonalChronology` as the documentary spine, simplify `LifeFirstHome` into a single narrative order, enrich `StartOnRoom` with press + two lazy YouTube embeds + an owner-archive project document, and tighten `RightNow`/`LiveSocial` to a curated visual live edge. Add one override stylesheet for V101 so the existing style system remains reversible.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy, existing `@appdeploy/client` API transport, CSS.

**Spec:** `docs/superpowers/specs/2026-08-18-7ya-autobiographical-cinema-design.md`

## Global Constraints

- Real Igor / authentic source media first; no generic stock or invented documentary imagery.
- No collage compositions.
- Source-local metrics only; do not create a combined reach total.
- Children and third parties remain privacy-protected.
- Mobile rhythm: dominant media → first-person thought → source/echo → continue.
- Lazy-load non-critical embeds; no autoplay audio.
- Preserve multilingual Hebrew / English / Russian behavior.
- Keep the Companion and deep archive accessible.

---

### Task 1: Reconcile homepage tests first

**Files:**
- Modify: AppDeploy `tests/tests.txt`

**Interfaces:**
- Consumes: existing homepage anchors and components.
- Produces: QA expectations for the V101 homepage order, StartOn embedded media, curated live feed, and mobile documentary hierarchy.

- [ ] **Step 1:** Replace only the tests whose user-visible expectations change; preserve Companion/public-safety coverage.
- [ ] **Step 2:** Deploy tests without production UI changes and verify the new V101 assertions fail against the current homepage.
- [ ] **Step 3:** Record the failing assertions as the RED baseline.

### Task 2: Collapse the homepage into a narrative spine

**Files:**
- Modify: AppDeploy `src/life-first/LifeFirstHome.tsx`
- Create: AppDeploy `src/life-first/media-integration-v101.css`

**Interfaces:**
- Consumes: `LifeFirstHero`, `PersonalArchive`, `PersonalChronology`, `PublicActionStage`, `StartOnRoom`, `CreateRoom`, `ResearchRoom`, `RightNow`, `UserHandoff`, `DeepArchiveRiver`.
- Produces: one primary homepage sequence: Hero → Personal Memory → Chronology → Public Echo → StartOn → Creation → Research → NOW → YOU → Archive.

- [ ] **Step 1:** Remove primary-home rendering of `LifeGeography`, `InfluenceUniverse`, `PostPortraitWall`, `WorldRooms`, repeated `JourneyBridge` and repeated `ContextualHandoff` blocks.
- [ ] **Step 2:** Keep one compact Public Echo surface via `PublicActionStage` so influence remains visible without a second warehouse.
- [ ] **Step 3:** Import `media-integration-v101.css` last and use it only for V101 hierarchy/spacing overrides.
- [ ] **Step 4:** Build/deploy and verify the removed warehouse modules no longer interrupt the primary journey.

### Task 3: Turn StartOn into a media-rich autobiographical peak

**Files:**
- Modify: AppDeploy `src/life-first/StartOnRoom.tsx`
- Modify: AppDeploy `src/life-first/media-integration-v101.css`

**Interfaces:**
- Consumes: mynet press photo/article, YouTube `SOpAglwkJ8I`, YouTube `O3v309CA4ao`, Drive owner-archive StartOn project document `1B6aV3ofbNzS4ARLmB5WaiDabeKiEav2k`.
- Produces: `lf-starton-media-stage` with one press anchor, two lazy source embeds and one project-document proof object.

- [ ] **Step 1:** Keep the first-person return copy and provenance disclosure.
- [ ] **Step 2:** Replace the two-card visual column with a four-beat media stage: press → broadcast → interview → project document.
- [ ] **Step 3:** Use `youtube-nocookie.com/embed/...`, `loading='lazy'`, explicit titles and separate public-source links.
- [ ] **Step 4:** Reserve aspect ratios to prevent layout shift and make mobile show one dominant media item per viewport.

### Task 4: Make NOW visibly alive instead of link-heavy

**Files:**
- Modify: AppDeploy `src/LiveSocial.tsx`
- Modify: AppDeploy `src/life-first/RightNow.tsx`
- Modify: AppDeploy `src/life-first/media-integration-v101.css`

**Interfaces:**
- Consumes: `/api/social-feed` through existing `api.get`, canonical fallback accounts, real thumbnails/titles/dates.
- Produces: a six-item curated visual live edge plus stable canonical fallback.

- [ ] **Step 1:** Keep the existing API/fallback behavior and public-source links.
- [ ] **Step 2:** Render at most six feed items on the homepage and prefer items with thumbnails first while preserving order among equally suitable items.
- [ ] **Step 3:** Reduce registry/system copy inside the homepage context so imagery and titles lead.
- [ ] **Step 4:** Keep the canonical fallback visible if the external feed fails.

### Task 5: Verify production behavior and regressions

**Files:**
- Reconcile: AppDeploy `tests/tests.txt`

**Interfaces:**
- Consumes: deployed V101 snapshot.
- Produces: terminal AppDeploy QA result with no user-visible regression in Companion, source provenance, mobile hierarchy or StartOn media.

- [ ] **Step 1:** Run AppDeploy build + E2E QA.
- [ ] **Step 2:** If QA fails, inspect `get_e2e_qa_run_details`, source snapshot and runtime errors before changing code.
- [ ] **Step 3:** Fix all reported issues in one pass and redeploy, up to three repair attempts.
- [ ] **Step 4:** Confirm `ready`, inspect QA snapshot/errors, and only then report the live URL and visible changes.
