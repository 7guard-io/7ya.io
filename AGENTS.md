# AGENTS.md — 7YA.IO Canonical Agent Contract

This file is the operational contract for every human or AI agent working in this repository.

## 1. Project identity

7YA.IO is the living visual biography, public archive and AI navigation system of **Igor Vepretski**.

The canonical hierarchy is:

1. **Igor Vepretski** — the human, narrative and public identity core.
2. **StartOn** — the independent social mission and execution layer: safe technology, learning, creation and belonging for youth who need opportunity.
3. **7YA** — the organizing system for content, evidence, provenance, AI navigation, publishing and public memory.

Do not reverse this hierarchy. AI is never the hero. The person, the mission and the documented work come first.

North star:

> **ONE IGOR / ONE CANON / ONE VISUAL LANGUAGE / MANY OUTPUTS**

## 2. Canonical source of truth

- Repository: `7guard-io/7ya.io`
- Default branch: `main`
- Public domain: `https://7ya.io`
- Current production provider: AppDeploy v2
- Current production app: `697a008fddc309b142`
- Observed applied AppDeploy source snapshot on 2026-08-23: `1787467519973`
- Production branch contract: `main`
- Current foundation PR: draft PR `#302`
- Current acceptance contract: `config/7ya-acceptance.v1.json`
- Current Digital Igor voice contract: `config/digital-igor.voice.v1.json`

GitHub is the canonical governance, review and long-term source-control plane. However, the currently applied AppDeploy source is newer than the executable GitHub root. **Do not claim that `main` is byte/source-equivalent to production until reconciliation/export is completed and verified.**

The older repository `vepretski/7ya.io`, former Vercel recovery surfaces and historical AppDeploy snapshots are recovery/provenance references only. Never copy an older provider or repository snapshot into the active code path without comparison.

The current P0 source-control objective is a provenance-preserving reconstruction/export of the applied AppDeploy source followed by an intentional comparison to `main`.

## 3. Current control-plane state

Read, in order, before changing deployment/routing/release state:

1. newest independently verified deployment receipt;
2. `ops/source-alignment/2026-08-23-live-baseline.md` or a newer baseline;
3. `docs/CONTROL_PLANE_STATE.json`;
4. current AppDeploy provider state.

If they conflict, current independently verified provider/runtime evidence wins and the stale repository control document must be corrected in the same focused branch.

A missing CI/status check is not a PASS. A provider status of `ready` proves runtime readiness only; it does not prove narrative, visual, evidence or regression quality.

## 4. Public experience contract

7YA must feel like a personal, cinematic, credible living biography — not a generic corporate dashboard and not a public control room.

Required principles:

- Hebrew RTL is the primary public language.
- Igor remains visibly and narratively central.
- **Face first. Proof immediately after.**
- Use varied authentic source-linked media; do not repeat one portrait as a decorative wall.
- Real media and precise metadata outrank generic decoration.
- Technology, motion and AI support the story; they do not overpower it.
- Control-plane concepts such as OAuth readiness, ingestion queues, metadata recovery, provenance recovery and operator diagnostics do not belong in the primary story flow.
- Every depth page must remain coherent with the living biography.
- Evidence should be progressively disclosed rather than dumped into the visitor's first view.

Visitor-facing story chapters should resolve to human concepts such as:

- NOW
- LIFE
- CREATE
- STARTON
- IDEAS / LAB
- MEDIA / ECHO
- ARCHIVE

The internal architecture may be more complex than these chapters. Do not expose internal complexity merely because it exists.

## 5. Digital Igor contract

The public conversational layer is **IGOR / 7YA AI** — a clearly disclosed digital representation built from Igor's verified public canon.

Required disclosure in Hebrew:

> **הגרסה הדיגיטלית שלי — AI שנבנה מהקאנון הציבורי והמאומת שלי.**

Localized disclosure must be semantically equivalent in supported languages.

### First-person rule

Digital Igor **may speak in first person** when the statement is grounded in the canonical public corpus, for example:

- verified/supported public biography;
- documented public-service chronology;
- public creative work;
- StartOn and 7YA work;
- authored/publicly documented ideas and research;
- published public positions when an appropriate source is retrieved.

This first-person capability is an interface/narrative device. The system must still make clear that it is an AI representation and **must never claim to be the live human**.

Digital Igor must not:

- invent private memories;
- say “I remember” unless the underlying memory is explicitly documented in an authored/public canonical source and the source basis is clear;
- expose private Drive/Gmail/vault content to public users;
- upgrade unresolved, contradicted or quarantined material into fact;
- turn modeled reach into verified reach;
- fabricate motives of third parties;
- imply that automated text was manually spoken/written by the live Igor.

For material Igor claims, retrieve from canon/evidence before answering. Preserve provenance metadata separately from prose.

Preferred visitor goals:

- **EXPLORE** — tell/show the story;
- **VERIFY** — show sources and evidence state;
- **BUILD** — convert insight into an executable path;
- **CONNECT** — route media, StartOn, speaking, collaboration or contact intent.

Digital Igor should also be able to control safe site navigation (`focus_event`, `focus_chapter`, `open_source`, `open_media`, `filter_year`, `open_evidence`) rather than remaining a detached text box.

## 6. Evidence and language rules

The canonical corpus verification states remain authoritative. Public wording must be proportionate to evidence.

Core rules:

- Membership is not partnership.
- A link proves the linked content exists; it does not automatically prove reach, impact, authority or causation.
- Do not publish aggregate reach, audience, partnership, title, funding or outcome claims without a dated source and publication permission.
- Owner-reported metrics remain attributed and dated.
- Modeled/historical scales remain modeled unless upgraded by adequate evidence.
- Do not upgrade wording merely because a logo, email or membership record exists.
- Corrections are append-only provenance, not silent deletion.
- `unresolved`, `contradicted` and `quarantined` records cannot be presented as settled public facts.
- 7YA cannot use itself as the sole proof of an external claim.

## 7. Privacy and safety boundaries

Never publish without explicit, item-specific authorization/publication basis:

- identifying information about minors;
- private family details;
- medical, legal or financial information;
- addresses, private phone numbers or raw personal email threads;
- security methods, sources, operational details or protected case information;
- credentials, tokens, API keys, account codes or transfer codes;
- private official documents used only to verify a safe public conclusion.

Use aggregation, redaction and privacy-by-default. The Drive vault is evidence/control input, not a public dump.

## 8. Visual source contract

The binding visual direction is restraint and documentary authenticity.

Core rule:

> **Restraint beats decoration. Consistency beats creativity. Clarity beats noise.**

Locked baseline from the current Visual Source authority recorded in the execution packet:

- Black: `#0B0B0B`
- Off-white: `#F2F2EE`
- Grey: `#8A8A8A`
- Single accent: `#FF5A1F` Hazard Orange, used for metadata/status/separators/active state rather than decorative flooding
- Headings/UI: Inter or IBM Plex Sans
- Metadata/IDs: IBM Plex Mono
- No emoji in core UI, headings, buttons, logo or favicon
- Motion is restrained: fade / slide / reveal
- No fake publication logos
- No AI/stock image presented as a personal memory
- When an approved photo is unavailable, prefer a restrained written-memory card with metadata/source state

Target composition is media-first; approximate 70% authentic media / 20% editorial story / 10% interface is guidance, not a literal arithmetic test.

## 9. Architecture and modularity

Do not create another truth model.

Preferred layers:

1. **Canon Plane** — `shared/canonical-corpus.ts`, canonical entities, validated overlays, evidence/public-register merge.
2. **Story Plane** — visitor biography/story projections derived from canon.
3. **Igor AI Plane** — canon-first retrieval + first-person policy + provenance + safe UI actions.
4. **Control Plane** — ingestion, discovery, OAuth readiness, gaps, publication gates, admin/diagnostics.
5. **QA Plane** — executable tests, current-version visual inspection and regression gates.

Provider configuration remains isolated from content. Preserve rollback paths. Do not add a second production source without an explicit cutover and rollback plan.

Hard-coded factual dates, roles and metrics inside components should be replaced with typed canonical projections when canon already owns the fact.

## 10. Required validation

The acceptance source is `config/7ya-acceptance.v1.json` or a newer reviewed version.

A release is not complete until fresh evidence exists for all required gates, including:

- source alignment;
- unit tests;
- production build;
- desktop E2E;
- mobile E2E;
- current-version visual QA;
- evidence/publication gate;
- control-plane leakage check;
- media diversity check;
- regression check.

`tests/tests.txt` may document scenarios but does not count as executable evidence.

Never claim a local/CI PASS when the command or job did not run.

For every critical public route require at minimum:

- HTTP 200 where intended;
- crawlable metadata;
- title and description;
- canonical URL;
- mobile viewport;
- no accidental `noindex`;
- working internal links;
- no unsupported claims;
- usable mobile and desktop rendering.

For AppDeploy production additionally require:

- terminal deployment status `ready`;
- no frontend/backend/network errors;
- active intended custom domains;
- current candidate screenshots, not a hard-coded historical screenshot;
- immutable release receipt and rollback version;
- explicit mapping of the deployed AppDeploy version to the reviewed Git commit after source reconciliation.

## 11. Deployment discipline

1. Work on a focused branch.
2. Make the smallest coherent change.
3. Reconcile source before broad redesign when provider source is ahead of Git.
4. Write a failing executable test before production-code behavior changes.
5. Update deterministic gates with the behavior change.
6. Open a PR with scope, evidence, privacy and rollback notes.
7. Obtain a real candidate/preview verification before production promotion.
8. Tie build marker, provider version, domains and Git commit together.
9. Production promotion is a separate explicit owner gate.
10. Do not claim production success until `7ya.io` itself is verified after deployment.
11. After any AppDeploy-first emergency change, export/reconcile the exact runtime source before beginning the next broad redesign.

## 12. Agent behavior toward the owner

Igor is the product owner, not the deployment operator and not the QA department.

Agents must:

- explain decisions in plain Hebrew;
- distinguish code completion from publication;
- distinguish a draft PR from a deployed release;
- identify the exact blocker and next safe action;
- use connected GitHub, AppDeploy, Drive and provider evidence instead of guessing;
- avoid asking Igor for information already available in connected sources;
- visually inspect the rendered result instead of requiring Igor to discover obvious UX defects;
- never say the site is updated until the public URL has been verified.

## 13. Forbidden regressions

Do not restore or introduce:

- a system/dashboard identity that replaces the human story;
- `Living Proof System` as the primary brand;
- `Public trust shell` as the user-facing identity;
- `Private strategic command room` on a public route;
- copied instructions from unrelated repositories/courses;
- repeated portrait walls;
- generic documentary imagery where approved real media exists;
- unsupported political, institutional, partnership or audience claims;
- production configuration silently pointing at obsolete source;
- a chatbot that deceptively claims to be the live human;
- a chatbot that is prevented from speaking in canon-grounded first person merely because older copy called it “not Igor.”

The objective is one coherent public system: **a real person, real life, real work, visible sources, a digital first-person interface with honest AI disclosure, and a clear invitation to explore, verify, build or connect.**
