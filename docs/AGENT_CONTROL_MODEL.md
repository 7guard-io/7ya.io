# Agent Control Model

This document defines how 7YA should grant operational control to agents without giving permanent unrestricted power.

## Principle

Do not grant "full control" as a standing default.

Grant layered, reviewable, least-privilege control.

## Control layers

### 1. Read only

Use for:

- repository reading
- document review
- web research
- file inspection
- architecture analysis

### 2. Controlled write

Use for:

- documentation edits
- code edits on a branch
- pull request preparation
- structured content updates

Rule:

- no direct push to `main`
- all changes go through branch + PR

### 3. Controlled execution

Use for:

- local checks
- linting
- tests
- type checks
- sandboxed commands

Rule:

- run inside isolated or reviewable execution paths
- do not grant production credentials by default

### 4. Sensitive actions

Use sparingly for:

- deploys
- workflow edits
- cloud permission changes
- secrets rotation
- rollback controls

Rule:

- human approval
- short TTL
- audit trail
- automatic rollback where possible

## Current service access map

### Confirmed now

The following capabilities are already usable and should be treated as operationally available:

- GitHub repository operations through branch + PR flow
- uploaded files and File Library search
- web research and current documentation lookup
- document, slide, and spreadsheet generation
- automations and reminders

### Test before trusting

The following services appear available in the platform but should be verified with a real read or write test before relying on them operationally:

- Gmail
- Google Calendar
- Google Contacts
- Google Drive / Docs / Sheets / Slides
- Replit
- Vercel
- Notion
- OpenAI Platform

### Future or separate lane

The following lanes are strategic but should not be treated as currently verified control paths:

- Azure watchdog control plane
- NVIDIA / NGC / GPU execution lane
- advanced external cloud enforcement

## GitHub operating posture

- protect `main`
- use branch + PR only
- require human review for workflow file changes
- keep elevated workflow permissions temporary only
- do not treat admin power as a standing grant

## Repository truth requirement

Agents must respect the actual state of the repository.

If an instruction file or process note appears to describe a different repository, replace or correct it before continuing. Drifted instructions are unsafe.

## Boundary rule

`rg-7ya-escrow-prod` stays governance-only.

It must not carry GPU, NVIDIA, NGC, or heavy AI runtime responsibilities.

Future GPU and AI workloads belong in:

`rg-7ya-ai-gpu-prod`
