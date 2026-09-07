# AppDeploy v97 Source Reconciliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconcile the exact AppDeploy v97 production runtime with GitHub without changing production, so future 7YA identity work starts from a provenance-preserving source baseline.

**Architecture:** AppDeploy snapshot `1788795662202` remains runtime authority during Release Zero. GitHub branch `reconcile/appdeploy-v97-20260907` records the runtime manifest, critical source snapshot, comparison evidence and explicit residual gaps. No production promotion, DNS change or `main` replacement is permitted until the full runtime tree is captured and the release gates are satisfied.

**Tech Stack:** React/Vite/TypeScript, AppDeploy v2 frontend+backend, GitHub, static public routes/assets, AppDeploy database/cron/API runtime.

**Spec:** `docs/superpowers/specs/2026-09-07-igor-public-identity-system-v1.md`

## Global Constraints

- Production runtime authority: AppDeploy v97 / `1788795662202`.
- Rollback version: AppDeploy v96 / `1788788589415`.
- Canonical repository: `7guard-io/7ya.io`; no direct commit or force-push to `main`.
- Do not deploy GitHub `main` over AppDeploy v97 while `full_runtime_tree_export_complete=false`.
- Preserve all canonical corpus, public projection, social ingestion, Meta sync, Bro Chat, routes, evidence states and privacy boundaries.
- Never mark a source export complete unless exact runtime files are actually captured; partial exports must remain labeled partial.
- No production UI, DNS, domain or scheduler mutation is part of Release Zero.
- E2E is currently not run; do not claim an E2E PASS.

---

### Task 1: Freeze and verify production authority

**Files:**
- Create: `docs/releases/2026-09-07-appdeploy-v97-reconciliation.json`

**Interfaces:**
- Consumes: AppDeploy version list, status, domain bindings, `docs/CONTROL_PLANE_STATE.json`.
- Produces: immutable reconciliation receipt with production/rollback ids and safety state.

- [ ] Verify v97 snapshot `1788795662202` is applied and v96 `1788788589415` exists as rollback.
- [ ] Verify terminal AppDeploy status, current error counts and active scheduler set.
- [ ] Record that no production mutation occurred during Release Zero.
- [ ] Commit the receipt.

### Task 2: Capture the complete v97 path manifest

**Files:**
- Create: `appdeploy-live/1788795662202/MANIFEST.json`

**Interfaces:**
- Consumes: all paginated `src_glob("**/*")` results for v97.
- Produces: ordered complete path inventory classified as runtime-source, public-static, binary-asset, tests/config or documentation.

- [ ] Enumerate every v97 path through all continuation tokens.
- [ ] Classify every path without dropping unknown entries.
- [ ] Store snapshot id, capture date, file count and classification counts.
- [ ] Commit the manifest before copying source content.

### Task 3: Capture the active runtime source closure

**Files:**
- Create under: `appdeploy-live/1788795662202/`
- Required roots: `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `postcss.config.js`, `cron.json`, `tests/tests.txt`, `src/**`, `shared/**`, `backend/**`.

**Interfaces:**
- Consumes: exact AppDeploy `src_read` content.
- Produces: provenance snapshot of code required to build and operate v97.

- [ ] Read each runtime-source file from v97 rather than inferring it from older GitHub snapshots.
- [ ] Preserve exact path and content beneath `appdeploy-live/1788795662202/`.
- [ ] Do not silently normalize claims, routes, API contracts or scheduler configuration while copying.
- [ ] Record any file that cannot be captured exactly in `EXPORT_GAPS.json`.
- [ ] Commit source capture in bounded batches.

### Task 4: Capture public/static and binary provenance

**Files:**
- Create/update: `appdeploy-live/1788795662202/MANIFEST.json`
- Create: `appdeploy-live/1788795662202/EXPORT_GAPS.json`

**Interfaces:**
- Consumes: `public/**` runtime inventory and AppDeploy binary/text read support.
- Produces: exact-copy status for each public route/data/script/style/asset.

- [ ] Copy all text public files exactly when connector support permits.
- [ ] For binary assets, preserve exact bytes when a safe binary path is available; otherwise mark each asset explicitly `not-exported` with its exact runtime path.
- [ ] Never call the full export complete while any runtime path remains uncaptured.
- [ ] Verify critical public data files remain represented: entity registry, evidence wall, public link ledger, feed, sitemap, robots, manifest and localized route shells.

### Task 5: Compare v97 against GitHub main

**Files:**
- Create: `docs/releases/2026-09-07-appdeploy-v97-main-comparison.md`

**Interfaces:**
- Consumes: v97 manifest/source capture and current `main` tree/files.
- Produces: categorized drift report: missing-on-main, changed, main-only, identical/verified, not-yet-compared.

- [ ] Verify known root drift (`src/App.tsx`, `backend/index.ts`, `cron.json`) directly.
- [ ] Compare build/runtime configuration and package contract.
- [ ] Compare critical route and data surfaces.
- [ ] Report source drift without treating historical `appdeploy-live/*` snapshots as current authority.
- [ ] Do not recommend a main deployment until no critical comparison gap remains.

### Task 6: Validate Release Zero and hand off to identity implementation

**Files:**
- Update: `docs/releases/2026-09-07-appdeploy-v97-reconciliation.json`
- Update only when justified: `docs/CONTROL_PLANE_STATE.json`

**Interfaces:**
- Consumes: manifest, export gap report, comparison report and runtime health.
- Produces: a binary go/no-go decision for starting the broad redesign from the reconciled source.

- [ ] Re-read AppDeploy status after reconciliation and confirm production stayed unchanged.
- [ ] Confirm rollback still exists.
- [ ] Set `full_runtime_tree_export_complete=true` only if every runtime path was captured exactly and compared; otherwise leave false and list the exact remaining gap.
- [ ] Confirm identity work will branch from the reconciled runtime source rather than stale `main` runtime files.
- [ ] Open a draft PR with scope, evidence, privacy, residual gaps and rollback notes; do not merge or deploy as part of Release Zero.
