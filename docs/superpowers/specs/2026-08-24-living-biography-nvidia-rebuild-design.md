# 7YA Living Biography × NVIDIA — Full Rebuild Design

Date: 2026-08-24
Status: APPROVED CONCEPT — SPEC REVIEW REQUIRED BEFORE IMPLEMENTATION
Owner: Igor Vepretski / 7YA
Production app: AppDeploy `697a008fddc309b142`
Production baseline: `1787523435414`
Primary domain: `https://7ya.io`

## 1. Goal

Rebuild 7YA as a living autobiographical digital experience rather than a dashboard, links page or technical archive.

The public visitor should understand Igor Vepretski through chronology, real media, public evidence and interaction. NVIDIA should operate as the intelligence layer behind the experience, not as a visual gimmick.

The product target is:

**PERSON → LIFE → CONTENT → PEOPLE → MEDIA → PROJECTS → EVIDENCE → INTERNET → VISITOR ACTION**

The homepage is the main narrative spine. Secondary routes remain available for depth, but must feel like rooms in one world, not independent microsites.

## 2. Product thesis

7YA is not a biography card and not an AI demo.

It is a **living biography**: a chronological, visual, source-linked account of a life still in progress, where every important scene can expand into its related content, people, media, projects, evidence and public internet traces.

The visitor should feel that they are moving through the same moments, not reading a compressed résumé.

The system layer exists to support trust and exploration. It must never dominate the emotional or visual experience.

## 3. Existing production truth

The current AppDeploy production already contains valuable foundations that must be reused rather than discarded:

- `LifeFirstHome` renders `AutobiographicalCinema` as the public homepage.
- `AutobiographicalCinema` already presents an ordered life story and places `HundredMoments` immediately after the opening portrait.
- Existing scenes cover origin, service, public voice, return to Jesse Cohen / StartOn, music, research, the present, and a final system layer.
- `HundredMoments` is already evidence-backed and connected to Canon, Visual Registry and Public Discovery.
- `StoryCompanion` already exposes Digital Igor across the site.
- NVIDIA NIM is already the primary Digital Igor provider using `nvidia/nemotron-3-super-120b-a12b`.
- The NVIDIA agent already performs bounded tool use, public retrieval, continuation-aware queries, timeout/retry/circuit protection and fallback to AppDeploy/local agents.
- Backend public layers already exist for canonical corpus, public internet graph, discovery, connected social feeds, visual registry and source-image resolution.
- Visual QA and live visual acceptance endpoints already exist and must be preserved as release gates.

The rebuild therefore focuses on **experience architecture, contextual AI and retrieval quality**, not rebuilding the corpus or replacing the current NVIDIA agent from scratch.

## 4. Core experience architecture

### 4.1 Opening — The person before the system

The first viewport must contain:

- one authentic large-format image or video frame of Igor;
- name and one concise autobiographical line;
- a minimal chronology cue;
- three clear actions only:
  - enter the story;
  - see what Igor is building now;
  - talk to Digital Igor.

No metrics wall, graph, dashboard, platform logos or technical architecture belongs above the fold.

The NVIDIA badge may exist but must remain subordinate to the person.

### 4.2 100 Moments — Primary exploration layer

`HundredMoments` becomes the public-life atlas immediately after the opening.

Each moment is treated as a scene object rather than a generic card. A moment may expose:

- date / period;
- title and concise first-person or documentary description;
- authentic visual or source capture;
- source status;
- people and institutions;
- place;
- related posts, videos, interviews or documents;
- public propagation / echo;
- related project or research object;
- “ask Digital Igor about this moment”.

Filtering must support at least:

- chronology;
- life chapter;
- media type;
- platform;
- verification layer.

The visitor can always return from a detail state to their prior position in the 100 Moments flow.

### 4.3 LIFE — Directed chronological cinema

After 100 Moments, the site continues as a strongly curated chronological narrative. The current scene sequence is retained conceptually but redesigned as one continuous cinematic language:

1. Origin / belonging
2. Early creative traces
3. Service / public systems
4. Public voice / internet creation
5. Fatherhood / personal turning points where public evidence exists
6. Return to Jesse Cohen
7. StartOn
8. Music / creation / collaborations
9. Research / frameworks
10. 7YA / systems building
11. Now / current edge

The design must not fabricate missing childhood or historical imagery. When no authentic visual exists, use maps, typography, verified source captures or neutral documentary treatment instead of AI-generated historical reenactments.

### 4.4 ECHO — Public propagation

Public influence is shown as movement, not vanity totals.

For important content objects, ECHO can display:

**original post → repost / share → media pickup → public response → subsequent action**

The UI may show platform-specific snapshots and dated metrics only when source-backed. Cross-platform totals must not be inferred from incompatible datasets.

### 4.5 LAB — Research and frameworks

Research is separated from biography while remaining connected to the lived scenes that produced the questions.

Each framework should expose:

- title;
- question;
- thesis status;
- evidence / source status;
- competing interpretations where relevant;
- connection to lived experience;
- related public writing;
- unresolved questions.

The interface must distinguish research hypothesis, interpretation and verified fact.

### 4.6 BUILD — StartOn, 7YA and visitor action

BUILD contains projects and action pathways.

StartOn must be represented as an evolving mission and operating model, not a single promotional section.

7YA is presented as the infrastructure preserving context, sources and relationships — never as the hero of the site.

The final visitor transition is:

- talk to Digital Igor;
- explore a project;
- book Igor / contact;
- build a first move of their own.

## 5. Visual system

### 5.1 Design direction

The target is **premium documentary cinema + personal digital museum**, not SaaS dashboard and not cyberpunk NVIDIA fan art.

Primary visual characteristics:

- authentic photography and video frames;
- large editorial typography;
- asymmetric but disciplined composition;
- full-bleed scenes mixed with quieter archival sections;
- generous negative space;
- visible chronology;
- tactile source labels and documentary captions;
- subtle #7YA ninja identity as punctuation, not wallpaper.

### 5.2 Prohibited visual patterns

Do not introduce:

- generic AI faces;
- fake historical scenes presented as documentary fact;
- dense dashboard grids;
- repeated cards with identical treatment;
- giant unsourced vanity metrics;
- neon green NVIDIA branding as the dominant visual language;
- collages;
- excessive glowing borders;
- long text walls without visual or interaction breaks.

### 5.3 Media priority order

1. canonical authentic media;
2. owner-approved public archive media;
3. public source image / source screenshot;
4. map / document / typographic archival treatment;
5. generated conceptual imagery only for clearly non-documentary abstract sections.

## 6. NVIDIA architecture

### 6.1 Existing primary agent

Keep `nvidia/nemotron-3-super-120b-a12b` as the primary Digital Igor agent unless a later measured evaluation justifies a model change.

Preserve:

- provider order `nvidia -> appdeploy-agent -> local`;
- public-only grounding boundary;
- Canon authoritative over Discovery;
- bounded tool loop;
- continuation retrieval logic;
- timeout, retry and circuit breaker;
- protected canary;
- no hidden reasoning exposure.

### 6.2 Contextual Digital Igor

Digital Igor must stop behaving as one global floating chatbot with weak page awareness.

Introduce a structured `ExperienceContext` passed from the current scene / moment into the companion request:

```ts
{
  chapterId,
  sceneId,
  canonicalIds,
  visibleSourceUrls,
  people,
  institutions,
  place,
  dateRange,
  visitorMode,
  returnTarget
}
```

The companion opening copy and suggested questions should change by context.

Examples:

- In a service scene: “What did this period change?” / “Show the public source.”
- In a StartOn scene: “How did this idea emerge?” / “Show related coverage.”
- On a 100 Moment: “What happened before and after this?” / “Who else is connected?”

The context is navigation state, not evidence. Claims still require tool retrieval.

### 6.3 NeMo Retriever layer

Add an NVIDIA retrieval service behind the existing public tools rather than exposing a separate UI.

Target pipeline:

**query → embedding retrieval → candidate set → reranking → canonical/discovery policy filter → tool result → Nemotron synthesis**

Retriever indexes should cover:

- canonical event titles and summaries;
- source metadata;
- transcripts and longform text where public and approved;
- people / institution labels;
- platform / date / topic metadata;
- public discovery descriptions, kept in a separate logical layer.

The retrieval service must return IDs and source metadata, never free-floating synthesized facts.

If NeMo Retriever is unavailable, the existing deterministic/public graph search remains the fallback.

### 6.4 Multimodal retrieval / reranking

For scenes with multiple candidate visuals, add a bounded multimodal ranking step where technically viable.

Use cases:

- choose the most contextually relevant real image for a scene;
- rank screenshots or document pages for a query;
- select a source preview for a life moment.

The ranking layer may choose among known public / approved media only. It must not fabricate or alter evidence.

### 6.5 AI transparency

Digital Igor must remain explicitly disclosed as AI.

Every answer involving personal history must respect:

- public canon only;
- no invented private memory;
- no fabricated first-person experience;
- uncertainty when evidence is missing;
- direct links or source actions when useful.

## 7. Component boundaries

The rebuild should reduce the monolithic homepage assembly into clearer modules.

Recommended public structure:

- `LivingBiographyHome`
  - `LivingBiographyCover`
  - `MomentsAtlas`
  - `LifeChapterRail`
  - `LifeScene`
  - `EchoTrail`
  - `ResearchLab`
  - `BuildRoom`
  - `NowEdge`
  - `VisitorHandoff`

Shared intelligence / data:

- `experience-context.ts`
- `living-biography-model.ts`
- existing canonical corpus / graph clients
- existing visual registry
- existing StoryCompanion UI adapted to accept contextual launch state

Do not duplicate canonical content into hardcoded component copy when an existing structured record can supply it safely.

## 8. Navigation

Replace route-heavy navigation with a compact world model:

- LIFE
- ECHO
- LAB
- BUILD
- ARCHIVE
- TALK

Desktop can show these as a restrained top navigation.

Mobile should use a compact expandable navigator with no persistent obstruction of the story.

Deep links must preserve existing canonical routes and public URLs where possible.

## 9. Data and truth rules

### 9.1 Canon

Canonical records remain the only authoritative source for verified biographical claims.

### 9.2 Discovery

Public Discovery can appear as “found / unresolved / needs verification”, never silently as fact.

### 9.3 Live social

Connected platform feeds may populate the live edge and archive discovery layer. Their presence does not automatically promote a record into Canon.

### 9.4 Metrics

Metrics must remain dated snapshots with explicit source and scope.

Do not produce one aggregate “total impact” number unless a separate evidence policy explicitly supports the aggregation method.

## 10. Performance and accessibility

- keep opening LCP media optimized and preloaded;
- lazy-load below-fold media;
- preserve semantic landmarks and heading order;
- keyboard-accessible 100 Moments interactions;
- reduced-motion support for cinematic transitions;
- captions / labels for video and documentary media;
- minimum AA text contrast;
- no autoplay audio;
- mobile target remains first-class, not a compressed desktop layout.

## 11. Release strategy

The rebuild must not be deployed as a single uncontrolled rewrite.

Ship in vertical slices on the production AppDeploy tree, each visually testable:

1. **Foundation** — new Living Biography shell, cover, navigation and design tokens.
2. **Moments Atlas** — reshape HundredMoments into the primary exploration language.
3. **Chronological Cinema** — migrate current origin/service/echo/StartOn/music/research/now scenes into the new shell.
4. **Contextual Digital Igor** — scene-aware launch state and contextual prompts.
5. **NVIDIA Retriever** — semantic retrieval + reranking behind existing public tools with deterministic fallback.
6. **Multimodal ranking** — real-media selection / ranking where supported.
7. **Secondary rooms** — align Museum, Media, Research, Evidence, Library and Speaker with the same visual system.
8. **Production truth recovery** — mirror validated live application source and release metadata into GitHub-controlled source so AppDeploy and repository no longer diverge.

Each slice must pass QA before the next one.

## 12. Testing and acceptance gates

### 12.1 Functional

- homepage routes resolve in HE / EN / RU;
- 100 Moments filters and source actions work;
- contextual “Ask Igor” opens with correct scene context;
- Digital Igor remains grounded and source-aware;
- NVIDIA failure still falls back cleanly;
- Canon and Discovery remain visually and semantically distinct;
- existing public deep links remain valid or intentionally redirected.

### 12.2 Visual

Run desktop and mobile live visual acceptance for at least:

- home;
- museum;
- media;
- evidence;
- research;
- library.

Homepage visual PASS requires:

- authentic human visual in first viewport;
- no dashboard-like opening;
- visible route into 100 Moments;
- clear chronology;
- strong media density without collage;
- no clipping / overlap / unreadable navigation;
- Digital Igor present but subordinate to the story.

### 12.3 NVIDIA

Protected canary must confirm:

- NVIDIA configured;
- public retrieval used;
- private-memory fabrication refused;
- unsupported impact metric fabrication refused;
- no reasoning / secrets returned.

Retriever acceptance when introduced:

- expected canonical item appears in top candidates for a fixed evaluation set;
- reranker improves or preserves relevant ordering versus baseline search;
- system falls back to existing graph search when retriever is unavailable;
- Discovery never outranks Canon into an authoritative answer without explicit labeling.

## 13. Non-goals

This rebuild does not:

- create a fictional digital twin with private memories;
- replace evidence policy with AI judgment;
- turn 7YA into an NVIDIA-branded microsite;
- delete the deep archive or evidence routes;
- erase existing public content to make the site “cleaner”;
- fabricate missing imagery;
- require every visitor to chat before exploring.

## 14. Success criteria

The rebuild is successful when a first-time visitor can answer, without external explanation:

1. Who is Igor?
2. What happened across the major periods of his life?
3. What did he create or build?
4. Which public sources support the important claims?
5. How did specific content travel through the public internet?
6. What is StartOn and why did it emerge?
7. What is Igor researching now?
8. How can I ask about a specific moment?
9. How can I continue into media, evidence, collaboration or my own next move?

And visually, the dominant impression must be:

**a living personal documentary — not a dashboard, not a link directory, not an AI demo.**
