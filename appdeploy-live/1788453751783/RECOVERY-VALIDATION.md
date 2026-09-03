# 7YA v95 Life Pulse recovery validation

Date: 2026-09-03

## Current production authority

- AppDeploy app: `697a008fddc309b142`
- Applied snapshot restored after rollback probe: `1788453751783`
- Release: `7ya-bulk-repair-20260903-v6`
- Runtime status after restore: `READY`
- QA errors after restore: `0 frontend / 0 backend / 0 network`
- `7ya.io`: active and verified on AppDeploy v2
- `www.7ya.io`: active and verified on AppDeploy v2

## Defect isolated

The current homepage has all of the following at once:

1. `homeVisualCorpus` contains real source-linked life/media records.
2. Copy keys `framesK`, `framesT`, `framesP` still describe a nine-frame visual story.
3. `documentary-home.css` still contains the complete `.dh-frames`, `.dh-frame-grid`, `.dh-frame`, metric and mobile snap-rail styles.
4. `DocumentaryHome.tsx` no longer renders that frame grid. It renders the life timeline, then only two `dh-human` cards, then the four generic current-work category cards.

This is a presentation regression, not a missing-content problem.

## Rollback experiment

A controlled live probe applied older snapshot `1788426692289` and was rejected because `/api/release` fell through to SPA HTML. Production was immediately restored to `1788453751783` and returned to READY.

Conclusion: do not solve the visual regression by rolling back the whole app.

## Surgical candidate

`SURGICAL-LIFE-PULSE-PATCH.json` stages three minimal changes:

- add a fixed nine-record `lifePulse` derived only from the existing verified visual corpus;
- render it directly after the front door and before generic category navigation;
- extend the existing visual QA test to require the Life Pulse on desktop and mobile.

No new backend route, dependency, secret, image, fabricated metric, viewer state or API architecture is introduced.

## Anchor preflight

Validated directly against AppDeploy snapshot `1788453751783`:

- current `human=useMemo(...)` anchor exists;
- `NarrativeChapters mode='home'` insertion anchor exists;
- `.dh a{color:inherit}.dh button` CSS anchor exists;
- all three Test 3 text anchors exist in `tests/tests.txt`;
- existing mobile CSS already turns `.dh-frame-grid` into a horizontal snap rail.

## Deployment boundary

The patch is intentionally **not** marked applied. `deploy_app` is blocked by the AppDeploy account lifetime limit (`125/125`). The current good v95 runtime remains live. When a write-capable deployment path becomes available, apply this staged patch to v95, run the existing test suite and visual acceptance gates, then verify `7ya.io` itself before declaring FIXED.
