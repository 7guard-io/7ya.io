# 7YA Global Content Spine — Implementation Plan

**Date:** 2026-09-07
**Status:** Runtime slice implemented in AppDeploy; GitHub portability layer in progress.

## Goal

Turn the existing 7YA canonical corpus into one deterministic operating map that connects public evidence to content worlds, audiences, HE/EN/RU publishing, distribution targets and conversion actions without creating a second source of truth.

## Runtime decision

The current AppDeploy v2 runtime already contains the strongest usable spine:

- `shared/canonical-corpus.ts` — source-bound multilingual canonical events
- `backend/corpus-store.ts` — seed + public register + writable DB overlay
- `shared/content-graph.ts` — graph projection
- `backend/evidence-ingestion.ts` — evidence-first normalization and commit gates
- public `/api/corpus`, `/api/graph`, ingestion and evidence routes

Therefore the fastest safe architecture is **extend, do not replace**.

## Implemented runtime slice

AppDeploy adds a deterministic `content-operating-map` projection with seven primary worlds:

1. LIFE
2. SERVICE
3. CIVIC
4. BUILD
5. IMPACT
6. CULTURE
7. RECORD

Each public canonical event projects to:

- primary and secondary worlds
- audiences
- HE / EN / RU locale availability
- intended distribution surfaces
- CTA class
- canonical corpus API URL
- public source URLs
- existing verification state

The projection is read-only and does not auto-publish externally.

Public surfaces:

- `/map/` — human-readable operating map
- `/api/content-operating-map` — machine-readable live projection
- `/api/corpus/:id` — canonical underlying record

## Safety boundaries

- Canon remains authoritative.
- Discovery does not become canon automatically.
- Private/restricted records never enter the public operating map.
- Existing verification states are preserved.
- No synthetic reach or engagement totals.
- No automatic social publishing.
- No private evidence document is exposed merely because it supports a public claim.

## Portable database phase

`sql/002_content_spine.sql` defines a provider-neutral PostgreSQL/Supabase-compatible storage model for future portability. It is not the current runtime source of truth.

Supabase project creation is intentionally deferred until a connected project/organization exists. Do not create a parallel live database before an explicit migration/reconciliation step.

## Expansion order

Do not pad the corpus to an arbitrary count. Expand through evidence-first ingestion in this order:

1. political/civic record
2. career and public service
3. StartOn
4. major media
5. highest-value social publications
6. life chronology
7. creative/music record

Target 100+ records only when each promoted record satisfies the canonical evidence contract.

## Release gates

Before any GitHub-to-production convergence:

1. export current AppDeploy runtime source
2. compare against `7guard-io/7ya.io`
3. reconcile runtime-only modules
4. run repository release gate
5. verify AppDeploy QA and custom domain
6. only then change canonical deployment ownership
