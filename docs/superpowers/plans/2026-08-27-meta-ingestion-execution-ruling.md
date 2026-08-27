# Meta Ingestion Execution Ruling — 2026-08-27

**Plan:** `docs/superpowers/plans/2026-08-27-meta-ingestion.md`

## Ruling
The available AppDeploy write action (`deploy_app`) updates the remote application snapshot and initiates deployment. This session does not expose a draft-only AppDeploy source editor. Because production application/promotion is explicitly gated behind the user's exact command `בצע את שרשרת הפריסה`, Tasks 1–7 are implemented and tested first as isolated release-candidate source on GitHub branch `feat/meta-ingestion-20260827` under `appdeploy-candidate/meta-ingestion-20260827/`.

AppDeploy remains read-only during candidate construction. The candidate files mirror their eventual AppDeploy target paths (`shared/...`, `backend/...`, `cron.json`, `tests/tests.txt`) so deployment can be a controlled file mapping rather than a redesign.

## Verification consequence
Pure TypeScript provider-neutral logic and adapters are tested locally before commit. AppDeploy-SDK-dependent routes, secrets, DB and cron integration can receive static/type/source checks in the candidate, but their platform runtime verification must wait for the explicit deployment chain, because invoking the only AppDeploy write tool would itself cross the release boundary.

## Safety boundary
- No `apply_app_version` or `deploy_app` before the explicit deployment command.
- No `appdeploy-live/CURRENT.json` movement before a new production version is actually applied and verified.
- No Meta secret values in GitHub, chat, fixtures or logs.
- Current production/rollback snapshot remains `1787823326631` until a later verified release.

**Cost if wrong:** candidate code may require a small AppDeploy-specific adjustment at release time, but the live site remains untouched and reversible. The alternative would risk changing production before the authorized release command.