# AppDeploy Source-Truth Reconciliation Design

## Status

Approved by the product owner on 2026-08-29 for implementation on an isolated branch. This design does not authorize production deployment or merge to `main`.

## Problem

`7guard-io/7ya.io` is the canonical governance and review repository, but the active 7YA production runtime has evolved inside AppDeploy and has not been atomically reconciled back into the GitHub application tree. The repository also retains large legacy material inherited from the `generative-ai-for-beginners` template and multiple historical/one-time GitHub Actions workflows.

As of 2026-08-29, the verified active AppDeploy app is `697a008fddc309b142`, snapshot `1788005385311` (AppDeploy label `v98`). AppDeploy reports `ready` with zero current frontend and backend errors. The canonical domain and `www` host are active on AppDeploy. The runtime's `public/release.json` identifies build marker `7ya-cinematic-os-20260828-v1` and source alignment `APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT`.

The GitHub governance files are stale: `AGENTS.md` still names an older AppDeploy version and `docs/CONTROL_PLANE_STATE.json` points to an August 24 snapshot. In addition, the active workflow directory contains historical/one-time workflows that violate the repository's own `scripts/check-workflows.mjs` allowlist, making the release gate structurally inconsistent.

## Goal

Restore one unambiguous control plane without risking a rollback of the live 7YA site.

The repository must truthfully describe the live AppDeploy snapshot, quarantine stale deployment automation, preserve rollback/provenance, and create a deterministic path to a later atomic runtime export. Legacy GenAI curriculum deletion is intentionally deferred until the active runtime tree has been fully exported and compared.

## Non-goals

- No production deployment in this change.
- No AppDeploy source overwrite.
- No DNS mutation.
- No visual redesign.
- No deletion of the GenAI curriculum in this first safety patch.
- No claim that GitHub `main` is deployable production source until a full runtime export and reconciliation is complete.

## Architecture

### 1. Production authority

AppDeploy app `697a008fddc309b142`, snapshot `1788005385311`, remains runtime authority for the current public site. GitHub remains governance/review authority.

Until full export completes, the source-alignment state remains:

`APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT`

### 2. Governance truth

`AGENTS.md` and `docs/CONTROL_PLANE_STATE.json` must agree on:

- provider: AppDeploy v2;
- app id: `697a008fddc309b142`;
- verified snapshot: `1788005385311`;
- AppDeploy label: `v98`;
- build marker: `7ya-cinematic-os-20260828-v1`;
- current production receipt: `docs/deployments/2026-08-29-linkedin-impact-discovery-v1.md`;
- source export incomplete;
- no direct deployment from the legacy GitHub application tree.

The newest independently verified receipt wins if later metadata conflicts.

### 3. Workflow quarantine

The active workflow directory must match the existing governed allowlist in `scripts/check-workflows.mjs`:

- `actions-smoke.yml`
- `ci.yml`
- `digital-museum-collector.yml`
- `pages.yml`

Historical one-time production mutation or stale compatibility workflows are removed from `.github/workflows/` so they cannot trigger from future pushes. Git history preserves them; deletion from the active workflow directory is a quarantine action, not destruction of provenance.

The workflows quarantined by this patch are:

- `cloudflare-appdeploy-dns-apply-once.yml` — completed one-time DNS cutover with obsolete build marker;
- `cloudflare-appdeploy-dns-preflight.yml` — useful historical safety workflow but outside the current workflow contract and tied to the old cutover path;
- `entity-consistency.yml` — operates on the legacy static tree and currently violates the workflow quarantine rules;
- `jekyll-gh-pages.yml` — generic Jekyll sample workflow added on 2026-08-29 and already failing;
- `meta-ai-discovery-enable.yml` — one-time production Cloudflare mutation path that should not re-run automatically from `main`.

The underlying scripts, receipts and Git history are preserved.

### 4. Runtime export checkpoint

A reconciliation record is added for snapshot `1788005385311`, documenting the observed AppDeploy tree categories (backend, shared, React/Vite source, public routes, cron, tests and configuration) and explicitly recording that the complete file-content export is still pending.

No root application replacement is permitted until the runtime export is complete and compared by path, content, routes, privacy and evidence behavior.

### 5. Legacy curriculum cleanup gate

The GenAI curriculum and translations may be removed only after all of the following are true:

1. Full AppDeploy runtime tree is exported to an isolated GitHub branch.
2. Runtime source and GitHub application paths are compared.
3. No active runtime source imports or serves the course tree.
4. The reconciled application passes the repository release gate.
5. A rollback reference to the pre-cleanup commit is recorded.

## Validation

This patch is considered code-complete when repository-level deterministic inspection proves:

- governance files name snapshot `1788005385311` and build marker `7ya-cinematic-os-20260828-v1`;
- source reconciliation remains explicitly incomplete;
- the five quarantined workflow files are absent from `.github/workflows/`;
- the remaining workflow filenames equal the allowlist already enforced by `scripts/check-workflows.mjs`;
- AppDeploy still reports `ready` and no frontend/backend errors;
- canonical AppDeploy domains remain active;
- no production deployment was initiated.

`npm run release:gate` must be run before merge when a network-capable checkout is available. If it cannot run because the execution environment cannot resolve GitHub, no PASS may be claimed.

## Rollback

Rollback for this branch is deletion of the branch or reversion of its commits. Production is unaffected because this design explicitly forbids AppDeploy apply/deploy and DNS mutation.