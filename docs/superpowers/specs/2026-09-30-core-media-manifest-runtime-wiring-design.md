# Core Media Manifest Runtime Wiring — Design Lock

**Date:** 2026-09-30  
**Status:** Design approved in chat; written spec prepared for review  
**Runtime reference:** AppDeploy app `697a008fddc309b142`, applied/valid source snapshot `1790414230151`  
**Branch:** `feature/core-media-manifest-wiring-20260930`

## 1. Goal

Wire the normalized IGOR CORE media layer into the existing 7YA projection system without creating a second source of truth, without replacing the existing Evidence registry, and without introducing a new `/100moments/` route.

Locked flow:

`IGOR CORE → MEDIA MANIFEST → CANONICAL EVENT / LIFE SCENE → VISUAL PROJECTION → 7YA`

The runtime remains a projection layer. `IGOR_CORE_v2` remains the governing source layer for claims/evidence/relationships. META remains discovery only.

## 2. Non-goals

- No redesign of the site.
- No independent media service.
- No HTML-first content store.
- No mutation of existing `EV-*` evidence identifiers.
- No promotion of unresolved META discoveries into facts.
- No new `/100moments/` route; the existing `#album-journey` surface remains the 100 Moments projection.
- No Replit wiring for this feature.
- No DNS or custom-domain changes.

## 3. Namespace contract

Existing namespaces remain authoritative:

- `CL-*` — claims
- `EV-*` — evidence
- `A-*` — reusable public assets
- `PR-*` — projections
- `MEDIA-*` — media projection objects

Legacy META IDs such as `ev-013` are stored only as lineage metadata (for example `legacy_meta_id`) and must never be normalized, copied, uppercased, or rewritten into the Core `EV-*` namespace.

A runtime assertion must reject any manifest record whose canonical media ID does not match:

`^MEDIA-[0-9]{3,}$`

The adapter must never derive an `EV-*` identifier from `legacy_meta_id`.

## 4. Runtime placement

The feature attaches to the existing Life Scene compiler rather than bypassing it.

Current flow in snapshot `1790414230151`:

`backend/life-scenes.ts → readCanonicalCorpus() → compileLifeScenes() → projectLifeScenes() → IgorSceneEngine`

Target flow:

`readCanonicalCorpus()`  
`+ projectable MEDIA_MANIFEST entries`  
`→ media adapter overlays eligible media on matching canonical events`  
`→ compileLifeScenes()`  
`→ projectLifeScenes()`  
`→ IgorSceneEngine / AlbumHome / route projections`

The adapter is projection-time enrichment. It does not write back into the canonical corpus store.

## 5. Proposed components

### `shared/media-manifest.ts`

Defines:

- `MediaManifestRecord`
- `MediaProjectionState`
- `MediaEvidenceState`
- `MediaManifest`
- ID validation
- projection eligibility
- public-field sanitizer
- event/media matching helpers

Expected projection states:

- `READY`
- `READY_AFTER_SOURCE_URL_RECONCILIATION`
- `BLOCKED`
- `HOLD`

Only `READY` records enter the public projection automatically.

`READY_AFTER_SOURCE_URL_RECONCILIATION` remains excluded until the source URL is present and the record is explicitly promoted to `READY`.

### `shared/igor-core-media-manifest.ts`

Private runtime snapshot of the normalized media manifest used by the adapter. It is not itself a public API response.

The first implementation includes all 32 IDs so ID continuity is stable, while only records passing the projection gate may affect Life Scenes.

### `backend/life-scenes.ts`

Before calling `compileLifeScenes`, pass canonical public events through the media projection adapter.

The adapter may add eligible media refs to an event, but must not:

- change a claim truth state;
- change verification state;
- change source URLs already carried by the canonical event;
- create a canonical event from a media object alone;
- make a private event public.

### `shared/life-scenes.ts`

No architectural rewrite. Changes are limited to supporting the additional provenance metadata needed for media projection if required.

The existing safeguards remain:

- public events only;
- at least one safe public source required;
- unverified media excluded;
- deterministic scene compilation;
- existing source de-duplication preserved.

### Public JSON

If a public media-manifest endpoint or static JSON is exposed, it must be generated from a sanitizer and must not be a direct serialization of the private runtime manifest.

Public records may contain only fields explicitly approved for public projection, such as:

- `media_id`
- public label/title
- public `source_url`
- `published_at`
- public evidence/projection label
- destination/surface labels
- canonical public media URL when available

Internal/discovery/search fields are excluded.

## 6. Internal identifier leak gate

`meta_search_internal_id` is internal-only.

Hard rule:

- It may exist in private ingestion/discovery state.
- It may be used for de-duplication or reconciliation internally.
- It must never appear in public JSON, HTML, rendered `data-*` attributes, client-side state snapshots, public API payloads, page source, sitemap, feed, structured data, or error text.

QA must recursively scan serialized public payloads for:

- `meta_search_internal_id`
- case variants
- known internal META search-id prefixes, if any are present in source data

Any match is a release blocker.

## 7. Initial media policy

### MEDIA-025 — first control case

Chain:

`CL-013 → EV-016 → A025 → MEDIA-025 → YouTube jRjZjpqAgEw`

State: `READY`

Use:

- music projection
- Life Scene music/create lens
- album journey when the canonical event already exists

The YouTube release is the canonical source. Instagram/Reels remain distribution instances rather than source upgrades.

### MEDIA-029 — Journey hero candidate

Not projected until the original public `source_url` is reconciled and the record is promoted to `READY`.

Once ready, it may be prioritized as the visual for the relevant `now` / Journey Life Scene. It does not create or verify transcript claims by itself.

### MEDIA-013 — ROOT / CHILDHOOD

Must preserve the evidence label `PUBLIC_SELF_DISCLOSURE` and must not be rendered as `VERIFIED`.

No automatic projection until the real public source URL is attached and state becomes `READY`.

### MEDIA-026 — civic/public record

May support a documented public-activity scene only.

The adapter and copy layer must not infer from the image:

- office
- authority
- candidacy
- list placement
- endorsement

### MEDIA-027 — research context

Must remain `OWNER_AUTHORED_RESEARCH_CONTEXT`.

It may project authored research/media context but must not imply peer review, independent validation, institutional publication, or academic acceptance.

### MEDIA-001–012

Remain blocked until owned originals are supplied.

State remains `OWNED_ORIGINAL_REQUIRED` / `BLOCKED` and they are invisible to public projection.

## 8. Journey and 100 Moments surfaces

### `/journey/`

The current static gateway remains a gateway, but its primary visual entry should resolve into the Life Scene projection rather than carrying a parallel hard-coded media record.

MEDIA-029 becomes the hero only after it is eligible through the manifest gate.

### `#album-journey`

This remains the 100 Moments destination. No new route is created.

The Album experience reads Life Scenes / canonical projections, not raw manifest records.

## 9. Failure behavior

If the manifest fails validation:

- canonical corpus projection continues;
- invalid manifest rows are excluded;
- public routes remain available;
- no record is silently upgraded;
- the runtime may emit an internal diagnostic, but diagnostics must not leak internal IDs publicly.

If an eligible media URL fails at render time:

- IgorSceneEngine uses existing fallback behavior;
- the source-linked Life Scene remains intact;
- the broken visual must not remove the underlying source/evidence context.

## 10. QA gates

Release is blocked unless all pass:

1. Namespace: every media object uses `MEDIA-*`; no legacy META `ev-*` becomes `EV-*`.
2. Projection: only `READY` records can enter the public UI.
3. Blocked-state invisibility: `BLOCKED`, `HOLD`, `OWNED_ORIGINAL_REQUIRED`, `RECONCILE_REQUIRED`, and `READY_AFTER_SOURCE_URL_RECONCILIATION` do not render publicly.
4. MEDIA-025 control case appears through Life Scene projection with canonical YouTube source.
5. MEDIA-029 is absent until source reconciliation.
6. MEDIA-013 never displays a `VERIFIED` label.
7. MEDIA-026 copy/metadata contains no inferred title, candidacy, authority, or list placement.
8. MEDIA-027 contains no peer-review or independent-validation implication.
9. `meta_search_internal_id` does not appear anywhere in public output.
10. HE/RTL visual smoke.
11. EN visual smoke.
12. RU visual smoke.
13. Mobile smoke.
14. `prefers-reduced-motion` behavior remains respected.
15. Public source links return/resolve correctly where network QA supports checking.
16. Existing `/evidence/` remains intact.
17. Existing `/music/`, `/media/`, `/research/`, homepage and companion behavior regressions are absent.
18. No new `/100moments/` route is introduced.
19. No DNS/domain configuration changes.
20. No production promotion before preview/e2e/QA is green.

## 11. Test strategy

### Unit tests

Test the adapter as a pure function:

- accepts `MEDIA-*` IDs;
- rejects invalid canonical media IDs;
- never converts `legacy_meta_id` to `EV-*`;
- excludes non-READY states;
- requires source URL for projected records;
- sanitizes internal fields;
- does not mutate canonical event verification/truth properties;
- merges MEDIA-025 into the matching music event deterministically;
- leaves unrelated events unchanged.

### Projection tests

Extend life-scenes test coverage so:

- MEDIA-025 is visible through a music/create projection;
- the canonical event/source count remains valid;
- blocked media do not increase public scene/media counts;
- fallback behavior remains available if manifest parsing fails.

### Public leak tests

Recursively inspect:

- life-scenes API payloads
- any public media JSON
- generated HTML/static artifacts
- feed/sitemap/structured data where relevant

for `meta_search_internal_id` and other internal-only manifest fields.

### E2E / visual QA

Verify:

- Journey entry
- Album `#album-journey`
- music scene / MEDIA-025
- evidence navigation
- HE / EN / RU
- mobile
- reduced motion

## 12. Rollout

1. Implement on the isolated branch / new AppDeploy version.
2. Run unit and projection tests.
3. Deploy preview/new version only.
4. Inspect AppDeploy QA/e2e and runtime logs.
5. Run public leak scan.
6. Run visual smoke on Journey/Album/Music/Evidence.
7. Promote only after all gates pass.
8. Keep the previous valid AppDeploy version available for rollback.

No direct overwrite of a known-good production runtime without a validated version boundary.

## 13. Acceptance criteria

The work is complete when:

- the MEDIA namespace is wired into existing Life Scene projection without becoming a new master source;
- MEDIA-025 proves the full chain end-to-end;
- all unresolved/blocked media remain invisible;
- Journey and Album consume the existing projection path;
- Evidence remains untouched as a registry namespace;
- no internal META search ID is publicly observable;
- production can be promoted from a tested AppDeploy version with rollback available.
