# 7YA NVIDIA Runtime Status — 2026-09-16

## Verified live state

- AppDeploy app: `697a008fddc309b142`
- Applied source version: `1789293197999` (v69)
- Hosted NVIDIA NIM secret name: `NVIDIA_NIM_API_KEY`
- Hosted NIM runtime: `ready`
- Hosted model: `nvidia/nemotron-3-super-120b-a12b`
- NIM auth probe: `GET https://integrate.api.nvidia.com/v1/models`
- NGC registry secret name: `NGC_API_KEY`
- Secret values are never stored in this repository.

## Known credential defect in v69

The current v69 backend treats legacy `NVIDIA_API_KEY` as a fallback NVCF credential. This makes `nvcfConfigured` report true and causes NVCF discovery to fail with HTTP 401 when no correctly scoped `NVCF_API_KEY` is present.

Target policy for the migration:

- `NVIDIA_NIM_API_KEY` -> Hosted NIM / `integrate.api.nvidia.com` only.
- `NVCF_API_KEY` -> NVIDIA Cloud Functions only.
- `NGC_API_KEY` -> NGC/private registry/container pulls only.
- Legacy `NVIDIA_API_KEY` -> no implicit provider mapping.

Do not delete the legacy AppDeploy secret until an explicit irreversible-secret-removal decision is recorded.

## Security ruling

An NGC registry credential was exposed in chat on 2026-09-16. Treat that credential as compromised. Rotate/delete it in NVIDIA NGC and replace the AppDeploy `NGC_API_KEY` through the secure secret-entry flow. Never copy the exposed value into source, logs, issues, commits, or command history.

## AppDeploy deployment constraint

AppDeploy reported its Business-plan lifetime `deploy_app` limit exhausted at 400/400. Do not call `deploy_app` again unless the account limit is increased. Existing versions can still be inspected and `apply_app_version` can re-apply an existing version.

Implication: AppDeploy remains the current production runtime/reference during migration, but cannot be the only forward deployment path.

## Vercel discovery

Vercel team `7ya` contains a legacy project named `7ya.io`, but it is linked to `vepretski/7ya.io`, not the canonical `7guard-io/7ya.io` repository. It must not be used for a production cutover until Git source alignment is corrected and a preview passes release gates.

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
