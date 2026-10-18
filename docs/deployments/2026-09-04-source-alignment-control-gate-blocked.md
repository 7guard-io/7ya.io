# Source Alignment Control Gate — Deployment Blocked by Provider Limit

Date: 2026-09-04
Phase: A — Control and source alignment
Production app: `697a008fddc309b142`
Current AppDeploy version: `v93 / 1788453751783`

## Intended patch

The reviewed patch would:

- add a machine-readable `source_alignment_state=FAIL` contract;
- record `source_alignment_baseline_version=1788453751783` and target `GIT_RECONSTRUCTABLE`;
- add a non-destructive `/control/` overlay showing `SOURCE ALIGNMENT · FAIL` and `FAIL · DRIFT` on the GitHub connector;
- add a dedicated E2E acceptance test;
- preserve all public experience/backend behavior.

The contract test was exercised locally in a reconstructed minimal harness:

- RED: missing `public/release.json` produced `ENOENT` / exit 1;
- GREEN: after adding the release contract and overlay, `node scripts/check-living-life-control-plane.mjs` printed `PASS source alignment control contract` / exit 0.

## Deployment result

AppDeploy rejected the production update before creating a new snapshot:

`Lifetime deploy_app limit reached for the Free plan: 125/125 requests used.`

The provider explicitly reports that this lifetime limit does not reset and instructed not to call `deploy_app` again unless the account limit increases.

`get_app_versions` was checked after the rejection. No new deployable version exists; `v93 / 1788453751783` remains latest.

## Honest state

- Production runtime: `READY` on v93.
- New Control gate code: present on branch `spec/living-life-control-plane` / PR #324, not live.
- Source alignment: `FAIL`.
- Production write capability through current AppDeploy account: `BLOCKED_BY_PROVIDER_LIMIT`.
- Premium `/life/` implementation: must not depend on new AppDeploy deployments.

## Execution decision

Treat AppDeploy v93 as a rollback/read-only legacy runtime. Future writable production must be Git-first on a deployment provider that can accept new builds. Do not overwrite v93 from stale GitHub `main`; reconstruct the live source or build the new premium surface as an isolated Git-first deployment and switch traffic only after live visual acceptance.

## Rollback

No production mutation occurred, so no rollback was necessary. v93 remains the current live version.
