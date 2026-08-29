import {pageHref,useLocale,type Locale} from '../locale';
import './life-album-spine.css';

export type LifeAlbumView='home'|'museum'|'music'|'media'|'speaker'|'blog'|'create'|'research';
type Local={he:string;en:string;ru:string};
type Stop={id:string;year:string;hash:string;label:Local};
type RouteContext={range:string;label:Local;focus:string};
const L=(he:string,en:string,ru:string):Local=>({he,en,ru});
const stops:Stop[]=[
{id:'origin',year:'1990',hash:'#cinema-origin',label:L('מקור','Origin','Начало')},
{id:'service',year:'2011',hash:'#cinema-service',label:L('שירות','Service','Служба')},
{id:'return',year:'2022',hash:'#cinema-return',label:L('חזרה / StartOn','Return / StartOn','Возвращение / StartOn')},
{id:'voice',year:'2023',hash:'#public-action',label:L('קול ציבורי','Public voice','Публичный голос')},
{id:'break',year:'2024',hash:'#identity-rupture',label:L('שבר / עומק','Break / longform','Перелом / глубина')},
{id:'culture',year:'2025',hash:'#cinema-create',label:L('יצירה','Creation','Творчество')},
{id:'research',year:'2026',hash:'#cinema-research',label:L('מחקר / 7YA','Research / 7YA','Исследования / 7YA')},
{id:'now',year:'NOW',hash:'#now',label:L('עכשיו','Now','Сейчас')}
];
const contexts:Record<LifeAlbumView,RouteContext>={
home:{range:'1990—NOW',label:L('האלבום החי','The living album','Живой альбом'),focus:'now'},
museum:{range:'1990—NOW',label:L('מצב אלבום מלא','Full album mode','Полный альбом'),focus:'origin'},
media:{range:'2011—NOW',label:L('איך העולם ענה בחזרה','How the world answered back','Как мир ответил'),focus:'voice'},
music:{range:'2020—2025',label:L('פס הקול של החיים','Soundtrack of the life','Саундтрек жизни'),focus:'culture'},
research:{range:'2025—2026',label:L('השאלות שהחיים הכריחו לשאול','Questions the life forced','Вопросы, которые задала жизнь'),focus:'research'},
speaker:{range:'2022—NOW',label:L('הקול הציבורי לאורך הדרך','Public voice through the journey','Публичный голос пути'),focus:'voice'},
blog:{range:'2022—NOW',label:L('כתיבה מתוך החיים','Writing from lived experience','Тексты из прожитого'),focus:'break'},
create:{range:'NOW → FUTURE',label:L('מה עושים עם הסיפור מכאן','What the story builds next','Что строить дальше'),focus:'now'}
};
const eyebrow:Record<Locale,string>={he:'ציר החיים',en:'Life album',ru:'Альбом жизни'};
export default function LifeAlbumSpine({view}:{view:LifeAlbumView}){const {locale,dir}=useLocale();const context=contexts[view];const home=pageHref('home',locale);return <aside className={'life-album-spine '+(view==='home'?'is-home':'is-sticky')} dir={dir} aria-label={eyebrow[locale]}><div className='las-shell'><div className='las-context'><small dir='ltr'>LIFE ALBUM · {context.range}</small><strong>{context.label[locale]}</strong></div><nav className='las-track' aria-label={context.label[locale]}>{stops.map(stop=><a key={stop.id} href={home+stop.hash} className={context.focus===stop.id?'is-focus':undefined} aria-current={context.focus===stop.id?'step':undefined}><span dir='ltr'>{stop.year}</span><b>{stop.label[locale]}</b></a>)}</nav></div></aside>}
