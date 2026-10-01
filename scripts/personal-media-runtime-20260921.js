(()=>{
  // 7YA SOURCE-ONLY MEDIA RUNTIME · 2026-10-01
  // Never invent, rotate, or duplicate a fallback image to fill a missing visual.
  // A broken/missing visual stays an explicit source frame so the page preserves truth.
  const contentSelector='.social-card,.live-social-item,.media-density-card,.visual-tile,.storyflow-evidence,.source-shot,.original-card,.card.media,.pulse-card--media,.seven-proof-visual,.seven-route-depth-card.image,.personal-moment';

  const isContentImage=img=>{
    const descriptor=[img.className,img.id,img.alt,img.getAttribute('src'),img.closest?.('[class]')?.className]
      .filter(Boolean).join(' ').toLowerCase();
    if(/favicon|icon|logo|avatar|emoji|flag|badge|qr/.test(descriptor))return false;
    if(img.closest(contentSelector))return true;
    const rect=img.getBoundingClientRect?.();
    return !!rect&&(rect.width>=160||rect.height>=160);
  };

  const markMissing=img=>{
    if(!img?.isConnected||img.dataset.personalMediaRecovery==='done'||!isContentImage(img))return;
    img.dataset.personalMediaRecovery='done';
    img.dataset.personalMedia='missing-no-fallback';
    img.removeAttribute('srcset');
    img.hidden=true;
    const container=img.closest(contentSelector)||img.parentElement;
    if(container){
      container.dataset.mediaState='missing-source';
      container.classList.add('seven-source-media-missing');
    }
  };

  const wireImages=(root=document)=>{
    const imgs=root.matches?.('img')?[root]:[...root.querySelectorAll?.('img')||[]];
    imgs.forEach(img=>{
      if(img.dataset.personalMediaWired)return;
      img.dataset.personalMediaWired='source-only';
      img.addEventListener('error',()=>markMissing(img),{once:true});
      if(img.complete&&img.naturalWidth===0)markMissing(img);
    });
  };

  const markExplicitPlaceholders=(root=document)=>{
    const selector='[data-placeholder-media],.media-placeholder,.image-placeholder,.photo-placeholder,.visual-placeholder,.poster-placeholder,.social-frame';
    const nodes=root.matches?.(selector)?[root]:[...root.querySelectorAll?.(selector)||[]];
    nodes.forEach(node=>{
      node.dataset.mediaState='source-frame';
      node.classList.add('seven-source-frame');
    });
  };

  const scan=(root=document)=>{
    wireImages(root);
    markExplicitPlaceholders(root);
  };

  let queued=false;
  const scheduleScan=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;scan(document)});
  };

  const start=()=>{
    scan(document);
    new MutationObserver(mutations=>{
      for(const mutation of mutations){
        for(const node of mutation.addedNodes){
          if(node.nodeType===1){scheduleScan();return;}
        }
      }
    }).observe(document.documentElement,{childList:true,subtree:true});
    window.__7yaPersonalMedia={mode:'source-only',duplicateFallbacks:false};
    document.documentElement.dataset.personalMediaRuntime='20261001-source-only';
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
})();
