# 7YA Restoration+ — Implementation Plan

**Goal:** Rebuild the 7ya.io homepage into the approved Igor-first living public record while preserving existing evidence/archive capabilities and route stability.

## Task 1 — Lock the homepage contract (RED)
- Modify `scripts/check-site.mjs` to require Restoration+ markers: `NOT FASHION. FORCE.`, `#7YA`, `THE RECORD`, seven indexed record doors, a dedicated social/viral surface, and music as a first-class homepage destination.
- Require the new stylesheet path `styles/7ya-restoration-plus-20260815.css`.
- Forbid legacy homepage visual signals that conflict with the approved system: gold gradient primary styling and pill-driven navigation classes in the new homepage contract.
- Run the site check and confirm it fails because the current homepage has not yet been rebuilt.

## Task 2 — Rebuild the homepage structure (GREEN)
- Replace the homepage editorial hierarchy in `index.html` while preserving metadata, canonical URL, structured data, verified source URLs, StartOn/evidence links, and accessibility shell.
- Hero: real Igor image, oversized name, #7YA signature, `NOT FASHION. FORCE.`, human line, minimal actions.
- Add `THE RECORD` seven-door indexed section.
- Surface source-backed public impact, social/viral publishing, music/culture, StartOn, evidence and create paths.
- Preserve independent-vs-owned publishing distinction.

## Task 3 — Unify visual system
- Create `styles/7ya-restoration-plus-20260815.css` as the single homepage design layer.
- Use near-black/warm-white/graphite + controlled acid green.
- Use square editorial geometry, thin rules, grotesk typography, monospaced metadata, strong negative space.
- Remove rounded-card/pill/glass/gradient visual language from the homepage.
- Ensure mobile 375px behavior, large-tap targets, no horizontal overflow, reduced-motion support.

## Task 4 — Minimal behavior
- Reuse or simplify existing navigation/progress/reveal script only where it remains valid.
- No heavy animation or decorative JS.
- Preserve accessible mobile menu state and reduced-motion behavior.

## Task 5 — Verify
- Run automated site contract locally/CI where available.
- Verify canonical routes and source links remain intact.
- Confirm one H1, responsive image behavior, and 375px overflow guardrail.
- Compare branch against `main` and inspect only intended files.

## Task 6 — Review and integration
- Open a draft PR from `restoration-plus-2026-08-15` to `main` with scope, screenshots/QA evidence when available, known gaps, and rollback note.
- Do not merge until visual QA passes on desktop and mobile.
