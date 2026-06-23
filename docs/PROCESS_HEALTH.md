# 7YA Process Health

This branch exists to validate the public-site process gate through the pull-request workflow.

The required command is:

```bash
npm run check-site
```

A valid result must end with:

```text
SITE_PROCESS_HEALTH: PASS
```

Scope covered by the gate:

- public homepage
- Talk route
- Knowledge Stream
- Origin and Manifesto articles
- public links route map
- docs navbar and sidebar
- deprecated template-snippet prevention

This file is intentionally small. Its purpose is to trigger a real PR workflow without changing production UX.

Validation note: this update retriggers the PR workflow after adding basic workflow diagnostics on `main`.
