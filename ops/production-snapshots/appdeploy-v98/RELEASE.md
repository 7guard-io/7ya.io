# 7YA production lock — AppDeploy v98

Date: 2026-08-15
AppDeploy app: `697a008fddc309b142`
Snapshot version: `1786773131762` (`v98`)
Production hostnames: `7ya.io`, `www.7ya.io`

## Production routing

Both production hostnames are active AppDeploy custom domains for the v2 stage. `7ya.io` uses the root-domain route and `www.7ya.io` uses the CNAME route.

## Release intent

Freeze the verified visual/public homepage before further feature work. The production homepage is intentionally curated rather than archive-like:

1. Personal Igor hero
2. `#posts-first` source-backed public-impact posts
3. Music & Clips
4. Igor / Evidence / StartOn route handoff
5. Curated media section — exactly 8 cards
6. Watch section
7. Personal growth gateway
8. One StartOn mission section
9. Closing action

The homepage must not reintroduce the old three-chapter block, repeated dossier / SEVEN DEFINING PUBLIC MOMENTS block, archive mosaic, duplicate `#digital-igor`, duplicate growth gateway, or duplicate StartOn mission section.

## Fresh release verification

AppDeploy QA run group: `a325d0207070f221`
Result: **8 / 8 E2E passed**
Frontend runtime errors: **0**
Backend runtime errors: **0**
Mobile `#posts-first`: **PASS**
Mobile navigation / overflow guardrail: **PASS**
Homepage curation / duplicate-section guardrail: **PASS**
StartOn creator-path handoff: **PASS**

Backend endpoint coverage is intentionally not represented as complete: 6 / 22 declared endpoints were exercised by this visual/product QA run (27.27%). That is a separate hardening track and must not be confused with visual release verification.

## Source-of-truth warning

At the time of this lock, the public GitHub repository `7guard-io/7ya.io` does not contain the current AppDeploy React source tree (`src/ConversionHome.tsx`, `src/home-simplify.css`, etc.). The live production source therefore diverges from GitHub `main`.

This snapshot folder preserves the critical v98 visual release files and QA contract while the repository/deployment source-of-truth is normalized. Do not deploy older GitHub code over production without first reconciling it against AppDeploy v98.
