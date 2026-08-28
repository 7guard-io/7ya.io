# 7YA AppDeploy Release Receipt

- **App:** `697a008fddc309b142`
- **AppDeploy version:** `v98`
- **Snapshot:** `1787941429074`
- **Rollback:** `1787938839410`
- **Date:** 2026-08-28
- **Status:** READY

## Change

This release closes the split between the private Social OAuth control plane and the hourly Meta ingestion path. A Facebook Page token selected through the existing encrypted OAuth flow can now bootstrap the owner-authorized Meta sync directly, instead of requiring a second `META_USER_ACCESS_TOKEN` secret. The old secret-based path remains as a fallback.

New Facebook OAuth grants request `instagram_basic` and `instagram_manage_insights` in addition to the existing Page read permissions. Existing tokens created before this release need a fresh OAuth grant before those new Instagram permissions can be present.

The canonical Facebook public surface in the runtime social registry is now `https://www.facebook.com/vepretski7`.

Automatic publishing remains disabled. Secret values and OAuth tokens remain server-side and are not returned to the browser.

## Runtime delta

- `backend/meta/oauth-bridge.ts` — new pure OAuth-to-Meta bootstrap adapter.
- `backend/meta/sync.ts` — Meta probe/sync accepts a secure bootstrap override and preserves the legacy secret path.
- `backend/index.ts` — hourly/admin Meta sync uses stored Facebook OAuth when available; Facebook candidate sets retain granted permission names; new OAuth requests include Instagram read/insight scopes; public Facebook surface updated to `/vepretski7`.

## Verification

- Regression test written before implementation: missing bridge produced the expected RED failure.
- Regression test after implementation: **2/2 PASS**.
- AppDeploy deployment: **READY**.
- QA after deploy: **0 frontend errors, 0 backend errors, 0 network errors**.
- `meta-sync-hourly`: enabled; failure count **0** at release gate.
- Live source inspection confirmed `buildMetaSyncBootstrap`, `storedMetaSyncBootstrap`, Instagram permissions, and `/vepretski7` are present in snapshot `1787941429074`.

## CI topology note

The canonical GitHub repository is currently a release ledger rather than a complete mirror of the AppDeploy runtime. `appdeploy-live/CURRENT.json` therefore remains `github_runtime_deploy_safe: false` so stale GitHub runtime files cannot overwrite production.

The repository's `ci.yml` is `workflow_dispatch`-only and documents an account/org-level GitHub Actions runner startup block. The local execution environment also could not resolve `github.com`, so a fresh `npm run ci:local` against the GitHub checkout was not falsely claimed. The release gate used the targeted red/green regression plus AppDeploy build/runtime QA.
