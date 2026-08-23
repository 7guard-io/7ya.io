# Digital Igor NVIDIA-First Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Nemotron 3 Super from a one-shot synthesis provider into the primary bounded tool-using agent for Digital Igor, with robust follow-up retrieval and measurable live health.

**Architecture:** Reuse one companion tool executor across NVIDIA and AppDeploy fallback. NVIDIA uses OpenAI-compatible tool calling in a bounded loop, with deterministic continuation context, engine-aware sampling, timeout/retry/circuit protection, and an admin-only live canary.

**Tech Stack:** TypeScript, AppDeploy router/AI/secrets SDK, NVIDIA NIM OpenAI-compatible Chat Completions API.

**Spec:** `docs/superpowers/specs/2026-08-24-digital-igor-nvidia-agent-design.md`

## Global Constraints
- Keep `POST /api/companion` and `POST /api/igor` response compatibility.
- Keep provider order `nvidia -> appdeploy-agent -> local`.
- Canon is authoritative; Discovery is never silently promoted.
- Do not expose API secrets or hidden chain-of-thought.
- Do not alter public UI design in this change.

---

### Task 1: Lock behavioral regression coverage

**Files:**
- Modify: AppDeploy `tests/tests.txt`

**Interfaces:**
- Consumes: existing companion UI and `/api/companion/status`.
- Produces: regression expectations for follow-up grounding, NVIDIA provider metadata, privacy/fabrication guardrails, and fallback.

- [ ] **Step 1: Write the failing behavioral expectations**
  Extend the Digital Igor test so `StartOn -> תמשיך` must preserve the StartOn focus, and a request to invent a private memory/metric must remain bounded.
- [ ] **Step 2: Verify current source violates the new follow-up requirement**
  Confirm current `callNvidia` searches using only the last message text, so `תמשיך` is the retrieval query.
- [ ] **Step 3: Keep the test as the permanent regression gate**

### Task 2: Unify companion tool execution

**Files:**
- Modify: AppDeploy `backend/index.ts`

**Interfaces:**
- Produces: `executeCompanionTool(name,args,locale,intent)` used by both providers.

- [ ] **Step 1: Extract the existing real tool behavior from `runToolAgent` into one helper**
- [ ] **Step 2: Point `runToolAgent.onToolCall` at the helper without changing user-visible output**
- [ ] **Step 3: Deploy validation must remain green before proceeding**

### Task 3: Make Nemotron the tool-using primary agent

**Files:**
- Modify: AppDeploy `backend/index.ts`

**Interfaces:**
- Consumes: `toolDefinitions`, `executeCompanionTool`, conversation state.
- Produces: bounded NVIDIA tool loop returning `AgentReply`.

- [ ] **Step 1: Convert 7YA tool definitions to OpenAI function-tool format**
- [ ] **Step 2: Send `tools` plus `tool_choice:'auto'` to NVIDIA**
- [ ] **Step 3: Execute returned `tool_calls`, append `tool` messages, and iterate up to four model turns**
- [ ] **Step 4: Require at least one public retrieval tool for Igor/StartOn/evidence/platform factual requests before final synthesis**
- [ ] **Step 5: Parse only the final answer JSON; never surface reasoning content**

### Task 4: Fix continuation retrieval and routing latency

**Files:**
- Modify: AppDeploy `backend/index.ts`

**Interfaces:**
- Produces: deterministic continuation query and engine routing.

- [ ] **Step 1: Add a retrieval-query helper that prefers prior `state.focus` for short continuation messages and combines it with site/journey context**
- [ ] **Step 2: Use deterministic `fallbackEngine` immediately for clear keyword matches**
- [ ] **Step 3: Call AppDeploy classification only for ambiguous requests**

### Task 5: Add resilience policy

**Files:**
- Modify: AppDeploy `backend/index.ts`

**Interfaces:**
- Produces: bounded NVIDIA request helper.

- [ ] **Step 1: Add an AbortSignal timeout to each NVIDIA HTTP request**
- [ ] **Step 2: Retry once only for 429/5xx**
- [ ] **Step 3: Track consecutive failures in module memory and open a short circuit before falling back**
- [ ] **Step 4: Reset circuit state after a successful NVIDIA response**
- [ ] **Step 5: Apply engine-aware temperature with low variance outside CREATOR**

### Task 6: Add protected live canary and status metadata

**Files:**
- Modify: AppDeploy `backend/index.ts`
- Modify: AppDeploy `tests/tests.txt`

**Interfaces:**
- Produces: admin-only `GET /api/companion/canary` and richer `/api/companion/status`.

- [ ] **Step 1: Add an authenticated/admin-only canary that performs one real public-safe NVIDIA request**
- [ ] **Step 2: Return provider, model, latency, tool-use count, grounding boundary, and privacy/fabrication boundary only**
- [ ] **Step 3: Expose timeout/circuit/tool-agent policy in status without secrets**
- [ ] **Step 4: Update release metadata date and release id**

### Task 7: Deploy and verify

**Files:**
- AppDeploy live snapshot

**Interfaces:**
- Produces: deployed Digital Igor release.

- [ ] **Step 1: Deploy the minimal diffs**
- [ ] **Step 2: Poll AppDeploy until terminal status**
- [ ] **Step 3: Inspect frontend, backend, network, and E2E results**
- [ ] **Step 4: Confirm live source contains tool loop, follow-up query logic, timeout/circuit policy, and protected canary**
- [ ] **Step 5: Claim live NVIDIA inference only if the canary itself returns PASS; otherwise report deployment as verified but inference as not independently proven**
