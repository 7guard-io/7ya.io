# Museum Experience Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/museum` an interactive, source-bound life-story experience with four-choice narrative progression and dated impact.

**Architecture:** Reuse the existing `/api/public-projection` and `/api/media-impact` endpoints. A small pure narrative adapter resolves a curated canonical story spine from live projection data, while a React component owns interaction state and rendering. Existing museum sections remain below as the fallback/depth experience.

**Tech Stack:** React 19, TypeScript/JavaScript ES modules, Vite 6, existing AppDeploy backend APIs, CSS.

**Spec:** `docs/superpowers/specs/2026-09-12-museum-experience-engine-design.md`

## Global Constraints

- No new truth store or database.
- Canon/Evidence/Public Projection remain authoritative.
- No fabricated metrics, comments, emotions or events.
- Public-safe metrics remain dated and source-local.
- Existing museum content remains available if live APIs fail.
- Mobile 375px must have no horizontal overflow.
- Production mutation begins from the exact currently applied AppDeploy version.

---

### Task 1: Narrative adapter

**Files:**
- Create: `src/museum/museum-narrative-core.js`
- Test: local Node `node:test` contract before deployment

**Interfaces:**
- Consumes: Public Projection item array.
- Produces: `buildStoryMoments(items, locale)` and `questionForIndex(moments, index, locale)`.

- [ ] **Step 1: Write failing tests** for canonical story order and exactly one correct choice among four real chapters.
- [ ] **Step 2: Run tests and verify RED** because the narrative module does not exist.
- [ ] **Step 3: Implement the minimal pure adapter** with the six canonical story-spine IDs from the spec.
- [ ] **Step 4: Run tests and verify GREEN** with six ordered moments and one documented-next answer.

### Task 2: Interactive Museum Story component

**Files:**
- Create: `src/museum/MuseumStoryExperience.tsx`
- Create: `src/museum/museum-story-experience.css`
- Modify: `src/MuseumPage.tsx`

**Interfaces:**
- Consumes: `buildStoryMoments`, `questionForIndex`, `/api/public-projection`, `/api/media-impact`.
- Produces: a self-contained `MuseumStoryExperience` mounted immediately after the existing museum hero.

- [ ] **Step 1: Add live reads** using relative same-origin URLs for Public Projection and Media Impact.
- [ ] **Step 2: Render first-person Moment** with year, title, source-bound visual, narrative, summary, trust and direct source action.
- [ ] **Step 3: Render four-choice next-chapter interaction**; wrong answers do not advance, correct answers reveal the next Moment.
- [ ] **Step 4: Render Impact signals** from public-safe records only, with date/platform/unit and direct source links.
- [ ] **Step 5: Add resilient unavailable states** so failure of either endpoint never hides the legacy museum.
- [ ] **Step 6: Add responsive CSS** for single-column mobile choices, stable media and no overflow.

### Task 3: Reconcile AppDeploy user-visible tests

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Covers: museum interaction, proof/source continuity, Public Projection failure fallback, mobile usability.

- [ ] **Step 1: Replace one unchanged-route test with Museum Story Mode** that answers a choice and verifies the next source-bound Moment appears.
- [ ] **Step 2: Replace one unchanged-route test with a Public Projection 503 QA fault** and verify the existing museum remains visible below the unavailable Story Mode state.
- [ ] **Step 3: Keep exactly one `[sanity]` marker** in the suite.

### Task 4: Deploy and verify production

**Files:**
- AppDeploy source snapshot derived from the current applied version.

**Interfaces:**
- Produces: a new immutable AppDeploy version and the canonical `7ya.io/museum/` user-visible result.

- [ ] **Step 1: Deploy only changed files** against the exact current AppDeploy snapshot.
- [ ] **Step 2: Poll AppDeploy until terminal state** and inspect QA/runtime errors.
- [ ] **Step 3: If E2E fails, inspect the QA run details before fixing.**
- [ ] **Step 4: Run live visual acceptance for museum desktop and mobile.**
- [ ] **Step 5: Verify `https://7ya.io/museum/` visibly contains Story Mode, four choices, source action and Impact.**
- [ ] **Step 6: Confirm the canonical domain remains on the intended AppDeploy app.**
