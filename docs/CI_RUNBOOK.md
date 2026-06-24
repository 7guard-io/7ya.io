# CI Runbook

Status: active blocker.
Primary tracker: issue #83.

## Current state

CI workflows are currently manual only.

Manual workflows:

- actions-smoke.yml
- site-process-health.yml
- validate-markdown.yml

## Why

A minimal workflow failed even after rerun. No usable steps or logs were available through the connector.

This means normal pull requests should not depend on automatic CI until issue #83 is resolved.

## Recovery order

1. Fix the repository automation blocker tracked in issue #83.
2. Run Actions Smoke manually.
3. Run Validate Markdown manually.
4. Run Site Process Health manually.
5. Restore automatic triggers only after the manual checks pass.

## Rule

Do not re-enable automatic CI gates before the manual smoke check passes.
