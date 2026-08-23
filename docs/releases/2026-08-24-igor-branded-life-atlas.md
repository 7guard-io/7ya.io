# 7YA Release Receipt — Igor-Branded Public Life Atlas

Date: 2026-08-24 (Asia/Jerusalem)
Status: DEPLOYED + RUNTIME VERIFIED

## Production
- AppDeploy app: `697a008fddc309b142`
- Applied source snapshot: `1787522851000`
- Public domains: `7ya.io` and `www.7ya.io` — active at verification time

## Public brand contract
The visible product identity is **Igor Vepretski × #7YA🥷 × StartOn**. NVIDIA/Nemotron remains infrastructure for reasoning/tool orchestration and is not exposed as a co-brand or visual design language.

## User-visible change
`100 MOMENTS · PUBLIC LIFE ARCHIVE` now includes:
- explicit `IGOR VEPRETSKI × #7YA🥷` / `PUBLIC LIFE ATLAS` masthead;
- the existing large selected-moment stage with original-source navigation;
- an exhaustive clickable contact sheet for every moment in the current evidence filter;
- tile index, year, layer and title context;
- source image when available, with source-bound typographic fallback when media is unavailable;
- desktop editorial grid and a forced two-column mobile grid;
- tile selection updates the large selected stage.

## Evidence semantics preserved
The existing ALL / CANON / PUBLIC ARCHIVE / DISCOVERY / LIVE filters, curation and URL/image deduplication remain in place. Discovery is not silently promoted to Canon. No new impact metric or unsupported biographical claim was introduced by this release.

## Verification evidence
Fresh terminal AppDeploy status after the applied snapshot returned:
- deployment: `ready`;
- frontend errors: 0;
- network errors: 0;
- backend errors: 0;
- fresh desktop QA screenshot generated;
- fresh mobile QA screenshot generated.

Fresh source inspection on the applied snapshot confirmed:
- `IGOR VEPRETSKI × #7YA🥷` and `PUBLIC LIFE ATLAS` are present in `HundredMoments.tsx`;
- the atlas maps `visibleMoments` into clickable cards;
- the active card updates the selected stage;
- mobile CSS forces `repeat(2,minmax(0,1fr))`;
- the brand lockup is not constrained by the former 640px copy rule.

## Explicit verification boundary
The AppDeploy response reports `e2e_tests: null` for this version, so this receipt does **not** claim that a full E2E suite passed. The platform generated fresh desktop/mobile screenshots, but an independent pixel-level visual-acceptance audit could not be fetched through the external browsing connectors in this session; therefore this receipt does **not** claim an independently observed pixel PASS.

## Production-truth note
This release was applied to the live AppDeploy source snapshot. The GitHub feature branch contains the design, implementation plan and this release receipt; it is documentation/recovery provenance, not a claim that the complete AppDeploy runtime source has already been exported back into GitHub.
