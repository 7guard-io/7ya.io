# 7YA production release receipt — AppDeploy snapshot 1789290098011

Date: 2026-09-13
AppDeploy app: `697a008fddc309b142`
Applied snapshot: `1789290098011`
Rollback snapshot: `1789289936887`
Runtime status: `READY`

## What changed

This release stabilizes the public 7YA experience around one personal narrative spine instead of multiple competing full-page biography engines.

- Homepage backbone: `LifeThroughline` remains the canonical source-linked life journey.
- Owner Facebook archive is deep-album only.
- Facebook uses the compact public stream on the homepage and the richer media mode in `/album`.
- Full `RichLifeTimeline` / Life Atlas and curated anchor chapters are deep-album only.
- Posts Memory Universe and Broadcast Stream remain full in `/album` and portal-only on the homepage.
- The homepage primary action now enters `#life-throughline`; the deep album action still enters its own deep journey.
- Added a build-time homepage composition guard so this duplication cannot silently return.
- Added a build-time strip for the obsolete hidden `legacy-recovery-inert` textarea before root first-paint validation and Vite build.
- Strengthened root first-paint validation to reject either a legacy template or hidden legacy textarea.

## Verification

AppDeploy build: PASS
AppDeploy deployment: READY
QA snapshot: generated for mobile and desktop
Frontend errors: 0
Backend errors: 0
Network errors: 0
E2E state: NOT REPORTED by AppDeploy for this version

The new composition guard was first deployed alone and correctly failed against the previous homepage structure (RED). The homepage composition change then passed the same guard and deployed successfully (GREEN).

The legacy textarea invariant was also first deployed alone and correctly failed while the textarea still existed (RED). The build-time stripper then passed the invariant and deployed successfully (GREEN).

## Open verification boundary

A public crawler request made immediately after deployment still returned legacy recovery text. Because the production build guard now proves the hidden textarea is removed from the build input before Vite, this may be an external/cache freshness issue, but that has **not** been proven yet. Do not claim public crawler cleanup is verified until a fresh canonical crawl stops returning the legacy block.

## Known unrelated runtime issues

NVIDIA/NVCF canary jobs remain disabled after historical HTTP 401 failures. This release does not repair those credentials/provider calls.

The runtime release marker in `src/App.tsx` remains `7ya-master-experience-20260912-v1`; release-marker reconciliation across HTML/React/backend is still pending.

## Repository/source boundary

This directory is a controlled production delta ledger, not a complete runtime source export. AppDeploy snapshot `1789290098011` remains the authoritative runtime source. Do not deploy stale GitHub source over this production snapshot. A complete atomic runtime export is still pending.
