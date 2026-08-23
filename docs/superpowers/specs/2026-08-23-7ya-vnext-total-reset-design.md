# 7YA vNext — Total Product Reset Design

Date: 2026-08-23
Status: APPROVED DIRECTION / WRITTEN SPEC FOR REVIEW
Owner: Igor Vepretski
Target: 7ya.io
Production baseline to reconcile first: AppDeploy v95 (`1787465482461`, built 2026-08-23 09:11 Asia/Jerusalem)

## 1. Decision

7YA will be rebuilt as one coherent product rather than a collection of overlapping Home, Museum, Media, Search, Archive, Canon, Discovery and Social experiences.

The governing model is:

**ONE PERSON → ONE STORY → ONE GRAPH → ONE ARCHIVE → ONE EXPERIENCE**

The reset is architectural and visual. It includes navigation, information architecture, data contracts, ingestion, permanent archival storage, search, media, social content, chronology, evidence, companion behavior, responsive UX, visual language and QA.

This is not a destructive rewrite. Existing public material, evidence records, media records, corpus data and useful integrations are assets to migrate into the unified model. Duplicate presentation layers are retired only after their data and behavior have been mapped into the replacement system.

## 2. Non-negotiable product principles

1. **Completeness in storage; curation in display.** Public material is retained even when it is not promoted on the homepage.
2. **A found item must not require rediscovery.** Once discovered, it receives a durable archive record and provenance.
3. **One canonical object per real event/content object.** Reposts, mirrors, media follow-ups and metric snapshots attach to the same canonical object rather than becoming unrelated cards.
4. **The homepage tells a human story, not a database schema.** Visitors experience Igor first and only then choose depth.
5. **Real media first.** Public photographs, video frames, scans, posts and source visuals are preferred over generic decorative assets.
6. **No SaaS-card monoculture.** Visual composition must vary by narrative function: cinematic image, video stage, timeline, quote, map, reaction field, document object, audio, evidence strip, archive grid.
7. **Chronology is structural.** Life events appear in a coherent temporal sequence even when individual sections expose thematic depth.
8. **The archive is append-only by default.** Corrections create versions/status changes; they do not erase historical discovery.
9. **All surfaces read from shared contracts.** Home, Archive, Search, Media, Museum, Companion and SEO do not maintain separate hand-written copies of the same story.
10. **Production is never overwritten from a stale GitHub root.** Reconciliation with the current AppDeploy snapshot is Phase 0 and a hard gate.

## 3. Current-state diagnosis

The current production application contains valuable subsystems, including:

- canonical corpus APIs and client
- content graph search/posts
- discovery library
- permanent/legacy media datasets
- public platform inventory
- influence/repost memory
- third-party appearances
- live social feed
- visual registry
- museum and chronology surfaces
- research and speaker rooms
- companion and creator/growth flows
- visual QA tooling

The failure is composition, not absence. Multiple components independently render overlapping public records. Examples include Archive, DeepArchiveRiver, PublicRecordRoom, MediaPage full-public-record, DiscoveryLibrary and canonical/search views. Similar duplication exists among historical Home implementations.

Consequences:

- one event can appear as several unrelated cards;
- data lives in multiple static TypeScript arrays plus backend records;
- visual hierarchy is inconsistent;
- archive depth leaks into the homepage;
- navigation exposes implementation history rather than user intent;
- content is rediscovered or re-described instead of permanently resolved;
- the same imagery is repeated because several components select from separate registries;
- editorial and evidence responsibilities are mixed.

## 4. Target information architecture

### 4.1 Primary public journey

The default homepage is one continuous, editorial experience with seven chapters:

1. **IGOR** — identity, presence, current state, strongest real portrait/video.
2. **LIFE** — chronological life journey with real visual evidence and geography where relevant.
3. **SIGNAL** — posts, viral moments, public response, repost chains and media propagation.
4. **WORK** — public service, StartOn, civic/political activity, projects and system building.
5. **IDEAS** — writing, research, frameworks, talks and long-form thought.
6. **ARCHIVE** — gateway into the complete searchable public record.
7. **YOU** — Companion / Creator / Growth handoff that turns inspiration into action for the visitor.

The homepage may contain previews from the archive, but it never becomes the archive itself.

### 4.2 Primary navigation

Desktop and mobile navigation are reduced to user goals:

- Igor
- Journey
- Work
- Ideas
- Archive
- Talk / Create

Language selection remains globally available. Search is a first-class action rather than another content room.

### 4.3 Route strategy

Existing indexed routes remain functional during migration and for SEO continuity, but become projections of the same underlying graph:

- `/` — unified home experience
- `/archive/` — complete permanent archive and universal search
- `/media/` — editorial media projection of the archive
- `/research/` — research projection of the graph
- `/starton/` — StartOn projection
- `/museum/` — deep chronological/album projection
- `/speaker/` — public speaking/press conversion projection
- `/create/` and growth flow — visitor action layer
- `/evidence/` — provenance/evidence projection

No route is allowed to maintain its own duplicate source-of-truth content arrays after migration.

## 5. Unified data model

The data model separates four concepts that are currently intermingled.

### 5.1 `ArchiveObject`

Represents every discovered public object.

Required fields:

- `archiveId`
- `canonicalUrl`
- `discoveredUrl`
- `sourcePlatform`
- `publisher`
- `objectType` (`post`, `article`, `video`, `audio`, `image`, `profile`, `document`, `broadcast`, `comment-thread`, `mirror`, `metric-snapshot`, `other`)
- `title`
- `publishedAt`
- `firstSeenAt`
- `lastSeenAt`
- `language`
- `textExtract`
- `mediaAssets[]`
- `contentHash`
- `sourceHash`
- `captureState`
- `storageState`
- `provenance`
- `relationshipToIgor`
- `discoveryMethod`
- `version`

Archive objects are retained even when they cannot yet be confidently attached to a life event.

### 5.2 `ArchiveAsset`

Represents durable binary/media capture.

Fields:

- `assetId`
- `archiveId`
- `kind`
- `originalUrl`
- `storageKey`
- `sha256`
- `mimeType`
- `byteSize`
- `width` / `height` / `duration`
- `capturedAt`
- `renderPolicy`
- `credit`

A URL is not an asset. Assets are stored under durable 7YA-controlled object storage when capture is technically possible.

### 5.3 `CanonicalEvent`

Represents the real-world event/story node that can gather many archive objects.

Examples:

- a StartOn launch/appearance;
- a viral fatherhood post and all its reposts/coverage;
- an elder-fraud post and subsequent television coverage;
- a public-service moment;
- a song release;
- a political/public appearance.

Fields:

- `eventId`
- `storyOrder`
- `canonicalDate`
- `period`
- localized `title` and `summary`
- `domains[]`
- `people[]`
- `organizations[]`
- `places[]`
- `topics[]`
- `archiveObjectIds[]`
- `primaryVisualAssetId`
- `metrics[]`
- `relationships[]`
- `verificationState`
- `editorialPriority`
- `visibility`

### 5.4 `SurfacePlacement`

Controls presentation without copying content.

Fields:

- `placementId`
- `eventId` or `archiveId`
- `surface` (`home`, `life`, `signal`, `work`, `ideas`, `archive`, `media`, `museum`, `speaker`, `research`, `starton`)
- `role` (`hero`, `anchor`, `support`, `timeline`, `gallery`, `quote`, `reaction`, `evidence`, `related`)
- `rank`
- `layoutHint`
- `localeOverrides`

This is the key separation: **the archive stores everything; placements decide what the visitor sees.**

## 6. Permanent archive architecture

### 6.1 Storage

The long-term owned archive uses:

- **Supabase Postgres** for structured `ArchiveObject`, `CanonicalEvent`, relationships, metrics and placements.
- **Supabase Storage** for captured images, video/audio files, page captures and derivative previews.
- **Git** for versioned schemas, seed manifests, migration scripts, editorial configuration and integrity receipts — not for large binary media.

The application accesses archive data through AppDeploy backend APIs so frontend components do not depend directly on storage providers.

### 6.2 Append-only behavior

Discovery follows:

`DISCOVER → CAPTURE → HASH → NORMALIZE → DEDUP → RESOLVE → STORE → LINK → CURATE → PUBLISH`

Deduplication uses normalized canonical URL plus hashes. A duplicate copy may still be retained as a distribution/mirror relationship when it is historically relevant.

Each changed source creates a new capture/version when material content changes. `firstSeenAt` never changes. Deletion or disappearance at the source changes source availability, not archive existence.

### 6.3 Acquisition scope

Priority is maximal public-memory coverage across:

- owned social profiles and historical handles
- third-party reposts and syndication
- press and television
- podcasts and radio
- YouTube and video mirrors
- Instagram / Facebook / TikTok / Threads / X / LinkedIn
- music platforms
- research and publication profiles
- StartOn ecosystem
- political/public appearances
- cached/indexed legacy traces
- public comments/reactions when relevant to an event

The system records rights/source metadata but ingestion priority is completeness. Rendering policy can differ from storage policy.

## 7. Universal search

All site search is replaced by one search contract.

Search must support:

- free text
- year/date range
- platform/publisher
- content type
- domain/topic
- person/organization/place
- language
- source status
- archive availability
- media type
- high-engagement / metric presence

Results can return both canonical events and unresolved archive objects, clearly differentiated.

Queries such as `2023`, `אבהות`, `StartOn`, `משטרה`, `רוסית`, or `פוסט עם הכי הרבה תגובות` must operate on the same underlying index.

## 8. Editorial resolution rules

### 8.1 One event, many traces

A canonical event is the unit of storytelling. Example:

`fatherhood event`

contains:

- original/owned post if recovered
- Statusim repost
- Hidabroot publication
- other syndications
- public comments/reactions snapshots
- metric snapshots
- related interview or authored column

The homepage shows one composed story. The archive exposes every trace.

### 8.2 Ranking

Homepage ranking balances:

1. biographical importance
2. chronological continuity
3. visual strength
4. source independence/authority
5. public response
6. uniqueness versus nearby content
7. thematic balance

High metrics alone do not monopolize the homepage.

### 8.3 Real visual hierarchy

For every event, visual selection order is:

1. original public photo/video frame of the event
2. captured publisher/social source visual
3. documented derivative/mirror visual
4. editorial source plate only when no real visual exists

Generic portraits may be used for identity/hero surfaces but not to impersonate event documentation.

## 9. Visual system

### 9.1 Direction

The site becomes a living editorial album rather than a grid-heavy dashboard.

Visual grammar:

- full-bleed documentary photography
- large editorial typography
- cinematic transitions
- asymmetrical but readable composition
- controlled negative space
- source captions integrated into the image field
- video and audio used as native story elements
- reactions/comments represented visually where evidence exists
- timeline and map elements only when they add narrative meaning
- restrained `#7YA🥷` / ninja motif as connective identity, never as costume

### 9.2 Component families

The presentation engine is intentionally small. Components are grouped by narrative role rather than source platform:

- `StoryHero`
- `ChronologyChapter`
- `DocumentaryFrame`
- `VideoMoment`
- `SourceObject`
- `EchoChain`
- `ReactionField`
- `ProjectChapter`
- `IdeaEssay`
- `ArchiveExplorer`
- `ContextRail`
- `NextMovePanel`

Platform-specific cards are avoided unless the platform itself is the subject.

### 9.3 Responsive behavior

Mobile is the primary acceptance viewport. The experience must preserve narrative order, readable type, touch targets ≥44px, stable media aspect ratios, no horizontal overflow and no fixed controls obscuring content.

Desktop may use richer editorial composition but cannot change story order or hide essential content.

## 10. Companion and visitor functions

The Companion remains a floating interaction layer but is re-grounded in the unified graph.

It must be able to:

- answer `who/what/when/where` from canonical events;
- open the exact archive object/evidence behind an answer;
- navigate to the relevant chapter;
- search the archive;
- explain connections between events;
- transition into `Reflect` and `Build` modes for the visitor;
- avoid maintaining a separate hand-written Igor biography.

Creator/Growth functionality remains a distinct visitor workflow but visually and navigationally belongs to chapter 7 (`YOU`).

## 11. Backend/API contracts

The new frontend reads from a minimal API surface:

- `GET /api/vnext/home` — curated story projection and placements
- `GET /api/vnext/events` — canonical event search/filter
- `GET /api/vnext/events/:id` — full event and linked archive traces
- `GET /api/vnext/archive` — archive-object search/filter
- `GET /api/vnext/archive/:id` — durable object metadata/assets/provenance
- `GET /api/vnext/search` — unified ranked search
- `GET /api/vnext/now` — current/live connected sources
- `POST /api/vnext/ingest` — protected ingestion endpoint / job intake
- `POST /api/vnext/resolve` — protected event-resolution operation

Legacy APIs remain temporarily available behind adapters until all consumers migrate.

## 12. Migration / reconciliation strategy

### Phase 0 — Production reconciliation

Hard gate before feature code:

1. export/read AppDeploy v95 source snapshot;
2. compare against GitHub `main`;
3. preserve all production-only changes in a reconciliation branch/worktree;
4. run existing local CI on reconciled source;
5. establish one repository commit as the new source baseline;
6. only then begin vNext refactoring.

No vNext implementation may start from stale GitHub source.

### Phase 1 — Unified contracts without UI change

- create archive/event/placement schemas;
- migrate existing canonical corpus, content graph, deep media, appearance and influence records into adapters;
- add hash/dedup and persistent archive storage;
- retain current UI while data parity is measured.

### Phase 2 — Unified APIs and search

- create `/api/vnext/*` projections;
- build universal search;
- verify count, source and media parity versus existing systems.

### Phase 3 — New presentation engine

- build one new `VNextHome` from the shared contracts;
- implement seven chapters;
- use real archive assets and placements;
- remove duplicate data ownership from components.

### Phase 4 — Route projections

- migrate Archive, Media, Museum, Research, StartOn, Speaker and Evidence to shared graph projections;
- preserve SEO/canonical URLs;
- retire old isolated renderers after parity checks.

### Phase 5 — Companion integration

- ground Companion actions and answers in vNext search/event/archive APIs;
- remove duplicate profile copy where safe.

### Phase 6 — Retirement

Only after parity and visual acceptance:

- delete or archive unused Home variants;
- remove static duplicate record arrays;
- remove legacy adapters no longer consumed;
- document final architecture.

## 13. Data preservation gates

A legacy module cannot be retired until all of the following pass:

- every unique URL has a mapped archive object or explicit exclusion record;
- every unique canonical story/event has a mapped canonical event;
- every media asset has a mapped asset or an explicit unavailable state;
- every metric snapshot retains its source and date;
- every third-party appearance is represented;
- unresolved leads remain searchable rather than disappearing;
- public route redirects/canonical tags are verified.

The migration report must show `before`, `migrated`, `deduplicated`, `unresolved`, and `excluded` counts.

## 14. QA acceptance gates

### Functional

- universal search returns consistent results across homepage/Archive/Media entry points;
- archive items persist when a live feed fails;
- live source failure never erases stored content;
- event pages expose all linked traces;
- language switching preserves the same canonical object/event;
- legacy public URLs remain valid or redirect intentionally;
- Companion opens exact sources rather than generic pages.

### Visual

- no generic documentary fallbacks when a real stored asset exists;
- no repeated primary image across adjacent major chapters;
- no broken images;
- no horizontal overflow;
- touch targets ≥44px;
- no major section without meaningful media/evidence or intentional text-only editorial treatment;
- mobile and desktop screenshots receive visual review;
- homepage reads as a continuous human story before archive depth.

### Performance

- lazy-load below-the-fold media;
- responsive image derivatives;
- video does not autoplay with audio;
- archive/search result pagination or virtualization prevents unbounded DOM growth;
- live APIs are not required to render previously archived content.

### Integrity

- hashes validate stored assets;
- source URLs and capture timestamps remain visible in provenance;
- destructive archive operations are protected and audited;
- ingestion is idempotent;
- duplicate URLs/hashes do not create duplicate canonical events.

## 15. Deployment policy

The vNext reset follows the existing explicit deployment gate. Production deployment is not implied by design approval.

When a deployment is explicitly triggered, the sequence remains:

1. reconcile against the latest production source;
2. run `npm run ci:local`;
3. fix until fully green;
4. targeted commit/push of the reviewed implementation;
5. deploy/monitor AppDeploy;
6. verify live behavior and visual QA;
7. record a deployment receipt.

No code is declared complete solely because it builds or because AppDeploy reports `ready`.

## 16. Success definition

The reset succeeds when a first-time visitor can, without understanding the site architecture:

1. recognize Igor immediately;
2. follow the life story in a clear chronology;
3. see real photographs, posts, videos and public response in context;
4. understand StartOn, public work, creation and ideas as parts of one life rather than separate brands;
5. open evidence when desired without evidence overwhelming the story;
6. search the complete public archive from one place;
7. discover old and third-party material without forcing 7YA to search the web again for already-ingested objects;
8. leave with a clear next action or conversation path.

Internally, the system succeeds when each public object has one durable archive identity, each real story has one canonical event, and every visual surface is a projection rather than a second source of truth.

## 17. Scope boundary for the first implementation program

The first implementation program includes production reconciliation, unified archive/event contracts, persistent storage, unified APIs/search and the new seven-chapter homepage. Specialized projections are migrated immediately afterward using the same contracts.

The program explicitly does **not** begin by deleting old components or restyling them individually. The replacement is built beside them, parity-tested, then switched over and retired deliberately.
