# 7YA production receipt — static-first locale repair — 2026-09-02

AppDeploy app: `697a008fddc309b142`
Applied snapshot: `1788355277047`
Rollback snapshot: `1788354918063`
Canonical domain: `https://7ya.io/`
Release marker: `7ya-cinematic-os-20260828-v1`

## Change

Static-first homepage localization repair.

- Added crawlable English homepage entry at `/en/`.
- Added crawlable Russian homepage entry at `/ru/`.
- Homepage English/Russian canonical URLs now use `/en/` and `/ru/`.
- Root hreflang entries now point to the clean locale paths.
- Locale initialization recognizes clean locale path segments before query/local storage.
- Homepage language switching uses `/`, `/en/`, `/ru/` rather than leaving `?lang=` on the homepage.
- Legacy root `?lang=en|ru` visits are forwarded to the clean locale homepage paths.
- Sitemap now advertises `/en/` and `/ru/`.
- Static-first hydration recognizes path locales.

## Verification

AppDeploy terminal state: `READY`.
QA after deployment: `0 frontend errors`, `0 backend errors`, `0 network errors`.

Search-engine indexing of the newly introduced clean paths is external and may lag deployment; this receipt records deployment state, not indexing completion.

## Source authority

This receipt records the production delta and applied snapshot. It does **not** claim a complete atomic source export of snapshot `1788355277047` exists in GitHub.

Runtime source of truth remains AppDeploy snapshot `1788355277047` until a complete source export is committed. Do not deploy stale GitHub runtime files over production.
