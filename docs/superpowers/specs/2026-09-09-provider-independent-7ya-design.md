# 7YA Provider-Independent Architecture Design

Date: 2026-09-09
Status: Design approved in chat; implementation not yet started
Owner: Igor Vepretski
Canonical repository: `7guard-io/7ya.io`

## Goal

Make 7YA independent of any single hosting/deployment vendor while preserving the current public experience, content corpus, backend capabilities, analytics, secrets, rollback paths, and custom domain.

The system must no longer allow a vendor-specific deploy limit, routing defect, or disconnected preview environment to block visible progress on `7ya.io`.

## Design principles

1. One canonical source repository.
2. Provider-neutral application interfaces.
3. One primary production host and one verified failover host.
4. No DNS cutover without parity and rollback evidence.
5. A deployment is not considered successful until the public domain is independently verified.
6. Secrets remain provider-side; no secret values are committed or copied into documentation.
7. Static public content must remain available even if all dynamic runtimes fail.

## Target architecture

### Canonical source

`7guard-io/7ya.io` becomes the only canonical repository for production source, release manifests, public data schemas, deployment configuration, and provider adapters.

The first implementation phase reconciles the currently applied AppDeploy snapshot (`1788906120223`) into this repository before any redesign. This prevents losing the most recent production code while eliminating source drift.

The historical repository `vepretski/7ya.io` remains readable as migration evidence but must not be treated as a second production source once reconciliation is complete.

### Primary web runtime: Vercel

Vercel becomes the preferred primary web runtime because a working 7YA project and production build already exist there.

The Vercel project must be repointed to the canonical repository and verified against the reconciled AppDeploy snapshot before any custom-domain cutover.

No custom-domain cutover occurs until:
- the canonical build is READY;
- key routes visually match or intentionally improve the current site;
- public assets load successfully;
- required API contracts pass;
- mobile and desktop checks pass;
- a rollback target is recorded.

### API/runtime layer

Dynamic features use a provider-neutral API contract rather than importing or addressing AppDeploy directly from public application code.

Canonical API contracts include at minimum:
- `/api/health`
- `/api/release`
- `/api/public-projection`
- `/api/visual-registry`
- `/api/social-feed`
- `/api/companion/status`
- Bro Chat inference gateway

Frontend code calls a small runtime client abstraction. Provider-specific SDKs must remain behind adapters.

### Netlify failover

The existing `7ya-api` Netlify project becomes the first failover runtime for provider-neutral API functions.

Required contracts are ported incrementally and tested against the same fixtures as the primary runtime. Netlify must be capable of serving at least health, release, public projection, and emergency read-only content APIs before production cutover is considered complete.

### AppDeploy role

AppDeploy remains a secondary runtime during migration. Its current source snapshot, backend behavior, crons, and rollback history are preserved while equivalents are proven elsewhere.

No destructive AppDeploy migration occurs during the initial cutover. AppDeploy can later remain as:
- secondary runtime;
- cron/worker runtime;
- emergency rollback host;
- historical production reference.

The current `/api/*` ingress defect is not allowed to block the migration.

### Floot role

The existing Floot project remains a recovery/full-stack experimentation environment. It is not a canonical production source and does not own the public domain unless explicitly promoted by a future architecture decision.

### Static emergency layer

A deterministic static build of public, evidence-backed content is published independently of dynamic APIs. GitHub Pages or equivalent static hosting provides an emergency read-only public surface.

The emergency layer includes:
- homepage identity and primary narrative;
- public archive index;
- evidence/source links;
- media and StartOn navigation;
- release marker;
- status notice when dynamic features are unavailable.

## Source reconciliation

The reconciliation phase compares three source families:

1. AppDeploy applied snapshot `1788906120223` — current production behavior.
2. `7guard-io/7ya.io:main` — canonical public-record/governance source.
3. `vepretski/7ya.io:dev` — historical Vercel-linked source.

Files are classified as:
- production-current;
- canonical-newer;
- historical-only;
- provider-specific;
- generated/binary;
- conflict requiring explicit merge.

The reconciliation must preserve production features before deleting or replacing anything.

## Data flow

Public content and evidence are stored as provider-neutral JSON/data artifacts where possible.

Frontend flow:

`browser -> runtime client -> primary API origin -> provider adapter -> data/runtime`

Fallback flow:

`browser -> runtime client -> failover API origin -> provider-neutral contract`

Static fallback flow:

`browser -> static public artifacts` when all dynamic runtimes are unavailable.

Provider selection must not alter public data semantics.

## Release contract

Every deploy emits a release manifest containing:
- release id;
- source commit SHA;
- build timestamp;
- provider;
- schema version;
- public API contract version.

The same release identifier must be observable in the rendered application and through `/api/release`.

A release is accepted only after public verification of:
1. root page;
2. representative nested pages;
3. release marker;
4. API JSON contracts;
5. media loading;
6. mobile layout;
7. desktop layout.

`READY`, a merged PR, a successful CI job, or a provider preview is insufficient by itself.

## Failure handling

### Primary host failure
Switch public traffic only to a previously verified failover release. Never deploy a new unverified build during an incident merely to restore service.

### API failure
Frontend falls back to cached/static public data for non-sensitive read-only surfaces. Dynamic features show explicit degraded status instead of silently presenting stale data as live.

### Provider quota failure
No code changes are required. Deployment continues through the alternate verified runtime.

### Provider-specific SDK failure
The adapter fails without contaminating the provider-neutral domain layer. Contract tests identify the failing adapter.

## Security and secrets

- No raw secret is stored in Git.
- Secrets are mapped by logical names across providers.
- Migration documentation records only env-var names and configuration status.
- Public health endpoints disclose capability state, never secret values.
- Provider-specific credentials are introduced only when the relevant adapter is ready to be tested.

## Testing strategy

### Contract tests
The same tests run against Vercel, Netlify, and AppDeploy where applicable. Responses must match shared schemas.

### Visual acceptance
At least root, media, evidence, StartOn, library/search, and one multilingual route are inspected on mobile and desktop.

### Canary test
Before the custom-domain cutover, one harmless and unmistakable release marker is intentionally changed on the candidate production host. The test passes only when that marker is independently observed on the expected public hostname.

### Rollback test
Before DNS cutover, document and verify the exact rollback destination and release id.

## Migration sequence

1. Inventory and export the current AppDeploy applied source through the available snapshot APIs.
2. Build a file-level reconciliation manifest against both GitHub repositories.
3. Create the reconciled canonical source on the architecture branch.
4. Remove direct frontend dependence on `@appdeploy/client` behind a runtime client abstraction.
5. Establish provider-neutral release/health/public-projection contracts.
6. Deploy the reconciled build to Vercel preview/production hostname without moving `7ya.io`.
7. Port minimum failover APIs to the existing Netlify `7ya-api` project.
8. Run contract and visual parity checks.
9. Record rollback release and domain configuration.
10. Attach/cut over `7ya.io` only after parity is proven.
11. Verify the custom domain independently.
12. Retain AppDeploy as secondary until a stable observation period confirms the new topology.
13. Only then consolidate/deprecate historical deployment paths.

## Explicit non-goals for the first migration

- No broad visual redesign before source parity.
- No deletion of AppDeploy data, secrets, crons, or rollback history.
- No forced migration of every backend capability in one release.
- No new CMS.
- No duplicate source-of-truth repository.
- No DNS switch used as a workaround for an unverified build.

## Success criteria

The migration is complete when:

- `7guard-io/7ya.io` alone can reproduce the current public website;
- Vercel can build and serve the canonical source;
- Netlify can serve the minimum failover API contract;
- public frontend code has no mandatory AppDeploy dependency;
- `7ya.io` can move between verified hosts without rebuilding the application architecture;
- static evidence/public content remains available during runtime failure;
- every release can be traced from public output back to one Git commit;
- no future provider quota or routing failure can prevent development from reaching a verifiable public candidate.
