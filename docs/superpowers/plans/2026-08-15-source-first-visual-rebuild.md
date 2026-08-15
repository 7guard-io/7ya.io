# 7YA Source-First Visual Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the 7YA frontend so authentic source visuals, Igor, service, StartOn, media, music and research are continuously visible, with zero empty black media boxes and a restrained multilingual control.

**Architecture:** Preserve the existing source registries, routes, backend APIs, evidence status model and seven-chapter journey. Add a reusable source-visual renderer with deterministic `image → fallback → editorial fallback` behavior, then apply it to the archive and life chapters. Presentation changes must never mutate canonical URLs or evidence status.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy frontend+backend runtime, existing CSS modules/global CSS, existing `deepMedia` and related registries.

## Global Constraints

- Authentic source visual outranks generated artwork.
- Generated imagery may appear only when no authentic visual exists and must be labeled `EDITORIAL INTERPRETATION / NOT EVIDENCE`.
- No featureless black placeholder may remain when a source image, video thumbnail, screenshot, approved fallback or editorial substitute exists.
- No empty framed media box may remain in StartOn, service, media or archive sections.
- Do not repeat the same Igor portrait across unrelated records as fake density.
- Locale selector remains inline and typographic: `עברית · English · Русский`; no oversized active circle/pill.
- Preserve HE RTL and EN/RU LTR.
- Preserve the seven chapters and LIFE / EVIDENCE / MEANING grammar.
- Preserve canonical source URLs, evidence labels and relationship statuses.
- Visual QA must use rendered desktop and mobile screenshots.

---

### Task 1: Deterministic Source Visual Renderer

**Files:**
- Create: `src/SourceVisual.tsx`
- Create: `src/source-visual.css`
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: `src:string`, `fallback:string`, `alt:string`, optional `label:string`, optional `className:string`.
- Produces: `<SourceVisual ... />` that swaps from `src` to `fallback` on the first load error and, if the fallback also fails, renders a visible editorial record with `EDITORIAL / SOURCE UNAVAILABLE` instead of an empty image box.

- [ ] **Step 1: Add a failing user-visible QA expectation**

Add to `tests/tests.txt` a mobile/desktop assertion that a failed source image never leaves a featureless black rectangle and that source metadata remains visible.

- [ ] **Step 2: Verify current rendered QA demonstrates the failure**

Use the current PDF/rendered QA where archive and StartOn source frames contain black or empty rectangles. Expected: failure is visually reproducible before implementation.

- [ ] **Step 3: Implement the minimal renderer**

```tsx
import {useState} from 'react';
import './source-visual.css';

type Props={src:string;fallback:string;alt:string;label?:string;className?:string};
export default function SourceVisual({src,fallback,alt,label,className=''}:Props){
 const [stage,setStage]=useState<'source'|'fallback'|'editorial'>('source');
 const current=stage==='source'?src:fallback;
 if(stage==='editorial')return <div className={'source-visual source-visual-editorial '+className} role='img' aria-label={alt}><small>EDITORIAL / SOURCE UNAVAILABLE</small><strong>{label||alt}</strong></div>;
 return <img className={'source-visual '+className} src={current} alt={alt} loading='lazy' onError={()=>setStage(stage==='source'?'fallback':'editorial')}/>;
}
```

- [ ] **Step 4: Run build/type validation**

Run AppDeploy validation/deploy on the isolated snapshot. Expected: no TypeScript/lint errors.

- [ ] **Step 5: Commit**

Commit `SourceVisual.tsx`, `source-visual.css`, and the aligned QA expectation.

---

### Task 2: Rebuild DeepArchiveRiver as Visual Public Record

**Files:**
- Modify: `src/DeepArchiveRiver.tsx`
- Modify: `src/deep-archive-river.css`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: each `DeepMediaItem.image`, `DeepMediaItem.fallback`, source, title, year, summary, status and canonical URL.
- Produces: editorial source cards with real visual first, then metadata and context.

- [ ] **Step 1: Add failing archive coverage**

Update QA to assert that the 30-record archive visibly renders source imagery when `image` is present and does not collapse into text-only cards.

- [ ] **Step 2: Verify the current component drops image fields**

Confirm `DeepArchiveRiver` currently maps records without rendering `item.image` / `item.fallback`. Expected: failure confirmed in source and current PDF.

- [ ] **Step 3: Render SourceVisual inside every archive card**

Use:

```tsx
<SourceVisual src={item.image} fallback={item.fallback} alt={`${item.source} — ${item.title}`} label={`${item.source} / ${item.year}`}/>
```

Place it before `.deep-archive-copy`; preserve source/date/status/link metadata.

- [ ] **Step 4: Recompose the archive grid**

Desktop: 3-column editorial grid with image aspect ratio around 16:10 and mixed visual/text rhythm. Mobile: single column, image full-width, metadata readable before long copy. Avoid rounded cards and SaaS styling.

- [ ] **Step 5: Deploy and inspect desktop/mobile screenshots**

Expected: source frames, YouTube thumbnails and publisher images are visibly present; no long run of blank black rectangles; text remains secondary to evidence.

- [ ] **Step 6: Commit**

Commit archive component and CSS changes after screenshot verification.

---

### Task 3: Fix the Language Selector Geometry

**Files:**
- Modify: `src/locale.css`
- Modify: `src/global-nav.css`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: existing `LanguageSwitcher` component and locale state.
- Produces: inline typographic selector with balanced widths and subtle active underline/accent.

- [ ] **Step 1: Add failing visual expectation**

QA must assert all three labels remain readable on mobile and desktop, no circular active state appears, and the selector does not crowd the menu button.

- [ ] **Step 2: Replace pill geometry**

Set switcher border radius to `0`, remove filled active background, use equal padding, thin separators/spacing and an underline or 1px accent for `.active`.

- [ ] **Step 3: Verify RTL/LTR**

Check Hebrew, English and Russian. Expected: order and text direction remain correct without layout jumps.

- [ ] **Step 4: Commit**

Commit locale/navigation CSS after mobile screenshot approval.

---

### Task 4: Remove Empty StartOn and Chapter Media Holes

**Files:**
- Modify: `src/IgorLivingRecordHome.tsx`
- Modify: `src/igor-living-record.css` or the stylesheet owning `.lr-starton-visual`, `.lr-starton-video` and source-object media.
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: documented MYNET source, YouTube thumbnail, chapter-specific local fallbacks and SourceVisual.
- Produces: StartOn/service/signal media blocks that always resolve to meaningful visual content or a labeled editorial fallback.

- [ ] **Step 1: Add failing StartOn visual coverage**

QA asserts both documented StartOn source objects render meaningful visual content; no empty framed rectangle remains when external loading fails.

- [ ] **Step 2: Replace direct `<img>` source objects with SourceVisual**

Apply to StartOn MYNET, StartOn broadcast frame and signal/source objects that currently rely on `onError` without a meaningful secondary visual.

- [ ] **Step 3: Make failure states collapse correctly**

If both source and fallback fail, the editorial record occupies the media area with source/date labeling rather than leaving a black void.

- [ ] **Step 4: Inspect PDF-equivalent long-page screenshots**

Expected: the specific black media holes visible on pages 2–3 of QA are gone.

- [ ] **Step 5: Commit**

Commit life-chapter media repair.

---

### Task 5: Visual Density Pass + Release Gate

**Files:**
- Modify only files proven necessary by screenshot evidence.
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: rebuilt archive, source renderer, chapter media and refined locale control.
- Produces: release candidate with evidence-first visual density across the entire scroll.

- [ ] **Step 1: Deploy isolated rebuild candidate**

Deploy the AppDeploy snapshot without changing evidence data or backend behavior.

- [ ] **Step 2: Inspect desktop screenshot**

Check first viewport, creator archive, service, signal, culture, research, StartOn and Build. Fail if any major viewport has neither Igor, source artifact, service/action visual nor creation/research object.

- [ ] **Step 3: Inspect mobile screenshot**

Check language selector, top nav, bottom dock, archive image cropping, chapter flow and no overlap.

- [ ] **Step 4: Run E2E**

Expected: all existing journey, relationship, reflection and source-fallback tests pass; no frontend/backend runtime errors.

- [ ] **Step 5: Final visual gate**

Pass only when: zero featureless black placeholders, zero empty media boxes, source visuals appear wherever available, language selector is restrained, and the seven-chapter journey remains intact.

- [ ] **Step 6: Sync code to `rebuild/source-first-20260815` and commit**

Record the exact AppDeploy-tested implementation in GitHub before any production promotion.
