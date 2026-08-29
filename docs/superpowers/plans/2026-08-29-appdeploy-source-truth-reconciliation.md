# AppDeploy Source-Truth Reconciliation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the GitHub control plane truthfully reflect the current AppDeploy production snapshot while quarantining stale automation and preserving a safe path to full source export.

**Architecture:** AppDeploy remains runtime authority until its complete source tree is exported and reconciled. This patch changes only repository governance, workflow activation and reconciliation records; it does not deploy or mutate production. Legacy course removal is a later gated task after full runtime export.

**Tech Stack:** GitHub, GitHub Actions YAML, Node.js repository gates, AppDeploy v2, JSON/Markdown governance records.

**Spec:** `docs/superpowers/specs/2026-08-29-appdeploy-source-truth-reconciliation-design.md`

## Global Constraints

- Production app is `697a008fddc309b142`.
- Verified active snapshot is `1788005385311` / AppDeploy label `v98`.
- Build marker is `7ya-cinematic-os-20260828-v1`.
- Source alignment remains `APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT`.
- Do not deploy, apply a version, mutate DNS, merge to `main`, or claim local CI PASS in this plan.
- Preserve Git history and existing rollback information.

---

### Task 1: Correct governance truth

**Files:**
- Modify: `AGENTS.md`
- Modify: `docs/CONTROL_PLANE_STATE.json`

**Interfaces:**
- Consumes: AppDeploy status/version evidence and the 2026-08-29 production receipt.
- Produces: one consistent machine/human-readable production authority statement.

- [x] **Step 1: Establish the failing condition**

The prior files referenced snapshots older than `1788005385311`, proving governance metadata did not describe current production.

- [x] **Step 2: Update `AGENTS.md` minimally**

The contract now records:

```text
Current verified version: v98 / 1788005385311
Current build marker: 7ya-cinematic-os-20260828-v1
Production receipt: docs/deployments/2026-08-29-linkedin-impact-discovery-v1.md
```

- [x] **Step 3: Update `docs/CONTROL_PLANE_STATE.json`**

The control plane records snapshot `1788005385311`, the current build/receipt, current rollback, explicit incomplete source export and workflow quarantine policy.

- [ ] **Step 4: Run full local release gate before merge**

Run when a network-capable checkout is available:

```bash
npm run release:gate
```

No local PASS is claimed in the current execution environment because the repository clone failed at DNS resolution for `github.com`.

---

### Task 2: Quarantine stale GitHub Actions in place

**Files:**
- Modify: `.github/workflows/cloudflare-appdeploy-dns-apply-once.yml`
- Modify: `.github/workflows/cloudflare-appdeploy-dns-preflight.yml`
- Modify: `.github/workflows/entity-consistency.yml`
- Modify: `.github/workflows/jekyll-gh-pages.yml`
- Modify: `.github/workflows/meta-ai-discovery-enable.yml`
- Modify: `scripts/check-workflows.mjs`

**Interfaces:**
- Consumes: the existing repository safety intent and current manual-only workflow state.
- Produces: a governed workflow directory with zero automatic triggers and five explicit historical quarantines.

- [x] **Step 1: Verify RED state**

The old gate expected only four workflow filenames and still required automatic `push`/`schedule` behavior that the repository had already removed from `pages.yml` and the Digital Museum collector. The gate was therefore structurally stale.

- [x] **Step 2: Quarantine five historical workflows**

Deletion through the connector was safety-blocked, so the safer provenance-preserving implementation is in-place quarantine. Each historical workflow is now manual `workflow_dispatch` only, `contents: read`, contains `QUARANTINED_WORKFLOW`, and performs no mutation/deployment.

- [x] **Step 3: Update the deterministic gate**

`scripts/check-workflows.mjs` now governs all nine workflow files, requires `workflow_dispatch` for all of them, forbids automatic `push`, `pull_request`, `schedule`, `release` and `issues` triggers, and checks that quarantined workflows contain no Cloudflare credentials/apply commands or Pages deployment actions.

- [x] **Step 4: Verify the existing manual workflows**

Repository readback confirms:

- `actions-smoke.yml` is manual-only and retains `ACTIONS_SMOKE_PASS`;
- `ci.yml` is manual-only and executes `npm run release:gate`;
- `pages.yml` is manual-only and retains the explicit legacy snapshot path;
- `digital-museum-collector.yml` is manual-only and retains its explicit forensic/evidence sync path.

- [x] **Step 5: Confirm production remained untouched**

Fresh AppDeploy status after repository changes is `ready`, with zero current frontend/backend errors; both canonical AppDeploy domains remain active.

---

### Task 3: Record the live runtime reconciliation checkpoint

**Files:**
- Create: `docs/reconciliation/2026-08-29-appdeploy-1788005385311.md`

**Interfaces:**
- Consumes: AppDeploy `src_glob`, `src_read package.json`, status and domain evidence.
- Produces: an immutable human-readable checkpoint for the later full export.

- [x] **Step 1: Record observed runtime architecture**

The checkpoint documents the Vite/React frontend, backend TypeScript, shared content/evidence modules, public route projections, cron configuration, tests and static resources.

- [x] **Step 2: Record production status**

The checkpoint includes snapshot, label, build marker, current zero frontend/backend errors and active `7ya.io`/`www.7ya.io` AppDeploy domains.

- [x] **Step 3: Record what is not complete**

A full content export of every runtime file to GitHub has not been completed. The legacy GitHub application tree remains non-deployable production source.

- [x] **Step 4: Record legacy cleanup gate**

GenAI curriculum removal is explicitly deferred until full export, reference scan and release-gate verification.

---

### Task 4: Verify branch and open PR

**Files:**
- Review all branch changes.

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: a reviewable pull request without production mutation.

- [x] **Step 1: Compare branch against `main`**

The branch is based directly on current `main` with no behind commits. Changes are limited to governance, workflow quarantine/gating, the design/plan and the runtime reconciliation checkpoint.

- [x] **Step 2: Re-check AppDeploy**

Fresh status: `ready`, zero current frontend/backend errors.

- [x] **Step 3: Re-check custom domains**

Fresh provider control-plane check: `7ya.io` and `www.7ya.io` are both active.

- [ ] **Step 4: Full local release gate**

Still pending because the available container cannot resolve `github.com` to clone the repository. This is an execution-environment blocker, not a claimed code failure or PASS.

- [ ] **Step 5: Open PR**

PR must state that this is a control-plane safety repair, not a production deployment, and that legacy GenAI deletion is deliberately deferred until the full runtime export is reconciled.
