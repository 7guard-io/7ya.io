# 7YA Digital Compendium Design

## Goal
Promote the existing `IGOR VEPRETSKI — MASTER EVIDENCE LEDGER v1.0` into the canonical Digital Compendium without creating a competing source of truth.

## Canonical routing
- Narrative and claim authority remains `IGOR VEPRETSKI — MASTER CANON v1.0 — LIVING SOURCE OF TRUTH`.
- Evidence, control, and digital-activity catalog authority remains the existing `IGOR VEPRETSKI — MASTER EVIDENCE LEDGER v1.0`.
- Google Drive remains primary raw/document storage.
- GitHub stores schema, validators, versioned public snapshots, deployment receipts, and site projection code.
- Wisebase is a semantic retrieval/research layer, not a truth authority.
- Notion is an execution/decision layer, not a truth authority.
- Metricool is a telemetry/distribution source when networks are connected.
- 7ya.io is a public projection only; it must never become an independent truth store.

## New canonical ledger tables
### ACTIVITY_LEDGER
One row per real-world or digital activity/event/project milestone. Connects dates, people, organizations, projects, source records, publications, assets, evidence and public surfaces.

### CONTENT_MASTER
One row per original authored/created content object. Reposts, mirrors, translations, edits, syndication and media coverage link back to the same content record.

### ASSET_MASTER
One row per media/document asset. Stores source locator, platform/file identifiers, type, hash where available, date, people/activity/project links, rights, public-safety state and recommended use.

### RELATION_LEDGER
Typed edges between canonical IDs. Examples: PERSON participated_in ACTIVITY, PUBLICATION distributes CONTENT, ASSET depicts PERSON, EVIDENCE supports CLAIM.

### INGESTION_LOG
Append-only audit trail for ingestion runs, source systems, item counts, deduplication results, errors and verification state.

## Stable IDs
- Activities: `ACT-YYYY-NNNNNN`
- Content: `CNT-NNNNNN`
- Assets: `AST-NNNNNN`
- Relations: `REL-NNNNNN`
- Ingestion runs: `ING-YYYYMMDD-NNN`
Existing canonical IDs remain unchanged.

## Public projection gate
Only records satisfying all applicable conditions may reach the public corpus:
1. source/provenance present;
2. `PUBLIC_SAFE` or equivalent rights/privacy clearance;
3. claim/evidence status compatible with publication;
4. no unresolved `VERIFY_BEFORE_PUBLISHING` requirement;
5. time-varying metrics are represented as dated snapshots.

## Deduplication order
1. native platform/content ID;
2. canonical URL;
3. cryptographic content hash when bytes are available;
4. source+date+title/content similarity as a review candidate, never an automatic destructive merge.

## Data flow
`SOURCE SYSTEM -> INGESTION_LOG -> canonical record tables -> claim/evidence/publication gates -> versioned public export -> /api/corpus / bundled fallback -> 7ya.io projection`

No raw source is deleted after normalization. Historical duplicates remain preserved as provenance or distribution edges.

## Error handling
- Failed ingestions are append-only log entries and never silently discarded.
- Conflicting facts route to CLAIM_REGISTRY/CORRECTION_LOG and remain non-public until resolved.
- Missing telemetry does not block the underlying content record; metrics remain optional dated snapshots.
- Site projection must retain its existing bundled fallback if the runtime corpus endpoint is unavailable.

## Acceptance tests
1. All five new ledger tabs exist with frozen header rows and explicit schemas.
2. A seed activity can link to content, asset and source IDs through relations without duplicating the original object.
3. Public-export validator rejects records lacking provenance or public-safety clearance.
4. Public-export validator accepts a compliant record and preserves dated metric snapshots.
5. Runtime/public corpus failure leaves the existing bundled projection populated.
6. Canonical routing documentation explicitly names MASTER CANON and MASTER EVIDENCE LEDGER as the only two authorities.
