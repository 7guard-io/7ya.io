# Grok Build Experimental Lab — 2026-09-07

Status: NON-PRODUCTION / INSPECTION + ISOLATION ONLY

Canonical repository: `7guard-io/7ya.io`
Experimental branch: `experiment/grok-build-20260907`
Sandbox source: `https://hds-tg07g5umr6p4-6014-ioo8r.grok-code-wild.hades-www.grok-sandbox.com/`

## Production rule

Sandbox → inspect → isolate → audit → branch → test → review → integrate.

Never sandbox → production. The Grok sandbox must never become a runtime dependency, canonical URL, evidence source of truth, API dependency, asset CDN, or SEO surface for 7YA.

## Access state

The sandbox currently redirects external inspection to Grok preview authentication. The authenticated rendered application and its source tree are therefore not available from the present execution context. No Grok/xAI export, matching branch, matching repository, matching commit, or source token was found in the connected GitHub organization at the time this document was created.

Until source or a reproducible exported build is available, no claim about the Grok application's actual routes, rendered UI, component implementation, 3D/WebGL stack, dependencies, API calls, environment variables, responsive behavior, accessibility, performance, or asset inventory is considered verified.

## Current 7YA runtime baseline

The current production runtime source of truth is the AppDeploy snapshot for app `697a008fddc309b142`, not a complete frontend mirror in GitHub. GitHub remains the canonical release ledger, but `appdeploy-live/CURRENT.json` explicitly records that full source export is pending and that deploying stale GitHub runtime code over AppDeploy production is unsafe.

### Runtime stack

- React 19
- ReactDOM 19
- Vite 6
- TypeScript 5.7
- Tailwind 3.4
- Lucide React
- AppDeploy client/SDK backend
- No package-level Three.js, React Three Fiber, Framer Motion, or GSAP dependency in the inspected runtime snapshot

### Routing

The runtime does not use React Router. `src/App.tsx` resolves pathname/query state directly and lazy-loads route-level experiences. Public routes include museum, research, music, media, speaker, blog, create, search, evidence, library, entity, moment, StartOn, and other dedicated surfaces.

### Homepage architecture

Current primary homepage path:

1. Human/front door
2. Narrative chronology
3. Life-line / source-linked moments
4. Human/family context
5. Right Now
6. Live public projection
7. Archive signals
8. Archive gateway
9. Media
10. Impact
11. Bro Chat / action layer

Target direction remains:

Human → Life Pulse → chronology → real media → current work → Bro Chat.

## Component map — protected baseline

### Human / life

- `src/documentary-home/DocumentaryHome.tsx`
- `src/life-first/PersonalChronology.tsx`
- `src/life-first/HundredMoments.tsx`
- `src/personal-internet/LivingPulse.tsx`

### Evidence / influence

- `src/EvidenceGraphExperience.tsx`
- `src/InfluenceUniverse.tsx`
- `shared/canonical-corpus.ts`
- `shared/content-graph.ts`
- `shared/public-internet-graph.ts`

### Conversation / generated story

- `src/StoryCompanion.tsx`
- `backend/index.ts`

## Baseline product assessment

### Strong — protect semantics

`PersonalChronology` already implements canonical IDs, overlap-aware life chapters, explicit verification state, evidence grade, source links, dated source-local metrics, real-media preference, and honest fallback behavior when a verified visual does not exist.

`EvidenceGraphExperience` already models Person, PublicationRecord, ContentObject, Moment, Entity, and Evidence nodes with explicit VERIFIED / SUPPORTED / INFERRED / OWNER_REPORTED / REQUIRES_CONFIRMATION / QUARANTINED trust states.

`InfluenceUniverse` already separates source, propagation, media response, and metric context and explicitly refuses synthetic cross-platform total reach.

`StoryCompanion` already provides SEE / ALIGN / ACT modes, scene awareness, evidence links, CANON-only story paths/compositions, mobile VisualViewport handling, provider fallback, and no-generated-facts boundaries.

### Most promising upgrade surface

`src/personal-internet/LivingPulse.tsx` is currently comparatively shallow: a real portrait plus six navigation portals. It is human-first and clean, but it is not yet a genuinely living spatial representation of the canon.

Therefore the provisional first integration candidate is a **canonical-data-driven Life Pulse / spatial chronology layer**, provided the Grok build contains an implementation that materially outperforms the current experience after inspection.

This is a hypothesis, not a Grok-side finding.

## A / B / C / D integration rubric

### A — Integrate

Only code that is source-verified, production-compatible, accessible, bounded in bundle/runtime cost, uses canonical 7YA data contracts, contains no secrets or invented facts, and materially improves the current experience.

### B — Adapt

Strong interaction or visual concepts requiring refactoring to React 19/Vite 6/current routing, canonical data contracts, reduced-motion behavior, source/trust labeling, mobile ergonomics, or bundle isolation.

Likely target surfaces if Grok proves stronger:
- Life Pulse
- 100 Moments interaction
- evidence graph visual layer
- influence spatial presentation
- chronology navigation

### C — Experiment

Optional 3D/WebGL, physics graph, cinematic spatial navigation, or other high-cost interaction that should remain lazy-loaded and non-essential until performance/accessibility evidence is strong.

### D — Reject

- sandbox URL as runtime dependency
- replacement of the 7YA canonical data/evidence model
- generated biographies, metrics, testimonials, events, or evidence
- duplicated backend/source-of-truth
- client-side secrets
- unbounded third-party SDKs
- whole-app generated copy-paste
- WebGL-only core navigation
- replacement of Bro Chat without evidence of a superior grounded contract
- code with unclear licensing/provenance
- code that breaks static/SEO/accessibility fallbacks

## API contracts that imported UI must respect

Relevant current public interfaces include:

- `/api/corpus`
- `/api/life-scenes`
- `/api/life-coverage`
- `/api/public-internet-graph`
- `/api/public-internet-graph/search`
- `/api/graph`
- `/api/graph/search`
- `/api/graph/posts`
- `/api/entities`
- `/api/public-projection`
- `/api/visual-registry`
- `/api/media-registry`
- `/api/discovery-library`
- `/api/media-impact`
- `/api/story-path`
- `/api/story-composition`
- `/api/companion`

Imported visual code should consume these contracts rather than inventing a parallel data model.

## Secrets / environment boundary

Known backend secret names include NVIDIA/NVCF credentials and social-platform OAuth/access-token credentials. Values must never be imported, logged, committed, copied from Grok, or exposed to the browser. Any Grok-generated `.env`, hard-coded token, key, endpoint credential, or private URL is an automatic D classification until removed and rotated where necessary.

## Proposed first integration slice

Create an isolated component only after Grok source is available:

`src/experiments/grok-life-pulse/`

Recommended contract:

- lazy-loaded from the homepage
- canonical API inputs only
- DOM/static fallback always available
- no blocking dependency for core navigation
- `prefers-reduced-motion` respected
- touch + keyboard operable
- no content invention
- source/trust state remains inspectable
- 390px mobile acceptance required
- 3D/WebGL, if used, capability-detected and optional

Do not replace `DocumentaryHome`, `PersonalChronology`, `EvidenceGraphExperience`, `InfluenceUniverse`, `StoryCompanion`, or canonical backend/shared modules as part of the first slice.

## Proposed bundle/performance guardrail

For the experiment, use a provisional budget until measured against the real Grok source:

- core initial-route regression target: <= 150 KB gzip
- optional spatial/3D lazy chunk target: <= 300 KB gzip
- no new long main-thread task > 200 ms on representative mobile hardware
- no measurable CLS regression
- no LCP regression attributable to the experimental feature

These are experimental acceptance targets, not an existing repository standard.

## Verification checklist

### Provenance

- [ ] Grok export/source archive identified
- [ ] source commit/export timestamp recorded
- [ ] original paths retained in provenance manifest
- [ ] dependency licenses inspected
- [ ] no generated asset with unclear rights is promoted

### Security

- [ ] no `.env` or secret values committed
- [ ] no client-side provider credential
- [ ] no sandbox callback/runtime URL dependency
- [ ] external requests inventoried
- [ ] CSP/CORS implications reviewed

### Data integrity

- [ ] canonical 7YA API data only for public claims
- [ ] no fake metrics/testimonials/events
- [ ] verification/trust status preserved
- [ ] source links preserved
- [ ] Discovery never silently promoted to Canon

### Compatibility

- [ ] React 19 compatible
- [ ] TypeScript strict clean
- [ ] Vite 6 build clean
- [ ] current pathname/query routing unaffected
- [ ] AppDeploy backend contracts unchanged unless explicitly reviewed
- [ ] Netlify/Cloudflare/static compatibility reviewed
- [ ] SEO/static fallback remains meaningful

### Accessibility / UX

- [ ] keyboard operable
- [ ] focus order valid
- [ ] semantic fallback for canvas/WebGL
- [ ] `prefers-reduced-motion` supported
- [ ] contrast checked
- [ ] touch targets >= 44px where applicable
- [ ] no horizontal overflow at 390px
- [ ] iOS visual viewport behavior checked

### Performance

- [ ] bundle delta measured
- [ ] lazy chunk verified
- [ ] LCP/CLS/interaction delta measured
- [ ] asset sizes audited
- [ ] no uncontrolled animation loop offscreen
- [ ] no unnecessary third-party runtime

### Regression

- [ ] chronology remains source-grounded
- [ ] evidence graph truth states unchanged
- [ ] influence metrics remain source-local
- [ ] Bro Chat still opens and answers
- [ ] CANON-only story composition remains intact
- [ ] no production deployment from this branch without separate review/gate

## Exact current files to protect from blind overwrite

- `src/documentary-home/DocumentaryHome.tsx`
- `src/life-first/PersonalChronology.tsx`
- `src/EvidenceGraphExperience.tsx`
- `src/InfluenceUniverse.tsx`
- `src/StoryCompanion.tsx`
- `backend/index.ts`
- `shared/canonical-corpus.ts`
- `shared/content-graph.ts`
- `shared/public-internet-graph.ts`

## Exact current file most suitable for controlled enhancement

- `src/personal-internet/LivingPulse.tsx`

The preferred migration strategy is not to overwrite that file directly. Add an experimental module, prove it, then integrate the minimum mature pieces.

## Next evidence required for Grok-side classification

One of the following must become available before exact Grok file-by-file A/B/C/D classification:

1. GitHub export from the Grok Build session; or
2. source archive with dependency manifest; or
3. a reproducible public/private build accessible to the inspection environment plus source map/export.

Rendered screenshots alone can support product review but are insufficient for dependency, secret, API, licensing, or source-level security audit.
