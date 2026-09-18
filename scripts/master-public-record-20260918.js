
(()=>{const grid=document.getElementById('masterPublicGrid');if(!grid)return;
const q=document.getElementById('masterPublicSearch'),buttons=[...document.querySelectorAll('[data-master-filter]')],shown=document.getElementById('masterPublicShown'),load=document.getElementById('masterPublicMore');
let all=[],filter='all',limit=60;
const metricLabels={views:'views',reach:'reach',likes_reactions:'likes/reactions',comments:'comments',shares:'shares',saves:'saves',other_interactions:'interactions'};
function searchable(r){return [r.id,r.year,r.date,r.object_type,r.relationship,r.platform,r.publisher,r.title,r.capacity,r.verification].join(' ').toLowerCase()}
function matches(r){const s=(q?.value||'').trim().toLowerCase();if(s&&!searchable(r).includes(s))return false;if(filter==='all')return true;if(filter==='metrics')return Object.keys(r.metrics||{}).length>0;if(filter==='public-url')return !!r.url;if(filter==='archive')return !!r.archive_only;return r.platform===filter}
function timeKey(r){const y=/^\d{4}$/.test(r.year||'')?Number(r.year):0;const c=/^\d{8}$/.test(r.chronology||'')&&r.chronology!=='99999999'?Number(r.chronology):0;return c||y*10000}
function card(r){const el=document.createElement(r.url?'a':'div');el.className='master-record-card';if(r.url){el.href=r.url;el.target='_blank';el.rel='noreferrer'}el.dataset.platform=r.platform||'';el.dataset.political=String(!!r.political);
const meta=document.createElement('small');meta.textContent=[r.platform||'RECORD',r.year||'DATE UNRESOLVED',r.political?'CIVIC / POLITICAL ARCHIVE':r.object_type||'PUBLIC RECORD'].join(' · ');el.append(meta);
const h=document.createElement('h3');h.textContent=r.title||r.id;el.append(h);
const p=document.createElement('p');p.textContent=[r.publisher,r.relationship].filter(Boolean).join(' · ');el.append(p);
const ms=Object.entries(r.metrics||{});if(ms.length){const wrap=document.createElement('div');wrap.className='record-metrics';ms.slice(0,5).forEach(([k,v])=>{const s=document.createElement('span');s.textContent=Number(v).toLocaleString('en-US')+' '+(metricLabels[k]||k);wrap.append(s)});el.append(wrap)}
const ft=document.createElement('footer');const v=document.createElement('span');v.textContent=r.verification||r.source_class||'ledger';const o=document.createElement('b');o.textContent=r.url?'למקור ↗':'רשומת ledger';ft.append(v,o);el.append(ft);return el}
function render(){const rows=all.filter(matches).sort((a,b)=>timeKey(b)-timeKey(a)||(b.id||'').localeCompare(a.id||''));grid.replaceChildren();rows.slice(0,limit).forEach(r=>grid.append(card(r)));if(shown)shown.textContent=rows.length.toLocaleString('he-IL');if(load){load.hidden=rows.length<=limit;load.textContent='טען עוד '+Math.min(60,Math.max(0,rows.length-limit)).toLocaleString('he-IL')}}
buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.masterFilter;limit=60;render()}));q?.addEventListener('input',()=>{limit=60;render()});load?.addEventListener('click',()=>{limit+=60;render()});
fetch('/knowledge/master-public-record-20260918.json',{cache:'no-store'}).then(r=>r.json()).then(d=>{all=Array.isArray(d.records)?d.records:[];render()}).catch(()=>{grid.innerHTML='<p>ה־Master Public Record לא נטען כרגע.</p>'});
})();