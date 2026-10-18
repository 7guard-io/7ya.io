import {useMemo} from 'react';
import {pageHref,rootHref,useLocale,type Locale} from './locale';import {selectCluster,selectFeaturedVideos,selectHomeMedia} from './content-registry';
import EditorialEnrichment from './EditorialEnrichment';
import PersonalGrowthGateway from './PersonalGrowthGateway';
import MusicSpotlight from './MusicSpotlight';import ViralFrontispiece from './ViralFrontispiece';
import './conversion-home.css';
import './home-simplify.css';

type Copy={eyebrow:string;signal:string;name:string;promise:string;body:string;primary:string;secondary:string;paths:[string,string,string,string,string,string];proofKicker:string;proofTitle:string;proofBody:string;proofCta:string;igorKicker:string;igorTitle:string;igorBody:string;igorPoints:[string,string,string];igorCta:string;startonKicker:string;startonTitle:string;startonBody:string;startonCta:string;closing:string;closingCta:string;social:string};
const copy:Record<Locale,Copy>={
 he:{eyebrow:'7YA · IGOR VEPRETSKI',signal:'יזם חברתי, יוצר ציבורי ומייסד StartOn.',name:'איגור ופרצקי.',promise:'סיפור, עשייה והשפעה.',body:'מקום אחד להכיר את האדם, לראות את העשייה ואת המקורות, ולהתחיל שיחה עם מטרה.',primary:'לתיאום שיחה',secondary:'לצפייה בראיות',paths:['להכיר את איגור','הסיפור, העשייה והדרך שהובילה לבנייה.','לצפייה בראיות','מקורות פתוחים, תאריכים והקשר שאפשר לבדוק.','להכיר את StartOn','המשימה החברתית, האנשים וההזדמנויות.'],proofKicker:'העשייה, לא רק הכותרת',proofTitle:'סיפור אישי שהפך לאחריות ציבורית.',proofBody:'המסלולים באתר מחברים בין יצירה, שיח ציבורי, חינוך, טכנולוגיה וקהילה — עם מקום לראות את המקורות, לא רק את הסיכום.',proofCta:'לכל הסיפור והמקורות',igorKicker:'DIGITAL IGOR',igorTitle:'מה צריך לזוז אצלך עכשיו?',igorBody:'שיחה קצרה, אנושית ומעשית שמתחילה במקום שבו את או אתה נמצאים.',igorPoints:['לחדד את הצעד הבא','להפוך רעיון לתוכנית','למצוא מקור או כיוון ציבורי'],igorCta:'פתח שיחה עם Digital Igor',startonKicker:'STARTON',startonTitle:'דיגיטל הוא זכות גישה.',startonBody:'StartOn מחבר צעירים, כלים, יצירה וקהילה. לא עוד קישור — מקום להתחיל ממנו.',startonCta:'להכיר את StartOn',closing:'יש לך רעיון, סיפור או צורך שלא קיבל עדיין מקום?',closingCta:'בוא נתחיל',social:'המסע, העשייה והאנשים שמסביבם.'},
 en:{eyebrow:'7YA · IGOR VEPRETSKI',signal:'Social entrepreneur, public creator and founder of StartOn.',name:'Igor Vepretski.',promise:'Story. Work. Impact.',body:'One place to meet the person, see the work and sources, and begin a conversation with purpose.',primary:'Book a conversation',secondary:'View evidence',paths:['Meet Igor','The story, work and path that led to building.','View evidence','Open sources, dates and context you can examine.','Meet StartOn','The social mission, people and opportunities.'],proofKicker:'The work, not just the headline',proofTitle:'A personal story turned into public responsibility.',proofBody:'This site connects creation, public dialogue, education, technology and community — with room to see sources, not just summaries.',proofCta:'See the story and sources',igorKicker:'DIGITAL IGOR',igorTitle:'What needs to move for you now?',igorBody:'A short, human and practical conversation that starts where you are.',igorPoints:['Clarify the next step','Turn an idea into a plan','Find a public source or direction'],igorCta:'Open Digital Igor',startonKicker:'STARTON',startonTitle:'Digital access is a right.',startonBody:'StartOn connects young people, tools, creation and community. Not another link — a place to begin.',startonCta:'Meet StartOn',closing:'Do you have an idea, a story or a need that has not found its place yet?',closingCta:'Let’s begin',social:'The story, the work and the people around it.'},
 ru:{eyebrow:'7YA · ИГОРЬ ВЕПРЕЦКИЙ',signal:'Социальный предприниматель, публичный автор и основатель StartOn.',name:'Игорь Вепрецкий.',promise:'История. Дело. Влияние.',body:'Одно место, чтобы познакомиться с человеком, увидеть работу и источники и начать разговор с целью.',primary:'Назначить разговор',secondary:'Открыть источники',paths:['Познакомиться с Игорем','История, работа и путь, ведущий к созданию.','Открыть источники','Открытые источники, даты и контекст для проверки.','Познакомиться с StartOn','Социальная миссия, люди и возможности.'],proofKicker:'Работа, а не только заголовок',proofTitle:'Личная история стала общественной ответственностью.',proofBody:'Сайт соединяет творчество, публичный разговор, образование, технологии и сообщество — с возможностью увидеть источники, а не только выводы.',proofCta:'История и источники',igorKicker:'DIGITAL IGOR',igorTitle:'Что должно сдвинуться у тебя сейчас?',igorBody:'Короткий, человеческий и практичный разговор, который начинается там, где ты находишься.',igorPoints:['Прояснить следующий шаг','Превратить идею в план','Найти источник или публичное направление'],igorCta:'Открыть Digital Igor',startonKicker:'STARTON',startonTitle:'Цифровой доступ — это право.',startonBody:'StartOn соединяет молодых людей, инструменты, творчество и сообщество. Не ещё одна ссылка — место, откуда можно начать.',startonCta:'Познакомиться с StartOn',closing:'Есть идея, история или потребность, для которой ещё не нашлось места?',closingCta:'Начнём',social:'История, дело и люди вокруг них.'}
};

export default function ConversionHome(){
 const {locale,dir}=useLocale();
 const t=copy[locale];const rich=locale==='he'?{mediaKicker:'MEDIA · PRESS · SOCIAL · MUSIC',mediaTitle:'איגור על המסך',mediaBody:'וידאו, ראיונות, כתבות, פוסטים, מוזיקה ו־StartOn — מתוך מקורות ציבוריים וקישורי מקור אמיתיים.',watchTitle:'לצפות. לא רק לקרוא.',watchBody:'הקול, הפנים והסיפור נכנסים לעמוד עצמו — בלי לשלוח אותך קודם לרשימת קישורים.',storyTitle:'שלושה פרקים. אדם אחד.',storyBody:'העשייה החברתית, הקול הציבורי והיצירה מתחברים כאן לסיפור אחד חי.',archiveTitle:'ארכיון חזותי חי',archiveBody:'לא תמונת פרופיל אחת שחוזרת שוב ושוב — אלא פריימים שונים מהטלוויזיה, פודקאסטים, StartOn, ויראליות ויצירה.'}:locale==='ru'?{mediaKicker:'MEDIA · PRESS · SOCIAL · MUSIC',mediaTitle:'Игорь на экране',mediaBody:'Видео, интервью, публикации, социальные сети, музыка и StartOn — из реальных публичных источников.',watchTitle:'Смотреть. Не только читать.',watchBody:'Голос, лицо и история живут прямо на странице, а не прячутся за списком ссылок.',storyTitle:'Три главы. Один человек.',storyBody:'Социальная миссия, публичный голос и творчество соединены в одну живую историю.',archiveTitle:'Живой визуальный архив',archiveBody:'Не один повторяющийся портрет, а разные кадры из телевидения, подкастов, StartOn, вирусного контента и творчества.'}:{mediaKicker:'MEDIA · PRESS · SOCIAL · MUSIC',mediaTitle:'Igor on screen',mediaBody:'Video, interviews, press, social, music and StartOn — surfaced from real public sources.',watchTitle:'Watch. Don’t just read.',watchBody:'The voice, face and story live on the page instead of hiding behind a list of links.',storyTitle:'Three chapters. One person.',storyBody:'Social mission, public voice and creation come together as one living story.',archiveTitle:'A living visual archive',archiveBody:'Not one portrait repeated everywhere — distinct frames from television, podcasts, StartOn, viral moments and creation.'};const homeMedia=selectHomeMedia(12);const videos=selectFeaturedVideos(2);const storyStarton=selectCluster('starton',1)[0];const storyMedia=selectCluster('media',1)[0];
 const chatHref=useMemo(()=>{const params=new URLSearchParams(window.location.search);params.set('lang',locale);params.set('chat','open');return rootHref('?'+params.toString())+'#digital-igor'},[locale]);const contactHref=rootHref('contact/');const evidenceHref=rootHref('evidence/');
 return <main className='conversion-home' dir={dir}>
  <section className='conversion-hero' data-visual-language='igor-personal' aria-labelledby='gateway-title'>
   <div className='conversion-noise' aria-hidden='true'/>
   <div className='conversion-wrap hero-grid'>
    <div className='hero-copy'>
     <p className='conversion-eyebrow'>{t.eyebrow}</p>
     <p className='hero-signal'>{t.signal}</p>
     <h1 id='gateway-title'><span>{t.name}</span><em>{t.promise}</em></h1>
     <p className='hero-body'>{t.body}</p>
     <div className='hero-actions'>
      <a className='button button-primary' href={contactHref}>{t.primary}<span aria-hidden='true'>↗</span></a>
      <a className='button button-quiet' href={evidenceHref}>{t.secondary}<span aria-hidden='true'>↗</span></a>
     </div>
    </div>
    <div className='hero-media-stage'><div className='hero-portrait'><img src={rootHref('resources/igor-hero.jpg')} alt={locale==='he'?'איגור ופרצקי':'Igor Vepretski'} /><div className='portrait-note'><p>{t.social}</p></div></div></div>
   </div>
  </section>

  <ViralFrontispiece/>

  <MusicSpotlight/>

  <section className='conversion-paths signature-routes conversion-wrap' aria-label={t.signal}>
   <a href={rootHref('igor-vepretski/')} className='path-card'><h2>{t.paths[0]}</h2><p>{t.paths[1]}</p><b aria-hidden='true'>↗</b></a>
   <a href={evidenceHref} className='path-card'><h2>{t.paths[2]}</h2><p>{t.paths[3]}</p><b aria-hidden='true'>↗</b></a>
   <a href={rootHref('starton/')} className='path-card'><h2>{t.paths[4]}</h2><p>{t.paths[5]}</p><b aria-hidden='true'>↗</b></a>
  </section>

  <section id='managed-media' className='home-media-section conversion-wrap' aria-labelledby='home-media-title'><div className='home-section-head'><div><p className='conversion-eyebrow'>{rich.mediaKicker}</p><h2 id='home-media-title'>{rich.mediaTitle}</h2><small className='home-media-managed-count'>CURATED PUBLIC SOURCES</small></div><p>{rich.mediaBody}</p></div><div className='home-media-rail'>{homeMedia.map(item=><a className='home-media-card' href={item.url} target='_blank' rel='noopener noreferrer' key={item.id} data-content-id={item.id} data-visual-method={item.visualMethod}><div className='home-media-thumb'><img src={item.image||item.fallback} alt={item.title} loading='lazy' referrerPolicy='no-referrer' onError={event=>{if(event.currentTarget.dataset.fallback!=='used'){event.currentTarget.dataset.fallback='used';event.currentTarget.src=item.fallback}}}/>{item.youtubeId?<span className='play-badge' aria-hidden='true'>▶</span>:null}</div><div className='home-media-meta'><span>{item.visualMethod.replace('-',' ')} · {item.category} · {item.source}</span><small>{item.year}</small></div><h3>{item.title}</h3><p>{item.summary}</p></a>)}</div></section><section className='home-watch' aria-labelledby='home-watch-title'><div className='conversion-wrap'><div className='watch-head'><div><p className='conversion-eyebrow'>WATCH / IGOR VEPRETSKI</p><h2 id='home-watch-title'>{rich.watchTitle}</h2></div><p>{rich.watchBody}</p></div><div className='watch-grid'>{videos.map(item=><article className='watch-card' key={item.id}><div className='video-shell'><iframe src={'https://www.youtube-nocookie.com/embed/'+item.youtubeId} title={item.title} loading='lazy' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' allowFullScreen/></div><div className='watch-copy'><span>{item.source} · {item.year}</span><h3>{item.title}</h3><a href={item.url} target='_blank' rel='noopener noreferrer'>{locale==='he'?'למקור המלא ↗':locale==='ru'?'Открыть источник ↗':'Open source ↗'}</a></div></article>)}</div></div></section><section className='home-story conversion-wrap' aria-labelledby='home-story-title'><div className='home-section-head'><div><p className='conversion-eyebrow'>MISSION · VOICE · CREATION</p><h2 id='home-story-title'>{rich.storyTitle}</h2></div><p>{rich.storyBody}</p></div><div className='story-grid'><a className='story-card' href={pageHref('museum',locale)+'#starton'}><img src={storyStarton?.image||rootHref('resources/7ya-starton.webp')} alt='StartOn' loading='lazy' referrerPolicy='no-referrer'/><span>STARTON · {storyStarton?.source}</span><h3>{locale==='he'?'לבנות הזדמנות':locale==='ru'?'Создавать возможности':'Build opportunity'}</h3></a><a className='story-card' href={pageHref('media',locale)}><img src={storyMedia?.image||rootHref('resources/chapter-voice.webp')} alt={locale==='he'?'הקול הציבורי של איגור ופרצקי':'Igor Vepretski public voice'} loading='lazy' referrerPolicy='no-referrer'/><span>PUBLIC VOICE · {storyMedia?.source}</span><h3>{locale==='he'?'להיכנס לשיחה':locale==='ru'?'Войти в разговор':'Enter the conversation'}</h3></a><a className='story-card' href={rootHref('music/')}><img src={rootHref('resources/chapter-music.webp')} alt={locale==='he'?'המוזיקה והיצירה של איגור ופרצקי':'Igor Vepretski music and creation'} loading='lazy' referrerPolicy='no-referrer'/><span>MUSIC · IDO VEPRETSKI</span><h3>{locale==='he'?'זהות מעבר לכותרת':locale==='ru'?'Личность шире заголовка':'More than a headline'}</h3></a></div></section><EditorialEnrichment/><PersonalGrowthGateway/>  <section id='proof' className='conversion-proof'>
   <div className='conversion-wrap proof-grid'>
    <div><p className='conversion-eyebrow'>{t.proofKicker}</p><h2>{t.proofTitle}</h2></div>
    <div className='proof-detail'><p>{t.proofBody}</p><a className='inline-link' href={pageHref('museum',locale)}>{t.proofCta}<span aria-hidden='true'>↗</span></a></div>
   </div>
  </section>

  <section id='digital-igor' className='conversion-igor conversion-wrap' aria-labelledby='igor-title'>
   <div className='igor-panel'>
    <p className='conversion-eyebrow'>{t.igorKicker}</p>
    <h2 id='igor-title'>{t.igorTitle}</h2>
    <p>{t.igorBody}</p>
    <ul>{t.igorPoints.map(point=><li key={point}><span aria-hidden='true'>✦</span>{point}</li>)}</ul>
    <a className='button button-primary' href={chatHref}>{t.igorCta}<span aria-hidden='true'>↗</span></a>
   </div>
   <div className='igor-orbit' aria-hidden='true'><span>7</span><i>Y</i><b>A</b><small>human<br/>first</small></div>
  </section>

  <section id='starton' className='conversion-starton'>
   <div className='conversion-wrap starton-grid'>
    <div className='starton-image'><img src={rootHref('resources/7ya-starton.webp')} alt='StartOn' /></div>
    <div className='starton-copy'><p className='conversion-eyebrow'>{t.startonKicker}</p><h2>{t.startonTitle}</h2><p>{t.startonBody}</p><a className='inline-link' href={pageHref('museum',locale)+'#starton'}>{t.startonCta}<span aria-hidden='true'>↗</span></a></div>
   </div>
  </section>

  <section className='conversion-closing conversion-wrap'>
   <p>{t.closing}</p><a className='button button-primary' href={chatHref}>{t.closingCta}<span aria-hidden='true'>↗</span></a>
  </section>
 </main>
}