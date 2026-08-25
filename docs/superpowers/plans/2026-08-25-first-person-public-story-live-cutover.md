# 7YA First-Person Public Story Live Cutover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the current 7YA homepage from a system-heavy archive into a beautiful, first-person, media-rich public story that a new visitor can understand within seconds.

**Architecture:** Keep the existing corpus, evidence graph, archive, search, research, media and Digital Igor capabilities intact behind the scenes. Replace the homepage hierarchy with one editorial journey: identity → current work → life story → public work/media → StartOn → research/creation → impact → explore everything → conversation. Technical vocabulary remains available only in deep/archive/evidence surfaces.

**Tech Stack:** React 19, TypeScript, Vite, existing AppDeploy frontend/backend snapshot, existing 7YA canonical corpus and media components.

**Spec:** User-approved direction in the active 2026-08-25 conversation: first-person story, real public media, universal human readability, no 100-post ceiling, evidence behind the story rather than in front of it.

## Global Constraints

- Homepage copy is first-person wherever Igor is speaking.
- No CANON / GRAPH / LEDGER / NODES / SYSTEM language in the primary visitor journey.
- Real public media and source links remain visible and contextual.
- No hard limit of 100 public content objects in the archive/content ingestion layer.
- Preserve HE / EN / RU behavior.
- Preserve deeper evidence/archive/search capabilities.
- Mobile must remain a first-class layout.

---

### Task 1: Replace the QA contract

**Files:**
- Modify: `tests/tests.txt`

**Produces:** QA requirements for a first-person hero, understandable story flow, media-rich public work, and mobile clarity.

- [ ] Write the new QA tests before production UI changes.
- [ ] Deploy tests-only and confirm the current homepage fails the new contract.

### Task 2: Rebuild the homepage entry hierarchy

**Files:**
- Modify: `src/life-first/AutobiographicalCinema.tsx`
- Modify: `src/life-first/autobiographical-cinema.css`

**Produces:** A human entry screen with Igor's identity, first-person introduction, clear current role/activity summary, and three simple visitor paths.

- [ ] Remove system vocabulary from above-the-fold navigation and messaging.
- [ ] Make the hero first-person and visually editorial rather than dashboard-like.
- [ ] Add a concise 'what I do now' strip immediately after the hero.

### Task 3: Reorder the long-form journey around story and media

**Files:**
- Modify: `src/life-first/AutobiographicalCinema.tsx`
- Modify: `src/life-first/autobiographical-cinema.css`

**Produces:** Story → public work/media → StartOn → culture → research → now, with deep technical layers deferred.

- [ ] Keep documented media adjacent to the life chapter it proves.
- [ ] Collapse deep digital history, master chronology and system internals below the human journey.
- [ ] Keep full archive/search entry points available near the end.

### Task 4: Remove the 100-item ceiling

**Files:**
- Modify: `src/life-first/HundredMoments.tsx`
- Modify: `src/life-first/hundred-moments.css` only if labeling/layout requires it.

**Produces:** An open-ended public-life atlas that does not cap the corpus at 100.

- [ ] Replace 100-item curation logic with deduped open-ended ordering.
- [ ] Raise/remove API request limits where supported and remove copy that treats 100 as a target.
- [ ] Keep filtering and source provenance.

### Task 5: Verify live and reconcile canonical source

**Files:**
- Modify the corresponding canonical GitHub source files to match the verified AppDeploy snapshot.

**Produces:** One consistent live homepage and canonical source state.

- [ ] Deploy to existing AppDeploy app `697a008fddc309b142`.
- [ ] Poll until terminal status and inspect QA screenshots/errors.
- [ ] Verify desktop and mobile tests.
- [ ] Mirror the exact verified files to `7guard-io/7ya.io` main so AppDeploy and canonical GitHub do not drift.
