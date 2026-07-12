# 7YA.IO Deployment Runbook

## Approved production path

- Repository: `7guard-io/7ya.io`
- Default branch: `main`
- Workflow file: `.github/workflows/pages.yml`
- Current workflow name: `Publish 7YA Redirect`
- Trigger: manual `workflow_dispatch`
- Target: GitHub Pages
- Domain: `https://7ya.io`

## Pre-deployment requirements

1. Confirm repository and default branch.
2. Confirm the production workflow file, name and target have not changed.
3. Read `docs/RELEASE_STATE.json`.
4. Check issue `#83` and other open blockers.
5. Confirm the intended commit is on `main`.
6. Review the final diff.
7. Run all available validations.
8. Record the previous known-good commit as rollback point.
9. Confirm the production artifact matches the current architecture.

## Current redirect validation

Before publishing the current production mode, verify:

- `CNAME` contains `7ya.io`.
- `index.html` points to the approved Digital Museum destination.
- `404.html` points to the same destination.
- The artifact contains `index.html`, `404.html`, `CNAME` and `.nojekyll`.
- No unrelated workflow is used.

## Publishing steps

1. Open GitHub Actions for `7guard-io/7ya.io`.
2. Select `Publish 7YA Redirect`.
3. Confirm the file is `.github/workflows/pages.yml`.
4. Run it manually from `main` only after validation.
5. Confirm the assemble, upload and deploy steps succeed.
6. Save the workflow run identifier and logs when available.

## Post-deployment verification

1. Open `https://7ya.io` in a clean browser context.
2. Confirm the redirect target is correct.
3. Test mobile and desktop.
4. Confirm no redirect loop occurs.
5. Confirm the live source reflects the intended redirect release.
6. Save screenshots and route results.
7. Archive commit, workflow result and rollback point.

## Full-site transition rule

If production changes from redirect-only mode to a full site, this runbook and `docs/RELEASE_STATE.json` must be updated in the same reviewed change before deployment. Future route requirements such as `/pass/` and `/radar/` must not be enforced against the redirect artifact.

## Forbidden deployment paths

Do not publish through ZIP upload, temporary hosting, obsolete repositories, local manual replacement, Datasite, unverified workflows or automatic triggers while issue `#83` remains unresolved.

## Required report

Report production status, branch, files changed, tests, PR and commit, workflow result, live routes verified, archived evidence, blockers and exact rollback point.
