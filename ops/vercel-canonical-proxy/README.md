# 7YA Canonical SHA Proxy

This directory is the reproducible source for the production bridge deployed to the Vercel project `7ya-static-site`.

## Why it exists

The canonical public source is `7guard-io/7ya.io`, while older hosting integrations may still reference obsolete repositories or blocked GitHub Actions. The proxy removes that ambiguity:

- Every request is served from one immutable GitHub commit SHA.
- HTML, CSS, JavaScript, JSON, XML, fonts, images and media use the same source commit.
- Response headers expose repository, source path and source SHA.
- `/release.json` publishes the same provenance contract.
- Private `/admin/` and unhandled repository `/api/*` paths fail closed.
- No custom-domain, nameserver, MX or mail mutation is performed by this package.

## Current source contract

- Repository: `7guard-io/7ya.io`
- Pinned source SHA: `d4ce4df0a39127571d7f148b0ae040538f7b94d1`
- Release-control pull request: `#237`
- Release-control branch: `fix/canonical-production-cutover-20260715`
- Vercel project: `7ya-static-site`
- Vercel project ID: `prj_xpcMFC96JcnasigrvetZetEa1XzU`
- Verified alias target: `https://7ya-static-site.vercel.app`
- Intended custom domains: `7ya.io`, `www.7ya.io`

The pinned source is the Igor-first personal production experience with the deterministic multi-mode visuomodular homepage, 66-record verified narrative core, append-only Public Universe, 7YA Signal Key, StartOn, evidence routes and public participation surfaces.

## Cache contract during cutover

- Successful HTML responses revalidate immediately and must not remain stale at the edge.
- `/release.json` revalidates immediately.
- Versioned CSS, JavaScript, images, fonts and media remain immutable.
- Controlled error responses remain `no-store` and `noindex, nofollow`.

This temporary HTML policy exists to prevent the old GitHub Pages homepage and the canonical Vercel homepage from appearing interchangeably during domain migration. A longer HTML edge TTL may be restored only after both custom domains consistently report the same source SHA.

## Public Universe contract

- Verified core: `/knowledge/history-song-records-1.json` through `/knowledge/history-song-records-5.json`
- Expansion layer: `/knowledge/public-universe-records-20260715.json`
- Collections: `VERIFIED_CORE`, `PUBLIC_UNIVERSE`
- Duplicate URLs collapse at runtime, with the verified-core record retaining priority.
- The verified core remains usable if the optional expansion layer is temporarily unavailable.
- Private, minor, legal, financial and quarantined records are excluded from publication.
- Metrics require a dated source snapshot.

## Smart guide provider contract

Provider order defaults to:

1. NVIDIA NIM
2. OpenAI
3. Deterministic evidence-safe local guide

NVIDIA is active only when one of these deployment variables exists:

- `NVIDIA_API_KEY`
- `NVIDIA_NIM_API_KEY`

Optional controls:

- `NVIDIA_MODEL` — default `nvidia/nemotron-3-nano-30b-a3b`
- `AI_PROVIDER_ORDER` — default `nvidia,openai`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

The UI reports the actual provider returned by the API. The integration must never be described as an NVIDIA partnership, sponsorship or endorsement without independent evidence.

## Routes

- `/release.json` → `api/release.js`
- `/api/guide` → `api/guide.js`
- every other path → `api/proxy.js?path=<captured path>`

Directory requests resolve to `index.html`. Extension-bearing requests are fetched as assets. Invalid dot or traversal segments fail closed. Private `/admin/` and unhandled repository `/api/*` paths return a controlled 404. Missing HTML routes use the repository's `404.html` with HTTP 404.

The proxy injects the Signal Key stylesheet and script into successful HTML responses when those assets are not already present. The static artifact build performs the same injection.

## Deployment gate

Before changing the source SHA:

1. Commit and merge the intended source content.
2. Pin the proxy and release endpoint to that immutable content commit.
3. Confirm the release metadata names the release-control PR and critical routes.
4. Run `npm run check-release-pin` from the repository root.
5. Deploy this directory to the existing `7ya-static-site` project.
6. Verify HTTP 200 and `X-7YA-Source-SHA` for `/`, `/museum/`, `/entity/`, `/7ya/`, `/response-ai/`, `/influence/`, `/evidence/`, `/talk/` and `/contact/`.
7. Verify `/scripts/history-song-20260714.js`, `/scripts/history-song-core-20260714.js`, `/assets/igor-hero-storm-20260715.webp`, `/styles/7ya-signal-key-20260715.css` and `/scripts/7ya-signal-key-20260715.js`.
8. Verify `/release.json` reports release `igor-visuomodular-production-20260715`, PR `#237` and source SHA `d4ce4df0a39127571d7f148b0ae040538f7b94d1`.
9. Verify `/api/guide` accepts POST only and returns `provider` plus `model` without exposing credentials.
10. Verify controlled 404s are `noindex, nofollow` and `no-store`.
11. Check runtime error clusters.
12. Attach `7ya.io` and `www.7ya.io` only to project `prj_xpcMFC96JcnasigrvetZetEa1XzU`.
13. Change only Cloudflare web records required by Vercel verification. Preserve nameservers, MX and mail-related TXT records.
14. Verify both custom domains return the pinned `X-7YA-Source-SHA` before retiring the GitHub Pages origin.

## Collector boundary

`.github/workflows/digital-museum-collector.yml` runs at minute 17 every 12 hours and supports manual dispatch. It reads `data/collector-targets.json`, collects public metadata only, blocks private-network targets, writes only when content hashes change and commits with `[skip ci]`. Collection is not publication approval and does not prove partnership, reach, impact or endorsement.

## Limitation

This is a recovery and cutover bridge, not the ideal permanent architecture. It adds a GitHub raw fetch on cache misses. The preferred long-term state is a repository-backed Vercel project that builds directly from the canonical repository while preserving the same provenance contract.
