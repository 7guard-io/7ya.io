# CI Runbook

Status: external runner blocker; repository release gate is operational.
Primary tracker: issue #83.
Last verified: 2026-07-15.

## Current state

GitHub Actions workflows remain manual only while the organization billing lock prevents runner startup.

Manual workflows:

- `actions-smoke.yml`
- `ci.yml` — executes the same deterministic release gate used locally
- `pages.yml` — requires an explicit full `main` SHA, executes the release gate, then publishes only the allowlisted static artifact

## Why

A minimal workflow and later publication runs failed before checkout. GitHub notification evidence identifies an organization/account billing lock, so no repository code was executed.

On 2026-07-14, PR #175 temporarily restored a `push` trigger to test whether the repository-level blocker had cleared. The PR merged as commit `c235b83a7cf0f255d01936de2f593f42bdf274fe`, but no workflow run or commit status appeared, and `https://7ya.io/` continued serving the previous artifact.

This confirms that the runner blocker is outside the site code and artifact contract. Normal pull requests must not depend on automatic CI until issue #83 is resolved. Code validation must use the exact local gate below plus a real preview or runtime verification.

## Exact repository release gate

```bash
npm ci --no-audit --no-fund
npm run release:gate
```

The gate validates content and evidence contracts, internal links, TypeScript and tests, the three-workflow allowlist, a clean public-file allowlist, manifest hashes, all canonical and alias routes, and fail-closed behavior for private `/admin/` and repository `/api/` paths.

## Current release surfaces

- Canonical repository `main`: Igor Vepretski Creatorverse is present.
- Vercel production alias `https://7ya-static-site.vercel.app`: recovery release is deployed and verified from immutable source SHA `c275ff0557727c99e712ae8d57ebd0736dba79e5`.
- Canonical domain `7ya.io`: still serves the earlier GitHub Pages artifact.
- DNS: unchanged.

## Recovery order

1. Fix the repository or organization Actions blocker tracked in issue #83: runner access, Actions policy, billing/quota, Pages permissions and environment approval.
2. Run `Actions Smoke` manually and require a completed job with visible steps and logs.
3. Run `Validate 7YA Release` manually and require `npm run release:gate` to pass.
4. Run `Publish 7YA Living OS` manually with the exact full SHA checked out from `main`.
5. Verify on `https://7ya.io/`: canonical metadata, robots, security headers, critical routes, CSS, JavaScript, images, `release.json`, controlled 404s and an end-to-end guidance flow.
6. Restore automatic triggers only after the manual smoke, validation and Pages deployment pass. Reintroduce each event trigger deliberately in a reviewed PR.

## Alternative cutover

The Vercel recovery production is ready, but attaching `7ya.io` to the Vercel project requires Custom Domain permission plus provider-issued DNS records. Do not change MX, TXT or nameservers during a frontend cutover.

## Rule

Do not re-enable automatic CI or Pages triggers before the manual smoke check passes.
