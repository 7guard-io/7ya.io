# 7YA Restoration+ — Design Specification

## Goal
Restore 7ya.io as Igor Vepretski's personal living public record: unmistakably personal, editorial, evidence-backed, culturally sharp, and visually coherent across desktop and mobile.

## Core proposition
**IGOR VEPRETSKI × #7YA🥷 — NOT FASHION. FORCE.**

7YA is not a SaaS dashboard, NGO brochure, generic portfolio, or AI-themed landing page. It is one person's evolving public archive and operating system: story, evidence, public work, music, media, StartOn, ideas, and creation.

## Visual DNA
- Base: near-black `#0B0B0C`, warm white `#E9E9EE`, graphite neutrals.
- Signal accent: controlled acid green `#8CFF00`.
- Typography: oversized neutral grotesk/sans; monospaced metadata.
- Photography: only real Igor/public-life assets already in the repository or verified archive. No synthetic Igor and no stock persona imagery.
- Graphic language: thin rules, timestamps, record IDs, square brackets, arrows, quotes, restrained industrial markers.
- Geometry: square/architectural; almost no rounded cards or pills.
- Motion: sparse micro-motion only, respecting reduced-motion.
- Each screen gets one deliberate visual disruption; otherwise strong negative space and editorial discipline.

## Information architecture
Homepage acts as an editorial index, not a complete archive.

1. HERO / PERSON — Igor first, full-screen real image, name, #7YA mark, short proposition.
2. THE RECORD — seven indexed doors into the universe.
3. PUBLIC IMPACT — curated independent coverage and source-backed work.
4. SOCIAL / VIRAL — real posts and documented high-impact publishing.
5. MUSIC / CULTURE — official music and clips as first-class creative work.
6. STARTON — separate social-impact mission, connected to Igor but not collapsed into his persona.
7. BUILD / CREATE — user entry point to turn experience into meaningful action.

Deep archive remains in dedicated routes such as evidence, museum/history, media, music, StartOn, and create.

## Homepage hero
Desired hierarchy:

IGOR
VEPRETSKI

#7YA🥷

NOT FASHION.
FORCE.

Secondary human line: `אדם → ראיות → פעולה → צמיחה.`

Metadata may include stable record-like labels such as `IGOR / 1990—NOW`, `ISRAEL / DIGITAL / CIVIC / CULTURE`, and `RECORD 001`, without implying unverifiable claims.

## Content rules
- Every meaningful public claim must link to a source, record, date, or evidence route.
- Owned publishing and independent coverage must be visually distinguished.
- Real media, music, clips, field photography, documents and archived posts outrank decorative illustration.
- Do not fabricate metrics, institutional relationships, political roles, reach, or endorsements.
- Keep Hebrew primary while preserving existing multilingual architecture.

## UX rules
- Desktop: editorial spread / campaign / dossier rhythm, no dense dashboard grid.
- Mobile: hero remains immediate; first real public record appears directly after hero/index; no horizontal overflow.
- Navigation must expose person, record/media, music, evidence, StartOn and creation without becoming a mega-menu.
- CTAs remain clear: know Igor, inspect evidence, contact/build.

## Technical strategy
- Work on isolated branch `restoration-plus-2026-08-15`.
- Preserve canonical routes, SEO, evidence datasets, privacy contracts and existing public-record functionality.
- Replace competing visual systems on the homepage with one Restoration+ stylesheet rather than stacking another override layer.
- Keep existing real image assets where appropriate.
- Use TDD: update site contract/checks first, observe RED, implement minimal HTML/CSS/JS, verify GREEN, then visual QA desktop + 375px mobile.

## Acceptance criteria
- First screen is unmistakably Igor Vepretski and #7YA, not a generic organization.
- `NOT FASHION. FORCE.` and Restoration+ visual markers are present.
- Acid green is a controlled signal accent, not decoration everywhere.
- No gradients-as-brand, card soup, glassmorphism, synthetic people, or fake metrics.
- Public posts/media/music are first-class and source-backed.
- Existing canonical evidence and archive routes remain reachable.
- No horizontal overflow at 375px.
- Reduced motion is respected.
- Automated site contract passes after implementation.
