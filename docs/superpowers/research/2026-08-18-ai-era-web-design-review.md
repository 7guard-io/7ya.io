# AI-Era Web Design Research Gate

**Date:** 2026-08-18
**Project:** 7YA Living Universe
**Purpose:** Pre-implementation academic and standards review of website design and engineering in the AI era.

## Executive conclusion

The strongest evidence does **not** support turning a modern website into an AI-first conversational interface, generating large volumes of AI copy, or relying on speculative GEO/AEO hacks. It supports a human-first website with a machine-legible semantic layer, clear provenance, strong information architecture, accessible and performant interaction, explicit user control over AI behavior, canonical structured content, and harder engineering/QA gates around AI-assisted code.

For 7YA, the correct architectural target is therefore:

**Human-first narrative + canonical knowledge graph + semantic HTML/metadata + optional grounded AI companion + provenance + dual human/agent QA.**

AI is a subordinate capability layer. It does not replace navigation, authored narrative, source records, canonical URLs, or editorial judgment.

---

## 1. Human-AI interaction: AI must remain legible and controllable

### Evidence

Amershi et al., CHI 2019, synthesized a large body of Human-AI Interaction work into 18 guidelines and validated them across multiple rounds, including 49 practitioners evaluating 20 AI-infused products. The recurring design requirements are: make capabilities and limitations clear; provide contextually relevant assistance; support efficient invocation and dismissal; explain and correct behavior; and preserve meaningful user control.

Follow-up CHI research on the People + AI Guidebook found practitioners use such guidelines not only for UI details but to improve early problem formulation and avoid AI-product failures.

### 7YA implication

- Do not make a chat box the primary entry point.
- Any AI companion must state what corpus it can use and what it cannot know.
- AI answers must cite 7YA source objects where available.
- AI suggestions must be dismissible and reversible.
- The user must be able to navigate the complete site without AI.
- AI personalization must be opt-in or based on explicit visitor choices, not opaque psychological inference.

**Decision:** AI companion is optional and grounded; canonical navigation remains primary.

---

## 2. Visual cognition: cinematic does not mean visually dense

### Evidence

Tuch et al. (International Journal of Human-Computer Studies, 2012) experimentally varied visual complexity and prototypicality. Aesthetic judgments were affected within tens of milliseconds; lower visual complexity and higher prototypicality produced stronger first impressions. This does not require generic design. It means novelty should sit inside a recognizable interaction grammar.

Mobile attention research also supports treating the visible viewport as scarce attentional space rather than assuming every visible component receives equal attention.

### 7YA implication

- One dominant narrative/media object per mobile viewport.
- The first viewport must be extremely low in visual complexity.
- Novel cinematic transitions must preserve familiar navigation, link and reading conventions.
- Evidence, metadata and analytical depth should use progressive disclosure rather than competing with the story.
- Dense archive and influence analytics belong deeper in the information architecture, not in the opening experience.

**Decision:** preserve the Living Universe ambition while reducing simultaneous visual claims.

---

## 3. Information architecture in an agentic web: semantic structure is now a dual audience requirement

### Evidence

Mind2Web (2023), WebArena (2023), BrowserGym (2024) and subsequent web-agent work show that real websites remain difficult for autonomous agents. Raw HTML can be too large; long-horizon interactions remain error-prone; filtering and structured representations improve efficiency. Current work increasingly relies on semantic page segmentation and selective attention.

These results do not establish a single new web standard for agents. They do justify a conservative inference: web content that is semantically structured, hierarchically bounded and textually explicit is easier for both assistive technology and machine agents to interpret than a visually impressive but opaque interaction surface.

### 7YA implication

- Every important visual story object must also have a semantic DOM representation.
- Use real headings, landmarks, lists, buttons and links; do not encode meaning only in animation/canvas.
- Keep stable, human-readable routes for major life chapters, research objects, media objects and Knowledge Lenses.
- Provide concise summaries and explicit relationships between objects.
- Avoid enormous monolithic DOM sections when a page/object boundary is semantically justified.

**Decision:** build for human and machine interpretability from the same canonical source, not separate duplicate sites.

---

## 4. AI search / GEO: prioritize canonical value, not hacks

### Evidence

The foundational GEO work showed that wording and source presentation can alter visibility inside controlled generative-engine settings. However, a July 2026 critical survey of 45 studies found heterogeneous terminology and metrics and no reviewed technique demonstrating a stable, longitudinal, cross-platform causal increase in organic discoverability or downstream behavior.

Google's current guidance for AI Overviews and AI Mode explicitly says there are no special AI-specific technical requirements or special schema needed beyond established Search fundamentals. Important content should remain crawlable, available in textual form, internally linked, useful, reliable and people-first. Google also warns that scaled AI-generated pages without added user value can violate spam policies.

### 7YA implication

- Do not create AI filler pages.
- Do not depend on `llms.txt` or a proprietary GEO convention as a core architecture requirement.
- Make every public page valuable as a human destination first.
- Use canonical URLs, internal links, crawlable text, sitemap coverage and accurate structured data.
- Publish unique primary material: first-person narrative, source-backed chronology, original media, primary documents, original frameworks clearly labeled, interviews and verified influence trails.
- Measure AI/search visibility empirically over time rather than claiming optimization success from markup alone.

**Decision:** adopt **canonical knowledge publishing**, not speculative GEO optimization.

---

## 5. Structured data: describe reality accurately

### Evidence

Google Search Central recommends structured data as explicit machine-readable clues about page meaning and generally recommends JSON-LD for maintainability. Google stresses that structured data must represent visible page content accurately; more markup is not inherently better than fewer complete and correct objects.

### 7YA implication

Use schema only where semantically true, including appropriate combinations of:

- `Person`
- `ProfilePage`
- `Article`
- `CreativeWork`
- `VideoObject`
- `PodcastEpisode` where actually applicable
- `Dataset` where a genuine dataset exists
- breadcrumbs and organization/project entities when accurately described

Add `sameAs`, authorship, dates and relationships only when verified. Never use schema to inflate academic, organizational, political or institutional status.

**Decision:** structured-data generation becomes part of the canonical content model and QA suite.

---

## 6. Accessibility is architecture, not polish

### Evidence

WCAG 2.2 is the current W3C Recommendation. Its model covers perceivability, operability, understandability and robustness, including meaningful sequence, text alternatives, captions, consistent navigation, accessible targets, predictable interactions, error support and programmatically exposed name/role/value.

### 7YA implication

- Target WCAG 2.2 AA for public experiences.
- Preserve keyboard navigation and visible focus through all cinematic transitions.
- Videos require captions/transcript pathways when published as meaningful content.
- Images require contextual alternative text; decorative imagery must be distinguished from evidence imagery.
- Language changes across Hebrew/Russian/English must be programmatically identified.
- Motion must honor `prefers-reduced-motion`.
- Mobile tap targets, focus order and reading sequence are acceptance criteria, not post-launch fixes.

**Decision:** accessibility gate blocks release.

---

## 7. Performance: interaction quality must survive the visual ambition

### Evidence

Current Core Web Vitals center on LCP, INP and CLS and are evaluated at the 75th percentile, separately across device classes. Recommended good thresholds are LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.

### 7YA implication

- Do not preload the entire visual archive.
- Responsive images and deliberate media loading are required.
- Hero media gets priority; deep content is lazy/deferred.
- Avoid animation architectures that block the main thread or create layout shifts.
- Measure field behavior when sufficient traffic exists; retain lab QA for every release.

**Decision:** Core Web Vitals budgets become release constraints.

---

## 8. Provenance and trust: a first-class feature for an evidence-heavy personal site

### Evidence

C2PA Content Credentials provide a standardized, cryptographically verifiable provenance model for media. The current C2PA specification emphasizes provenance, tamper evidence, privacy, interoperability and user control, while explicitly distinguishing provenance validation from a judgment that content is true or good.

### 7YA implication

7YA should maintain two related but distinct layers:

1. **Editorial provenance:** source URL/file, capture date, publication date, owner, evidence status, transformation history, verification status.
2. **Cryptographic provenance where feasible:** preserve or expose Content Credentials for supported media rather than stripping them.

AI-generated/contextual visuals must never be presented as documentary evidence. Real media, reconstructed context and generative illustration require visibly different provenance states.

**Decision:** provenance is part of the content object, not an archive footnote.

---

## 9. Privacy-aware personalization

### Evidence

W3C Privacy Principles recommend privacy consideration early in design and data minimization: collect/transfer only what is necessary for users' goals or aligns with their wishes and interests.

### 7YA implication

- The proposed visitor pathway (`What met you here?`) should work initially with explicit local/session choices.
- Do not infer sensitive traits from browsing behavior merely to personalize the story.
- Do not require an account to experience the core site.
- Separate product analytics from identity/profiling.
- Avoid collecting data simply because AI could use it later.

**Decision:** personalization starts explicit and low-data; deeper persistence requires a separate privacy review.

---

## 10. Security: AI increases the need for conventional engineering discipline

### Evidence

OWASP Top 10:2025 places broken access control, security misconfiguration and software-supply-chain failures among the leading web application risks. Empirical studies of LLM coding also show that models can fail to detect insecure context and can generate code with exploitable weaknesses.

### 7YA implication

- No AI-generated code is trusted because it compiles.
- Every change must pass tests and review before production.
- Avoid unnecessary client secrets and new dependencies.
- Treat external embeds, user content and future AI/tool integrations as untrusted boundaries.
- Preserve dependency and build reproducibility.

**Decision:** security review and dependency minimization are mandatory in every AI-assisted implementation slice.

---

## 11. AI-assisted engineering: optimize validated throughput, not generated lines

### Evidence

Research on AI coding productivity is context-dependent. A 2025 randomized controlled trial by METR found experienced developers working in mature, familiar repositories took longer with the studied early-2025 AI tools, despite believing they were faster. METR has since cautioned that later experiments face selection effects and that productivity effects are evolving. Separate empirical security research consistently shows a need for independent validation of generated code.

### 7YA implication

The implementation process must follow:

**inspect existing code -> write explicit acceptance test -> make smallest change -> run tests -> visual QA -> accessibility/performance/security check -> commit -> deploy only after evidence.**

The objective is not maximum AI autonomy. It is minimum regression per useful change.

**Decision:** TDD/acceptance-gated, incremental implementation; no AI big-bang rewrite.

---

## 12. Evaluation model for 7YA

A modern site should be evaluated against four audiences simultaneously:

### Human visitor
Can a new visitor understand who Igor is, why the story matters and what to do next without instruction?

### Returning visitor
Can they reach current work, specific media or a known chapter immediately?

### Assistive-technology user
Is the same meaning, structure and control exposed through standards-compliant interaction?

### Machine/agent/search system
Can the system identify stable objects, titles, dates, authorship, provenance, relationships and canonical destinations without reverse-engineering animation or a huge undifferentiated DOM?

A release that works for only one of these audiences is incomplete.

---

## Changes required to the approved Living Universe design

The Living Universe direction remains approved. This research adds the following hard constraints:

1. **AI companion is optional, grounded and source-citing; never the primary navigation.**
2. **No speculative GEO layer.** Canonical, crawlable, original content is the discoverability strategy.
3. **Semantic object model precedes additional visual effects.** Each story/media/research/evidence object has machine-readable identity and relationships.
4. **One dominant object per mobile viewport** is the default composition rule.
5. **Progressive disclosure** protects narrative attention from evidence/analytics density.
6. **WCAG 2.2 AA and Core Web Vitals budgets** are release gates.
7. **Explicit, data-minimal personalization first.** No sensitive behavioral profiling.
8. **Provenance state is visible and stored at object level.**
9. **Human + agent QA** becomes a formal test dimension.
10. **AI-assisted coding remains test-first and incremental.**

---

## What should NOT be built yet

- autonomous AI that rewrites the public site in production
- opaque behavioral personalization
- a chat-first homepage
- mass-generated SEO/GEO pages
- a second duplicate "AI version" of the site
- heavy 3D/canvas navigation that hides canonical content
- large new dependency stacks solely for visual novelty
- public claims generated from unverified corpus inference

These can be revisited only if evidence and a concrete user need justify them.

---

## Recommended implementation sequence

### Slice A — Semantic Living Universe foundation
Simplify first-visit composition, establish semantic page/object boundaries, canonical routes/metadata, mobile one-object rhythm, accessibility and performance budgets.

### Slice B — Provenance-aware story objects
Unify story, post, media, interview, public-echo and Knowledge Lens objects around provenance and explicit relationships.

### Slice C — Search/agent legibility
JSON-LD, sitemap/canonical coverage, internal relationship links and agent QA tasks.

### Slice D — Visitor growth pathway
Explicit low-data visitor choices and personalized continuation without opaque profiling.

### Slice E — Grounded AI companion
Only after the canonical object layer is stable; answers source-bound, explainable, dismissible and non-authoritative when evidence is incomplete.

---

## Key references and standards

- Amershi, S. et al. (2019). *Guidelines for Human-AI Interaction*. CHI. DOI: 10.1145/3290605.3300233.
- Tuch, A. N. et al. (2012). *The role of visual complexity and prototypicality regarding first impression of websites*. International Journal of Human-Computer Studies. DOI: 10.1016/j.ijhcs.2012.06.003.
- Deng, X. et al. (2023). *Mind2Web: Towards a Generalist Agent for the Web*. arXiv:2306.06070.
- Zhou, S. et al. (2023). *WebArena: A Realistic Web Environment for Building Autonomous Agents*. arXiv:2307.13854.
- Le Sellier De Chezelles, T. et al. (2024). *The BrowserGym Ecosystem for Web Agent Research*. arXiv:2412.05467.
- Aggarwal, P. et al. (2023/2024). *GEO: Generative Engine Optimization*. arXiv:2311.09735.
- Martinez, O. (2026). *Optimizing Visibility in Generative Engines: A Critical Survey of Generative Engine Optimization (2023-2026)*. arXiv:2607.14035.
- W3C. *Web Content Accessibility Guidelines (WCAG) 2.2*.
- W3C TAG. *Privacy Principles*.
- Google Search Central. *AI Features and Your Website*; *Introduction to Structured Data Markup*; *Guidance on Generative AI Content*.
- Google/web.dev. *Web Vitals*.
- C2PA. *Content Credentials / C2PA Technical Specification*, current specification family.
- OWASP. *OWASP Top 10:2025*.
- Becker, J. et al. (2025). *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*. arXiv:2507.09089.
- Sajadi, A. et al. (2025). *Do LLMs consider security? an empirical study on responses to programming questions*. Empirical Software Engineering. DOI: 10.1007/s10664-025-10658-6.
- Fu, Y. et al. (2025). *Security Weaknesses of Copilot-Generated Code in GitHub Projects: An Empirical Study*. ACM TOSEM / arXiv:2310.02059.

## Research-gate result

**PASS WITH DESIGN AMENDMENTS.**

The approved Living Universe concept is consistent with the literature **if** its cinematic layer sits on top of a low-complexity, accessible, semantically explicit, provenance-aware canonical web architecture. The research therefore strengthens the design direction but rejects AI-first navigation, opaque personalization, speculative GEO engineering and unverified autonomous publishing.
