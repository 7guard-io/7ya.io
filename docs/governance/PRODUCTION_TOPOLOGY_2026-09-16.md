# 7YA Production Topology — 2026-09-16

## Canonical source of truth

- Canonical repository: `7guard-io/7ya.io`.
- Canonical branch: `main`.
- Recovery anchor created from the verified Social-First revision: `recovery/2026-09-16-social-first-canonical` at commit `130f56895e32273a233e321ebafbd5c6c4855cee`.
- `vepretski/7ya.io` is not a competing production source. Any host still linked to it must be treated as legacy until explicitly reconciled with the canonical repository.

## Intended product experience

The public experience is a human-first, source-bound living life album for Igor Vepretski. The first viewport must visibly feel personal and use authentic media. The narrative path should surface childhood, service, police, fatherhood, StartOn, creation/music, public voice and NOW, with the social layer visible before the long chronology. `#7YA🥷` is the exact brand tag.

No generic-person imagery, synthetic memories, invented metrics or dashboard-first recovery shell should replace the biography.

## Verified healthy runtime

`7YA Forever Runtime` is the current provider-independent reference/fallback implementation and is published at:

- `https://7ya-forever.floot.app`

Verified on 2026-09-16:

- HTTP 200 from the published runtime.
- Rendered HTML contains the personal-life heading, `IGOR LIVE`, `#7YA🥷`, and source-bound content.
- No `recovery-shell` marker is present.
- Project typecheck is clean.
- Existing automated tests pass.
- Product metadata was normalized to `7YA — Igor Vepretski`.

The Floot workspace is currently on the free plan and reports no attached custom domains. A custom domain therefore cannot be attached there without a paid-plan upgrade.

## Current public-domain reality

As of 2026-09-16, `7ya.io` and `www.7ya.io` still resolve through the legacy AppDeploy production path.

That path must not be treated as the frontend source of truth because the applied production snapshot was structurally incomplete: the served document referenced `src/main.tsx` while the inspected applied snapshot did not contain the expected `src/**/*` runtime source. The visible result is the older static/recovery experience rather than the intended Social-First homepage.

AppDeploy also reports a hard lifetime `deploy_app` quota of `400/400`. Do not retry AppDeploy frontend deployments unless the account limit is actually increased and re-verified.

## AppDeploy status

- App id: `697a008fddc309b142`.
- `7ya.io` and `www.7ya.io` remain active there today.
- AppDeploy is no longer the recommended frontend authority.
- The old Cloudflare/AppDeploy one-time DNS cutover workflow is retired and must not be used to reassert AppDeploy as the canonical frontend.
- AppDeploy may be retained only for legacy/backend responsibilities that are independently verified and do not compete with the canonical frontend source.

## Vercel status

- Team: `7ya`.
- Project: `7ya.io` (`prj_4aaG2FZcGR9tagwE7FfEBGO9yQOt`).
- A healthy READY deployment exists on Vercel-owned aliases.
- The project is linked to `vepretski/7ya.io`, not the canonical `7guard-io/7ya.io` repository.

Therefore Vercel must not receive the `7ya.io` custom-domain cutover until its source is reconciled to the canonical repository. A healthy deployment from the wrong repository is not an acceptable production authority.

## Domain cutover rule

The next custom-domain migration is allowed only when all of the following are true:

1. The target host runs the intended Social-First / Forever Runtime experience.
2. The target host is sourced from, or demonstrably synchronized with, `7guard-io/7ya.io`.
3. The target deployment is healthy on its provider URL before DNS changes.
4. Apex and `www` custom-domain attachment are confirmed on the target host.
5. Exact DNS values are obtained from the target provider; never guess them.
6. DNS is changed through authenticated domain control.
7. `https://7ya.io/` and `https://www.7ya.io/` are then independently verified on mobile and desktop.
8. Only after public verification may the migration be called complete.

## Locked architecture

- **Source of truth:** `7guard-io/7ya.io`.
- **Reference production experience:** Social-First / Forever Runtime.
- **Provider-independent live fallback:** `https://7ya-forever.floot.app`.
- **AppDeploy:** legacy/backend only; not frontend truth.
- **Vercel:** candidate production host only after canonical-source reconciliation.
- **DNS:** no cutover to any provider until its canonical-source and custom-domain gates are both proven.

## Release truth rule

Never describe a change as fixed, live or deployed merely because code changed, a PR merged, a preview is READY, a provider deployment succeeded, or a fallback host is healthy. A change is production-live only after the actual public `7ya.io` domain serves and visibly verifies the intended release.
