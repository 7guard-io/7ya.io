# Third Party Notices — 7ya.io

This file is the open-source attribution register for the 7ya.io public site and documentation layer.

Source of truth:

- `package.json` for declared direct dependencies.
- `package-lock.json` for the installed dependency graph.
- `scripts/generate-third-party-notices.mjs` for regenerating this register from the lockfile.

Important: use notices from the actual dependencies in this repository. Do not copy a notice bundle from a different product unless the same dependency is actually present here.

## Required operating rules

- Preserve required copyright and license notices.
- Preserve upstream warranty and liability disclaimers.
- Preserve `NOTICE` file contents where applicable.
- Mark modified source files when a dependency license requires it.
- Do not imply upstream endorsement without written permission.
- Regenerate this file after every dependency change.

## Regeneration command

```bash
npm run legal:third-party
```

That command rebuilds this notice file from the current `package-lock.json`.
