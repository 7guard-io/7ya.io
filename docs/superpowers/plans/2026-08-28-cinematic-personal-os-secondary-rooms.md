# 7YA Cinematic Personal OS — Secondary Rooms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Media, Museum, Research, Evidence, Library, Speaker, Music and StartOn feel like focused rooms inside one Cinematic Personal OS instead of page-specific experiences buried under multiple global system layers.

**Architecture:** Preserve each room's existing content, data flows and page-specific visual identity. Simplify the shared App shell so core public rooms receive one GlobalNav, one room page, one StoryCompanion and the mobile dock; remove redundant continuity overlays from those routes. Add a lightweight shared room-focus CSS layer for spacing and interaction discipline rather than rewriting eight page styles.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, existing 7YA page CSS, AppDeploy.

**Spec:** `docs/superpowers/specs/2026-08-28-cinematic-personal-os-design.md`

## Global Constraints

- Production app: AppDeploy `697a008fddc309b142`.
- Baseline for this plan: applied production snapshot `1787938162774` or newer if production advances before execution.
- Do not deploy stale GitHub runtime source over AppDeploy.
- Preserve HE / EN / RU routing and room-specific copy.
- Preserve room data APIs, Canon/Discovery boundaries and source links.
- Do not delete room content; remove only redundant global wrappers around it.
- Keep GlobalNav, StoryCompanion and mobile dock.
- Keep StartOn's embedded `VisibleCorpus`; do not add a second global one.
- Do not change backend, Meta/social ingestion, NVIDIA provider logic or Impact metric values.
- No visual-PASS claim without inspectable visual evidence; runtime READY and zero-error QA are separate claims.

---

### Task 1: Add a focused public-room shell contract

**Files:**
- Modify: `src/App.tsx`
- Create: `src/room-focus-20260828.css`

**Interfaces:**
- Produces: `focusedPublicRoom:boolean` inside `AppContent`.
- Focused routes: Museum, Media, Research, Music, Speaker, Evidence, Library / Moment / Entity.
- StartOn already has its own documentary frame and is not routed through the ambient wrapper.

- [ ] **Step 1: Define the focused-room predicate after route resolution**

Use existing booleans and `view`:

```ts
const focusedPublicRoom = libraryPage || evidencePage || ['museum','media','research','music','speaker'].includes(view);
```

Do not include admin/social-control/system/create/growth routes.

- [ ] **Step 2: Replace the ambient deep-page composition with conditional continuity layers**

Keep:

```tsx
<GlobalNav .../>
<div id='main-content'>{content}</div>
<StoryCompanion key={locale}/>
{visualQA&&<VisualInspector key={locale}/>}
```

For `focusedPublicRoom`, do not render these global continuity components:

```text
NinjaExperienceLayer
InfluenceUniverse mode='bar'
LifeAlbumSpine
SiteControl
IgorSceneEngine compact
IgorArsenalLayer continuity
VisibleCorpus global wrapper
IgorContextMachine continuity
```

For non-focused legacy/public creation routes, retain current behavior.

- [ ] **Step 3: Import the shared room-focus CSS after existing device/mobile cutover styles**

```ts
import './room-focus-20260828.css';
```

- [ ] **Step 4: Mark the outer frame for CSS targeting**

Use:

```tsx
<div className={'igor-ambient-frame '+(focusedPublicRoom?'focused-public-room':'')}>...</div>
```

- [ ] **Step 5: Add minimal shared room shell CSS**

Create:

```css
.focused-public-room{min-height:100vh;background:#090a0c}
.focused-public-room #main-content{position:relative;isolation:isolate}
.focused-public-room #main-content>main{min-height:calc(100svh - 68px)}
.focused-public-room #main-content>main>:first-child{scroll-margin-top:84px}
@media(max-width:860px){
  .focused-public-room{padding-bottom:calc(64px + env(safe-area-inset-bottom))}
  .focused-public-room #main-content>main{min-height:calc(100svh - 62px)}
}
@media(prefers-reduced-motion:reduce){.focused-public-room *{scroll-behavior:auto!important}}
```

Do not apply typography, colors or card styling here; room-specific CSS remains authoritative.

---

### Task 2: Preserve StartOn as a focused documentary room

**Files:**
- Modify: `src/App.tsx`
- Modify only if required after QA: `src/starton-page.css`

**Interfaces:**
- StartOn continues to render inside `.igor-documentary-frame` with its own nav, theme toggle, language switcher, embedded VisibleCorpus and StoryCompanion.

- [ ] **Step 1: Keep the existing early StartOn return path unchanged**

Required structure:

```tsx
if(startonPage)return <div className='igor-documentary-frame'>
  <StartOnPage/>
  <StoryCompanion key={locale}/>
  {visualQA&&<VisualInspector key={locale}/>}
</div>;
```

- [ ] **Step 2: Verify no GlobalNav/mobile dock is injected into StartOn**

This prevents duplicate navigation because StartOn already owns `.so-nav`.

---

### Task 3: Add regression tests for room focus and navigation

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Adds Tests 8 and 9 after current Test 7.

- [ ] **Step 1: Add focused-room shell test**

```text
## Test 8 - Core public rooms render one focused shell
Viewport: desktop and mobile
Covers: Media, Museum, Research, Evidence, Library, Speaker, Music, global shell density
Steps:
1. Open /media/, /museum/, /research/, /evidence/, /library/, /speaker/ and /music/.
2. On each route confirm GlobalNav is present and the room's own hero/content starts directly beneath it.
3. Confirm no Ninja banner, global Echo bar, Life Album spine, Scene Engine, Arsenal continuity block or Context Machine is inserted before/after the room content.
4. On mobile confirm the single global mobile dock remains available.
Expected: Each route reads as one focused room inside 7YA, with one global navigation system, its own page content and StoryCompanion; no redundant global continuity stack surrounds the room.
```

- [ ] **Step 2: Add StartOn isolation test**

```text
## Test 9 - StartOn keeps its dedicated documentary shell
Viewport: desktop and mobile
Covers: StartOn navigation, embedded corpus, theme/language controls, duplicate-navigation prevention
Steps:
1. Open /starton/?lang=he.
2. Confirm STARTON × 7YA navigation appears once and no GlobalNav/mobile dock is injected above or below it.
3. Confirm the hero, origin, model, embedded public corpus and source section remain reachable.
Expected: StartOn remains a focused dedicated room with its own navigation and embedded source context, without duplicate global wrappers.
```

---

### Task 4: Validate room functionality and runtime

**Files:**
- Modify only if validation exposes regressions.

- [ ] **Step 1: Build the candidate**

AppDeploy validation/build must complete successfully.

- [ ] **Step 2: Inspect source readback**

Verify `App.tsx` contains the `focusedPublicRoom` predicate and the conditional omission of continuity components.

- [ ] **Step 3: Runtime QA**

Require AppDeploy status `ready` and:

```text
frontend errors: 0
backend errors: 0
network errors: 0 attributable to the candidate
```

- [ ] **Step 4: Verify route-specific public data still loads**

At minimum inspect runtime/QA for `/media/`, `/museum/`, `/research/`, `/evidence/`, `/library/`, `/speaker/`, `/music/`, `/starton/`.

- [ ] **Step 5: Do not claim manual visual PASS unless screenshots/DOM visual inspection is actually available**

Record generated QA screenshot references, but distinguish generated evidence from human/agent-inspected evidence.

## Self-review

- Spec coverage: room unity, preserved depth, reduced system dominance, mobile navigation discipline and source integrity are covered.
- YAGNI: no eight-page redesign is introduced because current room pages already have strong bespoke editorial structures.
- Main risk addressed: App-level wrapper overload rather than room content quality.
- StartOn is deliberately exempt from GlobalNav because it already has a dedicated room navigation.
- Backend and evidence semantics remain untouched.
