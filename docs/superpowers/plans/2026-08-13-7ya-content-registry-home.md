# 7YA Content Registry + Rich Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ad-hoc homepage media arrays with one canonical public-content registry that drives a visually rich, source-linked, multilingual 7YA homepage and can be maintained without editing layout code.

**Architecture:** The live AppDeploy React/Vite runtime is the implementation target for this phase. Create a focused `content-registry.ts` module containing normalized public media records and selectors; render homepage rails/mosaics from those selectors; preserve existing media/museum/chat flows. Add QA assertions that measure visible unique assets, broken images, source links, mobile overflow, and duplicate reuse.

**Tech Stack:** React + TypeScript + Vite + AppDeploy QA/E2E.

## Global Constraints

- Public content only; no private family or operational data.
- Every visual record must have source URL, source label, date/year, media kind, evidence status, and explicit visual provenance.
- No AI-generated image may be labeled or presented as documentary evidence.
- Homepage must support HE / EN / RU and responsive mobile layouts.
- Digital Igor, Museum, Media, Speaker, Blog and StartOn routes must remain functional.
- The final completion claim requires production-domain visual QA, not deployment status alone.

---

### Task 1: Canonical content registry

**Files:**
- Create: `src/content-registry.ts`
- Modify: `src/deep-media-data.ts`
- Test: `tests/tests.txt`

**Interfaces:**
- Produces: `ContentRecord`, `contentRegistry`, `selectHomeVisuals()`, `selectFeaturedVideos()`, `selectStoryCluster(cluster)`.
- Consumes: existing verified `deepMedia` records and their public source URLs.

- [ ] **Step 1: Add failing QA expectations**

Add tests requiring the homepage to render at least 18 source-linked visual cards, at least 12 unique image URLs, no broken `<img>` elements after load, and source/status labels for each documentary card.

- [ ] **Step 2: Run QA and verify failure**

Expected: current homepage fails at least the unique-asset or normalized-record assertion.

- [ ] **Step 3: Implement registry**

Define:

```ts
export type ContentKind='portrait'|'press-photo'|'broadcast-frame'|'post-capture'|'music'|'project'|'editorial';
export type ContentRecord={id:string;kind:ContentKind;cluster:'media'|'starton'|'social'|'music'|'journey';source:string;sourceUrl:string;date:string;title:{he:string;en:string;ru:string};summary:{he:string;en:string;ru:string};visual:{src:string;fallback:string;provenance:'publisher-photo'|'video-thumbnail'|'public-portrait'|'site-asset'};status:string;featured?:boolean;youtubeId?:string};
```

Populate the registry from verified public assets already in the runtime: Wikimedia portrait, mynet press photo, Hidabroot publisher image, Channel 12/13 video thumbnails, Channel 14 StartOn frame, `פותחים יום`, Nova long-form, youth radio, 7/10 DNA clip, plus clearly-labeled site assets only where no documentary visual exists.

- [ ] **Step 4: Implement selectors**

Selectors must de-duplicate by `visual.src` before filling a homepage slot and prefer documentary provenance over generic site assets.

- [ ] **Step 5: Run QA**

Expected: registry integrity assertions pass.

- [ ] **Step 6: Commit**

Commit message: `feat: add canonical public content registry`.

---

### Task 2: Homepage renders from the registry

**Files:**
- Modify: `src/ConversionHome.tsx`
- Modify: `src/conversion-home.css`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `selectHomeVisuals()`, `selectFeaturedVideos()`, `selectStoryCluster()`.
- Produces: a homepage with a documentary hero, visual story rail, source mosaic, StartOn/media/music clusters and embedded videos.

- [ ] **Step 1: Add failing visual hierarchy test**

Require above-the-fold presence of Igor plus at least 3 distinct documentary thumbnails before the first major text-only section.

- [ ] **Step 2: Run QA and verify failure**

Expected: fail if the homepage still relies on one hero portrait plus repeated generic assets.

- [ ] **Step 3: Replace hard-coded `homeIds`, `visualArchive`, and duplicated media derivation**

Import registry selectors and map records through one reusable card renderer. Card copy must use the current locale and every card must expose its source and date.

- [ ] **Step 4: Improve editorial hierarchy**

Desktop: one lead media card, 2 supporting cards, then a responsive mosaic. Mobile: single-column lead followed by two-column thumbnails where width allows; never force horizontal page scrolling.

- [ ] **Step 5: Run QA**

Expected: visual hierarchy test passes on desktop and mobile.

- [ ] **Step 6: Commit**

Commit message: `feat: drive rich homepage from content registry`.

---

### Task 3: Duplicate and broken-media guardrails

**Files:**
- Create: `src/content-qa.ts`
- Modify: `src/ConversionHome.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Produces: `getContentDiagnostics(records)` returning totals for unique visuals, duplicate visuals, missing provenance and missing source URLs.

- [ ] **Step 1: Add failing diagnostics test**

Require zero records missing `sourceUrl`, zero records missing `visual.provenance`, and no generic site asset used in more than 2 prominent homepage slots.

- [ ] **Step 2: Run QA and verify failure**

Expected: fail if duplicated site assets exceed the cap.

- [ ] **Step 3: Implement diagnostics**

```ts
export function getContentDiagnostics(records:ContentRecord[]){
 const counts=new Map<string,number>();
 records.forEach(item=>counts.set(item.visual.src,(counts.get(item.visual.src)||0)+1));
 return {uniqueVisuals:counts.size,duplicates:[...counts].filter(([,count])=>count>1),missingSource:records.filter(item=>!item.sourceUrl),missingProvenance:records.filter(item=>!item.visual.provenance)};
}
```

Expose diagnostics only through existing diagnostics mode; do not add public clutter.

- [ ] **Step 4: Run QA**

Expected: all content diagnostics pass.

- [ ] **Step 5: Commit**

Commit message: `test: add visual content integrity guardrails`.

---

### Task 4: Production verification and release gate

**Files:**
- Modify: `tests/tests.txt` only if a QA selector needs correction after observing the deployed UI.

**Interfaces:**
- Consumes: deployed homepage and diagnostics.
- Produces: objective release evidence.

- [ ] **Step 1: Deploy through AppDeploy using update diffs only**

- [ ] **Step 2: Poll until terminal deployment status**

- [ ] **Step 3: Run desktop production QA**

Verify: at least 18 visible source-linked visual cards across the page, at least 12 unique image URLs, embedded videos load, and documentary/source labels are present.

- [ ] **Step 4: Run mobile production QA**

Verify: no horizontal overflow, language navigation works, Digital Igor opens, images are not collapsed/cropped into unusable slivers, and at least 8 distinct visuals are visible during a normal scroll.

- [ ] **Step 5: Regression checks**

Verify Museum, Media, Speaker, Blog, StartOn anchor, diagnostics and Digital Igor still work.

- [ ] **Step 6: Completion gate**

Do not report completion if any visible-content assertion fails. Deployment `ready` alone is insufficient.
