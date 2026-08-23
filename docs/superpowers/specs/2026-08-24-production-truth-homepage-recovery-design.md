# 7YA Production Truth + Homepage Recovery — Design

Date: 2026-08-24
Status: APPROVED FOR EXECUTION
Owner: Igor Vepretski / 7YA

## Goal

Deliver one immediately visible production improvement while beginning the move to a single production truth.

The first slice is deliberately narrow: make the existing evidence-backed `100 Moments` archive a primary homepage experience instead of leaving it buried behind technical/system layers.

## Root cause

The current AppDeploy production already contains a substantial life-archive stack, including an evidence-backed `HundredMoments` component fed by Canon, Visual Registry and Public Discovery. However the component is rendered near the bottom of the autobiographical homepage, after multiple technical/system experiences. The public experience therefore under-represents the quantity of available life material even though the material exists.

A second architectural issue remains: the live AppDeploy source snapshot and the older GitHub static production projection are not aligned. This slice does not attempt the full migration. It establishes the recovery pattern: production behavior is documented, tested, and mirrored back into GitHub after a validated deploy.

## User-visible change

On the homepage, render `HundredMoments` immediately after the opening autobiographical cover and before the origin/service/system sections.

This makes the first scroll communicate:

1. real person / real portrait;
2. full public-life depth through the 100 Moments archive;
3. then the directed chronological story.

No archive records are fabricated, duplicated or promoted in verification status. Existing filters and source links remain unchanged.

## Files / boundaries

Production AppDeploy source:
- `src/life-first/AutobiographicalCinema.tsx` — reorder `HundredMoments` only.
- `tests/tests.txt` — add/reconcile user-visible QA for the new primary homepage order.

GitHub recovery receipt:
- this design document;
- implementation plan;
- post-deploy receipt identifying AppDeploy version, QA state and source diff.

## Acceptance gates

- Homepage opens with the existing real-photo autobiographical cover.
- `100 MOMENTS · PUBLIC LIFE ARCHIVE` is visible immediately after the cover on the first downward scroll.
- The 100 Moments layer filters remain interactive.
- Moment source links remain external and clickable.
- Origin and the rest of the autobiographical cinema remain present after the archive block.
- No frontend or network errors in AppDeploy QA.
- Mobile and desktop QA snapshots are generated after deployment.
- `7ya.io` custom domain remains active on the validated AppDeploy app.

## Non-goals for this slice

- No Supabase migration yet.
- No Windsor.ai or vidIQ ingestion yet.
- No new claims or metrics.
- No broad redesign of all routes.
- No deletion of technical layers; only homepage hierarchy changes.

## Next slice after validation

Recover the validated live application source into a GitHub-controlled application tree and generate release metadata from the exact deployed source version, eliminating the current source-alignment ambiguity.