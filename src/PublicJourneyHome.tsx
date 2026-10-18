import {pageHref,rootHref,useLocale} from './locale';
import './public-journey-home.css';

const portrait='https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png/960px-Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png';
const mynet='https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D740%2Cq%3D75/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg';
const hidabroot='https://storage.hidabroot.org/articles_new/327351_tumb_730X500.jpg';
const thumb=(id:string)=>`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const sources=[
  {year:'2022',label:'STARTON / FIELD',title:{he:'לחזור לג׳סי כהן כדי לבנות',en:'Returning to Jesse Cohen to build',ru:'Вернуться в Джесси Коэн, чтобы строить'},href:'https://holon.mynet.co.il/local_news/article/hjxqegkiq',image:mynet},
  {year:'2023',label:'PUBLIC VOICE',title:{he:'סיפור אישי הופך לשיחה ציבורית',en:'A personal story becomes public conversation',ru:'Личная история становится общественным разговором'},href:'https://www.hidabroot.org/article/1179015',image:hidabroot},
  {year:'2023',label:'NEWS 13',title:{he:'מהפיד אל אולפן החדשות',en:'From the feed to the news studio',ru:'Из ленты в новостную студию'},href:'https://www.youtube.com/watch?v=AE5hDzLM5XU',image:thumb('AE5hDzLM5XU')},
  {year:'2024',label:'LONGFORM',title:{he:'שיחה ארוכה על ישראל, זהות ושינוי',en:'A long conversation about Israel, identity and change',ru:'Длинный разговор об Израиле, идентичности и переменах'},href:'https://www.youtube.com/watch?v=3h-oEuW8GJI',image:thumb('3h-oEuW8GJI')},
  {year:'2025',label:'MUSIC / BIZZI',title:{he:'יצירה ושיתוף פעולה מוזיקלי',en:'Creation and musical collaboration',ru:'Творчество и музыкальная коллаборация'},href:'https://www.youtube.com/watch?v=jRjZjpqAgEw',image:thumb('jRjZjpqAgEw')},
  {year:'2022',label:'SERVICE → MISSION',title:{he:'משירות ציבורי לבניית הזדמנות',en:'From public service to building opportunity',ru:'От общественной службы к созданию возможностей'},href:'https://www.youtube.com/watch?v=O3v309CA4ao',image:thumb('O3v309CA4ao')}
] as const;

const copy={
  he:{
    eyebrow:'IGOR VEPRETSKI / LIVING PUBLIC RECORD',
    title:'חיים של שירות, יצירה ובנייה ציבורית.',
    lead:'לא תיק עבודות ולא קיר מספרים. זה מסע חי: חרקוב וג׳סי כהן, שירות וביטחון, משטרה ומערכות ציבוריות, StartOn, מדיה, מוזיקה, מחקר ו־7YA — עם מקורות שאפשר לפתוח.',
    primary:'להתחיל את המסע',secondary:'לארכיון המדיה',proof:'הסיפור קודם. הראיות נשארות צמודות אליו.',
    journey:'המסע ב־60 שניות',journeyLead:'שבע תחנות שמסבירות איך החלקים מתחברים לאדם אחד ולכיוון אחד.',
    chapters:[
      ['01','מקור','חרקוב → ישראל → בת ים → חולון → ג׳סי כהן.'],
      ['02','שירות','צה״ל, ביטחון, משטרה ואחריות בתוך מערכות.'],
      ['03','קול','פוסטים, כתבות, טלוויזיה ופודקאסטים שהעבירו חוויה לשיחה ציבורית.'],
      ['04','יצירה','מוזיקה, וידאו ושיתופי פעולה כחלק מהזהות — לא נספח.'],
      ['05','StartOn','לחזור לשכונה עם כלים, טכנולוגיה ומרחב לצעירים.'],
      ['06','מחקר','להפוך ניסיון לשאלות, מסגרות וידע שאפשר לבדוק.'],
      ['07','7YA','לאסוף חיים, מקורות, יצירה והשפעה למערכת ציבורית אחת.']
    ],
    moments:'רגעים שאפשר לפתוח',momentsLead:'לא הדמיות. כל כרטיס מוביל למקור ציבורי אמיתי.',
    universe:'כל העשייה, בלי להחביא אותה',universeLead:'מכאן אפשר להיכנס ישירות לשכבה שמעניינת אותך.',
    lanes:[
      ['MEDIA','ראיונות, כתבות, פודקאסטים והופעות','media'],
      ['STARTON','עשייה חברתית, נוער, טכנולוגיה ושטח','starton'],
      ['RESEARCH','מחקר עצמאי, מסגרות וראיות','research'],
      ['MUSIC','שירים, קליפים ושיתופי פעולה','music'],
      ['SPEAKER','הרצאות, פאנלים ושיחות עומק','speaker'],
      ['EVIDENCE','מקורות, תיעוד וסטטוס ראיה','evidence']
    ],
    now:'העבודה עכשיו',nowTitle:'להפוך השפעה שכבר נצברה למערכת שמייצרת השפעה אצל אחרים.',nowBody:'7YA הוא החיבור: האדם במרכז, העשייה גלויה, המקורות פתוחים, והמבקר יכול לעבור מהיכרות לפעולה.',nowCta:'להיכנס לעומק'
  },
  en:{
    eyebrow:'IGOR VEPRETSKI / LIVING PUBLIC RECORD',title:'A life of service, creation and public building.',lead:'Not a portfolio and not a wall of numbers. This is a living journey: Kharkiv and Jesse Cohen, service and public systems, StartOn, media, music, research and 7YA — with sources you can open.',primary:'Start the journey',secondary:'Open media archive',proof:'Story first. Evidence stays attached to it.',journey:'The journey in 60 seconds',journeyLead:'Seven stations that show how the parts connect into one person and one direction.',chapters:[['01','Origin','Kharkiv → Israel → Bat Yam → Holon → Jesse Cohen.'],['02','Service','Military, security, police and responsibility inside systems.'],['03','Voice','Posts, press, television and podcasts that moved experience into public conversation.'],['04','Creation','Music, video and collaborations as identity, not a footnote.'],['05','StartOn','Returning to the neighborhood with tools, technology and opportunity for youth.'],['06','Research','Turning experience into questions, frameworks and checkable knowledge.'],['07','7YA','Organizing life, sources, creation and impact into one public system.']],moments:'Moments you can open',momentsLead:'No simulations. Every card opens a real public source.',universe:'The whole body of work',universeLead:'Enter directly through the layer that matters to you.',lanes:[['MEDIA','Interviews, articles, podcasts and appearances','media'],['STARTON','Social impact, youth, technology and field work','starton'],['RESEARCH','Independent research, frameworks and evidence','research'],['MUSIC','Songs, clips and collaborations','music'],['SPEAKER','Talks, panels and long conversations','speaker'],['EVIDENCE','Sources, documentation and evidence status','evidence']],now:'WORKING NOW',nowTitle:'Turn accumulated impact into a system that creates impact for others.',nowBody:'7YA is the connection: the human stays central, the work is visible, sources stay open, and a visitor can move from understanding to action.',nowCta:'Go deeper'
  },
  ru:{
    eyebrow:'IGOR VEPRETSKI / LIVING PUBLIC RECORD',title:'Жизнь служения, творчества и общественного строительства.',lead:'Не портфолио и не стена цифр. Это живой путь: Харьков и Джесси Коэн, служба и общественные системы, StartOn, медиа, музыка, исследования и 7YA — с источниками, которые можно открыть.',primary:'Начать путь',secondary:'Открыть медиа-архив',proof:'Сначала история. Доказательства остаются рядом.',journey:'Путь за 60 секунд',journeyLead:'Семь этапов, которые соединяют части в одного человека и одно направление.',chapters:[['01','Истоки','Харьков → Израиль → Бат-Ям → Холон → Джесси Коэн.'],['02','Служба','Армия, безопасность, полиция и ответственность внутри систем.'],['03','Голос','Посты, пресса, телевидение и подкасты, превратившие опыт в общественный разговор.'],['04','Творчество','Музыка, видео и коллаборации как часть идентичности.'],['05','StartOn','Возвращение в район с технологиями, инструментами и возможностями для молодёжи.'],['06','Исследования','Превращение опыта в вопросы, модели и проверяемое знание.'],['07','7YA','Объединение жизни, источников, творчества и влияния в одну публичную систему.']],moments:'Моменты, которые можно открыть',momentsLead:'Без симуляций. Каждая карточка ведёт к реальному публичному источнику.',universe:'Вся деятельность без скрытых слоёв',universeLead:'Переходите прямо в интересующую часть.',lanes:[['MEDIA','Интервью, статьи, подкасты и выступления','media'],['STARTON','Социальная работа, молодёжь, технологии и практика','starton'],['RESEARCH','Независимые исследования, модели и доказательства','research'],['MUSIC','Песни, клипы и коллаборации','music'],['SPEAKER','Лекции, панели и длинные разговоры','speaker'],['EVIDENCE','Источники, документация и статус доказательств','evidence']],now:'СЕЙЧАС',nowTitle:'Превратить уже накопленное влияние в систему, создающую влияние для других.',nowBody:'7YA соединяет всё: человек остаётся в центре, работа видима, источники открыты, а посетитель может перейти от знакомства к действию.',nowCta:'Открыть глубже'
  }
} as const;

export default function PublicJourneyHome(){
  const {locale,dir}=useLocale();
  const c=copy[locale];
  const route=(key:string)=>key==='starton'?rootHref('starton/'):key==='research'?rootHref('research/?lang='+locale):key==='evidence'?rootHref('evidence/'):pageHref(key as 'media'|'music'|'speaker',locale);
  return <main className='pj-home' dir={dir}>
    <section className='pj-hero'>
      <div className='pj-shell pj-hero-grid'>
        <div className='pj-hero-copy'>
          <p className='pj-eyebrow' dir='ltr'>{c.eyebrow}</p>
          <h1>IGOR<br/><span>VEPRETSKI</span></h1>
          <h2>{c.title}</h2>
          <p className='pj-lead'>{c.lead}</p>
          <div className='pj-actions'><a href='#journey'>{c.primary} ↓</a><a href={pageHref('media',locale)}>{c.secondary} ↗</a></div>
          <div className='pj-proof'><i/> <span>{c.proof}</span></div>
        </div>
        <figure className='pj-portrait'>
          <img src={portrait} alt='Igor Vepretski'/>
          <figcaption><span dir='ltr'>PUBLIC PORTRAIT / WIKIMEDIA COMMONS</span><b>HUMAN FIRST.</b></figcaption>
        </figure>
      </div>
    </section>

    <section id='journey' className='pj-journey'>
      <div className='pj-shell'>
        <header className='pj-section-head'><p dir='ltr'>THE PUBLIC JOURNEY / 01—07</p><h2>{c.journey}</h2><span>{c.journeyLead}</span></header>
        <div className='pj-chapters'>{c.chapters.map(([n,title,body])=><article key={n}><b dir='ltr'>{n}</b><h3>{title}</h3><p>{body}</p></article>)}</div>
      </div>
    </section>

    <section className='pj-moments'>
      <div className='pj-shell'>
        <header className='pj-section-head'><p dir='ltr'>SOURCE-LINKED MOMENTS</p><h2>{c.moments}</h2><span>{c.momentsLead}</span></header>
        <div className='pj-moment-grid'>{sources.map((item,index)=><a href={item.href} target='_blank' rel='noreferrer' key={item.href} className={index===0?'pj-featured':''}><img src={item.image} alt={item.title[locale]} loading={index<2?'eager':'lazy'}/><div><small dir='ltr'>{item.year} / {item.label}</small><strong>{item.title[locale]}</strong><span>OPEN SOURCE ↗</span></div></a>)}</div>
      </div>
    </section>

    <section className='pj-universe'>
      <div className='pj-shell'>
        <header className='pj-section-head'><p dir='ltr'>EXPLORE THE WORK</p><h2>{c.universe}</h2><span>{c.universeLead}</span></header>
        <nav className='pj-lanes'>{c.lanes.map(([title,body,key],index)=><a href={route(key)} key={title}><b dir='ltr'>0{index+1}</b><div><strong dir='ltr'>{title}</strong><p>{body}</p></div><span>↗</span></a>)}</nav>
      </div>
    </section>

    <section className='pj-now'>
      <div className='pj-shell pj-now-grid'><p className='pj-eyebrow' dir='ltr'>{c.now}</p><div><h2>{c.nowTitle}</h2><p>{c.nowBody}</p></div><a href={rootHref('evidence/')}>{c.nowCta} ↗</a></div>
    </section>
  </main>;
}
