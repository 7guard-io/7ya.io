# 7YA Release Receipt — 100 Moments Primary Homepage

Date: 2026-08-24 (Asia/Jerusalem)
Status: DEPLOYED + VERIFIED AT APPDEPLOY LAYER

## Production release

- AppDeploy app: `697a008fddc309b142`
- AppDeploy version: `v98`
- Snapshot version: `1787520947297`
- Release marker: `7ya-life-atlas-100-primary-20260824-1`
- Production domains: `7ya.io` and `www.7ya.io`
- Domain status after deploy: `active`

## User-visible change

The homepage composition now renders in this order:

1. autobiographical Igor cover / real portrait;
2. `HundredMoments` public-life archive;
3. ORIGIN chronology;
4. remaining autobiographical cinema.

Source verification on the applied v98 snapshot confirms:

- line 31: `#cinema-open` cover;
- line 32: `<HundredMoments/>`;
- line 33: `#cinema-origin`.

The previous lower-page `HundredMoments` render was removed, so the component is not duplicated.

## Evidence semantics preserved

No changes were made to `HundredMoments.tsx`. Its existing Canon / Public Archive / Discovery / Live separation, source links, deduplication and curation behavior remain unchanged.

## QA

Fresh AppDeploy QA after the v98 deployment returned:

- deployment: `ready`;
- frontend errors: 0;
- network errors: 0;
- backend errors: 0;
- fresh desktop QA capture generated;
- fresh mobile QA capture generated.

The user-visible QA specification was updated before the production code change to require 100 Moments immediately after the cover on desktop and mobile.

## Production-truth note

This receipt does **not** claim that GitHub is already the runtime application source of truth. The live application still exists as an AppDeploy source snapshot while the older static GitHub projection remains structurally different.

The next architectural slice is to recover the validated live application source into a GitHub-controlled application tree and generate deployment/release metadata from that exact source, eliminating source-alignment ambiguity.