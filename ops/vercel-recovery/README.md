# 7YA Vercel Recovery Frontend

This directory is a source-controlled, provider-independent recovery surface for the public 7YA frontend.

## Scope

- Server-rendered, crawlable HTML for the critical public route contract.
- Static `robots.txt` and `sitemap.xml`.
- Conservative evidence language that does not promote unsupported metrics, affiliations, or professional claims.
- `/release.json` provenance endpoint.

## Vercel project contract

- Project: `7ya-static-site`
- Root directory: `ops/vercel-recovery`
- Framework preset: Other
- Build command: none
- Output directory: none
- Production branch: `main`

GitHub is the source-control plane. Vercel performs build and deployment independently of GitHub Actions.

## Required production gate

Verify HTTP 200, crawlable HTML, title, description, canonical URL, and `X-Robots-Tag: index, follow` for:

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

## Domain cutover

Do not change DNS until the exact repository-backed deployment is READY and the full gate passes on its Vercel production alias. Add `7ya.io` and `www.7ya.io` to the Vercel project first, inspect Vercel's domain-specific DNS requirements, then update the existing Cloudflare zone. Preserve mail-related DNS records.

## Rollback

Keep the previous canonical production origin available until the custom domain passes DNS, TLS, route, metadata, and crawl-control verification. Roll back by restoring the prior Cloudflare web records; do not change nameservers.
