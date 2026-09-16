# Connections Hub reconciliation

The canonical implementation for this slice is the root `connections/` + `data/connections.json` projection copied by `scripts/copy-connections-artifact.mjs`. The duplicate `public/connections/` implementation is intentionally discarded. `scripts/site-contract.mjs` remains unchanged from `main`; the Connections Hub is appended to the artifact by the focused copy step. This keeps the feature isolated and avoids broadening the existing static-site contract for an admin-oriented route.
