# 7YA.IO Operating Contract

## Purpose

Prevent 7ya.io operations from depending on memory, improvisation or informal chat context.

## Canonical production state

- Repository: `7guard-io/7ya.io`
- Default branch: `main`
- Workflow file: `.github/workflows/pages.yml`
- Current workflow name: `Publish 7YA Redirect`
- Trigger: manual `workflow_dispatch`
- Target: GitHub Pages
- Live domain: `https://7ya.io`
- Current release mode: redirect-only production entry point

## Governance room

Permanent Datasite project: `7YA.IO Sovereign Control Room`.

Datasite is the governance and evidence vault, not the website editor or deployment platform. Its existence, permissions and current records must be verified before relying on it.

## System authority

| System | Authority |
| --- | --- |
| GitHub | Source code, branches, commits, pull requests and production deployment |
| GitHub Pages | Production publishing target |
| `7ya.io` | Live public result |
| Datasite | Governance, evidence, approvals, releases and audit trail |
| Coding agents | Execution operators only |
| Chat memory | Non-authoritative context only |

## Non-forgetting protocol

For every task:

1. Verify the canonical repository.
2. Inspect repository and live production state.
3. Read governance files.
4. Create a dedicated branch.
5. Make minimal changes.
6. Validate through available checks.
7. Integrate through pull request.
8. Publish only through the verified production workflow.
9. Verify production independently.
10. Archive evidence and rollback information.

## Operator rules

Operators must use dedicated branches, pull requests, minimal diffs and explicit production verification.

Operators must not work from ZIP files, obsolete repositories, random local copies, unverified workflows or chat memory as source of truth.

## Current route policy

The current release is a redirect artifact. `/` is the required production entry route. `/pass/` and `/radar/` remain future full-site verification targets and become mandatory only after a deliberate, verified architecture change.

## Blocker policy

GitHub issue `#83` is currently open. Treat GitHub Actions as quarantined except for verified manual workflows. Do not re-enable automatic CI gates until the smoke workflow passes or a later verified record supersedes this policy.

## Conflict resolution

When instructions conflict, use this order:

1. Latest verified operating contract in the canonical repository
2. Verified Datasite governance record
3. Current GitHub repository state
4. Verified live production evidence
5. Current user instruction
6. Chat memory

Stop when a conflict affects safety, publishing or authority.
