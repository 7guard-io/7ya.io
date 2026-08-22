# 7YA Media Appearances deployment receipt

Date: 2026-08-22
Target AppDeploy app: `697a008fddc309b142`
Base production AppDeploy version: `1787349128019` (v99)
Final deployed AppDeploy version: `1787385302511`
Deployment intent: rich canonical third-party Media Appearances wall

## Source reconciliation

The current AppDeploy React/Vite production snapshot is newer than the repository's root source tree. To avoid overwriting production with a stale tree, this receipt records the validated patch while the executable update is applied to AppDeploy's remote production snapshot.

## Local gate

`npm run ci:local` — PASS after final consolidation pass

- 6/6 Media Appearance graph/visual/source-contract tests passed
- TypeScript typecheck passed with Vite-compatible `moduleResolution: bundler`

## Final validated patch hashes

- `src/media-appearances.ts` — `0f33415c32d996897b2039cb63b2d799d5fc2b3cdf11657d9237daaba8a76900`
- `src/ThirdPartyAppearances.tsx` — `fd9ffe6a0180c644d3da6c1acf812c0170fab45dd6eeba192a0a661afa43d3ec`
- `src/media-appearances.css` — `c8b0b1a5cb55f26dab53899f6f62c1e74f693678f917d3d63df160b1fde3b2e7`
- `tests/tests.txt` — `cbfbe7fd92ada1d499b8fd198ae81c23f7d4973a711b6c565e14026772e1caa1`

## Behavior covered

- canonical appearance entities instead of URL-count inflation
- external/publisher source prioritized; owned mirrors grouped underneath
- real/source-specific thumbnails and privacy-enhanced YouTube player
- TV / podcast / radio / conversation / Russian / StartOn / immigration & identity filters
- NDI repatriation/identity appearance included as a canonical third-party source
- recovered Glass Ceilings #54, Home Creators #3, KAN REKA, Mindset, Moving Minds and other public-interest appearances
- verified host uploads consolidated beneath Mindset #102, Glass Ceilings #18, Moving Minds and Freddy/Nadlan instead of duplicated as separate appearances
- unresolved legacy IZI embeds remain explicitly `REQUIRES CONFIRMATION`; no invented metadata
- AppDeploy QA generated fresh desktop and mobile snapshots for the final deployment
- final status `ready`; frontend, backend and network error arrays empty

## Platform testing note

AppDeploy reported `e2e_tests: not_found` for the deployed version even though `tests/tests.txt` is present in the snapshot. This receipt does not misstate that result. The local `ci:local` gate and AppDeploy runtime/QA status are the executed verification layers for this deployment.
