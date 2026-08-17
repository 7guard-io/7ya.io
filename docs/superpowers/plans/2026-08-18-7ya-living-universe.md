# 7YA Living Universe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the validated AppDeploy v100 life-first homepage into the approved 7YA Living Universe: a cinematic, multilingual, source-aware personal experience that remains accessible, fast, semantically machine-readable and explicitly human-controlled in the AI era.

**Architecture:** Keep AppDeploy v100 (`697a008fddc309b142`, baseline `1787007199307`) as the runtime baseline and preserve the existing canonical corpus, Knowledge Commons, media echoes, StartOn, research, creation and archive systems. Refactor the homepage into small focused units: a minimal human entry, a semantic/cinematic chapter renderer, explicit visitor-path emphasis, stable room navigation and a machine-discovery/provenance contract. Visible AI remains secondary; the existing 7YA Companion may remain available after the first screen but must not become the primary interface.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, CSS, lucide-react, AppDeploy E2E QA, schema.org JSON-LD, WCAG 2.2 AA target.

## Global Constraints

- Baseline runtime: AppDeploy v100 / `1787007199307`; evolve it, do not rebuild from scratch.
- North star: **A life you enter. Knowledge you leave with.**
- First screen: one dominant authentic visual, `IGOR VEPRETSKI`, one concise first-person statement, and exactly three primary routes: story, now, build/create.
- Default journey: **Person → lived moment → expression → public echo → knowledge → action → visitor growth.**
- Real life first; documentary/owner/publisher media before generated/contextual illustration.
- No collages.
- No fabricated historical imagery or fabricated metrics.
- Social metrics remain attached to dated source objects; no unsupported total-reach aggregation.
- Hebrew, English and Russian remain first-class and must not silently differ in claim strength.
- Privacy boundary remains: do not turn children, partners or private third parties into narrative raw material.
- Knowledge Commons remains contextual and subordinate to the lived story.
- No new autonomous or privileged public AI assistant in this release; existing Companion stays secondary and user-invoked.
- AI-era research gate: `docs/research/2026-08-18-ai-era-web-design-research-gate.md` is normative.
- Target WCAG 2.2 AA for every changed surface.
- Core Web Vitals release budgets: LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 at p75; desktop and mobile assessed separately.
- Important narrative text must remain visible/crawlable HTML, not canvas-only, image-only or gesture-only content.
- Structured data must describe visible content accurately; no status inflation.
- `llms.txt` remains auxiliary identity/disambiguation support, never canonical content.
- Explicit personalization may change emphasis only; it must not change facts, hide the complete chronology or infer vulnerability covertly.
- Every changed interaction requires keyboard access, visible focus and reduced-motion behavior.
- AI-generated code does not bypass build, contract, E2E, visual, accessibility, security or provenance verification.
- Preserve exact runtime provenance: do not merge historical PR #293; do not assume older AppDeploy snapshots equal v100.

## File Structure

### Create
- `src/life-first/living-universe-contract.ts` — shared room, visitor-path and provenance types/data.
- `src/life-first/ChapterStage.tsx` — one cinematic chapter renderer; owns no canonical data.
- `src/life-first/VisitorPath.tsx` — explicit, reversible session-level emphasis selection.
- `src/life-first/LivingUniverseMeta.tsx` — homepage machine-discovery contract and accurate JSON-LD updates.
- `src/life-first/living-universe.css` — composition and responsive rules specific to the new experience.
- `scripts/check-living-universe.mjs` — deterministic local contract checks runnable without a browser.

### Modify
- `package.json` — add `check:living` and a combined verification script.
- `tests/tests.txt` — extend AppDeploy E2E acceptance coverage for the approved Living Universe and research gate.
- `index.html` — align static metadata/JSON-LD with visible identity and release; preserve stable fallback metadata.
- `src/App.tsx` — mount LivingUniverseMeta on home and keep Companion secondary.
- `src/GlobalNav.tsx` — change primary homepage navigation to LIFE / NOW / IMPACT / STARTON / THINK / CREATE / ARCHIVE semantics while preserving language and utility navigation.
- `src/life-first/LifeFirstHero.tsx` — minimal three-route human entry.
- `src/life-first/LifeFirstHome.tsx` — coherent room composition and anchor order.
- `src/life-first/PersonalChronology.tsx` — keep canonical/fallback data mapping but delegate chapter rendering to ChapterStage and attach provenance/path metadata.
- `src/life-first/personal-chronology.css` — remove duplicated chapter layout now owned by `living-universe.css`; retain data-module-specific styles.
- `src/life-first/life-first.css` — constrain legacy styles so they do not compete with the Living Universe layer.
- `src/StoryCompanion.tsx` / `src/story-companion.css` only if required to guarantee the Companion is not visible/primary in the first viewport.

### Preserve unless a failing test proves change is necessary
- canonical corpus APIs and admin write guard
- `KnowledgeLensCard` semantics
- `MediaEchoCluster` source-local metrics
- StartOn/research data models
- creator/growth backend flows

---

### Task 1: Lock the Living Universe acceptance contract before visual implementation

**Files:**
- Create: `scripts/check-living-universe.mjs`
- Modify: `package.json`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: current v100 source tree.
- Produces: `npm run check:living`; AppDeploy E2E requirements for all later tasks.

- [ ] **Step 1: Add failing deterministic source-contract checks**

Create `scripts/check-living-universe.mjs` with checks that intentionally fail on v100 until later tasks land:

```js
import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const required = (condition, message) => {
  if (!condition) throw new Error(message);
};

const home = read('src/life-first/LifeFirstHome.tsx');
const hero = read('src/life-first/LifeFirstHero.tsx');
const app = read('src/App.tsx');
const index = read('index.html');

required(hero.includes("'#life-chronology'") || hero.includes('"#life-chronology"'), 'Hero must route to life chronology');
required(hero.includes("'#right-now'") || hero.includes('"#right-now"'), 'Hero must route to NOW');
required(hero.includes("pageHref('create'") || hero.includes('pageHref("create"'), 'Hero must route to Create');
required(home.includes("id='living-universe'") || home.includes('id="living-universe"'), 'Living Universe root missing');
required(home.includes('VisitorPath'), 'Explicit VisitorPath missing');
required(app.includes('LivingUniverseMeta'), 'Machine-discovery contract missing');
required(index.includes('application/ld+json'), 'Static JSON-LD fallback missing');
required(!hero.includes('counter') && !hero.includes('metrics'), 'Hero may not open with counters/metrics');
console.log('Living Universe source contract PASS');
```

- [ ] **Step 2: Wire the check and prove it is red on the v100 baseline**

Update `package.json` scripts:

```json
{
  "check:living": "node scripts/check-living-universe.mjs",
  "verify:living": "npm run check:living && npm run build"
}
```

Run:

```bash
npm run check:living
```

Expected: **FAIL** with at least `Living Universe root missing` or `Explicit VisitorPath missing`.

- [ ] **Step 3: Extend `tests/tests.txt` from five to eight acceptance tests**

Preserve all five existing tests and add:

```text
## Test 6 - Living Universe opens with one human story and three routes
Viewport: desktop + mobile
Steps:
1. Open ?lang=he at the top of the page.
2. Verify there is one dominant authentic visual, IGOR VEPRETSKI, one concise first-person statement and exactly three primary routes: story, now, build/create.
3. Verify no counters, archive grids, knowledge indexes or AI chat panel occupy the first viewport.
4. Verify the three routes resolve to #life-chronology, #right-now and the Create route.
Expected: A visitor meets a person before systems, metrics or AI.

## Test 7 - Semantic, provenance and visitor-control contract
Viewport: desktop
Steps:
1. Inspect at least one owner-archive chapter, one publisher-copy chapter and one chapter without documentary imagery.
2. Verify provenance is machine-readable and visitor-visible only in compact human language, never as backend jargon.
3. Select one Visitor Path topic, verify matching chapters receive emphasis but all chapters remain available.
4. Reset Visitor Path and verify the neutral chronology returns.
5. Verify the selection is local/session state and no login or personal data is required.
Expected: Provenance is explicit, personalization is reversible and facts do not change.

## Test 8 - AI-era accessibility, semantic and performance gate
Viewport: mobile + desktop
Steps:
1. Navigate the hero, room navigation, Visitor Path and one chapter using keyboard only; verify visible focus and no keyboard trap.
2. Enable reduced motion and verify the same content/actions remain available without motion dependence.
3. Verify the homepage exposes valid Person/WebSite/ProfilePage structured data matching visible content.
4. Verify important chapter text exists as selectable HTML text.
5. Verify visual QA reports 0 horizontal overflow, 0 fixed overlap and 0 broken images.
6. Record LCP, INP and CLS; release passes only when p75 targets are LCP <=2.5s, INP <=200ms and CLS <=0.1 for both mobile and desktop datasets when field data are available; use lab evidence as provisional evidence where p75 field data do not yet exist.
Expected: The cinematic experience remains usable, machine-readable and within the declared performance budgets.
```

- [ ] **Step 4: Commit the red contract**

```bash
git add scripts/check-living-universe.mjs package.json tests/tests.txt
git commit -m "test: lock Living Universe acceptance contract"
```

---

### Task 2: Introduce a semantic/provenance contract without changing canonical facts

**Files:**
- Create: `src/life-first/living-universe-contract.ts`
- Modify: `src/life-first/PersonalChronology.tsx`

**Interfaces:**
- Produces:
  - `type MediaProvenance = 'documentary' | 'owner-archive' | 'publisher-copy' | 'contextual' | 'generated' | 'unknown'`
  - `type VisitorTopic = 'belonging' | 'family' | 'service' | 'creation' | 'opportunity' | 'public-impact' | 'research' | 'meaning'`
  - `roomAnchors` used by navigation and home composition.
  - `provenanceLabel(state, locale)` returning short human copy.

- [ ] **Step 1: Add the focused contract module**

```ts
import type {Locale} from '../locale';

export type MediaProvenance =
  | 'documentary'
  | 'owner-archive'
  | 'publisher-copy'
  | 'contextual'
  | 'generated'
  | 'unknown';

export type VisitorTopic =
  | 'belonging'
  | 'family'
  | 'service'
  | 'creation'
  | 'opportunity'
  | 'public-impact'
  | 'research'
  | 'meaning';

export const roomAnchors = {
  life: '#life-chronology',
  now: '#right-now',
  impact: '#impact',
  starton: '#starton',
  think: '#think',
  create: '#create-room',
  archive: '#deep-archive'
} as const;

const labels: Record<Locale, Record<MediaProvenance, string>> = {
  he: {documentary:'תיעוד מקור', 'owner-archive':'הארכיון האישי', 'publisher-copy':'מקור תקשורתי', contextual:'המחשה', generated:'נוצר בעזרת AI', unknown:'מקור חזותי לא מסווג'},
  en: {documentary:'Documentary source', 'owner-archive':'Personal archive', 'publisher-copy':'Publisher source', contextual:'Contextual visual', generated:'AI-generated', unknown:'Unclassified visual source'},
  ru: {documentary:'Документальный источник', 'owner-archive':'Личный архив', 'publisher-copy':'Источник издателя', contextual:'Контекстная иллюстрация', generated:'Создано с помощью AI', unknown:'Источник не классифицирован'}
};

export const provenanceLabel = (state: MediaProvenance, locale: Locale) => labels[locale][state];
```

- [ ] **Step 2: Extend the chapter model explicitly**

Add to `Chapter`:

```ts
provenance: MediaProvenance;
sourceUrl?: string;
visitorTopics: VisitorTopic[];
```

Map existing chapters conservatively:

```ts
origin       -> unknown
service      -> owner-archive
twenties     -> owner-archive
return       -> publisher-copy
voice        -> owner-archive
fatherhood   -> unknown
break        -> owner-archive
culture      -> owner-archive
research     -> documentary
now          -> owner-archive
```

Do not infer a stronger provenance class from an unknown backend event. For corpus-derived media without an explicit class use `unknown`.

- [ ] **Step 3: Add visitor topics without changing chronology order**

Use at least:

```ts
origin: ['belonging','opportunity']
service: ['service','public-impact']
fatherhood: ['family','meaning']
return: ['opportunity','belonging']
voice: ['public-impact']
culture: ['creation']
research: ['research','meaning']
now: ['public-impact','creation','research']
```

- [ ] **Step 4: Run build; preserve canonical corpus behavior**

```bash
npm run build
```

Expected: PASS. No existing corpus event IDs, research statuses, metrics or source URLs change.

- [ ] **Step 5: Commit**

```bash
git add src/life-first/living-universe-contract.ts src/life-first/PersonalChronology.tsx
git commit -m "feat: add Living Universe semantic provenance contract"
```

---

### Task 3: Rebuild the first viewport and room navigation around human intent

**Files:**
- Modify: `src/life-first/LifeFirstHero.tsx`
- Modify: `src/GlobalNav.tsx`
- Create: `src/life-first/living-universe.css`
- Modify: `src/life-first/life-first.css`

**Interfaces:**
- Consumes: `roomAnchors` from Task 2.
- Produces: exactly three first-screen routes and stable room anchors.

- [ ] **Step 1: Make the source contract fail only on remaining missing pieces**

Run:

```bash
npm run check:living
```

Expected: still FAIL for missing Living Universe root / VisitorPath / metadata, but no failure for incorrect story route after this task is complete.

- [ ] **Step 2: Replace the hero action model with three routes**

The hero keeps the authentic current image and first-person identity, but the visible action set becomes:

```ts
const actions = {
  he: [
    ['לחיות את הסיפור','#life-chronology'],
    ['מה קורה עכשיו','#right-now'],
    ['לבנות משהו יחד',pageHref('create','he')]
  ],
  en: [
    ['Experience the story','#life-chronology'],
    ['See what is happening now','#right-now'],
    ['Build something together',pageHref('create','en')]
  ],
  ru: [
    ['Прожить историю','#life-chronology'],
    ['Что происходит сейчас','#right-now'],
    ['Создать что-то вместе',pageHref('create','ru')]
  ]
};
```

Keep the first-person statement concise enough that the first viewport is visually led by the person and image, not a biography paragraph.

- [ ] **Step 3: Change GlobalNav primary semantics**

Desktop home navigation uses:

```text
LIFE · NOW · IMPACT · STARTON · THINK · CREATE · ARCHIVE
```

Use localized accessible labels while allowing these compact English room names as visual identifiers. Existing Media/Music/Speaker/Blog/Evidence utilities remain in the expandable secondary navigation; do not delete routes.

- [ ] **Step 4: Add cinematic-but-readable layout rules**

`living-universe.css` must enforce:

```css
.lu-entry { min-height: calc(100svh - var(--nav-height,72px)); }
.lu-primary-actions { display:grid; gap:.75rem; }
.lu-primary-actions a:focus-visible,
.lu-room-nav a:focus-visible { outline:3px solid currentColor; outline-offset:4px; }
@media (max-width: 900px) {
  .lu-entry { min-height:auto; }
  .lu-primary-actions { grid-template-columns:1fr; }
}
@media (prefers-reduced-motion: reduce) {
  .living-universe * { scroll-behavior:auto!important; animation:none!important; transition:none!important; }
}
```

Do not add autoplay video or scroll-jacking.

- [ ] **Step 5: Build and commit**

```bash
npm run build
git add src/life-first/LifeFirstHero.tsx src/GlobalNav.tsx src/life-first/living-universe.css src/life-first/life-first.css
git commit -m "feat: make 7YA entry human-first and room-led"
```

---

### Task 4: Convert chronology cards into cinematic, semantic chapter stages

**Files:**
- Create: `src/life-first/ChapterStage.tsx`
- Modify: `src/life-first/PersonalChronology.tsx`
- Modify: `src/life-first/personal-chronology.css`
- Modify: `src/life-first/living-universe.css`

**Interfaces:**
- `ChapterStage` consumes one already-resolved `Chapter`, locale, index and optional emphasis state.
- It does not fetch canonical corpus data.
- It renders MediaEchoCluster and KnowledgeLensCard as subordinate contextual expanders.

- [ ] **Step 1: Define the renderer boundary**

`ChapterStage` props:

```ts
type ChapterStageProps = {
  chapter: Chapter;
  locale: Locale;
  index: number;
  emphasized: boolean;
};
```

Export the `Chapter` type from `PersonalChronology.tsx` or move it to `living-universe-contract.ts`; choose one location and import it consistently.

- [ ] **Step 2: Render one dominant media/story object per chapter**

Use semantic structure:

```tsx
<article id={`life-${chapter.id}`} className="lu-chapter" data-provenance={chapter.provenance} data-topics={chapter.visitorTopics.join(' ')}>
  <figure className="lu-chapter-media">...</figure>
  <div className="lu-chapter-story">
    <header>...</header>
    <h3>...</h3>
    <p>...</p>
    <small className="lu-provenance">{provenanceLabel(chapter.provenance, locale)}</small>
    ...links...
    <details className="lu-context"><summary>Hear / watch this chapter</summary><MediaEchoCluster ... /></details>
    <details className="lu-context"><summary>Learn from this</summary><KnowledgeLensCard ... /></details>
  </div>
</article>
```

If a chapter has no documentary image, keep a designed source object; never manufacture a childhood/family photograph.

- [ ] **Step 3: Preserve content and metrics exactly**

Do not rewrite canonical metrics or research statuses in this task. The `MediaEchoCluster` and Knowledge Lens data remain source-of-truth components.

- [ ] **Step 4: Mobile rule: one dominant object at a time**

At <=900px, each chapter becomes a single column with media before prose. No nested horizontal carousels. Context panels stack vertically.

- [ ] **Step 5: Verify source contract and build**

```bash
npm run check:living
npm run build
```

Expected: contract may still fail only for missing VisitorPath or LivingUniverseMeta; build PASS.

- [ ] **Step 6: Commit**

```bash
git add src/life-first/ChapterStage.tsx src/life-first/PersonalChronology.tsx src/life-first/personal-chronology.css src/life-first/living-universe.css
git commit -m "feat: render life chronology as cinematic chapter stages"
```

---

### Task 5: Add explicit, reversible visitor-path emphasis

**Files:**
- Create: `src/life-first/VisitorPath.tsx`
- Modify: `src/life-first/PersonalChronology.tsx`
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify: `src/life-first/living-universe.css`

**Interfaces:**
- `VisitorPath` emits `VisitorTopic | null`.
- Storage: `sessionStorage` key `7ya.visitor.path.v1` only.
- No identity, profile, analytics or backend write is required.

- [ ] **Step 1: Implement explicit topic selection**

Use localized labels for the eight `VisitorTopic` values and expose neutral copy equivalent to “What in this met you?”.

```ts
const storageKey = '7ya.visitor.path.v1';
const [topic,setTopic] = useState<VisitorTopic|null>(() => {
  try { return sessionStorage.getItem(storageKey) as VisitorTopic | null; }
  catch { return null; }
});
```

On change, update session storage. On reset, remove the key.

- [ ] **Step 2: Make emphasis transparent and non-destructive**

When a topic is active:

- matching chapters receive `is-emphasized`;
- non-matching chapters remain fully visible and navigable;
- chronology order never changes;
- copy states that this changes emphasis only.

- [ ] **Step 3: Wire through `LifeFirstHome` / `PersonalChronology`**

Prefer state ownership in `LifeFirstHome`:

```tsx
const [visitorTopic,setVisitorTopic] = useState<VisitorTopic|null>(null);
<VisitorPath value={visitorTopic} onChange={setVisitorTopic}/>
<PersonalChronology visitorTopic={visitorTopic}/>
```

Synchronize the initial state with `sessionStorage` in one place only; avoid two competing stores.

- [ ] **Step 4: Verify reset and privacy behavior**

Manually test:

```text
select belonging -> origin/StartOn visually emphasized -> all chapters remain -> refresh same tab keeps selection -> reset clears -> new session starts neutral
```

- [ ] **Step 5: Commit**

```bash
npm run build
git add src/life-first/VisitorPath.tsx src/life-first/PersonalChronology.tsx src/life-first/LifeFirstHome.tsx src/life-first/living-universe.css
git commit -m "feat: add reversible visitor-path emphasis"
```

---

### Task 6: Add AI-ready semantic metadata without making AI the interface

**Files:**
- Create: `src/life-first/LivingUniverseMeta.tsx`
- Modify: `src/App.tsx`
- Modify: `index.html`

**Interfaces:**
- `LivingUniverseMeta` receives locale only.
- Updates one script node with id `7ya-living-universe-jsonld`; never emits claims not already visible/source-backed.

- [ ] **Step 1: Implement a bounded homepage graph**

Use only accurate objects:

```ts
const graph = {
  '@context':'https://schema.org',
  '@graph':[
    {'@type':'Person','@id':'https://7ya.io/#igor', name:'Igor Vepretski', url:'https://7ya.io/'},
    {'@type':'WebSite','@id':'https://7ya.io/#website', url:'https://7ya.io/', name:'7YA.IO', inLanguage:['he','en','ru']},
    {'@type':'ProfilePage','@id':'https://7ya.io/#profile', url:'https://7ya.io/', mainEntity:{'@id':'https://7ya.io/#igor'}, isPartOf:{'@id':'https://7ya.io/#website'}}
  ]
};
```

Then preserve only existing source-backed `sameAs`, StartOn relationship and other properties whose visible equivalents remain on the site. Remove stale or unsupported labels rather than strengthening them.

- [ ] **Step 2: Reconcile the static fallback in `index.html`**

Update `dateModified`, release/build markers and visible-role language so static fallback and runtime metadata do not contradict the current page. Keep the JSON-LD graph small and truthful.

- [ ] **Step 3: Mount metadata only for home**

In `App.tsx`:

```tsx
{view==='home' && <LivingUniverseMeta locale={locale}/>} 
```

Do not mount an AI assistant or add special “GEO schema”.

- [ ] **Step 4: Verify HTML semantics**

Manual checks:

```text
- h1 occurs once on the homepage
- chapter titles are h3 under a chronology h2
- navigation uses <nav>
- chapters use <article>
- media uses <figure>/<img alt>
- important narrative copy is selectable text
- JSON-LD visible claims match the page
```

- [ ] **Step 5: Commit**

```bash
npm run build
git add src/life-first/LivingUniverseMeta.tsx src/App.tsx index.html
git commit -m "feat: add semantic discovery contract for Living Universe"
```

---

### Task 7: Recompose the homepage into the seven-room Living Universe

**Files:**
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify: `src/life-first/living-universe.css`
- Modify legacy section components only to add stable anchor IDs if they do not already expose them.

**Interfaces:**
- Produces stable room order: LIFE → NOW → IMPACT → STARTON → THINK → CREATE → ARCHIVE.
- Reuses existing components; no duplicate domain models.

- [ ] **Step 1: Wrap the homepage in the canonical root**

```tsx
<main id="living-universe" className="life-first-home living-universe" dir={dir}>
```

- [ ] **Step 2: Establish the canonical room order**

Recommended composition:

```tsx
<LifeFirstHero/>
<VisitorPath .../>
<PersonalChronology .../>        // LIFE
<RightNow/>                      // NOW
<InfluenceUniverse mode="cinematic"/> // IMPACT
<PublicActionStage/>             // contextual inside IMPACT, not a competing homepage thesis
<StartOnRoom/>                   // STARTON
<ResearchRoom/>                  // THINK
<KnowledgeCommons/>              // contextual extension of THINK/LIFE
<CreateRoom/>                    // CREATE
<LongformVoice/>                 // contextual creation/public voice
<PersonalArchive/>
<DeepArchiveRiver/>              // ARCHIVE
<UserHandoff/>
```

`LifeGeography`, `PostPortraitWall`, `WorldRooms` and `LifeScenes` must not all remain as independent homepage interruptions. Reuse their unique content by moving it into the nearest room or deep archive, or omit the duplicate surface while preserving its underlying route/data. Do not delete unique source records.

- [ ] **Step 3: Add stable IDs**

Ensure exact targets exist:

```text
#life-chronology
#right-now
#impact
#starton
#think
#create-room
#deep-archive
```

- [ ] **Step 4: Keep Companion secondary**

The Companion FAB must not be visible in the first viewport. Preserve its current public-source and privacy boundary. If CSS makes it appear earlier after the redesign, change only its reveal threshold/visibility behavior; do not expand its privileges.

- [ ] **Step 5: Make the deterministic contract green**

```bash
npm run check:living
npm run build
```

Expected: both PASS.

- [ ] **Step 6: Commit**

```bash
git add src/life-first/LifeFirstHome.tsx src/life-first/living-universe.css src/life-first/*.tsx src/StoryCompanion.tsx src/story-companion.css
git commit -m "feat: compose seven-room 7YA Living Universe"
```

Only stage files actually changed; do not use the wildcard if it would include unrelated edits.

---

### Task 8: Accessibility, visual, performance and provenance release gate

**Files:**
- Modify: `tests/tests.txt` only if observed QA reveals a missing assertion.
- Create/update release receipt after a validated deployment.
- Export/snapshot the exact applied AppDeploy source to GitHub using the repository's established provenance convention.

**Interfaces:**
- Produces: validated AppDeploy version, QA group, rollback version and immutable GitHub receipt.

- [ ] **Step 1: Run static verification**

```bash
npm run verify:living
```

Expected: PASS.

- [ ] **Step 2: Deploy a new AppDeploy version without overwriting the known rollback**

Record before deployment:

```text
baseline = v100 / 1787007199307
```

Deployment must create a new version. Do not mutate the historical v100 record.

- [ ] **Step 3: Run all eight AppDeploy E2E tests**

Required terminal state:

```text
8/8 PASS
frontend errors = 0
backend errors = 0 for changed/used paths
network errors = 0 for required first-party assets/endpoints
horizontal overflow = 0
fixed overlap = 0
broken images = 0
```

If any test fails, inspect the detailed QA run and fix the smallest failing surface; do not weaken the assertion unless it contradicts the approved spec/research gate.

- [ ] **Step 4: Perform manual accessibility checks**

Required:

```text
keyboard: hero -> room nav -> visitor path -> first chapter -> details -> links
Escape closes menus/dialogs
focus is visible
no keyboard trap
reduced-motion preserves all content and actions
images have meaningful alt text or are marked decorative
```

- [ ] **Step 5: Record performance evidence**

Record desktop and mobile LCP/INP/CLS evidence. If only lab data are available, label them **lab/provisional**, not p75 field data. Do not claim field Core Web Vitals success without field data.

- [ ] **Step 6: Inspect provenance and claim safety**

Sample at minimum:

```text
origin -> no fabricated childhood image
service -> owner archive
StartOn return -> publisher source
fatherhood -> no child imagery by default
research -> actual document / status remains non-peer-reviewed where applicable
public metrics -> source-local and dated
```

- [ ] **Step 7: Reconcile exact runtime provenance to GitHub**

Do not reuse the mislabeled historical PR #293. Export/snapshot the exact new AppDeploy version, compare it against the implementation branch and write a receipt containing:

```text
AppDeploy app id
applied version id and display version
QA group id
Git commit / branch
release marker
rollback version
known coverage limitations
```

- [ ] **Step 8: Run final verification before merge/publish claim**

```bash
npm run verify:living
```

Then inspect AppDeploy status one final time. Only after both are green may the release be described as complete.

- [ ] **Step 9: Commit receipt / merge tested SHA only**

```bash
git add docs/releases/<exact-living-universe-receipt>.md appdeploy-live/<exact-version>/
git commit -m "chore: record validated Living Universe release"
```

Merge only the exact SHA that produced the validated deployment.

---

## Self-review

### Spec coverage

- Human-first first viewport: Task 3.
- Life-first cinematic chronology: Tasks 2 and 4.
- Contextual media/public echo/knowledge: Task 4.
- Seven-room hierarchy and reduced homepage interruption count: Task 7.
- Explicit visitor growth/personalization: Task 5.
- Provenance and C2PA-ready classification: Tasks 2 and 8.
- AI-readable semantic structure / no GEO theater: Task 6.
- Existing Companion bounded and secondary: Tasks 3 and 7.
- WCAG 2.2 AA / reduced motion / keyboard: Tasks 3 and 8.
- Core Web Vitals budgets: Task 8.
- Multilingual equivalence: E2E Tests 4, 6, 7, 8.
- Canonical corpus, research-status and admin protection: existing Test 5 and Tasks 2/8.
- Source-local metrics / no inflated reach: existing Tests 2/5 and Task 8.
- AppDeploy/GitHub provenance reconciliation: Task 8.

### Placeholder scan

No TBD/TODO/“implement later” instructions remain. Future C2PA cryptographic verification is intentionally out of this release; only provenance-state compatibility is in scope.

### Type consistency

`MediaProvenance`, `VisitorTopic`, `roomAnchors` and `provenanceLabel` are defined in Task 2 and consumed consistently later. `VisitorPath` emits `VisitorTopic | null`; `PersonalChronology` consumes the same type. `LivingUniverseMeta` receives `Locale` only.

## Execution choice

The user has already approved execution and requested efficient completion after the academic gate. Use **Inline Execution** in this session unless a dedicated subagent runtime becomes available; preserve task boundaries and verification gates exactly as written.
