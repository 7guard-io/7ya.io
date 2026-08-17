# 7YA Knowledge Commons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the approved life-first 7YA homepage into a deeply personal first-person autobiography that contextually opens into interviews, podcasts, viral/public-echo evidence, five multilingual Knowledge Lenses, practical resources, and cross-site learning paths.

**Architecture:** Preserve the current AppDeploy life-first structure and canonical/evidence backends. Add a small typed knowledge data layer plus focused rendering components, attach those lenses inside `PersonalChronology`, and keep deeper archive/media/research routes intact. The personal story remains the primary reading flow; knowledge, proof and external scholarship are progressive disclosure.

**Tech Stack:** React 19, TypeScript, Vite, existing `useLocale` multilingual system, Lucide icons, static source-backed data, AppDeploy QA/E2E, GitHub canonical documentation/sync.

## Global Constraints

- First screen must remain Igor's first-person story, not a knowledge portal.
- Hebrew, English and Russian are first-class.
- No collages.
- No fabricated historical imagery presented as evidence.
- Real/source-backed imagery dominates; contextual illustration must never impersonate evidence.
- Source-local social metrics stay local; no inflated total reach.
- Igor's original frameworks are labeled as Igor frameworks, not academic consensus.
- Personal storytelling may expose Igor's own experience but not unnecessary private facts about children, partners, family or private citizens.
- Knowledge modules must distinguish established evidence, mixed evidence, emerging evidence, Igor-framework and open-question states.
- AppDeploy is the live execution source of truth; GitHub is synchronized after validated deployment.

---

### Task 1: Add the Knowledge Commons data model and five first-release lenses

**Files:**
- Create: `src/life-first/knowledge-commons-data.ts`

**Interfaces:**
- Produces: `KnowledgeLens`, `KnowledgeSchool`, `KnowledgeSource`, `KnowledgeAction`, `knowledgeLenses`, `knowledgeLensByChapterId`.
- Consumes: no app runtime dependencies besides the existing locale shape (`he`, `en`, `ru`).

- [ ] **Step 1: Define the localizable data types**

```ts
export type Local={he:string;en:string;ru:string};
export type EvidenceState='established'|'mixed'|'emerging'|'igor-framework'|'open-question';
export type KnowledgeSchool={id:string;name:Local;summary:Local;strengths:Local;limits:Local};
export type KnowledgeSource={title:string;url:string;kind:'paper'|'official'|'book'|'dataset'|'media'|'7ya-source'};
export type KnowledgeAction={label:Local;description:Local;href?:string};
export type KnowledgeLens={id:string;slug:string;chapterIds:string[];title:Local;question:Local;intro:Local;evidenceState:EvidenceState;schools:KnowledgeSchool[];sources:KnowledgeSource[];actions:KnowledgeAction[];related:string[]};
```

- [ ] **Step 2: Add five multilingual lenses**

Create these exact lens IDs:

```ts
'belonging-youth-risk'
'institutions-trust-prevention'
'youth-opportunity-digital-inclusion'
'virality-public-impact'
'research-meaning-frameworks'
```

Attach them respectively to chronology chapters `origin`, `service`, `return`, `voice`, `research`.

- [ ] **Step 3: Ground each lens in external scholarship and current 7YA sources**

Use source entries that include at minimum:

```ts
'https://www.cdc.gov/mmwr/volumes/72/ss/ss7201a2.htm'
'https://www.ojp.gov/ncjrs/virtual-library/abstracts/procedural-justice-and-police-legitimacy-systematic-review-research'
'https://pubmed.ncbi.nlm.nih.gov/30661211/'
'https://pubmed.ncbi.nlm.nih.gov/37774019/'
```

For the research/meaning lens, visibly mark The Resonant Self, SUPERNOAH, Strategic Sedation, Gastrocratia and Opportunity / Adversity as Igor-originated frameworks/questions rather than established consensus.

- [ ] **Step 4: Verify data completeness**

Confirm all five lenses have: one question, at least two schools/frameworks, one disagreement/limitation, at least two sources, and at least two practical actions.

- [ ] **Step 5: Commit**

```bash
git add src/life-first/knowledge-commons-data.ts
git commit -m 'feat: add 7YA knowledge commons data model'
```

---

### Task 2: Build focused Knowledge Commons UI components

**Files:**
- Create: `src/life-first/KnowledgeLensCard.tsx`
- Create: `src/life-first/KnowledgeCommons.tsx`
- Create: `src/life-first/knowledge-commons.css`

**Interfaces:**
- Consumes: `KnowledgeLens` and `knowledgeLenses` from `knowledge-commons-data.ts`; existing `useLocale`.
- Produces: contextual `<KnowledgeLensCard lens={...}/>` and a homepage `<KnowledgeCommons/>` index section.

- [ ] **Step 1: Render contextual progressive disclosure**

`KnowledgeLensCard` must show, in this order:

```text
LEARN FROM THIS
localized title
localized question
Evidence state
Schools / frameworks
Where the schools disagree
Sources
What can I do now?
Take it forward
```

Default state is compact; detailed schools/sources open with native `<details>` so the personal chapter stays visually dominant.

- [ ] **Step 2: Make disagreement explicit**

For at least one lens, render two or more frameworks side-by-side in reading order with separate `strengths` and `limits`. Do not synthesize them into false consensus.

- [ ] **Step 3: Add practical outward paths**

`Take it forward` renders source links and practical actions. External links use `target='_blank' rel='noreferrer'`. Internal/cross-project links use neutral relationship wording and must not imply endorsement.

- [ ] **Step 4: Add compact visual system**

Use selectors beginning with `.kc-`. Required mobile guardrails:

```css
.kc-card{max-width:100%;overflow:hidden}
.kc-schools{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}
@media(max-width:720px){.kc-schools{grid-template-columns:1fr}.kc-source-list a{overflow-wrap:anywhere}}
```

No stock images, no collage treatment, no horizontal scroller.

- [ ] **Step 5: Commit**

```bash
git add src/life-first/KnowledgeLensCard.tsx src/life-first/KnowledgeCommons.tsx src/life-first/knowledge-commons.css
git commit -m 'feat: add contextual knowledge commons UI'
```

---

### Task 3: Deepen first-person chronology and embed knowledge/media context

**Files:**
- Modify: `src/life-first/PersonalChronology.tsx`
- Modify: `src/life-first/LifeFirstHero.tsx`
- Modify: `src/life-first/LifeFirstHome.tsx`
- Modify: `src/life-first/personal-chronology.css`

**Interfaces:**
- Consumes: `knowledgeLensByChapterId`, `KnowledgeLensCard`, `KnowledgeCommons`.
- Produces: life-first chronology where `origin`, `service`, `return`, `voice` and `research` each expose contextual learning without replacing the autobiographical text.

- [ ] **Step 1: Rewrite visitor-facing biography in first person**

Replace provenance-heavy chapter bodies with personal first-person narrative. Required Hebrew editorial anchors:

```text
origin: 'נולדתי בחרקוב ב־7 ביולי 1990...'
service: 'השירות לא נכנס לחיים שלי כדי לקשט קורות חיים...'
return: 'יצאתי מג׳סי כהן כי רציתי עתיד. חזרתי כי הבנתי שהצלחה שאין בה חזרה היא חצי הצלחה.'
voice: 'בשלב מסוים הבנתי שפוסט יכול להיות הרבה יותר מפוסט...'
research: 'אחרי שנים של שטח, מערכות, יצירה ומאבק ציבורי התחלתי לנסח שאלות כמחקר...'
```

Keep factual uncertainty out of the prose; keep provenance available in links rather than body copy.

- [ ] **Step 2: Remove technical visual labels from the default reading path**

Do not render `chapter.visual` as a visible caption over/under real images. Use it only as fallback/ARIA context. Remove visitor-facing labels such as `OWNER ARCHIVE`, `CAPTURE DATE UNASSERTED`, `SOURCE-LINKED`, `ANALYTICAL MONOGRAPH-ESSAY` from the primary narrative presentation.

- [ ] **Step 3: Insert contextual knowledge cards**

After each chapter body/links, resolve:

```ts
const lens=knowledgeLensByChapterId.get(chapter.id);
```

and render `<KnowledgeLensCard lens={lens}/>` when present.

- [ ] **Step 4: Strengthen the hero leadership thesis**

Hero Hebrew first-person line must express the approved arc: pain → responsibility → building, without a campaign slogan or unsupported authority claim. Primary CTA remains `#life-chronology`.

- [ ] **Step 5: Add the distributed Knowledge Commons index later in the home**

Insert `<KnowledgeCommons/>` after the core life/public-echo narrative layers and before the deep archive. It is a navigation/index for the five lenses, not the first-screen experience.

- [ ] **Step 6: Commit**

```bash
git add src/life-first/PersonalChronology.tsx src/life-first/LifeFirstHero.tsx src/life-first/LifeFirstHome.tsx src/life-first/personal-chronology.css
git commit -m 'feat: integrate personal story with public knowledge lenses'
```

---

### Task 4: Reconcile E2E tests, deploy, QA and sync

**Files:**
- Modify: `tests/tests.txt`

**Interfaces:**
- Verifies: homepage hierarchy, five contextual lenses, first-person copy, source links, multilingual/mobile behavior, canonical corpus/research safety.

- [ ] **Step 1: Replace the changed homepage tests with a 5-test coverage-complete suite**

Exactly one test is `[sanity]`. Required coverage:

```text
Test 1 [sanity] — first-person autobiography opens before knowledge/public-action layers.
Test 2 — origin/StartOn/public-voice chapters each expose LEARN FROM THIS and actionable resources.
Test 3 — five lenses exist; virality lens shows disagreement/limits and source-local impact language.
Test 4 — mobile Hebrew/Russian/English layouts have no horizontal overflow and technical provenance captions stay out of default prose.
Test 5 — existing canonical corpus/research/admin safety semantics remain unchanged.
```

- [ ] **Step 2: Preflight AppDeploy update**

Confirm:

```text
app_id=697a008fddc309b142
app_type=frontend-only
model=gpt-5.6-sol
intent is non-empty
initiator=user for first deploy; agent for automatic retries
only changed/new files are sent
no @appdeploy SDK imports are introduced
```

- [ ] **Step 3: Deploy once, then poll to terminal status**

Use AppDeploy `deploy_app`, then `get_app_status` every >=5 seconds until `ready` or `failed`. If E2E fails, call `get_e2e_qa_run_details` before changing code.

- [ ] **Step 4: Validate desktop/mobile QA**

Acceptance checks:

```text
first viewport is personal
five Knowledge Lenses render
no technical provenance copy dominates chronology
no broken images
no horizontal overflow
Hebrew/English/Russian render
canonical evidence/research semantics still pass
```

- [ ] **Step 5: Sync validated source to GitHub**

After AppDeploy reports `ready` and tests pass, update/create the changed source files on `main` so GitHub matches the validated AppDeploy snapshot.

- [ ] **Step 6: Final verification**

Report live URL, deployed snapshot version, QA status, and any intentionally deferred work (for example full topic routing/RSS/JSON-LD if not part of this slice).
