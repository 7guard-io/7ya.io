# 7YA production release receipt — canonical homepage cutover — 2026-08-27

## Production authority
- Provider: AppDeploy v2
- App ID: `697a008fddc309b142`
- Applied snapshot: `1787780308258`
- Canonical domain: `https://7ya.io/`
- GitHub canonical repository: `7guard-io/7ya.io`
- GitHub export branch: `fix/homepage-canonical-cutover-20260827`

## Root cause addressed
The live AppDeploy source and the GitHub repository are intentionally separate layers, with AppDeploy acting as production authority. Repeated homepage replacements plus overlapping mobile/home styling created split-brain behavior. The cutover keeps one live root homepage (`DocumentaryHome`) and changes that surface rather than introducing another home implementation.

## User-visible delta
- Mobile hero now starts with the local `./resources/igor-hero.jpg` asset declared as 960×1280 and displayed in a stable 3:4 stage before any remote fallback.
- The hero contains a primary `Watch · impact first` command and a primary `Talk · Digital Igor` command.
- Featured media cards open an in-site viewer instead of navigating away immediately.
- Viewer supports embedded YouTube, Close, Previous, Next, source/evidence layer and explicit Open Source.
- The route does not change while the viewer is open.
- A human-context section exposes distinct family/life/public-story frames before the current-work grid.
- ImpactFrontDoor remains directly after the hero and preserves separate/non-unique evidence labels rather than inventing aggregate reach.
- Existing Media, Research, StartOn, Library and Digital Igor routes were not replaced.

## QA evidence
AppDeploy returned terminal status `ready` after the cutover. The resulting QA snapshot set is `1787780356375`; frontend errors: none; backend errors: none; network errors: none.

## Release boundary
This receipt records the validated AppDeploy production snapshot on a feature branch. It does **not** merge or deploy GitHub `main`; the explicit GitHub CI/deployment-chain command remains a separate action.