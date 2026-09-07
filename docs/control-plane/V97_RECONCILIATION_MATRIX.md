# AppDeploy v97 → GitHub Reconciliation Matrix

Observed: 2026-09-07

Production snapshot: `1788788589415` (v97)
Canonical engineering repository: `7guard-io/7ya.io`
Branch: `control/sovereign-control-plane-v1-20260907`

## Verified finding

The current production runtime is materially ahead of the root runtime represented by GitHub `main`. This is not release-label drift only.

The complete AppDeploy v97 tree was enumerated through the provider source snapshot. It contains a full React/Vite runtime, backend application, canonical corpus, ingestion logic, media model, localized static routes, life-first experiences, evidence/search/library surfaces and provider adapters.

GitHub also contains historical `appdeploy-live/<snapshot>/...` recovery material, but those archived snapshots are older than current v97 and are not current production authority.

## First runtime-critical classifications

| Path | AppDeploy v97 | GitHub root `main` | Classification | Reason |
|---|---|---|---|---|
| `src/App.tsx` | Present; release `7ya-sovereign-recovery-20260905-v3-globalfix`; lazy routed DocumentaryHome / Library / Evidence / Search / StartOn / Life systems | Present, but materially older release `7ya-intellectual-research-spine-20260815-1` and older routing/runtime composition | **PORT** | Same path, different application generation. Production behavior cannot be reproduced from root `main`. |
| `backend/index.ts` | Present | Not found at root | **PORT** | Production backend entry point is absent from canonical root. |
| `shared/canonical-corpus.ts` | Present; schema v2, verification/visibility/source/media/metric model and canonical seed | Not found at root | **PORT** | Production canon contract is absent from canonical root. |
| `public/release.json` | Present; declares AppDeploy remote snapshot source of truth and full export pending | Not found at root | **PORT** | Production release identity is not represented as a root artifact in canonical source. |
| `package.json` | React 19 + Vite 6 application; AppDeploy runtime build | Different `7ya-io` Node/static/evidence toolchain with Netlify/Vercel deployment scripts | **PORT / RECONCILE** | Root and production describe different executable systems; replacing one with the other would be unsafe. |

## Production-only surface groups discovered in v97

These groups require systematic path-by-path reconciliation before any attempt to make GitHub deployment-identical:

- `backend/*` — corpus, evidence ingestion, growth, life scenes, realtime, NVCF and Meta adapters.
- `shared/*` — canonical corpus/entities, content graph, evidence-first ingestion, impact models, recovered media/publications, public register and social ingest.
- `src/documentary-home/*` — current public front door.
- `src/life-first/*` — Life Broadcast, Hundred Moments, chronology, evidence strips, media clusters, StartOn, research, social agent mesh and related experiences.
- `src/life-album/*` and `src/album/*` — moment/life projection systems.
- `src/personal-internet/*` — system/graph/pulse/people/place projection layer.
- `src/platforms/*` — connected-platform registry/surface.
- `src/*` media/evidence/library/search/entity/corpus surfaces.
- `scripts/ingest_media.py` and localized-page generation.
- public localized routes and machine-readable evidence/media artifacts.

## Important architectural observation

The v97 canonical corpus already contains a useful trust vocabulary:

- verification: `verified | supported | inferred | owner-reported | unresolved | contradicted | quarantined`
- visibility: `public | restricted | private`
- explicit source kind and public flag
- explicit media authenticity
- dated metric snapshots with verification status
- public query filtering that excludes non-public events

This production contract should be recovered rather than reinvented. It should then be reconciled with the newer Evidence Atoms / Living Intelligence work already merged into GitHub.

## Merge principle

Do **not** simply copy the entire v97 tree on top of `main`.

The correct convergence operation is:

1. Recover production runtime-critical paths.
2. Preserve newer GitHub-only Evidence Oracle / Living Intelligence work.
3. Define adapters between Evidence Atoms and canonical public projections.
4. Remove duplicate sources of truth.
5. Test a single reproducible tree.
6. Only then make a deployment candidate.

## Release provenance upgrade

External research against the SLSA provenance model supports making release identity artifact-bound rather than relying on mutable release names. The future release receipt should bind at minimum:

- canonical repository URI
- source commit SHA
- builder/provider identity
- build type
- resolved dependencies where available
- immutable artifact/source-tree digest
- deployment snapshot/version
- verification results and byproducts
- rollback artifact identity

This is an engineering adaptation of SLSA provenance concepts, not a claim that 7YA currently satisfies a specific SLSA level.

## Current gate

`PRODUCTION_SOURCE_ALIGNED = false`

No production replacement from GitHub is allowed until all runtime-critical **PORT** items are resolved and the resulting tree passes the full release state machine.
