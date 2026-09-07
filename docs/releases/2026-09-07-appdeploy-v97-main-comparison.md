# AppDeploy v97 ↔ GitHub main reconciliation

Date: 2026-09-07
Production snapshot: `1788795662202` (v97)
Repository base: `7guard-io/7ya.io` / `main`
Reconciliation branch: `reconcile/appdeploy-v97-20260907`
Decision: **NO-GO for deploying `main` over v97 or starting a broad production redesign from `main`.**

## Executive finding

The two trees are not the same application state. Drift is both **missing-path drift** and **stale same-path drift**. This is more dangerous than a simple missing export because a file may exist on `main` while representing an older runtime generation.

## Directly verified drift

| Surface | AppDeploy v97 | GitHub main | Classification |
|---|---|---|---|
| `src/App.tsx` | Present; release marker `7ya-sovereign-recovery-20260905-v3-globalfix`; `DocumentaryHome`, lazy rooms, Evidence/Library/Search/StartOn routing and current SEO/canonical logic | Present, but old release marker `7ya-intellectual-research-spine-20260815-1`; older `IgorLivingRecordHome` composition and route model | **STALE SAME-PATH** |
| `src/main.tsx` | Present; React 19 bootstrap plus `www.7ya.io` → apex redirect | 404 on `main` | **MISSING ON MAIN** |
| `backend/index.ts` | Present; active production backend entrypoint | 404 on `main` | **MISSING ON MAIN** |
| `cron.json` | Present; only `agent-mesh-hourly` and `meta-sync-hourly` are source-scheduled | 404 on `main` | **MISSING ON MAIN** |
| `package.json` | Vite/React application (`react` 19, `react-dom` 19, Vite 6); build runs localized-page generation then Vite | Different static/Netlify-oriented repository package with a broad historical check/build/deploy toolchain and no React runtime contract | **ARCHITECTURE DRIFT** |
| root `index.html` | Current static-first human hero, v97 build marker, current canonical/alternate/schema wiring | not treated as production authority in this comparison | **PRODUCTION SOURCE = v97** |

## Production inventory baseline

The exact v97 source scan contains **460 files**:

- `src/**`: 321
- `backend/**`: 16
- `shared/**`: 14
- `public/**`: 83
- `docs/**`: 15
- `scripts/**`: 2
- root/test/config: 9

Of the 83 public files, 14 are binary/gzip assets requiring byte-preserving treatment.

## Exact materialization status

The reconciliation branch currently contains exact v97 copies of:

- all 9 root/test/config files;
- `src/main.tsx`;
- `src/App.tsx`.

That is **11 of 460** files. The remaining **449** are intentionally recorded in `appdeploy-live/1788795662202/EXPORT_GAPS.json`; no historical snapshot has been substituted for them.

## Why broad redesign stays blocked

Starting from `main` would risk reintroducing an August composition root, losing the production backend and scheduler, and silently dropping current source-only UI/data/provenance behavior. Starting from only the 11-file partial export would also be unsafe because the current production interface imports a large active component/style/data closure.

## Safe release posture

1. Keep AppDeploy v97 (`1788795662202`) as runtime authority.
2. Preserve v96 (`1788788589415`) as rollback.
3. Keep `7ya.io` and `www.7ya.io` bindings unchanged.
4. Continue exact materialization of v97 on the reconciliation branch.
5. Do not set `full_runtime_tree_export_complete=true` until every runtime path has been captured exactly or otherwise proven byte-equivalent.
6. Do not merge or deploy this branch as a replacement runtime; it is a provenance/reconciliation branch.
7. Begin the sweeping Igor Public Identity implementation only from a reconciled runtime baseline, not from stale `main` runtime files.

## Current production health at freeze

- AppDeploy: `ready`
- frontend errors: 0
- network errors: 0
- backend errors: 0
- E2E: not run / not claimed
- active scheduler jobs: `agent-mesh-hourly` and `meta-sync-hourly`, last status `success`
- `7ya.io`: active AppDeploy binding
- `www.7ya.io`: active AppDeploy binding
- production mutation during Release Zero: **none**
