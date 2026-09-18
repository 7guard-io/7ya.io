
(()=>{const root=document.querySelector('[data-seven-proof-layer]');if(!root)return;
const grid=root.querySelector('[data-seven-proof-context]'),count=root.querySelector('[data-seven-proof-count]');
const path=location.pathname.replace(/^\/+|\/+$/g,'')||'home';
const routes={
starton:['linkedin-starton-20260913','youtube-starton-20260213','facebook-channel13-starton-2022','wikimedia-starton-onepager-20221229'],
'igor-vepretski':['facebook-fatherhood-statusim','instagram-fatherhood-statusim-20230220','instagram-russian-identity-statusim','facebook-left-police-20230701','instagram-road-remembers-20251227','instagram-abba-rusi-20251114'],
history:['facebook-fatherhood-statusim','facebook-russian-identity-statusim-2023','facebook-grandmother-scam-statusim-20230207','facebook-hazinor-legacy-hit','youtube-first-upload-20111027','instagram-road-remembers-20251227'],
journey:['facebook-left-police-20230701','instagram-grandmother-scam-statusim','tiktok-life-story-20260909','spotify-life-episode-20240101','instagram-russian-identity-statusim'],
research:['linkedin-supernoah-20260909','linkedin-7ya-20260912','linkedin-founder-led-20260701','tiktok-youth-systems-20260612'],
speaker:['spotify-life-episode-20240101','youtube-story-20260421','linkedin-identity-20260911','facebook-fatherhood-statusim'],
talk:['spotify-life-episode-20240101','youtube-story-20260421','instagram-love-commitment-20241119','instagram-road-remembers-20251227'],
media:['instagram-special-ingredient-20231123','facebook-fatherhood-statusim','facebook-mial-newsonline','instagram-russian-identity-statusim','instagram-grandmother-scam-statusim','instagram-bizzi-cmt-20250819'],
influence:['instagram-special-ingredient-20231123','facebook-fatherhood-statusim','facebook-mial-newsonline','instagram-fatherhood-statusim-20230220','instagram-russian-identity-statusim','instagram-grandmother-scam-statusim'],
evidence:['instagram-special-ingredient-20231123','facebook-fatherhood-statusim','instagram-august-2023-insights','instagram-2025-insights-window'],
ledger:['instagram-special-ingredient-20231123','facebook-fatherhood-statusim','instagram-august-2023-insights','instagram-2025-insights-window'],
verify:['instagram-special-ingredient-20231123','facebook-fatherhood-statusim','instagram-august-2023-insights','instagram-2025-insights-window'],
'7ya':['linkedin-7ya-20260912','tiktok-life-story-20260909','instagram-special-ingredient-20231123','facebook-fatherhood-statusim'],
home:['instagram-special-ingredient-20231123','facebook-fatherhood-statusim','facebook-mial-newsonline','instagram-russian-identity-statusim','instagram-grandmother-scam-statusim','instagram-abba-rusi-20251114']
};
const fallback=routes.home, ids=routes[path]||fallback;
const metricKeys={views:'views',reach:'reach',likes:'likes',reactions:'reactions',comments:'comments',shares:'shares',saves:'saves',interactions:'interactions'};
const card=i=>{const a=document.createElement('a');a.className='seven-proof-card';a.href=i.url||'/influence/';a.target='_blank';a.rel='noreferrer';a.dataset.platform=i.platform||'';
const sm=document.createElement('small');sm.textContent=[i.platform,i.owned===true?'OWNED':i.owned===false?'EXTERNAL':'PUBLIC',i.date||'DATE UNRESOLVED'].join(' · ');a.append(sm);
const h=document.createElement('h3');h.textContent=i.title||'Public record';a.append(h);
const p=document.createElement('p');p.textContent=i.summary||'';a.append(p);
const metrics=Object.entries(metricKeys).filter(([k])=>i.metrics&&i.metrics[k]!=null);if(metrics.length){const m=document.createElement('div');m.className='seven-proof-card-metrics';metrics.slice(0,4).forEach(([k,l])=>{const s=document.createElement('span');s.textContent=Number(i.metrics[k]).toLocaleString('en-US')+' '+l;m.append(s)});a.append(m)}
(i.audience_reactions||[]).slice(0,2).forEach(v=>{const q=document.createElement('q');q.textContent=v;a.append(q)});
const b=document.createElement('b');b.textContent='למקור ↗';a.append(b);return a};
fetch('/knowledge/social-corpus-20260918.json',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject()).then(d=>{const items=Array.isArray(d.moments)?d.moments:[];if(count)count.textContent=String(items.length);const by=new Map(items.map(i=>[i.id,i]));const selected=ids.map(id=>by.get(id)).filter(Boolean).filter(i=>!i.political&&!i.archive_only);if(grid){grid.replaceChildren();selected.forEach(i=>grid.append(card(i)))}}).catch(()=>{});
})();