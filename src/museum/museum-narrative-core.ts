export type MuseumLocale='he'|'en'|'ru';
export type Localized={he?:string;en?:string;ru?:string};
export type ProjectionMetric={label:string;value:string|number;unit:string;date:string};
export type ProjectionMoment={id:string;canonicalId:string;layer:string;title:Localized;summary:Localized;year:string;date:string;platform:string;publisher:string;sourceUrl:string;imageUrl:string;trust:string;metrics:ProjectionMetric[];relationships?:string[];topics?:string[];};
export type StoryMoment=ProjectionMoment&{displayTitle:string;displaySummary:string;chapterLabel:string;narrative:string};
export type StoryChoice={id:string;label:string;year:string;correct:boolean};
export type StoryQuestion={prompt:string;correctId:string;choices:StoryChoice[]};

type StorySpec={id:string;label:Record<MuseumLocale,string>;narrative:Record<MuseumLocale,string>};
export const STORY_SPINE:StorySpec[]=[
  {id:'origin-belonging-1990s',label:{he:'ילדות, עלייה ושייכות',en:'Childhood, immigration & belonging',ru:'Детство, репатриация и принадлежность'},narrative:{he:'נולדתי בחרקוב ב־1990 ועליתי לישראל כילד. הפרק הראשון של הסיפור הוא לא תפקיד או תואר — הוא שייכות, זהות והדרך שבה ילד לומד איפה הוא עומד בעולם.',en:'I was born in Kharkiv in 1990 and immigrated to Israel as a child. The first chapter is not a title or role — it is belonging, identity and learning where you stand in the world.',ru:'Я родился в Харькове в 1990 году и ребёнком репатриировался в Израиль. Первая глава — не должность и не титул, а принадлежность, идентичность и поиск своего места.'}},
  {id:'service-field-2011-2021',label:{he:'שירות, ביטחון ומשטרה',en:'Service, security & police',ru:'Служба, безопасность и полиция'},narrative:{he:'אחרי הילדות והעלייה הגיע עשור של שירות, ביטחון ומשטרה. זה הפרק שבו אחריות ציבורית הופכת מחוויה אישית למסלול מקצועי מתועד.',en:'After childhood and immigration came a decade of service, security and police work. Responsibility moved from personal experience into a documented public-service path.',ru:'После детства и репатриации пришло десятилетие службы, безопасности и полиции. Ответственность стала уже не личным опытом, а документированным профессиональным путём.'}},
  {id:'starton-return-2022',label:{he:'החזרה לג׳סי כהן → StartOn',en:'Return to Jesse Cohen → StartOn',ru:'Возвращение в Джесси Коэн → StartOn'},narrative:{he:'ב־2022 המסלול חזר לנקודת ההתחלה: ג׳סי כהן. משם StartOn התחיל לקבל צורה — ניסיון חיים שהופך לתשתית של טכנולוגיה, יצירה ושייכות עבור צעירים.',en:'In 2022 the path returned to its starting point: Jesse Cohen. From there StartOn began taking shape — lived experience turned into infrastructure for technology, creation and belonging for young people.',ru:'В 2022 году путь вернулся к исходной точке — Джесси Коэн. Там StartOn начал приобретать форму: жизненный опыт превращался в инфраструктуру технологий, творчества и принадлежности для молодых людей.'}},
  {id:'fatherhood-viral-2023-02-20',label:{he:'אבהות שהפכה לשיחה ציבורית',en:'Fatherhood becomes a public conversation',ru:'Отцовство становится публичным разговором'},narrative:{he:'ב־2023 פוסט על אבהות ונוכחות יצא מעבר לחשבון האישי והפך לסיפור שמופץ ומסוקר. כאן רואים איך רגע פרטי־ציבורי אחד מייצר הד רחב יותר.',en:'In 2023 a post about fatherhood and presence moved beyond a personal account and became a distributed public story. This is where one personal-public moment begins to create a wider echo.',ru:'В 2023 году пост об отцовстве и присутствии вышел за пределы личного аккаунта и стал публичной историей, которую распространяли и обсуждали.'}},
  {id:'life-music-2025',label:{he:'יצירה ומוזיקה',en:'Creation & music',ru:'Творчество и музыка'},narrative:{he:'היצירה לא נפרדה מהמסלול. מוזיקה, וידאו ושיתופי פעולה הפכו לעוד דרך לספר, להפיץ ולבדוק איך קול אישי עובד במרחב ציבורי.',en:'Creation never became a separate track. Music, video and collaborations became another way to tell, distribute and test how a personal voice works in public.',ru:'Творчество не стало отдельной линией. Музыка, видео и коллаборации стали ещё одним способом рассказывать историю и проверять, как личный голос работает публично.'}},
  {id:'7ya-now-snapshot-2026',label:{he:'7YA · עכשיו',en:'7YA · now',ru:'7YA · сейчас'},narrative:{he:'היום 7YA מחבר את הסיפור, המקורות, המדיה והעשייה למערכת ציבורית אחת. לא כדי להחליף את החיים בארכיון — אלא כדי שאפשר יהיה לחקור אותם בלי לאבד הקשר.',en:'Today 7YA connects the story, sources, media and work into one public system. Not to replace a life with an archive, but to make it explorable without losing context.',ru:'Сегодня 7YA соединяет историю, источники, медиа и работу в одну публичную систему — не чтобы заменить жизнь архивом, а чтобы её можно было исследовать без потери контекста.'}}
];

const localized=(value:Localized,locale:MuseumLocale)=>value?.[locale]||value?.he||value?.en||value?.ru||'';
const rankRecord=(item:ProjectionMoment)=>(item.layer==='CANON'?100:0)+(item.imageUrl?20:0)+(item.sourceUrl?10:0)+(item.metrics?.length||0);

export function buildStoryMoments(items:ProjectionMoment[],locale:MuseumLocale='he'):StoryMoment[]{
  return STORY_SPINE.map(spec=>{
    const candidates=items.filter(item=>item.canonicalId===spec.id).sort((a,b)=>rankRecord(b)-rankRecord(a));
    const record=candidates[0];
    if(!record)return null;
    return {...record,canonicalId:spec.id,displayTitle:localized(record.title,locale)||spec.label[locale],displaySummary:localized(record.summary,locale),chapterLabel:spec.label[locale],narrative:spec.narrative[locale]};
  }).filter((item):item is StoryMoment=>Boolean(item));
}

export function questionForIndex(moments:StoryMoment[],index:number,locale:MuseumLocale='he'):StoryQuestion|null{
  if(index<0||index>=moments.length-1)return null;
  const correct=moments[index+1];
  const distractors=moments.filter((_,candidateIndex)=>candidateIndex!==index&&candidateIndex!==index+1).slice(0,3);
  const raw=[correct,...distractors].map(moment=>({id:moment.canonicalId,label:moment.chapterLabel||moment.displayTitle,year:moment.year||'',correct:moment.canonicalId===correct.canonicalId}));
  if(raw.length!==4)return null;
  const offset=((index*2)+1)%raw.length;
  const choices=[...raw.slice(offset),...raw.slice(0,offset)];
  const prompts:Record<MuseumLocale,string>={he:'מה לדעתך מגיע עכשיו במסלול המתועד?',en:'What do you think comes next in the documented journey?',ru:'Как думаете, что идёт дальше в документированном пути?'};
  return{prompt:prompts[locale],correctId:correct.canonicalId,choices};
}
