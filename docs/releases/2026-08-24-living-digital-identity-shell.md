# 7YA Living Digital Identity Shell — Release Receipt

Date: 2026-08-24
Production app: AppDeploy `697a008fddc309b142`
Primary domain: `https://7ya.io`

## Released experience

The approved human-first Living Digital Identity shell is now implemented over the existing public corpus:

- one public world model: `IGOR · STORY · ATLAS · NOW · TALK`;
- documentary cover with three primary actions: Watch / Explore / Talk;
- `STORY` enters the chronological biography;
- `ATLAS` enters the source-backed 100 Moments time machine;
- `NOW` enters the live edge and public-source feed;
- `TALK` opens Digital Igor;
- desktop uses one persistent five-world navigator; the compact cover navigator is mobile-only;
- deep system/evidence machinery is deferred until after NOW inside a closed `SYSTEM · EVIDENCE ON DEMAND` vault.

## Atlas → conversation

100 Moments is no longer only a source gallery:

- every active moment can launch `Ask Digital Igor about this moment`;
- the selected title is carried into `journeyChapter=archive`;
- Digital Igor opens an `ARCHIVE / MOMENT` context with source/evidence, before/after and wider-story prompts;
- `archive_moment` is preserved for neutral follow-up questions;
- archive-moment requests are routed to `INVESTIGATOR`;
- NVIDIA retrieval is mandatory for `archive_moment`, forcing `search_content_graph` before a factual final response;
- the AppDeploy tool-agent fallback is also instructed to search the content graph before answering archive-moment factual questions;
- during dynamic Atlas loading, evidence-layer counters show an indeterminate state instead of misleading factual zeros.

## NVIDIA state

The production app has a configured `NVIDIA_API_KEY` secret name. The backend uses `nvidia/nemotron-3-super-120b-a12b` as the primary tool agent, with canonical graph, public Discovery, entity, related-content, public-page and action tools. Provider fallback remains NVIDIA → AppDeploy tool agent → local deterministic router.

This release does **not** claim NVIDIA NeMo Retriever is deployed. Retrieval is currently performed through 7YA's own Canon / Public Internet Graph / Discovery / Entity tools, orchestrated by Nemotron. NeMo-specific multimodal indexing remains a separate infrastructure phase.

## Runtime files changed

- `src/life-first/AutobiographicalCinema.tsx`
- `src/life-first/autobiographical-cinema.css`
- `src/life-first/HundredMoments.tsx`
- `src/life-first/hundred-moments.css`
- `src/GlobalNav.tsx`
- `src/global-nav.css`
- `src/StoryCompanion.tsx`
- `backend/index.ts`
- `tests/tests.txt`

## Production verification

Production was updated from more than one active execution path during this release. Follow-up changes were therefore applied as narrow semantic diffs against the current AppDeploy source instead of stale whole-file overwrites.

Latest post-concurrency source verification observed active source version `1787551985973` and confirmed:

- `archive_moment` remains present in the backend in six relevant routing/retrieval locations;
- the Atlas loading-count guard remains present;
- `SYSTEM · EVIDENCE ON DEMAND` remains a closed `<details>` vault after NOW;
- the five-world navigation remains in GlobalNav;
- the Atlas-to-chat archive context remains present.

Fresh AppDeploy terminal status after that verification was `ready` with zero frontend, backend and network errors. Fresh desktop and mobile QA screenshots were generated in QA snapshot `1787552032941`.

AppDeploy did not surface an end-to-end result object (`e2e_tests` remained null), so this receipt deliberately does **not** claim a green e2e suite or a machine-inspected pixel audit. Runtime QA, source assertions and generated QA screenshots are the available verification evidence for this release.

## Domain

Both `7ya.io` and `www.7ya.io` are active on the AppDeploy v2 custom-domain stage.

## Source-of-truth note

The live application source remains managed by the AppDeploy production snapshot. GitHub records the design, plans and release evidence, but this receipt does **not** claim that GitHub has yet recovered the full live application tree. Production-source reconciliation remains a separate architectural task.
