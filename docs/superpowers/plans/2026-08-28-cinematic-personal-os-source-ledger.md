# 7YA Cinematic Personal OS — Source Ledger Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make GitHub accurately identify the current AppDeploy production snapshot and rollback boundary without falsely claiming a complete source export that does not exist.

**Architecture:** AppDeploy snapshot `1787938839410` remains the authoritative runtime source. GitHub receives a ledger-only release directory plus an updated `appdeploy-live/CURRENT.json`; both explicitly state that source reconstruction from GitHub is not yet possible and that stale GitHub runtime files must not be deployed over production.

**Tech Stack:** GitHub release ledger, AppDeploy snapshot metadata, Markdown/JSON.

**Spec:** `docs/superpowers/specs/2026-08-28-cinematic-personal-os-design.md`

## Global Constraints

- Production app: AppDeploy `697a008fddc309b142`.
- Current validated production snapshot: `1787938839410`.
- Immediate rollback snapshot: `1787938474434`.
- Runtime QA: READY with 0 frontend, 0 backend and 0 network errors in the AppDeploy QA snapshot for the current release.
- Release marker: `7ya-cinematic-os-20260828-v1`.
- Do not claim full GitHub/AppDeploy source reconciliation.
- Do not create a fake source mirror or a reconstructable path when the required base snapshot is absent from GitHub.
- `CURRENT.json` must explicitly warn against deploying stale GitHub runtime source over AppDeploy production.

---

### Task 1: Create the current production release receipt

**Files:**
- Create: `appdeploy-live/1787938839410/RELEASE-RECEIPT.md`

**Interfaces:**
- Produces a human-readable current production receipt referenced by the ledger.

- [ ] **Step 1: Record production identity**

Include app id, snapshot id, release marker, date, domain and rollback snapshot.

- [ ] **Step 2: Record the delivered product changes**

List the three validated slices:

```text
1. Cinematic home: six curated story scenes → Media Front Door → Impact depth.
2. Focused public rooms: redundant global continuity wrappers removed from Media/Museum/Research/Evidence/Library/Speaker/Music; StartOn dedicated shell preserved.
3. SEO/performance: static first paint synchronized, release markers aligned, hero image preloaded, Media/Research CollectionPage JSON-LD added, sitemap and llms.txt refreshed.
```

- [ ] **Step 3: Record verification boundary**

State `READY_0_FRONTEND_0_BACKEND_0_NETWORK`. Also state that generated QA screenshots exist but a manual pixel-perfect visual PASS is not claimed from this runtime.

- [ ] **Step 4: Record source-of-truth limitation**

State that GitHub does not contain a complete atomic export of the production source or its required modern base snapshot; therefore the directory is ledger-only and AppDeploy snapshot `1787938839410` remains authoritative.

---

### Task 2: Create a machine-readable cutover manifest

**Files:**
- Create: `appdeploy-live/1787938839410/CUTOVER-MANIFEST.json`

**Interfaces:**
- Produces a machine-readable current snapshot pointer and safety policy.

- [ ] **Step 1: Write exact manifest fields**

```json
{
  "app_id": "697a008fddc309b142",
  "snapshot": "1787938839410",
  "rollback_snapshot": "1787938474434",
  "status": "READY",
  "release": "7ya-cinematic-os-20260828-v1",
  "export_mode": "ledger-only",
  "source_export_complete": false,
  "runtime_source_of_truth": "AppDeploy snapshot 1787938839410",
  "runtime_errors": {"frontend": 0, "backend": 0, "network": 0},
  "github_runtime_deploy_safe": false,
  "policy": "Do not deploy GitHub runtime source over production until a complete atomic AppDeploy source export/reconciliation is available and verified."
}
```

---

### Task 3: Update the canonical CURRENT pointer

**Files:**
- Modify: `appdeploy-live/CURRENT.json`

**Interfaces:**
- `CURRENT.json` becomes the canonical release-ledger pointer, not a claim of source reconstruction.

- [ ] **Step 1: Point CURRENT to the new ledger directory**

Set snapshot to `1787938839410`, rollback snapshot to `1787938474434`, exported_at to `2026-08-28`, and path to `appdeploy-live/1787938839410/`.

- [ ] **Step 2: Make export status explicit**

Add:

```json
"export_mode": "ledger-only",
"source_export_complete": false,
"runtime_source_of_truth": "AppDeploy snapshot 1787938839410",
"repository_role": "canonical release ledger; runtime source mirror pending complete atomic export",
"reconstruction": "NOT_RECONSTRUCTABLE_FROM_CURRENT_GITHUB_MAIN",
"deploy_policy": "DO_NOT_DEPLOY_STALE_GITHUB_RUNTIME_OVER_APPDEPLOY_PRODUCTION"
```

- [ ] **Step 3: Preserve verified operational state**

Set runtime QA to `READY_0_FRONTEND_0_BACKEND_0_NETWORK`; do not claim CI PASS.

---

### Task 4: Verify the GitHub ledger readback

**Files:**
- Read: `appdeploy-live/CURRENT.json`
- Read: `appdeploy-live/1787938839410/RELEASE-RECEIPT.md`
- Read: `appdeploy-live/1787938839410/CUTOVER-MANIFEST.json`

- [ ] **Step 1: Read back all three files from GitHub main**

Expected: every snapshot/release/rollback value is consistent.

- [ ] **Step 2: Confirm no false source-export claim exists**

Expected: `source_export_complete=false`, `export_mode=ledger-only`, GitHub runtime deploy safety false.

## Self-review

- This plan improves operational truth without pretending source reconciliation has occurred.
- No runtime code or production behavior changes.
- No CI PASS is claimed.
- A future complete AppDeploy export can replace `ledger-only` with an actual reconstructable mirror without rewriting historical receipts.
