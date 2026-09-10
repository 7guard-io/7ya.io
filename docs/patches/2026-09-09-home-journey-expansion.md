# Homepage journey expansion

Target AppDeploy app: `697a008fddc309b142`
Inspected production snapshot: `1788906120223`
Status: ready to apply when AppDeploy deployment access is available.

## Current production behavior

`src/documentary-home/NarrativeChapters.tsx` defines fourteen chapters, but Home currently exposes only seven:

```ts
const homeChapterIndexes=new Set([0,2,3,6,7,10,13]);
```

## Intended patch

Expose thirteen existing chapters on Home while leaving the detailed early-life interlude to the full journey:

```diff
-const homeChapterIndexes=new Set([0,2,3,6,7,10,13]);
+const homeChapterIndexes=new Set([0,2,3,4,5,6,7,8,9,10,11,12,13]);
```

This is an editorial hierarchy correction only. It reuses the existing chapter copy, media and source links and adds no new claims or assets.

## QA required with deployment

Update the existing AppDeploy test suite so one test verifies, on a 375x667 viewport, that the Home journey includes the newly exposed existing chapters and remains readable with working source/archive actions. Keep the total suite at five tests and exactly one `[sanity]` marker.

## Deployment note

A deployment attempt on 2026-09-09 was rejected before build because the current AppDeploy plan had reached its lifetime deploy limit (`125/125`). Do not mark this patch live until a new AppDeploy deployment succeeds and the live domain is re-verified.

GitHub Pages remains a manual legacy snapshot and is not a safe substitute for the AppDeploy production runtime.
