# 7YA AppDeploy optimized living-story release — 1787660538210

Status: **READY**

Canonical domain: `https://7ya.io/`
Production app: `697a008fddc309b142`
Working branch: `reorg/living-story-20260825`

## What changed

This pass keeps the story-first homepage and adds performance + HE/EN/RU localization hardening.

### Performance

- Closed chronology content does not mount until its `<details>` is opened.
- Closed sources/evidence/platform machinery does not mount until opened.
- Live-social content is deferred until the visitor approaches that part of the page.
- The public-life archive is deferred by IntersectionObserver.
- `HundredMoments` is code-split with `React.lazy`, so its JavaScript chunk is requested only when the deferred archive mounts.
- Public projection initial page reduced from 100 to 48 items, with cursor-based “more” pagination preserving the open-ended archive.

### Localization

- Hebrew chapter labels are localized instead of exposing English editorial/system labels.
- Russian chapter labels are localized.
- Fixed Russian service-copy typo and phrasing (`научили меня ...`).
- Removed mixed `ledger` wording from Russian and English chronology guidance.
- Hebrew no longer uses raw `badge` / `feed` wording in the first-person narrative.
- Current-work, archive, chronology and sources-layer UI labels are localized in HE/EN/RU.
- Removed stale `dir="ltr"` wrappers around translated Hebrew/Russian labels; brand/source identifiers that are genuinely Latin remain LTR.

## Verification

- AppDeploy validation: passed.
- Deployment status: `ready`.
- Frontend runtime errors: `0`.
- Backend runtime errors: `0`.
- The immediately preceding optimization/localization snapshot `1787660430293` produced clean desktop/mobile QA captures (`1787660484066`) with 0 frontend/network errors. This final snapshot adds BiDi direction corrections and also reached `ready`; AppDeploy did not attach a new screenshot artifact to the final status response.

## Source-control boundary

GitHub `main` remains the historical application tree and is not yet equivalent to the full AppDeploy runtime. This branch intentionally records the verified production evolution and should be used for a controlled canonical-runtime reconciliation, rather than pretending the historical tree already matches production.
