# 7YA Living Digital Identity Shell — Release Receipt

Date: 2026-08-24
Production app: AppDeploy `697a008fddc309b142`
Primary domain: `https://7ya.io`

## Change

Implemented the approved human-first homepage shell over the existing Living Biography runtime:

- public world navigation: `IGOR · STORY · ATLAS · NOW · TALK`;
- three primary cover actions aligned to Watch / Explore / Talk;
- `STORY` enters the chronological biography;
- `ATLAS` enters the existing source-backed 100 Moments experience;
- `NOW` jumps to the live edge;
- `TALK` opens Digital Igor;
- retained the authentic portrait, chronology rail, 100 Moments corpus, Canon/Discovery boundaries, NVIDIA agent and deeper archive layers.

## Second production slice

The shell was then tightened against the active production snapshot rather than treated as a one-off hero patch:

- unified the persistent desktop navigation to the same five-world model;
- unified secondary-route mobile navigation to five items: `IGOR · STORY · ATLAS · NOW · TALK`;
- kept the five-world cover navigator mobile-only so desktop has one visible five-item navigator instead of duplicating navigation;
- added a per-moment `Ask Digital Igor about this moment` action to the 100 Moments atlas;
- the atlas launch carries the selected moment title as journey context;
- Digital Igor now recognizes `ARCHIVE / MOMENT` as an `archive_moment` intent and opens with source/evidence-oriented prompts instead of the generic journey-reflection opening;
- preserved the editorial order: person → 100 Moments → chronological life → Digital History → StartOn / creation / research → NOW → system/evidence depth.

## Runtime files changed

- `src/life-first/AutobiographicalCinema.tsx`
- `src/life-first/autobiographical-cinema.css`
- `src/life-first/HundredMoments.tsx`
- `src/life-first/hundred-moments.css`
- `src/GlobalNav.tsx`
- `src/global-nav.css`
- `src/StoryCompanion.tsx`
- `tests/tests.txt`

## AppDeploy versions

Observed during this release sequence:

- pre-change applied source: `1787549720516`
- first test-first acceptance snapshot: `1787550672886`
- first visible shell snapshot: `1787550770531`
- atlas / global-navigation slice: `1787550932484`
- archive-aware / single-visible-nav slice: `1787551295757`
- post-concurrency active source verified: `1787551368300`

Production was being updated from more than one active execution path during the release. Every follow-up patch was therefore rebased semantically against the current AppDeploy snapshot before applying; no stale full-file overwrite was used.

## Verification

Fresh AppDeploy status after the final observed concurrent deployment reported `ready` with zero frontend, backend and network errors. Fresh desktop and mobile QA snapshots were generated.

Post-concurrency source verification on active version `1787551368300` confirmed:

- desktop and secondary mobile navigation both use `IGOR · STORY · ATLAS · NOW · TALK`;
- the cover world navigator is hidden by default and enabled only under the mobile breakpoint;
- 100 Moments carries the selected moment into `journeyChapter=archive`;
- Digital Igor contains the `archive_moment` intent plus source/evidence, before/after and wider-story suggestions.

No end-to-end result object was surfaced by AppDeploy (`e2e_tests` remained null), so this receipt deliberately does **not** claim a green e2e suite. Runtime/QA status and source assertions are the verification evidence available for this release.

## Source-of-truth note

The live application source remains managed by the AppDeploy production snapshot. GitHub currently records the design, plan and release evidence, but this receipt does **not** claim that GitHub has yet recovered the full live application tree. Production-source reconciliation remains a separate architectural task.
