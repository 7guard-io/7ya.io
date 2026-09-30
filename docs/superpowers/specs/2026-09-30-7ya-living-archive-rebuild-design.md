# 7YA Living Archive Rebuild — Design Spec

Date: 2026-09-30
Owner: Igor Vepretski
Branch: `rebuild/7ya-living-archive-20260930`
Status: DESIGN FOR OWNER REVIEW — no runtime implementation yet

## 1. Purpose

Rebuild 7ya.io as a living, source-driven personal archive and public operating layer for Igor Vepretski.

The public experience must read first as a human life told through authentic media, chronology, public response and concrete work. The verification, evidence and system layers remain strong but sit behind the story rather than dominating the first experience.

Core principle: **PERSON FIRST, SYSTEM SECOND.**

## 2. Success Definition

A first-time visitor should be able to answer quickly:

- Who is Igor Vepretski?
- Where did he come from?
- What has he lived through and built?
- What real media proves those moments?
- How did people respond publicly?
- What is StartOn and what was actually done?
- What is he creating and researching now?
- Where can I verify the sources?
- How can I contact or talk with the 7YA companion?

The site is not accepted because code merged. It is accepted only after mobile and desktop visual QA, route QA, source-link QA, multilingual QA and live-production verification.

## 3. Canonical Operating Model

### 3.1 Code source of truth

- Canonical repository: `7guard-io/7ya.io`
- Canonical branch for production work: `main`
- All rebuild work occurs on dedicated preview/rebuild branches.
- No alternate 7YA repository may silently overwrite the canonical implementation.
- Production promotion is blocked until the release contract and current hosting/deployment path are verified against the live site.

### 3.2 Content and evidence source of truth

Before any editorial or visual selection, operators must consult:

1. `7YA_SOCIAL_MASTER_INDEX.md`
2. `Igor_Vepretski_MASTER_SOCIAL_SCAN_FINAL_2026-09-30.xlsx`
3. `Igor_Vepretski_MASTER_SOCIAL_SCAN_FINAL_2026-09-30.md`
4. `Igor_Vepretski_7YA_Master_Historical_Ledger_2026-08-23`
5. `7YA_KNOWLEDGE_GRAPH.json`
6. the latest public-link/evidence ledgers
7. raw owner exports and analytics where available
8. public web verification for current external pages

Memory or chat recollection is never enough by itself for factual, media-selection or performance claims.

## 4. Public Media Corpus Rule

All public Igor media is reusable source material when its provenance and context are known.

Every media object should normalize toward:

- canonical_media_id
- platform
- account/publisher
- source_url
- original/owned/external/repost status
- published_at
- captured_at
- media_type
- language
- title/caption
- transcript/summary where available
- people/entities
- life era
- story family
- project/work relation
- metrics with metric timestamp
- public responses/comments when preserved
- external amplification
- verification tier
- rights/visibility status
- reuse notes

Coverage states:

- FULL
- BEST_AVAILABLE
- BLOCKED_GAP

Never claim total historical coverage where a platform is only partially enumerable.

## 5. Content Graph

The experience is driven by this relationship model:

`PERSON → ERA → MOMENT → MEDIA → SOURCE → PUBLIC RESPONSE → CONSEQUENCE → PROJECT`

A Moment is not a decorative card. It is a reusable canonical object with real media, source context, chronology, story role and public-response edges.

Story families include, at minimum:

- childhood / immigration / Jessie Cohen / identity
- service / public service / police
- fatherhood / family stories that are already public and safe to reuse
- StartOn origin and development
- youth-at-risk identity and public work
- music / humor / Russian-Israeli identity / culture
- media / interviews / podcasts / television
- public and civic activity
- October 7 / documented public-response content
- research / AI / leadership / human systems
- 7YA itself
- Now / current work

Sensitive family data, minors, addresses, health, finances, legal/private records and operational details are excluded unless already public and explicitly safe for reuse.

## 6. Information Architecture

### 6.1 Home — IGOR

Goal: establish the person before the framework.

Order:

1. authentic hero portrait or video
2. name + concise present-tense statement
3. voice / motion / original media entry point
4. 6–12 authentic strong moments selected from the corpus
5. immediate path into the life story
6. public-response preview
7. current work / Now
8. clear contact / talk actions

No Acceptance Gate, internal release terminology, canonical-system jargon or dashboard-first metrics in the opening experience.

### 6.2 Life / Journey

A rich chronological Life Atlas from childhood to now.

Each era contains moments, not résumé bullets. Moments use original media, short narrative, source context and optional public-response edges.

### 6.3 Public Response / Echo

A dedicated human-readable layer showing what came back from the public:

- meaningful comments
- reaction snapshots
- shares/reposts
- external distribution
- press pickup
- television/podcast follow-on
- cross-platform story-family continuation

External amplification remains separate from owned reach. Platform metrics are never summed into a synthetic influence total.

### 6.4 Work

StartOn is presented as a major execution chapter with original documents, media, press, timelines and current status.

Other work chapters may include service, public management, speaking, research and current projects where adequately sourced.

### 6.5 Create

Music, video, humor, social formats, writing and creative identity are part of the biography rather than a detached portfolio.

### 6.6 Think

Research, AI, human systems, youth, digital influence and essays are presented as ongoing questions and outputs, each tied to source material.

### 6.7 Proof

Evidence / press / source infrastructure remains fully available but is demoted behind the public story.

### 6.8 Talk

The 7YA companion is an AI grounded in Igor's public corpus. It must never impersonate Igor. It should cite or link the source material it relies on and admit uncertainty or missing evidence.

## 7. Visual Direction

- premium documentary / editorial / living album
- real Igor-owned media first
- public-source media second, with provenance
- no generic AI representation of real life moments
- no stock photography as biographical proof
- no invented quote or invented public reaction
- one strong image/video moment beats collage density
- mobile-first
- excellent RTL Hebrew
- parallel English and Russian experiences; Arabic only where content quality meets the same bar
- technical labels are available on demand, not visually dominant

## 8. Reuse, Not Duplication

One canonical Moment can appear in Home, Life, StartOn, Media, Echo or Evidence without manually rewriting its facts in each surface.

Shared structured data should render multiple experiences. Editorial wrappers may differ, but canonical date/source/media identity must stay consistent.

## 9. Visitor Feedback and Measurement

The rebuild should instrument:

- page/section engagement
- source opens
- media plays
- Story/Moment opens
- Bro Chat questions and unanswered-question classes
- CTA/contact actions
- language use
- exits and dead ends
- optional explicit helpful/not-helpful feedback

Analytics are for product improvement, not inflated public claims.

## 10. AI / NVIDIA / Partner Tools

Partner tools operate as specialist services around the canonical system, never as competing sources of truth.

Potential lanes:

- NVIDIA NIM/NVCF or related verified NVIDIA skills: inference and media/RAG workloads when justified
- OpenAI: reasoning, retrieval, editorial assistance and orchestration
- Supabase: live interaction/feedback/state only when needed
- PostHog or equivalent: product analytics
- Metricool/Windsor/Socialstats: connected social telemetry
- Figma/Adobe/Canva: design and asset workflows
- Runway/Higgsfield/fal/OpenArt: creative treatments only when they do not fabricate documentary evidence
- Vercel/Cloudflare/AppDeploy: hosting/runtime/deployment roles only

No partner tool may independently create a new 7YA source-of-truth project.

## 11. Failure Memory — Never Repeat

- generic AI moments or people presented as Igor
- placeholder proof
- stock or generated imagery replacing available original media
- dashboard/system language before the human story
- duplicated navigation and competing information architectures
- stale deployment presented as success
- edits against the wrong repository/runtime
- partial locale translation
- metric claims without source + timestamp
- invented causal claims from correlation
- mixing owned and external reach
- calling a selection complete when platform coverage is partial
- production publish without preview and visual QA
- rebuilding existing content from memory instead of source retrieval

## 12. Rebuild Sequence

### Phase 0 — Reconciliation

- verify canonical repo and release/deployment contract
- inventory live routes against repo routes
- identify stale/duplicate/experimental code and root-level unrelated material
- map existing content registries, scripts and generated artifacts
- confirm production/live build provenance

### Phase 1 — Canonical Corpus + Graph

- create normalized media/moment/story-family schema
- import or map current 434-record archive and master social scan
- keep coverage/confidence metadata
- add public-response edges

### Phase 2 — New Experience Shell

- person-first Home
- Life Atlas
- Echo/Public Response
- Work/StartOn
- Create
- Think
- Proof
- Talk entry point

### Phase 3 — Companion + Analytics

- source-grounded chat retrieval
- feedback instrumentation
- query-gap reporting

### Phase 4 — QA and Cutover

- desktop + iPhone/mobile visual review
- HE/RU/EN content integrity
- route/link/media/source QA
- accessibility/performance smoke
- preview owner review
- controlled production promotion
- live-domain smoke + rollback readiness

## 13. Acceptance Gate

The rebuild is accepted only when:

- first screen is clearly human/person-first
- no invented biographical media appears
- every featured moment has real source/context
- public response is visible and source-bound
- StartOn is understandable as real work, not branding copy
- life chronology is coherent
- source/evidence system is accessible but secondary
- mobile experience is visually strong
- major HE/RU/EN pages are internally consistent
- all primary CTAs and source links work
- production matches the approved preview

## 14. Out of Scope Until Separate Approval

- rewriting or deleting raw historical evidence
- publishing unsupported aggregate influence numbers
- exposing private/sensitive family information
- replacing the canonical repository with a new app builder project
- autonomous public posting as part of the site rebuild

## 15. Owner Review Questions

This spec intentionally fixes the architecture and operating rules before runtime code changes. Owner review should focus on whether the public story hierarchy, reuse rules, corpus rules and acceptance criteria match the intended 7YA experience.
