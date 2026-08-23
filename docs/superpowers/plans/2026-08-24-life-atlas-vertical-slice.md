# 7YA Life Atlas Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove one end-to-end LIFE ATLAS projection path by publishing ten evidence-backed first-person life moments through the existing static artifact pipeline onto both the homepage and museum.

**Architecture:** Keep the source HTML stable. Add one canonical JSON slice under `knowledge/`, one dependency-free browser renderer, and one scoped stylesheet. `build-static-site.mjs` injects the LIFE ATLAS assets only into the generated `dist/index.html` and `dist/museum/index.html`; the renderer then creates the section next to existing anchors (`#sources` on Home, `.editorial-picks` on Museum). `site-contract.mjs` makes the JSON/JS/CSS mandatory artifact paths, and a focused Node check guards the complete projection contract.

**Tech Stack:** Static HTML, vanilla JavaScript/browser APIs, JSON, CSS, Node.js validation scripts, existing deterministic `build:site` / `release:gate` pipeline.

**Spec:** `docs/superpowers/specs/2026-08-23-7ya-life-atlas-design.md`

## Global Constraints

- The workbook/archive remain upstream; the site is downstream.
- Every public moment requires an HTTPS source URL and explicit verification/date status.
- First-person copy may not invent memory, opinion, feeling, or exact chronology.
- Metrics remain source-local and are not aggregated in this slice.
- No Supabase dependency is introduced until a real connected project exists.
- The slice must be included in the deterministic `dist` static artifact.
- LIFE ATLAS assets are injected only into Home and Museum.
- The renderer must fail quietly and preserve the existing page if JSON cannot load.

---

### Task 1: Define and prove the failing LIFE ATLAS contract

**Files:**
- Create: `scripts/check-life-atlas-slice.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: `knowledge/life-atlas-slice-v1.json`, `scripts/life-atlas-slice-v1.js`, `styles/life-atlas-slice-v1.css`, `scripts/build-static-site.mjs`, and `scripts/site-contract.mjs`.
- Produces: process exit status plus `LIFE_ATLAS_SLICE: PASS (<n> moments, 2 surfaces)` on success.

- [x] **Step 1: Write the failing check**

The check requires at least ten unique moments with `id`, `dateLabel`, approved `dateStatus`, approved `verification`, `headline.he`, `livedVoice.he`, and HTTPS `sourceHref`; it also requires Home/Museum build injection, artifact registration, and renderer dataset/surface wiring.

- [x] **Step 2: Verify RED before production implementation**

Observed pre-implementation failures: `LIFE_ATLAS_SLICE: FAIL (12)`, then `FAIL (15)` after tightening the build-layer contract.

- [x] **Step 3: Register the check in the release gate**

`check:life-atlas` is included in `check-all`, so an available `release:gate` cannot omit this projection check.

---

### Task 2: Implement the minimum publishable projection

**Files:**
- Create: `knowledge/life-atlas-slice-v1.json`
- Create: `scripts/life-atlas-slice-v1.js`
- Create: `styles/life-atlas-slice-v1.css`
- Modify: `scripts/build-static-site.mjs`
- Modify: `scripts/site-contract.mjs`

**Interfaces:**
- Consumes: `/knowledge/life-atlas-slice-v1.json` with `{ schemaVersion, generatedAt, moments[] }`.
- Produces: one LIFE ATLAS section on `/` and one on `/museum/`, each rendering ten accessible chronological cards with source links.

- [x] **Step 1: Create the canonical JSON slice**

Ten conservative public-source moments span origin/identity, StartOn, media, public narrative, research, creator education, and the emergence of 7YA. Unsupported aggregate reach totals are excluded. The Mindset date discrepancy is explicitly marked `conflict` rather than silently resolved.

- [x] **Step 2: Implement the renderer**

The renderer maps `/` to `#sources` and `/museum/` to `.editorial-picks`, creates the mount at runtime, fetches the canonical JSON once, renders ten cards, opens evidence links safely in a new tab, and exposes a quiet error state without breaking the existing page.

- [x] **Step 3: Add scoped responsive CSS**

All selectors are `.life-atlas-*`. Desktop uses a horizontal chronological rail; mobile collapses to a vertical sequence. The visual vocabulary stays within the existing dark/paper system with restrained amber evidence accents.

- [x] **Step 4: Inject assets through the real static build path**

`build-static-site.mjs` injects LIFE ATLAS CSS/JS only into `index.html` and `museum/index.html` while generating `dist`. Source HTML pages are intentionally untouched.

- [x] **Step 5: Make the projection part of the artifact contract**

`life-atlas-slice-v1.css`, `life-atlas-slice-v1.js`, and `knowledge/life-atlas-slice-v1.json` are registered as public/critical artifact paths.

- [x] **Step 6: Verify focused GREEN**

Observed: `LIFE_ATLAS_SLICE: PASS (10 moments, 2 surfaces)` plus JavaScript syntax checks.

---

### Task 3: Verify integration and hold integration until the full gate is available

**Files:**
- No additional production files.

**Interfaces:**
- Consumes: all Task 1–2 changes.
- Produces: a reviewable isolated GitHub branch; merge remains gated by full repository verification.

- [x] **Step 1: Verify deterministic build-layer behavior in an isolated fixture**

Observed build result: `STATIC_ARTIFACT_BUILD: PASS (6 files + manifest)`. Assertions passed for Home injection, Museum injection, exclusion from a third route, and copying of JSON/CSS/JS into the artifact.

- [x] **Step 2: Perform browser rendering QA**

The environment blocks Chromium navigation to localhost/hostnames (`ERR_BLOCKED_BY_ADMINISTRATOR`), so route serving could not be browser-tested directly. A no-network Playwright harness using the same renderer/card DOM and CSS successfully rendered 10 cards and 10 source links for both Home and Museum; screenshots were inspected for RTL hierarchy and layout. Route scoping itself is covered by the deterministic build assertions above.

- [x] **Step 3: Inspect branch scope**

The branch changes only this plan, the LIFE ATLAS dataset/renderer/style/check, `package.json`, `build-static-site.mjs`, and `site-contract.mjs`. No Supabase credentials, private owner data, or unrelated refactors are introduced.

- [ ] **Step 4: Run the full repository release gate**

Required command: `npm run release:gate`.

Current infrastructure blocker: the sandbox cannot resolve GitHub for a clone, the repository's `ci.yml` documents that GitHub Actions is blocked before runner startup at account/org level, and the feature commit has no external status checks. Therefore the full release gate is **not claimed as passed**.

- [ ] **Step 5: Open/merge only after the full gate is green**

Do not merge this branch into `main` until the full repository gate can run successfully. After that gate, open the PR against `main`, verify the generated Home/Museum preview visually, and merge with the verified head SHA.