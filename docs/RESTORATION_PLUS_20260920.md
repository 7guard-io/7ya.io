# Restoration+ production receipt — 2026-09-20

## Scope

Restoration+ is applied to the canonical static homepage without replacing the existing 7YA public corpus.

- Igor remains the first-fold subject.
- Visual system: black/graphite, warm white, acid green `#8CFF00`.
- First-fold order: Igor → StartOn → 7YA.
- Real portrait retained: `/assets/igor-home-portrait-20260712.webp`.
- Real first-person voice/video retained: `https://www.youtube.com/watch?v=fxFAUrb1h0M`.
- Visible acceptance gate added.
- Existing storyflow, public archive, source links, SEO and localized routes remain in place.
- Restoration+ stylesheet is whitelisted into the governed static artifact.
- Authored Restoration+ sections are protected from visitor-label humanization before localization.
- Restoration+ visitor copy has explicit EN/RU/AR translations.

## Source state

Canonical implementation head before this receipt:

`de4b0737a6aac6fa51e5faed44b281894fd3a08e`

## Production gate

Do not mark the release fixed until the Cloudflare Pages check succeeds for a commit containing the source state above and the public site serves:

- `data-restoration-plus="hero"`
- `/styles/restoration-plus-20260920.css`
- release meta `7ya-content-os-20260920-v21-restoration-plus`

The existing public corpus must remain present after deployment.
