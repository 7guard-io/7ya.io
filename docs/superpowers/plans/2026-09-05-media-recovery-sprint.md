# 7YA Media Recovery Sprint — Implementation Plan

Date: 2026-09-05

## Task 1 — RED contract
Reconcile `tests/tests.txt` so the existing media visual test also requires a public `/media-registry.json`, three visible/playable 103FM moments, and the StartOn evidence/concept boundary. Verify it fails before production code because `/media-registry.json` does not yet exist on the custom domain.

## Task 2 — Shared recovered-media model
Create `shared/recovered-media.ts` with the three published 103FM records and explicit provenance/layer/range fields. Keep stable Descript share URLs only.

## Task 3 — Backend registry
Add `GET /api/media-registry` in `backend/index.ts` for AppDeploy client transport, and generate `/media-registry.json` during the existing static-page build step for crawlers/AI/custom-domain reads. Return recovered records plus a bounded projection of other playable audio/video public records internally; the public static file contains the stable recovered layer and its provenance policy. Keep health/feed/release behavior unchanged.

## Task 4 — Media UX
Add a MediaPage recovered-broadcast section fed from `/api/media-registry` with a deterministic local fallback to the shared recovered records. Make all three moments visible without search and open them in a playable/public source surface. Add minimal CSS consistent with the existing editorial media page.

## Task 5 — StartOn evidence boundary
Add a concise source/evidence note to `/starton/` distinguishing documented footage/sources from conceptual room/model language. Do not add the old AI concept video to public evidence.

## Task 6 — Canonical internal links
Replace edited legacy internal `?page=media|speaker|starton` links with canonical path URLs where they are produced by Bro Chat/public surfaces. Keep query support for old inbound links.

## Task 7 — GREEN + live verification
Run AppDeploy build/e2e/QA. Check `/media-registry.json`, `/static-health.json`, `/feed.json`, `/release.json`, internal SDK health/media-registry transport, `/media/` and `/starton/`. Run mobile/desktop visual acceptance for media and StartOn. If QA fails, inspect the exact run before changing code. Do not declare fixed until the custom domain is verified live.
