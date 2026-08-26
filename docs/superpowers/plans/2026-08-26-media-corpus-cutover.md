# 7YA Media Corpus Cutover — 2026-08-26

## Goal
Make existing public media objects render from one public projection instead of depending on live social OAuth, while keeping Canon / Discovery / Live provenance explicit and putting high-signal content first.

## Root cause confirmed
- AppDeploy production already has a unified `/api/public-projection` that merges canonical corpus, public register, discovery, world discovery, live feeds and graph objects.
- `PublicLibraryPage` and `HundredMoments` consume that projection, but `LiveSocial` still consumes `/api/social-feed` plus the small static `canonicalCorpusSeed`.
- Instagram, Facebook and TikTok live feeds are optional/credential-gated; historical public content must not disappear when those credentials are absent.
- GitHub Pages workflows are currently failing; AppDeploy is the active publication path. GitLab mirrors are not active deployment targets.

## Acceptance tests
1. Home social/media stream uses `/api/public-projection` as a historical/public fallback and live social only as an enrichment.
2. High-signal items rank before ordinary profile/source cards: video/broadcast and verified Canon first, then Discovery/Live, with recent date as a secondary signal.
3. At least 24 unique public objects can render in the home stream when the projection supplies them; each opens its original source.
4. Missing social OAuth does not make the public archive empty.
5. Image failure degrades to a source poster instead of a broken image.
6. `/library/` remains paginated and preserves Canon / Discovery / Live labels.
7. AppDeploy QA has no frontend/backend runtime errors after deployment.
8. The deployed AppDeploy source snapshot is exported to this canonical GitHub repo; GitLab remains a mirror/reference until an explicit sync strategy is established.

## Implementation
- Update `src/LiveSocial.tsx` to fetch `public-projection` alongside `social-feed`, convert eligible projection objects into feed cards, dedupe by canonical URL, rank high-signal records, and render a larger first shelf.
- Update `tests/tests.txt` to encode the projection-first behavior and no-OAuth fallback.
- Deploy through AppDeploy, poll to terminal state, inspect QA, and verify the live site.
- Export the changed AppDeploy files into a versioned `appdeploy-live/<version>/` snapshot on this feature branch, then open a PR to `main` rather than writing directly to protected `main`.
