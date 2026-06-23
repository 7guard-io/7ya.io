# 7YA Process Health

This branch validates the public-site process gate through a clean pull-request workflow path.

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
