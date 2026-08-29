# 7YA LinkedIn Impact Discovery v1 — Production Receipt

Date: 2026-08-29
Production app: AppDeploy `697a008fddc309b142`
Applied production snapshot: `1788005385311`
Discovery release: `discovery-library-20260829-linkedin-impact-1`
Public projection release: `public-projection-20260829-linkedin-impact-1`

## Scope

This release extends the existing evidence-first Public Discovery layer with five newly resolved owner-authored LinkedIn source records. They remain Discovery/non-canonical records and do not publish unsupported reach, impression, or cross-platform aggregate metrics.

## Newly ingested LinkedIn discovery nodes

- `7069590395591999489` — becoming a father young — 2023-05-31.
- `7240289437606150145` — public service, policing and civic leadership — 2024-09-13.
- `7002699174827732992` — childhood, education and the StartOn mission — 2022-11-27.
- `6965163606975893504` — StartOn origin manifesto / “כן, אני — נער בסיכון” — 2022-08-16.
- `7032741993038372864` — fatherhood and presence — 2023-02-18.

The already-present public-service / police LinkedIn seed remains in place and was not duplicated.

## Evidence discipline

- New records are `WORLD-DISCOVERY`, not verified Canon.
- Public HTTPS source URLs are retained.
- No comment count was converted into reach or impressions.
- No synthetic unique-reach total was created.
- Existing Canon-over-Discovery URL precedence and projection dedupe remain unchanged.
- Existing evidence-first ingestion, V5 graph, Meta owner-authorized metrics, NVIDIA orchestration and human-approval policies remain unchanged.

## TDD / verification

- A release-gate acceptance test was first changed to require the StartOn origin LinkedIn source in Public Discovery without silent canonical promotion or invented reach.
- Source inspection before the production change confirmed activities `6965163606975893504`, `7002699174827732992`, `7032741993038372864`, `7069590395591999489`, and `7240289437606150145` were absent from the active `backend/index.ts` world-discovery seeds.
- AppDeploy green deployment reached `ready`.
- Fresh AppDeploy status after deployment: 0 frontend errors and 0 backend errors.
- Source readback on snapshot `1788005385311` confirms all five activity ids and both new release markers are present.
- `e2e_tests` was `null`; no automated E2E PASS is claimed.
- `npm run ci:local` could not be executed in the available container because DNS resolution for `github.com` failed before repository clone. No local-CI PASS is claimed.

## Source-of-truth / GitHub safety

Production truth remains the AppDeploy live snapshot. The current production release endpoint and the prior deployment receipt both classify alignment as:

`APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT`

Therefore the live AppDeploy source tree was not replaced from GitHub `main`. Doing so would risk rolling production back to a partial/stale source tree. This receipt is committed to `main` as the auditable GitHub record of the production change; a full source synchronization still requires an atomic export/reconciliation of the complete AppDeploy tree before GitHub can safely resume as deployable source of truth.
