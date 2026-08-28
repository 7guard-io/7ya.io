# 7YA Cinematic Personal OS v1 — Production Receipt

Date: 2026-08-28
Production app: AppDeploy `697a008fddc309b142`
Applied/latest production snapshot at receipt time: `1787938839410`
Release marker: `7ya-cinematic-os-20260828-v1`
Previous production snapshot / rollback: `1787938474434`
Canonical domains: `https://7ya.io/`, `https://www.7ya.io/`

## What changed

### Slice 1 — Cinematic homepage
- Home now renders a six-scene curated documentary path instead of requiring all fourteen chapters before the main media/proof transition.
- The full documentary remains reachable through Museum and Living Archive.
- `MediaFrontDoor` follows the curated story and precedes detailed Impact depth.
- Mobile hero hierarchy preserves exactly two first-fold actions: Story and Evidence.
- Mobile hero geometry, proof cue and Impact visual density were reduced.
- Deep Impact sections use `content-visibility:auto` to defer below-fold rendering work.

### Slice 2 — Focused public rooms
- Media, Museum, Research, Evidence, Library, Speaker and Music now use a focused App shell.
- Redundant global continuity layers are suppressed on those routes: Ninja, global Impact bar, Life Album spine, SiteControl, SceneEngine, Arsenal, global VisibleCorpus and ContextMachine.
- GlobalNav, each room's own content, StoryCompanion and the mobile dock remain.
- StartOn retains its dedicated documentary shell and embedded corpus without duplicate GlobalNav.

### Slice 3 — Static-first / SEO / release synchronization
- Runtime, root metadata and public release manifest now use `7ya-cinematic-os-20260828-v1`.
- Root static first paint now matches the cinematic live hero: `חיים אמיתיים. השפעה שאפשר לראות.`
- Root static first paint uses Story + Evidence as its two primary actions.
- `igor-hero.jpg` is preloaded for the root first paint.
- Root `ProfilePage.dateModified` is `2026-08-28`.
- Media static shell now includes conservative `CollectionPage` + `ItemList` JSON-LD using only source links already rendered on the page.
- Research static shell now includes conservative `CollectionPage` JSON-LD linking the existing Academia, Evidence and Library surfaces.
- Sitemap `lastmod` was refreshed to `2026-08-28` for materially changed core routes and their EN/RU variants.
- `llms.txt` now identifies the current Cinematic Personal OS experience while preserving the existing source policy.

## Verification evidence

- AppDeploy deployment status after Slice 3: `ready`.
- AppDeploy QA: 0 frontend errors.
- AppDeploy QA: 0 backend errors.
- AppDeploy QA: 0 network errors attributable to the candidate.
- `agent-mesh-hourly`: enabled; last observed status success; failure_count 0.
- `meta-sync-hourly`: enabled; last observed status success; failure_count 0.
- Source readback confirms the current release marker in `src/App.tsx` and `index.html`.
- Source readback confirms the cinematic root first-paint headline, Story + Evidence links, hero preload and `dateModified`.
- Source readback confirms Media/Research CollectionPage JSON-LD.
- Source readback confirms refreshed sitemap dates and LLM experience line.
- AppDeploy generated mobile and desktop QA screenshots. The current tool environment could not open the generated S3 screenshot objects, so no manual pixel-perfect visual PASS is claimed in this receipt.
- `e2e_tests` was `null`; no E2E PASS is claimed.

## Public-crawl cache observation

External crawler reads performed immediately after deployment continued to surface older cached static HTML even for the direct AppDeploy hostname. AppDeploy source readback and version ledger show the new snapshot and current files. Because the stale result appears on both the custom domain and direct AppDeploy URL, it is treated as external crawl/cache lag rather than evidence of a custom-domain routing failure. No immediate third-party recrawl timing is claimed.

## Custom-domain state

At verification time:
- `7ya.io` — active on AppDeploy stage `v2`.
- `www.7ya.io` — active on AppDeploy stage `v2`.

## Source-of-truth status

Production truth remains AppDeploy snapshot `1787938839410`.

GitHub `main` must **not** be deployed over production yet. The AppDeploy source contains more than 100 files in the first source listing page plus additional paginated files, including backend code, static routes and binary assets. The available AppDeploy connector exposes file-by-file source reads but no atomic full-snapshot export. A partial GitHub overwrite would be rollback-prone and is prohibited.

Source alignment remains:

`APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT`

A future reconciliation must export the complete live tree, preserve binaries, compare it against GitHub, create one atomic candidate commit/tree, run the canonical release gate, and only then restore GitHub as deployable source of truth.
