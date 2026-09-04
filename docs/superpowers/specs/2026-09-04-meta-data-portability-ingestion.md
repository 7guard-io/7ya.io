# 7YA Meta Data Portability Ingestion

Date: 2026-09-04
Status: successor-only design; no production change

## Purpose

Use Meta Export Your Information (EYI) / Data Portability as an owner-authorized historical ingestion channel for 7YA. This complements, rather than replaces, Graph/OAuth live ingestion.

- Graph/OAuth = current/live public or owner-authorized platform data where permissions allow.
- EYI/Data Portability = historical bulk transfer initiated and authorized by the user.
- Canon remains the authority layer after verification; portability payloads are evidence inputs, not automatically published facts.

## Recommended architecture

Meta EYI
→ 7YA portability receiver
→ immutable raw import quarantine
→ format validation + manifest/hash
→ media extraction
→ identity/account binding
→ timestamp/source normalization
→ deduplication against Canon/Public Projection/Live Social
→ candidate moments
→ verification/provenance assignment
→ Canon or Discovery
→ 100 Moments / Living Archive

## Privacy and safety rules

1. Every transfer is explicitly user initiated and scoped.
2. Raw transfer data is private by default.
3. Nothing is automatically public merely because it arrived from EYI.
4. Public projection requires a separate visibility/provenance decision.
5. Secret values, OAuth tokens and transfer credentials never enter frontend source or public logs.
6. Preserve original filenames, timestamps, platform identifiers and source metadata when available.
7. Store a deterministic import manifest so each object can be traced back to its transfer job and source object.
8. Support deletion of imported private data without corrupting already-published source references that have their own public provenance.
9. Deduplicate against existing Graph API ingestion, public URLs and canonical records before creating new moments.

## Three implementation paths

### A — archive importer first

Accept user-downloaded Meta exports into a private 7YA importer. Normalize the archive through the same ingestion pipeline planned for EYI.

Best for immediate historical recovery because it does not depend on Meta approving 7YA as an EYI destination.

### B — direct EYI destination

Complete Meta Data Portability onboarding so 7YA can appear as a destination inside Meta Export Your Information. Implement the required destination endpoint, transfer lifecycle, deep-link behavior, validation and self-serve tests according to the current Meta developer documentation.

Best long-term UX, but approval/onboarding is an external dependency.

### C — hybrid, recommended

Build one portability ingestion core with two entry points:

1. manual/private Meta archive import now;
2. direct EYI destination later after Meta onboarding.

Both feed the same quarantine → normalize → dedupe → verify → Canon/Discovery pipeline. This avoids implementing two incompatible ingestion systems.

## Relationship to 100 Moments

Portability is not a homepage feature by itself. Its value is that it can materially increase authentic visual and chronological coverage.

Candidate moment selection should prioritize:

- authentic photos/video;
- original post timestamps;
- public post identifiers/URLs when recoverable;
- repeated-event deduplication;
- life chronology coverage gaps;
- StartOn, public work, media, creation and major personal-public milestones;
- source reliability and publicability.

A portability-imported object must never be promoted to a public Moment solely because it exists in a private export.

## Release separation

Do not mix Meta portability onboarding with the current Option C production recovery cutover.

Order:

1. reconstruct v93 successor baseline;
2. fix API transport/routing;
3. build and visually validate successor homepage;
4. cut over only after existing release gates pass;
5. then activate portability ingestion as a separate measured capability.

The ingestion core may be designed and tested on the recovery branch before cutover, but no Meta portability dependency may block the visual/API recovery release.

## Data Transfer Project

The open-source Data Transfer Project can be evaluated for protocol/data-model interoperability and transfer-worker patterns. Do not adopt it wholesale without a measured fit review: 7YA only needs the components that reduce interoperability and security risk, and the project itself recommends thorough testing before production use.
