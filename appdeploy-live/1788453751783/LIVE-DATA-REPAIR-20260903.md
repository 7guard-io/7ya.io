# 7YA live discovery data repair — 2026-09-03

## Production safety

- AppDeploy app: `697a008fddc309b142`
- Production source snapshot remains `1788453751783` (`7ya-bulk-repair-20260903-v6`).
- No rollback was left active.
- No DNS/domain change was made.
- No fabricated metric, date, image or source was introduced.
- AppDeploy status after data repair: READY, 0 frontend / 0 backend / 0 network errors.

## Root data defect repaired

`buildDiscoveryLibrary()` accepts only public HTTPS URLs. `MEDIA_MASTER_LIBRARY` allowed `Canonical URL or native ID`, and several high-signal YouTube records were stored as native video IDs only. Those rows were therefore rejected by `discoveryPublicUrl()` and never entered the live Public Projection.

The following records were normalized from verified YouTube IDs to their deterministic canonical watch URLs:

- DMG-001 — Nawan1 / Joy stick / Igor appearance — `k9haTADKG3M`
- DMG-015 — ביתנו מדברים תכל'ס — `3h-oEuW8GJI`
- DMG-016 — Channel 14 / StartOn — `O3v309CA4ao`
- DMG-017 — בקו האש — `zKe8u4HdGXE`
- DMG-018 — יוצרים מהבית — `DHxxrglp1Gk`
- DMG-019 — נדלן וירושה — `Q768zYsm7Cg`
- DMG-020 — מוחות בתנועה — `mXAGZawQUPM`
- DMG-021 — Mindset Episode 102 — `FyWSwDXX47A`
- DMG-022 — BIZZI official video — `jRjZjpqAgEw`
- DMG-023 — BIZZI Topic — `HmP8jej7hqE`
- DMG-024 — NDI Russian podcast — `EsaD-lVsKHc`
- DMG-025 — Nawan secondary short — `1kanO9dQCvU`
- DMG-026 — Shahar Kaikov Ep18 — `ASlpxqylMSg`
- DMG-027 — Shahar Kaikov Ep54 — `fZklLCu7jKc`

Duplicate alternate Shahar uploads DMG-028/DMG-029 were intentionally left as native IDs so they do not add redundant projection entries.

## Impact-taxonomy normalization

Several verified records had generic relationship labels that prevented the current `projectionImpactScore()` taxonomy from recognizing their real media class. Without altering claims or counters, high-signal rows were normalized by appending accurate machine-readable descriptors such as `broadcast`, `podcast`, or `public-video` while preserving their original relationship text.

Targeted examples include Nawan / 5.13M public video, Channel 14 StartOn broadcast, Mindset, BIZZI, owned `מת על אקסל`, NDI podcast, Shahar Kaikov, the 750K Russian-education root, the long-form StartOn life interview, the Nitzotzot talk, Channel 13, and the live panel.

## Runtime behavior

`DocumentaryHome` and `LivingFrontDoor` already share `loadHomeProjection('/api/public-projection?sort=impact&limit=72')`. `LivingFrontDoor` can render up to 48 source-linked moments. The normalized URLs now qualify for YouTube thumbnails and discovery ingestion; the taxonomy normalization gives the selected records their intended impact-class weight.

`buildDiscoveryLibrary()` maintains an in-memory cache for up to 15 minutes. Therefore an already-warm runtime can continue serving the pre-repair projection until that cache naturally refreshes; new/warm-instance behavior can reflect the corrected sheet earlier.

## Remaining code-only defect

The separate nine-frame `dh-frame-grid` presentation regression in `DocumentaryHome.tsx` still requires a source deployment. Its surgical patch remains staged in `SURGICAL-LIFE-PULSE-PATCH.json`. AppDeploy `deploy_app` is blocked by the account lifetime limit (125/125), so this data repair was used to enrich the live projection without regressing the current API/Bro Chat/SEO runtime.
