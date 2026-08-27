# 7YA Impact Broadcast cutover — 2026-08-27

## Production authority
- AppDeploy app: `697a008fddc309b142`
- Applied snapshot: `1787811237155`
- Pre-feature rollback snapshot: `1787809708783`
- Canonical repository: `7guard-io/7ya.io`
- Feature branch: `feat/impact-broadcast-20260827`

## What changed
The homepage impact layer was rebuilt from a four-card KPI strip into a fifteen-year Impact Broadcast. The human hero remains first; the next section now communicates 2011→2026 public impact through dated measurement floors, a selectable impact timeline, propagation routes, separate platform snapshots and an explicit evidence quarantine.

## Headline evidence now broadcast
- `14,670,621` — strict observed exposure floor from the 20.08.2026 forensic freeze. Explicitly non-unique; not a unique-person reach claim.
- `353,829` — visible engagement floor from the 20.06.2026 evidence audit. Likes/reactions/comments/shares/saves only; not reach.
- `5.1M` external YouTube Short views — Nawan1, snapshot 17.08.2026; `82K` likes and `717` comments. Explicitly external/derivative exposure, not Igor-owned account reach.
- 2011→2026 public-record span with eras for 2011, 2022, 2023, 2024, 2025 and 2026.

## Propagation routes
The broadcast exposes four selectable public-echo routes from the existing `echo-records` graph:
1. Nawan co-appearance / external creator reach.
2. Fatherhood post → external Facebook repost → LinkedIn mirror → Hidabroot. The Facebook source-local display uses 4.1K reactions and 148 comments; conflicting share counts are intentionally omitted.
3. Kindergarten story → external publisher copies, including the 2,259-reaction Hohavim node.
4. Elder-fraud story → redistribution → newsroom/follow-up.

## Platform footprint
Metrics remain separate snapshots rather than a combined audience/reach number:
- TikTok — 12,655 followers / 273,860 account likes / 904 exported posts · 02.06.2026.
- Instagram — 8.2K followers / 1,188 posts · 08.06.2026.
- Facebook — ≈15.5K page likes · 08.06.2026.
- LinkedIn — 4,285 followers / 325 posts / 5 newsletter editions · 08.06.2026.
- YouTube — ≈2.57K subscribers / 334 indexed videos · 08.06.2026.

## Claim quarantine
`5.1B`, `6.2B+` and `7B` are visibly retained only as `SOURCE-PENDING / QUARANTINED` claim history. They are not promoted as verified total reach. No cross-platform deduplicated reach is synthesized.

## Evidence inputs
The implementation reconciles the applied `shared/media-impact.ts` forensic ledger, `src/echo-records.ts`, the public platform/source URLs already in the corpus, and the evidence audit workbook `Igor_Vepretski_Exposure_Audit_Current_Findings.xlsx` used during the 27.08.2026 review.

## Fresh verification in this cutover
- AppDeploy reached `ready` on snapshot `1787811237155`.
- Final status reported 0 frontend errors, 0 backend errors and 0 network errors.
- Applied-source readback confirmed the Impact Broadcast component and evidence view model are present in the production snapshot.
- `tests/tests.txt` readback confirmed Test 8 is a real newline-delimited acceptance test and exactly one `[sanity]` marker remains.
- AppDeploy generated fresh desktop and mobile QA screenshots for the final build.

## Verification boundary
AppDeploy returned `e2e_tests: null`; therefore no automated E2E PASS is claimed. The QA screenshot URLs were generated, but the current tool boundary did not permit direct pixel inspection of those S3 objects, so no manual pixel-perfect PASS is claimed. Build/runtime/source/test-contract verification is green; visual acceptance remains a separate evidence class.
