# 7YA current live baseline — 2026-08-23

This file records the observed execution baseline before Igor AI / Story Plane implementation. It is intentionally written on an isolated feature branch and does not modify production.

## Canonical live target

- Domain: `https://7ya.io`
- Alternate domain: `https://www.7ya.io`
- Provider: AppDeploy
- App ID: `697a008fddc309b142`
- Observed applied source snapshot: `1787467519973`
- App status at audit: `ready`
- Frontend errors returned by AppDeploy status: `0`
- Backend errors returned by AppDeploy status: `0`
- Network errors returned by AppDeploy status: `0`
- E2E state returned by AppDeploy status: `not_found`

## Release/source-alignment observation

The live backend release endpoint/source currently declares:

- provider: AppDeploy;
- canonical domain: `https://7ya.io`;
- source alignment: `APPDEPLOY_LIVE_SNAPSHOT_PENDING_GITHUB_EXPORT`;
- visual snapshot generated but not a substitute for current machine/human acceptance;
- current runtime has no executable E2E result for the applied version.

A GitHub deployment receipt created earlier on 2026-08-23 also records that the repository root was older than the AppDeploy production snapshot and that the executable hotfix was applied directly to AppDeploy to avoid overwriting newer production source.

## Existing live architecture observed

### Public/story

`src/life-first/LifeFirstHome.tsx` currently composes:

1. LifeFirstHero
2. LifeGeography
3. HundredMoments
4. PersonalChronology
5. RightNow
6. LifeBroadcast
7. LongformVoice
8. PersonalArchive
9. VisualCanonRiver
10. PublicActionStage
11. StartOnRoom
12. CreateRoom
13. ResearchRoom
14. KnowledgeCommons
15. WorldRooms
16. UserHandoff
17. DeepArchiveRiver

The number of top-level modules is a likely contributor to public information overload even though the underlying content is valuable.

### Canon/evidence

- `shared/canonical-corpus.ts` — schema v2, release `CANONICAL-CORPUS-20260823-2`
- `backend/corpus-store.ts` — seed + public register + validated DB overlay
- `shared/content-graph.ts` — graph projection/search
- `shared/canonical-entities.ts` — people/places/institutions
- media-impact controls
- visual registry
- discovery library / forensic-sheet ingestion

This is the preferred foundation. Do not introduce a competing biography truth store.

### Digital conversation

- frontend: `src/StoryCompanion.tsx`
- API: `POST /api/companion`
- alias: `POST /api/igor`
- provider chain: AppDeploy tool agent → NVIDIA NIM → deterministic local fallback
- current tools include canonical graph search, entity search, related content, evidence/public surfaces and action routing
- current internal modes: GUIDE / REFLECT / BUILD
- current voice model: `igor-voice-v1`

Current product-language mismatch:

The public UI currently frames the service as an AI based on Igor but “not Igor himself,” while the approved target is a disclosed Digital Igor interface: visitors talk with a first-person AI representation grounded in Igor’s verified public canon. The future UI must preserve disclosure and must never present the model as the live human.

### AI/runtime credentials

At audit time AppDeploy reported only one configured backend secret name relevant here:

- `NVIDIA_API_KEY`

No secret values were read or recorded in this repository.

Live social API code exists for YouTube, Instagram, TikTok, Facebook and LinkedIn, but credential/provider readiness is not equivalent across those platforms. Provider diagnostics belong to the Control Plane, not the default public story.

## Known QA debt

1. `package.json` exposes only `dev`, `build`, `preview`; no executable unit/E2E script is defined in the current live snapshot.
2. `tests/tests.txt` contains acceptance scenarios but is not an executable test runner.
3. AppDeploy reports no E2E run for the current version.
4. `src/VisualInspector.tsx` performs useful DOM checks but is opt-in client-side diagnostics.
5. backend visual AI QA currently references a historical hard-coded screenshot prefix rather than binding the audit to the candidate version automatically.
6. Public page crawl still surfaces control/operator concepts in visitor-facing content; this should be separated from the Story Plane.

## Canon strength observed

The current canonical corpus contains strongly structured public records and, where appropriate, public conclusions supported by private official documents without publishing those documents. Examples include:

- exact IDF mandatory-service period verified privately and publicly corroborated;
- exact MFA overseas-employment period verified privately and publicly corroborated;
- exact Israel Police service period verified privately and publicly corroborated;
- Hebrew University criminology period;
- StartOn registration and public transition/return story;
- dated media/podcast/writing events;
- source-local viral/distribution metrics with explicit snapshot and verification state;
- research classification that avoids claiming peer review where none is established.

This is the correct evidence model to extend.

## Vault alignment

Drive “כספת” was audited as a complementary evidence/control layer. The strongest current forensic workbook contains publication gates, life timeline, visual canon, people graph, source ledger, media library, gap register and amplification reconstruction. It must feed candidate discovery/resolution; it must not be bulk-published or allowed to bypass canonical validation.

High-scale historical/aggregate reach claims remain subject to their forensic publication status. A number appearing in an old report is not sufficient for automatic public promotion.

## P0 invariants before broad implementation

1. Do not overwrite the newer AppDeploy production snapshot with stale GitHub root source.
2. Reconcile/export the current live source into auditable Git history.
3. Establish exact AppDeploy-version ↔ Git-commit mapping.
4. Add an executable test harness.
5. Make visual QA candidate-version-bound.
6. Move factual component hard-codes to canonical projections when canon owns the fact.
7. Keep private/vault evidence private unless a public publication basis exists.
8. Keep production untouched from this feature branch.

## Rollback posture

No production write was made while creating this baseline. The currently applied AppDeploy version remains the production rollback reference until a later candidate is explicitly authorized and accepted.
