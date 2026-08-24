# 7YA AppDeploy production release — 1787608460438

Status: **READY**

Canonical domain: `https://7ya.io/`
Production app: `697a008fddc309b142`
Release marker: `7ya-production-truth-20260825-1`
Cache namespace: `v109-fullbleed`
Immediate rollback snapshot: `1787608267034`

## Visible cutover

This release fixes the homepage regression where the 2026-08-24 visual governor converted the portrait-led biography into a dense 50/50 split-screen archive interface.

Applied production changes:

- restores one full-bleed authentic Igor portrait as the first viewport;
- overlays IGOR VEPRETSKI, first-person copy, Story / Atlas / Digital Igor actions and Generative Story on the same cinematic visual field;
- restores the editorial `MY PUBLIC LIFE · 100 MOMENTS` bridge as the second act instead of hiding it;
- keeps the source-linked 100 Moments atlas and horizontal film-strip behavior;
- keeps technical graph/platform/evidence machinery deferred behind `SYSTEM · EVIDENCE ON DEMAND`;
- preserves HE / EN / RU behavior;
- bumps frontend, backend and public release markers to `7ya-production-truth-20260825-1`;
- bumps browser cache bootstrap and service-worker namespace to `v109-fullbleed` so old 7YA caches are invalidated.

## Verification

AppDeploy terminal status after cutover: `ready`.
Frontend errors surfaced by AppDeploy: `0`.
Backend errors surfaced by AppDeploy: `0`.
Both `7ya.io` and `www.7ya.io` custom-domain records were rechecked as `active` after deployment.
Applied-source readback from snapshot `1787608460438` confirmed the full-bleed recovery CSS, visible 100 Moments bridge and new release/cache markers.

The AppDeploy harness returned no independent E2E run or QA screenshot artifact (`e2e_tests = null`, `qa_snapshot = null`). This receipt therefore records deployment/source verification and does not claim independent pixel-perfect visual QA.

## Source-control boundary

The historical GitHub `main` application tree still predates parts of the active React/AppDeploy runtime. This receipt preserves the exact production snapshot identity and cutover intent without pretending that full runtime-tree reconciliation has already been completed.
