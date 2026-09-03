# 7YA Evidence-First Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** restore one reproducible, source-linked 7YA public site and ship a verified visual/media improvement without losing the live rollback path.

**Architecture:** The GitHub repository is the canonical release ledger; AppDeploy delta snapshots are reconciled into a versioned runtime-source manifest before application code is edited. Public content is rendered from a small evidence record schema, with each factual card exposing status, date and source. The existing static public routes remain compatible while the React runtime is made reproducible.

**Tech Stack:** TypeScript, React, static HTML/CSS, Node.js check scripts, GitHub release ledger, AppDeploy.

**Spec:** `docs/superpowers/specs/2026-09-03-7ya-public-site-rebuild-design.md`

## Global Constraints

- Canonical repository is `7guard-io/7ya.io`; work only on `rebuild/evidence-first-20260903` until the release gate passes.
- AppDeploy app `697a008fddc309b142` is the runtime authority and supplies rollback snapshots.
- GitLab `7ya-io/7yaio-Igor-Vepretski` stays a disaster-recovery mirror; it is never independently deployed.
- Never commit credentials, OAuth values, private messages, family details, financial/legal records, or confidential contact data.
- Publish a claim only with an explicit status, source URL and date; omit unsupported metrics.
- A video surface starts as an accessible poster and loads an iframe only after a user action; it always has a direct source link.

---

## File structure

- `appdeploy-live/` — immutable AppDeploy source deltas already recorded in the repository.
- `scripts/reconcile-appdeploy-runtime.mjs` — deterministic manifest/checker for delta coverage and missing source modules.
- `docs/runtime-source/2026-09-03-reconciliation.md` — base snapshot, ordered deltas, unresolved paths and rollback ID.
- `src/evidence/types.ts` — public evidence-record interface.
- `src/evidence/home-records.ts` — reviewed homepage facts and media metadata only.
- `src/components/DeferredVideo.tsx` and `src/components/deferred-video.css` — poster-to-player component and focus/responsive rules.
- `src/documentary-home/` — home composition, only after reconciliation establishes its required source files.
- `scripts/check-evidence-home.mjs` — release gate for record fields and no eager iframe behavior.
- `tests/evidence-home.test.mjs` — Node tests for evidence data and deferred video markup.

### Task 1: Establish a reproducible runtime-source baseline

**Files:**
- Create: `scripts/reconcile-appdeploy-runtime.mjs`
- Create: `docs/runtime-source/2026-09-03-reconciliation.md`
- Modify: `package.json`
- Test: `tests/reconcile-appdeploy-runtime.test.mjs`

**Interfaces:**
- Consumes: `appdeploy-live/<snapshot>/CUTOVER-MANIFEST.json` and delta trees.
- Produces: `runtimeSourceReport(root: string): { baseSnapshot: string; deltas: string[]; missingImports: string[]; files: string[] }`.

- [ ] **Step 1: Write the failing test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { runtimeSourceReport } from '../scripts/reconcile-appdeploy-runtime.mjs';

test('reports base snapshot and unresolved imports', () => {
  const report = runtimeSourceReport('appdeploy-live');
  assert.equal(report.baseSnapshot, '1787823326631');
  assert.ok(report.missingImports.includes('src/documentary-home/DocumentaryHome.tsx'));
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/reconcile-appdeploy-runtime.test.mjs`  
Expected: FAIL because the module does not exist.

- [ ] **Step 3: Implement deterministic reconciliation**

```js
export function runtimeSourceReport(root) {
  const baseSnapshot = '1787823326631';
  const manifest = JSON.parse(readFileSync(`${root}/${baseSnapshot}/CUTOVER-MANIFEST.json`, 'utf8'));
  const files = manifest.delta_files.filter(path => path.startsWith('src/'));
  return { baseSnapshot, deltas: [baseSnapshot], files, missingImports: findMissingImports(files) };
}
```

`findMissingImports` resolves relative TypeScript imports against the reconciled file map and returns sorted, de-duplicated paths. Add `"check:runtime-source": "node scripts/reconcile-appdeploy-runtime.mjs"` to `package.json`. Record the base snapshot, later deltas consulted, unresolved modules, AppDeploy app ID and rollback snapshot in the Markdown record.

- [ ] **Step 4: Run test and checker**

Run: `node --test tests/reconcile-appdeploy-runtime.test.mjs && npm run check:runtime-source`  
Expected: PASS test; checker exits non-zero while unresolved imports exist and lists them.

- [ ] **Step 5: Commit**

```bash
git add scripts/reconcile-appdeploy-runtime.mjs tests/reconcile-appdeploy-runtime.test.mjs docs/runtime-source/2026-09-03-reconciliation.md package.json
git commit -m "chore: record reproducible appdeploy runtime baseline"
```

### Task 2: Restore complete executable source before feature changes

**Files:**
- Create: `src/runtime-source-manifest.json`
- Modify: every path selected from `appdeploy-live` by Task 1, preserving provenance where a file is reconstructed
- Test: `tests/runtime-source-manifest.test.mjs`

**Interfaces:**
- Consumes: `runtimeSourceReport` output and immutable snapshot files.
- Produces: a source tree where every relative import from `src/App.tsx` resolves and `runtime-source-manifest.json` maps each restored path to snapshot ID and SHA-256.

- [ ] **Step 1: Write the failing test**

```js
test('every runtime import resolves and has provenance', () => {
  const manifest = JSON.parse(readFileSync('src/runtime-source-manifest.json', 'utf8'));
  assert.equal(findUnresolvedImports('src/App.tsx').length, 0);
  assert.ok(manifest['src/documentary-home/DocumentaryHome.tsx'].snapshot);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --test tests/runtime-source-manifest.test.mjs`  
Expected: FAIL because `src/App.tsx` imports modules absent from the current GitHub tree.

- [ ] **Step 3: Restore by provenance, not invention**

For each missing import, select the newest matching file from an AppDeploy delta whose manifest declares it, copy it into `src/`, and write `{ "snapshot": "<id>", "sha256": "<digest>" }` under its exact path. If no snapshot contains the file, replace the import with a minimal typed fallback component that renders a source-linked route and records `"reconstructed": true` in the manifest. Do not add private or secret-bearing backend files.

- [ ] **Step 4: Run compilation and source checks**

Run: `npm ci && npm run typecheck && node --test tests/runtime-source-manifest.test.mjs && npm run check:runtime-source`  
Expected: all commands pass; if package installation is unavailable, record the environment block and still run Node-only tests.

- [ ] **Step 5: Commit**

```bash
git add src appdeploy-live docs/runtime-source tests package.json scripts
git commit -m "fix: restore reproducible 7ya runtime source"
```

### Task 3: Make homepage assertions and media auditable

**Files:**
- Create: `src/evidence/types.ts`, `src/evidence/home-records.ts`, `src/components/DeferredVideo.tsx`, `src/components/deferred-video.css`
- Modify: `src/documentary-home/DocumentaryHome.tsx`, `src/documentary-home/documentary-home.css`
- Test: `tests/evidence-home.test.mjs`, `scripts/check-evidence-home.mjs`

**Interfaces:**
- `EvidenceRecord = { id: string; title: Record<Locale,string>; status: 'VERIFIED'|'USER-STATED'|'INFERENCE'|'PROPOSAL'|'UNKNOWN'; sourceUrl: string; sourceLabel: string; date: string; media?: { provider: 'youtube'; videoId: string; title: string } }`.
- `DeferredVideo({ title, sourceUrl, videoId }: Pick<EvidenceRecord,'sourceUrl'> & { title: string; videoId: string })` renders a button before activation and a nocookie iframe after activation.

- [ ] **Step 1: Write failing data and component tests**

```js
test('each homepage record has status, ISO date and HTTPS source', () => {
  for (const record of homeRecords) {
    assert.match(record.date, /^\d{4}(-\d{2}-\d{2})?$/);
    assert.match(record.sourceUrl, /^https:\/\//);
    assert.ok(record.status);
  }
});
test('featured video is not an eager iframe', () => {
  assert.match(renderDeferredVideo(), /button/);
  assert.doesNotMatch(renderDeferredVideo(), /<iframe/);
});
```

- [ ] **Step 2: Run tests to verify failure**

Run: `node --test tests/evidence-home.test.mjs`  
Expected: FAIL because data and component do not exist.

- [ ] **Step 3: Implement data and accessible embed**

Use only sources already reviewed in the public record: StartOn official site, the dated Mynet report, dated public YouTube interviews/clips, and the source-linked research pages. `DeferredVideo` sets the iframe source only after `onClick`, uses `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`, preserves a 16:9 container, and includes a normal external “Watch at YouTube” link. Replace direct homepage media iframe rendering with this component.

- [ ] **Step 4: Add release checker and run it**

Run: `node --test tests/evidence-home.test.mjs && node scripts/check-evidence-home.mjs`  
Expected: PASS; checker rejects `iframe src=` in documentary-home markup and records missing status/date/source.

- [ ] **Step 5: Commit**

```bash
git add src/evidence src/components src/documentary-home tests/evidence-home.test.mjs scripts/check-evidence-home.mjs package.json
git commit -m "feat: add source-linked deferred media to homepage"
```

### Task 4: Verify public routes, responsive quality and controlled release

**Files:**
- Modify: `scripts/check-site.mjs`, `scripts/check-links.mjs`, `docs/releases/2026-09-03-evidence-first-release.md`
- Test: `tests/tests.txt` and existing route/asset checks

**Interfaces:**
- Consumes: built static artifact, `homeRecords`, current GitHub commit, AppDeploy deployment result.
- Produces: a release receipt with commit SHA, AppDeploy snapshot, smoke outcomes, known limitations, and rollback snapshot.

- [ ] **Step 1: Extend failing release checks**

Add assertions that `/`, `/media/`, `/evidence/`, `/research/`, `/starton/`, `/contact/`, `/ar/`, and `/es/` resolve in the static artifact; verify primary navigation links have no empty/placeholder href; require a `DeferredVideo` direct-source fallback.

- [ ] **Step 2: Run checks to verify failure or baseline**

Run: `npm run check-all && npm run typecheck && npm test && npm run build:site && npm run check:artifact && npm run verify:artifact`  
Expected: record each command’s exact result; do not claim a pass for a blocked environment.

- [ ] **Step 3: Fix only checked failures**

Repair broken links, missing artifact entries, mobile overflow, focus visibility, or contrast failures reported by the commands. Do not broaden the public narrative or add unsupported facts while fixing UI.

- [ ] **Step 4: Deploy and independently verify**

Create a GitHub pull request to `main` with the release receipt. After merge, deploy the exact merged source to AppDeploy, poll until READY, verify `https://7ya.io/` and `https://www.7ya.io/`, inspect home and media at mobile and desktop widths, and record frontend/backend/network errors separately. Update GitLab’s `MIRROR-STATUS.md` only with new commit and snapshot metadata.

- [ ] **Step 5: Commit release evidence**

```bash
git add scripts docs/releases tests package.json
git commit -m "chore: gate evidence-first 7ya release"
```

## Self-review

- Source-of-truth, GitLab mirror boundary, AppDeploy rollback, evidence status, public/private boundary, responsive video handling, language/accessibility gates and publication receipts each have an implementing task.
- Placeholder scan: every implementation instruction is concrete and executable.
- Interface names are consistent: `runtimeSourceReport`, `EvidenceRecord`, `homeRecords`, and `DeferredVideo` are defined before use.
