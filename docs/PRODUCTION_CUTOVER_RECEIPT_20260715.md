# 7YA Production Cutover Receipt — 2026-07-15

Status: **Vercel production release verified; custom-domain cutover incomplete.**

## Canonical source

- Repository: `7guard-io/7ya.io`
- Branch: `main`
- Approved content source SHA: `d4ce4df0a39127571d7f148b0ae040538f7b94d1`
- Release-control PR: `#237`
- Release-control merge SHA: `1cc4b1b026cd75b875b7c4d8da6714b5f7c30aff`
- Release ID: `igor-visuomodular-production-20260715`

## Verified Vercel production

- Project: `7ya-static-site`
- Project ID: `prj_xpcMFC96JcnasigrvetZetEa1XzU`
- Production deployment ID: `dpl_279g7h8gxev1n3DMVX3zPQrGLULr`
- Canonical Vercel alias: `https://7ya-static-site.vercel.app`
- Deployment state: `READY`
- Runtime error clusters after verification: none found

## Acceptance checks completed

The production alias was fetched after deployment and passed the following checks:

1. `/` returns HTTP 200, the Igor-first personal homepage, build marker `igor-personal-production-20260715`, and `X-7YA-Source-SHA: d4ce4df0a39127571d7f148b0ae040538f7b94d1`.
2. `/release.json` returns release `igor-visuomodular-production-20260715`, PR `237`, and the same immutable source SHA.
3. `/museum/` returns HTTP 200 from the same SHA.
4. `/evidence/` returns HTTP 200 from the same SHA.
5. `/scripts/history-song-20260714.js` returns HTTP 200, JavaScript MIME type, immutable asset caching, and the same SHA.
6. A missing route returns HTTP 404 with `no-store` and `X-Robots-Tag: noindex, nofollow`.
7. `GET /api/guide` returns HTTP 405 and `Allow: POST`, proving the API route and method contract are active.
8. Successful HTML and release metadata revalidate immediately during cutover; versioned assets remain immutable.
9. No runtime errors were reported for the project during the verification window.

## Public-domain finding

At the time of this receipt, `https://7ya.io/release.json` still reports:

- provider: `github-pages`
- source SHA: `164c3892f9961aee42ca55ddf1d356d4840a82d2`
- experience: `IGOR_HISTORY_SONG_PUBLIC_MEDIA_SYSTEM`

Therefore the public custom domain is still connected to the older GitHub Pages origin. The repository and Vercel production release are fixed; the domain cutover is not complete.

## Remaining P0 gate

1. Add `7ya.io` and `www.7ya.io` to Vercel project `prj_xpcMFC96JcnasigrvetZetEa1XzU`.
2. Obtain the exact Vercel domain-verification targets.
3. Change only the required Cloudflare web records.
4. Do not change Cloudflare nameservers, MX records, or mail-related TXT records.
5. Verify HTTPS, apex/www redirect policy, critical routes, and `X-7YA-Source-SHA` on both custom domains.
6. Retire the GitHub Pages origin only after both domains consistently serve the verified Vercel release.

## Rollback

Rollback remains available through the prior immutable Vercel production deployments and Git source SHAs. No DNS, nameserver, MX, credential, or private-data mutation was performed while producing this receipt.
