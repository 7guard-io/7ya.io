# 7YA Personal Trust & Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the live 7YA homepage more personally Igor, more evidence-safe, and more effective at routing each visitor to a relevant next action through PERSON → PROOF → PURPOSE → PARTICIPATION.

**Architecture:** Preserve the current LifeFirstHome / Living Universe composition. Replace the homepage Echo's duplicated static factual store with a canonical-corpus adapter, add an explicit session-local visitor-intent layer, insert one reusable contextual handoff component after three high-evidence domains, and make the first visual wall derive distinct life-domain cards from canonical events rather than repeating one source event.

**Tech Stack:** React 19, TypeScript, Vite, AppDeploy frontend+backend runtime, `@appdeploy/client` for the existing `/api/corpus` endpoint, sessionStorage for non-sensitive session-local intent.

**Spec:** `docs/superpowers/specs/2026-08-18-7ya-personal-trust-conversion-design.md`

## Global Constraints

- Govern work by `DISCOVER → VERIFY → RESOLVE → MAP → RANK → CURATE → BUILD → QA → PUBLISH`.
- 7YA.io is an output of the canon; the website is not a research source for the canon.
- Personal model: `PERSON → PROOF → PURPOSE → PARTICIPATION`.
- Do not display a factual metric from a private / quarantined evidence record when its public claim is not approved.
- `VERIFIED`, `OWNER-REPORTED`, `INFERRED`, `UNKNOWN`, `DISPUTED`, and private evidence boundaries must remain distinct.
- No covert identity inference, sensitive-trait inference, political persuasion profiling, or hidden visitor scoring.
- Session personalization must work with storage unavailable and must not require contact details.
- No collage, generated historical evidence, or generic portrait fallback presented as event evidence.
- Hebrew, English and Russian must preserve the same canonical facts while allowing culturally natural copy.
- Preserve a deployable rollback version before production changes.
- Every production change must pass desktop + mobile + evidence-boundary QA.

---

### Task 1: Make the homepage Echo canonical and fail-closed

**Files:**
- Create: `src/canonical-echo.ts`
- Modify: `src/InfluenceUniverse.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `fetchCanonicalCorpus(limit:number, surface:string): Promise<CorpusResponse>` and `CorpusEvent` from `src/canonical-corpus-client.ts`.
- Produces: `buildCanonicalEcho(events:CorpusEvent[], locale:Locale): CanonicalEchoStory[]` and a visible `EVIDENCE SAFETY` state when canonical data cannot be loaded.

- [ ] **Step 1: Write the failing regression tests**

Replace the current RED-only test suite with a focused four-test suite. The trust sanity test must include:

```text
## Test 1 - Canonical Echo fails closed and hides quarantined metrics [sanity]
Viewport: desktop
Covers: GET /api/corpus, homepage Echo, evidence safety, public-claim quarantine
Description: Verifies the Echo is rendered from canonical corpus data and never falls back to duplicated or quarantined factual metrics.

QA Faults:
```json
[
  {
    "method": "GET",
    "path": "/api/corpus",
    "status": 500,
    "body_json": {"error":"simulated_corpus_failure"}
  }
]
```

Steps:
1. Open ?lang=en#echo.
2. Verify EVIDENCE SAFETY is visible and says canonical evidence is unavailable.
3. Verify the fatherhood 4.1K / 148 metrics and 213K metric are absent.

Expected: Echo fails closed, shows no duplicated factual fallback and exposes no quarantined 213K claim.
```

- [ ] **Step 2: Verify the test fails against the current snapshot**

Run the AppDeploy E2E suite against the current version `1787013930767`.

Expected: the current RED test fails because `InfluenceUniverse.tsx` imports static `echoStories` / `metrics` and renders them without a successful canonical-corpus read.

- [ ] **Step 3: Implement the canonical Echo adapter**

Create `src/canonical-echo.ts` with these exact public types:

```ts
import type {CorpusEvent,CorpusMetric,CorpusSource} from './canonical-corpus-client';
import type {Locale} from './locale';

export type CanonicalEchoNode={
  id:string;
  kind:'origin'|'distribution'|'media'|'response';
  label:string;
  date:string;
  source:string;
  url?:string;
  status:string;
  metric?:string;
};

export type CanonicalEchoStory={
  id:string;
  title:string;
  summary:string;
  image?:string;
  imageSource?:string;
  nodes:CanonicalEchoNode[];
};

export function buildCanonicalEcho(events:CorpusEvent[],locale:Locale):CanonicalEchoStory[];
```

The implementation must initially include only canonical events with evidence suitable for the live home selector:

```ts
const HOME_ECHO_IDS=[
  'fatherhood-viral-2023-02-20',
  'elder-fraud-2023-02-07',
  'starton-return-2022',
  'tiktok-owner-recap-2024'
] as const;
```

Rules:

```ts
const publicSources=event.sources.filter(source=>source.public);
const image=event.media.find(media=>media.kind==='image'&&media.url&&media.authenticity!=='unverified');
const metrics=(event.metrics||[]).filter(metric=>metric.verification==='verified'||event.verification.state==='owner-reported');
```

Group metrics by exact `sourceUrl`; do not sum across platforms. For `owner-reported`, render the status as `OWNER-REPORTED`, not `VERIFIED`.

Do not import or use `shared/media-impact.ts` quarantined owner-insights metrics in the homepage adapter.

- [ ] **Step 4: Replace static factual rendering in `InfluenceUniverse.tsx`**

Update `InfluenceUniverse.tsx` to:

```ts
import {useEffect,useMemo,useState} from 'react';
import {fetchCanonicalCorpus,type CorpusEvent} from './canonical-corpus-client';
import {buildCanonicalEcho} from './canonical-echo';
```

Use state:

```ts
const [events,setEvents]=useState<CorpusEvent[]>([]);
const [corpusState,setCorpusState]=useState<'loading'|'ready'|'failed'>('loading');
```

Fetch `fetchCanonicalCorpus(100,'archive')` once, derive stories with `buildCanonicalEcho(events,locale)`, and render:

```tsx
<section className='echo-evidence-safety' role='status'>
  <small>EVIDENCE SAFETY</small>
  <strong>{localizedSafetyCopy}</strong>
</section>
```

when `corpusState==='failed'`.

Remove the static `metrics` array and the homepage dependency on `echoStories`. Keep the public-surfaces directory as navigation metadata only; it must not contain metrics.

- [ ] **Step 5: Run the trust test**

Deploy the update through AppDeploy and poll to terminal status.

Expected: Test 1 passes; frontend/backend errors are empty; the Echo does not show `213K`.

- [ ] **Step 6: Commit the canonical Echo change**

```bash
git add src/canonical-echo.ts src/InfluenceUniverse.tsx tests/tests.txt
git commit -m "fix: make homepage echo canonical and fail closed"
```

---

### Task 2: Add explicit session-local visitor intent

**Files:**
- Create: `src/life-first/visitor-intent.ts`
- Modify: `src/life-first/UserHandoff.tsx`
- Modify: `src/life-first/LifeFirstHero.tsx`
- Create: `src/life-first/contextual-handoff.css`
- Test: `tests/tests.txt`

**Interfaces:**
- Produces: `VisitorIntent`, `readVisitorIntent()`, `writeVisitorIntent(intent)`, `clearVisitorIntent()`.
- `UserHandoff` consumes the intent store and produces a visible selected path plus one primary action.

- [ ] **Step 1: Add the personalization test**

Add:

```text
## Test 2 - Visitor chooses a personal path without giving private data
Viewport: desktop
Covers: PERSON → PARTICIPATION handoff, session-local explicit intent, no mandatory lead capture
Description: Verifies the visitor can choose why they are here and immediately receive a relevant next action.

Steps:
1. Open ?lang=he and use the hero action לבנות איתי.
2. In YOUR PATH choose the StartOn / youth opportunity path.
3. Verify the handoff visibly changes to a StartOn-specific next action and no name, email or phone field appears.
4. Navigate to another home section and return to YOUR PATH.

Expected: The selected path remains visible for the session and the site asks for no personal identity data.
```

- [ ] **Step 2: Verify the new test fails**

Expected: current hero routes directly to Creator Path and `UserHandoff` has only two generic actions with no explicit intent memory.

- [ ] **Step 3: Implement `visitor-intent.ts`**

Use this exact type:

```ts
export type VisitorIntent='story'|'collaborate'|'invite'|'starton'|'research'|'create'|'grow'|'archive';
export type VisitorIntentState={intent:VisitorIntent;selectedAt:string};
const KEY='7ya.visitor.intent.v1';
```

Functions:

```ts
export function readVisitorIntent():VisitorIntentState|null;
export function writeVisitorIntent(intent:VisitorIntent):VisitorIntentState;
export function clearVisitorIntent():void;
```

Use `sessionStorage` only. Wrap all storage access in `try/catch`; storage failure returns `null` and never blocks the UI.

- [ ] **Step 4: Upgrade `UserHandoff.tsx` into YOUR PATH**

Render eight localized intent buttons. After selection, show one visible sentence explaining the selected path and one primary action plus one secondary exploration action.

Intent destinations:

```ts
story -> '#life-chronology'
collaborate -> pageHref('create',locale)
invite -> pageHref('speaker',locale)
starton -> rootHref('starton/')
research -> rootHref('research/?lang='+locale)
create -> pageHref('create',locale)
grow -> pageHref('growth',locale)
archive -> pageHref('media',locale)
```

The component must say that selection is stored only for the current browser session and does not identify the visitor.

- [ ] **Step 5: Repoint the hero third action**

Change the hero `build` action from direct Creator Path navigation to `#your-path`. Preserve exactly three hero actions.

- [ ] **Step 6: Style and test**

Create `contextual-handoff.css` for the intent grid and selected path. Mobile at 375px must have no horizontal overflow; buttons stack or wrap without fixed overlays.

Run Test 2.

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/life-first/visitor-intent.ts src/life-first/UserHandoff.tsx src/life-first/LifeFirstHero.tsx src/life-first/contextual-handoff.css tests/tests.txt
git commit -m "feat: add explicit visitor intent to the life journey"
```

---

### Task 3: Add contextual participation handoffs after high-evidence domains

**Files:**
- Create: `src/life-first/ContextualHandoff.tsx`
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify: `src/life-first/contextual-handoff.css`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `writeVisitorIntent()` from `visitor-intent.ts`.
- Produces: `ContextualHandoff({context}:{context:'influence'|'research'|'starton'})`.

- [ ] **Step 1: Add the contextual-handoff test**

```text
## Test 3 - Evidence domains hand off to different relevant actions
Viewport: desktop
Covers: public influence, research, StartOn, contextual conversion
Description: Verifies the site does not repeat one generic sales CTA after unrelated material.

Steps:
1. Open ?lang=en and scroll through THE ECHO, LAB / RESEARCH and STARTON / RETURN.
2. After THE ECHO verify a handoff offers evidence exploration / public-information collaboration.
3. After LAB / RESEARCH verify a handoff offers research reading / discussion.
4. After STARTON / RETURN verify a handoff offers a youth-opportunity / StartOn continuation.

Expected: The three handoffs have different copy and destinations appropriate to their context; none uses urgency, fake scarcity or a generic Buy / Contact CTA.
```

- [ ] **Step 2: Verify the test fails**

Expected: the current page relies on generic JourneyBridge and a single final UserHandoff; domain-specific participation handoffs do not exist.

- [ ] **Step 3: Implement `ContextualHandoff.tsx`**

The component has three localized configurations. Each has:

```ts
type HandoffConfig={
  intent:VisitorIntent;
  eyebrow:string;
  title:string;
  body:string;
  primary:{label:string;href:string};
  secondary:{label:string;href:string};
};
```

On primary activation, call `writeVisitorIntent(config.intent)` before navigation.

Required semantics:

- `influence`: primary = build / create a public-information move together; secondary = continue evidence exploration.
- `research`: primary = discuss / work with the research; secondary = open research map.
- `starton`: primary = build an opportunity pathway for young people; secondary = open StartOn.

- [ ] **Step 4: Integrate handoffs into `LifeFirstHome.tsx`**

Use this order:

```tsx
<LifeFirstHero/>
<PersonalArchive/>
<PersonalChronology/>
<LifeGeography/>
<RightNow/>
<JourneyBridge bridge='life-echo'/>
<section id='impact'>
  <PublicActionStage/>
  <InfluenceUniverse mode='cinematic'/>
  <ContextualHandoff context='influence'/>
  <PostPortraitWall/>
  <CreateRoom/>
</section>
<JourneyBridge bridge='echo-lab'/>
<ResearchRoom/>
<ContextualHandoff context='research'/>
<JourneyBridge bridge='lab-starton'/>
<StartOnRoom/>
<ContextualHandoff context='starton'/>
<JourneyBridge bridge='starton-build'/>
<UserHandoff/>
<WorldRooms/>
<DeepArchiveRiver/>
```

`RightNow` moves before the Echo bridge to match the approved hierarchy: lived story → right now → public echo.

- [ ] **Step 5: Run Test 3 and regression tests**

Expected: Tests 1–3 pass; the hero still has exactly three actions; no canonical evidence state regresses.

- [ ] **Step 6: Commit**

```bash
git add src/life-first/ContextualHandoff.tsx src/life-first/LifeFirstHome.tsx src/life-first/contextual-handoff.css tests/tests.txt
git commit -m "feat: add contextual participation handoffs"
```

---

### Task 4: Replace repeated visual-wall moments with distinct canonical life domains

**Files:**
- Modify: `src/PostPortraitWall.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `fetchCanonicalCorpus(100,'archive')` and canonical `CorpusEvent.media`.
- Produces: a first-eight visual set with unique canonical event IDs and unique image URLs.

- [ ] **Step 1: Add the mobile visual-memory test**

```text
## Test 4 - Mobile visual memory spans distinct life domains
Viewport: mobile
Covers: canonical visual wall, deduplication, HE/EN/RU localization, no generic event fallback
Description: Verifies the first major visual wall represents different parts of Igor's life instead of repeating one viral article.

Steps:
1. Open ?lang=he and scroll to the visual wall.
2. Verify the first visible set includes distinct domains such as service / field, StartOn, fatherhood, public voice, retrospective / life, and later creation where canonical images exist.
3. Verify no three adjacent cards originate from the same fatherhood article and no failed source image becomes a generic Igor portrait presented as event evidence.
4. Switch to English and Russian and verify titles / source actions localize without horizontal overflow.

Expected: The wall reads as visual memory across Igor's life, not repeated decoration.
```

- [ ] **Step 2: Verify the test fails**

Expected: current `PostPortraitWall.tsx` contains `father`, `father-response`, and `father-comments` as three separate cards from one source event.

- [ ] **Step 3: Make the wall canonical-first**

Import `fetchCanonicalCorpus` and use this editorial ID order for the first set:

```ts
const canonicalVisualIds=[
  'service-field-2011-2021',
  'starton-return-2022',
  'fatherhood-viral-2023-02-20',
  'elder-fraud-2023-02-07',
  'public-voice-2023',
  'twenties-retrospective-2024',
  'identity-longform-2024',
  'life-music-2025'
] as const;
```

For each event select only:

```ts
const media=event.media.find(item=>item.kind==='image'&&item.url&&item.authenticity!=='unverified');
const source=event.sources.find(item=>item.public);
```

Deduplicate by `media.url` before rendering. If an event has no eligible image, omit the card rather than substituting a generic portrait.

Preserve manually curated broadcast frames only after the canonical first set, not ahead of it.

- [ ] **Step 4: Remove the three-card fatherhood repetition**

Delete `father-response` and `father-comments` from the primary wall data. Keep the canonical fatherhood event once.

- [ ] **Step 5: Run all four tests and inspect AppDeploy screenshots**

Expected:

- Test 1 trust gate passes.
- Test 2 explicit session intent passes.
- Test 3 domain-specific handoffs pass.
- Test 4 mobile visual memory passes.
- No frontend / backend errors.
- HE / EN / RU remain functional.
- No horizontal overflow at 375px.

- [ ] **Step 6: Production verification and rollback record**

Before deploy, record the current known-good version. Deploy once, poll until `ready` / `failed`, inspect the mobile and desktop QA screenshots, and verify `7ya.io` custom-domain status remains active.

If E2E or runtime QA fails, inspect the failed run, patch the smallest defect and redeploy. Do not leave production in an in-progress or RED-only test state.

- [ ] **Step 7: Commit**

```bash
git add src/PostPortraitWall.tsx tests/tests.txt
git commit -m "feat: diversify canonical visual memory"
```

---

## Plan self-review

- Spec coverage: PERSON is reinforced by the hero / home reweighting; PROOF by Task 1; PURPOSE by domain order / bridges; PARTICIPATION by Tasks 2–3; visual memory by Task 4.
- Trust gap found during planning: the public UI currently exposes an Instagram `213K` owner-insights metric while `shared/media-impact.ts` marks its exact public-post URL unresolved and `public_claim_ok:false`; Task 1 explicitly removes that homepage claim.
- Privacy: no new identity fields, persistent profile, sensitive inference or political targeting is introduced.
- Type consistency: `VisitorIntent` is defined once in `visitor-intent.ts` and consumed by both handoff components.
- Placeholder scan: no TBD / TODO / implementation-later steps.
- Scope: Creator Path pricing / CRM behavior is intentionally not changed in this slice; the home only routes to existing destinations.
- Rollback: existing AppDeploy version is preserved before publication.
