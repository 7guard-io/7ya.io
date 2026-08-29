# 7YA Home Editorial Cutover — deployed

Production runtime: AppDeploy app `697a008fddc309b142`, runtime `v98` / `1788013951183`, released 2026-08-29 14:32:31Z.

The approved editorial cutover is now production-published. The runtime was reconciled against the newer Igor desktop/mobile cutover layers before release so the intended homepage hierarchy is not defeated by later `!important` rules.

## Visual result

- Igor and real media remain the first visual signal.
- Above-the-fold text density is reduced on mobile.
- Source-layer controls recede from the primary emotional journey.
- The public-life archive opens with a large cinematic stage.
- The moment atlas uses four columns on desktop and two columns on mobile.
- Evidence, archive and system surfaces remain available as deeper layers.

## Production changes

1. `src/life-first/editorial-cutover-20260826.css` is imported last from `AutobiographicalCinema.tsx`, after `igor-mobile-rich-20260826.css`.
2. The deployed CSS contains explicit high-specificity overrides for the source filter, cinematic stage and mobile atlas.
3. `tests/tests.txt` includes a mobile editorial-cutover contract covering hero density, stage hierarchy, source-filter suppression, two-column atlas layout and horizontal-overflow safety.
4. Backend, evidence corpus and routing were not changed by this cutover.

## Deployment authority

AppDeploy is the production authority for `7ya.io`. The accidental Jekyll/GitHub Pages push trigger has been changed to manual-only so pushes to `main` no longer create a competing production signal.

## Verification

- AppDeploy status: `ready`.
- Frontend runtime errors: `0` at verification.
- Backend runtime errors: `0` at verification.
- `7ya.io`: active on the AppDeploy v2 custom-domain proxy.
- `www.7ya.io`: active on the AppDeploy v2 custom-domain proxy.

The machine-readable production receipt is in `patch.json`.
