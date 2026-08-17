# 7YA Source of Truth

GitHub is the canonical code source for 7YA. The canonical repository is `7guard-io/7ya.io`, and accepted long-term source must be traceable to a reviewed commit on `main`.

AppDeploy is the active production runtime for the exact deployed snapshot associated with app `697a008fddc309b142`. A runtime-only patch is not “fully integrated” until the relevant source is exported to GitHub and compared against the deployed behavior.

## Control hierarchy

1. Igor Vepretski is the product owner and final authority for irreversible public, legal, financial, political, privacy-sensitive and production-cutover decisions.
2. GitHub `main` is the canonical governance and long-term source-control branch.
3. Focused branches and pull requests are the only acceptable change path.
4. AppDeploy snapshots are immutable runtime evidence and rollback targets, not substitutes for source alignment.
5. Release receipts, test evidence and domain verification must describe exactly what was observed without normalizing discrepancies.

## Change discipline

- No direct feature commits to main.
- No force-push to `main`.
- No merge from a stale or unmergeable branch.
- No production deployment from undocumented source.
- No second production architecture without an approved migration and rollback design.
- Every merge candidate must pass `npm run ci:local` on the exact reviewed SHA.
- When GitHub Actions cannot execute, missing checks are `UNKNOWN`, not `PASS`.
- Security-sensitive work remains Draft until authentication, authorization, secret handling, retention and abuse tests are complete.

## Runtime and release evidence

Every production release record must include:

- repository commit or an explicit statement that source alignment is pending;
- AppDeploy app ID and immutable snapshot/version;
- deployment terminal status;
- observed E2E totals and discrepancies;
- frontend, backend and network error counts;
- canonical-domain status;
- a unique no-cache build-marker probe when claiming a specific build is live at `7ya.io`;
- rollback target;
- source/runtime comparison status.

A configured or active hostname does not by itself prove that it served a particular build.

## Source/runtime mismatch

Until the current AppDeploy source is exported and compared:

- AppDeploy is authoritative for observed runtime behavior.
- GitHub is authoritative for governance, review history and durable source-control decisions.
- Do not claim byte-for-byte alignment.
- Do not copy the runtime over repository root files without a route, privacy, content and provenance comparison.
- Product redesign must not outrun source alignment.

## Evidence and privacy

Public claims require a dated source and an explicit evidence state. Do not publish raw private contracts, identity documents, personal phone numbers, private email, family-sensitive information, legal or financial records, credentials, tokens or protected operational information.

## Rollback

Every production change needs an immutable rollback target. Rollback is a controlled release action and must not be performed merely because a newer version exists or a test counter is ambiguous.
