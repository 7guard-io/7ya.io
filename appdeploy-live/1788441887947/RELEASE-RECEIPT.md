# 7YA production receipt — bulk repair v5 — 2026-09-03

AppDeploy app: `697a008fddc309b142`
Applied snapshot created by this repair: `1788441887947`
Canonical domain: `https://7ya.io/`
Release marker: `7ya-bulk-repair-20260903-v5`

## Repaired in v5

- Unified global runtime/static release identity on `7ya-bulk-repair-20260903-v5` across frontend, backend, root first paint, EN/RU first paint, `release.json` and `static-health.json`.
- Migrated generic static routes still carrying the obsolete `7ya-media-corpus-20260814-1` marker to the current release while preserving purpose-specific release markers on specialized surfaces.
- Repaired `/integrity/`: route identity checks now validate HTTP/canonical/title/content/privacy independently, while the four global release surfaces remain strict v5 checks. This removes false FAILs caused by specialized routes having their own release markers or no route marker.
- Rebranded public conversation entry points to `Bro Chat` with explicit AI wording across `/talk/`, Igor profile, Contact, Pass, Radar, Social, StartOn, StartOn Rooms and Integrity.
- Removed the remaining `DIGITAL IGOR` conversation-entry label from `/talk/`.
- Removed an Instagram image override for `https://www.instagram.com/p/CoXykBwq3Zr/` because it referenced `/resources/approved-restream-CoXykBwq3Zr.jpg`, a file that was not present in the AppDeploy snapshot and was not found in the canonical GitHub repository. Safe source-poster fallback is preferred to an invented or broken asset.
- Reconciled `tests/tests.txt` after a parallel deployment had appended an invalid sixth test with a second `[sanity]` marker and literal escaped newlines. The suite is again five tests with exactly one sanity workflow.

## Verification performed after deployment

- AppDeploy terminal state: `READY`.
- AppDeploy QA: `0 frontend errors`, `0 backend errors`, `0 network errors`.
- Source grep confirms the obsolete generic release marker, missing restream asset reference, `DIGITAL IGOR`, `שיחה עם 7YA`, and `שיחה עם כלי 7YA` are absent from active public source.
- `tests/tests.txt` is a valid five-test suite with one `[sanity]` test.
- AppDeploy custom-domain configuration reports both `7ya.io` and `www.7ya.io` as `active` on the v2 proxy.

## Remaining acceptance boundary

Do **not** label the custom domain visually FIXED from this receipt alone. AppDeploy generated fresh mobile/desktop QA screenshots, but this execution environment still cannot independently retrieve/inspect those screenshot pixels or execute the custom-domain visual-acceptance endpoint. Runtime/source/static contracts are repaired; a final live custom-domain mobile + desktop pixel gate remains the only unproven completion condition.

## Source authority

This is a production receipt, not a complete atomic source export. AppDeploy remains runtime source of truth until the current applied snapshot is fully exported and reconciled into GitHub. Do not deploy stale GitHub runtime files over production.
