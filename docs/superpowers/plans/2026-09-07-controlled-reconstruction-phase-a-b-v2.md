# 7YA Controlled Reconstruction Phase A+B v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture the current AppDeploy v97 runtime snapshot `1788809457536` as immutable provenance, classify drift against canonical GitHub `main`, and install deterministic safety contracts before any architectural refactor.

**Architecture:** Phase A is evidence preservation, not a production rewrite. The active AppDeploy source is archived under a snapshot-prefixed path and compared against `main` without copying it into deployable repository roots. Phase B adds provider-independent contracts plus Node built-in tests that describe the current route, locale, SEO, scheduler and release expectations. Production remains untouched throughout this plan.

**Tech Stack:** GitHub, AppDeploy v2 source snapshots, Node.js 22+, ECMAScript modules, `node:test`, `node:assert/strict`, `node:crypto`, existing 7YA release scripts.

**Spec:** `docs/superpowers/specs/2026-09-07-controlled-reconstruction-design.md`

## Global Constraints

- Working branch: `refactor/controlled-reconstruction-20260907`.
- Canonical repository: `7guard-io/7ya.io`.
- Canonical `main` baseline: `f048a13b214e9585f40662c1316817625339b732`.
- AppDeploy app: `697a008fddc309b142`.
- Current runtime baseline: AppDeploy `v97`, snapshot `1788809457536`, created `2026-09-07T19:30:57.536Z`.
- Previous plan snapshot `1788806726940` is now AppDeploy `v96` and is superseded for current-state capture.
- Do not deploy `main` or this reconstruction branch over production during Phase A+B.
- Do not mutate active root `src/`, `backend/`, `public/`, `package.json`, `cron.json`, or build configuration during Phase A+B.
- Do not export raw secrets, auth session state, credentials, API keys, private connector data, or provider login blobs.
- Hebrew RTL remains primary; English and Russian remain first-class locales.
- Preserve evidence-state and privacy boundaries from `AGENTS.md`.
- Do not claim E2E success when `e2e_tests` is null.
- No new router, framework, state manager or test dependency is introduced in this plan.
- A production improvement claim is forbidden in Phase A+B because this phase intentionally makes no production mutation.

---

## File Structure

### Immutable capture

- `appdeploy-live/1788809457536/CAPTURE-MANIFEST.json` — capture identity, health state, source inventory and exclusions.
- `appdeploy-live/1788809457536/RELEASE-RECEIPT.md` — human-readable provenance receipt.
- `appdeploy-live/1788809457536/source-tree.json` — complete ordered AppDeploy path inventory.
- `appdeploy-live/1788809457536/index.html`
- `appdeploy-live/1788809457536/package.json`
- `appdeploy-live/1788809457536/postcss.config.js`
- `appdeploy-live/1788809457536/cron.json`
- `appdeploy-live/1788809457536/src/**`
- `appdeploy-live/1788809457536/backend/**`
- `appdeploy-live/1788809457536/shared/**`
- `appdeploy-live/1788809457536/scripts/**`
- `appdeploy-live/1788809457536/tests/**`
- `appdeploy-live/1788809457536/public/**` for text/data assets; binaries are separately classified.

### Contracts

- `contracts/runtime/public-routes.json`
- `contracts/runtime/seo-contract.json`
- `contracts/runtime/scheduler-contract.json`
- `contracts/runtime/release-contract.json`

### Verification

- `scripts/reconstruction/check-capture.mjs`
- `scripts/reconstruction/report-drift.mjs`
- `tests/reconstruction/capture-integrity.test.mjs`
- `tests/reconstruction/runtime-contract.test.mjs`
- `docs/releases/2026-09-07-appdeploy-v97-1788809457536-drift.json`
- `docs/releases/2026-09-07-appdeploy-v97-1788809457536-capture.md`

---

### Task 1: Freeze the current AppDeploy identity

**Files:**
- Create: `appdeploy-live/1788809457536/CAPTURE-MANIFEST.json`
- Create: `appdeploy-live/1788809457536/RELEASE-RECEIPT.md`
- Create: `appdeploy-live/1788809457536/source-tree.json`

**Interfaces:**
- Consumes: AppDeploy `get_app_versions`, `get_app_status`, and every page of `src_glob` for snapshot `1788809457536`.
- Produces: immutable capture metadata consumed by every later task.

- [ ] **Step 1: Verify runtime freshness**

Require current evidence to show:

```text
app_id = 697a008fddc309b142
version_name = v97
version_id = 1788809457536
status = ready
frontend_errors = 0
backend_errors = 0
network_errors = 0
e2e_tests = null
active_crons = agent-mesh-hourly, meta-sync-hourly
```

If a newer applied version appears before source copying begins, create a new snapshot-prefixed capture directory and do not silently relabel `1788809457536` as current.

- [ ] **Step 2: Persist the complete source path inventory**

Collect all `src_glob` continuation pages for `1788809457536`. Preserve exact paths in lexical order in `source-tree.json`:

```json
{
  "schemaVersion": 1,
  "appId": "697a008fddc309b142",
  "versionName": "v97",
  "snapshot": "1788809457536",
  "paths": []
}
```

The inventory must include currently observed additions such as `public/map/index.html` and `shared/content-operating-map.ts`.

- [ ] **Step 3: Create the capture manifest**

Use this exact shape:

```json
{
  "schemaVersion": 1,
  "capturedAt": "2026-09-07T19:45:03Z",
  "source": {
    "provider": "AppDeploy",
    "appId": "697a008fddc309b142",
    "versionName": "v97",
    "snapshot": "1788809457536"
  },
  "repository": {
    "name": "7guard-io/7ya.io",
    "mainBaseline": "f048a13b214e9585f40662c1316817625339b732",
    "captureBranch": "refactor/controlled-reconstruction-20260907"
  },
  "healthAtCapture": {
    "status": "ready",
    "frontendErrors": 0,
    "networkErrors": 0,
    "backendErrors": 0,
    "e2e": null
  },
  "activeSchedulers": ["agent-mesh-hourly", "meta-sync-hourly"],
  "excludedProviderFiles": ["appdeploy.auth-login.json"],
  "secretsExported": false,
  "fullRuntimeTreeExportComplete": false
}
```

- [ ] **Step 4: Create the receipt**

```markdown
# AppDeploy v97 Source Capture Receipt

- App: `697a008fddc309b142`
- Version: `v97`
- Snapshot: `1788809457536`
- Capture branch: `refactor/controlled-reconstruction-20260907`
- Canonical main baseline: `f048a13b214e9585f40662c1316817625339b732`
- Production mutation: **none**
- E2E claim: **not run / not claimed**
- Active schedulers: `agent-mesh-hourly`, `meta-sync-hourly`
- Purpose: immutable source capture before controlled reconstruction

This directory is provenance evidence. It is not a deployable replacement for production.
```

- [ ] **Step 5: Verify branch diff**

Expected: only docs and the three capture metadata files change. No active runtime root changes.

- [ ] **Step 6: Commit**

```bash
git add appdeploy-live/1788809457536 docs/superpowers/plans/2026-09-07-controlled-reconstruction-phase-a-b-v2.md
git commit -m "docs(capture): freeze current AppDeploy v97 identity"
```

---

### Task 2: Export runtime text source without changing production

**Files:**
- Create under `appdeploy-live/1788809457536/`: root build files plus exact text contents from `src/**`, `backend/**`, `shared/**`, `scripts/**`, `tests/**`, and text/data files under `public/**`.

**Interfaces:**
- Consumes: `source-tree.json` from Task 1.
- Produces: reviewable source snapshot for drift analysis.

- [ ] **Step 1: Read each root runtime file from the exact snapshot**

Capture unchanged text for:

```text
index.html
package.json
postcss.config.js
cron.json
tailwind.config.js
tsconfig.json
vite.config.ts
```

- [ ] **Step 2: Capture frontend, backend and shared source exactly**

For every path in these classes:

```text
src/**
backend/**
shared/**
scripts/**
tests/**
```

write the AppDeploy `src_read(version='1788809457536')` content under the same relative path beneath `appdeploy-live/1788809457536/`.

Do not prettify `src/App.tsx`; its one-line formatting is part of the captured evidence.

- [ ] **Step 3: Capture public text/data files**

Capture `.html`, `.css`, `.js`, `.json`, `.xml`, `.txt`, `.svg`, `.webmanifest` and other UTF-8 text files under `public/**`.

- [ ] **Step 4: Classify binary assets**

For `.png`, `.jpg`, `.jpeg`, `.webp`, `.gz` and other binary paths, record one exact classification in the capture report:

```text
captured-binary
verified-existing-canonical
unresolved-binary
```

A runtime-critical `unresolved-binary` blocks Phase A completion.

- [ ] **Step 5: Prove provider login state was not exported**

`appdeploy.auth-login.json` remains excluded unless inspected and proven to contain no secret/session state. Default outcome is exclusion.

- [ ] **Step 6: Commit immutable source capture**

```bash
git add appdeploy-live/1788809457536
git commit -m "chore(capture): archive AppDeploy v97 runtime source"
```

---

### Task 3: Add a failing capture-integrity test first

**Files:**
- Create: `tests/reconstruction/capture-integrity.test.mjs`

**Interfaces:**
- Consumes: capture metadata from Task 1.
- Produces: executable completeness contract for Task 2.

- [ ] **Step 1: Write the RED test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root = new URL('../../appdeploy-live/1788809457536/', import.meta.url);
const required = [
  'index.html',
  'package.json',
  'postcss.config.js',
  'cron.json',
  'src/App.tsx',
  'src/locale.tsx',
  'src/engineering-home/EngineeringHome.tsx',
  'backend/index.ts',
  'shared/content-operating-map.ts',
  'tests/tests.txt'
];

test('capture contains critical v97 runtime source', async () => {
  for (const path of required) {
    const value = await readFile(new URL(path, root), 'utf8');
    assert.ok(value.length > 0, `${path} must be captured`);
  }
});

test('manifest pins the current source snapshot without an E2E claim', async () => {
  const manifest = JSON.parse(await readFile(new URL('CAPTURE-MANIFEST.json', root), 'utf8'));
  assert.equal(manifest.source.appId, '697a008fddc309b142');
  assert.equal(manifest.source.versionName, 'v97');
  assert.equal(manifest.source.snapshot, '1788809457536');
  assert.equal(manifest.healthAtCapture.e2e, null);
  assert.equal(manifest.secretsExported, false);
});
```

- [ ] **Step 2: Run RED verification**

```bash
node --test tests/reconstruction/capture-integrity.test.mjs
```

Expected before Task 2 is complete: FAIL because one or more required captured runtime files are absent. A syntax error does not count as RED; fix syntax until the assertion/file-presence behavior is what fails.

- [ ] **Step 3: Complete Task 2 source capture**

Do not weaken the required file list to make the test pass.

- [ ] **Step 4: Run GREEN verification**

```bash
node --test tests/reconstruction/capture-integrity.test.mjs
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add tests/reconstruction/capture-integrity.test.mjs appdeploy-live/1788809457536
git commit -m "test(capture): enforce v97 source completeness"
```

---

### Task 4: Produce deterministic drift classification

**Files:**
- Create: `scripts/reconstruction/report-drift.mjs`
- Create: `docs/releases/2026-09-07-appdeploy-v97-1788809457536-drift.json`

**Interfaces:**
- Consumes: captured runtime tree and canonical repository tree.
- Produces: path-level drift classes used to decide what may later move into active source roots.

- [ ] **Step 1: Write the RED drift test case inside the script module test harness**

The classifier must map path states to exactly these values:

```text
production-runtime-required
canonical-repository-newer
historical-unused
provider-specific
generated-asset
binary-verified
unresolved
```

Use this fixture:

```js
assert.equal(classify({capture:true, canonical:false, runtimeClass:true}), 'production-runtime-required');
assert.equal(classify({capture:false, canonical:true, runtimeClass:false}), 'canonical-repository-newer');
assert.equal(classify({capture:true, canonical:true, equal:false}), 'unresolved');
```

Run before implementation and require failure because `classify` is missing.

- [ ] **Step 2: Implement minimal classifier and deterministic lexical output**

The report must include `path`, `classification`, `capturePresent`, `canonicalPresent`, and when both text files exist, SHA-256 hashes for each side.

- [ ] **Step 3: Generate drift JSON**

```bash
node scripts/reconstruction/report-drift.mjs \
  --capture appdeploy-live/1788809457536 \
  --canonical . \
  --output docs/releases/2026-09-07-appdeploy-v97-1788809457536-drift.json
```

- [ ] **Step 4: Gate unresolved runtime-critical differences**

Any `src/**`, `backend/**`, `shared/**`, `scripts/**`, root build file or active `cron.json` difference classified `unresolved` blocks structural refactoring.

- [ ] **Step 5: Commit**

```bash
git add scripts/reconstruction/report-drift.mjs docs/releases/2026-09-07-appdeploy-v97-1788809457536-drift.json
git commit -m "chore(reconcile): classify AppDeploy and GitHub drift"
```

---

### Task 5: Install provider-independent runtime contracts

**Files:**
- Create: `contracts/runtime/public-routes.json`
- Create: `contracts/runtime/seo-contract.json`
- Create: `contracts/runtime/scheduler-contract.json`
- Create: `contracts/runtime/release-contract.json`
- Create: `tests/reconstruction/runtime-contract.test.mjs`

**Interfaces:**
- Consumes: captured `src/App.tsx`, `public/release.json`, `cron.json`, public static route files.
- Produces: behavior expectations for the later router/SEO/API refactor.

- [ ] **Step 1: Write RED tests for required routes and release identity**

Required canonical public routes:

```json
[
  "/",
  "/igor-vepretski/",
  "/journey/",
  "/starton/",
  "/influence/",
  "/evidence/",
  "/library/",
  "/search/",
  "/media/",
  "/research/",
  "/music/",
  "/speaker/",
  "/blog/",
  "/create/",
  "/contact/"
]
```

Test that the contract files do not yet exist; the test must fail on missing contract files before they are created.

- [ ] **Step 2: Create `public-routes.json`**

Use schema:

```json
{
  "schemaVersion": 1,
  "primaryLocale": "he",
  "firstClassLocales": ["he", "en", "ru"],
  "requiredRoutes": []
}
```

Populate `requiredRoutes` with the list above.

- [ ] **Step 3: Create `seo-contract.json`**

```json
{
  "schemaVersion": 1,
  "requiredFields": ["title", "description", "canonical"],
  "hreflang": ["he", "en", "ru", "es", "x-default"],
  "canonicalOrigin": "https://7ya.io"
}
```

- [ ] **Step 4: Create `scheduler-contract.json`**

```json
{
  "schemaVersion": 1,
  "active": [
    {"name":"agent-mesh-hourly","cron":"17 * * * *","timezone":"Asia/Jerusalem","handler":"agentMeshHourly"},
    {"name":"meta-sync-hourly","cron":"37 * * * *","timezone":"Asia/Jerusalem","handler":"metaSyncHourly"}
  ]
}
```

Disabled historical canaries are not promoted to active contract entries.

- [ ] **Step 5: Create `release-contract.json`**

```json
{
  "schemaVersion": 1,
  "appId": "697a008fddc309b142",
  "capturedSnapshot": "1788809457536",
  "buildMarker": "7ya-engineering-front-door-20260907-v1",
  "canonicalDomain": "https://7ya.io/",
  "requireLiveBuildMarkerProofBeforeReleaseClaim": true,
  "e2eClaim": null
}
```

- [ ] **Step 6: Run GREEN tests**

```bash
node --test tests/reconstruction/runtime-contract.test.mjs
```

Expected: PASS with no ignored tests.

- [ ] **Step 7: Commit**

```bash
git add contracts/runtime tests/reconstruction/runtime-contract.test.mjs
git commit -m "test(runtime): pin route SEO scheduler and release contracts"
```

---

### Task 6: Verify Phase A+B and publish the capture report

**Files:**
- Create: `scripts/reconstruction/check-capture.mjs`
- Modify: `appdeploy-live/1788809457536/CAPTURE-MANIFEST.json`
- Create: `docs/releases/2026-09-07-appdeploy-v97-1788809457536-capture.md`

**Interfaces:**
- Consumes: all Tasks 1–5 artifacts.
- Produces: explicit GO/NO-GO boundary for later structural refactoring.

- [ ] **Step 1: Implement the capture checker**

It must exit non-zero when any of these conditions hold:

```text
manifest snapshot != 1788809457536
manifest secretsExported != false
fullRuntimeTreeExportComplete != true
required source file missing
runtime-critical drift classification == unresolved
contract test file missing
```

- [ ] **Step 2: Run focused verification**

```bash
node --test tests/reconstruction/capture-integrity.test.mjs tests/reconstruction/runtime-contract.test.mjs
node scripts/reconstruction/check-capture.mjs
```

- [ ] **Step 3: Run existing repository gate where executable**

```bash
npm run release:gate
```

If the local repository gate fails because of pre-existing repository problems, record exact failing command/output and do not reinterpret it as a reconstruction regression. GitHub Actions is currently manual-only and documented as blocked before runner startup at account/org level, so absence of a workflow run is not a pass.

- [ ] **Step 4: Finalize manifest state only after evidence exists**

Set:

```json
"fullRuntimeTreeExportComplete": true
```

only after the exact AppDeploy text tree is captured and binary classifications contain no runtime-critical `unresolved-binary` entries.

- [ ] **Step 5: Write Phase A+B capture report**

The report must include:

```text
AppDeploy snapshot captured
GitHub main baseline
number of captured text paths
binary asset classifications
unresolved runtime-critical differences
focused test results
existing release-gate result
production mutation = none
E2E = not claimed unless run
GO/NO-GO for Phase C
```

- [ ] **Step 6: Verify branch diff against main**

No active root runtime file may have changed in Phase A+B. The diff should consist only of capture evidence, contracts, tests, verification scripts and docs.

- [ ] **Step 7: Commit**

```bash
git add appdeploy-live/1788809457536 contracts/runtime scripts/reconstruction tests/reconstruction docs/releases
git commit -m "docs(reconstruction): complete Phase A+B safety baseline"
```

---

## Self-Review Checklist

- Spec Phase A covered by Tasks 1, 2, 4 and 6.
- Spec Phase B covered by Tasks 3, 5 and 6.
- No architecture extraction, CSS consolidation or API rewrite is included.
- No production deployment is included.
- Snapshot references are consistently `1788809457536`.
- Version name is consistently `v97`.
- Canonical main baseline is consistently `f048a13b214e9585f40662c1316817625339b732`.
- TDD RED→GREEN is explicit for new verification behavior.
- `e2e_tests=null` is never represented as pass.
- Provider login state remains excluded by default.
- Full source capture must precede Phase C.
