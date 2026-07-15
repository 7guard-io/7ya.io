# 7YA Living OS — Canonical Product Memory

Updated: 2026-07-15
Owner: Igor Vepretski
Canonical repository: `7guard-io/7ya.io`
Related: #146, #184, #185, #186, #187, #188, #201, #208

## The correction

7ya.io is not only a personal homepage and not only The History Song archive.

The intended hierarchy is:

1. **Igor Vepretski** — human, creator and public narrative core.
2. **StartOn** — independent social mission focused on technology, creation and belonging for youth.
3. **7YA** — the operating system that organizes identity, content, evidence, public memory, AI and action.
4. **The History Song** — the editorial timeline and searchable public-content archive inside 7YA.

No future redesign may delete a product layer merely because another layer is visually stronger.

## Product surfaces

### Human and story
- `/` — living public gateway.
- `/igor-vepretski/` — canonical identity.
- `/journey/` — multilingual life journey.
- `/history/` — searchable source-backed public history.
- `/legacy/` — long-term legacy and archive context.

### Content and influence
- `/influence/` — public influence wall and cross-platform map.
- `/media/` — media appearances and public assets.
- `/articles/` — writing archive.
- `/music/` — music route or canonical influence section.
- Visual podcast / studio / label modules remain valid product lanes even when not yet separate routes.

### Mission and action
- `/starton/` — social mission and evidence-linked progress.
- `/talk/` and `/speaker/` — interviews, lectures, panels and human conversation.
- `/contact/` — partnership, media, StartOn, corrections and private-message intake.

### Trust and systems
- `/evidence/` — public Evidence Wall.
- Evidence Oracle — ingestion, verification, correction and provenance layer.
- 7YA Pass — identity/access concept without implying government credentials or authority.
- 7YA Radar — public signals, opportunities, system failures and next actions.
- StartOn Seeds — non-sensitive progress events and evidence-linked snapshots.
- Digital Command — governed agent fleet with approval gates and append-only ledgers.

### AI and creator support
- 7YA AI Guide — public navigation and evidence-aware answers.
- Agent Council — Curator, Archivist, Signal and Catalyst.
- Positive Creator Companion — content creation, self-clarity and goal-to-action support.
- Narrative & Distribution Engine — one approved source transformed into platform-specific derivatives.

## Agent Council

### Curator
Finds the human story, selects the most relevant public source and protects narrative coherence.

### Archivist
Finds dates, canonical URLs, repost relationships, evidence states, corrections and missing proof.

### Signal
Turns the source into a strong hook, format choice and distribution plan without inventing reach.

### Catalyst
Converts intention into the smallest useful next action and keeps momentum practical.

The Council is a product metaphor and interaction model. It does not imply autonomous authority.

## Positive Creator Companion doctrine

The companion is positive, direct and action-oriented. It is not a manifestation oracle, therapist, spiritual authority or success guarantor.

It should help a user:
- define one real goal;
- identify the audience and desired change;
- choose a suitable format;
- create a hook and structure;
- separate fact, memory, opinion and aspiration;
- produce one immediate action, one action today and one action this week;
- adapt an approved source across platforms and languages;
- recover constructively from fear, criticism or creative blockage.

### Required response shape

```json
{
  "reflection": "Concise acknowledgement without empty praise",
  "goal": "The outcome currently being pursued",
  "next_step": "One action that can be done immediately",
  "today": "One action for today",
  "this_week": "One action for this week",
  "content_seed": {
    "hook": "Optional hook",
    "angle": "Optional angle",
    "outline": ["Optional beats"]
  },
  "evidence_notes": ["Claims requiring a source, date or caveat"],
  "links": [{"label":"...","href":"/.../"}],
  "mode": "openai | local-coach | local-fallback"
}
```

### Integrity boundaries
- Never claim to be Igor or speak on his behalf.
- Never guarantee success or say that thought alone changes reality.
- Never diagnose mental-health conditions.
- Never invent achievements, partners, roles, dates or metrics.
- Never expose family, minors, legal, medical, financial, credential or operational-security data.
- Political, legal, crisis and reputation-sensitive output is draft-only and review-gated.
- No send, publish, merge or external write action from the public companion.
- Conversations are not persisted by default.

## Content ingestion model

Every public item should normalize into an append-only record:

```json
{
  "content_id": "stable-id",
  "platform": "Facebook",
  "canonical_url": "https://...",
  "publisher": "...",
  "original_or_echo": "original | repost | press-echo | broadcast | owner-export",
  "published_at": "ISO date or null",
  "observed_at": "ISO date",
  "title": "...",
  "body_or_summary": "...",
  "language": "he | ru | en",
  "topics": [],
  "life_chapter": "...",
  "format": "post | reel | video | article | podcast | music",
  "media_assets": [],
  "evidence_tier": "TIER_1 | TIER_2 | TIER_3",
  "verification_state": "verified | source-visible | screenshot-required | pending | corrected | archived",
  "metrics": [{"name":"views","value":0,"as_of":"ISO date","source":"..."}],
  "correction_history": []
}
```

### Ingestion sequence

`DISCOVER → FETCH → NORMALIZE → DEDUPLICATE → CLASSIFY → VERIFY → REVIEW → PUBLISH → MEASURE → ARCHIVE`

Platform restrictions are represented explicitly. They are not an excuse to drop the content:
- use direct public permalinks;
- owner exports;
- platform embeds;
- public search echoes;
- screenshots with provenance;
- publisher reposts;
- video/channel feeds where permitted.

## Information architecture for the next integrated homepage

1. Human hero — Igor visible, current and specific.
2. Live signal — what is happening now.
3. Positive Creator Companion entry.
4. The History Song — personal/public archive.
5. Content universe — posts, video, writing, music and media.
6. StartOn mission.
7. Evidence and correction layer.
8. 7YA system map — Pass, Radar, Oracle, Command and creator engine.
9. Participation — talk, partner, mentor, media, correction and collaboration.

The homepage must reveal the system progressively rather than display every module at once.

## Deployment and governance

- Static-first public frontend.
- Optional serverless AI endpoint; deterministic local experience remains available.
- `store:false` for OpenAI Responses API calls.
- No public claim without evidence state.
- Metrics always carry observation date.
- Append-only correction and action ledgers.
- Production, DNS, billing and external publishing remain approval-gated.
- Preserve rollback artifacts and exact source SHA provenance.
