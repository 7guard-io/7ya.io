# IGOR LIFE SCENE GRAPH — Architecture Design

**Date:** 2026-08-23  
**Product:** 7YA / Igor Vepretski living autobiography  
**Status:** Approved direction; written-spec review required before implementation

## 1. North Star

7YA must feel like accompanying Igor Vepretski through actual lived moments, not browsing a portfolio, dashboard, dossier, or category archive.

A visitor entering any public route should experience one continuous biography in which media, creation, research, StartOn, public action, politics, #7YA, collaborators, places, transcripts, posts, relationships and evidence are different lenses over the same life.

The operating model is:

**PUBLIC LIFE SOURCES → PROVENANCE → ENTITIES → SCENES → RELATIONSHIPS → VOICE → AFTERMATH → PAGE LENSES → PERSONAL JOURNEY**

The site becomes richer by connecting verified and approved material, not by inventing missing biography.

## 2. Execution Source of Truth

The current production source is the applied AppDeploy snapshot for app `697a008fddc309b142`, version `1787486433696` as inspected on 2026-08-23.

GitHub repository `7guard-io/7ya.io` remains the durable engineering/audit repository, but it contains historical `appdeploy-live/<version>` snapshots and may lag the currently applied AppDeploy source.

Implementation therefore follows this rule:

1. inspect and modify the current AppDeploy source snapshot, not a stale historical `appdeploy-live` directory;
2. validate and deploy through the existing AppDeploy deployment gate;
3. record/export the resulting release into GitHub using the existing release-receipt/snapshot workflow;
4. never overwrite newer production behavior from an older GitHub snapshot.

This spec is committed to GitHub because it is the durable architectural record; it does not make an older source snapshot authoritative.

## 3. Current-State Findings

The current production snapshot already contains the correct primitives but they are fragmented:

- `shared/canonical-corpus.ts` is the high-trust public source of canonical life events, with visibility, date precision, verification, sources, media, metrics and related-event ids.
- `GET /api/discovery-library` exposes a broader public discovery layer assembled from the audited media workbook, discovery-max sheet and live social feeds. It is explicitly non-canonical.
- `GET /api/visual-registry` resolves approved public visuals across canonical media, source previews, live social material and explicitly approved owner-public seeds.
- `src/media-appearances.ts` contains structured third-party interviews, podcasts, radio and television appearances.
- `src/relationship-registry.ts` distinguishes active systems, documented workflows, ecosystem membership, pilots, coverage and source-only relationships.
- `src/IgorContextMachine.tsx` models people, creators, positions, transcript state and relationship grammar.
- `src/IgorSceneEngine.tsx` demonstrates the desired scene grammar — moment, people, source, meaning, transcript state and discovery traces — but its primary scene list is hard-coded and narrow.
- `src/life-first/HundredMoments.tsx` already merges canonical events, visual registry and discovery records into up to 100 de-duplicated chronological entrances, proving dynamic multi-source composition is viable.
- owner archive exports in Drive contain numerous SRT/caption references, but a caption reference is not a reviewed public transcript.
- the audited public-influence workbook and canonical-published-work index contain substantially more historical media, propagation and research material than the current cinematic journey exposes.

The bottleneck is not lack of content. It is lack of a common scene projection layer.

## 4. Architectural Decision

Build a **Life Scene Graph projection layer** above the existing corpus and discovery systems.

Do **not** replace the canonical corpus. Do **not** make the discovery sheet canonical. Do **not** rewrite the site.

The Scene Graph compiles scene candidates from existing public-safe sources, resolves people/topics/relationships, attaches provenance and transcript state, scores narrative relevance, and exposes route-specific scene projections to the existing cinematic UI.

`AutobiographicalCinema` remains the presentation direction. The data source progressively changes from manually curated scene arrays to a governed graph/projection API.

## 5. Trust Layers

Every object used by the Scene Graph carries a trust layer.

### T0 — Canonical

Source: public canonical corpus events.

Allowed behavior:
- may anchor chronology;
- may use first-person language only when a canonical/owner-authored source supports it;
- may expose verified dates, media, metrics and related events subject to their precision labels.

### T1 — Verified public record

Source: verified media appearance, official/public publisher page, verified relationship record, approved public visual or public authored work.

Allowed behavior:
- may enrich a canonical or standalone public scene;
- may create a scene when identity and date are sufficiently resolved;
- never silently changes the canonical corpus.

### T2 — Supported / documented public record

Source: documented but incomplete public trace, mirror, known embed or public discovery record with partial metadata.

Allowed behavior:
- may appear as a labelled supporting trace;
- may appear in recovery/discovery rails;
- may not supply invented dates, opinions, participants or causal claims.

### T3 — Discovery / recovery candidate

Source: discovery-only URLs, unresolved embeds, legacy indexes, caption references or undated records.

Allowed behavior:
- may be visible only as an investigation/recovery entrance with explicit status;
- cannot become a canonical fact merely because it appears in an owner workbook or export.

### Private / restricted

Private Drive files, private official documents, unpublished personal material, private conversation records and restricted third-party data never become public merely because a runtime or connector can access them.

Private material may corroborate a public canonical statement without exposing the private source, matching the existing corpus policy for service records.

## 6. Core Data Model

The graph model is a presentation/projection contract. It does not overload `CanonicalEvent` with every experience concern.

`LocaleText` is imported from the existing canonical-corpus contract.

```ts
export type SceneTrust='canonical'|'verified-public'|'supported-public'|'discovery';
export type SceneKind='life'|'service'|'education'|'starton'|'media'|'public-action'|'creator'|'music'|'research'|'politics'|'7ya'|'relationship'|'now';
export type SceneLens='home'|'museum'|'media'|'music'|'research'|'starton'|'politics'|'influence'|'speaker'|'blog'|'create'|'archive';
export type PersonRole='igor'|'co-creator'|'host'|'guest'|'interviewer'|'publisher'|'partner'|'institution'|'public-figure'|'participant'|'distributor'|'subject';
export type SceneRelationshipKind='co-creation'|'hosted-appearance'|'interview'|'coverage'|'distribution'|'active-partnership'|'documented-workflow'|'ecosystem-membership'|'pilot'|'pilot-proposal'|'institutional-context'|'public-source';
export type TranscriptState='verified-excerpt'|'reviewed-transcript'|'caption-reference'|'recovery-lead'|'not-available'|'not-applicable';
export type SceneAftermathKind='media-pickup'|'repost'|'public-discussion'|'follow-up-work'|'project'|'research-question'|'political-action'|'collaboration'|'institutional-response'|'unknown';

export type SceneSourceRef={
  id:string;
  label:string;
  url:string;
  platform?:string;
  trust:SceneTrust;
  relation:'primary'|'publisher'|'mirror'|'owned-mirror'|'distribution'|'evidence'|'discovery';
  publishedAt?:string;
};

export type SceneMediaRef={
  id:string;
  kind:'image'|'video'|'document'|'source-card';
  url?:string;
  sourceUrl:string;
  label:string;
  authenticity:'verified-real'|'publisher-source'|'document'|'source-object'|'unverified';
  trust:SceneTrust;
};

export type ScenePersonRef={
  entityId:string;
  displayName:string;
  role:PersonRole;
  evidenceUrl?:string;
};

export type SceneRelationshipRef={
  id:string;
  name:string;
  kind:SceneRelationshipKind;
  status:string;
  evidenceUrl?:string;
  asOf?:string;
};

export type SceneVoiceRef={
  id:string;
  state:TranscriptState;
  speaker:'igor'|'third-party'|'multiple';
  sourceUrl:string;
  language:'he'|'en'|'ru'|'mixed'|'unknown';
  startSeconds?:number;
  endSeconds?:number;
  excerpt?:string;
  transcriptRef?:string;
  approval:'public-source'|'owner-approved-public'|'review-required';
};

export type SceneAftermath={
  kind:SceneAftermathKind;
  label:string;
  url?:string;
  relatedSceneId?:string;
  trust:SceneTrust;
};

export type LifeScene={
  id:string;
  canonicalEventId?:string;
  storyOrder:number;
  date:string;
  datePrecision:'exact-day'|'month'|'year'|'era'|'unknown';
  trust:SceneTrust;
  kind:SceneKind;
  lenses:SceneLens[];
  title:LocaleText;
  narrative?:LocaleText;
  reflection?:LocaleText;
  topics:string[];
  people:ScenePersonRef[];
  relationships:SceneRelationshipRef[];
  sources:SceneSourceRef[];
  media:SceneMediaRef[];
  voice:SceneVoiceRef[];
  aftermath:SceneAftermath[];
  relatedSceneIds:string[];
  verificationNote:string;
};

export type SceneCoverageSummary={
  canonicalTotal:number;
  canonicalRepresented:number;
  verifiedAppearancesTotal:number;
  verifiedAppearancesRepresented:number;
  verifiedRelationshipsTotal:number;
  verifiedRelationshipsRepresented:number;
  discoveryCandidates:number;
  discoveryMapped:number;
  missingDate:number;
  missingVisual:number;
  captionReferences:number;
  reviewedTranscriptRecords:number;
  missingDimensions:string[];
  degradedSources:string[];
};
```

A discovery-only scene receives a deterministic `storyOrder` from its normalized date plus stable id after canonical order ranges; it never displaces canonical chronology solely because it has a high narrative score.

A `.srt` path discovered in an export maps to `caption-reference` until the underlying media, rights/public status and excerpt are reviewed.

## 7. Scene Compiler

Create a pure projection/compiler layer with no implicit publishing side effects.

### Inputs

- canonical public corpus;
- third-party media appearances;
- relationship registry;
- visual registry;
- discovery library;
- social live feed;
- approved transcript/caption manifest;
- research/publication registry;
- canonical entity registry where available.

### Pipeline

1. **Collect** candidate objects from each source.
2. **Normalize** URLs, dates, titles, platforms and source labels.
3. **Resolve identity** to Igor, people, institutions and known creators.
4. **Cluster duplicates** by canonical event id, normalized URL, platform-native id, title/date similarity and known mirror relationships.
5. **Assign trust** from origin and verification state.
6. **Map relationship grammar** so host, co-creator, publisher, partner and distributor remain distinct.
7. **Attach media** using the visual registry; prefer real/public-source media over generic source cards.
8. **Attach voice** only when transcript/caption state permits it.
9. **Infer only permitted edges**: related source, mirror, temporal continuation and topic similarity may be inferred; person-specific opinion and causal claims may not.
10. **Score narrative relevance** for each lens.
11. **Project** a route-specific ordered scene set.
12. **Return provenance** with every scene.

The compiler is deterministic for the same input snapshot.

## 8. Scene Scoring

Narrative scoring chooses what is shown first; it never decides truth.

Recommended components:

- `+40` canonical event;
- `+30` verified third-party/public source;
- `+20` authentic visual available;
- `+18` direct Igor voice / reviewed transcript available;
- `+16` known person or creator relationship;
- `+14` verified aftermath/propagation;
- `+12` cross-domain bridge;
- `+10` exact date;
- `+8` route-lens match;
- `-20` unresolved identity;
- `-20` undated when chronology is essential;
- `-30` duplicate/mirror of a stronger scene;
- `-50` restricted/private.

Trust labels are never overridden by score. Canonical chronological anchors remain stable even when a discovery record scores highly.

## 9. People × Igor

People emerge from documented moments, not a celebrity wall.

Each person surface may answer only:

1. where this person entered the story;
2. what the documented relationship was;
3. what public artifact came out of that moment;
4. what Igor publicly said about the person/collaboration, if a source exists.

### Person-specific opinion rule

“What I think about X” renders only when a public source contains an attributable owner-authored statement or reviewed direct quote about X.

If no such source exists, the UI omits the opinion section entirely. It must not invent a view and must not repeat boilerplate saying no opinion was found.

## 10. Collaboration Grammar

Use evidence-conscious relationship classes:

- `co-creation` — both parties created a public work together;
- `active-partnership` — evidence supports an operating partnership;
- `documented-workflow` — documented institutional/workflow relationship without blanket partnership claim;
- `pilot` / `pilot-proposal` — exact state shown;
- `hosted-appearance` / `interview` — media relationship only;
- `coverage` — publisher covered Igor or a project;
- `distribution` — account/platform redistributed material;
- `ecosystem-membership` — program/membership, not commercial endorsement;
- `public-source` — source relationship only.

Never collapse these to one “Partners” label.

## 11. Voice & Transcript Memory

The transcript system is an enrichment layer, not an automatic dump of archive exports.

### States

- `caption-reference`: export/index proves a caption file path exists;
- `recovery-lead`: source exists but media/caption mapping is incomplete;
- `reviewed-transcript`: full transcript is matched to public/approved media and passed privacy/source review;
- `verified-excerpt`: bounded quote/excerpt is matched to source/timestamp and approved for display.

### Public transcript rules

A transcript or excerpt can be public only if:

1. underlying media is public or explicitly owner-approved for public reuse;
2. speaker identity is sufficiently resolved;
3. third-party private/sensitive material is not exposed merely because it exists in the export;
4. excerpt is attached to source URL and timestamp where possible;
5. edited/generated text is never presented as verbatim transcript;
6. uncertainty remains visible.

The first UX use is chapter markers and short verified excerpts, not giant transcript walls.

## 12. Research Lineage

Research is represented as a lived intellectual trajectory:

**life event → recurring question → working framework → public manuscript/preprint/article → current status**

Example classes:

- social mobility / youth opportunity → StartOn and opportunity-density work;
- systems, threat perception and governance → Strategic Sedation;
- food/power/collective behavior → Gastrocratia;
- identity/meaning/resonance → The Resonant Self;
- public memory/evidence → 7YA architecture.

Research status remains explicit: independent research, manuscript, preprint, publication, peer-review status or unresolved. Academic language never upgrades a working framework into consensus.

## 13. #7YA Movement Narrative

#7YA is a cumulative movement/system layer, not a logo section.

The site should make this retrospective trajectory legible:

**creator → public echo → civic responsibility → StartOn → research → political/public action → evidence architecture → #7YA → tools for others**

The path is a projection over source-backed scenes. It does not imply every scene was consciously planned as #7YA at the time. Retrospective interpretation must remain distinguishable from contemporaneous source claims.

## 14. Politics Lens

Politics is a route lens over life/public-action scenes, not a separate mythology.

It may include documented political entry, municipal campaign material, public appearances, authored positions, campaign artifacts, party events/roles, sourced changes in position, consequences and relevant research/public-service context.

Phase 1 does not change `CorpusSurface` solely to add `politics`. `SceneLens='politics'` projects from tags, event types, entities and verified public records. A canonical schema v3 is considered only if politics becomes a stable canonical query dimension rather than a presentation lens.

Contested political claims must retain source attribution and must not be summarized as established fact merely because they support a narrative arc.

## 15. Route Lenses

Every route uses the same graph with different ranking/framing:

- **Home** — strongest chronological autobiographical arc across domains.
- **Museum** — maximal chronology / director’s cut.
- **Media** — how the world answered back: appearances, pickup, reposts, interviews, aftermath.
- **Music** — co-creation, releases, creator relationships, cultural context.
- **Research** — lived question → framework → publication → status → related life scenes.
- **StartOn** — childhood/return → problem → model → evidence → collaborators/workflows → current work.
- **Politics** — creator/public-service path → political entry → positions/actions → evidence.
- **Influence** — original publication → propagation → independent pickup → source-local metrics.
- **Speaker** — source-backed longform themes, hosts, languages, clips and topics.
- **Blog** — authored thought inside the life chronology.
- **Create** — examples of converting lived problems into artifacts/systems, then visitor handoff.
- **Archive** — exhaustive source/recovery mode with trust filters.

A visitor moving routes never loses temporal context.

## 16. API Contract

Introduce read-only APIs first.

### `GET /api/life-scenes`

```ts
{
  lens?:SceneLens;
  from?:string;
  to?:string;
  kind?:SceneKind;
  person?:string;
  topic?:string;
  trust?:SceneTrust;
  limit?:number; // max 200
}
```

Response:

```ts
{
  release:string;
  generatedAt:string;
  lens:SceneLens;
  count:number;
  coverage:SceneCoverageSummary;
  scenes:LifeScene[];
}
```

### `GET /api/life-scenes/:id`

Returns one scene, related scenes and full public provenance.

### `GET /api/life-people`

Returns resolved people occurring in public scenes, role counts and scene ids; it does not infer private relationships.

### `GET /api/life-coverage`

Returns coverage gaps and source-to-scene mapping statistics.

### `GET /api/transcript-index`

Returns public-safe transcript/caption metadata only; never raw private archive text by default.

## 17. Coverage Gate — “Did We Forget Something?”

Coverage becomes a product invariant.

### Required biography dimensions

When verified/public material exists, the public journey must have discoverable representation for:

1. origin / migration / belonging;
2. military/public service;
3. education / criminology;
4. policing and exit/transition;
5. StartOn / youth / prevention;
6. authored writing;
7. social creation / viral propagation;
8. longform media / interviews;
9. creator/music collaborations;
10. relationships / institutions;
11. research and named frameworks;
12. politics / public action;
13. #7YA system/movement;
14. already-public personal/fatherhood stories when appropriate;
15. places/geography;
16. current/live work;
17. future/action handoff.

### Coverage metrics

Report at least:

- canonical events represented by ≥1 scene;
- verified media appearances represented;
- verified relationships represented;
- public creator/co-creation records represented;
- discovery-only candidates not yet mapped;
- records missing date;
- records missing visual;
- caption references without reviewed transcript;
- research works missing life-lineage mapping;
- page lenses below minimum scene-diversity target.

### Release rule

Static acceptance tests fail if a known major biography dimension with existing verified data disappears from all public navigation.

Dynamic discovery outages do not fail the build; they appear as degraded coverage state.

Coverage is not “100% of the internet.” It measures what the system currently knows, resolves and exposes.

## 18. Visual Experience Contract

The Scene Graph makes the autobiographical cinema richer; it does not turn it back into a dashboard.

Per scene:

- one dominant authentic/source visual when available;
- sequential media, never collage-first composition;
- period/date + provenance accessible but visually secondary;
- short first-person/source-backed narrative where allowed;
- “who was there” as people/roles;
- “what happened next” as aftermath;
- voice/timestamp when reviewed;
- at most one primary depth action in initial state;
- evidence detail on demand;
- mobile stacks media/narrative without mandatory horizontal rails.

Discovery/recovery material looks distinct from canonical material so uncertainty is perceptible without legalistic prose.

## 19. Failure & Degraded Modes

- canonical corpus unavailable: render existing explicitly marked fallback chronology; never fabricate dynamic scenes;
- discovery unavailable: canonical/verified graph remains functional; coverage marks discovery degraded;
- visual resolver unavailable: render source poster instead of broken whitespace;
- transcript index unavailable: hide transcript controls; scene remains readable;
- person resolution ambiguous: do not merge; retain unresolved source label;
- duplicate cluster uncertain: keep records separate;
- live social API unavailable: historical/canonical journey remains stable.

No source outage converts uncertainty into certainty.

## 20. Privacy, Rights & Publication Safety

- public ingestion is read-first and source-linked;
- private Drive access is never publication approval;
- private official records may verify dates/roles while remaining non-public;
- already-public child/family content may be represented only when it serves an existing public autobiographical scene; old exports do not justify expanding exposure;
- third-party transcript participants receive the same privacy/public-source boundary as Igor;
- no automatic public release of full SRT archives;
- no generated/inferred quote is labelled transcript;
- no automatic social publishing is introduced.

## 21. Integration Strategy — No Rewrite

Preserve:

- `AutobiographicalCinema` homepage direction;
- canonical corpus schema v2 initially;
- discovery library and visual registry;
- Digital Igor privacy/evidence behavior;
- deep media/research/museum/create routes;
- source-local metrics rule;
- HE/EN/RU localization and existing ES route behavior where applicable.

Replace progressively:

- hard-coded `IgorSceneEngine` primary scene array → `/api/life-scenes` projection;
- manual creator seeds → resolved public people/scene relationships;
- static transcript counters → transcript-index states;
- isolated research title lists → lineage-backed research scenes;
- generic route continuity blocks → scene-derived context.

## 22. Delivery Decomposition

The architecture is split into independently deployable slices.

### Slice 1 — Scene Graph Foundation

Shared types, deterministic compiler, `/api/life-scenes`, coverage summary and dynamic `IgorSceneEngine` consumption. Integrate home + museum + media first.

**Outcome:** remove the hard-coded seven-scene ceiling without weakening trust policy.

### Slice 2 — People & Collaboration Graph

Resolve people, roles, relationship grammar and creator/co-creation scenes from media appearances, relationship registry and canonical/discovery sources.

**Outcome:** creator/host/institution relationships emerge from documented scenes rather than manual seed cards.

### Slice 3 — Voice / Transcript Memory

Build an approved transcript-index manifest and expose caption-reference/reviewed-excerpt states; add timestamped voice affordances to longform scenes.

**Outcome:** historical voice becomes explorable without dumping private/raw SRT content.

### Slice 4 — Research + Politics + #7YA Lineage

Build research lineage, politics lens and #7YA trajectory projections over source-backed material.

**Outcome:** research, public action, politics and #7YA visibly grow out of prior life scenes rather than disconnected brands.

### Slice 5 — Recovery Ingestion & Coverage Gate

Expand approved public archive ingestion, legacy embeds, mirrors, owner exports and recovery queues; strengthen automated coverage tests.

**Outcome:** unseen/unresolved material becomes measurable and actionable.

Each slice remains useful and deployable independently.

## 23. Acceptance Criteria

The architecture is successful when:

1. `IgorSceneEngine` no longer depends on a primary hard-coded seven-scene list.
2. A canonical public event can enter a scene without a second manual copy of the same biography text.
3. Media appearance, visual and relationship data enrich the same scene while retaining provenance.
4. Home shows source-backed bridges across service, StartOn, public voice, creation/music, research, politics/#7YA and NOW when verified public records exist.
5. Media visibly connects appearances to people, topics and related life moments.
6. Research connects at least one named work/framework to a prior life/public question and displays publication/review status.
7. Person-specific opinion is never invented.
8. Host, collaborator, partner, coverage and distributor are never collapsed into one class.
9. SRT/caption references are never displayed as full verified transcripts until reviewed.
10. Private Drive/official files are never automatically exposed.
11. Dynamic source failure degrades gracefully without erasing canonical life story.
12. Coverage identifies known unmapped discovery/recovery candidates.
13. Mobile remains single-column readable, without mandatory horizontal overflow or collage-first layout.
14. HE/EN/RU scene titles/narrative fallbacks are deterministic; no language silently borrows unsupported first-person text.
15. Existing canonical-corpus, research-status, admin-write and source-local-metric safety tests still pass.
16. QA screenshots visibly feel like a living autobiographical film with substantially more real media, people and context, not a new dashboard.
17. Production implementation demonstrably starts from the current applied AppDeploy source rather than a stale GitHub snapshot.

## 24. Explicit Non-Goals

- claiming complete coverage of all internet content;
- importing private archive material wholesale;
- auto-generating opinions about collaborators;
- auto-summarizing disputed political claims as fact;
- changing canonical verification based on AI similarity;
- combining cross-platform metrics into unsupported lifetime reach;
- replacing deep pages with one giant homepage;
- decorative graph visualization;
- generic stock or generated documentary imagery;
- rewriting the entire stack.

## 25. Final Product Principle

The final experience should make the visitor feel:

**I am not reading what Igor says he has done. I am moving through the moments, people, media, words, questions and consequences that made the next moment possible — and I can inspect the evidence whenever I want.**

That is the product standard for the best version of 7YA.