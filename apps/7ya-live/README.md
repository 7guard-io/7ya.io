# 7YA Live Application

This directory is the migration target for the canonical live 7YA application.

## Canonical ownership

- Canonical repository: `7guard-io/7ya.io`
- Production AppDeploy app: `697a008fddc309b142`
- Pinned production source version: `1789293197999` (v69)
- Target hosting runtime: Vercel project `prj_4aaG2FZcGR9tagwE7FfEBGO9yQOt` in team `team_iNIgNZ4YWL66QZRdZn2IihaL`

## Hard migration gate

Do **not** deploy this workspace to the `7ya.io` production domain until the complete AppDeploy source snapshot has been reconstructed here and byte/source parity has been verified.

The historical repository root, `appdeploy-live/*` release ledgers and the old `vepretski/7ya.io` Vercel connection are not authoritative runtime source.

## Required release flow after parity

`SOURCE -> Git -> tests -> preview -> visual QA -> production`

Direct production edits are prohibited after cutover. Every production change must be represented in Git and pass preview/mobile/desktop acceptance first.

## Migration status

- Branch isolation: active (`migration/appdeploy-baseline-20260916`)
- AppDeploy production: unchanged
- Vercel production cutover: blocked until parity
- Domain/DNS: unchanged
- Source export: in progress

The goal is zero critical runtime dependency on AppDeploy before the final DNS cutover.
