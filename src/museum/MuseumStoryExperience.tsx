import { useEffect, useMemo, useState } from 'react';
import { api } from '@appdeploy/client';
import { ArrowUpLeft, Check, ExternalLink, Eye, Globe2, Sparkles, X } from 'lucide-react';
import { useLocale } from '../locale';
import {
    buildStoryMoments,
    questionForIndex,
    type MuseumLocale,
    type ProjectionMoment,
    type StoryMoment,
} from './museum-narrative-core';
import {
    buildGalaxyClusters,
    buildImpactTrace,
    type ImpactLedgerRecord,
} from './museum-impact-galaxy-core';
import MuseumImpactTrace from './MuseumImpactTrace';
import MuseumGalaxyView from './MuseumGalaxyView';
import './museum-story-experience.css';

type ProjectionResponse = { items?: ProjectionMoment[] };
type ImpactResponse = { records?: ImpactLedgerRecord[] };
type LoadState = 'loading' | 'ready' | 'unavailable';

const copy = {
    he: {
        eyebrow: 'STORY MODE · CANON + IMPACT', title: 'אל תקרא על החיים שלי. תיכנס אליהם.', intro: 'כל תחנה כאן נפתחת מתוך הקאנון הציבורי. אני מספר את החיבור; המקור נשאר לידך כדי לבדוק אותי.', source: 'למקור המקורי', proof: 'מקור מאומת', impact: 'IMPACT · צילום מצב מתוארך', impactIntro: 'אלה מדדים מקומיים למקור או לפלטפורמה. הם לא מחוברים לסכום מלאכותי אחד.', noMomentImpact: 'לרגע הזה אין כרגע מדד ציבורי מאומת שמקושר ישירות למקור. הנה מדדים ציבוריים אחרים מהארכיון.', correct: 'בדיוק. זה הפרק הבא.', wrong: 'לא כאן. זה פרק אמיתי — פשוט לא התחנה הבאה במסלול המתועד.', continue: 'פתח את הפרק הבא', finish: 'הגעת לעכשיו', finishText: 'מכאן המוזיאון נשאר פתוח: אפשר לרדת לכרונולוגיה המלאה, למדיה ולראיות.', loading: 'מרכיב את המסלול מהמקורות החיים…', unavailable: 'Story Mode לא הצליח לטעון כרגע. המוזיאון המלא והמקורות ממשיכים כרגיל מתחת.', trust: 'סטטוס מקור', archiveImpact: 'מדדים ציבוריים מהארכיון',
    },
    en: {
        eyebrow: 'STORY MODE · CANON + IMPACT', title: 'Do not just read my life. Step into it.', intro: 'Every station is resolved from the public canon. I narrate the connection; the source stays beside you so you can verify it.', source: 'Open original source', proof: 'Source bound', impact: 'IMPACT · dated snapshot', impactIntro: 'These are source- or platform-local metrics. They are never merged into one synthetic total.', noMomentImpact: 'This Moment has no directly source-bound public metric right now. Here are other verified public signals from the archive.', correct: 'Exactly. This is the next chapter.', wrong: 'Not here. That is a real chapter — just not the documented next stop.', continue: 'Open the next chapter', finish: 'You reached now', finishText: 'From here the museum stays open: continue into the full chronology, media and evidence below.', loading: 'Building the path from live sources…', unavailable: 'Story Mode is temporarily unavailable. The full museum and its sources remain available below.', trust: 'Source status', archiveImpact: 'Public archive metrics',
    },
    ru: {
        eyebrow: 'STORY MODE · CANON + IMPACT', title: 'Не просто читайте мою жизнь. Войдите в неё.', intro: 'Каждая остановка собирается из публичного канона. Я связываю историю, а источник остаётся рядом, чтобы всё можно было проверить.', source: 'Открыть оригинал', proof: 'Источник подтверждён', impact: 'IMPACT · датированный снимок', impactIntro: 'Это локальные метрики источника или платформы. Они не складываются в искусственный общий охват.', noMomentImpact: 'Для этого момента сейчас нет публичной метрики, напрямую связанной с источником. Ниже — другие проверенные сигналы из архива.', correct: 'Точно. Это следующая глава.', wrong: 'Не здесь. Это реальная глава — просто не следующая остановка в документированном пути.', continue: 'Открыть следующую главу', finish: 'Вы дошли до настоящего', finishText: 'Дальше музей остаётся открытым: полная хронология, медиа и доказательства находятся ниже.', loading: 'Собираю маршрут из живых источников…', unavailable: 'Story Mode временно не загрузился. Полный музей и источники ниже продолжают работать.', trust: 'Статус источника', archiveImpact: 'Публичные метрики архива',
    },
} as const;

const metricLabels: Record<string, Record<MuseumLocale, string>> = {
    views:{he:'צפיות',en:'views',ru:'просмотры'}, accounts_reached:{he:'חשבונות שנחשפו',en:'accounts reached',ru:'охваченные аккаунты'}, followers:{he:'עוקבים',en:'followers',ru:'подписчики'}, account_likes:{he:'לייקים בחשבון',en:'account likes',ru:'лайки аккаунта'}, subscribers:{he:'מנויים',en:'subscribers',ru:'подписчики'}, active_users:{he:'משתמשים פעילים',en:'active users',ru:'активные пользователи'}, average_watch_time:{he:'זמן צפייה ממוצע',en:'average watch time',ru:'среднее время просмотра'}, exported_items:{he:'פריטים בייצוא',en:'exported items',ru:'материалы в выгрузке'},
};
const labelMetric=(name:string,locale:MuseumLocale)=>metricLabels[name]?.[locale]||name.replaceAll('_',' ');
const dateLabel=(raw:string,locale:MuseumLocale)=>{if(!raw)return'';const date=new Date(raw);if(Number.isNaN(date.getTime()))return raw.slice(0,10);return new Intl.DateTimeFormat(locale==='he'?'he-IL':locale==='ru'?'ru-RU':'en-US',{year:'numeric',month:'short',day:'numeric'}).format(date)};
const sourceKey=(raw:string)=>{try{const url=new URL(raw);return(url.origin+url.pathname).replace(/\/$/,'').toLowerCase()}catch{return raw.replace(/\/$/,'').toLowerCase()}};

function MomentVisual({moment}:{moment:StoryMoment}){
    if(!moment.imageUrl)return <div className='museum-story-visual museum-story-visual-empty'><Sparkles/><span>{moment.platform||moment.publisher}</span></div>;
    return <figure className='museum-story-visual'><img src={moment.imageUrl} alt={moment.displayTitle} loading='eager' referrerPolicy='no-referrer' onError={event=>{event.currentTarget.style.display='none';event.currentTarget.parentElement?.classList.add('museum-story-visual-empty')}}/><figcaption>{moment.year||moment.date.slice(0,4)} · {moment.platform||moment.publisher}</figcaption></figure>;
}

export default function MuseumStoryExperience(){
    const {locale}=useLocale();
    const lang=locale as MuseumLocale;
    const c=copy[lang];
    const [state,setState]=useState<LoadState>('loading');
    const [projectionItems,setProjectionItems]=useState<ProjectionMoment[]>([]);
    const [moments,setMoments]=useState<StoryMoment[]>([]);
    const [impactRecords,setImpactRecords]=useState<ImpactLedgerRecord[]>([]);
    const [index,setIndex]=useState(0);
    const [wrongIds,setWrongIds]=useState<string[]>([]);
    const [revealed,setRevealed]=useState(false);

    useEffect(()=>{let active=true;Promise.allSettled([api.get('/api/public-projection?sort=oldest&limit=220'),api.get('/api/media-impact')]).then(results=>{if(!active)return;const projectionResult=results[0];if(projectionResult.status!=='fulfilled'){setState('unavailable');return}const projection=(projectionResult.value.data||{}) as ProjectionResponse;const rawItems=Array.isArray(projection.items)?projection.items:[];const resolved=buildStoryMoments(rawItems,lang);if(resolved.length<2){setState('unavailable');return}setProjectionItems(rawItems);setMoments(resolved);const impactResult=results[1];if(impactResult.status==='fulfilled'){const impact=(impactResult.value.data||{}) as ImpactResponse;setImpactRecords((Array.isArray(impact.records)?impact.records:[]).filter(record=>record.public_claim_ok!==false&&Boolean(record.url)))}else setImpactRecords([]);setIndex(0);setWrongIds([]);setRevealed(false);setState('ready')}).catch(()=>active&&setState('unavailable'));return()=>{active=false}},[lang]);

    const current=moments[index];
    const next=moments[index+1];
    const question=useMemo(()=>questionForIndex(moments,index,lang),[moments,index,lang]);
    const trace=useMemo(()=>current?buildImpactTrace(current,projectionItems,impactRecords):null,[current,projectionItems,impactRecords]);
    const galaxyClusters=useMemo(()=>buildGalaxyClusters(moments,projectionItems,impactRecords),[moments,projectionItems,impactRecords]);
    const impactSignals=useMemo(()=>{if(!current)return[];const key=sourceKey(current.sourceUrl);const direct=impactRecords.filter(record=>sourceKey(record.url)===key);const pool=direct.length?direct:impactRecords;return [...pool].sort((a,b)=>{const postDelta=Number(b.scope==='post')-Number(a.scope==='post');if(postDelta)return postDelta;return Date.parse(b.collected_at||'')-Date.parse(a.collected_at||'')}).slice(0,4)},[current,impactRecords]);
    const hasDirectImpact=useMemo(()=>current?impactRecords.some(record=>sourceKey(record.url)===sourceKey(current.sourceUrl)):false,[current,impactRecords]);
    const choose=(choiceId:string,correct:boolean)=>{if(revealed)return;if(correct){setRevealed(true);return}setWrongIds(previous=>previous.includes(choiceId)?previous:[...previous,choiceId])};
    const advance=()=>{if(!next)return;setIndex(value=>Math.min(value+1,moments.length-1));setWrongIds([]);setRevealed(false)};
    const jumpToChapter=(canonicalId:string)=>{const targetIndex=moments.findIndex(moment=>moment.canonicalId===canonicalId);if(targetIndex<0)return;setIndex(targetIndex);setWrongIds([]);setRevealed(false);requestAnimationFrame(()=>document.getElementById('museum-story-title')?.scrollIntoView({behavior:'smooth',block:'start'}))};

    if(state==='loading')return <section className='museum-story-shell museum-story-state' aria-live='polite'><Sparkles/><p>{c.loading}</p></section>;
    if(state==='unavailable'||!current)return <section className='museum-story-shell museum-story-state museum-story-unavailable' aria-live='polite'><Globe2/><div><strong>STORY MODE</strong><p>{c.unavailable}</p></div></section>;

    return <section className='museum-story-shell' aria-labelledby='museum-story-title'>
        <header className='museum-story-header'><div><span><Sparkles/>{c.eyebrow}</span><h2 id='museum-story-title'>{c.title}</h2><p>{c.intro}</p></div><div className='museum-story-progress' aria-label={`${index+1} / ${moments.length}`}><b>{String(index+1).padStart(2,'0')}</b><span>/ {String(moments.length).padStart(2,'0')}</span></div></header>
        <div className='museum-story-stage'><MomentVisual moment={current}/><article className='museum-story-moment'><div className='museum-story-meta'><span>{current.year||current.date.slice(0,4)}</span><span>{current.chapterLabel}</span><span>{current.trust}</span></div><h3>{current.displayTitle}</h3><p className='museum-story-first-person'>{current.narrative}</p>{current.displaySummary&&<p className='museum-story-summary'>{current.displaySummary}</p>}<div className='museum-story-proof'><span><Check/>{c.proof}</span><span>{c.trust}: {current.trust}</span><a href={current.sourceUrl} target='_blank' rel='noreferrer'>{c.source}<ExternalLink/></a></div></article></div>
        {trace&&<MuseumImpactTrace trace={trace} title={current.chapterLabel} locale={lang}/>} 
        {question&&!revealed&&<div className='museum-story-question'><div><span>YOUR MOVE</span><h3>{question.prompt}</h3></div><div className='museum-story-choices'>{question.choices.map(choice=>{const wrong=wrongIds.includes(choice.id);return <button key={choice.id} type='button' className={wrong?'is-wrong':''} onClick={()=>choose(choice.id,choice.correct)} aria-pressed={wrong}><span>{choice.year||'—'}</span><strong>{choice.label}</strong>{wrong?<X/>:<ArrowUpLeft/>}</button>})}</div>{wrongIds.length>0&&<p className='museum-story-feedback is-wrong' aria-live='polite'>{c.wrong}</p>}</div>}
        {revealed&&next&&<div className='museum-story-reveal' aria-live='polite'><span><Check/>{c.correct}</span><h3>{next.chapterLabel}</h3><p>{next.narrative}</p><button type='button' onClick={advance}>{c.continue}<ArrowUpLeft/></button></div>}
        {!question&&!next&&<div className='museum-story-reveal museum-story-finish'><span><Sparkles/>{c.finish}</span><p>{c.finishText}</p></div>}
        {!question&&next&&!revealed&&<div className='museum-story-reveal'><span><Check/>{next.chapterLabel}</span><button type='button' onClick={advance}>{c.continue}<ArrowUpLeft/></button></div>}
        <aside className='museum-story-impact'><header><span><Eye/>{c.impact}</span><p>{c.impactIntro}</p></header>{!hasDirectImpact&&impactSignals.length>0&&<p className='museum-story-impact-note'>{c.noMomentImpact}</p>}<div className='museum-story-impact-grid'>{impactSignals.map(record=><a key={`${record.url}-${record.metric_name}-${record.collected_at}`} href={record.url} target='_blank' rel='noreferrer'><small>{record.platform} · {dateLabel(record.collected_at,lang)}</small><strong>{record.metric_display}</strong><span>{labelMetric(record.metric_name,lang)}</span><em>{record.verification_status}</em></a>)}</div>{impactSignals.length===0&&<p className='museum-story-impact-note'>{c.archiveImpact}: —</p>}</aside>
        <MuseumGalaxyView clusters={galaxyClusters} locale={lang} activeCanonicalId={current.canonicalId} onChapterSelect={jumpToChapter}/>
    </section>;
}
