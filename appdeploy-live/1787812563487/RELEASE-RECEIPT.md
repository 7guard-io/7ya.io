# 7YA Impact Universe Counter cutover — 2026-08-27

## Production authority
- AppDeploy app: `697a008fddc309b142`
- Applied snapshot: `1787812563487`
- Previous rollback snapshot: `1787811237155`
- Canonical repository: `7guard-io/7ya.io`
- Feature branch: `feat/impact-universe-count-20260827`

## Operating principle
Count first. Classify second. Every observed or recorded exposure, interaction, distribution and audience metric enters its own metric class. Verification/provenance remains attached, but it no longer hides the count.

## Impact Universe now visible
- `7B+` — highest counted cumulative gross-exposure snapshot in the historical series.
- `18,785,328` — ecosystem-inclusive gross already resolved to source-level evidence in the 20.08.2026 forensic census.
- `397M+` — cumulative interactions snapshot: `290M+ likes + 82M+ shares + 25M+ comments`; kept separate from exposure.
- `2,753+` — publication instances across four core platforms: 1,189 Instagram + 904 TikTok + 326 LinkedIn + 334 YouTube.
- `1.5M+` — community-members snapshot; audience/network class.
- `47+` — countries recorded across distribution; geography class.

## Cumulative gross snapshot series
The UI now shows `310M+ → 5.1B → 6.2B+ → 7B+` as a historical progression of the same cumulative counter. These values are NOT ADDITIVE and are never summed together.

## Counting rules
1. Count each observed or recorded metric before classification.
2. Do not add historical snapshots of the same cumulative counter together.
3. Keep views/impressions/reach in Exposure; likes/comments/shares/saves in Interactions.
4. Count external-publisher exposure when the content is attributable to Igor, while retaining publisher attribution.
5. Keep source-resolved gross as a drill-down subset of the larger historical gross universe, not an additional amount to add to 7B+.

## Deployment verification
- AppDeploy reached `ready` after one pre-build QA-manifest anchor correction.
- Final runtime reported 0 frontend errors, 0 backend errors and 0 network errors.
- Applied source readback confirmed `shared/impact-universe.ts` and `ImpactUniverseCounter.tsx` in snapshot `1787812563487`.
- `ImpactFrontDoor.tsx` imports and renders `ImpactUniverseCounter` before the existing source-linked impact sections.
- Test 8 now covers 7B+, 18,785,328, 397M+, 2,753+, 1.5M+, 47+, the non-additive snapshot progression and metric-class boundaries.
- Exactly one `[sanity]` marker remains in `tests/tests.txt`.
- Fresh AppDeploy desktop/mobile QA screenshots were generated after the cutover.

## Verification boundary
AppDeploy returned `e2e_tests: null`, so no automated E2E PASS is claimed. The production runtime/source/test contract is green; direct pixel inspection of the generated QA screenshot objects is a separate evidence class.
