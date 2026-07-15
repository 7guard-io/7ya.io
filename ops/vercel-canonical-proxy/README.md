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
- Previous production source SHA: `446e54d98ebd04fc1e1a837f98dce94a8904ae55`
- Pinned Public Response AI source SHA: `6c179d0bd0cb334de6d03221d3074ee760f134b4`
- Content pull request: `#219`
- Release-control branch: `release/public-response-ai-20260715`
- Merge requirement: preserve the pinned source commit in `main` history.
- Vercel project: `7ya-static-site`
- Verified alias: `https://7ya-static-site.vercel.app`

The proxy code and `/release.json` in this directory are pinned to the merged Public Response AI source SHA. Production promotion must verify that `/response-ai/`, its JavaScript, stylesheet and signal dataset all return the same `X-7YA-Source-SHA`.

## Routes

- `/release.json` → `api/release.js`
- `/api/guide` → `api/guide.js`
- every other path → `api/proxy.js?path=<captured path>`

Directory requests resolve to `index.html`. Extension-bearing requests are fetched as assets. Invalid dot or traversal segments fail closed. Private `/admin/` and unhandled repository `/api/*` paths return a controlled 404. Missing HTML routes use the repository's `404.html` with HTTP 404.

## Deployment gate

Before changing the source SHA:

1. Commit and merge the intended source content.
2. Pin the proxy and release endpoint to that immutable content commit.
3. Confirm the release metadata names the content PR and critical routes.
4. Deploy this directory to the existing `7ya-static-site` project.
5. Verify HTTP 200, canonical metadata and `X-7YA-Source-SHA` for `/`, `/entity/`, `/7ya/`, `/response-ai/`, `/influence/`, `/evidence/`, `/talk/` and `/contact/`.
6. Verify `/styles/public-response-ai-20260715.css`, `/scripts/public-response-ai-20260715.js`, `/knowledge/public-response-signals-20260715.json`, `robots.txt`, `sitemap.xml` and `/release.json`.
7. Verify the positive mode is limited to explicit external framing and that aggregate records remain stance-undetermined.
8. Verify controlled 404s are `noindex, nofollow` and `no-store`; private `/admin/` and unhandled `/api/*` paths fail closed.
9. Check runtime error clusters.
10. Do not attach or mutate domains, nameservers, MX or mail-related TXT records as part of this package.

## Limitations

This is a recovery and cutover bridge, not the ideal permanent architecture. It adds a GitHub raw fetch on cache misses. The preferred long-term state is a repository-backed Vercel project that builds the static site directly from the canonical repository while preserving the same provenance contract.
