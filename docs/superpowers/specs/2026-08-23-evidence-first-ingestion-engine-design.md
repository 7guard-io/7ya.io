# 7YA Evidence-First Ingestion Engine — Design

## Goal
Operationalize the approved Public Internet Ingestion directive as an additive, evidence-first normalization layer behind the existing canonical corpus and Public Internet Graph V5.

## Pipeline
`DISCOVER → INGEST → VERIFY → RESOLVE → CONNECT → CURATE → VISUALIZE → PUBLISH`

The ingestion engine accepts one raw public record candidate at a time and emits one strict structured node. It must not generate flat biography narrative and must not infer missing facts.

## Data contract
Required output keys: `id`, `entity`, `aliases`, `date_published`, `date_observed`, `title`, `description`, `canonical_url`, `archive_url`, `publisher`, `platform`, `ownership_type`, `media_type`, `language`, `people`, `organizations`, `topics`, `location`, `evidence_level`, `publishing_status`, `relationships`, `Verification_Notes`.

Unknown scalar values are `null`; collection fields remain arrays and may be empty. Canonical URLs must be public HTTPS when present.

## Evidence classification
- `A`: institutional or platform proof of publication, registration, catalog identity, or official source existence.
- `B`: independent third-party media or publisher evidence.
- `C`: self-authored or owner-controlled public content.
- `D`: unverified claim, unresolved historical lead, or item lacking sufficient source proof.

## Publishing status
Exactly one of: `VERIFIED`, `CORROBORATED`, `SELF-REPORTED`, `ARCHIVE LEAD`, `LEGACY`, `PENDING`.

The engine does not upgrade `D` to `VERIFIED` or `CORROBORATED`. Missing canonical URL or unresolved provenance produces `ARCHIVE LEAD` or `PENDING` according to the submitted source state.

## Relationship contract
Only these edge vectors are accepted: `AUTHORED_BY`, `PUBLISHED_BY`, `APPEARED_IN`, `INTERVIEWED_BY`, `REDISTRIBUTED_BY`, `MIRRORED_BY`, `BELONGS_TO_PROJECT`, `PART_OF_PLAYLIST`, `TRANSCRIPT_OF`, `EVIDENCES`, `CONTRADICTS`, `SUPERSEDES`, `LEGACY_OF`.

Every edge has a non-empty target id/label. Unknown or invented edge types are rejected.

## Integration
1. `POST /api/ingestion/normalize` performs deterministic validation/normalization and never writes.
2. `POST /api/ingestion/admin/extract` is admin-protected and processes raw public URLs, transcripts or historical leads through scrape/extract before strict normalization.
3. `POST /api/ingestion/admin/commit` is protected by existing AppDeploy auth + the admin email allowlist. It records an append-style audit item, holds D/PENDING/ARCHIVE LEAD nodes from canonical publication, and maps publishable nodes conservatively into the existing canonical corpus overlay.
4. V4 remains untouched. V5 continues to project from the canonical corpus, so committed records become graph input without a second database or a replacement graph.
4. Private source values are never accepted for public commit. Publication is bounded to public HTTPS provenance.

## Mapping to canonical corpus
The ingestion node remains the provenance-rich contract. The commit adapter maps only fields the existing CanonicalEvent schema can represent safely: id, date, title/description, public source, platform/source kind, verification state, surfaces/tags, and source-bounded relationship ids where applicable. Fields not representable without semantic loss remain in the ingestion response rather than being invented into CanonicalEvent.

## Error handling
Normalization returns 400 for malformed core fields, unsupported evidence/status values, non-public canonical URLs, or unsupported relationship edges. Admin commit returns 400 for invalid candidates, 401/403 via existing auth middleware, and 500 only for bounded persistence failures.

## Compatibility
No route is removed or renamed. Existing `/api/corpus*`, `/api/graph*`, `/api/public-internet-graph*`, museum, timeline, media, discovery and Digital Igor behavior remain backward compatible.

## Success criteria
1. The normalize endpoint returns all required keys with `null` for missing scalar values.
2. A canonical StartOn/GuideStar sample can normalize as evidence A / VERIFIED without adding unapproved edges.
3. A legacy or unresolved lead cannot silently become VERIFIED.
4. Unsupported edge types are rejected.
5. Admin commit is protected and writes only through the existing canonical overlay.
6. Public Internet Graph V5 still reports schemaVersion 5 after the change.
