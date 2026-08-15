# THE ECHO Impact Experience Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing 7YA influence layer into THE ECHO: a source-backed, multilingual propagation experience that shows how selected Igor content moved from origin to redistribution and public response.

**Architecture:** Reuse `InfluenceUniverse` as the narrative entry point, add a small typed `echo-records` registry for curated source-backed chains, and extend the existing CSS/test surface. Do not duplicate `ImpactDashboard`; link deeper evidence back to the existing media/evidence routes.

**Tech Stack:** React 19, TypeScript, Vite, existing 7YA locale helpers, CSS, AppDeploy frontend+backend, AppDeploy E2E QA.

## Global Constraints

- Public name: `THE ECHO` / `ההדהוד` / `ЭХО`.
- No synthetic total-reach number.
- No fabricated quotation.
- Public material only; no DMs or sensitive responder profiling.
- Evidence states are `verified`, `documented`, `estimated`, `recovery` and must never be silently upgraded.
- Response categories are `felt`, `thought`, `discussed`, `shared`, `acted`, `grew`, `challenged` and may only be shown when supported by source text/behavior.
- No collage and no repeated generic portrait wallpaper.
- Desktop may use a horizontal chain; mobile must stack the same semantic order vertically.
- Reduced-motion mode must remove signal animation.
- Existing Journey, Research Spine, archive and evidence behavior must remain intact.

---

### Task 1: Add typed Echo records and failing QA requirements

**Files:**
- Create: `src/echo-records.ts`
- Modify: `tests/tests.txt`

**Interfaces:**
- Produces: `EchoEvidenceState`, `EchoResponseType`, `EchoNode`, `EchoStory`, `echoStories`.
- `EchoNode` fields: `id`, `kind`, `label`, `date`, `source`, `url`, `evidence`, optional `metric`, optional `responses`.
- `EchoStory` fields: `id`, localized `title`, localized `summary`, `nodes`.

- [ ] **Step 1: Add the failing E2E contract**

Replace the current Test 1 Influence Universe wording with THE ECHO wording and require three visible story selectors plus an active chain that contains `ORIGIN`, `DISTRIBUTION`, `RESPONSE` and `EVIDENCE` labels.

Expected test text:

```text
Expected: THE ECHO / ההדהוד is visible before CONTENT CORE; at least three source-backed stories are selectable; the active story shows ORIGIN → DISTRIBUTION → RESPONSE with an evidence-state label and source CTA; no universal reach total or fabricated quotation is shown.
```

- [ ] **Step 2: Verify RED in AppDeploy QA**

Run focused QA against the current version. Expected: FAIL because `InfluenceUniverse` still renders the generic `INFLUENCE UNIVERSE` identity and has no selectable Echo stories.

- [ ] **Step 3: Create the registry with three existing source-backed stories**

Use these existing records already present in `InfluenceUniverse` / `IgorLivingRecordHome`:

```ts
export type EchoEvidenceState='verified'|'documented'|'estimated'|'recovery';
export type EchoResponseType='felt'|'thought'|'discussed'|'shared'|'acted'|'grew'|'challenged';
export type EchoNode={id:string;kind:'origin'|'distribution'|'media'|'response'|'action';label:string;date:string;source:string;url?:string;evidence:EchoEvidenceState;metric?:string;responses?:EchoResponseType[]};
export type EchoStory={id:string;title:{he:string;en:string;ru:string};summary:{he:string;en:string;ru:string};nodes:EchoNode[]};
```

Seed stories from: fatherhood/external propagation, StartOn/return-to-neighborhood, and service-to-public-mission. Use existing public URLs and only metrics already visible in the current source. Do not add response quotations.

- [ ] **Step 4: Commit**

Commit message: `feat: add source-backed echo records`.

---

### Task 2: Rebuild InfluenceUniverse as THE ECHO narrative surface

**Files:**
- Modify: `src/InfluenceUniverse.tsx`
- Modify: `src/influence-universe.css`
- Consume: `src/echo-records.ts`

**Interfaces:**
- Consumes: `echoStories`.
- Produces: story selector, active propagation chain, evidence state, source CTA and response taxonomy.

- [ ] **Step 1: Implement story selection state**

Add:

```ts
const [activeStoryId,setActiveStoryId]=useState(echoStories[0].id);
const activeStory=echoStories.find(story=>story.id===activeStoryId)??echoStories[0];
```

Import `useState` and `echoStories`.

- [ ] **Step 2: Rename the cinematic identity**

The cinematic header must render localized `THE ECHO / ההדהוד / ЭХО` and the promise `What happens after Igor presses Publish.` while retaining the existing source-safety note.

Keep `mode='bar'` lightweight; change the bar label from `INFLUENCE UNIVERSE` to `THE ECHO` and link home views to `#echo`.

- [ ] **Step 3: Add three story selectors**

Render buttons with `aria-pressed`, source year and localized title. The selector must not expose unsupported counts.

- [ ] **Step 4: Render the active propagation chain**

For every `EchoNode`, render:

```tsx
<article className={'echo-node echo-'+node.kind}>
  <small>{node.date} · {node.source}</small>
  <b>{node.label}</b>
  {node.metric&&<strong>{node.metric}</strong>}
  <span className={'echo-state state-'+node.evidence}>{node.evidence.toUpperCase()}</span>
  {node.responses&&<div className='echo-responses'>{node.responses.map(type=><span key={type}>{type.toUpperCase()}</span>)}</div>}
  {node.url&&<a href={node.url} target='_blank' rel='noreferrer'>OPEN EVIDENCE ↗</a>}
</article>
```

Use semantic arrows/lines between nodes; do not claim causality beyond the registry relationship.

- [ ] **Step 5: CSS for desktop/mobile/reduced motion**

Desktop: grid/flex chain with visible connectors and one active source image/object at a time.

Mobile: `grid-template-columns:1fr`, vertical connectors, no horizontal scroll.

Add:

```css
@media (prefers-reduced-motion:reduce){.echo-signal,.echo-node{animation:none!important;transition:none!important}}
```

Image failure must preserve the node/card and source CTA.

- [ ] **Step 6: Run focused QA**

Expected: THE ECHO identity visible; three stories selectable; chain changes without page reload; source links remain actionable; mobile has no horizontal overflow.

- [ ] **Step 7: Commit**

Commit message: `feat: turn influence universe into the echo`.

---

### Task 3: Connect THE ECHO to the existing evidence depth without duplication

**Files:**
- Modify: `src/IgorLivingRecordHome.tsx`
- Modify: `src/ImpactDashboard.tsx` only if anchor/heading linkage is needed
- Modify: `src/App.tsx` only if global-bar routing requires it

**Interfaces:**
- Produces: stable `#echo` anchor and clear `See chain / Open evidence` route into existing media/evidence depth.

- [ ] **Step 1: Give the cinematic surface a stable home anchor**

Ensure the cinematic section rendered by `InfluenceUniverse` has `id='echo'` and remains before `LifeProof` / Content Core.

- [ ] **Step 2: Keep archive depth separate**

Do not copy `ImpactDashboard` metric cards into THE ECHO. The CTA should point to the existing media/evidence layer (`?page=media&lang=...` or current evidence route).

- [ ] **Step 3: Verify HE/EN/RU**

Load `?lang=he`, `?lang=en`, `?lang=ru`. Expected: title/promise/selector text are localized and RTL/LTR remain correct.

- [ ] **Step 4: Commit**

Commit message: `feat: connect echo to evidence depth`.

---

### Task 4: Production QA, rollout and repository sync

**Files:**
- Modify: `tests/tests.txt` only if final acceptance wording needs a precision fix.

**Interfaces:**
- Produces: one AppDeploy version with clean validation + focused 5/5 E2E QA and a GitHub PR/merge back to `main` after source sync.

- [ ] **Step 1: Run AppDeploy deployment validation**

Expected: frontend/backend errors empty.

- [ ] **Step 2: Run five E2E checks**

Required gates:

1. THE ECHO appears before Content Core.
2. Three story selectors work and active chain changes.
3. No fabricated total/quotation is rendered.
4. Mobile has no horizontal overflow or fixed-control collision.
5. HE/EN/RU labels and evidence CTAs work.

- [ ] **Step 3: Inspect QA snapshots**

Treat semantic/E2E pass separately from pixel-level proof. Do not claim visual perfection if screenshots cannot be directly inspected.

- [ ] **Step 4: Apply only the ready version**

Do not apply a version while QA is failed or still in progress.

- [ ] **Step 5: Sync AppDeploy source to `feature/the-echo-impact`**

Copy the exact applied changed files to GitHub, preserving the AppDeploy source as the runtime truth.

- [ ] **Step 6: Open and merge PR when checks are clean**

PR title: `feat: add THE ECHO public impact experience`.

- [ ] **Step 7: Final production verification**

Confirm the custom domain status for `7ya.io` and verify the applied version is `ready` with 5/5 focused QA before reporting completion.
