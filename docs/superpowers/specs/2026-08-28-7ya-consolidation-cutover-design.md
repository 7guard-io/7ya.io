# 7YA Consolidation Cutover Design

## Goal
Create one coherent public 7YA experience without rewriting the corpus, evidence engine, media registry, APIs, or historical archive. The cutover removes product-level split-brain between legacy query routes, clean routes, static first paint, hydrated React routes, and partially coupled search/discovery states.

## Root cause
Production is technically healthy, but multiple presentation generations coexist. The homepage, media/search surfaces, and SEO layer can expose different product states depending on route, locale, hydration and API availability. Search currently couples canon search and coverage into one Promise.all failure boundary. Legacy `?page=` routing remains a first-class navigation path instead of compatibility-only. The homepage has strong source material but composition remains fragmented across overlapping components.

## Product contract
1. Clean routes are canonical: `/`, `/media/`, `/research/`, `/starton/`, `/library/`, `/evidence/`, `/search/`, `/music/`, `/speaker/`, `/blog/`, `/create/`, `/museum/`.
2. Legacy `?page=` remains supported only as a compatibility redirect/normalization path; it must not create a separate product state.
3. Homepage composition is one documentary flow: hero → impact/media proof → selected visual frames → life narrative → current work → archive/deep links.
4. Public Projection remains the primary visual inventory. Existing fallback corpora remain safety nets, not competing sources of truth.
5. Search is resilient by layer. Canon results, coverage and Public Discovery fail independently. A coverage or discovery outage must never blank the canonical search experience.
6. The full archive is preserved. Canon/Discovery/Live/Legacy status boundaries remain explicit.
7. Mobile is a first-class target at 375/390/430 px. No horizontal overflow, clipped hero face, obscured primary CTA, or overlay collision is acceptable.
8. HE/EN/RU retain equivalent route structure, metadata and interaction behavior.

## Architecture
### Routing normalization
Keep the existing `App.tsx` route selection, but normalize legacy query routes into clean paths before rendering the page-specific branch. Preserve `lang` and relevant filters while deleting the legacy `page` parameter. Internal navigation should emit clean-route URLs through `pageHref`/`rootHref` rather than query-only URLs.

### Search resilience
Replace the all-or-nothing `Promise.all([fetchGraphSearch, fetchGraphCoverage])` state with independently settled requests. Canon search owns the main ready/failed state; coverage owns a separate optional state. Discovery is already independently rendered by `DiscoveryLibrary` and remains so. When coverage fails, the search results stay usable and the coverage strip presents a degraded/hidden state rather than turning the entire page red.

### Homepage orchestration
Keep `DocumentaryHome` as the single home shell. Do not add another homepage subsystem. Reduce duplicate calls-to-action and emphasize source-linked visual proof near the top. Public Projection continues feeding the curated frame set; fallback frames remain for network/API degradation. The home must expose Media, StartOn, Evidence, Library and Digital Igor from one coherent navigation system.

### Mobile composition
Use the existing documentary/mobile CSS layers as the insertion point. Add explicit overflow containment, safe hero crop rules, compact CTA wrapping and spacing around persistent controls/chat. Avoid new JS viewport branching unless CSS cannot solve the issue.

## Failure behavior
- Canon API failure: visible canonical-search error; Discovery can still load independently.
- Coverage API failure: search results remain visible; coverage shows a non-blocking degraded state.
- Public Projection failure: homepage uses existing fallback visual corpus and remains navigable.
- Individual image failure: card remains with poster/source metadata; no broken-image icon should dominate the layout.
- Legacy route: normalize to clean route without losing language or search/filter parameters.

## Testing
1. Desktop clean-route navigation from home to Media/Search/Library.
2. Legacy `?page=media` normalization retains locale and opens the same Media experience.
3. Search remains usable when coverage endpoint fails while canon results still return.
4. Search shows a canonical error when canon endpoint fails without falsely presenting fallback records as canon.
5. Mobile 375×667 home: hero, primary CTA, top visual proof and navigation fit without horizontal overflow.

## Non-goals
- No corpus rewrite.
- No metric recomputation.
- No automatic social publishing.
- No secret/OAuth changes.
- No removal of legacy archive data.
- No GitHub `main` cutover or CI claim unless the explicit deployment-chain command is given.
