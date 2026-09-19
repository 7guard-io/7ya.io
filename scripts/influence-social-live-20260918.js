
(()=>{
const grid=document.getElementById('liveSocialGrid'),count=document.getElementById('liveSocialCount'),empty=document.getElementById('liveSocialEmpty'),search=document.getElementById('liveSocialSearch'),buttons=[...document.querySelectorAll('[data-live-filter]')];
if(!grid)return;
let items=[],filter='all';
const metricLabels={views:'views',reach:'reach',likes:'likes',reactions:'reactions',comments:'comments',shares:'shares',saves:'saves',interactions:'interactions'};
const esc=(v='')=>String(v);
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
 if(i.image){const media=document.createElement('img');media.className='live-social-media';media.src=i.image;media.alt=i.title||'מדיה מקורית';media.loading='lazy';media.decoding='async';media.referrerPolicy='no-referrer';a.append(media)}
 const meta=document.createElement('small');meta.textContent=[i.platform,i.owned===true?'OWNED':i.owned===false?'EXTERNAL':'RECORD',i.date||'DATE UNRESOLVED'].join(' · ');a.append(meta);
 const h=document.createElement('h3');h.textContent=i.title||'Untitled record';a.append(h);
 const p=document.createElement('p');p.textContent=i.summary||'';a.append(p);
 const metrics=metricText(i.metrics);if(metrics.length){const m=document.createElement('div');m.className='live-social-metrics';for(const [label,value] of metrics){const s=document.createElement('span');s.textContent=Number(value).toLocaleString('en-US')+' '+label;m.append(s)}a.append(m)}
 if(i.audience_reactions?.length){const v=document.createElement('div');v.className='live-social-voices';for(const quote of i.audience_reactions.slice(0,3)){const q=document.createElement('q');q.textContent=quote;v.append(q)}a.append(v)}
 const foot=document.createElement('div');foot.className='live-social-foot';const source=document.createElement('span');source.textContent=i.metric_source||i.kind||'source-linked';const open=document.createElement('b');open.textContent='למקור ↗';foot.append(source,open);a.append(foot);
 return a;
}
function render(){grid.replaceChildren();const visible=items.filter(matches);visible.forEach(i=>grid.append(card(i)));count.textContent=visible.length.toLocaleString('he-IL');if(empty)empty.hidden=visible.length>0}
buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.liveFilter;render()}));search?.addEventListener('input',render);
fetch('/knowledge/social-corpus-20260918.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('feed');return r.json()}).then(d=>{items=Array.isArray(d.moments)?d.moments:[];render()}).catch(()=>{const fallbackCount=grid.children.length;if(count)count.textContent=fallbackCount?String(fallbackCount):'—';if(empty){empty.hidden=fallbackCount>0;empty.textContent='הקורפוס החברתי לא נטען כרגע — מוצגת תצוגת גיבוי מחוברת למקורות.'}});
})();
