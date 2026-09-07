# Controlled Reconstruction Phase A+B — Amendment 3

**Date:** 2026-09-07  
**Reason:** AppDeploy exposes `backend/index.ts` through line-window source reads but does not expose a bulk source archive/download action. A direct manual monolithic copy creates an unacceptable truncation risk.

## Decision

The immutable v97 capture may store oversized source files as provider-native line chunks when a monolithic write cannot be verified exactly.

For `backend/index.ts` from AppDeploy snapshot `1788809457536`:

- provider reports `total_lines = 69`;
- capture source in seven ordered windows: offsets `0,10,20,30,40,50,60`, with limits `10,10,10,10,10,10,9`;
- store each returned UTF-8 source window unchanged under `appdeploy-live/1788809457536/backend/index.ts.parts/`;
- store a manifest containing snapshot identity, total lines, ordered part names, offsets and limits;
- add a deterministic reassembly checker before Phase C;
- do **not** create `appdeploy-live/1788809457536/backend/index.ts` unless the assembled bytes can be verified as complete;
- a partial or hand-abbreviated `backend/index.ts` is explicitly invalid and must be absent.

## Safety gate

Phase A remains `NO-GO` while any part is missing, out of order, from another snapshot, or fails source-sentinel verification.

Required source sentinels include:

1. first-window AppDeploy SDK imports;
2. release declaration `7ya-sovereign-recovery-20260905-v3-globalfix`;
3. public backend route `GET /api/health`;
4. content operating map route `GET /api/content-operating-map`;
5. terminal router composition ending with `...realtimeSubscriptionRoutes});`.

This amendment changes archival representation only. It does not modify production, public behavior, API behavior, or the approved Phase A+B scope.
