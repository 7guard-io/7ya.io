import {ExternalLink,Library,Music2,ShieldCheck} from 'lucide-react';
import {pageHref,useLocale} from './locale';
import './live-archive-signals.css';

const copy={he:{eyebrow:'LIVE INTAKE · EVIDENCE FIRST',title:'מה נכנס עכשיו לארכיון.',body:'תוכן חדש לא הופך אוטומטית לכותרת. הוא נכנס עם מקור, תאריך וסטטוס; רק אחר כך נקבע מקומו בסיפור.',open:'למקור',music:'למוזיקה וליצירה',library:'לספרייה',verified:'VERIFIED',archive:'ARCHIVE · MUSIC / CREATION',note:'ריל Discovery נוסף נשמר בשכבת Impact/Discovery ואינו מקודם לעמוד הבית.'},en:{eyebrow:'LIVE INTAKE · EVIDENCE FIRST',title:'What just entered the archive.',body:'New content does not automatically become a headline. It enters with a source, date and status; its place in the story comes afterwards.',open:'Open source',music:'Music & creation',library:'Open library',verified:'VERIFIED',archive:'ARCHIVE · MUSIC / CREATION',note:'A further Discovery reel is retained in Impact/Discovery and is not promoted to the homepage.'},ru:{eyebrow:'LIVE INTAKE · EVIDENCE FIRST',title:'Что только что вошло в архив.',body:'Новый контент не становится заголовком автоматически. Он входит с источником, датой и статусом; место в истории определяется затем.',open:'Открыть источник',music:'Музыка и творчество',library:'Открыть библиотеку',verified:'ПРОВЕРЕНО',archive:'АРХИВ · МУЗЫКА / ТВОРЧЕСТВО',note:'Ещё один Discovery-рил сохранён в Impact/Discovery и не продвигается на главную.'}};

export default function LiveArchiveSignals(){
  const {locale,dir}=useLocale();
  const t=copy[locale];
  const music=pageHref('music',locale);
  const library=pageHref('library',locale);
  return <section className='live-archive-signals' id='live-archive-signals' dir={dir} aria-labelledby='live-archive-signals-title'>
    <header><div><small dir='ltr'>{t.eyebrow}</small><h2 id='live-archive-signals-title'>{t.title}</h2></div><p>{t.body}</p></header>
    <article className='live-archive-card'>
      <div className='live-archive-card-meta'><span dir='ltr'>29.08.2026 · INSTAGRAM REEL</span><b><ShieldCheck/> {t.verified}</b></div>
      <h3>יגור ופרצקי × vepretski.igor</h3>
      <p>{locale==='he'?'ריל משותף באורך 59.3 שניות. הכיתוב של היוצר כולל #7ya, #израиль, #ויראלי, #dance ו־#rap. נשמר כמסלול מוזיקה/יצירה; לא מקודם כעוגן בדף הבית.':locale==='ru'?'Совместный рил длительностью 59,3 секунды. В подписи автора: #7ya, #израиль, #ויראלי, #dance и #rap. Сохранён в треке музыки/творчества, не продвигается как главный сюжет на главной.':'A 59.3-second co-post. The creator caption includes #7ya, #израиль, #ויראלי, #dance and #rap. It is retained on the music/creation path, not promoted as a homepage anchor.'}</p>
      <footer><span>{t.archive}</span><nav><a href='https://www.instagram.com/igor.vepretski/reel/Dcnsi59s0PM/' target='_blank' rel='noreferrer'>{t.open}<ExternalLink/></a><a href={music}>{t.music}<Music2/></a></nav></footer>
    </article>
    <footer className='live-archive-foot'><Library/><p>{t.note}</p><a href={library}>{t.library}<ExternalLink/></a></footer>
  </section>
}