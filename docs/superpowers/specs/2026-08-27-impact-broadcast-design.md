# 7YA Impact Broadcast Design

## Goal
Turn the 7ya.io homepage from an archive/dashboard-heavy experience into a living documentary that makes Igor Vepretski's multi-year public impact immediately visible through dated, source-local exposure and interaction evidence, while preserving the full canon/evidence machinery one layer deeper.

## Product principle
Story is foreground. Evidence is one tap away. Metrics are never detached from source, date, scope or verification status.

## Experience hierarchy
1. Hero remains human-first: Igor, one sentence, three primary actions.
2. Immediately after the hero, a new Impact Broadcast shows fifteen years of public footprint as a cinematic sequence rather than a KPI dashboard.
3. The broadcast begins with defensible measurement floors, then moves through dated public moments and propagation chains.
4. The visual story/gallery follows after impact, so users first understand why the corpus matters.
5. Canon, graph, discovery and verification language remain available in drawers/deep pages rather than dominating the first reading path.

## Impact Broadcast modules
### A. Signal strip
Show a small number of large figures with explicit labels:
- 14,670,621 — forensic strict observed exposure floor, snapshot 20 Aug 2026, non-unique and not a unique-person reach claim.
- 353,829 — visible engagement floor from the 20 Jun 2026 exposure audit; likes/reactions/comments/shares/saves only.
- 2,753+ — publication records across platform instances, dated 08 Jun 2026 where applicable; cross-posts may duplicate the same content.
- 15 years — public record span from 2011 to 2026.

Historical 30M/49M/60M/250M/310M/5.1B/6.2B+/7B claims remain visible only in an evidence-note/quarantine context and must never be presented as verified totals.

### B. Impact timeline
Present 2011 → 2022 → 2023 → 2024 → 2025 → 2026 as a horizontal/vertical cinematic track. Each era has one primary story, one source object, and source-local metrics only when documented.

### C. Propagation stories
Interactive story selector using the existing echo graph:
- Fatherhood: external Facebook repost → 4.1K reactions / 148 comments → LinkedIn mirror 491 reactions / 80 comments → Hidabroot article.
- Elder fraud: lived problem → external redistribution → television/public discussion.
- Kindergarten story: multiple syndicated copies; Hohavim copy retains 2,259 reactions; duplicates are separate nodes and are never summed as unique reach.
- Nawan co-appearance: external YouTube Short → 5.1M views → 82K likes / 717 comments, snapshot 17 Aug 2026; explicitly derivative/external reach, not Igor-owned account reach.

### D. Platform footprint
Show dated audience/inventory snapshots as separate platform tiles, not a combined follower total: TikTok 12,655 followers / 273,860 account likes / 904 exported posts (02 Jun 2026); Instagram 8.2K followers / 1,188 posts (08 Jun 2026); Facebook ~15.5K page likes (08 Jun 2026); LinkedIn 4,285 followers / 325 posts / 5 newsletter editions (08 Jun 2026); YouTube ≈2.57K subscribers (08 Jun 2026).

### E. Evidence drawer
Every metric/story exposes source, date, metric scope and evidence state. Quarantined/conflicting claims are labeled rather than hidden, but never promoted to headline totals.

## Data architecture
- Reuse `shared/media-impact.ts` forensic ledger and public-safe records.
- Reuse `src/echo-records.ts` for propagation routes and source URLs.
- Add a focused `shared/impact-broadcast.ts` view model that contains presentation-safe dated snapshots and never changes raw evidence records.
- No runtime dependency on NVIDIA for rendering. Digital Igor/NVIDIA may explain a scene but cannot be required for the content to appear.

## Visual direction
Dark cinematic documentary. Large editorial numerals, restrained motion, horizontal impact rail on desktop, snap-scrolling cards on mobile, high-contrast source chips. Avoid a four-card SaaS dashboard look. The user should perceive duration, movement and public response before methodology.

## Integrity rules
- No cross-platform deduplicated reach claim unless a source package proves methodology.
- No summing views + followers + reactions into one number.
- Every number has date + source/scope.
- Public and owner-export evidence remain distinguishable.
- Conflicting shares (26 vs 147 for the fatherhood repost) stay unresolved and are not headline material.
- 5.1B/6.2B+/7B remain quarantined/source-pending.

## Success criteria
- Within the first two screenfuls a visitor sees a 15-year impact story and defensible metrics.
- At least four propagation stories are interactively explorable.
- Mobile first fold remains unobstructed; the impact section is usable at 375×667.
- HE/EN/RU copy remains coherent.
- `/api/corpus` or public-projection degradation cannot blank the impact broadcast because its core evidence snapshot is bundled.
- Existing archive, media, research, evidence and Digital Igor routes remain intact.
