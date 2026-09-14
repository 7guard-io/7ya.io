# 7YA Master Public Internet Graph V5 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an additive V5 public relationship graph that connects Igor, canonical content, life moments, publication records, entities and evidence without replacing the V4 recovery ledger.

**Architecture:** Project V5 from the existing canonical corpus and canonical entity registry. Keep legacy APIs and `/internet/` intact; expose new V5 APIs and route Digital Igor retrieval through the richer graph.

**Tech Stack:** TypeScript, AppDeploy backend router, React/Vite frontend, existing canonical corpus/entity registries.

**Spec:** `docs/superpowers/specs/2026-08-23-master-public-internet-graph-v5-design.md`

## Global Constraints
- Additive migration only; no V4 deletion.
- No private source publication.
- No secret values in source or responses.
- External repost does not imply original-source ownership.
- Existing `/api/graph*` response compatibility must be preserved.

---

### Task 1: Relationship projector
**Files:** Create `shared/public-internet-graph.ts`; modify `shared/canonical-corpus.ts`.
**Interfaces:** Produces `projectPublicInternetGraph(events)` and `searchPublicInternetGraph(events, query)`.
- [x] Define six public node kinds and typed edge kinds.
- [x] Project Person → ContentObject → Moment.
- [x] Project PublicationRecord and Evidence separately.
- [x] Connect canonical entities to related moments.
- [x] Preserve verification state and source URLs.
- [x] Raise internal graph read capacity above the old 100-record projection ceiling.

### Task 2: Backend API compatibility
**Files:** Modify `backend/index.ts`.
**Interfaces:** Produces `GET /api/public-internet-graph`, `/search`, `/summary`; preserves `/api/graph*`.
- [x] Add V5 routes.
- [x] Keep legacy result shape and attach V5 context to legacy graph search.
- [x] Route Digital Igor graph retrieval through V5.
- [x] Bump the backend release marker.

### Task 3: Human-facing graph handoff
**Files:** Modify `src/ContentGraphPortal.tsx`.
- [x] Replace system-first copy with Igor → life → content → people → evidence framing.
- [x] Preserve the existing search action and coverage display.

### Task 4: Acceptance test
**Files:** Modify `tests/tests.txt`.
- [x] Require schemaVersion 5, all canonical node layers and core relationship types.
- [x] Reconfirm museum and V4 recovery behavior remain intact.
- [ ] Deploy and verify runtime, QA and error logs.
