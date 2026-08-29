# Content distribution resilience verification

Base AppDeploy snapshot: `1787808444264`

Prepared branch: `fix/content-distribution-resilience-20260827`

## Root cause reproduced

The applied runtime `src/canonical-corpus-client.ts` performs a direct `/api/corpus` request and throws when the request or response contract fails. Public consumers including `PostPortraitWall`, `ViralFrontispiece`, and `InfluenceUniverse` then render their unavailable / evidence-safety states even though the bundled public canonical corpus is already present in the client build.

## Regression gate added first

`tests/tests.txt` now includes **Test 7 - Keep canonical content distributed when Corpus API fails**. It faults `GET /api/corpus` with HTTP 503 and requires the visual biography, publication-impact and Echo sections to remain populated from public source-linked fallback data in HE / EN / RU.

## Local RED → GREEN harness

A strict TypeScript verification harness was executed against the patched client contract using the real CanonicalEvent type shape from the applied snapshot.

Observed output:

```text
RED verified: original client rejects simulated corpus outage
GREEN verified: patched client returns public archive fallback: life-1
```

`npx tsc --noEmit` completed with exit code 0 under strict mode.

## Safety properties checked

- Live `/api/corpus` remains first choice.
- Fallback is read-only and bundled at build time.
- Only `visibility === 'public'` events are eligible.
- Requested `surface` filtering is retained.
- `storyOrder` is retained.
- Caller `limit` is retained.
- Existing source URLs, verification state and metric snapshot dates are not rewritten.
- No total reach is synthesized.
- NVIDIA / Digital Igor integration is unchanged and does not become a dependency for rendering canonical content.

## Not yet claimed

This branch has **not** been applied to production. Post-patch AppDeploy runtime, E2E and live visual acceptance are therefore not yet claimed as passing. Those gates belong to the explicit deployment chain.
