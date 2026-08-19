# 7YA Evidence Ledger — Evidence-First Canonical Claim Architecture

**Date:** 2026-08-19  
**Status:** Approved architecture; awaiting written-spec review  
**Owner:** Igor Vepretski / 7YA  
**Repository:** `7guard-io/7ya.io`  
**Design branch:** `design/evidence-ledger-20260819`  
**Production reference:** AppDeploy v100 / runtime `1787088330473`  
**Repository reference at design start:** `faf3b71924c25027c0256890ed2840db9c253e8c`

## 1. Decision

Adopt **Approach A — Hybrid Evidence SSOT**.

7YA will treat the Evidence Ledger as the canonical claim-resolution subsystem for public biographical, professional, research, organizational, metric, media, influence, and system claims.

The architecture is:

```text
Evidence Sources
      ↓
Normalize / Canonicalize
      ↓
Claim Graph + Evidence Graph
      ↓
Deterministic Conflict Resolver
      ↓
Approved Canonical Snapshot
      ↓
SHA-256 / chain integrity / optional Merkle snapshot root
      ↓
┌────────────┬───────────────┬──────────────┬──────────────┐
│ Public HTML│ JSON-LD       │ Research/UI  │ AI/RAG corpus│
└────────────┴───────────────┴──────────────┴──────────────┘
```

**The database is an authoring/control plane, not a public-rendering dependency.** Public pages must remain capable of rendering a Last Known Good canonical snapshot without requiring a live Supabase request.

The system must not create a third competing source of truth. AppDeploy production provenance, GitHub governance, and the canonical evidence snapshot must be reconciled deliberately.

## 2. Problem statement

7YA currently has the correct evidence-first direction but multiple partially overlapping representations:

- public narrative and biography;
- static evidence / ledger surfaces;
- the existing `packages/evidence-oracle` integrity primitives;
- History Song / canonical corpus records;
- research-object status rules;
- runtime AppDeploy content that may lead repository-root source;
- external public sources and OSINT findings.

Without a canonical claim layer, the same fact can be represented differently in HTML, JSON-LD, AI retrieval, research cards, biography text, social metrics, or historical records.

The Evidence Ledger must therefore answer one question consistently:

> What exactly may 7YA assert publicly about this entity, on what evidence, with what status, as of what time, and what happened to previous versions of that assertion?

## 3. Core invariants

### 3.1 One resolved claim, many projections

HTML, JSON-LD, AI corpus, research UI, evidence pages and downstream feeds must be projections of the same canonical claim resolution.

No public surface may maintain an independent hard-coded factual version of a material claim once that claim is covered by the Ledger.

### 3.2 Append-only correction history

Corrections do not delete provenance.

A material change creates a new event and, where appropriate, marks the prior resolution `SUPERSEDED` or `RETRACTED`. Historical states remain auditable unless retention is legally or ethically prohibited.

### 3.3 Fail closed for unsupported public assertions

If a claim cannot be safely resolved, the system must downgrade, omit, or explicitly mark uncertainty. It must never promote uncertainty into authority for presentation convenience.

### 3.4 Public runtime independence

A temporary database outage must not make the public site factually empty or unavailable. The public runtime consumes a deterministic approved snapshot.

### 3.5 Privacy by default

Knowledge of a fact does not imply authorization to publish it. Publication state is separate from epistemic confidence.

### 3.6 No ontology duplication

The existing 7YA evidence vocabulary remains authoritative for public verification state. OSINT source grades A–E are added as a separate dimension rather than replacing or duplicating those states.

## 4. Canonical ontology

The model separates **entities**, **claims**, **evidence**, **relationships**, **resolutions**, and **events**.

### 4.1 Entity

An entity is the subject or object of a claim.

Initial entity types:

- `PERSON`
- `ORGANIZATION`
- `EDUCATIONAL_ORGANIZATION`
- `ROLE`
- `PUBLICATION`
- `RESEARCH_OBJECT`
- `PROJECT`
- `METRIC`
- `MEDIA_OBJECT`
- `SOCIAL_ACCOUNT`
- `PLACE`
- `EVENT`
- `DATASET`
- `WEB_RESOURCE`

Entity IDs must be stable and independent of presentation labels.

Example:

```json
{
  "entity_id": "person:igor-vepretski",
  "entity_type": "PERSON",
  "canonical_name": "Igor Vepretski"
}
```

### 4.2 Atomic claim

A claim should be normalized as closely as practical to a subject–predicate–object/value structure.

```json
{
  "claim_id": "uuid",
  "subject_id": "person:igor-vepretski",
  "predicate": "founded",
  "object_entity_id": "org:starton",
  "claim_statement": "Igor Vepretski founded StartOn"
}
```

For literal facts:

```json
{
  "subject_id": "org:starton",
  "predicate": "initiative_inception_date",
  "value_date": "2020-07-01"
}
```

A single prose sentence may compile from several atomic claims.

### 4.3 Evidence source

An evidence source is the independently identifiable object from which support or contradiction is derived.

Required fields:

- stable source identifier;
- source type;
- canonical URL or internal artifact reference;
- publisher / issuer where known;
- observed or issued date where known;
- retrieval / ingestion timestamp;
- source hash for preserved artifacts where feasible;
- source visibility (`PUBLIC`, `PRIVATE`, `REDACTED`);
- source grade A–E;
- provenance metadata.

### 4.4 Claim–evidence relationship

Evidence is many-to-many with claims.

Relation values:

- `SUPPORTS`
- `CONTRADICTS`
- `QUALIFIES`
- `SUPERSEDES_SOURCE`
- `CONTEXT_ONLY`

This avoids the false assumption that one URL equals one proven claim.

## 5. Three independent epistemic axes

Do not collapse source quality, public wording status, and conflict resolution into one enum.

### 5.1 `evidence_grade`

OSINT/source-quality scale:

- `A` — primary official / authoritative record directly establishing the fact;
- `B` — strong independent or institutional database / archival source;
- `C` — self-attested, author-controlled, or credible but not independently dispositive source;
- `D` — secondary weak, indirect, incomplete, or derivative evidence;
- `E` — unverified lead, recollection, inference, or unresolved discovery artifact.

The exact source taxonomy may be extended, but the grade meaning must remain stable.

### 5.2 `verification_status`

Use the existing canonical 7YA vocabulary:

- `VERIFIED`
- `DOCUMENTED`
- `SELF_ATTESTED`
- `SOURCE_PENDING`
- `PRIVATE`
- `PILOT`
- `DESIGN`
- `MISSION`
- `ASPIRATION`

These statuses answer **what may be said and how it must be framed**, not merely how good one source is.

`verification_status` is a **resolver output**, not a mutable property duplicated on the base claim. The base claim stores what was asserted; the current and historical resolutions store how 7YA has evaluated that assertion.

### 5.3 `resolution_state`

Add a separate resolver state:

- `CANONICAL`
- `CONFLICTED`
- `SUPERSEDED`
- `RETRACTED`
- `WITHHELD`

These answer **where the claim sits in the current canon**.

A valid resolved combination may therefore be:

```json
{
  "evidence_grade": "C",
  "verification_status": "SELF_ATTESTED",
  "resolution_state": "CANONICAL"
}
```

This is intentionally different from claiming independent institutional verification.

## 6. Proposed relational model

Do not implement the system as one flat `evidence_ledger` table. Use normalized tables that support multiple evidence objects, contradictions and historical states.

### 6.1 `canonical_entities`

Minimum fields:

- `entity_id text primary key`
- `entity_type text`
- `canonical_name text`
- `alternate_names jsonb`
- `canonical_url text null`
- `metadata jsonb`
- `created_at timestamptz`
- `updated_at timestamptz`

### 6.2 `canonical_claims`

Minimum fields:

- `claim_id uuid primary key`
- `subject_id text references canonical_entities`
- `predicate text`
- `object_entity_id text null references canonical_entities`
- typed literal value columns or a validated value envelope;
- `claim_statement text`
- `valid_from timestamptz/date null`
- `valid_to timestamptz/date null`
- `publication_class text`
- `created_at timestamptz`

The implementation should prefer typed values for dates, numbers and booleans rather than storing every object as free text.

### 6.3 `evidence_sources`

Minimum fields:

- `evidence_id uuid primary key`
- `source_type text`
- `source_title text`
- `source_url text null`
- `artifact_ref text null`
- `issuer_or_publisher text null`
- `source_date timestamptz/date null`
- `retrieved_at timestamptz`
- `content_sha256 text null`
- `evidence_grade char(1)`
- `visibility text`
- `metadata jsonb`

### 6.4 `claim_evidence`

- `claim_id uuid`
- `evidence_id uuid`
- `relation text`
- `weight numeric null`
- `notes text null`
- composite primary key on claim/evidence/relation where practical.

### 6.5 `claim_resolutions`

Represents the current and historical resolver result.

- `resolution_id uuid primary key`
- `claim_id uuid`
- `resolution_state text`
- `verification_status text`
- `canonical_value jsonb`
- `public_wording jsonb`
- `resolver_policy_version text`
- `reason_codes jsonb`
- `resolved_at timestamptz`
- `supersedes_resolution_id uuid null`

A resolver decision must be explainable through evidence relationships and reason codes. No opaque scalar “truth score” is part of the canonical contract.

### 6.6 `claim_events`

Append-only state transition log.

- `event_id uuid primary key`
- `claim_id uuid`
- `event_type text`
- `previous_resolution_id uuid null`
- `new_resolution_id uuid null`
- `actor_type text`
- `actor_ref text null`
- `reason text`
- `created_at timestamptz`
- integrity-chain fields compatible with the existing Evidence Oracle.

### 6.7 `canonical_snapshots`

Immutable publication snapshots:

- `snapshot_id`
- `schema_version`
- `resolver_policy_version`
- `generated_at`
- `record_count`
- `payload_sha256`
- `merkle_root null`
- `source_commit_sha`
- `runtime_reference`
- `approval_state`
- `artifact_path`

## 7. Conflict resolver

The resolver is deterministic policy code, not an LLM opinion layer.

LLMs may assist discovery, normalization suggestions, candidate equivalence detection, or editorial explanation, but they must not silently promote claims into `VERIFIED` or `CANONICAL` without deterministic policy and admissible evidence.

### 7.1 Resolver pipeline

```text
NORMALIZE
→ IDENTIFY ENTITY
→ GROUP EQUIVALENT CLAIMS
→ ATTACH EVIDENCE
→ GRADE SOURCES
→ APPLY TEMPORAL SCOPE
→ DETECT CONTRADICTIONS
→ APPLY PREDICATE-SPECIFIC POLICY
→ RESOLVE OR MARK CONFLICTED
→ GENERATE CLAIM-SAFE WORDING
→ APPEND RESOLUTION EVENT
```

### 7.2 Predicate-specific resolution

Not all apparent contradictions are contradictions.

Example:

- `StartOn began in 2020`
- `StartOn was registered as an NGO in 2022`

These must normalize into different predicates such as:

- `initiative_inception_date`
- `legal_registration_date`

The canonical public sentence may then be generated from both:

> StartOn began as an initiative in 2020 and was formally registered as a nonprofit organization in 2022.

This is preferable to selecting one date as the winner.

### 7.3 Temporal resolution

Claims describing roles, metrics, affiliations, offices and statuses require validity windows.

A 2024 source proving a role in 2024 must not automatically imply that the role remains current in 2026.

### 7.4 Source precedence

Source grades guide but do not mechanically decide every claim.

A higher-grade source can be stale, scoped differently, mistaken, or describing a different predicate. Resolution requires:

1. entity match;
2. predicate match;
3. temporal match;
4. scope match;
5. source quality;
6. contradiction analysis.

### 7.5 Human approval boundary

The resolver may automatically resolve low-risk deterministic cases where policy is complete.

Material public claims involving sensitive biography, legal/financial matters, political titles, institutional partnerships, minors, security service details, health, or potentially defamatory assertions must require explicit publication authorization or remain withheld.

## 8. Publication classes

Publication safety is independent of truth confidence.

Use at minimum:

- `PUBLIC`
- `PERSONAL_SAFE`
- `REDACTED_PUBLIC`
- `PRIVATE`
- `WITHHELD_PENDING_APPROVAL`

A source may be private while a narrow derived claim is public-safe. The public artifact must never expose the private source contents merely because a claim was derived from them.

## 9. Existing Evidence Oracle integration

Do not create a second cryptographic implementation.

Extend `packages/evidence-oracle` so the existing primitives remain the integrity layer for:

- canonicalization;
- payload hash;
- metadata hash;
- chain hash;
- evidence record IDs;
- verification;
- Merkle snapshot/proof support where useful.

The current low-level `EvidenceRecord` remains an integrity record. The new claim graph is a semantic layer above it.

Recommended package boundaries:

```text
packages/evidence-oracle/
  src/
    canonicalize.ts        existing primitive
    crypto.ts              existing primitive
    record.ts              existing integrity record
    merkle.ts              existing snapshot primitive
    claim-types.ts         new semantic contracts
    evidence-types.ts      new semantic source contracts
    resolver.ts            deterministic resolver
    resolver-policy.ts     versioned policy
    snapshot.ts            canonical snapshot builder
    jsonld.ts              projection builder
    publication-policy.ts  privacy / public gating
```

Exact file decomposition may be adjusted during implementation to fit the runtime source after AppDeploy reconciliation.

## 10. Canonical snapshot contract

The canonical snapshot is the only artifact consumed by public rendering for Ledger-managed claims.

Example envelope:

```json
{
  "schemaVersion": "1.0",
  "resolverPolicyVersion": "1.0",
  "generatedAt": "2026-08-19T00:00:00Z",
  "snapshotId": "example-snapshot-id",
  "payloadSha256": "example-sha256",
  "merkleRoot": "example-merkle-root",
  "entities": [],
  "claims": [],
  "resolutions": []
}
```

Rules:

- deterministic ordering;
- canonical serialization before hashing;
- no private source payloads;
- no unresolved public claims unless intentionally represented as uncertainty;
- versioned schema;
- immutable artifact after approval;
- Last Known Good retained through deployment failure.

## 11. JSON-LD projection

JSON-LD must be compiled from canonical resolutions rather than maintained by hand.

### 11.1 Entity identity

Use stable `@id` values such as:

- `https://7ya.io/#igor`
- `https://7ya.io/#starton`

`sameAs` must only point to a page that unambiguously identifies the same entity. An organization registry page for StartOn must not be inserted into Igor's `Person.sameAs` merely because he founded the organization.

### 11.2 Organization / founder relationship

Represent StartOn as its own `Organization` / `NGO` entity and project a `founder` relationship to Igor only when the canonical claim authorizes it.

### 11.3 Roles

Use `Role` / `OrganizationRole` where role qualification, dates or `roleName` are required. Do not attach `roleName` arbitrarily to unrelated Schema.org entity types.

### 11.4 Education

Use `alumniOf` only where the claim is genuinely an alumni relationship. Attendance, study, affiliation, research activity, a course, or an incomplete program must not be converted into `alumniOf` unless the evidence and semantics support it.

### 11.5 Metrics

Do not emit cumulative audience or reach metrics into structured data merely because a number exists in biography copy.

A metric is eligible only after:

- platform/source identification;
- date/range definition;
- deduplication methodology where aggregation is involved;
- verification status;
- public wording approval;
- visible page representation consistent with the structured data.

### 11.6 Search-engine consistency

Structured data must represent the same material content visible to users. JSON-LD is a projection, not a hidden channel for stronger claims than the page itself makes.

## 12. Research-object integration

The Evidence Ledger becomes the enforcement layer behind the existing research-spine taxonomy.

A research object stores or derives:

- title;
- authorship;
- domain;
- research question;
- publication status;
- peer-review status;
- version/date;
- publisher/journal/repository where applicable;
- DOI or stable identifier where applicable;
- primary file/source;
- limitations/counterarguments;
- related field application;
- evidence IDs.

Public status labels remain explicit:

- `PEER REVIEWED`
- `PREPRINT`
- `WORKING PAPER`
- `CONCEPTUAL PAPER`
- `MONOGRAPH / BOOK`
- `ESSAY / PUBLIC THINKING`
- `RESEARCH PROGRAM`
- `FIELD PILOT`
- `PROTOTYPE / DESIGN`

`PEER REVIEWED` requires direct supporting evidence. Academia.edu presence, a public PDF, indexing, download counts, or an author-controlled profile are not sufficient substitutes.

## 13. Verifiable Credentials boundary

W3C Verifiable Credentials Data Model v2.0 is an optional future interoperability layer, not the internal database schema.

Use VC concepts where external machine-verifiable credentials provide value, for example an issued credential attesting a bounded claim. Do not turn every internal claim into a Verifiable Credential.

The internal Evidence Ledger remains broader because it must model disputed, self-attested, superseded, historical, inferred, private and partially verified claims that do not naturally fit an issuer–holder–verifier credential exchange.

VC 2.0 is the normative compatibility target. VC 2.1 may be monitored as a future draft but is not required for the initial contract.

## 14. Supabase role

Supabase is the recommended relational control plane if/when an authorized 7YA project is available.

At design time, the connected Supabase account exposes no project. Therefore this design does not assume an existing database or execute DDL.

When a project is available:

- add a new migration; do not rewrite `sql/001_init.sql` history;
- enable Row Level Security where client access exists;
- keep privileged ingestion/resolution operations server-side;
- prevent public clients from mutating verification/resolution fields;
- expose only publication-safe views or APIs;
- run security and performance advisors after DDL changes.

The database must never contain public-site secrets in snapshot artifacts.

## 15. Runtime / source-control reconciliation gate

Implementation must not begin by assuming repository root source equals production source.

The 2026-08-19 AppDeploy v100 receipt states that runtime source leads repository root for some production files. Therefore implementation order is:

1. inspect/export the exact v100 runtime source relevant to corpus/evidence/rendering;
2. compare it against the canonical GitHub branch;
3. reconcile deliberately without overwriting newer runtime behavior with stale root files;
4. implement the Ledger on the reconciled source base;
5. preserve an explicit rollback reference.

The Ledger must not become an excuse to reintroduce older UI or static metrics already removed from v100.

## 16. Public Ledger UX

`/ledger/` evolves from a conceptual shell into a human-readable audit surface.

Default public record should expose only publication-safe fields such as:

- canonical claim statement;
- verification label;
- source class;
- public source links where permitted;
- last verified date;
- resolution history where useful;
- superseded/corrected state;
- snapshot/hash metadata at an appropriate level.

The UX must remain understandable to non-technical visitors. Hashes and Merkle proofs support auditability but must not replace plain-language evidence explanation.

Recommended interaction:

```text
Claim
→ Status
→ Why this wording
→ Sources
→ History / correction
→ Technical integrity details (optional expansion)
```

Private source metadata must never leak through IDs, URLs, filenames, debug messages, or expandable technical views.

## 17. API boundary

If runtime APIs are used, separate authoring/resolution APIs from public snapshot delivery.

Suggested logical endpoints, subject to reconciled AppDeploy architecture:

- privileged ingestion: `/api/evidence/ingest`
- privileged resolution: `/api/evidence/resolve`
- public canonical snapshot: `/api/evidence/snapshot` or static artifact equivalent
- public claim lookup: `/api/evidence/claims/:id` only if safely required

The preferred public architecture remains static/build artifact first. A live public API is optional, not required for initial correctness.

## 18. CI / release gates

The repository already defines `npm run ci:local`, and `npm run release:gate` delegates to the local release gate. Evidence checks must be added into that deterministic chain.

Required new logical gates:

- `check:evidence-schema`
- `check:evidence-chain`
- `check:claim-resolution`
- `check:publication-policy`
- `check:canonical-snapshot`
- `check:jsonld`
- `check:structured-data-consistency`
- `check:no-private-evidence-leak`
- `check:no-unresolved-public-conflicts`
- `check:research-status`

Build/release must fail on conditions including:

- `SELF_ATTESTED` projected as `VERIFIED`;
- `SOURCE_PENDING` projected as settled public fact;
- `PRIVATE` evidence included in public snapshot;
- `PEER REVIEWED` without admissible supporting evidence;
- `sameAs` resolving to a different entity;
- material canonical claim without provenance;
- snapshot hash mismatch;
- chain-integrity mismatch;
- JSON-LD stronger than visible page wording;
- current-role claim sourced only by an expired historical period;
- contradictory canonical values with no explicit resolution.

## 19. Testing strategy

### Unit tests

Test:

- canonical value normalization;
- equivalent claim grouping;
- predicate separation;
- temporal validity;
- source-grade handling;
- status transitions;
- privacy filters;
- deterministic ordering and hashing;
- JSON-LD projection.

### Resolver fixtures

Create fixtures for known high-risk conflict classes:

- initiative date vs. legal registration date;
- cumulative security-service wording vs. specific role durations;
- education completion vs. study/affiliation;
- self-attested reach vs. dated platform exports;
- research upload vs. peer-reviewed publication;
- former role vs. current role;
- membership vs. partnership;
- project proposal/pilot vs. completed outcome.

### Snapshot tests

The same source dataset and resolver-policy version must generate byte-equivalent canonical serialization and therefore the same payload hash.

### End-to-end tests

At minimum verify:

- `/ledger/` renders with database unavailable;
- corrected claim visibly links to correction history;
- withheld/private evidence never appears;
- JSON-LD matches visible canonical wording;
- research status fails closed;
- AppDeploy runtime exposes the intended snapshot/build marker;
- rollback restores the previous Last Known Good snapshot.

## 20. Security and privacy threat model

Threats include:

- accidental PII publication;
- source URL leakage;
- malicious source ingestion;
- unsupported claim elevation;
- stale data presented as current;
- prompt-injection content inside ingested sources;
- tampering with historical records;
- hash-valid but semantically false claims;
- conflation of entity identities;
- public API enumeration of private claims.

Controls:

- strict allowlisted schemas;
- input treated as data, never executable instruction;
- publication-class gate;
- immutable event history;
- provenance hashes;
- server-side privileged writes;
- RLS where applicable;
- explicit entity IDs;
- temporal fields;
- deterministic resolver policy;
- human approval for sensitive classes;
- public snapshot minimization;
- no raw private source payload in public artifacts.

Cryptographic integrity proves that an approved record has not changed; it does **not** prove that the underlying factual claim is true. Truth status remains an evidence and resolution question.

## 21. Legacy footprint policy

Legacy cleanup is a separate downstream workflow.

Do not delete or alter external legacy pages merely to make the canonical narrative easier.

For each legacy source:

1. capture provenance if publication-safe and legally appropriate;
2. determine whether it is evidence, noise, outdated biography, duplicate identity, or privacy risk;
3. update the canonical claim resolution first;
4. then request correction/removal where justified;
5. preserve an internal correction event without republishing sensitive removed content.

The Evidence Ledger must document correction, not weaponize deletion as historical rewriting.

## 22. Rollout phases

### Phase 0 — provenance reconciliation

- reconcile AppDeploy v100 relevant source into a safe implementation base;
- identify existing corpus/evidence paths that must be adapted rather than duplicated.

### Phase 1 — semantic contracts

- add claim/evidence/resolution TypeScript contracts;
- add resolver-policy versioning;
- add deterministic fixtures/tests.

### Phase 2 — persistence

- introduce new database migration when an authorized Supabase project exists;
- add RLS/publication-safe views as required;
- import a deliberately small seed corpus of high-value disputed claims.

Initial seed domains:

1. identity / alternate names;
2. StartOn inception vs. registration;
3. education status;
4. service-duration wording;
5. research-publication status;
6. dated reach/interaction metrics.

### Phase 3 — canonical snapshot

- compile approved claims into deterministic snapshot;
- integrate Evidence Oracle hash/Merkle primitives;
- preserve Last Known Good artifact.

### Phase 4 — public projections

- power `/ledger/` from snapshot;
- project selected claims into biography/research/influence UI;
- generate JSON-LD from the same snapshot;
- maintain visible structured-data parity.

### Phase 5 — migration of remaining factual surfaces

Gradually replace independent hard-coded material claims with snapshot-backed projections.

Do not perform a risky full-site rewrite in one release.

### Phase 6 — legacy cleanup

Only after the canonical system is stable, address external stale/unsafe footprint items through a separate evidence-preserving process.

## 23. Acceptance criteria

The Evidence Ledger architecture is considered implemented only when all of the following are true:

1. A material public claim can be traced from rendered sentence to canonical `claim_id`.
2. The claim links to a resolver result and admissible evidence relationships.
3. Previous resolutions remain historically auditable where safe.
4. Public HTML and JSON-LD derive from the same canonical resolution.
5. Public rendering survives temporary database unavailability using Last Known Good.
6. Private evidence cannot enter the public snapshot.
7. Unsupported research status fails closed.
8. Historical roles do not silently become current roles.
9. Equivalent date claims can resolve into separate predicates rather than false contradiction.
10. Deterministic source data produces a deterministic snapshot hash.
11. `npm run ci:local` / `npm run release:gate` enforce the evidence invariants.
12. Production verification confirms the intended AppDeploy build/snapshot rather than merely a merged repository change.
13. Rollback is documented and tested.
14. No new source-of-truth plane is created outside the governed claim graph + approved snapshot pipeline.

## 24. Out of scope for initial implementation

- blockchain publication;
- mandatory external anchoring of every Merkle root;
- issuing W3C Verifiable Credentials for every claim;
- replacing all existing 7YA content in one migration;
- automated deletion of legacy web content;
- fully autonomous LLM adjudication of factual disputes;
- publishing private legal, financial, medical, family, minor-related, or security-sensitive source material.

## 25. Resolved design decisions

- **Storage:** relational claim/evidence graph, not one flat Ledger table.
- **Public dependency:** snapshot-first, not direct Supabase rendering.
- **Integrity:** reuse and extend Evidence Oracle.
- **Conflict resolution:** deterministic policy with explicit `CONFLICTED` state.
- **Evidence quality:** A–E source grade remains separate from 7YA verification status.
- **Corrections:** append-only events; no silent overwrite.
- **Structured data:** generated projection from canonical snapshot.
- **Research labels:** evidence-enforced, especially peer-review status.
- **VC standard:** optional interoperability layer; VC Data Model v2.0 target.
- **Deployment:** reconcile v100 runtime source before implementation.
- **Supabase:** recommended control plane, but no DDL until an authorized project is available.

## 26. Standards references

Implementation should validate against current primary documentation at implementation time:

- Schema.org `Person`, `Organization`, `Role`, `OrganizationRole`, `sameAs`, `alumniOf`, `founder`, `foundingDate`.
- Google Search Central structured-data introduction and general structured-data quality guidelines.
- W3C Verifiable Credentials Data Model v2.0 Recommendation (15 May 2025).
- W3C VC Data Model v2.1 only as a draft/watch item unless its status changes.

## 27. Governing principle

The target state is bidirectional traceability:

```text
PUBLIC SENTENCE
      ↓
canonical claim_id
      ↓
resolution
      ↓
supporting / contradicting evidence
      ↓
source + timestamp + provenance hash
      ↓
historical events
```

and:

```text
NEW EVIDENCE
→ normalized claim/evidence relation
→ deterministic resolver
→ approved canon
→ immutable snapshot
→ HTML / JSON-LD / research / AI corpus
```

**One governed truth model. Multiple projections. No silent factual drift.**
