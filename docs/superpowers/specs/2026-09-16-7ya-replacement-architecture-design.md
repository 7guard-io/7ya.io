# 7YA Replacement Architecture Design

**Status:** Proposed architecture locked by product owner on 2026-09-16; implementation requires a separate reviewed plan and release gates.

**Repository:** `7guard-io/7ya.io`

**Production topology authority:** `docs/governance/PRODUCTION_TOPOLOGY_2026-09-16.md`

## 1. Product definition

7YA is not a conventional personal website. It is a **Living Intelligence Biography**: a source-bound system that knows the documented people, moments, media, places, projects, posts, institutions, evidence and metrics around Igor Vepretski, relates them through a graph, and composes them into a visual, interactive experience without changing the underlying historical record.

The visitor should experience a simple chain:

`person → life → image/video → moment → context → source → connections → next moment`

The implementation must hide the system complexity from public visitors. AI, ingestion, registries, evidence states and provider infrastructure are supporting mechanisms, not the public hero.

## 2. Architectural decision

### Selected approach: migrate to one Core behind stable contracts

Existing production contains valuable Canon, Discovery, graph, media, social, evidence, life-scene and story-composition capabilities. They must be converged behind a single domain model rather than replaced wholesale.

Three approaches were considered:

1. **Continue incremental component layering — rejected.** It preserves short-term velocity but deepens competing representations of biography, media and navigation.
2. **Full rewrite — rejected.** It risks losing provenance, evidence boundaries, working ingestion and the verified public archive.
3. **Contract-first strangler migration into 7YA Core — selected.** Existing capabilities remain available while adapters progressively project them into one stable Core. New public experience reads from Core contracts only.

No new parallel source-of-truth subsystem may be introduced as part of this migration.

## 3. Core domain model

The authoritative public domain model is `7YA Core`.

Primary object classes:

- `Person`
- `Moment`
- `MediaAsset`
- `Place`
- `Project`
- `Post`
- `Institution`
- `Evidence`
- `MetricSnapshot`

Every object has a stable ID and explicit provenance. Relationships are first-class records rather than implicit UI assumptions.

Minimum shared object envelope:

```ts
export type CoreObjectEnvelope = {
  id: string;
  kind: 'person' | 'moment' | 'media' | 'place' | 'project' | 'post' | 'institution' | 'evidence' | 'metric';
  status: 'CANON' | 'DISCOVERY' | 'PENDING' | 'PRIVATE' | 'QUARANTINED';
  title: LocalizedText;
  summary?: LocalizedText;
  dates?: {
    start?: string;
    end?: string;
    precision?: 'day' | 'month' | 'year' | 'period' | 'unknown';
  };
  sourceIds: string[];
  mediaIds: string[];
  relationshipIds: string[];
  createdAt: string;
  updatedAt: string;
};
```

Relationship records use stable IDs and explicit semantics:

```ts
export type CoreRelationship = {
  id: string;
  fromId: string;
  toId: string;
  type: 'INVOLVES' | 'OCCURRED_AT' | 'PART_OF' | 'DOCUMENTED_BY' | 'PUBLISHED_AS' | 'RELATED_TO' | 'PRECEDES' | 'FOLLOWS' | 'MEASURED_BY';
  evidenceIds: string[];
  status: 'VERIFIED' | 'DOCUMENTED' | 'SELF_ATTESTED' | 'SOURCE_PENDING';
};
```

The graph is a projection of Core objects and relationships. It is not a separate truth database.

## 4. Four non-negotiable contracts

### 4.1 Canon Contract

A verified fact or source-bound historical record does not change because the site is redesigned. Canon objects keep stable IDs and provenance across frontends and providers.

Truth flow:

`SOURCE → DISCOVERY → VERIFY → CANON`

AI output never skips verification and never promotes itself into Canon.

### 4.2 Media Contract

Each media asset receives a stable `asset_id`. Derivatives, thumbnails and placements refer to the stable asset rather than creating new identities.

Minimum metadata:

```ts
export type MediaIntelligence = {
  assetId: string;
  canonicalId?: string;
  capturedAt?: string;
  peopleIds: string[];
  placeIds: string[];
  momentIds: string[];
  projectIds: string[];
  platform?: string;
  sourceUrl: string;
  mediaKind: 'image' | 'video' | 'audio' | 'document' | 'source-frame';
  orientation?: 'portrait' | 'landscape' | 'square' | 'unknown';
  visualQuality?: number;
  faces?: Array<{ personId?: string; confidence?: number }>;
  sceneTags: string[];
  toneTags: string[];
  historicalPeriod?: string;
  usageRights: 'OWNER_APPROVED' | 'PUBLIC_VERIFIED' | 'SOURCE_ONLY' | 'PRIVATE' | 'UNKNOWN';
  heroScore?: number;
  intelligenceState: 'UNPROCESSED' | 'SUGGESTED' | 'REVIEWED' | 'VERIFIED';
};
```

### 4.3 Experience Contract

The public frontend consumes Core views and scene-composition outputs. It does not become an independent biography database.

A redesign can replace visual composition without rewriting Canon, Media IDs or relationship semantics.

### 4.4 AI Contract

AI may transcribe, classify, summarize, tag, rank, embed, propose relationships and compose presentation. AI may not invent history, silently change verification states, publish private material, or convert inferred identity into fact.

All AI-derived fields remain suggestions until policy allows deterministic acceptance or human verification.

## 5. NVIDIA Intelligence Fabric

NVIDIA is an optional intelligence fabric behind a single provider gateway. It is not the HTML host, source of truth or availability dependency for the public biography.

Logical capabilities:

- Vision: media understanding, scene tags, quality/orientation, object/face suggestions where legally and ethically allowed.
- Language: transcripts, captions, summaries, entity suggestions, topic/context extraction.
- Embeddings: semantic search, similarity, retrieval and relationship discovery.
- NVCF: optional custom container/function execution when a dedicated NVCF credential and target exist.
- NIM / NVIDIA API: direct OpenAI-compatible inference for supported hosted models.

### Credential-routing contract

Provider identity must be explicit:

- `NVCF_API_KEY` → NVCF only.
- `NVIDIA_NIM_API_KEY` → direct NIM / `integrate.api.nvidia.com`.
- Legacy `NVIDIA_API_KEY` → direct NIM compatibility alias until renamed.
- The same credential must never be blindly tried against both NVCF and NIM protocols.

Provider selection:

```text
if NVCF_API_KEY + configured function target are healthy:
    NVCF may be used for workloads explicitly assigned to NVCF
else if NVIDIA_NIM_API_KEY exists:
    use direct NIM
else if legacy NVIDIA_API_KEY exists:
    use direct NIM compatibility route
else:
    use non-NVIDIA fallback
```

A 401/403 is an authentication/provider-routing failure, not a reason to disable the rest of 7YA. Circuit breakers apply per provider route, not globally to all AI capabilities.

## 6. Current NVIDIA root cause

The inspected AppDeploy runtime currently contains only `NVIDIA_API_KEY` among NVIDIA credentials. Its backend logic classifies `NVIDIA_API_KEY` as an NVCF credential first, while direct NIM reads only `NVIDIA_NIM_API_KEY`.

Observed production behavior:

`NVIDIA_API_KEY → NVCF discovery → HTTP 401 → repeated canary failures → canary disabled`

This is a routing-contract defect. The first implementation change after a writable runtime exists is to separate NVCF and NIM credential identity as specified above and verify both routes independently.

The current AppDeploy lifetime deploy quota is exhausted (`400/400`). The fix must not be described as production-live until it is deployed through an authorized writable runtime and verified on the actual public system.

## 7. Ingestion and verification pipeline

Inputs may include Instagram, Facebook, TikTok, YouTube, LinkedIn, Telegram, press, Drive/library sources and public web sources.

Pipeline:

```text
SOURCE CONNECTOR
  → INGEST
  → NORMALIZE
  → DEDUPLICATE
  → INTELLIGENCE ENRICHMENT
  → DISCOVERY
  → VERIFICATION
  → CANON
  → CORE PROJECTIONS
```

Intelligence enrichment can produce transcripts, entity suggestions, topics, media tags, similarity and importance suggestions. It cannot publish to Canon directly.

Each source adapter must be independently degradable. Failure of one platform leaves Canon and the rest of the site operational.

## 8. Personal Visual Rule

Technical invariant: **NO GENERIC IGOR**.

When a scene concerns Igor's real life, visual selection order is:

1. Canon personal media.
2. Owner-approved personal media.
3. Verified public personal media.
4. Source screenshot/frame with provenance.
5. Minimal non-deceptive placeholder when none of the above exists.

Generic stock people, synthetic portraits and decorative AI stand-ins are forbidden for biographical scenes.

Media selection is a query against Asset Intelligence, not a hard-coded decorative image wall.

## 9. Scene Engine

`storyComposition` becomes the central composition service, renamed/evolved into `Scene Engine` while retaining Canon-only factual grounding.

A Scene is a view model, not a new fact:

```ts
export type Scene = {
  id: string;
  theme: string;
  canonicalMomentIds: string[];
  selectedMediaAssetIds: string[];
  sourceIds: string[];
  relationshipIds: string[];
  narrative: LocalizedText;
  cta?: SceneAction;
  compositionReason: string;
};
```

The same Canon can be recomposed according to visitor intent without altering history.

Default homepage arc:

1. **Opening / Igor** — authentic full-frame personal media; minimal copy.
2. **Origin** — Kharkiv → Israel → Bat Yam → Jesse Cohen.
3. **Service** — military → security → police/public service, with evidence boundaries.
4. **Human / Fatherhood** — personal-human material that prevents CV-like presentation while respecting privacy.
5. **Return / StartOn** — return to Jesse Cohen and the social mission.
6. **Public Voice** — native social posts, videos, reactions/metrics only when source-bound.
7. **Creation** — music, video and creative work.
8. **Public Work / Leadership** — factual dates, activities and sources; no unsupported political outcome claims.
9. **7YA / Now** — reveal that the experience itself is a connected living record.

The exact number may range from 8–10 only when the additional scene has distinct narrative purpose and source-bound content.

## 10. Dynamic Storytelling

Scene Engine may return different paths for different intents:

- StartOn route: origin → Jesse Cohen → service → return → StartOn → youth → current work.
- Public-career route: service → security → police → municipality/public work → communication → present.
- Music route: identity → social/creative voice → tracks/videos → wider biography.

Composition changes; Canon does not.

Any dynamic route must expose source actions for factual claims and label Discovery material if it is deliberately shown.

## 11. Ask / Bro Chat integration

The public conversational interface is a navigation layer over Core and Scene Engine, not a chatbot widget detached from the page.

A grounded answer may return:

- answer text;
- cited/source-bound Core object IDs;
- `scenePath` to display;
- focus target;
- next actions.

Example contract:

```ts
export type AskNavigationResult = {
  answer: string;
  sourceIds: string[];
  coreObjectIds: string[];
  scenePath?: string[];
  focusSceneId?: string;
  actions: SceneAction[];
};
```

When a visitor asks how StartOn connects to childhood, the UI may transition through the relevant canonical scenes while the response remains grounded in those same objects and sources.

## 12. Public information architecture

Primary public navigation is deliberately small:

`IGOR · LIFE · WORK · MEDIA · STARTON · ASK`

Museum, Evidence, Research, Music, Library, People, Entities, Sources, Search, Canon and Discovery remain available as depth views over Core. They must not compete as separate top-level products.

Public pages must not expose operational dashboards, health telemetry or internal queue language as the dominant visitor experience.

## 13. Private 7YA Control

The private control plane remains separate from the public experience and may contain:

- Content Inbox
- Discovery
- Canon Queue
- Media
- Distribution
- Social Connections
- NVIDIA
- SEO
- CTA
- Opportunities
- Analytics
- Site Health

Control-plane state may operate the public system but never becomes public biography merely because it exists internally.

## 14. Reliability architecture

Logical runtime:

```text
Cloudflare / canonical domain
        ↓
public web + API runtime
        ↓
     7YA Core
   ↙    ↓     ↘
Canon  Media  Graph
        ↓
NVIDIA Gateway (optional)
  ↙        ↓        ↘
NIM       VLM     Embeddings
```

Availability rules:

- NVIDIA outage → public Canon and scenes still render.
- Social API outage → last verified Canon remains available.
- Discovery outage → Canon remains available.
- AI outage → deterministic retrieval/navigation remains available.
- Media derivative failure → source-bound fallback remains available.
- Provider migration → stable Core IDs and source URLs remain unchanged.

Caches may accelerate projections but are never the sole copy of Canon.

## 15. Production topology constraint

This design does not override `docs/governance/PRODUCTION_TOPOLOGY_2026-09-16.md`.

Current operational constraints:

- `7guard-io/7ya.io` is the canonical source-control plane.
- AppDeploy is legacy/backend only and its `deploy_app` lifetime quota is exhausted.
- `7ya.io` currently still resolves through the legacy AppDeploy path until a governed cutover occurs.
- The provider-independent Forever Runtime is a reference/fallback experience.
- Vercel is a candidate only after it is reconciled with the canonical repository.
- No DNS cutover is allowed until provider URL, canonical-source provenance, custom-domain attachment and public mobile/desktop verification all pass.

## 16. Migration strategy

This is a strangler migration, not a rewrite.

### Phase A — runtime truth and provider gateway

- Export/reconcile the exact useful runtime source into canonical source control without overwriting newer canonical frontend work.
- Introduce explicit NVIDIA provider credential routing.
- Preserve non-NVIDIA fallback.
- Establish one writable deployment target tied to the canonical repository.

### Phase B — Core contracts

- Define stable Core IDs and object schemas.
- Add adapters from Canon, media registry, public graph and social ingestion.
- Make the graph a projection from Core relationships.
- Prevent new parallel truth stores.

### Phase C — Asset Intelligence

- Normalize authentic image/video assets under stable `asset_id` values.
- Run bounded intelligence enrichment into suggestion fields.
- Add rights/privacy gates and hero/media ranking.
- Enforce NO GENERIC IGOR in public selectors.

### Phase D — Scene Engine

- Move story composition onto Core queries and stable scenes.
- Build the default 8–10 scene homepage.
- Preserve source actions and multilingual output.
- Keep archive/depth routes as Core views.

### Phase E — Ask-driven navigation

- Return scene navigation payloads from the grounded conversational layer.
- Let chat focus/recompose existing scenes rather than create a separate conversational universe.

### Phase F — continuous QA and distribution

- Run mobile/desktop visual acceptance against the actual public domain.
- Assert personal-media density, source reachability, no generic-person regressions and no public dashboard regressions.
- Only after Core/experience stability, connect distribution CTAs to stable Moment URLs and measure source-bound conversions.

## 17. Privacy and safety

Existing repository privacy rules remain binding. Core may know more than public views expose.

Never auto-publish identifying information about minors, private family details, medical/legal/financial information, private contact information, security methods or raw private correspondence.

Face recognition/identity inference, if ever used, remains suggestion-only and must follow applicable consent, legal and platform requirements. Unknown faces remain unknown rather than guessed.

## 18. Testing and release gates

### Contract tests

- Stable ID generation and deduplication.
- Discovery cannot self-promote to Canon.
- Graph edges reference existing Core IDs.
- Media asset identity survives derivative changes.
- `NVCF_API_KEY` never routes to direct NIM.
- `NVIDIA_NIM_API_KEY` never routes to NVCF.
- Legacy `NVIDIA_API_KEY` routes only to direct NIM compatibility path.

### Integration tests

- Ingest → normalize → discovery path.
- Verified promotion → Core → graph projection.
- Asset enrichment produces suggestions without mutating Canon.
- Scene Engine composes only from allowed Core objects.
- Ask result can drive scene navigation using returned Core IDs.
- Provider/AI failures degrade without blanking the biography.

### Visual acceptance

Mobile and desktop must verify:

- first viewport is visibly Igor/personal rather than system-first;
- authentic media is used for biographical scenes;
- chronology and scene transitions are readable;
- source actions are reachable;
- no generic-person imagery appears in personal contexts;
- no dashboard/system telemetry dominates public navigation;
- chat navigation does not obscure or replace the story;
- RTL Hebrew remains first-class.

### Release truth

A commit, PR, provider preview or successful build is not a production release. Production is complete only when `https://7ya.io/` itself serves the intended version and passes the relevant public-domain mobile/desktop and source checks.

## 19. Success criteria

The replacement architecture is successful when:

1. There is one Core representation for public biographical objects and relationships.
2. Canon, Media and AI identities survive frontend redesigns and provider migration.
3. New source material can enter the ingestion pipeline without manually redesigning pages.
4. NVIDIA enrichment is useful when healthy and invisible to availability when unhealthy.
5. Public pages use authentic personal/source media rather than generic biographical imagery.
6. Scene Engine can recompose the same verified record around different visitor intents.
7. Ask/Bro Chat can navigate the visible experience using the same Core objects.
8. Public navigation is limited to the human-facing product while operational systems remain private.
9. The public `7ya.io` domain, not an internal snapshot, is the final acceptance surface.
10. Future redesigns can replace presentation without rewriting documented life history.

## 20. Non-goals for the first implementation cycle

- Rebuilding every historical depth page at once.
- Publishing AI-suggested relationships without verification.
- Requiring NVIDIA for first paint or Canon retrieval.
- Migrating DNS before source/provider reconciliation.
- Creating a new public analytics dashboard.
- Creating another independent registry that competes with Core.
