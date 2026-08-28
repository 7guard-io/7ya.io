# 7YA Cinematic Personal OS — Slice 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the live 7YA homepage into a cinematic, media-first, mobile-first front door where Igor is understood before the system, while preserving source-linked proof, 7B+ Impact Universe access, multilingual behavior and all deep routes.

**Architecture:** Work from the applied AppDeploy production tree, not from stale GitHub runtime files. Reshape the existing `DocumentaryHome` hierarchy rather than replace the data stack: keep Public Projection, `homeVisualCorpus`, Impact Universe registry and viewer logic; reduce simultaneous primary surfaces; move full documentary depth behind Museum/Archive; keep a compact curated home story; then validate mobile and desktop before any cutover. GitHub receives the validated production export only after the runtime slice passes.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, Lucide React, AppDeploy Public Projection API, existing CSS modules-by-import convention, HE/EN/RU locale system.

**Spec:** `docs/superpowers/specs/2026-08-28-cinematic-personal-os-design.md`

## Global Constraints

- Production app is AppDeploy `697a008fddc309b142`.
- Baseline source of truth is production snapshot `1787859400536` until a newer validated candidate exists.
- Never deploy stale GitHub `main` over production.
- Preserve HE / EN / RU behavior and existing canonical deep routes.
- Preserve Canon / Discovery / Live evidence distinctions.
- Keep `7B+`, `397M+` and `47+` as separate metric classes sourced from the shared Impact Universe registry.
- Do not fabricate media or historical imagery.
- Mobile is first-class; target validation viewport is 375x667 in addition to desktop 1280x800.
- No autoplay audio.
- Existing public projection failure must degrade to `homeVisualCorpus`, not an empty homepage.
- Digital Igor must remain available but must not obstruct the first mobile fold.
- Do not claim CI, visual PASS or production success without a fresh verification run.

---

## File structure for this slice

**Modify in the applied AppDeploy source tree:**

- `src/documentary-home/DocumentaryHome.tsx` — homepage composition, data selection, viewer and section ordering.
- `src/documentary-home/hero-experience.ts` — concise multilingual hero thesis, primary actions, story stops and proof labels.
- `src/documentary-home/NarrativeChapters.tsx` — add explicit home/full presentation mode and home-only curated chapter selection.
- `src/documentary-home/documentary-home.css` — base home media/viewer/section styles.
- `src/documentary-home/living-documentary-front-door.css` — first-fold desktop/mobile composition.
- `src/documentary-home/narrative-chapters.css` — compact home mode while retaining full-mode documentary styling.
- `src/documentary-home/impact-front-door.css` — reduce homepage Impact density without deleting methodology.
- `src/documentary-home/impact-universe-counter.css` — mobile simplification and progressive detail.
- `src/documentary-home/documentary-accessibility.css` — keep light theme/focus/reduced-motion behavior aligned with new hierarchy.
- `tests/tests.txt` — update explicit manual acceptance tests for the new first fold and story-depth boundary.

**Do not modify in this slice:** backend ingestion, Meta OAuth/sync, canonical corpus semantics, deep-route routing, NVIDIA provider logic, `shared/impact-universe`, or source metric values.

---

### Task 1: Lock acceptance tests before changing layout

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: existing manual QA grammar used by AppDeploy.
- Produces: two explicit regression tests named `Cinematic first fold` and `Home depth boundary`.

- [ ] **Step 1: Add the failing first-fold acceptance test**

Append this exact test:

```text
## Test 21 - Cinematic first fold prioritizes Igor over the system
Viewport: mobile (375x667) and desktop (1280x800)
Covers: homepage first viewport, dominant authentic portrait, concise hero thesis, primary story entry, proof cue, Digital Igor non-obstruction
Description: Verifies the new homepage opens as a person-led documentary rather than a dashboard or dense control surface.

Steps:
1. Open /?lang=he at scroll position 0.
2. Confirm one dominant authentic Igor image is visible before any media rail or methodology grid.
3. Confirm the headline, concise supporting line, primary story action and evidence/contact access are readable without overlap.
4. Confirm 7B+, 397M+ and 47+ appear only as a compact proof cue and are visually subordinate to the person.
5. Repeat in English and Russian.

Expected: Igor is the dominant first-fold subject; no large Impact Universe methodology block, archive grid or multi-row control surface appears above the story entry; proof metrics remain separated by class; Digital Igor does not cover the mobile hero.
```

- [ ] **Step 2: Add the failing home-depth-boundary acceptance test**

Append:

```text
## Test 22 - Home curates the story while Museum and Archive retain depth
Viewport: mobile (375x667) and desktop (1280x800)
Covers: curated homepage chapters, full-depth handoff, media-first bridge, source-linked navigation
Description: Verifies the homepage no longer requires the visitor to traverse all documentary chapters before reaching media and current work.

Steps:
1. Open /?lang=he and follow the homepage story from the first chapter to the handoff.
2. Count the visible homepage story scenes before the main media/proof transition.
3. Open the full-story action and verify it reaches a deep documentary/archive destination without losing language.
4. Open one visible source-linked media item and return.

Expected: Home presents six or fewer curated story scenes before the media/proof transition; the full documentary remains accessible through Museum/Archive; source links remain real and evidence-labelled; HE/EN/RU handoffs preserve language.
```

- [ ] **Step 3: Run the two new tests against baseline**

Run them through the AppDeploy visual/manual QA harness at 375x667 and 1280x800.

Expected baseline result: at least Test 22 fails because the current homepage renders the full 14-chapter `NarrativeChapters` before the Impact section.

- [ ] **Step 4: Record baseline screenshots and failure notes**

Record the baseline using the existing AppDeploy QA screenshot facility for `/`, `/museum/` and `/media/`. Store only the resulting QA references/receipt in the release notes; do not add synthetic screenshots to the content corpus.

---

### Task 2: Simplify the hero model without changing truth data

**Files:**
- Modify: `src/documentary-home/hero-experience.ts`
- Modify: `src/documentary-home/DocumentaryHome.tsx`

**Interfaces:**
- Consumes: `impactUniverse` from `../../shared/impact-universe`.
- Produces: `getHeroExperience(locale)` with exactly three proof metrics and six story stops; no metric values are hardcoded outside the shared registry.

- [ ] **Step 1: Make the hero copy concise in all three locales**

Keep the existing exported function but change the localized experience objects so the supporting lead is limited to two short sentences. Preserve these exact Hebrew semantic elements: childhood/immigration, service, Jesse Cohen, StartOn, creation/research. Preserve equivalent EN/RU meaning.

Use this Hebrew title and lead:

```ts
{
  title: 'חיים אמיתיים. השפעה שאפשר לראות.',
  lead: 'אני איגור. מילדות ועלייה, דרך שירות וחזרה לג׳סי כהן — ועד StartOn, יצירה, מחקר ורשת השפעה ציבורית שניתנת לבדיקה.'
}
```

Use the existing English title `Real life. Impact you can see.` and equivalent concise Russian copy.

- [ ] **Step 2: Preserve truth through the shared Impact Universe registry**

Keep this shape in `getHeroExperience`:

```ts
metrics: [
  {value: impactUniverse.headline.value, label: impactUniverse.headline.label[locale], kind: 'exposure'},
  {value: impactUniverse.interactions.value, label: impactUniverse.interactions.label[locale], kind: 'interactions'},
  {value: impactUniverse.countries.value, label: impactUniverse.countries.label[locale], kind: 'geography'}
]
```

Do not introduce a fourth aggregate.

- [ ] **Step 3: Reduce hero actions to one primary and three secondary actions**

In `DocumentaryHome.tsx`, render the action group in this order:

```tsx
<div className="dh-actions" data-home-actions="cinematic">
  <a className="dh-story-command dh-primary-command" href="#story">{c.story}<ArrowDown/></a>
  <a className="dh-evidence-command" href={evidence}>{c.evidence}<BookOpen/></a>
  <a className="dh-contact-command" href={contact}>{c.contact}<ArrowUpRight/></a>
  <a className="dh-talk-command" href={talk}>{c.talk}<MessageCircle/></a>
</div>
```

Remove the hero-level Watch and Archive buttons; those actions reappear in the media showcase and final handoff. Do not remove the viewer implementation.

- [ ] **Step 4: Keep a compact proof cue only**

Retain `.dh-impact-preview`, but change the label to describe it as proof, not a dashboard. Every card continues linking to `#impact`.

- [ ] **Step 5: Validate the hero model**

Run the new Test 21 plus existing Test 6 and Test 16.

Expected: Test 21 passes; existing mobile hero actions remain accessible; values still match the shared Impact Universe.

---

### Task 3: Introduce explicit home/full documentary modes

**Files:**
- Modify: `src/documentary-home/NarrativeChapters.tsx`
- Modify: `src/documentary-home/narrative-chapters.css`
- Modify: `src/documentary-home/DocumentaryHome.tsx`

**Interfaces:**
- Produces: `NarrativeChapters({mode?: 'home'|'full'})`.
- Home mode renders chapter indices `[0,2,3,6,10,13]` in that order.
- Full mode renders all existing chapters and remains the default to avoid breaking future consumers.

- [ ] **Step 1: Change the component signature**

Use:

```tsx
type NarrativeMode='home'|'full';
export default function NarrativeChapters({mode='full'}:{mode?:NarrativeMode}) {
```

- [ ] **Step 2: Derive the visible chapter set deterministically**

Immediately before render, add:

```ts
const homeChapterIndexes=new Set([0,2,3,6,10,13]);
const visibleChapters=chapters
  .map((chapter,index)=>({chapter,index}))
  .filter(({index})=>mode==='full'||homeChapterIndexes.has(index));
```

Render `visibleChapters.map(({chapter,index}) => ...)` so all existing arrays continue using the original index.

- [ ] **Step 3: Add a full-story handoff at the end of home mode**

After the curated chapter list and before the Impact bridge, render only in home mode:

```tsx
{mode==='home'&&<aside className="dn-full-story-handoff">
  <small>FULL DOCUMENTARY · 1990—NOW</small>
  <h3>{L('הסיפור המלא נשמר. הבית רק אוצר אותו.','The full story remains. Home only curates it.','Полная история сохранена. Главная страница лишь курирует её.')[locale]}</h3>
  <nav>
    <a href={rootHref('museum/?lang='+locale)}>{L('למסע המלא','Open full journey','Открыть полный путь')[locale]}<ArrowUpRight/></a>
    <a href={pageHref('library',locale)}>{L('לארכיון החי','Living Archive','Живой архив')[locale]}<BookOpen/></a>
  </nav>
</aside>}
```

- [ ] **Step 4: Render home mode on the homepage**

Change:

```tsx
<NarrativeChapters/>
```

to:

```tsx
<NarrativeChapters mode="home"/>
```

- [ ] **Step 5: Style the handoff and compact home scenes**

In `narrative-chapters.css`, scope reduced vertical height only to home mode via a wrapper data attribute or class added to the section:

```tsx
<section className={'dn '+(mode==='home'?'dn-home':'dn-full')} id="story" dir={dir}>
```

Add:

```css
.dn-home .dn-chapter{min-height:62svh}
.dn-full-story-handoff{padding:clamp(54px,7vw,96px) clamp(18px,7vw,110px);border-top:1px solid rgba(255,255,255,.13);background:#0b0d10}
.dn-full-story-handoff small{color:#9fb4cb;font:850 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}
.dn-full-story-handoff h3{max-width:850px;margin:14px 0 0;font:920 clamp(34px,4.5vw,68px)/.94 ui-sans-serif,system-ui;letter-spacing:-.055em}
.dn-full-story-handoff nav{display:flex;gap:8px;flex-wrap:wrap;margin-top:26px}
.dn-full-story-handoff a{min-height:48px;padding:0 16px;display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(255,255,255,.2);text-decoration:none;font-weight:850;font-size:11px}
@media(max-width:900px){.dn-home .dn-chapter{min-height:0}.dn-full-story-handoff{padding:54px 16px}.dn-full-story-handoff nav{display:grid}.dn-full-story-handoff a{justify-content:space-between}}
```

- [ ] **Step 6: Validate the depth boundary**

Run Test 22 and existing Tests 1, 9 and 16.

Expected: six curated scenes on Home; full depth remains reachable; anchors still resolve.

---

### Task 4: Move real media ahead of heavy Impact methodology

**Files:**
- Modify: `src/documentary-home/DocumentaryHome.tsx`
- Modify: `src/documentary-home/documentary-home.css`

**Interfaces:**
- Consumes: existing `featured` array from `diverse(eligible,16)` and existing viewer state.
- Produces: a visible `#media-highlights` section using the first six `featured` items before `<ImpactFrontDoor/>`.

- [ ] **Step 1: Add a six-item media selection**

After `featured`, derive:

```ts
const mediaHighlights=useMemo(()=>featured.slice(0,6),[featured]);
```

- [ ] **Step 2: Render the media showcase before ImpactFrontDoor**

Insert after `<NarrativeChapters mode="home"/>`:

```tsx
<section className="dh-media-highlights" id="media-highlights">
  <header>
    <small>WATCH · PRESS · PODCASTS · CREATION</small>
    <h2>{locale==='he'?'לא רק לספר. לראות.':locale==='ru'?'Не только читать. Смотреть.':'Do not just read it. See it.'}</h2>
    <a href={pageHref('media',locale)}>{c.openMedia}<ArrowUpRight/></a>
  </header>
  <div className="dh-media-highlight-grid">
    {mediaHighlights.map((item,index)=><button type="button" key={item.id} onClick={()=>openViewer(index)}>
      <figure>
        {mediaSrc(item)&&<img src={mediaSrc(item)} alt={item.title[locale]} loading={index<2?'eager':'lazy'} decoding="async" referrerPolicy="no-referrer" onError={hideBroken}/>} 
        {item.mediaType==='video'&&<i><Play fill="currentColor"/></i>}
      </figure>
      <div><small>{item.year} · {item.publisher}</small><strong>{item.title[locale]}</strong>{item.metrics?.[0]&&<b dir="ltr">{item.metrics[0].value}</b>}</div>
    </button>)}
  </div>
</section>
```

- [ ] **Step 3: Add responsive media styling**

Use a two-column editorial grid on desktop and a horizontal snap rail on mobile. No collage/masonry behavior.

```css
.dh-media-highlights{padding:clamp(64px,8vw,116px) clamp(18px,5vw,76px);background:#0c0e11;border-top:1px solid var(--line)}
.dh-media-highlights>header{max-width:1540px;margin:0 auto 28px;display:grid;grid-template-columns:1fr auto;align-items:end;gap:18px}
.dh-media-highlights>header small{grid-column:1/-1;color:var(--steel);font:850 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.16em}
.dh-media-highlights>header h2{margin:0;font:950 clamp(42px,6vw,86px)/.9 ui-sans-serif,system-ui;letter-spacing:-.06em}
.dh-media-highlights>header>a{display:flex;gap:7px;align-items:center;text-decoration:none;font-weight:850;font-size:11px}
.dh-media-highlight-grid{max-width:1540px;margin:auto;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.dh-media-highlight-grid>button{padding:0;border:1px solid var(--line);background:#121519;text-align:inherit;overflow:hidden;cursor:pointer}
.dh-media-highlight-grid figure{position:relative;margin:0;aspect-ratio:16/10;background:#171b20;overflow:hidden}
.dh-media-highlight-grid img{width:100%;height:100%;display:block;object-fit:cover}
.dh-media-highlight-grid figure i{position:absolute;right:12px;bottom:12px;width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:var(--paper);color:#111}
.dh-media-highlight-grid>button>div{padding:16px}.dh-media-highlight-grid small{color:var(--steel);font:800 8px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace}.dh-media-highlight-grid strong{display:block;margin-top:9px;font:900 24px/1.03 ui-sans-serif,system-ui;letter-spacing:-.04em}.dh-media-highlight-grid b{display:block;margin-top:11px;color:#d7e4ef;font:850 10px/1 ui-monospace,SFMono-Regular,Menlo,monospace}
@media(max-width:900px){.dh-media-highlights{padding:56px 12px}.dh-media-highlights>header{display:block;padding:0 4px}.dh-media-highlights>header h2{margin-top:10px;font-size:42px}.dh-media-highlights>header>a{margin-top:16px}.dh-media-highlight-grid{display:flex;overflow-x:auto;gap:8px;scroll-snap-type:x mandatory;padding-bottom:10px}.dh-media-highlight-grid>button{flex:0 0 82vw;max-width:390px;scroll-snap-align:start}.dh-media-highlight-grid figure{aspect-ratio:4/5}}
```

- [ ] **Step 4: Run media fallback regression**

Run existing Tests 4 and 7 with the Public Projection and Corpus API faults.

Expected: the new showcase remains populated from `homeVisualCorpus` and its cards still open real source/viewer states.

---

### Task 5: Make Impact progressive instead of visually dominant

**Files:**
- Modify: `src/documentary-home/ImpactFrontDoor.tsx`
- Modify: `src/documentary-home/impact-front-door.css`
- Modify: `src/documentary-home/impact-universe-counter.css`

**Interfaces:**
- Consumes: unchanged shared Impact Universe registry and existing source URLs.
- Produces: compact opening proof panel with deeper methodology still present below.

- [ ] **Step 1: Add progressive-detail semantics**

Wrap the detailed `ib-era`, `ib-propagation`, `ib-platforms` and `ib-boundary` content in:

```tsx
<div className="ib-depth" id="impact-depth">
  {/* existing era, propagation, platforms and boundary sections unchanged */}
</div>
```

Keep `ImpactUniverseCounter` and the first signal row visible before the depth wrapper.

- [ ] **Step 2: Add a clear transition label**

Immediately before `.ib-depth`, render:

```tsx
<header className="ib-depth-intro">
  <small>METHOD · SOURCES · PROPAGATION</small>
  <h3>{locale==='he'?'למי שרוצה לבדוק איך המספרים בנויים.':locale==='ru'?'Для тех, кто хочет проверить, как устроены цифры.':'For anyone who wants to inspect how the numbers are built.'}</h3>
</header>
```

- [ ] **Step 3: Reduce mobile visual weight**

In `impact-universe-counter.css`, keep `7B+` visible but lower the mobile type ceiling and remove unnecessary minimum height:

```css
@media(max-width:900px){.iu-hero>div{min-height:340px}.iu-hero>div>strong{font-size:clamp(72px,24vw,118px)}.iu-cards article{min-height:220px}}
@media(max-width:430px){.iu-hero>div{min-height:320px}.iu-hero>div>strong{font-size:76px}}
```

- [ ] **Step 4: Add depth separation styling**

```css
.ib-depth-intro{max-width:1540px;margin:16px auto 30px;padding-top:34px;border-top:1px solid var(--line)}
.ib-depth-intro small{color:var(--accent);font:850 9px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.14em}
.ib-depth-intro h3{max-width:860px;margin:12px 0 0;font:920 clamp(28px,3.7vw,54px)/.96 ui-sans-serif,system-ui;letter-spacing:-.05em}
.ib-depth{content-visibility:auto;contain-intrinsic-size:2200px}
```

- [ ] **Step 5: Run impact truth regression**

Run existing Test 8 and Test 16.

Expected: values and metric-class separation remain unchanged; methodology remains inspectable but no longer dominates the transition from story to media.

---

### Task 6: Rebuild the mobile first fold and interaction density

**Files:**
- Modify: `src/documentary-home/living-documentary-front-door.css`
- Modify: `src/documentary-home/documentary-home.css`
- Modify: `src/documentary-home/documentary-accessibility.css`

**Interfaces:**
- Consumes: unchanged semantic hero markup from Task 2.
- Produces: one image zone + one copy zone + compact proof strip on 375x667 without overlap.

- [ ] **Step 1: Stabilize mobile hero geometry**

Use this mobile geometry:

```css
@media(max-width:900px){
  .dh-hero{padding-top:52px;background:#090a0c}
  .dh-hero>figure{height:clamp(250px,38svh,340px);min-height:250px}
  .dh-hero>figure img{object-position:center 16%}
  .dh-hero-copy{padding:16px 16px 18px}
  .dh-hero h1{max-width:12ch;font-size:clamp(40px,11vw,52px);line-height:.9}
  .dh-hero h2{max-width:36ch;margin-top:10px;font-size:14px;line-height:1.42}
}
```

- [ ] **Step 2: Make action hierarchy thumb-friendly**

```css
@media(max-width:900px){
  .dh-actions{grid-template-columns:1fr 1fr;margin-top:16px}
  .dh-actions .dh-primary-command{grid-column:1/-1;min-height:54px;background:var(--paper);color:#111;border-color:var(--paper)}
  .dh-actions .dh-evidence-command,.dh-actions .dh-contact-command{grid-column:auto;min-height:46px}
  .dh-actions .dh-talk-command{grid-column:1/-1;min-height:44px}
}
```

- [ ] **Step 3: Keep proof readable but compact**

```css
@media(max-width:900px){
  .dh-impact-preview{margin-top:14px;padding-top:10px}
  .dh-impact-preview>div{grid-template-columns:repeat(3,1fr)}
  .dh-impact-preview a{min-height:62px;padding:9px 8px}
  .dh-impact-preview strong{font-size:22px}
  .dh-impact-preview small{font-size:7.5px;line-height:1.25}
}
```

- [ ] **Step 4: Remove duplicate mobile navigation pressure**

Keep the story rail but make it a compact horizontal post-hero rail; do not display any second floating navigation over the first fold. Preserve the existing companion FAB suppression rule on hero.

- [ ] **Step 5: Preserve accessibility**

Verify focus outlines, light theme, reduced-motion media transitions and safe-area footer padding still apply. Do not remove `prefers-reduced-motion` rules.

- [ ] **Step 6: Run mobile acceptance**

Run Tests 6, 9, 16, 21 and 22 at 375x667 and 390x844.

Expected: no clipping, no horizontal page overflow, no button overlap, readable hero crop, story action visible, light theme still persists.

---

### Task 7: Build and production-candidate verification

**Files:**
- Modify only if required by validation: the files already listed above.
- Update after successful candidate: `public/release.json` and deployment receipt according to existing release convention.

**Interfaces:**
- Consumes: AppDeploy candidate source with Tasks 1–6 applied.
- Produces: a deployable candidate with a rollback reference to `1787859400536`.

- [ ] **Step 1: Run the frontend build**

Run:

```bash
npm run build
```

Expected: exit code 0.

- [ ] **Step 2: Run the complete homepage regression subset**

Execute Tests 1, 2, 4, 6, 7, 8, 9, 16, 21 and 22.

Expected: zero functional regressions; Public Projection fault still produces visible fallback media.

- [ ] **Step 3: Run live visual acceptance**

Capture and inspect 375x667 and 1280x800 for:

```text
/
/media/
/museum/
/evidence/
```

Acceptance criteria:

```text
- authentic Igor visual dominates first viewport
- story action is obvious
- no dashboard/methodology wall above story
- six or fewer curated home story scenes before media/proof transition
- real media is visible before detailed impact methodology
- 7B+, 397M+ and 47+ remain separate
- no clipping, overlap, broken image block or horizontal page overflow
- HE/EN/RU structure remains coherent
```

- [ ] **Step 4: Verify runtime errors**

Use AppDeploy runtime QA and require:

```text
frontend errors: 0
backend errors: 0
network errors: 0 attributable to the candidate
```

External source-image failures may degrade to the existing deterministic poster/fallback behavior but must not blank a section.

- [ ] **Step 5: Cut over only after verification**

Apply the validated candidate in AppDeploy. Record the previous applied snapshot `1787859400536` as the rollback reference.

- [ ] **Step 6: Verify production after cutover**

Repeat Test 21 and Test 22 against `https://7ya.io/` plus `/api/health` and one deep route.

Expected: the applied release marker matches the candidate and the public domain renders the candidate, not the old snapshot.

---

## Follow-on plans after Slice 1

Slice 1 intentionally does not mix independent subsystems. After it passes, write and execute separate plans in this order:

1. `2026-08-28-cinematic-personal-os-secondary-rooms.md` — align Media, Museum, Research, Evidence, Library, Speaker, Music and StartOn to the same visual grammar.
2. `2026-08-28-cinematic-personal-os-performance-seo.md` — LCP/CLS/INP, responsive media delivery, schema.org graph, hreflang/canonical/static-first verification.
3. `2026-08-28-cinematic-personal-os-source-reconciliation.md` — export the complete validated AppDeploy production source atomically back into GitHub-controlled source and restore one authoritative release path.

## Self-review

- Spec coverage for Slice 1: person-before-system, media-first hierarchy, compact proof layer, mobile-first behavior, no fabricated media, Canon/Discovery separation, deep-route preservation and source-of-truth safety are all covered.
- Explicitly deferred independent subsystems: secondary-room redesign, performance/SEO hardening and GitHub/AppDeploy reconciliation each get their own plan.
- No metric values are redefined locally; hero proof values continue to come from `shared/impact-universe`.
- No backend ingestion or NVIDIA behavior is changed in this slice.
- No production success is claimed until Task 7 verification is fresh.
