# AppDeploy release receipt — 1788355500964

- App ID: `697a008fddc309b142`
- AppDeploy version: `v97`
- Snapshot: `1788355500964`
- Date: `2026-09-02`
- Status after deployment: `READY`
- Runtime QA: `0 frontend / 0 backend / 0 network errors`
- Change: localized-link consistency only.
- Exact changed files mirrored in this ledger directory: `src/locale.tsx`, `tests/tests.txt`.
- The change makes generated home links agree with the clean static homepage URLs `/`, `/en/`, `/ru/`, and avoids redundant `lang=he` on clean Hebrew room links.

## Safety boundary

This receipt does **not** declare GitHub `main` reconstructable as the complete production source. Earlier AppDeploy deltas remain incompletely exported. AppDeploy remains runtime source of truth and `github_runtime_deploy_safe` must stay false until a complete atomic mirror is verified.
