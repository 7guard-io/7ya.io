# 7YA Personal WOW — Vercel Recovery Release Evidence

## Release scope

This record covers the personal WOW synchronization completed on 13 July 2026.

Canonical repository: `7guard-io/7ya.io`

Implemented changes:

- Canonical full-site WOW layer merged through PR `#163`.
- Vercel recovery identity synchronization merged through PR `#164`.
- Netlify API project was not modified.
- No DNS record was changed.

## Canonical commits

- Full-site personal WOW merge: `40bdec08dfb07b7935c4ab49090e61d0ffd1cd6c`
- Vercel recovery WOW merge: `e4a88f80311b6810ed3c4f7e0f32aa81a0d48035`

## Vercel deployment

Project: `7ya-static-site`

Final production deployment:

- Deployment ID: `dpl_9eFD5euZKSgbvwPV3aFgM8tasGav`
- State: `READY`
- Target: `production`
- Public alias: `https://7ya-static-site.vercel.app`
- Region: `iad1`
- Alias error: none

The deployed bundle was assembled from `ops/vercel-recovery` and contains:

- `package.json`
- `vercel.json`
- `routes.json`
- `api/render.js`
- `api/release.js`
- `site.css`
- `robots.txt`
- `sitemap.xml`

## Verified production responses

The following public Vercel routes returned HTTP `200` after deployment:

- `/`
- `/journey/`
- `/evidence/`
- `/release.json`
- `/robots.txt`
- `/sitemap.xml`

Verified properties:

- Personal Igor-first headline is present.
- `NOW BUILDING`, `HUMAN FIRST`, StartOn and 7YA identity signals are present.
- Canonical links point to the matching `https://7ya.io/...` routes.
- HTML routes return `X-Robots-Tag: index, follow`.
- `X-Content-Type-Options: nosniff` is present.
- `Referrer-Policy: strict-origin-when-cross-origin` is present.
- `robots.txt` allows crawling and points to the canonical sitemap.
- `sitemap.xml` contains the governed public route set.

## Provenance limitation

The direct Vercel deployment connector successfully deployed files but filtered both attempted deployment-level provenance inputs:

- `SOURCE_SHA` environment input
- `gitMetadata.commitSha`

Therefore `/release.json` currently reports:

```json
{
  "source_sha": "unbound",
  "environment": "production"
}
```

This is a documentation limitation, not a content or availability failure. The source implementation used for the recovery release is repository commit `e4a88f80311b6810ed3c4f7e0f32aa81a0d48035`.

## Canonical-domain status

At verification time, `https://7ya.io` was still serving the previous personal full-site artifact rather than the new Vercel WOW recovery release.

The Vercel project did not list `7ya.io` or `www.7ya.io` among its attached domains. The available connector did not expose custom-domain attachment or DNS mutation actions.

Required final cutover gate:

1. Attach `7ya.io` and, where required, `www.7ya.io` to the Vercel project or successfully run the canonical GitHub Pages publishing workflow.
2. Apply only the provider-issued DNS records.
3. Verify TLS, apex and `www` behavior.
4. Verify homepage and governed routes on the canonical domain.
5. Record the final production provider, deployment ID and rollback point.

## Current verdict

- Repository synchronization: `PASS`
- Full-site WOW code on `main`: `PASS`
- Vercel recovery WOW production deployment: `PASS`
- Vercel route verification: `PASS`
- Netlify API isolation: `PASS`
- Canonical `7ya.io` cutover to the new release: `NOT COMPLETED`
- DNS changed: `NO`
