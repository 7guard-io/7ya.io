import {readFile,writeFile,access} from 'node:fs/promises';
import {resolve,join} from 'node:path';

const rootArg=process.argv[2];
if(!rootArg){
  console.error('Usage: node apply-appdeploy-v93-global-repair.mjs <extracted-appdeploy-v93-root>');
  process.exit(2);
}
const root=resolve(rootArg);
const OLD='7ya-bulk-repair-20260903-v6';
const NEXT='7ya-global-repair-20260904-v1';
const p=(...parts)=>join(root,...parts);

async function must(path){try{await access(path)}catch{throw new Error(`Missing required v93 file: ${path}`)}}
async function text(path){return readFile(path,'utf8')}
async function save(path,value){await writeFile(path,value,'utf8');console.log('updated',path.replace(root+'/',''))}
function one(value,from,to,label){const first=value.indexOf(from);if(first<0)throw new Error(`Patch anchor not found: ${label}`);if(value.indexOf(from,first+from.length)>=0)throw new Error(`Patch anchor is not unique: ${label}`);return value.slice(0,first)+to+value.slice(first+from.length)}
function all(value,from,to,label){if(!value.includes(from))throw new Error(`Patch anchor not found: ${label}`);return value.split(from).join(to)}

const required=[
  'backend/index.ts','index.html','public/en/index.html','public/ru/index.html','public/static-health.json','public/release.json','public/integrity/index.html',
  'src/documentary-home/DocumentaryHome.tsx','src/documentary-home/LivingFrontDoor.tsx','src/documentary-home/living-front-door-20260903.css','src/life-first/HundredMoments.tsx','tests/tests.txt'
];
for(const rel of required)await must(p(rel));
const releaseJson=await text(p('public/release.json'));
if(!releaseJson.includes(OLD))throw new Error(`Refusing to patch: public/release.json is not baseline ${OLD}`);
const backend=await text(p('backend/index.ts'));
if(!backend.includes("nvidia/nemotron-3-super-120b-a12b"))throw new Error('Refusing to patch: expected NVIDIA Nemotron 3 Super provider is missing');
if(!backend.includes('NVIDIA_API_KEY'))throw new Error('Refusing to patch: NVIDIA secret-name contract is missing');

const cover=`import{ArrowDown,MessageCircle}from'lucide-react';import{pageHref,useLocale}from'../locale';import'./living-front-door-20260903.css';const copy={he:{kicker:'#7YA🥷 · IGOR VEPRETSKI · LIVING PUBLIC BIOGRAPHY',title:'חרקוב → ג׳סי כהן.\\nשירות → משטרה → StartOn → #7YA.',lead:'אני איגור ופרצקי. מייסד StartOn, יוצר וחוקר — מסע אישי וציבורי שמחבר שירות, קהילה, מדיה, יצירה, מחקר ובנייה.',route:'חרקוב → ישראל → בת־ים → חולון → ג׳סי כהן → שירות → StartOn → קול ציבורי → יצירה → מחקר → 7YA.',moments:'100 רגעים',build:'מה אני בונה עכשיו',talk:'Bro Chat'},en:{kicker:'#7YA🥷 · IGOR VEPRETSKI · LIVING PUBLIC BIOGRAPHY',title:'Kharkiv → Jesse Cohen.\\nService → Police → StartOn → #7YA.',lead:'I’m Igor Vepretski — founder of StartOn, creator and independent researcher. One personal and public path through service, community, media, creation, research and building.',route:'Kharkiv → Israel → Bat Yam → Holon → Jesse Cohen → service → StartOn → public voice → creation → research → 7YA.',moments:'100 Moments',build:'What I’m building now',talk:'Bro Chat'},ru:{kicker:'#7YA🥷 · ИГОРЬ ВЕПРЕЦКИЙ · LIVING PUBLIC BIOGRAPHY',title:'Харьков → Джесси Коэн.\\nСлужба → полиция → StartOn → #7YA.',lead:'Я — Игорь Вепрецкий: основатель StartOn, автор и независимый исследователь. Один личный и публичный путь через службу, сообщество, медиа, творчество, исследования и созидание.',route:'Харьков → Израиль → Бат-Ям → Холон → Джесси Коэн → служба → StartOn → публичный голос → творчество → исследования → 7YA.',moments:'100 моментов',build:'Что я строю сейчас',talk:'Bro Chat'}}as const;export default function LivingBiographyCover(){const{locale,dir}=useLocale(),c=copy[locale],home=pageHref('home',locale),talk=home+(home.includes('?')?'&':'?')+'chat=open';return <section className='lfd lfd-cover' dir={dir} aria-label={locale==='he'?'ביוגרפיה ציבורית חיה של איגור ופרצקי':locale==='ru'?'Живая публичная биография Игоря Вепрецкого':'Igor Vepretski living public biography'}><header className='lfd-hero'><img className='lfd-portrait' src='./resources/igor-hero.jpg' alt='Igor Vepretski' fetchPriority='high'/><div className='lfd-veil'/><nav className='lfd-top'><a className='lfd-mark' href={home}>7YA</a></nav><div className='lfd-copy'><p>{c.kicker}</p><h1>{c.title}</h1><h2>{c.lead}</h2><p className='lfd-route'>{c.route}</p><div className='lfd-actions lfd-cover-actions'><a className='lfd-primary' href='#hundred-moments'>{c.moments}<ArrowDown/></a><a href='#now'>{c.build}<ArrowDown/></a><a href={talk}>{c.talk}<MessageCircle/></a></div></div></header></section>}`;
await save(p('src/documentary-home/LivingBiographyCover.tsx'),cover+'\n');

{
  const file=p('src/documentary-home/LivingFrontDoor.tsx');let s=await text(file);
  s=one(s,'export default function LivingFrontDoor(){','export default function LivingFrontDoor({hideHero=false}:{hideHero?:boolean}){','LivingFrontDoor signature');
  const hero="<header className='lfd-hero'>";const live="<section className='lfd-live'>";
  const hi=s.indexOf(hero),li=s.indexOf(live,hi);if(hi<0||li<0)throw new Error('LivingFrontDoor hero/live anchors missing');
  const hend=s.lastIndexOf('</header>',li);if(hend<hi)throw new Error('LivingFrontDoor hero closing tag missing');
  s=s.slice(0,hi)+'{!hideHero&&'+s.slice(hi,hend+9)+'}'+s.slice(hend+9);
  await save(file,s);
}

{
  const file=p('src/documentary-home/DocumentaryHome.tsx');let s=await text(file);
  s=one(s,"import LivingFrontDoor,{loadHomeProjection}from'./LivingFrontDoor';","import LivingFrontDoor,{loadHomeProjection}from'./LivingFrontDoor';import LivingBiographyCover from'./LivingBiographyCover';",'DocumentaryHome cover import');
  s=one(s,"const NarrativeChapters=lazy(()=>import('./NarrativeChapters'));","const NarrativeChapters=lazy(()=>import('./NarrativeChapters'));const HundredMoments=lazy(()=>import('../life-first/HundredMoments'));",'HundredMoments lazy import');
  s=one(s,'<LivingFrontDoor/>','<LivingBiographyCover/><Suspense fallback={null}><HundredMoments/></Suspense>','homepage opening hierarchy');
  s=one(s,'href="#story"','href="#hundred-moments"','skip link target');
  const narrative="{deferredReady&&<Suspense fallback={null}><NarrativeChapters mode='home'/></Suspense>}";
  s=one(s,narrative,narrative+"<LivingFrontDoor hideHero/>",'deeper source media');
  await save(file,s);
}

{
  const file=p('src/life-first/HundredMoments.tsx');let s=await text(file);
  s=one(s,"atlas:'ארכיון החיים הציבוריים'","atlas:'100 MOMENTS · ארכיון חיים ציבורי'",'HE atlas label');
  s=one(s,"title:'הארכיון הציבורי שלי ממשיך לגדול.'","title:'100 רגעים. חיים ציבוריים בתנועה.'",'HE atlas title');
  s=one(s,"ask:'לשאול את Digital Igor על הרגע'","ask:'לשאול את Bro Chat על הרגע'",'HE Bro Chat label');
  s=one(s,"atlas:'LIVING PUBLIC ARCHIVE'","atlas:'100 MOMENTS · LIVING PUBLIC ARCHIVE'",'EN atlas label');
  s=one(s,"title:'My public archive keeps growing.'","title:'100 moments. A public life in motion.'",'EN atlas title');
  s=one(s,"ask:'Ask Digital Igor about this moment'","ask:'Ask Bro Chat about this moment'",'EN Bro Chat label');
  s=one(s,"atlas:'АРХИВ ПУБЛИЧНОЙ ЖИЗНИ'","atlas:'100 MOMENTS · ЖИВОЙ ПУБЛИЧНЫЙ АРХИВ'",'RU atlas label');
  s=one(s,"title:'Мой публичный архив продолжает расти.'","title:'100 моментов. Публичная жизнь в движении.'",'RU atlas title');
  s=one(s,"ask:'Спросить Digital Igor об этом моменте'","ask:'Спросить Bro Chat об этом моменте'",'RU Bro Chat label');
  const oldAsk="const moment=visibleMoments[active];const askHref=moment?pageHref('home',locale)+'&chat=open&journeyChapter=archive&journeyChoice='+encodeURIComponent(moment.title[locale]):'';";
  const newAsk="const moment=visibleMoments[active];const askBase=pageHref('home',locale),askHref=moment?askBase+(askBase.includes('?')?'&':'?')+'chat=open&journeyChapter=archive&journeyChoice='+encodeURIComponent(moment.title[locale]):'';";
  s=one(s,oldAsk,newAsk,'moment-to-Bro-Chat query separator');
  await save(file,s);
}

{
  const file=p('src/documentary-home/living-front-door-20260903.css');let s=await text(file);
  const css=".lfd-cover .lfd-hero{min-height:92svh}.lfd-cover .lfd-copy{padding-bottom:72px}.lfd-route{max-width:760px;margin:14px 0 0;color:rgba(255,255,255,.68);font:650 12px/1.55 ui-monospace,monospace;letter-spacing:.025em}.lfd-cover-actions{display:grid;grid-template-columns:repeat(3,max-content)}@media(max-width:900px){.lfd-cover .lfd-copy{padding-bottom:42px}.lfd-route{max-width:34ch;font-size:10.5px;line-height:1.5}.lfd-cover-actions{grid-template-columns:1fr}.lfd-cover-actions a{justify-content:space-between}}";
  if(!s.includes('.lfd-cover .lfd-hero'))s+='\n'+css+'\n';
  await save(file,s);
}

for(const rel of ['backend/index.ts','index.html','public/en/index.html','public/ru/index.html','public/static-health.json','public/release.json','public/integrity/index.html']){
  const file=p(rel);let s=await text(file);s=all(s,OLD,NEXT,`${rel} release marker`);await save(file,s);
}

{
  const file=p('index.html');let s=await text(file);
  s=s.replace(/<div aria-label='אותות הוכחה'[^>]*>.*?<\/div><nav aria-label='כניסה לסיפור הציבורי'/s,"<nav aria-label='כניסה לסיפור הציבורי'");
  s=s.replace(/<nav aria-label='כניסה לסיפור הציבורי'[^>]*>.*?<\/nav>/s,"<nav aria-label='כניסה לסיפור הציבורי' style='display:flex;flex-wrap:wrap;gap:9px;margin-top:22px'><a href='./#hundred-moments' style='display:inline-flex;min-height:44px;align-items:center;padding:0 15px;background:#f4efe5;color:#151515;text-decoration:none;font-weight:850'>100 רגעים</a><a href='./#now' style='display:inline-flex;min-height:44px;align-items:center;padding:0 15px;border:1px solid rgba(255,255,255,.35);color:#fff;text-decoration:none;font-weight:800'>מה אני בונה עכשיו</a><a href='./?chat=open' style='display:inline-flex;min-height:44px;align-items:center;padding:0 15px;border:1px solid rgba(255,255,255,.35);color:#fff;text-decoration:none;font-weight:800'>Bro Chat</a></nav>");
  await save(file,s);
}

for(const [rel,aria,actions,ogOld,ogNew] of [
  ['public/en/index.html','Enter the public story',[['100 Moments','./#hundred-moments'],["What I’m building now",'./#now'],['Bro Chat','./?chat=open']],"Not a site about me. Life itself.","100 Moments · Living Public Biography"],
  ['public/ru/index.html','Вход в публичную историю',[['100 моментов','./#hundred-moments'],['Что я строю сейчас','./#now'],['Bro Chat','./?chat=open']],"Не сайт обо мне. Сама жизнь.","100 моментов · Живая публичная биография"]
]){
  const file=p(rel);let s=await text(file);const links=actions.map(([label,href],i)=>`<a href='${href}' style='display:inline-flex;min-height:44px;align-items:center;padding:0 15px;${i===0?'background:#f4efe5;color:#151515':'border:1px solid rgba(255,255,255,.35);color:#fff'};text-decoration:none;font-weight:${i===0?'850':'800'}'>${label}</a>`).join('');
  const re=new RegExp(`<nav aria-label='${aria.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}'[^>]*>.*?<\\/nav>`,'s');
  if(!re.test(s))throw new Error(`Static nav not found: ${rel}`);s=s.replace(re,`<nav aria-label='${aria}' style='display:flex;flex-wrap:wrap;gap:9px;margin-top:22px'>${links}</nav>`);
  s=s.split(ogOld).join(ogNew);await save(file,s);
}

{
  const file=p('public/release.json');let data=JSON.parse(await text(file));
  data.release=NEXT;data.build_marker=NEXT;data.deployed_on='2026-09-04';data.experience='LIVING_BIOGRAPHY_100_MOMENTS_GLOBAL_REPAIR_V1';
  data.visual_policy='Authentic person-first documentary cover, 100 Moments immediately after the cover, source-linked media world preserved deeper in the page.';
  data.responsive_policy='Mobile and desktop share the same hierarchy: human cover → 100 Moments → narrative → deeper source-media universe.';
  await save(file,JSON.stringify(data,null,2)+'\n');
}

{
  const file=p('tests/tests.txt');let s=await text(file);
  const t3=s.indexOf('## Test 3 -'),t4=s.indexOf('\n## Test 4 -',t3);
  if(t3<0||t4<0)throw new Error('Test 3/Test 4 anchors missing');
  const test3=`## Test 3 - Keep the human cover, 100 Moments and authentic media visually coherent\nViewport: desktop (1280x800)\nCovers: live homepage pixel audit desktop/mobile, Living Biography cover, authentic hero, 100 Moments first exploration layer, owner-approved visual registry, v5 /api/media-image approved/public-mirror behavior, source actions, Bro Chat moment handoff\nDescription: Verifies the live homepage opens on Igor as a person, moves directly into the source-linked 100 Moments atlas, then preserves the deeper authentic media universe without generic substitution.\nSteps:\n1. Open /api/visual-acceptance?path=home&viewport=desktop and confirm the returned audit verdict is PASS, visibleContent is true and blankOrMostlyEmpty is false.\n2. Open /api/visual-acceptance?path=home&viewport=mobile and confirm the returned audit verdict is PASS, visibleContent is true and blankOrMostlyEmpty is false.\n3. Open the homepage and confirm the authentic portrait cover is immediately visible with exactly three primary actions — 100 Moments, what Igor is building now, and Bro Chat — and no dashboard-like proof/metric wall. Scroll once and confirm 100 MOMENTS is the next major exploration section before REAL MEDIA/source mosaic.\n4. Open a 100 Moments item in Bro Chat and confirm the moment context is carried through a valid query string. Continue deeper through REAL MEDIA, the source wall, Narrative/Living Archive/Media/Impact, and verify source-linked media remains available; if https://www.instagram.com/p/CoXykBwq3Zr/ is present it must prefer its approved/authentic image rather than a generic source poster.\nExpected: Desktop and mobile pixel audits PASS; HE/EN/RU share human cover → 100 Moments before deeper media; no duplicate hero, clipping or horizontal overflow appears; authentic source media remains populated deeper in the page and blocked sources degrade safely without fabricated imagery.\n`;
  s=s.slice(0,t3)+test3+s.slice(t4+1);
  s=s.split(OLD).join(NEXT);await save(file,s);
}

for(const rel of required){const s=await text(p(rel));if(s.includes(OLD))throw new Error(`Old release marker remains in required file: ${rel}`)}
const finalBackend=await text(p('backend/index.ts'));
if(!finalBackend.includes("nvidia/nemotron-3-super-120b-a12b")||!finalBackend.includes('NVIDIA_API_KEY'))throw new Error('NVIDIA invariants changed unexpectedly');
const finalHome=await text(p('src/documentary-home/DocumentaryHome.tsx'));
if(!(finalHome.indexOf('<LivingBiographyCover/>')<finalHome.indexOf('<HundredMoments/>')&&finalHome.indexOf('<HundredMoments/>')<finalHome.indexOf('<LivingFrontDoor hideHero/>')))throw new Error('Homepage hierarchy invariant failed');
console.log(`PASS: ${NEXT} patch applied to verified v93 export at ${root}`);
