# 7YA Cinematic Personal OS — Design

Date: 2026-08-28
Status: APPROVED DIRECTION — WRITTEN SPEC REVIEW REQUIRED BEFORE IMPLEMENTATION
Owner: Igor Vepretski / 7YA
Production app: AppDeploy `697a008fddc309b142`
Production source of truth at design time: snapshot `1787859400536`
Repository: `7guard-io/7ya.io`
Primary domain: `https://7ya.io`

## 1. Decision

7YA will evolve into a **Cinematic Personal OS**: a premium, media-first personal documentary and public knowledge system in which Igor is always the primary subject and the system remains secondary infrastructure.

This design refines and supersedes the homepage, mobile hierarchy, impact presentation and source-of-truth release sections of `docs/superpowers/specs/2026-08-24-living-biography-nvidia-rebuild-design.md` where they conflict. The broader living-biography, public-evidence and contextual-AI principles remain valid.

The public experience target is:

**IGOR → STORY → PROOF → MEDIA → STARTON → NOW → EXPLORE**

The visitor should first understand the person, then see the work, then inspect evidence and systems.

## 2. Current production diagnosis

The production application already contains strong foundations:

- `DocumentaryHome` as the active home experience;
- `NarrativeChapters` with a 14-chapter life narrative;
- `ImpactFrontDoor` and `ImpactUniverseCounter`;
- Media, Museum, Research, Library, Evidence, Music, Speaker and StartOn rooms;
- multilingual HE / EN / RU SEO metadata;
- static-first crawlable route entry points;
- public projection and feed infrastructure;
- StoryCompanion / Digital Igor;
- live and historical public media corpus.

The main problem is therefore **hierarchy, not content scarcity**.

The current homepage asks too many sections to behave as primary content. Long documentary chapters, impact methodology, media rails, current work and archive access all compete for attention. On mobile, multiple horizontal rails and dense action groups reduce clarity.

The redesign must preserve depth while reducing simultaneous cognitive load.

## 3. Product principles

### 3.1 Person before system

The first viewport is about Igor, not the architecture of 7YA.

The hero may contain:

- one authentic dominant portrait or documentary frame;
- Igor's name;
- one concise autobiographical thesis;
- one concise supporting line;
- one primary action and a restrained secondary action group;
- a small proof cue, not a dashboard.

No graph, methodology table, source taxonomy or multi-card metric grid belongs above the fold.

### 3.2 Show before explain

Real photographs, video frames, interviews, broadcasts, podcasts, StartOn scenes, music and public-source captures should carry more of the narrative burden.

The experience should repeatedly prefer:

**see → understand → inspect source**

over

**read → read more → open system page**.

### 3.3 Preserve depth, move it to the right room

Nothing substantial should be deleted merely to make the homepage shorter.

Instead:

- Home curates the strongest path;
- Museum preserves the full chronological documentary;
- Media holds deep media exploration;
- Evidence exposes methodology and source status;
- Library holds the full living corpus;
- Research holds frameworks and papers;
- StartOn holds the mission and operating model.

### 3.4 Mobile is a separate composition target

Mobile is not a compressed desktop version. It gets its own hierarchy, spacing, action density and media behavior.

### 3.5 Evidence remains inspectable

Presentation can become simpler without weakening evidence controls. Source status, dates, metric scope and direct links remain available one interaction deeper.

## 4. Homepage architecture

The homepage will be intentionally shorter and more directional than the current production page.

### 4.1 Scene 1 — Hero / identity

Purpose: answer “Who is Igor?” within seconds.

Required elements:

- dominant authentic Igor visual;
- compact 7YA identity mark;
- name and human-first positioning;
- one concise story line;
- primary CTA: enter the story / see the work;
- secondary CTA: talk to Digital Igor or open evidence;
- small credibility strip with up to three proof signals.

Desktop should preserve cinematic full-bleed scale.

Mobile should keep the face or subject safely framed and avoid the current pattern where the image occupies a shallow banner while most of the first viewport becomes text and controls.

### 4.2 Scene 2 — Media proof rail

Immediately after the hero, surface a media-first proof layer containing a curated mix of:

- broadcast / television;
- interview / podcast;
- viral or high-propagation public content;
- StartOn coverage;
- music / collaboration;
- third-party coverage.

Each item should show:

- authentic preview;
- content type;
- publisher / platform;
- date or year;
- one relevant metric when source-backed;
- source state;
- direct source action.

This section should feel like an editorial contact sheet, not a generic card carousel.

### 4.3 Scene 3 — Story spine

Home should not render all fourteen chapters at full cinematic length.

Instead it should render **5–6 key scenes** that explain the major transitions:

1. origin / immigration / belonging;
2. service and public systems;
3. public voice / digital creation;
4. return to Jesse Cohen / StartOn;
5. creation / research;
6. now.

Each scene can connect to a deeper Museum or Life route where the full chronology remains intact.

### 4.4 Scene 4 — Impact proof

Impact remains important and can retain the gross-first historical counter, including the 7B+ cumulative snapshot, but the homepage must present it in a simpler proof layer.

Homepage presentation:

- one headline metric or cumulative snapshot;
- up to three supporting classes, such as interactions, distribution and audience;
- explicit “dated snapshot / source-linked” framing;
- one action to open the full Impact / Evidence methodology.

The homepage must not render the entire counting protocol, quarantine explanations, all snapshot-series cards and all platform details at once.

Those remain available in the deeper proof/evidence experience.

### 4.5 Scene 5 — StartOn

StartOn gets one strong visual and a concise mission statement, not another dense mini-site inside Home.

The section should answer:

- what it is;
- why it exists;
- what is being built now;
- where to explore it in depth.

### 4.6 Scene 6 — Now

A compact current-state section should show the active edge:

- StartOn;
- public work;
- media / creation;
- research / systems building.

Recent public content can appear as a lightweight “Recently added” rail beneath it, but should not dominate the entire section.

### 4.7 Scene 7 — Explore / handoff

End with a clear world map of the deeper rooms:

- Museum / Life;
- Media;
- Research;
- Evidence;
- Library;
- Music;
- Speaker / Contact;
- Digital Igor.

The handoff should feel like entering rooms of one world, not opening unrelated microsites.

## 5. Mobile UX architecture

### 5.1 Hero

- preserve face / subject focal point with explicit mobile object-position rules;
- avoid fixed shallow media heights that crop the subject unpredictably;
- target a cinematic portrait ratio or responsive min-height rather than a banner ratio;
- cap the first-screen CTA count;
- keep one primary CTA visually dominant;
- respect safe-area insets.

### 5.2 Navigation

- compact sticky or auto-hiding navigation;
- language and appearance controls remain accessible but visually subordinate;
- no permanent chat overlay obscuring first-screen content;
- Digital Igor can use a contextual bottom-sheet or deferred launcher.

### 5.3 Media

- large touch targets;
- one dominant horizontal media rail at a time;
- avoid nested horizontal-scrolling regions;
- cards use predictable snap points and intrinsic dimensions;
- missing images degrade to intentional editorial posters, not blank boxes.

### 5.4 Reading density

- reduce repeated long explanatory paragraphs;
- use stronger visual transitions and short captions;
- maintain at least AA contrast;
- preserve reduced-motion support;
- maintain keyboard and screen-reader semantics.

## 6. Visual system

Target: **premium documentary cinema × editorial archive × tactical restraint**.

Core characteristics:

- absolute dark mode as the primary visual identity while preserving the optional accessible light theme;
- high-quality authentic photography and video frames;
- disciplined cinematic gradients;
- large editorial typography;
- fewer visible borders and control surfaces in primary storytelling scenes;
- tactile source labels in secondary detail states;
- non-plastic texture;
- no collage treatment;
- subtle #7YA / ninja identity as punctuation.

Avoid:

- dashboard-first composition;
- cyberpunk decoration for its own sake;
- excessive glowing cards;
- visually identical card grids repeated section after section;
- technical labels competing with human headlines;
- fake documentary imagery.

## 7. Media selection and ranking

The homepage should curate media using a deterministic diversity policy before considering AI-assisted ranking.

Priority dimensions:

1. canonical / source-backed state;
2. authentic visual availability;
3. media type value (video, broadcast, interview, article, audio);
4. third-party publication value;
5. impact signal when source-backed;
6. publisher/platform diversity;
7. recency for the “Now” edge.

Do not allow one platform or publisher to dominate the first-screen media set.

Where an NVIDIA or other multimodal reranker is later introduced, it may reorder approved candidates but must never fabricate or replace evidence.

## 8. Performance and Core Web Vitals

### 8.1 LCP

- preload only the actual hero image used for the active viewport;
- use local or stable CDN-owned hero assets where possible;
- provide responsive `srcset` / `sizes`;
- avoid a remote Google Drive fallback as the normal successful path;
- minimize render-blocking CSS on the first scene.

### 8.2 CLS

- every image/video preview receives an intrinsic ratio or width/height;
- reserve layout space before API-backed media arrives;
- media fallback must occupy the same box as the image it replaces;
- avoid late insertion of navigation or metrics above already-rendered content.

### 8.3 INP

- reduce first-load interactive work;
- defer deep rails, charts and methodology interaction until needed;
- avoid unnecessary listeners and large DOM trees on initial render;
- virtualize or progressively reveal long archive lists where needed.

### 8.4 Rendering strategy

- preserve static-first crawlable route shells;
- keep below-fold documentary sections compatible with `content-visibility`;
- lazy hydrate or dynamically import deep experiences where practical;
- do not fetch all page-specific APIs from Home when only a small curated set is required.

## 9. SEO and AI discoverability

Preserve the static-first route strategy already deployed.

Add or verify route-appropriate structured data:

- `Person` / `ProfilePage` for Igor;
- `Organization` for StartOn where relevant;
- `Article` / `NewsArticle` for editorial pieces;
- `VideoObject` for canonical video pages or media records;
- `MusicRecording` / `MusicGroup` relationships where appropriate;
- `BreadcrumbList` for deep rooms;
- `WebSite` / `SearchAction` for site search.

Verify:

- canonical URLs;
- HE / EN / RU hreflang;
- ES / AR alternate strategy where those routes exist;
- sitemap inclusion rules;
- JSON Feed integrity;
- `llms.txt` and public discovery surfaces;
- page-level descriptions per language.

No admin, diagnostics or integrity-only surfaces should leak into public SEO discovery.

## 10. Impact policy

The design adopts the current **gross-first historical counting model** already present in production while preserving metric-class separation.

Rules:

- cumulative snapshots are historical series points and are not added to each other;
- interactions, distribution, audience and other classes remain explicitly labeled;
- source-resolved values remain distinguishable from gross cumulative snapshots;
- platform-specific metrics retain date and scope;
- deduplication applies where the model explicitly calls for deduplication, but absence of perfect deduplication does not erase a documented gross snapshot;
- methodology and limitations remain visible in the deeper Evidence / Impact view.

This section supersedes older design language that prohibited a public aggregate headline entirely.

## 11. Component boundaries

Recommended evolution from the current production components:

- `CinematicHome`
  - `CinematicHero`
  - `MediaProofRail`
  - `StorySpine`
  - `ImpactProofLayer`
  - `StartOnFeature`
  - `NowEdge`
  - `ExploreRooms`

Existing components can be reused behind these boundaries:

- `DocumentaryHome` becomes the migration source, not the permanent monolith;
- `NarrativeChapters` continues in full inside Museum / Life or is adapted into a compact-home mode;
- `ImpactFrontDoor` remains the deeper impact room while Home uses a compact proof component;
- `ImpactUniverseCounter` gains a compact presentation mode or a separate summary component;
- `StoryCompanion` accepts contextual launch state and avoids obstructing mobile narrative flow.

Do not duplicate canonical content into new hardcoded copies when an existing structured source can safely provide it.

## 12. Source-of-truth recovery

At design time, production AppDeploy snapshot `1787859400536` is materially ahead of GitHub `main`.

Therefore:

1. do not deploy GitHub `main` over production;
2. implement against the live AppDeploy production source or a complete reconciled export derived from it;
3. after each validated production slice, produce an atomic reconstructable export into GitHub;
4. record the applied AppDeploy snapshot, rollback snapshot, release marker and changed files;
5. only restore GitHub as deployable source of truth after the complete production tree is represented and the release gate passes.

A partial component copy into GitHub is not sufficient reconciliation.

## 13. Delivery slices

Implement in this order:

1. **Foundation / source capture** — freeze current production snapshot, record source inventory and rollback reference.
2. **Hero + mobile shell** — cinematic hero, navigation simplification, focal-point fixes, safe-area behavior.
3. **Media proof** — media-first editorial rail with robust fallbacks.
4. **Compact story spine** — reduce Home from full 14-chapter rendering to 5–6 key scenes; retain full story in the deeper room.
5. **Compact impact proof** — headline proof on Home, full methodology deeper.
6. **StartOn + Now** — simplified current-work narrative and recent public projection.
7. **Explore rooms** — unified visual handoff into Media / Museum / Research / Evidence / Library / Music / Speaker.
8. **Performance pass** — LCP, CLS, INP, image pipeline, lazy/deferred deep sections.
9. **SEO / structured data pass** — schema, hreflang, canonicals, feeds and public route QA.
10. **Repository reconciliation** — atomic production export back to GitHub and release ledger update.

## 14. Testing and acceptance gates

### 14.1 Functional

- Home resolves in HE / EN / RU;
- major secondary routes remain reachable;
- media items open the correct viewer or public source;
- Digital Igor opens correctly and does not obscure navigation;
- language switching preserves the current logical route;
- Canon / Discovery / Live state remains explicit where surfaced;
- public-projection failures degrade without breaking Home.

### 14.2 Visual

Check at minimum:

- iPhone-class narrow viewport;
- modern large iPhone viewport;
- 768–900px tablet width;
- 1366px desktop;
- 1440–1600px desktop.

Home visual acceptance requires:

- Igor visually dominates the first viewport;
- no accidental face/head crop;
- only one primary action treatment;
- no overlapping chat/control UI;
- media is visible within the first two major sections;
- no nested carousel confusion;
- 7B+ / impact proof is legible but does not dominate the person's story;
- no blank media boxes;
- no horizontal page overflow;
- dark and light themes retain readable contrast.

### 14.3 Performance

Measure before and after on the same route and device profile.

Targets:

- no LCP regression from baseline;
- eliminate visible hero layout shift;
- no new long interaction-blocking tasks introduced by Home;
- below-fold media does not preload unnecessarily;
- route shell remains crawlable without waiting for client API data.

### 14.4 SEO

- canonical URL matches route/language policy;
- hreflang links are reciprocal for supported locales;
- sitemap contains intended public routes only;
- structured-data JSON parses without syntax errors;
- title / meta description / OG data reflect the current locale and room;
- `/api/feed.json` and public discovery references remain available.

## 15. Non-goals

This redesign does not:

- delete the deep archive;
- erase the 14-chapter documentary;
- fabricate childhood or service visuals;
- hide source status to make the story cleaner;
- turn the homepage into a pure conversion landing page;
- force users into chat;
- replace the public evidence model with AI judgment;
- treat the 7B+ number as a mathematical sum of cumulative snapshots;
- deploy stale GitHub source over the live AppDeploy application.

## 16. Success criteria

A first-time visitor should be able to answer quickly:

1. Who is Igor?
2. What are the major transitions in his story?
3. What can I watch or inspect immediately?
4. What is StartOn?
5. What is he building now?
6. What is the scale of the documented public impact?
7. Where can I inspect sources and methodology?
8. Where can I go deeper into media, research, music or the archive?

The dominant visual impression must be:

**one person, one evolving story, one connected public universe — not a dashboard and not a collection of disconnected pages.**
