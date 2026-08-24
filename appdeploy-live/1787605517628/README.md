# 7YA AppDeploy production release — 1787605517628

Status: **READY**

Canonical domain: `https://7ya.io/`
Production app: `697a008fddc309b142`
Release marker: `7ya-production-truth-20260824-8`
Rollback snapshot: `1787593119754`

## Master rebuild delta

This snapshot replaces the conflicting warm editorial cutover with one scoped cinematic visual governor for the Igor-first homepage. The canonical corpus and evidence machinery remain intact.

Applied changes:

- dark cinematic portrait-led hero with a single authentic Igor image;
- explicit HE / EN / RU hero entry to **Digital Igor**;
- restored visible `GENERATIVE STORY · CANON ROUTES · LIVE` entry;
- `100 MOMENTS` remains corpus-driven and now states **up to 100** real unique public entrances rather than implying invented completeness;
- all seven source-linked documentary archive rail slots are visible again instead of only slot 0;
- 100 Moments atlas changed from repeated multi-column card grid to a horizontal film-strip interaction;
- release/build markers synchronized to `7ya-production-truth-20260824-8`;
- HTML publication bootstrap and service-worker cache namespace bumped to `v108-master` so old 7YA caches are invalidated;
- release metadata explicitly preserves VERIFIED / SELF-REPORTED / INFERRED / UNKNOWN boundaries and forbids unverified aggregate-impact claims.

## Verification performed

AppDeploy terminal state after the visible rebuild: `ready`.

Frontend errors surfaced by AppDeploy: `0`.
Backend errors surfaced by AppDeploy: `0`.

Post-deploy applied-source readback confirmed the new visual governor, Digital Igor copy in Hebrew/English/Russian, 100 Moments evidence-safe copy, release marker, HTML cache bootstrap, service-worker version and public release metadata together in snapshot `1787605517628`.

The current AppDeploy harness did not return an E2E run or QA screenshot artifact (`e2e_tests = null`, `qa_snapshot = null`). Therefore this record does **not** claim pixel-perfect independent visual PASS.

## Source-control boundary

The historical GitHub `main` application tree predates the React/AppDeploy runtime. This release records the exact immutable runtime snapshot and the exact master visual governor in GitHub without partially overwriting the incompatible legacy tree. Full runtime-tree reconciliation remains separate from the production cutover.
