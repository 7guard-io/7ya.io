# THE ECHO — validated runtime release

Date: 2026-08-15

## Runtime

- AppDeploy app: `697a008fddc309b142`
- Validated snapshot/version: `1786806061467` (`v97`)
- Public custom domains: `7ya.io`, `www.7ya.io`
- `7ya.io` DNS re-verified active against the AppDeploy v2 proxy on 2026-08-15.

## Release gates

Focused THE ECHO E2E suite: **5/5 passed**.

1. Desktop story selector changes the active propagation chain.
2. Mobile chain stacks without horizontal overflow and uses a designed source-plate fallback.
3. Evidence states and dated native metrics remain separate; no synthetic reach total or fabricated response quotation is introduced.
4. THE ECHO identity and core promise render in Hebrew, English and Russian.
5. Client-side Visual QA reports zero release-blocking issues for empty media panels, horizontal overflow, fixed overlap and broken images in the tested mobile flow.

AppDeploy runtime verification reported no frontend or backend errors for this release. AppDeploy separately reports incomplete coverage for existing backend endpoints that were outside this frontend feature scope; that warning is not treated as evidence that those endpoints were tested.

## Source-control boundary

The AppDeploy runtime currently contains a newer public-home wiring layer than the GitHub `main` branch. In particular, runtime `App.tsx` and the public-home composition already mount `InfluenceUniverse`, while the GitHub baseline predates that wiring and other runtime-only QA components.

For that reason this feature branch intentionally stores the exact THE ECHO module, data registry, styles, design specification, implementation plan and validated focused test contract **without merging partial runtime wiring into `main`**.

A future repository/runtime reconciliation should sync the public-home architecture as a coherent unit and then wire:

- `InfluenceUniverse mode="bar"` in the global frame;
- `InfluenceUniverse mode="cinematic"` on the public home at `#echo`;
- the current Visual QA/runtime support components;
- the validated THE ECHO test contract.

This boundary is deliberate: production correctness is preserved instead of forcing a half-synchronized repository merge.
