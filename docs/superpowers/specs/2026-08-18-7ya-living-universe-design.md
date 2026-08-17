# 7YA Living Universe — Design

**Date:** 2026-08-18
**Status:** Approved design direction
**Baseline:** AppDeploy v100 / current `life-first` implementation

## Goal

Transform 7YA from a rich personal website into a living digital universe: a cinematic, evidence-aware, multilingual experience in which visitors enter Igor Vepretski's life, move through the chronology, encounter the public work and cultural output in context, understand what travelled and what changed, and leave with knowledge, tools and a next action of their own.

The site must remain unmistakably personal while becoming substantially more useful than a personal portfolio.

## North star

**A life you enter. Knowledge you leave with.**

The visitor journey is:

**Person → lived moment → expression → public echo → knowledge → action → visitor growth.**

The site must never become a CV, generic influencer showcase, campaign microsite, archive dump, abstract knowledge portal or dashboard-first product.

## Relationship to existing v100

v100 is the production baseline and should be evolved, not discarded.

Existing working systems are preserved wherever possible:

- first-person hero
- personal chronology
- public-action modules
- influence / echo systems
- StartOn material
- research and original frameworks
- Knowledge Commons
- creation / music / media
- deep archive
- multilingual support
- source and provenance infrastructure

The redesign focuses on **composition, pacing, interaction hierarchy, visual storytelling and contextual linking**, not a wholesale rewrite of working domain logic.

## Experience architecture

### 1. Entry

The first viewport contains only what is needed to establish a human relationship:

- one dominant real-life visual
- `IGOR VEPRETSKI`
- one concise first-person statement
- three primary choices:
  - experience the story
  - see what is happening now
  - build / create something together
- language switcher remains available but visually subordinate

The first screen must not present counters, cards, dashboards, archive density or a résumé summary.

### 2. Living chronology

The biography is edited as a sequence of cinematic chapters rather than a conventional timeline.

Initial narrative spine:

1. Kharkiv
2. immigration / Bat Yam
3. Jesse Cohen / childhood and belonging
4. adolescence / friction / formation
5. military service
6. security work
7. policing / public systems
8. academic formation
9. fatherhood
10. creator / social-media years
11. crisis / failure / recovery
12. StartOn
13. music / creative work
14. public / civic life
15. research / original frameworks
16. right now
17. future / open horizon

Every chapter begins with lived experience. Metadata, evidence and theory remain subordinate.

### 3. Chapter rhythm

A chapter may contain the following sequence where evidence exists:

1. **The moment** — first-person story.
2. **The visual** — real photo, video frame, document or other period evidence.
3. **What I said then** — post, interview, article, clip, song or public statement.
4. **The internet / public answered** — selected reactions and redistribution.
5. **How it travelled** — verified echo trail across reposts, screenshots, media, publishers or later discussion.
6. **What changed** — Verified / Inferred / Unknown impact state.
7. **What I understand now** — present-day reflection.
8. **Learn from this** — contextual Knowledge Lens.
9. **One thing to try** — practical visitor action.

Not every chapter must contain every element. Missing evidence is omitted rather than simulated.

## Home composition

Replace the current long sequence of near-equal-weight sections with a controlled dramatic hierarchy.

Recommended home order:

1. Living entry / hero
2. Living chronology — first meaningful chapters visible immediately
3. Right Now pulse
4. selected public-echo / influence sequence attached to relevant life content
5. StartOn as lived consequence of the earlier story
6. thinking / research / Knowledge Commons context
7. creation / music / collaborative work
8. visitor handoff / personal next step
9. deep archive

Large standalone walls and dashboards should not interrupt the story before the visitor understands the person.

## World / room navigation

Primary navigation is reduced to seven conceptual rooms:

- **LIFE** — living autobiography
- **NOW** — current work, recent expression and active priorities
- **IMPACT** — provenance-aware public echo and downstream influence
- **STARTON** — youth opportunity, digital inclusion, program model and outcomes
- **THINK** — academic work, systems thinking, original frameworks and spiritual meaning
- **CREATE** — music, media, writing, visual work and co-creation
- **ARCHIVE** — exhaustive source universe

These rooms are navigation concepts, not permission to add seven dashboard landing pages. Each room should preserve one dominant object at a time and strong editorial pacing.

## NOW

The site must feel alive.

`NOW` should expose a compact, updateable pulse containing only high-value current material such as:

- latest substantial public post or statement
- active project / initiative
- current research or writing
- current StartOn work
- current media / creation object
- one current question or direction

It must not become a generic social feed mirror.

## IMPACT

Impact must be shown as causal / distribution pathways rather than vanity counters.

Preferred model:

**Origin → reaction → share / repost → derivative object → media / publisher pickup → later continuation → verified consequence where available.**

Every object carries source-local metrics. Cross-platform aggregation is allowed only when methodology is documented and defensible.

Impact state vocabulary:

- **VERIFIED** — direct evidence of downstream result
- **INFERRED** — plausible relationship supported by evidence but not directly proven
- **UNKNOWN** — recoverable exposure / interaction exists but downstream consequence cannot be established
- **DISPUTED** — competing evidence or unreliable metric

Unknown never becomes zero, and inferred never becomes verified.

## STARTON

StartOn is presented as the consequence of lived experience, not as a corporate insert.

The narrative arc is:

**problem experienced → pattern understood → responsibility accepted → model built → opportunity created for others.**

StartOn content should combine:

- why the model exists
- youth opportunity / belonging problem
- physical / digital hub model
- real partners and evidence-safe relationships
- program mechanics
- outcomes / evaluation where verified
- how a visitor, municipality, partner or young person can continue

No unsupported partnership or endorsement claim may be introduced.

## THINK

This room exposes intellectual depth without inflating academic status.

Content families include:

- criminology
- sociology / institutions
- information science / digital society
- systems thinking
- AI / public technology
- leadership / public value
- Strategic Sedation
- Gastrocratia
- The Resonant Self
- SUPERNOAH
- Opportunity / Adversity framework
- Kabbalistic / spiritual interpretation when explicitly labeled as such

Every object must be typed as one of:

- established evidence
- contested evidence
- emerging evidence
- Igor's original framework / hypothesis
- spiritual / interpretive tradition
- open question

Original frameworks may be ambitious; they must not be presented as consensus scholarship.

## CREATE

Creation is not a gallery afterthought.

The room includes music, clips, writing, campaigns, interviews, visual production and public co-creation.

A persistent concept is **CREATE WITH ME**: where appropriate, visitors can move from consuming an object into a collaboration or contribution path.

This must remain concrete and bounded; it should not become an empty community CTA.

## Visitor transformation layer

After sufficient engagement, the experience may ask a lightweight non-diagnostic question such as:

**What part of this met you?**

Possible paths:

- belonging
- family
- career
- crisis / recovery
- influence
- creation
- youth
- money / resilience
- leadership
- technology
- meaning

The answer may reprioritize internal recommendations, Knowledge Lenses and next actions.

Rules:

- no mental-health diagnosis
- no manipulative urgency
- no sensitive profiling for public display
- no claim that the site knows the visitor better than they know themselves
- personalization must be reversible and optional

## Growth model

The recurring transformation pattern is:

**Adversity → interpretation → responsibility → action → opportunity.**

The existing `pain → responsibility → build` language remains available as a concise expression of this model.

If a progress metaphor is used, it should feel adult and editorial rather than gamified for its own sake. Candidate states:

- Seed
- Growth
- Action
- Perspective
- Builder

The mechanic is optional in the first implementation slice. The conceptual pattern is not optional.

## Knowledge Commons integration

The existing Knowledge Commons design remains valid and becomes contextual infrastructure inside the Living Universe.

Knowledge must appear because a life chapter generated a real question.

Default pattern:

**lived experience → public expression → public echo → schools of thought → evidence → practical tools → action.**

Knowledge modules should normally be expandable or contextually linked rather than inserted as large theory walls into the autobiography.

## Visual system

### Core principle

**Real life first. Evidence second. Interface third. Illustration last.**

### Media hierarchy

Target editorial mix on primary narrative surfaces:

- 70–80% real documentary / personal / public-life visual material where enough verified material exists
- remaining space may use designed source cards, diagrams, typography and restrained contextual illustration

This is an editorial target, not a fabricated percentage requirement when archive coverage is insufficient.

### Allowed dominant media

- original photographs
- original video frames
- posts / platform-native content objects
- press / broadcast frames
- interviews / podcasts
- documents
- StartOn visuals
- creative / music assets
- civic / public-action material

### Prohibited visual shortcuts

- no collages
- no generic stock walls
- no repetitive use of the same small set of hero images when more relevant source material is available
- no generated image presented as historical evidence
- no decorative dashboard density before human context
- no unsupported institutional logos or visual endorsement implications

### Palette

Retain the existing strength of black / graphite / off-white.

7YA green becomes an accent for energy, action, verified state or interactive focus rather than the default treatment for every surface.

### Typography

Retain bold editorial typography but reduce repetitive all-caps / oversized headline patterns when they flatten hierarchy.

Human narrative text must remain comfortable to read for long sessions.

## Desktop behavior

Desktop may use:

- cinematic split screens
- asymmetric editorial composition
- full-bleed media
- sticky chapter context
- controlled side evidence panels
- richer transition between story and provenance

It must not become a multi-column analytics console.

## Mobile behavior

Mobile is a separately composed editorial experience, not a shrunken desktop layout.

Rules:

- one dominant narrative or media object at a time
- no horizontal overflow
- no tiny evidence cards in multi-column grids
- primary actions remain thumb-reachable
- long text receives proper breathing room
- images and video preserve meaningful crops
- archive density is progressively disclosed

## Multilingual behavior

Hebrew, English and Russian remain first-class.

- Hebrew uses correct RTL composition
- English and Russian use LTR composition
- first-person writing is localized for voice, not machine-literal consistency
- claim strength remains equivalent across languages
- academic terms use accepted vocabulary in each language
- source titles may remain in original language with localized context

## Privacy / safety boundary

The site tells Igor's story without turning other people's private lives into raw material.

Publication classes remain:

- **PUBLIC**
- **PERSONAL-SAFE**
- **PRIVATE**

Children, partners, relatives, private citizens, legal / financial matters and sensitive institutional details receive stricter review.

The rule is:

**Show Igor's choices, responsibility, experience and public record; expose another person's private information only when there is a clear, safe, justified publication basis.**

## Provenance and truth model

The production site must preserve the research-canon rule:

**DISCOVER → VERIFY → RESOLVE → MAP → RANK → CURATE → BUILD → QA → PUBLISH.**

7YA is an output of the canon, not the source used to prove the canon.

Content should distinguish:

- documented fact
- first-person memory
- sourced public statement
- verified metric
- inferred impact
- disputed record
- original interpretation
- open question

No visual polish may erase these distinctions.

## Component direction

The first implementation should prefer focused additions / refactors around existing `life-first` units.

Likely new or adapted responsibilities:

- `LivingEntry` / evolved `LifeFirstHero` — human entry and three-path choice
- `LivingChapter` — chapter composition contract
- `StoryMediaInsert` — period-appropriate media object
- `EchoTrail` — propagation / downstream chain
- `ImpactState` — Verified / Inferred / Unknown / Disputed
- `NowPulse` — compact current-life module
- `RoomNavigation` — LIFE / NOW / IMPACT / STARTON / THINK / CREATE / ARCHIVE
- `VisitorPath` — optional non-diagnostic path selection
- `OneThingToTry` — practical action handoff

Existing `KnowledgeCommons`, `InfluenceUniverse`, archive, StartOn, research, music and locale systems should be adapted / composed rather than cloned.

## Data boundaries

A chapter-level model should support at minimum:

```ts
type LivingChapter = {
  id: string;
  era: string;
  title: Local;
  narrative: Local;
  media: StoryMedia[];
  expressions: PublicExpression[];
  echoes: EchoNode[];
  reflection?: Local;
  knowledgeLensIds: string[];
  action?: VisitorAction;
  publicationClass: 'public' | 'personal-safe' | 'private';
};

type ImpactState = 'verified' | 'inferred' | 'unknown' | 'disputed';
```

Implementation may adapt names to existing repository conventions while preserving semantics.

## Error and fallback behavior

- missing visual → designed source card or text-first layout, never unrelated stock
- broken external media → retain provenance and show unavailable state
- missing metric → unknown, not zero
- disputed metric → disputed / quarantined
- missing translation → do not silently publish a stronger or machine-garbled claim
- missing evidence → omit or label as memory / open question
- failed personalization state → fall back to neutral editorial order
- mobile media crop failure → use safe object-position or alternate source, not unreadable clipping

## SEO / interoperability

The redesign must preserve or improve:

- canonical URLs
- localized metadata
- Open Graph
- crawlable text
- schema.org types only when semantically accurate
- stable public routes for life chapters / knowledge objects where feasible
- source links and citation-ready context
- RSS / feed discoverability for meaningful updates where already supported or low-risk to add

No structured data may inflate academic, public-office or institutional status.

## Performance constraints

Cinematic does not mean heavy.

- avoid autoplay video with sound
- prefer responsive images and lazy loading below the first viewport
- protect LCP on the entry visual
- avoid layout shift from media
- respect `prefers-reduced-motion`
- no animation required to understand content
- mobile should remain fast on ordinary cellular connections

## Accessibility constraints

- semantic heading order
- keyboard-accessible navigation and expanders
- visible focus states
- sufficient contrast
- meaningful alt text for documentary visuals
- captions / transcripts where available for audio / video
- no critical information encoded only by color

## Initial implementation slice

Do not rebuild the entire archive first.

The first slice should prove the Living Universe model on production-grade surfaces:

1. evolve the hero into the restrained three-path Living Entry
2. create / adapt a reusable Living Chapter pattern
3. implement three exemplary chapters end-to-end:
   - childhood / belonging
   - service / institutions
   - StartOn / opportunity
4. attach contextual real media to each
5. attach at least one public-expression / echo object where evidence exists
6. attach the relevant Knowledge Lens
7. attach one practical visitor action
8. add compact `NOW`
9. reduce home section competition around these surfaces
10. complete desktop + mobile visual QA before expanding the pattern

Once this slice proves the rhythm, migrate additional chapters incrementally.

## Acceptance criteria

The design passes only when all are true:

1. First viewport feels like entering a person's world, not scanning a portfolio.
2. Igor's first-person life remains the dominant narrative spine.
3. The home page no longer presents most major systems at near-equal visual weight.
4. At least three chapters demonstrate story → media → expression / echo → reflection → knowledge → action.
5. Real archive visuals dominate those demonstrated chapters.
6. No collage appears anywhere in the new experience.
7. Viral / influential content appears in chronological or thematic context rather than only in a detached wall.
8. Impact states visibly distinguish Verified / Inferred / Unknown / Disputed.
9. StartOn reads as a lived consequence and public model rather than a corporate insert.
10. Research and spirituality clearly distinguish evidence, hypothesis and interpretation.
11. `NOW` makes the site visibly alive without becoming a raw feed.
12. Mobile shows one dominant object at a time and has no horizontal overflow.
13. Hebrew, English and Russian preserve equivalent factual strength.
14. Existing source / provenance / archive capabilities remain reachable.
15. Privacy classes are respected.
16. Production QA passes on desktop and mobile.
17. Performance and accessibility do not regress materially from the current validated baseline.

## Non-goals for the first slice

- no total rewrite of v100
- no new CMS unless a concrete blocker requires it
- no full redesign of every archive route
- no speculative social metric aggregation
- no autonomous public publishing of sensitive personal material
- no generic community platform
- no complex points economy in the first slice
- no AI-generated historical reconstruction presented as fact

## Success definition

After a meaningful visit, the visitor should be able to say:

> I understand what Igor lived.
>
> I saw what he made and how the outside world responded.
>
> I can distinguish what is documented from what is interpretation.
>
> I learned something useful beyond Igor himself.
>
> I know what I can do next.

That is the standard for **7YA Living Universe**.
