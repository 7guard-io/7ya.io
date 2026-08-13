# 7YA Runtime → Visual Source Map

Date: 2026-08-13
AppDeploy app: `697a008fddc309b142`
Applied runtime snapshot inspected: `1786644975015`
Canonical repository: `7guard-io/7ya.io`

## Current source-of-truth finding

The live AppDeploy runtime contains a React/Vite frontend source tree with `src/App.tsx`, `src/ConversionHome.tsx`, `src/GlobalNav.tsx`, `src/MuseumPage.tsx`, `src/MediaPage.tsx`, `src/StoryCompanion.tsx`, and the associated CSS modules.

The canonical GitHub `main` branch does not expose a matching `src/` tree and code search does not return the runtime build marker `7ya-personal-flagship-20260813-1` or `ConversionHome`. Therefore the currently applied visual runtime must be treated as **runtime-only / not yet reconciled to GitHub** until an exact source export is performed.

This does not make GitHub non-canonical; it means the current runtime has deployment-source drift that must be reconciled before final release acceptance.

## Runtime route/view map visible in `src/App.tsx`

| Public experience | Current runtime entry | Primary visual files |
|---|---|---|
| Home `/` | `ConversionHome` | `src/ConversionHome.tsx`, `src/conversion-home.css`, `src/FutureHero.tsx`, `src/future-hero.css`, `src/HomeMediaFlow.tsx`, `src/PostPortraitWall.tsx` |
| Museum / biography | `MuseumPage` | `src/MuseumPage.tsx`, `src/museum-page.css`, `src/IgorExperience.tsx`, `src/LifeArchive.tsx`, `src/LifeMapNavigation.tsx` |
| Media / social experience | `MediaPage` | `src/MediaPage.tsx`, `src/media-page.css`, `src/PlatformUniverse.tsx`, `src/MediaWall.tsx`, `src/DeepMediaLibrary.tsx` |
| Speaker | `SpeakerPage` | `src/SpeakerPage.tsx`, `src/speaker-page.css` |
| Blog | `BlogPage` | `src/BlogPage.tsx`, `src/blog-page.css` |
| Create | `CreatorPathPage` | `src/CreatorPathPage.tsx`, `src/creator-path.css` |
| Growth | `GrowthPathPage` | `src/GrowthPathPage.tsx`, `src/growth-path.css` |
| Diagnostics / integrity | `IntegrityPage` | `src/IntegrityPage.tsx` |
| Global navigation | `GlobalNav` | `src/GlobalNav.tsx`, `src/global-nav.css` |
| Global control | `SiteControl` | `src/SiteControl.tsx`, `src/site-control.css` |
| Conversational companion | `StoryCompanion` | `src/StoryCompanion.tsx`, `src/story-companion.css` |

## Shared content/media sources

- `src/content-registry.ts`
- `src/media-catalog.ts`
- `src/deep-media-data.ts`
- `src/HomeMediaFlow.tsx`
- `src/PostPortraitWall.tsx`
- `src/MediaWall.tsx`
- `src/DeepMediaLibrary.tsx`

## Applied runtime visual foundation candidates

- `src/index.css`
- `src/site.css`
- `src/locale.css`
- `src/global-nav.css`
- `src/v81-visual.css`
- `src/editorial-premium.css`

## Release marker observed in runtime source

`src/App.tsx` currently defines `release='7ya-personal-flagship-20260813-1'`.

## Implementation rule

Visual System v2 implementation may proceed against the applied AppDeploy runtime source because it is the source currently rendered to users, but final acceptance is blocked until the exact accepted runtime source is mirrored/reconciled into `7guard-io/7ya.io` and release markers agree across the public truth surfaces.
