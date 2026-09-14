# 7YA Life Album Architecture Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn all public 7YA routes into lenses over one chronological personal life album while leaving enrichment and the data plane untouched.

**Architecture:** Reuse `life-first/PersonalChronology` as the canonical presentation spine on the current homepage. Add a lightweight global `LifeAlbumSpine` driven by static route context but linking into dynamically corpus-backed chronology chapters. Chronology-sensitive route collections are sorted oldest→newest without changing their source data.

**Tech Stack:** React 19, TypeScript, CSS, existing canonical corpus client, AppDeploy Vite runtime.

**Spec:** `docs/superpowers/specs/2026-08-22-life-album-architecture-design.md`

## Global Constraints
- No backend, corpus-store, shared canonical schema, ingestion, database, resolver or enrichment changes.
- No new SDK features or external dependencies.
- No invented dates, facts, images, metrics or relationships.
- Preserve HE/EN/RU and RTL.
- Preserve current public routes and source links.
- Do not commit/push GitHub in this execution.

---

### Task 1: Universal Life Album Spine
**Files:** Create `src/life-album/LifeAlbumSpine.tsx`; Create `src/life-album/life-album-spine.css`; Modify `src/App.tsx`; Test `tests/tests.txt`.
**Interfaces:** Consumes `view`, `locale`, `pageHref`; Produces universal route temporal context and links to `#life-*` anchors.
- [ ] Add failing regression specification for cross-route temporal context and mobile usability.
- [ ] Implement eight chronological stops and localized route context.
- [ ] Render the spine on public views only; home uses non-sticky mode, specialist routes use sticky mode.
- [ ] Verify runtime has zero frontend/network errors.

### Task 2: Restore Canonical Chronology to Current Home
**Files:** Modify `src/personal-internet/PersonalInternetHome.tsx`; existing `src/life-first/PersonalChronology.tsx` remains the data consumer; Modify `src/personal-internet/personal-internet.css` only if spacing requires it.
**Interfaces:** Consumes existing canonical corpus through `PersonalChronology`; Produces `#life-chronology` and `#life-*` anchors on current home.
- [ ] Add regression specification requiring 1990→NOW chronology before thematic abundance layers.
- [ ] Insert `PersonalChronology` after the present-day opening and before Broadcast/Reality layers.
- [ ] Preserve all existing Personal Internet layers and enrichment bindings.
- [ ] Verify anchor links resolve and no duplicate data fetch logic is introduced.

### Task 3: Chronology-first Media
**Files:** Modify `src/MediaPage.tsx`; Test `tests/tests.txt`.
**Interfaces:** Consumes existing `publicRecord` and graph publications; Produces deterministic oldest→newest browsing order.
- [ ] Specify chronological media ordering test.
- [ ] Sort featured press by extracted year ascending.
- [ ] Sort full public record by best available year ascending.
- [ ] Sort owned publications by canonical date ascending; order year filter ascending.
- [ ] Verify search/filter behavior remains intact.

### Task 4: Chronology-first Music
**Files:** Modify `src/MusicRoom.tsx`; Test `tests/tests.txt`.
**Interfaces:** Consumes current official-source arrays; Produces oldest→newest video/release sequence.
- [ ] Specify chronological music ordering test.
- [ ] Reorder official videos 2020 → 2022 → 2025.
- [ ] Reorder dated releases 2020 → 2024 → 2024 and keep undated catalog surface last.
- [ ] Verify all original official URLs and credits remain unchanged.

### Task 5: Verification and Safety
**Files:** `tests/tests.txt`; no backend files.
**Interfaces:** Validates home chronology, route spine, chronological media/music, mobile and canonical failure fallback.
- [ ] Build/deploy updated frontend snapshot.
- [ ] Poll AppDeploy to terminal ready/failed.
- [ ] Inspect frontend/network/backend errors and QA screenshots.
- [ ] Confirm backend source is unchanged from pre-refactor snapshot by source comparison of `backend/index.ts` head/imports and no backend file in deploy payload.
- [ ] Confirm `7ya.io` custom domain remains active.
