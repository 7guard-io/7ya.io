import {useEffect,useRef,useState} from 'react';
import {useLocale} from '../locale';
import BroadcastStream from '../album/BroadcastStream';
import ViralFeed from '../ViralFeed';
import LivingPulse from './LivingPulse';
import HumanEchoMap from './HumanEchoMap';
import StartOnWalkthrough from './StartOnWalkthrough';
import FutureLayer from './FutureLayer';
import MemoryPortal from './MemoryPortal';
import SystemLensDeck from './SystemLensDeck';
import PersonalChronology from '../life-first/PersonalChronology';
import MomentEngine from '../life-album/MomentEngine';
import './personal-internet.css';
import './visual-richness.css';
import './world-gateway.css';
import './personal-album-pass.css';
const nav={he:['עולם','הסיפור','ציר החיים','Broadcast','Posts','הד','עדשות','StartOn','עתיד','זיכרון'],en:['World','Story','Life line','Broadcast','Posts','Echo','Lenses','StartOn','Future','Memory'],ru:['Мир','История','Линия жизни','Broadcast','Posts','Эхо','Слои','StartOn','Будущее','Память']} as const;
const ids=['pi-pulse','life-moments','life-chronology','pi-broadcast','viral-live','pi-echo','pi-lenses','pi-starton','pi-future','pi-memory'] as const;
export default function PersonalInternetHome(){const {locale,dir}=useLocale();const [activeIndex,setActiveIndex]=useState(0);const navRef=useRef<HTMLElement>(null);useEffect(()=>{const observer=new IntersectionObserver(entries=>{const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>Math.abs(a.boundingClientRect.top)-Math.abs(b.boundingClientRect.top))[0];if(!current)return;const index=ids.indexOf(current.target.id as typeof ids[number]);if(index>=0)setActiveIndex(index)},{rootMargin:'-18% 0px -68% 0px',threshold:[0,.01]});ids.forEach(id=>{const node=document.getElementById(id);if(node)observer.observe(node)});return()=>observer.disconnect()},[]);useEffect(()=>{const navNode=navRef.current;const active=navNode?.querySelector<HTMLElement>(`[data-pi-index='${activeIndex}']`);if(!navNode||!active||navNode.scrollWidth<=navNode.clientWidth)return;const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;active.scrollIntoView({behavior:reduced?'auto':'smooth',block:'nearest',inline:'center'})},[activeIndex]);return <main className='pi-home' dir={dir}><nav ref={navRef} className='pi-orbit-nav' aria-label='Personal Internet layers' data-active-index={activeIndex}><i className='pi-orbit-progress' style={{transform:`scaleX(${(activeIndex+1)/ids.length})`}} aria-hidden='true'/>{ids.map((id,index)=><a href={'#'+id} key={id} data-pi-index={index} className={activeIndex===index?'is-active':undefined} aria-current={activeIndex===index?'location':undefined}><span dir='ltr'>{String(index+1).padStart(2,'0')}</span>{nav[locale][index]}</a>)}</nav><LivingPulse/><MomentEngine/><PersonalChronology/><BroadcastStream mode='portal'/><ViralFeed/><HumanEchoMap/><SystemLensDeck/><StartOnWalkthrough/><FutureLayer/><MemoryPortal/></main>}
