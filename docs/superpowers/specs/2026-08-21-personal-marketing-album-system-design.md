# 7YA Personal Marketing Album System — Design

**Date:** 2026-08-21  
**Status:** Approved direction in chat; implementation starts only after this written spec is reviewed.  
**Repository:** `7guard-io/7ya.io`  
**Branch:** `feat/personal-marketing-album-system`  
**Builds on:** `docs/superpowers/specs/2026-08-15-life-journey-engine-ux-design.md`

## 1. Product thesis

7ya.io must stop feeling like a collection of routes and start feeling like **Igor Vepretski's living personal album — curated to market the person, the work, the ideas, the credibility and the invitation to act**.

This is not a conventional portfolio, corporate biography, archive dump or generic personal brand landing page. It is a cinematic, source-backed, multilingual personal album in which every section combines:

`REAL MOMENT → PERSONAL MEANING → PUBLIC VALUE → PROOF → NEXT ACTION`

The core visitor experience is:

`MEET IGOR → FEEL THE LIFE → SEE THE WORK → UNDERSTAND THE RANGE → TRUST THE PROOF → SEE WHY IT MATTERS → CHOOSE HOW TO ENGAGE`

The site remains evidence-first, but evidence is no longer allowed to dominate the emotional experience. **The story sells; the evidence closes the trust gap.**

## 2. Primary outcome

Within the first 30–60 seconds, a new visitor should be able to understand all of the following without opening a deep archive route:

1. Igor is a real, visually recognizable person with a documented life and public body of work.
2. His work spans public systems, media, social impact, research, culture/creation and technology.
3. StartOn is a meaningful implementation layer, not a detached logo or side project.
4. Research and frameworks emerge from lived experience and system-building rather than floating as abstract PDFs.
5. Media, posts, music, interviews and public moments are part of one continuous personal record.
6. The site can substantiate major claims with sources and evidence.
7. There is a clear reason to keep exploring and a clear way to talk, collaborate, build or enter the deeper archive.

## 3. Positioning: personal album first, marketing second, evidence underneath

### 3.1 Personal album

The primary emotional mode is an authored album, not a database. Pages should feel like someone deliberately selected the most meaningful frames from a life and placed them in sequence.

The visitor should encounter:

- real photographs of Igor;
- real video frames and source thumbnails;
- dated moments and eras;
- places, roles, transitions and turning points;
- public posts and media appearances;
- music and creative work;
- StartOn in context;
- research in context;
- short first-person or editorial captions;
- links to the underlying proof.

The album must be **personal enough to feel intimate, but public-safe enough to remain a deliberate public identity system**.

### 3.2 Marketing layer

The site should continuously translate biography into relevance. Marketing does not mean louder claims or generic conversion copy. It means making the visitor understand:

- what Igor has actually done;
- what he can credibly contribute now;
- what makes his path unusual;
- what kinds of problems he understands from the inside;
- what systems, communities or collaborations he can help build;
- why a journalist, partner, institution, collaborator, investor, creator or civic actor should continue the conversation.

Every major chapter therefore needs a **value bridge**: a concise statement connecting the personal moment to the capability or public value that emerged from it.

### 3.3 Evidence layer

Proof remains available at the exact point it is useful, but it should not visually compete with the photograph, story or key insight.

Preferred hierarchy:

1. image / video / human moment;
2. chapter title and short story;
3. value bridge;
4. selected proof chips or source cards;
5. optional deep evidence expansion.

## 4. Non-negotiable visual rules

### 4.1 Real Igor first

Use real, attributable imagery of Igor wherever an authentic image exists. Do not use generic AI stand-ins or repeated stock-like portraits as substitutes for missing editorial work.

### 4.2 No collages

Do not compose many unrelated images into a single flattened collage. A visual spread may contain multiple independent cards/frames in responsive layout, but every image remains a distinct object with its own crop, caption, source and interaction.

### 4.3 Documentary before decorative

Every major visual should do at least one of these jobs:

- establish identity;
- establish time/place;
- prove a moment;
- reveal personality;
- show work in action;
- create emotional pacing;
- open a real source.

Purely decorative imagery must be rare and must never replace a real source asset.

### 4.4 Editorial premium, not generic SaaS

The visual language remains dark, premium, cinematic and editorial. Avoid dashboard clutter, template cards everywhere, synthetic corporate gradients, gaming UI, logo walls and excessive neon.

### 4.5 Image hierarchy

Use four visual scales intentionally:

- **Cover frame** — one dominant real portrait/video still; immediate identity.
- **Chapter frame** — one strong image anchoring a life era or capability.
- **Proof frame** — press, post, article or video source object.
- **Memory frame** — smaller personal/public moments that create texture and humanity.

## 5. Information architecture: one nervous system

The existing routes remain, but they become views over one connected canon instead of isolated content islands.

Canonical conceptual graph:

`IGOR`
→ `LIFE ERA`
→ `MOMENT / EVENT`
→ `MEDIA ASSET`
→ `ROLE / PROJECT / IDEA`
→ `CLAIM`
→ `EVIDENCE`
→ `IMPACT / PUBLIC RESPONSE`
→ `RELATIONSHIP`
→ `ACTION / CTA`

Primary public layers:

1. **Album Home** — the marketing-oriented authored journey.
2. **Journey / Timeline** — chronological and transformational exploration.
3. **Media / Music / Research / StartOn / Evidence** — depth rooms driven from the same canon.
4. **Companion** — contextual conversation grounded in the same canon.
5. **Create / Contact / Build** — conversion and participation surfaces.

## 6. Album Home structure

The homepage is the cover and first full album sequence.

### 6.1 COVER — “This is Igor”

Purpose: recognition, positioning, emotional hook.

Required elements:

- one strong authentic Igor image or short silent poster-led video treatment;
- name and concise identity line;
- one human positioning statement, not a job-title stack;
- primary CTA: enter the story / journey;
- secondary CTA: talk / collaborate;
- subtle source/evidence affordance, not a dominant button row.

The cover must not begin with metrics, logos, a feature menu or a dense biography.

### 6.2 OPENING SPREAD — “A life that became systems”

Purpose: show range without dumping a CV.

Use 3–5 large editorial beats that preview the major arc:

- origin / belonging;
- service / responsibility;
- public voice / media;
- StartOn / social implementation;
- research + building / current direction.

Each beat combines a real image, one sentence of story and one value bridge.

### 6.3 LIFE ALBUM — transformation chapters

Use the seven existing life chapters as editorial spreads:

1. Belonging / Origin
2. Service / Responsibility
3. Voice / Signal
4. Culture / Create
5. Return / StartOn
6. Ideas / Research
7. Build / Now

Each spread should contain:

- one dominant authentic frame;
- 1–3 supporting memory/proof frames;
- date/era;
- short personal narrative;
- value bridge;
- one selected source/evidence action;
- one contextual next step.

### 6.4 PUBLIC SIGNAL — “What moved beyond me”

Purpose: market reach and relevance without turning the page into vanity metrics.

Show selected propagation stories:

`ORIGINAL MOMENT → DISTRIBUTION → COVERAGE / RESPONSE → FOLLOW-UP`

Use source-linked posts, article thumbnails, broadcast frames and dated metrics only when supported.

Do not present unsupported aggregate reach as universal unique reach.

### 6.5 STARTON — “Hardship turned into infrastructure”

Purpose: make StartOn emotionally and strategically legible.

Show:

- the personal return-to-place story;
- real images of Igor / spaces / public coverage where available;
- the physical/operating concept;
- youth opportunity thesis;
- documented partners/relationships with truthful labels;
- selected outcomes and current build direction;
- CTA appropriate to partner / city / mentor / builder participation.

StartOn should read as a chapter in Igor's life and as a credible system someone can join or support.

### 6.6 RESEARCH — “Experience became frameworks”

Purpose: market intellectual depth without making visitors read an academic index.

For each selected framework, show:

`LIVED QUESTION → FRAMEWORK → WHAT IT HELPS EXPLAIN → STATUS / LIMIT → READ MORE`

Research titles may include The Resonant Self, Strategic Sedation, Gastrocratia, SUPERNOAH and the Opportunities program where source/status rules permit.

### 6.7 CULTURE / MUSIC — “The part a résumé misses”

Purpose: show personality, creative range and collaboration.

Use real video/poster frames, credits, dates and source links. Do not reduce creative work to a decorative Spotify-style strip.

### 6.8 MEDIA ROOM PREVIEW — “Hear the person, not the summary”

Purpose: build trust through voice and long-form appearances.

Feature a small curated set of strong interviews/podcasts/video moments with poster-first loading and contextual captions.

### 6.9 NOW / CURRENT BUILD

Purpose: prevent the album from ending as a retrospective museum.

Show what Igor is actively building or exploring now, with explicit status labels such as active, pilot, proposal, research, archived or completed.

### 6.10 CLOSING SPREAD — “What do we build from here?”

Purpose: conversion.

Primary actions should map to visitor intent rather than one generic contact button:

- talk / interview / invite;
- collaborate / partner;
- build / create;
- explore evidence / archive;
- enter the 7YA Companion.

The page should end with a strong real Igor frame and a concise forward-looking statement.

## 7. Canon model

The redesign must not create another disconnected content database. It should introduce a typed adapter layer over existing knowledge/media/research records and gradually normalize them.

Minimum conceptual types:

```ts
type CanonNodeKind =
  | 'person'
  | 'era'
  | 'moment'
  | 'media'
  | 'role'
  | 'project'
  | 'research'
  | 'relationship'
  | 'claim'
  | 'evidence'
  | 'cta';

type CanonNode = {
  id: string;
  kind: CanonNodeKind;
  title: Record<'he'|'en'|'ru', string>;
  summary?: Record<'he'|'en'|'ru', string>;
  date?: string;
  status?: string;
  sourceUrl?: string;
  image?: string;
  video?: string;
  tags?: string[];
  marketingWeight?: number;
  albumWeight?: number;
  privacy?: 'public'|'restricted';
};

type CanonEdge = {
  from: string;
  to: string;
  relation:
    | 'happened_in'
    | 'illustrated_by'
    | 'supports'
    | 'led_to'
    | 'implemented_as'
    | 'covered_by'
    | 'collaborated_with'
    | 'invites';
};
```

The first implementation slice does not need to migrate every existing record. It must create the adapter and populate enough high-value nodes to drive the Album Home and its cross-links.

## 8. Media object requirements

Every media object displayed as part of the album should support as much of the following metadata as the source permits:

```ts
type AlbumMedia = {
  id: string;
  src: string;
  kind: 'photo'|'video-poster'|'press'|'post'|'document';
  alt: Record<'he'|'en'|'ru', string>;
  caption?: Record<'he'|'en'|'ru', string>;
  date?: string;
  place?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  relatedNodeIds: string[];
  focalPoint?: {x:number; y:number};
  authenticity: 'original'|'public-source'|'source-thumbnail';
};
```

Rules:

- never invent a date/place if unknown;
- a source thumbnail must be labeled/linked as such;
- failed images degrade to text/source cards, never to an unrelated Igor portrait;
- crops may vary by breakpoint but must preserve the subject;
- focal-point metadata should be used for important portraits where automatic center crop damages composition.

## 9. Marketing grammar

Every major chapter needs one `ValueBridge` and one `IntentCTA`.

Example grammar:

```ts
type ValueBridge = {
  chapterId: string;
  capability: string;
  publicValue: string;
  proofNodeIds: string[];
};

type IntentCTA = {
  id: string;
  intent: 'talk'|'media'|'partner'|'build'|'explore'|'create';
  href: string;
  label: Record<'he'|'en'|'ru', string>;
  contextNodeId?: string;
};
```

Marketing copy must be specific and earned. Avoid generic claims such as “visionary,” “world-changing,” “industry-leading” or “unprecedented” unless the underlying evidence and editorial purpose clearly justify them.

## 10. Navigation redesign

Navigation should represent visitor intent, not the repository route list.

### Desktop primary

- Igor
- Journey
- Work / Impact
- Ideas
- Create

### Secondary menu

- All Content / Archive
- Media
- Music
- Research
- StartOn
- Evidence
- Speaker
- Blog
- Contact
- Language

### Mobile dock

Exactly four high-frequency destinations:

- Home
- Journey
- Create
- Talk / Companion

Fixed controls must respect mobile safe areas and must not overlap media, captions or CTAs.

## 11. Cross-link engine

Every displayed object should be able to offer related depth without requiring manual link duplication in every component.

Selectors should support questions such as:

- what evidence supports this chapter?
- what media belongs to this moment?
- what research grew from this life question?
- what StartOn material belongs to this era?
- what public coverage followed this post/event?
- what CTA is appropriate after this chapter?

The UI should use these relationships to create contextual “continue the story” links rather than generic “read more” cards.

## 12. Companion integration

The 7YA Companion must consume the same canon identifiers used by the album.

When opened from an album chapter, it receives only non-sensitive context such as:

```ts
type AlbumCompanionContext = {
  locale: 'he'|'en'|'ru';
  currentNodeId: string;
  visitedNodeIds: string[];
  explicitUserIntent?: 'talk'|'media'|'partner'|'build'|'explore'|'create';
};
```

The Companion can explain the chapter, find proof, connect themes, or transition into build/create flows. It must not claim to be Igor and must not invent private knowledge.

## 13. Performance strategy

The album should feel media-rich without loading like a social feed.

Rules:

- use image/poster-first rendering;
- lazy-load below-the-fold assets;
- defer native iframe/social embeds until interaction;
- use responsive image sizing where local assets permit;
- avoid loading the entire archive into the initial homepage bundle;
- cache or statically materialize high-value canonical selections where possible;
- retain readable content when third-party media fails.

## 14. Accessibility

Required:

- correct HE RTL and EN/RU LTR behavior;
- meaningful alt text for documentary visuals;
- keyboard-openable media/source cards;
- visible focus states;
- no text baked into critical images when HTML text is possible;
- reduced-motion support;
- captions remain readable at 320–430 px widths;
- touch targets at least 44×44 CSS px where practical;
- no horizontal overflow from editorial spreads.

## 15. Privacy and editorial safety

The public album must not expose private family/sensitive material merely because it exists in connected sources or prior conversations.

Only public-safe or explicitly approved personal material is eligible for public rendering.

Source status remains explicit:

- verified / source-linked;
- strongly inferred / editorial context;
- requires confirmation / not publishable as fact.

Personal warmth must never override evidence or privacy boundaries.

## 16. Measurement

Marketing success is measured by meaningful movement, not page views alone.

Core events:

- `album_cover_viewed`
- `album_journey_started`
- `album_chapter_viewed`
- `album_media_opened`
- `album_source_opened`
- `album_value_bridge_seen`
- `album_related_story_opened`
- `album_cta_clicked`
- `album_companion_opened`
- `album_contact_intent_selected`
- `album_archive_entered`

Do not put free-text user content into analytics payloads.

## 17. Existing components to reuse

Reuse and refactor rather than rebuild:

- `src/IgorLivingRecordHome.tsx` — main authored life record and current seven-room structure.
- `src/App.tsx` — route and SEO orchestration.
- `src/GlobalNav.tsx` / `src/global-nav.css` — navigation hierarchy.
- `src/StoryCompanion.tsx` — contextual Companion launch.
- `src/DeepArchiveRiver.tsx` — deep source-backed archive.
- `src/LiveSocial.tsx` — public social layer.
- `src/MuseumPage.tsx` — source material for album/deep museum behavior.
- `src/ResearchPage.tsx` and `src/research-data.ts` — research depth.
- existing Media/Music/StartOn/Evidence routes — depth surfaces, not duplicated home implementations.
- existing knowledge JSON and media catalogs — inputs to the canon adapter.

Targeted refactor: `IgorLivingRecordHome.tsx` is already large and should not absorb all new canon, selector and album-layout responsibilities. New focused modules should own those responsibilities.

## 18. Proposed module boundaries

Implementation should prefer the following focused units:

- `src/canon/types.ts` — canonical interfaces.
- `src/canon/album-canon.ts` — first curated normalized record set / adapters.
- `src/canon/selectors.ts` — relationship and chapter selectors.
- `src/canon/marketing.ts` — value bridges and intent CTAs.
- `src/album/AlbumHome.tsx` — album orchestration only.
- `src/album/AlbumCover.tsx` — cover.
- `src/album/AlbumChapter.tsx` — chapter spread.
- `src/album/AlbumMediaFrame.tsx` — independent media frame with source/caption/fallback behavior.
- `src/album/AlbumValueBridge.tsx` — capability/public-value bridge.
- `src/album/AlbumClosing.tsx` — intent conversion.
- `src/album/album.css` — album-specific responsive editorial layout.

Existing `IgorLivingRecordHome` content may be progressively decomposed into these units; do not perform unrelated refactors.

## 19. Error behavior

- Broken media: hide broken image surface and preserve caption/source action.
- Missing source URL: do not render a fake source action.
- Missing translation: use the established locale fallback behavior; never expose raw object dumps.
- Missing relationship: omit the contextual link instead of guessing.
- Canon parse/selector failure: homepage keeps a minimal static identity/CTA shell rather than a blank screen.
- Third-party embed failure: poster/caption remains usable.
- Companion failure: album journey remains fully navigable.

## 20. Testing strategy

The implementation plan must include tests for:

1. canon selectors return only valid linked nodes;
2. no restricted media is returned to public album selectors;
3. AlbumMediaFrame fallbacks preserve text/source access;
4. no generic unrelated portrait is substituted after a source-image failure;
5. chapter rendering works in HE/EN/RU;
6. RTL/LTR direction is correct;
7. primary navigation exposes the intended hierarchy;
8. mobile fixed controls do not exceed the approved dock count;
9. CTA intent and context are preserved in generated links/events;
10. Companion context contains canonical node IDs and no private payload;
11. source links are keyboard accessible;
12. reduced-motion styles exist;
13. initial route does not eagerly mount all heavy social/video embeds;
14. existing Media/Music/Research/StartOn/Evidence routes remain reachable.

## 21. Acceptance criteria

### Album feeling

A first-time reviewer should describe the homepage as a **personal visual story / living album**, not as a dashboard, directory, archive index or generic personal website.

### Marketing clarity

By the end of the first two major spreads, a visitor can answer:

- who Igor is;
- what makes his path distinctive;
- what he has built/done;
- why that experience can be useful to others;
- how to continue the relationship.

### Personal media density

Every major life chapter displayed on the homepage must have at least one authentic visual or an explicit editorial-text fallback. No chapter may silently use a repeated generic portrait as filler.

### Evidence integrity

Major public claims shown in marketing surfaces are connected to evidence nodes or deliberately written as non-claim personal/editorial statements.

### Cross-connection

A visitor can move from a life chapter to at least two relevant depth types where available — for example media + evidence, StartOn + research, music + source, or public signal + archive — without returning to the top-level menu.

### Conversion

At least three distinct visitor intents are available by the closing spread, and CTA copy preserves context rather than sending every user to the same generic contact action.

### Performance and mobile

The first viewport remains light, no mass iframe load occurs on page entry, and the album has no horizontal overflow at 320–430 px widths.

## 22. Delivery sequence

The implementation should ship in vertical slices so each slice is independently reviewable:

1. **Canon + album frame** — typed canon, selectors, cover and one full chapter.
2. **Full homepage album** — all seven curated chapter spreads and closing conversion.
3. **Cross-linking** — connect media/research/StartOn/evidence depth routes from canonical relations.
4. **Companion context** — contextual launch from album nodes.
5. **Measurement + final mobile/performance QA**.

Each slice must preserve the existing live site until it is ready to replace the corresponding surface.

## 23. Final principle

The test for every design and implementation decision is:

> **Does this make a visitor feel closer to the real person, understand the value more clearly, trust the story more strongly, and know what to do next?**

If not, it does not belong in the personal marketing album.