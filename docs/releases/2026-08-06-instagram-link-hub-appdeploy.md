# AppDeploy Receipt — Instagram Link Hub

**Date:** 2026-08-06  
**App ID:** `697a008fddc309b142`  
**Applied snapshot:** `1786013165368`  
**QA run group:** `195ffe2713c342b8`

## Scope

- Added the canonical mobile-first gateway at `/go/`.
- Added `/links/` as a redirecting alias.
- Added dedicated styling and a sitemap entry.
- Preserved all existing homepage and depth-page behavior.

## TDD evidence

1. Acceptance coverage was moved into the active ten-test suite.
2. The pre-implementation run failed at Test 10 because `/go/` rendered no DOM.
3. The implementation was applied and the AppDeploy deployment reached `ready` with the E2E suite reported as passed.
4. AppDeploy reported no frontend or backend runtime errors during the final run.

## Known boundaries

- AppDeploy reported incomplete backend endpoint coverage: 3 of 16 declared backend endpoints were exercised. The new link hub is static and does not introduce or modify backend endpoints.
- The AppDeploy runtime is not an exact source clone of this repository; this PR records the source-control equivalent for review.
- Direct verification of the custom-domain route from the available shell/web clients was blocked by DNS-resolution/indexing limitations. Do not treat that limitation as evidence that the custom domain failed or succeeded.
- This branch must not be auto-merged. Human review and the repository release gate remain required.
