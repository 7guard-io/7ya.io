# 7YA Canonical SHA Proxy

This directory is the reproducible source for the production bridge deployed to the Vercel project `7ya-static-site`.

## Why it exists

The canonical public source is `7guard-io/7ya.io`, while older hosting integrations may still reference obsolete repositories or blocked GitHub Actions. The proxy removes that ambiguity:

- Every request is served from one immutable GitHub commit SHA.
- HTML, CSS, JavaScript, JSON, XML, fonts, images and media use the same source commit.
- Response headers expose repository, source path and source SHA.
- `/release.json` publishes the same provenance contract.
- No custom-domain, nameserver, MX or mail mutation is performed by this package.

## Current source contract

- Repository: `7guard-io/7ya.io`
- Pinned source SHA: `1c599abc2fcf30c95be4465c6242114e7602b2e9`
- Content pull request: `#226`
- Release-control branch: `release/smart-nvidia-ux-e2e-20260715`
- Vercel project: `7ya-static-site`
- Verified alias: `https://7ya-static-site.vercel.app`

The release adds the universal `7YA Signal Key`, NVIDIA NIM-first provider routing, OpenAI and deterministic local fallbacks, plus the governed Digital Museum Collector.

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
3. Confirm the release metadata names the content PR and critical routes.
4. Deploy this directory to the existing `7ya-static-site` project.
5. Verify HTTP 200 and `X-7YA-Source-SHA` for `/`, `/entity/`, `/7ya/`, `/response-ai/`, `/influence/`, `/evidence/`, `/talk/` and `/contact/`.
6. Verify `/styles/7ya-signal-key-20260715.css` and `/scripts/7ya-signal-key-20260715.js`.
7. Verify `/api/guide` accepts POST only and returns `provider` plus `model` without exposing credentials.
8. Verify controlled 404s are `noindex, nofollow` and `no-store`.
9. Check runtime error clusters.
10. Do not attach or mutate domains, nameservers, MX or mail-related TXT records as part of this package.

## Collector boundary

`.github/workflows/digital-museum-collector.yml` runs at minute 17 every 12 hours and supports manual dispatch. It reads `data/collector-targets.json`, collects public metadata only, blocks private-network targets, writes only when content hashes change and commits with `[skip ci]`. Collection is not publication approval and does not prove partnership, reach, impact or endorsement.

## Limitation

This is a recovery and cutover bridge, not the ideal permanent architecture. It adds a GitHub raw fetch on cache misses. The preferred long-term state is a repository-backed Vercel project that builds directly from the canonical repository while preserving the same provenance contract.
