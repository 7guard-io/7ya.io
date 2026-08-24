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

## Runtime files changed

- `src/life-first/AutobiographicalCinema.tsx`
- `src/life-first/autobiographical-cinema.css`
- `tests/tests.txt` acceptance wording aligned before implementation

## AppDeploy versions

- pre-change applied source observed: `1787549720516`
- test-first acceptance snapshot: `1787550672886`
- implemented source snapshot: `1787550770531`

## Verification

Fresh AppDeploy status after implementation reported `ready` with zero frontend, backend and network errors. QA snapshots were generated for desktop and mobile.

Source verification on implemented snapshot found the new `IGOR STORY ATLAS NOW TALK` navigation in `AutobiographicalCinema.tsx` and the three cover actions wired to chronological STORY, the 100 Moments ATLAS and Digital Igor TALK.

Custom-domain configuration reported both `7ya.io` and `www.7ya.io` as `active` on the AppDeploy v2 stage.

## Source-of-truth note

The live application source remains managed by the AppDeploy production snapshot. GitHub currently records the design, plan and release evidence, but this receipt does **not** claim that GitHub has yet recovered the full live application tree. Production-source reconciliation remains a separate architectural task.
