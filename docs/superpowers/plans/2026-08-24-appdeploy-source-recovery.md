# 7YA AppDeploy Source Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or subagent-driven-development to implement task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Preserve the frozen AppDeploy runtime in GitHub, correct production-control metadata, repair the missing `/journey/` route and release identity, and verify the resulting production deployment without merging an unverified runtime into `main`.

**Architecture:** Treat AppDeploy snapshot `1787521286005` as an immutable recovery input. Preserve exact critical runtime files under `appdeploy-live/1787521286005/`, repair live production only through bounded TDD changes, and record all recovery/governance work on `recovery/appdeploy-1787521286005` until review and parity gates permit integration.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy v2, GitHub, existing 7YA backend/canon/discovery modules.

**Spec:** `docs/superpowers/specs/2026-08-24-appdeploy-source-recovery-design.md`

## Global Constraints

- Frozen baseline: AppDeploy `v98`, snapshot `1787521286005`, timestamp `2026-08-24 00:41:26 Asia/Jerusalem`.
- Never overwrite `main` directly.
- Never call partial source preservation “full parity.”
- No new claims, metrics or evidence promotions.
- No Supabase/Windsor/vidIQ work in this recovery slice.
- `/journey/` must not use meta-refresh.
- Fresh AppDeploy QA is required before any completion claim.

---

### Task 1: Preserve the frozen runtime provenance

**Files:**
- Create: `appdeploy-live/1787521286005/README.md`
- Create: `appdeploy-live/1787521286005/recovery-manifest.json`
- Create/copy: critical runtime files listed by the design under the same snapshot path.

**Interfaces:**
- Consumes: exact AppDeploy `src_read` output for snapshot `1787521286005`.
- Produces: immutable GitHub recovery evidence without modifying root runtime files.

- [ ] Read each critical runtime text file from the frozen snapshot.
- [ ] Copy its exact text under `appdeploy-live/1787521286005/<original-path>`.
- [ ] Record preserved paths, known omitted binary/resource classes and known defects in the manifest.
- [ ] Fetch representative copied files from the branch and compare them to AppDeploy source before continuing.

### Task 2: Correct repository control-plane truth

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/CONTROL_PLANE_STATE.json`
- Modify: `docs/releases/2026-08-24-homepage-100-moments-primary.md`

**Interfaces:**
- Consumes: frozen runtime provenance from Task 1.
- Produces: one explicit statement of current production hosting and the difference between behavior-change snapshot and later recovery baseline.

- [ ] Replace stale verified AppDeploy snapshot references with the frozen recovery baseline and add a rule requiring a fresh runtime lookup before future production claims.
- [ ] Mark old Vercel state historical/non-authoritative while preserving rollback/history data.
- [ ] Correct the 100 Moments receipt so it does not map the `v98` label to an older snapshot incorrectly.
- [ ] Re-read all three files and confirm they no longer contradict each other about current hosting.

### Task 3: Add the `/journey/` route test first

**Files:**
- Modify production: `tests/tests.txt`

**Interfaces:**
- Consumes: critical-route contract from `AGENTS.md`.
- Produces: failing QA expectation for a native crawlable `/journey/` route.

- [ ] Add a route-integrity step requiring `/journey/` to load native 7YA journey content without meta-refresh and expose a link into the autobiographical journey.
- [ ] Verify RED against frozen snapshot `1787521286005` by confirming `public/journey/**/*` is absent.

### Task 4: Implement the minimal `/journey/` route and reconcile release identity

**Files:**
- Create production: `public/journey/index.html`
- Modify production: `public/release.json`
- Modify production where necessary: `src/App.tsx` only if a single identifier cannot otherwise be reconciled.

**Interfaces:**
- Consumes: existing static critical-route conventions and current React entrypoint.
- Produces: crawlable `/journey/` plus internally consistent release metadata.

- [ ] Read an existing native static critical route and reuse its safe document/head/navigation conventions.
- [ ] Add the minimal crawlable journey route with canonical/hreflang metadata and a direct native entry into the life journey; do not use meta-refresh.
- [ ] Choose one new release id for this repair deploy and apply it consistently to the runtime release surfaces touched by this change.
- [ ] Deploy only the bounded route/test/metadata changes using AppDeploy update semantics.
- [ ] Poll AppDeploy until terminal status; auto-fix any release-critical error before proceeding.

### Task 5: Verify production and preserve the post-repair runtime delta

**Files:**
- Create: `docs/releases/2026-08-24-production-source-recovery.md`
- Add recovered post-deploy changed files under an immutable `appdeploy-live/<new-snapshot>/` path if the deploy produces a new snapshot.

**Interfaces:**
- Consumes: post-deploy AppDeploy status, route source and domain state.
- Produces: auditable before/after receipt.

- [ ] Run fresh AppDeploy status verification and confirm terminal `ready`, zero frontend/network/backend errors and fresh desktop/mobile captures.
- [ ] Confirm `public/journey/index.html` exists in the deployed snapshot.
- [ ] Read `src/App.tsx` and `public/release.json` from the deployed snapshot and confirm release identity is consistent.
- [ ] Confirm `7ya.io` and `www.7ya.io` custom domains remain active.
- [ ] Record before/after snapshots, exact changed files, QA results and remaining full-parity debt in the release receipt.

### Task 6: Open the recovery PR without merging

**Files:** GitHub branch metadata only.

**Interfaces:**
- Consumes: verified recovery branch and production receipt.
- Produces: reviewable integration surface, not an automatic cutover.

- [ ] Compare `recovery/appdeploy-1787521286005` against `main`.
- [ ] Open a PR summarizing preserved runtime source, governance corrections, production route repair and remaining parity debt.
- [ ] Do not merge the PR in this slice.