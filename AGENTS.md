# AGENTS.md — 7YA.IO Canonical Agent Contract

This file is the operational contract for every human or AI agent working in this repository.

## 1. Project identity

7YA.IO is the public digital Creatorverse of **Igor Vepretski**.

The canonical hierarchy is:

1. **Igor Vepretski** — the human, narrative and public identity core.
2. **StartOn** — the independent social mission: safe technology, learning, creation and belonging for youth who need opportunity.
3. **7YA** — the organizing system for content, evidence, provenance, AI navigation and public memory.

Do not reverse this hierarchy. AI is never the hero. The person, the mission and the documented work come first.

## 2. Canonical source of truth

- Repository: `7guard-io/7ya.io`
- Integration target: `main`
- Public domain: `https://7ya.io`
- Current production provider: AppDeploy v2
- Current production app: `697a008fddc309b142`
- Current immutable production snapshot: `1787521959471`
- Snapshot verified at: `2026-08-24 00:52:39 Asia/Jerusalem`
- AppDeploy display label at verification: `v98` — **informational only; vNN labels are rolling and must never be used as immutable provenance**
- Current global build marker: `7ya-production-truth-20260824-1`
- Active recovery branch: `recovery/appdeploy-1787521286005`
- Current production-truth receipt: `docs/releases/2026-08-24-production-source-recovery.md`

GitHub is the canonical governance, review and long-term source-control plane. **GitHub `main` is not yet deployment-identical.** The live AppDeploy source snapshot remains runtime truth until the recovered source and binary resources pass parity review and a GitHub-driven deployment cutover is explicitly approved.

Before stating a production version, call the provider and record the immutable AppDeploy snapshot id. Never reuse a prior `vNN` label as proof of identity.

The former Vercel recovery project and older repository `vepretski/7ya.io` are historical recovery references only. They must not be treated as active production.

Never copy changes from an old repository or provider snapshot into the canonical repository without comparing provenance, routes and content first.

## 3. Current control-plane state

Read the newest release receipt in `docs/releases/` and `docs/CONTROL_PLANE_STATE.json` before changing deployment, routing, domains or release metadata. Where they conflict, the newest independently verified immutable AppDeploy snapshot wins and the stale repository document must be corrected in the same focused change.

GitHub Actions may fail before checkout because of organization billing/account state. A missing or immediately failed workflow is not evidence that the code failed. Do not claim CI passed when no job ran.

AppDeploy is the active production runtime. GitHub remains the review/recovery plane until parity is complete. The next source-control priority is a provenance-preserving recovery and comparison of the live AppDeploy tree against `main`.

## 4. Public experience contract

The site must feel personal, cinematic, credible and usable — not like a generic corporate dashboard.

Required principles:

- Hebrew RTL is the primary public language.
- Igor remains visibly and narratively central.
- Use varied source-linked media; do not repeat one portrait as a decorative wall.
- Technology, motion and AI must support the story, not overpower it.
- The primary conversion action is **לתיאום שיחה**.
- The secondary conversion action is **לצפייה בראיות**.
- Every depth page must remain coherent with the Creatorverse homepage.
- The digital companion must visibly disclose that it is AI and must not invent private memory or unsupported claims.

Critical public surfaces include:

- `/`
- `/igor-vepretski/`
- `/journey/`
- `/starton/`
- `/influence/`
- `/evidence/`
- `/speaker/`
- `/talk/`
- `/contact/`
- `/about/`
- `/press/`
- `/timeline/`
- `/integrity/`
- `/api/health`

`/journey/` is a native crawlable critical route. It must never regress to a missing path or meta-refresh shim.

## 5. Evidence and language rules

Use explicit evidence states:

- `VERIFIED` — direct public or official source.
- `DOCUMENTED` — dated record, archive, snapshot or export with context.
- `SELF-ATTESTED` — Igor's public biography without direct institutional verification attached.
- `SOURCE PENDING` — not promoted as fact until an adequate source exists.
- `PRIVATE` — known information that is intentionally excluded from the public platform.
- `PILOT`, `DESIGN`, `MISSION` or `ASPIRATION` — future or proposed work, never presented as completed outcome.

Rules:

- Membership is not partnership.
- A link proves the linked content exists; it does not automatically prove reach, impact, authority or causation.
- Do not publish aggregate reach, audience, partnership, title, funding or outcome claims without a dated source.
- Do not upgrade wording merely because a logo, email or membership record exists.
- Corrections are part of the public record and must not silently erase provenance.

## 6. Privacy and safety boundaries

Never publish without explicit, item-specific authorization:

- identifying information about minors;
- private family details;
- medical, legal or financial information;
- addresses, private phone numbers or raw personal email threads;
- security methods, sources, operational details or protected case information;
- credentials, tokens, API keys, account codes or transfer codes.

Use aggregation, redaction and privacy-by-default. Public transparency is not unlimited exposure.

## 7. Architecture and modularity

The public site should remain provider-independent wherever practical, but the current verified runtime is an AppDeploy frontend-and-backend application.

- GitHub is the canonical governance, review and long-term source-control plane.
- AppDeploy snapshot `1787521959471` is the currently verified runtime snapshot for release `7ya-production-truth-20260824-1`.
- Frozen pre-repair recovery baseline: `1787521286005`.
- Preserve recovered runtime source under immutable `appdeploy-live/<snapshot>/` paths before choosing a new root application tree.
- The full AppDeploy source snapshot and public binary resources must be compared against `main` before the repository can be described as an exact production source.
- Do not overwrite root public/source files with the runtime snapshot without route, content, privacy and provenance comparison.
- Prefer shared styles and reusable content contracts over duplicated ad-hoc markup.
- Keep provider configuration isolated from content.
- Preserve rollback paths; do not destroy the previous working version before the replacement passes all gates.
- Do not add a second production source without an explicit cutover and rollback plan.
- Defer Supabase migration, Windsor.ai ingestion and vidIQ ingestion until source truth is stable unless a separately approved slice explicitly changes that order.

## 8. Release identity

One **global production release id** must agree across the active application entrypoint, backend `/api/release`/health surfaces, homepage release metadata and `public/release.json`.

Component releases may retain their own historical identifiers when they describe a bounded subsystem or artifact. Do not rewrite historical component provenance merely to make every string identical.

Current global production release id: `7ya-production-truth-20260824-1`.

## 9. Required validation

Before requesting merge, run or structurally validate:

```bash
npm run release:gate
```

When the environment cannot execute commands, state that clearly and use repository/provider-level deterministic checks. Never invent a local PASS.

For every critical route, require:

- HTTP 200 or provider-equivalent route proof;
- crawlable HTML;
- title and description;
- canonical URL;
- mobile viewport;
- no `noindex`;
- no meta-refresh on critical routes;
- security headers where controlled by the runtime;
- working internal links;
- no unsupported claims;
- usable mobile and desktop rendering.

For AppDeploy production, additionally require:

- terminal deployment status `ready`;
- zero release-critical frontend, backend and network errors;
- active custom-domain records;
- fresh desktop and mobile QA captures;
- source-level proof that the intended immutable snapshot contains the changed route/files;
- a unique release/build marker across the global release surfaces;
- an immutable release receipt and explicit rollback snapshot.

AppDeploy currently reports `e2e_tests=null` for this application. **Do not claim E2E passed when the runner did not report a run.** Keep `tests/tests.txt` as the user-visible QA contract, and treat executable E2E as a separate gate when the provider exposes it.

## 10. Deployment discipline

1. Work on a focused branch.
2. Make the smallest coherent change.
3. Update source recovery evidence, provider snapshot and release receipt together when applicable.
4. Add or update deterministic gates before behavior changes.
5. Open a PR with scope, evidence, privacy and rollback notes.
6. Address review comments in code and resolve their threads.
7. Obtain real provider/runtime verification before production promotion when CI is unavailable.
8. Tie the intended build marker, immutable provider snapshot, custom domain and repository receipt together.
9. Do not claim production success until the public domain and provider state support the claim.
10. Preserve Cloudflare mail-related records and existing nameservers during web-origin changes.
11. After an AppDeploy-first emergency release, preserve the exact runtime delta in GitHub before beginning the next broad redesign.
12. Never merge a recovery branch merely because production is healthy; parity/review and cutover are separate decisions.

## 11. Agent behavior toward the owner

Igor is the product owner, not the deployment operator. Do not make him translate vague infrastructure language.

Agents must:

- explain decisions in plain Hebrew;
- distinguish code completion from publication;
- distinguish a PR from a deployed release;
- identify the exact blocker and the exact next safe action;
- use connected GitHub, AppDeploy, Gmail and provider evidence instead of guessing;
- avoid asking Igor for information already available in the repository, email or provider state;
- never say the site is updated until the public/provider state has been freshly verified.

## 12. Forbidden regressions

Do not restore:

- `Living Proof System` as the primary brand;
- `Public trust shell` as the user-facing identity;
- `Private strategic command room` on a public route;
- copied instructions from unrelated repositories or courses;
- repeated portrait walls;
- unsupported political, institutional, partnership or audience claims;
- production configuration pointing silently at an obsolete repository/provider;
- an assistant that impersonates Igor or invents undocumented personal speech;
- a missing `/journey/` route;
- contradictory global release identifiers.

The objective is one coherent public system: **a real person, real work, visible sources and a clear invitation to act.**
