# 7YA AppDeploy Source Recovery — Design

Date: 2026-08-24
Status: APPROVED FOR EXECUTION
Owner: Igor Vepretski / 7YA

## Goal

Establish one auditable production truth for 7ya.io by freezing the current AppDeploy runtime, preserving its executable source in GitHub without overwriting the older root application blindly, correcting contradictory control-plane metadata, and closing the known `/journey/` critical-route gap.

## Frozen production baseline

- AppDeploy app id: `697a008fddc309b142`
- AppDeploy version label: `v98`
- Frozen snapshot: `1787521286005`
- Snapshot timestamp: `2026-08-24 00:41:26 Asia/Jerusalem`
- Production domains: `7ya.io`, `www.7ya.io`
- Recovery branch: `recovery/appdeploy-1787521286005`
- Base GitHub commit: `c4ca90dcf150fce007bfa1178f9280c1454ecd78`

The frozen snapshot is a recovery baseline, not a claim that later AppDeploy snapshots do not exist. Any later deploy must produce a new immutable receipt.

## Root cause

The live AppDeploy application and GitHub `main` are structurally different. Production contains a React/Vite life-first application, backend code, shared canon/discovery modules and `src/life-first/*` files that are absent from the current root GitHub application tree. Meanwhile repository governance contains contradictory production records: `AGENTS.md` identifies AppDeploy as current production but carries an old verified snapshot, while `docs/CONTROL_PLANE_STATE.json` still describes an obsolete Vercel control plane.

A second integrity defect exists inside production metadata: `src/App.tsx` and `public/release.json` do not identify the same release. A third defect is contractual: `/journey/` is listed as a critical public route but no `public/journey/` route exists in the frozen production snapshot.

## Recovery architecture

### 1. Preserve before replacing

Do not overwrite the existing GitHub root application wholesale. First preserve the frozen AppDeploy runtime under:

`appdeploy-live/1787521286005/`

The recovery snapshot must contain enough exact source to reproduce and review the active execution architecture, with an inventory/provenance manifest. Text files are copied byte-for-byte from AppDeploy where practical. Large/binary public resources are inventoried and remain a separate parity gate unless copied explicitly.

### 2. Separate three truths

The repository must distinguish:

- **Runtime truth** — exact AppDeploy snapshot and deployment status.
- **Repository truth** — what is committed to GitHub.
- **Canonical/evidence truth** — public claims and their verification status.

No release metadata may imply these are identical until parity is actually verified.

### 3. Repair governance before cutover

Update `AGENTS.md` and `docs/CONTROL_PLANE_STATE.json` on the recovery branch so future agents cannot mistake the historical Vercel projection for current production. Historical records remain preserved but are explicitly non-authoritative.

### 4. Route contract repair via TDD

`/journey/` is a critical route. Add the failing route expectation before production code, verify it fails against snapshot `1787521286005`, then add a crawlable native route. No meta-refresh. The route must lead into the actual 7YA life journey and preserve language-aware navigation.

### 5. Release metadata reconciliation

The active application must expose one release identifier across `src/App.tsx`, `public/release.json`, health/diagnostics surfaces and deployment receipt. The recovery baseline itself must never be retroactively relabeled as a later deploy.

## Initial recovery scope

Critical executable/runtime preservation includes at minimum:

- `package.json`
- `vite.config.ts`
- `index.html`
- `src/App.tsx`
- `src/life-first/LifeFirstHome.tsx`
- `src/life-first/AutobiographicalCinema.tsx`
- `src/life-first/HundredMoments.tsx`
- `backend/index.ts`
- `backend/server.ts`
- `shared/canon.ts`
- `shared/publicDiscovery.ts`
- `tests/tests.txt`
- `public/release.json`

The manifest must explicitly state whether complete text-source parity and binary-resource parity have been achieved. Until then, the branch is a **recovery foundation**, not a production cutover candidate.

## Acceptance gates

1. Frozen AppDeploy baseline is recorded with exact app id, snapshot and timestamp.
2. Recovery branch exists and no direct `main` overwrite occurs.
3. Critical live source is preserved under the immutable snapshot path in GitHub.
4. `AGENTS.md` and control-plane state no longer identify obsolete Vercel state as current production.
5. `/journey/` exists as a crawlable native critical route and passes the route QA expectation.
6. Release metadata is internally consistent after the repair deploy.
7. Fresh AppDeploy QA returns terminal `ready` with zero frontend, network and backend errors.
8. Desktop and mobile QA captures are generated after the repair deploy.
9. `7ya.io` and `www.7ya.io` remain active custom domains.
10. A release receipt records before/after snapshots and explicitly lists remaining parity debt.
11. A PR from the recovery branch to `main` may be opened, but `main` is not merged until parity/review gates are satisfied.

## Non-goals

- No Supabase migration in this slice.
- No Windsor.ai ingestion in this slice.
- No vidIQ ingestion in this slice.
- No new impact/reach claims.
- No broad visual redesign.
- No claim of full source parity unless the inventory proves it.
- No Vercel cutover.

## Next gate after this slice

Complete remaining text/binary source parity, compare the recovered application tree against the older root application, choose the canonical GitHub application path, then make deployment consume the reviewed GitHub source rather than an untracked AppDeploy-only runtime.