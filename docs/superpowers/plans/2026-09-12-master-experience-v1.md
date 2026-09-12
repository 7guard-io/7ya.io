# 7YA Master Experience v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current module-heavy 7YA homepage with one adaptive, cinematic, source-linked life journey that preserves the existing data/evidence systems.

**Architecture:** Add one homepage orchestrator, `MasterExperienceHome`, and evolve the existing `LifeThroughline` into the interactive journey spine instead of creating another chronology. Existing media, social feed, evidence and specialist routes remain content sources/deep destinations. Local browser storage tracks explored chapters only; no new backend persistence is introduced.

**Tech Stack:** React 19, TypeScript, existing 7YA locale helpers and content registries, `@appdeploy/client` for the already-existing public social-feed call, CSS, localStorage, IntersectionObserver.

**Spec:** `docs/superpowers/specs/2026-09-12-master-experience-v1-design.md`

## Global Constraints

- TIME IS THE OPERATING SYSTEM; do not introduce another parallel archive/timeline/graph.
- Real/source visuals before generated imagery.
- Canon, Discovery and evidence status must not be reclassified by the UI.
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
- Consumes: currently applied AppDeploy version `1789220279162` as the verified starting snapshot.
- Produces: one new applied AppDeploy version and a verified canonical 7ya.io result.

- [ ] Confirm immediately before deploy that the applied production version has not changed underneath this work; if it has, re-read changed target files and reconcile instead of overwriting.
- [ ] Deploy one coherent update through AppDeploy with only changed files.
- [ ] Poll deployment until terminal status and inspect validation, e2e, frontend/backend errors and QA screenshots.
- [ ] If QA fails, inspect the deployed snapshot and fix all related failures in one pass, then redeploy, maximum three automatic repair cycles.
- [ ] Verify the actual canonical `https://7ya.io/` user-visible experience on desktop and mobile after deployment rather than treating build success as completion.
- [ ] Record the applied AppDeploy version in the release summary so rollback is explicit.
