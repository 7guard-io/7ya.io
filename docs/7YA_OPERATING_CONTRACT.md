# 7YA.IO Operating Contract

## Purpose

Prevent 7ya.io operations from depending on memory, improvisation or informal chat context.

## Canonical production state

- Repository: `7guard-io/7ya.io`
- Default branch: `main`
- Workflow file: `.github/workflows/pages.yml`
- Workflow name: `Publish 7YA Production Site`
- Trigger: manual `workflow_dispatch`
- Target: GitHub Pages
- Live domain: `https://7ya.io`
- Release mode: full-site static artifact
- Artifact source: approved root HTML, route directories and public assets assembled into `dist/`
- Analytics: artifact-time GA4 injection through `scripts/inject-ga4.mjs`
- Migration status: pending reviewed merge, manual workflow success and independent live verification

## Governance room

Permanent Datasite project: `7YA.IO Sovereign Control Room`.

Datasite is the governance and evidence vault, not the website editor or deployment platform. Its existence, permissions and current records must be verified before relying on it.

## System authority

| System | Authority |
| --- | --- |
| GitHub | Source code, branches, commits, pull requests and production deployment |
| GitHub Pages | Canonical production publishing target |
| `7ya.io` | Live public result |
| Datasite | Governance, evidence, approvals, releases and audit trail |
| Coding agents | Execution operators only |
| Chat memory | Non-authoritative context only |

Vercel and Netlify are deprecated as production targets. Root-level provider redirect configuration must not control the canonical release.

## Non-forgetting protocol

For every task:

1. Verify the canonical repository.
2. Inspect repository and live production state.
3. Read governance files.
4. Create a dedicated branch.
5. Make minimal changes.
6. Validate the source and locally assemble the exact Pages artifact.
7. Integrate through pull request.
8. Publish only through the verified manual production workflow.
9. Verify production independently.
10. Archive evidence and rollback information.

## Operator rules

Operators must use dedicated branches, pull requests, minimal diffs and explicit production verification.

Operators must not work from ZIP files, obsolete repositories, random local copies, unverified workflows or chat memory as source of truth.

`npm run build` is not the frontend build contract. The public site is static and must be assembled according to `docs/DEPLOYMENT_RUNBOOK.md`.

## Current route policy

The approved release is a full static site. Critical routes are:

- `/`
- `/journey/`
- `/igor-vepretski/`
- `/starton/`
- `/evidence/`

The complete public route list is recorded in `docs/RELEASE_STATE.json`. Routes are not considered live until the workflow succeeds and the public domain is verified.

## Blocker policy

GitHub issue `#83` is currently open. Treat GitHub Actions as quarantined except for one explicitly approved manual production run. Do not re-enable automatic CI gates until a smoke workflow succeeds or a later verified record supersedes this policy.

## Conflict resolution

When instructions conflict, use this order:

1. Latest verified operating contract in the canonical repository
2. Verified Datasite governance record
3. Current GitHub repository state
4. Verified live production evidence
5. Current user instruction
6. Chat memory

Stop when a conflict affects safety, publishing or authority.
