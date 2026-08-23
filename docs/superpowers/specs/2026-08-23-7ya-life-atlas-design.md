# 7YA LIFE ATLAS — Evidence-First, First-Person Architecture

Date: 2026-08-23
Status: DESIGN SPEC — user-approved direction; written-spec review required before implementation
Owner: Igor Vepretski / 7YA

## 1. North Star

7YA is a chronological visual life atlas told in Igor's first person.

The visitor should feel that Igor is walking with them through real moments from his life, while the evidence system works quietly underneath.

**Public rule:**

> I tell the experience. The system quietly proves it.

Time is the spine. Childhood, school, service, creator history, media, writing, fatherhood, music, StartOn, research, politics, #7YA, people, collaborations, places and public echo are lenses over the same chronology.

The normal visitor experience must never lead with technical terms such as canonical event, evidence node, verification state, source lineage, owner export or relationship grammar. Those belong in source drawers, archive inspector and internal QA.

## 2. Critical architectural correction

The current site knows too much through hand-curated modules and too little through the actual archive.

The next implementation must NOT start by inventing new chapters or selecting seven/twenty/fifty moments by editorial taste.

It must start with **Media Archaeology** against the authoritative content corpus, then project the discovered material into the site.

The authoritative control workbook already contains dedicated layers including LIFE_TIMELINE, VISUAL_CANON, MEDIA_MASTER_LIBRARY, PEOPLE_GRAPH, FB_DIGEST_RECOVERY, CONTENT_ASSETS, STORY_CLUSTERS, INTERACTION_EVENTS, EVIDENCE_MANIFEST, UNRESOLVED_LEADS, COVERAGE_BY_YEAR and other evidence/control tables.

The workbook and archive are upstream; the site is downstream.

## 3. Source-of-truth hierarchy

1. **Authoritative evidence/control workbook** — current v4 forensic workbook and append-only history.
2. **Primary/public sources** — publisher pages, official broadcasts, official social posts, official music/video surfaces, public records.
3. **Owner archive / owner exports** — photographs, documents, platform exports, restored archive assets, metadata-backed files.
4. **Public discovery** — mirrors, rediscovered URLs and public traces awaiting resolution.
5. **Recovery queue** — missing originals, SRT references, date conflicts, unresolved assets and broken source chains.

Rules:

- Never silently overwrite history.
- Never promote an unresolved object to verified fact because it appears in a spreadsheet, filename or previous 7YA page.
- File names are clues, not chronology authority.
- Metrics remain source-local.
- A restored image remains a derivative of its original, not a new event.

## 4. Internal evidence model

Every discoverable object becomes an internal EvidenceNode.

```ts
export type EvidenceNode = {
  id: string;
  kind: 'photo'|'video'|'audio'|'post'|'article'|'document'|'caption'|'transcript'|'music'|'broadcast'|'event'|'profile'|'dataset'|'mirror';
  title: LocalizedText;
  source: SourceRef;
  capturedAt?: string;
  publishedAt?: string;
  dateRange?: {from?:string;to?:string};
  datePrecision: 'exact'|'month'|'year'|'range'|'unknown';
  dateStatus: 'verified'|'owner-reported'|'inferred'|'conflict'|'unresolved';
  placeRefs: string[];
  peopleRefs: PersonRelation[];
  topicRefs: string[];
  media?: MediaRef[];
  voice?: VoiceRef[];
  lineage?: LineageRef[];
  verification: VerificationState;
  visibility: 'public'|'owner-only'|'consent-required'|'restricted'|'blocked';
  rights: RightsState;
  notes?: string[];
};
```

Resolved nodes cluster into LifeMoments. LifeMoments are not manually written categories; they are evidence-backed moments or periods.

## 5. First-person narrative projection

Every public LifeMoment is rendered through a first-person narrative object.

```ts
export type NarrativeProjection = {
  momentId: string;
  locale: 'he'|'en'|'ru';
  headline: string;
  livedVoice: string;
  whatIRemember?: string;
  whatISaidThen?: VoiceExcerpt[];
  whoWasWithMe?: PublicPersonRelation[];
  whatHappenedNext?: string;
  howISeeItNow?: string;
  sourceLabel: string;
  sourceHref?: string;
  disclosure?: string;
};
```

The projection may never invent a memory, opinion or feeling. Current reflection must be source-backed or owner-approved.

Public wording examples:

- "כאן אני מתחיל."
- "זה אחד הצילומים המוקדמים שנשארו לי."
- "אני עדיין לא קובע כאן את השנה המדויקת."
- "זה מה שאמרתי אז."
- "מכאן עברתי לשירות."
- "שנים אחר כך חזרתי לשכונה עם StartOn."
- "כאן הסיפור יצא מהחשבון שלי והתחיל לחזור דרך אחרים."

## 6. Media Archaeology pipeline

Before the next major visual rewrite:

`DISCOVER → INVENTORY → HASH → METADATA → DATE RESOLUTION → ENTITY RESOLUTION → LINEAGE → RIGHTS → PRIVACY → DEDUP → CLUSTER → LIFE MOMENT → PLACEMENT`

Mandatory intake surfaces:

- authoritative v4 workbook
- ChatGPT Library archive
- Google Drive owner archive
- canonical corpus
- visual canon
- media master library
- Facebook digest recovery
- Meta / Instagram exports
- TikTok legacy/current exports
- YouTube playlists and direct videos
- music catalog surfaces
- press and broadcast sources
- public mirrors
- historical websites and profiles
- captions/SRT references
- approved restored images
- approved private scans after privacy review

SharePoint/OneDrive may be used when accessible; connector failure must not be interpreted as an empty archive.

## 7. Placement engine — discovered content must become experience

Discovery is incomplete until content is placed.

Every publishable node must receive one or more `placementTargets`:

```ts
placementTargets: Array<{
  surface: 'home'|'museum'|'media'|'music'|'research'|'politics'|'starton'|'archive'|'people'|'search';
  role: 'opening'|'chapter'|'support'|'voice'|'evidence'|'echo'|'relationship'|'transition';
  priority: number;
}>
```

### Placement principles

- Earliest defensible childhood media outranks a later press image in the opening chronology.
- Public press can explain a childhood period but must not visually replace authentic childhood archive media when approved media exists.
- Longform interviews are attached to the life periods they discuss, not isolated in a media warehouse.
- Creator/collaboration objects appear at the dates when the relationships happened.
- Politics appears inside the chronology when public action occurs; it is not a detached campaign page.
- Research connects backward to the lived questions that produced it.
- #7YA is shown as an evolving system across time, not as a logo added at the end.
- Every external repost remains connected to its original story family.
- People appear inside moments first; a People Graph is a secondary exploration surface.

## 8. Already-discovered placement classes

The current archive already supports the following non-arbitrary placements and should be used before inventing new material:

### Childhood / origin

- early black-and-white childhood photographs in the Library
- kindergarten and school archive classes
- Gordon school material
- birth/root document slot subject to privacy/redaction
- Russian-language identity/family archive artifacts

Target: home opening, museum opening, childhood lens.

### 2011 public anchor

- early independent Makor Rishon / NRG profile.

Target: origin chapter as first independent public record, not as substitute for childhood visuals.

### US chapter

- owner-labeled USA 2011–2015 Instagram archive with multiple real photographs
- public corroboration of youth-camp work and Miami security chapter
- unresolved Camp Henry Horner footage lead
- unresolved U of I context lead

Target: chronological US chapter with unresolved details clearly narrated in first person.

### Service

- exact public court anchor for 2015 police-agent activity
- later public biography/interview trail for role progression
- public broadcast material connecting service to StartOn

Target: service chapter with strict OPSEC boundary and no invented exact dates.

### Creator history

- media master library includes legacy network activity before current #7YA identity
- legacy Instagram tag network beginning at least by 2018 in currently recovered rows
- legacy TikTok/account snapshots
- old Facebook recovery and YouTube content families

Target: creator chronology integrated between service/public life and later #7YA, not a footer gallery.

### Music / creator collaborations

- Ron Nesher
- Zvika Brand
- NAWAN
- Papipablo and other verified credit relationships
- creator-network/tagged relationships retained with exact relation status

Target: dated music/creator scenes and People × Igor exploration.

### Longform voice

- verified longform records
- direct YouTube sources and playlists
- SRT/caption references awaiting review
- Mindset and other podcast/interview sources that explicitly cover childhood, belonging, service, StartOn, politics and creator history

Target: attach timestamped voice to the corresponding life moments after transcript review.

### Facebook recovery

First-party Meta/Gmail archaeology already recovers many owned posts with dates/content shorthand and counters, including identity, public service, war/civic framing, parenting, immigration identity, advocacy and election/civic periods.

Target: `what I said then` / `voice` / `echo` nodes throughout 2023–2026 chronology. Counters are engagement unless separately proven as views.

### People graph

The existing People Graph already distinguishes collaborator, host, interviewer, publisher, amplifier, tagged creator, political/institutional publisher and other relation types.

Target: people inside dated moments, then relationship pages/graph. Never display a generic celebrity list.

## 9. Transcript states

Internal states:

1. `caption_reference`
2. `transcript_extracted`
3. `transcript_reviewed`
4. `public_quote_ok`

Normal public language:

- reviewed: "מה אמרתי אז"
- unresolved: "מצאתי בארכיון הפניה לכתוביות, אבל עוד לא עברתי עליהן מספיק כדי להציג אותן כאן כתמלול מלא."

No private or consent-limited transcript enters public UI.

## 10. Relationship grammar

Exact relation types are required internally. Host ≠ partner. Coappearance ≠ endorsement. Repost ≠ collaboration. Distribution ≠ sponsorship.

First-person public phrasing should be human:

- "התארחתי אצל..."
- "יצרנו יחד..."
- "הוא פרסם מחדש..."
- "נפגשנו בתוך..."

A personal opinion about a collaborator/person is displayed only when a sourced public statement or owner-approved reflection exists.

## 11. Route behavior

All routes are lenses over the same atlas.

### Home
Chronological first-person journey. Earliest real material first.

### Museum
Director's cut: denser chronology, documents, media and relationships.

### Media
"איך הדברים שאמרתי יצאו ממני וחזרו דרך אחרים." Media is attached to moments and can also be browsed independently.

### Research
"השאלות לא התחילו במסמך המחקר." Each research object links backward to lived moments and forward to applications/limitations.

### StartOn
"חזרתי למקום שממנו באתי ושאלתי מה היה יכול לשנות את המסלול שלי." Preserve StartOn as a distinct organization while showing biography-to-mission causality only where supported.

### Music
"לא כל מה שאני רוצה להגיד יוצא כמאמר או נאום." Official credits and collaborations remain exact.

### Politics
"בשלב מסוים לא הספיק לי לדבר מבחוץ." Show dated public activity, appearances, candidacy/campaign records and positions only from sources. Party distribution is not partnership/endorsement inference.

### #7YA
Show the movement/system evolving through content, evidence, research, public action and tools. Avoid static brand-manifesto copy when dated artifacts exist.

## 12. Coverage Gate — 'Did we forget anything?'

The build must fail editorial QA when a publishable high-value archive object has no journey placement.

Coverage dimensions:

- chronology years/eras
- childhood
- education
- places/geography
- service
- creator history
- posts
- social platforms
- media
- longform voice
- transcripts
- people
- collaborations
- music
- StartOn
- writing
- public/civic action
- politics
- research
- #7YA
- public echo / distribution
- now

Required gap types:

- `ARCHIVE_OBJECT_NOT_PLACED`
- `LIFE_PERIOD_WITHOUT_VISUAL`
- `LIFE_PERIOD_WITHOUT_SOURCE`
- `VOICE_WITHOUT_MOMENT`
- `PERSON_WITHOUT_RELATION_EVIDENCE`
- `TRANSCRIPT_REFERENCE_UNREVIEWED`
- `DATE_CONFLICT`
- `PRIVACY_REVIEW_REQUIRED`
- `SOURCE_ORIGINAL_MISSING`
- `DERIVATIVE_WITHOUT_PARENT`

## 13. Visual grammar

Documentary cinema × museum archive × living social feed.

- one strong primary visual per moment
- no collage used as the normal story unit
- documents look like documents
- restored images are labeled as restored versions
- video remains playable video
- posts preserve source context
- transcript opens at timestamp when available
- unresolved dates remain unresolved
- desktop: central chronology with alternating media/context
- mobile: vertical river of life
- technical status appears only on demand

## 14. Privacy and publication gate

Every node carries visibility and rights state.

Childhood group photos, school materials, family artifacts and third-party people require privacy review before public rendering. A private archive object can inform chronology without its pixels being public.

Public first-person example:

> "יש לי צילום מהתקופה הזאת, אבל אני לא מציג אותו כאן כרגע כי מופיעים בו אנשים נוספים."

This is better than replacing it with stock or AI imagery.

## 15. First implementation slice after written-spec approval

The first implementation slice is **not a homepage redesign**.

It is:

1. create normalized EvidenceNode/LifeMoment contracts;
2. build an adapter over LIFE_TIMELINE + VISUAL_CANON + MEDIA_MASTER_LIBRARY + FB_DIGEST_RECOVERY + PEOPLE_GRAPH + existing canonical corpus;
3. expose a read-only `/api/life-atlas` endpoint with placement targets;
4. create internal coverage report `/api/life-atlas/coverage`;
5. replace only the current Origin/early-life section with an atlas-driven first-person chronological renderer;
6. surface approved childhood archive media before the 2011 press anchor;
7. preserve unresolved dates rather than invent them;
8. verify privacy gates, mobile rendering and source links;
9. only after this vertical slice works, extend the same atlas projection through service, US chapter, creator history, media, StartOn, research, politics, music and #7YA.

## 16. Acceptance criteria

The slice is accepted only if:

- the first visible chronology begins with earliest publishable real archive material, not a 2022 substitute;
- no public storytelling label exposes technical implementation jargon by default;
- every rendered claim has a source or owner-approved archive basis;
- no unresolved date becomes exact through filename or inference;
- the 2011 public article is correctly positioned as an independent public anchor, not the beginning of the life;
- at least one real childhood visual is used when rights/privacy allow;
- high-priority discovered objects receive placement targets;
- the Coverage Gate identifies known but unplaced objects;
- no private/consent-required object leaks into public output;
- all public copy is first-person by default;
- existing deep archive/evidence functionality remains available.

## 17. Implementation discipline

No more arbitrary story selection.

For every new site section, the implementation question is:

> **Which evidence objects already exist, what period do they belong to, and why are they not yet visible here?**

Only after that question is answered may editorial writing or new visuals be introduced.
