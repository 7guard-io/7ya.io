# 7YA Generative Story Paths + Canonical-first Rendering — Release Receipt

Date: 2026-08-24
Production app: AppDeploy `697a008fddc309b142`
Primary domain: `https://7ya.io`
Runtime release marker: `7ya-production-truth-20260824-4`
Verified AppDeploy source snapshot: `1787552901751`
Latest QA screenshot snapshot: `1787552950579`

## Purpose

This release moves 7YA from a scene-aware conversational assistant toward a generative interface while preserving evidence boundaries. Digital Igor can now construct a Story Path from the public canon and use that path to control real documentary scenes in the site. In parallel, the public archive and Digital History no longer depend on asynchronous enrichment in order to show that a verified life corpus exists.

## Generative Story Paths

A reusable public primitive now exists at `GET /api/story-path`.

Properties:

- output basis is explicitly `CANON_ONLY`;
- the path builder is deterministic server-side rather than letting the language model invent chronology;
- a path is returned only when at least two evidence-backed mapped nodes exist;
- every node carries a real DOM `sectionId`, canonical record id, year, localized label/summary, public source URL and verification/trust state;
- preferred canonical anchors are pinned to the visible scenes so source and scene describe the same event;
- current preferred anchors are:
  - `origin-belonging-1990s` → `cinema-origin`;
  - `service-field-2011-2021` → `cinema-service`;
  - `starton-return-2022` → `cinema-return`;
  - `public-voice-2023` → `cinema-voice`;
  - `life-music-2025` → `cinema-create`;
  - `research-collective-imagination-2026` → `cinema-research`;
  - `7ya-now-snapshot-2026` → `cinema-now`.

The StartOn path deliberately uses `starton-return-2022`, not the separate nonprofit-registration record, because the mapped visual scene is the return to Jesse Cohen / StartOn story.

## Digital Igor interface

`POST /api/companion` now returns an optional `storyPath` in addition to reply, evidence, actions and checkpoint.

When present, the chat renders a `STORY PATH · CANON ONLY` rail. Each node has:

- a scene action;
- year and trust status;
- direct source access.

Activating a node closes the chat, scrolls to the mapped scene and applies a temporary focus treatment. When the request starts from a secondary route such as Media or Research, 7YA navigates back to the home documentary route using `storyFocus`, lands on the correct section and applies the same focus treatment after mount.

## Canonical-first boot

The external public crawl had surfaced a stale/first-render representation in which `100 MOMENTS` appeared as zero and Digital History showed an unavailable state. The active application source already had a real canonical corpus, so the correct fix was not to invent fallback metrics or content.

The runtime now boots from the bundled `canonicalCorpusSeed`:

### 100 Moments

- initializes with source-backed canonical moments immediately;
- never needs Discovery or Live to prove that the archive exists;
- API corpus, visual registry and Discovery remain asynchronous enrichment layers;
- dynamic results are deduplicated/curated over the canonical baseline.

### Digital History

- initializes from a canonical projection generated from the same bundled public corpus;
- builds dated, source-linked CANON entries before Public Projection enrichment returns;
- dynamic newest/oldest Public Projection results overwrite/enrich matching source records;
- enrichment failure therefore leaves a canonical chronology visible rather than replacing it with an empty/unavailable story.

This is an availability rule, not a truth downgrade: Canon remains Canon; Discovery and Live remain separate layers.

## Evidence and privacy boundaries

This release does not allow the LLM to promote Discovery into Canon, invent private memory, fabricate reach, or create synthetic biographical events. Story Paths are resolved against the canonical corpus and require public HTTPS evidence. Existing Digital Igor provider order remains NVIDIA Nemotron → AppDeploy tool agent → local deterministic fallback.

## Verification

Fresh source verification on AppDeploy snapshot `1787552901751` confirmed together:

- runtime release marker `7ya-production-truth-20260824-4`;
- `GET /api/story-path` route;
- preferred canonical Story Path anchors, including `starton-return-2022` and `public-voice-2023`;
- `storyFocus` cross-route navigation logic;
- visible `STORY PATH · CANON ONLY` frontend support;
- canonical-first `HundredMoments` bootstrap;
- canonical-first `DigitalHistory` bootstrap;
- the previously released `SYSTEM · EVIDENCE ON DEMAND` architecture remains part of the active experience.

Terminal AppDeploy deployment state was `ready` with zero frontend, backend and network errors. Fresh desktop and mobile QA screenshots were generated in snapshot `1787552950579`.

AppDeploy still did not expose an `e2e_tests` result object for this release, so this receipt does not claim a green automated end-to-end suite. The QA screenshots were generated successfully, but this receipt also does not claim an independent machine pixel audit because the screenshot files were not available to the execution environment for direct inspection.

## Search-index note

A same-day public search-engine crawl still surfaced an older rendered snapshot containing zero Atlas counts and the prior system-gate copy. That crawl also contained source text known to have been superseded in the active AppDeploy source, so it is treated as stale search/index cache rather than authoritative production evidence. No claim is made that external indexes have refreshed yet.

## Domain

`7ya.io` and `www.7ya.io` remain active on the AppDeploy v2 custom-domain stage.

## Source-of-truth note

The live application tree remains managed by the AppDeploy production snapshot. The GitHub repository is currently the durable home for designs, plans and release evidence; it does not yet contain a recovered one-to-one copy of the active AppDeploy source tree. No fake source sync was performed into guessed GitHub paths.