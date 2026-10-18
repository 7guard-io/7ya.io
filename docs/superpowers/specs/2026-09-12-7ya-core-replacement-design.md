# 7YA Core Replacement Architecture Design

**Date:** 2026-09-12
**Status:** Approved for implementation by Igor Vepretski

## Goal

Replace the accumulated parallel public-content architectures with one durable source of truth and one runtime projection path:

`SOURCE → CORE RECORD → EXPERIENCE → 7YA.IO`

7YA itself must stop being the reason a verified/public item fails to appear in the correct user experience. External platforms may remain unavailable, but once public history is ingested it must remain usable independently of the live external API.

## Current production finding

The active AppDeploy snapshot contains overlapping canonical corpus, discovery, public projection, life scenes, content graph, public internet graph, recovered media, social ingestion, visual registry, media registry and additional derived surfaces. `src/App.tsx` currently combines routing, SEO, compatibility routing and many conditional experience layers while importing multiple dated repair CSS layers. `backend/index.ts` combines social OAuth, ingestion, discovery, corpus, projections, AI, media proxying, visual QA, analytics, growth, Telegram and routing. Production has accumulated a high deployment churn, which makes small content changes unnecessarily coupled to build/deploy/cache behavior.

## Core record

Every public object becomes the same record shape. Canon, Discovery, Live, Recovered and Pending become trust/status/provenance fields rather than separate user-facing systems.

```ts
type CoreRecord = {
  schemaVersion: 1;
  id: string;
  type: string;
  title: { he: string; en: string; ru: string };
  story: { he: string; en: string; ru: string };
  occurredAt: string;
  publishedAt: string;
  people: string[];
  places: string[];
  domains: string[];
  media: CoreMedia[];
  sources: CoreSource[];
  metrics: CoreMetric[];
  trust: 'verified' | 'supported' | 'owner-reported' | 'discovery' | 'live' | 'unresolved';
  status: 'canonical' | 'live' | 'recovered' | 'pending';
  visibility: 'public' | 'private';
  importance: number;
  routeHints: string[];
  provenance: {
    origins: string[];
    canonicalId?: string;
    migratedAt?: string;
  };
};
```

Database rows wrap the record as `{ key, record, updatedAt, seedVersion }` so AppDeploy database IDs remain storage IDs rather than public record IDs.

## Core Store behavior

`backend/core/store.ts` owns reads, writes, bounded migration and composition state. It is the only public experience data dependency after cutover.

The first Core seed is a convergence migration from the existing public production surfaces. Canonical records are merged by canonical ID. Non-canonical public records are keyed deterministically by normalized public source URL. Duplicate source URLs are merged. Trust/status is preserved as metadata rather than as an alternate database.

After successful seed, normal Core reads never fall back silently to legacy systems. Refresh/enrichment is explicit through protected admin operations. This makes live Instagram/TikTok/Facebook/API access enrichment rather than a runtime dependency.

## Runtime composition

Page composition is persisted state, not hard-coded React content. Composition controls:

- route titles and descriptions
- domain priority
- featured record IDs
- hidden record IDs
- route limits
- route order

A protected admin endpoint can update composition without rebuilding the frontend. A protected Core-record upsert endpoint can change content metadata, priority, visibility and placement without deployment.

## Route projections

All primary public routes are views over Core Store:

- `home`
- `story`
- `media`
- `politics`
- `starton`
- `music`
- `research`
- `archive`

Legacy `/library/` maps to `archive`. Search is a query over the same Core records rather than a separate content universe.

A record may appear in multiple projections simultaneously without copies. For example, a police post can appear in Story, Politics, Media, Timeline/Search and Archive through domains/route hints on one record.

## Frontend cutover

The public entrypoint converges to:

```text
App
 └─ Router
     └─ ExperienceShell
         ├─ PageRenderer
         └─ BroChat
```

`App.tsx` stops owning public route special cases. Dated repair CSS imports are removed from the active public entrypoint. Core UI styles are scoped under the Core experience root to prevent legacy global leakage.

Internal/admin compatibility routes may temporarily render existing tools while public user-facing routes run exclusively on Core.

## Backend boundaries

New focused modules:

```text
backend/core/
  types.ts
  migrate.ts
  store.ts
  projection.ts
  routes.ts
```

Existing legacy implementations remain temporarily available only to complete migration and operational verification. They are not the long-term source of truth. Subsequent cleanup can split retained integrations into `ingest/`, `admin/`, `social/`, `ai/`, and `routes/` after the public cutover is stable.

## Migration and deletion policy

This is a convergence rebuild, not dual architecture forever:

1. Add Core Store and migration adapter.
2. Seed Core from the currently active public production corpus/projection.
3. Verify Core count, source coverage, media coverage and route projections.
4. Switch primary public routes to Core.
5. Verify canonical `https://7ya.io` on desktop/mobile and Bro Chat.
6. Freeze legacy user-facing reads.
7. Delete parallel mechanisms only after observable Core parity is proven.

Rollback is the immediately preceding AppDeploy snapshot until cutover verification is complete.

## Success criteria

The architecture is successful when all of the following are true:

- A public record has one authoritative Core representation.
- The same record can be projected to multiple routes without duplication.
- Route ordering, featured content, visibility, titles and priority can change at runtime without a deploy.
- Existing ingested history remains available when external APIs are blocked.
- Public routes no longer depend on Canon/Discovery/Recovered/Visual Registry as separate frontend data systems.
- The canonical domain visibly renders the Core experience on mobile and desktop.
- Bro Chat remains usable and source-grounded.
- SEO/canonical metadata remains valid for primary routes.
- No success claim is made solely from compilation, CI, HTTP 200 or AppDeploy readiness; the live user-visible result is the gate.

## Non-goals for the first cutover

- Rewriting every social-provider integration from scratch.
- Deleting legacy data before parity is verified.
- Inventing or auto-publishing private/unverified material.
- Making external APIs reliable when providers block access.
