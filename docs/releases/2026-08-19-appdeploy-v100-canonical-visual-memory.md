# 7YA AppDeploy v100 — canonical trust/conversion stabilization receipt

Date: 2026-08-19 (Asia/Jerusalem)
AppDeploy app: `697a008fddc309b142`
Ready runtime version: `1787088330473` (`v100`)
Focused visual-QA runtime: `1787087873168` (`v98`)

## Production state

A fresh AppDeploy status check reports v100 `ready`, with no frontend or backend runtime errors. Both custom hostnames, `7ya.io` and `www.7ya.io`, are active on the AppDeploy v2 proxy.

## Approved trust/conversion plan — runtime source audit

The current v100 runtime was read directly and compared with the approved `PERSON → PROOF → PURPOSE → PARTICIPATION` implementation plan.

### Task 1 — canonical Echo / fail closed

Present in v100:
- `src/canonical-echo.ts` uses the approved canonical home-event allowlist.
- Public source nodes and source-local metrics remain separate.
- `InfluenceUniverse.tsx` loads `/api/corpus` through `fetchCanonicalCorpus(100,'archive')` and displays `EVIDENCE SAFETY` instead of static influence claims when canonical data is unavailable.
- No homepage dependency on the old static Echo metrics was observed.

### Task 2 — explicit session-local visitor intent

Present in v100:
- `src/life-first/visitor-intent.ts` exposes the eight approved intents and stores only `intent` + `selectedAt` under `7ya.visitor.intent.v1` in `sessionStorage`, wrapped in `try/catch`.
- `UserHandoff.tsx` renders eight localized paths, including `StartOn / נוער`, without name, email or phone inputs.
- It shows documentary `STORY EVIDENCE` before asking the visitor to choose a path.
- `LifeFirstHero.tsx` preserves exactly three primary actions and routes `לבנות איתי / Build with me` to `#your-path`.

### Task 3 — contextual participation handoffs

Present in v100:
- `ContextualHandoff.tsx` contains distinct `influence`, `research`, and `starton` configurations.
- The exact English primary actions are `Build a public-information move together`, `Discuss the research`, and `Build a youth opportunity pathway`.
- Primary activation records only the explicit session intent before navigation.
- `LifeFirstHome.tsx` places the handoffs in the approved narrative order: lived story / Right Now → Echo → influence handoff → visual memory / creation → research → research handoff → StartOn → StartOn handoff → YOUR PATH → rooms → Deep Archive.

### Task 4 — canonical visual memory instead of repeated decoration

Present in v100:
- `src/PostPortraitWall.tsx` is corpus-driven rather than a hard-coded repeated post wall.
- The opening set is ordered from distinct canonical event ids, deduplicates both event ids and image URLs, requires a public source, and fails closed to a source-linked card if an image cannot be displayed.
- It does not substitute a generic portrait or AI simulation as event evidence.

The opening canonical ids are:
1. `service-field-2011-2021`
2. `starton-return-2022`
3. `fatherhood-viral-2023-02-20`
4. `public-voice-2023`
5. `twenties-retrospective-2024`
6. `identity-longform-2024`
7. `life-music-2025`
8. `7ya-now-snapshot-2026`

Verified visual snapshot metrics are read only from the dated `7ya-now-snapshot-2026` event and only when `verification === 'verified'`.

## Runtime QA evidence

### v100 sanity — PASS

QA run group `999df7280e0d0de2`, job `f1eeb593-798b-42a2-a87d-cf403d307fa9`, passed the `YOUR PATH routes to StartOn without identity capture` sanity test on v100. The run confirmed the StartOn path and absence of identity fields. No frontend errors were observed. A QA-side metrics POST was aborted, but it did not prevent the tested journey.

### v100 contextual-handoff test — BAD TEST / stale-content navigation

Job `a328b73b-91cf-4b4a-bb80-0ac33d8f5b35` was not treated as an application regression. The QA agent navigated into the `Build` section and reported only the StartOn handoff there, then classified its own test as `bad_test` with reason `stale_content`. A direct read of the same v100 runtime source confirms that all three expected handoff headings/actions exist in `ContextualHandoff.tsx` and are mounted by `LifeFirstHome.tsx`. This receipt therefore records the mismatch as a QA-navigation/observability issue, not as a verified product defect.

### v100 broad proof test — SKIPPED / worker timeout

Job `3d8c7695-0e2f-4b8e-b15c-be9385ff03aa` was skipped after the QA worker exceeded its 370-second execution limit. It did not report an application error.

### Focused visual regression — PASS on v98 implementation retained in v100

QA run group `32acf098e18ea4c6`, job `be0cb99b-e6d4-413c-8dd8-bc0bb1f03ac0`, passed on mobile after the canonical wall implementation was present. It verified distinct service, StartOn, fatherhood, public-voice, retrospective and creation moments, while the adjacent repeated fatherhood cards `תודה רבה לכולם` and `הסיפור ממשיך בתוך התגובות` were absent. It then switched to English and measured `page_horizontal_overflow_px = 0`.

The ready v100 source was re-read after release and retains the same canonical/deduplicated wall implementation.

### Canonical safety regression — PASS on v98 implementation retained in v100

The same focused QA group deliberately faulted `/api/corpus` with HTTP 500. Public Action / Echo showed `EVIDENCE SAFETY` and did not expose the quarantined hard-coded `213K` or `14K` values. Current v100 source retains that fail-closed code path.

## Deep Archive source check

Current v100 `DeepArchiveRiver.tsx` deduplicates public records by canonical URL, attempts distinct categories/sources first, then fills until eight visible records, and renders numbered `data-archive-record` cards. The broad v100 QA test that would independently count all eight timed out, so this is source-level verification rather than a separate successful full-route E2E claim.

## Rollback / source-of-truth discipline

AppDeploy version history preserves pre-stabilization runtimes. The runtime currently leads the repository root for some production source files, so do not reconstruct production from stale root source. Inspect the applied AppDeploy snapshot first, then reconcile deliberately. This receipt exists specifically to prevent another loop in which an older repository snapshot is mistaken for the live site.
