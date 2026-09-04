# 7YA Option C — v93 Successor Recovery Design

Date: 2026-09-04
Status: APPROVED RECOVERY DIRECTION
Production safety rule: current AppDeploy v93 remains untouched until every successor release gate passes.

## Objective

Recover 7YA from production/source drift without gambling the live domain. Preserve the current AppDeploy v93 deployment as rollback while constructing a reproducible successor from the actual v93 source snapshot. Apply the visual redesign only on the successor, then cut over after technical, AI, language, content and visual acceptance gates pass.

## Verified baseline

- Production AppDeploy app: `697a008fddc309b142`.
- Current applied rollback snapshot: v93 / AppDeploy version `1788453751783`.
- v93 contains a complete React/Vite application plus `backend/`, `shared/`, `public/`, scripts and data-facing code. It is recoverable source, not merely a compiled frontend.
- v93 backend explicitly defines `/api/release`, `/api/domain-proof`, `/api/_healthcheck`, Canon, Discovery, social, visual registry, Bro Chat and other API routes through `@appdeploy/sdk`.
- Public HTTP checks currently show `/api/release` and `/api/domain-proof` falling through to SPA HTML instead of returning their intended JSON payloads. Therefore the public API routing release gate is currently FAIL.
- Current AppDeploy runtime QA reports zero frontend/backend/network errors, but that does not override the direct API routing failure or visual acceptance requirements.
- AppDeploy custom domains `7ya.io` and `www.7ya.io` are active against the v2 proxy.
- NVIDIA is configured by secret name and the v93 source uses `nvidia/nemotron-3-super-120b-a12b` as the primary Bro Chat agent with bounded tool calling and fallbacks.
- `7guard-io/7ya.io` contains the living-record React architecture and prior 7YA design/implementation records, but it does not contain the current v93 release marker. Production is therefore ahead of GitHub.

## Recovery architecture

### Track 1 — Preserve

Keep the current production route unchanged:

`7ya.io → AppDeploy v93`

No homepage redesign, backend migration, secret migration or domain cutover is allowed on this track while the successor is incomplete.

### Track 2 — Construct successor

Reconstruct the exact v93 source into this recovery line and make it the recoverable baseline before redesign work.

Target structure remains the current application structure, including at minimum:

- `src/`
- `backend/`
- `shared/`
- `public/`
- `scripts/`
- `docs/`
- `package.json`
- Vite/TypeScript/PostCSS configuration
- deployment/runtime configuration
- tests and release-gate documentation

Do not reconstruct from the old static Vercel site. The source of truth for recovery is the current v93 React/backend snapshot.

## Visual successor sequence

The successor homepage should stop presenting primarily as a dashboard/system shell. The user journey becomes:

`COVER → 100 MOMENTS / LIFE PULSE → LIFE / CHRONOLOGY → ECHO / REAL MEDIA → STARTON / BUILD → RESEARCH → NOW → BRO CHAT`

### Cover

Use one strong authentic portrait or documented image, `IGOR VEPRETSKI / 7YA`, one short human statement and three primary actions:

- Enter Life
- What I’m Building
- Bro Chat

Large metrics move below the human opening.

### 100 Moments / Life Pulse

Place the living moment stream directly after the cover. It must use real photographs, video frames, posts, press captures, documents and other source-bound media rather than repetitive text cards.

Each moment exposes:

- year/date
- authentic visual
- short human title
- source/provenance state
- Open Moment action

The component may progressively load the full archive, but the opening viewport must visibly establish that this is a living personal record.

### Life / chronology

Use alternating editorial forms rather than repeating rectangular modules: full image, narrative copy, video, timeline, source object, portrait, quote and archive object.

### Echo / real media

Reuse the existing Canon, Public Projection, Discovery, live social and media infrastructure. Presentation should privilege authentic source media and documented propagation over abstract metrics.

### StartOn / Build

Keep StartOn as a source-backed field-application chapter and make current building/activity visible without implying unsupported endorsements or outcomes.

### Research

Preserve claim/evidence/uncertainty discipline. Research remains visually distinct from verified biography.

### Bro Chat

Keep the current NVIDIA/Nemotron agent architecture. Add contextual launch so a Moment can open Bro Chat with moment ID/year/project/people/canonical records/source context already attached.

Do not mix this visual recovery with a new embedding/vector/multimodal retrieval migration. Deeper semantic and multimodal retrieval is a later measured phase.

## API routing requirement

The successor is not releasable until direct public HTTP requests under `/api/*` resolve to backend responses rather than `index.html`/SPA HTML.

Required probes include at minimum:

- `/api/_healthcheck`
- `/api/release`
- `/api/domain-proof`
- `/api/companion/status`

The fix must be validated at both the staging runtime hostname and the eventual custom domain. A frontend-only success or an internal SDK call is insufficient for this gate.

## Source-control contract

The desired invariant is:

`GitHub canonical production branch → CI → staging → production → live verification`

Production snapshots must never again become an undocumented source branch. Any emergency production hotfix must be reconciled back to the canonical repository before the next release.

## Release gates

Successor cutover is allowed only when all of the following are PASS:

1. BUILD — deterministic clean build and required tests.
2. API — direct `/api/*` routes return intended backend responses.
3. NVIDIA — Bro Chat uses configured NVIDIA primary path and passes grounded canary/fallback checks without exposing secrets.
4. HE/EN/RU — route, metadata and primary UX consistency across the three required languages.
5. MOBILE — live successor visually inspected at mobile viewport; no clipping/hero crop/navigation obstruction and 100 Moments is visible near the top.
6. DESKTOP — live successor visually inspected at desktop viewport with the intended hierarchy and authentic visual density.
7. CONTENT — source-bound real media is visibly populated; no generic placeholder takeover or empty major surfaces.
8. DOMAIN — staging checks are repeated after domain cutover.

If any gate fails, `7ya.io` stays on v93.

## Definition of FIXED

Do not declare FIXED based on build success, deployment READY state, zero console errors, API 200 alone, component existence or code inspection.

FIXED requires all of the following to be visibly/operationally true on the live `7ya.io` domain:

- the real homepage has changed to the approved hierarchy;
- mobile visual acceptance passes;
- desktop visual acceptance passes;
- 100 Moments / Life Pulse is visible near the top;
- Bro Chat + NVIDIA is verified;
- direct `/api/*` routes return backend payloads rather than SPA HTML.

## Immediate implementation order

1. Freeze and record v93 identifiers and rollback state.
2. Reconcile/export the exact v93 source into the recovery branch before making redesign edits.
3. Diff recovered v93 against current GitHub and classify drift as source, generated/static, configuration or documentation.
4. Establish reproducible local/CI build and API route tests.
5. Resolve public `/api/*` transport/routing in successor staging.
6. Implement homepage hierarchy on successor only.
7. Preserve NVIDIA/Canon/Discovery/social/backend behavior while changing presentation.
8. Run release gates and visual acceptance.
9. Cut over only after all gates pass; keep v93 rollback available until post-cutover verification is complete.
