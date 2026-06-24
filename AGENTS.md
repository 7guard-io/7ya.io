# AGENTS.md

Scope: this file governs the whole repository unless a deeper `AGENTS.md` overrides it.

## Purpose

This repository allows agent help, but not uncontrolled agent behavior.

Agents working on `7guard-io/7ya.io` must stay inside a reviewable, least-privilege flow.

## Repository reality

This repository is the canonical public home of Igor Vepretski and the #7YA movement.

It is a founder-led public site, not a generic app template and not a training curriculum.

## Allowed by default

- read repository files
- edit site code and documentation
- create or update files on a non-protected branch
- run local validation commands when available
- open pull requests with clear summaries and validation notes

## Forbidden by default

- do not push directly to `main`
- do not merge your own pull request
- do not modify repository or organization secrets
- do not change branch protection or repository settings
- do not modify `.github/workflows/*` unless the task explicitly requires it
- do not add unsupported public claims, metrics, or hype language
- do not couple governance or security tooling to GPU or AI runtime dependencies

## Required working model

Use branch + PR only.

Every PR should include:

1. Summary
2. Changed files
3. Validation output
4. Risks or follow-ups

## Validation

Run the strongest safe checks available for the touched scope.

Minimum local site gate:

```bash
npm run check-site
```

If the touched area affects the broader site process, prefer:

```bash
npm test
```

## Workflow rule

Workflow file edits are high risk.

If a task explicitly requires changes under `.github/workflows/*`:

- keep the change narrowly scoped
- explain why it is needed
- require human review before merge
- never treat workflow write permission as a permanent default

## Agent control posture

This repository follows a layered agent control model:

- Confirmed now: GitHub repo operations through branch + PR, uploaded files, web research, documentation updates, automations
- Test before trusting: Gmail, Google Calendar, Google Contacts, Google Drive, Replit, Vercel, Notion, OpenAI Platform
- Future / separate lane: Azure watchdog control plane and NVIDIA GPU workloads

## Azure and NVIDIA boundary

Governance, rollback, and security enforcement belong in a separate control plane.

Do not place NVIDIA, NGC, GPU runtime, or other heavy AI workload dependencies inside governance-only infrastructure.

Reserved future lane:

- `rg-7ya-escrow-prod` = governance, rollback, audit
- `rg-7ya-ai-gpu-prod` = future GPU / AI workloads

## Editorial rule

Keep 7YA personal, sharp, evidence-aware, and review-safe.

Do not publish unsupported claims. If a statement cannot be grounded, rewrite it conservatively.
