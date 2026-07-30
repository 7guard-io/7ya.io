# 7YA Media Impact — production contract

Release: `7ya-media-impact-registry-20260730-1`  
AppDeploy snapshot: `1785430271829`  
Published: 2026-07-30

This contract implements the evidence-first architecture defined for 7YA:

1. A canonical registry records platform, account, native metric, collection date, definition version and verification state.
2. An evidence chain separates public references from private owner exports and screenshots.
3. A publication gate exposes only claims that are safe and sufficiently sourced.
4. Views, followers, likes, reactions and site users are never merged into a fabricated cross-platform `total reach`.

## Current baseline

- 9 normalized metric records
- 6 public-safe claims
- 3 quarantined claims
- 25 mapped public surfaces
- 71 indexed archive records

Quarantined records remain in the internal registry but their numeric values are withheld publicly:

- TikTok leading-post metric — exact canonical post URL pending
- Instagram Reel metric — exact canonical post URL pending
- Facebook reaction metric — dated public snapshots disagree

## Public runtime interfaces

- `/api/media-impact`
- `/api/media-impact/summary`
- `/api/media-impact/:id`
- `/schemas/media-impact.schema.json`
- `/schemas/evidence-manifest.schema.json`
- `/influence/`
- `/evidence/`

## Acceptance state

AppDeploy returned terminal `ready`. Mobile identity rendering and the Media Impact claim-gate UI passed focused E2E QA with no frontend or backend runtime errors. The raw-JSON navigation test was classified as a bad test because the browser QA agent cannot type arbitrary URL paths; the endpoint contracts are therefore tracked here and in source.

## Source-alignment note

The AppDeploy snapshot is currently the runtime source of truth. This directory mirrors the stable contract into GitHub without pretending that the older `main` branch already matches the complete runtime bundle. Full source export and merge remain a separate controlled alignment operation.