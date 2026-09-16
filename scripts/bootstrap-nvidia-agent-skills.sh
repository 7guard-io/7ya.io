#!/usr/bin/env bash
set -euo pipefail

# 7YA NVIDIA agent-skill bootstrap for Codex project workspaces.
# Installs only the NVIDIA-verified skills that map directly to the approved
# 7YA intelligence architecture: retrieval, deep research, RAG evaluation,
# deployment and policy governance.

if ! command -v node >/dev/null 2>&1 || ! command -v npx >/dev/null 2>&1; then
  echo 'Node.js/npm are required before installing NVIDIA Agent Skills.' >&2
  exit 1
fi

skills=(
  nvidia-skill-finder
  nemo-retriever
  nemo-retriever-mcp
  aiq-deploy
  aiq-research
  rag-blueprint
  rag-eval
  rag-perf
  nemotron-retrieval-recipes
  nemotron-policy-generator
)

for skill in "${skills[@]}"; do
  echo "Installing NVIDIA skill: ${skill}"
  npx skills@latest add nvidia/skills --skill "${skill}" --agent codex --yes
done

echo 'Checking installed NVIDIA skills...'
npx skills@latest list

echo 'NVIDIA Agent Skills bootstrap complete for this Codex workspace.'
