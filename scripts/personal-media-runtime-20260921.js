(()=>{
  const LOCAL=[
    '/assets/personal-hero-20260716/igor-hero.webp',
    '/assets/personal-hero-20260716/igor-closeup.webp',
    '/assets/personal-hero-20260716/igor-executive.webp',
    '/assets/personal-hero-20260716/igor-public-service.webp',
    '/assets/personal-hero-20260716/igor-speaker.webp',
    '/assets/igor-home-portrait-20260712.webp'
  ];
  const MEDIA={
    identity:[
      '/assets/personal-hero-20260716/igor-closeup.webp',
      '/assets/igor-home-portrait-20260712.webp',
      'https://i.ytimg.com/vi/fxFAUrb1h0M/hqdefault.jpg'
    ],
    life:[
      '/assets/personal-hero-20260716/igor-hero.webp',
      '/assets/igor-home-portrait-20260712.webp',
      'https://i.ytimg.com/vi/fxFAUrb1h0M/hqdefault.jpg',
      'https://i.ytimg.com/vi/feGSc663qww/hqdefault.jpg'
    ],
    starton:[
      'https://i.ytimg.com/vi/SOx8DUXFIEw/hqdefault.jpg',
      'https://i.ytimg.com/vi/O3v309CA4ao/hqdefault.jpg',
      'https://i.ytimg.com/vi/SOpAglwkJ8I/hqdefault.jpg',
      '/assets/personal-hero-20260716/igor-speaker.webp'
    ],
    service:[
      '/assets/personal-hero-20260716/igor-public-service.webp',
      'https://i.ytimg.com/vi/kS2CRiqRaXo/hqdefault.jpg',
      '/assets/personal-hero-20260716/igor-executive.webp'
    ],
    speaker:[
      '/assets/personal-hero-20260716/igor-speaker.webp',
      '/assets/personal-hero-20260716/igor-executive.webp',
      'https://i.ytimg.com/vi/3h-oEuW8GJI/hqdefault.jpg'
    ],
    research:[
      '/assets/personal-hero-20260716/igor-executive.webp',
      '/assets/personal-hero-20260716/igor-speaker.webp',
      'https://i.ytimg.com/vi/3h-oEuW8GJI/hqdefault.jpg'
    ],
    music:[
      'https://i.ytimg.com/vi/jRjZjpqAgEw/hqdefault.jpg',
      'https://i.ytimg.com/vi/dhIiamSyKZk/hqdefault.jpg',
      'https://i.ytimg.com/vi/iJyEgWnGA5M/hqdefault.jpg',
      'https://i.ytimg.com/vi/k9haTADKG3M/hqdefault.jpg'
    ],
    media:[
      'https://i.ytimg.com/vi/AE5hDzLM5XU/hqdefault.jpg',
      'https://i.ytimg.com/vi/3XxoBtSL2pg/hqdefault.jpg',
      'https://i.ytimg.com/vi/3h-oEuW8GJI/hqdefault.jpg',
      '/assets/personal-hero-20260716/igor-speaker.webp'
    ]
  };

  const hash=value=>{
    let h=2166136261;
    for(const ch of String(value||'')){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}
    return h>>>0;
  };
  const textOf=node=>{
    if(!node)return location.pathname;
    return [
      location.pathname,
      node.dataset?.feedClass,
      node.dataset?.platform,
      node.dataset?.socialCorpus,
      node.getAttribute?.('href'),
      node.getAttribute?.('alt'),
      node.textContent
    ].filter(Boolean).join(' ').toLowerCase();
  };
  const bucketFor=value=>{
    const t=String(value||'').toLowerCase();
    if(/starton|youth|נוער|vr|ג[׳']?סי|jessie/.test(t))return MEDIA.starton;
    if(/police|משטר|service|security|שירות|ביטחון/.test(t))return MEDIA.service;
    if(/music|bizzi|nawan|song|שיר|מוז|creator|יציר/.test(t))return MEDIA.music;
    if(/research|academia|supernoah|מחקר|manuscript/.test(t))return MEDIA.research;
    if(/speaker|podcast|interview|ראיון|שיחה|במה|media|תקשורת/.test(t))return MEDIA.media;
    if(/identity|זהות|immig|עלייה|khark|חרקוב|russian|רוס/.test(t))return MEDIA.identity;
    return MEDIA.life;
  };
  const pick=(input,index=0)=>{
    const value=typeof input==='string'?input:[
      input?.theme,input?.kind,input?.platform,input?.title,input?.summary,input?.relationship,input?.id
    ].filter(Boolean).join(' ');
    const pool=bucketFor(value);
    return pool[(hash(value+location.pathname)+index)%pool.length];
  };
  const pickLocal=(value,index=0)=>LOCAL[(hash(value+location.pathname)+index)%LOCAL.length];

  window.__7yaPersonalMedia={pick,pickLocal,pools:MEDIA};

  const makeImage=(src,alt,extraClass='')=>{
    const img=document.createElement('img');
    img.src=src;
    img.alt=alt||'איגור ופרצקי — מדיה מקורית מארכיון 7YA';
    img.loading='lazy';
    img.decoding='async';
    img.className=['seven-personal-media-fallback',extraClass].filter(Boolean).join(' ');
    img.dataset.personalMedia='verified-fallback';
    if(/^https?:\/\//i.test(src))img.referrerPolicy='no-referrer';
    return img;
  };

  const hydrateSocialFrame=(frame,index)=>{
    if(!frame?.isConnected||frame.dataset.personalMediaHydrated)return;
    const card=frame.closest('.social-card,[data-social-corpus]');
    if(!card)return;
    const title=card.querySelector('h3')?.textContent?.trim();
    const img=makeImage(pick(textOf(card),index),title||'איגור ופרצקי — פריים מקור');
    frame.dataset.personalMediaHydrated='true';
    frame.replaceWith(img);
    card.classList.add('has-source-media');
    card.dataset.sourceMedia='personal-fallback';
  };

  const hydrateLiveCard=(card,index)=>{
    if(!card?.isConnected||card.querySelector('img'))return;
    const title=card.querySelector('h3')?.textContent?.trim();
    const img=makeImage(pick(textOf(card),index),title||'איגור ופרצקי — מדיה מקורית','live-social-media');
    card.prepend(img);
    card.dataset.personalMedia='verified-fallback';
  };

  const hydrateGeneric=(node,index)=>{
    if(!node?.isConnected||node.dataset.personalMediaHydrated)return;
    const parent=node.closest('a,article,section,figure,div')||node.parentElement;
    if(!parent)return;
    const title=parent.querySelector?.('h1,h2,h3,figcaption')?.textContent?.trim();
    const img=makeImage(pick(textOf(parent),index),title||'איגור ופרצקי — מדיה מקורית');
    node.dataset.personalMediaHydrated='true';
    if(node.matches('img'))node.replaceWith(img);
    else{
      node.replaceChildren(img);
      node.classList.add('seven-personal-media-slot');
      node.dataset.personalMedia='verified-fallback';
    }
  };

  const isContentImage=img=>{
    const descriptor=[
      img.className,img.id,img.alt,img.getAttribute('src'),
      img.closest?.('[class]')?.className
    ].filter(Boolean).join(' ').toLowerCase();
    if(/favicon|icon|logo|avatar|emoji|flag|badge|qr/.test(descriptor))return false;
    if(img.closest('.social-card,.live-social-item,.media-density-card,.visual-tile,.storyflow-evidence,.source-shot,.original-card,.card.media,.pulse-card--media,.seven-proof-visual,.seven-route-depth-card.image'))return true;
    const rect=img.getBoundingClientRect?.();
    return !!rect&&(rect.width>=160||rect.height>=160);
  };

  const recoverBroken=(img,index)=>{
    if(!img?.isConnected||img.dataset.personalMediaRecovery==='done'||!isContentImage(img))return;
    img.dataset.personalMediaRecovery='done';
    img.src=pickLocal(textOf(img.closest('a,article,section,figure,div')||img),index);
    img.dataset.personalMedia='verified-local-recovery';
    img.removeAttribute('srcset');
    img.referrerPolicy='no-referrer';
  };

  const wireImages=(root=document)=>{
    const imgs=root.matches?.('img')?[root]:[...root.querySelectorAll?.('img')||[]];
    imgs.forEach((img,index)=>{
      if(img.dataset.personalMediaWired)return;
      img.dataset.personalMediaWired='true';
      img.addEventListener('error',()=>recoverBroken(img,index),{once:true});
      if(img.complete&&img.naturalWidth===0)recoverBroken(img,index);
    });
  };

  const scan=(root=document)=>{
    const frames=root.matches?.('.social-frame')?[root]:[...root.querySelectorAll?.('.social-frame')||[]];
    frames.forEach(hydrateSocialFrame);

    const live=root.matches?.('.live-social-item')?[root]:[...root.querySelectorAll?.('.live-social-item')||[]];
    live.forEach(hydrateLiveCard);

    const social=root.matches?.('.social-card')?[root]:[...root.querySelectorAll?.('.social-card')||[]];
    social.forEach((card,index)=>{
      if(!card.querySelector('img')&&!card.querySelector('.social-frame')){
        const title=card.querySelector('h3')?.textContent?.trim();
        card.prepend(makeImage(pick(textOf(card),index),title||'איגור ופרצקי — מדיה מקורית'));
        card.classList.add('has-source-media');
        card.dataset.sourceMedia='personal-fallback';
      }
    });

    const genericSelector='[data-placeholder-media],.media-placeholder,.image-placeholder,.photo-placeholder,.visual-placeholder,.poster-placeholder';
    const generic=root.matches?.(genericSelector)?[root]:[...root.querySelectorAll?.(genericSelector)||[]];
    generic.forEach(hydrateGeneric);
    wireImages(root);
  };

  let queued=false;
  const scheduleScan=node=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;scan(node?.nodeType===1?node:document)});
  };

  const start=()=>{
    scan(document);
    new MutationObserver(mutations=>{
      for(const mutation of mutations){
        for(const node of mutation.addedNodes){
          if(node.nodeType===1)scheduleScan(node);
        }
      }
    }).observe(document.documentElement,{childList:true,subtree:true});
    document.documentElement.dataset.personalMediaRuntime='20260921';
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();