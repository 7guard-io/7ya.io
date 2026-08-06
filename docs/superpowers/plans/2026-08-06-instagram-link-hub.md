# Instagram Link Hub Implementation Plan

> **Execution rule:** dedicated branch and PR only. Do not merge or publish from GitHub without human approval and observable validation.

## Task 1 — Add route-specific acceptance coverage

- Require `/go/` to render the unique heading and motto.
- Require six primary actions and six verified social profiles.
- Confirm the pre-implementation test fails because `/go/` is absent.

## Task 2 — Build the owned gateway

- Create `go/index.html` with SEO, structured data, Igor-first identity, six actions, social profiles, and accessible navigation.
- Create `styles/igor-links-20260806.css` with mobile-first RTL layout, focus states, reduced-motion handling, and no horizontal overflow.
- Use the approved portrait asset already present in the repository.

## Task 3 — Add routing contract

- Add `go` to canonical routes.
- Add `links` as a noindex alias to `/go/`.
- Add the new HTML and CSS assets to critical artifact checks.
- Add `/go/` to `sitemap.xml`.

## Task 4 — Validate and record

- Run the repository release gate when an execution environment is available.
- Run the AppDeploy ten-test QA suite and verify the new mobile route.
- Record the AppDeploy snapshot and known verification boundaries.
- Open a focused PR to `main`; do not auto-merge.
