# 7YA production release receipt — 2026-08-26

## Production authority
- Provider: AppDeploy v2
- App ID: `697a008fddc309b142`
- Applied snapshot: `1787747687039`
- Release marker: `7ya-production-acceptance-20260826-mobile-cinema-v2-device-rich-v3`
- Canonical domain: `https://7ya.io/`
- Applied at: 2026-08-26 15:34:47 Asia/Jerusalem

## User-visible intent
Igor-first responsive cutover across small phones, standard mobile, tablet, desktop and wide desktop. Preserve the personal/cinematic story and authentic source media while removing device-specific layout collisions.

## Runtime delta
- Added `src/device-experience-20260826.css` as the final responsive governor after `mobile-media-stability-20260825.css`.
- Mobile: split photo/copy hero, one full-width primary CTA plus two secondary CTAs, 44px+ touch targets, safe-area-aware spacing, richer clamped biography copy, horizontal snap media rail.
- Small phones: reduced hero/media height, typography and rail sizing.
- Tablet 801–1024: closes the previous breakpoint gap and changes the media wall to a deliberate two-column editorial rhythm with feature rows.
- 1025–1180: deliberate three-column editorial media rhythm.
- Wide desktop: constrained readable copy and centered media surfaces.
- Landscape mobile, keyboard focus and reduced-motion behavior explicitly covered.
- Frontend, backend, HTML metadata, release JSON and cache bootstrap were synchronized to the same release marker.

## Release gate evidence
- AppDeploy terminal state: `ready`.
- Fresh QA snapshot timestamp: 2026-08-26 15:35:31 Asia/Jerusalem.
- Fresh AppDeploy QA: 0 frontend errors, 0 backend errors, 0 network errors reported.
- Desktop QA screenshot generated for snapshot `1787747738810`.
- Mobile QA screenshot generated for snapshot `1787747738810`.
- `7ya.io` custom-domain record: active; checked after deployment.
- `www.7ya.io` custom-domain record: active; checked after deployment.
- Public web crawl on 2026-08-26 resolves the canonical domain and exposes the Igor-first story, source-linked media, StartOn, creation, research and open-ended archive.

## Rollback
Exact pre-cutover AppDeploy snapshot: `1787736999712`.

## Verification caveat
The AppDeploy QA screenshots were generated successfully, but the current chat runtime could not fetch the S3 pixel files directly for independent pixel inspection. The release therefore records machine deployment QA, source-level responsive verification, active custom-domain routing and a fresh public crawl; a direct pixel review remains a separate visual-receipt step if a browser-capable surface is used.
