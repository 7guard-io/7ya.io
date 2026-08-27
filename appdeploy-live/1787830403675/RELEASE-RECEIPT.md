# 7YA AppDeploy v98 — Meta Owner-Authorized Ingestion Release Receipt

**App:** `697a008fddc309b142`  
**Snapshot:** `1787830403675` (`v98`)  
**Release marker:** `7ya-production-acceptance-20260827-meta-owner-ingest-v1`  
**Release command:** `בצע את שרשרת הפריסה`  
**Date:** 2026-08-27

## Result

AppDeploy accepted and applied snapshot `1787830403675`. Terminal deployment state is **READY**. The platform QA snapshot reports **0 frontend errors, 0 backend errors, and 0 network errors**. AppDeploy did not attach an E2E run to this version, so no E2E PASS is claimed.

The `meta-sync-hourly` cron is enabled at minute 37 in `Asia/Jerusalem`. Its first observed run after cutover completed with platform status `success` and `failure_count: 0`.

## What shipped

- Server-only Meta Graph client using `Authorization: Bearer` rather than token query parameters.
- Owner-authorized Page and linked Instagram Professional capability discovery.
- Explicit Page and Instagram allowlists.
- Stable Facebook and Instagram content normalization.
- Source-local, dated metric observations; no synthetic cross-platform reach.
- Monthly/bucketed persisted content, metric snapshots, cursors and health state.
- Bounded incremental sync with a maximum of 10 pages per account per invocation.
- Protected Meta admin status, probe, sync and health routes.
- Additive persisted Meta projection into `/api/public-projection`; no live Meta network dependency during public rendering.
- Canon remains the winner when a Meta URL collides with an existing canonical source, while dated source-local metrics are retained.
- Failure isolation: Meta unavailability cannot blank Canon, Discovery or existing public social fallbacks.

## Security evidence

AppDeploy source readback on the applied snapshot found no matches under `backend/meta/**/*.ts` for:

- `access_token=`
- `console.log(config)`
- `console.log(token)`
- `JSON.stringify(rawGraph`

Secret values, Page tokens and user tokens are not exported to this repository. The public projection does not expose `providerObjectId` or `accountObjectId`.

## Credential state at cutover

Configured secret **names** observed at cutover: `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, `NVIDIA_API_KEY`, `SOCIAL_TOKEN_ENCRYPTION_KEY`.

The dedicated ingestion secrets `META_USER_ACCESS_TOKEN`, `META_GRAPH_API_VERSION`, `META_APP_ID`, `META_APP_SECRET`, `META_ALLOWED_PAGE_IDS`, `META_ALLOWED_INSTAGRAM_IDS`, and `META_INGEST_ENABLED` were not configured. Therefore the newly deployed Meta ingestion writer remains safely in **credential-required** state. The earlier read-only Facebook OAuth Page integration remains separate and intact.

No Page IDs or Instagram account IDs were invented to bypass the allowlist requirement.

## Release-gate evidence and limitation

The canonical repository now includes `scripts/check-meta-ingestion.mjs`, and `check-meta-ingestion` is wired into `check-all`, so future `npm run ci:local` runs validate the focused v98 Meta export and secret-safety anchors.

A fresh full `npm run ci:local` **was not executed in this ChatGPT harness**: there is no repository checkout, outbound DNS resolution from the container fails for GitHub/AppDeploy hosts, and the repository's GitHub Actions workflow explicitly documents account/org runner startup blocking and is `workflow_dispatch` only. Accordingly, **no CI PASS is claimed**. This is recorded as a release limitation rather than silently converted into a green result.

## Runtime QA

- Deployment: `READY`
- Frontend errors: `0`
- Backend errors: `0`
- Network errors: `0`
- E2E: `not attached / not claimed`
- Mobile QA snapshot id: `1787830455187/mobile.png`
- Desktop QA snapshot id: `1787830455187/web.png`
- `meta-sync-hourly`: enabled; first observed run `success`; failure count `0`

## Export semantics

This directory is a **focused release delta**, not a byte-for-byte complete AppDeploy checkout. The Meta modules are exported source, while `backend/index.ts` is a focused runtime readback of the integration anchors. AppDeploy snapshot `1787830403675` remains the authoritative runtime source.
