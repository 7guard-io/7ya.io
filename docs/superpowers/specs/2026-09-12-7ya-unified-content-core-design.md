# 7YA Unified Content Core — Design

**Date:** 2026-09-12  
**Status:** Approved design direction; awaiting written-spec review before implementation plan  
**Owner:** Igor Vepretski / 7YA  
**Repository baseline:** `main` at `63cc05558b04ff12dae4da63e0b295e9a43e244e` when this spec was written  
**Live AppDeploy baseline:** app `697a008fddc309b142`, applied source version `1789208761951`

## Purpose

Collapse the accumulated parallel 7YA content mechanisms into one governed content path without discarding the historical corpus, Canon, Evidence Ledger, source provenance, or existing working ingestion.

The target is not a new database. **7YA CONTENT CORE is a logical contract over the existing canonical authorities and persistence primitives.** It defines how every source becomes one normalized content object, how duplicates and identity conflicts are resolved, how life-story context and public-safety state are attached, and how one public read model feeds every user-facing experience.

The public success condition is simple: 7ya.io should feel like Igor Vepretski's real, evidence-backed life archive — rich in original posts, photos, video, chronology and context — rather than a set of thin, independently curated feeds.

## Governing principles

1. **One content core.** A content object is normalized once and reused everywhere.
2. **One public projection.** User-facing surfaces read from the same public contract.
3. **Many source adapters, zero parallel truth.** Facebook, Instagram, TikTok, YouTube, Drive, web discovery, Meta API, historical exports and first-party recovery evidence may all contribute, but none becomes an independent truth authority.
4. **Preserve the two existing authorities.**
   - Narrative/claim authority: `IGOR VEPRETSKI — MASTER CANON v1.0 — LIVING SOURCE OF TRUTH`.
   - Evidence/control/catalog authority: `IGOR VEPRETSKI — MASTER EVIDENCE LEDGER v1.0` and its Digital Compendium tables.
5. **Public Projection is the authoritative public read model.** 7ya.io remains a projection, never an independent truth store.
6. **Private evidence is not public content.** Gmail/platform notifications may prove, recover or disambiguate an object, but they are never a public feed and are never published merely because they exist.
7. **No destructive merge on weak similarity.** Native IDs, canonical URLs and hashes may dedupe deterministically; fuzzy similarity creates review candidates only.
8. **No source rescans when the source is already normalized.** Reuse and enrich existing canonical objects before creating new ones.
9. **Single-writer production discipline.** No overlapping production mutation streams. Every production patch starts from the exact currently applied AppDeploy source version and is verified on the canonical domain after deployment.
10. **User-visible truth is the completion gate.** Build success, HTTP 200, record counts or a passing ingestion job are not sufficient if the live site remains thin or broken.

## Existing authority model

The unified design extends, rather than replaces, the existing Digital Compendium architecture.

### Narrative authority

The Master Canon owns biographical narrative, claims, chronology and resolved factual statements.

### Evidence and content authority

The Master Evidence Ledger / Digital Compendium owns the durable content and evidence graph through the existing canonical concepts:

- `ACTIVITY_LEDGER`
- `CONTENT_MASTER`
- `ASSET_MASTER`
- `RELATION_LEDGER`
- `INGESTION_LOG`

These are the canonical storage semantics for the Unified Content Core. If the current runtime persistence already represents the same concepts differently, implementation adapts the existing primitives rather than creating a second database.

### Public read authority

`/api/public-projection` (or its current exact implementation boundary) is the only authoritative content read model for public experiences.

All homepage, life, archive, media, story, impact and search experiences must converge on this projection or typed queries derived from it.

## Target data flow

```text
SOURCE
  -> SOURCE ADAPTER / RECOVERY ADAPTER
  -> NORMALIZE
  -> IDENTITY RESOLUTION
  -> DEDUPE / DISTRIBUTION LINKING
  -> CANONICAL CONTENT + ASSET + ACTIVITY RELATIONS
  -> PRIVACY / RIGHTS / EVIDENCE GATE
  -> LIFE CONTEXT
  -> EDITORIAL RANK
  -> VERSIONED PUBLIC EXPORT / EXISTING PERSISTENCE
  -> PUBLIC PROJECTION
  -> HOME / LIFE / ARCHIVE / MEDIA / STORIES / IMPACT / NOW / SEARCH
  -> USER-VISIBLE MEASUREMENT
```

No public component may bypass the projection to read a private provider store as its sole source of truth.

## Normalized content contract

Every public candidate becomes one provider-neutral content object before it enters the canonical/public layer.

```ts
type UnifiedContentRecord = {
  contentId: string;
  contentType: 'post' | 'image' | 'video' | 'carousel' | 'article' | 'audio' | 'document' | 'event';
  platform?: 'Facebook' | 'Instagram' | 'TikTok' | 'YouTube' | 'Web' | 'Drive' | 'Other';
  providerObjectId?: string;
  accountIdentityId?: string;
  canonicalUrl?: string;
  publishedAt?: string;
  originalText?: string;
  language?: string;
  assetIds: string[];
  activityIds: string[];
  distributionOfContentId?: string;
  provenance: Array<{
    sourceId: string;
    sourceType: 'public-web' | 'owner-export' | 'owner-api' | 'drive-archive' | 'first-party-evidence' | 'manual-canonical';
    observedAt: string;
  }>;
  truthState: 'VERIFIED' | 'SUPPORTED' | 'USER_REPORTED' | 'UNRESOLVED' | 'CONFLICT';
  publicationState: 'PUBLIC_SAFE' | 'REVIEW_BEFORE_PUBLICATION' | 'PRIVATE' | 'QUARANTINED';
  lifeContext?: {
    chapterId?: string;
    storyCluster?: string;
    peopleIds?: string[];
    placeIds?: string[];
    projectIds?: string[];
    eventIds?: string[];
    whyItMatters?: string;
  };
  editorial?: {
    significance?: number;
    authenticity?: number;
    originalMedia?: number;
    chronologyGapValue?: number;
    evidenceQuality?: number;
    novelty?: number;
    publicRelevance?: number;
    resonance?: number;
    featured?: boolean;
  };
};
```

The exact TypeScript names may adapt to existing code, but these semantics are normative.

## Identity resolution

7YA has multiple current, historical and associated account identities. Account names alone are not sufficient evidence of ownership.

The identity layer must explicitly distinguish:

- current owned identity;
- legacy owned identity;
- associated historical identity;
- external publisher/distributor;
- unresolved identity;
- mirror/repost/syndication.

Known account labels such as `vepretski`, `vepretski7`, `igor7vepretski`, `igor.vepretski` and historical aliases are linked through explicit identity records rather than silently merged.

An unresolved ownership conflict remains `QUARANTINED` or `REVIEW_BEFORE_PUBLICATION`; the system must not convert historical notification evidence into a public ownership claim without support.

## Deduplication and distribution model

Deduplication order:

1. stable native/provider object ID;
2. canonical URL;
3. cryptographic content hash when asset bytes are available;
4. known cross-platform/mirror relation;
5. source + timestamp + text/media similarity as a review candidate only.

A repost or external viral redistribution is **not deleted**. It becomes a distribution edge to the original canonical content object so 7YA can show both the original story and its amplification without double-counting the content itself.

## Life-context layer

The core must explain why an object matters, not merely where it came from.

Each eligible record may link to:

- life chapter;
- story cluster;
- people;
- place;
- project;
- event;
- service/career period;
- public-impact context;
- a short `whyItMatters` editorial note.

Examples of story clusters include childhood/immigration, youth-at-risk, IDF/service, police/security, fatherhood/family, StartOn, politics/civic leadership, music/creator work, media/podcasts, 7YA and current work.

These relations must be derived from evidence/Canon and remain editable without duplicating the underlying content object.

## Editorial ranking

Virality is an input, not the ranking function.

Default public ranking should consider:

- personal significance;
- life-story value;
- authenticity;
- original-media value;
- chronology-gap value;
- evidence quality;
- novelty within the current surface;
- public relevance;
- source-local resonance/engagement where available.

A rare service photograph with low engagement may outrank a generic trend video with high views when the user experience is telling Igor's life story.

Ranking is a derived field. It must never become a competing content store.

## Source responsibilities

### Meta live sync

Keep the existing Meta ingestion as a server-side adapter/staging source. It may enrich owned Facebook/Instagram objects and dated source-local metrics. A Meta outage or expired token must never empty the public projection.

The active `meta-sync-hourly` job is therefore not removed merely because other content systems exist. It is retained until implementation proves an equivalent unified path.

### Agent Mesh

Agent Mesh may orchestrate discovery, health checks, enrichment or queues. It is **not** allowed to become a truth authority or write public facts directly without passing the canonical evidence/publication gates.

The currently successful `agent-mesh-hourly` job is retained during migration and evaluated by dependency/consumer evidence before any removal.

### Google Drive / owner archives

Drive and owner exports remain raw evidence/archive sources. Archived posts and media are ingested into the same canonical content/asset model. Their Drive location is provenance, not the public identity of the content.

### Gmail / platform notifications

Gmail is first-party evidence and recovery support only. It may provide native IDs, dates, counters, platform links and evidence that an object existed. It may not be rendered as public content or used to expose private correspondence.

### Public web / discovery

Public discovery finds externally indexed posts, mirrors, reposts, media coverage and canonical URLs. Discovered items enter the same identity, evidence and publication gates. Discovery itself is never a truth store.

## Facebook historical recovery — 2008 to present

The recovery goal is to reconstruct the strongest possible Facebook life record from 2008 to the present, but the system must never claim complete coverage until the evidence supports it.

### Recovery sources

In priority order:

1. owner-provided Facebook exports/archives;
2. current and legacy owned public profile/page nodes;
3. owner-authorized Meta API objects when accessible;
4. first-party Meta/Facebook notification evidence for recovery metadata;
5. public search/indexed historical nodes;
6. external reposts/syndication carrying Igor's original narrative;
7. existing Evidence Ledger and Visual Catalog records.

### Recovery workflow

For every candidate historical object:

1. recover native/provider ID and original date when possible;
2. resolve account identity;
3. extract original text/caption without rewriting it;
4. link original media or a durable owner-approved archival asset;
5. dedupe against existing Facebook/Instagram/Drive records;
6. classify original vs mirror vs external redistribution;
7. map to a life chapter/story cluster;
8. apply privacy/publication gate;
9. assign editorial value;
10. expose through the same Public Projection.

### Historical caution

A grouped Facebook notification corpus with unresolved ownership or recipient identity is evidence of historical platform activity, not sufficient proof that every referenced object belongs to Igor. Such material remains quarantined until identity is resolved.

### Coverage measurement

Historical Facebook recovery reports must show year-by-year state:

- years with verified owned posts;
- years with only partial public evidence;
- years with owner-export evidence;
- unresolved gaps;
- recovered original-media count;
- public-safe publishable count.

The UI must not fake continuity for missing years.

## Component and subsystem disposition

The migration uses four states: `KEEP`, `ADAPTER/STAGING`, `DERIVED VIEW`, `DEPRECATE AFTER MIGRATION`.

### KEEP

- Master Canon.
- Master Evidence Ledger / Digital Compendium canonical tables.
- Public Projection as the public read contract.
- Evidence/publication gates.
- Working owner-authorized provider ingestion.
- Ingestion log / provenance.

### ADAPTER / STAGING

- Meta store and Meta sync.
- Discovery library.
- Public/world internet discovery graphs.
- recovered-media importers.
- owner-archive import jobs.
- Gmail/platform evidence recovery.

These may retain provider-specific storage/checkpoints internally, but public components may not treat them as independent authority.

### DERIVED VIEW

- Visual Registry.
- Media Registry.
- Life Scenes.
- viral rankings.
- featured/curated lists.
- story streams.
- 100 Moments or equivalent editorial groupings.

These become queries/materialized views over the same core/projection. They do not own duplicate content objects.

### DEPRECATE AFTER MIGRATION

Candidate examples include:

- hardcoded content universes or seeds that duplicate canonical records;
- personal-content batch datasets used directly by runtime UI;
- standalone Facebook story feeds that bypass Public Projection;
- standalone viral feeds that maintain their own corpus;
- inactive canaries/jobs with no remaining consumer, release-gate or diagnostic purpose.

Nothing is deleted solely because it looks old. A candidate is removed only after dependency search proves no remaining runtime consumer, writer, test, cron, release gate or required documentation path.

## Consumer convergence

Every public content experience should eventually become a typed query over the same projection:

- **HOME:** strongest current identity + original media + representative life moments.
- **LIFE:** chronological life chapters and transitions.
- **ARCHIVE:** original posts and recovered historical objects by date/source.
- **MEDIA:** original photos/video/audio with provenance.
- **STORIES:** thematic clusters assembled from canonical objects.
- **IMPACT:** objects with evidence-backed public distribution/metrics.
- **NOW:** current work and recent public-safe activity.
- **SEARCH:** retrieval over the full public projection with source links.

A content object may appear in multiple experiences without being duplicated in storage.

## Migration sequence

### Phase 0 — freeze and inventory

- Treat AppDeploy source version `1789208761951` as the live baseline until a newer validated version is intentionally applied.
- Treat GitHub `main` commit `63cc05558b04ff12dae4da63e0b295e9a43e244e` as the repository baseline for this spec.
- Do not run overlapping production mutations.
- Inventory every reader and writer touching Canon, Discovery, Public Projection, Meta store, media/visual registries, life scenes, recovered media, social feeds and hardcoded content batches.

### Phase 1 — dependency map and contract tests

- Build a machine-readable dependency/disposition map.
- Add failing tests that define the unified public projection contract before changing consumers.
- Confirm Meta and Agent Mesh paths cannot directly bypass evidence/publication gates.

### Phase 2 — converge public consumers

Move one public consumer at a time to Public Projection or typed projection queries. Preserve current user-visible behavior first, then enrich it.

No source adapter is removed during this phase.

### Phase 3 — canonicalize existing duplicate stores

- Convert registries and feeds into derived views.
- Move unique content objects into canonical content/asset/activity relations.
- Replace hardcoded duplicate records with canonical IDs/references.
- Preserve provenance and external distribution edges.

### Phase 4 — Facebook historical recovery

Run year-by-year recovery and backfill using checkpoints and existing normalized objects. Start with strongest owner evidence, then public/external recovery. Never restart from zero when a year/source is already canonicalized.

### Phase 5 — retire dead paths

Delete/deactivate only items proven to have no remaining runtime consumer/writer/test/cron/release-gate purpose. Record each retirement in a migration receipt.

### Phase 6 — editorial enrichment

Expand life context, ranking and surface coverage so the site becomes visibly richer without increasing duplicate records.

## Error handling

- Source failure records an ingestion/operational event and preserves the previous public projection.
- Identity conflict routes to quarantine; it never silently merges.
- Missing media marks the asset unavailable and keeps the content/evidence record.
- Missing metrics do not block publication of otherwise valid content.
- Broken provider media URLs should fall back to durable owner-approved assets when available.
- Projection build failure must retain the previous validated projection/fallback rather than publish an empty experience.

## Privacy and publication

Public output requires all applicable conditions:

1. provenance exists;
2. rights/privacy state is compatible with public display;
3. no unresolved identity conflict;
4. no unresolved `VERIFY_BEFORE_PUBLISHING` requirement;
5. private correspondence is excluded;
6. family/minor/sensitive content follows its existing review state rather than being bulk-promoted;
7. time-varying metrics are dated and source-local.

A private source may support a public claim without making the private source itself public.

## Testing strategy

Implementation begins with contract tests before behavior changes.

Required gates:

1. Same native object ingested twice produces one canonical content record.
2. Same object discovered through Facebook + web + notification evidence merges provenance instead of duplicating the public item.
3. External repost becomes a distribution relation, not a second original.
4. Unresolved identity never auto-publishes.
5. `REVIEW_BEFORE_PUBLICATION`, `PRIVATE` and `QUARANTINED` records are excluded from ordinary public queries.
6. Meta outage/401 leaves the previous public projection populated.
7. Agent Mesh cannot create a public record without canonical/publication gates.
8. Gmail evidence fields cannot appear in public payloads except sanitized provenance labels explicitly allowed by policy.
9. Derived visual/media/story views return canonical IDs from the projection rather than owning separate content objects.
10. Repeated historical backfill resumes from checkpoints and does not restart or duplicate prior years.
11. Source-local metrics always include observation dates and are never silently summed into synthetic cross-platform reach.
12. HE/EN/RU user-facing experiences continue to render when a live provider is unavailable.
13. Existing Canon, evidence and impact integrity tests continue to pass.
14. Public projection build failure preserves the last validated public/fallback corpus.

## User-visible acceptance criteria

The migration is not complete until live 7ya.io demonstrates the following:

- substantially more original Igor media/posts are visible without creating duplicate cards;
- every visible content card has traceable provenance/source behavior;
- historical material is connected to chronology/story rather than dumped as a feed;
- year coverage can be measured for 2008–present and gaps are explicit;
- no broken/private/unresolved archive material leaks into public experiences;
- the homepage and archive no longer depend on independent hardcoded content universes;
- a user can move from a life chapter to the original post/media/source and back to related moments;
- Meta failure does not make the site look empty;
- canonical domain verification confirms the intended AppDeploy app after every production deployment.

## Measurement dashboard

Track at minimum:

- canonical public content count;
- original-media ratio;
- coverage by year;
- coverage by life chapter/story cluster;
- duplicate-public-card rate;
- unresolved-identity count;
- broken-media rate;
- public records with provenance;
- public records with life context;
- Facebook historical recovery count by year;
- source ingestion freshness;
- user-visible homepage/archive media density.

These metrics diagnose the content system. They are not marketing claims unless separately verified.

## Deployment discipline

This specification authorizes implementation work, not an unreviewed destructive production cutover.

Before each production release:

1. read the currently applied AppDeploy source version;
2. confirm no newer writer changed production underneath the work;
3. run the repository/local release gates required by the current 7YA control contract;
4. make the smallest coherent patch against the exact baseline;
5. deploy once;
6. inspect AppDeploy QA/errors;
7. verify mobile and desktop behavior;
8. verify the canonical `7ya.io` domain still resolves to the intended app;
9. record the applied version, commit/source diff and user-visible result.

If the production baseline changes during implementation, stop and rebase the patch on the new live snapshot rather than overwriting it.

## Non-goals

- Do not replace the Master Canon.
- Do not replace the Master Evidence Ledger.
- Do not create a new database merely to rename existing canonical storage as Content Core.
- Do not bulk-publish private archives.
- Do not fabricate missing Facebook years or dates.
- Do not remove a working provider sync before its consumer/value is migrated.
- Do not sum unlike social metrics into a synthetic reach total.
- Do not redesign every page as part of the consolidation.
- Do not make live provider APIs part of synchronous homepage rendering.

## Definition of done

The architectural consolidation is complete when:

1. one canonical content identity exists per original object;
2. all public surfaces consume the same Public Projection contract or typed derivatives;
3. provider/discovery/archive systems are clearly adapters/staging, not parallel truth stores;
4. registries/feeds/scenes are clearly derived views, not duplicate content authorities;
5. Facebook historical recovery is checkpointed, year-measured and integrated into the same core;
6. dead paths are removed only after dependency proof;
7. the live site is visibly richer in original Igor material and remains stable when optional providers fail;
8. the release is verified on the canonical production domain.
