# 7YA Global Repair v1 — Executable Patch Contract

Target release: `7ya-global-repair-20260904-v1`  
Production baseline: AppDeploy app `697a008fddc309b142`, applied version `1788453751783` (v93)  
Repair branch: `repair/global-20260904`  
Status: **READY TO APPLY TO AN EXACT v93 SOURCE EXPORT; NOT DEPLOYED**

The executable source of truth for this patch is:

`ops/recovery/apply-appdeploy-v93-global-repair.mjs`

The applicator is intentionally fail-closed. It requires the exact v93 release marker, required files, the NVIDIA secret-name contract, and `nvidia/nemotron-3-super-120b-a12b` before changing the recovered tree. It aborts on missing or non-unique anchors rather than guessing.

## Non-negotiable invariants

- Preserve the existing NVIDIA-first Bro Chat backend.
- Preserve provider order `nvidia -> appdeploy-agent -> local`.
- Preserve Canon authority over Discovery.
- Never expose secret values, hidden reasoning or private memory.
- Preserve the protected NVIDIA canary; do not claim live NVIDIA inference until the canary passes in the released runtime.
- Preserve all existing source-media sections; move them deeper instead of deleting them.
- No fake historical imagery and no generated imagery presented as documentary evidence.
- HE / EN / RU share the same first-scroll hierarchy.
- Production rollback remains AppDeploy v93 (`1788453751783`) until a replacement passes build, runtime and live visual acceptance.

## User-visible hierarchy

The active homepage becomes:

`Authentic human cover -> 100 Moments -> narrative chapters -> source-media universe -> life timeline / human / now -> live archive -> media / impact`

The cover has exactly three primary actions:

1. `100 Moments`
2. `What I am building now`
3. `Bro Chat`

The dashboard-like opening proof row (`7B+`, `5.13M`, etc.) is removed from the cover. Source-backed metrics remain available in deeper evidence/media contexts.

## Core file changes

### `src/documentary-home/LivingBiographyCover.tsx`

Create a lightweight authentic-person cover using the existing `./resources/igor-hero.jpg`, locale helpers and the current front-door CSS system. It keeps the existing chronology headline and links to `#hundred-moments`, `#now`, and Bro Chat. Bro Chat query construction must choose `?` or `&` based on the locale home URL.

### `src/documentary-home/LivingFrontDoor.tsx`

Add a `hideHero` prop. When `hideHero` is true, suppress only the current hero. Preserve the three source posters, projected source mosaic, News 13 feature, StartOn feature and music feature as the deeper source-media world.

### `src/documentary-home/DocumentaryHome.tsx`

- Render `LivingBiographyCover` first.
- Lazy-load and render existing `HundredMoments` immediately after it.
- Change the skip target to `#hundred-moments`.
- Render deferred narrative chapters next.
- Render `LivingFrontDoor hideHero` after the narrative so the source world survives without a duplicate hero.

### `src/life-first/HundredMoments.tsx`

Rename the atlas visibly to `100 MOMENTS` in HE/EN/RU, keep the existing Canon/Archive/Discovery/Live mechanics, replace remaining `Digital Igor` wording with `Bro Chat`, and correct moment-to-chat query construction so clean locale URLs do not receive an invalid leading `&`.

### `src/documentary-home/living-front-door-20260903.css`

Reuse the existing design system. Add only cover-specific rules for a taller human-first opening, chronology cue and three responsive actions; do not introduce another global visual system.

## Static first paint and release identity

Change release marker from:

`7ya-bulk-repair-20260903-v6`

to:

`7ya-global-repair-20260904-v1`

Affected release surfaces include:

- `backend/index.ts`
- `index.html`
- `public/en/index.html`
- `public/ru/index.html`
- `public/static-health.json`
- `public/release.json`
- `public/integrity/index.html`

HE root removes the proof-pill wall and exposes the three actions. EN and RU use the same three-action hierarchy and replace the obsolete “Not a site about me. Life itself.” / “Не сайт обо мне. Сама жизнь.” social titles with the Living Biography / 100 Moments positioning.

`public/release.json` target identity:

```json
{
  "release": "7ya-global-repair-20260904-v1",
  "build_marker": "7ya-global-repair-20260904-v1",
  "deployed_on": "2026-09-04",
  "experience": "LIVING_BIOGRAPHY_100_MOMENTS_GLOBAL_REPAIR_V1"
}
```

## Test contract — keep the suite at 5 tests

AppDeploy's current generated-test contract caps the suite at five tests. **Do not add Test 6.** Reconcile the existing **Test 3** instead so it jointly covers:

- desktop and mobile live visual acceptance;
- authentic human cover in viewport one;
- exactly three cover actions and no opening metric wall;
- `100 MOMENTS` as the next major exploration section before REAL MEDIA/source mosaic;
- valid moment -> Bro Chat context handoff;
- deeper authentic media preservation, including approved/public-mirror behavior;
- no duplicate hero, clipping or horizontal overflow;
- the same HE/EN/RU hierarchy.

Update Test 4's expected release marker to `7ya-global-repair-20260904-v1`.

## NVIDIA release gate

This slice does not redesign the NVIDIA agent. After a deploy-capable path is restored, verify:

- companion status still reports NVIDIA configured and `nvidia/nemotron-3-super-120b-a12b`;
- factual Bro Chat requests still require public retrieval;
- fallback remains NVIDIA -> AppDeploy agent -> local;
- protected canary passes under an authorized admin session before any end-to-end NVIDIA claim.

## Visual acceptance gate

Do not call this release **FIXED** until the live site itself proves on mobile and desktop:

- authentic Igor image visible in viewport one;
- no proof/metric wall dominating the cover;
- exactly three readable/reachable cover actions;
- 100 Moments is the first major section below the cover;
- no duplicate hero;
- no clipping or horizontal overflow;
- deep source media remains present after the atlas/narrative;
- HE, EN and RU share the same hierarchy.

## Release-control blockers observed on 2026-09-04

- AppDeploy write path rejected deployment before mutation because the Free account reached lifetime `125/125` deploy requests. Do not retry until capacity changes.
- AppDeploy documentation confirms source access and Bulk Source Export / ZIP; the exact v93 ZIP has been requested from support because the connected tool surface does not expose the export action.
- GitHub Actions is not a code failure: current jobs die before step 1, and historical GitHub notices identify an account billing lock. Keep Actions out of the release critical path until that account state is resolved.
- Historical `appdeploy-live/*` directories are ledger receipts, not complete source exports.
- Do not move `7ya.io` to the July Vercel static recovery proxy or any other stale runtime.
