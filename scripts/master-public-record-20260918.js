(()=>{const grid=document.getElementById('masterPublicGrid');if(!grid)return;
const q=document.getElementById('masterPublicSearch'),buttons=[...document.querySelectorAll('[data-master-filter]')],shown=document.getElementById('masterPublicShown'),load=document.getElementById('masterPublicMore');
const lang=(document.documentElement.lang||'he').toLowerCase().split('-')[0];
const copy={
 he:{record:'רשומה',undated:'תאריך לא הושלם',civic:'ארכיון אזרחי / פוליטי',life:'אלבום חיים',source:'למקור ↗',ledger:'רשומת מאגר',more:'טען עוד',fail:'מאגר החיים המלא לא נטען כרגע.'},
 en:{record:'Record',undated:'Date unresolved',civic:'Civic / political archive',life:'Life album',source:'Open source ↗',ledger:'Ledger record',more:'Load more',fail:'The full life archive is unavailable right now.'},
 ru:{record:'Запись',undated:'Дата не определена',civic:'Гражданский / политический архив',life:'Альбом жизни',source:'Открыть источник ↗',ledger:'Запись реестра',more:'Показать ещё',fail:'Полный архив жизни сейчас недоступен.'},
 ar:{record:'سجل',undated:'التاريخ غير محدد',civic:'أرشيف مدني / سياسي',life:'ألبوم الحياة',source:'فتح المصدر ↗',ledger:'سجل الأرشيف',more:'تحميل المزيد',fail:'أرشيف الحياة الكامل غير متاح حالياً.'}
 }[lang]||null;
const c=copy||{record:'Record',undated:'Date unresolved',civic:'Civic / political archive',life:'Life album',source:'Open source ↗',ledger:'Ledger record',more:'Load more',fail:'The full archive is unavailable right now.'};
const locale=lang==='he'?'he-IL':lang==='ru'?'ru-RU':lang==='ar'?'ar':'en-US';
let all=[],filter='all',limit=60;
const metricLabels={views:'views',reach:'reach',likes_reactions:'likes/reactions',comments:'comments',shares:'shares',saves:'saves',other_interactions:'interactions'};
function searchable(r){return [r.id,r.year,r.date,r.object_type,r.relationship,r.platform,r.publisher,r.title,r.capacity,r.verification].join(' ').toLowerCase()}
function matches(r){const s=(q?.value||'').trim().toLowerCase();if(s&&!searchable(r).includes(s))return false;if(filter==='all')return true;if(filter==='metrics')return Object.keys(r.metrics||{}).length>0;if(filter==='public-url')return !!r.url;if(filter==='archive')return !!r.archive_only;return r.platform===filter}
function timeKey(r){const y=/^\d{4}$/.test(r.year||'')?Number(r.year):0;const ck=/^\d{8}$/.test(r.chronology||'')&&r.chronology!=='99999999'?Number(r.chronology):0;return ck||y*10000}
function card(r){const el=document.createElement(r.url?'a':'div');el.className='master-record-card';if(r.url){el.href=r.url;el.target='_blank';el.rel='noreferrer'}el.dataset.platform=r.platform||'';el.dataset.political=String(!!r.political);
const meta=document.createElement('small');meta.textContent=[r.platform||c.record,r.year||c.undated,r.political?c.civic:r.object_type||c.life].join(' · ');el.append(meta);
const h=document.createElement('h3');h.textContent=r.title||r.id;el.append(h);
const p=document.createElement('p');p.textContent=[r.publisher,r.relationship].filter(Boolean).join(' · ');el.append(p);
const ms=Object.entries(r.metrics||{});if(ms.length){const wrap=document.createElement('div');wrap.className='record-metrics';ms.slice(0,5).forEach(([k,v])=>{const s=document.createElement('span');s.textContent=Number(v).toLocaleString(locale)+' '+(metricLabels[k]||k);wrap.append(s)});el.append(wrap)}
const ft=document.createElement('footer');const v=document.createElement('span');v.textContent=r.verification||r.source_class||'ledger';const o=document.createElement('b');o.textContent=r.url?c.source:c.ledger;ft.append(v,o);el.append(ft);return el}
function render(){const rows=all.filter(matches).sort((a,b)=>timeKey(b)-timeKey(a)||(b.id||'').localeCompare(a.id||''));grid.replaceChildren();rows.slice(0,limit).forEach(r=>grid.append(card(r)));if(shown)shown.textContent=rows.length.toLocaleString(locale);if(load){load.hidden=rows.length<=limit;load.textContent=c.more+' '+Math.min(60,Math.max(0,rows.length-limit)).toLocaleString(locale)}}
buttons.forEach(b=>b.addEventListener('click',()=>{buttons.forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.masterFilter;limit=60;render()}));q?.addEventListener('input',()=>{limit=60;render()});load?.addEventListener('click',()=>{limit+=60;render()});
fetch('/knowledge/master-public-record-20260918.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('archive');return r.json()}).then(d=>{all=Array.isArray(d.records)?d.records:[];render()}).catch(()=>{grid.replaceChildren();const p=document.createElement('p');p.textContent=c.fail;grid.append(p)});
})();
