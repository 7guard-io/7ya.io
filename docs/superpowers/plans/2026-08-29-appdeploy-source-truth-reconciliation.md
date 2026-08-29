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

- [ ] **Step 1: Establish the failing condition**

Confirm the current files still reference snapshots older than `1788005385311`. The failure is the mismatch itself: governance metadata does not describe current production.

- [ ] **Step 2: Update `AGENTS.md` minimally**

Replace stale production version/build/receipt references with:

```text
Current verified version: v98 / 1788005385311
Current build marker: 7ya-cinematic-os-20260828-v1
Production receipt: docs/deployments/2026-08-29-linkedin-impact-discovery-v1.md
```

Keep the warning that GitHub does not yet contain the exact full production source.

- [ ] **Step 3: Update `docs/CONTROL_PLANE_STATE.json`**

Set `updated_at` to the execution time in `Asia/Jerusalem`, set `production.applied_snapshot` to `1788005385311`, and keep `source_reconciliation.full_runtime_tree_export_complete` false. Record the current receipt and build marker explicitly.

- [ ] **Step 4: Deterministically re-read both files**

Expected: both files contain `1788005385311`, `7ya-cinematic-os-20260828-v1`, and the source-export warning.

- [ ] **Step 5: Commit**

Use a focused governance commit.

---

### Task 2: Quarantine stale GitHub Actions

**Files:**
- Delete: `.github/workflows/cloudflare-appdeploy-dns-apply-once.yml`
- Delete: `.github/workflows/cloudflare-appdeploy-dns-preflight.yml`
- Delete: `.github/workflows/entity-consistency.yml`
- Delete: `.github/workflows/jekyll-gh-pages.yml`
- Delete: `.github/workflows/meta-ai-discovery-enable.yml`
- Verify: `scripts/check-workflows.mjs`

**Interfaces:**
- Consumes: the existing workflow allowlist in `scripts/check-workflows.mjs`.
- Produces: an active workflow directory that matches the repository's declared workflow contract.

- [ ] **Step 1: Verify RED state**

The active workflow directory contains files not present in the allowlist:

```text
actions-smoke.yml
ci.yml
cloudflare-appdeploy-dns-apply-once.yml
cloudflare-appdeploy-dns-preflight.yml
digital-museum-collector.yml
entity-consistency.yml
jekyll-gh-pages.yml
meta-ai-discovery-enable.yml
pages.yml
```

The existing gate expects exactly:

```text
actions-smoke.yml
ci.yml
digital-museum-collector.yml
pages.yml
```

Therefore `scripts/check-workflows.mjs` is structurally RED before the change.

- [ ] **Step 2: Remove only the five stale workflow entry points**

Do not delete their supporting scripts, receipts or Git history.

- [ ] **Step 3: Verify GREEN state structurally**

List `.github/workflows/*.yml`. Expected exact set:

```text
actions-smoke.yml
ci.yml
digital-museum-collector.yml
pages.yml
```

No update to `scripts/check-workflows.mjs` is required.

- [ ] **Step 4: Confirm production remained untouched**

AppDeploy status must still be `ready`; canonical domains must remain active.

- [ ] **Step 5: Commit**

Use a focused workflow-quarantine commit.

---

### Task 3: Record the live runtime reconciliation checkpoint

**Files:**
- Create: `docs/reconciliation/2026-08-29-appdeploy-1788005385311.md`

**Interfaces:**
- Consumes: AppDeploy `src_glob`, `src_read package.json`, status and domain evidence.
- Produces: an immutable human-readable checkpoint for the later full export.

- [ ] **Step 1: Record observed runtime architecture**

Document that the live snapshot contains a Vite/React frontend, backend TypeScript, shared content/evidence modules, public route projections, cron configuration, tests and static resources.

- [ ] **Step 2: Record production status**

Include snapshot, label, build marker, zero current frontend/backend errors and active `7ya.io`/`www.7ya.io` AppDeploy domains.

- [ ] **Step 3: Record what is not complete**

Explicitly state that a full content export of every runtime file to GitHub has not been completed by this patch and that no legacy application tree may be used as deployable source until that happens.

- [ ] **Step 4: Record legacy cleanup gate**

State that GenAI curriculum removal occurs only after full export, import/reference scan and release-gate verification.

- [ ] **Step 5: Commit**

Use a focused reconciliation-record commit.

---

### Task 4: Verify branch and open PR

**Files:**
- Review all branch changes.

**Interfaces:**
- Consumes: Tasks 1-3.
- Produces: a reviewable pull request without production mutation.

- [ ] **Step 1: Compare branch against `main`**

Expected changes: two governance updates, five workflow deletions, one design doc, one implementation plan and one reconciliation checkpoint.

- [ ] **Step 2: Re-check AppDeploy**

Expected: `ready`, no current frontend/backend errors.

- [ ] **Step 3: Re-check custom domains**

Expected: `7ya.io` and `www.7ya.io` both active on AppDeploy.

- [ ] **Step 4: Attempt local release gate only if a network-capable checkout is available**

Run:

```bash
npm run release:gate
```

If repository checkout is blocked by DNS/network resolution, record that exact limitation and do not claim PASS.

- [ ] **Step 5: Open a PR**

PR must clearly state that it is a control-plane safety repair, not a production deployment, and that legacy GenAI deletion is deliberately deferred until the full runtime export is reconciled.
