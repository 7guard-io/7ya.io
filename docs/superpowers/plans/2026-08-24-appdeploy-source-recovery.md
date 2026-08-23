# 7YA AppDeploy Source Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans or subagent-driven-development to implement task-by-task. Steps use checkbox syntax for tracking.

**Goal:** Preserve immutable AppDeploy production evidence in GitHub, correct production-control metadata, repair the missing `/journey/` route and contradictory global release identity, and verify the production repair without merging an unverified runtime into `main`.

**Architecture:** Treat AppDeploy snapshot `1787521286005` as the frozen pre-repair input. Preserve exact runtime evidence under immutable `appdeploy-live/<snapshot>/` paths, repair live production only through bounded test-first changes, and record governance/recovery work on `recovery/appdeploy-1787521286005` until full parity and review permit integration.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy v2, GitHub, existing 7YA backend/canonical-corpus/public-internet-graph modules.

**Spec:** `docs/superpowers/specs/2026-08-24-appdeploy-source-recovery-design.md`

## Global Constraints

- Frozen pre-repair baseline: snapshot `1787521286005`, `2026-08-24 00:41:26 Asia/Jerusalem`.
- AppDeploy `vNN` display labels are rolling; use immutable snapshot ids for provenance.
- Never overwrite `main` directly.
- Never call partial source preservation full parity.
- No new claims, metrics or evidence promotions.
- No Supabase/Windsor/vidIQ work in this recovery slice.
- `/journey/` must not use meta-refresh.
- Fresh AppDeploy runtime QA is required before any completion claim.
- `e2e_tests=null` is not an E2E PASS.

---

### Task 1: Preserve the frozen runtime provenance

**Files:**
- Create: `appdeploy-live/1787521286005/README.md`
- Create: `appdeploy-live/1787521286005/recovery-manifest.json`
- Create/copy: representative critical runtime files under the same immutable snapshot path.

**Interfaces:**
- Consumes: exact AppDeploy source reads for snapshot `1787521286005`.
- Produces: immutable GitHub recovery evidence without modifying the root runtime tree.

- [x] Record app id, immutable snapshot, timestamp, GitHub base commit and domains.
- [x] Inventory actual backend/shared runtime paths and correct nonexistent-path assumptions.
- [x] Preserve representative exact runtime files and label preservation `PARTIAL_CRITICAL_SOURCE_RECOVERY`.
- [ ] Complete remaining text-source parity and binary-resource parity in the next parity gate.

### Task 2: Correct repository control-plane truth

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/CONTROL_PLANE_STATE.json`
- Modify: `docs/releases/2026-08-24-homepage-100-moments-primary.md`

**Interfaces:**
- Consumes: provider verification and immutable snapshot provenance.
- Produces: a non-contradictory governance record of active production and source-alignment debt.

- [x] Make AppDeploy v2 the explicit active production runtime.
- [x] Record immutable snapshot ids rather than treating rolling `vNN` labels as provenance.
- [x] Mark the historical Vercel control plane non-authoritative.
- [x] Correct the 100 Moments receipt's erroneous v98/snapshot pairing.
- [x] Explicitly state that GitHub `main` is not deployment-identical.

### Task 3: Add the `/journey/` route contract before implementation

**Files:**
- Modify production: `tests/tests.txt`

**Interfaces:**
- Consumes: critical-route contract from `AGENTS.md`.
- Produces: Test 8 requiring native crawlable `/journey/`, no meta-refresh and global release integrity.

- [x] Add Test 8 before route implementation.
- [x] Verify structural RED: pre-repair snapshot `1787521286005` has no `public/journey/`.
- [x] Record provider limitation: current AppDeploy QA reports `e2e_tests=null`, so no executable RED/PASS is claimed.

### Task 4: Implement `/journey/` and reconcile global release identity

**Files:**
- Create production: `public/journey/index.html`
- Modify production: `src/App.tsx`
- Modify production: `backend/index.ts`
- Modify production: `index.html`
- Modify production: `public/release.json`

**Interfaces:**
- Consumes: existing static critical-route conventions and the current frontend/backend runtime.
- Produces: native crawlable Journey route and global release `7ya-production-truth-20260824-1` across active global release surfaces.

- [x] Reuse existing static route conventions without meta-refresh.
- [x] Create canonical/hreflang Journey route with direct entry into the autobiographical experience.
- [x] Reconcile frontend, backend, homepage and release manifest to one global release id.
- [x] Correct `public/release.json` so it does not falsely require an unavailable `3/3` E2E result.
- [x] Deploy bounded changes through AppDeploy update semantics.
- [x] Handle a concurrent deployment safely by waiting for terminal state and then reapplying the same bounded patch to the newest snapshot.

### Task 5: Verify production and preserve the post-repair delta

**Files:**
- Create: `appdeploy-live/1787521959471/README.md`
- Create: `appdeploy-live/1787521959471/public/journey/index.html`
- Create: `appdeploy-live/1787521959471/release-delta.json`
- Create: `docs/releases/2026-08-24-production-source-recovery.md`

**Interfaces:**
- Consumes: post-deploy AppDeploy status, source reads and domain state.
- Produces: auditable before/after production receipt.

- [x] Verify post-repair immutable snapshot `1787521959471`.
- [x] Verify terminal `ready`, zero frontend/network/backend errors and fresh desktop/mobile captures.
- [x] Confirm `public/journey/index.html` exists in the deployed snapshot.
- [x] Confirm global release id across `src/App.tsx`, `backend/index.ts`, `index.html`, `public/journey/index.html` and `public/release.json`.
- [x] Confirm `7ya.io` and `www.7ya.io` remain active custom domains.
- [x] Preserve the exact Journey route and repair-delta provenance in GitHub.
- [ ] Write/fetch the final release receipt after one last fresh provider verification.

### Task 6: Open the recovery PR without merging

**Interfaces:**
- Consumes: verified recovery branch and final production receipt.
- Produces: reviewable integration surface, not an automatic cutover.

- [ ] Compare `recovery/appdeploy-1787521286005` against `main`.
- [ ] Open a draft PR summarizing preserved runtime evidence, governance corrections, route repair and remaining parity debt.
- [ ] Do not merge the PR in this slice.