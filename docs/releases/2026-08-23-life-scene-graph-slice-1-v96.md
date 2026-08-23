# 7YA Release Receipt — IGOR LIFE SCENE GRAPH Slice 1

**Date:** 2026-08-23  
**App:** `697a008fddc309b142`  
**AppDeploy version:** `v96` / `1787487585552`  
**Feature release:** `LIFE-SCENES-20260823-1`

## Scope shipped

- Added `shared/life-scenes.ts`: deterministic public Life Scene projection types/compiler.
- Added `backend/life-scenes.ts`: read-only scene/coverage payloads.
- Added routes:
  - `GET /api/life-scenes`
  - `GET /api/life-scenes/:id`
  - `GET /api/life-coverage`
- Added `src/life-scenes-client.ts` using `@appdeploy/client`.
- Replaced the primary hard-coded seven-scene source in `src/IgorSceneEngine.tsx` with API-driven scene projection.
- Retained a three-scene public-safe fallback only for API outage resilience.
- Preserved the existing Discovery relationship rail as non-canonical enrichment.
- Updated acceptance Test 3 to require dynamic scene projection, trust/provenance, multi-domain coverage and >7 eligible scenes.

## Trust / privacy invariants

- Canonical corpus v2 unchanged.
- Discovery is not promoted to canonical truth.
- Public scene projection requires at least one HTTPS public source.
- Private/restricted Drive material is not introduced into the public projection.
- No raw SRT archive or full transcript publication is introduced in Slice 1.
- No person-specific opinion is generated.
- No cross-platform aggregate reach is introduced.

## Verification evidence

- AppDeploy deployment status: `ready`.
- Fresh runtime error arrays after v96: frontend `0`, backend `0`, network `0`.
- Fresh AppDeploy QA snapshots generated for desktop and mobile at QA timestamp `1787487628345`.
- Source verification on v96 confirms `GET /api/life-scenes`, `GET /api/life-scenes/:id`, and `GET /api/life-coverage` are registered.
- Source verification on v96 confirms `IgorSceneEngine` imports and calls `fetchLifeScenes`; the old `const scenes:Scene[]` primary array is absent.
- Current canonical seed contains 26 `storyOrder` events; canonical source scan contains zero `http://` URLs. Because canonical scenes are not deduplicated away solely for sharing a source, the projection has a structural floor well above the former seven-scene ceiling before public-register enrichment.

## Verification limitation

The AppDeploy run returned `e2e_tests: null`; therefore this receipt does **not** claim that the natural-language E2E suite executed automatically for v96. AppDeploy did generate desktop/mobile QA screenshots, but this execution environment did not expose those image bytes to the visual-inspection tool, so pixel-level visual acceptance is not claimed here. Runtime/build/source gates are verified; visual/E2E acceptance remains a separate explicit gate.

## Next slice

Slice 2: resolve people, creators and relationship roles from public scenes so hosts, collaborators, publishers, distributors, institutions and operating partners emerge from evidence rather than manual seed cards.
