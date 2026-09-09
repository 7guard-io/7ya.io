# 7YA Production Topology — 2026-09-09

## Status

This document records the verified production topology after repeated cases where code, previews, PRs, or QA were mistaken for a change to the public `7ya.io` experience.

## Current production reality

### Public domain
- `https://7ya.io/` is currently served by the AppDeploy production application `697a008fddc309b142`.
- The applied AppDeploy source snapshot inspected on 2026-09-09 is version `1788906120223`.
- AppDeploy QA reports the app READY with no current frontend/backend QA errors. This does **not** prove that public API ingress or custom-domain behavior is correct.

### AppDeploy backend ingress defect
- The applied backend source contains real `/api/*` router handlers including `/api/release`, `/api/health`, `/api/public-projection`, `/api/visual-registry`, `/api/social-feed`, `/api/companion/status`, and others.
- External requests to `/api/release` on both the custom domain and AppDeploy stage host have returned SPA HTML instead of backend JSON.
- This defect was escalated to AppDeploy support on 2026-09-04.
- AppDeploy replied on 2026-09-06 that the API routing issue had been forwarded to support.

### Why this affects visible integration
The current React homepage is not purely static. `LivingFrontDoor.tsx` and related components request live data through `@appdeploy/client`, including:
- `/api/public-projection?sort=impact&limit=72`
- `/api/visual-registry`
- `/api/social-feed`
- `/api/companion/status`

Those components contain curated/static fallback paths. Therefore a broken public API routing path can leave the visual site apparently healthy while preventing live/integrated content from materially changing the rendered experience. A READY AppDeploy QA status must never be treated as proof that these public integration boundaries are working.

## Deployment-capacity blocker
- `deploy_app` reached the Free-plan lifetime limit: 125/125.
- AppDeploy offered Igor Vepretski a complimentary interim upgrade that increases usage limits and removes the watermark.
- Approval for that complimentary upgrade was sent in the existing support thread on 2026-09-09.
- Do not retry production deployment until the account/app is actually observed with restored deployment capacity.

## Other environments — not production

### Vercel
- Project `7ya.io` exists under team `7ya` and is linked to `vepretski/7ya.io` branch `dev`.
- Its latest observed production deployment is READY, but Vercel currently lists only Vercel subdomains for that project and does not establish it as the live `7ya.io` custom-domain runtime.
- A Vercel email on 2026-09-07 reported one domain needing configuration.
- Do not infer that a Vercel READY deployment changed `7ya.io`.

### GitHub repositories
There are two materially different repositories:
- `7guard-io/7ya.io` — default branch `main`; governance/canonical repository used for current public-record work.
- `vepretski/7ya.io` — default branch `dev`; historically linked to the Vercel project.

Recent PRs in `vepretski/7ya.io` explicitly stated that AppDeploy production would remain untouched or that there would be no production DNS cutover. Those changes must not be described as live-site fixes unless the public domain is independently verified afterward.

### Floot
- `7YA Site Steward` exists and is separately published at `7.floot.app`.
- It has no attached `7ya.io` custom domain.
- Floot changes are therefore not production changes to `7ya.io` unless a future explicit cutover is verified.

## Release truth rule

Never say **fixed**, **deployed**, **live**, **production updated**, or equivalent merely because:
- a PR merged,
- a preview is READY,
- AppDeploy QA says READY,
- a source file changed,
- a separate host published successfully,
- a backend cron succeeded.

A production change is accepted only when all relevant gates are proven:

1. The exact source intended for the live runtime is changed.
2. The actual production host accepts and completes the deployment.
3. `https://7ya.io/` shows a deliberately observable release marker or intended visual delta.
4. Representative nested routes are checked on the public domain.
5. Required `/api/*` routes return their expected JSON contract, not SPA HTML.
6. Mobile and desktop visual verification is performed against the public domain.
7. Only then may the change be called live.

## Immediate P0 sequence

1. Confirm AppDeploy interim upgrade has actually been applied.
2. Repair/confirm `/api/*` ingress before treating dynamic homepage integrations as live.
3. Run one obvious but safe visual canary through AppDeploy production and verify it on `7ya.io`.
4. Remove/normalize the canary in the same controlled release after topology is proven.
5. Export/reconcile the current AppDeploy source into one canonical repository before any future host migration or DNS cutover.

No DNS cutover should be performed merely to bypass a deployment-limit or routing defect.
