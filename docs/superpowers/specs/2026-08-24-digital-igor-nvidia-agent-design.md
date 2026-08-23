# Digital Igor NVIDIA-First Agent Design

## Goal
Make NVIDIA Nemotron 3 Super the primary reasoning-and-tool agent for Digital Igor while preserving 7YA evidence boundaries, AppDeploy fallback, privacy, and the existing UI contract.

## Scope
This change is backend orchestration only. It does not redesign the public companion UI or change canonical claims.

## Architecture
Request flow becomes: user message -> deterministic intent/engine/state -> Nemotron tool loop -> 7YA Canon/Entities/Discovery tools -> grounded synthesis -> response. AppDeploy ai.run remains the second provider and deterministic local replies remain last-resort fallback.

## Requirements
- Primary model: `nvidia/nemotron-3-super-120b-a12b`.
- NVIDIA must be allowed to choose among the existing 7YA public tools using OpenAI-compatible `tools` and `tool_choice`.
- Canon remains authoritative; Public Discovery remains explicitly non-canonical lead material.
- Follow-up messages such as `תמשיך`, `continue`, `עוד`, `why`, and equivalents must retain prior focus for retrieval and reasoning.
- Routing should be deterministic for clear engine cases; external classification is reserved for genuinely ambiguous requests.
- NVIDIA requests must have a hard timeout, at most one retry for HTTP 429/5xx, and a short in-memory circuit breaker before falling back.
- Sampling must be engine-aware: low variance for factual/architectural work and higher only for creative work.
- Add an admin-only live canary endpoint that performs a small real NVIDIA request and returns only operational metadata and boundary checks; never expose secrets or hidden reasoning.
- Existing `POST /api/companion`, `POST /api/igor`, and frontend response fields remain compatible.

## Tool loop
Reuse one tool executor for both providers so tool semantics cannot drift. Supported public tools remain profile, surfaces, evidence clusters, content graph, canonical entities, Public Discovery, related content, public-page reader, and action routes. Nemotron may issue multiple tool calls in a bounded loop; tool results are appended as `tool` messages and the model synthesizes the final JSON response.

## Error handling
A missing NVIDIA key skips NVIDIA. Timeout or non-retryable failure immediately falls back. HTTP 429/5xx receives one retry. Consecutive NVIDIA failures open a short circuit; a successful request resets it. Tool execution errors become bounded tool-result errors rather than crashing the full conversation.

## Verification
Regression coverage must exercise provider ordering/status, follow-up focus retention, Canon versus Discovery, private-memory/fabricated-metric refusal, NVIDIA failure fallback, and admin-only canary exposure. AppDeploy build/runtime/network QA must be clean after deployment. A live canary PASS is the gate for claiming end-to-end NVIDIA inference verified.
