# 7YA Life Atlas Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prove one end-to-end LIFE ATLAS projection path by publishing at least ten evidence-backed first-person life moments through the existing static artifact pipeline onto both the homepage and museum.

**Architecture:** Add one canonical JSON slice under `knowledge/`, one dependency-free browser renderer, and one scoped stylesheet. Home and Museum expose lightweight mount points; `site-contract.mjs` explicitly includes the renderer/style in `dist`, while a dedicated contract check verifies the dataset, mounts, artifact registration, source links, and first-person narrative fields before release.

**Tech Stack:** Static HTML, vanilla JavaScript ES modules/browser APIs, JSON, CSS, Node.js validation scripts, existing `npm run release:gate` pipeline.

**Spec:** `docs/superpowers/specs/2026-08-23-7ya-life-atlas-design.md`

## Global Constraints

- The workbook/archive remain upstream; the site is downstream.
- Every public moment requires a source URL and explicit verification/date status.
- First-person copy may not invent memory, opinion, feeling, or exact chronology.
- Metrics remain source-local and are not aggregated in this slice.
- No Supabase dependency is introduced until a real connected project exists.
- The slice must be included in the deterministic `dist` static artifact.
- The renderer must fail quietly and preserve the existing page if JSON cannot load.

---

### Task 1: Add a failing LIFE ATLAS artifact contract check

**Files:**
- Create: `scripts/check-life-atlas-slice.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: repository files under `knowledge/`, `scripts/`, `styles/`, `index.html`, `museum/index.html`, and `scripts/site-contract.mjs`.
- Produces: process exit status plus `LIFE_ATLAS_SLICE: PASS` on success.

- [ ] **Step 1: Write the failing check**

The check must assert all of the following: `knowledge/life-atlas-slice-v1.json` exists; it contains at least 10 moments; every moment has `id`, `dateLabel`, `dateStatus`, `verification`, `headline.he`, `livedVoice.he`, and an HTTPS `sourceHref`; Home and Museum contain `data-life-atlas-mount`; `site-contract.mjs` includes `life-atlas-slice-v1.css` and `life-atlas-slice-v1.js`; the renderer fetches `/knowledge/life-atlas-slice-v1.json`; and the stylesheet/renderer files exist.

- [ ] **Step 2: Run the check and verify RED**

Run: `node scripts/check-life-atlas-slice.mjs`

Expected: non-zero exit because the LIFE ATLAS dataset/renderer/style/mounts do not exist yet.

- [ ] **Step 3: Register the check in the release gate**

Add `check:life-atlas` and place it inside `check-all` before build/typecheck.

---

### Task 2: Implement the minimum publishable projection

**Files:**
- Create: `knowledge/life-atlas-slice-v1.json`
- Create: `scripts/life-atlas-slice-v1.js`
- Create: `styles/life-atlas-slice-v1.css`
- Modify: `index.html`
- Modify: `museum/index.html`
- Modify: `scripts/site-contract.mjs`

**Interfaces:**
- Consumes: `/knowledge/life-atlas-slice-v1.json` with `{ schemaVersion, generatedAt, moments[] }`.
- Produces: accessible timeline cards inside every `[data-life-atlas-mount]` element, with source links opening in a new tab.

- [ ] **Step 1: Create the canonical JSON slice**

Use ten already-supported public moments spanning identity/aliyah, early public record, creator identity, StartOn, media, fatherhood/writing, creator education, music/video, research/public systems, and current 7YA. Each object must carry conservative date/verification labels and a direct source URL. Do not include unsupported reach totals.

- [ ] **Step 2: Add two mount points**

Homepage: place the LIFE ATLAS section after the Human Core/person section and before Public Record.

Museum: place the LIFE ATLAS section after the snapshot strip and before the existing editorial source clusters.

Each mount contains a server-rendered heading/description so the section remains meaningful if JavaScript fails.

- [ ] **Step 3: Implement the renderer**

On `DOMContentLoaded`, fetch the JSON once, validate `moments` is an array, and render each mount according to `data-life-atlas-limit` (`10` home, `10` museum). Each card exposes date, verification label, Hebrew first-person headline/voice, and `מקור ↗`. On failure, retain fallback copy and set `data-life-atlas-state="error"`; do not throw uncaught errors.

- [ ] **Step 4: Add scoped responsive CSS**

Use `.life-atlas-*` selectors only. Desktop renders a horizontal/compact chronological track; mobile becomes a vertical track. Match the existing dark/paper visual vocabulary without replacing page-level styles.

- [ ] **Step 5: Register assets in the static artifact contract**

Add `life-atlas-slice-v1.css` to `publicStyleFiles`, `life-atlas-slice-v1.js` to `publicScriptFiles`, and both plus `knowledge/life-atlas-slice-v1.json` to `criticalArtifactPaths`.

- [ ] **Step 6: Run the focused check and verify GREEN**

Run: `node scripts/check-life-atlas-slice.mjs`

Expected: `LIFE_ATLAS_SLICE: PASS (10 moments, 2 mounts)`.

---

### Task 3: Verify artifact integration and review the change

**Files:**
- No new production files.

**Interfaces:**
- Consumes: all Task 1–2 changes.
- Produces: reviewable feature branch/PR; merge is allowed only after available gates pass.

- [ ] **Step 1: Run repository release verification where available**

Preferred: `npm run release:gate`.

If GitHub Actions cannot start because of the documented account/org runner block, record that infrastructure limitation explicitly and do not label the full gate as passed.

- [ ] **Step 2: Inspect the branch diff**

Confirm only the planned files changed; confirm no secrets, owner-private data, or Supabase credentials were introduced.

- [ ] **Step 3: Open a pull request**

Base: `main`.

Head: `feat/life-atlas-vertical-slice`.

The PR body must state the focused contract result, full-gate status, static artifact paths, and manual visual QA targets (`/` and `/museum/`).

- [ ] **Step 4: Merge only with evidence**

Do not merge if the focused contract is red, the diff contains scope drift, or an available release gate reports a code failure.