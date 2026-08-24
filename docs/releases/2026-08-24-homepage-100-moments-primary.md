# 7YA Release Receipt — 100 Moments Primary Homepage

Date: 2026-08-24 (Asia/Jerusalem)
Status: DEPLOYED + VERIFIED AT APPDEPLOY LAYER

## Immutable production provenance

- AppDeploy app: `697a008fddc309b142`
- First snapshot verified with the promoted 100 Moments composition: `1787520947297`
- Release marker at that behavior-change snapshot: `7ya-life-atlas-100-primary-20260824-1`
- Production domains: `7ya.io` and `www.7ya.io`
- Domain status after deploy: `active`

**Important:** AppDeploy `vNN` names are rolling display labels and are not immutable version identifiers. The original receipt incorrectly paired the label `v98` with snapshot `1787520947297`. Future receipts must use the snapshot id as the durable provenance key.

## User-visible change

At snapshot `1787520947297`, source verification established the composition:

1. autobiographical Igor cover / real portrait;
2. `HundredMoments` public-life archive;
3. ORIGIN chronology;
4. remaining autobiographical cinema.

That snapshot showed:

- line 31: `#cinema-open` cover;
- line 32: `<HundredMoments/>`;
- line 33: `#cinema-origin`.

Later same-day snapshots continued evolving the opening sequence, including insertion of the evidence-backed Life Scene Graph after 100 Moments. This receipt documents the 100 Moments promotion event; it is not a claim that the exact surrounding composition remained frozen afterward.

## Evidence semantics preserved

No change to the evidence meaning of `HundredMoments` was required for the promotion. Its Canon / Public Archive / Discovery / Live separation, source links, deduplication and curation behavior remained evidence-bounded.

## QA

AppDeploy runtime QA after the promotion returned:

- deployment: `ready`;
- frontend errors: 0;
- network errors: 0;
- backend errors: 0;
- desktop QA capture generated;
- mobile QA capture generated.

The user-visible QA specification required 100 Moments immediately after the cover on desktop and mobile before the composition was changed.

## Production-truth note

This receipt does **not** claim that GitHub is already the runtime application source of truth. The live application remains an AppDeploy source snapshot while recovery into a reviewed GitHub application tree is in progress.

Current production-truth recovery work is tracked on `recovery/appdeploy-1787521286005` and in `docs/releases/2026-08-24-production-source-recovery.md`.