# 7YA Safe Personal Static Deploy

This is the only approved static-release path while the `7ya` Vercel team has a billing risk and before any Cloudflare DNS cutover.

## One command

```bash
npm run deploy:personal-static
```

The command defaults to:

- personal Vercel scope: `igor-vepretskis-projects`
- required personal org ID: `team_0lHRQwvDzYt3C6UwXUibzmcP`
- blocked team scope: `7ya`
- blocked team org ID: `team_iNIgNZ4YWL66QZRdZn2IihaL`
- isolated static project: `7ya-static-personal-safe`

## What it does

1. Refuses non-`main` and dirty-tree production deployments by default.
2. Runs `npm ci` and the complete `npm run release:gate`.
3. Requires the immutable `dist/artifact-manifest.json`, sitemap, Evidence route and Public Universe dataset.
4. Rejects symlinks inside `dist`.
5. Copies `dist` to a disposable directory so Vercel linkage metadata never mutates the verified artifact.
6. Links with an explicit personal `--scope` and checks `.vercel/project.json` against the approved personal org ID.
7. Refuses the financially blocked `7ya` team org ID.
8. Records deployment-protection state without silently changing it.
9. Deploys the static directory to Vercel Production.
10. Waits for READY and runs unauthenticated smoke tests against the generated `.vercel.app` URL.
11. Compares the remote artifact manifest byte-for-byte and by SHA-256 with the local verified manifest.
12. Saves an evidence package under `.release-evidence/`.

## Public smoke gate

The deployment must return HTTP 200 for:

- `/`
- `/museum/`
- `/evidence/`
- `/starton/`
- `/sitemap.xml`
- `/robots.txt`
- `/artifact-manifest.json`
- `/knowledge/public-universe-records-20260715.json`
- `/styles/public-universe-20260715.css`
- `/scripts/public-content-museum-20260715.js`

The pure-static contract also requires `/api/guide` and an unknown route to return HTTP 404. The Signal Key remains visually available but reports its safe fallback when no server API exists.

## Protection handling

The default is fail-safe: if an unauthenticated request is blocked, the release stops.

To allow the script to attempt reversible disabling of password/SSO protection:

```bash
ALLOW_DISABLE_PROTECTION=1 npm run deploy:personal-static
```

The resulting URL must still pass the same unauthenticated smoke tests.

## Controlled overrides

```bash
VERCEL_STATIC_PROJECT=my-project npm run deploy:personal-static
ALLOW_NON_MAIN=1 npm run deploy:personal-static
ALLOW_DIRTY_TREE=1 npm run deploy:personal-static
SKIP_INSTALL=1 npm run deploy:personal-static
```

Overrides are evidence-visible and should not be used for the canonical production release without a documented reason.

## Hard boundary

This automation does not call `vercel domains`, does not attach `7ya.io`, and does not modify Cloudflare, nameservers, MX or mail-related TXT records. DNS cutover is a separate P0 decision after the public `.vercel.app` artifact passes this gate and remains stable.
