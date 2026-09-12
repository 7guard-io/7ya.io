# 7YA Master Experience v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current module-heavy 7YA homepage with one adaptive, cinematic, source-linked life journey and one all-network social enrichment pipeline that preserves the existing data/evidence systems.

**Architecture:** `MasterExperienceHome` is the public-home orchestrator. `LifeThroughline` remains the canonical journey spine. Existing social/public inputs are normalized into one social corpus view, deduplicated, scored separately for viral performance and biographical importance, and projected into the relevant life chapter through the Social Story Atlas. Direct connectors are preferred, recovery sources fill gaps, and provenance remains attached to every item. No second competing archive is introduced.

**Tech Stack:** React 19, TypeScript, existing 7YA locale helpers/content registries, existing AppDeploy frontend/backend APIs, existing social/meta ingestion, localStorage, IntersectionObserver, CSS, connector-backed source discovery where authorized.

**Spec:** `docs/superpowers/specs/2026-09-12-master-experience-v1-design.md`

## Global Constraints

- TIME IS THE OPERATING SYSTEM; do not introduce another parallel archive/timeline/graph.
- Social invariant: DIRECT FIRST → RECOVER EVERYTHING → DEDUPE → VIRAL SCORE + STORY SCORE → LIFE CHAPTER → MOMENT → SOURCE.
- A platform is a source, not the homepage information architecture.
- Viral Score and Story Score stay separate; never replace them with one global likes/views threshold.
- Real/source visuals before generated imagery.
- Canon, Discovery and evidence status must not be reclassified by the UI.
- Recovered content must remain explicitly recovered/public until stronger evidence exists.
- No new backend persistence for journey personalization.
- Mobile target: 375×667 with no page-level horizontal overflow and tap targets >= 42px.
- Respect `prefers-reduced-motion`.
- Preserve current source/evidence destinations and public social-feed transport.
- Use the currently applied AppDeploy snapshot as production source of truth and avoid overlapping production writers.

---

### Task 1: Create the master homepage orchestrator

**Files:**
- Create: `src/MasterExperienceHome.tsx`
- Create: `src/master-experience.css`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `useLocale`, `rootHref`, `pageHref`, `IgorHeroMosaic`, `LifeThroughline`, `LiveSocial`, existing `/api/social-feed` capability through existing components.
- Produces: default `MasterExperienceHome` React component used only for the public home route.

- [ ] Build a concise hero using an authentic existing Igor visual surface, identity statement, primary start/continue CTA and secondary evidence/current-work action.
- [ ] Render `LifeThroughline` immediately after the hero so chronology is the first substantive interaction.
- [ ] Add a compact NOW section after the journey with StartOn, current public work and live/public signals instead of restoring the previous wall of equal-weight homepage modules.
- [ ] Add a contextual Ask Igor closing section that clearly labels AI and links into the existing chat behavior.
- [ ] Route the public home branch in `src/App.tsx` to `MasterExperienceHome`, leaving `ConversionHome` available as rollback code but not rendered on the home route.

### Task 2: Evolve LifeThroughline into the adaptive journey spine

**Files:**
- Modify: `src/LifeThroughline.tsx`
- Modify/Create: `src/life-throughline.css`

**Interfaces:**
- Consumes: existing chapter copy, `deepMedia`, existing direct source links, `pageHref`, `rootHref`.
- Produces: chapter ids, visible progress UI, jump navigation, local explored state and continue recommendation.

- [ ] Give every canonical chapter a stable id (`origin`, `service`, `return`, `fatherhood`, `oct7`, `creation`, `now`).
- [ ] Read/write `7ya:journey:v1` localStorage as a JSON array of explored chapter ids; safely fall back to in-memory state if storage throws.
- [ ] Mark a chapter explored when it becomes meaningfully visible via IntersectionObserver or when its chapter navigation control is activated.
- [ ] Render a chapter progress rail showing 7 chapters, explored state, current progress and a start/continue action.
- [ ] Navigation controls scroll to the selected chapter with reduced-motion-aware behavior.
- [ ] Keep one dominant source visual/video per chapter and related media secondary.
- [ ] Preserve direct evidence/source actions and existing public-source status labels.
- [ ] Provide a deterministic next-unexplored recommendation without changing chronology.

### Task 3: Visual hierarchy, mobile and accessibility

**Files:**
- Modify: `src/master-experience.css`
- Modify: `src/life-throughline.css`

**Interfaces:**
- Consumes: semantic structure from Tasks 1–2.
- Produces: responsive editorial/cinematic presentation.

- [ ] Design a dark editorial canvas with strong type hierarchy and generous vertical rhythm, reusing existing site variables where available.
- [ ] Keep hero and each chapter visually legible as separate scenes rather than card walls.
- [ ] Make the chapter rail horizontally scrollable inside its own container on mobile without page overflow.
- [ ] Ensure buttons/links used as primary controls meet 42px minimum touch target.
- [ ] Add visible `:focus-visible` states.
- [ ] Add `@media (prefers-reduced-motion: reduce)` overrides that remove smooth/animated transitions.
- [ ] Keep below-fold images/video lazy and avoid autoplay.

### Task 4: Reconcile user-visible QA tests

**Files:**
- Create or replace: `tests/tests.txt`

**Interfaces:**
- Consumes: deployed public home UI.
- Produces: AppDeploy e2e coverage for the changed user-visible workflows.

- [ ] Test 1 [sanity], desktop: open home, start the journey, jump to a later chapter and verify the selected chapter heading/source action is visible. Covers: master hero, journey navigation, chapter rendering.
- [ ] Test 2, mobile 375×667: navigate the chapter rail and verify journey controls and chapter content remain usable without horizontal page overflow. Covers: responsive journey UI, mobile navigation.
- [ ] Test 3, desktop: explore a chapter, reload, and verify continue/progress reflects prior exploration. Covers: local journey persistence, return visit behavior.
- [ ] Test 4, desktop: open evidence/source action from a chapter and verify the user can reach an existing source/evidence destination. Covers: trust layer/source navigation.
- [ ] Test 5, desktop: verify contextual Ask Igor is clearly labelled as AI and opens the existing chat entry behavior. Covers: contextual AI entry, non-impersonation labelling.

### Task 5: Production release and verification

**Files:**
- AppDeploy snapshot update only for files changed above.

**Interfaces:**
- Consumes: currently applied AppDeploy production snapshot.
- Produces: one new applied AppDeploy version and a verified canonical 7ya.io result.

- [ ] Confirm immediately before deploy that the applied production version has not changed underneath this work; if it has, re-read changed target files and reconcile instead of overwriting.
- [ ] Deploy one coherent update through AppDeploy with only changed files.
- [ ] Poll deployment until terminal status and inspect validation, e2e, frontend/backend errors and QA screenshots.
- [ ] If QA fails, inspect the deployed snapshot and fix all related failures in one pass, then redeploy, maximum three automatic repair cycles.
- [ ] Verify the actual canonical `https://7ya.io/` user-visible experience on desktop and mobile after deployment rather than treating build success as completion.
- [ ] Record the applied AppDeploy version in the release summary so rollback is explicit.

### Task 6: Normalize all social sources into one source-fusion interface

**Files:**
- Modify: existing backend social/meta ingestion module(s) discovered in the current AppDeploy snapshot.
- Modify: existing shared social/public projection types or create one focused `shared/social-enrichment.ts` only if no equivalent shared type exists.
- Test: `tests/tests.txt` plus focused backend/source unit test if the current repository has a runnable unit-test harness.

**Interfaces:**
- Consumes: existing direct social connectors/APIs, `/api/social-feed`, public projection, canonical corpus, exports/recovered public traces.
- Produces: normalized `SocialEnrichmentItem` records with stable source/provenance fields.

Required normalized shape:

```ts
export type SocialSourceState = 'DIRECT' | 'PUBLIC' | 'RECOVERED' | 'CANON';

export type SocialEnrichmentItem = {
    id: string;
    platform: 'Instagram' | 'TikTok' | 'YouTube' | 'Facebook' | 'LinkedIn' | 'X' | 'Threads' | 'Telegram';
    account: string;
    sourceState: SocialSourceState;
    sourceUrl: string;
    publishedAt: string;
    title: string;
    mediaUrl?: string;
    thumbnailUrl?: string;
    metrics?: {
        views?: number;
        likes?: number;
        comments?: number;
        shares?: number;
        saves?: number;
    };
};
```

- [ ] Write a failing test proving duplicate URLs/native ids from two inputs collapse to one normalized item while retaining the strongest provenance.
- [ ] Run the test and confirm it fails because the normalized fusion behavior does not yet exist.
- [ ] Implement source normalization and canonical URL/native-id deduplication with deterministic precedence: `DIRECT` > `CANON` > `PUBLIC` > `RECOVERED` for source-state display only; do not rewrite evidence trust automatically.
- [ ] Add all known social surfaces to the platform enum and ensure unsupported/unrecognized surfaces are excluded rather than mislabeled.
- [ ] Run the focused test and existing build/tests; require zero failures before proceeding.

### Task 7: Add separate Viral Score and Story Score

**Files:**
- Create: `shared/social-scoring.ts` if no existing scoring module exists.
- Modify: social normalization/projection integration from Task 6.
- Test: focused scoring tests plus `tests/tests.txt` acceptance behavior.

**Interfaces:**
- Consumes: `SocialEnrichmentItem`, canonical life chapter definitions and any available platform/time cohort statistics.
- Produces:

```ts
export type SocialScores = {
    viralScore: number | null;
    storyScore: number;
    viralBasis: string[];
    storyBasis: string[];
};

export function scoreSocialItem(
    item: SocialEnrichmentItem,
    cohort: SocialEnrichmentItem[],
): SocialScores;
```

- [ ] Write failing tests proving a post with lower absolute likes can outrank another on Viral Score when it materially outperforms its own platform/time cohort.
- [ ] Write a failing test proving a low-metric but canonically important StartOn/service/fatherhood item can receive a higher Story Score than a high-view entertainment item.
- [ ] Run tests and verify the expected failures.
- [ ] Implement Viral Score as a normalized 0–100 score using only available metrics; calculate per-platform/time-cohort percentiles or robust normalized ranks and return `null` when no meaningful metric signal exists.
- [ ] Implement Story Score as a deterministic 0–100 editorial relevance score based on explicit chapter/topic/source/canon signals; do not use hidden personal data or fabricate semantic evidence.
- [ ] Store `viralBasis` and `storyBasis` so the score is explainable and debuggable.
- [ ] Run focused tests, then full build/tests, and require zero failures.

### Task 8: Project scored social moments into the Social Story Atlas and full archive

**Files:**
- Modify: `src/LiveSocial.tsx` or its successor Story Atlas component.
- Modify: `src/live-social.css` or successor stylesheet.
- Modify: existing archive/library social view if one already exposes social filters.
- Test: `tests/tests.txt`.

**Interfaces:**
- Consumes: normalized scored social items from Tasks 6–7 and canonical chapter ids from `LifeThroughline`.
- Produces: story-first chapter projection plus archive sorting/filtering.

- [ ] Write/update the user-visible acceptance test so the homepage shows `SOCIAL STORY ATLAS · ALL NETWORKS → LIFE`, seven chapter selectors, all known network surfaces and a source-linked dominant moment.
- [ ] Add a test/acceptance expectation that viral and story importance are presented as separate concepts where scores are available and no fixed “likes > N” rule appears as the canonical selector.
- [ ] Select the dominant chapter item by Story Score first, then use Viral Score/recency/source quality as deterministic tie-breakers.
- [ ] Select supporting traces to maximize cross-network diversity and chronological/contextual relevance rather than showing the next-highest raw metrics.
- [ ] Keep full-network archive/deep view available with filters/sorts for `Most Viral`, `Most Important`, `Newest`, `Most Discussed`, `Most Shared`, and `Recovered` when the underlying metrics/state permit them.
- [ ] Preserve direct source links, source-state labels and canonical/discovery boundaries in every rendered item.
- [ ] Verify desktop and 375×667 mobile layouts, including horizontal rails contained inside their components with no page-level overflow.
- [ ] Run deployment QA, inspect frontend/network/backend errors, and verify the canonical domain after release.
