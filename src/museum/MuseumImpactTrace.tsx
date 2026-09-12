import { Activity, ExternalLink, Route, ShieldCheck } from 'lucide-react';
import type { MuseumLocale } from './museum-narrative-core';
import type { ImpactTrace } from './museum-impact-galaxy-core';
import './museum-impact-galaxy.css';

const copy = {
    he: {eyebrow:'IMPACT TRACE · SOURCE BOUND',title:'איך הרגע הזה זז בעולם.',moment:'MOMENT',surfaces:'משטחים ציבוריים',signals:'אותות מתוארכים',empty:'אין כרגע מדד ציבורי שמקושר ישירות למקורות של הרגע הזה.',rule:'אין כאן Total סינתטי. כל מספר נשאר מחובר למקור, לפלטפורמה ולתאריך שלו.'},
    en: {eyebrow:'IMPACT TRACE · SOURCE BOUND',title:'How this moment moved through the world.',moment:'MOMENT',surfaces:'Public surfaces',signals:'Dated signals',empty:'There is no public metric directly bound to this Moment’s sources right now.',rule:'There is no synthetic total here. Every number stays bound to its source, platform and date.'},
    ru: {eyebrow:'IMPACT TRACE · SOURCE BOUND',title:'Как этот момент двигался по публичному пространству.',moment:'MOMENT',surfaces:'Публичные поверхности',signals:'Датированные сигналы',empty:'Сейчас нет публичной метрики, напрямую связанной с источниками этого момента.',rule:'Здесь нет синтетического Total. Каждое число остаётся связано с источником, платформой и датой.'},
} as const;

const metricLabels: Record<string, Record<MuseumLocale, string>> = {
    views:{he:'צפיות',en:'views',ru:'просмотры'},shares:{he:'שיתופים',en:'shares',ru:'репосты'},reactions:{he:'תגובות רגשיות',en:'reactions',ru:'реакции'},accounts_reached:{he:'חשבונות שנחשפו',en:'accounts reached',ru:'охваченные аккаунты'},followers:{he:'עוקבים',en:'followers',ru:'подписчики'},account_likes:{he:'לייקים בחשבון',en:'account likes',ru:'лайки аккаунта'},subscribers:{he:'מנויים',en:'subscribers',ru:'подписчики'},active_users:{he:'משתמשים פעילים',en:'active users',ru:'активные пользователи'},average_watch_time:{he:'זמן צפייה ממוצע',en:'average watch time',ru:'среднее время просмотра'},exported_items:{he:'פריטים בייצוא',en:'exported items',ru:'материалы в выгрузке'},
};
const metricLabel=(name:string,locale:MuseumLocale)=>metricLabels[name]?.[locale]||name.replaceAll('_',' ');

export default function MuseumImpactTrace({trace,title,locale}:{trace:ImpactTrace;title:string;locale:MuseumLocale}){
    const c=copy[locale];
    return <section className='museum-impact-trace' data-impact-trace={trace.canonicalId} aria-labelledby={`impact-trace-${trace.canonicalId}`}>
        <header><span><Route/>{c.eyebrow}</span><h3 id={`impact-trace-${trace.canonicalId}`}>{c.title}</h3></header>
        <div className='museum-impact-trace-grid'>
            <article className='museum-impact-trace-moment'><small>01 · {c.moment}</small><strong>{title}</strong><span>{trace.surfaces[0]?.year||'—'}</span></article>
            <article><small>02 · {c.surfaces}</small><div className='museum-impact-source-list'>{trace.surfaces.slice(0,5).map(surface=><a key={surface.url} href={surface.url} target='_blank' rel='noreferrer'><b>{surface.platform||surface.publisher}</b><span>{surface.publisher}</span><ExternalLink/></a>)}</div></article>
            <article><small>03 · {c.signals}</small>{trace.metrics.length>0?<div className='museum-impact-metric-list'>{trace.metrics.slice(0,6).map(metric=><a key={`${metric.sourceUrl}-${metric.metricName}-${metric.metricDisplay}-${metric.date}`} href={metric.sourceUrl} target='_blank' rel='noreferrer'><Activity/><div><strong>{metric.metricDisplay}</strong><span>{metricLabel(metric.metricName,locale)}</span></div><small>{metric.platform} · {metric.date.slice(0,10)}</small></a>)}</div>:<p className='museum-impact-empty'>{c.empty}</p>}</article>
        </div>
        <footer><ShieldCheck/><p>{c.rule}</p></footer>
    </section>;
}
