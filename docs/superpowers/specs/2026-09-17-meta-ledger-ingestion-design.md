# 7YA — Meta Ledger Ingestion & Projection Design

Date: 2026-09-17
Status: Approved architecture, implementation pending

## Purpose

Turn the reconciled Meta Scout ledger into a safe, build-time source for IGOR CORE without making Meta AI a runtime dependency and without allowing unverified social discoveries to mutate the public biography directly.

This design extends the existing rule:

PUBLIC SOURCES → INGEST → NORMALIZED PUBLIC CORPUS → PERSONAL PROJECTION SNAPSHOT → EXPERIENCES

The Meta ledger is one discovery source feeding that pipeline, not a second canon.

## Core Principle

Meta discovers. IGOR CORE resolves. 7YA publishes.

Canonical relationship model:

PERSON → EVENT → CLAIM → EVIDENCE → CREATIVE → DISTRIBUTION_ITEM → METRIC_CAPTURE

A new Instagram/Facebook post about an existing life event is normally a new source/distribution item, not a new life event.

## Rejected Approaches

### 1. Direct UI import from `knowledge/meta-source-ledger-20260917.json`
Rejected because a malformed or hallucinated Scout record could become public immediately.

### 2. Runtime dependency on Meta AI / Meta search
Rejected because platform availability, authorization and search behavior are outside 7YA control. Core public pages must remain functional when Meta is unavailable.

### 3. Build-time adapter + validated public projection
Selected. The raw ledger stays append-only in `knowledge/`; validation and reconciliation produce a safe projection consumed by presentation routes.

## Components

### A. Raw Ledger

Source:

`knowledge/meta-source-ledger-20260917.json`

Properties:
- append-only provenance layer;
- direct observed URLs only;
- no guessed URLs;
- search-internal Meta IDs explicitly marked as non-Graph identifiers;
- claims retain evidence status;
- sensitive self-disclosure remains attribution-bound;
- political material remains factual/archival.

The raw ledger must never be imported directly by public React components.

### B. Meta Ledger Reader

Target module:

`src/core/ingest/meta-ledger.ts`

Responsibilities:
- load the reconciled ledger at build time;
- validate top-level schema and required fields;
- reject or quarantine unknown reconciliation actions;
- reject records with constructed/unapproved source URLs;
- preserve null/UNKNOWN rather than inventing fields;
- normalize Meta search identifiers into `metaSearchInternalId` only.

No network calls.

### C. Reconciliation Adapter

Target module:

`src/core/reconcile/meta-to-core.ts`

Responsibilities:
- map ledger records to existing canonical events/claims/creatives where known;
- keep `CONTENT_CLUSTER` separate from `CREATIVE`;
- prevent repeated first-party posts from upgrading evidence status;
- preserve unresolved conflicts, especially `C005a` vs `C005b` police-duration claims;
- map BIZZI Instagram records to the existing canonical BIZZI creative and canonical YouTube source;
- classify each accepted record as one of:
  - `ADD_SOURCE`
  - `MERGE`
  - `KEEP_VERIFY`
  - `MEDIA_ONLY`
  - `DISCOVERY_ONLY`
  - rejected states remain non-public.

### D. Projection Builder

Target output:

`public/data/igor-meta-projection.json`

The projection contains presentation-safe objects only.

Each projected object should include, where available:
- `id`
- `canonicalId`
- `objectType`
- `platform`
- `account`
- `sourceUrl`
- `publishedAt`
- `mediaType`
- `title`
- `summary`
- `topics`
- `eventId`
- `claimIds`
- `creativeId`
- `evidenceState`
- `reconciliationAction`
- `metricCapture`
- `ownedOriginalRequired`
- `verificationNeeded`

Excluded from public projection:
- `REJECT_WRONG_SOURCE`
- `REJECT_WRONG_ENTITY`
- unresolved raw records without safe attribution
- search-system identifiers unless explicitly needed for provenance tooling
- sensitive private details beyond already-public attribution-safe summaries

### E. UI Selectors

Public routes should consume selectors over the projection rather than read the ledger directly.

Initial route policy:
- `/media/`: may consume `MEDIA_ONLY`, verified distribution records, and existing creative distributions.
- `/journey/`: may consume testimony sources linked to existing events; must not create new events from posts.
- `/evidence/`: only evidence objects that are `CANON_READY`, `CANON_READY_WITH_ATTRIBUTION`, or equivalent safe states. Compressed social copies remain leads when an owned original is required.
- `/100moments/`: may attach sources to existing moments; no automatic creation of moments from Meta discoveries.

Phase 1 implementation does not change layout/design. It only makes safe data available.

## Known Reconciliation Corrections

### BIZZI

Canonical creative already exists in 7YA.

Canonical YouTube source:
`https://www.youtube.com/watch?v=jRjZjpqAgEw`

Instagram Reel is a distribution event, not a new creative.

Rejected guessed URL:
`https://www.youtube.com/watch?v=BIZZI-premiere-2025-08-15`

### Police Duration

Keep two separate first-party claims until documentary resolution:

- `C005a`: Israel Police Tel Aviv District, 2015–2021 / approximately six years.
- `C005b`: separate first-party statement referring to 13 years in intelligence/security-related service.

Do not merge or publish a resolved duration without stronger evidence.

### Creative Splits

Posts sharing a person, location, language, political topic or visual style are not automatically the same creative.

Examples requiring separate creatives unless actual source identity is proven:
- Russian lip-sync posts with different underlying tracks/videos;
- boxing/performance video;
- Russian Israel news brief;
- Hebrew testimony monologue;
- rooftop photo sets;
- car Reel;
- Strategic Sedation research post;
- Israel Beitenu podium Reel;
- TV interview clip.

## Error Handling

Build should fail when:
- projection generation receives malformed JSON;
- a public record has a missing/invalid source URL where one is required;
- an unrecognized reconciliation action reaches public projection;
- a rejected source is projected;
- a `SELF_ATTESTED` or `FIRST_PARTY` claim is silently promoted to `VERIFIED_INDEPENDENT`;
- two different distribution items are merged into one creative without an explicit proven relationship.

Build should warn, not fail, when:
- public metrics are null;
- owned originals are still required;
- optional date precision is unavailable;
- a `DISCOVERY_ONLY` item is withheld from public projection.

## Tests

Add focused acceptance tests for:

1. Raw ledger parses successfully.
2. Rejected BIZZI guessed URL never appears in projection.
3. Canonical BIZZI YouTube URL remains `jRjZjpqAgEw`.
4. C005a and C005b remain separate and unresolved.
5. Meta search IDs never appear as Graph API IDs.
6. `SELF_ATTESTED` / `FIRST_PARTY` evidence state is not upgraded by repeated posts.
7. Different lip-sync/performance/news/testimony posts are not merged solely by broad content cluster.
8. `REJECT_WRONG_SOURCE` / `REJECT_WRONG_ENTITY` records never reach public projection.
9. Projection generation is deterministic and idempotent.
10. Existing public routes still build when Meta projection is empty or unavailable.

## Deployment Safety

This subsystem is additive.

Phase 1:
- create reader, reconciler, projection generator and tests;
- generate projection;
- do not alter public layout.

Phase 2:
- connect `/media/`, `/journey/`, `/evidence/`, `/100moments/` selectors incrementally;
- verify mobile/desktop and source links before deploy.

Meta remains off the visitor critical path in all phases.

## Success Criteria

The implementation succeeds when:
- the reconciled Meta ledger can be converted into a deterministic safe projection;
- no rejected/guessed source can become public;
- existing canonical events and creatives receive new provenance without duplication;
- evidence status and unresolved conflicts survive intact;
- the site can build and render without Meta connectivity;
- public UI remains unchanged until a separately verified projection-to-route integration is enabled.
