# 7ya.io

7ya.io is the canonical public home of Igor Vepretski and the #7YA movement.

The site is no longer positioned as a simple management center. It now acts as a founder-led public gateway for:

- Igor Vepretski's story and 7YA identity
- the 7YA Knowledge Stream under `/articles/`
- the direct Talk route under `/talk/`
- movement messaging: Build, Learn, Protect, Lead
- public links, docs, and proof routes
- future member-pass and community onboarding flows

## Live public paths

- `/` — new founder-led movement homepage
- `/talk/` — direct route for ideas, media, partnerships, and collaboration
- `/articles/` — 7YA Knowledge Stream
- `/articles/igor-vepretski-7ya-origin.html` — origin article
- `/articles/7ya-movement-not-project.html` — movement manifesto
- `/docs/` — existing documentation layer
- `/docs/my-links.md` — public/social link management
- `/docs/influence` — influence archive and proof-oriented context

## Technical readiness tracks

- `docs/GPU_READINESS.md` — future GPU accelerated AI, media, visualization, and education workflows.
- `docs/CI_RUNBOOK.md` — CI blocker status and recovery order.
- `docs/AGENT_CONTROL_MODEL.md` — layered agent control model and current service access map.
- `AGENTS.md` — repository-wide rules for agent behavior, validation, and review.

## Process health gate

Every structural change to the public surface should pass the local site process check:

```bash
npm run check-site
```

The same check is wired to `npm test`. GitHub Actions automation is currently manual-only while issue #83 is open.

The gate verifies:

- critical public files exist
- required routes are linked
- HTML pages include core metadata
- docs navigation points back to the 7YA public route map
- deprecated GenAI template navigation does not return

## Editorial rule

Keep the homepage personal, sharp, and movement-oriented. Do not add unsupported metrics or vague hype. Every new public page should answer at least one of these questions:

1. Who is Igor?
2. Why does 7YA exist?
3. Why does it matter now?
4. What should a visitor do next?

## Brand line

Not fashion. Force.
