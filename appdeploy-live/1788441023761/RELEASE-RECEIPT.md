# 7YA production receipt — 2026-09-03

AppDeploy app: `697a008fddc309b142`
Applied snapshot: `1788441023761`
Previous applied snapshot: `1788440442977`
Canonical domain: `https://7ya.io/`
Release marker: `7ya-bulk-repair-20260903-v4`

## Root causes repaired

1. Legacy companion CSS and JavaScript were still loaded by the root document after the React Bro Chat bundle. They used `!important` mobile overrides, old red source-link styling, DOM mutation and video-post-processing that could visually override or compete with the new Bro Chat experience.
2. User-facing homepage/impact CTAs still contained the retired `Digital Igor` name while the active product is `Bro Chat`.
3. Release identity had drifted across layers: frontend reported Bro Chat motion v3, backend still reported Bro Chat v1, and static first-paint/release metadata still reported the language-first-paint v10 marker.
4. Homepage/en/ru sitemap freshness markers had not been updated for the current production cut.

## Production delta

- Removed `/companion-growth-mobile.css` from the root HTML and deleted the file.
- Removed `/companion-growth-polish.js` from the root HTML and deleted the file.
- Replaced user-facing `Digital Igor` CTA copy with `Bro Chat` in `DocumentaryHome` and `ImpactFrontDoor` for HE/EN/RU.
- Unified `src/App.tsx`, `backend/index.ts`, root static metadata, EN/RU static pages and `public/release.json` on `7ya-bulk-repair-20260903-v4`.
- Updated the root cache/service-worker bootstrap marker so stale browser shell state is invalidated.
- Updated `/`, `/en/` and `/ru/` sitemap `lastmod` to `2026-09-03` to signal the refreshed static-first surfaces.
- Reconciled the existing mobile sanity and language first-paint QA specifications to cover Bro Chat branding, BUILD/DECIDE/DO/SAVE, device-local resume, absence of legacy styling and unified `/api/release` identity.

Internal compatibility anchors such as `POST /api/igor`, `#digital-igor` and `igor-deep` were deliberately not removed without dependency mapping.

## Fresh verification

AppDeploy terminal state after snapshot `1788441023761`: `READY`.
QA after deployment: `0 frontend errors`, `0 backend errors`, `0 network errors`.

Post-deploy source inspection on the applied snapshot confirmed:
- `Digital Igor` occurrences under `src/`: `0`.
- `7ya-bulk-repair-20260903-v4` is present in backend, root HTML, EN/RU static HTML and `public/release.json`.
- `public/**/*companion*` legacy override files: none remain.
- AppDeploy custom-domain configuration reports both `7ya.io` and `www.7ya.io` as `active` on the v2 proxy.

## Visual acceptance status

Do **not** label the custom domain visually FIXED from this receipt alone.

The runtime/source contract is repaired and AppDeploy QA is clean, but this execution environment could not independently fetch the custom-domain `/api/visual-acceptance` result or inspect the generated mobile/desktop screenshot pixels. The release therefore remains subject to a final live custom-domain mobile + desktop pixel gate.

## Source authority

This receipt records the production delta and applied snapshot. It is **not** a claim that GitHub contains a complete atomic export of snapshot `1788441023761`.

Runtime source of truth remains the AppDeploy snapshot until a complete source export is committed.

Do not deploy stale GitHub runtime files over production.
