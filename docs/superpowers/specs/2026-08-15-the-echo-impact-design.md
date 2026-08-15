# THE ECHO / ההדהוד — Impact Experience Design

## Goal

Turn 7YA's existing source-backed influence layer into a human-readable, visually compelling experience that answers one question: **what happened after Igor published?**

The feature must show the path from original content to redistribution, public response, discussion and downstream action without collapsing unlike metrics into a vanity total.

## Existing Context

The live 7YA application already contains:

- `InfluenceUniverse` for dated source frames, metric snapshots and a propagation model.
- `ImpactDashboard` for normalized public-safe metric claims and verification status.
- `InfluenceMemory` / `HistoricalInfluence` for archive history and source-linked evidence.
- `IgorLivingRecordHome` as the canonical public homepage.
- AppDeploy QA with desktop/mobile screenshots and E2E tests.

This feature refines and unifies those primitives instead of adding another parallel analytics system.

## Experience Model

### 1. Identity

Public name: **THE ECHO** / **ההדהוד** / **ЭХО**.

Promise: **What happens after Igor presses Publish.**

The experience is documentary, not dashboard-first. Metrics are secondary to the human chain of propagation.

### 2. Core interaction

A visitor sees a source story and can follow its propagation chain:

`ORIGIN → DISTRIBUTION → RESPONSE → FURTHER MOVEMENT`

Each node may represent an original post, external repost, media pickup, response cluster or downstream action.

Nodes must preserve:

- source / platform
- date or bounded time label
- evidence state
- link when available
- relationship to the original content

### 3. Evidence states

Visible evidence states are limited to:

- `VERIFIED` — source and claim directly supported
- `DOCUMENTED` — relationship supported but metric or downstream effect not fully proven
- `ESTIMATED` — bounded estimate with explicit label
- `RECOVERY` — known corpus gap or removed/unavailable source awaiting recovery

No state may be silently upgraded.

### 4. Human response taxonomy

Public responses are classified by observable response type, not inferred psychology:

- `FELT` — explicit emotion / identification
- `THOUGHT` — explicit reflection / reconsideration
- `DISCUSSED` — substantive conversation or disagreement
- `SHARED` — redistribution
- `ACTED` — explicit reported action
- `GREW` — explicit self-described learning or growth
- `CHALLENGED` — criticism / disagreement

Classification must be traceable to the response text or documented behavior. Negative responses remain visible when representative and safe.

## Components

### A. Echo Hero

Replace the generic `INFLUENCE UNIVERSE` framing in the cinematic section with THE ECHO identity while preserving source-linked metric snapshots.

Hero copy focuses on movement, not scale:

- original signal
- where it travelled
- what people said
- what continued afterwards

### B. Propagation Constellation

A lightweight interactive chain uses a small curated set of source-backed stories already in the corpus.

For the first vertical slice, use existing verified/public sources in 7YA only. No newly invented metrics or quotations.

Each story exposes 3–5 nodes maximum on first view. Deeper evidence is opened by CTA rather than rendered as a dense graph.

### C. The World Answered

A response strip shows **representative real responses only when the exact public response text is available in the approved dataset**.

Until exact response records are normalized, render response-category summaries rather than quotation marks. This prevents fabricated or context-lost quotes.

### D. What Changed

A compact response taxonomy displays the observable response types attached to each story. Counts are shown only when verified by a dataset field. Otherwise category presence is shown without a number.

### E. Evidence CTA

Every story includes a clear `Open evidence` / `See chain` action leading to the media/evidence surface.

## Data boundary

The UI consumes source-backed records already present in 7YA datasets. The first implementation does not ingest Drive exports directly into the production UI.

Future ingestion may normalize:

- original post records
- repost / mirror relations
- public response records
- response classifications
- recovery targets

into a typed `echo-records` registry.

The current slice introduces that registry only for the curated, already-supported stories rendered on the homepage.

## Privacy and safety

- Public material only.
- No private DMs.
- No sensitive profiling of responders.
- Usernames are displayed only when already public, necessary and allowed by the source contract.
- Response text must not be surfaced without exact source-backed text.
- No automated claim that a post "changed" a person unless the person explicitly said so.

## Visual direction

- Editorial documentary × evidence graph.
- Dark cinematic surface, restrained gold signal accents and source labels.
- No collage.
- No generic portrait repetition.
- One source object at a time; motion and connecting lines imply propagation.
- Desktop: horizontal chain where space permits.
- Mobile: stacked vertical chain with the same semantic order.
- Reduced-motion mode removes animated signal movement.

## Integration

Primary placement: immediately after the public hero / early life proof area, where `InfluenceUniverse mode='cinematic'` currently renders.

Secondary entry points:

- global influence bar links to `#echo` on home or the media depth route.
- media page retains full archive/search behavior.

The feature must not duplicate `ImpactDashboard`; it becomes the narrative front door to the existing evidence layer.

## Error handling

- External image failure hides the image but preserves source title, status and link.
- Missing metrics show evidence state, not zero.
- Missing response text renders category-only context, never placeholder quotations.
- Broken source URL is not promoted to `VERIFIED`.

## Acceptance criteria

1. Homepage visibly presents **THE ECHO / ההדהוד** in HE/EN/RU.
2. At least three source-backed propagation stories are rendered from existing 7YA data.
3. Each story shows origin, one or more propagation/response nodes, evidence state and source CTA.
4. No synthetic total-reach number is introduced.
5. No fabricated quotation is introduced.
6. Mobile presents the same semantic chain without horizontal overflow or fixed-control collision.
7. Reduced-motion behavior is supported.
8. Existing Research Spine, Journey, media archive and evidence contracts remain intact.
9. AppDeploy frontend/backend validation is clean.
10. Five focused E2E checks pass before the version is applied as production-ready.
