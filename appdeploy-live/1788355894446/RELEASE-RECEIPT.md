# 7YA production receipt — backend healthcheck repair — 2026-09-02

AppDeploy app: `697a008fddc309b142`
Applied snapshot: `1788355894446`
Base snapshot: `1788355695267`
Canonical domain: `https://7ya.io/`

## Source repair

Restored AppDeploy's reserved backend health contract:

- `GET /api/_healthcheck` is now a lightweight deterministic HTTP 200 JSON response.
- The previous desktop visual-audit suite was moved off `_healthcheck` to `/api/visual-acceptance/desktop-suite`.
- Existing `/api/visual-acceptance` behavior was left intact.
- The immediately preceding snapshot removed the only static `public/api/health` namespace collision.

## Deployment verification

AppDeploy terminal state: `READY`.
Runtime QA: `0 frontend errors`, `0 backend errors`, `0 network errors`.
Both scheduled backend exports continue to report successful last runs.

## Important unresolved platform boundary

External HTTP verification after both source repairs still observed frontend HTML at `/api/release` on both `https://7ya.io` and the underlying AppDeploy v2 hostname. Because the backend router exists, cron exports from the same backend bundle execute, the reserved healthcheck is now valid, and no app-owned static/rewrite configuration remains that can explain the interception, the remaining public `/api/*` routing failure is classified as an AppDeploy proxy/CDN-layer blocker until AppDeploy exposes a working public backend route.

Do not mark public `/api/*` routing as fixed based only on deployment READY status.

## Source authority

This receipt records the exact production delta, but it is not a complete atomic export of the whole runtime source. Runtime source of truth remains AppDeploy snapshot `1788355894446`. Do not deploy stale GitHub runtime files over production.
