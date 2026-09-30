# 7YA independent runtime

## The serving contract

7YA is built from this repository with `npm run build:cloudflare`. The immutable `dist/` artifact is served by Cloudflare Pages. The public site does not proxy pages, API requests, or the Ask Igor interface through AppDeploy.

Ask Igor runs as a Cloudflare Pages Function. It uses NVIDIA NIM only when a server-side key is configured and automatically falls back to the repository-owned, deterministic multilingual guide. No provider credential is shipped to the browser.

## Ownership and rollback

- Canonical source: `7guard-io/7ya.io@main`.
- Build output: `dist/`, verified by `npm run release:gate`.
- Runtime: Cloudflare Pages project `7ya-io`.
- Rollback: select the previous Pages deployment or revert the release commit.
- Historical AppDeploy snapshots and receipts remain in the repository only for provenance and emergency reference. They are not part of the request path.

## Publication boundary

A merged commit is source completion, not proof that the canonical domain serves it. Publication requires a successful Pages build plus a browser-level check of `https://7ya.io/`. Cloudflare bot challenges can block automated canonical-domain probes; that limitation must be reported rather than converted into a PASS.
