# CI Runbook

Status: active blocker.
Primary tracker: issue #83.
Last verified: 2026-07-14.

## Current state

GitHub Actions workflows remain manual only.

Manual workflows:

- `actions-smoke.yml`
- `site-process-health.yml`
- `validate-markdown.yml`
- `pages.yml` — publishes the Igor Vepretski Creatorverse after all site and artifact gates pass

## Why

A minimal workflow failed even after rerun. No usable steps or logs were available through the connector.

On 2026-07-14, PR #175 temporarily restored a `push` trigger to test whether the repository-level blocker had cleared. The PR merged as commit `c235b83a7cf0f255d01936de2f593f42bdf274fe`, but no workflow run or commit status appeared, and `https://7ya.io/` continued serving the previous artifact.

This confirms that the current publication blocker is outside the Creatorverse HTML, CSS, JavaScript and artifact contract. Normal pull requests must not depend on automatic CI until issue #83 is resolved.

## Current release surfaces

- Canonical repository `main`: Igor Vepretski Creatorverse is present.
- Vercel production alias: Creatorverse release is deployed and verified.
- Canonical domain `7ya.io`: still serves the earlier GitHub Pages artifact.
- DNS: unchanged.

## Recovery order

1. Fix the repository or organization Actions blocker tracked in issue #83: runner access, Actions policy, billing/quota, Pages permissions and environment approval.
2. Run `Actions Smoke` manually and require a completed job with visible steps and logs.
3. Run `Validate Markdown` manually.
4. Run `Site Process Health` manually.
5. Run `Publish 7YA Creatorverse` manually.
6. Verify on `https://7ya.io/`:
   - title contains `Creatorverse`;
   - homepage contains `CREATOR` and `OF WORLDS.`;
   - `/styles/creatorverse-20260714.css` returns successfully;
   - `/scripts/creatorverse-20260714.js` returns successfully;
   - canonical remains `https://7ya.io/`;
   - robots remains `index, follow`;
   - critical routes remain reachable.
7. Restore automatic triggers only after the manual smoke and Pages deployment pass.

## Alternative cutover

The Vercel Creatorverse production is ready, but attaching `7ya.io` to the Vercel project requires Custom Domain permission plus provider-issued DNS records. Do not change MX, TXT or nameservers during a frontend cutover.

## Rule

Do not re-enable automatic CI or Pages triggers before the manual smoke check passes.
