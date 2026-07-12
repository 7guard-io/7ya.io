# 7YA.IO Architecture Decisions

## ADR-0001: GitHub controls code and deployment

Status: Accepted

The canonical repository is `7guard-io/7ya.io`, with `main` as the default branch. Operators use branches, pull requests, verified workflows and recorded rollback points.

## ADR-0002: GitHub Pages publishes the full static site

Status: Accepted

The production workflow is `.github/workflows/pages.yml`, named `Publish 7YA Production Site`, and triggered manually through `workflow_dispatch`.

The workflow assembles an immutable `dist/` artifact from approved root HTML files, public route directories and assets. It does not depend on Vercel, Netlify or a frontend framework build.

A merge is not a deployment. Artifact assembly, workflow success and independent live verification are separate gates.

## ADR-0003: Production architecture is full-site static

Status: Accepted, pending activation and live verification

The approved artifact exposes the Igor-first homepage and the public route tree stored in the canonical repository.

Critical routes:

- `/`
- `/journey/`
- `/igor-vepretski/`
- `/starton/`
- `/evidence/`

The previous redirect-only release is deprecated. `index.html` and `404.html` must not contain external redirect logic. The homepage must remain indexable.

## ADR-0004: Datasite is a governance and evidence vault

Status: Accepted with verification requirement

The intended permanent project is `7YA.IO Sovereign Control Room`. Datasite stores governance, evidence, approvals, releases and audit trail. It is not the website editor or deployment platform. Operators must verify project availability and current records before relying on them.

## ADR-0005: Chat memory is not authoritative

Status: Accepted

Every task begins with current repository and production inspection. Chat context may guide discovery but cannot override durable verified state.

## ADR-0006: Actions remain quarantined while issue #83 is open

Status: Accepted

Issue `#83` documents GitHub Actions jobs failing without usable logs. Automatic CI gates remain disabled. A single manual `workflow_dispatch` production run may occur only after explicit approval, local artifact validation and a recorded rollback point.

## ADR-0007: Secrets stay outside ordinary documents

Status: Accepted

Raw credentials, API keys, tokens and private keys must not be stored in repository governance or ordinary Datasite documents. Only managed location, controller, consuming system and rotation notes may be recorded.

## ADR-0008: Analytics is injected into the immutable artifact

Status: Accepted

Google Analytics 4 is injected after `dist/` assembly through `scripts/inject-ga4.mjs`. The source HTML remains clean. The workflow must fail when any HTML file lacks the approved measurement ID or contains a conflicting ID.

## ADR-0009: Vercel and Netlify are deprecated production paths

Status: Accepted

GitHub Pages is the only canonical public target. Root-level Vercel and Netlify redirect configurations are removed from provider discovery and retained only as historical records under `docs/deprecated-hosting/`.
