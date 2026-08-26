# 7YA production release receipt — final canonical homepage cutover — 2026-08-27

## Production authority
- Provider: AppDeploy v2
- App ID: `697a008fddc309b142`
- Applied snapshot: `1787780487071`
- Supersedes: `1787780308258`
- Canonical domain: `https://7ya.io/`
- GitHub canonical repository: `7guard-io/7ya.io`
- Safe export branch: `fix/homepage-canonical-cutover-20260827`

## Root cause
Production had accumulated repeated homepage replacements and overlapping presentation layers. The live AppDeploy source and GitHub repository also serve different roles: AppDeploy is the active production source while GitHub records/export snapshots. The cutover therefore fixes the live canonical homepage directly and records that state without introducing another homepage implementation.

## Final user-visible contract
- Root homepage is `DocumentaryHome` only.
- Hero uses local `./resources/igor-hero.jpg` first, declared at 960×1280.
- Mobile portrait stage uses 3:4 composition rather than a viewport-height crop.
- Hero exposes `Watch · impact first` and `Talk · Digital Igor` as primary actions.
- Featured visual cards open inside 7YA instead of navigating away immediately.
- Viewer supports embedded YouTube, Close, Previous, Next, visible source/evidence state and explicit Open Source.
- A distinct human-context section keeps family/life/public-story frames visible even when public-projection de-duplication replaces fallback IDs; viewer matching is URL-based.
- ImpactFrontDoor remains immediately after the hero with separate/non-unique evidence labels; no invented aggregate reach is introduced.
- Existing Library, Media, Research, StartOn and Digital Igor routes remain available.

## Verification evidence
Final AppDeploy deployment status: `ready`.
QA snapshot set: `1787780536022`.
Reported frontend errors: 0.
Reported backend errors: 0.
Reported network errors: 0.
The AppDeploy response did not provide an automated E2E execution (`e2e_tests: null`), so this receipt does not claim an E2E suite passed.

## Release boundary
No GitHub `main` merge and no GitHub CI deployment-chain trigger are part of this receipt. The validated production state is recorded on the feature branch.