# 7YA Total Reality Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing 7ya.io homepage visibly express the scale and connectedness of the canonical corpus through a dynamic Reality Index, expanded coverage reporting and canonical deep navigation.

**Architecture:** Reuse `shared/canonical-corpus.ts` as source truth and `shared/content-graph.ts` as the projection layer. Add one focused homepage component that consumes existing graph APIs, enrich coverage definitions rather than duplicating data, and keep every click routed into canonical search/evidence. No new persistence layer and no invented media or metrics.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy API client/router, existing 7YA canonical/content graph.

**Spec:** `docs/superpowers/specs/2026-08-22-7ya-total-reality-foundation-design.md`

## Global Constraints
- Canon/evidence is source of truth; site is output.
- No invented faces, media, metrics, sources or causal claims.
- No synthetic total reach.
- One meaningful image per visual card; no collages.
- Preserve RTL, mobile behavior and current high-quality components.
- People and Places remain explicit coverage gaps until evidence-backed first-class nodes exist.

---

### Task 1: RED — User-visible Total Reality contract

**Files:**
- Create: AppDeploy `tests/tests.txt`

**Interfaces:**
- Consumes: current production homepage/search.
- Produces: executable E2E contract for the new layer.

- [ ] **Step 1: Add four E2E tests before production code**
  - Desktop sanity: homepage exposes `TOTAL REALITY`, corpus scale and domain navigation.
  - Canon traversal: selecting Service enters search and yields canonical service records.
  - Mobile: Reality Index remains navigable at 375×667 without hiding domain controls.
  - Guardrail: a nonsense canonical search returns the explicit no-fallback empty state.
- [ ] **Step 2: Deploy tests-only snapshot and verify the new Total Reality test fails for the expected missing feature.**

### Task 2: GREEN — Expand coverage projection

**Files:**
- Modify: AppDeploy `shared/content-graph.ts`

**Interfaces:**
- Consumes: `ContentRecord[]` projected from `CanonicalEvent[]`.
- Produces: `graphCoverage()` rows for Biography, Timeline, Service, Social, Viral Posts, Media, StartOn, Projects, Writing, Research, Ideas, Influence, Music, Archive, Current activity, People and Places.

- [ ] **Step 1: Add Service/StartOn/Writing/Viral predicates and explicit zero-state People/Places rows.**
- [ ] **Step 2: Preserve the existing `CoverageRow` wire shape to avoid client breakage.**

### Task 3: GREEN — Reality Index homepage layer

**Files:**
- Create: AppDeploy `src/personal-internet/RealityIndex.tsx`
- Create: AppDeploy `src/personal-internet/reality-index.css`
- Modify: AppDeploy `src/personal-internet/PersonalInternetHome.tsx`

**Interfaces:**
- Consumes: `fetchGraphSearch({limit:100})`, `fetchGraphCoverage()`, `ContentRecord`.
- Produces: homepage section `#pi-reality` with evidence-derived corpus stats, eight domain lanes, representative evidence stream and canonical deep links.

- [ ] **Step 1: Fetch graph records and coverage in parallel; render evidence-safe unavailable state on failure.**
- [ ] **Step 2: Derive record/source/media/metric/platform/year counts from returned records only.**
- [ ] **Step 3: Render domain lanes using canonical query links rather than hard-coded destination pages.**
- [ ] **Step 4: Render chronological evidence cards prioritizing records with authentic images while retaining source-only records.**
- [ ] **Step 5: Insert Reality Index after Broadcast and before Content Graph so homepage behaves as a live broadcast followed by a scale/map layer.**

### Task 4: GREEN — Canonical search accepts domain deep links

**Files:**
- Modify: AppDeploy `src/ContentSearchPage.tsx`
- Modify: AppDeploy `src/content-graph-client.ts`

**Interfaces:**
- Consumes: URL query params `type`, `surface`, `year`, `platform`, `topic`, `verification`, `q`.
- Produces: filtered graph-search requests and shareable URL state.

- [ ] **Step 1: Parse supported filter parameters on initial load.**
- [ ] **Step 2: Pass filters through `fetchGraphSearch`; preserve free-text search behavior.**
- [ ] **Step 3: Display active filter context and provide a Full Canon reset that clears filters safely.**

### Task 5: Verification and release

**Files:**
- Modify/Create: GitHub release receipt after verified deployment.

**Interfaces:**
- Consumes: AppDeploy E2E/QA status and live 7ya.io inspection.
- Produces: traceable release evidence.

- [ ] **Step 1: Deploy implementation and poll AppDeploy until terminal status.**
- [ ] **Step 2: Confirm E2E tests pass and frontend/backend/network error lists are empty.**
- [ ] **Step 3: Inspect desktop and mobile QA screenshots.**
- [ ] **Step 4: Verify `https://7ya.io` live as a stranger and compare physical UI with canon coverage.**
- [ ] **Step 5: Record the AppDeploy version, QA result, unresolved coverage gaps and rollback version in GitHub.**
- [ ] **Step 6: Run/verify repository CI before advancing the release branch to `main`; if true local `npm run ci:local` cannot execute because the available shell cannot resolve GitHub, do not misreport it—use available GitHub CI status and explicitly retain the local-CI limitation in the receipt.**
