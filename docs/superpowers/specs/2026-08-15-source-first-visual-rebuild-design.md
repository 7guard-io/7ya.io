# 7YA Source-First Visual Rebuild — Design

Date: 2026-08-15
Branch: `rebuild/source-first-20260815`

## Objective

Rebuild the 7YA frontend experience so the site reads as Igor Vepretski's living public world rather than a text-heavy biography or generic portfolio. Preserve the existing source registry, evidence semantics, multilingual behavior, journey logic, routes, APIs, and truth-status model.

## Core Product Principle

Every major viewport should contain at least one of: Igor, an authentic source visual, a documented public artifact, a service/action visual, or a creation/research object. Text must contextualize evidence rather than substitute for it.

Source hierarchy:
1. Authentic source visual already in the registry or connected archive.
2. Source thumbnail/frame derived from a canonical public video or publication.
3. Existing approved local visual asset tied to the correct chapter.
4. Generated editorial illustration only when no source visual exists, clearly labeled as editorial interpretation and never presented as evidence.

## Experience Architecture

### 1. Global Navigation
- Replace pill/circle language controls with a restrained inline `עברית · English · Русский` switcher.
- Active locale uses type weight/underline/accent, never a giant filled shape.
- Desktop: integrated into top navigation.
- Mobile: compact inline language control with no crowding or overlap.
- Maintain the four-destination mobile dock: Home, Journey, Create, My Path.

### 2. Hero / Igor Presence
- Igor remains the dominant human anchor.
- Use authentic portrait/source imagery first.
- Hero communicates the system grammar: person → evidence → action → growth.
- Avoid generic AI-style glow and decorative tech imagery that is not tied to content.

### 3. Creator Archive / Visual Public Record
- Rebuild `DeepArchiveRiver` so it actually renders each record's existing `image` and `fallback` fields.
- Cards become editorial source objects: image, source, date/year, title, short context, evidence status, link.
- Prefer varied source images over repeating the same Igor portrait.
- Preserve canonical URLs and evidence labels.
- When an external image fails, display a meaningful local fallback rather than an empty black rectangle.

### 4. Seven Life Chapters
Maintain the seven-chapter journey structure and LIFE / EVIDENCE / MEANING grammar:
1. ORIGIN
2. SERVICE
3. SIGNAL / PUBLIC RECORD
4. CULTURE / MUSIC
5. RESEARCH
6. STARTON
7. BUILD / YOU + ME

Each chapter must visually demonstrate its subject rather than rely on prose alone.

### 5. SERVICE
- Visual sequence: MILITARY → SECURITY → POLICE → PUBLIC SERVICE → STARTON → 7YA.
- Treat service as life material and responsibility, not a badge wall.
- Use public/safe material only.

### 6. SIGNAL / MEDIA
- Prioritize real frames from television, interviews, posts, publisher pages, social distribution and podcasts.
- Make source/date/status readable at a glance.
- Never present generated imagery as a broadcast or post screenshot.

### 7. CULTURE / MUSIC
- Use real video thumbnails/artwork when available.
- Treat music and creation as a real identity layer, not a footer hobby section.

### 8. RESEARCH
- Keep claim/status/limits separation.
- Add visual research objects/diagrams only when they preserve epistemic status.
- No decorative academic authority signals.

### 9. STARTON
- Use the documented press/broadcast source visuals and approved project materials.
- Eliminate empty media placeholders.
- Keep relationship statuses explicit: BUILT/ACTIVE, DOCUMENTED WORKFLOW, ECOSYSTEM/MEMBERSHIP, PILOT PROPOSAL.

### 10. BUILD / Service Experience
- End the journey by shifting from Igor to the visitor.
- Visually demonstrate what 7YA does for a user: problem/goal → conversation → tool/action → creation/progress → next step.
- Keep optional reflection and privacy-minimal state.

## Visual System

- Base: graphite black / warm white.
- Signature accent: acid green; restrained warm-gold may be used for editorial emphasis only.
- Geometry: square corners, 1px rules, strong grid, controlled asymmetry.
- Type: industrial/neutral grotesk + monospace metadata.
- Avoid: oversized pills, UI-card soup, AI glow, generic SaaS dashboard styling, repeated portrait wallpaper.
- Abloh influence is conceptual: labels, provenance, quotation logic, industrial indexing, controlled displacement — not brand imitation.

## Data Flow

The rebuild consumes the existing source registries (`deepMedia`, influence archive, platform archive, web discovery, connected social feed). Presentation changes must not mutate evidence status or canonical URLs. Media components handle `image → fallback → editorial placeholder` deterministically.

## Error Handling

- External image failure: switch to explicit local fallback.
- Live/social source failure: retain readable source record and link metadata.
- Missing source visual: show a designed non-evidence editorial object, clearly labeled.
- No broken layout holes.

## Testing / QA

Visual QA and E2E must cover:
- Desktop and mobile language switcher geometry.
- No overlap in fixed navigation.
- 30-record archive visibly contains source imagery where available.
- Failed source images produce meaningful fallbacks.
- Seven chapters remain in sequence and reflection continues to the next logical chapter.
- Relationship statuses remain truth-safe.
- Hebrew RTL plus English/Russian LTR.
- Reduced motion and keyboard/focus behavior.

## Release Strategy

1. Implement on isolated rebuild branch / AppDeploy snapshot.
2. Visual QA against rendered desktop and mobile screenshots.
3. Fix by screenshot evidence, not by prose review.
4. E2E green.
5. Promote only after the visual and functional gates pass.

## Success Criteria

A visitor should understand within one screen that 7YA is a living, source-backed world around Igor and what he does. During scrolling, there should be no long generic region where neither Igor, a source artifact, a meaningful service/action visual, nor a creation/research object is present. The archive should feel like years of public output, not a database rendered as text.