# 7YA NVIDIA Runtime Status — 2026-09-16

## Verified live state

- AppDeploy app: `697a008fddc309b142`
- Applied source version: `1789293197999` (v69)
- Hosted NVIDIA NIM secret name: `NVIDIA_NIM_API_KEY`
- Hosted NIM runtime: `ready`
- Hosted model: `nvidia/nemotron-3-super-120b-a12b`
- NIM auth probe: `GET https://integrate.api.nvidia.com/v1/models`
- NGC registry secret name: `NGC_API_KEY`
- Legacy `NVIDIA_API_KEY`: deleted from AppDeploy on 2026-09-16 after explicit owner approval.
- NVCF configured: `false`
- NVCF runtime: `not-configured`
- Secret values are never stored in this repository.

## Credential policy

- `NVIDIA_NIM_API_KEY` -> Hosted NIM / `integrate.api.nvidia.com` only.
- `NVCF_API_KEY` -> NVIDIA Cloud Functions only.
- `NGC_API_KEY` -> NGC/private registry/container pulls only.
- Legacy `NVIDIA_API_KEY` -> removed; no implicit provider mapping remains at runtime.

## Security ruling

An NGC registry credential was exposed in chat on 2026-09-16. Treat that credential as compromised. Rotate/delete it in NVIDIA NGC and replace the AppDeploy `NGC_API_KEY` through the secure secret-entry flow. Never copy the exposed value into source, logs, issues, commits, or command history.

## AppDeploy deployment constraint

AppDeploy reported its Business-plan lifetime `deploy_app` limit exhausted at 400/400. Do not call `deploy_app` again unless the account limit is increased. Existing versions can still be inspected and `apply_app_version` can re-apply an existing version.

Implication: AppDeploy remains the current production runtime/reference during migration, but cannot be the only forward deployment path.

## Vercel discovery

Vercel team `7ya` contains a legacy project named `7ya.io`, but it is linked to `vepretski/7ya.io`, not the canonical `7guard-io/7ya.io` repository. It must not be used for a production cutover until Git source alignment is corrected and a preview passes release gates.

## DigitalOcean discovery

DigitalOcean is connected for remote Codex/Docker workspace work. Current account inspection returned no visible droplets and no SSH keys, while the account status simultaneously reports the maximum allowed Droplet count has been reached. Treat this as an account/control-plane inconsistency and do not provision a new Droplet until it is resolved in the DigitalOcean control panel or verified by a later API read.

## Agent development tooling

`scripts/bootstrap-nvidia-agent-skills.sh` installs the project-scoped NVIDIA Agent Skills selected for 7YA Codex workspaces:

- `nvidia-skill-finder`
- `nemo-retriever`
- `nemo-retriever-mcp`
- `aiq-deploy`
- `aiq-research`
- `rag-blueprint`
- `rag-eval`
- `rag-perf`
- `nemotron-retrieval-recipes`
- `nemotron-policy-generator`

These are development/operator capabilities, not public-site runtime dependencies.
