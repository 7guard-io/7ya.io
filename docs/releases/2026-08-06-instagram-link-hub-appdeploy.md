# AppDeploy Receipt — Instagram Link Hub

**Date:** 2026-08-06  
**App ID:** `697a008fddc309b142`  
**Applied snapshot:** `1786013907958`  
**QA run group:** `20e3927dd8491c01`  
**Link-hub test job:** `4f1de3ed-2f8d-48ab-a71d-542f084ff75b`

## Scope

- Added the canonical mobile-first gateway at `/go/`.
- Added `/links/` as a redirecting alias.
- Added dedicated styling and a sitemap entry.
- Added a real anchor from the AppDeploy `/about/` trust route to `/go/` so the gateway is independently reachable through the UI.
- Preserved existing homepage and depth-page behavior.

## TDD and validation evidence

1. Acceptance coverage was moved into the active ten-test suite.
2. The pre-implementation run failed at Test 10 because `/go/` rendered no DOM.
3. An intermediate aggregate run was not accepted as proof because its detailed Test 10 did not traverse `/go/`.
4. The test was corrected to navigate through a real `/about/` anchor labeled `הקישורים הרשמיים`.
5. In the final run, Test 10 clicked the anchor, reached `/go/`, and verified the unique heading `הקישורים הרשמיים של איגור ופרצקי`, the line `אדם. שליחות. פעולה.`, and the Instagram, TikTok, YouTube, Facebook, X and LinkedIn links.
6. The final AppDeploy deployment reached `ready`; all ten E2E jobs succeeded and no frontend or backend runtime errors were reported.

## Known boundaries

- AppDeploy reported incomplete backend endpoint coverage: 3 of 16 declared backend endpoints were exercised. The new link hub is static and does not introduce or modify backend endpoints.
- The AppDeploy runtime is not an exact source clone of this repository; this PR records the source-control equivalent for review.
- Direct verification of `https://7ya.io/go/` from the available shell/web clients was blocked by DNS-resolution/indexing limitations. This does not prove custom-domain success or failure.
- The Instagram profile link itself has not been changed by this release.
- This branch must not be auto-merged. Human review and the repository release gate remain required.
