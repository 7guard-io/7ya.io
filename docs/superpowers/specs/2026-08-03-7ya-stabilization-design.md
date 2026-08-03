# 7YA Repository Stabilization Design

## Purpose

Stabilize the canonical `7guard-io/7ya.io` repository before further product work, reduce overlapping pull-request risk, restore a single source-of-truth model, and establish a safe path for the next mobile experience sprint.

## Current State

- `main` is the canonical repository branch.
- The repository is static-first and has a broad local release gate through `npm run ci:local`.
- GitHub Actions cannot currently be treated as authoritative because recent repository history records an account billing lock that prevented workflows from starting.
- AppDeploy currently contains production runtime changes that are not always fully exported into GitHub.
- Multiple open pull requests overlap across homepage, archive, Companion, command-center, evidence, authentication, and architecture work.
- Several older pull requests are based on stale commits or are no longer mergeable.

## Success Criteria

1. Every open pull request is classified as `merge`, `rebase`, `archive`, or `close` with a written reason.
2. No stale or duplicated pull request is merged into `main` without rebasing and passing the local release gate.
3. GitHub is explicitly defined as the canonical code source.
4. AppDeploy is treated as a temporary execution/runtime source only until a complete source export is committed.
5. The next mobile sprint starts from current `main` on an isolated branch.
6. The next production candidate passes `npm run ci:local` and has a documented rollback commit or immutable runtime snapshot.
7. No direct feature edits are made to `main` during stabilization.

## Scope

### Included

- Pull-request inventory and classification.
- Closure of clearly empty, duplicate, obsolete, or superseded pull requests.
- Review of current mergeable pull requests, especially #283 and #284.
- Rebase requirements for useful but stale work.
- Source-of-truth documentation for GitHub and AppDeploy.
- A clean branch and implementation plan for mobile work.
- Local verification instructions and release evidence requirements.

### Excluded

- A wholesale Next.js migration.
- A new design system.
- Production DNS changes.
- Automatic merges or deployments.
- New AI provider integrations.
- Large archive or content-ingestion expansion.
- Refactors unrelated to repository stabilization or the next mobile sprint.

## Architecture and Governance

### Canonical Sources

- **Canonical code:** GitHub repository `7guard-io/7ya.io`, branch `main`.
- **Candidate code:** reviewed feature branches and pull requests.
- **Temporary runtime authority:** AppDeploy only for the exact deployed snapshot recorded in a release receipt.
- **Evidence of release:** commit SHA, branch, local gate output, runtime snapshot/version, domain status, and rollback target.

A runtime-only AppDeploy patch must not be described as fully integrated until the complete relevant source is exported to GitHub and verified against the deployed behavior.

### Branching

- Stabilization branch: `superpowers/7ya-stabilization-20260803`.
- Future mobile branch: `feat/mobile-experience-v1-20260803`, created from current `main` after stabilization decisions are complete.
- No force-push to `main`.
- No direct commits to `main` for stabilization or mobile implementation.

## Pull-Request Classification Rules

### Merge

Use only when the pull request:

- is based on current or safely updateable `main`;
- has a narrow, non-overlapping purpose;
- has no unresolved security or architecture boundary;
- passes `npm run ci:local` on the exact reviewed SHA;
- has an explicit rollback path.

### Rebase

Use when the work remains valuable but:

- the base is stale;
- conflicts exist;
- the implementation overlaps newer merged work;
- validation claims no longer match current repository state.

### Archive

Use for useful historical or release-evidence work that should remain accessible but should not be merged as code. Archive by closing with a comment that records the superseding PR, commit, or runtime receipt.

### Close

Use for empty, placeholder, duplicated, abandoned, unsafe, or fully superseded work.

## Initial Triage Decisions

- **#194 and #195:** close. They are placeholder WIP pull requests without actionable scope.
- **#283:** review as a security-sensitive feature. Do not merge until admin authentication, secret configuration, data-retention boundaries, and endpoint exposure are validated.
- **#284:** review as documentation/provenance work. It may be mergeable if it does not falsely claim GitHub contains the complete AppDeploy runtime source.
- **#263 and #264:** rebase or supersede. They are stale and overlapping; #264 is stacked on #263.
- **#279 and #280:** archive or supersede after confirming the latest Companion runtime receipt. Avoid merging duplicate release receipts.
- **#273:** re-create as a minimal current-main fix if the metadata warning still exists; do not merge the stale branch as-is.
- **#258, #239, #235, #232, #149, #139, #134, #131, #127:** individually classify against current architecture. Default to archive or rebase, not merge, unless current-main validation proves they remain necessary and non-overlapping.

## Next Mobile Experience Boundary

The first product sprint after stabilization is deliberately narrow.

### Required Behavior

- Mobile Hero communicates Igor → StartOn → 7YA without visual congestion.
- Companion is collapsed by default on small screens and opens through progressive disclosure.
- No horizontal overflow at supported mobile widths.
- The bottom dock and Companion launcher do not cover page content or each other.
- Touch targets are at least 44 by 44 CSS pixels.
- Text inputs use at least 16px font size to avoid iOS zoom.
- One primary CTA is visible per viewport state.
- Desktop behavior must not regress.

### Supported Viewports

- 320 × 568
- 360 × 800
- 390 × 844
- 430 × 932
- 768 × 1024
- 1440 × 900 desktop regression check

## Error Handling

- Missing runtime metadata must produce an explicit `UNKNOWN` or `SOURCE_PENDING` state, never a success claim.
- A failed local gate blocks merge and deployment.
- A mismatch between GitHub source and AppDeploy runtime blocks the phrase “fully integrated.”
- A pull request with unresolved conflicts is never force-merged.
- Missing production secrets must fail closed and must not be replaced with committed fallback values.

## Testing Strategy

1. Add deterministic checks for mobile overflow, launcher/dock spacing, minimum touch target sizing, and Companion default state.
2. Run existing repository checks before and after every implementation slice.
3. Run `npm run ci:local` on the exact final SHA.
4. Build and verify the static artifact.
5. Perform browser smoke checks at all supported viewports.
6. Record the tested SHA and rollback target in the pull request.

## Release Sequence

1. Create isolated branch from current `main`.
2. Write a failing test for the intended behavior.
3. Implement the smallest passing change.
4. Run targeted tests.
5. Commit the isolated change.
6. Run the full local release gate.
7. Open a pull request with exact validation evidence.
8. Review conflicts and source/runtime alignment.
9. Merge only the tested SHA.
10. Deploy manually and record the immutable rollback target.

## Risks and Controls

- **Risk: overlapping PRs reintroduce old UI.** Control: classify and close stale work before new mobile implementation.
- **Risk: AppDeploy diverges from GitHub.** Control: require source export or clearly label runtime-only receipts.
- **Risk: CI appears green without running.** Control: rely on local gate evidence until GitHub Actions is restored.
- **Risk: mobile fix breaks desktop.** Control: include a 1440 × 900 regression check and existing contract tests.
- **Risk: security-sensitive Instagram endpoints become public.** Control: keep #283 blocked until admin authentication and exposure boundaries are implemented and verified.

## Acceptance

This design is accepted when the stabilization branch contains this specification and a concrete implementation plan, and when all future implementation follows the stated branch, testing, evidence, and rollback rules.
