# Igor Public Library Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a live, source-diverse Igor Public Library over the existing 7YA public corpus.

**Architecture:** Add a focused client-side library model that normalizes Canon, Discovery, Visual Registry and V5.1 graph responses into one deduped inventory. Render that inventory through a dedicated Library page with filters, timeline rail, mixed-media wall and item detail view. Existing APIs remain authoritative and unchanged.

**Tech Stack:** React 19, TypeScript, Vite, `@appdeploy/client` API transport, existing 7YA backend endpoints.

**Spec:** `docs/superpowers/specs/2026-08-23-igor-public-library-design.md`

## Global Constraints
- Public sources only.
- Canon and Discovery must remain visibly distinct.
- No invented media, metrics, dates or graph relationships.
- Canon wins duplicate URLs.
- Missing media uses a source poster, never a recurring hero-photo fallback.
- Existing V4/V5/recovery behavior remains intact.
- `/library/` and `?page=library` must resolve to the same native 7YA experience.

---

### Task 1: Library acceptance contract
**Files:** Modify `tests/tests.txt`
- [ ] Add a desktop workflow covering `/library/`, mixed source inventory, filters, item detail, relationship context and source link.
- [ ] Confirm current source lacks a Library route, establishing RED.

### Task 2: Normalize the public inventory
**Files:** Create `src/public-library-model.ts`
**Interfaces:** `loadPublicLibrary(): Promise<PublicLibraryPayload>` and pure normalization/dedupe helpers.
- [ ] Fetch Canon, Discovery, Visual Registry and V5.1 graph in parallel with `Promise.allSettled`.
- [ ] Normalize items into `PublicLibraryItem`.
- [ ] Deduplicate by normalized public URL with Canon priority.
- [ ] Attach visual candidates by canonical id/source URL and graph relationships by canonical id/node URL.
- [ ] Mark payload `partial` when any source fails.

### Task 3: Build the Library UI
**Files:** Create `src/PublicLibraryPage.tsx`; Create `src/public-library.css`
- [ ] Render editorial header with real inventory counts, not vanity metrics.
- [ ] Add search, layer/media/platform/year/topic filters and year rail.
- [ ] Render source-specific media wall with source-poster fallback.
- [ ] Add item detail drawer with source, trust, topics and graph relationships.
- [ ] Add direct original-source CTA and close/escape behavior.
- [ ] Ensure mobile grid/filter/detail behavior does not overflow.

### Task 4: Route and navigation integration
**Files:** Modify `src/App.tsx`; `src/GlobalNav.tsx`; `src/locale.tsx`; Create `public/library/index.html`
- [ ] Register `library` page/SEO handling.
- [ ] Add Library as the first archive/depth entry in GlobalNav.
- [ ] Add `/library/` compatibility bridge preserving `lang`.
- [ ] Preserve all existing routes and view behavior.

### Task 5: Verification
- [ ] Deploy changed files only.
- [ ] Poll until terminal AppDeploy status.
- [ ] Inspect frontend/backend/network errors.
- [ ] Verify the active source contains the Library route and page.
- [ ] Verify `7ya.io` custom domains remain active.
- [ ] Do not claim E2E pass if AppDeploy returns `e2e_tests: null`.