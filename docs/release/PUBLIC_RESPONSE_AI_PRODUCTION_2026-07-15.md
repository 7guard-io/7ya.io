# Public Response AI — Production Record

Date: 2026-07-15

## Release identity

- Content pull request: #219
- Content source SHA: `6c179d0bd0cb334de6d03221d3074ee760f134b4`
- Release-control pull request: #223
- Release-control SHA: `36244b33c20bd8633face542d69543f2011ccc83`
- Release ID: `igor-public-response-ai-20260715`
- Vercel project: `7ya-static-site`
- Production deployment: `dpl_HCjWFRVChY9a62qgj9s3g2jabQVy`
- Verified public alias: `https://7ya-static-site.vercel.app`

## Published capabilities

- `/response-ai/` — Public Response AI in Hebrew RTL.
- 66 canonical public archive records.
- 11 governed response signals.
- 3 TIER 1 explicit positive or constructive external-framing signals.
- 10,273 validated TikTok LIVE comment records represented only as aggregate interaction evidence.
- Four analysis modes: strongest signals, verified positive reinforcement, discussion depth and external sources.
- Visible integration into `/7ya/` and sitemap inclusion.
- `/entity/` preserved in the deterministic public artifact.

## Stance and privacy controls

- Aggregate engagement is not represented as positive sentiment or universal agreement.
- Aggregate records use `UNDETERMINED_FROM_AGGREGATES`.
- Raw comment stance uses `HUMAN_REVIEW_REQUIRED`.
- Raw commenter text and identities are not published automatically.
- Positive mode is restricted to `POSITIVE_EXTERNAL_FRAMING` and `CONSTRUCTIVE_EXTERNAL_FRAMING` from TIER 1 external sources.
- Private family identifiers remain outside the public release.

## Runtime verification

The production deployment reached `READY` and served the exact content source SHA through `X-7YA-Source-SHA`.

Verified HTTP 200:

- `/release.json`
- `/response-ai/`
- `/scripts/public-response-ai-20260715.js`
- `/styles/public-response-ai-20260715.css`
- `/knowledge/public-response-signals-20260715.json`
- `/7ya/`
- `/entity/`
- `/sitemap.xml`

Verified fail-closed behavior:

- `/admin/` → HTTP 404, `noindex, nofollow`, `no-store`
- `/api/private` → HTTP 404, `noindex, nofollow`, `no-store`
- unknown HTML route → controlled HTTP 404 using `404.html`, `noindex, nofollow`, `no-store`
- `/api/guide` GET → HTTP 405 with `Allow: POST`

Vercel production build completed without build errors. No runtime error clusters were found during the verification window.

## Explicit boundary

The canonical custom domain `7ya.io` was not attached or mutated in this release. At verification time it still served the older GitHub Pages History Song release with 36 records. No DNS, Cloudflare, nameserver, MX or mail-related TXT change was performed.

The Public Response AI release is therefore production-published and rollback-ready on the verified Vercel alias, while canonical-domain cutover remains a separate infrastructure action.
