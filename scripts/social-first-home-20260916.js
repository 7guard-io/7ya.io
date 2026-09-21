(()=>{
  const section=document.querySelector('[data-social-first-home]');
  if(!section)return;
  const rail=section.querySelector('.social-rail');
  if(!rail)return;
  const platformNav=section.querySelector('.social-platforms');
  const renderPlatforms=(platforms)=>{
    if(!platformNav||!Array.isArray(platforms)||!platforms.length)return;
    const fragment=document.createDocumentFragment();
    platforms.forEach(item=>{
      if(!item?.url)return;
      const a=document.createElement('a');
      a.href=item.url;a.target='_blank';a.rel='noopener noreferrer me';
      a.append(document.createTextNode(item.name||'Public profile'));
      const span=document.createElement('span');span.textContent=item.handle||'';a.append(span);
      fragment.append(a);
    });
    platformNav.replaceChildren(fragment);
    platformNav.dataset.socialRegistry='canonical';
  };

  const fmt=(n)=>new Intl.NumberFormat('en-US',{notation:Number(n)>=10000?'compact':'standard',maximumFractionDigits:1}).format(Number(n));
  const humanizeMetricDisplay=(value)=>String(value||'')
    .replace(/\blikes\/reactions\b/gi,'לייקים/תגובות־רגש')
    .replace(/\bimpressions\b/gi,'חשיפות')
    .replace(/\breactions\b/gi,'תגובות־רגש')
    .replace(/\bcomments\b/gi,'תגובות')
    .replace(/\bshares\b/gi,'שיתופים')
    .replace(/\bviews\b/gi,'צפיות')
    .replace(/\blikes\b/gi,'לייקים')
    .replace(/\bsaves\b/gi,'שמירות')
    .replace(/\breach\b/gi,'חשיפה')
    .replace(/\binteractions\b/gi,'אינטראקציות');
  const metricText=(item)=>{
    if(item.metric_display)return humanizeMetricDisplay(item.metric_display);
    const m=item.metrics;
    if(!m)return '';
    const out=[];
    if(Number.isFinite(m.views))out.push(`${fmt(m.views)} צפיות`);
    if(Number.isFinite(m.impressions))out.push(`${fmt(m.impressions)} חשיפות`);
    if(Number.isFinite(m.reach))out.push(`${fmt(m.reach)} חשיפה`);
    if(Number.isFinite(m.likes))out.push(`${fmt(m.likes)} לייקים`);
    if(Number.isFinite(m.likes_reactions))out.push(`${fmt(m.likes_reactions)} לייקים/תגובות־רגש`);
    if(Number.isFinite(m.reactions))out.push(`${fmt(m.reactions)} תגובות־רגש`);
    if(Number.isFinite(m.comments))out.push(`${fmt(m.comments)} תגובות`);
    if(Number.isFinite(m.shares))out.push(`${fmt(m.shares)} שיתופים`);
    if(Number.isFinite(m.saves))out.push(`${fmt(m.saves)} שמירות`);
    return out.slice(0,4).join(' · ');
  };

  const classify=(item)=>[
    item.theme,
    item.kind,
    item.object_type,
    item.relationship,
    item.platform,
    item.archive_only?'archive':'',
    item.owned===true?'owned':'',
    item.owned===false?'external':''
  ].filter(Boolean).join(' ').toLowerCase();

  const timeKey=(item)=>{
    if(/^\d{8}$/.test(String(item.chronology||''))&&String(item.chronology)!=='99999999')return Number(item.chronology);
    const date=String(item.date||'');
    if(/^\d{4}-\d{2}-\d{2}/.test(date))return Number(date.slice(0,10).replaceAll('-',''));
    const year=String(item.year||date).match(/\b(19|20)\d{2}\b/)?.[0];
    return year?Number(year)*10000:0;
  };

  const sourceMediaUrl=(item)=>[
    item.image,
    item.thumbnail,
    item.poster,
    item.media?.image,
    item.media?.thumbnail,
    item.media?.poster,
    item.media?.url,
    item.media?.src
  ].find(value=>typeof value==='string'&&/^https?:\/\//i.test(value.trim()))?.trim()||'';

  const displayScore=(item)=>{
    const cls=classify(item);
    return (sourceMediaUrl(item)?2000000000:0)
      +(item.featured?1000000000:0)
      +(cls.includes('impact')&&!cls.includes('archive')?200000000:0)
      +(item.owned===true?50000000:0)
      +(item.origin==='curated'?25000000:0)
      +(cls.includes('archive')?-10000000:0)
      +timeKey(item);
  };

  const ownershipFromRelationship=(relationship='')=>{
    const s=String(relationship).toLowerCase();
    if(/external|repost|syndicat|mirror|distribution/.test(s))return false;
    if(/owned|first.party|creator|self|original/.test(s))return true;
    return null;
  };

  const normalizeMaster=(record,generatedAt)=>({
    id:`master-${record.id}`,
    origin:'master',
    platform:record.platform||'מקור ציבורי',
    date:/^\d{4}-\d{2}-\d{2}/.test(String(record.date||''))?record.date:String(record.year||'').match(/^\d{4}$/)?.[0]||null,
    year:record.year,
    chronology:record.chronology,
    kind:record.object_type||'public_record',
    object_type:record.object_type,
    relationship:record.relationship,
    title:record.title||record.id,
    summary:[record.publisher,record.relationship,record.object_type].filter(Boolean).join(' · ')||'רשומה ציבורית מתוך הארכיון המתועד של 7YA.',
    url:record.url,
    metrics:record.metrics||{},
    metric_source:'7YA · מאגר החיים המלא',
    metric_as_of:String(generatedAt||'').slice(0,10)||null,
    owned:ownershipFromRelationship(record.relationship),
    archive_only:!!record.archive_only,
    political:!!record.political,
    verification:record.verification,
    source_class:record.source_class
  });

  const canonicalUrl=(value)=>{
    if(!value)return '';
    try{
      const u=new URL(value,location.origin);
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>u.searchParams.delete(k));
      u.hash='';
      return u.href.replace(/\/$/,'');
    }catch{return String(value).trim().replace(/\/$/,'');}
  };

  const mergeRecords=(curated,master)=>{
    const out=[],seenUrl=new Set(),seenTitle=new Set();
    const add=(item)=>{
      if(!item?.url)return;
      const url=canonicalUrl(item.url);
      const titleKey=`${String(item.platform||'').toLowerCase()}|${String(item.title||'').trim().toLowerCase()}|${String(item.date||item.year||'')}`;
      if((url&&seenUrl.has(url))||seenTitle.has(titleKey))return;
      if(url)seenUrl.add(url);
      seenTitle.add(titleKey);
      out.push(item);
    };
    curated.forEach(item=>add({...item,origin:'curated'}));
    master.filter(r=>!r.political).forEach(add);
    return out;
  };

  const makeSourceFrame=(item)=>{
    const frame=document.createElement('div');
    frame.className='social-frame';
    const b=document.createElement('b');
    b.textContent=item.platform||'מקור ציבורי';
    const em=document.createElement('em');
    em.textContent=item.date||item.year||'מקור ציבורי';
    frame.append(b,em);
    return frame;
  };

  const make=(item)=>{
    const a=document.createElement('a');
    a.className='social-card'+(item.featured?' featured':'')+(item.owned===false?' external-item':'');
    a.href=item.url;
    a.target='_blank';
    a.rel='noreferrer';
    a.dataset.socialCorpus=item.id;
    a.dataset.feedClass=classify(item);
    a.dataset.feedOrigin=item.origin||'curated';
    a.dataset.feedSearch=[item.platform,item.title,item.summary,item.date,item.year,item.kind,item.relationship].filter(Boolean).join(' ').toLowerCase();

    const sourceMedia=sourceMediaUrl(item);
    if(sourceMedia){
      const img=document.createElement('img');
      img.src=sourceMedia;
      img.alt=item.title;
      img.loading='lazy';
      img.decoding='async';
      img.referrerPolicy='no-referrer';
      img.addEventListener('error',()=>{
        if(!img.parentNode)return;
        a.replaceChild(makeSourceFrame(item),img);
        a.classList.remove('has-source-media');
        a.dataset.sourceMedia='unavailable';
      },{once:true});
      a.classList.add('has-source-media');
      a.dataset.sourceMedia='attached';
      a.append(img);
    }else{
      a.append(makeSourceFrame(item));
    }

    const copy=document.createElement('div');
    copy.className='social-copy';
    const meta=document.createElement('div');
    meta.className='social-meta';
    const platform=document.createElement('span');
    platform.textContent=item.platform||'מקור ציבורי';
    const date=document.createElement('span');
    date.textContent=item.date||item.year||'ארכיון';
    meta.append(platform,date);

    const h=document.createElement('h3');
    h.textContent=item.title||'רשומה ציבורית';
    const p=document.createElement('p');
    p.textContent=item.summary||'רשומה ציבורית מחוברת למקור.';
    copy.append(meta,h,p);

    const metric=metricText(item);
    if(metric){
      const strong=document.createElement('strong');
      strong.textContent=metric;
      copy.append(strong);
    }

    const ownership=document.createElement('span');
    ownership.className='ownership';
    ownership.textContent=item.origin==='master'
      ?(item.owned===false?'הפצה חיצונית · רשומה מהמאגר':item.owned===true?'תוכן שלי · רשומה מהמאגר':'מאגר החיים המלא')
      :(item.owned===false?'הפצה חיצונית':item.owned===true?'תוכן שלי':'מקור ציבורי');
    copy.append(ownership);

    const small=document.createElement('small');
    small.textContent=`${item.metric_source||item.verification||'מקור ציבורי'}${item.metric_as_of?` · ${item.metric_as_of}`:''} ↗`;
    copy.append(small);
    a.append(copy);
    return a;
  };

  let searchTerm='';
  const applyFilter=(filter)=>{
    rail.querySelectorAll('.social-card').forEach(card=>{
      const classes=card.dataset.feedClass||'';
      const searchable=card.dataset.feedSearch||'';
      let show=!searchTerm||searchable.includes(searchTerm);
      if(filter==='impact')show=show&&classes.includes('impact')&&!classes.includes('archive');
      else if(filter==='archive')show=show&&card.dataset.feedOrigin==='master';
      else if(filter==='facebook')show=show&&classes.includes('facebook');
      else if(filter==='instagram')show=show&&classes.includes('instagram');
      else if(filter==='tiktok')show=show&&classes.includes('tiktok');
      else if(filter==='youtube')show=show&&classes.includes('youtube');
      else if(filter==='linkedin')show=show&&classes.includes('linkedin');
      else if(filter==='spotify')show=show&&classes.includes('spotify');
      else if(filter==='owned')show=show&&classes.includes('owned');
      else if(filter==='external')show=show&&classes.includes('external');
      else if(filter==='longform')show=show&&(classes.includes('longform')||classes.includes('podcast')||classes.includes('spotify'));
      else if(filter==='music')show=show&&(classes.includes('music')||classes.includes('artist_catalog'));
      else if(filter==='research')show=show&&classes.includes('research');
      card.classList.toggle('is-filtered-out',!show);
    });
  };

  const controlsWrap=section.querySelector('.feed-controls');
  const ensureFilter=(id,label)=>{
    if(!controlsWrap||controlsWrap.querySelector(`[data-feed-filter="${id}"]`))return;
    const button=document.createElement('button');
    button.type='button';
    button.dataset.feedFilter=id;
    button.textContent=label;
    controlsWrap.append(button);
  };
  [['tiktok','TikTok'],['youtube','YouTube'],['linkedin','LinkedIn'],['spotify','Spotify']].forEach(([id,label])=>ensureFilter(id,label));

  if(controlsWrap&&!controlsWrap.querySelector('.feed-search')){
    const search=document.createElement('input');
    search.className='feed-search';
    search.type='search';
    search.placeholder='חיפוש בכל השנים והפלטפורמות…';
    search.setAttribute('aria-label','חיפוש בפיד הציבורי של איגור ופרצקי');
    controlsWrap.append(search);
    search.addEventListener('input',()=>{
      searchTerm=search.value.trim().toLowerCase();
      const active=section.querySelector('[data-feed-filter].is-active')?.dataset.feedFilter||'all';
      applyFilter(active);
    });
  }

  Promise.all([
    fetch('/knowledge/social-corpus-20260918.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`social corpus HTTP ${r.status}`);return r.json();}),
    fetch('/knowledge/master-public-record-20260918.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error(`master public record HTTP ${r.status}`);return r.json();})
  ]).then(([socialData,masterData])=>{
    renderPlatforms(socialData.platforms);
    const curated=Array.isArray(socialData.moments)?socialData.moments:[];
    const masterRaw=Array.isArray(masterData.records)?masterData.records:[];
    const master=masterRaw.filter(r=>r.url).map(r=>normalizeMaster(r,masterData.generated_at));
    const merged=mergeRecords(curated,master);
    if(!merged.length)return;

    const fragment=document.createDocumentFragment();
    const ordered=[...merged].sort((a,b)=>displayScore(b)-displayScore(a));
    ordered.forEach(item=>fragment.append(make(item)));
    rail.replaceChildren(fragment);

    const total=Number(masterData.counts?.projected_records)||masterRaw.length||merged.length;
    const publicUrls=Number(masterData.counts?.public_urls)||master.length;
    rail.setAttribute('aria-label',`${total} רשומות ציבוריות מתועדות של איגור ופרצקי, מתוכן ${publicUrls} עם מקור ציבורי`);
    const count=section.querySelector('[data-feed-count]');
    if(count)count.textContent=total.toLocaleString('he-IL');
    const head=section.querySelector('.igor-live-head p');
    if(head)head.textContent=`${total.toLocaleString('he-IL')} רשומות מתועדות במאגר החיים המלא, ${publicUrls.toLocaleString('he-IL')} עם URL ציבורי. הקורפוס האוצר נשאר בראש, והעבר מכל הפלטפורמות ממשיך אחריו — מקור, תאריך ומדדים כשיש.`;
    section.dataset.socialCorpusLoaded='20260918-master-merged';

    const activeFilter=section.querySelector('[data-feed-filter].is-active')?.dataset.feedFilter||'all';
    applyFilter(activeFilter);
  }).catch(err=>console.warn('[7YA] merged public record fallback',err));

  const controls=section.querySelectorAll('[data-feed-filter]');
  controls.forEach(button=>button.addEventListener('click',()=>{
    section.querySelectorAll('[data-feed-filter]').forEach(other=>other.classList.remove('is-active'));
    button.classList.add('is-active');
    applyFilter(button.dataset.feedFilter||'all');
  }));
})();
