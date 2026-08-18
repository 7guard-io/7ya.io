# 7YA AppDeploy v100 — canonical visual-memory stabilization receipt

Date: 2026-08-19 (Asia/Jerusalem)
AppDeploy app: `697a008fddc309b142`
Ready runtime version: `1787088330473` (`v100`)
Previous runtime carrying the visual QA run: `1787087873168` (`v98`)

## Production state

AppDeploy reported the current runtime `ready` with no frontend or backend runtime errors in the final status check. Both custom hostnames, `7ya.io` and `www.7ya.io`, were reported `active` immediately after the release.

## Stabilization implemented

The production `src/PostPortraitWall.tsx` is corpus-driven rather than a hard-coded repeated post wall. The opening visual set is ordered from distinct canonical event ids, deduplicates both event ids and image URLs, requires a public source, and fails closed to a source-linked card if an image cannot be displayed. It does not substitute a generic portrait or AI simulation as event evidence.

The opening canonical ids in the ready v100 runtime are:

1. `service-field-2011-2021`
2. `starton-return-2022`
3. `fatherhood-viral-2023-02-20`
4. `public-voice-2023`
5. `twenties-retrospective-2024`
6. `identity-longform-2024`
7. `life-music-2025`
8. `7ya-now-snapshot-2026`

The wall fetches `fetchCanonicalCorpus(100, 'archive')`; verified metrics are read only from the dated `7ya-now-snapshot-2026` event and only when `verification === 'verified'`.

## Visual regression evidence

AppDeploy E2E job `be0cb99b-e6d4-413c-8dd8-bc0bb1f03ac0` in QA run group `32acf098e18ea4c6` passed on mobile against runtime version `1787087873168` after the canonical wall implementation was present. The agent verified that the first eight cards included distinct service, StartOn, fatherhood, public-voice, retrospective and creation moments, while the adjacent repeated fatherhood cards `תודה רבה לכולם` and `הסיפור ממשיך בתוך התגובות` were absent. It then switched to English and measured `page_horizontal_overflow_px = 0`.

The final ready v100 runtime was re-read after deployment and contains the same canonical/deduplicated `PostPortraitWall` implementation. AppDeploy's final v100 status returned `ready`; its automatic final snapshot did not attach a new E2E run id, so this receipt does **not** misrepresent the v98 visual run as a distinct v100 E2E execution.

## Safety evidence

The same QA group passed the fail-closed canonical-evidence test: when `/api/corpus` was deliberately faulted with HTTP 500, Public Action / Echo showed `EVIDENCE SAFETY` and did not expose the quarantined hard-coded `213K` or `14K` values.

## QA runner limitation observed

Three broader agent tests in the intermediate five-test suite were skipped only after the QA worker exceeded its 300-second orchestration limit. They did not report application failures. To avoid conflating an agent-navigation timeout with a production regression, the release was verified from the ready runtime source/status and the focused visual/fail-closed E2E evidence above.

## Rollback

If a regression is discovered, the pre-stabilization runtime remains available in AppDeploy version history. Do not reconstruct production from stale root source; inspect the AppDeploy runtime snapshot first and reconcile deliberately.
