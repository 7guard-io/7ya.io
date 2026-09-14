# 7YA Life Album Architecture — Design

## North Star
7YA is not a website about Igor Vepretski. It is a living personal life album. Every public route must preserve the visitor's sense of time, causality and personal continuity: where in the life they are, what came before, why this layer exists, and what comes next.

## Core rule
TIME IS THE OPERATING SYSTEM. Categories such as Media, Music, Research, StartOn and Evidence are lenses over one biography, not disconnected destinations.

## Canon boundary
The canonical corpus, ingestion, enrichment, media resolver, database, backend routes and evidence policy remain unchanged. The new system is presentation-only and consumes existing canonical data. If canonical data is unavailable, existing explicitly-labelled fallback chronology may render; invented facts, dates, images or relationships are forbidden.

## Experience model
1. Home opens in the present, then exposes the canonical 1990→NOW chronology before thematic abundance layers.
2. A universal Life Album Spine appears across public routes. It shows the route's temporal context and links back into canonical life chapters.
3. Subpages remain useful specialist lenses, but their identity is reframed as a chapter of the life: Media = how the world answered back; Music = soundtrack of the life; Research = questions the life forced; Museum = full album mode.
4. Chronology-sensitive collections default to chronological order. Media records and owned publications are ordered oldest→newest. Music is ordered oldest→newest.
5. Existing enrichment continues to populate the canonical corpus; chronology consumes it rather than duplicating it.

## Universal spine stops
1990 / ORIGIN → 2011 / SERVICE → 2022 / RETURN + STARTON → 2023 / VOICE → 2024 / BREAK + LONGFORM → 2025 / CREATE → 2026 / RESEARCH + 7YA → NOW.

## Route temporal context
- Home: 1990—NOW / living album
- Museum: 1990—NOW / full album mode
- Media: 2011—NOW / public echo
- Music: 2020—2025 / soundtrack
- Research: 2025—2026 / questions and frameworks
- Speaker: 2022—NOW / public voice
- Blog: 2022—NOW / authored thought
- Create: NOW→FUTURE / action after the story

## UX constraints
- No collage-first redesign.
- Preserve one strong real/source visual per moment wherever existing components already provide it.
- Do not add a third competing sticky navigation on the home page; home spine is contextual/non-sticky while specialist routes may keep the slim spine sticky below GlobalNav.
- Mobile must keep tap targets >= 42px and prevent page-level horizontal overflow.
- Reduced-motion preferences remain respected.

## Success criteria
A visitor can enter any public route and understand temporal context within three seconds; jump into a life chapter; return to the chronological album; browse media/music in temporal sequence; and reach NOW without losing the causal story.