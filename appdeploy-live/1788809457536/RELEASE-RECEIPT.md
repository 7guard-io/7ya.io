# AppDeploy v97 Source Capture Receipt

- App: `697a008fddc309b142`
- Version: `v97`
- Snapshot: `1788809457536`
- Version timestamp: `2026-09-07T19:30:57.536Z`
- Capture observation: `2026-09-07T19:31:36.579Z`
- Capture branch: `refactor/controlled-reconstruction-20260907`
- Canonical main baseline: `f048a13b214e9585f40662c1316817625339b732`
- Runtime status at capture: **ready**
- Frontend errors at capture: **0**
- Network errors at capture: **0**
- Backend errors at capture: **0**
- Active source schedulers: `agent-mesh-hourly`, `meta-sync-hourly`
- E2E claim: **not run / not claimed**
- Production mutation: **none**
- Purpose: immutable source capture before controlled reconstruction

## Baseline transition

The original reconstruction plan referenced AppDeploy snapshot `1788806726940`. During execution AppDeploy advanced, and fresh version evidence reclassified that snapshot as `v96`. The current `v97` authority became `1788809457536`.

The capture therefore follows the newly current v97 snapshot rather than incorrectly freezing the older snapshot as production authority.

## Runtime-relevant capture scope

The required capture scope is:

- `src/**`
- `backend/**`
- `shared/**`
- `scripts/**`
- `tests/**`
- `public/**`
- `index.html`
- `package.json`
- `postcss.config.js`
- `tailwind.config.js`
- `tsconfig.json`
- `vite.config.ts`
- `cron.json`
- inspected non-secret provider configuration where explicitly classified

`shared/**` is mandatory because both the backend and localized-page build script import it directly.

## Safety boundary

This directory is provenance evidence. It is **not** an alternate production root and must not be deployed directly over `7ya.io`.

No secret values, provider session state or private connector data may be captured. Binary assets remain incomplete until individually captured or verified against canonical GitHub assets and classified in `CAPTURE-MANIFEST.json`.

`captureComplete` remains false until the complete runtime source, hashes and binary classifications pass the Phase A+B reconstruction gate.