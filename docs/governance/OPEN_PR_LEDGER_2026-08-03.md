# 7YA Open Pull Request Ledger — 2026-08-03

This ledger is the canonical stabilization view for open pull requests in `7guard-io/7ya.io` before further product work.

## Decision states

- **KEEP / VERIFY** — useful, current work; requires exact-SHA local release gate before merge.
- **REBASE / RESTACK** — useful concept or implementation, but based on stale or stacked history.
- **PROVENANCE ONLY** — records an external AppDeploy runtime release; does not establish GitHub source alignment.
- **SECURITY BLOCKED** — must not merge until named security requirements and tests are satisfied.
- **ARCHIVE / CLOSE** — superseded, duplicate, empty, experimental, or no longer aligned with the canonical architecture.

## Current priority queue

| PR | Decision | Reason / required action |
|---|---|---|
| #285 | KEEP / VERIFY | Superpowers stabilization design, plan, and this ledger. Keep draft until an exact-SHA local gate can run. |
| #284 | PROVENANCE ONLY | Useful museum release receipt. Merge only after JSON/schema checks and exact-SHA documentation verification. It does not contain the AppDeploy runtime source. |
| #283 | SECURITY BLOCKED | Instagram OAuth lacks admin authorization on authorize/status/media, one-time state consumption, token encryption, strict account allowlisting, safe public errors, revocation/refresh handling, and deterministic tests. |
| #280 | PROVENANCE ONLY | Newer modular Companion receipt. Retain as the preferred Companion release record after validating overlap with #279. |
| #279 | ARCHIVE / CLOSE AFTER CROSS-CHECK | Earlier mobile Companion receipt appears superseded by #280. Preserve rollback identifiers in #280 or a consolidated receipt before closing. |
| #277 | REBASE / VERIFY | Structured LinkedIn archive batch is potentially valuable. Rebase onto current `main`, deduplicate against current museum/archive data, then run evidence/privacy gates. |
| #273 | KEEP / VERIFY | One-field SEO fix with low conceptual risk. Rebase and validate rendered JSON-LD before merge. |
| #265 | PROVENANCE ONLY | Historical AppDeploy life-archive receipt. Keep only if the snapshot remains needed in the release history; otherwise consolidate into a release ledger. |
| #264 | RESTACK | Depends on #263. Do not review independently until Archive V2 is resolved and the branch is restacked onto current `main`. |
| #263 | REBASE / REDESIGN REVIEW | Large Archive V2 implementation is stale and conflicts with later museum/runtime work. Extract reusable evidence data and visual rules rather than force-merging. |
| #258 | ARCHIVE / CLOSE | Homepage redesign predates later Control, PWA, museum, and AppDeploy work; non-mergeable and superseded. |
| #239 | ARCHIVE / EXTRACT | Public command-center concept overlaps later `/control/` work. Extract any unique evidence-governance checks, then close. |
| #235 | HOLD OUTSIDE CURRENT ARCHITECTURE | Separate Next.js authority hub creates a second product/runtime. Do not merge into the static-first canonical site during stabilization. |
| #232 | REBASE / SECURITY REVIEW | Bounded autonomy design is useful but stale. Rebase only after current collector, policy, and provider contracts are reviewed. |
| #149 | REBASE / OPS REVIEW | Deterministic API release manifest is valuable, but the branch is stale and must be reconciled with the current Netlify/AppDeploy boundary. |
| #139 | REBASE / API CONTRACT REVIEW | Chat CORS/validation work may be useful; compare against the currently deployed API and current function source before retaining. |
| #134 | REBASE / VERIFY | Local-first RAG core is isolated and potentially valuable. Rebase, run privacy exclusion tests, and confirm package interfaces remain current. |
| #131 | ARCHIVE / CLOSE | Pages release contract predates current main and later CI changes; non-mergeable and likely superseded. |
| #127 | ARCHIVE / CLOSE | Separate Gemini code-master subsystem is outside the 7YA product stabilization scope and adds operational surface without current need. |
| #126 | ARCHIVE / CLOSE | Old profile/press/archive route implementation is superseded by later canonical entity and museum work. |
| #123 | ARCHIVE / CLOSE | Identity-route navigation work is superseded by current canonical navigation/entity changes. |
| #121 | REBASE / SECURITY REVIEW | GitHub App user OAuth may be valuable, but requires current schema, authentication, cookie, encryption, and callback review plus real smoke tests. |
| #118 | ARCHIVE / CLOSE | Old Vercel root-output fix no longer represents the current deployment/runtime architecture. |
| #113 | ARCHIVE / EXTRACT | Social embed concept is stale; retain only unique legal/trust patterns if absent from current site. |
| #112 | COMPARE / CLOSE IF INCLUDED | Evidence Oracle schema may already be present in current main. Compare exact interfaces; close if fully absorbed. |
| #107 | REBASE / LEGAL REVIEW | Third-party notices are useful, but regenerate from the current lockfile and review public-route relevance. |
| #104 | ARCHIVE / CLOSE | Old footer route map is superseded by current navigation and Control/PWA work. |
| #90 | ARCHIVE / EXTRACT | Governance documentation predates current entity/governance framework. Extract any unique platform matrix fields only. |
| #87 | COMPARE / CLOSE IF INCLUDED | Agent governance may have been superseded by current `AGENTS.md` and governance docs. Compare before closing. |
| #38 | ARCHIVE / CLOSE | Earliest Igor route branch is non-mergeable and superseded by multiple later canonical implementations. |

## Closed during stabilization

The following were closed without merge because they were empty placeholders, duplicated WIP branches, obsolete smoke tests, or issue-template shells:

- #194, #195
- #94
- #86
- #76
- #72, #71, #70, #69

Additional Copilot WIP shells in the #55–#68 range should be closed after confirming they contain no unique changes not present in current `main`.

## Merge gate

No code or release PR is mergeable under this ledger until all conditions below hold:

1. Branch is based on current `main` or intentionally restacked.
2. Changed files are reviewed for overlap with later work.
3. `npm run ci:local` passes on the exact proposed SHA.
4. Static artifact build and verification pass on the exact proposed SHA.
5. Security-sensitive changes include deterministic negative tests.
6. Runtime claims distinguish GitHub source, deployment provider state, and independently observed production state.
7. A rollback target is recorded for deployment-affecting changes.

## Next stabilization actions

1. Consolidate #279 and #280 into one Companion provenance record.
2. Close clearly superseded non-mergeable product PRs (#258, #131, #126, #123, #118, #104, #38).
3. Compare current main against #112 and #87 before closing them.
4. Review #273 as the first small rebase candidate.
5. Keep #283 blocked until a separate security-hardening design and implementation plan are approved.
