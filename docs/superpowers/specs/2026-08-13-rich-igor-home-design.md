# Rich Igor Home Design

## Goal
Turn the 7YA homepage from a sparse gateway into a premium documentary/content experience that visibly features Igor Vepretski through real portraits, verified video thumbnails, press, social content, music, StartOn and evidence without sacrificing speed, clarity or modularity.

## Product shape
1. Keep the Igor-first hero and Digital Igor primary action.
2. Add a cinematic media mosaic in the hero using the existing Igor portrait plus verified video thumbnails.
3. Add a featured media rail with image-first cards sourced from the existing verified `deepMedia` catalog.
4. Add a two-video featured section with lazy YouTube embeds.
5. Add modular visual story bands for StartOn, public voice and music/creation using existing controlled assets.
6. Preserve the proof/evidence, Digital Igor and conversion sections, but make them visually richer and subordinate to the content story.

## Content policy
- Reuse existing controlled images under `public/resources/` and verified media records already present in the deployed app.
- Prefer YouTube thumbnails for video cards; fall back to controlled local assets.
- Every media card opens its canonical source.
- No fabricated metrics, screenshots, partnerships or claims.
- Avoid private family/minor material.

## UX requirements
- Mobile-first; no horizontal overflow.
- Fast first paint; hero image remains local and eager, embeds/images below fold are lazy.
- Content-first hierarchy: Igor → proof/content → StartOn → Digital Igor → action.
- Hebrew/English/Russian shell remains intact.
- New homepage modules are reusable and data-driven from `deepMedia`.

## Success criteria
- First two screens visibly contain Igor imagery plus multiple real media thumbnails rather than only text and links.
- At least six rich media cards appear on the homepage.
- At least two playable video embeds appear below the fold.
- Existing Digital Igor and language-switch behavior remain functional.
- AppDeploy QA remains free of frontend/backend/network errors and the homepage sanity test passes on mobile.