# 7YA Replacement Architecture Design

**Date:** 2026-09-16  
**Status:** Approved architecture  
**Canonical repository:** `7guard-io/7ya.io`  
**Production runtime:** AppDeploy app `697a008fddc309b142`  
**Canonical domains:** `https://7ya.io` and `https://www.7ya.io`

## 1. Purpose

7YA is not a conventional personal website. It is a living intelligence biography: a durable system that ingests public and owner-approved material about Igor Vepretski, preserves provenance, separates discovery from verified canon, links people, places, projects, media and moments, and renders those records as a cinematic, interactive public experience.

The target experience is:

`person -> life -> image/video -> moment -> context -> source -> relationships -> next moment`

The system must remain useful when AI providers, social APIs or individual source websites are unavailable.

## 2. Core product principles

1. **One Core, many views.** Canon, media, entities, social ingestion, evidence, search, story composition and public pages consume one normalized core model instead of maintaining competing representations.
2. **Evidence before presentation.** Factual biography and impact claims require source provenance. Discovery material is never silently promoted into Canon.
3. **NVIDIA interprets; Canon decides truth.** AI may classify, transcribe, embed, rank and propose relationships, but it does not create historical facts.
4. **Personal media first.** Igor-related pages must prefer authentic Igor media and source-bound imagery. Generic or synthetic personal imagery is not used as a substitute.
5. **Public experience is not an admin dashboard.** Operations, diagnostics, ingestion queues and system health remain private/control-plane concerns.
6. **Graceful degradation.** The public site remains functional if NVIDIA, social APIs, Discovery or individual sources are unavailable.
7. **Repository is authoritative for source.** Production must no longer be structurally ahead of the canonical repository without an explicit export-and-reconcile step.
8. **Mobile first.** Every production-facing release is accepted on mobile before visual polish is considered complete.
9. **Reuse before creating.** Existing Canon, Public Internet Graph, Story Composition, Media Registry, Visual Registry, Album, Bro Chat and social ingestion capabilities are consolidated rather than replaced by parallel systems.

## 3. Current-state constraints

The active production application is deployed and serving without current frontend or backend runtime errors. The custom domains are active. The current codebase already contains Canon, Discovery, Public Internet Graph, social ingestion, media registry, visual registry, entities, story composition, Bro Chat, evidence, multilingual routing and visual QA infrastructure.

The current architectural debt is not lack of features; it is overlap and competing presentation/runtime layers. The production source also contains a very large `backend/index.ts` responsible for unrelated domains, plus many frontend home/experience components that evolved in parallel.

NVIDIA is configured with an `NVIDIA_API_KEY`, while the current routing treats that credential as an NVCF credential before the direct NIM route. Production canaries have repeatedly failed with HTTP 401 and were disabled after their failure threshold. A separate `NVIDIA_NIM_API_KEY` is not currently present. The replacement architecture must remove credential ambiguity before NVIDIA becomes a critical path dependency.

## 4. Target architecture

```text
PUBLIC SOURCES
Instagram / Facebook / TikTok / YouTube / LinkedIn / Telegram / Press / Web / Drive
                                  |
                                  v
                              7YA INGEST
                         normalize + dedupe
                                  |
                                  v
                             DISCOVERY
                                  |
                       verify + provenance
                                  |
                                  v
                              7YA CORE
              +-------------------+-------------------+
              |                   |                   |
           PERSON               MOMENT              MEDIA
           PLACE                PROJECT             POST
           ENTITY               SOURCE              METRIC
              +-------------------+-------------------+
                                  |
                         RELATIONSHIP GRAPH
                                  |
                    +-------------+-------------+
                    |                           |
             NVIDIA INTELLIGENCE              SEARCH
                    |
          +---------+---------+
       Nemotron    Vision    Embeddings/Rerank
                    |
                    v
                 SCENE ENGINE
                    |
          +---------+----------+----------+
         HOME     MOMENT      BRO CHAT   STARTON/MEDIA/LIFE
                    |
                    v
                  7YA.IO
```

## 5. Canonical data contracts

### 5.1 CoreRecord

All durable public objects expose a common envelope.

```ts
type LocalizedText = { he: string; en: string; ru: string };

type CoreKind =
  | 'person'
  | 'moment'
  | 'media'
  | 'post'
  | 'project'
  | 'place'
  | 'institution'
  | 'source'
  | 'metric';

type VerificationState =
  | 'verified'
  | 'owner-reported'
  | 'discovery'
  | 'unresolved'
  | 'quarantined';

type CoreRecord = {
  id: string;
  kind: CoreKind;
  title: LocalizedText;
  summary: LocalizedText;
  canonicalDate?: string;
  verification: VerificationState;
  sourceRefs: string[];
  mediaRefs: string[];
  relationshipRefs: string[];
  createdAt: string;
  updatedAt: string;
};
```

Existing Canon records may be adapted into this contract through projection adapters during migration; the migration does not require destructive conversion in one release.

### 5.2 SourceRef

Every factual claim capable of public verification points to a source object with stable identity, public URL where available, source type, publication date when known, verification status and provenance metadata.

### 5.3 MediaAsset

Every image, video, audio or document receives a stable `assetId`. Media metadata includes source, ownership/usage status, date or date confidence, linked people/projects/moments, visual orientation, dimensions when known, authenticity status and proposed AI metadata.

AI-derived metadata is stored separately from verified metadata so a model suggestion cannot silently become Canon.

### 5.4 Relationship

Relationships are explicit objects, not inferred UI glue. Examples include `INVOLVES`, `OCCURRED_AT`, `CREATED_BY`, `PART_OF`, `SUPPORTED_BY`, `PUBLISHED_AS`, `RELATED_TO`, `BEFORE`, `AFTER`, `EVIDENCED_BY` and `FEATURES_MEDIA`.

## 6. NVIDIA Intelligence Gateway

### 6.1 Boundary

No public feature may call NVIDIA endpoints directly. All model access passes through one `NvidiaGateway` interface.

```ts
interface NvidiaGateway {
  health(): Promise<NvidiaHealth>;
  generate(input: GenerateInput): Promise<GenerateResult>;
  vision(input: VisionInput): Promise<VisionResult>;
  embed(input: EmbedInput): Promise<EmbedResult>;
  rerank(input: RerankInput): Promise<RerankResult>;
}
```

### 6.2 Credential policy

- `NVIDIA_NIM_API_KEY` is used only for NVIDIA-hosted NIM/integrate endpoints.
- `NVCF_API_KEY` is used only for NVCF function discovery/invocation.
- `NVIDIA_API_KEY` is not interpreted ambiguously by runtime code after migration; if retained temporarily for compatibility, it is mapped explicitly during migration and later removed.
- Credential values are never returned to clients or logs.

### 6.3 Failure policy

NVIDIA failure must not blank, crash or block the public biography. Search, Canon pages, media, source links and deterministic navigation remain available. AI-dependent enhancement surfaces display a restrained unavailable state or fall back to deterministic retrieval.

## 7. Ingestion and truth flow

The truth pipeline is:

`SOURCE -> NORMALIZE -> DISCOVERY -> VERIFY -> CANON`

New social/public material is normalized and deduplicated before entering Discovery. Automated enrichment may add transcript, entities, topics, candidate dates, candidate people, candidate places, embeddings and importance signals.

Promotion to Canon requires evidence rules appropriate to the record. Owner-approved media can be marked owner-approved without being treated as proof for unrelated biographical claims.

No automated publishing to external platforms is introduced by this architecture.

## 8. Personal media policy

A production-facing Igor life scene resolves imagery in this order:

1. Canon personal photo/video.
2. Owner-approved personal media.
3. Verified public personal media.
4. Source screenshot or source-bound preview.
5. Minimal neutral visual treatment.

Generic stock or synthetic imagery depicting an invented Igor-like person, invented police/army scene, invented childhood scene or invented political/public setting is prohibited as a replacement for missing personal media.

AI image generation may only be used where the experience clearly presents the image as conceptual/artistic rather than documentary biography.

## 9. Scene Engine

The Scene Engine is the presentation composition layer. It consumes Core records and emits deterministic, source-bound scene descriptions for public views.

```ts
type SceneRequest = {
  subject: 'igor';
  intent: 'homepage' | 'moment' | 'story' | 'starton' | 'media';
  locale: 'he' | 'en' | 'ru';
  viewport: 'mobile' | 'desktop';
  query?: string;
};

type Scene = {
  id: string;
  chapter: string;
  title: LocalizedText;
  summary: LocalizedText;
  primaryMediaRef?: string;
  supportingMediaRefs: string[];
  sourceRefs: string[];
  relationshipRefs: string[];
  nextSceneIds: string[];
};
```

The Scene Engine does not invent facts. For personalized or query-driven paths, NVIDIA may propose a sequence, but every emitted scene must resolve to existing Core records and source relationships.

## 10. Homepage experience

The homepage becomes a cinematic life journey rather than a stack of product/dashboard sections. Initial canonical chapter order:

1. Opening / identity.
2. Origin and immigration.
3. Jesse Cohen / belonging.
4. Service and responsibility.
5. Police / public service.
6. Human/fatherhood layer where publicly appropriate and source-supported.
7. Return / StartOn.
8. Public voice and social media.
9. Creation / music.
10. 7YA / current work.

Each scene prioritizes real media, brief copy, one meaningful interaction and source access. Long text walls, redundant system labels and competing navigation are release defects.

## 11. Bro Chat integration

Bro Chat becomes an intelligent navigation surface, not a detached chatbot.

A factual question about Igor triggers evidence retrieval first. The response payload may include:

- a grounded answer,
- related Core record IDs,
- a story composition,
- media refs,
- source refs,
- suggested next questions/actions.

The public UI may transition from the answer directly into the relevant scene or moment while preserving source visibility.

Bro Chat remains explicitly AI; it does not impersonate Igor in first person as a factual identity claim.

## 12. Public plane vs control plane

### Public plane

Primary public navigation is reduced to a small set of human-facing concepts:

`IGOR · LIFE · WORK · MEDIA · STARTON · ASK`

Museum, evidence, research, music, library, entities and search remain available as views/deep links but do not compete as equal top-level product identities.

### Control plane

Operational surfaces remain private/admin-only and include:

- ingestion inbox,
- Discovery queue,
- verification/Canon promotion,
- media intelligence,
- NVIDIA/provider health,
- social connection status,
- distribution tracking,
- SEO,
- analytics,
- opportunity/CTA tracking,
- site health and release gates.

## 13. Repository and deployment discipline

`7guard-io/7ya.io` is the canonical source repository.

AppDeploy remains the production runtime. Production-only source divergence is treated as debt to reconcile, not as the normal operating model.

The target release flow is:

`Git -> tests -> build -> staging/preview -> visual QA -> AppDeploy -> 7ya.io`

Every production release must be traceable to a repository commit or an explicitly documented emergency patch that is immediately reconciled back into the repository.

`vepretski/7ya.io` is not allowed to act as a second competing production source of truth during this migration.

## 14. Reliability and degradation

The system must continue to render meaningful public content when:

- NVIDIA is unavailable,
- one or more social APIs are unauthorized or rate-limited,
- Discovery refresh fails,
- a source page cannot be scraped,
- a media preview fails,
- external metrics are unavailable.

Canon, cached/public-safe media, deterministic relationships and source links form the durable fallback.

## 15. Release gates

A release is not accepted merely because deployment completed.

### Runtime gate

- No uncaught frontend errors on primary routes.
- No backend errors on primary public APIs.
- Health endpoint returns success.

### Visual gate

- Mobile and desktop primary routes render meaningful content.
- No blank or mostly-empty primary surfaces.
- No horizontal overflow or clipped critical controls.
- Homepage visibly contains authentic personal/source-bound media.
- Public experience does not resemble an admin dashboard.

### Evidence gate

- Canon/Discovery status remains explicit.
- Factual Igor claims remain source-bound.
- AI enrichment cannot overwrite verified fields silently.

### NVIDIA gate

- Health probe distinguishes NIM, NVCF, auth, endpoint and upstream failures.
- Failure leaves deterministic public experience functional.
- No secret values are exposed.

### Source-alignment gate

- Production release identifies the canonical repository commit.
- Production code changes are not left permanently ahead of Git.

### Performance gate

- Mobile-first rendering budget is enforced.
- Media is lazy-loaded where appropriate.
- Critical text/navigation remains available before non-critical rich media finishes.

### Rollback gate

- The previous deployable AppDeploy version remains identifiable and can be reapplied if the new release fails acceptance.

## 16. Migration sequence

### R0 — Foundation and NVIDIA routing

- Separate NIM and NVCF credentials.
- Introduce `NvidiaGateway`.
- Replace ambiguous provider routing.
- Add deterministic provider-health tests.
- Re-enable canaries only after auth/endpoint probes pass.

### R1 — Core contracts and source alignment

- Introduce shared Core types and adapters over current Canon/Graph structures.
- Break unrelated backend responsibilities out of `backend/index.ts` where touched by the migration.
- Establish repository-to-production release provenance.

### R2 — Media Intelligence

- Introduce stable `assetId` records.
- Consolidate Media Registry and Visual Registry access behind one media service.
- Add AI-proposed metadata separated from verified metadata.
- Implement personal-media resolution policy.

### R3 — Scene Engine

- Consolidate current Story Composition, Life Scenes and related presentation logic behind one scene contract.
- Build deterministic homepage composition from Core records.
- Preserve existing deep links while migrating views.

### R4 — Public homepage cutover

- Replace the current accumulated homepage layers with the Scene Engine output.
- Enforce simplified public navigation.
- Remove dashboard/system visual language from the public homepage.

### R5 — Bro Chat navigation integration

- Return related scene/moment/media/source references with grounded answers.
- Allow answers to transition into public story views.

### R6 — Control-plane consolidation

- Keep ingestion, verification, NVIDIA, social, analytics and release operations behind admin/auth controls.
- Remove public exposure of operational UI not intended for visitors.

### R7 — Cleanup and deprecation

- Identify superseded home/experience components.
- Remove them only after route coverage and visual parity gates pass.
- Remove temporary compatibility aliases for old NVIDIA credentials.
- Document final ownership boundaries.

## 17. Testing strategy

Implementation follows test-first changes wherever behavior changes.

Required test categories:

1. Unit tests for Core adapters, media resolution and relationship normalization.
2. Unit tests for NVIDIA credential selection and failure classification.
3. Integration tests for Canon/Discovery separation.
4. Integration tests for Scene Engine source binding.
5. API tests for public fallbacks with NVIDIA disabled.
6. Route tests for homepage, moment, entity, library, StartOn and Bro Chat.
7. Visual acceptance on mobile and desktop before cutover.
8. Regression tests protecting existing canonical URLs and source links.

## 18. Non-goals

This migration does not:

- rewrite every public page at once,
- move static HTML/media delivery onto GPU infrastructure,
- grant AI permission to publish externally without approval,
- invent new reach totals or unverifiable biography,
- delete legacy components before replacement views pass acceptance,
- make NVIDIA a single point of failure,
- replace public-source provenance with model confidence.

## 19. Definition of success

The migration is successful when:

1. `7ya.io` visibly feels like an authentic, cinematic life record rather than a generic website or admin system.
2. New source material can enter one ingestion pipeline and become discoverable without hand-editing multiple independent page systems.
3. Verified information, media and relationships have stable identities and can be reused across homepage, moments, search, StartOn, media and Bro Chat.
4. NVIDIA enriches and composes the experience but the public site remains functional without it.
5. Production source is traceable to the canonical Git repository.
6. Personal chapters use authentic Igor/source-bound media instead of generic substitutes.
7. Bro Chat can answer grounded questions and open the relevant life/story path.
8. Each release is accepted by runtime, evidence, visual, performance and rollback gates rather than by deployment status alone.
