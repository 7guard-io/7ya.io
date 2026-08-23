# AppDeploy v95 Reconciliation Manifest

Date: 2026-08-23
Status: Phase 0 source-of-truth manifest
App: `697a008fddc309b142`
AppDeploy version: `1787465482461` (`v95`)
AppDeploy build timestamp: 2026-08-23T06:11:22.461Z
Live release marker: `7ya-public-ingestion-20260823-2`
GitHub repository: `7guard-io/7ya.io`
GitHub main observed commit: `ad98380bb1f3b588aa33b7a974ff3eb3b5bda901`
Main commit message: `ops: record home media pipeline hotfix`

## Executive finding

GitHub `main` is not the current application source baseline. The AppDeploy v95 source contains substantial backend/shared/frontend code that is not discoverable in the GitHub default-branch code index. Searches for the exact live release marker `7ya-public-ingestion-20260823-2` and the live DB collection name `canonical_corpus_overlay` returned no matches in `7guard-io/7ya.io`.

The live backend itself reports source alignment as:

`APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT`

Therefore vNext implementation must not start by replacing `main/src` or copying selected v95 files by hand. The entire AppDeploy source snapshot must be reconciled into version control as one baseline commit first.

## Live v95 toolchain

`package.json` observed from v95:

```text
React 19
React DOM 19
Vite 6
TypeScript 5.7
Tailwind CSS 3.4
lucide-react 0.469
scripts: dev / build / preview
```

The current v95 package does not expose an automated unit-test script. The current `tests/tests.txt` is a four-case browser acceptance document centered on the Ninja journey layer.

## Live v95 backend capabilities that must survive reconciliation

### Canonical memory

- `backend/corpus-store.ts`
- `shared/canonical-corpus.ts`
- DB overlay collection: `canonical_corpus_overlay`
- Current storage model: `seed+public-register+db-overlay`
- Current overlay read limit: 100 records
- Canonical corpus release: `CANONICAL-CORPUS-20260823-2`
- Canonical schema: v2

The 100-row overlay is suitable for bounded canonical overrides, not the permanent all-public archive. vNext permanent memory therefore requires a separate paginated archive store rather than expanding this overlay indefinitely.

### Content Graph

- `shared/content-graph.ts`
- Release: `CONTENT-GRAPH-20260822-1`
- Graph schema: v3 from Canonical Corpus schema v2
- Current edges: `SUPPORTED_BY`, `HAS_MEDIA`, `HAS_METRIC`, `RELATED_TO`
- Current search filters: q, kind, type, year, topic, platform, verification, surface

This graph is retained as an adapter/source for canonical events. vNext search must additionally index unresolved archive objects and entity dimensions.

### Public Discovery

Live backend includes `Discovery Library` with release `discovery-library-20260823-2`.

Current inputs include:

- public Media Master sheet
- public Discovery Max sheet
- live social feed

Current behavior:

- public HTTPS host allowlist
- URL normalization and dedup
- 15-minute runtime cache
- coverage-gap calculation against canonical source URLs
- explicit `DISCOVERY_NOT_CANONICAL` policy

Critical gap: a newly discovered record is not guaranteed to become durable owned archive memory. vNext changes this flow to discovery → archive receipt/version → resolution/placement.

### Social/live ingestion surfaces

Live backend currently contains:

- YouTube public Atom feed
- Instagram primary token feed
- Instagram secondary token feed
- TikTok OAuth token storage + Display API
- Facebook Graph API feed when credentials are configured
- LinkedIn OAuth identity path with member-post read restrictions explicitly acknowledged
- encrypted stored social tokens in AppDeploy DB

The vNext archive must consume these outputs through adapters; it must not replace working OAuth/feed integrations with duplicate integrations.

### Visual Registry

Release: `visual-registry-20260823-1`

Current inputs:

- approved public Drive seed visuals
- canonical corpus media
- public-source image resolver
- live social thumbnails

Current policy includes:

```text
approved-public-seeds-only
canonicalMedia=true
publicSourceResolver=true
socialLive=true
privateDriveAutoPublish=false
noInventedVisuals=true
```

The redesigned presentation engine should preserve this policy and migrate visual selection to event/archive placements.

### Media image resolver

Live backend has a public-source visual resolver with:

- HTTPS-only source validation
- source-host allowlist
- YouTube thumbnail resolution
- publisher-specific image overrides
- OG/Twitter image extraction

This should be retained as a capture/discovery helper. Permanent archive rendering should prefer stored assets once a capture exists.

### Entities

Live backend exposes canonical entities and graph-related-content routes. People/place/institution relationships are already a first-class retrieval layer and should feed vNext search and event bundles instead of becoming a separate page-owned dataset.

### Companion

Current Companion provides:

- GUIDE / REFLECT / BUILD modes
- AppDeploy tool-agent → NVIDIA → deterministic local fallback order
- Content Graph search tool
- entity search tool
- related-content tool
- public-page read tool
- public action router
- privacy guardrails

Current backend also contains duplicated hard-coded public profile/surface/cluster copy. vNext should preserve modes/providers/actions while shifting factual public grounding to the unified event/archive APIs.

### Growth / Creator Path

Current v95 contains persisted growth/creator flows and protected/user-aware routes. These are retained and visually integrated into chapter 7 (`YOU`), not rewritten as part of the archival data model.

### QA and diagnostics

Current v95 includes:

- `IntegrityPage`
- `VisualInspector`
- `/api/vqa-report`
- `/api/domain-proof`
- `/api/release`
- dry-run guards on sensitive admin/analytics operations

Current release metadata reports terminal runtime QA with zero frontend/backend/network errors, while also explicitly stating current-version E2E is not found and visual snapshot is not machine-inspected. vNext must not convert those partial signals into a claim of full test coverage.

## Live canonical-event assets that must be preserved

The current Canonical Corpus already includes substantial event-level records, including at minimum:

- childhood / immigration / belonging
- IDF mandatory service
- MFA overseas mission employment
- Israel Police service
- public-service retrospective
- Hebrew University criminology period
- StartOn registration
- return to Jesse Cohen / StartOn
- Channel 13 StartOn coverage
- long-form StartOn podcasts
- authored digital-education columns
- fatherhood viral event and distribution metrics
- elder-fraud event and media trail
- police-exit long-form video
- Mial parenting distribution trail
- public voice 2023
- TikTok 2024 owner recap
- My 20s retrospective
- identity/long-form 2024
- music/life 2025
- research 2026
- 7YA current snapshot

These are migration inputs, not UI sections. The new Home selects from them through placements.

## Presentation duplication observed in v95

The live source contains overlapping renderers including:

- `Archive.tsx`
- `DeepArchiveRiver.tsx`
- `PublicRecordRoom.tsx`
- MediaPage full-public-record
- `DiscoveryLibrary.tsx`
- `ContentSearchPage.tsx`
- Canonical Corpus inspector/search surfaces
- multiple historical Home implementations (`GalaxyHome`, `IgorLivingRecordHome`, `PersonalInternetHome`, Life-first/album layers)

This is the principal structural target of vNext: preserve data/functions, collapse presentation ownership.

## Reconciliation hard gate

Before any vNext feature code is allowed onto the implementation branch, verify all of the following:

```text
[ ] full AppDeploy v95 manifest exported
[ ] all backend files exported
[ ] all shared files exported
[ ] all src files exported
[ ] all public route/assets exported
[ ] package/tsconfig/vite/tailwind/postcss exported
[ ] tests exported
[ ] live release marker found in exported backend
[ ] canonical_corpus_overlay found in exported corpus store
[ ] CANONICAL-CORPUS-20260823-2 found
[ ] DISCOVERY_NOT_CANONICAL found
[ ] npm ci succeeds
[ ] npm run build succeeds
[ ] no untracked source files
[ ] reconciliation baseline committed alone
```

## vNext persistence amendment

The approved product spec is provider-neutral at the contract boundary. Because v95 already uses AppDeploy DB and the AppDeploy runtime provides storage, the first implementation should use:

- AppDeploy DB for archive objects, archive versions, relations, ingest receipts, event links and placements;
- AppDeploy Storage for captured binary assets;
- repository interfaces that keep provider details out of `shared/vnext/*` and frontend code.

This avoids introducing a second operational database during the reset while preserving the option to migrate storage providers later without changing public API contracts.

## Phase 0 exit condition

Phase 0 is complete only when there is one version-controlled commit that can build the same v95 application without relying on unversioned production-only source. Until then, source reads from v95 may be used for architecture and reconciliation analysis, but not as justification for destructive GitHub refactors.
