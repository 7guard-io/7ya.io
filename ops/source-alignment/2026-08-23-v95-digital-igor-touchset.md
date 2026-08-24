# 7YA v95 Digital Igor touch-set

Recorded before the first Digital Igor TDD deployment on 2026-08-23.

## Immutable runtime baseline
- AppDeploy app: `697a008fddc309b142`
- Applied version name: `v95`
- Applied source snapshot: `1787467519973`
- Terminal state before changes: `ready`
- Runtime errors before changes: 0 frontend / 0 backend / 0 network
- Current-version E2E state before changes: `not_found`
- Immediate rollback target: `v94`

## Files in the first implementation slice
- `tests/tests.txt`
- `src/StoryCompanion.tsx`
- `backend/index.ts`

The authoritative pre-change bytes remain immutable in AppDeploy source snapshot `1787467519973`; no broad source-tree overwrite is permitted from GitHub while repository/runtime reconciliation remains incomplete.

## RED → GREEN contract
1. Deploy tests first, with Digital Igor identity/disclosure/provenance expectations, against unchanged v95 implementation.
2. Confirm the new test fails for the expected product-contract reason.
3. Change only the minimum implementation files needed to satisfy the new contract.
4. Require desktop and mobile E2E plus current-version visual QA before calling the slice complete.
5. Preserve the previous AppDeploy version as rollback until GitHub/runtime reconciliation is complete.
