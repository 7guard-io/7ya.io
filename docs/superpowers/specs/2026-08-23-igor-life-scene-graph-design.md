# IGOR LIFE SCENE GRAPH — Architecture Design

**Date:** 2026-08-23  
**Product:** 7YA / Igor Vepretski living autobiography  
**Status:** Approved direction; implementation requires written-spec review before execution

## 1. North Star

7YA must feel like accompanying Igor Vepretski through actual lived moments, not browsing a portfolio, dashboard, dossier, or category archive.

A visitor entering any public route should experience one continuous biography in which media, creation, research, StartOn, public action, politics, #7YA, collaborators, places, transcripts, posts, relationships and evidence are different lenses over the same life.

The operating model is:

**PUBLIC LIFE SOURCES → PROVENANCE → ENTITIES → SCENES → RELATIONSHIPS → VOICE → AFTERMATH → PAGE LENSES → PERSONAL JOURNEY**

The site must become richer by connecting existing verified and approved material, not by inventing missing biography.

## 2. Current-State Findings

The current production snapshot already contains the right primitives but they are fragmented:

- `shared/canonical-corpus.ts` is the high-trust public source of canonical life events, with explicit visibility, date precision, verification, sources, media, metrics and related-event ids.
- `GET /api/discovery-library` exposes a much broader public discovery layer assembled from the audited media workbook, discovery-max sheet and live social feeds. It is explicitly non-canonical.
- `GET /api/visual-registry` resolves approved public visuals across canonical media, public source previews, live social material and explicitly approved owner-public seeds.
- `src/media-appearances.ts` contains structured third-party interviews, podcasts, radio and television appearances.
- `src/relationship-registry.ts` already distinguishes active systems, documented workflows, ecosystem membership, pilots, coverage and source-only relationships.
- `src/IgorContextMachine.tsx` already models people, creators, positions, transcript state and relationship grammar.
- `src/IgorSceneEngine.tsx` already demonstrates the desired scene grammar — moment, people, source, meaning, transcript state and discovery traces — but its primary scene list is hard-coded and therefore narrow.
- `src/life-first/HundredMoments.tsx` already merges canonical events, visual registry and discovery records into up to 100 de-duplicated chronological entrances, proving that dynamic multi-source composition is viable.
- Owner archive exports in Drive contain numerous SRT/caption references, but a caption reference is not yet treated as a reviewed public transcript.
- The audited public-influence workbook and canonical-published-work index contain substantially more historical media, public propagation and research material than the current cinematic journey exposes.

The bottleneck is therefore not lack of content. It is lack of a common scene projection layer.

## 3. Architectural Decision

Build a new **Life Scene Graph projection layer** above the existing corpus and discovery systems.

Do **not** replace the canonical corpus. Do **not** make the discovery sheet canonical. Do **not** rewrite the site.

The Scene Graph will compile scene candidates from existing public-safe sources, resolve people/topics/relationships, attach provenance and transcript state, score narrative relevance, and expose route-specific scene projections to the existing cinematic UI.

The current autobiographical cinema remains the presentation direction. The underlying data source changes from manually curated scene arrays to a governed graph/projection API.

## 4. Trust Layers

Every object used by the Scene Graph carries a trust layer.

### T0 — Canonical

Source: canonical corpus public events.

Allowed behavior:
- may anchor chronology;
- may be written in first-person only when the canonical record or an attached owner-authored source supports that voice;
- may expose verified dates, media, metrics and related events subject to their precision labels.

### T1 — Verified public record

Source: verified media appearance, official/public publisher page, verified relationship record, approved public visual, public authored work.

Allowed behavior:
- may enrich a canonical or standalone public scene;
- may create a scene when identity and date are sufficiently resolved;
- does not silently change the canonical corpus.

### T2 — Supported / documented public record

Source: documented but incomplete public trace, mirror, known embed, public discovery record with partial metadata.

Allowed behavior:
- may appear as a clearly labelled supporting trace;
- may appear in recovery/discovery rails;
- may not supply invented dates, opinions, participants or causal claims.

### T3 — Discovery / recovery candidate

Source: discovery-only URLs, unresolved embeds, legacy indexes, caption references, undated records.

Allowed behavior:
- may be visible only as an investigation/recovery entrance where the UI explicitly states the status;
- cannot be promoted to a canonical fact merely because it appears in an owner workbook or export.

### Private / restricted

Private Drive files, private official documents, unpublished personal material, private conversation records and restricted third-party data never become public merely because the runtime or a connector can access them.

Private material may corroborate a public canonical statement without exposing the private source, matching the existing corpus policy for service records.

## 5. Core Data Model

Create a focused graph model rather than extending `CanonicalEvent` with every possible experience concern.

### `LifeScene`

```ts
export type SceneTrust='canonical'|'verified-public'|'supported-public'|'discovery';
export type SceneKind='life'|'service'|'education'|'starton'|'media'|'public-action'|'creator'|'music'|'research'|'politics'|'7ya'|'relationship'|'now';
export type SceneLens='home'|'museum'|'media'|'music'|'research'|'starton'|'politics'|'influence'|'speaker'|'blog'|'create'|'archive';

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
```

### `ScenePerson`

```ts
export type PersonRole='igor'|'co-creator'|'host'|'guest'|'interviewer'|'publisher'|'partner'|'institution'|'public-figure'|'participant'|'distributor'|'subject';
export type ScenePersonRef={entityId:string;displayName:string;role:PersonRole;evidenceUrl?:string};
```

### `SceneRelationshipRef`

Use evidence-conscious semantics instead of a generic “partner” relationship.

```ts
export type SceneRelationshipKind='co-creation'|'hosted-appearance'|'interview'|'coverage'|'distribution'|'active-partnership'|'documented-workflow'|'ecosystem-membership'|'pilot'|'pilot-proposal'|'institutional-context'|'public-source';
export type SceneRelationshipRef={id:string;name:string;kind:SceneRelationshipKind;status:string;evidenceUrl?:string;asOf?:string};
```

### `SceneVoiceRef`

```ts
export type TranscriptState='verified-excerpt'|'reviewed-transcript'|'caption-reference'|'recovery-lead'|'not-available'|'not-applicable';
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
```

A `.srt` path discovered in an export maps to `caption-reference` until the underlying media, rights/public status and excerpt are reviewed.

### `SceneAftermath`

```ts
export type SceneAftermathKind='media-pickup'|'repost'|'public-discussion'|'follow-up-work'|'project'|'research-question'|'political-action'|'collaboration'|'institutional-response'|'unknown';
export type SceneAftermath={kind:SceneAftermathKind;label:string;url?:string;relatedSceneId?:string;trust:SceneTrust};
```

## 6. Scene Compiler

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
5. **Assign trust** from the originating source and verification state.
6. **Map relationship grammar** so host, co-creator, publisher, partner and distributor remain distinct.
7. **Attach media** using the visual registry; prefer real/public-source media over generic source cards.
8. **Attach voice** only when transcript/caption state allows it.
9. **Infer only permitted edges**: related source, mirror, temporal continuation and topic similarity may be inferred; person-specific opinion and causal claims may not.
10. **Score narrative relevance** for each lens.
11. **Project** a route-specific ordered scene set.
12. **Return provenance** with every scene.

The compiler is deterministic for the same input snapshot.

## 7. Scene Scoring

Narrative scoring exists to choose what is shown first, not to decide truth.

Recommended score components:

- `+40` canonical event;
- `+30` verified third-party/public source;
- `+20` authentic visual available;
- `+18` direct Igor voice / reviewed transcript available;
- `+16` known person or creator relationship;
- `+14` verified aftermath/propagation;
- `+12` cross-domain bridge (for example StartOn + biography, creator + public voice, research + lived event);
- `+10` exact date;
- `+8` route-lens match;
- `-20` unresolved identity;
- `-20` undated when chronology is essential;
- `-30` duplicate/mirror of a stronger scene;
- `-50` restricted/private.

Trust labels are never overridden by score.

## 8. People × Igor

People must emerge from documented moments, not from a celebrity wall.

Each person page/card may answer only four questions:

1. **Where did this person enter the story?**
2. **What was the documented relationship?**
3. **What public artifact came out of that moment?**
4. **What did Igor publicly say about the person or collaboration, if a source exists?**

### Person-specific opinion rule

A section such as “What I think about X” is rendered only when at least one public source contains an attributable owner-authored statement or reviewed direct quote about X.

If no such source exists, the UI omits the opinion rather than displaying boilerplate saying that no opinion was found.

This avoids turning absence of evidence into repetitive UI noise.

## 9. Collaboration Grammar

Use the following hierarchy:

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

## 10. Voice & Transcript Memory

The transcript system is an enrichment layer, not an automatic dump of archive exports.

### States

- `caption-reference`: export/index proves a caption file path exists.
- `recovery-lead`: source exists but media/caption mapping is not fully resolved.
- `reviewed-transcript`: full transcript has been matched to public/approved media and passed privacy/source review.
- `verified-excerpt`: a bounded quote/excerpt has been matched to timestamp/source and approved for public display.

### Public transcript rules

A transcript or excerpt can be public only if:

1. the underlying media is public or explicitly owner-approved for public reuse;
2. speaker identity is sufficiently resolved;
3. third-party private/sensitive material is not exposed merely because it exists in the export;
4. the excerpt is attached to the source URL and timestamp where possible;
5. edited/generated text is never presented as a verbatim transcript;
6. uncertainty remains visible.

The first UX use of transcript data should be chapter markers and short verified excerpts, not giant transcript walls.

## 11. Research Lineage

Research must be represented as a lived intellectual trajectory.

Create `ResearchLineage` edges:

**life event → recurring question → working framework → public manuscript/preprint/article → current status**

Example classes:

- social mobility / youth opportunity → StartOn and opportunity-density work;
- systems, threat perception and governance → Strategic Sedation;
- food/power/collective behavior → Gastrocratia;
- identity/meaning/resonance → The Resonant Self;
- public memory and evidence → 7YA architecture.

Research status must remain explicit: independent research, manuscript, preprint, publication, peer-review status, or unresolved. Academic language must not upgrade a working framework into consensus.

## 12. #7YA Movement Narrative

#7YA is not a logo section. It is a cumulative movement/system layer.

The site should make the trajectory legible:

**creator → public echo → civic responsibility → StartOn → research → political/public action → evidence architecture → #7YA → tools for others**

This path is a projection over source-backed scenes. It does not imply that every scene was consciously planned as part of #7YA at the time.

The UI must distinguish retrospective interpretation from contemporaneous source claims.

## 13. Politics Lens

Politics is a route lens over life/public-action scenes, not a separate mythology.

The lens may include:

- documented entry into party/political activity;
- municipal campaign material;
- public appearances and authored political positions;
- campaign artifacts;
- party events and documented roles;
- sourced changes in position;
- political consequences/aftermath;
- related research/public-service context.

Phase 1 should avoid changing `CorpusSurface` solely to add `politics`. `SceneLens='politics'` can project from tags, event types, entities and verified public records. A canonical schema v3 should be considered only if politics becomes a stable canonical query dimension rather than a presentation lens.

## 14. Route Lenses

Every public route uses the same scene graph with different ranking and framing.

- **Home** — the strongest chronological autobiographical arc across all domains.
- **Museum** — maximal chronology / director’s cut.
- **Media** — how the world answered back: appearances, pickup, reposts, interviews, aftermath.
- **Music** — co-creation, official releases, creator relationships, cultural context.
- **Research** — lived question → framework → publication → status → related life scenes.
- **StartOn** — childhood/return → problem definition → model → public evidence → collaborators/workflows → current work.
- **Politics** — creator/public-service path → political entry → positions/actions → evidence.
- **Influence** — original publication → propagation → independent pickup → source-local metrics.
- **Speaker** — source-backed longform themes, hosts, languages, clips and topics.
- **Blog** — authored thought positioned inside the life chronology.
- **Create** — examples of how Igor converts lived problems into artifacts/systems, then visitor handoff.
- **Archive** — exhaustive source/recovery mode with trust filters.

A visitor moving between routes should never lose temporal context.

## 15. API Contract

Introduce read-only APIs first.

### `GET /api/life-scenes`

Query:

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

Returns one scene plus related scenes and full public provenance.

### `GET /api/life-people`

Returns resolved people who occur in public scenes, with role counts and scene ids. It does not infer private relationships.

### `GET /api/life-coverage`

Returns coverage gaps and source-to-scene mapping statistics.

### `GET /api/transcript-index`

Returns public-safe transcript/caption metadata only; never raw private archive text by default.

## 16. Coverage Gate — “Did We Forget Something?”

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
14. fatherhood/personal public stories where already public and appropriate;
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
- records with caption references but no reviewed transcript;
- research works missing life-lineage mapping;
- page lenses with fewer than the minimum scene diversity target.

### Release rule

Static acceptance tests must fail if a known major biography dimension with existing verified data disappears from all public navigation.

Dynamic discovery outages must not fail the site build; they must appear as degraded coverage state.

Coverage is not “100% of the internet.” It is an explicit measurement of what the system currently knows, resolves and exposes.

## 17. Visual Experience Contract

The Scene Graph must make the existing autobiographical cinema richer, not turn it back into a dashboard.

Per scene:

- one dominant authentic/source visual when available;
- sequential media, never collage-first composition;
- period/date + source provenance is accessible but visually secondary;
- short first-person/source-backed narrative where allowed;
- “who was there” shown as people/roles;
- “what happened next” shown as aftermath;
- voice/timestamp shown when reviewed;
- at most one primary depth action in the initial scene state;
- evidence drawer/detail available on demand;
- mobile stacks media and narrative without horizontal rails that are required to understand the story.

Discovery/recovery material must look visually different from canonical material so uncertainty is perceptible without reading legalistic prose.

## 18. Failure & Degraded Modes

- Canonical corpus unavailable: render existing explicitly marked fallback chronology; do not fabricate dynamic scenes.
- Discovery library unavailable: canonical and verified scene graph remains functional; coverage reports discovery degraded.
- Visual resolver unavailable: scene renders source poster, not broken-image whitespace.
- Transcript index unavailable: hide transcript controls; scene remains readable.
- Person resolution ambiguous: do not merge people; retain source label as unresolved.
- Duplicate cluster uncertain: keep records separate rather than merging potentially different events.
- Live social API unavailable: historical/canonical journey remains stable.

No source outage should convert uncertainty into certainty.

## 19. Privacy, Rights & Publication Safety

- Public ingestion is read-first and source-linked.
- Private Drive access is never equivalent to publication approval.
- Official private records may verify dates/roles while remaining non-public.
- Child/family content already public may be represented only when it serves an existing public autobiographical scene; avoid expanding exposure merely because old exports contain more material.
- Third-party participants in transcripts receive the same public-source/privacy boundary as Igor.
- No automatic public release of full SRT archives.
- No generated or inferred quote is labelled as a transcript.
- No automatic publishing to social platforms is introduced by this project.

## 20. Integration Strategy — No Rewrite

Preserve:

- `AutobiographicalCinema` as the homepage presentation direction;
- canonical corpus schema v2 initially;
- discovery library and visual registry;
- current Digital Igor privacy/evidence behavior;
- deep media/research/museum/create routes;
- source-local metrics rule;
- HE/EN/RU localization and existing ES route behavior where applicable.

Replace progressively:

- hard-coded `IgorSceneEngine` scene arrays → `life-scenes` API projection;
- manual creator seeds → resolved public people/scene relationships;
- static transcript counters → transcript-index states;
- isolated research title lists → lineage-backed research scenes;
- generic route continuity blocks → scene-derived context.

## 21. Delivery Decomposition

This architecture is intentionally split into independently testable slices.

### Slice 1 — Scene Graph Foundation

Build shared types, deterministic compiler, `/api/life-scenes`, coverage summary and dynamic `IgorSceneEngine` consumption. Integrate home + museum + media first.

**Working outcome:** the existing 7-scene hard-coded ceiling is removed without changing trust policy.

### Slice 2 — People & Collaboration Graph

Resolve people, roles, relationship grammar and creator/co-creation scenes from media appearances, relationship registry, canonical/discovery sources.

**Working outcome:** creator/host/institution relationships emerge from documented scenes rather than manual seed cards.

### Slice 3 — Voice / Transcript Memory

Build an approved transcript-index manifest and expose caption-reference/reviewed-excerpt states. Add timestamped voice affordances to longform scenes.

**Working outcome:** historical voice becomes explorable without dumping private/raw SRT content.

### Slice 4 — Research + Politics + #7YA Lineage

Build research lineage, politics lens and #7YA trajectory projections over existing source-backed material.

**Working outcome:** the visitor can see why research, public action, politics and #7YA grow out of prior life scenes rather than appearing as disconnected brands.

### Slice 5 — Recovery Ingestion & Coverage Gate

Expand approved public archive ingestion, legacy embeds, mirrors, owner exports and recovery queues; strengthen automated coverage tests.

**Working outcome:** the system continually surfaces what remains unseen/unresolved and makes “did we forget anything?” measurable.

Each slice must remain deployable and useful independently.

## 22. Acceptance Criteria

The architecture is successful when all of the following are true:

1. `IgorSceneEngine` no longer depends on a primary hard-coded seven-scene list.
2. A public canonical event can enter a scene without a second manual copy of the same biography text.
3. Media appearance, visual and relationship data can enrich the same scene while retaining provenance.
4. Home shows at least one source-backed bridge across service, StartOn, public voice, creation/music, research, politics/#7YA and NOW when such verified public records are available.
5. Media route visibly connects appearances to people, topics and related life moments.
6. Research route visibly connects at least one named work/framework to a prior life/public question and displays publication/review status.
7. Person-specific opinion is never invented.
8. Host, collaborator, partner, coverage and distributor are never collapsed into one relationship class.
9. SRT/caption references are never displayed as full verified transcripts until reviewed.
10. Private Drive/official files are never automatically exposed.
11. Dynamic source failure degrades gracefully without erasing the canonical life story.
12. Coverage endpoint identifies known unmapped discovery/recovery candidates.
13. Mobile remains single-column readable, no mandatory horizontal overflow, and no collage-first layout.
14. HE/EN/RU scene titles/narrative fallbacks remain deterministic and no language silently borrows unsupported first-person text.
15. Existing canonical-corpus, research-status, admin-write and source-local-metric safety tests continue to pass.
16. QA screenshots visibly feel like a living autobiographical film with substantially more real media/people/context, not a new dashboard.

## 23. Explicit Non-Goals

- claiming complete coverage of all internet content;
- importing private archive material wholesale;
- auto-generating personal opinions about collaborators;
- auto-summarizing disputed political claims as fact;
- changing canonical verification states based on AI similarity;
- combining cross-platform metrics into an unsupported lifetime reach number;
- replacing existing deep pages with a single giant homepage;
- creating a graph visualization merely for decoration;
- adding generic stock or generated documentary imagery;
- rewriting the entire site stack.

## 24. Final Product Principle

The final experience should make the visitor feel:

**I am not reading what Igor says he has done. I am moving through the moments, people, media, words, questions and consequences that made the next moment possible — and I can inspect the evidence whenever I want.**

That is the product standard for the best version of 7YA.