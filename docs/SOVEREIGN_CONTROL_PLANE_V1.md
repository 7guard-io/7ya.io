# 7YA Sovereign Control Plane v1

Status: EXECUTION STARTED — NON-PRODUCTION CONTROL BRANCH

## Objective

Transform 7YA from a collection of partially overlapping deployment surfaces into one reproducible, evidence-governed operating system.

## Authority model

1. GitHub `7guard-io/7ya.io` is the canonical engineering, review and release-ledger plane.
2. AppDeploy app `697a008fddc309b142` is the current production runtime authority while source reconciliation is incomplete.
3. `7ya.io` and `www.7ya.io` currently terminate at AppDeploy v2.
4. Vercel is recovery/preview only unless an explicit migration release changes that role.
5. Netlify services are specialized/legacy surfaces and must not silently become a second source of canonical application truth.

## Definition of DONE

DONE requires all applicable gates:

`SOURCE_ALIGNED -> TESTED -> PREVIEW_VERIFIED -> VISUAL_PASS -> A11Y_PASS -> CONTENT_PASS -> EVIDENCE_PASS -> PRIVACY_PASS -> RELEASE_CANDIDATE -> PRODUCTION -> LIVE_VERIFIED`

A successful build, merge, HTTP 200, or provider READY state alone is not DONE.

## Canon / Discovery boundary

Discovery material may be ingested aggressively but may not silently become canonical public truth.

`DISCOVERED -> EXTRACTED -> MATCHED -> VERIFIED -> APPROVED -> CANON`

Every public claim must retain provenance and evidence state. Private/restricted material must remain outside public projections.

## Reconciliation protocol

For every runtime-critical AppDeploy v97 file, compare it with GitHub and classify it as one of:

- KEEP — GitHub already represents the correct canonical implementation.
- PORT — production implementation must be recovered into canonical source control.
- DELETE — obsolete implementation that should not survive reconciliation.
- RUNTIME_ONLY — provider-specific artifact intentionally excluded from canonical application source, with its role documented.

No production overwrite is permitted while unresolved PORT classifications exist for runtime-critical files.

## Current checkpoint — 2026-09-07

AppDeploy production is READY at v97 / snapshot `1788788589415`. Current QA reports zero frontend, network and backend errors, but E2E evidence is absent. The applied `public/release.json` still identifies the AppDeploy remote snapshot as source of truth and says full source export is pending. Therefore production/source drift remains an active P0 governance defect even though runtime health is green.

NVIDIA/NVCF canaries remain disabled after repeated HTTP 401 authentication failures. This is not classified as an application wiring success and must not be represented as healthy end-to-end inference.

## Execution phases

### A — Production truth recovery
Inventory AppDeploy v97, identify runtime-critical source, compare against GitHub, and record deterministic reconciliation classifications.

### B — Canonical runtime convergence
Port required production source into an isolated GitHub branch, preserve provider adapters, and remove undocumented source divergence.

### C — Unified data contract
Converge Evidence Atoms, canonical corpus, moments, media, people, projects and research onto one provenance-preserving contract consumed by public experiences.

### D — Experience projections
Make LIFE, 100 Moments, timeline, media, evidence, search and Bro Chat projections over canonical data rather than duplicated manually curated truth.

### E — Release enforcement
Make release receipts, rollback identity, visual/live verification, privacy/evidence gates and source alignment mandatory parts of release state.

## Safety

No DNS change, production deploy, secret mutation, destructive data operation or automatic canon promotion is authorized merely by this control-plane document. Production mutations require their applicable release gates and explicit release intent.
