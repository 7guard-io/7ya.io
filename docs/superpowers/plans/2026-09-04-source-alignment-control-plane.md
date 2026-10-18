# Source Alignment Control Plane Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make production/source drift an explicit machine-readable and user-visible release gate before any premium 7YA / LIFE implementation proceeds.

**Architecture:** Preserve AppDeploy as current runtime truth while GitHub remains the audit/target source. Add a small release contract and a non-destructive Control overlay instead of replacing the existing Control page. The gate stays red until full AppDeploy→Git reconstruction is actually complete.

**Tech Stack:** Existing AppDeploy React/Vite production snapshot, static `public/release.json`, static `/control/`, vanilla browser JS overlay, AppDeploy E2E tests, GitHub audit branch.

**Spec:** `docs/superpowers/specs/2026-09-04-living-life-control-plane-design.md`

## Execution status — 2026-09-04

- Contract TDD: RED observed, then GREEN observed.
- Git branch implementation: prepared.
- Production deploy: blocked before snapshot creation by AppDeploy lifetime limit `125/125`.
- Current production remains `v93 / 1788453751783`.
- Honest state: `CONTROL_PATCH_PREPARED / SOURCE_ALIGNMENT_FAIL / DEPLOY_BLOCKED_APPDEPLOY_LIFETIME_LIMIT`.

## Global Constraints

- `DONE` requires source + tests + deployment + live data + fresh mobile/desktop visual QA + accessibility + publication/evidence/privacy gates.
- Build success alone is never completion.
- Do not replace production from GitHub while source drift is unresolved.
- No private/restricted material may enter public Control data.
- No new binary assets, secrets, backend APIs or SDK dependencies are required for Phase A.

---

### Task 1: Define the source-alignment release contract

**Files:**
- Create in Git audit branch: `public/release.json`
- Create: `scripts/check-living-life-control-plane.mjs`

**Interfaces:**
- Produces release keys: `source_alignment_state`, `source_alignment`, `source_alignment_baseline_version`, `source_alignment_checked_at`, `source_alignment_target`.
- `source_alignment_state` is one of `PASS`, `FAIL`, `NOT_RUN`.
- `source_alignment_baseline_version` is the AppDeploy snapshot against which Git reconstructability was assessed; it is intentionally not labeled as the post-deploy current runtime version.

- [x] **Step 1: Write the failing contract test**

```js
import fs from 'node:fs';
import assert from 'node:assert/strict';
const release = JSON.parse(fs.readFileSync('public/release.json','utf8'));
assert.equal(release.source_alignment_state,'FAIL');
assert.match(release.source_alignment_baseline_version,/^\d+$/);
assert.equal(release.source_alignment_target,'GIT_RECONSTRUCTABLE');
assert.match(release.source_alignment_checked_at,/^2026-09-04T/);
```

- [x] **Step 2: Verify RED**

Run: `node scripts/check-living-life-control-plane.mjs`
Observed: FAIL / exit 1 with `ENOENT` because the contract files did not yet exist in the reconstructed test harness.

- [x] **Step 3: Add the minimal release contract**

Canonical fields:

```json
{
  "source_alignment_state": "FAIL",
  "source_alignment_baseline_version": "1788453751783",
  "source_alignment_checked_at": "2026-09-04T15:36:13+03:00",
  "source_alignment_target": "GIT_RECONSTRUCTABLE"
}
```

Keep the existing descriptive `source_alignment` value `APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT`.

- [x] **Step 4: Verify GREEN**

Run: `node scripts/check-living-life-control-plane.mjs`
Observed: `PASS source alignment control contract` / exit 0.

- [x] **Step 5: Commit to isolated Git branch**

Implemented on `spec/living-life-control-plane`.

---

### Task 2: Render the source-alignment gate in Control without replacing Control

**Files:**
- Create in Git audit branch: `public/scripts/source-alignment-control.js`
- Production-only surgical modification planned for `public/control/index.html`: one deferred script include.

**Interfaces:**
- Consumes `../release.json`.
- Produces one visible chip `SOURCE ALIGNMENT · <STATE>` and updates the existing GitHub connector card.

- [x] **Step 1: Extend the contract test before implementation**

```js
const overlay = fs.readFileSync('public/scripts/source-alignment-control.js','utf8');
assert.match(overlay,/source_alignment_state/);
assert.match(overlay,/SOURCE ALIGNMENT/);
assert.match(overlay,/FAIL · DRIFT/);
```

- [x] **Step 2: Verify RED**

Observed failure before the overlay existed.

- [x] **Step 3: Implement the minimal overlay**

The overlay reads `source_alignment_state`; when state is not `PASS`, it renders `SOURCE ALIGNMENT · FAIL`, changes the GitHub connector badge to `FAIL · DRIFT`, and describes the drift as measured against `source_alignment_baseline_version`.

- [x] **Step 4: Verify GREEN**

Contract test passes in the reconstructed harness.

- [ ] **Step 5: Apply production HTML diff**

Planned exact include before `</body>`:

```html
<script src='../scripts/source-alignment-control.js' defer></script>
```

Blocked by AppDeploy provider lifetime deployment limit. Do not call `deploy_app` again until capacity actually increases.

---

### Task 3: Add live acceptance coverage

**Files:**
- Planned AppDeploy modification: `tests/tests.txt`

**Interfaces:**
- User-visible result: `/control/` visibly reports drift and the baseline AppDeploy snapshot used for alignment assessment.

- [x] **Step 1: Define the focused E2E test**

```text
## Test 6 - Expose source drift before premium implementation
Viewport: desktop (1280x800)
Covers: /control/ source alignment gate, release manifest, Git/AppDeploy drift visibility
Description: Verifies production cannot present itself as fully controlled while the live AppDeploy source is not reconstructable from GitHub.
Steps:
1. Open /control/ and wait for release data to load.
2. Confirm a SOURCE ALIGNMENT chip is visible and reports FAIL.
3. Inspect the GITHUB connector card.
4. Open /release.json and compare the source-alignment fields.
Expected: Control visibly shows SOURCE ALIGNMENT · FAIL; the GitHub card shows FAIL · DRIFT; release.json reports source_alignment_state=FAIL, source_alignment_baseline_version=1788453751783 and source_alignment_target=GIT_RECONSTRUCTABLE; the page remains otherwise usable with no private data displayed.
```

- [ ] **Step 2: Deploy the four changed production files**

Planned changes only:
- `public/release.json`
- `public/scripts/source-alignment-control.js`
- `public/control/index.html`
- `tests/tests.txt`

Attempted once. AppDeploy rejected the request before creating a snapshot because the account reached lifetime limit `125/125`.

- [ ] **Step 3: Poll new AppDeploy release to terminal QA**

Not runnable because no new version was created. Post-failure verification confirmed v93 remains latest and production remains `ready`.

---

### Task 4: Live verification and release receipt

**Files:**
- Created: `docs/deployments/2026-09-04-source-alignment-control-gate-blocked.md`

- [x] **Step 1: Verify production was not mutated by the failed deploy**

`get_app_versions` confirms latest remains `v93 / 1788453751783`.

- [x] **Step 2: Verify current runtime status**

`get_app_status` reports production `ready` with no new frontend/backend errors.

- [ ] **Step 3: Verify new Control mobile and desktop**

Blocked: the new Control gate is not live because the provider rejected deployment before snapshot creation.

- [x] **Step 4: Record honest phase state**

`CONTROL_PATCH_PREPARED / SOURCE_ALIGNMENT_FAIL / DEPLOY_BLOCKED_APPDEPLOY_LIFETIME_LIMIT`.

This is **not** `VERIFIED_DONE`. Premium `/life/` implementation must not be described as live until a writable, source-controlled deployment path exists and the live visual gates pass.
