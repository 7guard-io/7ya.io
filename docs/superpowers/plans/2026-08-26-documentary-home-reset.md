# Documentary Home Reset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stacked 7YA homepage with one cinematic, source-linked documentary homepage while preserving the existing data plane, routes and NVIDIA-backed Digital Igor.

**Architecture:** Create a new isolated `src/documentary-home/` presentation module that reads the existing `/api/public-projection` endpoint and owns the homepage DOM/CSS. Modify `App.tsx` so the home route bypasses legacy homepage/global experience layers, while all non-home routes stay unchanged. Keep `StoryCompanion` mounted so NVIDIA remains available.

**Tech Stack:** React 19, TypeScript, Vite, `@appdeploy/client` API transport, existing AppDeploy backend/public projection.

**Spec:** `docs/superpowers/specs/2026-08-26-documentary-home-reset-design.md`

## Global Constraints
- Preserve existing backend/canon/discovery/NVIDIA behavior.
- Homepage media source is `/api/public-projection?limit=60&sort=impact`.
- Exclude PENDING from promoted homepage media.
- Preserve CANON / DISCOVERY / LIVE labels and original source URLs.
- No graph/platform wall/evidence dashboard/agent mesh/system terminology in the primary homepage journey.
- No new dependencies.
- Mobile first two screens must show Igor plus real media.

---

### Task 1: Define homepage acceptance contract

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: current public homepage and `/api/public-projection`.
- Produces: release-gate expectations for the new homepage.

- [ ] **Step 1:** Replace homepage-specific acceptance expectations with a sanity test that requires one documentary cover, real source media within the first two mobile screens, no system dashboard above the archive bridge, and working Story/Archive/Talk actions.
- [ ] **Step 2:** Add a projection-degradation test: homepage still renders source-linked fallback media if `/api/public-projection` fails.
- [ ] **Step 3:** Keep existing Library impact-first and Canon/Discovery guardrail coverage.
- [ ] **Step 4:** Deploy the test-only snapshot and inspect whether AppDeploy produces executable e2e output; if not, retain these as the formal acceptance contract and use build/runtime/visual QA as the executable gates.

### Task 2: Build the isolated documentary homepage

**Files:**
- Create: `src/documentary-home/DocumentaryHome.tsx`
- Create: `src/documentary-home/documentary-home.css`

**Interfaces:**
- Consumes: `api.get('/api/public-projection?limit=60&sort=impact')`, locale helpers, existing public routes.
- Produces: `DocumentaryHome` React component.

- [ ] **Step 1:** Implement localized HE/EN/RU cover copy and three primary actions.
- [ ] **Step 2:** Fetch projection once on mount; map safe records into media cards; reject `PENDING` and records without public source URLs.
- [ ] **Step 3:** Derive 8 featured impact frames with media-first ranking and URL dedupe.
- [ ] **Step 4:** Derive a compact chronological spine from the same records.
- [ ] **Step 5:** Add deterministic fallback public media for Mynet, News 13/12, YouTube music, StartOn and Cabin 9.
- [ ] **Step 6:** Style as one editorial documentary surface with separate media frames, no collage, no neon system UI, mobile-first vertical rhythm and desktop asymmetric editorial grid.

### Task 3: Cut over the home route only

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `DocumentaryHome`.
- Produces: home route renders only the new documentary presentation plus `StoryCompanion`; non-home routes preserve current layers.

- [ ] **Step 1:** Import `DocumentaryHome`.
- [ ] **Step 2:** For `view==='home'`, bypass `GlobalNav`, `SiteControl`, `LifeFirstHome` and all legacy global homepage presentation layers.
- [ ] **Step 3:** Keep `StoryCompanion` mounted on home so NVIDIA-backed Digital Igor remains available.
- [ ] **Step 4:** Leave all non-home route rendering unchanged.

### Task 4: Verify and release

**Files:**
- Export applied files/receipt under `appdeploy-live/<snapshot>/` on GitHub after production verification.

**Interfaces:**
- Consumes: AppDeploy build/runtime/QA state and live domain.
- Produces: verified production snapshot and GitHub receipt.

- [ ] **Step 1:** Deploy changed tests, new homepage files and `App.tsx` in one AppDeploy update.
- [ ] **Step 2:** Poll until terminal state and require 0 frontend/backend/network errors.
- [ ] **Step 3:** Inspect current source snapshot to confirm the home cutover and projection fetch are present.
- [ ] **Step 4:** Verify `7ya.io` domain remains active.
- [ ] **Step 5:** Export the applied snapshot files and release receipt to the GitHub branch.
- [ ] **Step 6:** Open and merge a PR only after the production snapshot is verified.
