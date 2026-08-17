# 7YA Living Universe Slice 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert AppDeploy v100 into the first research-backed 7YA Living Universe slice: a minimal human-first entry, progressive first-person story depth, explicit visitor pathways, semantic/accessible structure, accurate machine-readable metadata, and production QA without introducing a new AI-first dependency.

**Architecture:** Evolve the existing `life-first` React implementation rather than replace it. Preserve canonical corpus, Knowledge Commons, media echo, research status, StartOn, archive and the existing AI Companion; change the presentation hierarchy and add small focused components for visitor pathways and structured metadata. Use AppDeploy’s existing `tests/tests.txt` E2E contract as the primary release specification, plus build/type validation and screenshot QA.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, CSS, Lucide React, existing AppDeploy frontend/backend, existing canonical-corpus client and AppDeploy E2E QA.

## Global Constraints

- Baseline is AppDeploy v100 (`1787007199307`); evolve, do not rewrite the domain model.
- Normative design: `docs/superpowers/specs/2026-08-18-7ya-living-universe-design.md`.
- Normative research gate: `docs/superpowers/specs/2026-08-18-7ya-ai-era-web-research-gate.md`.
- Human narrative remains the primary interface; AI is optional and must not dominate the first viewport.
- Preserve canonical-corpus provenance, research-status honesty, source-local metrics, privacy boundaries and existing deep routes.
- Target WCAG 2.2 Level AA for this public slice.
- Production performance targets: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 at the 75th percentile when field data is available; do not knowingly introduce regressions in lab QA.
- Hebrew, English and Russian remain first-class; Hebrew RTL, English/Russian LTR.
- No collages. Documentary media, contextual/generated imagery and missing-media fallbacks must remain distinguishable.
- Structured data must describe visible canonical content only; no title, affiliation, metric, research-status or endorsement inflation.
- Do not add `llms.txt`, GEO hacks, C2PA issuance, adaptive generative layout or new AI backend behavior in Slice 1.
- Keep the existing Companion dismissible/resettable and source-bound; do not move it above the story.
- Each production change must be reversible as a small AppDeploy version and mirrored to GitHub after QA passes.

---

## File map

### Existing files to modify

- `tests/tests.txt` — release contract; add AI-era Living Universe acceptance tests without weakening existing five tests.
- `src/life-first/LifeFirstHero.tsx` — minimal entry, three human choices, no dashboard density.
- `src/life-first/LifeFirstHome.tsx` — composition order and section landmark relationships.
- `src/life-first/PersonalChronology.tsx` — semantic chapter structure, contextual depth trigger, media loading behavior.
- `src/life-first/personal-chronology.css` — cinematic chapter pacing and progressive disclosure.
- `src/life-first/life-first.css` — first viewport, mobile one-object-at-a-time hierarchy, focus/target/reduced-motion rules.
- `src/StoryCompanion.tsx` — capability/limit wording and explicit optionality only; no new AI behavior.
- `src/story-companion.css` — focus/accessibility refinements if required by the updated markup.
- `src/App.tsx` — mount/update structured metadata and ensure locale-aware page semantics.
- `src/GlobalNav.tsx` / `src/global-nav.css` — only if sticky focus or first-viewport competition fails QA.

### New focused files

- `src/life-first/VisitorPath.tsx` — explicit, local/session-based interest selection and reset; no sensitive inference.
- `src/life-first/visitor-path.css` — responsive visitor-path presentation.
- `src/seo-graph.ts` — pure locale/view-to-JSON-LD builders for accurate visible canonical objects.

### Files intentionally untouched in Slice 1

- canonical corpus backend/write guard
- `knowledge-commons-data.ts` content claims
- media-echo metrics/data methodology
- research publication-status model
- deep archive domain logic
- AI Companion backend/provider selection
- C2PA issuance

---

### Task 1: Extend the release contract before UI changes

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: current five E2E tests.
- Produces: Tests 6–8 defining human-first entry, explicit personalization, semantics/accessibility/AI optionality, and structured metadata expectations.

- [ ] **Step 1: Add a failing test for the new entry hierarchy**

Append Test 6 with these exact requirements:

```text
## Test 6 - Living Universe entry is human-first, minimal and routes three clear intents [sanity]
Viewport: desktop and mobile
Covers: minimal first viewport, Story / Now / Build routes, AI demotion, visual hierarchy
Steps:
1. Open ?lang=he at the top of the page
2. Verify the hero contains one dominant real-life visual, IGOR VEPRETSKI, one first-person statement and exactly three primary entry actions: story, now and build/create
3. Verify no social metric grid, Knowledge Commons grid, archive grid or Companion FAB competes inside the initial viewport
4. Activate each entry action and verify it reaches #life-chronology, #right-now and the build/create destination respectively
5. Repeat on mobile and verify the first viewport has no horizontal overflow and one dominant visual/content object
Expected: The opening behaves as a human introduction rather than a dashboard, while three explicit intents remain immediately available.
```

- [ ] **Step 2: Add a failing test for visitor-declared personalization**

Append Test 7:

```text
## Test 7 - Visitor pathway is explicit, reversible and local-first
Viewport: mobile
Covers: declared-interest personalization, no sensitive inference, reset
Steps:
1. Open ?lang=he and enter the story far enough to reach the visitor pathway module
2. Choose the belonging interest
3. Verify the UI explicitly says the suggested continuation is shown because belonging was chosen
4. Reload the page in the same tab and verify the choice can be restored from local/session state without requiring identity, login or private data
5. Use Reset/change and verify the pathway returns to the unselected state
Expected: Personalization is based only on an explicit visitor choice, explains its reason and can be reversed without an account.
```

- [ ] **Step 3: Add a failing test for AI-era semantics and metadata**

Append Test 8:

```text
## Test 8 - Semantic, accessible and machine-readable foundation matches visible reality
Viewport: desktop
Covers: WCAG-oriented semantics, JSON-LD, locale, optional AI
Steps:
1. Open ?lang=he and verify one main landmark, logical heading order and article/section semantics for chronology content
2. Keyboard-tab through the hero actions and verify visible focus is not hidden by fixed navigation
3. Inspect documentElement and verify lang=he and dir=rtl; repeat en/ru and verify dir=ltr
4. Verify a JSON-LD graph exists for the visible home page and identifies Igor as Person/ProfilePage without unsupported office, award, academic-consensus or aggregate-reach claims
5. Verify the 7YA Companion remains closed/optional at first load, labels itself as AI rather than Igor, states its public-source boundary and exposes reset/close controls when opened
Expected: The human page is also semantically usable by assistive technology, crawlers and agents without hidden identity inflation or forced AI interaction.
```

- [ ] **Step 4: Run baseline QA and record the expected red state**

Run: AppDeploy E2E against current v100 without production changes.

Expected: Existing Tests 1–5 PASS; at least Test 6 and Test 7 FAIL because the new three-intent entry and visitor-path module do not exist yet. Test 8 may partially pass but is not considered green until all assertions are verified.

- [ ] **Step 5: Commit the contract change to the AppDeploy working version**

Commit/snapshot message: `test: define Living Universe slice 1 acceptance`

---

### Task 2: Make the first viewport a minimal human entry

**Files:**
- Modify: `src/life-first/LifeFirstHero.tsx`
- Modify: `src/life-first/life-first.css`

**Interfaces:**
- Consumes: `useLocale`, existing Drive hero media, existing story/public-action anchors.
- Produces: three stable entry targets: `#life-chronology`, `#right-now`, and `/?page=create`/locale-safe create route.

- [ ] **Step 1: Change hero copy/data shape to expose three actions**

Use locale copy fields equivalent to:

```ts
{
  story: 'להתחיל מההתחלה',
  now: 'מה קורה עכשיו',
  build: 'לבנות משהו יחד'
}
```

English and Russian receive equivalent localized intent, not literal machine phrasing.

- [ ] **Step 2: Replace the two-action hero nav with exactly three primary actions**

Keep the story action as the dominant filled action. Route `now` to `#right-now`. Route `build` through `pageHref('create', locale)` rather than hard-coded query assembly.

Expected DOM shape:

```tsx
<nav className='lf-hero-actions' aria-label={localizedEntryLabel}>
  <a href='#life-chronology'>…</a>
  <a href='#right-now'>…</a>
  <a href={pageHref('create',locale)}>…</a>
</nav>
```

- [ ] **Step 3: Remove first-viewport competition**

Keep the existing route/biography information only if it remains visually subordinate. Do not add counters, cards or a second visual. Ensure the visual remains one real documentary frame and the source caption remains available but visually quiet.

- [ ] **Step 4: Enforce mobile one-object-at-a-time layout and WCAG focus/target rules**

In `life-first.css`:

- minimum interactive target height 44px or greater for hero actions
- `:focus-visible` outline with sufficient contrast and offset
- no hidden horizontal overflow caused by hero typography
- mobile hero image and copy appear sequentially, not as a miniature desktop grid
- reduced-motion mode disables decorative transitions

- [ ] **Step 5: Build and run Test 6**

Run: `npm run build`, then AppDeploy E2E Test 6 on desktop/mobile.

Expected: Test 6 PASS; no new console/runtime errors.

- [ ] **Step 6: Snapshot/commit**

Message: `feat: make Living Universe entry human-first`

---

### Task 3: Convert chapter depth into progressive disclosure

**Files:**
- Modify: `src/life-first/PersonalChronology.tsx`
- Modify: `src/life-first/personal-chronology.css`

**Interfaces:**
- Consumes: `MediaEchoCluster`, `KnowledgeLensCard`, chapter links/metrics/canonical IDs.
- Produces: chapter article with primary lived story visible and secondary media/knowledge/source depth available contextually.

- [ ] **Step 1: Preserve the chapter as the dominant `article`**

Each chapter remains:

```tsx
<article id={'life-'+chapter.id} data-canonical-id={chapter.canonicalId}>…</article>
```

The first visible layer contains period, title, first-person body, one media object and only the most important immediate source link(s).

- [ ] **Step 2: Put secondary depth behind accessible disclosure controls**

Use native `<details>`/`<summary>` for the three conceptual depth paths where data exists:

```text
HEAR / WATCH THIS CHAPTER
SEE HOW IT TRAVELLED
LEARN FROM THIS
```

Do not recreate disclosure behavior with a clickable `div`. The existing `MediaEchoCluster` and `KnowledgeLensCard` remain the content engines inside these disclosures.

- [ ] **Step 3: Keep source/provenance accessible without technical-caption clutter**

Visible prose must not surface backend labels such as `CAPTURE DATE UNASSERTED` as a primary narrative caption. Preserve provenance in disclosure/source metadata rather than deleting it.

- [ ] **Step 4: Tighten image loading behavior**

Only the first story visual may be eager/high-priority. All later chapter images stay `loading='lazy'` and `decoding='async'`. Preserve explicit fallback behavior and never substitute unrelated stock imagery.

- [ ] **Step 5: Make mobile disclosure stack vertically**

Ensure summary targets meet target-size guidance, keyboard focus is visible and opening a disclosure does not create horizontal overflow.

- [ ] **Step 6: Run Tests 1–5 after the refactor**

Expected: Existing life, media-echo, Knowledge Commons, mobile and canonical-corpus expectations remain PASS. No source-local metric is reinterpreted as total reach.

- [ ] **Step 7: Snapshot/commit**

Message: `refactor: make life chapters progressively explorable`

---

### Task 4: Add explicit visitor-declared pathways

**Files:**
- Create: `src/life-first/VisitorPath.tsx`
- Create: `src/life-first/visitor-path.css`
- Modify: `src/life-first/LifeFirstHome.tsx`

**Interfaces:**
- Consumes: `useLocale`, stable chapter/room anchors only.
- Produces: no backend API; a small local state object `{interest, selectedAt}` stored under `7ya.visitor.path.v1`.

- [ ] **Step 1: Define a fixed, non-sensitive interest vocabulary**

Use only these initial interests:

```ts
type VisitorInterest='belonging'|'family'|'crisis'|'creation'|'impact'|'youth'|'leadership'|'technology'|'meaning';
```

Do not add politics, health, ethnicity, religion, sexuality or inferred psychological traits as personalization categories.

- [ ] **Step 2: Map each choice to a transparent continuation**

Example mapping:

```ts
const paths={
  belonging:{href:'#life-origin',reason:'belonging'},
  family:{href:'#life-fatherhood',reason:'family'},
  youth:{href:'#life-return',reason:'youth'},
  impact:{href:'#public-action',reason:'impact'},
  creation:{href:'#create-room',reason:'creation'},
  meaning:{href:'#research-room',reason:'meaning'}
};
```

Use the actual existing target IDs discovered in source; if an ID differs, update the mapping rather than inventing an unavailable target.

- [ ] **Step 3: Implement safe local/session persistence**

Use guarded `sessionStorage` first. If the product decision uses `localStorage`, keep the object limited to the declared interest and timestamp. No name, account or hidden behavioral profile.

- [ ] **Step 4: Explain the recommendation**

After selection, show localized copy equivalent to:

```text
מוצג לך כי בחרת: שייכות
```

Provide `שינוי / איפוס` beside it.

- [ ] **Step 5: Place the module after meaningful story exposure, not above the life**

Insert `VisitorPath` after the chronology or after the first coherent narrative sequence, before deep room/archive density. Never place it in the first viewport.

- [ ] **Step 6: Build and run Test 7**

Expected: selection, explanation, same-tab persistence and reset all PASS without network requests.

- [ ] **Step 7: Snapshot/commit**

Message: `feat: add explicit visitor pathways`

---

### Task 5: Make the page machine-readable without identity inflation

**Files:**
- Create: `src/seo-graph.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Locale`, existing `seo` view data and visible canonical identity facts.
- Produces: `buildSeoGraph(locale, view)` returning a JSON-serializable `@graph`; one script element with `type='application/ld+json'` and stable id `7ya-structured-data`.

- [ ] **Step 1: Implement a pure structured-data builder**

Minimum home graph:

```ts
{
  '@context':'https://schema.org',
  '@graph':[
    {
      '@type':'ProfilePage',
      '@id':'https://7ya.io/#profile',
      url:canonical,
      mainEntity:{'@id':'https://7ya.io/#igor'}
    },
    {
      '@type':'Person',
      '@id':'https://7ya.io/#igor',
      name:'Igor Vepretski',
      url:'https://7ya.io/'
    }
  ]
}
```

Add only `sameAs` URLs already verified as Igor-owned public profiles. Do not add public office, party-list position, Nobel aspiration, aggregate reach, unverified awards or peer-reviewed status.

- [ ] **Step 2: Keep structured data synchronized with current view/locale**

In the existing SEO `useEffect`, create/update exactly one `script#7ya-structured-data`. Serialize with `JSON.stringify(buildSeoGraph(locale,view))`.

- [ ] **Step 3: Set root language/direction explicitly**

In the same locale lifecycle, set:

```ts
document.documentElement.lang=locale;
document.documentElement.dir=locale==='he'?'rtl':'ltr';
```

Do not rely only on nested component `dir` attributes.

- [ ] **Step 4: Preserve canonical/hreflang behavior**

Do not remove the current canonical and alternate language link updates. Verify each language points to the equivalent visible view.

- [ ] **Step 5: Build and run the semantic/metadata assertions in Test 8**

Expected: JSON-LD exists, parses, matches visible content, and all locales set root `lang/dir` correctly.

- [ ] **Step 6: Snapshot/commit**

Message: `feat: add truthful semantic metadata`

---

### Task 6: Align the existing AI Companion with the research gate without expanding it

**Files:**
- Modify: `src/StoryCompanion.tsx`
- Modify: `src/story-companion.css` only if needed for focus/target compliance.

**Interfaces:**
- Consumes: existing Companion API, local conversation storage and delayed FAB logic.
- Produces: clearer capability/limitation/optionality wording; no API behavior change.

- [ ] **Step 1: Preserve delayed invocation**

Keep the existing rule that the FAB is not visible on initial home load and becomes available after meaningful scroll or explicit deep route. Do not change it to auto-open.

- [ ] **Step 2: Clarify capability and limitations in all three locales**

The header/details must communicate all of:

```text
AI companion, not Igor
uses public 7YA sources
can help find/explain/route information
can be wrong or incomplete
conversation can be reset/closed
no live access to private Gmail/Drive/other private sources
```

Keep wording concise enough not to turn the panel into a legal notice.

- [ ] **Step 3: Verify keyboard/dialog behavior**

Escape closes; close/reset buttons have accessible labels; focus-visible styles are not obscured. Do not add a custom focus trap unless QA proves the existing dialog is unusable; avoid unnecessary new complexity.

- [ ] **Step 4: Run Test 8 Companion assertions**

Expected: optional at first load; clearly AI; public-source boundary; close and reset controls present.

- [ ] **Step 5: Snapshot/commit**

Message: `fix: make Companion capability and limits explicit`

---

### Task 7: Harden performance, accessibility and responsive pacing

**Files:**
- Modify: `src/life-first/life-first.css`
- Modify: `src/life-first/personal-chronology.css`
- Modify: `src/life-first/visitor-path.css`
- Modify: `src/global-nav.css` only if QA finds focus/overlap defects.

**Interfaces:**
- Consumes: final Slice 1 DOM.
- Produces: stable mobile/desktop visual system with no horizontal overflow, focus overlap or avoidable layout shift.

- [ ] **Step 1: Audit fixed/sticky overlap**

Check hero actions, disclosure summaries, visitor-path controls and Companion FAB against navigation at 320, 375, 390, 430, 768, 1024 and desktop widths.

- [ ] **Step 2: Enforce focus-visible and target-size rules**

Every new interactive control receives an obvious focus state. Do not remove browser focus outlines without an equal or stronger replacement.

- [ ] **Step 3: Stabilize media boxes**

Keep explicit aspect ratios/min-heights so lazy images do not cause large layout shifts. Avoid CSS that changes intrinsic space after image load.

- [ ] **Step 4: Review motion**

All nonessential transitions/animations are disabled under `prefers-reduced-motion: reduce`.

- [ ] **Step 5: Run build + complete AppDeploy E2E suite**

Run: `npm run build`; deploy candidate; run Tests 1–8.

Expected: all eight PASS; zero frontend/backend runtime errors.

- [ ] **Step 6: Inspect AppDeploy mobile and desktop screenshots**

Pass only if:

```text
first viewport is recognizably personal
one dominant visual object
three actions remain legible
no card/dashboard wall above story
no horizontal overflow
no fixed overlap
no broken images
chronology remains readable
visitor pathway does not look like a marketing survey
```

- [ ] **Step 7: Snapshot/commit**

Message: `style: harden Living Universe accessibility and pacing`

---

### Task 8: Production gate, rollback proof and GitHub snapshot

**Files:**
- Update/snapshot AppDeploy v101+ source into the established GitHub snapshot path/pattern used by prior releases.
- Update release documentation only after QA result is terminal.

**Interfaces:**
- Consumes: candidate AppDeploy version, Tests 1–8, QA screenshots, error logs.
- Produces: one applied production version and a traceable GitHub snapshot.

- [ ] **Step 1: Verify candidate status**

Use AppDeploy `get_app_status` until deployment is terminal. Treat `deployed_and_testing` as non-final.

- [ ] **Step 2: If any E2E job fails, inspect the actual run**

Use `get_e2e_qa_run_details` and fix the smallest cause. Maximum three autonomous redeploy attempts before escalating.

- [ ] **Step 3: Confirm zero runtime errors**

Frontend errors: 0.
Backend errors introduced by this slice: 0.
Network errors attributable to Slice 1: 0.

- [ ] **Step 4: Compare candidate screenshots against v100**

The candidate must be simpler in first-viewport hierarchy while retaining more usable depth after entry. A candidate that is technically green but visually more generic, emptier or more dashboard-like fails.

- [ ] **Step 5: Preserve rollback**

Record v100 (`1787007199307`) as the known-good rollback point before applying the candidate.

- [ ] **Step 6: Apply the final candidate and re-check status**

After application, repeat status/error/QA check on the applied version.

- [ ] **Step 7: Mirror final source and evidence into `7guard-io/7ya.io`**

Snapshot the applied source using the repository's established `appdeploy-live/<version>/` convention and record the AppDeploy version, E2E result and research-gate relationship.

- [ ] **Step 8: Commit final release evidence**

Message: `chore: snapshot research-backed Living Universe slice 1`

---

## Slice 1 definition of done

Slice 1 is complete only when all are true:

1. First viewport is a human introduction with one real visual and three clear intents.
2. The story remains first-person and chronological.
3. Media echo and Knowledge Commons remain attached to story context but no longer compete with the primary reading layer.
4. Visitor personalization is explicit, explainable, reversible and local-first.
5. Root locale semantics and JSON-LD are accurate.
6. AI Companion is optional, source-bounded and explicit about capability/limitations.
7. WCAG-oriented keyboard/focus/mobile checks pass.
8. Existing canonical-corpus, research, privacy and source-local metric guardrails remain intact.
9. AppDeploy E2E Tests 1–8 pass.
10. Mobile and desktop screenshot QA passes with no visual regression to generic/dashboard-heavy presentation.
11. Production error logs are clean.
12. Known-good v100 rollback remains recorded.

## Explicitly out of scope until this slice proves itself

- new AI model/provider work
- autonomous agent actions
- C2PA credential issuance
- `llms.txt`
- automated GEO rewriting
- inferred behavioral/sensitive personalization
- full archive redesign
- new institutional claims
- new total-reach aggregation

## Self-review

- **Spec coverage:** Human-first entry, chronology, progressive disclosure, visitor growth, multilingual behavior, provenance, optional AI and visual hierarchy are covered.
- **Research-gate coverage:** WCAG, Core Web Vitals discipline, semantic HTML, AI optionality, truthful structured data, local-first personalization, provenance and independent QA are covered.
- **No-placeholder scan:** No TBD/TODO/implement-later steps; deferred features are explicitly out of scope rather than placeholders.
- **Scope check:** This is intentionally Slice 1. AI Companion expansion, C2PA issuance and generative-search experiments are separate future features.
- **Type/interface check:** New `VisitorInterest` and `buildSeoGraph(locale,view)` interfaces are defined before consumption; existing chapter/media/knowledge interfaces are reused.
