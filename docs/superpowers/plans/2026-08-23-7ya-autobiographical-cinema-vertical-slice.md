# 7YA Autobiographical Cinema Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the production homepage's layered dashboard feel with an unmistakably cinematic, chronological autobiographical experience that is visibly different on first load, while preserving all deep archives, research, media, Create and Digital Igor capabilities.

**Architecture:** Keep the existing application and deep pages intact. Replace only the homepage composition with a focused `AutobiographicalCinema` scene renderer using existing authenticated/public-safe source media and source links. Remove competing persistent homepage chrome (Life Album spine and Ninja dock), keep one primary global navigation surface, expose Digital Igor through the menu and scene-native actions, and keep the archive as a depth destination rather than a homepage warehouse.

**Tech Stack:** React 19, TypeScript, Vite, CSS, lucide-react, existing 7YA locale helpers and existing public media URLs/resources.

**Spec:** `docs/superpowers/specs/2026-08-18-7ya-autobiographical-cinema-design.md`

## Global Constraints

- Human experience first; system language is secondary.
- Homepage uses scenes, not a grid of independent product modules.
- Real public-safe photography/video/source artifacts precede decorative UI.
- No generic stock and no generated image presented as documentary evidence.
- No collage compositions; multiple sources enter sequentially.
- Evidence remains source-linked and accessible without dominating the first frame.
- One persistent navigation surface on the homepage; no competing Ninja/Life Album docks.
- Digital Igor remains clearly disclosed as AI and remains reachable without a second floating bar on mobile.
- Existing deep pages and archives remain available and are not deleted.
- Mobile 375×667 is a canonical layout target, not a compressed desktop afterthought.
- `prefers-reduced-motion` must preserve all narrative content without animation dependence.

---

### Task 1: Lock the cinematic acceptance test

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: current production homepage at `?lang=he`
- Produces: explicit user-visible acceptance criteria for the new homepage composition

- [ ] **Step 1: Replace the homepage sanity test with the new cinematic contract**

Use a test that requires: a first-person cold open, `IGOR VEPRETSKI`, the phrase `לא אתר אודותיי`, a visible `1990 → NOW` chronology cue, a source-linked Jesse Cohen/StartOn return scene, a visible `מספיק עליי. מה איתך?` handoff, no open Ninja gateway on first load, and no Life Album spine occupying a second navigation row.

- [ ] **Step 2: Run/deploy the test against the current snapshot and verify RED**

Expected: the current homepage fails at least the new cold-open/handoff/chrome assertions because those exact cinematic states do not exist yet.

- [ ] **Step 3: Keep the existing Digital Igor evidence/private-memory regression test unchanged**

Expected: the Companion contract remains covered while the homepage is rebuilt.

### Task 2: Build the cinematic homepage scene renderer

**Files:**
- Create: `src/life-first/AutobiographicalCinema.tsx`
- Create: `src/life-first/autobiographical-cinema.css`
- Modify: `src/life-first/LifeFirstHome.tsx`

**Interfaces:**
- Consumes: `useLocale`, `pageHref`, `rootHref`, existing public-safe image/video/source URLs, existing deep page routes
- Produces: one chronological homepage renderer with scene IDs `cinema-open`, `cinema-origin`, `cinema-service`, `cinema-voice`, `cinema-return`, `cinema-create`, `cinema-now`, `cinema-you`

- [ ] **Step 1: Create localized scene data**

Include HE/EN/RU first-person copy for: cold open, origin/belonging, service/responsibility, voice/public echo, return/StartOn, creation/research, NOW and YOU. Every documentary media object includes a source URL and source label.

- [ ] **Step 2: Render a full-bleed cold open**

The first frame is dominated by authentic Igor imagery, large `IGOR VEPRETSKI`, a restrained first-person line, `1990 → NOW`, and a single downward narrative cue. Do not render statistics, dashboard counts, LIFE/ECHO/LAB/BUILD matrices or gateway cards above the fold.

- [ ] **Step 3: Render alternating autobiographical scenes**

Use a consistent scene grammar: period/source metadata, dominant media, first-person narrative, one short reflection, and at most one depth action. Use sticky media on desktop where appropriate and simple stacked media/text on mobile.

- [ ] **Step 4: Make the Return / StartOn scene the visual peak**

Use the mynet Jesse Cohen press image as the dominant frame, show the return before the `STARTON` label, and link the source plus the existing StartOn depth route.

- [ ] **Step 5: End with NOW → YOU**

The final two scenes explicitly state that the story is unfinished and hand off to the visitor with `מספיק עליי. מה איתך?`, offering Digital Igor / Create as actions rather than a generic conversion grid.

- [ ] **Step 6: Replace `LifeFirstHome` composition**

Render only `AutobiographicalCinema` as the homepage primary journey. Do not render the old homepage warehouses (`LifeBroadcast`, `PersonalArchive`, `VisualCanonRiver`, `WorldRooms`, `DeepArchiveRiver`, etc.) in the primary home route; preserve them in source/deep routes and files.

### Task 3: Remove competing homepage chrome

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/GlobalNav.tsx`
- Modify: `src/global-nav.css`

**Interfaces:**
- Consumes: `view` from `AppContent`, `pageHref('home', locale)`, existing StoryCompanion URL contract `chat=open`
- Produces: one persistent homepage navigation surface and one menu-level chat entry on mobile

- [ ] **Step 1: Suppress `NinjaExperienceLayer` on the home view**

Keep it available on depth views only if still useful there.

- [ ] **Step 2: Suppress `LifeAlbumSpine` on the home view**

The chronology is now expressed by the cinematic scenes themselves.

- [ ] **Step 3: Remove the bottom mobile dock from the home view**

Depth pages may keep it. The home view uses the top global navigation as its only persistent navigation surface.

- [ ] **Step 4: Add `Talk` to the global menu**

The menu entry routes to the current home URL with `chat=open`; it is the mobile Digital Igor entry without introducing a second floating bar.

- [ ] **Step 5: Make the home global navigation visually compatible with the cold open**

Use translucent/gradient black rather than an opaque dashboard bar, keep language and menu controls legible, and avoid adding another sticky layer.

### Task 4: Verify visual and functional acceptance

**Files:**
- Modify as needed only if verification reveals defects.

**Interfaces:**
- Consumes: deployed production snapshot
- Produces: a ready deployment with clean mobile and desktop QA screenshots and no frontend/backend errors

- [ ] **Step 1: Build and deploy**

Expected: TypeScript/Vite validation passes.

- [ ] **Step 2: Inspect desktop QA screenshot**

Expected: the first frame is photographic and cinematic, not a card/dashboard matrix; no Ninja panel or Life Album second row is visible.

- [ ] **Step 3: Inspect mobile QA screenshot**

Expected: the hero occupies the visual hierarchy; no overlapping floating chat/Ninja panels; no horizontal overflow; only the top navigation persists.

- [ ] **Step 4: Verify deep links**

Open Media, Research, Music, StartOn and Create actions from the new scenes and confirm existing pages remain reachable.

- [ ] **Step 5: Verify Digital Igor regression**

Open via `chat=open`, ask a StartOn question, confirm source evidence remains visible, then verify a private-memory request is bounded and not invented.

- [ ] **Step 6: Final production gate**

Do not report completion until deployment status is `ready`, frontend/backend error arrays are empty, and the QA screenshots visibly show the new cinematic composition.
