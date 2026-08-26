# 7YA Documentary Home Reset — Design

## Objective
Replace the current stacked homepage experience with one coherent, visual, source-linked documentary front door while preserving the existing public corpus, public projection API, archive routes, evidence boundaries and NVIDIA-backed Digital Igor.

## Root cause
The homepage accumulated multiple independent experience systems, global overlays and CSS cutovers. The visitor encounters product/system vocabulary, repeated archive blocks and platform machinery before the human story can remain visually dominant. Real media exists, but it competes with the interface rather than defining it.

## Decision
Frontend reset; data plane preserved.

Do not rebuild the canon, discovery library, public projection, evidence graph or NVIDIA companion. Replace only the homepage presentation authority.

## Homepage architecture
1. **Documentary cover** — one real portrait/public-life image, Igor's name, one-sentence positioning, and three actions: Story, Archive, Talk.
2. **Signal frames** — 8 source-linked, visually distinct public objects selected from `/api/public-projection?limit=60&sort=impact`. Video, broadcast, press, major reposts and verified Canon rank above generic profile surfaces. PENDING objects are excluded.
3. **Life in time** — a compact chronological spine. One representative source object per meaningful year/period; no repeated explanation blocks.
4. **Right now** — four concise current lanes: StartOn, public work, media/creation, research. These are navigation, not dashboards.
5. **Open archive bridge** — one strong route into the full library. The homepage does not attempt to render the whole system.
6. **Digital Igor** — remains available as the existing StoryCompanion. NVIDIA remains the primary configured reasoning provider. It is an interaction layer, not a giant homepage section.

## Data rules
- Use public projection as the homepage media source.
- Preserve CANON / DISCOVERY / LIVE labels.
- Exclude PENDING from promoted homepage media.
- Every media object links to its original public source.
- Prefer native imageUrl; fall back to screenshotUrl; then source poster.
- Never synthesize reach or merge platform metrics.
- Live OAuth is additive, never required to show historical/public material.

## Visual rules
- Documentary/editorial, not dashboard/futurist control room.
- Real media occupies the majority of visual attention.
- Separate full-quality frames; no collage treatment.
- Deep black / graphite / warm ivory / restrained steel-blue accents.
- No neon-green system aesthetic on the new homepage.
- No graph, platform wall, evidence dashboard, agent mesh or system terminology in the primary journey.
- Mobile is a vertical album with large media, not a compressed desktop dashboard.

## Scope preservation
All existing non-home routes remain available: Library, Media, Research, Music, Museum, Evidence, Speaker, Create and others. This cutover changes the homepage authority only.

## Success criteria
- The first two mobile screens visibly contain Igor plus real source media.
- The homepage has one dominant narrative spine, not multiple competing systems.
- At least 8 real source-linked media objects are rendered when projection is available.
- If projection fails, a known public fallback still renders real source-linked media.
- Digital Igor remains available and NVIDIA configuration remains untouched.
- Existing archive/evidence routes continue to work unchanged.
