# 7YA AI-Era Web Research Gate

**Date:** 2026-08-18
**Status:** Normative research gate for implementation
**Applies to:** `docs/superpowers/specs/2026-08-18-7ya-living-universe-design.md`
**Baseline:** AppDeploy v100

## Purpose

This document records the research gate requested before implementation of the 7YA Living Universe. It is a broad, targeted evidence review across human-computer interaction, human-AI interaction, web accessibility, web performance, agentic web interaction, search and generative-search discoverability, structured data, provenance, privacy, personalization, multilingual design, and product evaluation.

It is **not a formal systematic review or meta-analysis**. The method prioritizes standards bodies, primary research, official platform documentation and high-quality peer-reviewed or benchmark literature. Emerging claims are separated from established standards.

## Executive conclusion

The approved Living Universe direction survives the research gate. The strongest evidence does **not** support turning 7YA into an AI-first chat surface, a generative dashboard, or a collection of GEO tricks. The stronger design is a human-first, semantically structured, provenance-aware, accessible and fast website whose content remains intelligible to people, search engines and software agents, with AI added only where it improves a defined user task.

The practical rule is:

> **Human narrative first. Semantic structure underneath. Evidence attached. AI optional. User control preserved.**

## Evidence classes

- **STANDARD** — normative or broadly adopted web/technical standard or official platform requirement.
- **SUPPORTED** — supported by replicated, peer-reviewed or well-established HCI evidence.
- **EMERGING** — recent research with useful implications but insufficient stability for a hard product dependency.
- **EXPERIMENTAL** — may be tested, but must not become a production assumption without measurement.

---

## 1. Human-AI interaction: AI must expose capability, limits and control

**Evidence class:** SUPPORTED

Amershi et al., *Guidelines for Human-AI Interaction* (CHI 2019, DOI 10.1145/3290605.3300233), distilled more than 150 prior recommendations into 18 guidelines and validated them through multiple rounds, including 49 practitioners evaluating 20 AI-infused products. The framework emphasizes setting expectations, timing AI appropriately, preserving context, supporting invocation and dismissal, handling errors, enabling correction, explaining relevant behavior and adapting without taking control away from the user.

### 7YA requirement

- No AI assistant in the first viewport.
- Any future AI Companion must state what it can do, what corpus it uses, and where uncertainty remains.
- Every generative answer that makes factual claims about Igor, StartOn, research or public impact must retain source provenance.
- Users must be able to dismiss, reset or bypass AI and navigate the same public knowledge through conventional links.
- AI should assist a defined task — finding, understanding, comparing, learning or acting — rather than exist as decoration.

### Rejected pattern

A floating chatbot that becomes the main navigation or invents personalized interpretations of the visitor without explicit consent.

---

## 2. The first impression must be simple even when the corpus is deep

**Evidence class:** SUPPORTED

Tuch et al. (2012), *The role of visual complexity and prototypicality regarding first impression of websites*, found experimentally that visual complexity and prototypicality affect aesthetic judgments extremely quickly; low visual complexity and high prototypicality performed strongly. This does not imply generic design. It implies that novelty should sit inside a legible hierarchy.

### 7YA requirement

- The opening viewport contains one dominant real-life visual, name, one concise human statement and no more than three primary choices.
- The visitor should never encounter multiple equally dominant cards, metrics, carousels and calls-to-action at once.
- Cinematic composition is encouraged, but interaction conventions remain recognizable.
- Complexity is progressively disclosed as the visitor enters a chapter, room or archive.

### Rejected pattern

Using the homepage as a simultaneous dashboard for biography, research, politics, social metrics, music, StartOn and archives.

---

## 3. Semantic HTML becomes strategic infrastructure in an agentic web

**Evidence class:** STANDARD + EMERGING

W3C accessibility guidance already favors native semantic HTML. Web-agent benchmarks add another reason: agents struggle with large, noisy real-world pages. Mind2Web (Deng et al., 2023) showed that raw HTML from real websites is often too large for direct LLM use and that filtering improves effectiveness and efficiency. WebArena (Zhou et al., 2023) demonstrated a large gap between human and agent task completion in realistic web environments. These results argue against assuming that an AI agent can reliably infer meaning from arbitrary visual complexity.

### 7YA requirement

- Use actual `main`, `nav`, `article`, `section`, `figure`, `time`, headings, lists, links and buttons for their semantic purposes.
- Every major narrative chapter, knowledge lens, media object and public-action object gets a stable machine-readable identifier and human-readable label.
- Prefer real URLs for durable knowledge objects and major chapters where the deployment architecture allows it; otherwise maintain stable route semantics and anchors.
- Keep important content as crawlable/selectable text rather than only canvas, image or animation.
- Navigation labels must remain stable across breakpoints and languages.

### Rejected pattern

Building a visually impressive DOM composed mostly of generic `div` elements with click handlers and ambiguous text labels.

---

## 4. Accessibility is a release gate, not a cleanup task

**Evidence class:** STANDARD

WCAG 2.2 is the W3C Recommendation and adds criteria particularly relevant to mobile and interaction design, including focus not obscured, target size, dragging alternatives, consistent help and accessible authentication. W3C ARIA guidance warns that incorrect ARIA can be worse than no ARIA, and native HTML should be preferred when it already supplies the required semantics and keyboard behavior.

### 7YA requirement

Target **WCAG 2.2 Level AA** for the public experience.

- Full keyboard operation.
- Visible focus not obscured by sticky navigation or overlays.
- Sufficient target sizes and non-drag alternatives.
- Correct landmark and heading hierarchy.
- Native controls before custom ARIA widgets.
- Alt text based on communicative purpose, not filename.
- Captions/transcripts for meaningful spoken media when publication rights and source material allow.
- `prefers-reduced-motion` respected for cinematic motion.
- Contrast and text resizing verified on all three languages.

---

## 5. Performance is part of storytelling quality

**Evidence class:** STANDARD / PLATFORM BEST PRACTICE

Current Core Web Vitals use LCP, INP and CLS as the primary user-centric field metrics. The recommended thresholds are LCP <= 2.5 s, INP <= 200 ms and CLS <= 0.1 at the 75th percentile, evaluated separately for mobile and desktop.

### 7YA requirement

These become performance budgets for release, not aspirational targets.

- Size media explicitly to prevent layout shift.
- Do not preload the entire life archive.
- Load the first dominant visual deliberately; defer below-the-fold heavy media.
- Lazy-load deep videos, post screenshots and archival images.
- Avoid shipping JavaScript for rooms or interactions the visitor has not entered.
- Measure both lab proxies and real-user/field performance after production traffic is available.

### Rejected pattern

A cinematic homepage that achieves visual richness by loading dozens of full-resolution images and embeds before the visitor asks for them.

---

## 6. AI-search discoverability still starts with ordinary web quality

**Evidence class:** STANDARD / PLATFORM GUIDANCE

Google's current guidance for AI Overviews and AI Mode says existing Search fundamentals remain relevant and that no special AI markup, AI text file or dedicated schema is required for inclusion. It emphasizes crawlability, internal links, page experience, textual availability of important content, quality media and structured data that matches visible content.

### 7YA requirement

- Maintain crawlable canonical pages and internal links.
- Important claims and descriptions must exist in visible text.
- Use high-quality original media with contextual captions.
- Use conventional sitemaps, canonical metadata and language relationships.
- Do **not** make `llms.txt` or a proprietary AI-discovery file a blocker for launch. It may be tested later as an experiment if there is a measurable reason.

---

## 7. Structured data should describe reality, not inflate identity

**Evidence class:** STANDARD / PLATFORM GUIDANCE

Google recommends accurate structured data and generally recommends JSON-LD as the easiest format to maintain. Structured data must represent visible page content; more properties are not better when they are incomplete or misleading.

### 7YA requirement

Use a small accurate graph, generated from the same canonical data used by the UI, for objects where semantics are defensible. Candidate types include:

- `Person` / `ProfilePage`
- `Article`
- `VideoObject`
- `PodcastEpisode` where source data supports it
- `MusicRecording` / `MusicGroup` relationships only when accurate
- `Dataset` for genuinely published datasets
- `ScholarlyArticle` only for actual scholarly works
- `BreadcrumbList`
- `Organization` for StartOn only with verified relationship claims

No schema may create an affiliation, title, academic status, award, metric or institutional endorsement that the visible evidence does not establish.

---

## 8. GEO is a measurement problem, not a bag of hacks

**Evidence class:** EMERGING

The foundational GEO paper (Aggarwal et al., 2023/2024) introduced Generative Engine Optimization and reported visibility improvements in its experimental setting. A 2026 critical survey of 45 studies argues that the literature remains heterogeneous and that the original gains do not establish durable organic discoverability or downstream behavior. The survey finds topical relevance and context position among the more reproducible levers but no reviewed technique with stable, longitudinal, cross-platform causal effects on organic discoverability.

### 7YA requirement

- No keyword-stuffing for answer engines.
- No citation-bait phrasing that weakens human reading.
- Create strong topical pages because they are useful and source-backed, not because an unvalidated GEO checklist says so.
- Track actual referral/search behavior and citations where observable.
- Treat generative-engine visibility tests as repeated experiments, not permanent ranking facts.

---

## 9. Provenance is especially important for a life archive in the synthetic-media era

**Evidence class:** STANDARD + EMERGING ADOPTION

C2PA 2.4, released in April 2026, defines Content Credentials and related mechanisms for tamper-evident media provenance, including signed claims, assertions and content bindings. The standard is directly relevant to a site that mixes documentary photographs, public posts, archival records and contextual/generated imagery.

### 7YA requirement

Immediate release:

- Every documentary media object retains a source/provenance field where known.
- Documentary, reconstructed/contextual and generated media states are not visually conflated.
- Preserve hashes/source URLs/archive identifiers where the existing evidence system already supports them.
- Never fabricate provenance metadata.

Later integration:

- Detect and surface valid C2PA Content Credentials when present.
- Evaluate issuing Content Credentials for new 7YA-owned media workflows.

C2PA issuance is **not** required for the first Living Universe slice; honest provenance labels are.

---

## 10. Personalization should be explicit, reversible and minimally invasive

**Evidence class:** SUPPORTED RISK-MANAGEMENT PRINCIPLE

NIST's AI Risk Management Framework Generative AI Profile emphasizes trustworthiness throughout design, development, use and evaluation. NIST's Privacy Framework treats privacy as an organizational risk-management concern, not only a consent-banner concern.

### 7YA requirement

The first personalization layer uses **visitor-declared interests**, not inferred sensitive attributes.

For example, a visitor may choose: belonging, family, crisis, creation, public impact, youth, leadership, technology or meaning.

- Explain why recommendations change: "because you chose belonging".
- Allow reset/change at any time.
- Prefer session/local state for the first release.
- Do not build psychological profiling, political profiling, health inference or hidden cross-site tracking into the narrative experience.
- Do not send private personalization state to an AI service unless a future feature has a defined need, disclosure and privacy review.

---

## 11. Multilingual design must be structural, not translated decoration

**Evidence class:** STANDARD PRACTICE

7YA's Hebrew, Russian and English versions should be equivalent information architectures, not separate visual clones.

### 7YA requirement

- Correct page-level `lang` and `dir`.
- Hebrew is RTL; Russian and English LTR.
- Use CSS logical properties (`inline-start`, `inline-end`) rather than duplicating physical left/right rules.
- Isolate mixed-direction identifiers, URLs and source fragments appropriately.
- Localize voice and terminology; do not silently strengthen claims in translation.
- All accessibility, performance and structured-data tests run across the supported locale states.

---

## 12. AI-assisted implementation accelerates work only when verification remains independent

**Evidence class:** MIXED / CONTEXT-DEPENDENT

Recent studies of AI coding assistance report productivity benefits in some environments and neutral or negative effects in others. The defensible conclusion is not a universal speed multiplier; it is that AI changes the engineering workflow and must be paired with verification because generated code can introduce functional, maintainability and security defects.

### 7YA requirement

- Test-driven or test-constrained implementation for behavior changes.
- Typecheck/lint/unit checks where present.
- E2E checks for critical navigation and locale flows.
- Automated accessibility checks plus manual keyboard/visual review.
- Screenshot QA on mobile and desktop after each meaningful visual slice.
- Security review for any new external input, AI call, storage or personalization endpoint.
- Small commits with an independently reversible scope.

No release may pass because an AI coding agent says it is correct.

---

## 13. Measure human outcomes, not only traffic

**Evidence class:** SUPPORTED

The HEART framework (Rodden, Hutchinson & Fu, CHI 2010) provides a reusable way to map product goals to user-centered metrics across Happiness, Engagement, Adoption, Retention and Task Success.

### 7YA metric model

**Happiness**
- optional qualitative usefulness/clarity prompt on selected deep pages, sampled rather than constantly shown

**Engagement**
- chapter progression
- media/echo/knowledge expansions
- creation or StartOn exploration
- not raw dwell time as an isolated success metric

**Adoption**
- percentage of new visitors choosing Story / Now / Build from entry
- percentage entering at least one deep chapter

**Retention**
- privacy-conscious aggregate return visits where analytics configuration permits

**Task success**
- reaching a cited source
- finding a specific life/public-work item
- completing a chosen visitor pathway
- reaching a relevant StartOn/action/contact destination

Technical telemetry — errors and Core Web Vitals — remains a separate operational health layer.

---

## Normative changes to the Living Universe implementation

The approved design direction is retained, with the following additions becoming mandatory implementation constraints:

1. **Human-first entry:** no chatbot, metrics wall or generated feed above the life entry.
2. **Progressive disclosure:** one dominant narrative/media object at a time on mobile; deep modules open contextually.
3. **Semantic foundation:** native HTML semantics, stable identifiers and durable routes/anchors.
4. **WCAG 2.2 AA:** accessibility is a release gate.
5. **Core Web Vitals budgets:** LCP <= 2.5 s, INP <= 200 ms, CLS <= 0.1 at p75 as production targets.
6. **Truthful structured data:** JSON-LD mirrors visible canonical content; no status inflation.
7. **AI-search fundamentals:** ordinary crawlability, text, internal linking and page experience before experimental GEO work.
8. **Evidence provenance:** documentary/source/generated states remain distinguishable.
9. **Consent-based personalization:** visitor-declared, reversible and local-first in the first release.
10. **Optional AI:** future Companion must expose capability, limitations, sources, correction and reset.
11. **Locale integrity:** Hebrew/Russian/English are structurally first-class.
12. **Independent QA:** AI-generated implementation receives tests, accessibility, security, visual and performance verification.

## Deferred rather than rejected

These may be researched/prototyped after the first Living Universe slice proves the human experience:

- corpus-grounded conversational AI Companion
- C2PA credential issuance pipeline
- generative personalization beyond explicit visitor choices
- agent-specific APIs/actions
- experimental `llms.txt`
- automated GEO monitoring
- adaptive layouts generated at runtime

They are deferred because they add system risk or complexity before proving visitor value, not because they are inherently undesirable.

## Immediate implementation order after this gate

1. Semantic + accessibility + locale foundation.
2. Minimal cinematic entry.
3. Three representative living chapters with real media, echo, provenance and Knowledge Lens links.
4. Reduce homepage competition by moving secondary depth behind contextual transitions/rooms.
5. Visitor-declared pathway layer.
6. Accurate structured data + canonical metadata.
7. Media/performance optimization.
8. E2E, accessibility, screenshot and performance QA.
9. Only after the human slice passes: evaluate AI Companion as a separate feature.

## Core sources reviewed

- Amershi, S. et al. (2019). *Guidelines for Human-AI Interaction*. CHI 2019. DOI: 10.1145/3290605.3300233.
- Tuch, A. N. et al. (2012). *The role of visual complexity and prototypicality regarding first impression of websites*. International Journal of Human-Computer Studies, 70(11), 794–811.
- W3C (2024). *Web Content Accessibility Guidelines (WCAG) 2.2*, W3C Recommendation.
- W3C WAI-ARIA Authoring Practices Guide. *Read Me First* / native HTML and ARIA guidance.
- Google/web.dev. *Core Web Vitals* — LCP, INP, CLS and field measurement guidance.
- Google Search Central. *AI Features and Your Website*.
- Google Search Central. *Introduction to Structured Data Markup* and *General Structured Data Guidelines*.
- Deng, X. et al. (2023). *Mind2Web: Towards a Generalist Agent for the Web*. arXiv:2306.06070.
- Zhou, S. et al. (2023). *WebArena: A Realistic Web Environment for Building Autonomous Agents*. arXiv:2307.13854.
- Aggarwal, P. et al. (2023/2024). *GEO: Generative Engine Optimization*. arXiv:2311.09735.
- Martinez, O. (2026). *Optimizing Visibility in Generative Engines: A Critical Survey of Generative Engine Optimization (2023–2026)*. arXiv:2607.14035. Treated as recent/emerging evidence rather than settled consensus.
- C2PA (2026). *C2PA Specifications 2.4 / Content Credentials*.
- NIST (2024). *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile*, NIST AI 600-1.
- NIST. *Privacy Framework* and Version 1.1 development materials.
- Rodden, K., Hutchinson, H., & Fu, X. (2010). *Measuring the User Experience on a Large Scale: User-Centered Metrics for Web Applications* (HEART). CHI 2010.

## Gate decision

**PASS WITH CONSTRAINTS.**

The 7YA Living Universe is academically and technically defensible as the implementation direction **provided the normative constraints in this document are treated as part of the design specification**. The research does not justify replacing the human-first narrative with an AI-first interface. It strengthens the case for making the underlying system more semantic, transparent, accessible, measurable, provenance-aware and agent-readable while preserving the human experience as the primary interface.
