# 7YA Master Public Internet Graph V5 — Design

## Goal
Turn the existing event/source corpus into one additive relationship graph centered on Igor Vepretski, while preserving the V4 ledger as a raw recovery/source layer.

## Canonical chain
`Person → ContentObject → Moment → PublicationRecord / Evidence → Entity`

The public graph explicitly represents six node kinds: `Person`, `PublicationRecord`, `ContentObject`, `Moment`, `Entity`, and `Evidence`.

## Relationship rules
- `HAS_CONTENT`: Igor root → canonical content object.
- `LIVED_MOMENT`: Igor root → life/story moment.
- `ABOUT_MOMENT`: content object → moment.
- `PUBLISHED_AS`: content object → public publication/source record.
- `SUPPORTED_BY`: content object → evidence object.
- `EVIDENCE_POINTS_TO`: evidence → public source record.
- `AMPLIFIES`: an explicitly classified external repost → canonical content object.
- `INVOLVES`: moment → canonical person/place/institution entity.
- `CONNECTED_TO`: Igor root → canonical entity.
- `RELATED_TO`: explicit canonical event relationship.

## Evidence discipline
The graph must never infer that a platform mirror is the original publication unless the source type explicitly supports that claim. Verification status is propagated from the canonical corpus. V4 recovered/legacy URLs remain available without being promoted to verified canonical claims automatically.

## Compatibility
Existing `/api/graph`, `/api/graph/search`, museum, media, timeline, and `/internet/` behavior remain available. V5 is exposed through `/api/public-internet-graph` and `/api/public-internet-graph/search`. Existing graph search gains a V5 relationship context without changing its legacy `results` shape.

## Digital Igor
The existing `search_content_graph` agent tool becomes a V5 relationship search so answers can retrieve a source neighborhood containing moments, publications, evidence, and connected entities rather than a flat event list.

## Success criteria
1. API declares `schemaVersion: 5`.
2. All six node kinds exist when the corpus contains data for them.
3. `PUBLISHED_AS`, `ABOUT_MOMENT`, and `SUPPORTED_BY` relationships are present.
4. V4 `/internet/` recovery behavior is unchanged.
5. Existing routes remain backward compatible.
6. Public graph reads are source-bounded and never expose private documents or secret values.
