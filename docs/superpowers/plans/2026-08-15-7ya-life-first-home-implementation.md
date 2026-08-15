# 7YA Life-First Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current dossier-first 7YA homepage hierarchy with the approved life-first experience while preserving evidence, archive, research, StartOn, influence, multilingual behavior, deep routes, and the existing 7YA Companion.

**Architecture:** Keep AppDeploy app `697a008fddc309b142` as the live runtime and `7guard-io/7ya.io` as canonical durable source. Build a new small homepage composition layer instead of extending `IgorLivingRecordHome.tsx`: human/source-backed hero → current activity → visual world rooms → lived scenes → creator layer → StartOn → THE ECHO → research → visitor handoff, with archive/deep surfaces after the experiential layer. Existing source registries, `LiveSocial`, `InfluenceUniverse`, research data, Companion, deep routes, and evidence semantics are reused rather than rebuilt.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, AppDeploy frontend+backend runtime, `@appdeploy/client` existing API transport, CSS modules-by-file convention, AppDeploy E2E QA, VisualInspector.

## Global Constraints

- No collages.
- No fabricated historical imagery presented as evidence.
- No repeated generic portrait used as a substitute for source material.
- Evidence/provenance remains intact and reachable, but does not dominate the default reading path.
- Existing verified relationship semantics remain exact: membership is not sponsorship; proposal is not approval; owner-authored evidence is not independent verification.
- Hebrew, English, and Russian remain first-class.
- Mobile is a first-class composition, not compressed desktop.
- Existing archive/search, research routes, source records, StartOn routes, music/media routes, and influence data are preserved.
- AppDeploy is the live execution source; GitHub is the canonical repository and is synchronized only after validated deployment.
- No new unsupported reach totals, partnership claims, academic status claims, or historical imagery.
- Exactly one AppDeploy E2E test is marked `[sanity]`.

## User-visible capability inventory

- Homepage personal encounter — new life-first hierarchy.
- Current activity — existing `/api/social-feed` rendered as content-first `Right Now` stream.
- Visual world navigation — Life, Feed/Voice, Create, StartOn, Lab/Research, Echo/Impact, Archive.
- Life scenes — real press/broadcast/source objects with proof-on-demand.
- Create — music and creator identity before deep archive.
- StartOn — lived mission first, research/relationship depth second.
- THE ECHO — existing propagation/evidence interaction preserved.
- Research — existing independent research objects preserved.
- Visitor handoff — existing Companion/Creator Path entry points preserved.
- Visual QA — overflow, broken media, fixed overlap, repeated imagery, touch targets.

## AppDeploy implementation checklist

1. Update `tests/tests.txt` first and prove the current runtime fails the new life-first acceptance contract.
2. Add new focused homepage components under `src/life-first/`.
3. Add `src/life-first/life-first.css` with independent desktop/mobile compositions.
4. Switch only the home route in `src/App.tsx` from `IgorLivingRecordHome` to `LifeFirstHome` and update the release marker.
5. Keep `IgorLivingRecordHome`, all deep routes, backend endpoints, Companion, research and evidence modules intact.
6. Update `VisualInspector` order expectations to the new life-first section IDs.
7. Deploy, poll to terminal state, inspect QA screenshots/errors, and repair automatically if needed.
8. Export the validated runtime source changes back to branch `feat/life-first-home-20260815`, then open a PR to `main` with the exact AppDeploy version receipt.

## AppDeploy preflight checklist

- Existing app update: `app_id=697a008fddc309b142`, `app_type=frontend+backend`.
- `get_deploy_instructions` reviewed for this feature.
- `get_appdeploy_sdk_reference(feature='api')` reviewed because current/modified social-feed code uses `@appdeploy/client`.
- Only changed files are sent to `deploy_app`; existing unchanged files are not resent.
- `tests/tests.txt` is reconciled with changed user-visible behavior and remains 3–5 tests with exactly one `[sanity]`.
- Every new `diffs[].from` anchor is unique and context-rich; otherwise use full file content replacement.
- No new external asset upload is required; use existing public/source-backed imagery and existing local resources only.
- No new backend route is introduced, so existing backend endpoint coverage is not expanded by this release.
- SPA links remain relative/query/hash based; no new absolute internal client route is introduced.

---

### Task 1: Lock the new acceptance contract with failing E2E tests

**Files:**
- Modify: AppDeploy `tests/tests.txt`
- Later sync: `tests/tests.txt` on `feat/life-first-home-20260815`

**Interfaces:**
- Consumes: current homepage and `VisualInspector` behavior.
- Produces: a five-test acceptance contract for all later tasks.

- [ ] **Step 1: Replace the old THE ECHO-only suite with the life-first release contract**

Use this complete test suite:

```text
# Tests

## Test 1 - Life-first homepage leads with Igor, current activity, and world rooms [sanity]
Viewport: desktop
Covers: life-first hero, Right Now activity, visual world rooms, home hierarchy
Description: Verifies the homepage first reads as a human encounter and living world rather than a dossier or evidence index.
Steps:
1. Open ?lang=he and inspect the first three major homepage sections
2. Verify IGOR VEPRETSKI is visible with a real/source-backed portrait and no visible LIVING RECORD / IGOR-001 label in the opening section
3. Verify a RIGHT NOW / עכשיו section appears before THE ECHO and before the deep archive
4. Verify visual room links for LIFE, FEED / VOICE, CREATE, STARTON, LAB / RESEARCH, ECHO / IMPACT and ARCHIVE are visible before the deep archive
Expected: The first screen is a personal encounter; current activity and world rooms follow before evidence-heavy depth, and no dossier-style opening label dominates the first viewport.

## Test 2 - Mobile life-first flow has no page overflow or fixed overlap
Viewport: mobile
Covers: mobile-first composition, life-first hero, world rooms, fixed-control guardrail, horizontal-overflow guardrail
Description: Verifies the new hierarchy is independently composed for a narrow viewport.
Steps:
1. Open ?lang=he&visualQA=1 and wait for the Visual QA audit to settle
2. Inspect the hero, RIGHT NOW and world-room navigation
3. Refresh the audit once
4. Verify HORIZONTAL OVERFLOW, FIXED OVERLAP and BROKEN IMAGES each report 0 issues
Expected: The first three homepage sections remain fully usable on mobile with no page-level horizontal overflow, no fixed control covering interactive content and no broken source image.

## Test 3 - Source proof is available on demand without dominating life scenes
Viewport: desktop
Covers: life scenes, progressive proof disclosure, source URL/date/context, evidence semantics
Description: Verifies provenance remains available while source metadata is no longer the main visual hierarchy.
Steps:
1. Open ?lang=he and locate the LIFE section
2. Open the proof control on one source-backed life scene
3. Verify the expanded proof shows source/date/context and a source link
4. Verify the underlying scene remains content-first and does not present owner-authored evidence as independent verification
Expected: Proof details expand on demand from the scene, retain precise source semantics and do not replace the lived visual with a proof wall.

## Test 4 - Create and StartOn appear before THE ECHO and research depth
Viewport: desktop
Covers: creator identity, music visibility, StartOn lived mission, section order
Description: Verifies creation and social mission are visible before deep influence/research systems.
Steps:
1. Open ?lang=en and move through the homepage after the world rooms
2. Verify a CREATE section contains at least one official music/video source object
3. Verify STARTON / RETURN appears with a real press or broadcast visual and human mission framing
4. Verify THE ECHO and LAB / RESEARCH remain reachable after those sections
Expected: Creator identity and StartOn are visible before influence/research depth, while THE ECHO and research remain intact later in the journey.

## Test 5 - Three languages and visitor handoff remain intact
Viewport: desktop
Covers: HE/EN/RU localization, visitor handoff, Companion entry, deep-route preservation
Description: Verifies the rearchitecture does not remove multilingual or action-layer capabilities.
Steps:
1. Open ?lang=en and verify the life-first hero and YOUR ROOM / visitor handoff are localized
2. Open ?lang=ru and verify the life-first hero and visitor handoff are localized
3. From the visitor handoff open the 7YA conversation entry
4. Verify the Companion identifies itself as an AI companion based on Igor Vepretski's public work and not Igor himself
Expected: English and Russian remain first-class and the final visitor handoff opens the existing bounded 7YA Companion without changing its identity disclosure.
```

- [ ] **Step 2: Deploy the test-only change against the unchanged runtime**

Use `deploy_app` with only `tests/tests.txt` changed. No production source file changes in this step.

- [ ] **Step 3: Verify RED**

Expected: at least Test 1 fails because the current homepage visibly contains the dossier-style opening and the required life-first order/rooms do not exist. If all tests pass, strengthen the test until it fails for the intended missing behavior.

---

### Task 2: Build the life-first composition layer

**Files:**
- Create: `src/life-first/LifeFirstHome.tsx`
- Create: `src/life-first/LifeFirstHero.tsx`
- Create: `src/life-first/WorldRooms.tsx`
- Create: `src/life-first/ProofDisclosure.tsx`
- Create: `src/life-first/life-first.css`

**Interfaces:**
- Consumes: `useLocale`, `rootHref`, `pageHref`, existing source URLs/resources.
- Produces: `LifeFirstHome` default export for the home route; `ProofDisclosure` with `source`, `date`, `context`, `status`, `href` props.

- [ ] **Step 1: Add the minimal life-first hero and room structure needed for Test 1**

`LifeFirstHero` must render:

```tsx
<section className='lf-hero' id='you-are-here'>
  <figure className='lf-hero-media'>...</figure>
  <div className='lf-hero-copy'>
    <p className='lf-eyebrow'>IGOR VEPRETSKI · #7YA🥷</p>
    <h1>IGOR<br/>VEPRETSKI</h1>
    <p>{localizedHumanLine}</p>
    <nav>...</nav>
  </div>
</section>
```

Do not render `LIVING RECORD`, `IGOR-001`, numbered thesis labels or a CV list in the opening section.

`WorldRooms` must render seven large anchor/route doorways with stable labels:

```ts
['LIFE','FEED / VOICE','CREATE','STARTON','LAB / RESEARCH','ECHO / IMPACT','ARCHIVE']
```

- [ ] **Step 2: Add proof-on-demand behavior**

Use a native `<details>` control so keyboard/screen-reader behavior is available without custom state machinery:

```tsx
export default function ProofDisclosure(props: ProofProps) {
  return <details className='lf-proof'>
    <summary>✓ source</summary>
    <div className='lf-proof-panel'>...</div>
  </details>
}
```

Owner-authored evidence must be labeled exactly as owner-authored/supporting when applicable; do not imply independent verification.

- [ ] **Step 3: Add mobile-first CSS**

Desktop: asymmetric editorial hero, generous media, restrained black/white/green accents.
Mobile: one dominant visual, stacked copy, room doorways one-per-row, no fixed elements from this component, no horizontal grids that escape the viewport.

- [ ] **Step 4: Verify GREEN for the structural portion**

Deploy these new files only; they are not routed yet, so build/type validation must pass but Test 1 should remain RED until Task 4 switches the home route.

---

### Task 3: Add Right Now, life scenes, creator, StartOn, research and visitor handoff

**Files:**
- Create: `src/life-first/RightNow.tsx`
- Create: `src/life-first/LifeScenes.tsx`
- Create: `src/life-first/CreateRoom.tsx`
- Create: `src/life-first/StartOnRoom.tsx`
- Create: `src/life-first/ResearchRoom.tsx`
- Create: `src/life-first/UserHandoff.tsx`
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify: `src/life-first/life-first.css`

**Interfaces:**
- `RightNow` consumes existing `LiveSocial` so `/api/social-feed` behavior and fallback logic remain canonical.
- `LifeScenes` uses source-backed public press/broadcast/owner-source records already present in the runtime.
- `CreateRoom` links official videos/music routes.
- `StartOnRoom` uses the existing Mynet/StartOn broadcast sources and links the canonical StartOn route.
- `ResearchRoom` links the existing research route and does not recreate research data.
- `UserHandoff` links to `?chat=open&journeyChapter=build` and Creator Path.

- [ ] **Step 1: Build Right Now around the existing live social capability**

Do not duplicate `/api/social-feed` networking logic. Render a compact content-first wrapper around the existing `LiveSocial` component and place it immediately after the hero.

- [ ] **Step 2: Build source-backed life scenes**

Use at least four visually distinct records from the existing source set: Mynet/StartOn, Channel 14 service-to-mission frame, Hidabroot/public viral record, and one designed source object for a record without reliable photography. Each scene gets `ProofDisclosure`.

- [ ] **Step 3: Build Create before deep influence/research**

Render at least the existing official music/video records:

```text
NAWAN ft. VEPRETSKI — BIZZI
רון נשר & Igor Vepretski — מת על אקסל
Igor Vepretski — פרח במדבר
```

Use YouTube thumbnails and canonical public links already present in the runtime.

- [ ] **Step 4: Build StartOn lived-mission section**

Lead with the human return/opportunity story. Use real press/broadcast imagery. Keep research framing and relationship verification as secondary links/proof rather than first-order copy.

- [ ] **Step 5: Build research bridge, not a second research page**

Render only a concise LAB / RESEARCH bridge that names the existing domains and links to the canonical research route. Do not duplicate `ResearchPage` logic or claim peer review/university appointment.

- [ ] **Step 6: Build visitor handoff**

The final visible action layer must say, in localized copy, that the site now turns toward the visitor and offers an optional next move. Link to the existing Companion with `chat=open&journeyChapter=build` and to Creator Path.

---

### Task 4: Switch the homepage and preserve THE ECHO/deep archive as later depth

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify: `src/VisualInspector.tsx`

**Interfaces:**
- `App.tsx` imports `LifeFirstHome` and renders it only for `view==='home'`.
- `InfluenceUniverse mode='bar'` remains global unless it visually compromises the first viewport; if it does, suppress the global bar on home and keep full cinematic THE ECHO inside `LifeFirstHome`.
- `LifeFirstHome` reuses `<InfluenceUniverse mode='cinematic'/>` after Create and StartOn, then a Research bridge, UserHandoff, and finally optional `DeepArchiveRiver` depth.

- [ ] **Step 1: Route home to `LifeFirstHome`**

Change only the home case in `App.tsx`. Preserve every other route and global control.

- [ ] **Step 2: Remove global THE ECHO bar from the home first viewport if needed**

Use this behavior:

```tsx
{view!=='home' && <InfluenceUniverse mode='bar' view={view==='growth'?'create':view}/>} 
```

The home still contains the full cinematic THE ECHO later in its sequence.

- [ ] **Step 3: Update release marker**

Set:

```ts
const release='7ya-life-first-home-20260815-1';
```

- [ ] **Step 4: Update VisualInspector section order**

Replace the old thesis-order IDs with the new sequence:

```ts
['you-are-here','right-now','world-rooms','life','create','starton-return','echo','lab-research','your-room','deep-archive']
```

Keep broken-image, overflow, repeated-image, touch-target and fixed-overlap checks.

- [ ] **Step 5: Deploy and verify GREEN**

Expected: Tests 1–5 pass. No frontend/backend/network error attributable to the release. If a QA job times out instead of producing pass/fail, rerun/reconcile the test rather than treating aggregate `passed` as sufficient proof.

---

### Task 5: Visual de-duplication, proof polish and production receipt

**Files:**
- Modify as required: `src/life-first/*.tsx`, `src/life-first/life-first.css`, `src/VisualInspector.tsx`, `tests/tests.txt`
- Sync validated files to GitHub branch `feat/life-first-home-20260815`
- Create: `docs/releases/2026-08-15-7ya-life-first-home-appdeploy.md`

**Interfaces:**
- Consumes: terminal AppDeploy QA status, screenshots, exact applied version.
- Produces: exact runtime-to-GitHub provenance receipt and reviewable PR.

- [ ] **Step 1: Inspect desktop and mobile QA screenshots**

Reject the release if the same portrait is repeated across unrelated source objects, if source imagery is badly cropped, if room doorways read like generic cards, or if the first viewport still feels like a technical dashboard.

- [ ] **Step 2: Run VisualInspector on mobile and desktop**

Required release blockers:

```text
HORIZONTAL OVERFLOW = 0
FIXED OVERLAP = 0
BROKEN IMAGES = 0
EMPTY MEDIA PANELS = 0
```

Repeated images should be 0 for unrelated content; any intentional repeat must be explainable and visually non-dominant.

- [ ] **Step 3: Verify custom domain state**

`7ya.io` and `www.7ya.io` must remain active on the validated AppDeploy version.

- [ ] **Step 4: Write release receipt**

Record exact AppDeploy version, release marker, QA run group, test results, frontend/backend/network errors, domain state, rollback version, and the exact list of source files changed.

- [ ] **Step 5: Sync exact validated files to the GitHub feature branch**

Do not copy unrelated runtime drift. The GitHub branch must match the focused applied runtime files for this release.

- [ ] **Step 6: Open PR to `main`**

PR title:

```text
feat: ship 7YA life-first homepage
```

PR body must state AppDeploy is the validated live runtime, include the exact version/QA receipt, and state that deep evidence/research/archive routes were preserved.
