# Yisrael Beiteinu Evidence Dossier — Design Specification

**Date:** 2026-09-07  
**Status:** Approved visual direction; implementation blocked on source/runtime alignment  
**Primary route:** `/evidence/yisrael-beiteinu`  
**Working title:** **What Igor Actually Gave Yisrael Beiteinu**

## 1. Purpose

Build a public, evidence-led 7YA page that documents Igor Vepretski's contribution to Yisrael Beiteinu from 2023–2026 without reading like a grievance page, campaign microsite, slide deck, or conventional party landing page.

The page must answer one question clearly:

> What did Igor actually contribute before asking the party for national representation?

The product should feel like a premium editorial investigation fused with a public evidence dossier: human enough to read, structured enough to audit, and restrained enough to remain defensible.

## 2. Product principles

1. **Evidence before interpretation.** Every strong claim must resolve to a source-backed evidence object.
2. **Human first.** The page begins with Igor as a person, not with party logos, charts, or a wall of cards.
3. **Institutional restraint.** Do not imply that all of Igor's historical reach belongs to Yisrael Beiteinu.
4. **No fake precision.** Unknown counters remain unknown. Calls to join the party do not become inferred memberships, votes, or mandates.
5. **Not a campaign template.** The page should resemble an editorial public record, not a political ad.
6. **Mobile first.** The first phone viewport must communicate the page's thesis and one human visual without dense proof grids.
7. **No collage.** Multi-example evidence is displayed as separate media objects, never composited into one decorative collage.
8. **Progressive disclosure.** Readers see the story first and can open the deeper evidence layer when they want to audit it.

## 3. Primary information architecture

### 3.1 Hero — The record

Large editorial heading:

**WHAT IGOR ACTUALLY GAVE YISRAEL BEITEINU**

Support line:

**2023 → 2026 · Work · Content · Field · Audience · Representation**

Hero visual: one strong, documentary/editorial image of Igor. No collage, no party-logo wallpaper, no image carousel in the first viewport.

Four restrained proof counters appear below the hero copy, not over the face:

- **4 YEARS** — documented party-linked activity
- **140** — explicit party-related records in Igor's owner corpus
- **7** — official / youth / party-media distribution nodes in the conservative audit
- **26th KNESSET** — formal candidacy process reached

The counters must include short context labels and evidence status. They are not animated vanity metrics.

### 3.2 Thesis strip

A short editorial bridge:

> Igor did not arrive at the candidate-selection gate with only an ambition. The documented trail begins with digital operations in 2023, expands through local politics, youth activity, multilingual media, field work and official distribution, and ends in the formal Knesset candidacy process in 2026.

This strip introduces the chronology and makes the thesis legible before detail begins.

### 3.3 Timeline — Four years, one progression

A vertical mobile-first timeline with optional horizontal treatment on large desktop.

**2023 — Digital Operations**  
Interview → follow-up meetings → “אחראי דיגיטל” agreements → team planning → media monitoring → LinkedIn administration.

**2024 — Multi-layer Expansion**  
Holon → Influencers program → Knesset/youth activity → LinkedIn coordination → Russian/NDI media.

**2025 — Field + Production + Access**  
Party production days → Young Yisrael Beiteinu → Jerusalem activity → issue-based political content → management access.

**2026 — Institutional Amplification + Candidacy**  
Official party distribution → Russian-language distribution → cross-platform syndication → CEO meeting → candidacy documents → Permanent Committee interview → non-placement decision.

Each year shows 2–4 high-confidence evidence anchors only. The timeline is not the full archive.

### 3.4 Evidence cards — Claim / Evidence / Meaning / Boundary

Every strong argument uses a consistent dossier component:

**CLAIM**  
One concise statement.

**EVIDENCE**  
Primary or institutional source summary, date, source type, and link/open-evidence action.

**WHAT IT PROVES**  
The strongest defensible interpretation.

**WHAT IT DOES NOT PROVE**  
The nearest tempting overclaim that the evidence does not support.

Status badge values:

- `PRIMARY`
- `INSTITUTIONAL`
- `PUBLIC`
- `OWNER EXPORT`
- `CONTEXT`

Evidence confidence values:

- `VERIFIED`
- `STRONGLY SUPPORTED`
- `OPEN`

`OPEN` items must never be used as hero claims or headline counters.

### 3.5 Official amplification — Dark section

A visually distinct near-black editorial section with the statement:

**THE PARTY DIDN'T JUST RECEIVE THE CONTENT. IT REPUBLISHED IT.**

Show separate media tiles for recovered official distribution nodes such as:

- Official Yisrael Beiteinu Facebook
- Yisrael Beiteinu in Russian
- Young Yisrael Beiteinu
- Official party Instagram
- Party podcast / NDI-RU media
- Cross-platform syndication

Each tile contains only:

- platform / publisher
- asset title or short descriptor
- observed date
- recovered public metric if one exists
- `counter unavailable` when no trustworthy counter was recovered
- evidence-open action

Never invent views for assets whose counters were not recovered.

### 3.6 Party corpus explorer — 140 records

Do not render 140 cards on initial page load.

Section heading:

**140 EXPLICIT PARTY-RELATED RECORDS**

Provide a compact topic explorer with filters:

- Security
- Military service / equal burden
- Liberman
- Economy
- Holon
- Youth
- Russian
- Recruitment / membership CTA
- Field
- Government accountability

Initial view shows a representative subset. A `View evidence archive` action opens the larger record browser.

The corpus count must be described as Igor-owned party-related records, not official party publications.

### 3.7 Personal layer — “I didn't enter politics from politics.”

This is the emotional midpoint, not the hero.

Editorial statement:

**I DIDN'T ENTER POLITICS FROM POLITICS.**

Compact human path:

Kharkiv → immigration → Bat Yam / Jesse Cohen → IDF → security / police intelligence → StartOn → Yisrael Beiteinu → Knesset candidacy

The component exists to explain why Igor's political communication combined security, immigration, youth at risk, social mobility and public service.

It must not become a full biography duplication; it should link to the canonical life/chronology page.

### 3.8 Contribution synthesis

A quiet, typographic section answering the page title directly:

**He gave work.**  
Digital operations, planning, monitoring and platform administration.

**He gave content.**  
Political videos, explanations, calls to action and issue-based storytelling.

**He gave production capacity.**  
Participation in party filming and cross-platform repurposing.

**He gave field presence.**  
Youth activity, events and documented field actions.

**He gave multilingual reach.**  
Hebrew + Russian political communication.

**He gave a local bridge.**  
Holon and community-level political activity.

**He gave a public narrative.**  
Security, immigration, social entrepreneurship and youth-at-risk experience translated into political communication.

**He gave continuity.**  
A multi-year record before asking for representation.

### 3.9 Candidacy gate

This section is factual and deliberately non-dramatic.

Show the 2026 institutional sequence:

1. formal candidacy submission
2. request for consideration for position 7 (explicitly labelled a request, not a promise)
3. application accepted for processing
4. participation-fee exemption approved
5. Permanent Committee interview scheduled and confirmed
6. interview on 31.08.2026
7. 06.09.2026 notification that Igor was not placed on the list

No accusatory copy and no speculation about why the committee decided as it did.

### 3.10 Evidence boundary

A light-background section that states the limits prominently.

The page must explicitly say that the current evidence does **not** prove a specific number of:

- votes
- seats / mandates
- party memberships
- volunteers
- event registrations
- polling movement

It must also state that Igor's total historical creator reach is a separate measurement layer and must not be assigned wholesale to Yisrael Beiteinu.

### 3.11 Closing

Large restrained typography on white/off-white:

**I CONTRIBUTED FIRST.**  
**I BUILT FOR YEARS.**  
**THEN I ASKED TO REPRESENT.**

Support copy:

> On 6 September 2026, I was informed that I would not be placed on the party's Knesset list. The decision is part of the record. So is everything that came before it.

Primary action:

`Explore the evidence →`

Secondary action:

`View full political timeline →`

## 4. Visual system

### 4.1 Tone

Editorial / intelligence dossier / government-grade restraint.

Not fashion. Not campaign merchandise. Not SaaS dashboard.

### 4.2 Palette

- primary surface: warm off-white / paper
- primary text: near-black
- dark evidence section: near-black
- muted border / metadata gray
- Yisrael Beiteinu blue/red only as restrained semantic accent where source identity needs it

Do not recolor 7YA globally to party colors.

### 4.3 Typography

- large editorial display type for thesis statements
- high-legibility sans-serif for body and metadata
- monospaced or tabular-numeric treatment only for evidence IDs, timestamps and counters
- body measure on desktop approximately 60–75 characters

### 4.4 Layout

- generous whitespace
- no card soup
- no gradient hero
- no decorative 3D
- no generic icon cloud
- no autoplay media
- no full-width logo wallpaper

Evidence density increases only after the narrative establishes context.

## 5. Content and evidence model

The UI should render from structured data instead of embedding all claims directly inside presentation components.

Recommended conceptual type:

```ts
type PartyEvidenceRecord = {
  id: string;
  year: 2023 | 2024 | 2025 | 2026;
  date?: string;
  title: string;
  claim: string;
  proves: string;
  doesNotProve: string;
  sourceClass: 'PRIMARY' | 'INSTITUTIONAL' | 'PUBLIC' | 'OWNER_EXPORT' | 'CONTEXT';
  confidence: 'VERIFIED' | 'STRONGLY_SUPPORTED' | 'OPEN';
  publisher?: string;
  platform?: string;
  sourceUrl?: string;
  archiveUrl?: string;
  metric?: {
    label: string;
    value: number;
    observedAt?: string;
  };
  languages: Array<'he' | 'en' | 'ru'>;
  tags: string[];
  officialDistribution: boolean;
};
```

The production implementation should adapt this interface to the current AppDeploy/source architecture rather than introducing a parallel data system.

## 6. Internationalisation

The route must support HE / EN / RU using the existing 7YA language mechanism.

Requirements:

- Hebrew: native RTL layout, not translated LTR positioning
- English: canonical international summary language
- Russian: first-class version, especially for the NDI/RU and Russian-party-media evidence
- identical evidence IDs across languages
- metrics and source URLs remain invariant

## 7. SEO and machine readability

Page title target:

`Igor Vepretski × Yisrael Beiteinu — Evidence of Political Work, Content & Candidacy | 7YA`

Meta description should describe a documented 2023–2026 political activity record and avoid electoral-effect claims.

Structured data should be limited to truthful schema supported by the current site architecture, such as `Person`, `Article`/`ProfilePage`, and breadcrumb relationships. Do not invent party employment dates or office-holder status in schema.

The page should expose stable anchors for major sections and stable evidence IDs for deep links.

## 8. Accessibility

- WCAG 2.2 AA target
- full keyboard navigation
- visible focus states
- minimum contrast compliant text and metadata
- semantic heading order
- evidence cards understandable without color
- source status not conveyed by icon alone
- reduced-motion mode respected
- media thumbnails require meaningful alt text
- embedded video must not autoplay

## 9. Performance constraints

This route should be largely static-first.

- no large client bundle for the narrative path
- corpus explorer can hydrate progressively
- hero image responsive and optimized
- defer video embeds until user interaction
- initial page must remain useful when JavaScript fails
- no blocking analytics or evidence-fetch dependency for core copy

Target budgets should not regress the site's existing release thresholds.

## 10. Mobile behavior

The first mobile viewport contains:

1. small 7YA context / section marker
2. title
3. short support line
4. one human image
5. at most one compact proof row

The four headline counters can wrap below the first viewport. They must never become a dense 2×2 dashboard over the hero.

Timeline becomes a single vertical rail. Evidence card metadata stacks. Dark official-amplification tiles remain one per row on narrow screens.

## 11. Error and evidence-state behavior

If a source URL is unavailable:

- keep the record visible if there is an archived or primary stored source
- display `source unavailable` rather than silently removing the claim
- never fall back to a different unrelated URL

If a metric cannot be verified:

- omit the number
- show `counter not recovered`

If a record is `OPEN`:

- keep it out of hero metrics and synthesis language
- optionally expose it in the archive with explicit status

## 12. Testing requirements

Implementation must include:

1. **content integrity tests** — hero counters equal structured evidence summaries, not hand-maintained duplicates
2. **claim-boundary tests** — no `OPEN` evidence feeds headline metrics
3. **route tests** — HE/EN/RU route behavior and canonical/hreflang handling
4. **responsive tests** — phone, tablet, desktop; hero remains human-first
5. **accessibility checks** — headings, keyboard, focus, contrast, reduced motion
6. **no-JS smoke test** — core narrative and evidence summaries remain readable
7. **link validation** — evidence deep links and external source links are not broken at build time where testable
8. **visual QA** — dedicated screenshots for hero, timeline, official amplification, corpus explorer and closing on mobile + desktop

## 13. Release gates

This feature must **not** be deployed solely because the design spec is approved.

Before implementation/release:

1. resolve or explicitly reconcile current GitHub-main ↔ AppDeploy runtime drift
2. identify the exact production source files for route registration, global navigation, design tokens and content loading
3. implement on an isolated branch/worktree
4. run targeted tests + repository CI
5. verify the exact built artifact against production-compatible runtime
6. perform fresh mobile and desktop visual QA
7. only then enter the existing 7YA deployment chain

No production mutation is authorized by this design document.

## 14. Out of scope for V1

- party-member conversion attribution
- unique-audience deduplication across platforms
- speculative electoral impact model
- interactive network graph
- AI-generated summaries of evidence at runtime
- comment sentiment analysis
- full 140-record media download on first load
- redesign of the global 7YA homepage

## 15. Definition of done

The page is done when a neutral reader can answer all four questions without trusting Igor's word alone:

1. **What work did he do?**
2. **What content and field activity did he contribute?**
3. **Which parts were actually amplified by party-owned or party-linked channels?**
4. **What happened when he later asked to become a Knesset candidate?**

And the page must answer a fifth question just as clearly:

**What can the evidence not prove yet?**
