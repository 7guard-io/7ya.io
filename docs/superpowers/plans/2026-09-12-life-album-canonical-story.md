# Canonical Life Album Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the 7YA homepage read as Igor Vepretski's chronological life album, with age/place/people/moment/media/response/consequence/reflection leading and evidence following.

**Architecture:** Reuse `AlbumHome`, `album-data`, `PostsMemoryUniverse` and `BroadcastStream`. Extend the existing album chapter model instead of creating another truth store or parallel life graph. The homepage remains `AlbumHome`; chapter rendering gains explicit human-context fields and the narrative spine is corrected to include fatherhood and public leadership as life chapters.

**Tech Stack:** React 19, TypeScript, Vite, existing 7YA AppDeploy runtime.

**Spec:** `docs/superpowers/specs/2026-09-12-life-album-canonical-story-design.md`

## Global Constraints
- Story order is AGE → PLACE → PEOPLE → MOMENT → ORIGINAL MEDIA → PUBLIC RESPONSE → CONSEQUENCE → REFLECTION.
- Authentic Igor media first; no synthetic childhood/service imagery.
- Metrics stay source-local and date-bound; no synthetic reach total.
- Reposts/mirrors remain echoes of a Moment, not independent biography.
- Family/children material remains privacy-minimized.
- Host framing never becomes an unverified first-person biographical fact.
- Reuse existing Content Core / projection / media registries; no new database.

---

### Task 1: Extend the canonical album chapter model

**Files:**
- Modify: `src/album/album-data.ts`
- Test: `tests/tests.txt`

**Interfaces:**
- Produces `AlbumChapter` fields: `age`, `place`, `people`, `moment`, `consequence`, `reflection`, optional `response`.
- Existing fields `media`, `sourceUrl`, `depth` remain compatible with `AlbumHome`.

- [ ] **Step 1: Update the homepage test contract first**

Add an assertion to the sanity test that the first life chapter visibly contains an age and place, and a later chapter contains consequence/reflection language.

- [ ] **Step 2: Run QA contract mentally against current UI and confirm it would fail**

Current `AlbumHome` does not expose explicit age/place/people/consequence/reflection fields, so the updated contract is RED.

- [ ] **Step 3: Extend `AlbumChapter`**

Add localized human-context fields and reshape the narrative spine to:
`origin → service → fatherhood → starton → voice/public → create → leadership → now`.

Use date ranges that permit deterministic age labels from DOB 1990-07-07; do not invent exact months when the source only supports a year/period.

- [ ] **Step 4: Preserve source and media boundaries**

For origin/service chapters with no authentic period photograph, retain the explicit source-frame fallback instead of adding synthetic imagery.

- [ ] **Step 5: Commit**

`feat: make album chapters human-context first`

### Task 2: Render every chapter as a memory object

**Files:**
- Modify: `src/album/AlbumHome.tsx`
- Modify: `src/album/album.css`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes the extended `AlbumChapter` model.
- Produces one chronological chapter card with visible age, place, people, moment, response, consequence and reflection.

- [ ] **Step 1: Update the mobile test contract**

Require the new memory metadata and reflection blocks to remain readable without horizontal overflow at 375x667.

- [ ] **Step 2: Add a chapter memory header**

Render `AGE`, `PLACE` and `PEOPLE` before the chapter title. Age must be human-readable (`בן 21`, `AGE 21`, Russian equivalent), not year-only.

- [ ] **Step 3: Make moment text the editorial lead**

Render the Moment immediately after the title, then original media/source.

- [ ] **Step 4: Add response → consequence → reflection**

Render three labeled blocks after the source media. If a chapter has no direct public-response object, state that explicitly rather than inventing comments.

- [ ] **Step 5: Keep evidence actions secondary**

Source/depth buttons remain available but visually subordinate to story and reflection.

- [ ] **Step 6: Run build/QA and commit**

`feat: render life chapters as memory objects`

### Task 3: Make audience and echoes contextual depth, not the opening frame

**Files:**
- Modify: `src/album/PostsMemoryUniverse.tsx`
- Modify: `src/album/BroadcastStream.tsx` only if copy/order needs alignment
- Test: `tests/tests.txt`

**Interfaces:**
- Posts/echo layers remain downstream of the canonical life chapters.
- Audience comments stay source-linked and source-local.

- [ ] **Step 1: Ensure section copy says it is memory/echo depth**

The visitor should understand these are expansions of moments already encountered, not a second biography.

- [ ] **Step 2: Preserve comment/source boundaries**

Keep public comments, reaction screenshots and metrics attached to their exact source nodes.

- [ ] **Step 3: Remove any copy that implies system/counter comprehension is required to understand Igor**

No new data store or counter aggregation.

- [ ] **Step 4: Commit**

`refactor: make posts and echoes contextual depth`

### Task 4: Make public leadership a real life chapter

**Files:**
- Modify: `src/album/album-data.ts`
- Modify: `src/album/BroadcastStream.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Adds one personal leadership chapter covering documented 2023–2026 public/political work and the September 2026 list rupture without partisan persuasion.

- [ ] **Step 1: Add the leadership chapter with dated sources already in the corpus**

Frame it as Igor's public path, expectations, participation and the documented 2026 inflection point; do not overclaim list placement or private promises.

- [ ] **Step 2: Connect existing multilingual/public distribution as echoes**

Party distributions stay labeled as party distributions, not independent endorsement.

- [ ] **Step 3: Commit**

`feat: add public leadership to life spine`

### Task 5: Production verification and canonical-source sync

**Files:**
- Modify: `tests/tests.txt`
- Sync changed production source files to GitHub feature branch.

**Interfaces:**
- Production homepage `/` and `/album/` expose the same canonical AlbumHome.

- [ ] **Step 1: Deploy the smallest changed file set against the latest AppDeploy snapshot**

Read current source immediately before deployment and avoid overlapping production edits.

- [ ] **Step 2: Poll AppDeploy until terminal status**

Require `READY`, zero frontend/backend/network errors; if E2E exists and fails, inspect details before fixing.

- [ ] **Step 3: Verify canonical routing**

Confirm `7ya.io` and `www.7ya.io` remain active and `/album/` resolves to the album experience.

- [ ] **Step 4: Verify user-visible acceptance**

Homepage must visibly lead with person/life, and at least the origin, service, fatherhood, StartOn and now chapters must expose the human-context sequence.

- [ ] **Step 5: Sync exact production source to `feat/life-album-canonical-story-20260912` and open a PR**

Do not merge automatically.
