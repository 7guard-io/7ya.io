# 7YA Production Truth + Homepage Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing evidence-backed 100 Moments archive a primary homepage experience immediately after the autobiographical cover, validate it on the live 7ya.io AppDeploy production, and record the exact release receipt in GitHub.

**Architecture:** Reuse the existing `HundredMoments` component and its Canon / Visual Registry / Discovery data flow. Change only the homepage composition order in `AutobiographicalCinema`; do not alter evidence semantics or introduce new content. AppDeploy remains the active production host for this bounded slice, while GitHub records the approved design, plan and validated deployment receipt as the first recovery step toward one source of truth.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy v2, existing 7YA Canon/Discovery APIs, GitHub.

**Spec:** `docs/superpowers/specs/2026-08-24-production-truth-homepage-recovery-design.md`

## Global Constraints

- No fabricated archive records, metrics, memories or verification states.
- Existing 100 Moments filters and direct source links remain unchanged.
- Existing real-photo autobiographical opening remains first.
- Origin and the remaining autobiographical cinema remain present after 100 Moments.
- Production acceptance requires desktop and mobile QA with no frontend/network errors.

---

### Task 1: Promote 100 Moments into the opening journey

**Files:**
- Modify: AppDeploy `src/life-first/AutobiographicalCinema.tsx`
- Test: AppDeploy `tests/tests.txt`

**Interfaces:**
- Consumes: existing `HundredMoments` React component and its current data sources.
- Produces: homepage order `Cover → 100 Moments → Origin → remaining story`.

- [ ] **Step 1: Update the failing QA expectation**

Change homepage Test 1 so it requires `100 MOMENTS · PUBLIC LIFE ARCHIVE` immediately after the opening cover and before ORIGIN. Extend the mobile test with the same ordering requirement.

- [ ] **Step 2: Verify current production does not satisfy the new expectation**

Inspect current source order in `AutobiographicalCinema.tsx`: `HundredMoments` currently appears after `PersonalChronology`, `VisualCanonRiver` and `IgorSceneEngine`, so the new expectation is initially false.

- [ ] **Step 3: Make the minimal implementation**

Move the existing `<HundredMoments/>` node to immediately after the closing `</section>` of `#cinema-open`. Remove its old render position near the bottom. Do not modify `HundredMoments.tsx`.

- [ ] **Step 4: Deploy and verify**

Deploy only the modified composition file and reconciled tests. Poll AppDeploy until terminal status. Acceptance: status `ready`, no frontend errors, no network errors, desktop/mobile QA snapshots generated.

- [ ] **Step 5: Verify live custom domain**

Open `https://7ya.io/?lang=he` and confirm the page content/order corresponds to the deployed release; confirm AppDeploy custom-domain status for `7ya.io` remains active.

---

### Task 2: Record immutable deployment receipt

**Files:**
- Create: `docs/releases/2026-08-24-homepage-100-moments-primary.md`

**Interfaces:**
- Consumes: validated AppDeploy version/status/QA data from Task 1.
- Produces: GitHub-visible receipt tying the visible production change to the exact deployed version.

- [ ] **Step 1: Write the receipt**

Record: prior AppDeploy version, new version, changed production file, test change, QA status, screenshot availability, custom-domain status, and the remaining source-alignment debt.

- [ ] **Step 2: Self-review**

Verify the receipt does not claim that GitHub is already the application source of truth. State explicitly that full live-source recovery is the next architectural slice.

- [ ] **Step 3: Commit**

Commit the release receipt to `main` after the production validation is complete.
