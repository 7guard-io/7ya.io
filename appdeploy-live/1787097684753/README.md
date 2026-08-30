# AppDeploy runtime delta — 1787097684753

Focused governance snapshot of the production personalization completion deployed on 2026-08-19.

## Captured changes
- `PersonalArchive.tsx`: expands the opening identity surface to six distinct, source-linked autobiographical frames: QUIET, SERVICE, RETURN, VOICE, CREATE, NOW.
- `LifeFirstHero.tsx`: replaces the generic origin-to-now trace with `KHARKIV 1990 → BAT YAM → HOLON / JESSE COHEN → SERVICE → STARTON → 7YA` and removes generic portrait fallback behavior.
- `PublicActionStage.tsx`: image failure now fails source-safely instead of substituting the generic Igor hero portrait.
- `StartOnRoom.tsx`: press/broadcast image failure now preserves the source-linked card rather than substituting branded/generic assets.
- `tests/tests.txt`: adds mobile regression coverage for six distinct personal evidence frames and the specific autobiographical hero route.

## Verification
AppDeploy QA group `7ba0af276c00f49f` on runtime `1787097684753`:
- YOUR PATH → StartOn without identity capture: PASS.
- Homepage personal identity / six distinct frames / source links / hero life route on mobile: PASS.
- Contextual handoffs combined test: SKIPPED because the QA worker exceeded its 300-second execution limit.
- StartOn/Create/Deep Archive combined test: SKIPPED because the QA worker exceeded its 300-second execution limit.
- AppDeploy deployment status: READY.
- Frontend errors: none surfaced.
- Backend errors: none surfaced.
- Top-level QA snapshot network errors: none surfaced.

This directory intentionally captures the exact changed runtime files and verification suite, not the full AppDeploy filesystem. No secrets, backend endpoints, DNS, authentication, or domain configuration are included.