(()=>{
  'use strict';
  const root=document.querySelector('[data-living-explorer]');
  if(!root)return;
  const ui={
    search:root.querySelector('[data-archive-search]'),
    year:root.querySelector('[data-archive-year]'),
    domain:root.querySelector('[data-archive-domain]'),
    status:root.querySelector('[data-archive-status]'),
    grid:root.querySelector('[data-archive-grid]')
  };
  if(Object.values(ui).some(node=>!node))return;

  const collections=[
    {id:'life',label:'מאגר החיים',path:'/knowledge/master-public-record-20260918.json',key:'records'},
    {id:'social',label:'קורפוס חברתי',path:'/knowledge/social-corpus-20260918.json',key:'moments'},
    {id:'universe',label:'מפת מקורות',path:'/knowledge/public-universe-records-20260715.json',key:'records'}
  ];
  const state={collection:'life',records:[],query:'',year:'all',domain:'all',request:0};
  const asText=value=>value===null||value===undefined?'':String(value);
  const safeExternalUrl=value=>{
    if(typeof value!=='string'||!value.trim())return '';
    try{
      const url=new URL(value.trim(),window.location.origin);
      if(!['http:','https:'].includes(url.protocol)||url.username||url.password)return '';
      return url.href;
    }catch{return '';}
  };
  const element=(tag,className,content)=>{
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(content!==undefined)node.textContent=asText(content);
    return node;
  };
  const normalized=(item,source)=>{
    const date=asText(item.date||item.year);
    const year=(date.match(/\\b(19|20)\\d{2}\\b/)||[])[0]||'לא מתוארך';
    const metric=item.metric_display||item.metric?.value||Object.entries(item.metrics||{})
      .filter(([,value])=>value!==null&&value!==undefined)
      .map(([key,value])=>`${key}: ${asText(value)}`).join(' · ');
    return {
      source,
      year,
      title:asText(item.title||item.id||'רשומה ללא כותרת'),
      summary:asText(item.summary||item.relationship||item.object_type||''),
      platform:asText(item.platform||item.publisher||'מקור ציבורי'),
      type:asText(item.kind||item.type||item.object_type||'רשומה'),
      url:safeExternalUrl(item.url),
      verification:asText(item.verification||item.evidence_tier||'SOURCE PENDING'),
      metric:asText(metric),
      domain:asText(item.act||item.theme||item.themes?.[0]||'archive')
    };
  };
  function render(){
    const query=state.query.toLocaleLowerCase('he');
    const filtered=state.records.filter(item=>{
      const hay=[item.title,item.summary,item.platform,item.type,item.domain].join(' ').toLocaleLowerCase('he');
      return(!query||hay.includes(query))&&(state.year==='all'||item.year===state.year)&&(state.domain==='all'||item.domain===state.domain);
    }).slice(0,90);
    ui.status.textContent=`${filtered.length} רשומות מוצגות מתוך ${state.records.length} בשכבת ${collections.find(item=>item.id===state.collection).label}.`;
    const fragment=document.createDocumentFragment();
    filtered.forEach(item=>{
      const card=element('article','archive-explorer-card');
      card.append(element('small','',`${item.source} · ${item.verification}`));
      card.append(element('h3','',item.title));
      card.append(element('p','',item.summary));
      const meta=element('div','archive-explorer-card__meta');
      meta.append(document.createTextNode([
        item.year,item.platform,item.type
      ].filter(Boolean).join(' · ')));
      if(item.metric){meta.append(document.createElement('br'));meta.append(document.createTextNode(item.metric));}
      meta.append(document.createElement('br'));
      if(item.url){
        const link=element('a','', 'פתיחת המקור ↗');
        link.href=item.url;
        link.target='_blank';
        link.rel='noopener noreferrer';
        meta.append(link);
      }else{
        meta.append(document.createTextNode('ללא URL ציבורי תקין ברשומה זו'));
      }
      card.append(meta);
      fragment.append(card);
    });
    if(!filtered.length)fragment.append(element('p','living-explorer__notice','לא נמצאו רשומות לפי הסינון. נסו שנה, תחום או ניסוח אחר.'));
    ui.grid.replaceChildren(fragment);
  }
  function setOptions(select,values,allLabel){
    const fragment=document.createDocumentFragment();
    const all=element('option','',allLabel);all.value='all';fragment.append(all);
    values.forEach(value=>{const option=element('option','',value);option.value=value;fragment.append(option);});
    select.replaceChildren(fragment);
  }
  function options(){
    const years=[...new Set(state.records.map(item=>item.year).filter(year=>/^\\d{4}$/.test(year)))].sort().reverse();
    const domains=[...new Set(state.records.map(item=>item.domain).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'he'));
    setOptions(ui.year,years,'כל השנים');
    setOptions(ui.domain,domains,'כל התחומים');
  }
  async function load(id){
    const collection=collections.find(item=>item.id===id);
    if(!collection)return;
    const request=++state.request;
    state.collection=id;
    state.records=[];
    state.year='all';state.domain='all';
    ui.status.textContent='טוען שכבת מקור…';
    ui.grid.replaceChildren();
    root.querySelectorAll('[data-archive-collection]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.archiveCollection===id)));
    try{
      const response=await fetch(collection.path,{cache:'no-store'});
      if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const json=await response.json();
      if(request!==state.request)return;
      const rows=json&&Array.isArray(json[collection.key])?json[collection.key]:null;
      if(!rows)throw new Error('Unexpected source schema');
      state.records=rows.filter(item=>item&&typeof item==='object').map(item=>normalized(item,collection.label));
      options();
      render();
    }catch(error){
      if(request!==state.request)return;
      ui.status.textContent='טעינת שכבת המקור נכשלה. אפשר לפתוח את קובצי ה־JSON ישירות למטה.';
      ui.grid.replaceChildren(element('p','living-explorer__notice','לא נטען מידע. נסו שוב מאוחר יותר או פתחו את קובץ המקור הישיר.'));
    }
  }
  root.querySelectorAll('[data-archive-collection]').forEach(button=>button.addEventListener('click',()=>load(button.dataset.archiveCollection)));
  ui.search.addEventListener('input',event=>{state.query=event.target.value;render();});
  ui.year.addEventListener('change',event=>{state.year=event.target.value;render();});
  ui.domain.addEventListener('change',event=>{state.domain=event.target.value;render();});
  load('life');
})();
