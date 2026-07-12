# 7YA.IO Live Verification Checklist

A merge is not a deployment. A successful build is not live verification. A workflow success is not enough without checking the public result.

## Current production targets

- Domain: `https://7ya.io`
- Required entry route: `/`
- Expected behavior: redirect to the approved 7YA Digital Museum destination

`/pass/` and `/radar/` are future full-site targets, not current redirect-release guarantees.

## Before-state evidence

Capture date and time, tool or browser, route, screenshot where relevant, current behavior, production commit if known and workflow state if known.

## After-state evidence

Capture date and time, production URL, tested route list, desktop and mobile screenshots, workflow result, commit SHA, PR number, rollback SHA and remaining blockers.

## Route verification

| Route | Required result | Status |
| --- | --- | --- |
| `/` | Loads and redirects once to the approved Digital Museum destination | Pending |

Add task-specific routes only when the current production architecture defines them.

## Redirect checks

Verify:

- Redirect target is exact and approved.
- No redirect loop occurs.
- Fallback link is visible if JavaScript is disabled.
- Mobile and desktop both complete the redirect.
- `CNAME` still maps the artifact to `7ya.io`.
- No accidental second production workflow changed the result.

## Metadata checks

Verify title, robots policy, canonical target and redirect metadata match the approved release. For the current redirect artifact, `noindex,follow` is intentional unless a reviewed architecture decision changes it.

## Completion rule

Use `published`, `live`, `fixed` or `complete` only after:

1. Code is merged to `main`.
2. The verified production workflow succeeded.
3. `https://7ya.io` was independently checked.
4. Required current routes were checked.
5. Evidence was archived.
6. A rollback point was recorded.
