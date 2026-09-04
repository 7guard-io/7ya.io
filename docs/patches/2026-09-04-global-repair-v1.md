# 7YA Global Repair v1 — Executable Patch Contract

Target release: `7ya-global-repair-20260904-v1`
Production baseline: AppDeploy app `697a008fddc309b142`, applied version `1788453751783` (v93)
Repair branch: `repair/global-20260904`
Status: READY TO APPLY WHEN A DEPLOY-CAPABLE RUNTIME IS AVAILABLE

## Non-negotiable invariants

- Do not remove or weaken the existing NVIDIA-first Bro Chat backend.
- Keep provider order `nvidia -> appdeploy-agent -> local`.
- Keep Canon authoritative over Discovery.
- Do not expose secrets, hidden reasoning or private memory.
- Keep the protected NVIDIA canary; do not claim live NVIDIA inference until it passes.
- Preserve all existing source-media sections; move them deeper rather than deleting them.
- No fake historical imagery and no generated imagery presented as documentary evidence.
- HE / EN / RU must share the same first-scroll hierarchy.
- Production rollback remains AppDeploy v93 (`1788453751783`) until the replacement passes live visual acceptance.

## User-visible target

The active homepage becomes:

`Authentic human cover -> 100 Moments -> narrative chapters -> source-media universe -> life timeline / human / now -> live archive -> media / impact`

Opening cover has exactly three primary actions:

1. `100 Moments`
2. `What I am building now`
3. `Bro Chat`

The dashboard-like proof-signal row (`7B+`, `5.13M`, etc.) is removed from the cover. Source-backed metrics may remain in deeper evidence/media contexts.

## File-level patch

### 1. Add `src/documentary-home/LivingBiographyCover.tsx`

Create a lightweight cover using the existing authentic `./resources/igor-hero.jpg` asset and existing locale helpers. It must:

- render the chronology headline already used by the current static first paint;
- include one short human lead and one chronology cue;
- link to `#hundred-moments`, `#now`, and Bro Chat;
- generate the Bro Chat URL with `?` or `&` based on whether `pageHref('home', locale)` already has a query string;
- reuse `living-front-door-20260903.css` rather than creating a parallel design system.

Canonical component body prepared during the blocked production deploy:

```tsx
import{ArrowDown,MessageCircle}from'lucide-react';import{pageHref,useLocale}from'../locale';import'./living-front-door-20260903.css';const copy={he:{kicker:'#7YA🥷 · IGOR VEPRETSKI · LIVING PUBLIC BIOGRAPHY',title:'חרקוב → ג׳סי כהן.\\nשירות → משטרה → StartOn → #7YA.',lead:'אני איגור ופרצקי. מייסד StartOn, יוצר וחוקר — מסע אישי וציבורי שמחבר שירות, קהילה, מדיה, יצירה, מחקר ובנייה.',route:'חרקוב → ישראל → בת־ים → חולון → ג׳סי כהן → שירות → StartOn → קול ציבורי → יצירה → מחקר → 7YA.',moments:'100 רגעים',build:'מה אני בונה עכשיו',talk:'Bro Chat'},en:{kicker:'#7YA🥷 · IGOR VEPRETSKI · LIVING PUBLIC BIOGRAPHY',title:'Kharkiv → Jesse Cohen.\\nService → Police → StartOn → #7YA.',lead:'I’m Igor Vepretski — founder of StartOn, creator and independent researcher. One personal and public path through service, community, media, creation, research and building.',route:'Kharkiv → Israel → Bat Yam → Holon → Jesse Cohen → service → StartOn → public voice → creation → research → 7YA.',moments:'100 Moments',build:'What I’m building now',talk:'Bro Chat'},ru:{kicker:'#7YA🥷 · ИГОРЬ ВЕПРЕЦКИЙ · LIVING PUBLIC BIOGRAPHY',title:'Харьков → Джесси Коэн.\\nСлужба → полиция → StartOn → #7YA.',lead:'Я — Игорь Вепрецкий: основатель StartOn, автор и независимый исследователь. Один личный и публичный путь через службу, сообщество, медиа, творчество, исследования и созидание.',route:'Харьков → Израиль → Бат-Ям → Холон → Джесси Коэн → служба → StartOn → публичный голос → творчество → исследования → 7YA.',moments:'100 моментов',build:'Что я строю сейчас',talk:'Bro Chat'}}as const;export default function LivingBiographyCover(){const{locale,dir}=useLocale(),c=copy[locale],home=pageHref('home',locale),talk=home+(home.includes('?')?'&':'?')+'chat=open';return <section className='lfd lfd-cover' dir={dir}><header className='lfd-hero'><img className='lfd-portrait' src='./resources/igor-hero.jpg' alt='Igor Vepretski' fetchPriority='high'/><div className='lfd-veil'/><nav className='lfd-top'><a className='lfd-mark' href={home}>7YA</a></nav><div className='lfd-copy'><p>{c.kicker}</p><h1>{c.title}</h1><h2>{c.lead}</h2><p className='lfd-route'>{c.route}</p><div className='lfd-actions lfd-cover-actions'><a className='lfd-primary' href='#hundred-moments'>{c.moments}<ArrowDown/></a><a href='#now'>{c.build}<ArrowDown/></a><a href={talk}>{c.talk}<MessageCircle/></a></div></div></header></section>}
```

### 2. Modify `src/documentary-home/LivingFrontDoor.tsx`

- Change component signature to `LivingFrontDoor({hideHero=false}:{hideHero?:boolean})`.
- Wrap its current `<header className='lfd-hero'>...</header>` in `!hideHero && ...`.
- Preserve the source posters, dynamic source mosaic, News 13 feature, StartOn and music sections exactly as the deeper source-media world.

### 3. Modify `src/documentary-home/DocumentaryHome.tsx`

- Import `LivingBiographyCover`.
- Import existing `../life-first/HundredMoments`.
- Replace the opening `<LivingFrontDoor/>` with `<LivingBiographyCover/><HundredMoments/>`.
- Change skip link target from `#story` to `#hundred-moments`.
- After the deferred narrative chapters, render `<LivingFrontDoor hideHero/>` so all source-media content survives without a duplicate hero.

### 4. Modify `src/documentary-home/living-front-door-20260903.css`

Append only the cover-specific rules:

```css
.lfd-cover .lfd-hero{min-height:92svh}.lfd-cover .lfd-copy{padding-bottom:72px}.lfd-route{max-width:760px;margin:14px 0 0;color:rgba(255,255,255,.68);font:650 12px/1.55 ui-monospace,monospace;letter-spacing:.025em}.lfd-cover-actions{grid-template-columns:repeat(3,max-content)}@media(max-width:900px){.lfd-cover .lfd-copy{padding-bottom:42px}.lfd-route{max-width:34ch;font-size:10.5px;line-height:1.5}.lfd-cover-actions{grid-template-columns:1fr}.lfd-cover-actions a{justify-content:space-between}}
```

### 5. Modify `src/life-first/HundredMoments.tsx`

Visible title changes:

- HE atlas: `100 MOMENTS · ארכיון חיים ציבורי`
- HE title: `100 רגעים. חיים ציבוריים בתנועה.`
- EN atlas: `100 MOMENTS · LIVING PUBLIC ARCHIVE`
- EN title: `100 moments. A public life in motion.`
- RU atlas: `100 MOMENTS · ЖИВОЙ ПУБЛИЧНЫЙ АРХИВ`
- RU title: `100 моментов. Публичная жизнь в движении.`

Fix moment-to-chat URL construction:

```ts
const askBase=pageHref('home',locale),askHref=moment?askBase+(askBase.includes('?')?'&':'?')+'chat=open&journeyChapter=archive&journeyChoice='+encodeURIComponent(moment.title[locale]):'';
```

### 6. Release identity

Change backend release marker and public release surfaces from:

`7ya-bulk-repair-20260903-v6`

to:

`7ya-global-repair-20260904-v1`

Affected applied-snapshot files:

- `backend/index.ts`
- `index.html`
- `public/en/index.html`
- `public/ru/index.html`
- `public/static-health.json`
- `public/release.json`
- `public/integrity/index.html`

### 7. Static first paint

HE root:
- remove opening `7B+ / 5.13M / STARTON / NEWS 13` proof pills;
- use 3 actions: `100 רגעים`, `מה אני בונה עכשיו`, `Bro Chat`.

EN `/en/`:
- 3 actions: `100 Moments`, `What I’m building now`, `Bro Chat`;
- replace obsolete social metadata `Not a site about me. Life itself.` with `100 Moments · Living Public Biography`.

RU `/ru/`:
- 3 actions: `100 моментов`, `Что я строю сейчас`, `Bro Chat`;
- replace obsolete social metadata `Не сайт обо мне. Сама жизнь.` with `100 моментов · Живая публичная биография`.

### 8. Release metadata

`public/release.json` target fields:

```json
{
  "release": "7ya-global-repair-20260904-v1",
  "build_marker": "7ya-global-repair-20260904-v1",
  "deployed_on": "2026-09-04",
  "experience": "LIVING_BIOGRAPHY_100_MOMENTS_GLOBAL_REPAIR_V1"
}
```

Visual policy: person-first documentary cover, 100 Moments first, source world deeper.
Responsive policy: mobile/desktop both use cover → 100 Moments before the source-media universe.

### 9. Regression test to add to `tests/tests.txt`

```text
## Test 6 - Flow directly from the human cover into 100 Moments
Viewport: mobile (375x667)
Covers: Living Biography cover, authentic hero, 100 Moments first exploration layer, HE/EN/RU homepage hierarchy, Bro Chat moment handoff
Description: Verifies the public homepage opens on Igor as a person and moves directly into the source-linked life atlas before the deeper media universe or dashboard-like proof signals.
Steps:
1. Open the homepage and confirm the first viewport uses Igor’s authentic hero image with exactly three primary actions: 100 Moments, what Igor is building now, and Bro Chat; confirm no vanity-metric/proof-signal wall occupies the cover.
2. Activate 100 Moments or scroll once past the cover and confirm the next major exploration section is the 100 MOMENTS living public archive, with chronology/source-layer controls and source-linked moment actions.
3. Open one moment’s Ask Digital Igor action and confirm Bro Chat opens with that moment context; repeat the first-scroll hierarchy on /en/ and /ru/.
Expected: Human cover → 100 Moments is the first narrative transition on HE/EN/RU; REAL MEDIA/source mosaic, broadcast, StartOn and music features remain available deeper in the page rather than preceding the atlas; the moment-to-chat link uses a valid query string and no horizontal overflow or duplicate hero appears.
```

Also update Test 4 expected release marker to `7ya-global-repair-20260904-v1`.

## NVIDIA release gate

After deployment capability is restored, do not modify the NVIDIA agent during this visual/source-truth slice. Verify:

- `/api/companion/status` still reports NVIDIA configured and model `nvidia/nemotron-3-super-120b-a12b`;
- Bro Chat factual requests still require public retrieval;
- fallback remains NVIDIA → AppDeploy agent → local;
- protected canary passes under authorized admin session before any claim of verified end-to-end NVIDIA inference.

## Visual acceptance gate

Do not call this release FIXED until live pixel-level checks confirm on mobile and desktop:

- authentic Igor image is visible in viewport one;
- no proof/metric wall dominates the cover;
- exactly three cover actions are readable and reachable;
- 100 Moments is the first major section below the cover;
- no duplicate hero appears;
- no clipping, horizontal overflow or unreadable nav;
- deep source media is still present after the atlas/narrative;
- HE, EN and RU share the same hierarchy.
