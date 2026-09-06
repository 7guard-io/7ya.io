# 7YA deployability recovery runbook — 2026-09-04

## Decision
Do not roll back production and do not point 7ya.io at the old Vercel static proxy. Current AppDeploy v93 remains the runtime authority until either AppDeploy restores write capacity or the applied v93 source is fully reconstructed and validated on a replacement host.

## Verified state
- AppDeploy app: `697a008fddc309b142`
- Applied version: `1788453751783` (`v93`)
- Release: `7ya-bulk-repair-20260903-v6`
- Runtime: READY; current AppDeploy status reports 0 frontend / 0 backend errors.
- Custom domains: `7ya.io` and `www.7ya.io` active on AppDeploy v2.
- Deploy blocker: Free-plan lifetime `deploy_app` ceiling reached at 125/125.
- Production backend source contains `/api/release`, `/api/health`, `/api/companion/status`, NVIDIA canary and other router handlers, but external requests to the stage `/api/release` currently resolve to SPA HTML. Treat this as an ingress/platform routing incident, not as evidence that backend handlers are absent.
- NVIDIA secret name is configured. Never export secret values.
- Current NVIDIA implementation uses the OpenAI-compatible NIM chat-completions API with `nvidia/nemotron-3-super-120b-a12b`, tool calling, bounded retries, timeout and circuit breaker.

## Official platform constraints used
### AppDeploy
- AppDeploy documents backend API routes, managed hosting, source access, version history and rollback as platform capabilities.
- Free access is subject to fair-use ceilings; Business access provides higher limits / production support.
- Bulk source export is documented as available during early access / Business access.

References:
- https://appdeploy.ai/features
- https://appdeploy.ai/mcp-docs
- https://appdeploy.ai/pricing
- https://appdeploy.ai/faq

### Vercel
If migration becomes necessary, create/import a project from the recovered repository, use the recovered app root as the Vercel Root Directory, configure production environment variables before cutover, and verify a production deployment before attaching the custom domains.

References:
- https://vercel.com/academy/production-monorepos/deploy-all-apps
- https://vercel.com/academy/vercel-foundations/vercel-settings

### NVIDIA NIM
NVIDIA NIM LLM exposes OpenAI-compatible `POST /v1/chat/completions`, `GET /v1/models`, and health endpoints. The recovered deployment must preserve this API contract and validate the served model before cutover.

References:
- https://docs.nvidia.com/nim/large-language-models/latest/reference/api-reference.html
- https://docs.nvidia.com/nim/large-language-models/3.0.0/get-started/quickstart.html

## Recovery order
1. Keep v93 live and untouched.
2. Obtain Bulk Source Export ZIP from AppDeploy support, or reconstruct the snapshot from `src_*` inspection into a forensic branch.
3. Verify reconstructed tree matches v93 entrypoints and dependencies before placing it in a build root.
4. Apply the approved homepage delta only after source parity: human-first cover → 100 Moments / Life Pulse → narrative → deeper source universe.
5. Preserve Bro Chat provider order: NVIDIA → AppDeploy/tool-agent equivalent → deterministic local fallback. If migrating off AppDeploy, explicitly replace AppDeploy-only DB/auth/AI/runtime dependencies before cutover; do not silently drop them.
6. Configure replacement-host environment variables using secret names only. Never commit values.
7. Build and test on a non-production hostname.
8. Verify HE/EN/RU first paint, mobile/desktop pixels, `/api/*`, Bro Chat, Canon/Discovery separation, social-read flows, cron replacement, and NVIDIA canary.
9. Attach `7ya.io` only after the replacement deployment passes the full release gate.
10. Preserve rollback to v93 until post-cutover verification is complete.

## Release gates
- `/api/release` returns JSON, never SPA HTML.
- `/api/health` returns JSON.
- Bro Chat returns a grounded answer and identifies NVIDIA when NVIDIA succeeds.
- Protected NVIDIA canary passes grounding, private-memory refusal and fabricated-metric refusal.
- No secret values are exposed.
- Home first fold is an authentic human cover, not a dashboard.
- Life/100 Moments appears immediately after the cover before generic category navigation.
- Source media remains linked to original public sources.
- Mobile 375–390 px has no horizontal clipping or broken hero crop.
- HE/EN/RU remain semantically aligned.
- No domain switch until all above are green.

## Explicitly rejected paths
- Do not apply v58 merely to regain the older gallery: it regresses current Bro Chat/loading/API-era behavior.
- Do not point production at `7ya-static-site` / the July canonical proxy; it is pinned to an obsolete static release and cannot preserve the current AppDeploy stateful backend.
- Do not rewrite the NVIDIA layer without evidence; the current NIM contract is already aligned with NVIDIA documentation.
