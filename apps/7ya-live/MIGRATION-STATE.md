# 7YA Live Migration State

## Current state

- Production domain: `7ya.io`
- Current production provider: AppDeploy
- Current production app: `697a008fddc309b142`
- Current pinned runtime source: `1789293197999` (v69)
- Canonical Git repository: `7guard-io/7ya.io`
- Migration branch: `migration/appdeploy-baseline-20260916`
- Target runtime: Vercel Pro team `7ya`, project `7ya.io`

## Confirmed facts

1. AppDeploy production is healthy and remains untouched during migration.
2. AppDeploy direct deploy capacity is exhausted at 400/400, so AppDeploy cannot be the long-term change pipeline.
3. Existing `appdeploy-live/*` history is a release/delta ledger, not a complete runtime source mirror.
4. `appdeploy-live/CURRENT.json` explicitly marks GitHub runtime deployment unsafe until a complete source export exists.
5. The existing Vercel `7ya.io` project is not the active production site and is currently linked to the wrong repository (`vepretski/7ya.io`).

## Hard gate

No DNS change, Vercel production promotion, or AppDeploy shutdown is allowed until all of the following are true:

- complete AppDeploy v69 source is present under `apps/7ya-live/`;
- source manifest contains real SHA-256 digests for every exported file;
- `npm install` and `npm run build` succeed from `apps/7ya-live/`;
- API route inventory is reconciled;
- AppDeploy-specific database/storage/auth/realtime/AI/cron dependencies have migration adapters or replacements;
- mobile and desktop preview acceptance passes;
- previous production target remains available for rollback.

## Immediate blocker

The connected AppDeploy MCP exposes per-file `src_glob`, `src_read` and `src_grep`, but does not expose the platform's bulk ZIP source-export action in this ChatGPT session. AppDeploy documentation states bulk source export is available, so the next safe step is to obtain the v69 bulk export and commit it byte-for-byte into this workspace before any behavioral refactor.

## Production safety rule

Until the gate passes, `7ya.io` continues to run on AppDeploy. Do not deploy repository-root legacy/static content or the old Vercel-linked repository over production.
