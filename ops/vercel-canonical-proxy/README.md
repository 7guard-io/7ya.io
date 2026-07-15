# 7YA Canonical SHA Proxy

This directory is the reproducible source for the emergency production surface deployed to the Vercel project `7ya-static-site`.

## Why it exists

The canonical public source is `7guard-io/7ya.io`, but Vercel Git integration has historically pointed at the obsolete repository `vepretski/7ya.io`. GitHub Actions are also blocked before checkout by an organization billing lock.

The proxy removes both ambiguities:

- Every request is served from a single immutable GitHub commit SHA.
- HTML, CSS, JavaScript, JSON, XML, fonts, images and media use the same source commit.
- Response headers expose the repository, source path and source SHA.
- `/release.json` publishes the same provenance contract.
- No custom domain or Cloudflare DNS mutation is performed by this package.

## Source contract

- Repository: `7guard-io/7ya.io`
- Previous production source SHA: `cdc63d83591d84e0a93af953244bed1b8365a458`
- Pinned Igor-led Living OS source SHA: `c275ff0557727c99e712ae8d57ebd0736dba79e5`
- Content and release PRs: `#210`, `#211`
- Merge requirement: use a regular merge so the pinned source commit remains in `main` history.
- Vercel project: `7ya-static-site`
- Verified alias: `https://7ya-static-site.vercel.app`

The proxy code and `/release.json` in this directory are pinned to the Igor-led Living OS source SHA. Preview verification may use an immutable PR commit; production promotion must wait until the content and release PRs are merged and the pinned source commit is reachable from `main` history.

## Routes

- `/release.json` → `api/release.js`
- `/api/guide` → `api/guide.js`
- every other path → `api/proxy.js?path=<captured path>`

Directory requests resolve to `index.html`. Extension-bearing requests are fetched as assets. Invalid dot or traversal segments fail closed. Missing HTML routes use the repository's `404.html` with HTTP 404.

## Deployment gate

Before changing the source SHA:

1. Commit the intended source content.
2. Pin the proxy to that immutable content commit.
3. Merge with a strategy that preserves the pinned commit in `main` history.
4. Deploy this directory to the existing `7ya-static-site` project.
5. Verify HTTP 200, canonical metadata and `X-7YA-Source-SHA` for `/`, `/journey/`, `/starton/`, `/evidence/`, `/talk/` and `/contact/`.
6. Verify CSS, JavaScript, image, `robots.txt`, `sitemap.xml` and `/release.json` responses.
7. Check runtime error clusters.
8. Do not attach `7ya.io` or modify Cloudflare until the complete gate passes.

## Limitations

This is a recovery and cutover bridge, not the ideal permanent architecture. It adds a GitHub raw fetch on cache misses. The preferred long-term state is a repository-backed Vercel project that builds the static site directly from the canonical repository while preserving the same provenance contract.
