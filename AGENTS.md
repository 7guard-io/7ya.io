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
- Current recovery runtime source: `ops/vercel-canonical-proxy`
- Vercel recovery project: `7ya-static-site`
- Vercel project root directory: `ops/vercel-canonical-proxy`
- Production branch contract: `main`

The separate Vercel project named `7ya.io` has historically been connected to the older repository `vepretski/7ya.io`. It must not be treated as the canonical source-control plane.

Never copy changes from an old repository into the canonical repository without comparing provenance, routes and content first.

## 3. Current control-plane state

Read `docs/CONTROL_PLANE_STATE.json` before changing deployment, routing, domains or release metadata.

GitHub Actions may fail before checkout because the organization account is locked by a billing issue. A missing or immediately failed workflow is not evidence that the code failed. Do not claim CI passed when no job ran.

Vercel is the independent recovery deployment plane while GitHub remains the source-control and review plane.

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

The public site is static-first and provider-independent wherever practical.

- Root public files are the canonical content source.
- `ops/vercel-canonical-proxy` is a deployable recovery bridge pinned to one immutable canonical source SHA, not a separate editorial universe.
- Update public content only in the root canonical source. A release-control PR must pin the recovery bridge to the merged content SHA before production deployment.
- Prefer shared styles and reusable content contracts over duplicated ad-hoc markup.
- Keep provider configuration isolated from content.
- Preserve rollback paths; do not destroy the previous working origin before the replacement passes all gates.
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

## 9. Deployment discipline

1. Work on a focused branch.
2. Make the smallest coherent change.
3. Update source and recovery artifact together when applicable.
4. Add or update deterministic gates.
5. Open a PR with scope, evidence, privacy and rollback notes.
6. Address review comments in code and resolve their threads.
7. Obtain a real preview or manual runtime verification before production merge when CI is unavailable.
8. Merge only when the source SHA, artifact and intended deployment can be tied together.
9. Do not change DNS until the exact repository-backed deployment is READY and the complete route gate passes.
10. Preserve Cloudflare mail-related records and existing nameservers during web-origin changes.

## 10. Agent behavior toward the owner

Igor is the product owner, not the deployment operator. Do not make him translate vague infrastructure language.

Agents must:

- explain decisions in plain Hebrew;
- distinguish code completion from publication;
- distinguish a PR from a deployed release;
- identify the exact blocker and the exact next safe action;
- use connected GitHub, Gmail and Vercel evidence instead of guessing;
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
- production configuration pointing silently at an obsolete repository.

The objective is one coherent public system: **a real person, real work, visible sources and a clear invitation to act.**
