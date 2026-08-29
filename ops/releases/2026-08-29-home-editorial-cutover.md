# 7YA Home Editorial Cutover — production receipt

Date: 2026-08-29
Production authority: AppDeploy app `697a008fddc309b142`
Applied snapshot: `1788013951183`
Canonical domain: `https://7ya.io`

## Scope

- Applied the approved homepage editorial cutover to the current AppDeploy runtime.
- Added `src/life-first/editorial-cutover-20260826.css` to the runtime snapshot.
- Imported the stylesheet last from `src/life-first/AutobiographicalCinema.tsx`.
- Preserved backend, evidence corpus, routing, Digital Igor and ingestion behavior.
- Reconciled the staged patch against the newer runtime styles already present in the applied snapshot.

## Runtime reconciliation

The staged patch was authored against an older runtime baseline. The current runtime already contained later `igor-cutover-20260826.css` and `igor-mobile-rich-20260826.css` rules with `!important` overrides. Applying the staged CSS unchanged would have left the mobile Hundred Moments atlas hidden and the layer filter visible.

The production patch therefore adds compatibility overrides so the approved editorial intent actually wins on the current runtime:

- hide the Hundred Moments layer filter;
- restore the mobile atlas as a visible two-column grid;
- preserve four-column desktop atlas layout;
- enlarge the mobile cinematic stage;
- keep secondary hero body copy suppressed on mobile.

## Deployment authority cleanup

GitHub Pages remains legacy/manual only. Commit `75cbeab94bb48543794f1879acbfe1f88a5c87fd` removed the accidental push trigger from `.github/workflows/jekyll-gh-pages.yml`, preventing Jekyll/GitHub Pages from competing with AppDeploy on `main` pushes.

## Verification

- AppDeploy terminal status: `ready`.
- Frontend runtime errors: none reported.
- Backend runtime errors: none reported.
- QA network errors: none reported.
- QA produced both mobile and desktop screenshots.
- `7ya.io` and `www.7ya.io` are active custom domains on the AppDeploy v2 stage.
- The applied runtime snapshot contains the final editorial stylesheet import and the reconciled mobile/desktop atlas overrides.

## CI environment note

The standing local command is `npm run ci:local`. The current ChatGPT execution sandbox could not clone the public GitHub repository because outbound DNS is blocked, so that exact local command could not be executed here. Production was not represented as locally CI-green; instead, the release was gated by source-snapshot inspection, AppDeploy build/deploy validation, runtime error checks, QA snapshot generation and post-deploy source verification.
