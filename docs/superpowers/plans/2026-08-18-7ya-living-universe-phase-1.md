# 7YA Living Universe Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn AppDeploy v100 into the first production-grade 7YA Living Universe slice: a simpler cinematic human entry, a coherent life-first journey, semantically structured and accessible navigation, truthful machine-readable metadata, local-first visitor pathways, and strict visual/performance QA without weakening the existing corpus, media, research or provenance systems.

**Architecture:** Evolve the existing React/Vite `life-first` surface instead of rewriting it. Preserve domain components and data; introduce a small experience/navigation layer, refine the hero and home composition, add accurate structured-data generation from existing canonical page state, and implement privacy-preserving local visitor-path selection. AI Companion work is explicitly excluded from Phase 1; the site must remain fully usable without AI.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, existing CSS modules/files, AppDeploy E2E/visual QA, Vitest + jsdom + Testing Library for focused component contracts.

## Global Constraints

- Baseline is AppDeploy **v100** (`1787007199307`); evolve it rather than replacing the application.
- Approved design source: `docs/superpowers/specs/2026-08-18-7ya-living-universe-design.md`.
- Mandatory research gate: `docs/superpowers/specs/2026-08-18-7ya-ai-era-web-research-gate.md`.
- Human narrative comes before dashboards, counters, archive density or AI.
- Opening viewport: one dominant real-life visual, name, one concise first-person statement, and no more than three primary choices.
- Target **WCAG 2.2 AA** for the public experience.
- Production performance targets: **LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 at p75**, mobile and desktop.
- Use native semantic HTML before ARIA; all critical interaction must work by keyboard.
- Hebrew, English and Russian are first-class; Hebrew RTL, English/Russian LTR.
- Structured data must mirror visible canonical content and must not inflate titles, affiliations, awards, reach, academic status or institutional endorsement.
- Documentary, inferred, contextual/generated and unknown provenance states must remain distinguishable.
- Social metrics remain source-local; do not produce an aggregate total-reach claim.
- No collages.
- No chatbot or generative UI above the human story.
- Visitor personalization in Phase 1 is explicit, reversible and local-only; do not infer sensitive traits or send pathway state to a backend/AI service.
- Do not make `llms.txt`, C2PA issuance, autonomous agent APIs, or GEO heuristics launch blockers.
- Existing corpus/admin/research safety checks in `tests/tests.txt` remain regression requirements.

---

## File Map

**Existing files to modify**

- `package.json` — add focused test scripts/dev dependencies only.
- `src/App.tsx` — mount structured data and preserve canonical/hreflang metadata behavior.
- `src/life-first/LifeFirstHero.tsx` — simplify entry and add exactly three high-level paths.
- `src/life-first/LifeFirstHome.tsx` — recompose section order into the Living Universe hierarchy.
- `src/life-first/life-first.css` — entry, navigation, responsive and performance-safe visual rules.
- `src/life-first/PersonalChronology.tsx` — ensure stable chapter anchors/semantic article boundaries.
- `src/life-first/RightNow.tsx` — expose stable `#now` destination.
- `src/life-first/StartOnRoom.tsx` — expose stable `#starton` destination.
- `src/life-first/ResearchRoom.tsx` — expose stable `#think` destination.
- `src/life-first/CreateRoom.tsx` — expose stable `#create` destination.
- `src/DeepArchiveRiver.tsx` — expose stable `#archive` destination if not already present.
- `tests/tests.txt` — add Phase 1 E2E acceptance cases while retaining all existing tests.

**New focused files**

- `src/test/setup.ts` — Vitest DOM setup.
- `src/life-first/LivingUniverseNav.tsx` — LIFE / NOW / IMPACT / STARTON / THINK / CREATE / ARCHIVE navigation.
- `src/life-first/VisitorPath.tsx` — explicit local-first visitor-interest chooser and reset.
- `src/life-first/visitor-path.ts` — typed options, locale copy and localStorage helpers.
- `src/structured-data.ts` — pure structured-data builders for visible canonical objects.
- `src/StructuredData.tsx` — lifecycle wrapper that injects/removes JSON-LD safely.
- `src/life-first/LivingUniverse.test.tsx` — entry, navigation and pathway contracts.
- `src/structured-data.test.ts` — JSON-LD truthfulness/locale tests.

---

### Task 1: Establish a focused test harness and freeze current safety behavior

**Files:**
- Modify: `package.json`
- Create: `src/test/setup.ts`
- Create: `src/life-first/LivingUniverse.test.tsx`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: existing React components, `LocaleProvider`, current AppDeploy E2E suite.
- Produces: `npm test`, reusable DOM test setup, initial failing Phase 1 contracts.

- [ ] **Step 1: Add the minimum test dependencies and scripts**

Add these scripts to `package.json`:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Add these dev dependencies:

```json
"@testing-library/jest-dom": "^6.6.0",
"@testing-library/react": "^16.1.0",
"jsdom": "^25.0.0",
"vitest": "^2.1.0"
```

- [ ] **Step 2: Create DOM setup**

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Configure Vitest in `package.json` with:

```json
"vitest": {
  "environment": "jsdom",
  "setupFiles": ["./src/test/setup.ts"]
}
```

- [ ] **Step 3: Write failing entry/navigation contracts**

In `src/life-first/LivingUniverse.test.tsx`, render the hero/navigation under `LocaleProvider` and assert:

```ts
expect(screen.getByRole('heading', {name: /igor vepretski/i})).toBeInTheDocument();
expect(screen.getAllByRole('link', {name: /story|סיפור|истор/i})).toHaveLength(1);
expect(screen.getAllByRole('link', {name: /now|עכשיו|сейчас/i})).toHaveLength(1);
expect(screen.getAllByRole('link', {name: /build|ליצור|созда/i})).toHaveLength(1);
```

Also assert that the Living Universe nav exposes exactly seven stable destinations:

```ts
['#life-chronology','#now','#impact','#starton','#think','#create','#archive']
```

- [ ] **Step 4: Run tests to verify the new contracts fail before implementation**

Run:

```bash
npm test
```

Expected: FAIL because v100 currently has two hero CTAs and no `LivingUniverseNav`.

- [ ] **Step 5: Extend AppDeploy E2E acceptance text without deleting existing tests**

Append a new test to `tests/tests.txt` requiring:

- first viewport has one dominant life visual and exactly three primary choices;
- no metrics wall or chatbot appears before chronology;
- seven Living Universe destinations are reachable by ordinary links;
- keyboard focus remains visible and not covered by navigation on mobile/desktop.

- [ ] **Step 6: Commit**

```bash
git add package.json src/test/setup.ts src/life-first/LivingUniverse.test.tsx tests/tests.txt
git commit -m "test: define Living Universe entry contracts"
```

---

### Task 2: Build the semantic Living Universe navigation and recompose the homepage

**Files:**
- Create: `src/life-first/LivingUniverseNav.tsx`
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify: `src/life-first/RightNow.tsx`
- Modify: `src/life-first/StartOnRoom.tsx`
- Modify: `src/life-first/ResearchRoom.tsx`
- Modify: `src/life-first/CreateRoom.tsx`
- Modify: `src/DeepArchiveRiver.tsx`
- Modify: `src/life-first/life-first.css`
- Test: `src/life-first/LivingUniverse.test.tsx`

**Interfaces:**
- Produces: stable section contract `life-chronology | now | impact | starton | think | create | archive`.
- Consumes: existing `InfluenceUniverse`, chronology, StartOn, research, creation and archive components.

- [ ] **Step 1: Write the navigation test**

Assert `LivingUniverseNav` renders a semantic `<nav aria-label="7YA Living Universe">` and each destination is a normal anchor, not a click-only `div`.

- [ ] **Step 2: Verify test fails**

```bash
npm test -- src/life-first/LivingUniverse.test.tsx
```

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Implement `LivingUniverseNav.tsx`**

Use locale copy for:

```ts
const items = [
  ['LIFE','#life-chronology'],
  ['NOW','#now'],
  ['IMPACT','#impact'],
  ['STARTON','#starton'],
  ['THINK','#think'],
  ['CREATE','#create'],
  ['ARCHIVE','#archive'],
] as const;
```

Render with `<nav>`, `<ul>`, `<li>`, `<a>` and an accessible label. Keep English room names as the compact brand layer; expose localized `aria-label`/supporting text where useful.

- [ ] **Step 4: Add stable section ids without changing domain content**

Ensure the section roots expose:

```text
PersonalChronology -> id="life-chronology"
RightNow -> id="now"
InfluenceUniverse wrapper -> id="impact"
StartOnRoom -> id="starton"
ResearchRoom -> id="think"
CreateRoom -> id="create"
DeepArchiveRiver -> id="archive"
```

Do not create duplicate ids.

- [ ] **Step 5: Recompose `LifeFirstHome.tsx`**

The top-level order becomes:

```tsx
<LifeFirstHero />
<LivingUniverseNav />
<PersonalChronology />
<RightNow />
<section id="impact"><InfluenceUniverse mode="cinematic" /></section>
<StartOnRoom />
<ResearchRoom />
<CreateRoom />
<VisitorPath />
<PersonalArchive />
<DeepArchiveRiver />
```

Existing secondary modules (`PublicActionStage`, `LifeGeography`, `PostPortraitWall`, `WorldRooms`, `LifeScenes`, `LongformVoice`, `KnowledgeCommons`) must not be deleted. Move them after the dominant story/action sequence or keep them contextually nested where their existing semantics already belong. The first screen and first major scroll must not become a module wall.

- [ ] **Step 6: Add responsive nav behavior**

Use a horizontally scrollable semantic list only when necessary, with no hidden critical items, no fixed overlay covering focus, `scrollbar-gutter`/padding where needed, and `scroll-margin-top` on section destinations.

- [ ] **Step 7: Run tests and build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/life-first/LivingUniverseNav.tsx src/life-first/LifeFirstHome.tsx src/life-first/RightNow.tsx src/life-first/StartOnRoom.tsx src/life-first/ResearchRoom.tsx src/life-first/CreateRoom.tsx src/DeepArchiveRiver.tsx src/life-first/life-first.css src/life-first/LivingUniverse.test.tsx
git commit -m "feat: add Living Universe navigation hierarchy"
```

---

### Task 3: Simplify the hero into a high-impact human entry

**Files:**
- Modify: `src/life-first/LifeFirstHero.tsx`
- Modify: `src/life-first/life-first.css`
- Test: `src/life-first/LivingUniverse.test.tsx`

**Interfaces:**
- Produces: exactly three primary choices: Story, Now, Build/Create.
- Preserves: real documentary hero image and source link/fallback behavior.

- [ ] **Step 1: Tighten the failing test to enforce exactly three primary hero links**

Assert the hero actions point to:

```text
#life-chronology
#now
#create
```

and that no counter, metric table or chatbot exists inside `.lf-hero`.

- [ ] **Step 2: Verify test fails**

```bash
npm test -- src/life-first/LivingUniverse.test.tsx
```

- [ ] **Step 3: Update hero copy without inventing biography**

Keep the current verified first-person life line as the factual base. Reduce competing route labels and secondary notes so the hierarchy is:

1. eyebrow;
2. `IGOR VEPRETSKI`;
3. one human first-person paragraph;
4. three primary choices.

Do not introduce a new title, political rank, award or reach number.

- [ ] **Step 4: Add image loading semantics**

The hero image is the LCP candidate. Set:

```tsx
fetchPriority="high"
loading="eager"
decoding="async"
```

Keep object-fit behavior and source fallback. Below-fold imagery remains lazy in its own components.

- [ ] **Step 5: Reduce visual complexity**

Remove or visually demote competing route strips from the first viewport. Maintain one dominant image and one dominant typographic block. Keep the green accent for action/state rather than making every element equally loud.

- [ ] **Step 6: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/life-first/LifeFirstHero.tsx src/life-first/life-first.css src/life-first/LivingUniverse.test.tsx
git commit -m "feat: simplify Living Universe entry"
```

---

### Task 4: Strengthen semantic chronology and provenance without exposing technical jargon

**Files:**
- Modify: `src/life-first/PersonalChronology.tsx`
- Modify: `src/life-first/ProofDisclosure.tsx`
- Modify: `src/life-first/MediaEchoCluster.tsx`
- Modify: `src/life-first/personal-chronology.css`
- Test: `src/life-first/LivingUniverse.test.tsx`

**Interfaces:**
- Produces: stable semantic chapter articles with provenance states visible on demand.
- Preserves: current source-local metrics and existing media-echo data.

- [ ] **Step 1: Add a test for semantic chapters**

At least the three representative chapters used by the existing E2E suite must render as `<article>` or an equivalent semantic chapter container with a stable id and one chapter heading.

- [ ] **Step 2: Add a test for source-local provenance wording**

For media echoes, assert visible/default or disclosure text can distinguish:

```text
verified/source-linked
snapshot/source-local
inferred/interpretive
unknown/not established
```

without displaying internal engineering labels such as `OWNER ARCHIVE`, `CAPTURE DATE UNASSERTED` or `SOURCE-LINKED` as raw UI prose.

- [ ] **Step 3: Verify tests fail where semantics are missing**

```bash
npm test -- src/life-first/LivingUniverse.test.tsx
```

- [ ] **Step 4: Implement stable chapter semantics**

Use native `<article>`, `<header>`, `<figure>`, `<time>`, `<details>` and `<summary>` where appropriate. Do not convert working links into scripted click handlers.

- [ ] **Step 5: Keep provenance layered**

Default reading path shows concise human labels; detailed source URL/date/verification state remains in disclosure. Never convert unknown evidence to zero or verified.

- [ ] **Step 6: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/life-first/PersonalChronology.tsx src/life-first/ProofDisclosure.tsx src/life-first/MediaEchoCluster.tsx src/life-first/personal-chronology.css src/life-first/LivingUniverse.test.tsx
git commit -m "refactor: make life chapters semantic and provenance-aware"
```

---

### Task 5: Add truthful structured data generated from canonical visible state

**Files:**
- Create: `src/structured-data.ts`
- Create: `src/StructuredData.tsx`
- Create: `src/structured-data.test.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `buildHomeStructuredData(locale)` and `buildPageStructuredData(locale, view)` returning serializable JSON-LD graphs.
- Consumes: locale and view already resolved by `App.tsx`.

- [ ] **Step 1: Write failing tests for home JSON-LD**

Assert the home graph contains only defensible baseline objects:

```ts
expect(graph['@context']).toBe('https://schema.org');
expect(types).toContain('Person');
expect(types).toContain('WebSite');
```

Assert it contains canonical `https://7ya.io/`, Igor's name, localized page URL and no fabricated values for awards, political office, academic rank or aggregate reach.

- [ ] **Step 2: Add locale parity tests**

For `he`, `en`, `ru`, assert canonical/hreflang URLs are stable and the graph does not make stronger identity claims in one locale.

- [ ] **Step 3: Verify tests fail**

```bash
npm test -- src/structured-data.test.ts
```

- [ ] **Step 4: Implement pure builders**

`src/structured-data.ts` must export typed builders and use visible/canonical facts already present in the application. Phase 1 home graph should stay deliberately small:

- `WebSite`
- `ProfilePage` for the personal home if semantically accurate
- `Person` for Igor

Do not add `ScholarlyArticle`, `Dataset`, `Organization`, `PodcastEpisode` or `VideoObject` unless the rendered page instance provides the required truthful properties.

- [ ] **Step 5: Implement lifecycle injection**

`StructuredData.tsx` creates one `<script type="application/ld+json" id="7ya-structured-data">`, updates it on locale/view changes, and removes/replaces stale graph content rather than appending duplicates.

- [ ] **Step 6: Mount from `App.tsx`**

Mount `StructuredData` after `view`/`locale` resolution. Keep existing title, description, canonical and hreflang behavior.

- [ ] **Step 7: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/structured-data.ts src/StructuredData.tsx src/structured-data.test.ts src/App.tsx
git commit -m "feat: add truthful structured data"
```

---

### Task 6: Add explicit local-first visitor pathways

**Files:**
- Create: `src/life-first/visitor-path.ts`
- Create: `src/life-first/VisitorPath.tsx`
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify: `src/life-first/life-first.css`
- Test: `src/life-first/LivingUniverse.test.tsx`

**Interfaces:**
- Produces: `VisitorInterest` union, `readVisitorInterest()`, `writeVisitorInterest()`, `clearVisitorInterest()`.
- Storage: browser `localStorage` key `7ya.visitorInterest.v1` only.

- [ ] **Step 1: Write failing pathway tests**

Define the first release options exactly as:

```ts
type VisitorInterest =
  | 'belonging'
  | 'family'
  | 'crisis'
  | 'creation'
  | 'public-impact'
  | 'youth'
  | 'leadership'
  | 'technology'
  | 'meaning';
```

Test that selecting a pathway stores only the selected enum and that Reset removes it.

- [ ] **Step 2: Verify test fails**

```bash
npm test -- src/life-first/LivingUniverse.test.tsx
```

- [ ] **Step 3: Implement local storage helpers defensively**

Invalid or unavailable storage returns `null`; never throw during serverless/static rendering or private browsing failures.

- [ ] **Step 4: Implement `VisitorPath.tsx`**

The module asks a single explicit question equivalent to "What in this story meets you?" and exposes the nine options as real buttons. After selection it shows a short explanation such as "Showing a path because you chose belonging" and a Reset/Change action.

No profiling language. No hidden inference. No network request.

- [ ] **Step 5: Use selection only to recommend, never hide canonical content**

Map each interest to existing anchors/rooms. Example:

```ts
belonging -> #life-chronology
family -> relevant fatherhood chapter anchor
crisis -> relevant recovery/life chapter anchor
creation -> #create
public-impact -> #impact
youth -> #starton
leadership -> #impact
technology -> #think
meaning -> #think
```

Canonical page order and accessibility remain unchanged for visitors who do not choose.

- [ ] **Step 6: Run tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/life-first/visitor-path.ts src/life-first/VisitorPath.tsx src/life-first/LifeFirstHome.tsx src/life-first/life-first.css src/life-first/LivingUniverse.test.tsx
git commit -m "feat: add local-first visitor pathways"
```

---

### Task 7: Accessibility, mobile density and performance pass

**Files:**
- Modify: `src/life-first/life-first.css`
- Modify: affected life-first media components only where image attributes are missing
- Modify: `tests/tests.txt`
- Test: `src/life-first/LivingUniverse.test.tsx`

**Interfaces:**
- Produces: WCAG-oriented keyboard/focus behavior and lower first-load media cost.

- [ ] **Step 1: Add component-level accessibility assertions**

Assert:

- nav links have accessible names;
- hero actions are links with valid `href`;
- pathway choices are buttons;
- no duplicate major section ids;
- `details/summary` disclosures remain keyboard-native.

- [ ] **Step 2: Apply focus and target-size rules**

Ensure all primary links/buttons have visible `:focus-visible` treatment and minimum practical touch targets. Sticky navigation must not obscure focused elements; add `scroll-margin-top` to anchors.

- [ ] **Step 3: Enforce one dominant object on narrow screens**

At `max-width: 900px`, avoid multi-column content competitions in the hero, life scenes, pathway cards and primary room transitions. No horizontal overflow is allowed.

- [ ] **Step 4: Respect reduced motion**

Keep or expand the existing `prefers-reduced-motion: reduce` rule so scroll/transition/animation effects are disabled without removing information.

- [ ] **Step 5: Optimize media loading**

Hero stays eager/high-priority. For below-fold images that currently omit loading semantics, add:

```tsx
loading="lazy"
decoding="async"
```

Preserve dimensions/aspect-ratio containers so media arrival does not shift layout. Do not lazy-load the hero LCP image.

- [ ] **Step 6: Add E2E release assertions**

Append checks to `tests/tests.txt` for:

- `?lang=he&visualQA=1` mobile: 0 horizontal overflow, 0 fixed overlap, 0 broken images;
- same first-screen hierarchy in English and Russian;
- keyboard traversal reaches all three hero choices and seven room links;
- no AI/chat surface blocks conventional navigation;
- no combined total-reach number appears.

- [ ] **Step 7: Run local tests/build**

```bash
npm test
npm run build
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/life-first src/DeepArchiveRiver.tsx tests/tests.txt
git commit -m "perf: harden Living Universe mobile and accessibility"
```

---

### Task 8: Deploy, run independent QA, and snapshot the validated release

**Files:**
- No new product files unless QA identifies a defect.
- Snapshot/documentation in `7guard-io/7ya.io` after successful AppDeploy release.

**Interfaces:**
- Consumes: all Phase 1 tasks.
- Produces: one validated AppDeploy version and corresponding GitHub snapshot/reference.

- [ ] **Step 1: Run complete local gate**

```bash
npm test
npm run build
```

Expected: all tests PASS and Vite build exits 0.

- [ ] **Step 2: Deploy as an update to app `697a008fddc309b142`**

Use AppDeploy update mode from v100. Do not create a new app. Do not add backend/AI/database services in this phase.

- [ ] **Step 3: Poll AppDeploy to terminal state**

Require:

```text
deployment.status = ready
e2e_tests.status = passed
frontend_errors = []
backend_errors = []
network_errors = [] for first-party critical routes
```

If E2E fails, inspect the run details, fix the smallest defect, redeploy and repeat; maximum three automatic repair passes before escalation.

- [ ] **Step 4: Inspect desktop and mobile QA screenshots**

Strict visual pass criteria:

- first viewport: one dominant real-life image and human text, not a module dashboard;
- exactly three clear choices;
- Life/Now/Impact/StartOn/Think/Create/Archive navigation legible;
- no collage;
- no horizontal overflow;
- no sticky/fixed overlap;
- no broken imagery;
- Hebrew RTL and Russian/English LTR look intentional;
- page still reads as Igor's lived story, not an AI product.

- [ ] **Step 5: Verify structured data and metadata in the deployed DOM**

Check one JSON-LD block exists, locale/view changes replace rather than duplicate it, visible content supports all claims, canonical/hreflang remain correct.

- [ ] **Step 6: Record performance gate**

Use available production/lab measurement tooling to verify no obvious regression and record the target budgets:

```text
LCP <= 2.5s
INP <= 200ms
CLS <= 0.1
```

If field p75 data is not yet available for the new release, report that explicitly rather than inventing a pass; use lab/QA evidence as provisional and revisit with field data.

- [ ] **Step 7: Re-run existing corpus/research/admin safety cases**

All five pre-existing `tests/tests.txt` cases must still pass, including canonical corpus v2, research status labels, source-local metrics and admin dry-run protection.

- [ ] **Step 8: Snapshot validated source and release metadata to GitHub**

Record the AppDeploy version id, QA result, date and the exact source snapshot under the repository's existing `appdeploy-live/` convention. Do not overwrite older validated snapshots.

- [ ] **Step 9: Commit release record**

```bash
git add appdeploy-live docs tests
git commit -m "chore: snapshot validated Living Universe phase 1"
```

---

## Phase 1 Definition of Done

Phase 1 passes only when all of the following are true:

1. The first viewport is recognizably Igor's human story and contains no dashboard/AI dominance.
2. Exactly three primary entry choices lead to Story, Now and Build/Create.
3. The seven Living Universe destinations are ordinary, accessible links with stable anchors.
4. Existing chronology, media echoes, StartOn, research, creation and archive content remains reachable and source-aware.
5. Three representative chapters preserve media/public-echo/knowledge/provenance context.
6. Structured data is accurate, minimal and locale-safe.
7. Visitor pathways are opt-in, reversible, local-only and never hide canonical content.
8. Hebrew/Russian/English remain first-class with correct directionality.
9. Mobile QA shows no horizontal overflow, fixed overlap or broken images.
10. Existing corpus, research-status, source-local metric and admin safety tests still pass.
11. AppDeploy E2E passes with no runtime frontend/backend errors.
12. Performance is measured; p75 Core Web Vitals are not falsely claimed if field data is not yet available.
13. No collage, fabricated historical image, unsupported affiliation, aggregate reach inflation or hidden AI profiling is introduced.
14. AI Companion remains deferred until this human-first slice proves itself.
