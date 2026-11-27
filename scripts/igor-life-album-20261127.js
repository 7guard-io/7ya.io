/* 7YA · interactive canonical life album · 2026-11-27
   Story data is a public projection of the existing canonical AlbumHome chapter model.
   Missing period imagery is deliberately shown as a source frame, never a fabricated photo. */
(()=>{
 'use strict';
 const main=document.querySelector('body.home-page main');
 if(!main||document.getElementById('life-album'))return;
 const locale=(document.documentElement.lang||'he').slice(0,2);
 const rtl=locale==='he'||locale==='ar';
 const copy={
  he:{eyebrow:'אלבום חיים אישי · איגור ופרצקי',title:'החיים, בזמן שהם קרו.',intro:'שמונה פרקים מחברים ילדות, שירות, אבהות, StartOn, קול ציבורי, יצירה, מנהיגות והווה. האדם קודם למערכת. המקור נשאר פתוח.',age:'גיל',place:'מקום',people:'אנשים',moment:'הרגע',story:'מה נשאר מהסיפור',response:'מה חזר מהקהל',consequence:'מה קרה אחר כך',reflection:'מה אני מבין היום',capability:'מה למדתי לקחת איתי',value:'מה אני מבקש לבנות',source:'לפתיחת המקור',previous:'העמוד הקודם',next:'העמוד הבא',page:'עמוד',of:'מתוך',fallback:'אין בארכיון הציבורי צילום אותנטי מהתקופה הזאת. במקום להמציא זיכרון, פותחים את המקור שנשמר.',enter:'להיכנס לאלבום ↓',work:'מה אני בונה היום',aria:'דפדוף בפרקי אלבום החיים'},
  en:{eyebrow:'PERSONAL LIFE ALBUM · IGOR VEPRETSKI',title:'THE LIFE, WHILE IT WAS HAPPENING.',intro:'Eight chapters connect childhood, service, fatherhood, StartOn, public voice, creation, leadership and now. The person comes before the system. The source stays open.',age:'AGE',place:'PLACE',people:'PEOPLE',moment:'THE MOMENT',story:'WHAT SURVIVED',response:'WHAT PEOPLE SENT BACK',consequence:'WHAT HAPPENED NEXT',reflection:'WHAT I UNDERSTAND NOW',capability:'WHAT I CARRY FORWARD',value:'WHAT I WANT TO BUILD',source:'OPEN THE SOURCE',previous:'PREVIOUS PAGE',next:'NEXT PAGE',page:'PAGE',of:'OF',fallback:'No authenticated photograph from this period is in the public archive. Rather than invent a memory, open the source that survived.',enter:'ENTER THE ALBUM ↓',work:'WHAT I BUILD NOW',aria:'Browse the life album chapters'},
  ru:{eyebrow:'ЛИЧНЫЙ АЛЬБОМ · ИГОРЬ ВЕПРЕЦКИЙ',title:'ЖИЗНЬ, ПОКА ОНА ПРОИСХОДИЛА.',intro:'Восемь глав соединяют детство, службу, отцовство, StartOn, публичный голос, творчество, лидерство и настоящее. Человек важнее системы. Источник открыт.',age:'ВОЗРАСТ',place:'МЕСТО',people:'ЛЮДИ',moment:'МОМЕНТ',story:'ЧТО СОХРАНИЛОСЬ',response:'ОТКЛИК ЛЮДЕЙ',consequence:'ЧТО БЫЛО ДАЛЬШЕ',reflection:'ЧТО Я ПОНИМАЮ СЕГОДНЯ',capability:'ЧТО Я БЕРУ С СОБОЙ',value:'ЧТО Я ХОЧУ ПОСТРОИТЬ',source:'ОТКРЫТЬ ИСТОЧНИК',previous:'ПРЕДЫДУЩАЯ СТРАНИЦА',next:'СЛЕДУЮЩАЯ СТРАНИЦА',page:'СТРАНИЦА',of:'ИЗ',fallback:'В публичном архиве нет подлинной фотографии этого периода. Вместо выдуманной памяти — сохранившийся источник.',enter:'ОТКРЫТЬ АЛЬБОМ ↓',work:'ЧТО Я СТРОЮ СЕЙЧАС',aria:'Листать главы альбома жизни'},
  ar:{eyebrow:'ألبوم حياة شخصي · إيغور فيبريتسكي',title:'الحياة كما حدثت.',intro:'ثمانية فصول تربط الطفولة والخدمة والأبوة وStartOn والصوت العام والإبداع والقيادة والحاضر. الإنسان قبل النظام، والمصدر مفتوح.',age:'العمر',place:'المكان',people:'الأشخاص',moment:'اللحظة',story:'ما بقي من القصة',response:'ردود الناس',consequence:'ماذا حدث بعد ذلك',reflection:'ما أفهمه اليوم',capability:'ما أحمله معي',value:'ما أريد بناءه',source:'افتح المصدر',previous:'الصفحة السابقة',next:'الصفحة التالية',page:'صفحة',of:'من',fallback:'لا توجد في الأرشيف العام صورة أصلية موثقة من هذه الفترة. بدلاً من اختلاق ذكرى، نعرض المصدر المحفوظ.',enter:'افتح الألبوم ↓',work:'ما أبنيه الآن',aria:'تصفح فصول ألبوم الحياة'}
 };
 const c=copy[locale]||copy.en;
 const value=(v)=>typeof v==='string'?v:(v&&((v[locale])||(v.en)||(v.he)))||'';
 const el=(tag,cls,txt)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(txt!==undefined)n.textContent=txt;return n};
 const link=(href,label,cls)=>{const a=el('a',cls,label);a.href=/^https:\/\//i.test(href||'')?href:'#';a.target='_blank';a.rel='noopener noreferrer';return a};
 const note=(label,txt,cls)=>{const n=el('section',cls||'life-album-note');n.append(el('small','',label),el('p','',txt));return n};
 const makeSourceFrame=(chapter)=>{
  const box=el('div','life-album-source-frame');
  box.append(el('small','life-album-source-kicker','SOURCE FRAME · '+chapter.era));
  box.append(el('strong','',value(chapter.sourceLabel)||chapter.era));
  box.append(el('p','',c.fallback));
  if(chapter.sourceUrl)box.append(link(chapter.sourceUrl,c.source,'life-album-source-link'));
  return box;
 };
 const makeMedia=(chapter)=>{
  const wrap=el('div','life-album-media-frame');
  const media=chapter.media;
  if(!media||!media.src){wrap.append(makeSourceFrame(chapter));return wrap;}
  const figure=el('figure','life-album-photo');
  const img=el('img');img.src=media.src;img.alt=value(media.alt)||value(chapter.title);img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
  img.addEventListener('error',()=>{wrap.replaceChildren(makeSourceFrame(chapter));},{once:true});
  figure.append(img);
  const cap=el('figcaption','',value(media.caption)||value(chapter.sourceLabel));
  if(media.sourceUrl)cap.append(link(media.sourceUrl,'↗','life-album-caption-link'));
  figure.append(cap);wrap.append(figure);return wrap;
 };
 const buildPage=(chapter,index,total)=>{
  const page=el('article','life-album-spread'+(index%2?' is-reversed':''));page.hidden=index!==0;page.dataset.chapter=chapter.id;page.setAttribute('aria-label',value(chapter.title));
  const media=makeMedia(chapter);page.append(media);
  const copyPane=el('div','life-album-page-copy');
  const topline=el('div','life-album-page-topline');topline.append(el('span','',chapter.index+' / '+chapter.era),el('b','',value(chapter.kicker)));copyPane.append(topline);
  const context=el('div','life-album-context');
  [['age',c.age],['place',c.place],['people',c.people]].forEach(([key,label])=>{const cell=el('div','life-album-context-cell');cell.append(el('small','',label),el('strong','',value(chapter[key])));context.append(cell)});
  copyPane.append(context,el('h3','life-album-chapter-title',value(chapter.title)));
  copyPane.append(note(c.moment,value(chapter.moment),'life-album-moment'));
  copyPane.append(note(c.story,value(chapter.story),'life-album-story'));
  const notes=el('div','life-album-reflections');
  notes.append(note(c.response,value(chapter.response),'life-album-note'),note(c.consequence,value(chapter.consequence),'life-album-note'),note(c.reflection,value(chapter.reflection),'life-album-note'));
  copyPane.append(notes);
  const takeaway=el('div','life-album-takeaway');takeaway.append(el('div','',value(chapter.capability)),el('p','',value(chapter.publicValue)));copyPane.append(takeaway);
  const source=link(chapter.sourceUrl||chapter.media?.sourceUrl,c.source,'life-album-source-button');copyPane.append(source);
  const pageNo=el('small','life-album-page-number',c.page+' '+String(index+1).padStart(2,'0')+' '+c.of+' '+String(total).padStart(2,'0'));copyPane.append(pageNo);
  page.append(copyPane);return page;
 };
 const root=el('section','life-album');root.id='life-album';root.dir=rtl?'rtl':'ltr';
 const header=el('header','life-album-header');header.append(el('p','life-album-eyebrow',c.eyebrow),el('h2','',c.title),el('p','life-album-intro',c.intro));root.append(header);
 const stage=el('div','life-album-stage');
 const chapterIndex=el('nav','life-album-index');chapterIndex.setAttribute('aria-label',c.aria);
 const pageWrap=el('div','life-album-pages');pageWrap.setAttribute('aria-live','polite');
 const pager=el('div','life-album-pager');
 const previous=el('button','life-album-page-button',c.previous);previous.type='button';
 const status=el('span','life-album-page-status','');
 const next=el('button','life-album-page-button is-next',c.next);next.type='button';
 pager.append(previous,status,next);stage.append(chapterIndex,pageWrap,pager);root.append(stage);
 const chapterList=[];
 let active=0;
 const selectPage=(index)=>{
  active=Math.max(0,Math.min(chapterList.length-1,index));
  pageWrap.querySelectorAll('.life-album-spread').forEach((p,i)=>{p.hidden=i!==active});
  chapterIndex.querySelectorAll('button').forEach((b,i)=>{b.setAttribute('aria-pressed',i===active?'true':'false')});
  previous.disabled=active===0;next.disabled=active===chapterList.length-1;
  status.textContent=String(active+1).padStart(2,'0')+' / '+String(chapterList.length).padStart(2,'0')+' · '+chapterList[active].era;
 };
 const render=(chapters)=>{
  chapters.forEach((chapter,i)=>{
   const tab=el('button','life-album-tab');tab.type='button';tab.setAttribute('aria-pressed','false');
   tab.append(el('small','',chapter.index+' · '+chapter.era),el('strong','',value(chapter.kicker)),el('span','',value(chapter.age)));
   tab.addEventListener('click',()=>selectPage(i));chapterIndex.append(tab);
   pageWrap.append(buildPage(chapter,i,chapters.length));chapterList.push(chapter);
  });
  previous.addEventListener('click',()=>selectPage(active-1));next.addEventListener('click',()=>selectPage(active+1));
  root.addEventListener('keydown',event=>{
   if(event.altKey||event.ctrlKey||event.metaKey)return;
   if(event.target.closest('a,button,input,textarea,select'))return;
   if((rtl&&event.key==='ArrowLeft')||(!rtl&&event.key==='ArrowRight')){event.preventDefault();selectPage(active+1)}
   if((rtl&&event.key==='ArrowRight')||(!rtl&&event.key==='ArrowLeft')){event.preventDefault();selectPage(active-1)}
  });
  selectPage(0);
 };
 const reorder=()=>{
  const order=['media','facebook-instagram','audience-voices','visual-archive','work','originals','longform','writing','publication-scale','impact-wall','now-pulse','audience-pulse','topics','action-router','now','commenter-call','launch-proof-strip','start-here','restoration-status','storyflow','story','igor-film','personal-moments','social-depth'];
  const hero=main.querySelector(':scope > .hero')||main.querySelector('.hero');
  if(hero){main.insertBefore(root,hero.nextSibling)}else{main.prepend(root)}
  order.forEach(id=>{const section=document.getElementById(id);if(section&&section.parentElement===main)main.append(section)});
  const primary=main.querySelector('.hero .actions .btn.primary');
  if(primary){primary.href='#life-album';primary.textContent=c.enter}
  const secondary=main.querySelector('.hero .actions .btn:not(.primary)');
  if(secondary){secondary.href='#work';secondary.textContent=c.work}
 };
 fetch('/knowledge/igor-life-album-20261127.json',{credentials:'same-origin'})
  .then(response=>{if(!response.ok)throw new Error('life album data unavailable');return response.json()})
  .then(data=>{
   if(!Array.isArray(data.chapters)||data.chapters.length!==8)throw new Error('life album chapter contract failed');
   render(data.chapters);reorder();
  })
  .catch(error=>{console.warn('[7YA life album]',error)});
})();