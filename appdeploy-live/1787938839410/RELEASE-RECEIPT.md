# 7YA Cinematic Personal OS — Production Release Receipt

Date: 2026-08-28
Production app: AppDeploy `697a008fddc309b142`
Production snapshot: `1787938839410`
Release marker: `7ya-cinematic-os-20260828-v1`
Canonical domain: `https://7ya.io/`
Immediate rollback snapshot: `1787938474434`

## Delivered product changes

1. **Cinematic home** — the homepage now presents six curated life scenes, then `Media Front Door`, then the deeper Impact layer. The full documentary remains available through Museum and the Living Archive.
2. **Focused public rooms** — redundant global continuity wrappers were removed from Media, Museum, Research, Evidence, Library, Speaker and Music. Each room retains its own page content, source relationships, GlobalNav and StoryCompanion. StartOn keeps its dedicated documentary shell.
3. **SEO and first-paint synchronization** — the crawlable root first paint now matches the live Cinematic Personal OS headline and two-action mobile contract; release markers were unified; the hero image is preloaded; Media and Research received conservative `CollectionPage` JSON-LD; refreshed routes use `2026-08-28` sitemap freshness; `llms.txt` identifies the current public experience.
4. **Mobile and performance hardening** — the first fold remains Igor-first with exactly two primary mobile actions, the Impact layer has reduced mobile visual weight, and deep Impact sections use deferred rendering semantics where supported.

## Verification

AppDeploy terminal deployment status: `READY`.

Runtime QA for the applied release:

- frontend errors: `0`
- backend errors: `0`
- network errors: `0`

Source readback confirmed:

- `public/release.json` → `7ya-cinematic-os-20260828-v1`
- root static headline → `חיים אמיתיים. השפעה שאפשר לראות.`
- root first-paint actions → Story + Evidence
- `ProfilePage.dateModified` → `2026-08-28`
- Media `CollectionPage` JSON-LD present
- Research `CollectionPage` JSON-LD present
- refreshed sitemap entries → `2026-08-28`
- current Cinematic Personal OS line present in `public/llms.txt`

Generated AppDeploy QA screenshots exist for this release. This receipt does **not** claim a separate manual pixel-perfect visual PASS because the screenshots were not independently inspected in this runtime.

## Source-of-truth boundary

This directory is a **ledger-only production receipt**. It is not a complete AppDeploy source export.

GitHub `main` does not currently contain the complete atomic source tree or a reconstructable modern base snapshot for production `1787938839410`. Therefore:

- AppDeploy snapshot `1787938839410` remains the authoritative runtime source.
- GitHub is the canonical release ledger and design/plan history, not yet a complete production source mirror.
- Do **not** deploy stale GitHub runtime files over production.
- A future reconciliation must export the complete AppDeploy source atomically, verify build/runtime behavior, and only then mark GitHub runtime source as deployment-safe.

## Operational note

No CI PASS is claimed by this receipt. Runtime READY/QA and repository CI are separate evidence classes.
