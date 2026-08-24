# 7YA AppDeploy frozen recovery baseline

- AppDeploy app id: `697a008fddc309b142`
- Immutable snapshot: `1787521286005`
- Snapshot time: `2026-08-24 00:41:26 Asia/Jerusalem`
- Recovery branch: `recovery/appdeploy-1787521286005`
- GitHub base commit: `c4ca90dcf150fce007bfa1178f9280c1454ecd78`
- Production domains at recovery start: `7ya.io`, `www.7ya.io`

## Why this snapshot exists

This is the frozen **pre-repair runtime baseline** used to recover production truth. It is not a claim that GitHub was deployment-identical at this point. The AppDeploy application contained a React/Vite frontend, AppDeploy backend, shared canon/graph modules and `src/life-first/*` source that were structurally absent or older in the GitHub root tree.

## Verified baseline defects

1. `/journey/` was listed as a critical route but `public/journey/` did not exist.
2. Global release identity was contradictory:
   - `src/App.tsx`: `7ya-life-atlas-100-primary-20260824-1`
   - `backend/index.ts`: `7ya-orchestrator-nvidia-super-20260824-1`
   - `index.html` / `public/release.json`: `7ya-spanish-visual-polish-20260823-1`
3. `docs/CONTROL_PLANE_STATE.json` in GitHub still described a historical Vercel control plane.
4. `AGENTS.md` identified AppDeploy as current production but carried a stale verified snapshot.

## Preservation status

This directory is a **recovery foundation**, not a complete runtime export. Exact critical frontend/runtime text and recovery manifests are preserved where copied. The complete backend/shared tree and binary resource parity remain separate gates until explicitly marked complete in `recovery-manifest.json`.

Do not promote this directory to the canonical application root by bulk-copying it. Compare routes, privacy, provenance and public content first.

## Repair successor

The production-truth repair produced immutable AppDeploy snapshot `1787521959471`, release `7ya-production-truth-20260824-1`. The exact repair delta is preserved under `appdeploy-live/1787521959471/` and documented in `docs/releases/2026-08-24-production-source-recovery.md`.