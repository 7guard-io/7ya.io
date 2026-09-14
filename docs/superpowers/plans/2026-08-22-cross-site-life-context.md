# Cross-Site Life Context Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Connect Media, Music, Research, Museum and legacy Timeline to the canonical life-moment navigation model.

**Architecture:** Add one presentation-only canonical moment URL helper and teach Moment Engine to honor requested public corpus ids. Reuse existing PersonalChronology for Museum Full Album Mode and make only conservative source-backed cross-links from specialist surfaces.

**Tech Stack:** React 19, TypeScript, existing canonical corpus client, existing CSS, static HTML legacy route.

**Spec:** `docs/superpowers/specs/2026-08-22-cross-site-life-context-design.md`

## Global Constraints
- No backend, corpus, ingestion, database or schema changes.
- No invented images, dates, ages, places, metrics or biographical claims.
- Keep the default Moment Engine to eight anchors; add a requested non-anchor event only when it exists in the public corpus.
- Preserve all existing original-source links and credit boundaries.
- Exactly one acceptance test is marked `[sanity]`.

---

### Task 1: Canonical moment deep-link
**Files:** Create `src/life-album/moment-link.ts`; modify `src/life-album/MomentEngine.tsx`.
- [ ] Read `moment` from the current query string.
- [ ] Build the default eight anchors from the corpus.
- [ ] If requested id exists in the public corpus and is not an anchor, insert it and sort by `storyOrder`, then `canonicalDate`.
- [ ] Prefer requested id over localStorage and expand evidence when deep-linked.
- [ ] Preserve requested `moment` in URL while navigating previous/next inside a deep-linked session.

### Task 2: Specialist context controls
**Files:** Create `src/life-album/LifeContextLink.tsx`, `src/life-album/life-context-link.css`; modify `src/MediaPage.tsx`, `src/MusicRoom.tsx`, `src/ResearchPage.tsx`.
- [ ] Render one reusable localized context control.
- [ ] Media canonical records use their canonical ids; legacy mappings are explicit and conservative.
- [ ] Music links to `life-music-2025` without changing release dates.
- [ ] Research links to `research-collective-imagination-2026` without changing research status.

### Task 3: Museum Full Album Mode
**Files:** Modify `src/MuseumPage.tsx`, `src/museum-page.css`.
- [ ] Change museum framing from 2011—2026 to 1990—NOW.
- [ ] Add a `FULL ALBUM MODE` action.
- [ ] Reuse `PersonalChronology` as the uninterrupted canonical stream before thematic museum sections.

### Task 4: Legacy timeline consistency
**Files:** Modify `public/timeline/index.html`.
- [ ] Change framing to 1990→NOW.
- [ ] Add an origin/belonging station with explicit retrospective/public-source language.
- [ ] Preserve 2011 as the earliest press record, not the beginning of the biography.
- [ ] Keep the existing shared life-album bridge.

### Task 5: Verification
**Files:** `tests/tests.txt` already defines acceptance coverage.
- [ ] Verify snapshot source contains all new components/links and no backend diffs.
- [ ] Verify production reaches READY with zero frontend/backend/network errors.
- [ ] Report E2E status exactly; never claim E2E passed when the runner returns `not_found`.