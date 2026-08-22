# 7YA Home Media Pipeline deployment receipt

Date: 2026-08-23
Target AppDeploy app: `697a008fddc309b142`
Base production AppDeploy version: `1787441068495`
Final deployed AppDeploy version: `1787442139249`
Deployment intent: repair content/image flow on the active LifeFirst homepage and verify the result visually/structurally.

## Production finding

The active homepage is `LifeFirstHome`. `RightNow` already embeds one `LiveSocial` instance, so no second feed is allowed. The main broken linkage was `VisualCanonRiver`: it was still a hard-coded 14-item rail while `/api/visual-registry` already aggregated approved public Drive seeds, canonical media, public-source previews and live social visuals.

## Applied production changes

- `VisualCanonRiver` now reads `/api/visual-registry` through the AppDeploy frontend API client.
- Registry imagery is deduplicated by image URL.
- The visual rail keeps a bounded mix of canonical/public life imagery and current live-social visuals.
- Visitor-facing cards no longer expose internal ingestion labels such as `DRIVE-SEED` or `CANONICAL-MEDIA`.
- Broken remote imagery degrades to a composed public-source visual fallback instead of leaving a broken image surface.
- `RightNow` retains exactly one embedded `LiveSocial` feed; an intermediate duplicate introduced during the first hotfix pass was detected and removed before final acceptance.
- `tests/tests.txt` expectations were updated to cover the single live-social instance, Visual Registry consumption, fallback behavior and visitor-facing label hygiene.

## Verification

Final AppDeploy status: `ready`.

Final QA snapshot timestamp: `1787442175953`.

Final QA screenshot set:
- desktop snapshot generated
- mobile snapshot generated

Runtime result:
- frontend errors: 0
- network errors: 0
- backend errors: 0

AppDeploy reported `e2e_tests: not_found` for version `1787442139249`; this receipt does not claim those tests executed.

## Local CI note

The requested `npm run ci:local` gate could not be executed in the available shell because outbound DNS resolution to GitHub failed before the repository could be cloned. No false PASS is recorded. To avoid overwriting the newer AppDeploy production snapshot with the stale repository root, the executable patch was applied directly to AppDeploy's remote production source snapshot and verified there. This receipt records the deviation explicitly.

## Source-of-truth note

The repository root source remains older than the current AppDeploy production snapshot. This deployment therefore follows the existing `ops/deployments` pattern: preserve an auditable GitHub receipt while keeping the executable production change on the newer AppDeploy snapshot until a full source reconciliation/export is performed.
