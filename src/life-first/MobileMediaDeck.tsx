import {useMemo,useState} from 'react';
import {ArrowUpRight,Film,Images,Music2,Newspaper,Play} from 'lucide-react';
import {pageHref,useLocale} from '../locale';
import {homeVisualCorpus,type HomeVisualFrame} from '../documentary-home/visual-corpus';
import './mobile-media-deck.css';

const INITIAL_VISIBLE=16;

const copy={
  he:{
    eyebrow:'IGOR · VISUAL LIFE CORPUS · PUBLIC SOURCES',
    title:'לא רק לקרוא עליי. לראות את הדרך.',
    body:(count:number)=>`${count} פריימים מחוברים כרגע לשכבת ההקרנה — וידאו, עיתונות, פודקאסטים, מוזיקה, רשתות, StartOn ורגעים אישיים. הפריימים החזקים מגיעים ראשונים, אבל שום שכבה לא נזרקת רק כדי לשמור על עמוד קצר.`,
    all:'לכל המדיה',
    showAll:(count:number)=>`לפתוח את כל ${count} הפריימים`,
    collapse:'לחזור לבחירה העריכתית',
    source:'למקור',
  },
  en:{
    eyebrow:'IGOR · VISUAL LIFE CORPUS · PUBLIC SOURCES',
    title:'Do not only read about me. See the path.',
    body:(count:number)=>`${count} frames are connected to the projection layer now — video, press, podcasts, music, social, StartOn and personal moments. The strongest frames arrive first, but the rest are not discarded just to keep the page short.`,
    all:'Open all media',
    showAll:(count:number)=>`Open all ${count} frames`,
    collapse:'Return to the editorial selection',
    source:'Open source',
  },
  ru:{
    eyebrow:'IGOR · VISUAL LIFE CORPUS · PUBLIC SOURCES',
    title:'Не только читать обо мне. Увидеть путь.',
    body:(count:number)=>`Сейчас к слою проекции подключено ${count} кадров — видео, пресса, подкасты, музыка, соцсети, StartOn и личные моменты. Самые сильные кадры идут первыми, но остальные не исчезают только ради короткой страницы.`,
    all:'Все медиа',
    showAll:(count:number)=>`Открыть все ${count} кадров`,
    collapse:'Вернуться к редакционной подборке',
    source:'Открыть источник',
  },
} as const;

function iconFor(item:HomeVisualFrame){
  if(item.sourceKind==='press'||item.sourceKind==='broadcast')return <Newspaper/>;
  if(/music|מוזיקה/i.test(item.publisher+' '+item.platform))return <Music2/>;
  if(item.mediaType==='image')return <Images/>;
  return <Film/>;
}

export default function MobileMediaDeck(){
  const {locale,dir}=useLocale();
  const c=copy[locale];
  const [expanded,setExpanded]=useState(false);
  const frames=useMemo(()=>homeVisualCorpus.filter(item=>item.sourceUrl),[]);
  const visible=expanded?frames:frames.slice(0,INITIAL_VISIBLE);

  return <section className='mmd' dir={dir} aria-labelledby='mmd-title'>
    <header>
      <p>{c.eyebrow}</p>
      <h2 id='mmd-title'>{c.title}</h2>
      <span>{c.body(frames.length)}</span>
    </header>
    <div className='mmd-rail'>
      {visible.map((item,index)=>{
        const metric=item.metrics?.[0]?.value;
        return <a href={item.sourceUrl} target='_blank' rel='noreferrer' className='mmd-card' data-igor-media-card='1' key={item.id}>
          <figure>
            <div className='mmd-poster' aria-hidden='true'>
              <small>{item.mediaType.toUpperCase()}</small>
              <strong>{item.title[locale]}</strong>
              <span>{item.publisher}</span>
            </div>
            {item.imageUrl&&<img src={item.imageUrl} alt={item.title[locale]} loading={index<4?'eager':'lazy'} decoding='async' referrerPolicy='no-referrer' onError={event=>{event.currentTarget.hidden=true}}/>}
            <span className='mmd-index'>{String(index+1).padStart(2,'0')}</span>
            <i><Play fill='currentColor'/></i>
          </figure>
          <div>
            <small dir='ltr'>{item.year} · {item.publisher}</small>
            <h3>{item.title[locale]}</h3>
            <p>{metric||item.trust}</p>
            <b>{iconFor(item)}{c.source}<ArrowUpRight/></b>
          </div>
        </a>;
      })}
    </div>
    <div className='mmd-actions'>
      {frames.length>INITIAL_VISIBLE&&<button type='button' className='mmd-expand' onClick={()=>setExpanded(value=>!value)} aria-expanded={expanded}>{expanded?c.collapse:c.showAll(frames.length)}</button>}
      <a className='mmd-all' href={pageHref('media',locale)}>{c.all}<ArrowUpRight/></a>
    </div>
  </section>;
}
