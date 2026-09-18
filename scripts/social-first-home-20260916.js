(()=>{
  const section=document.querySelector('[data-social-first-home]');
  if(!section)return;

  const rail=section.querySelector('.social-rail');
  if(!rail)return;

  const fmt=(n)=>new Intl.NumberFormat('en-US',{notation:n>=10000?'compact':'standard',maximumFractionDigits:1}).format(n);
  const metrics=(m)=>{
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

  const make=(item)=>{
    const a=document.createElement('a');
    a.className='social-card'+(item.featured?' featured':'');
    a.href=item.url;
    a.target='_blank';
    a.rel='noreferrer';
    a.dataset.socialCorpus=item.id;

    if(item.image){
      const img=document.createElement('img');
      img.src=item.image;
      img.alt=item.title;
      img.loading='lazy';
      a.append(img);
    }else{
      const frame=document.createElement('div');
      frame.className='social-frame';
      const b=document.createElement('b');
      b.textContent=item.platform;
      const em=document.createElement('em');
      em.textContent=item.date||'LIVE SURFACE';
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
    date.textContent=item.date||'NOW';
    meta.append(platform,date);

    const h=document.createElement('h3');
    h.textContent=item.title;
    const p=document.createElement('p');
    p.textContent=item.summary;

    copy.append(meta,h,p);

    const metricText=metrics(item.metrics);
    if(metricText){
      const strong=document.createElement('strong');
      strong.textContent=metricText;
      copy.append(strong);
    }

    const small=document.createElement('small');
    small.textContent=`${item.metric_source||'Public source'}${item.metric_as_of?` · ${item.metric_as_of}`:''} ↗`;
    copy.append(small);
    a.append(copy);
    return a;
  };

  fetch('/knowledge/social-corpus-20260918.json',{cache:'no-store'})
    .then(r=>{if(!r.ok)throw new Error(`social corpus HTTP ${r.status}`);return r.json();})
    .then(data=>{
      if(!Array.isArray(data.moments)||!data.moments.length)return;
      const fragment=document.createDocumentFragment();
      data.moments.forEach(item=>fragment.append(make(item)));
      rail.replaceChildren(fragment);
      rail.setAttribute('aria-label','רגעים אמיתיים מכל הרשתות של איגור ופרצקי');

      const head=section.querySelector('.igor-live-head p');
      if(head)head.textContent='לא לפי פלטפורמה אלא לפי החיים: רגעים אמיתיים, וידאו, יצירה, StartOn ושיחות — כל אחד מחובר למקור המקורי שלו.';

      section.dataset.socialCorpusLoaded='20260918';
    })
    .catch(err=>{
      console.warn('[7YA] social corpus fallback',err);
    });
})();