import { useEffect, useMemo, useState } from 'react';
import { ArrowUpLeft, ExternalLink, Orbit, ShieldCheck, Sparkles } from 'lucide-react';
import type { MuseumLocale } from './museum-narrative-core';
import type { GalaxyCluster } from './museum-impact-galaxy-core';
import './museum-impact-galaxy.css';

const copy = {
    he:{eyebrow:'LIFE GALAXY · EVIDENCE GRAVITY',title:'החיים כמערכת שאפשר לטייל בה.',intro:'איגור במרכז. כל צביר הוא פרק חיים. הגודל שלו נקבע רק לפי מספר מקורות ציבוריים ייחודיים ומדדים ישירים שמקושרים אליהם.',center:'IGOR',sources:'מקורות',metrics:'מדדים ישירים',detail:'מה מחזיק את הצביר הזה',openStory:'פתח את הפרק ב־Story Mode',rule:'כבידה אינה “חשיפה”. היא מדד ניווט פנימי של צפיפות ראייתית בלבד.'},
    en:{eyebrow:'LIFE GALAXY · EVIDENCE GRAVITY',title:'A life you can navigate as a system.',intro:'Igor is at the center. Every cluster is a life chapter. Its size is driven only by unique public sources and directly bound public metrics.',center:'IGOR',sources:'sources',metrics:'direct metrics',detail:'What holds this cluster together',openStory:'Open this chapter in Story Mode',rule:'Gravity is not reach. It is only an internal navigation measure of evidence density.'},
    ru:{eyebrow:'LIFE GALAXY · EVIDENCE GRAVITY',title:'Жизнь как система, по которой можно путешествовать.',intro:'Игорь в центре. Каждый кластер — глава жизни. Размер определяется только уникальными публичными источниками и напрямую связанными метриками.',center:'ИГОРЬ',sources:'источников',metrics:'прямых метрик',detail:'Что удерживает этот кластер',openStory:'Открыть главу в Story Mode',rule:'Гравитация — не охват. Это только внутренний показатель плотности доказательств для навигации.'},
} as const;

const positions=[{x:50,y:12},{x:82,y:30},{x:82,y:70},{x:50,y:88},{x:18,y:70},{x:18,y:30}];

export default function MuseumGalaxyView({clusters,locale,activeCanonicalId,onChapterSelect}:{clusters:GalaxyCluster[];locale:MuseumLocale;activeCanonicalId:string;onChapterSelect:(canonicalId:string)=>void}){
    const c=copy[locale];
    const [selectedId,setSelectedId]=useState(activeCanonicalId);
    useEffect(()=>setSelectedId(activeCanonicalId),[activeCanonicalId]);
    const selected=useMemo(()=>clusters.find(cluster=>cluster.canonicalId===selectedId)||clusters[0],[clusters,selectedId]);
    if(clusters.length<2||!selected)return null;
    return <section className='museum-galaxy' aria-labelledby='museum-galaxy-title'>
        <header><div><span><Orbit/>{c.eyebrow}</span><h3 id='museum-galaxy-title'>{c.title}</h3></div><p>{c.intro}</p></header>
        <div className='museum-galaxy-canvas'>
            <svg viewBox='0 0 100 100' aria-hidden='true'>{clusters.slice(0,positions.length).map((cluster,index)=><line key={cluster.canonicalId} x1='50' y1='50' x2={positions[index].x} y2={positions[index].y}/>)}</svg>
            <div className='museum-galaxy-center'><Sparkles/><strong>{c.center}</strong><span>1990—NOW</span></div>
            {clusters.slice(0,positions.length).map((cluster,index)=>{const position=positions[index];const size=Math.min(146,78+cluster.gravity*5);return <button type='button' key={cluster.canonicalId} data-galaxy-node={cluster.canonicalId} className={`${selected.canonicalId===cluster.canonicalId?'is-selected ':''}${activeCanonicalId===cluster.canonicalId?'is-current':''}`} style={{left:`${position.x}%`,top:`${position.y}%`,width:size,height:size}} onClick={()=>setSelectedId(cluster.canonicalId)} aria-pressed={selected.canonicalId===cluster.canonicalId}><small>{cluster.year||'—'}</small><strong>{cluster.label}</strong><span>{cluster.sourceCount} {c.sources} · {cluster.metricCount} {c.metrics}</span></button>})}
        </div>
        <article className='museum-galaxy-detail' data-galaxy-detail={selected.canonicalId}>
            <div className='museum-galaxy-detail-copy'><small>{c.detail}</small><h4>{selected.label}</h4><p><b>{selected.sourceCount}</b> {c.sources} · <b>{selected.metricCount}</b> {c.metrics}</p><button type='button' onClick={()=>onChapterSelect(selected.canonicalId)}>{c.openStory}<ArrowUpLeft/></button></div>
            <div className='museum-galaxy-sources'>{selected.surfaces.slice(0,4).map(surface=><a key={surface.url} href={surface.url} target='_blank' rel='noreferrer'><span>{surface.platform||surface.publisher}</span><strong>{surface.publisher}</strong><ExternalLink/></a>)}</div>
            <div className='museum-galaxy-metrics'>{selected.metrics.slice(0,4).map(metric=><a key={`${metric.sourceUrl}-${metric.metricName}-${metric.metricDisplay}-${metric.date}`} href={metric.sourceUrl} target='_blank' rel='noreferrer'><strong>{metric.metricDisplay}</strong><span>{metric.metricName.replaceAll('_',' ')}</span><small>{metric.platform} · {metric.date.slice(0,10)}</small></a>)}</div>
        </article>
        <footer><ShieldCheck/><p>{c.rule}</p></footer>
    </section>;
}
