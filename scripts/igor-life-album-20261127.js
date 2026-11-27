/* 7YA · real life-album chapter index · 2026-11-27 */
(()=>{
 'use strict';
 const main=document.querySelector('body.home-page main');
 if(!main)return;
 const order=['storyflow','story','igor-film','personal-moments','work','originals','igor-live','audience-voices','social-depth','visual-archive','longform','writing','publication-scale','impact-wall','now-pulse','audience-pulse','topics','action-router','contact','commenter-call','launch-proof-strip','start-here','restoration-status'];
 const nodes=new Map([...main.children].filter(n=>n.id).map(n=>[n.id,n]));
 order.forEach(id=>{const node=nodes.get(id);if(node)main.append(node)});
 const chapters=[['story','הסיפור שלי'],['personal-moments','רגעים אישיים'],['work','StartOn והעשייה'],['originals','מוזיקה ויצירה'],['igor-live','מה שפרסמתי'],['audience-voices','התגובות שלכם'],['visual-archive','הארכיון'],['contact','הפרק הבא']];
 const nav=document.createElement('nav');nav.className='album-index';nav.setAttribute('aria-label','דפדוף בפרקי אלבום החיים');
 const label=document.createElement('span');label.className='album-index-label';label.textContent='דפדוף באלבום';nav.append(label);
 chapters.forEach(([id,title],i)=>{
  const target=document.getElementById(id);if(!target)return;
  target.dataset.albumChapter=String(i+1);
  const link=document.createElement('a');link.href='#'+id;link.textContent=String(i+1).padStart(2,'0')+' · '+title;
  link.addEventListener('click',()=>{nav.querySelectorAll('a').forEach(a=>a.removeAttribute('aria-current'));link.setAttribute('aria-current','location')});
  nav.append(link);
 });
 const header=document.querySelector('[data-launch-header]');
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
  chapters.forEach(([id])=>{const node=document.getElementById(id);if(node)observer.observe(node)});
 }
})();