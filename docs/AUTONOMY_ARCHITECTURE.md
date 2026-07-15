# 7YA Bounded Autonomy Architecture

## Decision

7YA may automate collection, internal synthesis, evidence triage and preparation of reviewable code changes. It may not autonomously publish public claims, merge code, deploy production or issue participant certificates.

The objective is not unrestricted autonomy. The objective is a continuous, auditable operating loop that performs low-risk work automatically and stops at explicit human approval gates.

## Current repository reality

The canonical repository is static-first. The public site is built from HTML, CSS and JavaScript through Node-based artifact scripts. The repository currently contains:

- a public metadata collector at `scripts/collector/index.js`;
- an OpenAI Responses API integration in the Vercel recovery guide API;
- an Evidence Oracle code lane and public evidence data;
- static artifact verification and route checks.

The repository does not currently contain a production Express application, an active multi-provider LLM router, an operational Pinata pipeline or a deployed Solidity certification system. Those capabilities must not be described as live until independently implemented and verified.

## Operating loop

```text
Approved public targets
        ↓
Public metadata collector
        ↓
Canonical input view + SHA-256 source hash
        ↓
Internal synthesis through OpenAI Responses API
        ↓
Validated internal JSON draft
        ↓
Append-only run audit
        ↓
Human review gate
        ↓
Optional public content PR or operational action
```

## State machine

1. `DISABLED`
   - Default state.
   - No model call.
   - No mutation.

2. `PLANNED`
   - Reads the reviewed policy and the latest public collection.
   - Records the source hash and intended action.
   - Performs no model call.

3. `DRAFTED`
   - Calls one pinned model through the Responses API.
   - Uses public metadata only.
   - Produces a non-publishable internal draft.
   - Records model, prompt version, response ID, token usage and source hash.

4. `REVIEW_REQUIRED`
   - A human checks the original sources and the generated draft.
   - The system may prepare a branch or pull request, but cannot merge it.

5. `APPROVED_ACTION`
   - A named reviewer records approval for a narrow action.
   - Deployment, publication and certification remain separate approvals.

6. `HALTED`
   - The kill switch terminates the run before any model call.
   - Any policy validation failure also terminates the run.

## Action classes

### Autonomous, low-risk

- collect allowlisted public metadata;
- calculate deterministic hashes;
- detect changes between snapshots;
- generate internal summaries and candidate actions;
- classify evidence provisionally;
- open a branch or draft pull request after tests pass.

### Human approval required

- publish or materially edit public claims;
- name a partner, funder or institutional relationship;
- merge code;
- deploy production;
- change DNS, authentication, billing or secrets;
- send external email;
- issue or revoke any certificate;
- process participant or minor data.

### Forbidden in v1

- autonomous direct commits to `main`;
- autonomous production deployment;
- autonomous on-chain writes;
- storing personal data, minor data or credentials in prompts or run logs;
- silent provider failover for high-risk decisions;
- treating model confidence as evidence.

## Provider policy

Provider failover is useful for availability, but it is not neutral. Different models can interpret prompts and evidence differently. Silent failover is allowed only for internal summarization and draft generation. It is forbidden for final evidence classification, publication, deployment, merge and certification decisions.

Every model change requires:

1. a pinned model identifier;
2. a recorded prompt version;
3. an evaluation against a fixed evidence test set;
4. approval before use in any high-risk lane.

## Prompt-injection boundary

Collected web content is untrusted data. The runner instructs the model never to treat text inside collected records as instructions. Only a reduced metadata view is sent to the model. Raw HTML, scripts, credentials and private documents are excluded.

## Audit record

Each run records:

- run ID and timestamps;
- source file and SHA-256 hash;
- number of records considered;
- prompt version;
- model and response ID;
- token usage when available;
- actions attempted and completed;
- approvals;
- errors.

Drafts are explicitly marked:

```json
{
  "type": "internal_draft",
  "publishable": false,
  "requires_human_approval": true
}
```

## Commands

Policy validation:

```bash
npm run check-autonomy
```

Plan-only run with the initial disabled policy:

```bash
node scripts/orchestrator/run.mjs --plan --allow-disabled-policy
```

After the policy has been reviewed and explicitly enabled, generate an internal draft:

```bash
OPENAI_API_KEY=... npm run orchestrator:dry-run
```

Emergency stop:

```bash
AUTONOMY_KILL_SWITCH=1 npm run orchestrator:dry-run
```

## Production acceptance gate

The orchestrator is not production-ready until all of the following are true:

- the repository release gate passes;
- the collector target list is reviewed and allowlisted;
- the policy validation test passes;
- cost and rate limits are configured at the API project level;
- secrets are stored outside the repository;
- run logs are retained in a private operational store;
- a fixed evaluation suite passes for the pinned model and prompt;
- a human review surface exists for drafts and source comparison;
- rollback and kill-switch procedures are tested;
- no participant or minor data enters the loop.

## StartOn certification boundary

AI may provide feedback on a participant project, but it cannot independently certify completion. Certification requires a program-defined rubric, participant consent, a human program review and a revocation mechanism. No personal data should be written on-chain. A public certificate, if later implemented, should contain only a pseudonymous reference and a hash of an approved off-chain record.
