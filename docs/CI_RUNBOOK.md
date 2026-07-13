# CI Runbook

Status: active blocker.
Primary tracker: issue #83.

## Current state

GitHub Actions workflows are manual only. Production deployment must not be triggered by `push`, schedules, or pull requests while issue #83 remains open.

Manual workflows:

- `actions-smoke.yml`
- `validate-markdown.yml`
- `site-process-health.yml`
- `ci.yml`
- `api-smoke.yml`
- `netlify-api-deploy.yml`

## Why

A minimal workflow failed even after rerun. No usable steps or logs were available through the connector. The known account or organization Actions blocker prevents CI results from being treated as valid release evidence.

Normal pull requests must not depend on automatic CI until issue #83 is resolved.

## Local validation while blocked

Run the deterministic checks from a clean checkout:

```bash
npm ci --ignore-scripts
npm audit --omit=dev --audit-level=high
npm run typecheck
npm test
node --test scripts/release-manifest.test.mjs
npm run check-all
node scripts/prepare-netlify-api-deploy.mjs
node scripts/verify-release-manifest.mjs \
  .netlify-api-deploy/public/release-manifest.json \
  .netlify-api-deploy
```

For route verification, start a local static server and run:

```bash
python3 -m http.server 4173
npm run verify:routes -- http://127.0.0.1:4173
```

## Recovery order

1. Resolve the repository or organization Actions blocker tracked in issue #83.
2. Run `Actions Smoke` manually and require a normal job with readable steps and logs.
3. Run `Validate Markdown` manually.
4. Run `Site Process Health` manually.
5. Run `7YA CI` manually and require:
   - dependency installation from the lockfile;
   - production dependency audit;
   - typecheck and Evidence Oracle tests;
   - release-manifest tamper, extra-file, and commit-mismatch rejection tests;
   - site, link, and route validation;
   - a valid `release-manifest.json` and matching bundle SHA-256.
6. Confirm repository secrets `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID` exist without exposing their values.
7. Run `Deploy 7YA API to Netlify` manually under the protected production environment.
8. Accept the deployment only when the SHA-named evidence artifact contains:
   - provider deployment JSON;
   - local and deployed release manifests;
   - `release-manifest-verification.json` with `manifest_verified: true`;
   - `deployment-sha-verification.json` with `sha_verified: true`;
   - passing API smoke evidence.
9. Restore automatic CI triggers only after the manual validation chain passes.
10. Keep production deployment manual unless a separate governance decision explicitly authorizes automatic release.

## Rule

Do not re-enable automatic CI gates before the manual smoke check passes. Never accept a deployment based only on a provider success message; require the production manifest, exact GitHub SHA, and smoke evidence.
