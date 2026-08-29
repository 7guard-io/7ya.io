# 7YA production convergence receipt — 2026-08-27

## Production authority
- AppDeploy app: `697a008fddc309b142`
- Active snapshot: `1787823326631`
- Delta base snapshot already mirrored in GitHub: `1787812752463`
- Canonical repository: `7guard-io/7ya.io`
- Sync branch: `sync/appdeploy-1787823326631-20260827`
- Custom domains: `7ya.io` and `www.7ya.io`

## What this convergence captures
This delta preserves the production work completed after the Impact Universe export: the chronological documentary homepage, Visual Director and Content Director passes, site-wide accessible light theme, 100 Moments chapter context, canonical story anchors, StartOn theme/SEO continuity, clean public-route navigation, static Search/Create entry points, PWA shortcuts/cache cutover, first-paint synchronization, sitemap/llms/SearchAction updates, and visual-acceptance route hardening.

## Narrative and media state
- Homepage opens with `Kharkiv → Jesse Cohen → Service → StartOn` rather than the former dashboard/trust-first first paint.
- Fourteen chronological documentary chapters precede Impact Universe.
- Chapters use one dominant media frame with compact secondary source continuation.
- First-person documentary voice and explicit retrospective-source notes are preserved.
- Each chapter can enter the Life Archive / 100 Moments with chapter context.
- Legacy dashboard story blocks remain hidden for rollback safety.

## Accessibility and continuity
- Site theme is centralized and persisted in local storage.
- First visit respects `prefers-color-scheme`.
- Light presentation covers the documentary, Impact layers, GlobalNav and major deep routes.
- `focus-visible`, reduced-motion and increased-contrast behavior is preserved.
- Life Album stops now target the new documentary anchors; NOW targets the visible final chapter.

## Routing, SEO and PWA
- Public navigation prefers clean routes such as `/library/`, `/media/`, `/music/`, `/search/`, `/create/` and `/research/`.
- Static route shims keep compatibility bootstrap behavior while advertising clean canonical URLs.
- Search and Create now have direct static entry points.
- JSON-LD SearchAction, sitemap and llms.txt point to the current public discovery architecture.
- PWA shortcuts point to 100 Moments, Media, StartOn and Create.
- The first-paint cache cutover marker is current to 27 Aug 2026.

## Impact boundary preserved
The Impact Universe contract remains unchanged from the base export: the widest cumulative exposure snapshot, source-resolved gross subset, interactions, publication instances, audience and geography remain separate metric classes. Cumulative snapshots are a time series and are not added together.

## Fresh runtime verification
- AppDeploy terminal state: `READY`.
- Runtime errors at the final QA snapshot: `0 frontend / 0 backend / 0 network`.
- Fresh desktop and mobile QA screenshot artifacts were generated.
- `7ya.io`: active.
- `www.7ya.io`: active.
- Applied-source readback confirmed the new narrative, theme, route, PWA and discovery source state.

## CI boundary — explicit
The canonical release command is `npm run ci:local`; the repository workflow `npm run release:gate` delegates to that same command. During this convergence the execution shell could not resolve `github.com`, so a local checkout could not be created. The repository CI workflow also documents that GitHub Actions is blocked at the account/organization level before runner startup. Therefore **no local-CI or GitHub-Actions PASS is claimed**. Production runtime/source QA is green, but it is not represented as a substitute for the blocked CI gate.

## Reconstruction
Treat `appdeploy-live/CURRENT.json` as the canonical pointer. Reconstruct this production source state by taking export `1787812752463` as the base and overlaying the files listed in `CUTOVER-MANIFEST.json` from `appdeploy-live/1787823326631/`.
