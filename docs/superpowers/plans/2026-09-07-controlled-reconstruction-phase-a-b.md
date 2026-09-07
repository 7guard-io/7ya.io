# 7YA Controlled Reconstruction Phase A+B Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Capture the exact applied AppDeploy v97 runtime into GitHub as an immutable provenance snapshot, classify drift against canonical `main`, and install deterministic route/SEO/locale/scheduler/release safety contracts before any structural refactor.

**Architecture:** Phase A stores the current AppDeploy runtime under `appdeploy-live/1788806726940/` without copying it into active repository roots. Phase B adds provider-independent contract JSON and Node built-in tests that validate the captured runtime and become the acceptance boundary for the later router/SEO/shell refactor. No production deployment or public UX change occurs in this plan.

**Tech Stack:** GitHub, AppDeploy source snapshot tools, Node.js 22+, ECMAScript modules, Node built-in `node:test`, `node:assert/strict`, `node:crypto`, existing npm release scripts.

**Spec:** `docs/superpowers/specs/2026-09-07-controlled-reconstruction-design.md`

## Global Constraints

- Working branch: `refactor/controlled-reconstruction-20260907`.
- Canonical repository baseline: `f048a13b214e9585f40662c1316817625339b732`.
- Runtime capture baseline: AppDeploy app `697a008fddc309b142`, version `v97`, snapshot `1788806726940`.
- Do not deploy GitHub `main` or this branch over production during Phase A+B.
- Do not copy captured AppDeploy runtime into active root `src/`, `backend/`, `public/`, `cron.json` or `package.json` during this plan.
- Do not export secrets, credentials or private connector data.
- Preserve Hebrew RTL as primary locale and English/Russian as first-class locales.
- Preserve evidence and privacy rules from `AGENTS.md`.
- E2E is not claimed unless an actual E2E run exists.
- No new routing, state-management or test dependency is introduced in Phase A+B.
- Production is not considered changed or improved by this plan; this plan creates a reviewable safety baseline only.

---

## Target file map

### Immutable runtime capture

- `appdeploy-live/1788806726940/CAPTURE-MANIFEST.json` — capture identity, included/excluded path classes, AppDeploy health evidence and hashes.
- `appdeploy-live/1788806726940/RELEASE-RECEIPT.md` — human-readable provenance receipt.
- `appdeploy-live/1788806726940/index.html` — exact runtime source file.
- `appdeploy-live/1788806726940/package.json` — exact runtime package contract.
- `appdeploy-live/1788806726940/postcss.config.js` — exact runtime build config.
- `appdeploy-live/1788806726940/cron.json` — exact runtime scheduler source.
- `appdeploy-live/1788806726940/src/**` — exact runtime frontend text source.
- `appdeploy-live/1788806726940/backend/**` — exact runtime backend text source.
- `appdeploy-live/1788806726940/scripts/**` — exact runtime build/ingestion source.
- `appdeploy-live/1788806726940/tests/tests.txt` — exact AppDeploy QA test specification.
- `appdeploy-live/1788806726940/public/**` — runtime public text/data files; binary assets are copied only when needed, otherwise classified as verified existing assets or unresolved binary assets in the manifest.

### Provider-independent contracts

- `contracts/runtime/public-routes.json` — required canonical public routes and localized route expectations.
- `contracts/runtime/seo-contract.json` — required canonical/title/description/hreflang contract.
- `contracts/runtime/scheduler-contract.json` — exact active scheduler source contract.
- `contracts/runtime/release-contract.json` — app id, captured snapshot, release marker and public-domain verification expectations.

### Verification utilities

- `scripts/reconstruction/hash-tree.mjs` — deterministic SHA-256 manifest generator for captured text files.
- `scripts/reconstruction/check-capture.mjs` — capture completeness, forbidden-path and secret-pattern checks.
- `scripts/reconstruction/report-drift.mjs` — classifies captured runtime paths against canonical repository paths without mutating either tree.
- `tests/reconstruction/capture-integrity.test.mjs` — immutable capture tests.
- `tests/reconstruction/runtime-contract.test.mjs` — route/SEO/locale/scheduler/release contract tests.
- `docs/releases/2026-09-07-appdeploy-v97-1788806726940-drift.json` — machine-readable drift classification.
- `docs/releases/2026-09-07-appdeploy-v97-1788806726940-capture.md` — human-readable Phase A+B verification report.

---

### Task 1: Freeze the exact AppDeploy v97 identity and capture inventory

**Files:**
- Create: `appdeploy-live/1788806726940/CAPTURE-MANIFEST.json`
- Create: `appdeploy-live/1788806726940/RELEASE-RECEIPT.md`

**Interfaces:**
- Consumes: AppDeploy app id `697a008fddc309b142`, snapshot `1788806726940`, fresh `get_app_status`, `get_app_versions`, and `src_glob` output.
- Produces: immutable capture metadata used by Tasks 2–6.

- [ ] **Step 1: Re-read AppDeploy version/status before capture**

Use the connected AppDeploy tools and require all of the following before recording the snapshot:

```text
app_id = 697a008fddc309b142
version name = v97
version id = 1788806726940
status = ready
frontend_errors = 0
backend_errors = 0
network_errors = 0
active cron names = agent-mesh-hourly, meta-sync-hourly
```

If the applied snapshot has moved, stop using `1788806726940` as “current”; create a new capture directory for the newly applied snapshot and update this plan/spec metadata before proceeding.

- [ ] **Step 2: Enumerate source classes from the exact snapshot**

Run `src_glob` for these scopes and retain every returned continuation page:

```text
src/**/*
backend/**/*
scripts/**/*
tests/**/*
public/**/*
root: index.html, package.json, postcss.config.js, cron.json, appdeploy.auth-login.json
```

`appdeploy.auth-login.json` is inventory-only. It MUST NOT be copied until inspected and proven non-secret; default classification is `provider-config-excluded`.

- [ ] **Step 3: Create the capture manifest with explicit provenance**

Create `CAPTURE-MANIFEST.json` with this shape:

```json
{
  "schemaVersion": 1,
  "capturedAt": "2026-09-07T00:00:00Z",
  "source": {
    "provider": "AppDeploy",
    "appId": "697a008fddc309b142",
    "versionName": "v97",
    "snapshot": "1788806726940"
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
  "includedTextRoots": ["src", "backend", "scripts", "tests", "public"],
  "includedRootFiles": ["index.html", "package.json", "postcss.config.js", "cron.json"],
  "excludedProviderFiles": ["appdeploy.auth-login.json"],
  "files": [],
  "binaryAssets": [],
  "secretsExported": false
}
```

Replace `capturedAt` with the actual UTC capture timestamp. Do not invent file hashes yet; Task 3 populates them.

- [ ] **Step 4: Create the human-readable receipt**

`RELEASE-RECEIPT.md` must state:

```markdown
# AppDeploy v97 Source Capture Receipt

- App: `697a008fddc309b142`
- Snapshot: `1788806726940`
- Capture branch: `refactor/controlled-reconstruction-20260907`
- Canonical main baseline: `f048a13b214e9585f40662c1316817625339b732`
- Production mutation: **none**
- E2E claim: **not run / not claimed**
- Purpose: immutable source capture before controlled reconstruction

This directory is provenance evidence. It is not an alternate production root and must not be deployed directly over 7ya.io.
```

Append the fresh status facts from Step 1 without upgrading `e2e=null` into a pass.

- [ ] **Step 5: Review the branch diff**

Expected result: only the design/plan docs plus the two new capture metadata files are changed. No root runtime path is modified.

- [ ] **Step 6: Commit**

```bash
git add appdeploy-live/1788806726940/CAPTURE-MANIFEST.json appdeploy-live/1788806726940/RELEASE-RECEIPT.md
git commit -m "docs(capture): freeze AppDeploy v97 provenance"
```

---

### Task 2: Export the exact runtime text tree into the immutable capture directory

**Files:**
- Create: `appdeploy-live/1788806726940/index.html`
- Create: `appdeploy-live/1788806726940/package.json`
- Create: `appdeploy-live/1788806726940/postcss.config.js`
- Create: `appdeploy-live/1788806726940/cron.json`
- Create: `appdeploy-live/1788806726940/src/**`
- Create: `appdeploy-live/1788806726940/backend/**`
- Create: `appdeploy-live/1788806726940/scripts/**`
- Create: `appdeploy-live/1788806726940/tests/tests.txt`
- Create: `appdeploy-live/1788806726940/public/**` for text/data assets

**Interfaces:**
- Consumes: complete inventory from Task 1.
- Produces: byte-for-byte text source capture consumed by hashing, drift classification and contract tests.

- [ ] **Step 1: Copy root build/runtime text files using exact AppDeploy source readback**

For each file below, call AppDeploy `src_read` with `version=1788806726940` and write the returned text unchanged under the capture prefix:

```text
index.html
package.json
postcss.config.js
cron.json
```

Do not normalize whitespace, reformat JSON or prettify source while capturing.

- [ ] **Step 2: Copy every `src/**` text file**

Use the full Task 1 inventory. For each text file:

```text
AppDeploy path: src/<relative-path>
GitHub capture path: appdeploy-live/1788806726940/src/<relative-path>
```

Preserve exact contents. The capture must include, at minimum, currently observed critical files:

```text
src/App.tsx
src/locale.tsx
src/documentary-home/DocumentaryHome.tsx
src/engineering-home/EngineeringHome.tsx
src/engineering-home/engineering-home.css
src/engineering-home/home-content.ts
```

The “at minimum” list does not replace the full inventory requirement.

- [ ] **Step 3: Copy every `backend/**` and `scripts/**` text file**

Use the same exact-path rule. Critical observed files include:

```text
backend/index.ts
backend/nvcf.ts
backend/corpus-store.ts
backend/evidence-ingestion.ts
backend/meta/sync.ts
scripts/generate-localized-pages.mjs
scripts/ingest_media.py
```

- [ ] **Step 4: Copy AppDeploy QA specification**

Copy `tests/tests.txt` unchanged. This preserves the current five scenario-level QA expectations but does not convert them into a claimed E2E pass.

- [ ] **Step 5: Copy public text/data files and classify binaries**

Copy text files such as:

```text
public/robots.txt
public/sitemap.xml
public/llms.txt
public/release.json
public/feed.json
public/data/*.json
public/schemas/*.json
public/scripts/*.js
public/**/index.html
```

For binary assets (`.png`, `.jpg`, `.jpeg`, `.webp`, `.gz`, etc.), do one of two things:

1. copy the binary exactly if the connector provides reusable bytes; or
2. add a `binaryAssets` manifest record with `path`, `classification`, and evidence that the identical asset already exists in canonical GitHub.

Allowed classifications are exactly:

```text
captured-binary
verified-existing-canonical
unresolved-binary
```

Any runtime-critical `unresolved-binary` blocks completion of Phase A.

- [ ] **Step 6: Prove excluded provider config is not silently captured**

Search the capture tree for:

```text
appdeploy.auth-login.json
.env
secret
credential
token
api_key
private_key
```

The presence of those words in source code identifiers is not automatically a secret. Raw credential values, auth session blobs or provider login state must not be committed.

- [ ] **Step 7: Commit the immutable source capture**

```bash
git add appdeploy-live/1788806726940
git commit -m "chore(capture): archive AppDeploy v97 runtime source"
```

---

### Task 3: Add deterministic capture hashing and completeness verification

**Files:**
- Create: `scripts/reconstruction/hash-tree.mjs`
- Create: `scripts/reconstruction/check-capture.mjs`
- Create: `tests/reconstruction/capture-integrity.test.mjs`
- Modify: `appdeploy-live/1788806726940/CAPTURE-MANIFEST.json`

**Interfaces:**
- Consumes: captured text tree from Task 2.
- Produces: stable SHA-256 entries and a failing gate when required capture files are absent or forbidden raw secrets are detected.

- [ ] **Step 1: Write the failing capture integrity test**

Create `tests/reconstruction/capture-integrity.test.mjs`:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const root = new URL('../../appdeploy-live/1788806726940/', import.meta.url);
const required = ['index.html','package.json','postcss.config.js','cron.json','src/App.tsx','src/locale.tsx','backend/index.ts','tests/tests.txt'];

test('v97 immutable capture contains required runtime files', async () => {
  for (const path of required) {
    const value = await readFile(new URL(path, root), 'utf8');
    assert.ok(value.length > 0, `${path} must be captured`);
  }
});

test('capture manifest identifies exact AppDeploy snapshot', async () => {
  const manifest = JSON.parse(await readFile(new URL('CAPTURE-MANIFEST.json', root), 'utf8'));
  assert.equal(manifest.source.appId, '697a008fddc309b142');
  assert.equal(manifest.source.versionName, 'v97');
  assert.equal(manifest.source.snapshot, '1788806726940');
  assert.equal(manifest.secretsExported, false);
});
```

- [ ] **Step 2: Run the test and verify it fails before the full capture exists**

```bash
node --test tests/reconstruction/capture-integrity.test.mjs
```

Expected before Task 2 is fully present: FAIL on the first missing required file. If Task 2 is already complete, temporarily point one test entry to `src/__missing__.tsx`, prove failure, then restore the actual required list.

- [ ] **Step 3: Implement `hash-tree.mjs` using only Node built-ins**

```js
import {readdir, readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';

export async function walkFiles(root, dir = '') {
  const entries = await readdir(path.join(root, dir), {withFileTypes: true});
  const out = [];
  for (const entry of entries.sort((a,b) => a.name.localeCompare(b.name))) {
    const rel = path.posix.join(dir.replaceAll('\\','/'), entry.name);
    if (entry.isDirectory()) out.push(...await walkFiles(root, rel));
    else out.push(rel);
  }
  return out;
}

export async function hashFile(filename) {
  const bytes = await readFile(filename);
  return createHash('sha256').update(bytes).digest('hex');
}
```

Add a CLI section that prints deterministic JSON sorted by path for all capture files except `CAPTURE-MANIFEST.json` itself.

- [ ] **Step 4: Implement `check-capture.mjs`**

The checker must:

```js
const required = [
  'index.html',
  'package.json',
  'postcss.config.js',
  'cron.json',
  'src/App.tsx',
  'src/locale.tsx',
  'backend/index.ts',
  'scripts/generate-localized-pages.mjs',
  'tests/tests.txt'
];
```

It must fail when any required file is absent, when `appdeploy.auth-login.json` is present, or when the manifest source snapshot is not exactly `1788806726940`.

For secret scanning, reject PEM private keys and obvious literal credential assignments, using patterns no broader than:

```js
/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/
/(?:API_KEY|TOKEN|SECRET|PASSWORD)\s*[=:]\s*['"][A-Za-z0-9_\-\.]{20,}['"]/i
```

Do not fail merely because source references `process.env.NVIDIA_API_KEY` or another environment-variable name.

- [ ] **Step 5: Populate manifest hashes**

Run:

```bash
node scripts/reconstruction/hash-tree.mjs appdeploy-live/1788806726940 > /tmp/v97-hashes.json
```

Merge its sorted `{path, sha256}` entries into `CAPTURE-MANIFEST.json.files`. Record binary classifications separately in `binaryAssets`.

- [ ] **Step 6: Run capture checks**

```bash
node scripts/reconstruction/check-capture.mjs
node --test tests/reconstruction/capture-integrity.test.mjs
```

Expected: both exit 0.

- [ ] **Step 7: Commit**

```bash
git add scripts/reconstruction appdeploy-live/1788806726940/CAPTURE-MANIFEST.json tests/reconstruction/capture-integrity.test.mjs
git commit -m "test(capture): verify immutable v97 source snapshot"
```

---

### Task 4: Define provider-independent runtime contracts and red-green tests

**Files:**
- Create: `contracts/runtime/public-routes.json`
- Create: `contracts/runtime/seo-contract.json`
- Create: `contracts/runtime/scheduler-contract.json`
- Create: `contracts/runtime/release-contract.json`
- Create: `tests/reconstruction/runtime-contract.test.mjs`

**Interfaces:**
- Consumes: captured `src/App.tsx`, `src/locale.tsx`, `cron.json`, `index.html`, `public/release.json` and QA `tests/tests.txt`.
- Produces: implementation-independent acceptance contracts used by future Phase C refactors.

- [ ] **Step 1: Create the route contract from the approved spec**

`contracts/runtime/public-routes.json`:

```json
{
  "primaryLocale": "he",
  "locales": ["he", "en", "ru"],
  "criticalRoutes": [
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
  ],
  "localizedCleanRoutes": ["starton", "evidence", "library", "search", "media", "research", "music", "speaker", "blog", "create", "museum"],
  "legacyRedirects": [
    {"input":"/?page=media&lang=en","output":"/en/media/"},
    {"input":"/?page=research&lang=ru","output":"/ru/research/"}
  ]
}
```

- [ ] **Step 2: Create the scheduler contract from captured `cron.json`**

`contracts/runtime/scheduler-contract.json`:

```json
{
  "timezone": "Asia/Jerusalem",
  "jobs": [
    {"name":"agent-mesh-hourly","cron":"17 * * * *","handler":"agentMeshHourly","payload":{"mode":"operations"}},
    {"name":"meta-sync-hourly","cron":"37 * * * *","handler":"metaSyncHourly","payload":{"mode":"incremental"}}
  ]
}
```

Historical disabled canaries are not included because this is the source-active contract, not scheduler-history telemetry.

- [ ] **Step 3: Create the release contract**

`contracts/runtime/release-contract.json`:

```json
{
  "appId": "697a008fddc309b142",
  "capturedSnapshot": "1788806726940",
  "provider": "appdeploy",
  "canonicalDomain": "https://7ya.io/",
  "requiredRuntimeMarker": "7ya-engineering-front-door-20260907-v1",
  "e2eRequiredForClaim": true,
  "e2eAtCapture": null,
  "productionMutationInPhaseAB": false
}
```

- [ ] **Step 4: Create the SEO contract**

Store exact required fields rather than all copy. For every critical rendered route represented in captured `App.tsx`, require:

```json
{
  "requiredFields": ["title", "description", "canonical"],
  "requiredHreflang": ["he", "en", "ru", "es", "x-default"],
  "canonicalHost": "https://7ya.io",
  "localizedPrefixes": {"he":"/", "en":"/en/", "ru":"/ru/"},
  "home": {
    "he": "https://7ya.io/",
    "en": "https://7ya.io/en/",
    "ru": "https://7ya.io/ru/"
  }
}
```

- [ ] **Step 5: Write a failing runtime contract test**

`tests/reconstruction/runtime-contract.test.mjs` must begin with assertions against the independent contract files, then inspect captured source:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const capture = new URL('../../appdeploy-live/1788806726940/', import.meta.url);
const contracts = new URL('../../contracts/runtime/', import.meta.url);
const readJson = async (base, name) => JSON.parse(await readFile(new URL(name, base), 'utf8'));

test('scheduler source exactly matches active scheduler contract', async () => {
  const actual = JSON.parse(await readFile(new URL('cron.json', capture), 'utf8'));
  const expected = await readJson(contracts, 'scheduler-contract.json');
  assert.deepEqual(actual, expected.jobs.map(job => ({...job, timezone: expected.timezone})));
});

test('captured runtime exposes required release marker', async () => {
  const app = await readFile(new URL('src/App.tsx', capture), 'utf8');
  const release = await readJson(contracts, 'release-contract.json');
  assert.match(app, new RegExp(release.requiredRuntimeMarker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
});

test('captured locale layer supports he/en/ru', async () => {
  const locale = await readFile(new URL('src/locale.tsx', capture), 'utf8');
  const routes = await readJson(contracts, 'public-routes.json');
  for (const lang of routes.locales) assert.match(locale, new RegExp(`['\"]${lang}['\"]`));
});
```

Add assertions that `src/App.tsx` contains canonical definitions for homepage/starton/evidence/library/search in all three primary locales and generates hreflang for `he`, `en`, `ru`, `es`, `x-default`.

- [ ] **Step 6: Prove the test detects contract drift**

Temporarily change the scheduler contract minute for `meta-sync-hourly` from `37` to `38` and run:

```bash
node --test tests/reconstruction/runtime-contract.test.mjs
```

Expected: FAIL in `scheduler source exactly matches active scheduler contract`.

Restore `37` and rerun. Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add contracts/runtime tests/reconstruction/runtime-contract.test.mjs
git commit -m "test(runtime): lock public route and scheduler contracts"
```

---

### Task 5: Add a non-production reconstruction gate without changing the current release gate

**Files:**
- Modify: `package.json`
- Test: `tests/reconstruction/capture-integrity.test.mjs`
- Test: `tests/reconstruction/runtime-contract.test.mjs`

**Interfaces:**
- Consumes: verification scripts/tests from Tasks 3–4.
- Produces: `npm run reconstruction:gate`; does not alter `release:gate` semantics in Phase A+B.

- [ ] **Step 1: Write the package script expectation test**

Append to `tests/reconstruction/capture-integrity.test.mjs`:

```js
test('canonical repo exposes a reconstruction-only gate', async () => {
  const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url), 'utf8'));
  assert.equal(pkg.scripts['reconstruction:gate'], 'node scripts/reconstruction/check-capture.mjs && node --test tests/reconstruction/*.test.mjs');
  assert.equal(pkg.scripts['release:gate'], 'npm run ci:local');
});
```

- [ ] **Step 2: Run and verify the new expectation fails**

```bash
node --test tests/reconstruction/capture-integrity.test.mjs
```

Expected: FAIL because `reconstruction:gate` is not yet defined.

- [ ] **Step 3: Add exactly one npm script**

In canonical root `package.json`, add:

```json
"reconstruction:gate": "node scripts/reconstruction/check-capture.mjs && node --test tests/reconstruction/*.test.mjs"
```

Do not replace, wrap or redefine `release:gate` in this phase.

- [ ] **Step 4: Run the reconstruction gate**

```bash
npm run reconstruction:gate
```

Expected: exit 0.

- [ ] **Step 5: Run the legacy release gate only if the environment can execute its complete dependency/toolchain contract**

```bash
npm run release:gate
```

If it cannot execute because the repository/runtime trees are intentionally not reconciled yet or because GitHub/organization infrastructure prevents a job from running, record the exact limitation. Do not label an unexecuted gate as pass or fail.

- [ ] **Step 6: Commit**

```bash
git add package.json tests/reconstruction/capture-integrity.test.mjs
git commit -m "test(reconstruction): add isolated phase gate"
```

---

### Task 6: Generate the drift report and reconcile control-plane documentation

**Files:**
- Create: `scripts/reconstruction/report-drift.mjs`
- Create: `docs/releases/2026-09-07-appdeploy-v97-1788806726940-drift.json`
- Create: `docs/releases/2026-09-07-appdeploy-v97-1788806726940-capture.md`
- Modify: `docs/CONTROL_PLANE_STATE.json`

**Interfaces:**
- Consumes: immutable capture, current canonical repository tree and contracts.
- Produces: explicit classification of every runtime-relevant difference and corrected non-deployment control-plane metadata.

- [ ] **Step 1: Implement drift classification utility**

`report-drift.mjs` compares relative paths in `appdeploy-live/1788806726940/` with corresponding canonical repository root paths. It must never overwrite either side.

Use exactly these classes:

```js
const allowed = new Set([
  'production-runtime-required',
  'canonical-repository-newer',
  'historical-unused',
  'generated-asset',
  'provider-specific',
  'identical',
  'unresolved'
]);
```

Automatic classifications may assign only:

- `identical` when SHA-256 matches;
- `production-runtime-required` when capture path is absent at canonical root and belongs to `src/`, `backend/`, `scripts/`, `tests/`, `cron.json`, runtime `package.json` or build config;
- `provider-specific` for explicitly excluded AppDeploy config;
- `unresolved` for all other non-identical cases until reviewed.

Do not auto-label canonical content as “newer” merely because timestamps differ.

- [ ] **Step 2: Add a failing test for unresolved runtime-critical drift**

Append to `runtime-contract.test.mjs` a test that loads the generated drift report and fails when an entry simultaneously has:

```js
entry.runtimeCritical === true && entry.classification === 'unresolved'
```

Before the report exists, the test must fail with file-not-found. After generation, it passes only if every runtime-critical difference has an explicit non-unresolved classification.

- [ ] **Step 3: Generate and review the drift JSON**

Run:

```bash
node scripts/reconstruction/report-drift.mjs > docs/releases/2026-09-07-appdeploy-v97-1788806726940-drift.json
```

For every non-identical item, manually review source/provenance before changing an automatic `unresolved` classification. Do not modify application source as part of classification.

- [ ] **Step 4: Write the capture report**

`2026-09-07-appdeploy-v97-1788806726940-capture.md` must record:

```text
- exact AppDeploy snapshot captured
- exact GitHub main baseline used
- capture branch and commits
- file/hash manifest status
- binary-asset classifications
- number of identical / production-runtime-required / canonical-repository-newer / historical-unused / generated-asset / provider-specific / unresolved entries
- active scheduler source set
- reconstruction gate result
- legacy release-gate execution result or exact reason it was not executable
- E2E = not run / not claimed unless fresh evidence exists
- production mutation = none
- next allowed phase = Phase C only after runtime-critical unresolved count is zero
```

- [ ] **Step 5: Correct `docs/CONTROL_PLANE_STATE.json` without claiming GitHub is production-equivalent**

Update only factual control-plane fields. The resulting source reconciliation section must retain:

```json
{
  "production_source_of_truth": "AppDeploy remote snapshot 1788806726940",
  "full_runtime_tree_export_complete": true,
  "github_main_is_exact_production_source": false,
  "capture_branch": "refactor/controlled-reconstruction-20260907",
  "capture_path": "appdeploy-live/1788806726940",
  "rule": "Do not deploy GitHub main as a replacement for AppDeploy v97 until the captured runtime differences are migrated/reconciled and release gates pass."
}
```

Do not change the canonical production provider or claim the reconstruction branch is deployed.

- [ ] **Step 6: Run all Phase A+B deterministic verification**

```bash
npm run reconstruction:gate
```

Expected: exit 0 and zero runtime-critical unresolved drift.

- [ ] **Step 7: Verify branch scope against `main`**

The branch may contain only:

```text
appdeploy-live/1788806726940/**
contracts/runtime/**
scripts/reconstruction/**
tests/reconstruction/**
docs/superpowers/specs/2026-09-07-controlled-reconstruction-design.md
docs/superpowers/plans/2026-09-07-controlled-reconstruction-phase-a-b.md
docs/releases/2026-09-07-appdeploy-v97-1788806726940-*
docs/CONTROL_PLANE_STATE.json
package.json
```

Any active-root `src/**`, `backend/**`, `public/**`, root `cron.json`, or deployment configuration change is out of scope and must be removed before PR creation.

- [ ] **Step 8: Commit**

```bash
git add scripts/reconstruction docs/releases docs/CONTROL_PLANE_STATE.json tests/reconstruction
git commit -m "docs(reconciliation): classify AppDeploy v97 source drift"
```

---

## Final Phase A+B verification checklist

- [ ] AppDeploy applied snapshot identity was re-read immediately before capture.
- [ ] Full runtime-relevant text source is present under `appdeploy-live/1788806726940/`.
- [ ] No provider login state or raw secret was exported.
- [ ] Capture SHA-256 manifest is deterministic.
- [ ] Runtime-critical binary assets have no `unresolved-binary` classification.
- [ ] Provider-independent route/SEO/locale/scheduler/release contracts exist.
- [ ] Red-green evidence exists for capture and scheduler-contract tests.
- [ ] `npm run reconstruction:gate` exits 0.
- [ ] Runtime-critical drift has zero `unresolved` entries.
- [ ] `release:gate` was either freshly executed or its inability to run is explicitly recorded; no invented PASS.
- [ ] Branch contains no active runtime root refactor and no production deployment mutation.
- [ ] Control-plane documentation identifies AppDeploy snapshot `1788806726940` as production source of truth while keeping GitHub `main` non-equivalent until later reconciliation.

## Handoff after Phase A+B

Only after every item above is verified may a new Phase C plan be written for application-core extraction (`route resolver → SEO registry → release module → AppShell`). CSS consolidation and API hardening remain later phases and must not be smuggled into Phase C.