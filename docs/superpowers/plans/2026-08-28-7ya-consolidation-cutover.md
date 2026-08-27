# 7YA Consolidation Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate 7YA into one canonical, mobile-first public experience while preserving the existing corpus, APIs, evidence boundaries and archive depth.

**Architecture:** Keep `DocumentaryHome` and the existing backend/data engines. Normalize legacy query routes to clean routes, decouple canon search from coverage failure, and tighten the existing documentary/mobile CSS instead of creating another presentation subsystem.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy frontend/backend runtime, `@appdeploy/client`, existing CSS modules/files.

**Spec:** `docs/superpowers/specs/2026-08-28-7ya-consolidation-cutover-design.md`

## Global Constraints
- Clean routes are canonical; `?page=` is compatibility-only.
- Canon, Discovery, Live and Legacy evidence boundaries remain explicit.
- No corpus rewrite, metric recomputation, OAuth/secret change or automatic publishing.
- Public Projection remains the primary visual inventory with current fallbacks preserved.
- HE/EN/RU route parity must remain intact.
- Mobile acceptance targets: 375×667, 390px and 430px widths without horizontal overflow or CTA/overlay collision.
- Do not merge/push a production chain to `main` unless the user explicitly says `בצע את שרשרת הפריסה`.

---

### Task 1: Route normalization

**Files:**
- Modify: `src/App.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: existing `pageHref`, `rootHref`, `LocaleProvider`, route `page` query parameter.
- Produces: compatibility normalization from legacy `?page=<route>` to clean route path while retaining locale and filters.

- [ ] **Step 1: Write the failing E2E test**

Add a test that opens `?page=media&lang=en`, then verifies the URL becomes `/media/?lang=en` and the Media page remains visible.

- [ ] **Step 2: Run the unchanged production snapshot with the new test**

Expected: FAIL because current logic uses `history.replaceState` only for a limited empty-path case and internal query routing still remains first-class.

- [ ] **Step 3: Implement minimal normalization**

In `AppContent`, map supported legacy `page` values to clean paths before page branching. Preserve all query params except `page`; remove `lang=he` as the default. Do not normalize private/system-only query views.

- [ ] **Step 4: Run tests**

Expected: route-normalization test PASS; existing route tests remain green.

- [ ] **Step 5: Commit to isolated branch**

Commit message: `fix: canonicalize legacy 7YA routes`

### Task 2: Resilient canon search

**Files:**
- Modify: `src/ContentSearchPage.tsx`
- Modify: `src/content-search.css` only if a small degraded-state style is needed
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `fetchGraphSearch`, `fetchGraphCoverage`, `DiscoveryLibrary`.
- Produces: independent `canonState` and `coverageState`; canon results survive coverage failure.

- [ ] **Step 1: Write the failing API-fault E2E test**

Inject a 500 fault for `/api/graph/coverage`, perform a search, and expect canonical results/search UI to remain visible with a non-blocking coverage degradation indication.

- [ ] **Step 2: Verify RED**

Expected: FAIL because current `Promise.all` moves the entire search page to `failed` when coverage rejects.

- [ ] **Step 3: Implement minimal independent loading**

Start canon search and coverage requests separately inside the same effect. Canon controls `canonState`. Coverage controls `coverageState` and never changes canon state. Preserve request cancellation via the existing `live` boolean.

- [ ] **Step 4: Verify GREEN**

Expected: coverage-fault test PASS; normal search still returns results and coverage when available.

- [ ] **Step 5: Commit**

Commit message: `fix: isolate search coverage failures`

### Task 3: Homepage/mobile consolidation

**Files:**
- Modify: `src/documentary-home/DocumentaryHome.tsx` only where duplicate/legacy CTA hrefs remain
- Modify: `src/documentary-home/documentary-home.css`
- Modify: `src/documentary-home/living-documentary-front-door.css` if that is the active hero layer
- Modify: `src/device-experience-20260826.css` only for global mobile collision fixes
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: Public Projection payload, existing fallback visual corpus, `pageHref`/`rootHref`.
- Produces: one documentary home composition with clean-route CTAs and stable 375px layout.

- [ ] **Step 1: Write the failing mobile test**

At 375×667, open home and verify the hero headline, primary story CTA, Media/Archive access and first source-linked visual section are usable without horizontal overflow.

- [ ] **Step 2: Verify RED**

Expected: FAIL if any existing fixed/min-width/overlay behavior exceeds the viewport or if a legacy query CTA remains.

- [ ] **Step 3: Implement minimal CSS/CTA corrections**

Contain page overflow at the documentary shell, ensure hero text/CTA groups wrap, preserve safe image crop around the hero, and route homepage links through clean paths. Do not create a new home component.

- [ ] **Step 4: Verify GREEN**

Expected: mobile test PASS and desktop documentary layout remains intact.

- [ ] **Step 5: Commit**

Commit message: `style: consolidate 7YA documentary home`

### Task 4: Regression/production QA

**Files:**
- Reconcile: `tests/tests.txt`
- No production code unless a failing regression identifies a root-cause defect.

**Interfaces:**
- Consumes: all outputs above.
- Produces: verified isolated branch + AppDeploy snapshot ready for user inspection.

- [ ] **Step 1: Run the complete AppDeploy E2E suite**

Expected: exactly one `[sanity]` test; all tests PASS.

- [ ] **Step 2: Inspect AppDeploy QA**

Expected: deployment `ready`; zero frontend/backend/network errors; mobile and desktop screenshots produced.

- [ ] **Step 3: Check runtime boundaries**

Confirm homepage still renders with Public Projection failure fallback, canonical search failure remains explicit, and coverage failure is non-blocking.

- [ ] **Step 4: Compare branch against `main`**

Expected changes limited to spec/plan, tests and the named frontend files.

- [ ] **Step 5: Open a PR; do not merge automatically**

PR title: `fix: consolidate 7YA public experience`
