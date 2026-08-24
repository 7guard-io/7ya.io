# 7YA Canonical Domain Publish Hotfix

Date: 2026-08-24
Production app: AppDeploy `697a008fddc309b142`
Canonical domain: `https://7ya.io`
Verified production snapshot: `1787554407576`
Release marker: `7ya-production-truth-20260824-5`

## Why this release exists

The current AppDeploy runtime contained the new Living Digital Identity / Story Path work, while an already-open iPhone/Safari/PWA client could continue rendering an older shell. Investigation found a root-scoped service worker that used stale-while-revalidate for JavaScript and CSS, which can preserve old application bundles after a newer server deployment.

## Publication fix

- Service worker cache version changed to `7ya-world-gateway-20260824-publish-v101`.
- Navigation, scripts and styles now use network-first delivery with `cache: no-store` before cache fallback.
- Old `7ya-*` caches are deleted during worker activation.
- Activation claims clients and requests current windows to navigate again.
- `index.html` contains a one-time session-scoped break-glass bootstrap `7ya-publish-20260824-v102` that deletes old `7ya-*` Cache Storage entries and unregisters stale service-worker registrations before the React bundle loads, then reloads once.
- HTML `7ya-release` and `7ya-build` metadata were updated to `7ya-production-truth-20260824-5`.
- Backend runtime release marker was aligned to the same `7ya-production-truth-20260824-5` value.

## Verification

AppDeploy terminal status after the final release-marker alignment was `ready` with zero frontend and backend errors.

Fresh source verification on snapshot `1787554407576` confirmed all three publication markers together:

- backend: `7ya-production-truth-20260824-5`;
- HTML bootstrap: `7ya-publish-20260824-v102`;
- service worker: `7ya-world-gateway-20260824-publish-v101`.

Both custom domains were freshly re-verified after the publication work:

- `7ya.io` — ACTIVE; apex resolves to AppDeploy proxy IPv4 `18.232.7.146`;
- `www.7ya.io` — ACTIVE; CNAME chain reaches `proxy-v2.appdeploy.ai`.

A same-day public web crawl already showed the newer human-first hero (`Before the brand. Before the roles. Me.`), while some dynamic archive counts in the crawler remained pre-hydration. That crawler representation is not used as the production source of truth.

## Operational conclusion

The canonical domain is routed to the current AppDeploy production stage and the stale-client delivery path has been explicitly invalidated. A client that had the older shell open must perform one navigation/reload to receive the new index bootstrap; that bootstrap then clears legacy caches and reloads once automatically.