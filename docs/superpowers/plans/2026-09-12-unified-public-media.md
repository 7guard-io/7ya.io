# Unified Public Media Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/media/` reuse the Public Projection archive stream while preserving the 91 curated `deepMedia` records as an editorial base.

**Architecture:** Add one frontend merge adapter that maps Public Projection objects into `DeepMediaItem`, normalizes source URLs, removes duplicates and appends unique projected media after the curated layer. Increase the existing projection response ceiling so the media room can consume the known archive in one request; `/library/` remains unchanged because it already uses Public Projection directly.

**Tech Stack:** React 19, TypeScript, AppDeploy frontend API client, existing `/api/public-projection` backend.

**Spec:** `docs/superpowers/specs/2026-09-12-unified-public-media-design.md`

## Global Constraints

- Keep the current AppDeploy production snapshot as the edit base.
- Preserve source URLs and provenance.
- Exclude profile-only objects from the media wall.
- Deduplicate by canonicalized public URL.
- Preserve all 91 curated records.
- Verify a visible merged count greater than 91 on `/media/`.

---

### Task 1: Expand Public Projection batch ceiling

**Files:**
- Modify: `backend/index.ts`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: existing `publicProjectionPayload(query)`.
- Produces: the same response contract with `limit` allowed up to 300.

- [ ] Change the Public Projection page-size clamp from 100 to 300 without changing filtering, ranking or pagination semantics.
- [ ] Keep the default limit at 60 for all callers that do not request a larger batch.
- [ ] Verify the media acceptance test names `/api/public-projection large batch` in Covers.

### Task 2: Add the unified media adapter

**Files:**
- Create: `src/unified-media-library.ts`

**Interfaces:**
- Consumes: `fetchPublicProjection({sort:'impact', limit:300})` and `deepMedia`.
- Produces: `loadUnifiedMediaLibrary(): Promise<UnifiedMediaSnapshot>`.

- [ ] Normalize tracking parameters and canonicalize YouTube IDs before deduplication.
- [ ] Map Public Projection media types/platform/source metadata into the existing eight `DeepMediaCategory` values.
- [ ] Exclude `profile` objects from the content wall.
- [ ] Merge curated records first and append only unique projected sources.
- [ ] Return merged count, known public total, source count and projection status.

### Task 3: Make Deep Media Library render the unified inventory

**Files:**
- Modify: `src/DeepMediaLibrary.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `loadUnifiedMediaLibrary()`.
- Produces: one user-visible merged library while preserving existing search, category, stage, play and source interactions.

- [ ] Initialize immediately with the 91 curated items so the room never renders empty.
- [ ] Replace the inventory with the merged snapshot after Public Projection resolves.
- [ ] Run search/category filters against the merged array.
- [ ] Show the merged item count separately from the 91 curated base.
- [ ] Keep source-linked video playback and public visual fallbacks intact.

### Task 4: Production verification

**Files:**
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: deployed `/media/` and `/api/public-projection`.
- Produces: release evidence that the 91-item ceiling is gone.

- [ ] Deploy once against the current applied snapshot.
- [ ] Wait for AppDeploy terminal `ready` status and inspect QA/frontend/backend/network errors.
- [ ] Confirm the applied source contains the unified adapter and production render path.
- [ ] Verify canonical `https://7ya.io/media/` is live and the user-visible test contract requires a merged count greater than 91.
