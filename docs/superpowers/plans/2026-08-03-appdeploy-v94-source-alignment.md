# AppDeploy v94 Source Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Export the complete applied AppDeploy v94 runtime into a controlled GitHub branch, reconcile it with the canonical repository without regressing verified mobile UX, and establish one source of truth for future releases.

**Architecture:** Treat AppDeploy version `1785764686305` as the currently applied runtime and `7guard-io/7ya.io@main` as the governance/documentation repository. Do not overwrite `main` directly. Import the runtime into an isolated branch, classify collisions by responsibility, preserve the React runtime as the application layer, and retain static contracts, evidence registries, governance documents, release receipts, and Netlify utilities only where they remain authoritative and compatible.

**Tech Stack:** React + TypeScript, AppDeploy runtime, GitHub, static governance assets, Node.js validation scripts, E2E QA.

## Global Constraints

- Applied AppDeploy runtime: `v94`, version `1785764686305`.
- AppDeploy QA state at audit start: `6/6` E2E jobs passed; zero frontend, backend, and network errors.
- Canonical repository: `7guard-io/7ya.io`, base branch `main`.
- Preserve the hierarchy `Igor → StartOn → 7YA`.
- Preserve mobile progressive disclosure in `StoryCompanion`.
- Preserve iOS `visualViewport`, `safe-area`, and `16px` composer behavior.
- Preserve launcher clearance above the mobile dock.
- Preserve the behavior that hides global navigation and dock while the mobile Companion dialog is open.
- Do not promote donation as the primary CTA until a verified donation flow exists.
- Do not deploy or merge until source alignment tests and focused mobile QA pass.

---

## Current verified divergence

### Production-only application layer

The following applied runtime files exist in AppDeploy v94 and are absent from GitHub `main` at the same paths:

- `src/App.tsx`
- `src/StoryCompanion.tsx`
- `src/story-companion.css`
- `src/GlobalNav.tsx`
- `src/global-nav.css`
- `src/GalaxyHome.tsx`
- `src/galaxy-home.css`
- `src/SiteControl.tsx`
- `src/site-control.css`
- `src/MuseumPage.tsx`
- `src/locale.tsx`
- the wider React runtime under `src/`

Direct GitHub content checks returned `404` for `src/App.tsx` and `src/StoryCompanion.tsx` on `main`.

### GitHub governance/static layer

GitHub `main` currently describes itself as `7ya.io public command site and documentation layer` and uses static build/check scripts. Its `package.json` does not define the applied React runtime as the canonical application build.

### Architectural conclusion

This is not a normal line-level drift. The two systems currently hold different architectural layers. A blind file merge would risk replacing the active React runtime with an older static implementation or duplicating navigation, Control, Service Worker, and Companion behavior.

---

### Task 1: Freeze and inventory the applied runtime

**Files:**
- Create: `docs/runtime/appdeploy-v94-file-manifest.json`
- Create: `docs/runtime/appdeploy-v94-source-checksums.json`
- Create: `docs/runtime/appdeploy-v94-export-receipt.md`

**Interfaces:**
- Consumes: AppDeploy app `697a008fddc309b142`, version `1785764686305`.
- Produces: a complete path manifest and checksum ledger used by all later tasks.

- [ ] **Step 1: Enumerate every runtime path**

Use AppDeploy `src_glob` recursively for `**/*`, including directories only when needed to preserve empty structure. Continue pagination until no continuation token remains.

- [ ] **Step 2: Read every text source**

Use AppDeploy `src_read` for each text path. Record binary paths separately with MIME type and byte metadata; do not convert binary assets to text.

- [ ] **Step 3: Generate deterministic checksums**

For every exported file, compute SHA-256 over the exact bytes. Store entries as:

```json
{
  "version": "1785764686305",
  "files": [
    {
      "path": "src/App.tsx",
      "sha256": "<64 lowercase hex characters>",
      "kind": "text"
    }
  ]
}
```

- [ ] **Step 4: Record runtime verification evidence**

The receipt must include:

```markdown
- App ID: `697a008fddc309b142`
- Applied version: `1785764686305`
- Display version: `v94`
- E2E: `6/6 passed`
- Frontend errors: `0`
- Backend errors: `0`
- Network errors: `0`
```

- [ ] **Step 5: Commit the immutable inventory**

```bash
git add docs/runtime/appdeploy-v94-file-manifest.json \
  docs/runtime/appdeploy-v94-source-checksums.json \
  docs/runtime/appdeploy-v94-export-receipt.md
git commit -m "docs: freeze AppDeploy v94 runtime inventory"
```

### Task 2: Import the runtime without touching legacy files

**Files:**
- Create: `runtime-v94/**`
- Create: `scripts/verify-appdeploy-export.mjs`
- Test: `test/runtime-export.test.mjs`

**Interfaces:**
- Consumes: exact exported bytes and checksum ledger from Task 1.
- Produces: an isolated, verifiable copy of the applied runtime.

- [ ] **Step 1: Write the failing checksum test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';

const ledger = JSON.parse(fs.readFileSync('docs/runtime/appdeploy-v94-source-checksums.json', 'utf8'));

test('runtime-v94 exactly matches the exported AppDeploy snapshot', () => {
  for (const file of ledger.files.filter(entry => entry.kind === 'text')) {
    const bytes = fs.readFileSync(`runtime-v94/${file.path}`);
    const actual = crypto.createHash('sha256').update(bytes).digest('hex');
    assert.equal(actual, file.sha256, file.path);
  }
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
node --test test/runtime-export.test.mjs
```

Expected: failure because `runtime-v94/` has not been populated.

- [ ] **Step 3: Write the exact exported files under `runtime-v94/`**

Preserve filenames, line endings, encoding, and directory structure. Do not run formatters or dependency upgrades during import.

- [ ] **Step 4: Run the checksum test and verify it passes**

```bash
node --test test/runtime-export.test.mjs
```

Expected: PASS for every exported text file.

- [ ] **Step 5: Commit the isolated runtime**

```bash
git add runtime-v94 scripts/verify-appdeploy-export.mjs test/runtime-export.test.mjs
git commit -m "chore: import exact AppDeploy v94 runtime"
```

### Task 3: Build an explicit collision matrix

**Files:**
- Create: `docs/runtime/appdeploy-v94-github-collision-matrix.csv`
- Create: `docs/runtime/appdeploy-v94-architecture-decisions.md`
- Create: `scripts/classify-runtime-collisions.mjs`
- Test: `test/runtime-collision-classifier.test.mjs`

**Interfaces:**
- Consumes: `runtime-v94/**` and the existing repository tree.
- Produces: one disposition for every overlapping responsibility.

- [ ] **Step 1: Define the allowed classifications**

```js
export const dispositions = new Set([
  'runtime-authoritative',
  'github-authoritative',
  'merge-required',
  'retain-as-documentation',
  'retire-after-migration'
]);
```

- [ ] **Step 2: Write a failing test for required collision rows**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const csv = fs.readFileSync('docs/runtime/appdeploy-v94-github-collision-matrix.csv', 'utf8');

for (const responsibility of [
  'application-shell',
  'companion',
  'global-navigation',
  'mobile-dock',
  'site-control',
  'service-worker',
  'seo-entity-contract',
  'evidence-registry',
  'release-receipts'
]) {
  test(`collision matrix classifies ${responsibility}`, () => {
    assert.match(csv, new RegExp(`^${responsibility},`, 'm'));
  });
}
```

- [ ] **Step 3: Populate the collision matrix**

The minimum decisions are:

```csv
responsibility,runtime_path,github_path,disposition,reason
application-shell,runtime-v94/src/App.tsx,,runtime-authoritative,Applied React router and shell
companion,runtime-v94/src/StoryCompanion.tsx,,runtime-authoritative,Verified mobile and desktop behavior
global-navigation,runtime-v94/src/GlobalNav.tsx,,runtime-authoritative,Applied navigation component
mobile-dock,runtime-v94/src/global-nav.css,styles/7ya-page-upgrade-20260726.css,merge-required,Avoid duplicate fixed docks
site-control,runtime-v94/src/SiteControl.tsx,scripts/7ya-control-layer-20260726.js,merge-required,Avoid two command/control systems
service-worker,<runtime service worker>,sw.js,merge-required,Choose one registration and cache contract
seo-entity-contract,<runtime metadata>,data/entity-registry.json,github-authoritative,Registry remains governance source
 evidence-registry,<runtime API/data>,contracts/media-impact,merge-required,Preserve public claim gates
release-receipts,,docs/releases,retain-as-documentation,Immutable governance history
```

Remove the leading space before `evidence-registry` when writing the actual CSV.

- [ ] **Step 4: Run the classifier tests**

```bash
node --test test/runtime-collision-classifier.test.mjs
```

Expected: PASS.

- [ ] **Step 5: Commit the decisions**

```bash
git add docs/runtime/appdeploy-v94-github-collision-matrix.csv \
  docs/runtime/appdeploy-v94-architecture-decisions.md \
  scripts/classify-runtime-collisions.mjs \
  test/runtime-collision-classifier.test.mjs
git commit -m "docs: classify AppDeploy and GitHub architecture collisions"
```

### Task 4: Promote the React runtime to a canonical application workspace

**Files:**
- Create: `apps/web/**`
- Modify: root `package.json`
- Create: `package-lock.json` or preserve the runtime lockfile selected from the export
- Create: `scripts/check-canonical-runtime.mjs`
- Test: `test/canonical-runtime.test.mjs`

**Interfaces:**
- Consumes: `runtime-v94/**` and collision decisions.
- Produces: one canonical buildable React application under `apps/web`.

- [ ] **Step 1: Write the failing canonical-runtime test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const required = [
  'apps/web/src/App.tsx',
  'apps/web/src/StoryCompanion.tsx',
  'apps/web/src/GlobalNav.tsx',
  'apps/web/src/GalaxyHome.tsx',
  'apps/web/src/SiteControl.tsx',
  'apps/web/src/MuseumPage.tsx'
];

test('canonical React runtime is present', () => {
  for (const path of required) assert.equal(fs.existsSync(path), true, path);
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
node --test test/canonical-runtime.test.mjs
```

- [ ] **Step 3: Copy runtime files from the verified import**

Copy from `runtime-v94/` to `apps/web/` without changing behavior. Preserve AppDeploy client integration and backend contracts.

- [ ] **Step 4: Add root workspace scripts**

Add scripts without deleting existing governance checks:

```json
{
  "scripts": {
    "web:build": "npm --prefix apps/web run build",
    "web:typecheck": "npm --prefix apps/web run typecheck",
    "web:test": "npm --prefix apps/web test",
    "check:canonical-runtime": "node scripts/check-canonical-runtime.mjs"
  }
}
```

- [ ] **Step 5: Run the runtime checks**

```bash
npm run check:canonical-runtime
npm run web:typecheck
npm run web:test
npm run web:build
```

Expected: all commands pass with no source modification required beyond path/config wiring.

- [ ] **Step 6: Commit the canonical workspace**

```bash
git add apps/web package.json package-lock.json scripts/check-canonical-runtime.mjs test/canonical-runtime.test.mjs
git commit -m "feat: establish canonical React runtime workspace"
```

### Task 5: Reconcile navigation, Control, Companion, and Service Worker

**Files:**
- Modify: `apps/web/src/GlobalNav.tsx`
- Modify: `apps/web/src/global-nav.css`
- Modify: `apps/web/src/StoryCompanion.tsx`
- Modify: `apps/web/src/story-companion.css`
- Modify: `apps/web/src/SiteControl.tsx`
- Modify: `apps/web/src/site-control.css`
- Modify: the canonical runtime Service Worker file found in the export
- Test: `apps/web/src/__tests__/mobile-layer-contract.test.ts`

**Interfaces:**
- Consumes: collision matrix.
- Produces: one dock, one Control surface, one Companion dialog, and one Service Worker registration.

- [ ] **Step 1: Write failing source-contract assertions**

```ts
import {readFileSync} from 'node:fs';
import {describe,it,expect} from 'vitest';

const companion = readFileSync('src/story-companion.css', 'utf8');
const component = readFileSync('src/StoryCompanion.tsx', 'utf8');

describe('mobile layer contract', () => {
  it('keeps the launcher above the dock and safe area', () => {
    expect(companion).toContain('bottom:calc(82px + env(safe-area-inset-bottom))');
  });

  it('keeps the iOS composer at 16px', () => {
    expect(companion).toMatch(/companion-composer textarea\{[^}]*font-size:16px/);
  });

  it('uses visualViewport for keyboard-safe height', () => {
    expect(component).toContain('window.visualViewport');
    expect(component).toContain('--companion-height');
  });

  it('hides global navigation while the dialog is open', () => {
    expect(companion).toContain('body:has(.companion-panel) .global-mobile-dock');
  });
});
```

- [ ] **Step 2: Remove legacy duplicate injection from the canonical deploy path**

The React application must not also inject `scripts/7ya-control-layer-20260726.js` or render the static `.mobile-dock` from old HTML pages.

- [ ] **Step 3: Keep one Service Worker registration**

Choose the runtime registration as canonical. Port only governance-required cache exclusions and release/health `no-store` behavior from `sw.js`. Do not register both `/service-worker.js` and `/sw.js`.

- [ ] **Step 4: Run focused tests**

```bash
npm --prefix apps/web test -- mobile-layer-contract
npm run check-control
npm run check:canonical-runtime
```

- [ ] **Step 5: Commit the layer reconciliation**

```bash
git add apps/web/src scripts package.json
git commit -m "fix: reconcile mobile navigation companion and control layers"
```

### Task 6: Port governance contracts into the runtime

**Files:**
- Modify: `apps/web/src/locale.tsx`
- Modify: runtime SEO/head generation files discovered in Task 1
- Modify: runtime media-impact data/API files discovered in Task 1
- Consume: `data/entity-registry.json`
- Consume: `contracts/media-impact/**`
- Test: `test/runtime-governance-contract.test.mjs`

**Interfaces:**
- Consumes: canonical GitHub entity and evidence contracts.
- Produces: a React runtime that renders only approved identity and public claims.

- [ ] **Step 1: Write a failing governance test**

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const entity = JSON.parse(fs.readFileSync('data/entity-registry.json', 'utf8'));
const publicImpact = JSON.parse(fs.readFileSync('contracts/media-impact/registry.public.json', 'utf8'));

test('runtime governance inputs remain canonical', () => {
  assert.equal(entity.person.url, 'https://7ya.io/igor-vepretski/');
  assert.equal(publicImpact.policy.no_cross_platform_total, true);
  assert.equal(publicImpact.policy.disputed_metrics_quarantined, true);
});
```

- [ ] **Step 2: Wire entity metadata from the registry**

Generate runtime title, description, Person/ProfilePage links, and StartOn relationship from `data/entity-registry.json`. Do not maintain a second handwritten identity list in React.

- [ ] **Step 3: Wire public impact claims through the publication gate**

Only records with `public_claim_ok: true` may render numeric claims. Keep quarantined claims hidden or clearly pending.

- [ ] **Step 4: Run governance checks**

```bash
node --test test/runtime-governance-contract.test.mjs
npm run check-entity
npm run check-collector
npm run web:build
```

- [ ] **Step 5: Commit governance integration**

```bash
git add apps/web data contracts test/runtime-governance-contract.test.mjs
git commit -m "feat: connect runtime to canonical identity and evidence contracts"
```

### Task 7: Verify the real first fold at 390px and 430px

**Files:**
- Create: `apps/web/e2e/mobile-fold.spec.ts`
- Create: `docs/qa/appdeploy-v94-alignment-mobile-fold.md`

**Interfaces:**
- Consumes: canonical application workspace.
- Produces: objective evidence that fixed layers do not collide.

- [ ] **Step 1: Add viewport tests**

```ts
import {test,expect} from '@playwright/test';

for (const width of [390,430]) {
  test(`mobile fold and fixed layers at ${width}px`, async ({page}) => {
    await page.setViewportSize({width,height:844});
    await page.goto('/?lang=he');

    await expect(page.getByRole('heading', {level:1})).toBeVisible();
    await expect(page.locator('.global-mobile-dock')).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, window.innerHeight));
    await expect(page.locator('.companion-fab')).toBeVisible();

    const dock = await page.locator('.global-mobile-dock').boundingBox();
    const fab = await page.locator('.companion-fab').boundingBox();
    expect(fab && dock && fab.y + fab.height <= dock.y).toBeTruthy();

    await page.locator('.companion-fab').click();
    await expect(page.locator('.companion-panel')).toBeVisible();
    await expect(page.locator('.global-mobile-dock')).not.toBeVisible();
  });
}
```

- [ ] **Step 2: Run the focused E2E suite**

```bash
npm --prefix apps/web run e2e -- mobile-fold.spec.ts
```

- [ ] **Step 3: Capture screenshots and DOM measurements**

Store references for both widths in `docs/qa/appdeploy-v94-alignment-mobile-fold.md`. Record H1 visibility, CTA visibility, dock/fab gap, and Companion keyboard behavior.

- [ ] **Step 4: Commit QA evidence**

```bash
git add apps/web/e2e/mobile-fold.spec.ts docs/qa/appdeploy-v94-alignment-mobile-fold.md
git commit -m "test: verify mobile fold and fixed-layer clearance"
```

### Task 8: Full verification and controlled cutover

**Files:**
- Modify: `docs/releases/<cutover-receipt>.json`
- Modify: `release.json`
- Modify: deployment configuration selected for the canonical runtime

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a reproducible release with rollback evidence.

- [ ] **Step 1: Run every existing governance gate**

```bash
npm run check-all
npm run typecheck
npm test
npm run build:site
npm run check:artifact
npm run verify:artifact
```

- [ ] **Step 2: Run every canonical web gate**

```bash
npm run check:canonical-runtime
npm run web:typecheck
npm run web:test
npm run web:build
npm --prefix apps/web run e2e
```

- [ ] **Step 3: Deploy a preview only**

Do not replace production. Validate homepage, Museum, Companion, navigation, Control, API health, and evidence routes.

- [ ] **Step 4: Compare preview against applied v94**

The preview must preserve all v94 behavior and pass the 390px and 430px fixed-layer checks. Any difference requires an explicit architecture-decision entry.

- [ ] **Step 5: Record rollback**

The release receipt must include the last known-good AppDeploy version `1785764686305` and the exact Git commit used for cutover.

- [ ] **Step 6: Merge only after review and green checks**

```bash
git checkout main
git merge --no-ff <alignment-branch>
```

- [ ] **Step 7: Publish and verify production**

Run production QA and confirm no frontend, backend, or network errors before closing the alignment issue.

---

## Self-review result

- Spec coverage: runtime export, exact comparison, collision classification, safe merge, mobile fold verification, governance preservation, preview, rollback, and production verification are covered.
- Placeholder scan: values that can only be known after the exact export are represented as generated checksums or discovered paths, not implementation omissions.
- Type consistency: `runtime-v94/` is the immutable import; `apps/web/` is the canonical application workspace; governance remains in existing root paths.
