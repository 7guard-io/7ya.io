# AGENTS.md — 7YA.IO Canonical Agent Contract

This file is the operational contract for every human or AI agent working in this repository.

## 1. Project identity

7YA.IO is the public digital home and documented archive of **Igor Vepretski**.

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
- Current verified version: `v98` / `1789065075177`
- Current build marker: `7ya-public-profile-convergence-20260910-v11`
- Production branch contract: `main`
- Production receipt: `docs/releases/2026-09-10-appdeploy-v98-public-profile-convergence-v11.json`

GitHub remains the canonical source-control, governance and review plane. The verified AppDeploy runtime snapshot has not yet been fully exported back into the repository. Until that export is completed and compared, do not claim that `main` contains the exact production source.

Fresh reconciliation on 2026-09-10 confirms that AppDeploy v98 contains the active root `src/main.tsx`, `src/App.tsx` and `backend/index.ts`, and that the public homepage runtime is `index.html -> src/main.tsx -> src/App.tsx -> ConversionHome`. GitHub `main` contains the corrected root `src/main.tsx`, but still does not contain the complete exact active `src/App.tsx`, backend and runtime tree. AppDeploy v98 is therefore the current runtime source of truth; GitHub `main` must not be deployed over it until a full source export and comparison passes the release gates.

The former Vercel recovery project and older repository `vepretski/7ya.io` are historical recovery references only. They must not be treated as the active production source-control plane.

Never copy changes from an old repository or provider snapshot into the canonical repository without comparing provenance, routes and content first.

## 3. Current control-plane state

Read the newest release receipt in `docs/releases/` and `docs/CONTROL_PLANE_STATE.json` before changing deployment, routing, domains or release metadata. Where they conflict, the newest independently verified receipt wins and the stale control-plane document must be corrected in the same focused change.

GitHub Actions may fail before checkout because the organization account is locked by a billing issue. A missing or immediately failed workflow is not evidence that the code failed. Do not claim CI passed when no job ran.

AppDeploy is the active production runtime. GitHub remains the source-control and review plane. The next source-control priority is a provenance-preserving full export and comparison of AppDeploy snapshot `1789065075177` against `main`. The v11 release receipt already records the known public-surface delta; that receipt is evidence of the deployed state, not a claim that the full runtime tree is present in GitHub.

Current known runtime caveats:
- AppDeploy reports `ready` with zero current frontend, network and backend QA errors for v98.
- AppDeploy E2E is `null`; do not claim an AppDeploy E2E PASS.
- `NVIDIA_API_KEY` is configured and read through AppDeploy Secrets, but historical NVIDIA/NVCF canaries return HTTP 401. NVIDIA primary is degraded-auth; AppDeploy-agent/local fallback remains the resilience path.
- Fresh v98 mobile and desktop QA screenshots were generated, but independent pixel-level visual acceptance remains a separate gate and is not yet claimed.
- Direct browser requests to `/api/*` can surface SPA HTML; frontend API calls must use the supported AppDeploy client transport until the direct-HTTP platform contract is explicitly resolved.
- The custom domains `7ya.io` and `www.7ya.io` are active on AppDeploy v2.

## 4. Public experience contract

The site must feel like a modern, credible public profile and documented body of work — personal, clear and usable, not like a generic corporate dashboard or a technology demo.

Required principles:

- Hebrew RTL is the primary public language.
- **Igor Vepretski is the primary brand.**
- In the first public experience, a new visitor should quickly understand who Igor is, the human story, the subjects he works on, what has been done, where the sources are and how to continue or make contact.
- Use varied source-linked real media; do not repeat one portrait as a decorative wall.
- Technology, motion, 7YA and AI must support the story, not overpower it.
- The primary homepage actions are **הסיפור שלי**, **העשייה שלי** and **דברו איתי**.
- The primary navigation is **ראשי / הסיפור שלי / העשייה / נושאים / מדיה / דברו איתי**.
- Archive, Evidence, Research, StartOn, all-content search and system surfaces remain available as secondary depth.
- Every factual work card should preserve a route to a source where one exists.
- Registration, membership, coverage or a link must never be presented as proof of social outcome, reach, causation or partnership unless the source actually supports that claim.
- Every depth page must remain coherent with the Igor-first public homepage.
- The public digital companion is branded **Ask Igor / שאלו את איגור / Спросите Игоря**. It is an AI interface over public material, not Igor, and must not invent a position or impersonate him.

Critical public surfaces include:

- `/`
- `/igor-vepretski/`
- `/starton/`
- `/media/`
- `/evidence/`
- `/research/`
- `/library/`
- `/contact/`

Older routes such as Journey, Museum, Music, Speaker, Blog, Create, Search, Social and experimental leadership surfaces remain part of the deeper archive/system and must not be silently deleted.

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
- The Evidence homepage or source wall is a navigation layer into evidence; its existence is not itself proof of a claim.
- Prefer independent/official sources for factual public claims and distinguish authored content from third-party coverage.

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
- AppDeploy version `1789065075177` is the verified production runtime snapshot.
- The full AppDeploy source snapshot must be exported into a focused GitHub branch and compared against `main` before the repository can again be described as an exact production source.
- Do not overwrite the root public files with the runtime snapshot without a route, content, privacy and provenance comparison.
- Prefer shared styles and reusable content contracts over duplicated ad-hoc markup.
- Keep provider configuration isolated from content.
- Preserve rollback paths; do not destroy the previous working version before the replacement passes all gates.
- Do not add a second production source without an explicit cutover and rollback plan.
- Do not reintroduce the previous system-first homepage simply because legacy components remain in the runtime tree; the active home route is `ConversionHome`.

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
- acceptance-test contract aligned to the intended experience;
- no frontend or backend errors;
- active custom-domain records;
- a unique, no-cache server-side probe that proves `7ya.io` serves the intended build marker when such a probe is available;
- an immutable release receipt and explicit rollback version.

Do not convert a generated QA screenshot into a claim of independent pixel-level acceptance, and do not convert `e2e_tests: null` into an E2E PASS.

## 9. Deployment discipline

1. Work on a focused branch when changing repository source.
2. Make the smallest coherent change.
3. Update source, provider snapshot and release receipt together when applicable.
4. Add or update deterministic gates.
5. Open a PR with scope, evidence, privacy and rollback notes for repository-source changes when the workflow supports it.
6. Address review comments in code and resolve their threads.
7. Obtain a real preview or manual runtime verification before production promotion when CI is unavailable.
8. Tie the intended build marker, provider version, custom domain and repository receipt together.
9. Do not claim canonical-domain build-marker verification when the available public probe is stale or cache-ambiguous.
10. Preserve Cloudflare mail-related records and existing nameservers during web-origin changes.
11. After an AppDeploy-first emergency release, export the exact runtime source back to GitHub before beginning the next broad redesign.
12. If the GitHub root is known to be older than production, do not “synchronize” by deploying it over the verified AppDeploy runtime. Record the new runtime first, then reconcile with provenance.

## 10. Agent behavior toward the owner

Igor is the product owner, not the deployment operator. Do not make him translate vague infrastructure language.

Agents must:

- explain decisions in plain Hebrew;
- distinguish code completion from publication;
- distinguish a PR from a deployed release;
- identify the exact blocker and the exact next safe action;
- use connected GitHub, AppDeploy, Gmail and provider evidence instead of guessing;
- avoid asking Igor for information already available in the repository, email or provider state;
- never say a public behavior was verified when only source code, build output or a cached crawler result was inspected;
- prefer observable user-visible outcomes over build activity as the definition of success.

## 11. Forbidden regressions

Do not restore:

- `Living Proof System` as the primary brand;
- `Public trust shell` as the user-facing identity;
- `Private strategic command room` on a public route;
- copied instructions from unrelated repositories or courses;
- repeated portrait walls;
- unsupported political, institutional, partnership or audience claims;
- production configuration pointing silently at an obsolete repository;
- an assistant that impersonates Igor or implies that automated text is his personal speech;
- a 7YA-first homepage that forces an ordinary visitor to understand the technology before understanding Igor;
- a homepage dump of the complete archive, large influence dashboards or research systems before the basic public story.

The objective is one coherent public system: **a real person, real work, visible sources and a clear invitation to act.**
