# Igor-Branded Life Atlas — Design

Date: 2026-08-24
Status: APPROVED FOR EXECUTION
Owner: Igor Vepretski / #7YA

## Goal
Make the existing 100 Moments archive communicate the scale of Igor Vepretski's public life immediately, while keeping NVIDIA/Nemotron strictly behind the scenes as a reasoning and curation engine.

## Brand rule
The public visual identity is Igor Vepretski × #7YA🥷 × StartOn. NVIDIA is infrastructure, never a co-brand, logo, visual motif, or public design language.

## User-visible change
Keep the existing large selected-moment stage, but add an exhaustive visual contact sheet beneath it. The contact sheet shows every currently visible moment in the active evidence layer as a compact clickable tile with index, year, layer, real source image when available, and a branded source-poster fallback otherwise. Selecting a tile updates the large stage.

The archive masthead becomes explicitly personal: `IGOR VEPRETSKI × #7YA🥷` plus `PUBLIC LIFE ATLAS`, while the existing evidence-layer filter and source links remain intact.

## Evidence boundaries
- Canon / Public Archive / Discovery / Live remain visibly distinct.
- No Discovery item is promoted to Canon.
- Fetch-restricted or image-failed sources remain present through a typographic fallback rather than being treated as dead.
- Existing curation/deduplication logic remains unchanged.
- No new impact metric or unsupported biographical claim is introduced.

## Responsive behavior
Desktop: dense multi-column contact sheet that makes corpus scale visible at a glance.
Mobile: two-column contact sheet with touch-sized tiles and no horizontal overflow.
Reduced-motion preference remains respected by the surrounding experience.

## Files
- `src/life-first/HundredMoments.tsx`
- `src/life-first/hundred-moments.css`
- `tests/tests.txt`

## Acceptance gates
1. The first major archive section visibly says `IGOR VEPRETSKI × #7YA🥷` and `PUBLIC LIFE ATLAS`.
2. The selected moment remains large, source-linked and navigable.
3. Every filtered moment is represented in the contact sheet, not only five timeline jump points.
4. Clicking a contact-sheet tile updates the selected moment.
5. Canon / Archive / Discovery / Live labels and counts remain visible and correct.
6. Mobile has no horizontal page overflow.
7. AppDeploy frontend/network/backend QA returns zero errors after deployment.
