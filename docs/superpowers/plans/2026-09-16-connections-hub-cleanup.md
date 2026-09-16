# Connections Hub cleanup

Canonical implementation: root `connections/` + `data/connections.json`, copied into `dist/` by `scripts/copy-connections-artifact.mjs`.

The duplicate `public/connections/` implementation and temporary expansion of `scripts/site-contract.mjs` are intentionally removed from the final slice. This keeps the feature isolated from the legacy static-site contract and avoids two competing sources for the same route.
