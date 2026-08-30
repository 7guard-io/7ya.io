# 7YA Content Empire — live integration receipt

Date: 2026-08-21 (Asia/Jerusalem)
AppDeploy app: `697a008fddc309b142`
Applied version: `1787344937205` (`v100`)
Applied at: 2026-08-21 23:42:17 +03:00
Canonical domain: `https://7ya.io`

## Objective

Connect the approved Content Empire architecture to the live 7YA Personal Internet without flattening the existing cinematic Broadcast and without creating a second truth store.

## Live integration

The applied AppDeploy source now includes:

- `shared/content-graph.ts` — Canon v2 -> Content Graph v3 runtime projection.
- Public graph routes: `/api/graph`, `/api/graph/search`, `/api/graph/posts`, `/api/graph/coverage`, `/api/graph/related/:id`.
- `search_content_graph` and `get_related_content` tools inside the public Companion agent.
- `src/ContentSearchPage.tsx` — multilingual evidence-backed canonical search with fail-closed empty/error states.
- `src/ContentGraphPortal.tsx` — searchable Canon portal in the main Personal Internet.
- `src/ViralFeed.tsx` — canonical post library driven by `/api/graph/posts`, with source-local metric snapshots only.
- `src/MediaPage.tsx` owned-publications layer now consumes graph posts instead of the parallel `media-corpus.ts` ledger.
- Personal Internet orbit navigation now exposes `Canon` and `Posts` while retaining the complete 20-scene Broadcast.
- Global navigation includes Canon search.

## Truth boundaries

- Canon v2 remains authoritative.
- Public graph projection excludes private Canon events and non-public sources.
- Verification strength is never upgraded by projection.
- Metrics remain attached to source/platform/snapshot; no aggregate reach is computed.
- Related-content edges are explicit canonical relationships only.
- Search and post views fail closed when Canon is unavailable; no invented fallback biography or metrics are rendered.

## Verification

Fresh AppDeploy status for applied v100 reports:

- deployment: `ready`
- frontend runtime errors: `0`
- backend runtime errors: `0`
- QA network errors: `0`
- desktop and mobile QA snapshots generated
- source inspection confirms graph routes, Companion graph tools, Search page, Canon portal, canonical Viral Feed, MediaPage graph publications, and Canon/Posts orbit navigation are present in the applied snapshot.
- `https://7ya.io/` was independently opened successfully on 2026-08-21 after deployment.

## QA limitation

`tests/tests.txt` contains five Content Empire E2E contracts and uses the required exact viewport metadata. AppDeploy still reports `e2e_tests.status = not_found` for version `1787344937205`; therefore this receipt does **not** claim a black-box E2E pass. Build/runtime/source verification is positive, while the AppDeploy E2E runner discovery gap remains explicitly recorded.

## Repository boundary

GitHub `main` predates portions of the live AppDeploy runtime. PR #300 contains the clean typed Content Graph v3 foundation. Do not overwrite the live runtime from stale root source; reconcile/export the applied AppDeploy source deliberately before a future main-branch deployment.
