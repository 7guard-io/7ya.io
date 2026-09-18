(()=>{
  const section=document.querySelector('[data-social-first-home]');
  if(!section)return;
  const rail=section.querySelector('.social-rail');
  if(!rail)return;

  const fmt=(n)=>new Intl.NumberFormat('en-US',{notation:Number(n)>=10000?'compact':'standard',maximumFractionDigits:1}).format(Number(n));
  const metricText=(item)=>{
    if(item.metric_display)return item.metric_display;
    const m=item.metrics;
    if(!m)return '';
    const out=[];
    if(Number.isFinite(m.views))out.push(`${fmt(m.views)} views`);
    if(Number.isFinite(m.impressions))out.push(`${fmt(m.impressions)} impressions`);
    if(Number.isFinite(m.reach))out.push(`${fmt(m.reach)} reach`);
    if(Number.isFinite(m.likes))out.push(`${fmt(m.likes)} likes`);
    if(Number.isFinite(m.reactions))out.push(`${fmt(m.reactions)} reactions`);
    if(Number.isFinite(m.comments))out.push(`${fmt(m.comments)} comments`);
    if(Number.isFinite(m.shares))out.push(`${fmt(m.shares)} shares`);
    return out.slice(0,4).join(' · ');
  };

  const classify=(item)=>{
    const values=[
      item.theme,
      item.kind,
      item.platform,
      item.owned===true?'owned':'',
      item.owned===false?'external':''
    ].filter(Boolean).join(' ').toLowerCase();
    return values;
  };

  const make=(item)=>{
    const a=document.createElement('a');
    a.className='social-card'+(item.featured?' featured':'')+(item.owned===false?' external-item':'');
    a.href=item.url;
    a.target='_blank';
    a.rel='noreferrer';
    a.dataset.socialCorpus=item.id;
    a.dataset.feedClass=classify(item);

    if(item.image){
      const img=document.createElement('img');
      img.src=item.image;
      img.alt=item.title;
      img.loading='lazy';
      img.decoding='async';
      a.append(img);
    }else{
      const frame=document.createElement('div');
      frame.className='social-frame';
      const b=document.createElement('b');
      b.textContent=item.platform;
      const em=document.createElement('em');
      em.textContent=item.date||'PUBLIC SOURCE';
      frame.append(b,em);
      a.append(frame);
    }

    const copy=document.createElement('div');
    copy.className='social-copy';

    const meta=document.createElement('div');
    meta.className='social-meta';
    const platform=document.createElement('span');
    platform.textContent=item.platform;
    const date=document.createElement('span');
    date.textContent=item.date||'ARCHIVE';
    meta.append(platform,date);

    const h=document.createElement('h3');
    h.textContent=item.title;
    const p=document.createElement('p');
    p.textContent=item.summary;

    copy.append(meta,h,p);

    const metric=metricText(item);
    if(metric){
      const strong=document.createElement('strong');
      strong.textContent=metric;
      copy.append(strong);
    }

    const ownership=document.createElement('span');
    ownership.className='ownership';
    ownership.textContent=item.owned===false?'הפצה חיצונית':item.owned===true?'תוכן שלי':'מקור ציבורי';
    copy.append(ownership);

    const small=document.createElement('small');
    small.textContent=`${item.metric_source||'Public source'}${item.metric_as_of?` · ${item.metric_as_of}`:''} ↗`;
    copy.append(small);

    a.append(copy);
    return a;
  };

  const applyFilter=(filter)=>{
    rail.querySelectorAll('.social-card').forEach(card=>{
      const classes=card.dataset.feedClass||'';
      let show=true;
      if(filter==='all'&&classes.includes('archive'))show=false;
      if(filter==='impact')show=classes.includes('impact')&&!classes.includes('archive');
      else if(filter==='archive')show=classes.includes('archive');
      else if(filter==='facebook')show=classes.includes('facebook');
      else if(filter==='instagram')show=classes.includes('instagram');
      else if(filter==='owned')show=classes.includes('owned');
      else if(filter==='external')show=classes.includes('external');
      else if(filter==='longform')show=classes.includes('longform')||classes.includes('podcast');
      else if(filter==='music')show=classes.includes('music')||classes.includes('artist_catalog');
      else if(filter==='research')show=classes.includes('research');
      card.classList.toggle('is-filtered-out',!show);
    });
  };

  fetch('/knowledge/social-corpus-20260918.json',{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error(`social corpus HTTP ${r.status}`);return r.json();})
    .then(data=>{
      if(!Array.isArray(data.moments)||!data.moments.length)return;
      const fragment=document.createDocumentFragment();
      data.moments.forEach(item=>fragment.append(make(item)));
      rail.replaceChildren(fragment);
      rail.setAttribute('aria-label',`${data.moments.length} רגעים אמיתיים מכל הרשתות והמקורות של איגור ופרצקי`);
      const count=section.querySelector('[data-feed-count]');if(count)count.textContent=String(data.moments.length);
      const head=section.querySelector('.igor-live-head p');
      if(head)head.textContent=`${data.moments.length} רגעים ציבוריים: תוכן בבעלותי, שיחות ארוכות, מוזיקה, כתיבה והפצה חיצונית מסומנת. כל כרטיס מחובר למקור.`;
      section.dataset.socialCorpusLoaded='20260918-rich';
      const activeFilter=section.querySelector('[data-feed-filter].is-active')?.dataset.feedFilter||'all';
      applyFilter(activeFilter);
    })
    .catch(err=>console.warn('[7YA] social corpus fallback',err));

  const controls=section.querySelectorAll('[data-feed-filter]');
  controls.forEach(button=>button.addEventListener('click',()=>{
    controls.forEach(other=>other.classList.remove('is-active'));
    button.classList.add('is-active');
    applyFilter(button.dataset.feedFilter||'all');
  }));
})();