# 7YA AppDeploy living-story release — 1787659549109

Status: **READY**

Canonical domain: `https://7ya.io/`
Production app: `697a008fddc309b142`
Working branch: `reorg/living-story-20260825`
QA capture set: `1787659606432`

## Product cutover

This release reorganizes the public homepage around Igor Vepretski as a first-person human story rather than around 7YA system terminology.

Visible hierarchy:

1. **אני איגור / I’m Igor / Я — Игорь** — authentic public-life visual and first-person introduction.
2. Three simple visitor paths: get to know me / see what I do / talk with me.
3. **What I do now** — StartOn, public work, media & creation, research & ideas.
4. Life story and contextual public media.
5. Public action, StartOn, creation, research and current work.
6. Open-ended public-life archive.
7. Timeline, digital history, evidence graph and platform machinery deferred to a deeper sources layer.

## Archive architecture

The old fixed `100 moments` ceiling is removed as a product rule. The public projection remains cursor-paginated by the backend. The homepage now loads the first projection page and exposes **More from the archive** to request the next cursor page, retaining already loaded items and deduplicating by source/media identity.

This keeps the archive logically open-ended without eagerly rendering/fetching thousands of public objects on first load.

## Verification

AppDeploy terminal status after the performance pass: `ready`.
Frontend errors: `0`.
Network errors: `0`.
Fresh AppDeploy QA screenshots were generated for desktop and mobile under capture set `1787659606432`.
E2E runner result: not supplied by AppDeploy for this snapshot (`e2e_tests = null`).

## Changed production files

- `src/life-first/PersonalStoryEntry.tsx` — first-person human entry and current-work map.
- `src/life-first/personal-story-entry.css` — editorial full-bleed responsive entry styling.
- `src/life-first/AutobiographicalCinema.tsx` — story-first ordering; technical layers deferred.
- `src/life-first/HundredMoments.tsx` — open archive + cursor-based progressive loading.
- `src/life-first/hundred-moments.css` — archive paging control styling.
- `tests/tests.txt` — first-person, no-100-ceiling, progressive archive and mobile acceptance contract.

## Source-control boundary

The historical GitHub `main` tree still does not represent the full current AppDeploy runtime tree. This branch records the verified production state instead of pretending otherwise. The next reconciliation step is to move the active AppDeploy runtime into one canonical application tree, run its normal CI chain there, and only then make that tree the deploy source of truth.
