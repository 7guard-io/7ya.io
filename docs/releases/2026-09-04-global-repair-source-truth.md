# 7YA Global Repair — Source Truth Lock

Date: 2026-09-04
Status: REPAIR APPROVED · PRODUCTION WRITE BLOCKED BY APPDEPLOY ACCOUNT QUOTA
Owner: Igor Vepretski / 7YA

## Preserved production baseline

- AppDeploy app: `697a008fddc309b142`
- Applied version before repair attempt: `1788453751783` (`v93`)
- Live release marker before repair: `7ya-bulk-repair-20260903-v6`
- Current production remains unchanged by this repair attempt.
- AppDeploy reported READY with no frontend/backend/network errors before the repair attempt.

## GitHub baseline

- Repository: `7guard-io/7ya.io`
- `main` baseline SHA: `6cb8db3b84899db1daf7b302562db1b56646eba1`
- Repair branch: `repair/global-20260904`
- The GitHub `main` tree is not the currently applied AppDeploy React/backend source. Source alignment remains incomplete and must be recovered before GitHub can again be called canonical production source.

## Verified production architecture

The applied AppDeploy snapshot uses the React/Vite `DocumentaryHome` path as the active homepage. Its current flow begins with `LivingFrontDoor`, which contains the hero plus real-media posters, a large source mosaic, broadcast media, StartOn and music before the existing `HundredMoments` component is surfaced on the active homepage.

The approved repair target is therefore:

`Living Biography human cover → 100 Moments → narrative chapters → deeper source-media world → current work / archive / media / impact`

The older `AutobiographicalCinema` tree is not the active homepage and must not become a third competing public shell.

## NVIDIA truth

- AppDeploy has an `NVIDIA_API_KEY` secret name configured; values are never exported.
- Applied backend source uses `nvidia/nemotron-3-super-120b-a12b` as the primary Digital Igor/Bro Chat reasoning-and-tool provider.
- Provider order remains `nvidia → appdeploy-agent → local`.
- The backend includes bounded tool use, continuation-aware retrieval, timeout/retry/circuit protection and a protected NVIDIA canary.
- Source/configuration is verified; end-to-end live NVIDIA inference is **not** independently claimed until the protected canary returns PASS under an authorized admin session.
- NeMo Retriever / multimodal retrieval is a later infrastructure slice; it is not claimed as deployed today.

## Custom domain truth

AppDeploy reports both `7ya.io` and `www.7ya.io` active and verified against the v2 proxy. Earlier raw public checks of `/api/release` and `/api/domain-proof` returned homepage HTML, while the applied backend source contains those JSON handlers and internal frontend calls use `@appdeploy/client`. Treat this as a proxy/request-path verification defect, not DNS/SSL failure, until reproduced through the platform contract after the next deploy-capable release.

## Repair slice prepared

A production patch was prepared with these changes:

1. Add a lightweight `LivingBiographyCover` with one authentic Igor hero, a chronology cue and exactly three primary actions: 100 Moments, what Igor is building now, Bro Chat.
2. Put the existing `HundredMoments` component immediately after the cover on the active `DocumentaryHome` homepage.
3. Keep the existing source-media universe by rendering `LivingFrontDoor` deeper without its duplicate hero.
4. Remove the dashboard-like proof/vanity metrics from the opening cover.
5. Rename the atlas visibly as `100 MOMENTS` in HE/EN/RU.
6. Fix the moment-to-Bro-Chat query separator on clean locale URLs.
7. Replace obsolete EN/RU social metadata slogan text.
8. Normalize static first-paint actions to the same three-entry hierarchy.
9. Bump release identity to `7ya-global-repair-20260904-v1` and add regression coverage for human-cover → 100 Moments.
10. Preserve the existing NVIDIA-first backend behavior unchanged.

## Deployment blocker

The prepared AppDeploy update was rejected before any production mutation because the account has reached the lifetime Free-plan deployment limit: `125/125` `deploy_app` requests. This is an account-level hard block and does not reset. Do not retry `deploy_app` until the limit is increased.

## Release gate after deployment capability is restored

A successful future release must pass all of the following before being called FIXED:

- build / E2E / runtime clean;
- live mobile screenshot inspection;
- live desktop screenshot inspection;
- HE / EN / RU first-paint and hydrated hierarchy;
- authentic human cover with no proof-wall dominance;
- `100 MOMENTS` immediately follows the cover;
- no duplicate hero;
- moment → Bro Chat context link works;
- Canon / Archive / Discovery / Live remain distinct;
- NVIDIA status remains configured and fallback-safe;
- protected NVIDIA canary PASS before claiming live NVIDIA inference;
- custom-domain `/api/*` behavior rechecked through the AppDeploy domain proxy;
- validated production snapshot mirrored back into GitHub before `main` becomes canonical production source again.
