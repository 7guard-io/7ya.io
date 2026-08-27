import {ArrowUpRight, Play, Quote} from 'lucide-react';
import type {Locale} from '../locale';
import './personal-media-showcase.css';

type LocalText=Record<Locale,string>;
type ProofItem={
  id:string;
  kind:'owner'|'press'|'broadcast'|'post'|'podcast';
  year:string;
  publisher:string;
  title:LocalText;
  quote?:LocalText;
  statement?:LocalText;
  image:string;
  fallback:string;
  sourceUrl:string|LocalText;
  credit:LocalText;
};

const L=(he:string,en:string,ru:string):LocalText=>({he,en,ru});

const proofItems:ProofItem[]=[
  {
    id:'owner-press-wall',kind:'owner',year:'ARCHIVE',publisher:'7YA · OWNER ARCHIVE',
    title:L('החיים לפני הכותרות','The life before the headlines','Жизнь до заголовков'),
    statement:L('לפני החשיפה היה שירות. לפני המותג היה מסלול.','Before the exposure came service. Before the brand came a path.','До охватов была служба. До бренда был путь.'),
    image:'https://drive.google.com/thumbnail?id=1WKhOrE4Ppq5RFb7vd5uFRShUDZMGiK1W&sz=w1800',fallback:'./resources/igor-hero.jpg',
    sourceUrl:L('https://7ya.io/library/?lang=he','https://7ya.io/library/?lang=en','https://7ya.io/library/?lang=ru'),
    credit:L('© Igor Vepretski / 7YA · ארכיון בעלים','© Igor Vepretski / 7YA · owner archive','© Igor Vepretski / 7YA · архив владельца')
  },
  {
    id:'owner-service',kind:'owner',year:'SERVICE',publisher:'7YA · OWNER ARCHIVE',
    title:L('מילד מוכה — ללוחם ולמפקד','From an abused child to a fighter and commander','От ребёнка, пережившего насилие, к бойцу и командиру'),
    statement:L('העבר לא מוצג כאן כמדליה. הוא מסביר את הדרך.','The past is not displayed as a medal. It explains the path.','Прошлое здесь не медаль. Оно объясняет путь.'),
    image:'https://drive.google.com/thumbnail?id=1E9QZxIMVvACJc-jNVRnt_rxPlWOwTVBT&sz=w1800',fallback:'./resources/igor-hero.jpg',
    sourceUrl:L('https://7ya.io/?lang=he#cinema-service','https://7ya.io/?lang=en#cinema-service','https://7ya.io/?lang=ru#cinema-service'),
    credit:L('© Igor Vepretski / 7YA · „לפני החשיפה היה שירות”','© Igor Vepretski / 7YA · “Before exposure came service”','© Igor Vepretski / 7YA · «До охватов была служба»')
  },
  {
    id:'mynet-return',kind:'press',year:'2022',publisher:'mynet חולון',
    title:L('מהילד שלא האמין בעצמו — למפקד חוליה','From the child who doubted himself to a squad leader','От ребёнка, который не верил в себя, к командиру звена'),
    quote:L('„אני לא האמנתי בעצמי אבל מישהו האמין בי”','“I did not believe in myself, but someone believed in me.”','«Я не верил в себя, но кто-то поверил в меня»'),
    image:'https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D740%2Cq%3D75/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg',fallback:'./resources/igor-hero.jpg',
    sourceUrl:'https://holon.mynet.co.il/local_news/article/hjxqegkiq',
    credit:L('צילום: קובי קואנקס · mynet חולון','Photo: Kobi Koanks · mynet Holon','Фото: Коби Коанкс · mynet Холон')
  },
  {
    id:'starton-origin',kind:'owner',year:'2022→NOW',publisher:'StartOn · OFFICIAL',
    title:L('מהתווית — לבניית הזדמנות','From a label to building opportunity','От ярлыка — к созданию возможностей'),
    quote:L('„זכיתי” לשאת את התואר „נער בסיכון”','“I had the ‘privilege’ of carrying the label ‘at-risk youth.’”','«Мне “выпало” носить ярлык “подростка группы риска”»'),
    image:'./resources/7ya-starton.webp',fallback:'./resources/igor-hero.jpg',
    sourceUrl:'https://starton.org.il/',
    credit:L('StartOn · האתר הציבורי הרשמי','StartOn · official public site','StartOn · официальный публичный сайт')
  },
  {
    id:'news13-fraud',kind:'broadcast',year:'2023',publisher:'חדשות 13',
    title:L('מפוסט אישי — למאבק ציבורי','From a personal post to public action','От личного поста к общественной борьбе'),
    image:'https://i.ytimg.com/vi/AE5hDzLM5XU/hqdefault.jpg',fallback:'./resources/igor-hero.jpg',
    sourceUrl:'https://www.youtube.com/watch?v=AE5hDzLM5XU',
    credit:L('פריים שידור: חדשות 13 · מקור ציבורי','Broadcast frame: News 13 · public source','Кадр эфира: News 13 · публичный источник')
  },
  {
    id:'news12-fraud',kind:'broadcast',year:'2023',publisher:'חדשות 12',
    title:L('המאבק בהונאות קשישים מקבל המשך','The elder-fraud campaign continues','Борьба с мошенничеством против пожилых продолжается'),
    image:'https://i.ytimg.com/vi/3XxoBtSL2pg/hqdefault.jpg',fallback:'./resources/igor-hero.jpg',
    sourceUrl:'https://www.youtube.com/watch?v=3XxoBtSL2pg',
    credit:L('פריים וידאו: חדשות 12 · מקור ציבורי','Video frame: News 12 · public source','Кадр видео: News 12 · публичный источник')
  },
  {
    id:'channel14-starton',kind:'broadcast',year:'2022',publisher:'ערוץ 14',
    title:L('משירות ציבורי — לבניית StartOn','From public service to building StartOn','От государственной службы к созданию StartOn'),
    image:'https://i.ytimg.com/vi/O3v309CA4ao/hqdefault.jpg',fallback:'./resources/7ya-starton.webp',
    sourceUrl:'https://youtu.be/O3v309CA4ao',
    credit:L('פריים ראיון: ערוץ 14 · מקור ציבורי','Interview frame: Channel 14 · public source','Кадр интервью: 14 канал · публичный источник')
  },
  {
    id:'opens-day',kind:'broadcast',year:'2022',publisher:'פותחים יום',
    title:L('חלל אינטראקטיבי לנוער בסיכון','An interactive space for at-risk youth','Интерактивное пространство для молодёжи группы риска'),
    image:'https://i.ytimg.com/vi/SOpAglwkJ8I/hqdefault.jpg',fallback:'./resources/7ya-starton.webp',
    sourceUrl:'https://www.youtube.com/watch?v=SOpAglwkJ8I',
    credit:L('פריים שידור: פותחים יום · מקור ציבורי','Broadcast frame: Pothim Yom · public source','Кадр эфира: «Потхим Йом» · публичный источник')
  },
  {
    id:'fatherhood-post',kind:'post',year:'2023',publisher:'הידברות · פוסט מאת Igor Vepretski',
    title:L('אבהות מחזירה את הילדות אל הפריים','Fatherhood brings childhood back into frame','Отцовство возвращает детство в кадр'),
    quote:L('„אבא מושלם — זה אבא ששם”','“A perfect father is a father who is there.”','«Идеальный отец — тот, кто рядом»'),
    image:'https://storage.hidabroot.org/Graphics/Storage/327341.png',fallback:'./resources/igor-hero.jpg',
    sourceUrl:'https://www.hidabroot.org/article/1179015',
    credit:L('הידברות · מבוסס על פוסט אישי של איגור ופרצקי','Hidabroot · based on an authored post by Igor Vepretski','Hidabroot · по авторскому посту Игоря Вепрецкого')
  },
  {
    id:'mindset',kind:'podcast',year:'2022',publisher:'Mindset · שלומי חסטר',
    title:L('מנער בסיכון ליזם חברתי','From at-risk youth to social entrepreneur','От подростка группы риска к социальному предпринимателю'),
    quote:L('„האם להיות נער בסיכון זה חולשה, או למעשה חוזקה?”','“Is being at-risk a weakness — or can it actually become a strength?”','«Быть подростком группы риска — слабость или, возможно, сила?»'),
    image:'https://mindset.org.il/wp-content/uploads/2024/01/27-1.png',fallback:'./resources/chapter-voice.webp',
    sourceUrl:'https://mindset.org.il/%D7%9E%D7%A0%D7%A2%D7%A8-%D7%91%D7%A1%D7%99%D7%9B%D7%95%D7%9F-%D7%9C%D7%99%D7%96%D7%9D-%D7%97%D7%91%D7%A8%D7%AA%D7%99-%D7%90%D7%99%D7%92%D7%95%D7%A8-%D7%95%D7%A4%D7%A8%D7%A6%D7%A7%D7%99-%D7%A4/',
    credit:L('Mindset · שלומי חסטר · פרק 102','Mindset · Shlomi Haster · episode 102','Mindset · Шломи Хастер · выпуск 102')
  }
];

const sectionCopy={
  he:{kicker:'LIFE → SERVICE → PUBLIC VOICE',title:'מילד מוכה ללוחם ולמפקד. מהישרדות — לאחריות.',lead:'לא עוד ביוגרפיה גנרית. אלה תמונות, שידורים ומשפטים שמחזיקים את הדרך עצמה — הילדות, השירות, החזרה לג׳סי כהן, האבהות, StartOn והקול הציבורי.',source:'למקור',owned:'חומר אישי',media:'מקור תקשורתי'},
  en:{kicker:'LIFE → SERVICE → PUBLIC VOICE',title:'From an abused child to a fighter and commander. From survival to responsibility.',lead:'Not a generic biography. These are images, broadcasts and words that carry the path itself — childhood, service, the return to Jesse Cohen, fatherhood, StartOn and a public voice.',source:'Open source',owned:'Personal archive',media:'Media source'},
  ru:{kicker:'LIFE → SERVICE → PUBLIC VOICE',title:'От ребёнка, пережившего насилие, — к бойцу и командиру. От выживания — к ответственности.',lead:'Не шаблонная биография. Здесь фотографии, эфиры и слова, которые несут сам путь: детство, служба, возвращение в Джесси Коэн, отцовство, StartOn и общественный голос.',source:'Источник',owned:'Личный архив',media:'Медиаисточник'}
} as const;

export default function PersonalMediaShowcase({locale}:{locale:Locale}){
  const c=sectionCopy[locale];
  return <section className='pm-proof' id='media-proof' aria-labelledby='pm-proof-title'>
    <header className='pm-proof-head'>
      <p>{c.kicker}</p>
      <h2 id='pm-proof-title'>{c.title}</h2>
      <span>{c.lead}</span>
    </header>
    <div className='pm-proof-grid'>
      {proofItems.map((item,index)=>{
        const href=typeof item.sourceUrl==='string'?item.sourceUrl:item.sourceUrl[locale];
        const external=item.kind!=='owner';
        return <a className={'pm-card pm-'+item.kind} href={href} target={external?'_blank':undefined} rel={external?'noreferrer':undefined} key={item.id}>
          <figure>
            <img src={item.image} alt={item.title[locale]} loading={index<3?'eager':'lazy'} decoding='async' referrerPolicy='no-referrer' onError={event=>{const img=event.currentTarget;if(img.dataset.fallback==='1')return;img.dataset.fallback='1';img.src=item.fallback}}/>
            {item.kind==='broadcast'&&<i aria-hidden='true'><Play fill='currentColor'/></i>}
            <em>{item.kind==='owner'?c.owned:c.media}</em>
          </figure>
          <div className='pm-card-copy'>
            <small dir='ltr'>{item.year} · {item.publisher}</small>
            <h3>{item.title[locale]}</h3>
            {item.statement&&<p className='pm-statement'>{item.statement[locale]}</p>}
            {item.quote&&<blockquote className='pm-quote'><Quote aria-hidden='true'/><span>{item.quote[locale]}</span></blockquote>}
            <footer>
              <span className='pm-credit'>{item.credit[locale]}</span>
              <b>{c.source}<ArrowUpRight/></b>
            </footer>
          </div>
        </a>
      })}
    </div>
  </section>
}
