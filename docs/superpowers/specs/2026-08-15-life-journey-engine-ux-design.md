# 7YA Life Journey Engine — UX Design

**Date:** 2026-08-15  
**Status:** Approved design direction; implementation blocked until written-spec review is approved.  
**Primary runtime:** 7ya.io / AppDeploy production app `697a008fddc309b142`  
**Repository contract:** `7guard-io/7ya.io`

## 1. Product thesis

7YA is not primarily a website about Igor Vepretski. It is an interactive life-journey system in which Igor's documented life, public work, media, creation, partnerships and evidence become the experiential substrate for a visitor's own reflection and development.

The visitor should be pulled into a personal, source-backed experience of Igor's life, recognize something of themselves inside that path, and then transition naturally into the 7YA Companion with enough contextual signal for the conversation to become personally useful rather than beginning as an empty chatbot session.

**Core principle:**

> Igor is not the destination. Igor is the proof that transformation is possible.

The experience loop is:

`MEET IGOR → LIVE THE STORY → SEE THE EVIDENCE → UNDERSTAND THE TRANSFORMATION → RECOGNIZE YOURSELF → TALK WITH 7YA → BUILD YOUR PATH → CREATE SOMETHING REAL → RETURN WITH EVIDENCE OF GROWTH`

## 2. User outcome

Within the first visit, a user should be able to:

1. Understand that Igor is a real person with a documented, multi-domain public history.
2. Move through a coherent life journey rather than browse disconnected archives and feature rooms.
3. See evidence at the exact point where it explains a transformation.
4. Encounter partnerships, media and platforms as parts of the story, with truthful relationship labels.
5. Reflect on their own situation at a small number of meaningful transition points.
6. Enter the 7YA Companion with relevant journey context, only with the user's participation/consent.
7. Receive a concrete next step or personal creation/development path.
8. Return later and continue from meaningful progress rather than restart from zero.

## 3. Non-goals

This redesign must not:

- become a logo wall or sponsor deck;
- turn every archive record into homepage content;
- force a questionnaire before the user receives value;
- present media coverage as partnership;
- present ecosystem membership, proposals or pipelines as active commercial partnerships;
- fabricate impact, reach, testimonials or visuals;
- expose private family information or sensitive non-public records;
- make the Companion impersonate Igor;
- replace source-backed visuals with repeated generic Igor portraits;
- add more navigation choices merely because routes exist.

## 4. Information architecture

### 4.1 Primary public flow

The homepage becomes one authored journey with progressive disclosure:

1. **MEET IGOR** — identity, real portrait/video, one primary CTA: enter the journey.
2. **LIFE STREAM** — the journey spine, organized by transformation rather than by website feature.
3. **LIFE → EVIDENCE → MEANING → YOU** — repeated chapter grammar.
4. **PROOF OF MOVEMENT** — visual propagation chains showing how a post, story or idea moved through public systems.
5. **RELATIONSHIPS IN CONTEXT** — partners/frameworks/pipelines shown only in the chapter where they matter.
6. **ENOUGH ABOUT ME. WHAT ABOUT YOU?** — explicit handoff from observation to reflection.
7. **7YA COMPANION** — guided reflection, direction and build modes.
8. **MY PATH / RETURN** — persistent continuation for users who choose to save a path.

### 4.2 Secondary archive routes

Existing Media, Music, Evidence, Research/Museum, StartOn, Speaker and Blog routes remain available, but they are secondary depth surfaces. They must not compete with the main journey during the first visit.

The full navigation may expose these depth rooms, while the primary navigation emphasizes the journey.

## 5. Chapter grammar

Every major life chapter must follow the same cognitive sequence:

### LIFE
A concise, human account of what happened. Avoid CV language.

### EVIDENCE
One to four source objects that prove or contextualize the chapter: article, public post capture, interview, video frame, document or official page.

### MEANING
A short interpretation of what changed: a skill, belief, responsibility, system insight or transformation.

### YOU
An optional micro-reflection. One tap or one short text response is enough. It is not a test and should never block progress.

Example:

- **Life:** return to Jesse Cohen and creation of StartOn.
- **Evidence:** mynet, News 13, Channel 14, official StartOn source.
- **Meaning:** lived difficulty can become infrastructure for another person.
- **You:** “What difficulty from your own life could become useful to somebody else?”

## 6. Journey chapters

The existing seven-room structure remains useful but is reframed as a life stream rather than a menu.

### 01 — BELONGING / ORIGIN
Immigration, place, childhood, belonging and the early public record.

Reflection themes: belonging, exclusion, starting point, support.

### 02 — SERVICE / RESPONSIBILITY
Military/security/public service as a school of responsibility and systems, with strict safe boundaries around operational information.

Reflection themes: capability, responsibility, what one knows how to do for others.

### 03 — VOICE / SIGNAL
Posts, social platforms, writing and the moment lived experience becomes public language.

Reflection themes: stories not yet articulated, courage to speak, digital identity.

### 04 — CULTURE / CREATE
Music, clips, humour, performance and creative collaboration.

Reflection themes: creative inhibition, expression, participation.

### 05 — RETURN / STARTON
The move from attention to institution: returning value to the neighborhood and creating opportunity infrastructure.

Reflection themes: repair, opportunity, giving access, turning hardship into a resource.

### 06 — IDEAS / RESEARCH
Genesis, SUPERNOAH, writing, academic inquiry and frameworks that translate experience into transferable thinking.

Reflection themes: meaning, models, learning, synthesis.

### 07 — BUILD / YOU + ME
The journey explicitly turns toward the visitor. Creation Path and Companion become the primary actions.

Reflection themes: goal, next move, proof, support.

## 7. Partnerships and relationship logic

### 7.1 Principle

Relationships are evidence of action, not decoration. A relationship is shown only where it explains what became possible at that point in the journey.

### 7.2 Truth taxonomy

Each displayed organization must have exactly one visible relationship status selected from a controlled taxonomy:

- `BUILT · ACTIVE SYSTEM`
- `DOCUMENTED WORKFLOW`
- `ACTIVE PARTNERSHIP` — only when explicit evidence supports this wording
- `ECOSYSTEM / MEMBERSHIP`
- `PROGRAM PARTICIPATION`
- `PILOT`
- `PILOT PROPOSAL`
- `MEDIA COVERAGE` — never partnership
- `PUBLIC SOURCE` — never partnership

No relationship may be visually promoted above its verified status.

### 7.3 Current contextual examples

- **StartOn × 7YA** — `BUILT · ACTIVE SYSTEM` — appears in the StartOn/Build transition.
- **President's Residence / בית הנשיא** — currently treated as a documented workflow/event relationship, not broad institutional sponsorship.
- **Microsoft for Startups** — `ECOSYSTEM / MEMBERSHIP` unless stronger evidence is explicitly available.
- **AJCatalyst** — `PILOT PROPOSAL` until approval/execution evidence exists.

### 7.4 UI treatment

Do not create a standalone homepage logo wall. Use a contextual “PEOPLE & SYSTEMS THAT ENTERED THE STORY” rail inside the relevant chapter. Each item shows organization, status, one-sentence role and evidence/source link where appropriate.

Media companies remain in Media/Proof surfaces and are explicitly labeled as publishers/coverage, not partners.

## 8. Proof of Movement

The site should make influence understandable as a sequence rather than as a large aggregate reach number.

Canonical chain grammar:

`ORIGINAL EXPERIENCE/POST → EXTERNAL DISTRIBUTION → PUBLIC RESPONSE → PRESS / TV / PODCAST → FOLLOW-UP / ACTION`

Examples include elder-fraud coverage, fatherhood content, StartOn coverage and other documented propagation clusters.

Rules:

- Keep each node source-linked.
- Display dated metrics only where the source snapshot supports them.
- Do not sum cross-platform impressions into a universal reach figure when duplication cannot be removed.
- Distinguish owned publishing, external reposting, editorial coverage and institutional action.

## 9. Companion architecture

The Companion becomes a journey guide rather than a generic floating chat widget.

### 9.1 Modes

**GUIDE**  
Explains the current chapter, finds sources and answers questions about Igor/7YA.

**REFLECT**  
Helps the visitor connect a chapter to their own life. Uses only explicit responses and non-sensitive journey interactions.

**BUILD**  
Turns an identified direction into a concrete next move and, when appropriate, hands off to Creator Path.

### 9.2 Context handoff

The journey may build a small `JourneyContext` object locally before authentication:

```ts
type JourneyContext = {
  visitedChapters: string[];
  resonances: Array<{chapter:string; choice?:string; text?:string}>;
  chosenDirection?: string;
  lastMeaningfulStep?: string;
  locale: 'he'|'en'|'ru';
}
```

Rules:

- No passwords, medical data, minor data or private third-party data.
- Reflection is optional.
- Context may be stored locally first.
- Persistent account storage requires the existing consent/auth boundaries.
- The Companion must disclose that it is an AI based on Igor's public work and is not Igor himself.

### 9.3 Contextual entry

When the user opens the Companion from a chapter, the first message should reference the chapter and the user's explicit interaction, rather than reset to a generic greeting.

Example:

> “You connected with the chapter about starting again and said you have an idea you keep postponing. We can begin with the smallest proof that would make that idea real.”

No inference should be stated as user fact unless it is derived from an explicit interaction.

## 10. Navigation redesign

### 10.1 Desktop primary navigation

Primary:

- `IGOR`
- `JOURNEY`
- `CREATE`
- `MY PATH`

Secondary/full menu:

- Archive / All Content
- Media
- Music
- Research
- Evidence
- StartOn
- Speaker
- Blog
- Language

### 10.2 Mobile bottom dock

Exactly four primary destinations:

- Home
- Journey
- Create
- Me / My Path

The current combination of fixed top nav, expanded menu, five-item bottom dock, back-to-top and Companion must be simplified so fixed controls never cover meaningful content.

### 10.3 Companion trigger

The Companion trigger should become contextual after the user enters the journey. On the opening hero it should not compete with the primary “enter journey” action.

## 11. Progressive disclosure and content density

The site should feel abundant without behaving like a warehouse.

Rules:

- The homepage may expose a rich stream, but only the most relevant evidence for each chapter.
- Deep Archive remains the comprehensive source-backed record and should continue to deduplicate URLs.
- Do not render dozens of heavy native social embeds on initial load.
- Use source poster/thumbnail first; load native player/embed on explicit interaction.
- Do not use `igor-hero.jpg` as a generic visual substitute for unrelated articles/posts.
- If no authentic visual exists, use an editorial text record rather than a repeated portrait.

## 12. Interaction design

### 12.1 Reflection frequency

Use approximately 4–6 reflection moments across the complete journey, not one after every card.

### 12.2 Reflection UI

Allow:

- one-tap resonance choices;
- skip/continue;
- optional short text;
- “talk about this” to open Companion with context.

No answer is required to continue the story.

### 12.3 Scroll state

A subtle journey progress indicator may show chapter position, but must not become another dense navigation bar.

### 12.4 Motion

Motion supports transitions and source emphasis. Respect `prefers-reduced-motion`. Do not introduce decorative parallax or auto-playing media that harms reading or performance.

## 13. Measurement model

The UX is successful only if it produces observable user value and movement.

### Core funnel events

- `hero_journey_started`
- `journey_chapter_viewed`
- `source_opened`
- `reflection_seen`
- `reflection_answered`
- `reflection_skipped`
- `companion_opened_from_chapter`
- `companion_direction_identified`
- `creator_path_started`
- `free_plan_rendered`
- `path_saved`
- `return_visit_path_resumed`
- `progress_evidence_recorded`

### Value signal

At selected moments, ask a compact value question such as:

> “Did this part give you something useful to take with you?”

Measure perceived utility, not generic satisfaction.

### Privacy

Analytics events must minimize content payloads. Free-text reflections should not be copied into analytics events. Persist text only under the explicit profile/path rules.

## 14. Accessibility and practical UX quality

Must satisfy:

- keyboard navigability;
- visible focus states;
- skip-to-content;
- logical heading hierarchy;
- readable HE/EN/RU line lengths;
- RTL/LTR integrity;
- mobile safe-area handling;
- no horizontal overflow at 320–430 px widths;
- no fixed dock/Companion overlap;
- touch targets at least 44×44 CSS px where practical;
- reduced-motion support;
- source image failures degrade to legible text, not broken-layout holes.

## 15. Performance constraints

- Keep first meaningful journey viewport light.
- No large batch of iframes during initial load.
- Lazy-load below-the-fold media.
- Preserve current source-first thumbnails.
- Avoid new binary assets unless they provide unique documentary value.
- Track any new client state without blocking render.

## 16. Error and offline behavior

- A failed social source must not block the chapter.
- If a live API is unavailable, show the last dated snapshot plus a clear status.
- Reflection state should survive reload locally when technically possible.
- Companion failure must preserve the user's local journey context and offer retry/continue without restarting.
- Broken external source links should be surfaced for editorial QA and not silently replaced with unrelated imagery.

## 17. Existing components to reuse or refactor

The current AppDeploy runtime already contains useful pieces that should be reused rather than duplicated:

- `IgorLivingRecordHome.tsx` — existing seven-room source-backed biography and content core.
- `DeepArchiveRiver.tsx` — deduplicated deep-public-record surface.
- `LiveSocial.tsx` — social account/live-source layer.
- `GlobalNav.tsx` / `global-nav.css` — to simplify into the new primary/secondary navigation hierarchy.
- `StoryCompanion.tsx` — extend into GUIDE / REFLECT / BUILD modes and contextual launch.
- `CreatorPathPage.tsx` — existing structured personal-path handoff.
- `HomeMediaFlow.tsx` — contains `PartnershipRail` and media relationship logic.
- `media-catalog.ts` — current relationship data and status labels.
- `HistoricalInfluence.tsx`, `ViralAlbums.tsx`, `InfluenceArticle.tsx` — source material for Proof of Movement clusters.

Targeted refactor: partnership and media logic must become contextual journey components rather than standalone surfaces hidden from the main experience.

## 18. Acceptance criteria

### First 15 seconds

A new mobile or desktop visitor can state, without opening a menu:

1. this is Igor Vepretski's real documented life/work;
2. there is a journey to enter;
3. the experience may become useful for the visitor personally.

### Journey

- The first meaningful CTA is the journey.
- All seven transformations remain discoverable.
- At least four chapters contain a clear LIFE → EVIDENCE → MEANING sequence.
- 4–6 reflection moments exist, all optional.
- Source objects link to real public evidence.

### Partnerships

- Contextual relationship rail is visible inside the relevant journey chapter.
- Every organization has an explicit relationship status.
- Media publishers are never labeled partners.
- Proposals/memberships are not presented as active partnerships.

### Companion

- Opening from a chapter includes chapter context.
- GUIDE / REFLECT / BUILD state is explicit in code and UX behavior.
- The first Companion message does not falsely claim inferred personal facts.
- Context survives a failed Companion request.

### Navigation

- Desktop primary nav has four high-level destinations.
- Mobile dock has exactly four high-level destinations.
- Full archive/depth routes remain accessible in secondary navigation.
- No fixed UI overlaps the main CTA, reflection controls or form submit controls.

### Visual integrity

- Real source imagery remains source-first.
- No repeated generic Igor portrait is used to simulate unrelated source imagery.
- Partnership display is editorial/contextual, not a decorative logo wall.
- The experience remains visually one authored 7YA system across HE/EN/RU.

### Measurement

- The core funnel events are emitted with no free-text reflection content in analytics payloads.
- Utility feedback is measurable.
- Return-path continuation can be distinguished from a first visit.

## 19. Rollout order

1. Journey shell + navigation simplification.
2. Convert existing seven rooms into LIFE → EVIDENCE → MEANING chapters.
3. Add contextual partnership rail to StartOn/Build chapters.
4. Add 4–6 reflection interactions and local `JourneyContext`.
5. Contextual Companion launch + GUIDE/REFLECT/BUILD modes.
6. Proof of Movement chains.
7. Measurement events and utility signal.
8. Mobile/desktop visual QA and accessibility QA.
9. Production rollout only after the journey, Companion and navigation gates pass together.

## 20. Definition of done

7YA is done for this phase when a visitor no longer experiences a collection of pages about Igor, but a coherent, personal, evidence-backed journey in which Igor's life creates meaning, the meaning creates self-reflection, and the reflection can become a concrete next action through 7YA.
