# Source Alignment Control Plane Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make production/source drift an explicit machine-readable and user-visible release gate before any premium 7YA / LIFE implementation proceeds.

**Architecture:** Preserve AppDeploy as current runtime truth while GitHub remains the audit/target source. Add a small release contract and a non-destructive Control overlay instead of replacing the existing Control page. The gate stays red until full AppDeploy→Git reconstruction is actually complete.

**Tech Stack:** Existing AppDeploy React/Vite production snapshot, static `public/release.json`, static `/control/`, vanilla browser JS overlay, AppDeploy E2E tests, GitHub audit branch.

**Spec:** `docs/superpowers/specs/2026-09-04-living-life-control-plane-design.md`

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
- Produces release keys: `source_alignment_state`, `source_alignment`, `appdeploy_version`, `source_alignment_checked_at`, `source_alignment_target`.
- `source_alignment_state` is one of `PASS`, `FAIL`, `NOT_RUN`.

- [ ] **Step 1: Write the failing contract test**

```js
import fs from 'node:fs';
import assert from 'node:assert/strict';
const release = JSON.parse(fs.readFileSync('public/release.json','utf8'));
assert.equal(release.source_alignment_state,'FAIL');
assert.match(release.appdeploy_version,/^\d+$/);
assert.equal(release.source_alignment_target,'GIT_RECONSTRUCTABLE');
assert.match(release.source_alignment_checked_at,/^2026-09-04T/);
```

- [ ] **Step 2: Verify RED**

Run: `node scripts/check-living-life-control-plane.mjs`
Expected: FAIL because the Git audit branch does not yet contain the production release contract.

- [ ] **Step 3: Add the minimal release contract**

Use the current production release payload and add:

```json
{
  "source_alignment_state": "FAIL",
  "appdeploy_version": "1788453751783",
  "source_alignment_checked_at": "2026-09-04T15:30:00+03:00",
  "source_alignment_target": "GIT_RECONSTRUCTABLE"
}
```

Keep the existing descriptive `source_alignment` value `APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT`.

- [ ] **Step 4: Verify GREEN**

Run: `node scripts/check-living-life-control-plane.mjs`
Expected: PASS.

- [ ] **Step 5: Commit**

Commit message: `test(control): define source alignment release gate`

---

### Task 2: Render the source-alignment gate in Control without replacing Control

**Files:**
- Create: `public/scripts/source-alignment-control.js`
- Production-only surgical modification: `public/control/index.html` adds one deferred script include.

**Interfaces:**
- Consumes `../release.json`.
- Produces one visible chip `SOURCE ALIGNMENT · <STATE>` and updates the existing GitHub connector card.

- [ ] **Step 1: Extend the contract test before implementation**

Add assertions:

```js
const overlay = fs.readFileSync('public/scripts/source-alignment-control.js','utf8');
assert.match(overlay,/source_alignment_state/);
assert.match(overlay,/SOURCE ALIGNMENT/);
assert.match(overlay,/FAIL · DRIFT/);
```

- [ ] **Step 2: Verify RED**

Run the script; expected FAIL because the overlay file does not exist.

- [ ] **Step 3: Implement the minimal overlay**

Behavior:

```js
(async()=>{
  try{
    const response=await fetch('../release.json',{cache:'no-store'});
    if(!response.ok)throw new Error('release '+response.status);
    const release=await response.json();
    const state=release.source_alignment_state||'NOT_RUN';
    const chips=document.querySelector('.hero .chips');
    if(chips&&!document.querySelector('#sourceAlignmentChip')){
      const chip=document.createElement('span');
      chip.id='sourceAlignmentChip';
      chip.className='chip '+(state==='PASS'?'ready':'fail');
      chip.textContent='SOURCE ALIGNMENT · '+state;
      chips.append(chip);
    }
    const cards=[...document.querySelectorAll('#connectors .status-card')];
    const github=cards.find(card=>card.textContent.includes('GITHUB'));
    if(github){
      const badge=github.querySelector('.badge');
      const note=github.querySelector('p');
      if(badge){badge.className='badge '+(state==='PASS'?'ready':'off');badge.textContent=state==='PASS'?'ALIGNED':'FAIL · DRIFT';}
      if(note)note.textContent=state==='PASS'?'Production is reconstructable from the recorded Git source.':'AppDeploy '+(release.appdeploy_version||'unknown')+' is runtime truth; Git reconstruction is still incomplete.';
    }
  }catch(error){
    console.error('[7YA source alignment]',error);
  }
})();
```

- [ ] **Step 4: Verify GREEN**

Run the contract test; expected PASS.

- [ ] **Step 5: Record the production HTML diff**

Add exactly one include before `</body>`:

```html
<script src='../scripts/source-alignment-control.js' defer></script>
```

Do not rewrite the existing Control page.

- [ ] **Step 6: Commit**

Commit message: `feat(control): expose source drift gate`

---

### Task 3: Add live acceptance coverage

**Files:**
- Modify in AppDeploy snapshot: `tests/tests.txt`

**Interfaces:**
- User-visible result: `/control/` visibly reports drift and the exact runtime version.

- [ ] **Step 1: Add one focused test**

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
Expected: Control visibly shows SOURCE ALIGNMENT · FAIL; the GitHub card shows FAIL · DRIFT; release.json reports source_alignment_state=FAIL, appdeploy_version=1788453751783 and source_alignment_target=GIT_RECONSTRUCTABLE; the page remains otherwise usable with no private data displayed.
```

- [ ] **Step 2: Deploy only the three changed production files**

Changed files only:
- `public/release.json`
- `public/scripts/source-alignment-control.js`
- `public/control/index.html`
- `tests/tests.txt`

- [ ] **Step 3: Poll AppDeploy until terminal status**

Expected: `ready`; if E2E fails, inspect QA run details before changing code.

---

### Task 4: Live verification and release receipt

**Files:**
- Create: `docs/deployments/2026-09-04-source-alignment-control-gate.md`

**Interfaces:**
- Records Git branch/commit, AppDeploy version, previous rollback version, QA evidence and remaining source-drift state.

- [ ] **Step 1: Verify live release JSON**

Confirm the deployed `/release.json` contains the new source-alignment fields.

- [ ] **Step 2: Verify live Control mobile and desktop**

Use fresh QA screenshots from the deployed version and confirm the new gate is visible without clipping/overflow.

- [ ] **Step 3: Verify runtime errors**

Require zero new frontend/backend errors attributable to this change.

- [ ] **Step 4: Record the honest phase status**

Phase A state after this patch is `CONTROL_GATE_ACTIVE / SOURCE_ALIGNMENT_FAIL`, not `VERIFIED_DONE`.

The next implementation task is the complete AppDeploy source reconstruction; premium `/life/` work remains blocked until that gate turns PASS.
