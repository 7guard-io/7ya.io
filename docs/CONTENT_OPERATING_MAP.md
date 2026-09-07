# 7YA Content Operating Map Contract

## Purpose

The operating map is a **projection of Canon**, not a new truth store. Its job is to answer four operational questions for every publishable record:

1. What world does this belong to?
2. Who is it for?
3. Where can it be distributed?
4. What should the audience do next?

## Seven worlds

| World | Primary use | Default audiences | Default distribution | CTA |
| --- | --- | --- | --- | --- |
| LIFE | biography, chronology, belonging, turning points | public, community, media | Instagram, TikTok, YouTube, Facebook | READ_STORY |
| SERVICE | public service, security, responsibility, operations | public, institutions, employers, media | LinkedIn, Facebook, YouTube | VIEW_EVIDENCE |
| CIVIC | civic/political/public action | public, institutions, media | X, Facebook, LinkedIn, YouTube | VIEW_RECORD |
| BUILD | 7YA, research, AI, systems, products | builders, institutions, employers, media | LinkedIn, X, GitHub, YouTube | COLLABORATE |
| IMPACT | StartOn and social-impact implementation | youth, institutions, partners, media | LinkedIn, Facebook, YouTube, Instagram | COLLABORATE |
| CULTURE | music, dance, video, cultural creation | public, creators, media | Instagram, TikTok, YouTube, Spotify | WATCH_LISTEN |
| RECORD | sources, dates, evidence, archive | researchers, journalists, institutions | 7ya.io, Search, AI | INSPECT_SOURCES |

## Deterministic primary classification

Priority order:

1. `type=service` → SERVICE
2. `surface=starton` → IMPACT
3. `type=music` or `surface=music` → CULTURE
4. research/system/project → BUILD
5. explicit civic/political/public-action markers → CIVIC
6. life/identity/post → LIFE
7. otherwise → RECORD

A record may also receive secondary worlds. In particular, an archival public record may receive RECORD as a secondary world without losing its human/editorial primary world.

## Canonical record contract

Each projected record contains:

- `canonicalId`
- `canonicalDate`
- `primaryWorld`
- `secondaryWorlds`
- multilingual `title` and `summary`
- original verification state
- audience classes
- locales: HE / EN / RU
- recommended distribution surfaces
- CTA class
- `canonicalApiUrl`
- public source URLs

The underlying canonical event remains available at:

`/api/corpus/:id`

The aggregate map is available at:

`/api/content-operating-map`

The human-readable map is available at:

`/map/`

## Content flow

`CAPTURE → INGEST → CLASSIFY → VERIFY → CANONICALIZE → PUBLISH_7YA → LOCALIZE → REPURPOSE → DISTRIBUTE → MEASURE → ARCHIVE → LEARN → REUSE`

## Hard boundaries

- Public projection requires a public canonical event and at least one public source.
- Private or restricted material is not promoted by the operating map.
- Verification state is inherited, never upgraded by classification.
- Distribution arrays are editorial routing metadata, **not publishing permission**.
- Automatic external publishing is disabled by default.
- Metrics remain source-bound and dated; the operating map does not create synthetic global reach totals.
- Translation/localization must preserve factual equivalence while allowing language-specific framing.

## Storage ownership

Current runtime ownership remains AppDeploy Canonical Corpus + DB overlay. The PostgreSQL/Supabase schema in `sql/002_content_spine.sql` is a portability target only until a separately approved reconciliation/migration release promotes it.
