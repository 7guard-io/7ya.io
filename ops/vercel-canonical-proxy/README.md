# 7YA Canonical SHA Proxy

This directory is the reproducible production bridge for the Vercel project `7ya-static-site`.

## Current source contract

- Canonical repository: `7guard-io/7ya.io`
- Pinned source SHA: `0db02d129724a8e16b4104c8ac4cad1a0864c63f`
- Content pull request: `#246`
- Release-control branch: `release/infostory-cinematic-20260716`
- Release ID: `igor-cinematic-infostory-20260716`
- Vercel project: `7ya-static-site`
- Vercel project ID: `prj_xpcMFC96JcnasigrvetZetEa1XzU`
- Verified alias target: `https://7ya-static-site.vercel.app`
- Intended custom domains: `7ya.io`, `www.7ya.io`

The pinned source is the Igor-first cinematic Digital Life Infostory: five full-screen chapters, black/bronze/gold editorial styling, the canonical public portrait, four owner-supplied visual scenes explicitly marked as non-evidence, the 66-record verified core, Public Universe, StartOn, Evidence Ledger and the 7YA Signal Key creator companion.

## Why the proxy exists

The canonical public source is GitHub, while older hosting integrations may reference obsolete repositories or blocked GitHub Actions. This bridge removes ambiguity:

- every request is served from one immutable GitHub commit SHA;
- HTML, CSS, JavaScript, JSON, XML, images and media share the same source commit;
- response headers expose repository, source path and source SHA;
- `/release.json` exposes the same provenance contract;
- `/admin/` and unhandled repository `/api/*` paths fail closed;
- no nameserver, MX or mail-related TXT record is changed by this package.

## Infostory release contract

Required homepage assets:

- `/styles/igor-infostory-20260716.css`
- `/scripts/igor-infostory-20260716.js`
- `/assets/infostory/01-origins.webp`
- `/assets/infostory/02-public-voice.webp`
- `/assets/infostory/03-creator-night.webp`
- `/assets/infostory/04-force-system.webp`
- `/assets/igor-home-portrait-20260712.webp`

The visual scenes are design assets supplied by the owner and are not presented as documentary evidence. Public metrics remain dated snapshots. AI is a helper, never the public identity or hero.

## Content and trust contract

- Verified core: `/knowledge/history-song-records-1.json` through `/knowledge/history-song-records-5.json`
- Public Universe: `/knowledge/public-universe-records-20260715.json`
- Collections: `VERIFIED_CORE`, `PUBLIC_UNIVERSE`
- Duplicate URLs collapse at runtime while verified-core records retain priority.
- Private, minor, legal, financial and quarantined records are excluded.
- Metrics require dated source snapshots.
- `scripts/check-text-integrity.mjs` blocks Unicode replacement characters, NUL bytes, unexpected control characters and unbalanced CSS braces.

## Signal Key contract

Public modes:

1. Understand
2. Create
3. Fulfilment
4. Impact

Provider order defaults to NVIDIA NIM, OpenAI and then the deterministic evidence-safe local guide. The UI reports the provider actually used. Prompts are not stored in localStorage. The guide does not publish automatically, does not impersonate Igor and does not claim an NVIDIA partnership.

## Routes

- `/release.json` → `api/release.js`
- `/api/guide` → `api/guide.js`
- every other path → `api/proxy.js?path=<captured path>`

Directory requests resolve to `index.html`. Invalid traversal segments fail closed. Missing HTML routes use the canonical `404.html` and return HTTP 404 with `noindex, nofollow` and `no-store`.

## Cache contract

- successful HTML: immediate revalidation;
- `/release.json`: immediate revalidation;
- versioned assets: immutable;
- controlled error responses: `no-store`.

## Deployment gate

1. Merge the intended public content.
2. Pin `api/proxy.js` and `api/release.js` to the immutable content SHA.
3. Confirm this README names the same SHA and content PR.
4. Run `npm run check-release-pin` and `npm run check-text-integrity`.
5. Deploy this directory to project `7ya-static-site`.
6. Verify `/`, `/museum/`, `/create/`, `/starton/`, `/influence/`, `/evidence/`, `/talk/` and `/contact/` return HTTP 200 and `X-7YA-Source-SHA: 0db02d129724a8e16b4104c8ac4cad1a0864c63f`.
7. Verify `/release.json` reports `igor-cinematic-infostory-20260716`, PR `#246` and the same SHA.
8. Verify the Infostory CSS, script and all four scene assets return HTTP 200.
9. Verify `/api/guide` returns provider and model without exposing credentials.
10. Verify controlled 404s remain private to search engines.
11. Check Vercel runtime errors.
12. Attach `7ya.io` and `www.7ya.io` only after the exact deployment is READY.
13. Preserve Cloudflare nameservers, MX and mail-related TXT records.

## Limitation

This is a recovery bridge, not the ideal permanent architecture. The long-term target is a direct repository-backed Vercel project with the same provenance and rollback contract.
