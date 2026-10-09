# AGENTS.md — 7YA.IO Canonical Agent Contract

This file is the operational contract for every human or AI agent working in this repository.

## 1. Project identity

7YA.IO is the public digital home and documented archive of **Igor Vepretski**.

The canonical hierarchy is:

1. **Igor Vepretski** — the human, narrative and public identity core.
2. **StartOn** — the independent social mission: safe technology, learning, creation and belonging for youth who need opportunity.
3. **7YA** — the organizing system for content, evidence, provenance, AI navigation and public memory.

Do not reverse this hierarchy. AI is never the hero. The person, the mission and the documented work come first.

## 2. Canonical source and production

- Repository: `7guard-io/7ya.io`, branch `main`.
- Production: Cloudflare Pages project `7ya-io`.
- Build: `npm run build:cloudflare`, output: `dist`.
- Public origin: `https://7ya-io.pages.dev/`; canonical domain: `https://7ya.io/`.
- Chat: same-origin `/api/guide`, Cloudflare Pages Function with Workers AI and an optional NVIDIA provider.
- AppDeploy snapshot `1789065075177` is historical provenance only, not an active runtime dependency.

Read `docs/CONTROL_PLANE_STATE.json` and the newest release receipts before deployment changes. The September 10 AppDeploy contract has been superseded by the September 30 Cloudflare cutover and October 7 chat release. Build the repository artifact; do not route public traffic back through legacy AppDeploy or Vercel projects.

## 3. Verification state

The Cloudflare Pages homepage and `/api/health` were directly observed on October 9, 2026. The canonical domain returned HTTP 502 / connection refused in this execution environment; this does not prove a worldwide outage. Verify canonical-domain acceptance separately and never infer it from a Pages-domain success.

GitHub Actions may be blocked by organization billing. Distinguish a skipped or blocked runner from a failed code test. The Cloudflare Git integration is the normal production deployment path. Use `deploy-meta.json` to compare the actual live source commit with the intended commit; a valid-looking manifest alone is insufficient.

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

- Keep provider configuration separate from content.
- Preserve source-linked archive routes and public media.
- Maintain one visible primary navigation on desktop and mobile; language links must remain usable without JavaScript.
- Do not cover Igor's face with oversized headings or stack competing homepage shells.
- Keep evidence, search and system controls reachable on their dedicated routes without turning the homepage into a dashboard.
- Build the governed repository artifact and preserve rollback through Git revert or Cloudflare deployment history.
- Do not add another production source without an explicit cutover and rollback plan.

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

For Cloudflare production, additionally require:

- a successful Cloudflare deployment;
- acceptance-test contract aligned to the intended experience;
- no frontend or backend errors;
- separately verified canonical-domain routing;
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
