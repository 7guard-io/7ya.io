# Controlled Reconstruction Phase A+B — Amendment 2

**Date:** 2026-09-07  
**Applies to:** design spec, Phase A+B plan and Amendment 1  
**Reason:** AppDeploy advanced during capture preparation.

## Baseline correction

Immediately before the first immutable source capture, fresh AppDeploy evidence showed:

```text
App ID: 697a008fddc309b142
Applied/current version name: v97
Current version id: 1788809457536
Version timestamp: 2026-09-07T19:30:57.536Z
Runtime status: ready
Current frontend errors: 0
Current network errors: 0
Current backend errors: 0
E2E: null / not claimed
```

The previously planned snapshot `1788806726940` is no longer v97; AppDeploy now lists it as v96. It must not be described as the current production snapshot.

Therefore every Phase A+B instruction that refers to:

```text
v97 / 1788806726940
appdeploy-live/1788806726940/
```

is superseded by:

```text
v97 / 1788809457536
appdeploy-live/1788809457536/
```

The canonical GitHub main comparison baseline remains:

```text
f048a13b214e9585f40662c1316817625339b732
```

because the isolated reconstruction branch was intentionally forked from that exact commit.

## Additional build configuration discovered

The applied v97 root inventory includes these build/runtime configuration files and they are mandatory capture inputs:

```text
postcss.config.js
tailwind.config.js
tsconfig.json
vite.config.ts
```

Together with:

```text
index.html
package.json
cron.json
src/**
backend/**
shared/**
scripts/**
tests/**
public/**
```

`CAPTURE-MANIFEST.json.includedRootFiles` must therefore include all seven root files:

```json
[
  "index.html",
  "package.json",
  "postcss.config.js",
  "tailwind.config.js",
  "tsconfig.json",
  "vite.config.ts",
  "cron.json"
]
```

## Provider configuration

`appdeploy.auth-login.json` was inspected. It contains provider login presentation/method configuration and no raw credential value in the observed source. It remains classified as provider-specific configuration. It may be captured only under the immutable AppDeploy capture directory and must never be treated as a secret or copied into unrelated runtime roots without a later reconciliation decision.

## Execution rule

If AppDeploy advances again before Task 1 metadata is committed, repeat this same rule: do not freeze a stale snapshot as current. Advance the capture baseline and record the transition explicitly.

No production mutation is authorized by this amendment.