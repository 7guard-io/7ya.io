# 7YA Visual System v2 — Design Specification

Date: 2026-08-13
Owner: Igor Vepretski / 7YA
Scope: Site-wide visual and content rebuild for 7ya.io
Status: Design approved in principle; implementation requires final owner review of this spec

## 1. Objective

Transform 7ya.io from a collection of informational pages into one coherent, premium, image-led digital experience centered on Igor Vepretski, his public work, media, StartOn, social presence, archive/evidence, and growth-oriented interaction.

The product must feel recognizably 7YA on every route, not like separate templates built at different times.

## 2. Product Principle

What the visitor sees is the primary acceptance criterion.

A page is not visually accepted merely because it renders, passes E2E, or returns 200. Every release must be inspectable in desktop and mobile form and judged on hierarchy, imagery, spacing, typography, responsiveness, RTL/LTR behavior, visual identity, and continuity with the rest of the site.

## 3. Recommended Approach

Use one site-wide visual system plus one content architecture.

This replaces page-by-page patching with shared rules for:
- typography
- spacing
- layout rhythm
- image treatment
- editorial cards
- navigation
- section transitions
- buttons and calls to action
- motion and hover states
- responsive behavior
- RTL/LTR handling
- visual proof/media components
- archive/evidence components
- conversational entry points

## 4. Visual Direction

7YA should feel cinematic, editorial, intelligent, personal, contemporary, and technically precise.

The visual language should use Igor's real images, videos, media appearances, public activity, social content, project imagery, screenshots, archive material, and StartOn assets as the main interface material. Stock imagery should not be used where authentic owned or published material exists.

The design should avoid repetitive generic card grids. Sections should vary in scale and composition while still belonging to one design system.

## 5. Global Rules

1. No visually empty sections.
2. No generic placeholder imagery when real Igor/7YA/StartOn media exists.
3. No repeated undifferentiated card grids across the site.
4. Mobile receives its own composition decisions; it is not simply compressed desktop.
5. Every major viewport should contain at least one clear 7YA identity cue.
6. Real media appears early, especially on homepage and biography surfaces.
7. Text-heavy pages must be broken with visual proof, pull quotes, timelines, stills, or interactive navigation.
8. Evidence and archive surfaces remain serious and legible while still visually designed.
9. Motion should support hierarchy, not create noise.
10. Existing content should be reused before new filler content is invented.

## 6. Route-by-Route Experience

### /
A strong personal hero followed immediately by a real-media, image-led editorial surface. The visitor should understand who Igor is, see proof, and then choose a path.

Primary content order:
- hero identity
- real media / posts-first
- current mission
- StartOn / 7YA
- selected public work and stories
- social proof and platforms
- growth/chat entry
- contact/conversion

### /igor-vepretski/
A visual narrative biography rather than a long static profile. Use timeline chapters, authentic images, key milestones, media references, service/public work, creative work, and project launches.

### /social/
A living social wall with visual platform identity, selected posts/video stills, recent/relevant content, and direct platform paths. Avoid a plain icon directory.

### /talk/
The flagship conversational experience. The visual design should feel like entering the digital Igor layer, with minimal distraction, strong personality, clear privacy framing, and high-quality onboarding.

### /pass/
A purposeful gateway/identity-access experience. It should look intentional and premium rather than administrative.

### /evidence/
A serious evidence interface with strong information hierarchy, source classification, timeline or filter affordances, and readable proof states. Visual restraint is appropriate here, but not visual neglect.

### /starton/
A distinct but related sub-brand experience showing the mission, spaces, youth opportunity model, partners/supporters only where sourced, implementation model, and real-world imagery.

### /contact/
A conversion page rather than a dead form. Separate paths for media, speaking, partnerships, StartOn, professional collaboration, and general contact.

### /radar/
A high-signal monitoring/data surface. Use dashboards, event cards, timelines, status markers, and strong density control. Avoid decorative visual noise.

### Other routes
All existing public routes must inherit the same typography, spacing, navigation, footer, image behavior, responsive standards, and identity system.

## 7. Content Strategy

Prioritize existing owned and published content in this order:
1. high-quality personal/public photos
2. media appearances and video stills
3. social posts with strong visual value
4. StartOn project imagery
5. screenshots/documents/evidence where contextually appropriate
6. selected archive artifacts
7. generated decorative visuals only when authentic material cannot serve the purpose

Content must not introduce unsupported reach totals, partnerships, academic authority, or privacy-sensitive material.

## 8. Component System

Create reusable visual primitives for:
- cinematic hero
- editorial media mosaic
- story chapter
- timeline milestone
- quote/proof block
- media appearance card
- social post card
- source/evidence record
- StartOn project module
- data/radar card
- CTA/conversion block
- chat gateway
- footer/navigation

Each component should expose content without forcing identical geometry everywhere.

## 9. Responsive System

Desktop and mobile must be reviewed independently.

Mobile priorities:
- larger visual lead card
- reduced simultaneous choices
- strong vertical rhythm
- no clipped overlays
- no horizontal overflow
- readable RTL Hebrew and LTR English/Russian
- touch targets suitable for one-handed use
- images cropped intentionally, not accidentally

## 10. Visual QA Loop

Every implementation batch follows:

build → desktop screenshot → mobile screenshot → visual review → correction → new screenshots

A batch is not visually accepted without inspectable screenshots showing the relevant section in both desktop and mobile contexts.

Visual review criteria:
- hierarchy
- authenticity of imagery
- visual density
- typography
- spacing
- contrast
- cropping
- responsive behavior
- consistency across routes
- brand recognizability
- no broken or generic-looking sections

## 11. Implementation Order

Phase 1 — foundation
- global tokens
- typography
- navigation/footer
- section spacing
- shared image/media behavior
- responsive shell

Phase 2 — flagship surfaces
- homepage
- Igor biography
- social
- talk

Phase 3 — mission and proof
- StartOn
- evidence
- radar
- pass
- contact

Phase 4 — long-tail routes
- apply system to remaining public pages
- remove obsolete one-off styles
- normalize responsive behavior

Phase 5 — final site-wide visual audit
- desktop and mobile route sweep
- cross-route consistency review
- image quality and fallback review
- RTL/LTR review
- final visual acceptance

## 12. Success Criteria

The redesign succeeds when:
- a first-time visitor can immediately identify Igor and 7YA visually
- authentic media appears near the top of the experience
- no critical route looks generic, empty, or like a legacy page
- all major pages feel like one product
- mobile feels designed, not compressed
- the site visibly represents Igor's long-term digital/public work rather than merely describing it
- every major release can be visually inspected before acceptance

## 13. Non-Goals

This phase does not require a full backend rewrite, new billing systems, new political claims, or speculative partnerships. Technical changes are only justified where they directly enable the visual/content experience or reliable visual QA.

## 14. Owner Decision

Recommended direction: one site-wide visual system plus unified content architecture.

Next step after owner review: produce an implementation plan that breaks the work into small, verifiable batches with screenshot-based acceptance criteria.