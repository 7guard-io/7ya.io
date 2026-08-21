# 7YA Content Empire Canonical Graph v3 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a typed, backward-compatible graph foundation that projects the live Canon v2 into one queryable content graph without creating a second source of truth.

**Architecture:** Canon v2 remains authoritative. `packages/content-graph` accepts Canon-v2-compatible events structurally and produces deterministic nodes/edges plus projections for posts, search, related content and coverage. It never upgrades verification strength, never aggregates cross-platform metrics, and never infers people/organizations/roles from prose.

**Tech Stack:** TypeScript 5.x, Node 22 built-in test runner, zero runtime dependencies.

**Spec:** User-approved `INFLUENCER CONTENT EMPIRE — MASTER EXECUTION COMMAND`; live AppDeploy Canon v2 `CANONICAL-CORPUS-20260821-1`.

## Global Constraints

- Canon v2 remains the single source of truth during migration.
- Graph projection is deterministic and side-effect free.
- Truth states map conservatively to `VERIFIED | STRONGLY_INFERRED | REQUIRES_CONFIRMATION`.
- Source-local metrics remain source-local; no cross-platform total is computed.
- Public graph projection only accepts public Canon events and public sources.
- No person, organization, role, place or achievement is inferred from prose.
- Related-event edges may only target explicit canonical ids.
- The package performs zero network calls and zero publishing.
- Production deployment remains behind the explicit 7YA deployment-chain gate.

---

### Task 1: Contracts and Canon v2 adapter

**Files:** `packages/content-graph/src/types.ts`, `packages/content-graph/src/canonical-v2.ts`, `packages/content-graph/test/content-graph.test.mjs`

- [x] Write failing tests first and observe the missing-module RED state.
- [x] Define graph contracts and conservative verification mapping.

### Task 2: Deterministic graph projection

**Files:** `packages/content-graph/src/project-canonical-v2.ts`

- [x] Project canonical event nodes plus public source, media and metric nodes.
- [x] Deduplicate source/media objects by deterministic canonical locator.
- [x] Add only explicit canonical `RELATED_TO` edges.
- [x] Exclude private Canon events and private sources.

### Task 3: Query and reusable projections

**Files:** `packages/content-graph/src/query.ts`, `packages/content-graph/src/projections.ts`

- [x] Query by kind, year, topic, platform, truth status and text.
- [x] Build `/posts` projection with source-local metrics only.
- [x] Build explicit-edge related-content traversal.
- [x] Build coverage rows: Known / Published / Missing / Weak / Unverified.

### Task 4: Build-gate integration

**Files:** `packages/content-graph/src/index.ts`, root `tsconfig.json`, root `package.json`

- [ ] Include package source in TypeScript build.
- [ ] Add `test:content-graph` and include it in the normal test gate without duplicate builds.
- [ ] Run local TypeScript compile and Node tests.

### Task 5: Migration boundary

**Files:** `docs/architecture/CONTENT_GRAPH_V3.md`

- [ ] Document Canon-v2 authority and v3 projection rules.
- [ ] Mark `media-corpus.ts`, `content-registry.ts` and hard-coded AI knowledge as migration targets, not sources of truth.
- [ ] Record runtime/GitHub alignment as a prerequisite for production integration.
