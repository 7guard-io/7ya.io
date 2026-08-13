# Rich Igor Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish a richer 7YA homepage that prominently displays Igor Vepretski through verified imagery, video, press, social, music and StartOn content while preserving the existing multilingual growth gateway and Digital Igor flow.

**Architecture:** Extend the existing React `ConversionHome` with data-driven media modules sourced from `deepMedia`. Keep all new homepage presentation styles isolated in `conversion-home.css`; reuse controlled local assets and verified YouTube thumbnails; update AppDeploy acceptance tests for the changed homepage behavior.

**Tech Stack:** React 19, TypeScript, Vite, CSS, AppDeploy QA.

## Global Constraints
- Mobile-first; no horizontal overflow.
- Use only existing controlled assets or verified media records.
- Keep the existing hero CTA and Digital Igor flow working.
- Lazy-load below-fold images and YouTube embeds.
- No unsupported metrics, partnerships, screenshots or claims.

---

### Task 1: Homepage rich-media acceptance test

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: current homepage and Digital Igor interaction.
- Produces: an updated sanity contract requiring rich visual media on the homepage.

- [ ] **Step 1: Write the failing test**
Replace Test 1 steps so QA must confirm the first homepage experience contains Igor's name, the primary CTA, a visible `Featured media` / Hebrew equivalent section, at least six image-backed media cards, and no horizontal overflow before opening Digital Igor.
- [ ] **Step 2: Run deployment QA and verify RED**
Expected: the current sparse homepage fails the new rich-media assertions.
- [ ] **Step 3: Proceed to Task 2 only after the failure is caused by missing rich-media modules.**

### Task 2: Rich media modules in `ConversionHome`

**Files:**
- Modify: `src/ConversionHome.tsx`
- Modify: `src/conversion-home.css`

**Interfaces:**
- Consumes: `deepMedia: DeepMediaItem[]` from `src/deep-media-data.ts` and existing locale helpers.
- Produces: hero media mosaic, featured media rail, two lazy video embeds, and three visual story bands.

- [ ] **Step 1: Import `deepMedia` and derive deterministic homepage collections**
Use `featured` items first, then verified video/press/music records; cap the rail at 8 cards and the embedded-video set at 2 YouTube records.
- [ ] **Step 2: Add a hero mosaic beside the existing portrait**
Retain `resources/igor-hero.jpg` as the main portrait and add two small linked video-thumbnail cards with source/year labels.
- [ ] **Step 3: Add a featured media rail directly after the hero/path area**
Each card must show image, category, source, year and title, and link to the canonical media URL.
- [ ] **Step 4: Add a two-video watch section**
Use `https://www.youtube-nocookie.com/embed/<youtubeId>` iframes with `loading='lazy'`, descriptive titles and allow fullscreen.
- [ ] **Step 5: Add visual story bands**
Use controlled assets `resources/7ya-starton.webp`, `resources/chapter-voice.webp`, and `resources/chapter-music.webp` with short copy and links to StartOn, media/museum, and music source surfaces.
- [ ] **Step 6: Style modules in `conversion-home.css`**
Use responsive CSS grid/scroll-snap rails, strong image ratios, subtle overlays and mobile single-column fallbacks. Do not add horizontal page overflow.

### Task 3: Verify and publish

**Files:**
- Modify: `tests/tests.txt` if QA exposes a brittle wording-only assertion.

**Interfaces:**
- Consumes: updated homepage.
- Produces: published AppDeploy version with terminal `ready` status and QA evidence.

- [ ] **Step 1: Deploy the changed files to existing app `697a008fddc309b142`.**
- [ ] **Step 2: Poll until terminal status.**
- [ ] **Step 3: Inspect frontend/backend/network errors and QA screenshots.**
- [ ] **Step 4: If E2E fails, inspect the QA run details, fix all reported issues in one pass, and redeploy.**
- [ ] **Step 5: Confirm both custom domains remain active and visually inspect the latest desktop/mobile screenshots.**
- [ ] **Step 6: Report the public URL only after `ready` and evidence review.**
