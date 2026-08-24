# 7YA Master Autonomous Rebuild — Production Receipt

Date: 2026-08-24
Canonical domain: `https://7ya.io/`
Production provider: AppDeploy
App ID: `697a008fddc309b142`
Applied snapshot: `1787605517628`
Release: `7ya-production-truth-20260824-8`
Rollback snapshot: `1787593119754`

## Shipped

The visible homepage cutover was rebuilt around Igor rather than a generic 7YA dashboard. One scoped master visual governor now controls the cover and 100 Moments presentation. It uses a dark cinematic editorial language, a dominant authentic portrait, restrained accent color, real-media-first source treatment and mobile-specific composition.

The previous cutover had deliberately hidden the Generative Story entry, the floating companion and archive rails 1–6. This release restores the visible Generative Story entry and all source-linked archive rails. The floating companion remains suppressed on the homepage to prevent portrait/action overlap, while the hero action itself now says `Digital Igor` explicitly in Hebrew, English and Russian.

100 Moments remains generated from the canonical corpus, visual registry and Public Discovery layer with URL/image de-duplication and evidence-layer labels. Copy now says **up to 100** real public entrances so the interface does not manufacture completeness when fewer unique sources are currently available. The atlas is presented as a horizontal film strip rather than a repeated generic card grid.

Release integrity was also repaired: backend, frontend, HTML metadata, Journey metadata and release JSON now use one marker (`7ya-production-truth-20260824-8`); the HTML publication bootstrap and service-worker namespace were advanced to `v108-master` to invalidate stale 7YA caches.

## Verification

AppDeploy reached terminal `ready` with zero surfaced frontend/backend errors.

Applied-source readback from snapshot `1787605517628` verified the master CSS, HE/EN/RU Digital Igor labels, evidence-safe 100 Moments copy, release markers and cache versions after deployment.

The public `https://7ya.io/?lang=he` root was reachable in current web retrieval after deployment. The current external crawl also exposes the Igor-first life structure, 100 Moments, source-linked evidence/media layers and Digital Igor surfaces, although search-crawl text can lag the just-deployed CSS/cache generation and is not used as proof of pixel appearance.

## QA boundary

AppDeploy returned neither an E2E result nor a QA screenshot artifact for this release (`e2e_tests = null`, `qa_snapshot = null`). The source-level visual contract is satisfied, but this receipt intentionally does not claim an independent pixel-perfect screenshot PASS.

## Rollback

Revert production to immutable AppDeploy snapshot `1787593119754` if the new visual cutover regresses production.
