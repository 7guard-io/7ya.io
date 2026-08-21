# 7YA Total Reality Foundation — Design

## Purpose
Turn the existing 7ya.io Personal Internet into a visibly abundant, source-backed living canon. The site must expose the breadth of Igor Vepretski's life, service, projects, media, posts, research, creative work and impact without converting the homepage into a table of contents.

## Governing constraints
- The canonical corpus and external evidence are the source of truth; 7ya.io is an output layer.
- Prefer real photo/video/post/document/publisher evidence over generated decoration.
- Never invent a face, event, metric, source or causal claim.
- Preserve VERIFIED / STRONGLY_INFERRED / REQUIRES_CONFIRMATION semantics.
- Metrics stay attached to their platform, source and snapshot date; no synthetic aggregate reach.
- Private material may support discovery/verification but is not exposed unless publication is explicitly safe and intended.
- Preserve existing high-quality components and visual assets; evolve architecture rather than rewrite.
- The system must scale to hundreds or thousands of records through search, filters, timelines, clusters and progressive disclosure.

## Foundation slice
This release adds four connected capabilities while reusing the current canonical corpus and content graph.

### 1. Reality Index
Add a homepage layer that summarizes the live corpus from API data rather than hard-coded marketing claims. It shows record count, verified count, source count, media count, metric snapshots, year span and platform breadth. It exposes domain lanes for Life, Service, StartOn, Posts/Viral, Media, Research, Creative/Music and Impact. Every lane deep-links into canonical search.

### 2. Temporal / evidence stream
Within Reality Index, expose a representative chronological stream selected from the corpus itself. Items with real images receive visual priority; source-only items remain visible as evidence cards rather than receiving synthetic imagery. The stream must allow users to traverse from an item to its evidence or to a filtered canonical search.

### 3. Coverage Engine expansion
Expand graph coverage to include Service, StartOn, Writing, Viral Posts and explicit People/Places readiness. People and Places must remain marked missing until first-class evidence-backed nodes exist; zero must not be disguised as coverage. This creates an internal/publicly inspectable red-team signal instead of hiding blind spots.

### 4. Abundance navigation
Homepage and search must make the corpus feel larger without rendering every object at once. Use dynamic counts, domain lanes, search deep-links and progressive disclosure. Viral/media sections continue to use canonical APIs rather than duplicate data.

## Data flow
CanonicalEvent[] → content-graph projection → API graph/search/coverage → Reality Index / Search / Viral UI.

The foundation does not create a second database. New visible summaries are projections of the same canonical objects and evidence relationships.

## Error handling
If graph APIs fail, Reality Index renders an evidence-safe unavailable state and no substitute facts. Empty domains show as absent/coverage-gap, not fake content.

## Accessibility / responsive behavior
The new layer must be semantic, keyboard-accessible, RTL-safe, readable at 375×667 and 1280×800, and avoid horizontal overflow. Large visual cards keep one image per card; no collages.

## Testing
Use AppDeploy E2E as the user-visible regression gate: desktop Total Reality visibility and deep navigation, canonical search traversal, mobile layout/navigation, and an evidence-safe empty/failure guardrail. Production deployment is permitted only after build/e2e/QA have no reported runtime errors.

## Success criteria
A first-time visitor can infer within the homepage that the system contains a multi-decade, multi-domain, source-backed corpus; can enter a domain without returning home; can see real evidence-bearing moments; and can distinguish covered domains from genuine gaps.