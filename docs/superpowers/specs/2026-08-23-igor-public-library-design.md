# Igor Public Library — Design

## Goal
Build one public, browseable digital library of Igor Vepretski that exposes the breadth of the existing 7YA public corpus instead of repeatedly reusing a small hero-photo pool.

## Product rule
The library is source-first and media-rich. Canon, Public Discovery, live public social surfaces, recovered/legacy objects and graph relationships may coexist in one experience, but their trust layers must remain visibly distinct.

## Data sources
1. `/api/corpus?surface=archive&limit=100` — canonical public records.
2. `/api/discovery-library?limit=300` — broad public discovery and live social traces, explicitly non-canonical.
3. `/api/visual-registry` — canonical media, source-preview imagery, approved public archive seeds and live social thumbnails.
4. `/api/public-internet-graph` — V5.1 nodes and relationship edges for echo/interaction context.

No private sources are used. No missing thumbnail, metric, person, relationship or date is invented.

## Library record
Every rendered library item resolves to a normalized client-side record with: `id`, `layer`, `title`, `summary`, `date`, `year`, `platform`, `publisher`, `mediaType`, `sourceUrl`, `imageUrl`, `trust`, `evidenceGrade`, `topics[]`, `relationships[]`, `canonicalId`.

Layers are exactly `CANON`, `DISCOVERY`, `LIVE`, `LEGACY`. Canon wins URL deduplication. Discovery never upgrades itself by visual prominence.

## Visual behavior
The default surface is a dense editorial media wall, not a hero-page redesign. A tile uses its own canonical media, source preview or live/discovery thumbnail. If no media exists, it uses a typographic source poster. It must never substitute one of the recurring Igor hero photographs merely to fill a gap.

The wall supports mixed card geometry but never collages multiple unrelated assets into one image. Each card represents one source-linked object.

## Navigation and filters
Route: `/library/` and `?page=library`.

Controls: free-text search, layer, media type, platform, year, topic and sort. A chronological year rail allows era navigation. Counts update from the currently loaded inventory.

## Item detail
Selecting a tile opens an in-page detail drawer/modal with its source media, source URL, layer/trust status, date, platform, topics, source-bound metrics when present, and V5.1 relationship labels/connected nodes. The original source remains one click away.

## Public Echo
For items with graph context, show the documented chain only from graph edges, including relationships such as `PUBLISHED_AS`, `AMPLIFIES`, `REDISTRIBUTED_BY`, `MIRRORED_BY`, `APPEARED_IN`, `SUPPORTED_BY`, `EVIDENCES`, `TRANSCRIPT_OF`, `LEGACY_OF`. Absence of an edge is shown as absence, not filled by narrative.

## Failure behavior
If one source API fails, the library remains usable from fulfilled sources and labels the inventory partial. If Canon fails completely, Discovery must not be relabeled as Canon. Broken images collapse to source posters.

## Integration
Add Library to GlobalNav and preserve existing Home, Museum, Media, Evidence, Research, Music and StartOn routes. Do not delete V4/V5/recovery layers.

## Acceptance
The live library must show a visibly diverse mixed-media inventory; Canon and Discovery filters; year/platform/media filters; a detail view; graph relationship context where available; direct source links; mobile usability with no horizontal overflow; and no repeated hero-photo fallback behavior.