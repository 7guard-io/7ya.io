(()=>{
  const progress=document.getElementById('sevenGlobalProgress');
  const update=()=>{if(!progress)return;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`};
  addEventListener('scroll',update,{passive:true});
  addEventListener('resize',update,{passive:true});
  update();

  const placeholders=['טוען…','טוען...','טוען את מפת המערכת','טוען מדדים','טוען מדדי מבנה','טוען את מסלול ההתפתחות','טוען את מפת הקשרים'];
  document.querySelectorAll('p,span,div,li').forEach((element)=>{
    const text=(element.textContent||'').trim();
    if(element.children.length===0&&placeholders.some((value)=>text===value||text.startsWith(value))) element.remove();
  });

  document.querySelectorAll('img').forEach((image)=>{
    image.style.maxWidth='100%';
    if(!image.closest('.hero,[class*="cover"],[class*="portrait"]')) image.style.height='auto';
  });
})();
