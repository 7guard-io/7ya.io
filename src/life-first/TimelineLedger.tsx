import {useEffect,useRef,useState} from 'react';
import './timeline-ledger.css';

const timeline = [
  {
    year: '1990',
    title: 'ילדות, עלייה ושייכות',
    english: 'Childhood, Immigration, Belonging',
    detail: 'Kharkiv → Bat Yam → Holon → Jesse Cohen.',
  },
  {
    year: '2008-2011',
    title: 'שירות חובה בצה״ל - גדס״ר / פלס״ר',
    english: 'IDF Service',
    detail: 'שירות חובה בצה״ל - גדס״ר / פלס״ר.',
  },
  {
    year: '2012-2021',
    title: 'מערכות ציבוריות',
    english: 'Public Systems',
    detail: 'Overseas/MFA (Miami Consulate) & Israel Police.',
  },
  {
    year: '2018',
    title: 'קרימינולוגיה באוניברסיטה העברית',
    english: 'Criminology at Hebrew University',
    detail: 'Moving from field experience to academic framing.',
  },
  {
    year: '2022',
    title: "החזרה לג'סי כהן - StartOn",
    english: 'Return to Jesse Cohen - StartOn',
    detail: 'Building tech spaces before the crisis happens.',
  },
  {
    year: '2023',
    title: 'מאבק ציבורי ואבהות',
    english: 'Public Struggle & Fatherhood',
    detail: 'סבתא שלי נפלה קורבן להונאה — Elderly fraud on Channel 13; אבא מושלם - זה אבא ששם — A perfect father is a father who is there.',
  },
  {
    year: '2026',
    title: '7YA - חיים, תוכן, השפעה ומערכת אחת',
    english: 'Life, content, impact, and one system',
    detail: '7YA - חיים, תוכן, השפעה ומערכת אחת.',
  },
] as const;

export function TimelineLedger() {
  const headerRef=useRef<HTMLElement>(null);
  const [headerVisible,setHeaderVisible]=useState(false);

  useEffect(()=>{
    const header=headerRef.current;
    if(!header||!('IntersectionObserver' in window)){setHeaderVisible(true);return}
    const observer=new IntersectionObserver(([entry])=>{
      if(!entry.isIntersecting||entry.intersectionRatio<.45)return;
      setHeaderVisible(true);
      observer.disconnect();
    },{threshold:.45});
    observer.observe(header);
    return()=>observer.disconnect();
  },[]);

  return (
    <section aria-labelledby='timeline-ledger-title' className='mx-auto mt-16 max-w-6xl border-y border-neutral-900 px-5 py-16 sm:px-8 sm:py-20'>
      <header ref={headerRef} className={'timeline-ledger-header max-w-4xl'+(headerVisible?' is-visible':'')} dir='rtl'>
        <p dir='ltr' className='text-[10px] font-black uppercase tracking-[0.28em] text-neutral-500 sm:text-xs'>
          PUBLIC RECORD · IMPACT NODES · EVIDENCE LEDGER
        </p>
        <h2 id='timeline-ledger-title' className='mt-4 text-4xl font-black tracking-[-0.055em] text-white sm:text-7xl'>
          מסיפור מקומי
          <br />
          <span className='text-neutral-500'>למערכת ציבורית.</span>
        </h2>
        <p className='mt-7 max-w-3xl text-sm leading-8 text-neutral-400 sm:text-lg sm:leading-9'>
          רשומת אימפקט חיה שמחברת בין צומתי חיים, שירות ציבורי, מחקר, StartOn,
          פעילות תקשורתית, יצירה ומערכות דיגיטליות — כאשר כל טענה נשארת מחוברת
          למקור, להקשר ולפלט המערכתי שלה.
        </p>
        <div className='mt-8 flex flex-wrap gap-2'>
          <span className='rounded-full border border-neutral-800 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500'>צומתי השפעה</span>
          <span className='rounded-full border border-neutral-800 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500'>רשומה ציבורית</span>
          <span className='rounded-full border border-neutral-800 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500'>ארכיון ראיות</span>
          <span className='rounded-full border border-neutral-800 px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-neutral-500'>Systemic Output</span>
        </div>
      </header>
      <ol className='relative mt-12 border-r border-neutral-800 pr-6 sm:pr-8'>
        {timeline.map((entry) => (
          <li key={entry.year} className='relative pb-10 last:pb-0'>
            <span
              aria-hidden='true'
              className='absolute -right-[1.95rem] top-1 size-3 rounded-full border-2 border-black bg-white shadow-[0_0_0_5px_rgba(38,38,38,0.8)] sm:-right-[2.45rem]'
            />
            <p className='text-xs font-bold tracking-[0.18em] text-neutral-500' dir='ltr'>
              {entry.year}
            </p>
            <h3 className='mt-2 text-lg font-bold text-white'>{entry.title}</h3>
            <p className='mt-1 text-xs font-medium tracking-[0.04em] text-neutral-400' dir='ltr'>
              {entry.english}
            </p>
            <p className='mt-3 max-w-2xl text-sm leading-6 text-neutral-300'>{entry.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
