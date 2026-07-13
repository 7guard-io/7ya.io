# 7YA Vercel recovery — 14 July 2026

## Incident

The public Vercel production alias briefly served a deployment probe instead of the 7YA recovery application. During the incident:

- `/` returned `7YA deployment probe`;
- `/release.json` returned HTTP 404.

## Recovery

A new production deployment was created from the repository-backed recovery contract and reached `READY`.

- Vercel project: `7ya-static-site`
- Production deployment: `dpl_GtkVDhqjSTqU3V1uurzGHyNjoUy9`
- Source repository: `7guard-io/7ya.io`
- Source commit represented by the artifact: `b579599b35258f4cfacf405150eb368367fbdc3f`
- Route contract: `2026-07-14.1`

## Verified acceptance gate

The production alias returned HTTP 200 with crawlable HTML, a title, description, canonical URL, and `X-Robots-Tag: index, follow` for:

- `/`
- `/igor-vepretski/`
- `/talk/`
- `/social/`
- `/pass/`
- `/evidence/`
- `/starton/`
- `/contact/`
- `/radar/`

The following also returned HTTP 200:

- `/robots.txt`
- `/sitemap.xml`
- `/release.json`

`/release.json` exposes the exact represented source SHA instead of `unbound`.

## Root cause

A production-targeted deployment containing only a probe file became the active project alias. This was separate from the GitHub Actions billing lock.

## Controls

- Do not create production-targeted probe deployments in the `7ya-static-site` project.
- Probes must target Preview only.
- Production promotion requires the complete route contract, crawl controls, release provenance, and post-deployment route verification.
- GitHub Actions remains quarantined until an account-level run creates real workflow steps.
- The legacy release candidate PR #152 is superseded by current `main` and the verified Vercel recovery path.
