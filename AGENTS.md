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
- Default branch: `main`
- Public domain: `https://7ya.io`
- Current production provider: AppDeploy v2
- Current production app: `697a008fddc309b142`
- Current verified version: `v96` / `1788620914856`
- Current build marker: `7ya-sovereign-recovery-20260905-v3-globalfix`
- Production branch contract: `main`
- Production receipt: `docs/releases/2026-09-05-appdeploy-v96-globalfix-v3.json`

GitHub remains the canonical source-control and review plane. The verified AppDeploy runtime snapshot has not yet been fully exported back into the repository. Until that export is completed and compared, do not claim that `main` contains the exact production source.

Fresh reconciliation on 2026-09-05 confirms that AppDeploy v96 contains the active root `src/App.tsx` and `backend/index.ts`, while GitHub `main` does not contain those root runtime files. AppDeploy v96 is therefore the current runtime source of truth; GitHub `main` must not be deployed over it until a full source export and comparison passes the release gates.

The former Vercel recovery project and older repository `vepretski/7ya.io` are historical recovery references only. They must not be treated as the active production source-control plane.

Never copy changes from an old repository or provider snapshot into the canonical repository without comparing provenance, routes and content first.

## 3. Current control-plane state

Read the newest release receipt in `docs/releases/` and `docs/CONTROL_PLANE_STATE.json` before changing deployment, routing, domains or release metadata. Where they conflict, the newest independently verified receipt wins and the stale control-plane document must be corrected in the same focused change.

GitHub Actions may fail before checkout because the organization account is locked by a billing issue. A missing or immediately failed workflow is not evidence that the code failed. Do not claim CI passed when no job ran.

AppDeploy is the active production runtime. GitHub remains the source-control and review plane. The next source-control priority is a provenance-preserving export and comparison of AppDeploy snapshot `1788620914856` against `main`.

Current known runtime caveats:
- AppDeploy reports `ready` with zero current frontend, network and backend QA errors.
- AppDeploy E2E is `null`; do not claim an AppDeploy E2E PASS.
- `NVIDIA_API_KEY` is configured and read through AppDeploy Secrets, but the NVIDIA canary returns HTTP 401. NVIDIA primary is degraded-auth; AppDeploy-agent/local fallback remains the resilience path.
- A prior visual-gate failure predates v96 and must not be treated as v96 visual evidence. Require a fresh v96 visual acceptance result before declaring pixel-level visual PASS.
- Direct browser requests to `/api/*` can surface SPA HTML; frontend API calls must use the supported AppDeploy client transport until the direct-HTTP platform contract is explicitly resolved.

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
- The digital companion must identify itself as a 7YA tool; it is not Igor and must not speak on his behalf.

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

The public site should remain provider-independent wherever practical, but the current verified production runtime is an AppDeploy frontend-and-backend application.

- GitHub is the canonical governance, review and long-term source-control plane.
- AppDeploy version `1788620914856` is the verified production runtime snapshot.
- The full AppDeploy source snapshot must be exported into a focused GitHub branch and compared against `main` before the repository can again be described as an exact production source.
- Do not overwrite the root public files with the runtime snapshot without a route, content, privacy and provenance comparison.
- Prefer shared styles and reusable content contracts over duplicated ad-hoc markup.
- Keep provider configuration isolated from content.
- Preserve rollback paths; do not destroy the previous working version before the replacement passes all gates.
- Do not add a second production source without an explicit cutover and rollback plan.

## 8. Required validation

Before requesting merge, run or structurally validate:

```bash
npm run release:gate
```

When the environment cannot execute commands, state that clearly and use repository-level deterministic checks. Never invent a local PASS.

For every critical route, require:

- HTTP 200;
- crawlable HTML;
- title and description;
- canonical URL;
- mobile viewport;
- no `noindex`;
- `X-Robots-Tag: index, follow` where required by the runtime contract;
- security headers;
- working internal links;
- no unsupported claims;
- usable mobile and desktop rendering.

For AppDeploy production, additionally require:

- terminal deployment status `ready`;
- all acceptance tests passed;
- no frontend or backend errors;
- active custom-domain records;
- a unique, no-cache server-side probe that proves `7ya.io` serves the intended build marker;
- an immutable release receipt and explicit rollback version.

## 9. Deployment discipline

1. Work on a focused branch.
2. Make the smallest coherent change.
3. Update source, provider snapshot and release receipt together when applicable.
4. Add or update deterministic gates.
5. Open a PR with scope, evidence, privacy and rollback notes.
6. Address review comments in code and resolve their threads.
7. Obtain a real preview or manual runtime verification before production promotion when CI is unavailable.
8. Tie the intended build marker, provider version, custom domain and repository receipt together.
9. Do not claim production success until `7ya.io` itself passes the canonical build probe.
10. Preserve Cloudflare mail-related records and existing nameservers during web-origin changes.
11. After an AppDeploy-first emergency release, export the exact runtime source back to GitHub before beginning the next broad redesign.

## 10. Agent behavior toward the owner

Igor is the product owner, not the deployment operator. Do not make him translate vague infrastructure language.

Agents must:

- explain decisions in plain Hebrew;
- distinguish code completion from publication;
- distinguish a PR from a deployed release;
- identify the exact blocker and the exact next safe action;
- use connected GitHub, AppDeploy, Gmail and provider evidence instead of guessing;
- avoid asking Igor for information already available in the repository, email or provider state;
- never say the site is updated until the public URL has been verified.

## 11. Forbidden regressions

Do not restore:

- `Living Proof System` as the primary brand;
- `Public trust shell` as the user-facing identity;
- `Private strategic command room` on a public route;
- copied instructions from unrelated repositories or courses;
- repeated portrait walls;
- unsupported political, institutional, partnership or audience claims;
- production configuration pointing silently at an obsolete repository;
- an assistant that impersonates Igor or implies that automated text is his personal speech.

The objective is one coherent public system: **a real person, real work, visible sources and a clear invitation to act.**
