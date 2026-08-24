# 7YA Generative Page Composition — Production Release

Date: 2026-08-24
Production app: AppDeploy `697a008fddc309b142`
Canonical domain: `https://7ya.io`
Final applied snapshot: `1787556339952`
Release marker: `7ya-production-truth-20260824-6`

## Visible production change

The home hero now contains a visible `GENERATIVE STORY · CANON ROUTES · LIVE` entry. It opens a session-only full-screen `GENERATED STORY · CANON ONLY` experience composed from the existing verified public Canon.

The generated experience is not arbitrary LLM HTML and does not create new biographical facts. It reuses deterministic Story Path mappings and hydrates them from Canon records. Each scene carries canonical ID, mapped section, year, localized title/summary, trust state, public source and canonical media where available. Missing/failed media falls back to a typographic source poster rather than generic or AI imagery.

## Interfaces

- `GET /api/story-path?q=&lang=`
- `GET /api/story-composition?q=&lang=`
- `POST /api/companion` can return both `storyPath` and `storyComposition`.
- Direct session route: `?story=compose&storyQuery=...`
- Persistent Story Path HUD exposes `COMPOSE` after a composition exists.
- Closing the full-screen route restores the prior scroll position.

## Publication incident and repair

The first composition deploy reached AppDeploy READY but was partially applied: backend/StoryCompanion/overlay CSS landed while the visible hero entry and HTML/service-worker release bump did not. READY alone was therefore insufficient evidence of a coherent release.

The rollout was repaired in two smaller deployments and every critical file was then read from the applied snapshot rather than inferred from deployment status.

Final applied snapshot `1787556339952` was verified to contain all of the following together:

- backend release `7ya-production-truth-20260824-6`;
- `GET /api/story-composition` and deterministic CANON_ONLY composition builder;
- full-screen `GENERATED STORY · CANON ONLY` UI and styling;
- home hero `GENERATIVE STORY · CANON ROUTES · LIVE` entry and responsive styling;
- HTML `7ya-release` / `7ya-build` = `7ya-production-truth-20260824-6`;
- one-time publication bootstrap `7ya-publish-20260824-v103`;
- service-worker cache namespace `7ya-world-gateway-20260824-publish-v103`.

Both `7ya.io` and `www.7ya.io` remained ACTIVE on the AppDeploy v2 proxy after the final deployment.

## QA boundary

AppDeploy terminal status after the final deployment was READY with zero surfaced frontend/backend runtime errors. The AppDeploy environment still exposes no E2E run for this version (`e2e_tests` is null), so this release must not be described as E2E-green. The application includes a canonical-domain `story` live visual-acceptance route, but this execution harness could not directly invoke the public API URL; therefore no independent pixel-perfect PASS is claimed here.

A key release rule from this incident: deployment READY is necessary but not sufficient. For production changes, verify the intended visible marker, backend release marker, HTML bootstrap and service-worker version from the applied AppDeploy snapshot before declaring publication coherent.