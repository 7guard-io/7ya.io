# 7YA Repository Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the open pull-request backlog to a documented, safe set; establish GitHub as canonical code; and prepare a clean base for a separate mobile-experience implementation plan.

**Architecture:** Stabilization is governance-first and does not modify production UI. A machine-readable PR ledger and a human-readable source-of-truth policy capture decisions, while GitHub comments and closures apply those decisions. Product code remains untouched until the backlog and source/runtime boundary are explicit.

**Tech Stack:** GitHub pull requests and branches, Markdown, JSON, Node.js repository checks, existing `npm run ci:local` release gate.

## Global Constraints

- Canonical code is `7guard-io/7ya.io` on `main`.
- AppDeploy is temporary runtime authority only for an exact recorded snapshot.
- No direct commits or force-pushes to `main`.
- No production deployment or DNS change in this plan.
- No PR is merged unless the exact reviewed SHA passes `npm run ci:local`.
- Security-sensitive Instagram endpoints remain blocked until authentication and exposure boundaries are verified.
- Product/mobile changes belong to a separate branch and plan after stabilization.

---

## File Map

- Create `data/governance/open-pr-triage-2026-08-03.json`: machine-readable classification and rationale for every open PR reviewed in this stabilization pass.
- Create `docs/governance/SOURCE_OF_TRUTH.md`: canonical GitHub/AppDeploy boundary, merge gate, release evidence, and rollback rules.
- Create `scripts/check-open-pr-triage.mjs`: deterministic schema and policy check for the triage ledger.
- Modify `package.json`: add `check-pr-triage` to `check-all` and `lint`.
- Create `docs/evidence/PR_STABILIZATION_2026-08-03.md`: applied closure/comment record and remaining review queue.

### Task 1: Add the deterministic pull-request triage ledger

**Files:**
- Create: `data/governance/open-pr-triage-2026-08-03.json`
- Create: `scripts/check-open-pr-triage.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: open PR metadata from GitHub and the classification rules in `docs/superpowers/specs/2026-08-03-7ya-stabilization-design.md`.
- Produces: JSON records with fields `number`, `title`, `classification`, `reason`, `required_action`, `security_sensitive`, and `review_after`.

- [ ] **Step 1: Write the failing checker**

Create `scripts/check-open-pr-triage.mjs` with these exact invariants:

```js
import fs from 'node:fs';

const path = 'data/governance/open-pr-triage-2026-08-03.json';
const allowed = new Set(['merge', 'rebase', 'archive', 'close', 'review']);
const records = JSON.parse(fs.readFileSync(path, 'utf8'));

if (!Array.isArray(records) || records.length === 0) {
  throw new Error('PR triage ledger must be a non-empty array');
}

const numbers = new Set();
for (const record of records) {
  for (const key of ['number', 'title', 'classification', 'reason', 'required_action', 'security_sensitive', 'review_after']) {
    if (!(key in record)) throw new Error(`PR record missing ${key}`);
  }
  if (!Number.isInteger(record.number) || record.number <= 0) throw new Error('Invalid PR number');
  if (numbers.has(record.number)) throw new Error(`Duplicate PR #${record.number}`);
  numbers.add(record.number);
  if (!allowed.has(record.classification)) throw new Error(`Invalid classification for #${record.number}`);
  if (typeof record.reason !== 'string' || record.reason.length < 20) throw new Error(`Reason too short for #${record.number}`);
  if (typeof record.required_action !== 'string' || record.required_action.length < 10) throw new Error(`Action too short for #${record.number}`);
  if (typeof record.security_sensitive !== 'boolean') throw new Error(`Invalid security flag for #${record.number}`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(record.review_after)) throw new Error(`Invalid review date for #${record.number}`);
  if (record.number === 283 && (!record.security_sensitive || record.classification === 'merge')) {
    throw new Error('PR #283 must remain security-sensitive and unmerged');
  }
  if ([194, 195].includes(record.number) && record.classification !== 'close') {
    throw new Error(`Placeholder PR #${record.number} must be closed`);
  }
}

console.log(`PR triage contract passed for ${records.length} records`);
```

- [ ] **Step 2: Run the checker to verify it fails**

Run:

```bash
node scripts/check-open-pr-triage.mjs
```

Expected: failure with `ENOENT` because the ledger does not exist.

- [ ] **Step 3: Create the triage ledger**

Create the JSON array covering all open PRs returned by the 2026-08-03 inventory. At minimum include #284, #283, #280, #279, #277, #273, #265, #264, #263, #258, #239, #235, #232, #195, #194, #149, #139, #134, #131, and #127. Use these fixed decisions:

```json
[
  {
    "number": 284,
    "title": "Document native 7YA digital museum integration",
    "classification": "review",
    "reason": "Current and mergeable provenance work, but it must preserve the explicit boundary that AppDeploy runtime source is not fully exported to GitHub.",
    "required_action": "Review changed files and merge only if every integration claim is limited to the recorded runtime snapshot.",
    "security_sensitive": false,
    "review_after": "2026-08-03"
  },
  {
    "number": 283,
    "title": "Add authenticated Instagram owned-media access",
    "classification": "review",
    "reason": "Useful owned-media access path with secrets, tokens, database storage and endpoint exposure that requires a dedicated security review.",
    "required_action": "Keep open and unmerged until admin authentication, retention, secret configuration and public endpoint boundaries are tested.",
    "security_sensitive": true,
    "review_after": "2026-08-03"
  },
  {
    "number": 195,
    "title": "[WIP] Fix issue in code functionality",
    "classification": "close",
    "reason": "Placeholder Copilot pull request with no actionable problem statement, acceptance criteria or validated implementation scope.",
    "required_action": "Close as not planned and reference the stabilization process.",
    "security_sensitive": false,
    "review_after": "2026-08-03"
  },
  {
    "number": 194,
    "title": "[WIP] Fix issue",
    "classification": "close",
    "reason": "Placeholder Copilot pull request with no actionable problem statement, acceptance criteria or validated implementation scope.",
    "required_action": "Close as not planned and reference the stabilization process.",
    "security_sensitive": false,
    "review_after": "2026-08-03"
  }
]
```

Expand the array for every inventoried PR; do not omit older open PRs.

- [ ] **Step 4: Wire the checker into repository gates**

Add to `package.json` scripts:

```json
"check-pr-triage": "node scripts/check-open-pr-triage.mjs"
```

Append `npm run check-pr-triage` to both `check-all` and `lint`.

- [ ] **Step 5: Run targeted checks**

Run:

```bash
npm run check-pr-triage
node -e "JSON.parse(require('node:fs').readFileSync('package.json','utf8')); console.log('package.json valid')"
```

Expected: both commands pass.

- [ ] **Step 6: Commit**

```bash
git add data/governance/open-pr-triage-2026-08-03.json scripts/check-open-pr-triage.mjs package.json
git commit -m "chore: add deterministic open PR triage gate"
```

### Task 2: Document the GitHub/AppDeploy source-of-truth boundary

**Files:**
- Create: `docs/governance/SOURCE_OF_TRUTH.md`
- Modify: `scripts/check-open-pr-triage.mjs`

**Interfaces:**
- Consumes: stabilization design canonical-source rules.
- Produces: a durable policy referenced by PR comments and release receipts.

- [ ] **Step 1: Extend the checker with a failing policy assertion**

Add:

```js
const policy = fs.readFileSync('docs/governance/SOURCE_OF_TRUTH.md', 'utf8');
for (const phrase of [
  'GitHub is the canonical code source',
  'AppDeploy is a temporary runtime authority',
  'npm run ci:local',
  'rollback target'
]) {
  if (!policy.includes(phrase)) throw new Error(`Source policy missing: ${phrase}`);
}
```

- [ ] **Step 2: Run the checker to verify it fails**

Run `npm run check-pr-triage`.

Expected: failure because `docs/governance/SOURCE_OF_TRUTH.md` does not exist.

- [ ] **Step 3: Create the policy document**

The document must state exactly:

```markdown
# 7YA Source of Truth

GitHub is the canonical code source for 7YA. The canonical repository is `7guard-io/7ya.io`, and accepted production code must be traceable to a reviewed commit on `main`.

AppDeploy is a temporary runtime authority only for an exact immutable snapshot recorded in a release receipt. A runtime-only patch is not “fully integrated” until the relevant source is exported to GitHub and verified against the deployed behavior.

A merge candidate must pass `npm run ci:local` on the exact reviewed SHA. When GitHub Actions cannot run, local gate evidence must be attached to the PR rather than treating missing checks as success.

Every production release receipt must include the commit SHA, runtime snapshot/version, domain status, validation result, and rollback target.
```

Add sections for branch protection, secret handling, source/runtime mismatch, and prohibited claims.

- [ ] **Step 4: Run targeted checks**

Run `npm run check-pr-triage`.

Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add docs/governance/SOURCE_OF_TRUTH.md scripts/check-open-pr-triage.mjs
git commit -m "docs: define 7YA source of truth"
```

### Task 3: Apply safe closure decisions to placeholder PRs

**Files:**
- GitHub PR #194 conversation and state
- GitHub PR #195 conversation and state
- Create: `docs/evidence/PR_STABILIZATION_2026-08-03.md`

**Interfaces:**
- Consumes: ledger classifications for #194 and #195.
- Produces: closed placeholder PRs and an auditable action receipt.

- [ ] **Step 1: Add closure comment to #194**

Post:

```markdown
Closed during the 7YA repository stabilization pass. This is a placeholder WIP without a defined defect, acceptance criteria, or reviewable implementation scope. No code from this PR is being merged. Future fixes must start from current `main`, include a failing test, and pass the local release gate.
```

- [ ] **Step 2: Close #194**

Set PR state to `closed`.

- [ ] **Step 3: Add closure comment to #195**

Use the same comment, replacing the PR reference only when needed.

- [ ] **Step 4: Close #195**

Set PR state to `closed`.

- [ ] **Step 5: Create the stabilization evidence receipt**

Record:

```markdown
# PR Stabilization Receipt — 2026-08-03

- Branch: `superpowers/7ya-stabilization-20260803`
- Design commit: `633a8511490f11568f172012b468f788731532a8`
- Closed: #194, #195
- Reason: placeholder WIP with no actionable scope
- Production code changed: no
- Deployment performed: no
- Remaining priority reviews: #284 provenance boundary; #283 security boundary
```

- [ ] **Step 6: Commit**

```bash
git add docs/evidence/PR_STABILIZATION_2026-08-03.md
git commit -m "docs: record initial PR stabilization actions"
```

### Task 4: Review current priority PR #284

**Files:**
- Pull request #284 changed files and conversation
- Modify: `data/governance/open-pr-triage-2026-08-03.json`
- Modify: `docs/evidence/PR_STABILIZATION_2026-08-03.md`

**Interfaces:**
- Consumes: #284 patch and source-of-truth policy.
- Produces: an approve, request-changes, or close decision grounded in exact changed files.

- [ ] **Step 1: List and inspect every changed filename in #284**

Run connector equivalents of:

```text
list_pr_changed_filenames(#284)
fetch_pr_file_patch(#284, each returned path)
```

- [ ] **Step 2: Check prohibited claims**

Reject or request changes if any changed file claims that:

- GitHub contains the full AppDeploy runtime source when it does not;
- canonical-domain integration is proven without independent verification;
- a `passed` job count discrepancy is silently normalized;
- rollback metadata is omitted.

- [ ] **Step 3: Record the decision**

Change #284 from `review` to one of `merge`, `rebase`, `archive`, or `close` and write the exact evidence in `reason` and `required_action`.

- [ ] **Step 4: Run the triage checker**

Run `npm run check-pr-triage`.

Expected: pass.

- [ ] **Step 5: Commit the updated ledger and receipt**

```bash
git add data/governance/open-pr-triage-2026-08-03.json docs/evidence/PR_STABILIZATION_2026-08-03.md
git commit -m "docs: record PR 284 stabilization decision"
```

### Task 5: Perform the security gate for PR #283

**Files:**
- Pull request #283 changed files and conversation
- Modify: `data/governance/open-pr-triage-2026-08-03.json`
- Modify: `docs/evidence/PR_STABILIZATION_2026-08-03.md`

**Interfaces:**
- Consumes: #283 patch, repository authentication patterns, environment-variable documentation, and data-storage code.
- Produces: a request-changes review or a documented safe implementation path; never an unconditional merge decision.

- [ ] **Step 1: Inspect all changed files in #283**

Identify OAuth state signing, callback validation, token encryption/storage, database schema, status/media endpoint authorization, logs, and documentation.

- [ ] **Step 2: Verify required security conditions**

The PR must fail review if any condition is missing:

```text
- OAuth state is signed, expiring, and single-use or replay-resistant.
- Redirect URI is exact and allowlisted.
- Access and refresh tokens are never returned to the browser or logs.
- Database writes use parameterized queries.
- Status and media endpoints require existing 7YA admin authentication.
- Missing secrets fail closed.
- Retention and disconnect/revocation behavior are documented.
- No production secret value is committed.
```

- [ ] **Step 3: Submit a review**

Use `REQUEST_CHANGES` when one or more conditions are missing; otherwise use `COMMENT` stating that merge remains blocked pending local gate and configured staging verification.

- [ ] **Step 4: Update the ledger and receipt**

Keep classification as `review` or change to `rebase`; do not change it to `merge` in this stabilization plan.

- [ ] **Step 5: Run the triage checker and commit**

```bash
npm run check-pr-triage
git add data/governance/open-pr-triage-2026-08-03.json docs/evidence/PR_STABILIZATION_2026-08-03.md
git commit -m "security: record Instagram PR gate"
```

### Task 6: Verify the stabilization branch and open a draft PR

**Files:**
- All files created or modified by Tasks 1–5
- New GitHub draft PR from `superpowers/7ya-stabilization-20260803` to `main`

**Interfaces:**
- Consumes: completed stabilization commits.
- Produces: a reviewable governance-only PR with no production UI changes.

- [ ] **Step 1: Run targeted checks**

```bash
npm run check-pr-triage
npm run check-text-integrity
npm run check:zones
```

Expected: pass.

- [ ] **Step 2: Run the full local release gate**

```bash
npm run ci:local
```

Expected: pass. If dependency installation or environment constraints block execution, record the exact failed command and do not claim success.

- [ ] **Step 3: Confirm branch diff is governance-only**

```bash
git diff --name-only main...HEAD
```

Expected paths are limited to:

```text
data/governance/
docs/evidence/
docs/governance/
docs/superpowers/
scripts/check-open-pr-triage.mjs
package.json
```

- [ ] **Step 4: Open a draft pull request**

Title:

```text
chore: stabilize 7YA repository governance and PR backlog
```

Body must include:

```markdown
## Scope
Governance and pull-request stabilization only. No production UI, DNS, deployment, or runtime code change.

## Evidence
- Design: `docs/superpowers/specs/2026-08-03-7ya-stabilization-design.md`
- Plan: `docs/superpowers/plans/2026-08-03-7ya-repository-stabilization.md`
- Triage ledger: `data/governance/open-pr-triage-2026-08-03.json`
- Source policy: `docs/governance/SOURCE_OF_TRUTH.md`

## Validation
Include exact command output and tested SHA. Do not mark a command as passed if it did not run.

## Next boundary
The mobile experience will use a separate design, plan, branch, and PR after this stabilization PR is reviewed.
```

- [ ] **Step 5: Stop before merge**

Do not merge the stabilization PR in the same execution pass. Review the diff and validation evidence first.

## Plan Self-Review

- Spec coverage: PR classification, GitHub/AppDeploy source boundary, safe closures, #284 provenance review, #283 security review, local gate, rollback/evidence rules, and separate mobile scope are covered.
- Placeholder scan: no `TBD`, `TODO`, “implement later,” or undefined test steps remain.
- Type consistency: the ledger fields and allowed classification values are identical in the checker and every task.
