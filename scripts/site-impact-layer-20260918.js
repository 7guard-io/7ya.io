(()=>{
  const root=document.querySelector('[data-seven-proof-layer]');
  if(!root)return;

  const grid=root.querySelector('[data-seven-proof-context]');
  const count=root.querySelector('[data-seven-proof-count]');
  const masterCount=root.querySelector('[data-seven-proof-master-count]');
  const links=root.querySelector('[data-seven-proof-links]')||root.querySelector('.seven-proof-links');
  const route=location.pathname.replace(/^\/+|\/+$/g,'')||'home';

  const canonicalUrl=(value)=>{
    if(!value)return '';
    try{
      const u=new URL(value,location.origin);
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>u.searchParams.delete(k));
      u.hash='';
      return u.href.replace(/\/$/,'');
    }catch{return String(value).trim().replace(/\/$/,'');}
  };

  const metricKeys={
    views:'views',
    reach:'reach',
    likes:'likes',
    likes_reactions:'likes/reactions',
    reactions:'reactions',
    comments:'comments',
    shares:'shares',
    saves:'saves',
    interactions:'interactions'
  };

  const searchable=(item)=>[
    item.id,item.platform,item.publisher,item.title,item.summary,item.kind,item.object_type,item.relationship,
    item.theme,item.date,item.year,item.url,item.source_url
  ].filter(Boolean).join(' ').toLowerCase();

  const normalizeMaster=(r)=>({
    id:`master-${r.id}`,
    origin:'master',
    platform:r.platform||'PUBLIC RECORD',
    publisher:r.publisher,
    title:r.title||r.id,
    summary:[r.publisher,r.relationship,r.object_type].filter(Boolean).join(' · '),
    kind:r.object_type||'public_record',
    object_type:r.object_type,
    relationship:r.relationship,
    date:/^\d{4}-\d{2}-\d{2}/.test(String(r.date||''))?r.date:(/^\d{4}$/.test(String(r.year||''))?r.year:null),
    year:r.year,
    url:r.url,
    metrics:r.metrics||{},
    political:!!r.political,
    archive_only:!!r.archive_only,
    verification:r.verification,
    source_class:r.source_class
  });

  const preferredUrl=(item)=>item.source_url||item.url||'/influence/';

  const score=(item,terms)=>{
    const hay=searchable(item);
    let value=item.origin==='curated'?18:0;
    if(item.featured)value+=30;
    if(item.owned===true)value+=8;
    if(item.archive_only)value-=20;
    for(const term of terms||[]){
      if(hay.includes(String(term).toLowerCase()))value+=12;
    }
    const m=item.metrics||{};
    if(Object.keys(m).length)value+=4;
    const year=Number(String(item.date||item.year||'').match(/\b(19|20)\d{2}\b/)?.[0]||0);
    if(year)value+=Math.max(0,year-2020);
    return value;
  };

  const card=(i)=>{
    const a=document.createElement('a');
    a.className='seven-proof-card';
    a.href=preferredUrl(i);
    if(/^https?:\/\//i.test(a.href)){a.target='_blank';a.rel='noreferrer';}
    a.dataset.platform=i.platform||'';

    const sm=document.createElement('small');
    sm.textContent=[
      i.platform||'PUBLIC',
      i.origin==='master'?'MASTER RECORD':i.owned===true?'OWNED':i.owned===false?'EXTERNAL':'PUBLIC',
      i.date||i.year||'DATE UNRESOLVED'
    ].join(' · ');
    a.append(sm);

    const h=document.createElement('h3');
    h.textContent=i.title||'Public record';
    a.append(h);

    const p=document.createElement('p');
    p.textContent=i.summary||[i.publisher,i.relationship].filter(Boolean).join(' · ')||'רשומה ציבורית מחוברת למקור.';
    a.append(p);

    const metrics=Object.entries(metricKeys).filter(([k])=>i.metrics&&i.metrics[k]!=null);
    if(metrics.length){
      const m=document.createElement('div');
      m.className='seven-proof-card-metrics';
      metrics.slice(0,4).forEach(([k,label])=>{
        const s=document.createElement('span');
        s.textContent=Number(i.metrics[k]).toLocaleString('en-US')+' '+label;
        m.append(s);
      });
      a.append(m);
    }

    (i.audience_reactions||[]).slice(0,2).forEach(v=>{
      const q=document.createElement('q');
      q.textContent=v;
      a.append(q);
    });

    const b=document.createElement('b');
    b.textContent='למקור ↗';
    a.append(b);
    return a;
  };

  const renderUniversalLinks=(surfaces)=>{
    if(!links||!Array.isArray(surfaces)||!surfaces.length)return;
    links.replaceChildren();
    surfaces.forEach(surface=>{
      const a=document.createElement('a');
      a.href=surface.href;
      if(surface.type==='external'){a.target='_blank';a.rel='noreferrer';}
      a.append(document.createTextNode(surface.label+' '));
      const span=document.createElement('span');
      span.textContent='↗';
      a.append(span);
      links.append(a);
    });
  };

  Promise.all([
    fetch('/knowledge/content-os-contract-20260918.json',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(new Error('content contract'))),
    fetch('/knowledge/social-corpus-20260918.json',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(new Error('social corpus'))),
    fetch('/knowledge/master-public-record-20260918.json',{cache:'no-store'}).then(r=>r.ok?r.json():Promise.reject(new Error('master record')))
  ]).then(([contract,social,master])=>{
    const curated=Array.isArray(social.moments)?social.moments.map(i=>({...i,origin:'curated'})):[];
    const masterItems=Array.isArray(master.records)?master.records.map(normalizeMaster):[];

    if(count)count.textContent=curated.length.toLocaleString('en-US');
    if(masterCount)masterCount.textContent=Number(master.counts?.projected_records||masterItems.length).toLocaleString('en-US');
    renderUniversalLinks(contract.universal_surfaces);

    if(!grid)return;
    const terms=contract.route_terms?.[route]||contract.route_terms?.[route.replaceAll('-','_')]||contract.route_terms?.home||[];
    const candidates=[...curated,...masterItems]
      .filter(i=>!i.political&&!i.archive_only&&preferredUrl(i))
      .map(i=>({item:i,score:score(i,terms)}))
      .sort((a,b)=>b.score-a.score);

    const selected=[];
    const seen=new Set();
    for(const entry of candidates){
      const key=canonicalUrl(preferredUrl(entry.item));
      if(!key||seen.has(key))continue;
      if(entry.score<=0&&selected.length>=4)continue;
      seen.add(key);
      selected.push(entry.item);
      if(selected.length>=6)break;
    }

    grid.replaceChildren();
    if(selected.length){
      selected.forEach(i=>grid.append(card(i)));
    }else{
      const fallback=document.createElement('a');
      fallback.className='seven-proof-card';
      fallback.href='/influence/#master-public-record';
      fallback.innerHTML='<small>MASTER PUBLIC RECORD</small><h3>434 רשומות ציבוריות</h3><p>פתחו את הרשומה המלאה לפי מקור, שנה ופלטפורמה.</p><b>לרשומה ↗</b>';
      grid.append(fallback);
    }
    root.dataset.contentOs='20260918';
  }).catch(error=>{
    console.warn('[7YA] content OS fallback',error);
  });
})();