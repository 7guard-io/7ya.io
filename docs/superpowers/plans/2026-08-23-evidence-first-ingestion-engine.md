# 7YA Evidence-First Ingestion Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a strict evidence-first ingestion contract and protected commit adapter to the existing 7YA canonical corpus without replacing V4 or V5.

**Architecture:** A pure shared TypeScript normalizer validates the approved schema, classifications and 13 relationship edges. Backend routes expose a write-free normalization endpoint and an admin-only commit endpoint that maps the normalized node conservatively to the existing CanonicalEvent overlay; V5 then consumes the corpus as before.

**Tech Stack:** TypeScript, existing AppDeploy router/auth middleware, existing canonical corpus overlay, Public Internet Graph V5.

**Spec:** `docs/superpowers/specs/2026-08-23-evidence-first-ingestion-engine-design.md`

## Global Constraints
- Additive migration only; preserve V4 and V5 behavior.
- No private-source publication.
- Missing scalar values must remain `null`; do not hallucinate data.
- Evidence levels are exactly A/B/C/D.
- Publishing status is exactly VERIFIED/CORROBORATED/SELF-REPORTED/ARCHIVE LEAD/LEGACY/PENDING.
- Relationships are limited to the approved 13 edge vectors.
- Commit is admin-protected and uses the existing corpus overlay only.

---

### Task 1: Red acceptance gate
**Files:** Modify `tests/tests.txt`.
**Interfaces:** Requires `POST /api/ingestion/normalize` and verifies V5 compatibility.
- [x] Add an API acceptance test covering strict output fields, A/VERIFIED classification, unsupported-edge rejection, and V5 schemaVersion 5.
- [ ] Deploy the test before production implementation and verify the new route is absent/failing.

### Task 2: Pure ingestion contract
**Files:** Create `shared/evidence-first-ingestion.ts`.
**Interfaces:** Produces `normalizeEvidenceFirstNode(value)` and `toCanonicalEvent(node, storyOrder)`.
- [x] Define exact evidence, publishing-status and relationship enums.
- [x] Validate nullable source fields, public HTTPS canonical URLs and bounded text lengths.
- [x] Reject unsupported edges and inconsistent VERIFIED/CORROBORATED states for evidence D.
- [x] Normalize deterministically without inferring missing values.
- [x] Provide conservative CanonicalEvent mapping.

### Task 3: Backend routes
**Files:** Modify `backend/index.ts`.
**Interfaces:** Produces `POST /api/ingestion/normalize`, protected `POST /api/ingestion/admin/extract`, and protected `POST /api/ingestion/admin/commit`.
- [x] Import the pure normalizer/adapter.
- [x] Add write-free normalization route with 400 validation response.
- [x] Add admin-protected raw scrape/extract route.
- [x] Add dry-run commit behavior plus auth + admin allowlist for real commit.
- [x] Persist canonical publication only via `upsertCanonicalCorpus`; keep a separate ingestion audit record.
- [x] Bump backend release marker.

### Task 4: Green verification
**Files:** Modify `tests/tests.txt` only if the acceptance wording needs reconciliation with implemented behavior.
- [ ] Deploy implementation.
- [ ] Verify normalize success case and negative unsupported-edge case.
- [ ] Verify admin commit dry-run protection semantics.
- [ ] Verify `/api/public-internet-graph/summary` still reports schemaVersion 5.
- [ ] Verify runtime QA and frontend/backend/network error logs are clean before completion claim.
