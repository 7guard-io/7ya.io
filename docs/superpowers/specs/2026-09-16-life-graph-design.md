# 7YA Life Graph — Content-First Design

## Goal
Build 7YA from verified, reusable personal content units instead of constructing empty pages first. The public site is a projection of Igor Core, not a manually maintained parallel truth.

## Product principle
SOURCE → CORE RECORD → RELATIONSHIPS → MOMENT → CHAPTER → EXPERIENCE → MEASUREMENT → CORE

No placeholder is permitted in a public experience. If a component has no real media or verified content behind it, it is not rendered.

## Canonical ownership
- `7guard-io/7ya.io` is the single source repository.
- Existing canonical corpus/evidence/media records are reused before new records are created.
- Social networks, press, interviews, podcasts, music, documents, reposts, embeds, mirrors and archived evidence are source layers, not competing site databases.
- AppDeploy is not treated as a content source. Hosting is replaceable; Core records are not.

## Core record
Every publishable item normalizes into one Core record with:
- stable `id`
- `type`: photo | video | post | article | interview | podcast | music | document | mention | repost | event
- canonical source URL and platform
- original publisher/account
- published/observed date
- title/caption/summary where supported by evidence
- media references (image/video/embed/thumbnail)
- people and organizations
- topics and life chapters
- language
- metrics with `observed_at`, source and scope
- evidence references
- rights/ownership state
- verification state: VERIFIED | USER_REPORTED | INFERRED | UNKNOWN
- relationship edges

Raw source material remains immutable evidence. Normalization never overwrites source evidence.

## Relationship graph
Edges describe why records belong together rather than duplicating them:
- `original_of`
- `repost_of`
- `coverage_of`
- `interview_about`
- `same_event_as`
- `features_person`
- `belongs_to_chapter`
- `supports_claim`
- `follow_up_to`

A repost or article is therefore preserved as its own record while connected to the original event/content.

## Moment
A Moment is the smallest public storytelling unit. It requires:
1. at least one real visual/audio/document asset or supported external embed;
2. a concise evidence-backed story;
3. a date or explicit unknown-date state;
4. at least one source/evidence reference;
5. a chapter/topic relationship.

Optional enhancements: measured counters, quote fragments within copyright limits, map/location when appropriate, lightweight animation, sticker/annotation, mini infographic, related-record strip.

A Moment must still make sense if every optional enhancement is removed.

## Chapters
Moments assemble into thematic/chronological Chapters. Initial chapter vocabulary reuses existing canon rather than creating another taxonomy. Public chapter ordering can change without mutating Core records.

## Experience composition
The homepage and inner experiences query ready Moments rather than hard-code cards.

Initial projection:
- human hero: real Igor image/video only;
- Life Pulse: high-quality ready Moments;
- chapter journey;
- selected real social/press/media clusters;
- current work / StartOn;
- evidence/source access;
- Bro Chat where already supported.

No fixed count is required. Twelve finished Moments are preferable to eighty empty cards.

## Visual system
Decorative layers are derived from content:
- motion emphasizes transitions, chronology or media state;
- stickers label provenance, era, platform or context;
- infographics visualize real measurements or relationships;
- no generic AI portrait or stock image substitutes for missing personal media;
- mobile-first; progressive enhancement; reduced-motion respected;
- visual effects cannot block text, media controls, source links or accessibility.

## Ingestion strategy
Use adapters around existing sources instead of one giant ingestion job. Each adapter emits Core-record candidates into the same normalization contract. Start with already-accessible canonical records and media; add live social/platform adapters only where access is reliable and useful.

Failed/blocked source ingestion must not block site builds. Last verified records remain usable and carry freshness metadata.

## Deduplication
Deduplicate in two stages:
1. exact identity: canonical URL/platform ID/source ID;
2. relationship resolution: same event/media fingerprints/text/date/person evidence.

Never delete a legitimate repost merely because it resembles an original; connect it with `repost_of` or `same_event_as`.

## Publication readiness
A public projection requires `publish_ready=true`, derived from required fields and evidence. UNKNOWN/USER_REPORTED records may remain in Core but cannot silently become verified claims.

## Analytics
Measurement is attached to experiences and Moments, not vanity totals. Required events: page view, Moment open, media play, evidence/source open, outbound social click, CTA, chapter navigation and meaningful form completion. Metrics must preserve source/scope and must never be described as unique people unless the source actually measures unique people.

## Performance
- lazy-load below-fold media;
- thumbnails/posters before heavy video;
- external embeds load on interaction where practical;
- animations use progressive enhancement;
- build remains valid when external platforms are unavailable.

## Failure behavior
- Missing media: hide the Moment from visual projections unless a supported document/text treatment is explicitly valid.
- Broken embed: fall back to verified poster/source link where available.
- Stale metrics: show last-observed date or omit metric.
- Missing optional decoration: render the Moment without it.
- Ingestion failure: keep last verified Core state; never replace it with placeholder content.

## Build gates
A release fails if:
- public placeholder markers are present;
- a rendered Moment lacks required source/evidence;
- a referenced local asset is missing;
- duplicate canonical IDs exist;
- a VERIFIED claim has no evidence reference;
- required analytics instrumentation disappears;
- critical routes fail artifact verification.

## Delivery strategy
Build vertically, not in bulk. Each slice must end in a finished public-capable unit:
1. normalize a small set of high-value existing records;
2. resolve relationships;
3. render finished Moments;
4. assemble one Chapter/Life Pulse projection;
5. verify mobile/performance/evidence/analytics;
6. expand the corpus in batches without redesigning the shell.

## Explicit non-goals for the first slice
- importing every historical social record at once;
- building a new CMS;
- creating another database when the existing canonical corpus can serve the slice;
- live dependence on every social API;
- decorative animation without content purpose;
- DNS/hosting migration as a prerequisite for content work.

## Success criteria
The first slice succeeds when a visitor can open a real 7YA experience composed only from verified/referenced Igor material, move between related Moments and sources, see no placeholder or generic substitute, and the same records can be reused in later chapters without copying their content.