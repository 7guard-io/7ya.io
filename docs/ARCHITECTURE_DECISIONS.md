# 7YA.IO Architecture Decisions

## ADR-0001: GitHub controls code and deployment

Status: Accepted

The canonical repository is `7guard-io/7ya.io`, with `main` as the default branch. Operators use branches, pull requests, verified workflows and recorded rollback points.

## ADR-0002: GitHub Pages is the production target

Status: Accepted

The current production workflow is `.github/workflows/pages.yml`, named `Publish 7YA Redirect`, and triggered manually through `workflow_dispatch`.

A merge is not a deployment. The workflow must succeed and the live site must be verified.

## ADR-0003: Current production is redirect-only

Status: Accepted

The production artifact currently contains a controlled redirect from `https://7ya.io` to the approved 7YA Digital Museum destination.

Consequences:

- `/` is the current required live route.
- `/pass/` and `/radar/` are not guaranteed by the redirect artifact.
- A full-site transition requires an explicit architecture change, updated governance and independent verification.

## ADR-0004: Datasite is a governance and evidence vault

Status: Accepted with verification requirement

The intended permanent project is `7YA.IO Sovereign Control Room`. Datasite stores governance, evidence, approvals, releases and audit trail. It is not the website editor or deployment platform. Operators must verify project availability and current records before relying on them.

## ADR-0005: Chat memory is not authoritative

Status: Accepted

Every task begins with current repository and production inspection. Chat context may guide discovery but cannot override durable verified state.

## ADR-0006: Actions remain quarantined while issue #83 is open

Status: Accepted

Issue `#83` documents GitHub Actions jobs failing without usable logs. Automatic CI gates must remain disabled until a verified smoke workflow succeeds or a later reviewed decision supersedes this ADR.

## ADR-0007: Secrets stay outside ordinary documents

Status: Accepted

Raw credentials, API keys, tokens and private keys must not be stored in repository governance or ordinary Datasite documents. Only managed location, controller, consuming system and rotation notes may be recorded.
