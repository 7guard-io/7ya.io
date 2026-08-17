# AI-Era Web Design Research Gate — 7YA Living Universe

**Date:** 2026-08-18
**Status:** Normative implementation addendum
**Applies to:** `docs/superpowers/specs/2026-08-18-7ya-living-universe-design.md`

## Research question

What should a high-end public website become in the generative-AI / agentic-web era, and which findings materially change how 7YA should be built?

## Method

Rapid evidence synthesis across:

- Human-computer interaction and human-AI interaction
- Web-agent research and benchmark environments
- Generative / agentic search and discoverability
- Accessibility and semantic web standards
- Website performance and interaction quality
- Provenance / authenticity for digital media
- Responsible AI and security
- Empirical evidence on AI-assisted software engineering
- Established research on aesthetics, visual complexity and usability

Priority was given to peer-reviewed research, primary research papers, standards bodies, official technical documentation and reproducible empirical studies. Hype, vendor claims and unsupported “AI SEO” recipes were excluded from normative decisions.

## Core conclusion

The strongest 2026 website is not the site with the most AI visible on screen. It is the site with the strongest **human experience + semantic structure + machine readability + provenance + performance + accessibility + controllability**.

For 7YA, AI should amplify navigation, interpretation, retrieval and personalization only after the underlying corpus is coherent and source-safe.

## Normative design principles

### 1. Human-first, AI-optional

AI must not become the primary interface to Igor's life. The first visit remains direct, visual and narrative. Any AI layer is subordinate, dismissible and non-blocking.

Human-AI interaction research consistently supports clear capability boundaries, correction, dismissal, explanations, cautious adaptation and global controls. Any future 7YA AI companion must implement these properties rather than behaving as an opaque autonomous narrator.

**Implementation consequence:** do not add an autonomous chat layer in the first Living Universe slice. Build the information architecture it would later consume.

### 2. Semantic substrate before agent features

Web-agent benchmarks such as Mind2Web and WebArena show that real websites remain difficult for autonomous agents, especially where interactions are long-horizon, DOMs are large or interfaces are ambiguous.

**Implementation consequence:** favor native semantic HTML, deterministic controls, stable identifiers, explicit link purpose, crawlable text, canonical topic URLs and bounded interaction states. Do not make important content reachable only through visual gestures, carousels or hidden JavaScript state.

### 3. Agent-readable does not mean “AI markup theater”

Google's current generative-search guidance says normal SEO fundamentals remain foundational and that there is no special schema, AI text file or markup required to appear in AI features. Crawlability, original useful content, clear internal links, visible textual content, good page experience, structured data matching visible content and high-quality media matter.

**Implementation consequence:** existing `llms.txt` may remain an auxiliary identity/disambiguation artifact, but it must not be treated as a substitute for canonical pages, semantic HTML, structured data, sitemap hygiene or source quality.

### 4. Originality and primary-source density become strategic assets

Generative search increases the value of non-commodity material: first-person narrative, original photographs, interviews, primary documents, verified social objects, source-backed public records and distinctive research frameworks.

**Implementation consequence:** 7YA should increase authentic primary-source density instead of generating filler text. Every major life chapter should preferentially surface a real visual/media/source object from the same period.

### 5. Multimodal content is part of discoverability, not decoration

Modern search is increasingly multimodal. High-quality images and video attached to clear textual context improve both human comprehension and machine retrieval.

**Implementation consequence:** visual enrichment must be contextual and captioned. Every documentary image/video needs meaningful alt/caption/provenance metadata and a relationship to its chapter/topic.

### 6. Provenance is a first-class product feature

C2PA / Content Credentials 2.4 provides a current technical model for cryptographically verifiable media provenance and transformation history. 7YA already distinguishes documentary evidence, owner archive, contextual illustration and generated imagery; this distinction should become explicit in the content model.

**Implementation consequence:** add a lightweight provenance state now (`documentary`, `owner-archive`, `publisher-copy`, `contextual`, `generated`, `unknown`). Preserve room for C2PA/Content Credentials metadata where present. Never display generated imagery as documentary evidence.

### 7. Accessibility is part of AI readiness

WCAG 2.2 remains the current W3C recommendation. Robust names/roles/values, keyboard access, focus behavior, target sizing, text alternatives and predictable interaction improve access for humans and also produce cleaner machine-interpretable interfaces.

**Implementation consequence:** target WCAG 2.2 AA for the Living Universe slice. All new cinematic interactions require reduced-motion behavior, keyboard equivalence and visible focus. Mobile cannot be treated as a reduced desktop.

### 8. Visual richness requires complexity control

HCI research on website aesthetics shows that visual complexity strongly influences first impressions, while aesthetics alone does not repair poor usability.

**Implementation consequence:** 7YA may be cinematic and visually dense across the whole journey, but each viewport should have one dominant narrative/media object and one clear next action. Avoid simultaneous competing dashboards, walls and grids.

### 9. Performance remains a product constraint

Current Core Web Vitals remain LCP, INP and CLS. The implementation target is:

- LCP <= 2.5 s at p75
- INP <= 200 ms at p75
- CLS <= 0.1 at p75

Desktop and mobile should be evaluated separately.

**Implementation consequence:** progressive media loading, fixed image dimensions/aspect ratios, restrained hydration and no autoplay-heavy opening sequence.

### 10. Personalization must be explicit and reversible

Human-AI guidance supports learning from users while preserving control and making consequences understandable.

**Implementation consequence:** the initial “what met you?” personalization uses explicit user selection and local/session state. No covert psychological profiling. Provide reset/clear controls. Personalization changes emphasis, not truth claims.

### 11. Verification is more important than generation speed

Empirical software-engineering research is mixed. Controlled studies have shown large gains for bounded greenfield tasks, while a 2025 randomized study of experienced developers working in familiar mature repositories found a 19% slowdown with early-2025 AI tools. Later follow-up work indicates the effect is changing rapidly and is difficult to estimate cleanly. Separate studies also find quality/security defects in AI-generated code even when functional tests pass.

**Implementation consequence:** AI is allowed to accelerate implementation, but no AI-produced code bypasses tests, visual QA, accessibility checks, security review or provenance reconciliation. Verification gates are mandatory.

### 12. AI features create a new attack surface

NIST's Generative AI Profile and OWASP's GenAI security guidance emphasize risks including sensitive-information disclosure, prompt injection, supply-chain issues and overreliance.

**Implementation consequence:** no privileged AI agent, write-capable public assistant or private-corpus retrieval is introduced in the first visual release. Future AI layers require explicit data-boundary and threat-model review.

## 7YA AI-era architecture decision

The Living Universe will be implemented in four layers:

1. **Human experience layer** — cinematic narrative, real media, accessible interaction.
2. **Semantic knowledge layer** — stable content objects, URLs, headings, relationships, source states and multilingual equivalents.
3. **Machine-discovery layer** — canonical metadata, JSON-LD, sitemap/feed, crawlable text, media metadata and provenance.
4. **Optional intelligence layer** — later retrieval, guided exploration and explicit personalization consuming the same canonical objects.

The intelligence layer may never become the source of canonical biography or evidence.

## Specific changes to the approved Living Universe design

The approved design remains valid. This research gate adds the following requirements:

- Add an `AIReadiness / SemanticContract` implementation unit rather than an AI chatbot.
- Add media provenance state and source-visible labeling.
- Make WCAG 2.2 AA a release gate for changed surfaces.
- Add Core Web Vitals budgets to QA.
- Ensure every cinematic interaction has a semantic/keyboard equivalent.
- Preserve crawlable first-person text instead of rendering narrative only inside client-only effects.
- Add schema.org/JSON-LD only where semantically accurate and visible-content-equivalent.
- Treat `llms.txt` as auxiliary, never canonical.
- Add explicit personalization reset and no covert inference.
- Prefer contextual authentic media over generative filler.
- Do not ship a privileged AI assistant in this release.
- Preserve future C2PA compatibility in the media model.

## Anti-patterns rejected

- Chat-first homepage
- AI-generated biography presented as authoritative
- Invisible personalization based on inferred vulnerability
- “GEO hacks” or mass AI page generation
- Custom AI markup as a substitute for crawlable content
- Autonomous public agent with write privileges
- Generated historical imagery without explicit labeling
- Heavy animation that damages accessibility or Core Web Vitals
- Decorative visual density without a dominant reading path
- Shipping AI-generated code without independent verification

## Evidence base — load-bearing sources

- Amershi et al. (CHI 2019), *Guidelines for Human-AI Interaction*.
- Deng et al. (2023), *Mind2Web: Towards a Generalist Agent for the Web*.
- Zhou et al. (2023), *WebArena: A Realistic Web Environment for Building Autonomous Agents*.
- Gou et al. (2025), *Mind2Web 2: Evaluating Agentic Search with Agent-as-a-Judge*.
- Aggarwal et al. (2023/2024), *GEO: Generative Engine Optimization*.
- W3C, *Web Content Accessibility Guidelines (WCAG) 2.2*.
- Google Search Central (2025–2026), official AI-features / generative-search guidance.
- Google web.dev, *Core Web Vitals*.
- C2PA, *Content Credentials Technical Specification 2.4* (April 2026).
- NIST AI 600-1, *Generative Artificial Intelligence Profile*.
- OWASP GenAI Security Project, *Top 10 for LLM / GenAI Applications*.
- Tuch et al. (2012), research on website visual complexity, aesthetics and usability.
- Peng et al. (2023), *The Impact of AI on Developer Productivity: Evidence from GitHub Copilot*.
- Becker et al. (2025), *Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity*.

## Gate result

**PASS WITH MODIFICATIONS.**

The Living Universe direction is supported, but implementation must prioritize semantic structure, authentic multimodal content, provenance, accessibility, performance and verification before adding visible autonomous AI.
