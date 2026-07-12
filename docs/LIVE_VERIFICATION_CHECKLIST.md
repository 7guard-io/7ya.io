# 7YA.IO Live Verification Checklist

A merge is not a deployment. A successful artifact assembly is not live verification. A workflow success is not enough without checking the public result.

## Current production targets

- Domain: `https://7ya.io`
- Release architecture: full-site static
- Expected homepage: Igor-first public site
- Canonical hosting target: GitHub Pages

## Before-state evidence

Capture date and time, tool or browser, route, screenshot where relevant, current behavior, production commit if known, DNS state and workflow state if known.

## After-state evidence

Capture date and time, production URL, tested route list, desktop and mobile screenshots, workflow result, commit SHA, PR number, rollback SHA, analytics status and remaining blockers.

## Critical route verification

| Route | Required result | Status |
| --- | --- | --- |
| `/` | Loads the Igor-first homepage with no external redirect | Pending |
| `/journey/` | Loads Igor Vepretski's public journey page | Pending |
| `/igor-vepretski/` | Loads the official identity page | Pending |
| `/starton/` | Loads the StartOn public page | Pending |
| `/evidence/` | Loads the Evidence Ledger page | Pending |

## Additional public route verification

Verify all routes recorded in `docs/RELEASE_STATE.json`, including `/influence/`, `/speaker/`, `/media/`, `/articles/`, `/talk/`, `/contact/`, `/7ya/`, `/oracle/`, `/business/`, `/social/`, `/pass/` and `/radar/`.

For each route verify:

- Successful HTML response.
- Correct canonical URL.
- No unexpected external redirect.
- No broken internal assets.
- No accidental exposure of private or admin-only surfaces.

## Homepage checks

Verify:

- Igor Vepretski is visible above the fold.
- The portrait asset loads.
- Navigation to Journey, StartOn, Influence and Evidence works.
- The homepage is indexable.
- No meta refresh, `window.location.replace`, `window.location.assign` or external `location.href` redirect exists.
- Mobile scaling and horizontal overflow are correct.
- Legacy service-worker cleanup does not break navigation.

## Hosting checks

Verify:

- GitHub Pages is the serving target.
- `CNAME` remains `7ya.io`.
- No Vercel or Netlify redirect controls the public result.
- `www.7ya.io`, when configured, resolves consistently with the apex domain.
- No split-brain behavior appears between clean browser, mobile and desktop requests.

## Analytics checks

Verify:

- The approved GA4 ID is `G-1028S7MMGQ`.
- The Google tag appears exactly once per deployed HTML artifact.
- No conflicting GA4 ID is present.
- A page view can be observed after production deployment when analytics access is available.

## Metadata checks

Verify title, description, robots policy, canonical URL, Open Graph data and Person/WebSite structured data on the homepage. Confirm critical route canonicals match their public URLs.

## Completion rule

Use `published`, `live`, `fixed` or `complete` only after:

1. Code is merged to `main`.
2. The verified production workflow succeeded.
3. `https://7ya.io` was independently checked on mobile and desktop.
4. Critical and required public routes were checked.
5. Analytics coverage was confirmed.
6. Evidence was archived.
7. A rollback point was recorded.
8. Remaining infrastructure blockers were explicitly documented.
