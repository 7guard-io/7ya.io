# 7YA — Album First, Evidence Always

**Status:** approved direction, pending written-spec review  
**Date:** 2026-08-21  
**Owner:** Igor Vepretski / 7YA

## 1. Decision

7YA will be rebuilt as a personal, living public album. The life comes first; evidence remains continuously available but never overwhelms the person, image, or moment.

The product must not read as a dossier, a CV, a wall of metrics, or a research landing page with photos added as decoration. Its primary job is to let a visitor meet Igor through a sequence of real scenes, then choose the depth they need: public work, media impact, research, StartOn, or collaboration.

## 2. Product promise

A first-time visitor should understand within one minute:

1. Who Igor is as a human being—not only as a role.
2. What shaped him and what he is building now.
3. That the public record, impact, and intellectual work can be checked.
4. Where to go next: follow a story, examine a source, watch/listen, enter StartOn, or start a purposeful conversation.

## 3. Core experience

### 3.1 Information architecture

The primary navigation becomes:

- **Life** — the personal album and chronological story.
- **Voice** — posts, press, interviews, public work, and measured impact.
- **Create** — music, video, humour, collaborations, and cultural work.
- **StartOn** — the social mission, field work, and spaces for youth opportunity.
- **Research** — independent frameworks, questions, evidence basis, limits, and open questions.
- **Archive** — searchable sources, records, media, dates, and verification status.
- **Build** — a visitor-selected path into conversation, collaboration, or action.

The current labels “Echo” and “Lab” may remain internally as implementation names, but they are not the human-facing default language.

### 3.2 Home: album first

The home page opens with one current, high-quality real frame and a concise first-person line. The hero must not always be the service/uniform image.

Immediately after the opening is the **Album Spine**: 12–18 distinct, real moments selected from the broader archive. Each scene has:

- one dominant original photograph or official video frame;
- a short first-person caption;
- a period or date only when documented;
- one meaningful action: open the story, watch/listen, or inspect the source;
- optional unobtrusive evidence status.

The album’s emotional rhythm must vary: quiet, family-safe, service, ordinary life, friends/community, pressure, humour, voice, music, field work, StartOn, thought, and present day. No visual collage is used.

### 3.3 Life in depth

The full Life route is an editorial, chronological album—not a horizontal spreadsheet or a native scrollbar.

It groups moments into readable chapters such as:

1. Origin and belonging
2. Becoming
3. Service and responsibility
4. Fatherhood and human stakes
5. A voice becomes public
6. Culture and creation
7. Returning with StartOn
8. Research and systems
9. The present, still unfolding

Each chapter can contain 6–12 curated moments. Personal detail serves truth and dignity; it does not manufacture trauma, mythologise pain, or expose children/family members without an explicit visibility decision.

### 3.4 Evidence stays one layer below

Every material public claim can retain its source, status, date, and context. That information appears through an “Open record” / “Source” drawer, detail view, or dedicated Archive route—not as repeated dense chrome around the primary visual.

Verification status must remain explicit:

- **Verified** — directly supported by the linked source.
- **Owner-reported** — stated by Igor and not independently verified.
- **Requires confirmation** — retained in the private/canonical queue; never promoted as fact.

Counts, reach figures, and media results are dated snapshots. Cross-platform totals never imply unduplicated reach unless the data supports that claim.

## 4. Visual system

- Use only real Igor-owned, licensed, officially published, or source-linked media.
- Never use stock photography, a generated substitute for Igor, or AI imagery presented as documentary material.
- No repeated hero visual in nearby sections; the selection engine must avoid visible repetition across the first 12 placements.
- Images are large enough to carry the story. Text supports the image rather than covering the face or forcing a poster treatment.
- The existing black, bone-white, acid-green, and restrained red system remains available, but the palette must flex with the media and allow breathing space.
- Use typography for hierarchy, not spectacle. The title must never crop unintentionally at normal desktop widths.
- No collages. Each media object is a complete, intentional frame.
- Hebrew, English, and Russian remain first-class, with logical RTL handling and no translation-induced overflow.

## 5. Canonical media and story model

The site consumes a source-of-truth content model. Each published item must be representable as:

```ts
type AlbumMoment = {
  id: string;
  chapter: string;
  title: LocalizedText;
  caption: LocalizedText;
  period: { display: LocalizedText; precision: "year" | "month" | "day" | "undated" };
  media: Array<{
    url: string;
    kind: "image" | "video" | "audio" | "document";
    alt: LocalizedText;
    provenance: "owner" | "official" | "press" | "platform";
    approvedForPublicUse: boolean;
  }>;
  sources: Array<{ url: string; label: LocalizedText; status: "verified" | "owner-reported" }>;
  tags: string[];
  visibility: "public" | "private" | "requires-confirmation";
  featuredWeight: number;
};
```

The initial media curation pass will use source assets from Igor’s approved Drive/archive material, official social posts, verified press, video frames, and StartOn records. A privacy-review flag is mandatory for any media involving children, family, or third parties.

## 6. Technical boundaries

- Resolve the exact deployed application entry point before editing. The repository currently contains duplicate/legacy application material; only the active deployment path may be changed.
- Move live album data out of monolithic presentation components into a canonical, typed content layer.
- Preserve existing public URLs, language entry points, source links, accessibility semantics, and evidence policy.
- Do not ship empty media boxes, broken remote images, generic placeholders, or unverified performance claims.
- No publish without a visual QA pass on mobile, tablet, and desktop.

## 7. Acceptance criteria

The work is accepted only when:

1. The first screen reads as a personal album and contains a real, non-repeated Igor visual.
2. At least 12 distinct primary scenes are visible before a visitor reaches evidence-heavy material.
3. The Life route has no desktop-native horizontal scrollbar as its central interaction.
4. Voice, Create, StartOn, and Research each have a clear human connection back to Life.
5. Every featured moment can open an accurate source or a visibly labelled internal narrative.
6. No source label, title, card, or translation is visibly clipped at 390px, 768px, or 1440px widths.
7. Every displayed media URL resolves, has meaningful alt text, and passes the privacy/rights flag.
8. Public metrics carry source, date, and status; unsupported totals are absent.
9. The screen contains no generated stand-in for Igor and no collage treatment.
10. The final build passes functional and visual QA before any production publish.

## 8. Scope discipline

This specification authorizes the album architecture, canonical media model, and first implementation slice. It does not authorize publication of new personal, family, third-party, legal, political, medical, or financial material without its appropriate source, privacy review, and explicit approval.

## 9. First deliverable

The first build slice is a working, responsive **Album First** home and Life flow backed by the canonical moment model, with 12–18 approved real scenes and unobtrusive source drawers. Voice, Create, StartOn, Research, Archive, and Build then attach to that spine rather than compete with it.
