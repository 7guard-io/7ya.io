# 7YA Impact Broadcast Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make 7ya.io communicate fifteen years of public impact through source-linked exposure, interaction and propagation evidence before exposing the archive machinery.

**Architecture:** Add a bundled presentation-safe impact view model derived from existing forensic and echo evidence, render it through a new cinematic `ImpactBroadcast` component immediately after the human hero, and preserve all existing deep routes. The component is independent of live APIs for its core evidence, while links point to public source objects.

**Tech Stack:** React 19, TypeScript, CSS, AppDeploy, existing `shared/media-impact.ts`, `src/echo-records.ts`.

**Spec:** `docs/superpowers/specs/2026-08-27-impact-broadcast-design.md`

## Global Constraints
- Never present 5.1B / 6.2B+ / 7B as verified total reach.
- Never combine source-local metrics into unique-person reach.
- Every displayed metric must keep scope, date and evidence label.
- HE/EN/RU required.
- Core impact rendering must not depend on NVIDIA or live APIs.
- Existing Story, Archive, Media, Research, Evidence and Digital Igor routes must remain reachable.

---

### Task 1: Add regression coverage for the new experience

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: current homepage and existing evidence data.
- Produces: user-visible acceptance contract for Impact Broadcast.

- [ ] Add a test requiring the homepage second screen to show `15 YEARS`, `14,670,621`, a dated non-unique exposure label, and a source-linked 5.1M Nawan story.
- [ ] Add assertions that 5.1B/6.2B/7B are never presented as verified totals.
- [ ] Add mobile assertions for 375×667 snap scrolling and unobstructed hero actions.
- [ ] Read back the test file and verify exactly one `[sanity]` marker remains.

### Task 2: Build a presentation-safe impact data model

**Files:**
- Create: `shared/impact-broadcast.ts`

**Interfaces:**
- Consumes: `forensicImpactLedger` from `shared/media-impact.ts`; source URLs and route facts reflected by `echo-records.ts`.
- Produces: `impactSignal`, `impactEras`, `platformFootprint`, `quarantinedImpactClaims`.

- [ ] Define explicit TypeScript types for signal metrics, era cards and platform snapshots.
- [ ] Encode only dated/source-scoped values already present in the evidence ledger.
- [ ] Keep 5.1B/6.2B+/7B in a quarantine array with `publicHeadline:false`.
- [ ] Verify every headline metric has `date`, `scope`, `verification` and `sourceLabel`.

### Task 3: Replace dashboard-style ImpactFrontDoor with Impact Broadcast

**Files:**
- Replace: `src/documentary-home/ImpactFrontDoor.tsx`
- Replace: `src/documentary-home/impact-front-door.css`

**Interfaces:**
- Consumes: `impactSignal`, `impactEras`, `platformFootprint`, `echoStories`, locale helpers.
- Produces: cinematic impact section with signal strip, era timeline, propagation story selector, platform footprint and evidence notes.

- [ ] Render large editorial figures as an evidence strip, not equal SaaS KPI cards.
- [ ] Add era navigation 2011→2026 with one public story/source per era.
- [ ] Add four selectable propagation stories from `echoStories` and expose node metrics/source URLs.
- [ ] Add platform snapshot rail with separate account metrics.
- [ ] Add a compact evidence boundary explaining non-unique counts and quarantined historical totals.
- [ ] Add responsive CSS for desktop cinematic layout and mobile snap rails.

### Task 4: Reorder homepage emphasis and copy

**Files:**
- Modify: `src/documentary-home/DocumentaryHome.tsx`
- Modify if needed: `src/documentary-home/documentary-home.css`

**Interfaces:**
- Consumes: new `ImpactFrontDoor` output.
- Produces: hero → impact → story → life → now → deep archive narrative.

- [ ] Keep hero human-first and reduce secondary system language above the fold.
- [ ] Ensure scroll cue targets impact.
- [ ] Ensure the gallery is explicitly framed as evidence/story after the impact section.
- [ ] Keep contact/evidence/watch actions visible on mobile.

### Task 5: AppDeploy verification and cutover

**Files:**
- AppDeploy update: only files changed above plus reconciled `tests/tests.txt`.
- GitHub export/receipt under `appdeploy-live/<snapshot>/` after successful deployment.

**Interfaces:**
- Consumes: branch implementation.
- Produces: production version + rollback receipt.

- [ ] Call AppDeploy deployment instructions and API SDK reference before deploy.
- [ ] Deploy the changed source and test files to app `697a008fddc309b142`.
- [ ] Poll until terminal status; fix validation/runtime errors before proceeding.
- [ ] Read back applied source and test contract.
- [ ] Verify public 7ya.io crawl exposes impact broadcast text/metrics.
- [ ] Merge the feature branch only after AppDeploy is `ready` with zero runtime errors.
