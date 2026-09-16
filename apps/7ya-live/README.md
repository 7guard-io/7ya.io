# 7YA live application

This directory is the canonical destination for the live 7YA application source.

## Production baseline

- Canonical repository: `7guard-io/7ya.io`
- Current production runtime during migration: AppDeploy app `697a008fddc309b142`
- Frozen source target: AppDeploy version `1789293197999` (v69)
- Production domains remain on AppDeploy until parity and cutover gates pass.
- The repository-root static/history material is **not** authoritative runtime source for the current AppDeploy application.

## Hard migration rules

1. Do not deploy stale GitHub runtime code over the current AppDeploy production application.
2. Do not change DNS or detach `7ya.io` / `www.7ya.io` until a parallel deployment passes build, route, API, mobile, desktop and rollback acceptance.
3. Do not begin behavioral refactors inside this workspace until `.source/export-state.json` reports `exportComplete: true` and a complete SHA-256 source manifest has been committed.
4. Git is the only long-term source of truth. Direct production-only edits are forbidden after cutover.
5. AppDeploy-specific SDK dependencies must be removed behind explicit adapters before AppDeploy can be retired.
6. Canon, Discovery and owner-approved media provenance boundaries remain intact during migration.
7. Generic or synthetic imagery must never replace missing documentary personal media.

## Target release flow

`SOURCE -> Git -> tests -> preview -> visual QA -> production -> rollback-ready`

The migration plan is documented at `docs/superpowers/plans/2026-09-16-7ya-replacement-architecture.md`.
