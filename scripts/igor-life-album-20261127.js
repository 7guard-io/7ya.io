/* 7YA · chronological life-album navigation · 2026-11-27 */
(()=>{
 'use strict';
 const main=document.querySelector('body.home-page main');
 if(!main)return;
 const order=['storyflow','story','igor-film','personal-moments','work','originals','media','audience-voices','facebook-instagram','social-depth','visual-archive','longform','writing','publication-scale','impact-wall','now-pulse','audience-pulse','topics','action-router','now','commenter-call','launch-proof-strip','start-here','restoration-status'];
 const nodes=new Map([...main.children].filter(n=>n.id).map(n=>[n.id,n]));
 order.forEach(id=>{const node=nodes.get(id);if(node)main.append(node)});
 const locale=(document.documentElement.lang||'he').slice(0,2);
 const labels={
  he:{aria:'דפדוף בפרקי אלבום החיים',label:'דפדוף באלבום',chapters:[['story','הסיפור שלי'],['personal-moments','רגעים אישיים'],['work','StartOn והעשייה'],['originals','מוזיקה ויצירה'],['media','מה שפרסמתי'],['facebook-instagram','התגובות שלכם'],['visual-archive','הארכיון'],['now','הפרק הבא']]},
  en:{aria:'Browse the life album chapters',label:'BROWSE THE ALBUM',chapters:[['story','My story'],['personal-moments','Personal moments'],['work','StartOn & the work'],['originals','Music & creation'],['media','What I published'],['facebook-instagram','Your responses'],['visual-archive','The archive'],['now','What comes next']]},
  ru:{aria:'Навигация по главам альбома жизни',label:'ЛИСТАТЬ АЛЬБОМ',chapters:[['story','Моя история'],['personal-moments','Личные моменты'],['work','StartOn и дело'],['originals','Музыка и творчество'],['media','Мои публикации'],['facebook-instagram','Ваши отклики'],['visual-archive','Архив'],['now','Следующая глава']]},
  ar:{aria:'تصفح فصول ألبوم الحياة',label:'تصفح الألبوم',chapters:[['story','قصتي'],['personal-moments','لحظات شخصية'],['work','StartOn والعمل'],['originals','الموسيقى والإبداع'],['media','ما نشرته'],['facebook-instagram','ردودكم'],['visual-archive','الأرشيف'],['now','الفصل التالي']]}
 };
 const copy=labels[locale]||labels.he;
 const nav=document.createElement('nav');nav.className='album-index';nav.setAttribute('aria-label',copy.aria);
 const label=document.createElement('span');label.className='album-index-label';label.textContent=copy.label;nav.append(label);
 copy.chapters.forEach(([id,title],i)=>{
  const target=document.getElementById(id);if(!target)return;
  target.dataset.albumChapter=String(i+1);
  const link=document.createElement('a');link.href='#'+id;link.textContent=String(i+1).padStart(2,'0')+' · '+title;
  link.addEventListener('click',()=>{nav.querySelectorAll('a').forEach(a=>a.removeAttribute('aria-current'));link.setAttribute('aria-current','location')});
  nav.append(link);
 });
 const header=document.querySelector('[data-launch-header]')||document.querySelector('[data-seven-human-nav]')||document.querySelector('header');
 if(header&&nav.children.length>1)header.after(nav);
 if('IntersectionObserver'in window){
  const links=[...nav.querySelectorAll('a')];
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    links.forEach(link=>{
     const active=link.hash==='#'+entry.target.id;
     if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');
    });
   });
  },{rootMargin:'-22% 0px -62% 0px',threshold:0});
  copy.chapters.forEach(([id])=>{const node=document.getElementById(id);if(node)observer.observe(node)});
 }
})();