# 7YA Life Station Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the seven coarse biography rooms with a granular, evidence-backed life-station engine that ranks stations using public interaction cascades and renders high-value moments as authentic visual story scenes.

**Architecture:** Keep the 120-station content model separate from presentation. A typed runtime registry drives Anchor / Bridge / Archive rendering, while a separate interaction model preserves views, likes, comments, shares, external reposts, journalist/page pickups, secondary engagement and propagation edges without collapsing them into a false universal reach number. The existing 7YA journey, evidence, relationship and Companion components are reused; the homepage receives a station-stream layer rather than a parallel second site.

**Tech Stack:** React 19, TypeScript 5.7, Vite 6, CSS, AppDeploy source snapshot/runtime, existing 7YA public evidence registry and GitHub influence/provenance knowledge files.

## Global Constraints

- `Evidence × Story × Art` is mandatory.
- Interaction means the full cascade: views/reach, likes/reactions, comments, saves, shares, reposts/quotes/mirrors, journalist/editorial pickup, large distribution-page pickup, secondary engagement, cross-platform/cross-language diffusion, persistence and attributable outcomes.
- Do not publish a universal unique-person or total-reach number without defensible deduplication.
- Keep removed/blocked/renamed surfaces as historical nodes when evidence survives.
- Important interviews, TV appearances, video podcasts and lectures use authentic `HERO_FRAME` metadata with source URL and timestamp.
- Hero-frame enhancement is restorative only: crop, perspective, exposure, white balance, local contrast, denoise and restrained sharpening. No facial/body/age/expression/context alteration.
- Generated/illustrative visuals may never masquerade as historical evidence.
- Private Drive URLs and raw private commenter identities never enter the public runtime.
- Protect minors and private family information.
- HE/EN/RU, RTL/LTR, keyboard navigation, reduced motion and 320–430 px mobile integrity remain required.
- Initial viewport must not load a large batch of social iframes.
- Existing relationship taxonomy remains the single source of truth for organization status.

---

## File Structure

### AppDeploy runtime — create
- `src/life-station-types.ts` — typed contracts for station, visual, interaction summary and propagation edge.
- `src/life-stations.ts` — curated 120-station runtime registry with locale copy and evidence references.
- `src/life-station-ranking.ts` — normalization and Anchor / Bridge / Archive ranking logic.
- `src/LifeStationStream.tsx` — grouped life-stream renderer.
- `src/LifeStationScene.tsx` — reusable Anchor/Bridge scene component.
- `src/PropagationPath.tsx` — source-linked external redistribution path renderer.
- `src/HeroFrame.tsx` — authentic video-frame presentation component with source/timestamp disclosure.
- `src/life-station-stream.css` — responsive visual system for station scenes.
- `src/life-station-ranking.test.ts` — pure-function tests if AppDeploy source runner can support them; otherwise mirror test logic in repository QA script described below.

### AppDeploy runtime — modify
- `src/IgorLivingRecordHome.tsx` — replace hardcoded seven-room progression as the primary story spine with `LifeStationStream`, while preserving compatible anchor routes during migration.
- `src/HistoricalInfluence.tsx` — consume station/interaction data instead of a separate hardcoded era model.
- `src/StoryCompanion.tsx` — accept `journeyStation`, `journeyTheme` and explicit visitor choice in contextual launch.
- `src/JourneyReflection.tsx` — emit station-aware context.
- `src/ContextualRelationships.tsx` — allow station-scoped relationship insertion where relevant.
- `src/igor-living-record.css`, `src/journey-engine.css`, `src/journey-upgrade.css` — remove superseded room-only assumptions and avoid fixed-control overlap.

### GitHub repository — create/modify
- Create `knowledge/life-stations-v1.json` — machine-readable canonical station registry used for audit and provenance comparison.
- Create `scripts/check-life-stations-v1.mjs` — schema/invariant QA.
- Create `scripts/check-life-station-public-safety.mjs` — privacy/provenance QA.
- Modify `package.json` — add both checks to `check-all` and `release:gate` chain.
- Preserve `knowledge/influence-graph-v1.json` and `knowledge/influence-provenance-policy-v1.json` as upstream evidence/provenance inputs; do not duplicate their semantics.

---

### Task 1: Define the station and interaction contracts

**Files:**
- Create: `src/life-station-types.ts`
- Create: `knowledge/life-stations-v1.json`
- Test: `scripts/check-life-stations-v1.mjs`

**Interfaces:**
- Produces `LifeStation`, `StationVisual`, `StationInteraction`, `PropagationEdge`, `StationEvidence`, `StationTier`.
- Later components import these exact types.

- [ ] **Step 1: Write the failing repository invariant check**

Create `scripts/check-life-stations-v1.mjs` with checks for:

```js
import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(new URL('../knowledge/life-stations-v1.json', import.meta.url)));
const allowedStates = new Set(['VERIFIED','SUPPORTED','OWNER_REPORTED','REQUIRES_CONFIRMATION','VERIFIED_HISTORICAL','IN_PROGRESS','ASPIRATION','APPROVED']);
const allowedTiers = new Set(['ANCHOR','BRIDGE','ARCHIVE']);
if (!Array.isArray(data.stations) || data.stations.length < 100) throw new Error('expected >=100 stations');
const ids = new Set();
for (const station of data.stations) {
  if (!/^LS-\d{3}$/.test(station.id)) throw new Error(`bad station id ${station.id}`);
  if (ids.has(station.id)) throw new Error(`duplicate station ${station.id}`);
  ids.add(station.id);
  if (!allowedStates.has(station.evidence_state)) throw new Error(`bad evidence_state ${station.id}`);
  if (!allowedTiers.has(station.tier)) throw new Error(`bad tier ${station.id}`);
  if (!Array.isArray(station.domains) || station.domains.length === 0) throw new Error(`missing domains ${station.id}`);
  if (!Array.isArray(station.visual_roles) || station.visual_roles.length === 0) throw new Error(`missing visual roles ${station.id}`);
}
if (data.unique_people_total !== null) throw new Error('unique_people_total must remain null without dedup');
console.log(`life-stations ok: ${data.stations.length}`);
```

- [ ] **Step 2: Run the check and verify RED**

Run:

```bash
node scripts/check-life-stations-v1.mjs
```

Expected: failure because `knowledge/life-stations-v1.json` does not yet exist.

- [ ] **Step 3: Define runtime TypeScript contracts**

Create `src/life-station-types.ts`:

```ts
export type StationTier='ANCHOR'|'BRIDGE'|'ARCHIVE';
export type EvidenceState='VERIFIED'|'SUPPORTED'|'OWNER_REPORTED'|'REQUIRES_CONFIRMATION'|'VERIFIED_HISTORICAL'|'IN_PROGRESS'|'ASPIRATION'|'APPROVED';
export type VisualRole='ORIGINAL_PHOTO'|'HERO_FRAME'|'SOURCE_CAPTURE'|'PROPAGATION_MAP'|'DATA_MOMENT'|'OBJECT_MEMORY'|'EDITORIAL_COMPOSITION'|'ILLUSTRATIVE_ART';
export type InteractionMetricType='VIEW'|'REACH'|'IMPRESSION'|'LIKE'|'REACTION'|'COMMENT'|'SAVE'|'SHARE'|'REPOST'|'QUOTE'|'MIRROR'|'MEDIA_PICKUP'|'PAGE_PICKUP'|'SECONDARY_VIEW'|'SECONDARY_REACTION'|'SECONDARY_COMMENT'|'SECONDARY_SHARE'|'PROFILE_VISIT'|'DECLARED_ACTION'|'VERIFIED_OUTCOME';
export type StationEvidence={id:string;label:string;url:string;date?:string;tier:'A'|'B'|'C';confidence:'HIGH'|'MEDIUM'|'LOW';publicSafe:boolean};
export type StationMetric={type:InteractionMetricType;value:number;asOf:string;sourceId:string;scope:'OWNED'|'EXTERNAL'|'SECONDARY'};
export type PropagationEdge={id:string;from:string;to:string;kind:'REPOST'|'MIRROR'|'QUOTE'|'MEDIA_PICKUP'|'PAGE_PICKUP'|'CROSS_PLATFORM'|'CROSS_LANGUAGE';sourceId:string;asOf?:string;confidence:'HIGH'|'MEDIUM'|'LOW'};
export type StationVisual={role:VisualRole;src?:string;sourceUrl?:string;timestampSeconds?:number;alt:{he:string;en:string;ru:string};illustrative?:boolean};
export type LifeStation={id:string;era:string;years?:string;tier:StationTier;evidenceState:EvidenceState;domains:string[];themes:string[];title:{he:string;en:string;ru:string};summary:{he:string;en:string;ru:string};meaning:{he:string;en:string;ru:string};evidence:StationEvidence[];metrics:StationMetric[];edges:PropagationEdge[];visuals:StationVisual[];reflection?:{question:{he:string;en:string;ru:string};choices?:{he:string[];en:string[];ru:string[]}}};
```

- [ ] **Step 4: Build the canonical JSON from the approved 120-station map**

Populate `knowledge/life-stations-v1.json` with all LS-001…LS-120 records. Keep `unique_people_total: null`. For stations lacking final public proof, use empty evidence arrays plus the correct non-VERIFIED state; do not invent URLs.

- [ ] **Step 5: Re-run the check**

Expected: `life-stations ok: 120`.

- [ ] **Step 6: Commit**

```bash
git add knowledge/life-stations-v1.json scripts/check-life-stations-v1.mjs src/life-station-types.ts
git commit -m "feat: define granular life station model"
```

---

### Task 2: Add public-safety and provenance invariants

**Files:**
- Create: `scripts/check-life-station-public-safety.mjs`
- Modify: `package.json`
- Test: both new scripts through `check-all`.

**Interfaces:**
- Consumes `knowledge/life-stations-v1.json`.
- Produces a release-blocking gate for private URLs, synthetic-evidence misuse and unsupported totals.

- [ ] **Step 1: Write the failing safety check**

```js
import fs from 'node:fs';
const data = JSON.parse(fs.readFileSync(new URL('../knowledge/life-stations-v1.json', import.meta.url)));
const privatePatterns=[/docs\.google\.com\/.*\/d\//i,/drive\.google\.com/i,/mail\.google\.com/i,/localhost/i,/127\.0\.0\.1/i];
for (const station of data.stations) {
  for (const evidence of station.evidence || []) {
    if (privatePatterns.some(pattern=>pattern.test(evidence.url))) throw new Error(`private/internal URL in ${station.id}`);
    if (evidence.publicSafe !== true) throw new Error(`non-public evidence attached to public station ${station.id}`);
  }
  for (const visual of station.visuals || []) {
    if (visual.role === 'ILLUSTRATIVE_ART' && visual.illustrative !== true) throw new Error(`illustrative visual not labelled ${station.id}`);
    if (visual.role === 'HERO_FRAME' && (!visual.sourceUrl || typeof visual.timestampSeconds !== 'number')) throw new Error(`hero frame missing source/timestamp ${station.id}`);
  }
}
if (data.unique_people_total !== null) throw new Error('unique people total forbidden before dedup');
console.log('life-station public safety ok');
```

- [ ] **Step 2: Intentionally verify RED with one malformed fixture or temporary record**

Expected: failure naming the violating station.

- [ ] **Step 3: Fix the record and verify GREEN**

Expected: `life-station public safety ok`.

- [ ] **Step 4: Wire checks into `package.json`**

Add:

```json
"check-life-stations": "node scripts/check-life-stations-v1.mjs",
"check-life-station-safety": "node scripts/check-life-station-public-safety.mjs"
```

Insert both after influence/provenance checks in `check-all` and `lint` so `release:gate` inherits them through `ci:local`.

- [ ] **Step 5: Run**

```bash
npm run check-life-stations
npm run check-life-station-safety
```

Expected: both PASS.

- [ ] **Step 6: Commit**

```bash
git add scripts/check-life-station-public-safety.mjs package.json
git commit -m "test: gate life station provenance and privacy"
```

---

### Task 3: Implement interaction normalization and station ranking

**Files:**
- Create: `src/life-station-ranking.ts`
- Test: `src/life-station-ranking.test.ts` or repository mirror test if AppDeploy lacks a test runner.

**Interfaces:**
- Produces `scoreStation(station): StationScores` and `deriveTier(scores): StationTier`.
- Must never output or depend on a universal unique-person estimate.

- [ ] **Step 1: Write tests for ordering behavior**

```ts
import {scoreStation,deriveTier} from './life-station-ranking';

it('does not let raw likes dominate external redistribution plus life significance',()=>{
  const vanity=scoreStation({life:40,source:80,exposure:60,direct:100,external:0,secondary:0,crossPlatform:0,crossLanguage:0,persistence:0,outcome:0,visual:70});
  const cascade=scoreStation({life:95,source:90,exposure:65,direct:55,external:95,secondary:60,crossPlatform:80,crossLanguage:25,persistence:70,outcome:50,visual:65});
  expect(cascade.anchorPriority).toBeGreaterThan(vanity.anchorPriority);
});

it('keeps dimensions separate',()=>{
  const score=scoreStation({life:80,source:90,exposure:50,direct:60,external:70,secondary:30,crossPlatform:40,crossLanguage:20,persistence:25,outcome:10,visual:70});
  expect(score.exposure).toBe(50);
  expect(score.external).toBe(70);
});
```

- [ ] **Step 2: Implement the approved editorial weighting**

```ts
export type RankingInput={life:number;source:number;exposure:number;direct:number;external:number;secondary:number;crossPlatform:number;crossLanguage:number;persistence:number;outcome:number;visual:number};
export const scoreStation=(x:RankingInput)=>({
  ...x,
  anchorPriority:
    .24*x.life+.16*x.source+.12*x.exposure+.10*x.direct+.14*x.external+.06*x.secondary+
    .05*x.crossPlatform+.03*x.crossLanguage+.04*x.persistence+.04*x.outcome+.02*x.visual
});
export const deriveTier=(score:{anchorPriority:number})=>score.anchorPriority>=72?'ANCHOR':score.anchorPriority>=48?'BRIDGE':'ARCHIVE';
```

Thresholds remain editorial defaults and should be tuned only against the real station distribution, not to force a predetermined count.

- [ ] **Step 3: Verify tests**

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/life-station-ranking.ts src/life-station-ranking.test.ts
git commit -m "feat: rank life stations by evidence and interaction cascade"
```

---

### Task 4: Build authentic Hero Frame presentation

**Files:**
- Create: `src/HeroFrame.tsx`
- Modify: `src/IgorLivingRecordHome.tsx`
- Modify: `src/MediaFrame.tsx` if it already owns comparable poster behavior.
- CSS: `src/life-station-stream.css`

**Interfaces:**
- `HeroFrame({visual,title,sourceLabel})` consumes only `StationVisual` with `role:'HERO_FRAME'`.
- Source URL and timestamp are always user-visible one interaction away.

- [ ] **Step 1: Add compile-time prop contract**

```tsx
import type {StationVisual} from './life-station-types';
type HeroFrameProps={visual:StationVisual&{role:'HERO_FRAME'};title:string;sourceLabel:string};
```

- [ ] **Step 2: Implement the component**

Render `<figure>` with responsive `<img>`, source badge, timestamp (`mm:ss`), and source link. If the derived image fails, degrade to a text/source block; never substitute an unrelated generic Igor portrait.

- [ ] **Step 3: Replace raw YouTube `hqdefault.jpg` usage for priority interviews**

Start with the existing service/Channel 14, 2022 StartOn broadcast, elder-fraud follow-up and other verified video nodes already referenced by `IgorLivingRecordHome.tsx`. Each upgraded frame record must include its actual video source and timestamp before publication.

- [ ] **Step 4: Verify responsive behavior**

Manual checks at 390×844 and 1440×900: subject not clipped, badges readable, no overflow.

- [ ] **Step 5: Commit**

```bash
git add src/HeroFrame.tsx src/IgorLivingRecordHome.tsx src/MediaFrame.tsx src/life-station-stream.css
git commit -m "feat: present authentic interview hero frames"
```

---

### Task 5: Build PropagationPath for external reposts and media pickup

**Files:**
- Create: `src/PropagationPath.tsx`
- Create/modify: `src/life-station-stream.css`
- Modify: `src/HistoricalInfluence.tsx`

**Interfaces:**
- `PropagationPath({station})` consumes `station.edges`, `station.metrics`, `station.evidence`.
- Every node must be source-linked when a public URL exists.

- [ ] **Step 1: Define rendering grammar**

Canonical labels:

```ts
const edgeLabel={
  REPOST:'REPOST',
  MIRROR:'MIRROR',
  QUOTE:'QUOTE',
  MEDIA_PICKUP:'PRESS / MEDIA',
  PAGE_PICKUP:'DISTRIBUTION PAGE',
  CROSS_PLATFORM:'CROSS-PLATFORM',
  CROSS_LANGUAGE:'CROSS-LANGUAGE'
} as const;
```

- [ ] **Step 2: Implement a horizontal desktop / vertical mobile chain**

Each node shows source/platform, date when known, and only the metrics attributable to that node. Never sum them into a single reach label.

- [ ] **Step 3: First real cluster — fatherhood cascade**

Represent owned/original public story → external Facebook distribution → LinkedIn mirror → Hidabroot editorial pickup. Keep conflicting share count quarantined unless refreshed evidence resolves it.

- [ ] **Step 4: Second real cluster — elder fraud**

Represent original experience/story → external Instagram/public redistribution → TV/interview follow-up where source linkage is defensible.

- [ ] **Step 5: Update `HistoricalInfluence.tsx`**

Remove its standalone hardcoded `eras` metrics where equivalent station data exists. The historical view should become a filtered lens over life stations, not a competing dataset.

- [ ] **Step 6: Commit**

```bash
git add src/PropagationPath.tsx src/HistoricalInfluence.tsx src/life-station-stream.css
git commit -m "feat: visualize public propagation cascades"
```

---

### Task 6: Build the granular LifeStationStream

**Files:**
- Create: `src/LifeStationScene.tsx`
- Create: `src/LifeStationStream.tsx`
- Create: `src/life-stations.ts`
- Modify: `src/IgorLivingRecordHome.tsx`
- CSS: `src/life-station-stream.css`

**Interfaces:**
- `LifeStationStream({locale})` groups stations by era, tier and theme.
- `LifeStationScene({station,locale})` decides Anchor vs Bridge rendering.

- [ ] **Step 1: Seed runtime registry with all 120 IDs**

Copy from the canonical JSON/spec, but only attach public evidence/visual URLs already cleared for public runtime. Unsupported stations remain present with status labels and may stay Archive-only.

- [ ] **Step 2: Implement Anchor scene grammar**

Each Anchor scene renders:

```text
LIFE
→ authentic dominant visual
→ WHAT HAPPENED
→ PUBLIC RESPONSE (only attributable metrics)
→ PROPAGATION (if edges exist)
→ WHY IT MATTERS
→ SOURCE BRIDGE
→ optional visitor mirror
```

- [ ] **Step 3: Implement Bridge scene grammar**

Bridge scenes show title, year, one visual/source, concise meaning and optional interaction badge; they do not consume full viewport height.

- [ ] **Step 4: Implement Archive promotion link**

Archive-only records remain discoverable through the existing Deep Archive rather than bloating the first-visit stream.

- [ ] **Step 5: Replace the current seven-room index as primary spine**

Keep compatibility anchors (`#room-origin`, `#room-service`, etc.) mapped to era containers during migration, but the visitor sees a continuous station stream rather than seven equal menu rooms.

- [ ] **Step 6: Move LiveSocial and DeepArchiveRiver after the authored journey**

The current source snapshot renders `LiveSocial` and `DeepArchiveRiver` before the seven-room journey. Reverse this: authored life experience first, full public depth after it.

- [ ] **Step 7: Verify visual density**

At least 3 different visual roles must appear in the first 6 Anchor scenes; no repeated generic portrait substitution.

- [ ] **Step 8: Commit**

```bash
git add src/life-stations.ts src/LifeStationScene.tsx src/LifeStationStream.tsx src/IgorLivingRecordHome.tsx src/life-station-stream.css
git commit -m "feat: replace coarse rooms with granular life station stream"
```

---

### Task 7: Make the Companion station-aware

**Files:**
- Modify: `src/StoryCompanion.tsx`
- Modify: `src/JourneyReflection.tsx`

**Interfaces:**
- New query params: `journeyStation`, `journeyTheme`, `journeyChoice`.
- Existing `journeyChapter` remains supported temporarily for backward compatibility.

- [ ] **Step 1: Extend launch parsing**

```ts
const station=params.get('journeyStation');
const theme=params.get('journeyTheme');
const choice=String(params.get('journeyChoice')||'').slice(0,160);
```

- [ ] **Step 2: Build first message from explicit context only**

Example HE:

```text
פתחת את השיחה מתוך התחנה “לחזור לשכונה עם יותר כלים”. בחרת: “יש לי רעיון”. אפשר לבדוק למה זה תפס אותך או להפוך את זה לצעד אחד ממשי.
```

No inferred user fact may be stated beyond the explicit choice.

- [ ] **Step 3: Update URL cleanup on close**

Delete `journeyStation`, `journeyTheme` and `journeyChoice` along with legacy journey params.

- [ ] **Step 4: Keep local privacy semantics unchanged**

Do not send raw private archive data to the Companion. Station context contains only public station ID/title/theme and explicit user response.

- [ ] **Step 5: Commit**

```bash
git add src/StoryCompanion.tsx src/JourneyReflection.tsx
git commit -m "feat: hand life station context to companion"
```

---

### Task 8: Contextual relationships at exact life stations

**Files:**
- Modify: `src/ContextualRelationships.tsx`
- Modify: `src/relationship-registry.ts`
- Modify: `src/LifeStationScene.tsx`

**Interfaces:**
- Add optional `stationIds:string[]` to relationship records while preserving chapter mapping.

- [ ] **Step 1: Extend relationship shape**

```ts
stationIds?: string[];
```

- [ ] **Step 2: Map known relationships conservatively**

Examples:
- StartOn system → LS-060/061/062/068.
- Microsoft for Startups ecosystem → LS-069.
- President's Residence documented workflow/event → LS-070.
- Media publishers remain `MEDIA_COVERAGE`, not partnership.

- [ ] **Step 3: Render relationship rail only when it explains the station**

Do not create a homepage logo wall.

- [ ] **Step 4: Commit**

```bash
git add src/ContextualRelationships.tsx src/relationship-registry.ts src/LifeStationScene.tsx
git commit -m "feat: place verified relationships inside life stations"
```

---

### Task 9: Mobile, accessibility and performance QA

**Files:**
- Modify: `src/life-station-stream.css`
- Modify as needed: `src/global-nav.css`, `src/story-companion.css`, `src/journey-engine.css`

**Interfaces:**
- No new data API.

- [ ] **Step 1: Mobile visual pass**

Check 320, 375, 390, 430 CSS px widths. Required: no horizontal overflow, no cropped Hero Frame focal subject, no dock/Companion overlap, tap targets >=44×44 where practical.

- [ ] **Step 2: Desktop visual pass**

Check 1280×800 and 1440×900. Required: Anchor scenes retain editorial negative space; propagation paths remain readable without becoming data dashboards.

- [ ] **Step 3: Keyboard pass**

Tab through source links, station progression, propagation nodes, reflection buttons and Companion launch. Visible focus required.

- [ ] **Step 4: Reduced-motion pass**

`prefers-reduced-motion: reduce` disables non-essential transitions/scroll animation.

- [ ] **Step 5: Media-loading pass**

No autoplay. No bulk iframes. Poster/frame first; player loads only after user action.

- [ ] **Step 6: Build**

Run AppDeploy/Vite build and require zero TypeScript/Vite errors.

- [ ] **Step 7: Commit**

```bash
git add src/*.css src/*.tsx
git commit -m "fix: harden life station journey across mobile and desktop"
```

---

### Task 10: Release-gate and visual proof

**Files:**
- GitHub QA scripts/package already modified above.
- AppDeploy applied version after deployment.

**Interfaces:**
- Produces a release candidate only if data, provenance, build and visual checks pass.

- [ ] **Step 1: Run repository gates**

```bash
npm run check-influence-graph
npm run check-influence-provenance
npm run check-life-stations
npm run check-life-station-safety
npm run check-all
```

Expected: PASS for every command. If CI is the only executable environment, capture the workflow/job result instead of claiming a local pass.

- [ ] **Step 2: Build AppDeploy source**

Require Vite build PASS.

- [ ] **Step 3: Capture QA evidence**

Minimum proof set:
- mobile opening + first Anchor station;
- mobile propagation scene;
- mobile Hero Frame/source disclosure;
- desktop first 3 Anchor stations;
- desktop fatherhood cascade;
- Companion opened from a specific station.

- [ ] **Step 4: Strict pass/fail review**

Fail release if any of these occur:
- repeated generic Igor image where a real source exists;
- generated visual visually indistinguishable from evidence;
- external repost represented as owned reach;
- unsupported sum of cross-platform audiences;
- private Drive URL or raw private identity;
- fixed controls cover meaningful content;
- first visit again feels like an archive warehouse.

- [ ] **Step 5: Deploy only the verified candidate**

Record applied AppDeploy version and commit SHA together in release evidence.

- [ ] **Step 6: Commit release metadata**

```bash
git add public/release.json docs/
git commit -m "chore: record life station engine release evidence"
```

---

## Self-Review

### Spec coverage
- Granular 120-station structure: Task 1 + Task 6.
- Full interaction semantics including views/likes/comments/shares/reposts/journalists/global distribution pages: Tasks 1, 3, 5.
- External secondary engagement: Tasks 1 and 5.
- Hero Frames: Task 4.
- Deleted/blocked profiles: canonical registry + rendering in Task 6.
- Privacy/provenance: Task 2.
- Visitor handoff/Companion: Task 7.
- Contextual partnerships: Task 8.
- Mobile/accessibility/performance: Task 9.
- Evidence-first release proof: Task 10.

### Placeholder scan
No `TBD`, `TODO`, “implement later” or generic “add tests” steps remain. Stations without public proof are intentionally represented by explicit evidence states rather than fabricated placeholders.

### Type consistency
The plan consistently uses `LifeStation`, `StationVisual`, `StationMetric`, `PropagationEdge`, `StationTier`, `journeyStation`, `journeyTheme` and `journeyChoice`.

## Execution order

Recommended execution is Task 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10. Tasks 4 and 5 may be developed in parallel after Task 1, but integration into the homepage remains Task 6.
