# Canonical Corpus Registry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build one canonical, provenance-first corpus API that represents Igor Vepretski's public life/content events and can become the single data contract for 7YA chronology, media, research, music and impact views.

**Architecture:** Add a focused `shared/canonical-corpus.ts` module containing the schema, validation helpers, stable seed records and query functions. Expose it through read-only backend routes first; keep the current homepage unchanged until the API contract and seed pass acceptance tests. Later, add an authenticated AppDeploy DB overlay for ingestion and connect frontend views to the same API without changing the schema.

**Tech Stack:** TypeScript, existing AppDeploy backend/router, existing AppDeploy database for future overlay, React/Vite frontend, AppDeploy E2E QA.

## Global Constraints

- Primary chronology is childhood → present.
- Every public event must carry date/date precision, type, source/provenance, verification state, visibility and media policy.
- Metrics require their own snapshot date and source; do not back-project current metrics into earlier eras.
- Do not fabricate reach, impact, capture dates, partnerships, endorsements or academic status.
- Default public API excludes restricted/private material.
- Real source media > press frame > video frame > document > explicit source-card; never generic repeated filler.
- Cross-posts and derivatives belong under one canonical event rather than being counted as independent life events.
- No homepage migration until corpus API acceptance is green.

---

### Task 1: Lock the corpus contract with failing acceptance tests

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Consumes: current production app.
- Produces: acceptance contract for `GET /api/corpus` and filtered corpus queries.

- [ ] Add a desktop test that opens `/api/corpus?limit=50` and requires `release`, `schemaVersion`, chronological public items, source arrays, verification state and dated metrics.
- [ ] Add a desktop guardrail test that opens `/api/corpus?type=research&verification=verified` and requires only public/research/verified records.
- [ ] Deploy tests only and confirm failure because `/api/corpus` does not exist yet.

### Task 2: Implement the canonical schema and seed

**Files:**
- Create: `shared/canonical-corpus.ts`

**Interfaces:**
- Produces: `CanonicalEvent`, `CanonicalSource`, `CanonicalMedia`, `CanonicalMetric`, `queryCanonicalCorpus()`, `canonicalCorpusSeed`, `CANONICAL_CORPUS_RELEASE`, `CANONICAL_CORPUS_SCHEMA_VERSION`.

- [ ] Define narrow enums for event type, date precision, verification state, visibility, media kind/authenticity and impact state.
- [ ] Add validation that rejects public metrics without `snapshotDate` and rejects source-less public events.
- [ ] Seed the verified chronology already represented in production: identity/1990s story, service retrospective, twenties retrospective, StartOn return 2022, public voice 2023, 2024 public-life/longform phase, 2025 life/music, 2025–2026 research, and 2026/NOW metrics.
- [ ] Keep unknown capture dates explicitly unset; use publication dates only when that is the fact actually known.

### Task 3: Expose a read-only backend API

**Files:**
- Modify: `backend/index.ts`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `queryCanonicalCorpus()`.
- Produces: `GET /api/corpus` and `GET /api/corpus/:id`.

- [ ] Import canonical corpus helpers.
- [ ] Implement `GET /api/corpus` with `type`, `verification`, `from`, `to`, `q`, and bounded `limit` filters.
- [ ] Default to `visibility=public`; never return restricted/private records through the public route.
- [ ] Return release, schema version, count, filters and chronologically sorted items.
- [ ] Implement `GET /api/corpus/:id`; return 404 for unknown or non-public records.
- [ ] Deploy and verify the new corpus tests pass alongside existing visual tests.

### Task 4: Add AppDeploy DB overlay without changing the public contract

**Files:**
- Create: `backend/corpus-store.ts`
- Modify: `backend/index.ts`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: canonical seed and AppDeploy `db`.
- Produces: merged read model and admin-only upsert path.

- [ ] Add `listCorpusOverlay()` and deterministic merge-by-id semantics; seed remains fallback/source baseline.
- [ ] Add authenticated+admin allowlisted `POST /api/corpus/admin/upsert` with strict field validation and no secret-bearing payloads.
- [ ] Ensure public GET output is unchanged when overlay is empty.
- [ ] Add a dry-run/admin authorization test path without exposing write access publicly.

### Task 5: Connect the life timeline to the corpus API

**Files:**
- Create: `src/canonical-corpus-client.ts`
- Modify: `src/life-first/PersonalChronology.tsx`
- Test: `tests/tests.txt`

**Interfaces:**
- Consumes: `GET /api/corpus`.
- Produces: chronology rendered from canonical events with a local fallback only for temporary API unavailability.

- [ ] Fetch canonical events and map localized title/summary, media, sources, metrics and tags.
- [ ] Preserve current visual QA guardrails and exact chronological order.
- [ ] Keep the current local chronology as temporary fallback until two consecutive green production deploys, then remove duplicated content.
- [ ] Verify desktop chronology, mobile 0 overflow/overlap/broken images and source-only media policy.

### Task 6: Reconcile source-of-truth and broaden ingestion

**Files:**
- Create/modify repository docs and ingestion manifests after AppDeploy→GitHub reconciliation.

**Interfaces:**
- Consumes: stable corpus API and Drive/public exports.
- Produces: repeatable ingestion batches with provenance and dedupe keys.

- [ ] Reconcile the complete AppDeploy snapshot to a non-main GitHub branch before claiming GitHub is canonical.
- [ ] Add batch manifests for Google Drive/public social exports; derive canonical event IDs and derivative links without duplicate inflation.
- [ ] Add review states `verified`, `inferred`, `requires-confirmation`; only verified public facts auto-surface in the main life stream.
- [ ] Run security/performance review and full visual QA before promoting GitHub as source-of-truth.

## Self-Review

- Spec coverage: chronology, media provenance, metrics snapshots, dedupe, privacy, visual policy, DB overlay and frontend migration are each mapped to a task.
- Placeholder scan: no TBD/TODO/implement-later placeholders.
- Type consistency: frontend and backend both consume the same canonical event contract; DB overlay merges by canonical `id` and does not fork the API shape.
