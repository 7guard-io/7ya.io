# AI-Era Web Design Research Gate — 7YA Living Universe

**Date:** 2026-08-18  
**Status:** Research gate complete; normative input to implementation planning  
**Applies to:** `docs/superpowers/specs/2026-08-18-7ya-living-universe-design.md`  
**Baseline:** AppDeploy v100 / current `life-first` implementation

## Purpose

This document tests the approved 7YA Living Universe design against current academic HCI research, AI-agent/web research, web standards, search guidance, provenance standards, privacy/security guidance, and empirical research on AI-assisted software development.

The objective is not to add AI for its own sake. The objective is to identify what materially changes when a public, evidence-heavy, multilingual narrative website is designed, built, discovered, interpreted, and potentially operated by both humans and AI systems in 2026.

## Evidence hierarchy

### Tier A — normative / authoritative

These are implementation constraints unless a documented project-specific reason justifies deviation.

- W3C WCAG 2.2 Recommendation.
- W3C semantic HTML / landmark guidance and language metadata guidance.
- W3C Privacy Principles (2025).
- Google Search Central guidance for AI features, structured data, crawlability, people-first content and page experience.
- web.dev Core Web Vitals guidance.
- NIST AI RMF 1.0 and NIST AI 600-1 Generative AI Profile.
- OWASP Top 10 for LLM / Generative AI Applications (2025) for any public AI layer.
- C2PA Content Credentials specification 2.4 for provenance-capable media workflows.

### Tier B — peer-reviewed / foundational HCI

These constrain interaction design and evaluation but are not treated as standards.

- Amershi et al. (CHI 2019), *Guidelines for Human-AI Interaction* — 18 guidelines validated with 49 practitioners across 20 AI-infused products.
- Zimmerman et al. (CHI 2020), *Re-examining Whether, Why, and How Human-AI Interaction Is Uniquely Difficult to Design* — AI UX is unusually affected by uncertain capability and complex/adaptive output.
- Tuch et al. (IJHCS 2012), *The role of visual complexity and prototypicality regarding first impression of websites* — visual complexity and prototypicality influence aesthetic judgment extremely quickly; low visual complexity plus recognizable structure performed best in their experiments.
- Human-centered adaptive-interface literature cited by the Amershi/HAX corpus: preserve intelligibility, user control, predictability and correction paths.

### Tier C — emerging AI-era web research

These are directional signals, not universal optimization laws.

- WebArena (2023): realistic web tasks remain difficult for autonomous agents; reported best GPT-4 baseline 14.41% end-to-end success vs. 78.24% human success.
- Mind2Web (NeurIPS 2023): 2,350 tasks across 137 websites / 31 domains; real-world raw HTML is large and noisy, and relevant-element filtering materially helps agents.
- WebCanvas (2024): dynamic live-web benchmark; reported best agent 23.1% task success and 48.8% completion.
- Aggarwal et al., GEO (KDD 2024): experimentally reports visibility gains up to 40% for some generative-engine optimization interventions, but effects vary by domain.

Google's current official guidance explicitly states that AI Overviews / AI Mode do **not** require special AI-specific markup or a separate GEO layer. Therefore GEO is treated as emerging research only; 7YA will prioritize unique, source-backed, crawlable, well-structured content rather than speculative AI-search hacks.

### Tier D — AI-assisted software engineering evidence

AI coding is useful but not assumed to be automatically faster or safer.

- Peng et al. (2023) controlled task study found a 55.8% speedup for a bounded JavaScript HTTP-server task with GitHub Copilot.
- METR (2025) randomized controlled trial on experienced open-source developers working in mature familiar repositories found AI use increased completion time by 19% in that setting.
- METR's February 2026 follow-up states its newer productivity experiment has selection-bias problems and does not provide a reliable current aggregate speedup estimate.

Conclusion: AI is an implementation accelerator only when paired with deterministic tests, bounded tasks, repository context, review and measured outcomes. Self-reported speed is not an acceptable quality metric.

## Research conclusions for 7YA

### 1. Human-first, AI-optional

The main website must remain understandable and complete without an AI assistant. AI cannot replace global navigation, chronology, source access or the public archive.

If an `Ask 7YA` / companion feature is added later, it must:

- state what it can and cannot do;
- expose uncertainty and citations;
- be easy to invoke, dismiss, correct and reset;
- never impersonate documentary evidence or claim to be Igor;
- never silently rewrite the visitor's information architecture;
- fail safely to ordinary navigation/search.

This is a direct application of human-AI interaction guidance around capability communication, correction, uncertainty, user control and graceful failure.

### 2. Personalization may highlight, not secretly reorder reality

The approved visitor-theme personalization remains valid, but its first release should be explicit, reversible and privacy-minimal.

Default implementation:

- user manually selects interests;
- selections are stored locally in the browser unless the user opts into persistence across devices;
- primary room/navigation order remains stable;
- personalization may highlight or recommend paths but must not hide canonical content;
- a visible reset / `show everything` control is required;
- no inferred political, psychological, health, family or other sensitive profile is created.

### 3. Progressive disclosure becomes a hard information-architecture rule

7YA contains unusually deep material. Depth should remain available without competing for first-screen attention.

Required pattern:

- canonical narrative first;
- one dominant object or task at a time on mobile;
- contextual expanders for evidence, echo, research and archive depth;
- stable room navigation for lateral movement;
- search/archive for exhaustive retrieval;
- no giant dashboard as the first experience.

The goal is not minimal content. It is low simultaneous visual/cognitive competition with deep access on demand.

### 4. Semantic HTML is part of the AI architecture

The public site must be machine-readable because semantic structure simultaneously benefits accessibility, search systems and web agents.

Required:

- one meaningful `main` landmark per page;
- native `header`, `nav`, `main`, `article`, `section`, `aside`, `footer`, `form`, buttons and links where semantically correct;
- logical heading hierarchy;
- descriptive link/button text;
- explicit labels on interactive controls;
- important content must exist as text/HTML, not only pixels, canvas or animation;
- stable human-readable URLs for canonical objects;
- crawlable internal links;
- content cannot be discoverable only through infinite scroll or JS-only gestures.

### 5. Multilingual semantics are first-class

Hebrew, Russian and English are not cosmetic translations.

Required:

- correct page `lang` values;
- correct `dir` behavior, including mixed-direction inline content;
- equivalent claim strength across languages;
- source titles may remain in original language with localized explanation;
- language variants must have stable canonical/localized relationships;
- accessibility labels and structured metadata must be localized as well.

### 6. AI-search readiness is evidence architecture, not GEO spam

7YA should be highly quotable and interpretable by search / generative systems without manufacturing FAQ spam or machine-targeted filler.

Every major canonical page should expose:

- a concise human-readable summary;
- explicit author / subject / date / updated date where relevant;
- source-backed claims;
- visible evidence state when a claim is verified, inferred, disputed or unknown;
- canonical URL;
- crawlable internal relationships;
- accurate JSON-LD using the narrowest truthful Schema.org type;
- image/video metadata where documentary media is central.

Structured data must match visible page content. Fewer complete and accurate properties are preferable to inflated markup.

### 7. Provenance is a product feature

7YA's existing evidence model should become visually and technically explicit.

Each documentary object should preserve, where known:

- original source URL / platform;
- publication or capture date;
- local archive identifier;
- transformation state;
- evidence state;
- relationship to derivative copies/reposts;
- whether media is documentary, edited, generated or illustrative.

C2PA 2.4 / Content Credentials should be used where technically feasible for newly created or transformed public media, but must not be presented as a truth oracle. C2PA validates provenance assertions and tamper evidence; it does not determine whether a claim is substantively true.

### 8. Cinematic design has a performance budget

The Living Universe may be visually rich but cannot become a video-heavy loading experience.

Production targets at the 75th percentile, measured separately on mobile and desktop:

- LCP <= 2.5 s
- INP <= 200 ms
- CLS <= 0.1

Implementation implications:

- responsive images (`srcset`/sizes or equivalent);
- width/height or aspect-ratio reservation for media;
- optimized poster images before video;
- below-fold media lazy loaded;
- no mandatory autoplay heavy video as the only hero path;
- route/section code split where it materially reduces initial JavaScript;
- motion must degrade cleanly under `prefers-reduced-motion`.

### 9. WCAG 2.2 AA is a release gate

The target is WCAG 2.2 AA, not an after-the-fact accessibility patch.

Minimum release coverage includes:

- keyboard-complete navigation;
- visible, unobscured focus;
- minimum target sizing consistent with WCAG 2.2 AA;
- semantic headings/landmarks;
- sufficient contrast;
- meaningful alt text for documentary images;
- captions/transcripts for meaningful audiovisual material where available/required;
- non-motion equivalents for cinematic interactions;
- no information encoded only by color;
- accessible language and direction metadata;
- no horizontal overflow at supported mobile widths.

### 10. Privacy-minimal analytics and personalization

W3C Privacy Principles and NIST Privacy Framework support data minimization as a design-time constraint.

7YA should collect only what is necessary for the user's goal and site improvement.

Default rules:

- local-first interest personalization;
- no sensitive inference from reading behavior;
- no hidden identity stitching across contexts;
- analytics events are purpose-limited and documented;
- no collection merely because it may become useful later;
- visitor-growth mechanics must work without a personal account in the first release.

### 11. Web-agent friendliness is semantic robustness, not agent-specific hacks

Web-agent benchmarks show current agents remain brittle. Therefore 7YA should not optimize for a particular agent implementation.

Instead it should expose robust affordances that help humans, assistive technology, crawlers and agents together:

- stable routes;
- native controls;
- deterministic labels;
- visible text alternatives;
- explicit form labels;
- predictable navigation;
- no essential interaction based only on hover, drag, canvas coordinates or visual guessing;
- canonical archive/search access independent of cinematic presentation.

### 12. Any future public LLM layer receives its own security gate

Do **not** ship a write-capable or private-corpus-connected assistant as part of the initial Living Universe redesign.

If an AI assistant is later implemented, required controls include:

- public-corpus-only retrieval by default;
- citation/provenance requirements;
- separation of retrieved data from executable instructions;
- prompt-injection testing;
- output escaping/sanitization;
- no secrets/private Drive/Gmail/private family corpus exposure;
- least-privilege tools;
- explicit confirmation before any consequential action;
- rate/cost abuse controls;
- logging sufficient for debugging without storing unnecessary private content.

This follows NIST GenAI risk-management principles and OWASP's current LLM risks, including prompt injection, sensitive-information disclosure and excessive agency.

### 13. AI-assisted development requires evidence, not confidence

Implementation work may use AI heavily, but every change must pass machine-checkable and visual gates.

Required workflow:

1. small bounded task;
2. failing test or measurable acceptance check;
3. minimal implementation;
4. type/lint/unit check where available;
5. E2E / accessibility / visual / performance verification appropriate to the task;
6. human-readable diff review;
7. commit only after evidence passes.

No release claim may rely on the model's statement that the page 'looks correct'.

### 14. Evaluation changes from 'does it look good?' to task evidence

The redesign must be evaluated against explicit human tasks and technical outcomes.

Core task set:

- understand who Igor is and why the site exists from the first viewport;
- begin the chronology without instruction;
- find a specific life chapter;
- distinguish a personal statement from an independently sourced fact;
- open the provenance/evidence for a public claim;
- follow a post from origin to public echo;
- reach StartOn from the life story without losing context;
- open a Knowledge Lens and return to the story;
- switch HE / RU / EN without semantic or layout breakage;
- complete primary navigation by keyboard;
- complete primary navigation on a narrow mobile viewport without horizontal overflow;
- expose canonical content to a crawler/agent without requiring visual-only interaction.

## What this research changes in the approved design

The approved Living Universe concept remains valid. The research adds six implementation constraints that are now mandatory:

1. **Stable canonical navigation beneath personalization.** Personalization highlights; it does not reorder/hide the public truth layer.
2. **Semantic/crawlable twin of every cinematic experience.** No documentary or knowledge content may exist only as an animation, carousel gesture or visual composition.
3. **WCAG 2.2 AA + Core Web Vitals budgets are release gates.**
4. **Provenance metadata becomes part of the content model.** Documentary/generated/edited states must be explicit.
5. **No public AI chatbot in the first redesign slice.** First make the corpus structured, trustworthy and agent-readable; add conversational AI only behind a separate security/evaluation gate.
6. **AI-search optimization stays people-first.** Unique, canonical, source-rich content and accurate structured data are prioritized over speculative GEO tactics.

## What is deliberately deferred

- autonomous site personalization;
- AI-generated dynamic page composition;
- write-capable site agents;
- private-archive / Gmail / Drive-connected public assistant;
- behavioral or psychological profiling;
- AI-generated historical visuals presented without explicit labeling;
- GEO-specific content duplication or machine-only pages;
- mandatory accounts or cross-device identity for visitor growth.

## Release-gate matrix

| Gate | Pass condition |
|---|---|
| Human comprehension | First viewport establishes person, purpose and one obvious next action without counters/dashboard overload |
| Narrative depth | Canonical chronology remains readable without opening secondary modules |
| Semantic web | Meaningful landmarks/headings/native controls; critical content present as HTML/text |
| Accessibility | WCAG 2.2 AA target checks pass for implemented scope |
| Performance | p75 LCP <=2.5s, INP <=200ms, CLS <=0.1 on mobile and desktop target measurements |
| Multilingual | HE/RU/EN preserve meaning, direction, metadata and navigation |
| Provenance | Documentary objects expose source/evidence/transformation state where known |
| Search/AI discovery | Crawlable canonical routes, internal links, truthful JSON-LD, visible text parity |
| Privacy | Personalization local-first; no sensitive inference; analytics purpose-limited |
| AI security | No public privileged AI layer in initial slice; future AI requires separate OWASP/NIST gate |
| Engineering | Automated tests + E2E/visual checks relevant to changed behavior; no unverified AI-generated code shipped |

## Source set

### Standards / official guidance

- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*, Recommendation, 12 Dec 2024.
- W3C WAI, semantic HTML landmarks and language-of-page techniques.
- W3C TAG, *Privacy Principles*, Statement, 15 May 2025.
- Google Search Central, *AI Features and Your Website*, current guidance.
- Google Search Central, structured-data and Search Essentials guidance.
- web.dev, *Core Web Vitals*.
- NIST AI 100-1, *AI Risk Management Framework 1.0*.
- NIST AI 600-1, *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*.
- OWASP GenAI Security Project, *Top 10 for LLM Applications 2025*.
- C2PA, *Content Credentials / C2PA Technical Specification 2.4*, April 2026.

### Research

- Amershi, S. et al. (2019). *Guidelines for Human-AI Interaction*. CHI 2019.
- Zimmerman, J. et al. (2020). *Re-examining Whether, Why, and How Human-AI Interaction Is Uniquely Difficult to Design*. CHI 2020.
- Tuch, A. N. et al. (2012). *The role of visual complexity and prototypicality regarding first impression of websites*. International Journal of Human-Computer Studies 70(11), 794–811. DOI: 10.1016/j.ijhcs.2012.06.003.
- Deng, X. et al. (2023). *Mind2Web: Towards a Generalist Agent for the Web*. NeurIPS 2023.
- Zhou, S. et al. (2023). *WebArena: A Realistic Web Environment for Building Autonomous Agents*. arXiv:2307.13854.
- Pan, Y. et al. (2024). *WebCanvas: Benchmarking Web Agents in Online Environments*. arXiv:2406.12373.
- Aggarwal, P. et al. (2024). *GEO: Generative Engine Optimization*. KDD 2024. DOI: 10.1145/3637528.3671900.
- Peng, S. et al. (2023). *The Impact of AI on Developer Productivity: Evidence from GitHub Copilot*. arXiv:2302.06590.
- Becker, J. et al. (2025). *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*. arXiv:2507.09089; METR 2026 follow-up on experimental-design limitations.

## Research retrieval limitation

A connected academic corpus repeatedly returned only a bibliographic reference, not the relevant findings, for Van Ham & Perer (2009), *Search, show context, expand on demand*. After three increasingly specific retrieval attempts, relevance remained below the tool's own threshold. No design conclusion in this gate relies on that paper. This is intentionally recorded to avoid citation laundering or inferred findings.

## Gate decision

**PASS WITH CONSTRAINTS.**

The 7YA Living Universe design is academically and technically defensible for 2026 provided the implementation plan incorporates the mandatory constraints above. The research does **not** justify replacing the human website with a chatbot, adaptive feed, autonomous UI or GEO-specific content farm. It does justify making 7YA more semantic, provenance-rich, accessible, fast, privacy-minimal, agent-readable, testable and explicit about the boundary between documentary truth, interpretation and generated assistance.
