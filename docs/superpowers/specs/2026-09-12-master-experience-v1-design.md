# 7YA Master Experience v1 — Adaptive Life Journey

## North Star
7YA must feel like one coherent living journey through Igor Vepretski's life, work, media and evidence — not a collection of modules, archives or dashboards. A first-time visitor should quickly understand who Igor is, how the major chapters connect causally, what is documented, what is being built now, and where to go next.

The experience should earn the reaction “amazing Igor Vepretski” through real chronology, source media, documented action, setbacks, creation, StartOn and evidence rather than through self-congratulatory claims.

## Core product rule
TIME IS THE OPERATING SYSTEM. IMPACT IS THE MEANING. MEDIA IS THE EMOTIONAL PROOF. EVIDENCE IS THE TRUST LAYER. AI IS THE GUIDE, NOT THE CENTER.

The home page becomes the master experience. Existing specialist routes remain useful as deep lenses over the same biography.

## Social enrichment invariant
All of Igor's public social surfaces are treated as one corpus, not as separate platform feeds.

The permanent ingestion/projection rule is:

**DIRECT FIRST → RECOVER EVERYTHING → DEDUPE → VIRAL SCORE + STORY SCORE → LIFE CHAPTER → MOMENT → SOURCE.**

This rule applies to Instagram (all known accounts), TikTok current and legacy traces, YouTube/Shorts, Facebook current and legacy traces, LinkedIn, X, Threads, Telegram and any later public platform that becomes part of Igor's record.

Direct authenticated or first-party connectors are always preferred where available. Public URLs, RSS/Atom, exports, open-source recovery tools and surviving mirrors may supplement gaps, but every recovered item must preserve provenance and must never be silently upgraded to a stronger evidence status.

A platform is a source, not an information architecture. The homepage must not devolve into separate Instagram/TikTok/Facebook/YouTube walls. Social material is projected into the life journey by meaning and chronology.

### Dual-score rule
Viral performance and biographical importance are separate signals and must never be collapsed into one threshold.

**Viral Score** estimates how strongly a post performed relative to Igor's normal performance on the same platform and period. When available, use platform-appropriate signals such as views, likes, comments, shares, saves, velocity and engagement rate. Normalize within platform/time cohorts before comparing across surfaces. A fixed global threshold such as `likes > 5000` is explicitly non-canonical and must not be used as the primary selection rule.

**Story Score** estimates how important the item is for understanding Igor's life, work and public development. It may consider whether the item documents a transition, service, StartOn, fatherhood, public leadership, October 7, creation/music, research, 7YA, a consequential public conversation or a later outcome linked to an earlier moment.

The homepage/editorial projection may prefer a high-Story item over a higher-Viral item. The archive must retain both scores separately where they are available.

### Social source states
Every normalized social item should preserve a source state such as:
- `DIRECT` — authenticated/native connector or first-party API result;
- `PUBLIC` — public URL/RSS/unauthenticated source;
- `RECOVERED` — export, mirror, open-source recovery or surviving trace;
- `CANON` — item whose factual identity/source relationship is already accepted in the canonical corpus.

Source state and evidence trust are related but not interchangeable. The UI must not present a recovered item as direct or verified simply because it is visually compelling.

### Projection rule
The Social Story Atlas and Life Journey consume the normalized corpus. For each life chapter, the UI should prefer:
1. one dominant source item that best explains the chapter;
2. a small set of supporting traces from other networks;
3. direct access to the original source and provenance;
4. a route to the complete social/archive view for deeper exploration.

The full archive may expose filters such as Most Viral, Most Important, Newest, Most Discussed, Most Shared and Recovered, but the homepage remains story-first.

## What changes
The current homepage orchestration is replaced by one intentional sequence:

1. Hero — identity, real visual presence and one clear invitation to begin.
2. Life Journey Spine — a visible chapter map from origin to NOW.
3. Journey Scenes — each chapter contains story, one primary real/source visual, related media and direct evidence/source actions.
4. Adaptive Progress — the browser remembers only locally which chapters were explored and suggests a relevant next chapter.
5. NOW — current work and live/public signals surface after the visitor understands the path.
6. Contextual Ask Igor — AI remains clearly labelled and is invited from the current chapter/context rather than dominating the page.
7. Continue Journey — returning visitors can continue from prior explored chapters.

## Canonical life chapters
The existing LifeThroughline is the source presentation layer and must be evolved rather than duplicated. The canonical public chapter sequence is:

- 1990–2007 — Kharkiv → Israel → Jesse Cohen
- 2008–2021 — service, security, police and responsibility
- 2022 — return to the neighborhood / StartOn
- 2023 — fatherhood and public voice
- 2023–2024 — October 7 / Nova / rupture and responsibility
- 2020–2025 — creation and music
- 2026 → NOW — 7YA, research, public systems and present work

The implementation may add a distinct NOW destination but must not invent additional biographical facts.

## Content orchestration
Existing modules are treated as content suppliers, not equal homepage sections. ViralTop, NativePersonalMedia, HomeArchiveHighlights, LiveSocial, work cards and selected media should be folded into the relevant chapter or into the final NOW/current-signals section when they add meaning.

Do not build another parallel archive, timeline, graph or ingestion layer.

## Adaptive UX
Adaptation is lightweight, private and local-first:

- Store explored chapter identifiers in localStorage.
- Track chapter exploration through explicit interaction and chapter visibility.
- Calculate progress as explored chapters / total chapters.
- Recommend the next unexplored chapter, with simple interest-aware ordering where explicit interaction makes that useful.
- Never alter factual chronology or source status based on behavior.
- Never require an account.
- If storage is unavailable, the experience must still work normally without personalization.

No personal browsing data is sent to a new backend for this feature.

## Visual direction
- Editorial cinematic rather than dashboard-like.
- Real/source visuals before generated imagery.
- One dominant visual per chapter; related media is secondary.
- Strong typography, generous negative space and clear chapter numbering.
- Progressive disclosure: evidence and related media are available without visually competing with the story.
- Motion is restrained and meaningful; respect prefers-reduced-motion.
- No collage-first design.
- Mobile is primary: chapter navigation must be swipe/scroll friendly with no page-level horizontal overflow.
- Tap targets >= 42px.

## Homepage information hierarchy
Above the fold:
- Igor Vepretski identity
- concise throughline statement
- authentic visual presence
- primary CTA: start/continue journey
- secondary CTA: see current work or evidence

Immediately after:
- chapter spine/progress
- first journey scene

Only after biography is established:
- NOW/current work
- story-first Social Story Atlas/current signals
- contextual Ask Igor
- archive/deep routes

## Evidence behavior
Every factual chapter continues to expose its source. Evidence actions should open the existing source/evidence route or the direct public source. Canon, discovery and public-source status remain explicit. The new UX must not upgrade discovery into canon.

## Accessibility and performance
- Preserve semantic headings and landmark structure.
- Visible keyboard focus.
- Chapter controls operable by keyboard.
- Respect reduced motion.
- Lazy-load below-fold imagery/video.
- Avoid autoplay video.
- Keep the first viewport focused on text + existing optimized real imagery.
- Preserve the existing @appdeploy/client API use for the public social feed; do not add new frontend network dependencies solely for presentation.

## System boundaries
Untouched unless a verified defect blocks this experience:
- canonical corpus
- evidence ingestion
- public projection
- backend source ingestion
- evidence policy
- specialist archives

Social enrichment may add normalization/scoring adapters around existing sources, but must not create a second competing corpus or silently duplicate the canonical archive.

## Success criteria
A visitor can:
- understand the core identity and journey within 5 seconds;
- see the chapter map without scrolling through unrelated modules;
- move to any chapter directly;
- open a chapter's source/evidence without losing the overall journey;
- see meaningful related media in context;
- understand that social material comes from multiple networks but belongs to one life story;
- distinguish source/provenance status when relevant;
- reach NOW with a clear causal understanding of how the earlier life connects to current work;
- leave and return with visible journey progress on the same browser;
- use the experience comfortably at 375×667 and desktop widths;
- complete the experience without console/runtime errors or page-level horizontal overflow.

## Release discipline
Use the currently applied AppDeploy snapshot as production source of truth. Make one coherent deployment from that snapshot, then verify deployment QA, mobile and desktop visuals, runtime errors and the canonical 7ya.io user-visible result. Do not run overlapping production writers.