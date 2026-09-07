# Controlled Reconstruction Phase A+B — Amendment 1

**Date:** 2026-09-07  
**Applies to:** `docs/superpowers/plans/2026-09-07-controlled-reconstruction-phase-a-b.md`  
**Spec:** `docs/superpowers/specs/2026-09-07-controlled-reconstruction-design.md`

## Reason for amendment

Execution-time source inspection proved that `shared/**` is runtime/build-critical and was omitted from the initial Phase A+B capture list.

Observed direct dependencies include:

- `scripts/generate-localized-pages.mjs` → `shared/recovered-media.json`
- `backend/index.ts` → `shared/media-impact`
- `backend/index.ts` → `shared/recovered-media`
- `backend/index.ts` → `shared/canonical-corpus`
- `backend/index.ts` → `shared/content-graph`
- `backend/index.ts` → `shared/public-internet-graph`
- `backend/index.ts` → `shared/canonical-entities`
- `backend/index.ts` → `shared/evidence-first-ingestion`

A source capture that excludes `shared/**` cannot reproduce the current AppDeploy build/backend runtime and must not be called complete.

## Mandatory correction

Every Phase A+B instruction referring to the runtime-relevant capture set is amended to include:

```text
shared/**
```

The immutable capture target therefore includes:

```text
appdeploy-live/1788806726940/src/**
appdeploy-live/1788806726940/backend/**
appdeploy-live/1788806726940/shared/**
appdeploy-live/1788806726940/scripts/**
appdeploy-live/1788806726940/tests/**
appdeploy-live/1788806726940/public/**
appdeploy-live/1788806726940/index.html
appdeploy-live/1788806726940/package.json
appdeploy-live/1788806726940/postcss.config.js
appdeploy-live/1788806726940/cron.json
```

`CAPTURE-MANIFEST.json.includedTextRoots` must be:

```json
["src", "backend", "shared", "scripts", "tests", "public"]
```

The capture completeness checker must require at minimum these additional files:

```text
shared/recovered-media.json
shared/media-impact.ts
shared/canonical-corpus.ts
shared/content-graph.ts
shared/public-internet-graph.ts
shared/canonical-entities.ts
shared/evidence-first-ingestion.ts
```

If actual file extensions or paths differ in the applied snapshot, use the exact paths returned by AppDeploy inventory and update the required list accordingly.

## Drift classification correction

`shared/**` is runtime-critical. Any non-identical `shared/**` path must be classified under the same rules as `src/**`, `backend/**`, `scripts/**`, `cron.json` and build configuration. An unresolved runtime-critical `shared/**` difference blocks completion of Phase A+B.

## Scope remains unchanged

This amendment does **not** authorize:

- copying the capture into active root runtime paths;
- refactoring frontend/backend code;
- deploying the branch;
- changing public UX;
- changing AppDeploy production.

Phase A+B remains capture + reconciliation + deterministic safety contracts only.