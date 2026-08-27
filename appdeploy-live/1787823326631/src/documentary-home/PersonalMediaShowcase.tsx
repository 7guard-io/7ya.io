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
  image:string;
  fallback:string;
  sourceUrl:string;
  credit:LocalText;
};

const L=(he:string,en:string,ru:string):LocalText=>({he,en,ru});

const proofItems:ProofItem[]=[
  {
    id:'owner-press-wall',kind:'owner',year:'ARCHIVE',publisher:'7YA · OWNER ARCHIVE',
    title:L('החיים לפני הכותרות','The life before the headlines','Жизнь до заголовков'),
    quote:L('לפני החשיפה היה שירות. לפני המותג היה מסלול.','Before the exposure came service. Before the brand came a path.','До охватов была служба. До бренда был путь.'),
    image:'https://drive.google.com/thumbnail?id=1WKhOrE4Ppq5RFb7vd5uFRShUDZMGiK1W&sz=w1800',fallback:'./resources/igor-hero.jpg',
    sourceUrl:'https://7ya.io/library/?lang=he',
    credit:L('© Igor Vepretski / 7YA · ארכיון בעלים','© Igor Vepretski / 7YA · owner archive','© Igor Vepretski / 7YA · архив владельца')
  },
  {
    id:'owner-service',kind:'owner',year:'SERVICE',publisher:'7YA · OWNER ARCHIVE',
    title:L('מילד מוכה — למסלול של שירות ואחריות','From an abused child to a path of service and responsibility','От ребёнка, пережившего насилие, к пути службы и ответственности'),
    quote:L('העבר לא מוצג כאן כמדליה. הוא מסביר את הדרך.','The past is not displayed as a medal. It explains the path.','Прошлое здесь не медаль. Оно объясняет путь.'),
    image:'https://drive.google.com/thumbnail?id=1E9QZxIMVvACJc-jNVRnt_rxPlWOwTVBT&sz=w1800',fallback:'./resources/igor-hero.jpg',
    sourceUrl:'https://7ya.io/?lang=he#cinema-service',
    credit:L('© Igor Vepretski / 7YA · „לפני החשיפה היה שירות”','© Igor Vepretski / 7YA · “Before exposure came service”','© Igor Vepretski / 7YA · «До охватов была служба»')
  },
  {
    id:'mynet-return',kind:'press',year:'2022',publisher:'mynet חולון',
    title:L('חוזר לשכונה','Returning to the neighborhood','Возвращение в район'),
    quote:L('„חולם להותיר חותם”','“Dreams of leaving a mark”','«Мечтает оставить след»'),
    image:'./resources/igor-hero.jpg',fallback:'./resources/igor-hero.jpg',
    sourceUrl:'https://holon.mynet.co.il/local_news/article/hjxqegkiq',
    credit:L('צילום: קובי קואנקס · mynet חולון','Photo: Kobi Koanks · mynet Holon','Фото: Коби Коанкс · mynet Холон')
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
    id:'fatherhood-post',kind:'post',year:'2023',publisher:'הידברות · פוסט מאת Igor Vepretski',
    title:L('אבהות מחזירה את הילדות אל הפריים','Fatherhood brings childhood back into frame','Отцовство возвращает детство в кадр'),
    quote:L('„אבא מושלם — זה אבא ששם”','“A perfect father is a father who is there”','«Идеальный отец — тот, кто рядом»'),
    image:'https://storage.hidabroot.org/Graphics/Storage/327341.png',fallback:'./resources/igor-hero.jpg',
    sourceUrl:'https://www.hidabroot.org/article/1179015',
    credit:L('הידברות · מבוסס על פוסט אישי של איגור ופרצקי','Hidabroot · based on an authored post by Igor Vepretski','Hidabroot · по авторскому посту Игоря Вепрецкого')
  },
  {
    id:'mindset',kind:'podcast',year:'2022',publisher:'Mindset · שלומי חסטר',
    title:L('מנער בסיכון ליזם חברתי','From at-risk youth to social entrepreneur','От подростка группы риска к социальному предпринимателю'),
    quote:L('„האם להיות נער בסיכון זה חולשה, או למעשה חוזקה?”','“Is being at-risk a weakness — or can it become a strength?”','«Быть подростком группы риска — слабость или, возможно, сила?»'),
    image:'./resources/chapter-voice.webp',fallback:'./resources/igor-hero.jpg',
    sourceUrl:'https://mindset.org.il/%D7%9E%D7%A0%D7%A2%D7%A8-%D7%91%D7%A1%D7%99%D7%9B%D7%95%D7%9F-%D7%9C%D7%99%D7%96%D7%9D-%D7%97%D7%91%D7%A8%D7%AA%D7%99-%D7%90%D7%99%D7%92%D7%95%D7%A8-%D7%95%D7%A4%D7%A8%D7%A6%D7%A7%D7%99-%D7%A4/',
    credit:L('Mindset · שלומי חסטר · פרק 102','Mindset · Shlomi Haster · episode 102','Mindset · Шломи Хастер · выпуск 102')
  }
];

const sectionCopy={
  he:{kicker:'LIFE → SERVICE → PUBLIC VOICE',title:'מילד מוכה לחייל מצטיין. מהישרדות — לאחריות.',lead:'לא עוד ביוגרפיה גנרית. אלה תמונות, שידורים ומשפטים שמחזיקים את הדרך עצמה — הילדות, השירות, החזרה לג׳סי כהן, האבהות, StartOn והקול הציבורי.',source:'למקור',owned:'חומר אישי',media:'מקור תקשורתי'},
  en:{kicker:'LIFE → SERVICE → PUBLIC VOICE',title:'From an abused child to distinguished service. From survival to responsibility.',lead:'Not a generic biography. These are images, broadcasts and words that carry the path itself — childhood, service, the return to Jesse Cohen, fatherhood, StartOn and a public voice.',source:'Open source',owned:'Personal archive',media:'Media source'},
  ru:{kicker:'LIFE → SERVICE → PUBLIC VOICE',title:'От ребёнка, пережившего насилие, — к отличившемуся солдату. От выживания — к ответственности.',lead:'Не шаблонная биография. Здесь фотографии, эфиры и слова, которые несут сам путь: детство, служба, возвращение в Джесси Коэн, отцовство, StartOn и общественный голос.',source:'Источник',owned:'Личный архив',media:'Медиаисточник'}
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
      {proofItems.map((item,index)=><a className={'pm-card pm-'+item.kind} href={item.sourceUrl} target='_blank' rel='noreferrer' key={item.id}>
        <figure>
          <img src={item.image} alt={item.title[locale]} loading={index<3?'eager':'lazy'} decoding='async' referrerPolicy='no-referrer' onError={event=>{const img=event.currentTarget;if(img.src.endsWith(item.fallback))return;img.src=item.fallback}}/>
          {item.kind==='broadcast'&&<i aria-hidden='true'><Play fill='currentColor'/></i>}
          <em>{item.kind==='owner'?c.owned:c.media}</em>
        </figure>
        <div className='pm-card-copy'>
          <small dir='ltr'>{item.year} · {item.publisher}</small>
          <h3>{item.title[locale]}</h3>
          {item.quote&&<blockquote className='pm-quote'><Quote aria-hidden='true'/><span>{item.quote[locale]}</span></blockquote>}
          <footer>
            <span className='pm-credit'>{item.credit[locale]}</span>
            <b>{c.source}<ArrowUpRight/></b>
          </footer>
        </div>
      </a>)}
    </div>
  </section>
}
