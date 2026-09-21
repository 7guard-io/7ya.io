(()=>{
const grid=document.getElementById('liveSocialGrid'),count=document.getElementById('liveSocialCount'),empty=document.getElementById('liveSocialEmpty'),search=document.getElementById('liveSocialSearch'),buttons=[...document.querySelectorAll('[data-live-filter]')];
if(!grid)return;
const lang=(document.documentElement.lang||'he').toLowerCase().split('-')[0];
const copy={
 he:{media:'מדיה מקורית',owned:'שלי',external:'חיצוני',record:'רשומה',undated:'תאריך לא הושלם',source:'למקור ↗',fallback:'הקורפוס החברתי לא נטען כרגע — מוצגת תצוגת גיבוי מחוברת למקורות.',original:'רשומת מקור בשפת המקור.'},
 en:{media:'Original media',owned:'Owned',external:'External',record:'Record',undated:'Date unresolved',source:'Open source ↗',fallback:'The social corpus is unavailable right now — showing a source-linked fallback view.',original:'Original Hebrew source record — open the source for the full original text.'},
 ru:{media:'Оригинальное медиа',owned:'Моё',external:'Внешнее',record:'Запись',undated:'Дата не определена',source:'Открыть источник ↗',fallback:'Социальный корпус сейчас недоступен — показана резервная версия со ссылками на источники.',original:'Оригинальная запись на иврите — откройте источник для полного исходного текста.'},
 ar:{media:'وسائط أصلية',owned:'مملوك',external:'خارجي',record:'سجل',undated:'التاريخ غير محدد',source:'فتح المصدر ↗',fallback:'المجموعة الاجتماعية غير متاحة حالياً — يتم عرض نسخة احتياطية مرتبطة بالمصادر.',original:'سجل مصدر أصلي بالعبرية — افتح المصدر للنص الأصلي الكامل.'}
 }[lang]||null;
const c=copy||{media:'Original media',owned:'Owned',external:'External',record:'Record',undated:'Date unresolved',source:'Open source ↗',fallback:'The social corpus is unavailable right now.',original:'Original source record.'};
const hasHebrew=value=>/[\u0590-\u05ff]/u.test(String(value||''));
const locale=lang==='he'?'he-IL':lang==='ru'?'ru-RU':lang==='ar'?'ar':'en-US';
let items=[],filter='all';
const metricLabels={views:'views',reach:'reach',likes:'likes',reactions:'reactions',comments:'comments',shares:'shares',saves:'saves',interactions:'interactions'};
const metricText=(m={})=>Object.entries(metricLabels).filter(([k])=>m[k]!=null).map(([k,l])=>[l,m[k]]);
function matches(i){
 const q=(search?.value||'').trim().toLowerCase();
 const hay=[i.title,i.summary,i.platform,i.theme,i.kind,...(i.audience_reactions||[])].join(' ').toLowerCase();
 if(q&&!hay.includes(q))return false;
 if(filter==='Facebook'||filter==='Instagram')return i.platform===filter;
 if(filter==='owned')return i.owned===true;
 if(filter==='external')return i.owned===false;
 if(filter==='comments')return (i.audience_reactions||[]).length>0||(i.metrics?.comments||0)>0;
 return true;
}
function card(i){
 const a=document.createElement('a');a.className='live-social-item'+(i.featured?' featured':'')+(i.archive_only?' archive':'');a.href=i.url||'#';a.target='_blank';a.rel='noreferrer';
 if(i.image){const media=document.createElement('img');media.className='live-social-media';media.src=i.image;media.alt=i.title||c.media;media.loading='lazy';media.decoding='async';media.referrerPolicy='no-referrer';a.append(media)}
 const meta=document.createElement('small');meta.textContent=[i.platform,i.owned===true?c.owned:i.owned===false?c.external:c.record,i.date||c.undated].join(' · ');a.append(meta);
 const h=document.createElement('h3');h.textContent=i.title||'Untitled record';if(lang!=='he'&&hasHebrew(i.title)){h.lang='he';h.dir='rtl'}a.append(h);
 const p=document.createElement('p');p.textContent=lang!=='he'&&hasHebrew(i.summary)?c.original:(i.summary||'');a.append(p);
 const metrics=metricText(i.metrics);if(metrics.length){const m=document.createElement('div');m.className='live-social-metrics';for(const [label,value] of metrics){const s=document.createElement('span');s.textContent=Number(value).toLocaleString(locale)+' '+label;m.append(s)}a.append(m)}
 if(i.audience_reactions?.length){const v=document.createElement('div');v.className='live-social-voices';for(const quote of i.audience_reactions.slice(0,3)){const q=document.createElement('q');q.textContent=quote;v.append(q)}a.append(v)}
 const foot=document.createElement('div');foot.className='live-social-foot';const source=document.createElement('span');source.textContent=i.metric_source||i.kind||'source-linked';const open=document.createElement('b');open.textContent=c.source;foot.append(source,open);a.append(foot);
 return a;
}
function render(){grid.replaceChildren();const visible=items.filter(matches);visible.forEach(i=>grid.append(card(i)));if(count)count.textContent=visible.length.toLocaleString(locale);if(empty)empty.hidden=visible.length>0}
buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.liveFilter;render()}));search?.addEventListener('input',render);
fetch('/knowledge/social-corpus-20260918.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('feed');return r.json()}).then(d=>{items=Array.isArray(d.moments)?d.moments:[];render()}).catch(()=>{const fallbackCount=grid.children.length;if(count)count.textContent=fallbackCount?Number(fallbackCount).toLocaleString(locale):'—';if(empty){empty.hidden=fallbackCount>0;empty.textContent=c.fallback}});
})();
