# 7YA Impact Universe Counter cutover — 2026-08-27

## Production authority
- AppDeploy app: `697a008fddc309b142`
- Applied production version: `v98`
- Applied snapshot: `1787812752463`
- Pre-feature rollback snapshot: `1787811237155` (`v95`)
- Canonical repository: `7guard-io/7ya.io`
- Feature branch: `feat/impact-universe-counter-20260827`

## Counting principle
The impact system now starts from counting, not from a verification verdict. Every recorded exposure, interaction, distribution instance, audience signal and attributable external-publisher node is retained in its own metric class. Classification, overlap and deduplication happen after collection.

Snapshots of the same cumulative counter are treated as a time series and are never summed together. Views / impressions / reach remain exposure. Likes / comments / shares / saves remain interactions. Audience/network and publication inventory stay separate.

## Impact Universe now visible on the homepage
- `7B+` — highest recorded cumulative gross-exposure snapshot currently surfaced in the historical snapshot series; source label: Instagram `@igor.vepretski` indexed bio snapshot.
- `18,785,328` — ecosystem-inclusive gross already resolved to source-level nodes in the 20 Aug 2026 forensic census.
- `397M+` — interaction universe snapshot, kept separate from exposure: `290M+ likes + 82M+ shares + 25M+ comments`.
- `2,753+` — publication instances across four core platforms: `1,189 Instagram + 904 TikTok + 326 LinkedIn + 334 YouTube`.
- `1.5M+` — community-member snapshot; audience/network layer, not exposure.
- `47+` — countries recorded across distribution; geography, not reach.

## Cumulative gross snapshot series
The UI shows the historical cumulative series as `SNAPSHOT SERIES · NOT ADDITIVE`:
1. `310M+` — cumulative Instagram reach snapshot.
2. `5.1B` — total digital reach snapshot.
3. `6.2B+` — global reach snapshot.
4. `7B+` — cumulative reach snapshot.

These values are preserved as successive macro snapshots, not added to each other.

## Source-resolved layer retained below the macro counter
The existing Impact Broadcast remains intact below the new universe counter, including:
- `14,670,621` strict observed exposure floor.
- `353,829` visible engagement floor.
- Nawan external Short: `5.1M views / 82K likes / 717 comments`.
- 2011→2026 timeline.
- Fatherhood propagation route and other public-echo routes.
- Separate platform snapshots for TikTok, Instagram, Facebook, LinkedIn and YouTube.

## Boundary reconciliation
The former quarantine-style presentation was reconciled with the gross-first counting protocol. The boundary now reads `COUNT → CLASSIFY → DEDUP`; the historical 7B+/6.2B+/397M+ entries are displayed as macro snapshots rather than struck-through values.

## Fresh verification
- AppDeploy final status: `ready`.
- Runtime errors: `0 frontend / 0 backend / 0 network`.
- Fresh desktop and mobile QA screenshot artifacts were generated for the final build.
- Applied-source grep confirmed the homepage imports and renders `ImpactUniverseCounter`.
- Applied-source grep confirmed `7B+`, `18,785,328`, `397M+`, `2,753+`, `1.5M+`, `47+`, `310M+` and `6.2B+` in the active production snapshot.
- `tests/tests.txt` contains the new Impact Universe acceptance contract and exactly one `[sanity]` marker.
- `7ya.io` and `www.7ya.io` both reported `active` on the AppDeploy v2 custom-domain routing check after the cutover.

## Verification boundary
AppDeploy returned `e2e_tests: null`; no automated E2E PASS is claimed. QA screenshot URLs were produced, but no manual pixel-perfect PASS is claimed unless the image pixels are directly inspected. Build/runtime/source/test-contract/domain-routing verification is green.
