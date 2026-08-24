# Living Biography Visible Entry Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the approved Living Biography redesign visibly obvious in the first viewport and first scroll of 7ya.io, instead of counting backend/library/chat changes as a homepage redesign.

**Architecture:** Keep the current production corpus, HundredMoments, Digital Igor and route graph intact. Replace only the homepage entry composition with a new editorial shell that introduces PERSON → LIFE → ECHO → LAB → BUILD → ARCHIVE, then hands directly into the existing HundredMoments atlas and chronology. Reuse authentic current media and preserve all evidence boundaries.

**Tech Stack:** React 19, Vite, TypeScript, AppDeploy frontend+backend production snapshot.

**Spec:** `docs/superpowers/specs/2026-08-24-living-biography-nvidia-rebuild-design.md`

## Global Constraints

- Person/life/story primary; #7YA is the frame/system.
- Opening must be documentary cinema + personal museum, not dashboard/SaaS.
- Authentic public media only; no fake historical scenes, collages, generic AI faces, or vanity totals above the fold.
- 100 Moments must appear immediately after the opening and act as the primary exploration atlas.
- HE/EN/RU remain supported.
- Digital Igor remains present but visually subordinate.
- Canon and Discovery remain distinct.
- Completion requires desktop and mobile visual verification of the live production surface.

---

### Task 1: Replace the first viewport with the Living Biography cover

**Files:**
- Modify: `src/life-first/AutobiographicalCinema.tsx`
- Modify: `src/life-first/autobiographical-cinema.css`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: existing `HundredMoments`, locale helpers, authentic hero resource, Digital Igor query conventions.
- Produces: visible `#living-biography-cover` with three actions and editorial world navigation.

- [ ] **Step 1: Write the failing visual acceptance expectation**

Add a home-page test requiring the first viewport to visibly contain Igor's authentic portrait, `IGOR VEPRETSKI`, a concise autobiographical line, `LIFE · ECHO · LAB · BUILD · ARCHIVE · TALK`, and exactly three primary actions before any metrics/dashboard blocks.

- [ ] **Step 2: Verify the current source cannot satisfy it**

Run a source assertion against `AutobiographicalCinema.tsx`; expected result before implementation: no `LIFE · ECHO · LAB · BUILD · ARCHIVE · TALK` navigation exists.

- [ ] **Step 3: Implement the minimal cover**

Replace the existing hero markup with one full-bleed authentic-media cover, one concise autobiographical sentence, chronology cue, world navigation, and actions: enter story, what I am building now, talk to Digital Igor.

- [ ] **Step 4: Style for immediate visual differentiation**

Use large editorial type, asymmetric portrait framing, whitespace, documentary labels, subtle #7YA🥷 punctuation and a quiet bottom chronology rail. Remove any first-viewport dashboard feel.

- [ ] **Step 5: Verify desktop and mobile rendering**

Use AppDeploy QA screenshots plus live route acceptance. Expected: the new cover is unmistakably different from the previous homepage and no clipping/overlap appears.

### Task 2: Turn 100 Moments into the first-scroll atlas handoff

**Files:**
- Modify: `src/life-first/AutobiographicalCinema.tsx`
- Modify: `src/life-first/hundred-moments.css` only if necessary
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: existing `HundredMoments` data and filters.
- Produces: direct cover → `#hundred-moments` transition with an atlas-introduction bridge.

- [ ] **Step 1: Add a failing test for the first-scroll order**

Require `Living Biography Cover → 100 Moments → chronological LIFE cinema` with no system/dashboard sections inserted between cover and atlas.

- [ ] **Step 2: Implement the bridge**

Add a compact editorial bridge explaining that 100 Moments is the public-life atlas, then render the existing `HundredMoments` immediately.

- [ ] **Step 3: Verify source order and live pixels**

Confirm DOM/source order and visually inspect the first two screens on desktop/mobile.

### Task 3: Preserve runtime truth and release evidence

**Files:**
- Modify: `tests/tests.txt`
- Modify: `backend/index.ts` release marker only if the frontend deploy requires a new production truth marker.

**Interfaces:**
- Consumes: AppDeploy production snapshot and custom-domain mapping.
- Produces: auditable release marker plus visual acceptance evidence.

- [ ] **Step 1: Reconcile the home visual test**

Update the home test to assert the Living Biography cover, immediate 100 Moments handoff, and absence of dashboard-first composition.

- [ ] **Step 2: Deploy the smallest production patch**

Deploy only changed homepage files and tests.

- [ ] **Step 3: Poll to terminal status and inspect logs**

Require READY plus zero frontend/backend/network errors.

- [ ] **Step 4: Verify the custom domain and live visual output**

Check 7ya.io domain routing and fresh desktop/mobile QA snapshots before making any completion claim.

## Self-review

- Spec coverage: this recovery slice intentionally covers only the visible entry, 100 Moments handoff, and production verification. Later rooms, contextual Digital Igor retrieval upgrades and multimodal reranking remain separate slices in the approved rebuild spec.
- Placeholder scan: no TODO/TBD placeholders.
- Type consistency: this slice reuses existing production interfaces and introduces no new cross-file runtime types.
