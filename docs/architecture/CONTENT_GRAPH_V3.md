# 7YA Content Graph v3

**Status:** implemented on isolated feature branch; not deployed to production.

## Purpose

Content Graph v3 is the canonical projection layer for the 7YA Content Empire. It converts the existing evidence-aware Canon v2 into deterministic nodes and edges that can power search, posts, timelines, media, related content, coverage, AI retrieval, SEO and future distribution workflows without duplicating factual truth into page-specific code.

## Source-of-truth rule

Canon v2 remains authoritative during migration.

```text
AUTHORIZED SOURCES
  -> INGEST / VERIFY / RESOLVE
  -> CANON V2
  -> CONTENT GRAPH V3
  -> PROJECTIONS
  -> SITE / SEARCH / AI / SEO / DISTRIBUTION
```

The graph is a projection, not an independent fact store. A graph node may never strengthen the verification state of the Canon event that produced it.

## Truth mapping

| Canon v2 | Graph v3 |
| --- | --- |
| `verified` | `VERIFIED` |
| `supported` | `STRONGLY_INFERRED` |
| `inferred` | `STRONGLY_INFERRED` |
| `owner-reported` | `REQUIRES_CONFIRMATION` |
| `unresolved` | `REQUIRES_CONFIRMATION` |
| `contradicted` | `REQUIRES_CONFIRMATION` |
| `quarantined` | `REQUIRES_CONFIRMATION` |

No mapping upgrades uncertainty.

## Privacy and publication boundary

- Only Canon events with `visibility === public` enter the public graph projection.
- Sources explicitly marked non-public are excluded.
- The projector does not infer people, organizations, roles, places or achievements from narrative prose.
- Explicit `relatedEventIds` are the only Canon-v2 relationship inputs converted to `RELATED_TO` in the first slice.

## Metric rule

Metrics remain atomic, dated and source-local. Each metric node preserves:

- metric type
- value
- unit
- snapshot date
- source URL
- platform
- verification state

Graph v3 intentionally exposes no `aggregateReach` field and performs no cross-platform summation.

## First projections

The initial package provides:

- graph queries by kind, year, topic, platform, truth state and text;
- `/posts`-ready projections with source/media/metric links;
- related-content traversal over explicit graph edges;
- coverage rows with Known / Published / Missing / Weak / Unverified.

These are foundation APIs. They do not yet replace the live UI.

## Migration targets

The current AppDeploy runtime contains useful but parallel hard-coded knowledge surfaces. They should be migrated incrementally after GitHub/runtime source alignment:

1. `src/media-corpus.ts` -> projection from Canon/Graph instead of a second content ledger.
2. `src/content-registry.ts` -> ranking/selection policy over Graph nodes instead of a second truth registry.
3. AI Companion hard-coded public profile/surfaces -> retrieval from Graph projections with evidence links.
4. Homepage and archive modules -> graph projections, preserving editorial composition in the UI layer.
5. Search -> structured + semantic retrieval over Graph nodes, returning evidence and media.

## Runtime alignment gate

The live AppDeploy runtime on 21 Aug 2026 contains source newer than GitHub `main`, including the current Canon v2 and media-integration layers. Therefore this branch does not overwrite the live React/AppDeploy runtime files. Before production integration, export/reconcile the applied AppDeploy source into GitHub deliberately and resolve differences file-by-file.

## Deployment gate

No production deploy is implied by this implementation. Integration into `main` and deployment to `7ya.io` remain behind the established explicit deployment-chain command and the full local CI gate.
