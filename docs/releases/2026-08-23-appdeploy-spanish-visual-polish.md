# 7YA AppDeploy — Spanish + visual polish receipt

Date: 2026-08-23 (Asia/Jerusalem)

## Runtime

- AppDeploy app: `697a008fddc309b142`
- Ready runtime version: `1787434450694`
- Release/build marker: `7ya-spanish-visual-polish-20260823-1`
- Rollback snapshot: `1787433783044` (`Pre Spanish + visual polish baseline`)
- Custom domains reported active by AppDeploy: `7ya.io`, `www.7ya.io`

## Scope shipped in the AppDeploy runtime

- Dedicated Spanish LTR public gateway at `/es/`.
- Spanish hero, life chronology, impact framing, StartOn, public media/source cards, research, music and contact actions.
- Canonical/source visuals used for documentary cards; no AI-generated image is presented as documentary evidence.
- Shared React language switcher exposes `ES` / `Español` without expanding the existing HE/EN/RU React locale union.
- Root metadata now advertises `hreflang="es"`; the Spanish route has its own title, description, canonical, OG/Twitter metadata and JSON-LD.
- Sitemap includes `/es/`.
- `llms.txt` and the website entity registry expose the Spanish gateway. The person-level language list remains HE/EN/RU; Spanish is a website-content language, not a new claim about Igor's language proficiency.
- Additive shared visual polish improves text wrapping, image rendering, mobile language controls, menu overflow, section spacing and route-level overflow resilience.
- Stale frontend VQA error-injection instrumentation was removed. The internal visual-QA backend pointer was refreshed to a current implementation screenshot set.

## Runtime QA evidence

Final AppDeploy status for `1787434450694`: `ready`.

AppDeploy returned:

- frontend errors: none;
- backend errors: none;
- network errors in QA snapshot: none;
- fresh desktop and mobile QA screenshots generated.

The acceptance suite in `tests/tests.txt` was rewritten before implementation to cover:

1. Spanish first-class entry;
2. 375px mobile language/navigation and overflow;
3. homepage personal-life-album visual hierarchy;
4. Media/Music/Research/Museum mobile continuity;
5. evidence-safety fallbacks under canonical/media faults.

**Important limitation:** AppDeploy reported `e2e_tests.status = not_found` for these runtime versions. Therefore this receipt does **not** claim that the black-box E2E suite passed. The release is supported by terminal-ready deployment status, clean runtime/network error snapshots, generated responsive screenshots, direct runtime source inspection and active custom-domain records. A future run should independently execute the E2E suite when the runner is available.

## Provenance / source-control note

The AppDeploy runtime currently leads the canonical GitHub repository for parts of the production source. This receipt intentionally does not copy an older GitHub snapshot over production and does not claim deployment-identical parity. A provenance-preserving runtime export/comparison remains the correct reconciliation path.
