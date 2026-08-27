# 7YA Consolidation Cutover — Live Receipt

Date: 2026-08-28
AppDeploy app: `697a008fddc309b142`
Latest verified snapshot: `1787866114357`
Branch: `agent/7ya-consolidation-cutover-20260828`

## Live root-cause fixes applied

### 1. Canonical public routing
- `src/App.tsx`: legacy supported `?page=` routes normalize regardless of current pathname (`if(!route)return`).
- `index.html`: pre-hydration normalization maps public legacy routes to clean paths before React bootstraps.
- Public route set: museum, research, music, media, speaker, blog, create, search, library, evidence, starton.
- Private/query-only routes such as growth and album remain intentionally query-based.

### 2. Central navigation helper
- `src/locale.tsx`: `pageHref()` now includes `research`, `evidence`, and `starton` as clean public routes.
- Public room navigation no longer falls through to `?page=research`.
- `pageHref()` starts from a fresh parameter set rather than leaking the current page's search/filter state into unrelated rooms.
- Locale is included in generated helper URLs so existing `+ '&chat=…'`, `+ '&q=…'`, and similar callers always append a syntactically valid query parameter.

### 3. Search graceful degradation
- `src/ContentSearchPage.tsx`: canonical graph search and canon coverage load independently.
- Coverage failure no longer changes the canonical search state to failed.
- Canon search failure remains explicit and does not relabel Discovery/fallback records as canon.
- `src/content-search.css`: non-blocking coverage failure state added.

### 4. Internal legacy emitters removed
Updated live AppDeploy source:
- `src/ContentSearchPage.tsx`
- `src/MediaPage.tsx`
- `src/CreatorPathPage.tsx`
- `src/DeepMediaLibrary.tsx`
- `src/HomeMediaFlow.tsx`
- `src/InfluenceUniverse.tsx`
- `src/PlatformUniverse.tsx`

Public internal links now target clean room paths rather than constructing `?page=media` / `?page=search` URLs.

### 5. Static-first route shells verified
- `public/research/index.html` and `public/search/index.html` are current static-first crawl shells with canonical clean URLs and `public/scripts/app-hydrate.js` hydration.
- A public crawler may still expose older cached redirect-era content; the current AppDeploy source is not a redirect stub.

## Runtime verification
Latest AppDeploy QA after snapshot `1787866114357`:
- deployment: `ready`
- frontend errors: `0`
- backend errors: `0`
- QA network errors: `0`
- fresh desktop screenshot generated
- fresh mobile screenshot generated
- `agent-mesh-hourly`: last run success, failure count 0
- `meta-sync-hourly`: last run success, failure count 0

## Test boundary
AppDeploy currently reports `e2e_tests: null`. The regression contract exists in `tests/tests.txt`, but no automated E2E PASS is claimed for this cutover.

## Source-of-truth boundary
The active AppDeploy source is materially ahead of the repository root source on GitHub. This receipt intentionally records the live delta without merging stale root application files over production. GitHub `main` was not modified by this cutover.
