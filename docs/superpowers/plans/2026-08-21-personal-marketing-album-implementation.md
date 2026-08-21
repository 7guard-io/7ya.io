# Personal Marketing Album Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current dense 7YA homepage with Igor Vepretski's living personal marketing album while preserving source integrity, deep archive routes, StartOn, Research, Media, Music and the Companion.

**Architecture:** Keep the current AppDeploy React/Vite application and all depth routes. Add a focused album data/model layer plus a new homepage renderer, switch only the home route to it, reduce navigation pressure, and retain the existing `IgorLivingRecordHome` as a depth/journey source rather than deleting it.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy E2E QA, existing 7YA source URLs and public media.

**Spec:** `docs/superpowers/specs/2026-08-21-personal-marketing-album-system-design.md`

## Global Constraints

- Personal album first; marketing relevance second; evidence underneath.
- Real/source Igor imagery first; no generic AI stand-ins.
- No flattened collages.
- No invented childhood/service photography.
- No private family imagery by default.
- Every major claim remains source-linked or clearly editorial/personal.
- No aggregate vanity reach unless the underlying metric definition supports it.
- Existing Media/Music/Research/StartOn/Evidence routes remain reachable.
- Poster/image-first loading; do not mount a wall of iframes on initial render.
- HE RTL and EN/RU LTR must remain intact.
- Mobile at 375px must have no horizontal overflow and fixed controls must not cover CTAs.

---

### Task 1: Move the acceptance gate before production code

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Produces: a failing homepage contract that requires the personal-marketing-album hierarchy.

- [ ] **Step 1: Rewrite Test 1 before changing production code**

Replace its first-visit assertions with this behavior:

```text
Covers: personal album cover, opening spread, real-source media, value bridges, intent CTAs, deep-route continuity

1. Open ?lang=en and verify PERSONAL ALBUM / IGOR VEPRETSKI is visible in the first viewport with one dominant real/source portrait, a primary Enter the story action and a secondary Talk / collaborate action.
2. Verify the page moves into A LIFE THAT BECAME SYSTEMS before any archive counters, forensic ledgers or warehouse-style content indexes.
3. Verify Origin, Service, Voice, Create, StartOn, Research and Now appear as authored album chapters with a visible value bridge and at least one source/depth action where evidence exists.
4. Verify the closing spread offers at least three distinct intents: talk/interview, partner/build and explore evidence/archive.
5. Verify Media, Music, Research, StartOn and Evidence remain reachable from contextual links or the full menu.
```

- [ ] **Step 2: Rewrite Test 4 mobile acceptance**

Require one dominant frame per chapter, no repeated generic portrait fallback, no horizontal overflow, and exactly four mobile dock destinations.

- [ ] **Step 3: Deploy tests only and verify RED**

Expected: E2E FAIL because the current homepage still opens as `PERSONAL EDITION / LIFE FIRST` and the new album cover/closing hierarchy does not exist.

---

### Task 2: Add the album canon and selectors

**Files:**
- Create: `src/album/album-data.ts`

**Interfaces:**
- Produces: `type AlbumChapter`, `type AlbumMedia`, `albumChapters`, `albumCopy`, `getAlbumChapter(id)`.

- [ ] **Step 1: Define strict public-only album types**

```ts
export type Locale='he'|'en'|'ru';
export type L10n=Record<Locale,string>;
export type AlbumMedia={id:string;src:string;kind:'photo'|'video-poster'|'press'|'document';alt:L10n;caption?:L10n;sourceUrl?:string;sourceLabel?:string;authenticity:'original'|'public-source'|'source-thumbnail';objectPosition?:string};
export type AlbumChapter={id:'origin'|'service'|'voice'|'create'|'starton'|'research'|'now';index:string;era:string;kicker:L10n;title:L10n;story:L10n;capability:L10n;publicValue:L10n;media?:AlbumMedia;sourceHref?:string;sourceLabel?:L10n;depthHref?:string;depthLabel?:L10n};
```

- [ ] **Step 2: Populate only verified/public-safe assets already used in the live app**

Use the existing Wikimedia portrait for the cover, mynet for StartOn/return, existing public Instagram/public-press imagery already referenced by the live app, and YouTube poster URLs for music/media. For Origin, if no verified childhood image exists, explicitly render an editorial text fallback rather than inventing one.

- [ ] **Step 3: Keep every external metric out of this first album data slice unless it is source-local and dated**

No universal reach total is part of the album canon.

---

### Task 3: Build the visual album homepage

**Files:**
- Create: `src/album/AlbumHome.tsx`
- Create: `src/album/album.css`

**Interfaces:**
- Consumes: `useLocale()` and `albumChapters`.
- Produces: cover, opening spread, seven album chapters, public-signal preview, current-build strip and intent-based closing.

- [ ] **Step 1: Build the cover**

Use this hierarchy:

```tsx
<section className='album-cover' id='album-top'>
  <div className='album-cover-copy'>
    <p className='album-eyebrow'>PERSONAL ALBUM / IGOR VEPRETSKI</p>
    <h1>...</h1>
    <p className='album-lede'>...</p>
    <div className='album-actions'>...</div>
  </div>
  <figure className='album-cover-frame'>...</figure>
</section>
```

The first viewport must not begin with metrics, logo walls or evidence indexes.

- [ ] **Step 2: Build `A LIFE THAT BECAME SYSTEMS` opening spread**

Render five concise beats: Origin, Service, Voice, StartOn, Research/Build. Each beat gets one sentence and a chapter anchor.

- [ ] **Step 3: Render seven authored chapter spreads**

Each chapter renders, in order: frame/fallback → era/kicker → title → short story → `WHAT THIS BUILT IN ME` value bridge → source/depth links.

- [ ] **Step 4: Add `WHAT MOVED BEYOND ME` public-signal preview**

Use a small set of already verified source moments and link to existing Media/impact depth. Do not expose the full ledger on the homepage.

- [ ] **Step 5: Add closing conversion spread**

Expose at least these distinct intents:

```text
Talk / interview / invite
Partner / build something
Create with 7YA
Explore evidence / archive
```

Use contextual relative links/query parameters; do not introduce absolute SPA routes.

- [ ] **Step 6: CSS hierarchy**

Implement editorial asymmetry, large frames, breathing room, cream/black/acid-green brand accents, readable captions, `prefers-reduced-motion`, and responsive collapse below 760px. Do not use masonry collage behavior.

---

### Task 4: Switch home and simplify navigation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/GlobalNav.tsx`
- Modify: `src/global-nav.css` only if required by the four-item mobile dock.

**Interfaces:**
- Produces: `AlbumHome` as the default home surface; existing depth routes unchanged.

- [ ] **Step 1: Switch only the home renderer**

Add:

```ts
import AlbumHome from './album/AlbumHome';
```

and replace the final home fallback:

```tsx
<AlbumHome/>
```

Do not delete `IgorLivingRecordHome.tsx`.

- [ ] **Step 2: Update home SEO description**

Describe the page as Igor's source-backed personal album connecting life, public work, StartOn, research, media and creation.

- [ ] **Step 3: Reduce mobile dock to exactly four intents**

Home, Journey, Create, Talk. Keep archive/media/music/research/evidence in the expanded/full menu.

- [ ] **Step 4: Ensure global navigation does not compete with the cover**

Do not add more fixed UI.

---

### Task 5: Green QA, live verification and repo sync

**Files:**
- Reconcile: `tests/tests.txt`
- Sync successful AppDeploy source changes back to the feature branch.

**Interfaces:**
- Produces: deployed AppDeploy version + passing E2E/QA + GitHub mirror.

- [ ] **Step 1: Deploy production changes**

Expected: build succeeds and the previously red album tests become GREEN.

- [ ] **Step 2: Poll AppDeploy until terminal status**

Inspect build, frontend/runtime errors and QA snapshot. If E2E fails, read run details before changing code.

- [ ] **Step 3: Fix automatically up to three deploy attempts**

Treat code-pass, UX-pass and deployment-pass as separate gates.

- [ ] **Step 4: Verify the live first viewport and mobile album flow**

No archive counter/ledger should precede the album opening; real/source media and value bridges should dominate.

- [ ] **Step 5: Sync the deployed source to `feat/personal-marketing-album-system` and update PR #299**

Do not merge into `main` without a clean verification result.
