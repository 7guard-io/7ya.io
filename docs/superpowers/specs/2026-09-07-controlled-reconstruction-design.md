# 7YA Controlled Reconstruction — Design Specification

**Date:** 2026-09-07  
**Owner:** Igor Vepretski  
**Canonical repository:** `7guard-io/7ya.io`  
**Working branch:** `refactor/controlled-reconstruction-20260907`  
**Production provider:** AppDeploy v2  
**Runtime baseline:** AppDeploy `v97`, snapshot `1788806726940`  
**Main baseline:** `f048a13b214e9585f40662c1316817625339b732`

## 1. Objective

Reconstruct 7YA.IO into a maintainable, production-grade public application without rewriting the product from zero, losing evidence/content, or replacing the currently healthy AppDeploy runtime with a stale GitHub source tree.

The reconstruction must preserve the product hierarchy:

1. Igor Vepretski is the human and narrative core.
2. StartOn is the independent social mission.
3. 7YA is the organizing system for content, evidence, provenance, AI navigation and public memory.

The result must be easier to understand, test, extend and deploy while preserving the current public information architecture and rollback capability.

## 2. Current-state findings

### 2.1 Source-of-truth drift

GitHub `main` remains the canonical governance/review plane but does not currently contain the complete React/AppDeploy runtime source. The current AppDeploy runtime contains root runtime files including `src/App.tsx`, `backend/index.ts` and `cron.json` that are absent from GitHub `main`.

Therefore GitHub `main` MUST NOT be deployed as a replacement for the current AppDeploy runtime before source reconciliation completes.

### 2.2 Current runtime health

At design time AppDeploy reports the applied runtime as ready with zero current frontend, network and backend errors. E2E is not present and therefore is not claimed as passing.

The active scheduled jobs are:

- `agent-mesh-hourly`
- `meta-sync-hourly`

Historical NVIDIA/NVCF canaries and the old visual gate are disabled records and are not current release blockers.

### 2.3 Frontend structural debt

The runtime `src/App.tsx` currently combines several responsibilities:

- route resolution;
- legacy query-route migration;
- locale routing;
- SEO metadata and canonical generation;
- hreflang generation;
- release/build-marker exposure;
- diagnostics routing;
- layout/shell selection;
- lazy page imports;
- public-room composition.

It is also minified into a single physical line, which materially reduces reviewability and safe editing.

### 2.4 CSS accumulation

The application loads multiple chronological global CSS layers, including release-specific and repair-specific styles. This patch-on-patch model makes cascade ownership and responsive behavior difficult to reason about.

The reconstruction will consolidate styles by responsibility rather than by incident date.

### 2.5 Homepage direction

`DocumentaryHome` currently delegates to `EngineeringHome`. This engineering-first homepage is the current baseline and must be evolved, not replaced by a generic template. It already expresses the desired directness: person, systems, evidence, chronology, contact.

## 3. Non-negotiable constraints

1. No direct broad edits on `main`.
2. No production overwrite from stale GitHub source.
3. No destructive deletion before an exported runtime snapshot exists and its replacement is verified.
4. Preserve an explicit AppDeploy rollback snapshot/version before every production promotion.
5. Hebrew RTL remains the primary public language; English and Russian remain first-class supported languages.
6. Preserve current critical public routes and canonical URLs.
7. Preserve evidence-state semantics and privacy boundaries from `AGENTS.md`.
8. Do not publish unsupported reach, institutional, partnership, political or outcome claims.
9. AI remains a tool and must not impersonate Igor.
10. Public conversion hierarchy remains: primary `לתיאום שיחה`, secondary `לצפייה בראיות`.
11. No release claim is valid until `https://7ya.io/` itself proves the intended build marker.
12. E2E may be reported only when an actual E2E run exists and passes.

## 4. Reconstruction strategy

Use a **controlled strangler refactor** rather than a rewrite.

Existing working behavior remains available while responsibilities are progressively moved into explicit modules. Each migration must be independently testable and reversible.

The sequence is:

1. Capture and reconcile production source.
2. Establish deterministic baseline tests and route/SEO manifests.
3. Split application shell, router, SEO and locale concerns.
4. Consolidate shared design tokens and base styles.
5. Migrate homepage and public-room styling away from chronological patch CSS.
6. Harden API transport boundaries.
7. Remove only code proven unreachable or superseded.
8. Validate candidate build.
9. Reconcile GitHub source and release receipts.
10. Promote only after live-domain verification.

## 5. Target frontend architecture

The reconstructed runtime should converge toward:

```text
src/
  app/
    App.tsx
    AppShell.tsx
    route-manifest.ts
    resolve-route.ts
    release.ts
  i18n/
    locale.tsx
    routes.ts
    seo.ts
  pages/
    home/
    starton/
    evidence/
    library/
    search/
    museum/
    media/
    research/
    music/
    speaker/
    blog/
    create/
  features/
    companion/
    corpus/
    evidence/
    social/
    life-album/
  content/
    canonical/
    public-discovery/
  styles/
    tokens.css
    reset.css
    base.css
    accessibility.css
    layout.css
  shared/
    components/
    links/
    media/
```

This is a convergence target, not permission to move every file at once.

### 5.1 Router boundary

`resolve-route.ts` owns URL parsing and returns a typed route object. Components do not inspect `window.location` independently unless they are explicitly browser-integration components.

Required route result fields:

```ts
type AppRoute = {
  id: RouteId;
  locale: 'he' | 'en' | 'ru';
  canonicalPath: string;
  legacyRedirect?: string;
  diagnostics: boolean;
  visualQA: boolean;
};
```

Legacy `?page=` inputs remain supported through redirects, not parallel rendering branches.

### 5.2 SEO boundary

SEO data moves out of the root component into a typed registry. A single head synchronizer owns:

- title;
- description;
- canonical URL;
- Open Graph title/description/url/locale;
- Twitter title/description;
- `hreflang` for `he`, `en`, `ru`, `es` and `x-default`.

Canonical generation must be deterministic and testable without rendering the complete application.

### 5.3 Application shell

The shell decides which global surfaces surround a page. Page components receive route/locale context and should not duplicate shell logic.

The shell must explicitly support:

- focused public rooms;
- standard depth pages;
- system/internal pages;
- homepage;
- diagnostics/visual QA modes.

## 6. Styling architecture

### 6.1 Tokens

Introduce semantic CSS custom properties for:

- background/surface/paper/ink/text/muted;
- accent;
- border strengths;
- spacing scale;
- radius scale;
- type scale;
- content widths;
- breakpoints where CSS custom properties are useful.

### 6.2 Ownership

Chronological repair styles such as `*-20260828.css` and `*-20260902.css` are not deleted immediately. Their active declarations are first traced and moved into responsibility-based style files.

A legacy style file may be removed only when:

1. every active selector is classified;
2. required declarations have migrated;
3. route screenshots show no unintended regression;
4. focused tests pass.

### 6.3 Homepage

`EngineeringHome` remains the initial homepage implementation during reconstruction. It should be decomposed into focused sections only when doing so improves independent testing or reuse.

The visual direction remains editorial, human-first and evidence-backed. Avoid dashboard aesthetics, repeated portrait walls and decorative AI dominance.

## 7. Backend and API boundary

The reconstruction must separate three concepts:

1. AppDeploy-supported client transport;
2. public browser HTTP endpoints;
3. internal backend handlers/cron jobs.

`/api/health` must become a real backend response if it is advertised as an API endpoint. A React-rendered pseudo-health route is not an acceptable long-term contract.

API behavior must define:

- status codes;
- JSON response schema;
- content type;
- cache policy;
- error schema;
- authorization requirements when applicable.

No secret or provider credential may be exposed to the client bundle.

## 8. Performance requirements

The reconstruction should reduce work on first load without sacrificing source-linked media.

Required techniques:

- keep non-home public rooms lazy-loaded;
- avoid loading legacy feature layers on the homepage unless needed;
- explicit width/height or aspect-ratio for public images;
- lazy-load below-fold images;
- preload/fetch-prioritize only the primary hero media;
- use `content-visibility` only where it does not break accessibility/navigation;
- remove duplicate global CSS after migration;
- inspect production bundle before adding dependencies.

No new state-management or routing library should be added unless native/current patterns cannot meet a documented requirement.

## 9. Accessibility requirements

Minimum release requirements:

- keyboard-accessible primary navigation;
- visible `:focus-visible` state;
- functional skip link;
- one meaningful `h1` per public route;
- logical heading order;
- non-decorative images require meaningful alt text;
- decorative images use empty alt text;
- controls have accessible names;
- language and `dir` match the active locale;
- `prefers-reduced-motion` respected for non-essential motion;
- no horizontal overflow at 320 CSS px width.

## 10. Route contract

At minimum preserve and validate:

```text
/
/igor-vepretski/
/journey/
/starton/
/influence/
/evidence/
/library/
/search/
/media/
/research/
/music/
/speaker/
/blog/
/create/
/contact/
```

For public depth pages, equivalent English and Russian routing/canonical behavior must remain coherent. Existing Spanish static support remains discoverable but is not expanded by this reconstruction unless required to prevent regression.

## 11. Test strategy

Testing is introduced before structural migration so refactoring does not redefine expected behavior accidentally.

### 11.1 Deterministic tests

Add tests/validation for:

- route resolution;
- legacy `?page=` redirects;
- locale path resolution;
- canonical URL generation;
- SEO registry completeness;
- route-manifest uniqueness;
- release marker presence;
- active scheduler manifest consistency;
- public API health schema.

### 11.2 Build gate

A candidate must complete the repository release gate/build-equivalent available in the reconciled runtime. If GitHub Actions is unavailable because of account/billing state, that limitation must be recorded rather than interpreted as a code failure or success.

### 11.3 Runtime QA

Before promotion require fresh:

- AppDeploy terminal `ready` state;
- zero new frontend errors;
- zero new backend errors;
- zero new network errors relevant to the release;
- desktop screenshot review;
- mobile screenshot review;
- critical-route smoke checks;
- custom-domain verification;
- build-marker verification at `7ya.io`.

## 12. Source reconciliation gate

Before broad code reconstruction begins, the exact applied AppDeploy v97 runtime source must be captured into the reconstruction branch or an immutable source-export branch derived from it.

The export must include at least all runtime-relevant text/source/configuration files necessary to reproduce the application build, including:

- `src/**`;
- `backend/**`;
- `scripts/**`;
- `public/**` excluding only binary files already content-addressed/unchanged and verifiably available;
- `package.json`;
- build configuration;
- `cron.json`;
- AppDeploy non-secret app configuration that belongs in source control.

Binary assets may remain referenced by existing repository assets when hashes/identity are verified. Secrets are never exported.

After export, compare the source-export branch against `main` and classify each difference as:

- production runtime required;
- canonical repository newer;
- historical/unused;
- generated asset;
- provider-specific;
- unresolved.

No unresolved runtime-critical difference may be deleted during reconstruction.

## 13. Migration phases

### Phase A — Production capture

Deliverable: a reproducible source snapshot/manifest for AppDeploy v97 and a drift report against `main`.

No public UX changes.

### Phase B — Safety net

Deliverable: route/SEO/API/release deterministic tests that describe the current intended contract.

No broad refactor before these tests exist.

### Phase C — Application core extraction

Deliverable: typed route resolver, SEO registry, release module and application shell replacing root-component responsibility overload.

Public behavior should remain functionally equivalent.

### Phase D — Style consolidation

Deliverable: semantic tokens/base styles plus phased retirement of chronological repair styles.

Visual changes are allowed only where explicitly documented and screenshot-verified.

### Phase E — API hardening

Deliverable: real health endpoint and explicit client/public/internal transport contracts.

### Phase F — Dead-code and repository hygiene

Deliverable: removal or archival of code proven unused, duplicate or historical, with imports/search proving it is not runtime reachable.

Unrelated course/reference material must not remain mixed with deployable runtime roots unless intentionally documented.

### Phase G — Candidate release

Deliverable: AppDeploy candidate with fresh QA, rollback version, release receipt and live-domain build proof.

## 14. Rollback model

Every production candidate records:

- previous applied AppDeploy version/snapshot;
- candidate snapshot;
- repository branch/commit;
- build marker;
- release scope;
- QA timestamp;
- known non-blocking provider degradation;
- rollback action.

A failed live-domain gate triggers rollback to the previously verified AppDeploy snapshot rather than emergency edits on production.

## 15. Explicit non-goals

This reconstruction does NOT automatically:

- rewrite all public copy;
- redesign every depth page;
- replace AppDeploy;
- add a new JavaScript framework;
- introduce a new database;
- expand private-data ingestion;
- publish additional personal/private records;
- alter StartOn factual status or evidence labels;
- replace existing media merely for aesthetic uniformity.

## 16. Definition of done

The controlled reconstruction is complete only when all of the following are true:

1. GitHub contains the reproducible active runtime source used for production.
2. `main` and production authority no longer have undocumented runtime drift.
3. Root application routing/SEO/shell responsibilities are modular and testable.
4. Chronological CSS patch layers are substantially eliminated or explicitly retained with documented ownership.
5. Critical routes satisfy route, metadata, language, accessibility and mobile gates.
6. Public API endpoints return their documented backend contracts.
7. No unsupported factual/evidence claims are introduced.
8. AppDeploy candidate has fresh QA evidence.
9. A rollback snapshot is recorded.
10. `https://7ya.io/` proves the intended build marker after promotion.
11. The release receipt ties runtime version, GitHub commit, domain verification and rollback together.

## 17. First implementation boundary

The first implementation plan must cover **Phase A + Phase B only**: production source capture/reconciliation and the deterministic safety net.

Do not combine architecture extraction, CSS consolidation and API rewrites into that first implementation plan. Those begin only after the reconciled source and baseline tests are reviewable.
