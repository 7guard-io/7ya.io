# 7YA Living Digital Biography — Design Specification

## Status
Approved product direction. This document replaces the earlier card/rail-oriented homepage concept.

## Product goal
Turn 7YA from a content index into a personal, cinematic, source-grounded digital biography of Igor Vepretski. The visitor should meet a person first, then move through lived experience, public moments, mission, creation, evidence and finally a context-aware conversation with Digital Igor.

The experience must feel like one authored story, not a collection of disconnected cards, feeds or archive widgets.

## Core visitor journey
The canonical homepage sequence is:

**Face → Story → Live moment → Meaning → Mission → Creation → Proof → Personal conversation**

This sequence replaces the current pattern of repeated rails, cards, archives and links.

## Design principles
1. **Personal before institutional.** Igor is the human thread. StartOn, media, music, evidence and 7YA are chapters of one life rather than competing products.
2. **Live media before link lists.** Wherever an embed is stable and permitted, visitors should be able to watch or listen inside 7YA.
3. **One active embed at a time.** Posters load first; the external player loads only after explicit user action. This preserves performance, privacy and visual calm.
4. **Editorial hierarchy, not equal cards.** One dominant moment, a few secondary moments and compact supporting material. Nothing should look like a generic grid of equally important tiles.
5. **Source-grounded visuals.** Use real public portraits, publisher imagery, broadcast frames, social embeds and source captures. No AI-generated image may be presented as documentary evidence.
6. **Archive comes after interest.** The complete archive remains deep and searchable, but it does not dominate the first experience.
7. **Multilingual by design.** Hebrew, English and Russian use the same information architecture, with RTL/LTR handled natively.

## Homepage information architecture

### 1. Cinematic identity hero — “This is me”
Purpose: establish Igor as a human being in the first screen.

Layout:
- Large editorial portrait or source-grounded hero image occupying the visual majority of the viewport.
- Short identity statement only; no long biography.
- Two primary actions: **Meet Igor** and **Talk to Digital Igor**.
- Two or three small live-media windows around the main portrait: one broadcast, one social/short-form moment and one StartOn moment.
- The mini-windows are previews, not generic cards; they should feel like fragments of a life occurring around the central portrait.

Success condition: within 15 seconds the visitor knows who Igor is and sees more than one real public frame.

### 2. Personal journey — “Where I came from”
Purpose: explain causality rather than chronology.

Structure:
- A cinematic vertical story, not a dense timeline.
- Suggested chapters: roots/immigration → service → networks/public voice → fatherhood/identity → StartOn → creation/music → 7YA.
- Each chapter contains one strong source-grounded visual, year/period, one short personal statement and a “what this changed in me / what came next” line.
- The narrative should never become a CV.

### 3. Live stage — “See me, do not just read about me”
Purpose: make 7YA a media experience rather than a link directory.

Behavior:
- One large adaptive stage with a selectable list of public moments.
- YouTube/broadcast uses 16:9.
- TikTok/Instagram Reels use 9:16.
- Social posts use platform embed when stable; otherwise use a clearly labeled source poster/capture.
- Audio/music uses native Spotify/Apple Music/SoundCloud embed where available.
- Selecting a moment swaps the stage in place.
- External media loads only after click.
- Every moment includes source, year/date, evidence/provenance label and “open full source”.

Initial featured set should include a balanced mix of television, long-form conversation, short-form social, StartOn and music rather than many items from one category.

### 4. Impact stories — “What moved from my life into the world”
Purpose: explain influence through documented chains rather than vanity metrics.

Each impact story follows a causal sequence such as:
- personal experience → post → external distribution → press/public conversation;
- family fraud story → public post → television → civic campaign;
- Jesse Cohen/lived experience → public story → StartOn;
- creator work → cultural distribution → professional/public identity.

Each sequence must distinguish verified evidence, owner-reported context and inference.

### 5. StartOn chapter — mission as transformation
Purpose: show StartOn as the mission born from the journey, not as a detached product card.

Structure:
- One emotionally strong visual and one featured playable source.
- Three short layers only: **the problem → the model → what can happen now**.
- Copy should connect Igor’s return to the neighborhood with creating a different starting point for young people.
- Deep operational detail remains on StartOn-specific surfaces.

### 6. Creator / music chapter — deliberate tonal shift
Purpose: show that Igor is not only a civic/public figure.

Structure:
- Change visual rhythm and typography enough to signal culture/creation without breaking the overall design system.
- Spotify embed as the primary music surface.
- Optional Apple Music/SoundCloud secondary actions.
- Music video or creator moment where verified.
- Clearly connect Ido Vepretski / music identity to the same human story.

### 7. Public voice — media, writing and talks
Purpose: present public authority with editorial hierarchy.

Structure:
- One dominant media appearance.
- Two secondary appearances.
- Compact carousel/rail for the remaining curated sources.
- Separate visual labels for television, podcast, writing and talk.
- Every item should answer: “What does this moment reveal about Igor?”

### 8. Deep archive — “All of Igor”
Purpose: preserve depth without overwhelming the main narrative.

Features:
- Search and category filters.
- Public-source registry and provenance labels.
- Visual wall, platform history, evidence wall and long-form source library.
- Can scale to dozens or hundreds of records.
- This is where existing DeepMediaLibrary / PostPortraitWall / InfluenceMemory-style functionality belongs.

### 9. Digital Igor — contextual continuation
Purpose: turn the assistant from a floating generic chat into the next step of the visitor’s journey.

Behavior:
- Remains clearly disclosed as an AI companion based on Igor’s public work, not Igor himself.
- Receives non-sensitive interaction context from the current visit: chapters viewed, media selected and CTA intent.
- Can suggest a next question based on what the visitor already explored.
- Example: after viewing StartOn, offer to explain why Igor returned to the neighborhood; after a media item, offer the full story/evidence chain.
- No private data is required for this context.

## Component architecture
The current code already contains useful building blocks but they use inconsistent visual languages. The redesign should consolidate rather than duplicate them.

Recommended component boundaries:
- `IdentityHero` — first-screen personal identity and live previews.
- `JourneyNarrative` — story chapters and transformation logic.
- `LiveMediaStage` — adaptive player/poster with one active embed.
- `ImpactStory` / `ImpactStoryRail` — causal public-impact chains.
- `MissionChapter` — StartOn-specific story chapter.
- `CreatorChapter` — music/creator identity and audio embed.
- `PublicVoice` — hierarchical media/writing/talk section.
- `DeepArchiveGateway` — handoff into the complete archive.
- `ContextualCompanionBridge` — sends page-interaction context to Digital Igor without exposing private data.

Existing components such as `StoryStage`, `ViralMediaGallery`, `DeepMediaLibrary`, `MediaPage`, `PostPortraitWall` and music/embed utilities should be reused or refactored into these boundaries instead of creating a second parallel implementation.

## Canonical content model
The homepage and archive should read from one content registry rather than hard-coded page-specific ID arrays.

Each public item should include:
- stable `id`;
- title and localized copy;
- category and story chapter;
- source/publisher;
- canonical URL;
- date/year;
- visual type: portrait / publisher image / video frame / source capture / social embed / audio embed;
- embed type and embed identifier where supported;
- source image/poster/fallback;
- evidence status;
- provenance/disclosure label;
- featured priority;
- impact/story relationships;
- optional documented metrics with snapshot date.

Selectors derive hero previews, live-stage moments, impact stories, StartOn, music and archive views from this registry.

## Embed system
A single embed adapter should normalize:
- YouTube / YouTube NoCookie;
- Instagram posts/Reels;
- TikTok player;
- Facebook video/post where permitted;
- Spotify;
- Apple Music;
- SoundCloud.

Rules:
- Poster-first and click-to-load.
- One active external embed per stage/section.
- No autoplay before explicit action.
- Use platform-appropriate aspect ratio.
- Always retain a working canonical-source fallback.
- If the platform blocks framing, show an honest source card/capture rather than a broken iframe.

## Visual system
The intended visual language is premium editorial documentary, not dashboard UI.

Characteristics:
- dark/neutral cinematic base with restrained accent treatment;
- large photography and video frames;
- strong typographic scale changes between chapters;
- asymmetrical but controlled layouts;
- generous whitespace around dominant media;
- minimal use of borders and small metadata boxes in the first half of the experience;
- provenance and evidence labels remain visible but subordinate;
- motion limited to purposeful transitions, stage swaps and subtle entrance effects;
- no collage-style montage that combines multiple variants into one static image.

## Mobile behavior
Mobile is not a compressed desktop.

- Hero becomes portrait-first with the live previews stacked below or partially overlaid.
- Narrative chapters are single-column and image-led.
- Live media stage switches between 16:9 and 9:16 based on selected content.
- Horizontal rails are used only where they materially improve browsing; no accidental overflow.
- Digital Igor, when opened, owns the viewport and hides competing navigation.
- All primary touch targets meet accessible mobile sizing.

## Performance and privacy
- Hero visual is local/controlled and eager-loaded.
- Below-fold images use lazy loading and sensible responsive sizes.
- External embeds are not loaded until selected.
- Only one active embed per media stage.
- No hidden bulk iframe loading.
- No private family/minor content is introduced into the public homepage.
- Public media remains source-attributed.

## Error handling
- Every remote image has a deterministic fallback.
- Every embed has a canonical-source fallback.
- A blocked social embed must degrade to a labeled source poster/card without shifting layout dramatically.
- Missing metadata hides the field; it never invents a number/date.
- Evidence-status language must distinguish verified, source-linked, owner-export and owner-report states.

## Testing and acceptance gates
A release is not “done” because code deployed or selectors exist.

### Visual acceptance
On real production screenshots, desktop and mobile must visibly show:
- a transformed first screen with dominant Igor identity and multiple real public frames;
- at least one live-media stage inside the first major scroll sequence;
- clearly differentiated personal journey, StartOn and creator/music chapters;
- no repeated generic card wall dominating the first half of the page;
- no broken images or empty embed shells;
- no horizontal overflow.

### Interaction acceptance
- Switch at least one YouTube item and one vertical social item into the live stage.
- Close/replace active player without reload.
- Open canonical source from the active media item.
- HE / EN / RU continue to work.
- Digital Igor remains correctly disclosed and usable on mobile.

### Content acceptance
- No hero/feature visual is repeated as a substitute for unavailable source imagery more than intentionally designed.
- No fabricated metrics, partnerships, screenshots or claims.
- Every featured public item carries source/provenance metadata.

### Performance acceptance
- No external player loads before user action except explicitly approved audio/player behavior.
- Initial viewport remains responsive on mobile.
- No bulk loading of social widgets.

## Out of scope for this redesign
- Rebuilding the backend or Growth Graph.
- Changing StartOn’s own application architecture.
- Adding private personal/family media.
- Inventing new public claims or reconstructing missing metrics.
- Building a social network feed inside 7YA.

## Definition of success
Within 15 seconds a new visitor should know who Igor is, see him in more than one authentic public frame and understand that this is a personal digital world rather than a publicity template.

Within one minute the visitor should be able to watch or listen to Igor inside the site.

Within two minutes the visitor should understand at least one causal line from lived experience to public action and be able to continue that specific line with Digital Igor.

The final product should feel authored, cinematic, personal, source-grounded and alive.