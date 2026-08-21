# 7YA Personal Internet Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the 7YA homepage from a linear source-backed album into a living personal operating surface while preserving the album and all deep routes.

**Architecture:** Add a new `PersonalInternetHome` composition layer that is mounted for the default home route. Reuse existing locale helpers and source-backed public links, keep `AlbumHome` available through `?page=album`, and isolate each new interaction surface in a focused component so rollback is one AppDeploy version switch.

**Tech Stack:** React 19, TypeScript, Vite, existing 7YA locale system, lucide-react, AppDeploy QA.

**Spec:** `docs/superpowers/specs/2026-08-21-7ya-personal-internet-design.md`

## Global Constraints

- No collage; one dominant visual idea per viewport.
- No unsourced aggregate reach or sentiment numbers.
- No private/sensitive family, medical, legal, financial or operational-security data.
- Hebrew, English and Russian ship together.
- Existing Museum, Media, Music, Research, Create, StartOn and Evidence routes remain intact.
- Mobile at 375–390px must have zero page-level horizontal overflow.
- Existing AppDeploy runtime `1787340269205` is the rollback target.

---

### Task 1: Route the Living OS without deleting the album

**Files:**
- Create: `src/personal-internet/PersonalInternetHome.tsx`
- Create: `src/personal-internet/personal-internet.css`
- Modify: `src/App.tsx`
- Modify: `src/locale.tsx`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: `useLocale()`, `pageHref()`, `AlbumHome`.
- Produces: default-home `PersonalInternetHome`; explicit `?page=album` route.

- [ ] **Step 1: Reconcile QA test 1 to make the new default-home behavior explicit**

Add a sanity workflow that opens `?lang=he`, verifies `NOW / PULSE`, `HUMAN ECHO`, `IGOR GRAPH`, `STARTON / WALK INSIDE`, `THE FUTURE`, then follows the Memory action to the album and verifies `PERSONAL ALBUM / IGOR VEPRETSKI`.

- [ ] **Step 2: Extend locale routing**

Change `pageHref`'s page union to include `album`, and emit `page=album` for that case while preserving `lang`.

- [ ] **Step 3: Add the new home shell**

Create a focused component that renders this order:

```tsx
<main className='pi-home' dir={dir}>
  <LivingPulse />
  <HumanEchoMap />
  <IgorGraph />
  <StartOnWalkthrough />
  <FutureLayer />
  <MemoryPortal />
</main>
```

- [ ] **Step 4: Wire App.tsx**

Add `album` as a recognized view, mount `AlbumHome` for it, and mount `PersonalInternetHome` for default `home`.

- [ ] **Step 5: Deploy and verify the route split**

Expected: default home is the Living OS; `?page=album&lang=he|en|ru` remains the complete source-backed album.

---

### Task 2: Build Living Pulse and Human Echo

**Files:**
- Create: `src/personal-internet/LivingPulse.tsx`
- Create: `src/personal-internet/HumanEchoMap.tsx`
- Create: `src/personal-internet/personal-internet-data.ts`
- Modify: `src/personal-internet/personal-internet.css`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: public profile URLs, `signalMoments` semantics, locale context.
- Produces: source-linked present-tense lanes and source-first echo paths.

- [ ] **Step 1: Define typed localized data**

Create `LivingLane`, `EchoPath` and `ReactionVocabulary` records. Living lanes: `NOW`, `STARTON`, `RESEARCH`, `CREATE`. Echo paths: fatherhood story → article, elder-fraud post → TV, StartOn story → institution/building attempt.

- [ ] **Step 2: Render LivingPulse**

Show one primary `RIGHT NOW` editorial statement, four current build lanes, and direct links to Instagram, StartOn, Research and Create. Do not display a fabricated last-updated timestamp or live counter.

- [ ] **Step 3: Render HumanEchoMap**

For each echo path render source → transition → destination. Below it expose qualitative reaction vocabulary (`❤️ resonance`, `💬 conversation`, `↗ sharing`, `⚡ disagreement`) as labels only, with an explicit note that numeric sentiment is shown only when source-local evidence exists.

- [ ] **Step 4: Add source-failure-safe styling**

The echo must remain understandable as text if external imagery is blocked; the visualization cannot rely on connecting lines alone.

- [ ] **Step 5: QA**

Expected: no universal reach number; each public echo has its own source link; audience response is human-readable without invented sentiment counts.

---

### Task 3: Build the semantic Igor Graph

**Files:**
- Create: `src/personal-internet/IgorGraph.tsx`
- Modify: `src/personal-internet/personal-internet-data.ts`
- Modify: `src/personal-internet/personal-internet.css`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: locale helpers and existing public/deep routes.
- Produces: keyboard-accessible semantic navigation nodes.

- [ ] **Step 1: Define graph nodes**

Use these public categories only: `IGOR`, `KHARKIV / ORIGIN`, `HOLON / JESSE COHEN`, `PUBLIC SERVICE`, `FATHERHOOD / VOICE`, `STARTON`, `MEDIA`, `MUSIC`, `RESEARCH`, `7YA`, `MEMORY`.

- [ ] **Step 2: Give every node a deterministic destination**

Examples: StartOn → `rootHref('starton/')`; Media → `pageHref('media', locale)`; Music → `pageHref('music', locale)`; Research → `rootHref('research/?lang='+locale)`; Memory → `pageHref('album', locale)`.

- [ ] **Step 3: Render graph with real controls**

Each node is an `<a>` element with visible label and one-line relationship description. CSS connector lines are decorative (`aria-hidden`).

- [ ] **Step 4: Add focus/mobile states**

Desktop uses a radial/constellation composition; mobile becomes a vertical relationship rail with no horizontal pan.

- [ ] **Step 5: QA**

Expected: keyboard navigation can reach every node and each destination resolves without breaking locale.

---

### Task 4: Turn StartOn into a walkable operating model

**Files:**
- Create: `src/personal-internet/StartOnWalkthrough.tsx`
- Modify: `src/personal-internet/personal-internet-data.ts`
- Modify: `src/personal-internet/personal-internet.css`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: canonical StartOn route and documented program concept.
- Produces: five-room walkthrough with honest model/status labels.

- [ ] **Step 1: Define five rooms**

`PLAY / CREATE`, `LEARN / TOOLS`, `TRANSPARENT STUDIO`, `SOCIAL / MENTORING`, `PROGRESS`.

Each room contains: what a participant does, what capability it is intended to support, and status `MODEL / BUILDING` rather than an efficacy claim.

- [ ] **Step 2: Render as one spatial sequence**

Use numbered room cards connected by a single path. No collage and no decorative stock photography.

- [ ] **Step 3: Add participation handoff**

Primary action opens StartOn. Secondary action opens 7YA chat/context for building a youth opportunity pathway.

- [ ] **Step 4: QA**

Expected: every room is understandable without hover and the page never claims measured youth outcomes.

---

### Task 5: Add the Future layer, Memory portal and release QA

**Files:**
- Create: `src/personal-internet/FutureLayer.tsx`
- Create: `src/personal-internet/MemoryPortal.tsx`
- Modify: `src/personal-internet/personal-internet-data.ts`
- Modify: `src/personal-internet/personal-internet.css`
- Modify: `tests/tests.txt`
- Create after verification: `docs/releases/2026-08-21-personal-internet-release.md`

**Interfaces:**
- Consumes: `pageHref('album', locale)`, StartOn/Research/Create routes.
- Produces: explicit future states and a stable doorway into Memory.

- [ ] **Step 1: Define roadmap records with explicit states**

Use `NOW`, `BUILDING`, `TARGET`, `OPEN QUESTION`. Candidate lanes: `7YA Personal Internet`, `StartOn physical opportunity space`, `Opportunity research`, `creator/public-systems tools`.

- [ ] **Step 2: Render FutureLayer**

Each item shows state, desired change, current evidence/constraint, and one participation/action route. Targets are visually distinct from completed work.

- [ ] **Step 3: Render MemoryPortal**

Explain that the archive is the database, not the homepage experience. Primary action opens `?page=album` with current locale; secondary actions open Evidence and Media.

- [ ] **Step 4: Rewrite tests/tests.txt into five coverage-complete tests**

Exactly one `[sanity]`. Coverage: default Living OS → Memory, source-safe Echo, keyboard/mobile Igor Graph, StartOn model integrity, Future-state honesty + deep-route regression.

- [ ] **Step 5: Deploy, poll to terminal status and repair automatically if needed**

Review frontend errors, network errors, QA screenshots and E2E results. If E2E fails, inspect run details before changing code.

- [ ] **Step 6: Record release receipt**

Document AppDeploy version, QA job IDs, rollback version, route behavior and known limitations.

- [ ] **Step 7: Commit release documentation**

Commit the receipt to `personal-internet-20260821` after production verification.
