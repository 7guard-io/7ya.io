import {deepMedia,type DeepMediaCategory} from '../deep-media-data';
import type {Locale} from '../locale';

type Local=Record<Locale,string>;
type Layer='CANON'|'DISCOVERY'|'LIVE'|'LEGACY'|'PENDING';
export type HomeVisualFrame={id:string;layer:Layer;title:Local;date:string;year:string;platform:string;publisher:string;mediaType:string;sourceKind:string;sourceUrl:string;imageUrl:string;screenshotUrl:string;trust:string;metrics?:Array<{label:string;value:string;unit:string;date:string}>};
const L=(he:string,en:string,ru:string):Local=>({he,en,ru});
const titles:Record<string,Local>={
'nawan-external-2026':L('5.13M — רגע חיצוני שחצה קהל','5.13M — an external moment that crossed audiences','5,13 млн — внешний момент, вышедший к новой аудитории'),
'russian-education-legacy':L('חינוך רוסי — שורש ויראלי מוקדם','Russian upbringing — an early viral creator root','Русское воспитание — ранний вирусный корень автора'),
'russian-father-short':L('אבא רוסי — זהות והומור בפורמט קצר','Russian father — identity and humour in short form','Русский папа — идентичность и юмор в коротком формате'),
'excel-video':L('מת על אקסל — מוזיקה, הומור ושיתוף פעולה','Met Al Excel — music, humour and collaboration','«Мет аль Excel» — музыка, юмор и коллаборация'),
'bizzi-video':L('BIZZI — שיתוף יצירה עם NAWAN','BIZZI — co-creation with NAWAN','BIZZI — совместная работа с NAWAN'),
'flower-video':L('פרח במדבר — הקליפ הרשמי','Flower in the Desert — official video','«Цветок в пустыне» — официальный клип'),
'supaporp-video':L('СупаПорп — השכבה הרוסית של היצירה','СупаПорп — the Russian-language creation layer','СупаПорп — русскоязычный слой творчества'),
'police-exit-2023':L('למה עזבתי את משטרת ישראל','Why I left the Israel Police','Почему я ушёл из полиции Израиля'),
'fraud-13':L('מפוסט אישי — לאולפן חדשות 13','From a personal post — to the News 13 studio','От личного поста — в студию News 13'),
'fraud-12':L('המאבק בהונאות קשישים — ראיון המשך','The elder-fraud campaign — follow-up interview','Борьба с мошенничеством против пожилых — продолжение интервью'),
'starton-14':L('משירות ציבורי — לבניית StartOn','From public service — to building StartOn','От государственной службы — к созданию StartOn'),
'starton-day':L('החלל האינטראקטיבי לנוער מקבל תמונה','The interactive youth space becomes visible','Интерактивное пространство для молодёжи становится видимым'),
'starton-13-page':L('עזב את המשטרה כדי לבנות התחלה חדשה','He left the police to build a new beginning','Он ушёл из полиции, чтобы построить новое начало'),
'mynet-return':L('חוזר לג׳סי כהן — צילום העיתונות של החזרה','Returning to Jesse Cohen — the press photograph of the return','Возвращение в Джесси Коэн — пресс-фотография возвращения'),
'mindset-page':L('מנער בסיכון ליזם חברתי — שיחת עומק','From at-risk youth to social entrepreneur — a long conversation','От подростка группы риска к социальному предпринимателю — глубокий разговор'),
'medium-story':L('המסע לפני המותג — רטרוספקטיבה כתובה','The journey before the brand — a written retrospective','Путь до бренда — письменная ретроспектива'),
'father-hidabroot':L('אבא מושלם — זה אבא ששם','A perfect father is a father who is present','Идеальный отец — тот, кто рядом'),
'mial-maakav-2023':L('סיפור מיאל ממשיך לעיתונות חיצונית','Miel’s story moves into external press','История Миэля выходит во внешнюю прессу'),
'nova-long':L('שיחה ארוכה על שבר, זהות ואחריות','A long conversation about rupture, identity and responsibility','Долгий разговор о переломе, идентичности и ответственности'),
'youth-radio':L('אם לנו קשה — מה עובר על נוער בסיכון','If it is hard for us — what are youth at risk going through?','Если трудно нам — что переживают подростки группы риска?'),
'dna-710':L('7/10 שינה את ה-DNA הישראלי','October 7 changed Israel’s DNA','7 октября изменило ДНК Израиля'),
'ndi-repatriation-2024':L('דור 1.5 — ילדות של עולה, זהות ושייכות','Generation 1.5 — immigrant childhood, identity and belonging','Поколение 1.5 — детство репатрианта, идентичность и принадлежность'),
'creators-home-3':L('יוצרים מהבית — שיחה של כמעט שעתיים','Creators from Home — a nearly two-hour conversation','«Создатели из дома» — разговор почти на два часа'),
'zman-tiktok':L('לבן שלי אין טיקטוק!','My son does not have TikTok!','У моего сына нет TikTok!'),
'zman-rules':L('כללי המשחק השתנו','The rules of the game changed','Правила игры изменились'),
'early-2011':L('נגד כל הסיכויים — הרשומה המוקדמת','Against all odds — the early public record','Вопреки всему — ранняя публичная запись'),
'wikimedia':L('דיוקן ציבורי פתוח','Open public portrait','Открытый публичный портрет'),
'instagram-story-20260801':L('שלום שבת — איגור מדבר ישירות למצלמה','Shabbat shalom — Igor speaks directly to camera','Шаббат шалом — Игорь говорит прямо в камеру')
};
const order=['nawan-external-2026','fraud-13','starton-14','mynet-return','mindset-page','medium-story','instagram-story-20260801','russian-education-legacy','police-exit-2023','starton-day','father-hidabroot','mial-maakav-2023','fraud-12','nova-long','youth-radio','dna-710','ndi-repatriation-2024','creators-home-3','excel-video','bizzi-video','flower-video','supaporp-video','russian-father-short','zman-tiktok','zman-rules','early-2011','wikimedia'];
const projectionOrder=[...order,...deepMedia.map(item=>item.id).filter(id=>!order.includes(id))];
const sourceKind=(id:string,category:DeepMediaCategory)=>id==='nawan-external-2026'?'external-repost':category==='טלוויזיה'?'broadcast':category==='פודקאסטים'?'podcast':category==='עיתונות'||category==='כתיבה'?'press':category==='ויראלי'?'viral-public':category==='StartOn'?'public-video':'public-video';
export const homeVisualCorpus:HomeVisualFrame[]=projectionOrder.flatMap(id=>{const item=deepMedia.find(record=>record.id===id);if(!item)return[];return[{id:'visual-'+id,layer:'CANON',title:titles[id]||L(item.title,item.title,item.title),date:item.year,year:item.year,platform:item.youtubeId?'YouTube':item.category,publisher:item.source,mediaType:item.youtubeId?'video':item.id==='wikimedia'?'image':'article',sourceKind:sourceKind(id,item.category),sourceUrl:item.url,imageUrl:item.image||item.fallback,screenshotUrl:item.fallback||'',trust:item.status,metrics:item.metric?[{label:'SOURCE SNAPSHOT',value:item.metric,unit:'',date:item.year}]:undefined}]});
