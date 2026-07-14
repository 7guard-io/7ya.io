# 7YA Vercel Recovery Frontend

This directory is the source-controlled recovery surface for the public 7YA frontend. It is not accepted as the canonical production origin until the deployed provider artifact passes the full route, crawl, TLS and provenance gate.

## Scope

- Crawlable HTML for the critical public route contract.
- Static `robots.txt` and `sitemap.xml`.
- Conservative evidence language that does not promote unsupported metrics, affiliations or professional claims.
- A fail-closed `/release.json` provenance endpoint.
- A permanent `www.7ya.io` to `https://7ya.io` redirect contract.

## Vercel project contract

- Project: `7ya-static-site`
- Root directory: `ops/vercel-recovery`
- Framework preset: Other
- Build command: `npm run vercel-build`
- Output directory: none
- Production branch: `main`

GitHub is the source-control plane. Vercel may build independently of GitHub Actions, but it must bind the deployment to a provider-generated Git commit SHA.

## Static critical routes

The following routes must be served as static, source-reviewed pages rather than through the generic runtime renderer:

- `/igor-vepretski/`
- `/talk/`
- `/social/`
- `/pass/`
- `/evidence/`
- `/starton/`
- `/contact/`
- `/radar/`

The homepage may continue to use the reviewed route renderer while the custom domain remains detached, provided it passes the same metadata and crawl checks.

## Release provenance contract

Committed `release.json` files describe repository state only. They must use:

- `status: SOURCE_READY`
- `production_verified: false`
- `source_sha: null`
- `environment: repository`

The build generates `release-manifest.json`. Production generation accepts only:

- `VERCEL_GIT_COMMIT_SHA`, or
- `GITHUB_SHA`.

`SOURCE_SHA` and `RELEASE_SOURCE_SHA` are forbidden for production. They may be used only for a non-production preview when `ALLOW_MANUAL_SOURCE_SHA=true`, and such a release cannot return `READY`.

The runtime endpoint returns:

- `503 PROVENANCE_UNBOUND` when no valid SHA exists;
- `503 PROVENANCE_NOT_PROVIDER_BOUND` for manual or bundled provenance;
- `503 PROVENANCE_MISMATCH` when runtime and manifest SHAs differ;
- `200 PREVIEW_READY` for a provider-bound preview;
- `200 READY` only for a provider-bound production deployment.

## Required production gate

Verify HTTP 200, crawlable HTML, meaningful title and description, exact canonical URL, and `X-Robots-Tag: index, follow` for:

- `/`
- `/igor-vepretski/`
- `/talk/`
- `/social/`
- `/pass/`
- `/evidence/`
- `/starton/`
- `/contact/`
- `/radar/`

Also require HTTP 200 for `/robots.txt`, `/sitemap.xml`, and `/release.json`.

`/release.json` must identify the exact deployed commit, report `production_verified: true`, and return the same critical route list. `READY` without a resolvable repository commit is a release failure.

## Domain cutover

Do not change DNS until the exact repository-backed deployment is READY and the full gate passes on its Vercel production alias. Add `7ya.io` and `www.7ya.io` to the Vercel project first, inspect Vercel's domain-specific DNS requirements, then update only the existing Cloudflare web records. Preserve MX, mail-related TXT records and nameservers.

## Rollback

Keep the previous canonical production origin available until the custom domain passes DNS, TLS, route, metadata, crawl-control and provenance verification. Roll back by restoring the prior Cloudflare web records; do not change nameservers.
