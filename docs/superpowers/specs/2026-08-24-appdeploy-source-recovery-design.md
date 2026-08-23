# 7YA AppDeploy Source Recovery — Design

Date: 2026-08-24
Status: APPROVED FOR EXECUTION
Owner: Igor Vepretski / 7YA

## Goal

Establish one auditable production truth for 7ya.io by freezing the AppDeploy runtime, preserving its executable source in GitHub without blindly overwriting the older root application, correcting contradictory control-plane metadata, and closing the known `/journey/` critical-route gap.

## Frozen production baseline

- AppDeploy app id: `697a008fddc309b142`
- Frozen snapshot: `1787521286005`
- Snapshot timestamp: `2026-08-24 00:41:26 Asia/Jerusalem`
- AppDeploy display label at capture: informational only; `vNN` labels are rolling and are not immutable provenance.
- Production domains: `7ya.io`, `www.7ya.io`
- Recovery branch: `recovery/appdeploy-1787521286005`
- Base GitHub commit: `c4ca90dcf150fce007bfa1178f9280c1454ecd78`

The frozen snapshot is a recovery baseline, not a claim that later AppDeploy snapshots do not exist. Every production-changing deploy must be tied to its immutable snapshot id.

## Root cause

The live AppDeploy application and GitHub `main` are structurally different. Production contains a React/Vite life-first application, an AppDeploy backend, shared canon/graph modules and `src/life-first/*` files that are absent or older in the current root GitHub tree. Repository governance was also contradictory: `AGENTS.md` identified AppDeploy as current production but carried a stale snapshot, while `docs/CONTROL_PLANE_STATE.json` still described an obsolete Vercel control plane.

Production also carried multiple global release identifiers simultaneously:

- frontend `src/App.tsx`;
- backend `backend/index.ts`;
- homepage `index.html` metadata;
- `public/release.json`.

Finally, `/journey/` was listed as a critical public route while `public/journey/` did not exist in the frozen production snapshot.

## Actual runtime architecture

Observed backend entrypoint and backend files:

- `backend/index.ts` — AppDeploy router entrypoint and public-discovery orchestration;
- `backend/corpus-store.ts`;
- `backend/counter.ts`;
- `backend/evidence-ingestion.ts`;
- `backend/growth.ts`;
- `backend/life-scenes.ts`;
- `backend/realtime-subscribers.ts`;
- `backend/realtime.ts`.

Observed shared modules:

- `shared/canonical-corpus.ts`;
- `shared/canonical-entities.ts`;
- `shared/content-graph.ts`;
- `shared/evidence-first-ingestion.ts`;
- `shared/life-scenes.ts`;
- `shared/media-impact.ts`;
- `shared/public-internet-graph.ts`;
- `shared/public-register-canon.ts`;
- `shared/recovered-publications.ts`.

There is no `backend/server.ts`, `shared/canon.ts` or `shared/publicDiscovery.ts` in the frozen runtime. Any earlier plan reference to those paths is superseded by this corrected architecture.

## Recovery architecture

### 1. Preserve before replacing

Do not overwrite the existing GitHub root application wholesale. Preserve immutable runtime evidence under:

`appdeploy-live/<snapshot>/`

Text files are copied exactly where practical. Large/binary public resources remain a separate parity gate unless copied explicitly. Partial preservation must be labeled partial.

### 2. Separate three truths

The repository must distinguish:

- **Runtime truth** — exact AppDeploy snapshot and deployment status.
- **Repository truth** — what is committed to GitHub.
- **Canonical/evidence truth** — public claims and verification state.

No metadata may imply these are identical until parity is verified.

### 3. Repair governance before cutover

`AGENTS.md` and `docs/CONTROL_PLANE_STATE.json` must identify AppDeploy as current production, the immutable snapshot as runtime provenance, and Vercel as historical only. `main` remains non-deployment-identical until parity review completes.

### 4. Route contract repair via TDD

`/journey/` is a critical route. Add the route expectation before production code, verify structurally that it is absent in the pre-repair snapshot, then add a crawlable native route. No meta-refresh. AppDeploy currently reports `e2e_tests=null`, so do not claim an executable RED/PASS when the provider does not report one.

### 5. Global release metadata reconciliation

One global production release identifier must agree across:

- `src/App.tsx`;
- `backend/index.ts` and `/api/release`/health surfaces derived from it;
- `index.html` release/build metadata;
- `public/release.json`;
- newly created critical route metadata where relevant.

Historical subsystem/component release identifiers may remain distinct when they describe bounded artifacts; do not rewrite provenance just to make strings uniform.

## Initial recovery scope

Critical preservation/review targets include at minimum:

- `package.json`;
- `vite.config.ts`;
- `index.html`;
- `src/App.tsx`;
- `src/life-first/LifeFirstHome.tsx`;
- `src/life-first/AutobiographicalCinema.tsx`;
- `src/life-first/HundredMoments.tsx`;
- `backend/index.ts`;
- the observed backend modules listed above;
- `shared/canonical-corpus.ts`;
- `shared/public-internet-graph.ts`;
- the remaining observed shared modules listed above;
- `tests/tests.txt`;
- `public/release.json`;
- relevant public binary/resources inventory.

The manifest must state whether full text-source parity and binary-resource parity have been achieved. Until then, this is a **recovery foundation**, not a cutover candidate.

## Acceptance gates

1. Frozen AppDeploy baseline recorded with exact app id, immutable snapshot and timestamp.
2. Recovery branch exists; no direct `main` overwrite.
3. Immutable runtime evidence is preserved under snapshot paths in GitHub, with partial/full parity stated explicitly.
4. `AGENTS.md` and control-plane state no longer identify obsolete Vercel state as current production.
5. `/journey/` exists as a crawlable native critical route with no meta-refresh.
6. Global release identity is internally consistent after the repair deploy.
7. Fresh AppDeploy QA returns terminal `ready` with zero frontend, network and backend errors.
8. Desktop and mobile QA captures are generated after the repair deploy.
9. `7ya.io` and `www.7ya.io` remain active custom domains.
10. A release receipt records before/after immutable snapshots and remaining parity debt.
11. A recovery PR may be opened, but no merge/cutover occurs until parity and review gates are satisfied.

## Non-goals

- No Supabase migration in this slice.
- No Windsor.ai ingestion in this slice.
- No vidIQ ingestion in this slice.
- No new impact/reach claims.
- No broad visual redesign.
- No claim of full source parity unless inventory proves it.
- No Vercel cutover.

## Next gate after this slice

Complete remaining text and binary-resource parity, compare the recovered AppDeploy application tree against the older root GitHub application, choose the canonical GitHub application path, and only then make deployment consume reviewed GitHub source rather than an AppDeploy-only runtime.