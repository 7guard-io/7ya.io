# 7YA Living Universe Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve AppDeploy v100 into the first production slice of the approved 7YA Living Universe: a low-complexity human-first entry, semantic and accessible narrative shell, explicit room model, accurate baseline structured data, and measurable visual/accessibility/performance gates without deleting the existing canon or domain systems.

**Architecture:** Keep the current React/Vite `life-first` implementation and canonical corpus as the source of truth. Add a small semantic Living Universe registry, simplify the hero, use progressive disclosure for secondary home layers, and extend existing metadata/Visual QA infrastructure rather than introducing a new framework. Deep provenance-aware object unification, AI-search object expansion, personalization, and the grounded AI companion remain separate later slices.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, existing CSS modules/files, AppDeploy E2E acceptance tests, existing `VisualInspector`, existing multilingual `locale` utilities. No new runtime dependency in this slice.

## Global Constraints

- Baseline is AppDeploy v100 (`1787007199307`); evolve it, do not replace it.
- North star: **A life you enter. Knowledge you leave with.**
- First visit remains unmistakably first-person and human, never dashboard-first or chat-first.
- AI is not primary navigation and no AI companion is added in this slice.
- No speculative GEO/AEO layer, mass-generated SEO pages, `llms.txt` dependency, or proprietary AI-discovery hack.
- Important meaning must exist in semantic DOM, not only animation, canvas, imagery, or CSS.
- Public core experience remains fully usable without AI.
- Hebrew, English, and Russian remain first-class and must preserve equivalent claim strength.
- Default mobile composition: one dominant narrative/media object per viewport wherever practical.
- Progressive disclosure protects the story from archive/analytics density.
- No collage.
- Real-life/source visuals remain primary; generated illustration may never impersonate documentary evidence.
- Do not expose private child/family information to deepen the story.
- Metrics remain source-local and dated; never fabricate total reach.
- Target WCAG 2.2 AA for public interaction.
- Respect `prefers-reduced-motion` and keyboard/focus order.
- Core Web Vitals budgets: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 at the 75th percentile when field data is available; use lab/QA proxies before sufficient field volume exists.
- No new analytics identity/profile collection in this slice.
- No new runtime dependency without a written justification and security review.
- AI-assisted code is not trusted because it builds; every task follows acceptance test -> smallest implementation -> build -> visual/E2E QA -> commit.

---

## File Structure

### Create

- `src/life-first/living-universe.ts` — one small canonical registry for the public Living Universe room IDs, anchor targets, and localized public labels/descriptions.
- `src/life-first/LivingDepth.tsx` — progressive-disclosure container for secondary evidence/archive layers already present on the home page.
- `src/site-structured-data.ts` — pure builders for conservative baseline `WebSite`, `Person`, and `ProfilePage` JSON-LD objects.

### Modify

- `src/life-first/LifeFirstHome.tsx` — compose primary narrative path and progressive secondary layers using existing components.
- `src/life-first/LifeFirstHero.tsx` — reduce first-screen complexity and expose exactly three primary paths.
- `src/life-first/WorldRooms.tsx` — consume the Living Universe registry rather than maintaining a second room list.
- `src/life-first/life-first.css` — low-complexity entry styling, focus states, depth disclosure, responsive one-object rhythm.
- `src/App.tsx` — set `html[lang]` / `dir`, inject/update conservative JSON-LD, preserve existing canonical/hreflang behavior.
- `src/VisualInspector.tsx` — add semantic/home-composition checks without transmitting data.
- `tests/tests.txt` — update first-visit acceptance criteria and add a dedicated research-gate foundation test.

### Explicitly unchanged in this slice

- Canonical corpus schema/client and canonical release semantics.
- `KnowledgeCommons` domain model.
- `MediaEchoCluster` evidence logic.
- Research publication-status logic.
- Social-control/admin write guard.
- Deep archive data.
- Any public partnership/institutional claim.

---

### Task 1: Lock the Living Universe room registry

**Files:**
- Create: `src/life-first/living-universe.ts`
- Modify: `src/life-first/WorldRooms.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Produces: `type LivingRoomId`, `type LivingRoom`, `livingRooms`, and `livingRoomById`.
- Consumes: existing locale union `'he' | 'en' | 'ru'` only; no React dependency in registry.

- [ ] **Step 1: Add a failing acceptance requirement for stable room identity**

Append this assertion to the new foundation test in `tests/tests.txt` before implementation:

```text
Verify the semantic Living Universe navigation exposes exactly seven stable public rooms in this order: LIFE, NOW, IMPACT, STARTON, THINK, CREATE, ARCHIVE, with working anchor/page targets and localized descriptions.
```

Expected before implementation: FAIL because the current room list uses `FEED / VOICE`, `LAB / RESEARCH`, and `ECHO / IMPACT` and has no shared canonical registry.

- [ ] **Step 2: Create the registry**

Create `src/life-first/living-universe.ts` with this interface and initial data shape:

```ts
export type LocalText = {he: string; en: string; ru: string};

export type LivingRoomId =
  | 'life'
  | 'now'
  | 'impact'
  | 'starton'
  | 'think'
  | 'create'
  | 'archive';

export type LivingRoom = {
  id: LivingRoomId;
  label: string;
  href: string;
  description: LocalText;
};

export const livingRooms: LivingRoom[] = [
  {id: 'life', label: 'LIFE', href: '#life-chronology', description: {
    he: 'החיים עצמם — לא קורות חיים.',
    en: 'The life itself — not a résumé.',
    ru: 'Сама жизнь — не резюме.'
  }},
  {id: 'now', label: 'NOW', href: '#right-now', description: {
    he: 'מה קורה עכשיו — בלי לחכות לארכיון.',
    en: 'What is happening now — before it becomes archive.',
    ru: 'Что происходит сейчас — до того, как станет архивом.'
  }},
  {id: 'impact', label: 'IMPACT', href: '#echo', description: {
    he: 'איך תוכן יצא לעולם, הועבר וחזר כהד ציבורי.',
    en: 'How content travelled, was redistributed and returned as public echo.',
    ru: 'Как контент вышел в мир, распространился и вернулся общественным эхом.'
  }},
  {id: 'starton', label: 'STARTON', href: '#starton-return', description: {
    he: 'החזרה לשכונה והמשימה להפוך סיכון להזדמנות.',
    en: 'The return to the neighborhood and the work of turning risk into opportunity.',
    ru: 'Возвращение в район и работа по превращению риска в возможность.'
  }},
  {id: 'think', label: 'THINK', href: '#lab-research', description: {
    he: 'מחקר, שאלות, מסגרות חשיבה ומקום מפורש לאי־ודאות.',
    en: 'Research, questions, frameworks and explicit room for uncertainty.',
    ru: 'Исследования, вопросы, модели и явное место для неопределённости.'
  }},
  {id: 'create', label: 'CREATE', href: '#create', description: {
    he: 'מוזיקה, וידאו, כתיבה ויצירה משותפת.',
    en: 'Music, video, writing and creation with others.',
    ru: 'Музыка, видео, тексты и совместное творчество.'
  }},
  {id: 'archive', label: 'ARCHIVE', href: '#deep-archive', description: {
    he: 'המקורות, השכבות והזיכרון הציבורי המלא.',
    en: 'Sources, layers and the full public-memory archive.',
    ru: 'Источники, слои и полный архив публичной памяти.'
  }}
];

export const livingRoomById = new Map(livingRooms.map(room => [room.id, room] as const));
```

- [ ] **Step 3: Refactor `WorldRooms.tsx` to consume `livingRooms`**

Remove its local `rooms` and `descriptions` arrays. Map `livingRooms`, localize with `room.description[locale]`, preserve the current semantic `<section>` + `<nav>` structure, and keep all visible labels stable.

- [ ] **Step 4: Build and run the room acceptance check**

Run:

```bash
npm run build
```

Expected: PASS with no TypeScript/Vite error. Then run the AppDeploy E2E suite; the new room assertion must PASS in HE and the existing multilingual test must remain green.

- [ ] **Step 5: Commit**

```bash
git add src/life-first/living-universe.ts src/life-first/WorldRooms.tsx tests/tests.txt
git commit -m "feat: define Living Universe room registry"
```

---

### Task 2: Simplify the first viewport to three human choices

**Files:**
- Modify: `src/life-first/LifeFirstHero.tsx`
- Modify: `src/life-first/life-first.css`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: existing `useLocale`, existing real hero image and fallback source.
- Produces: exactly three hero actions targeting story, now, and creation.

- [ ] **Step 1: Update the first-visit acceptance test so the old hero fails**

Replace the hero-action portion of Test 1 with:

```text
Verify the hero contains one dominant real-life visual, IGOR VEPRETSKI, one concise first-person statement, and exactly three primary choices: start the life story (#life-chronology), see what is happening now (#right-now), and create/build together (#create). Verify no metric cards, room grid, AI/chat prompt, résumé list, or route-chip strip appears in the first viewport.
```

Expected before implementation: FAIL because the current hero has two actions plus a route-chip strip and note.

- [ ] **Step 2: Replace the route strip and two-action nav with three localized actions**

In `LifeFirstHero.tsx`, preserve the authentic source image and first-person narrative, remove `.lf-hero-route` and `.lf-hero-note`, and define action labels in the existing locale copy object:

```ts
story: {href: '#life-chronology'},
now: {href: '#right-now'},
create: {href: '#create'}
```

Rendered structure:

```tsx
<nav className="lf-hero-actions" aria-label={localizedJourneyLabel}>
  <a href="#life-chronology">{c.story}<span>↓</span></a>
  <a href="#right-now">{c.now}<span>↘</span></a>
  <a href="#create">{c.create}<span>↘</span></a>
</nav>
```

Do not add counters, tags, a chat input, or a second hero visual.

- [ ] **Step 3: Make hero media explicitly performance-aware**

Use the current real image but add:

```tsx
<img
  src={image}
  alt="Igor Vepretski · public-life archive"
  loading="eager"
  decoding="async"
  fetchPriority="high"
  onError={fallback}
  referrerPolicy="no-referrer"
/>
```

- [ ] **Step 4: Reduce first-screen visual complexity in CSS**

Delete obsolete `.lf-hero-route` / `.lf-hero-note` layout rules if present. Keep three action targets readable, but on mobile stack them vertically and ensure each target is at least 44px tall. Add a visible keyboard state:

```css
.life-first-home a:focus-visible,
.life-first-home button:focus-visible {
  outline: 3px solid var(--lf-green);
  outline-offset: 4px;
}
```

Do not add animation beyond existing transitions. Preserve the existing `prefers-reduced-motion` block.

- [ ] **Step 5: Build and visually verify desktop + mobile**

Run:

```bash
npm run build
```

Then use AppDeploy preview/E2E with desktop and mobile screenshots. Expected: Test 1 PASS, no horizontal overflow, hero remains the only dominant first-viewport media object, and all three actions are visible/usable.

- [ ] **Step 6: Commit**

```bash
git add src/life-first/LifeFirstHero.tsx src/life-first/life-first.css tests/tests.txt
git commit -m "feat: simplify Living Universe entry"
```

---

### Task 3: Move secondary evidence density behind progressive disclosure

**Files:**
- Create: `src/life-first/LivingDepth.tsx`
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify: `src/life-first/life-first.css`
- Modify: `src/VisualInspector.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- `LivingDepth` consumes `children: ReactNode` and the current locale.
- It produces a native `<details>` disclosure with localized summary and an id `living-depth`.
- The primary home path remains directly visible and crawlable in DOM; secondary components remain rendered inside native disclosure, not duplicated elsewhere.

- [ ] **Step 1: Add a failing density/progressive-disclosure assertion**

Add to the foundation test:

```text
Verify the default home reading path directly presents Hero -> Personal Chronology -> World Rooms -> Right Now -> StartOn -> Research -> Knowledge Commons -> Create -> User Handoff. Verify influence analytics, public-action stage, geography, post wall, life scenes, longform index, personal archive and deep archive are grouped under one native secondary-depth disclosure instead of each competing as a default top-level section.
```

Expected before implementation: FAIL because all current modules are default top-level sections.

- [ ] **Step 2: Create `LivingDepth.tsx`**

Use native HTML, no dependency:

```tsx
import type {ReactNode} from 'react';
import {useLocale} from '../locale';

type Props = {children: ReactNode};

const copy = {
  he: {kicker: 'DEEPER / EVIDENCE', title: 'לפתוח את כל שכבות הראיות, ההשפעה והארכיון'},
  en: {kicker: 'DEEPER / EVIDENCE', title: 'Open every evidence, impact and archive layer'},
  ru: {kicker: 'DEEPER / EVIDENCE', title: 'Открыть все слои доказательств, влияния и архива'}
} as const;

export default function LivingDepth({children}: Props) {
  const {locale} = useLocale();
  const c = copy[locale];
  return (
    <details className="lf-depth" id="living-depth">
      <summary>
        <span dir="ltr">{c.kicker}</span>
        <strong>{c.title}</strong>
        <b aria-hidden="true">＋</b>
      </summary>
      <div className="lf-depth-body">{children}</div>
    </details>
  );
}
```

- [ ] **Step 3: Recompose `LifeFirstHome.tsx`**

Keep these default-visible components, in this exact order:

```tsx
<LifeFirstHero />
<PersonalChronology />
<WorldRooms />
<RightNow />
<StartOnRoom />
<ResearchRoom />
<KnowledgeCommons />
<CreateRoom />
<UserHandoff />
```

Wrap these existing components in one `LivingDepth` after `UserHandoff`:

```tsx
<LivingDepth>
  <InfluenceUniverse mode="cinematic" />
  <PublicActionStage />
  <LifeGeography />
  <PostPortraitWall />
  <LifeScenes />
  <LongformVoice />
  <PersonalArchive />
  <DeepArchiveRiver />
</LivingDepth>
```

Do not delete component code, source data, or existing anchors. The room links to hidden anchors remain valid; browser activation of an anchor inside a closed `<details>` must be manually tested. If the browser/app does not reliably open the ancestor disclosure, add one small hash listener in `LivingDepth` that sets `open=true` only when the target is inside the disclosure.

- [ ] **Step 4: Style the disclosure as an editorial gateway, not a dashboard**

Add CSS with a single strong summary row, no grid of counters. The closed state must occupy less than ~180px on mobile and preserve the page rhythm. The opened state must not introduce horizontal overflow.

- [ ] **Step 5: Update `VisualInspector` expected journey order**

Change `orderIds` to reflect only direct-default sections plus `living-depth`:

```ts
const orderIds = [
  'you-are-here',
  'life-chronology',
  'world-rooms',
  'right-now',
  'starton-return',
  'lab-research',
  'knowledge-commons',
  'create',
  'your-room',
  'living-depth'
];
```

Do not remove existing overflow, broken-image, repeated-image, fixed-overlap, touch-target, sparse-section, or archive checks.

- [ ] **Step 6: Build, E2E and anchor-test**

Run:

```bash
npm run build
```

Then verify on desktop and mobile:

```text
#echo -> opens/lands on the hidden impact target
#deep-archive -> opens/lands on deep archive
#life-chronology -> remains direct and immediate
#right-now -> remains direct and immediate
```

Expected: all existing canonical/research/admin tests PASS; the updated journey order reports PASS; no broken anchors.

- [ ] **Step 7: Commit**

```bash
git add src/life-first/LivingDepth.tsx src/life-first/LifeFirstHome.tsx src/life-first/life-first.css src/VisualInspector.tsx tests/tests.txt
git commit -m "feat: add progressive Living Universe depth"
```

---

### Task 4: Add conservative canonical structured data and document language state

**Files:**
- Create: `src/site-structured-data.ts`
- Modify: `src/App.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Produces: `buildSiteStructuredData(locale: Locale, canonical: string)` returning a JSON-serializable graph.
- Consumes: the existing `Locale` type and existing view canonical URL.
- No API call, user data, analytics identifier, or dynamic inference.

- [ ] **Step 1: Add a failing machine-legibility assertion**

Add to the foundation test:

```text
Inspect the rendered document head and verify one `script#7ya-structured-data[type="application/ld+json"]` exists. It must identify the canonical page as a ProfilePage/WebSite about Igor Vepretski, use only visible/verified identity claims, preserve the current canonical URL, and contain no fabricated award, academic rank, office, institutional endorsement or total-reach metric. Verify `html[lang]` and `html[dir]` match he/en/ru state.
```

Expected before implementation: FAIL because current `App.tsx` updates meta/canonical/hreflang but does not add this JSON-LD or explicit document language state in the shown effect.

- [ ] **Step 2: Create `site-structured-data.ts`**

Use only conservative entities:

```ts
import type {Locale} from './locale';

export function buildSiteStructuredData(locale: Locale, canonical: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://7ya.io/#website',
        url: 'https://7ya.io/',
        name: '7YA',
        inLanguage: locale
      },
      {
        '@type': 'Person',
        '@id': 'https://7ya.io/#igor-vepretski',
        name: 'Igor Vepretski',
        url: 'https://7ya.io/',
        sameAs: [
          'https://www.instagram.com/igor.vepretski/',
          'https://www.linkedin.com/in/vepretski/',
          'https://www.youtube.com/@IgorVepretski'
        ]
      },
      {
        '@type': 'ProfilePage',
        '@id': `${canonical}#profile`,
        url: canonical,
        isPartOf: {'@id': 'https://7ya.io/#website'},
        mainEntity: {'@id': 'https://7ya.io/#igor-vepretski'},
        inLanguage: locale
      }
    ]
  };
}
```

Do not add job titles or organizational relationships in this foundation builder unless they are already represented visibly and verified in the canonical page object.

- [ ] **Step 3: Inject/update a single JSON-LD script from the existing SEO effect**

In `App.tsx`, after deriving `values`:

```ts
document.documentElement.lang = locale;
document.documentElement.dir = locale === 'he' ? 'rtl' : 'ltr';

let script = document.querySelector<HTMLScriptElement>('#7ya-structured-data');
if (!script) {
  script = document.createElement('script');
  script.id = '7ya-structured-data';
  script.type = 'application/ld+json';
  document.head.appendChild(script);
}
script.textContent = JSON.stringify(buildSiteStructuredData(locale, values.canonical));
```

Import the pure builder. Preserve all existing title, description, OpenGraph, canonical and hreflang updates.

- [ ] **Step 4: Build and inspect HE/EN/RU output**

Run:

```bash
npm run build
```

Then E2E-check all three locale query states. Expected: exactly one JSON-LD script each time, correct locale/canonical, no duplicate script after switching locale, and Test 5 canonical-corpus/admin safety remains PASS.

- [ ] **Step 5: Commit**

```bash
git add src/site-structured-data.ts src/App.tsx tests/tests.txt
git commit -m "feat: add conservative site structured data"
```

---

### Task 5: Turn accessibility, visual hierarchy and loading discipline into release checks

**Files:**
- Modify: `src/VisualInspector.tsx`
- Modify: `src/life-first/life-first.css`
- Modify: `src/life-first/PersonalChronology.tsx`
- Modify: `tests/tests.txt`

**Interfaces:**
- Extends only client-side QA; no telemetry leaves the browser.
- Existing `visualQA=1` continues to activate the inspector.

- [ ] **Step 1: Add a failing semantic/accessibility QA assertion**

Add to the foundation test:

```text
With `visualQA=1`, verify the QA panel reports 0 HORIZONTAL OVERFLOW, 0 BROKEN IMAGES, 0 JOURNEY ORDER failures and no visible primary action smaller than 44x44 CSS px on mobile. Keyboard through the hero, World Rooms, disclosure summary and primary next-action links; focus must remain visible and logical. With reduced-motion preference enabled, no transition is required to understand navigation state.
```

- [ ] **Step 2: Reduce eager chronology image loading**

In `PersonalChronology.tsx`, change:

```tsx
loading={index<2?'eager':'lazy'}
```

to:

```tsx
loading="lazy"
```

The dedicated hero is already high priority; do not compete with it by eagerly loading chronology media below the fold.

- [ ] **Step 3: Strengthen focus/touch CSS without redesigning every component**

Ensure hero actions, room links and `LivingDepth summary` have visible `:focus-visible` state and mobile minimum target height of 44px. Do not apply a global forced height to inline citation/source links where it would distort reading; scope the rule to primary navigation/action controls.

- [ ] **Step 4: Add a DOM semantic check to `VisualInspector`**

Add a check that fails if any of the default direct-home landmarks are missing:

```ts
const requiredHomeIds = [
  'you-are-here', 'life-chronology', 'world-rooms', 'right-now',
  'starton-return', 'lab-research', 'knowledge-commons', 'create',
  'your-room', 'living-depth'
];
```

Expose it as `SEMANTIC HOME LANDMARKS`. Keep this a structural presence check; do not pretend it is a full automated WCAG audit.

- [ ] **Step 5: Build and run the full current E2E suite**

Run:

```bash
npm run build
```

Then AppDeploy E2E. Expected:

```text
Tests 1–5: PASS
Foundation research-gate test: PASS
Visual QA mobile: 0 horizontal overflow, 0 broken images, 0 journey-order failures
No frontend/backend error logs after deployment
```

Any regression in canonical corpus, research labeling, source-local metrics, or admin write guard blocks deployment.

- [ ] **Step 6: Commit**

```bash
git add src/VisualInspector.tsx src/life-first/life-first.css src/life-first/PersonalChronology.tsx tests/tests.txt
git commit -m "test: gate Living Universe accessibility and hierarchy"
```

---

### Task 6: Release candidate QA and evidence capture

**Files:**
- Modify only if a failing gate identifies a concrete defect.
- Record implementation evidence in the repository only after the preview passes.

**Interfaces:**
- Consumes: completed Tasks 1–5.
- Produces: one deployable foundation candidate; no new feature scope.

- [ ] **Step 1: Build from the exact candidate source**

```bash
npm run build
```

Expected: exit 0, no TypeScript error, no missing imports.

- [ ] **Step 2: Deploy preview/candidate through AppDeploy and run all E2E tests**

Expected: all tests PASS. If AppDeploy reports `deployed_and_testing`, wait for the same run status to resolve before treating it as final; inspect QA/error output.

- [ ] **Step 3: Inspect desktop and mobile QA screenshots**

Pass criteria:

```text
DESKTOP
- first viewport = one real visual + name + concise human statement + 3 choices
- no first-screen dashboard/counters/chat
- story starts immediately after entry
- secondary density is visibly demoted

MOBILE
- no horizontal overflow
- one dominant visual/narrative object at a time
- all primary controls usable
- no fixed layer blocks content/actions
- HE/EN/RU remain readable
```

- [ ] **Step 4: Inspect source/semantic evidence**

Confirm in rendered DOM:

```text
html lang/dir correct
one canonical link
hreflang he/en/ru preserved
one #7ya-structured-data script
required home IDs unique
closed/open LivingDepth works by keyboard
hash navigation into depth works
```

- [ ] **Step 5: Check runtime errors and rollback readiness**

AppDeploy status must report no new frontend/backend errors. Preserve v100 as the known-good rollback baseline until the candidate passes all checks.

- [ ] **Step 6: Commit only QA-driven fixes, then tag/snapshot the validated candidate**

Do not use this task to add features. If there are no defects, make no source change merely to create activity.

---

## Deferred follow-on plans

The following are intentionally **not** included in this foundation implementation and each receives its own spec/plan gate:

1. **Provenance-aware story objects** — unify story/post/interview/media/echo/knowledge metadata and visible provenance states.
2. **Search + agent legibility** — object-level JSON-LD, sitemap/canonical expansion, explicit object relationships, agent benchmark tasks.
3. **Visitor growth pathway** — explicit low-data topic choices and session/local personalization without sensitive inference.
4. **Grounded AI companion** — only after canonical object/provenance layers are stable; source-bound, explainable, dismissible, non-authoritative under uncertainty.

---

## Plan Self-Review

### Spec coverage

- Human-first entry: Tasks 2–3.
- Living Universe room model: Task 1.
- Existing v100 preservation: Global constraints + Tasks 3/6.
- Semantic/machine legibility: Tasks 1, 3, 4, 5.
- AI not primary: explicit non-goal + Test 1 update.
- Accessibility: Tasks 2 and 5.
- Mobile low-complexity rhythm: Tasks 2, 3, 6.
- Performance loading discipline: Tasks 2 and 5.
- Structured data accuracy: Task 4.
- No speculative GEO: Global constraints.
- Provenance and personalization: deliberately deferred to their dedicated slices, as required by the research gate.
- Existing evidence/research/admin safety: Tasks 3, 4, 5, 6 explicitly preserve Test 5.

### Placeholder scan

No `TBD`, `TODO`, “implement later”, generic “add tests”, or unnamed interface remains. Every new file and public interface in this slice is named.

### Type consistency

`LivingRoomId`, `LivingRoom`, `livingRooms`, `livingRoomById`, `LocalText`, and `buildSiteStructuredData(locale, canonical)` have one definition each and are referenced consistently by later tasks.

## Gate result

**READY FOR EXECUTION AFTER RESEARCH GATE.**

The foundation can be accepted independently. It must leave the site working even if all later AI-era slices are never built.
