# 7YA Full Successor Recovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct the exact AppDeploy v93 application into a recoverable GitHub source, migrate its public API contract and NVIDIA Bro Chat to a conventional serverless runtime, activate the existing life-first / Hundred Moments visual architecture, and cut over 7ya.io only after technical, multilingual, content and pixel-level visual gates pass.

**Architecture:** Keep AppDeploy v93 (`1788453751783`) untouched as rollback. Build the successor in `7guard-io/7ya.io` from the actual v93 React/backend/shared/public source, not from the old static Vercel site or the contaminated `vepretski/7ya.io` repo. Use Vercel Pro as the successor runtime because AppDeploy is permanently blocked at 125/125 lifetime deploy requests and the live AppDeploy custom-domain ingress currently falls through `/api/*` to SPA HTML.

**Tech Stack:** React 19, Vite 6, TypeScript, Vercel Functions, NVIDIA NIM (`nvidia/nemotron-3-super-120b-a12b`), existing 7YA Canon / Discovery / Public Projection / social ingestion contracts.

**Spec:** `docs/superpowers/specs/2026-09-04-option-c-v93-successor-recovery.md`

## Global Constraints

- Production `7ya.io → AppDeploy v93` remains untouched until successor gates pass.
- Do not deploy the historical static Vercel homepage.
- Do not use `vepretski/7ya.io:dev` as canonical source; it is reference material only.
- Canon is authoritative. Discovery remains non-canonical until verified.
- No fabricated metrics, sponsorships, endorsements, private memories, or synthetic reach totals.
- NVIDIA remains primary for Bro Chat; preserve factual-tool-before-final discipline and deterministic fallback.
- HE / EN / RU remain required first-class languages.
- Authentic source media first; no invented substitute imagery and no collage behavior.
- Meta/social ingestion remains read-first and approval-gated; no automatic publishing.
- Meta EYI / Data Portability is a separate post-recovery capability and must not block the cutover.

---

### Task 1: Freeze and recover the v93 source baseline

**Files:**
- Create/restore from v93: `backend/**`, `shared/**`, missing `src/**`, `public/**`, `scripts/**`, `cron.json`, `tests/tests.txt`, `package.json`, `vite.config.ts`, `tsconfig.json`, PostCSS/Tailwind config.
- Create: `docs/recovery/v93-manifest.md`

**Interfaces:**
- Consumes: AppDeploy app `697a008fddc309b142`, version `1788453751783`.
- Produces: GitHub branch whose source file inventory matches the recoverable v93 application except runtime-specific migration files.

- [ ] Record the complete v93 `src_glob` inventory and applied version identifiers in `docs/recovery/v93-manifest.md`.
- [ ] Import all source-bearing v93 files into `recovery/option-c-v93-successor` without visual redesign edits.
- [ ] Preserve v93 release markers and record every intentional deviation in the manifest.
- [ ] Verify that critical recovered paths exist: `backend/index.ts`, `shared/canonical-corpus.ts`, `src/documentary-home/DocumentaryHome.tsx`, `src/life-first/HundredMoments.tsx`, `src/life-first/AutobiographicalCinema.tsx`, `src/StoryCompanion.tsx`, `tests/tests.txt`.
- [ ] Diff recovered branch against the previous GitHub source and classify differences as `production-drift`, `runtime-port`, `generated/static`, or `documentation`.

### Task 2: Port the API contract away from AppDeploy ingress

**Files:**
- Create: `api/_healthcheck.ts`
- Create: `api/release.ts`
- Create: `api/domain-proof.ts`
- Create: `api/companion/status.ts`
- Create: `api/companion.ts`
- Create: focused Vercel Function modules for the remaining public API families.
- Create: `server/core/**` for runtime-neutral Canon/Discovery/Projection/Bro Chat logic extracted from `backend/index.ts`.
- Create/modify: `vercel.json`

**Interfaces:**
- Consumes: v93 route behavior and runtime-neutral domain logic.
- Produces: conventional HTTP `/api/*` endpoints on Vercel with the same public payload semantics.

- [ ] Write route-contract tests that assert JSON content type and non-HTML bodies for `/api/_healthcheck`, `/api/release`, `/api/domain-proof`, `/api/companion/status`.
- [ ] Make those tests fail against the current live AppDeploy domain to preserve the regression symptom.
- [ ] Split `backend/index.ts` into runtime-neutral service functions and thin Vercel handlers; do not copy AppDeploy router/database/secrets primitives into frontend code.
- [ ] Configure `vercel.json` so API routes resolve before the SPA fallback; the SPA rewrite must exclude `/api/:path*`, assets and static public files.
- [ ] Deploy to a preview and assert each required API path returns JSON directly over HTTP.
- [ ] Keep `GET /api/health` only as compatibility; `/api/_healthcheck` is the infrastructure health contract.

### Task 3: Preserve Canon, Discovery, projection and evidence boundaries

**Files:**
- Restore/modify: `shared/canonical-corpus.ts`, `shared/public-internet-graph.ts`, `shared/evidence-first-ingestion.ts`, `shared/social-ingest.ts`.
- Create/modify server adapters under `server/core/` and `api/`.

**Interfaces:**
- Consumes: v93 Canon, Discovery, entity graph, visual registry, social and public projection structures.
- Produces: runtime-equivalent read APIs without truth-layer collapse.

- [ ] Port `/api/corpus`, graph, entities, Discovery, visual registry and public projection with payload-compatible schemas.
- [ ] Preserve `CANON`, `DISCOVERY`, `LIVE`, `LEGACY`, `PENDING` semantics and URL deduplication.
- [ ] Keep discovery metrics unpublished unless source-bound and explicitly verified.
- [ ] Keep private or owner-exported data private by default; ingestion never implies publication.
- [ ] Add regression checks proving Discovery entries cannot silently become Canon.

### Task 4: Activate the correct homepage spine instead of stacking another homepage

**Files:**
- Modify: `src/App.tsx`
- Modify or replace active home shell: `src/documentary-home/DocumentaryHome.tsx`
- Reuse: `src/life-first/PersonalStoryEntry.tsx`
- Reuse/modify: `src/life-first/HundredMoments.tsx`
- Reuse: `src/life-first/PersonalChronology.tsx`, `StartOnRoom.tsx`, `ResearchRoom.tsx`, `LiveSocial.tsx`, `UserHandoff.tsx`.
- Create: `src/successor/SuccessorHome.tsx`
- Create: `src/successor/successor-home.css`

**Interfaces:**
- Consumes: existing v93 life-first components and public projection APIs.
- Produces: one deliberate homepage journey.

- [ ] Write a visual-structure test asserting homepage order: `COVER → 100 MOMENTS → LIFE → ECHO → STARTON / BUILD → RESEARCH → NOW → BRO CHAT`.
- [ ] Build `SuccessorHome` by composing existing life-first components; do not duplicate their data pipelines.
- [ ] Cover uses one authentic portrait, `IGOR VEPRETSKI / 7YA`, one human statement, and exactly three primary actions: `Enter Life`, `What I’m Building`, `Bro Chat`.
- [ ] Move giant metrics below the human opening; metrics never dominate first viewport.
- [ ] Render `HundredMoments` immediately after the cover, not after the full archive journey.
- [ ] Remove the active 48-item `LivingFrontDoor` mosaic from the critical first journey. Keep useful media as Echo/archive depth, not as another homepage universe.
- [ ] Alternate editorial formats through chronology; avoid repetitive dashboard-card grids.
- [ ] Retire overlapping legacy homepage CSS layers from the active critical path instead of adding another override cascade.

### Task 5: Make Hundred Moments the living visual archive, not a numeric gimmick

**Files:**
- Modify: `src/life-first/HundredMoments.tsx`
- Modify: `src/life-first/hundred-moments.css`
- Modify runtime projection/visual adapters as needed.

**Interfaces:**
- Consumes: Canon + visual registry + public projection + live social.
- Produces: source-bound chronological visual moments with contextual Bro Chat entry.

- [ ] Keep progressive loading and dedupe by normalized source URL and image identity.
- [ ] Prioritize authentic photographs, video frames, press captures, documents and owner-authorized media over generic source posters.
- [ ] Every Moment displays year/date, real visual where available, human title, provenance/trust layer and direct source action.
- [ ] Change the contextual chat handoff from title-only query parameters to a structured moment context identifier that Bro Chat can resolve to canonical/source records server-side.
- [ ] Do not require exactly 100 records. “100 Moments” is the product surface; archive count may grow beyond 100.

### Task 6: Migrate Bro Chat while preserving NVIDIA behavior

**Files:**
- Create: `server/core/bro-chat/**`
- Create/modify: `api/companion.ts`, `api/companion/status.ts`, `api/companion/canary.ts`
- Modify: `src/StoryCompanion.tsx` and contextual launch helpers.

**Interfaces:**
- Consumes: v93 NVIDIA tool-agent policy, Canon/Discovery/entity/search tools, journey context.
- Produces: NVIDIA-first evidence-grounded Bro Chat on the successor runtime.

- [ ] Preserve primary model `nvidia/nemotron-3-super-120b-a12b`.
- [ ] Preserve bounded tool calling, factual retrieval requirement, Canon-authoritative / Discovery-labeled policy, timeout/retry/circuit-breaker behavior and local fallback.
- [ ] Keep Bro Chat disclosure explicit: AI, not Igor, no impersonation, no invented private memory.
- [ ] Implement Moment-context resolution using canonical ID / source ID / year / project / people context from the clicked Moment.
- [ ] Run the canary: grounded StartOn retrieval, rejection of invented private memory, rejection of fabricated metric, no secret/reasoning exposure.

### Task 7: Preserve and improve social ingestion without coupling it to visual release

**Files:**
- Port: Meta/Facebook, Instagram, TikTok, YouTube social read adapters and token storage interfaces.
- Create: runtime secret/storage adapters.

**Interfaces:**
- Consumes: existing v93 read-first social ingestion behavior.
- Produces: successor live social input for Discovery/Public Projection.

- [ ] Preserve Facebook read-only Page discovery/selection and Instagram Business linkage behavior where authorization exists.
- [ ] Preserve TikTok Display API and YouTube feed ingestion.
- [ ] Do not claim LinkedIn member-post ingestion without required approval.
- [ ] Never persist ephemeral Facebook CDN URLs as canonical durable assets; persist canonical source/provenance separately and mirror approved media into 7YA-controlled storage where allowed.
- [ ] Keep automatic publishing disabled.

### Task 8: HE / EN / RU static-first consistency and performance

**Files:**
- Modify: locale/SEO handling, `public/en/index.html`, `public/ru/index.html`, Hebrew root static shell, sitemap/robots/structured data.
- Modify: `src/App.tsx` route lazy-loading boundaries.

**Interfaces:**
- Produces: consistent first paint and hydrated behavior for the three required languages.

- [ ] Ensure each language receives matching homepage hierarchy, canonical/hreflang and human positioning before hydration.
- [ ] Keep optional AR/ES static pages from breaking, but do not let them block HE/EN/RU release.
- [ ] Lazy-load deep rooms so homepage critical path does not eagerly import unrelated route experiences.
- [ ] Validate hero image priority, no mobile crop failure and stable content dimensions.

### Task 9: Preview staging and release gate

**Files:**
- Create: `tests/release-gates/**`
- Create: `docs/recovery/cutover-checklist.md`

**Interfaces:**
- Consumes: completed successor build.
- Produces: explicit go/no-go evidence for domain cutover.

- [ ] BUILD: clean install/build/test succeeds from GitHub alone.
- [ ] API: direct preview `/api/*` probes return expected JSON, not SPA HTML.
- [ ] NVIDIA: companion status + canary pass using successor secrets.
- [ ] HE/EN/RU: route, metadata and primary UX consistency pass.
- [ ] MOBILE: visually inspect the real preview pixels at 390px-class viewport; no crop, clipping, obstruction, empty media wall or generic takeover.
- [ ] DESKTOP: visually inspect the real preview pixels; hierarchy reads as a living personal record rather than dashboard/system console.
- [ ] CONTENT: Hundred Moments is visible near the top and populated with authentic source-bound visuals.
- [ ] SOURCE: deployment SHA matches the canonical recovery/production commit.
- [ ] Only after all gates pass, move `7ya.io` and `www.7ya.io` to the successor runtime.
- [ ] Re-run API, NVIDIA, language, mobile, desktop and content gates on the custom domain.
- [ ] Keep AppDeploy v93 rollback documented until post-cutover verification remains stable.

### Task 10: Meta Data Portability / EYI after recovery cutover

**Files:**
- Create: `server/portability/**`
- Create: `api/portability/**`
- Create: private import UI under an authenticated/admin-only surface.

**Interfaces:**
- Consumes: user-initiated Meta exports or direct EYI transfers after onboarding.
- Produces: private normalized evidence candidates feeding the existing ingestion pipeline.

- [ ] Build one portability core with two entry points: manual private Meta archive import first; direct EYI destination later.
- [ ] Pipeline: immutable raw quarantine → manifest/hash → media extraction → account binding → timestamp/source normalization → dedupe → candidate Moment → verification → Canon/Discovery/publicability decision.
- [ ] Register 7YA with DTI Data Trust Registry before Meta destination onboarding; prepare organization/service identity, privacy policy, secure transport and data-handling evidence.
- [ ] Complete Meta Data Transfer App onboarding and self-serve test transfers for supported data types.
- [ ] After Meta assigns the destination/service identifier, add `Import from Facebook` and `Import from Instagram` EYI deep links that preselect the 7YA destination and return the user to a private import-status screen.
- [ ] Raw transferred data remains private by default. No object becomes public merely because it arrived through EYI.
- [ ] Portability failures never degrade or block the public homepage, Canon reads, Bro Chat or normal live social ingestion.

## Definition of FIXED

`7ya.io` is FIXED only when all of the following are true on the actual custom domain:

1. the successor source is reproducible from one canonical GitHub production branch;
2. direct `/api/*` paths return backend payloads instead of SPA HTML;
3. the first viewport is human and visual rather than dashboard-led;
4. Hundred Moments / Life Pulse is visible directly below the cover and populated with authentic source-bound content;
5. the page then flows through Life, Echo, StartOn/Build, Research, Now and Bro Chat without duplicated competing home systems;
6. Bro Chat uses verified NVIDIA-first behavior with Canon/Discovery discipline and contextual Moment grounding;
7. HE / EN / RU pass static-first and hydrated consistency;
8. mobile and desktop have been inspected from real rendered pixels after deployment;
9. the production domain resolves to the same verified build/commit that passed staging;
10. AppDeploy v93 remains a known rollback until the successor survives post-cutover verification.
