const states={
  verified_direct:{label:'מחובר ומאומת',className:'verified'},
  verified_metricool:{label:'זמין דרך Metricool',className:'verified'},
  needs_oauth:{label:'דורש הרשאה',className:'pending'},
  session_needed:{label:'דורש התחברות',className:'pending'},
  legacy:{label:'Legacy',className:'muted'},
  unknown:{label:'לא אומת',className:'muted'}
};
const connectedStates=new Set(['verified_direct','verified_metricool']);
const container=document.querySelector('#connections');
const nextSlot=document.querySelector('#next-card');
let records=[];

function makeAction(record){
  if(record.action_mode==='copy_prompt'&&record.connect_prompt){
    const button=document.createElement('button');
    button.className='action action-button';
    button.type='button';
    button.innerHTML='<span>העתק פקודת חיבור</span><b>↗</b>';
    button.setAttribute('aria-label',`העתק פקודת חיבור עבור ${record.label}`);
    button.addEventListener('click',async()=>{
      try{
        await navigator.clipboard.writeText(record.connect_prompt);
        button.querySelector('span').textContent='הועתק — חזור לצ׳אט';
        setTimeout(()=>{button.querySelector('span').textContent='העתק פקודת חיבור'},2200);
      }catch{
        window.prompt('העתק את פקודת החיבור:',record.connect_prompt);
      }
    });
    return button;
  }
  const link=document.createElement('a');
  link.className='action';
  link.target='_blank';
  link.rel='noopener noreferrer';
  link.href=record.manage_url;
  link.innerHTML=`<span>${connectedStates.has(record.known_state)?'פתח / נהל':'פתח שירות'}</span><b>↗</b>`;
  link.setAttribute('aria-label',`${connectedStates.has(record.known_state)?'ניהול':'פתיחת'} ${record.label}`);
  return link;
}

function card(record,compact=false){
  const el=document.createElement('article');
  el.className='card';
  el.dataset.category=record.category;
  const state=states[record.known_state]||states.unknown;
  const head=document.createElement('div');
  head.className='card-head';
  head.innerHTML=`<div><div class="meta-line"><span class="rank">PRIORITY ${record.priority}</span><span class="route"></span></div><h3></h3></div><span class="status ${state.className}"></span>`;
  head.querySelector('h3').textContent=record.label;
  head.querySelector('.route').textContent=record.route||'—';
  head.querySelector('.status').textContent=state.label;
  el.append(head);

  const purpose=document.createElement('p');
  purpose.className='purpose';
  purpose.textContent=record.purpose;
  el.append(purpose);

  const evidence=document.createElement('p');
  evidence.className='evidence';
  evidence.textContent=record.evidence_summary||'אין תיעוד אימות עדכני.';
  el.append(evidence);

  const outputTitle=document.createElement('span');
  outputTitle.className='outputs-title';
  outputTitle.textContent='מה נכנס ל־Igor Core';
  el.append(outputTitle);
  const outputs=document.createElement('div');
  outputs.className='outputs';
  record.core_outputs.forEach(value=>{const tag=document.createElement('span');tag.textContent=value;outputs.append(tag)});
  el.append(outputs);

  if(record.observed_at){
    const observed=document.createElement('small');
    observed.className='observed';
    observed.textContent=`נבדק: ${record.observed_at}`;
    el.append(observed);
  }
  el.append(makeAction(record));
  if(compact)el.classList.add('compact');
  return el;
}

function render(filter='all'){
  container.replaceChildren();
  const visible=records.filter(r=>filter==='all'||r.category===filter).sort((a,b)=>b.priority-a.priority);
  visible.forEach(r=>container.append(card(r)));
  const ready=records.filter(r=>connectedStates.has(r.known_state)).length;
  const actionable=records.filter(r=>!connectedStates.has(r.known_state)&&r.known_state!=='legacy').length;
  document.querySelector('#connected-count').textContent=ready;
  document.querySelector('#next-count').textContent=actionable;
  const next=records.filter(r=>!connectedStates.has(r.known_state)&&!['legacy','session_needed'].includes(r.known_state)).sort((a,b)=>b.priority-a.priority)[0];
  nextSlot.replaceChildren(...(next?[card(next,true)]:[]));
}

fetch('/data/connections.json',{credentials:'same-origin'})
  .then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()})
  .then(data=>{records=data.connections||[];render()})
  .catch(()=>{container.innerHTML='<p class="load-error">רשימת החיבורים לא נטענה כרגע. אין שינוי במצב החיבורים.</p>'});

document.querySelector('.filters').addEventListener('click',event=>{
  const button=event.target.closest('button[data-filter]');
  if(!button)return;
  document.querySelectorAll('.filters button').forEach(b=>b.classList.toggle('active',b===button));
  render(button.dataset.filter);
});
