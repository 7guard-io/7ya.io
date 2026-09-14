import { useCallback, useEffect, useMemo, useState } from 'react';
import { deepMedia } from './deep-media-data';
import { albumChapters, type AlbumChapter } from './album/album-data';
import LazyYouTube from './LazyYouTube';
import { pageHref, rootHref, useLocale, type Locale } from './locale';
import './life-throughline.css';

export const JOURNEY_STORAGE_KEY = '7ya:journey:v1';
export const JOURNEY_CHAPTER_IDS = ['origin', 'service', 'police', 'return', 'fatherhood', 'oct7', 'creation', 'leadership', 'now'] as const;
export type JourneyChapterId = (typeof JOURNEY_CHAPTER_IDS)[number];

type Chapter = {
    id: JourneyChapterId;
    period: string;
    title: string;
    body: string;
    sourceId?: string;
    sourceName?: string;
    localImage?: string;
};

type ThroughlineCopy = {
    kicker: string;
    title: string;
    intro: string;
    source: string;
    record: string;
    video: string;
    fullStory: string;
    evidence: string;
    progress: string;
    explored: string;
    next: string;
    complete: string;
    chapters: Chapter[];
};

type HumanContext = {
    age: string;
    place: string;
    people: string;
    moment: string;
    response: string;
    consequence: string;
    reflection: string;
    capability: string;
    publicValue: string;
    boundary?: string;
};

type HumanLabels = {
    album: string;
    rule: string;
    age: string;
    place: string;
    people: string;
    moment: string;
    response: string;
    consequence: string;
    reflection: string;
    capability: string;
    publicValue: string;
    boundary: string;
};

const humanLabels: Record<Locale, HumanLabels> = {
    he: {
        album: 'PERSONAL ALBUM / IGOR VEPRETSKI',
        rule: 'AGE → PLACE → PEOPLE → MOMENT → MEDIA → RESPONSE → CONSEQUENCE → REFLECTION',
        age: 'גיל',
        place: 'מקום',
        people: 'אנשים',
        moment: 'הרגע',
        response: 'מה חזר מהקהל',
        consequence: 'מה קרה אחר כך',
        reflection: 'מה אני מבין היום',
        capability: 'מה למדתי לעשות',
        publicValue: 'מה אני לוקח הלאה',
        boundary: 'גבול מקור',
    },
    en: {
        album: 'PERSONAL ALBUM / IGOR VEPRETSKI',
        rule: 'AGE → PLACE → PEOPLE → MOMENT → MEDIA → RESPONSE → CONSEQUENCE → REFLECTION',
        age: 'Age',
        place: 'Place',
        people: 'People',
        moment: 'The moment',
        response: 'What came back from people',
        consequence: 'What happened next',
        reflection: 'What I understand today',
        capability: 'What I learned to do',
        publicValue: 'What I carry forward',
        boundary: 'Source boundary',
    },
    ru: {
        album: 'PERSONAL ALBUM / IGOR VEPRETSKI',
        rule: 'AGE → PLACE → PEOPLE → MOMENT → MEDIA → RESPONSE → CONSEQUENCE → REFLECTION',
        age: 'Возраст',
        place: 'Место',
        people: 'Люди',
        moment: 'Момент',
        response: 'Что вернулось от аудитории',
        consequence: 'Что произошло дальше',
        reflection: 'Что я понимаю сегодня',
        capability: 'Чему я научился',
        publicValue: 'Что я несу дальше',
        boundary: 'Граница источника',
    },
};

const copy: Record<Locale, ThroughlineCopy> = {
    he: {
        kicker: '#7YA🥷 / LIFE THROUGHLINE · 1990 → NOW',
        title: 'לא קורות חיים. החיים עצמם.',
        intro: 'תשע תחנות שמחברות ילדות ועלייה, צבא וביטחון, משטרה, חזרה לשכונה, אבהות, 7 באוקטובר, יצירה, פוליטיקה וההווה. בכל תחנה המדיה והמקור באים לפני הסבר מופשט.',
        source: 'למקור',
        record: 'מקור ציבורי',
        video: 'וידאו מקור',
        fullStory: 'לסיפור החיים המלא',
        evidence: 'למקורות ולראיות',
        progress: 'התקדמות במסע',
        explored: 'פרקים שנחקרו',
        next: 'לפרק הבא',
        complete: 'הגעתם ל־NOW — לראות מה נבנה מכאן',
        chapters: [
            { id: 'origin', period: '1990 → 2007', title: 'חרקוב → ישראל → ג׳סי כהן', body: 'נולדתי בחרקוב ועליתי לישראל כילד. בת־ים, חולון וג׳סי כהן הפכו את שאלת השייכות למשהו שחוזר איתי עד היום. המקור כאן מחזיר למסמך בית־ספר מ־1997 ולזיכרון שפורסם שנים אחר כך — זיכרון אמיתי, לא צילום ילדות מומצא.', sourceId: 'school-note-reflection-2022' },
            { id: 'service', period: '2008 → 2014', title: 'צה״ל, ביטחון ושליחות', body: 'השירות הצבאי והביטחוני היה נקודת המפנה הראשונה: מסגרת, אחריות ויציאה מהמסלול שסומן לי בילדות. העוגן הראשי כאן הוא מקור עיתונאי תקופתי מ־2011; לצד התחנה מופיע גם מסמך ממשל אמריקאי מ־2012 שמאמת את הופעת שמי ברשומה קונסולרית.', sourceId: 'early-2011' },
            { id: 'police', period: '2015 → 2021', title: 'משטרה: החיים בתוך הקצה', body: 'שנות המשטרה הכניסו אותי שוב ושוב לנקודה שבה מערכת פוגשת אדם במצבי קצה. המקור הראשי כאן הוא הווידאו שבו הסברתי לאחר מכן למה עזבתי; סביבו נשמרים פוסטים על מדים, אמון ציבורי והחיים בתוך השירות.', sourceId: 'police-exit-2023' },
            { id: 'return', period: '2022', title: 'לחזור לשכונה', body: 'במקום להתרחק מהסיפור של ג׳סי כהן, חזרתי אליו. StartOn נולד מתוך ניסיון לחבר צעירים לטכנולוגיה, יצירה, מבוגרים תומכים והזדמנות — והחזרה עצמה תועדה בעיתונות.', sourceId: 'mynet-return' },
            { id: 'fatherhood', period: '2023', title: 'אבהות הופכת לשיחה ציבורית', body: 'טקסט אישי על אבהות ונוכחות הורית יצא מהפיד והפך לכתבה ולשיחה רחבה. בשבילי זה היה שיעור בכוח של סיפור אישי כשהוא נוגע במשהו שאנשים רבים מכירים מהחיים שלהם.', sourceId: 'father-hidabroot' },
            { id: 'oct7', period: '2023 → 2024', title: '7 באוקטובר שובר את הרצף', body: 'אחרי 7 באוקטובר השתנה גם הקול הציבורי שלי סביב שבר, זהות ואחריות. המקור כאן הוא שיחה ארוכה שכותרתה עוסקת בנובה ובהתפכחות; האתר אינו הופך את כותרת המארח לבדה לעובדה ביוגרפית שלא אומתה בנפרד.', sourceId: 'nova-long' },
            { id: 'creation', period: '2020 → 2025', title: 'גם מוזיקה היא ביוגרפיה', body: 'קליפים, הומור, שיתופי פעולה וקול שלא נכנס לתיאור תפקיד. BIZZI הוא אחת התחנות המתועדות בזהות היצירתית הזאת, לצד ארכיון מוזיקלי רחב יותר.', sourceId: 'bizzi-video' },
            { id: 'leadership', period: '2023 → 2026', title: 'פוליטיקה: להיכנס לחדר ההחלטות', body: 'הכניסה לפוליטיקה התחילה בהחלטה ציבורית מתועדת והמשיכה לקמפיין מקומי, פעילות מפלגתית ותוכן בעברית וברוסית. ההפצה היא חלק מהדרך — לא הוכחה לבחירה, מינוי או תמיכה שלא תועדו.', sourceId: 'politics-entry-2023' },
            { id: 'now', period: '2026 → NOW', title: 'מזיכרון לפעולה', body: '7YA הוא ההווה: ניסיון לחבר את כל החיים האלה — המדיה, השירות, StartOn, היצירה והקול הציבורי — לרשומה חיה שאפשר לראות, לפתוח ולבדוק. הפריים כאן מגיע מריל אישי מהתקופה הנוכחית.', sourceId: 'instagram-story-20260801' },
        ],
    },
    en: {
        kicker: '#7YA🥷 / LIFE THROUGHLINE · 1990 → NOW',
        title: 'Not a résumé. The life itself.',
        intro: 'Nine stages connect childhood and immigration, military and security service, policing, returning to the neighborhood, fatherhood, October 7, creation, politics and the present. In every stage, source-bound media comes before abstract explanation.',
        source: 'Open source',
        record: 'PUBLIC SOURCE',
        video: 'SOURCE VIDEO',
        fullStory: 'Full life story',
        evidence: 'Sources & evidence',
        progress: 'Journey progress',
        explored: 'chapters explored',
        next: 'Next chapter',
        complete: 'You reached NOW — see what is being built from here',
        chapters: [
            { id: 'origin', period: '1990 → 2007', title: 'Kharkiv → Israel → Jesse Cohen', body: 'I was born in Kharkiv and immigrated to Israel as a child. Bat Yam, Holon and Jesse Cohen made belonging a question that still follows the work today. The source here returns to a 1997 school note through a later public memory — a real surviving artifact rather than invented childhood imagery.', sourceId: 'school-note-reflection-2022' },
            { id: 'service', period: '2008 → 2014', title: 'Military, security and mission', body: 'Military and security service became the first major turn: structure, responsibility and a path away from the trajectory marked out in childhood. The main anchor is a period press source from 2011; a 2012 U.S. government consular record sits alongside it as an additional documented trace.', sourceId: 'early-2011' },
            { id: 'police', period: '2015 → 2021', title: 'Police: life inside the edge', body: 'Police years repeatedly placed me where institutions meet people in extreme situations. The main source is the later video explaining why I left the Israel Police; around it survive public posts about uniform, public trust and life inside service.', sourceId: 'police-exit-2023' },
            { id: 'return', period: '2022', title: 'Returning to the neighborhood', body: 'Instead of moving away from the Jesse Cohen story, I returned to it. StartOn grew from an attempt to connect young people with technology, creation, supportive adults and opportunity — and the return itself was documented in the press.', sourceId: 'mynet-return' },
            { id: 'fatherhood', period: '2023', title: 'Fatherhood becomes a public conversation', body: 'A personal piece about fatherhood and parental presence moved beyond the feed into an article and a wider conversation. It became a lesson in what can happen when a personal story touches something many people recognize in their own lives.', sourceId: 'father-hidabroot' },
            { id: 'oct7', period: '2023 → 2024', title: 'October 7 breaks the continuity', body: 'After October 7, my public voice changed around fracture, identity and responsibility. The source here is a long-form conversation whose host title refers to Nova and disillusionment; the site does not turn that host framing alone into an unverified biographical fact.', sourceId: 'nova-long' },
            { id: 'creation', period: '2020 → 2025', title: 'Music is biography too', body: 'Clips, humour, collaborations and a voice that never fit inside a job title. BIZZI is one documented point in that creative identity, alongside a broader public music archive.', sourceId: 'bizzi-video' },
            { id: 'leadership', period: '2023 → 2026', title: 'Politics: entering the decision room', body: 'The move into politics began with a documented public decision and continued through a local campaign, party activity and Hebrew- and Russian-language content. Distribution is part of the path — not proof of election, appointment or endorsement that the sources do not establish.', sourceId: 'politics-entry-2023' },
            { id: 'now', period: '2026 → NOW', title: 'From memory to action', body: '7YA is the present-tense attempt to connect these lives — media, service, StartOn, creation and public voice — into a living record people can see, open and verify. The frame here comes from a personal reel from the current period.', sourceId: 'instagram-story-20260801' },
        ],
    },
    ru: {
        kicker: '#7YA🥷 / LIFE THROUGHLINE · 1990 → NOW',
        title: 'Не резюме. Сама жизнь.',
        intro: 'Девять этапов соединяют детство и репатриацию, армию и безопасность, полицию, возвращение в район, отцовство, 7 октября, творчество, политику и настоящее. На каждом этапе сначала показываются медиа и источник, а уже потом объяснение.',
        source: 'Открыть источник',
        record: 'ПУБЛИЧНЫЙ ИСТОЧНИК',
        video: 'ВИДЕО-ИСТОЧНИК',
        fullStory: 'Полная история жизни',
        evidence: 'Источники и доказательства',
        progress: 'Прогресс пути',
        explored: 'глав изучено',
        next: 'Следующая глава',
        complete: 'Вы дошли до NOW — посмотреть, что строится дальше',
        chapters: [
            { id: 'origin', period: '1990 → 2007', title: 'Харьков → Израиль → Джесси Коэн', body: 'Я родился в Харькове и репатриировался в Израиль ребёнком. Бат-Ям, Холон и Джесси Коэн сделали вопрос принадлежности частью моей дальнейшей жизни. Источник здесь возвращает к школьной записке 1997 года через более позднее публичное воспоминание — это реальный сохранившийся след, а не выдуманная детская фотография.', sourceId: 'school-note-reflection-2022' },
            { id: 'service', period: '2008 → 2014', title: 'Армия, безопасность и миссия', body: 'Военная служба и безопасность стали первым большим поворотом: структура, ответственность и выход из траектории, обозначенной в детстве. Главная опора — публикация периода 2011 года; рядом сохраняется официальный консульский документ США 2012 года как дополнительный подтверждённый след.', sourceId: 'early-2011' },
            { id: 'police', period: '2015 → 2021', title: 'Полиция: жизнь на границе', body: 'Годы в полиции снова и снова ставили меня в точку, где система встречает человека в экстремальных обстоятельствах. Главный источник — более позднее видео о том, почему я ушёл из полиции Израиля; рядом сохраняются посты о форме, доверии и жизни внутри службы.', sourceId: 'police-exit-2023' },
            { id: 'return', period: '2022', title: 'Вернуться в район', body: 'Вместо того чтобы уйти дальше от истории Джесси Коэн, я вернулся к ней. StartOn вырос из попытки соединить молодёжь с технологиями, творчеством, поддерживающими взрослыми и возможностями — а само возвращение было зафиксировано в прессе.', sourceId: 'mynet-return' },
            { id: 'fatherhood', period: '2023', title: 'Отцовство становится публичным разговором', body: 'Личный текст об отцовстве и присутствии родителя вышел за пределы ленты и стал статьёй и более широким разговором. Для меня это стало уроком о силе личной истории, когда она касается опыта многих людей.', sourceId: 'father-hidabroot' },
            { id: 'oct7', period: '2023 → 2024', title: '7 октября ломает привычный ход жизни', body: 'После 7 октября изменился и мой публичный голос вокруг слома, идентичности и ответственности. Источник здесь — длинный разговор, в заголовке ведущего которого упоминаются Nova и переосмысление; сайт не превращает один этот заголовок в неподтверждённый биографический факт.', sourceId: 'nova-long' },
            { id: 'creation', period: '2020 → 2025', title: 'Музыка — тоже биография', body: 'Клипы, юмор, коллаборации и голос, который не помещается в должность. BIZZI — одна из документированных точек этой творческой идентичности рядом с более широким музыкальным архивом.', sourceId: 'bizzi-video' },
            { id: 'leadership', period: '2023 → 2026', title: 'Политика: войти в комнату решений', body: 'Вход в политику начался с документированного публичного решения и продолжился местной кампанией, партийной активностью и контентом на иврите и русском. Распространение — часть пути, но не доказательство избрания, назначения или поддержки, которых источник не подтверждает.', sourceId: 'politics-entry-2023' },
            { id: 'now', period: '2026 → NOW', title: 'От памяти к действию', body: '7YA — это настоящее: попытка соединить медиа, службу, StartOn, творчество и публичный голос в живую запись, которую можно увидеть, открыть и проверить. Кадр здесь взят из личного рилса текущего периода.', sourceId: 'instagram-story-20260801' },
        ],
    },
};

const albumContextMap: Partial<Record<JourneyChapterId, AlbumChapter['id']>> = {
    origin: 'origin',
    service: 'service',
    police: 'service',
    return: 'starton',
    fatherhood: 'fatherhood',
    creation: 'create',
    leadership: 'leadership',
    now: 'now',
};

const albumChapterById = new Map(albumChapters.map(chapter => [chapter.id, chapter]));

const oct7Context: Record<Locale, HumanContext> = {
    he: {
        age: 'בן 33 → 34',
        place: 'ישראל · הרשת הציבורית · שיחות ארוכות',
        people: 'קהלים, מארחים וקהילות ציבוריות',
        moment: '7 באוקטובר קטע את הרצף והכריח אותי לדבר אחרת על שבר, זהות ואחריות. החומר שנשמר כולל פוסטים ושיחה ארוכה; הוא מוצג לפי מה שהמקור באמת אומר, לא לפי מה שנוח לביוגרפיה.',
        response: 'התגובות וההפצה נשמרות במקורות שבהם התרחשו. אין כאן מספר אחד שמעמיד פנים שכל צפייה, תגובה ושיחה הן אותו דבר.',
        consequence: 'הקול הציבורי עבר מתוכן קצר בלבד גם לשאלות ארוכות יותר על אחריות, זיכרון ומה עושים אחרי שבר לאומי.',
        reflection: 'היום אני משתדל להבדיל חזק יותר בין עדות, פרשנות ועובדה. דווקא ברגעי שבר, שמירת המקור חשובה יותר מהגברה מהירה.',
        capability: 'להחזיק מורכבות בלי למחוק את המקור',
        publicValue: 'להפריד בין מה שנחווה, מה שנאמר ומה שאפשר להוכיח.',
        boundary: 'כותרת המארח המזכירה Nova אינה מוצגת כהוכחה ביוגרפית עצמאית.',
    },
    en: {
        age: 'AGE 33 → 34',
        place: 'ISRAEL · PUBLIC WEB · LONG-FORM CONVERSATION',
        people: 'AUDIENCES, HOSTS AND PUBLIC COMMUNITIES',
        moment: 'October 7 broke the continuity and forced a different public language around fracture, identity and responsibility. The surviving material includes posts and a long-form conversation; it is presented for what the source actually says, not for what would make a cleaner biography.',
        response: 'Response and distribution remain attached to the surfaces where they occurred. There is no single number pretending every view, comment and conversation is the same signal.',
        consequence: 'The public voice moved beyond short-form content into longer questions about responsibility, memory and what comes after national rupture.',
        reflection: 'Today I try to separate testimony, interpretation and fact more rigorously. In moments of rupture, preserving provenance matters more than amplifying quickly.',
        capability: 'Hold complexity without losing provenance',
        publicValue: 'Separate what was lived, what was said and what can be verified.',
        boundary: 'A host title referring to Nova is not presented as independent biographical proof.',
    },
    ru: {
        age: '33 → 34 ГОДА',
        place: 'ИЗРАИЛЬ · ПУБЛИЧНАЯ СЕТЬ · ДЛИННЫЕ РАЗГОВОРЫ',
        people: 'АУДИТОРИИ, ВЕДУЩИЕ И ПУБЛИЧНЫЕ СООБЩЕСТВА',
        moment: '7 октября разорвало привычный ход событий и потребовало иначе говорить о сломе, идентичности и ответственности. Сохранились посты и длинный разговор; они показаны по тому, что действительно говорит источник, а не по тому, что удобнее для биографии.',
        response: 'Реакции и распространение остаются привязанными к площадкам, где они происходили. Здесь нет одной цифры, которая притворяется, будто просмотр, комментарий и разговор — одинаковые сигналы.',
        consequence: 'Публичный голос вышел за пределы короткого контента к более длинным вопросам об ответственности, памяти и действиях после национального потрясения.',
        reflection: 'Сегодня я стараюсь жёстче разделять свидетельство, интерпретацию и факт. В моменты слома сохранение происхождения важнее быстрой амплификации.',
        capability: 'Удерживать сложность, не теряя происхождение',
        publicValue: 'Разделять пережитое, сказанное и проверяемое.',
        boundary: 'Заголовок ведущего с упоминанием Nova не подаётся как самостоятельное биографическое доказательство.',
    },
};

const ownerReportedBoundary: Record<Locale, string> = {
    he: 'הרפלקציה על הפער בין השאיפה לתפקיד לבין התוצאה היא עדות אישית של איגור. הפצה ומעורבות אינן מוצגות כהוכחה לתמיכה, להצבעה או לזכאות לתפקיד.',
    en: 'The reflection on the gap between role aspiration and outcome is Igor’s own account. Distribution and engagement are not presented as proof of endorsement, voting intent or entitlement to a role.',
    ru: 'Рефлексия о разрыве между стремлением к роли и результатом — личное свидетельство Игоря. Распространение и вовлечённость не выдаются за доказательство поддержки, намерения голосовать или права на должность.',
};

function contextFromAlbum(chapter: AlbumChapter, locale: Locale): HumanContext {
    return {
        age: chapter.age[locale],
        place: chapter.place[locale],
        people: chapter.people[locale],
        moment: chapter.moment[locale],
        response: chapter.response[locale],
        consequence: chapter.consequence[locale],
        reflection: chapter.reflection[locale],
        capability: chapter.capability[locale],
        publicValue: chapter.publicValue[locale],
    };
}

function getHumanContext(id: JourneyChapterId, locale: Locale): HumanContext {
    if (id === 'oct7') return oct7Context[locale];

    const albumId = albumContextMap[id] || 'now';
    const albumChapter = albumChapterById.get(albumId) || albumChapters[albumChapters.length - 1];
    const context = contextFromAlbum(albumChapter, locale);
    return id === 'leadership' ? {...context, boundary: ownerReportedBoundary[locale]} : context;
}

const relatedMediaByStage = [
    ['childhood-gilat-starton-2023', 'ndi-repatriation-2024', 'early-2011'],
    ['mfa-miami-consular-2012', 'ndi-repatriation-2024', 'starton-14'],
    ['police-uniform-fatherhood-2024', 'police-public-values-2022', 'police-reel'],
    ['starton-14', 'starton-day', 'starton-team-founders-2022'],
    ['father-comments', 'early-fatherhood-reflection', 'russian-father-short'],
    ['dna-710', 'linkedin-dna-oct7-2023', 'starton-south-vr-plan-2023'],
    ['excel-video', 'supaporp-video', 'flower-video'],
    ['holon-politics-why-2023', 'holon-candidacy-2023', 'political-video'],
    ['nawan-external-2026', 'linkedin-media', 'youtube-channel'],
] as const;

function resolveImage(value: string) {
    return value.startsWith('./resources/') ? rootHref(value.slice(2)) : value;
}

function readExplored(): Set<JourneyChapterId> {
    try {
        const raw = window.localStorage.getItem(JOURNEY_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(parsed)) return new Set();
        return new Set(parsed.filter((value): value is JourneyChapterId => JOURNEY_CHAPTER_IDS.includes(value as JourneyChapterId)));
    } catch {
        return new Set();
    }
}

function persistExplored(explored: Set<JourneyChapterId>) {
    try {
        window.localStorage.setItem(JOURNEY_STORAGE_KEY, JSON.stringify([...explored]));
    } catch {
        // Local personalization is optional; the journey remains fully usable without storage.
    }
}

export default function LifeThroughline() {
    const { locale, dir } = useLocale();
    const c = copy[locale];
    const human = humanLabels[locale];
    const [explored, setExplored] = useState<Set<JourneyChapterId>>(readExplored);
    const [activeId, setActiveId] = useState<JourneyChapterId>(() => JOURNEY_CHAPTER_IDS.find(id => !readExplored().has(id)) ?? 'now');

    const markExplored = useCallback((id: JourneyChapterId) => {
        setExplored(current => {
            if (current.has(id)) return current;
            const next = new Set<JourneyChapterId>(current);
            next.add(id);
            persistExplored(next);
            window.setTimeout(() => window.dispatchEvent(new Event('7ya:journey-progress')), 0);
            return next;
        });
    }, []);

    useEffect(() => {
        if (!('IntersectionObserver' in window)) return;
        const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-journey-id]'));
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.45) continue;
                const id = (entry.target as HTMLElement).dataset.journeyId as JourneyChapterId | undefined;
                if (!id || !JOURNEY_CHAPTER_IDS.includes(id)) continue;
                setActiveId(id);
                markExplored(id);
            }
        }, { threshold: [0.45, 0.65] });
        nodes.forEach(node => observer.observe(node));
        return () => observer.disconnect();
    }, [markExplored]);

    const nextId = useMemo(
        () => JOURNEY_CHAPTER_IDS.find(id => !explored.has(id)),
        [explored],
    );
    const progress = Math.round((explored.size / JOURNEY_CHAPTER_IDS.length) * 100);

    const goToChapter = (id: JourneyChapterId) => {
        setActiveId(id);
        markExplored(id);
        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
        document.getElementById(`journey-${id}`)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };

    return (
        <section id='life-throughline' className='life-throughline' dir={dir} aria-labelledby='life-throughline-title'>
            <div className='public-shell life-throughline-shell'>
                <header className='life-throughline-intro'>
                    <small dir='ltr'>{c.kicker}</small>
                    <h2 id='life-throughline-title'>{c.title}</h2>
                    <p>{c.intro}</p>
                    <div className='life-human-rule'>
                        <strong dir='ltr'>{human.album}</strong>
                        <span dir='ltr'>{human.rule}</span>
                    </div>
                    <nav aria-label={c.title}>
                        <a href={rootHref('igor-vepretski/')}>{c.fullStory} ↗</a>
                        <a href={pageHref('evidence', locale)}>{c.evidence} ↗</a>
                    </nav>

                    <div className='journey-progress-panel' aria-label={c.progress}>
                        <div className='journey-progress-head'>
                            <span>{c.progress}</span>
                            <b aria-live='polite'>{explored.size}/{JOURNEY_CHAPTER_IDS.length} · {progress}%</b>
                        </div>
                        <div className='journey-progress-track' aria-hidden='true'>
                            <i style={{ width: `${progress}%` }} />
                        </div>
                        <div className='journey-chapter-rail' role='navigation' aria-label={c.progress}>
                            {c.chapters.map((chapter, index) => (
                                <button
                                    type='button'
                                    key={chapter.id}
                                    className={activeId === chapter.id ? 'is-active' : ''}
                                    data-explored={explored.has(chapter.id) ? '1' : '0'}
                                    aria-current={activeId === chapter.id ? 'step' : undefined}
                                    onClick={() => goToChapter(chapter.id)}
                                >
                                    <span>{String(index + 1).padStart(2, '0')}</span>
                                    <small dir='ltr'>{chapter.period}</small>
                                    <b>{chapter.title}</b>
                                </button>
                            ))}
                        </div>
                    </div>
                </header>

                <div className='life-throughline-chapters'>
                    {c.chapters.map((chapter, index) => {
                        const item = chapter.sourceId ? deepMedia.find(entry => entry.id === chapter.sourceId) : undefined;
                        const image = item
                            ? resolveImage(item.image || '')
                            : chapter.localImage
                                ? rootHref(chapter.localImage)
                                : '';
                        const href = item?.url || pageHref('library', locale);
                        const external = Boolean(item?.url?.startsWith('http'));
                        const sourceName = item?.source || chapter.sourceName || '7YA';
                        const sourceStatus = item?.status || 'PUBLIC 7YA RECORD';
                        const sourcePoster = !image;
                        const posterKind = item?.url?.includes('youtube.com') ? c.video : c.record;
                        const related = relatedMediaByStage[index]
                            .map(id => deepMedia.find(entry => entry.id === id))
                            .filter(entry => Boolean(entry) && entry?.id !== chapter.sourceId)
                            .slice(0, 3);
                        const context = getHumanContext(chapter.id, locale);

                        return (
                            <article
                                id={`journey-${chapter.id}`}
                                className='life-throughline-chapter'
                                key={chapter.id}
                                data-life-stage={index + 1}
                                data-journey-id={chapter.id}
                                data-active={activeId === chapter.id ? '1' : '0'}
                                data-explored={explored.has(chapter.id) ? '1' : '0'}
                            >
                                {item?.youtubeId ? (
                                    <div className='life-throughline-media life-throughline-video' data-stage-tone={String((index % 4) + 1)}>
                                        <LazyYouTube
                                            videoId={item.youtubeId}
                                            title={item.title}
                                            thumbnail={image || item.fallback}
                                            eager={index < 1}
                                        />
                                        <span className='life-throughline-index'>{String(index + 1).padStart(2, '0')} / {String(JOURNEY_CHAPTER_IDS.length).padStart(2, '0')}</span>
                                    </div>
                                ) : (
                                    <a
                                        className='life-throughline-media'
                                        href={href}
                                        target={external ? '_blank' : undefined}
                                        rel={external ? 'noreferrer' : undefined}
                                        data-source-poster={sourcePoster ? '1' : undefined}
                                        data-stage-tone={String((index % 4) + 1)}
                                    >
                                        {!sourcePoster ? (
                                            <img
                                                src={image}
                                                alt={chapter.title}
                                                loading={index < 1 ? 'eager' : 'lazy'}
                                                decoding='async'
                                                referrerPolicy={external ? 'no-referrer' : undefined}
                                                onError={event => {
                                                    event.currentTarget.closest('.life-throughline-media')?.setAttribute('data-source-poster', '1');
                                                    event.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        ) : null}
                                        <span className='life-throughline-poster' aria-hidden='true'>
                                            <small>{posterKind}</small>
                                            <b>{String(index + 1).padStart(2, '0')}</b>
                                            <em>{sourceName}</em>
                                        </span>
                                        <span className='life-throughline-index'>{String(index + 1).padStart(2, '0')} / {String(JOURNEY_CHAPTER_IDS.length).padStart(2, '0')}</span>
                                    </a>
                                )}
                                <div className='life-throughline-copy'>
                                    <time dir='ltr'>{chapter.period}</time>
                                    <h3>{chapter.title}</h3>
                                    <p>{chapter.body}</p>
                                    <div className='life-human-context' aria-label={`${chapter.title} · ${human.rule}`}>
                                        <div className='life-human-facts'>
                                            <div><small>{human.age}</small><b>{context.age}</b></div>
                                            <div><small>{human.place}</small><b>{context.place}</b></div>
                                            <div><small>{human.people}</small><b>{context.people}</b></div>
                                        </div>
                                        <div className='life-human-flow'>
                                            <div className='life-human-block life-human-moment'>
                                                <small>{human.moment}</small>
                                                <p>{context.moment}</p>
                                            </div>
                                            <div className='life-human-block'>
                                                <small>{human.response}</small>
                                                <p>{context.response}</p>
                                            </div>
                                            <div className='life-human-block life-human-consequence'>
                                                <small>{human.consequence}<span dir='ltr'> · LIFE CONSEQUENCE</span></small>
                                                <p>{context.consequence}</p>
                                            </div>
                                            <div className='life-human-block life-human-reflection'>
                                                <small>{human.reflection}</small>
                                                <p>{context.reflection}</p>
                                            </div>
                                        </div>
                                        <div className='life-human-takeaway'>
                                            <div><small>{human.capability}</small><strong>{context.capability}</strong></div>
                                            <div><small>{human.publicValue}</small><strong>{context.publicValue}</strong></div>
                                        </div>
                                        {context.boundary ? <p className='life-human-boundary'><b>{human.boundary}</b> · {context.boundary}</p> : null}
                                    </div>
                                    <a className='life-throughline-source' href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
                                        <span>
                                            <b>{item?.source || chapter.sourceName}</b>
                                            <small>{sourceStatus}</small>
                                        </span>
                                        <strong>{c.source} ↗</strong>
                                    </a>
                                    {related.length ? (
                                        <div className='life-throughline-related' aria-label={`${chapter.title} · media`}>
                                            {related.map(relatedItem => relatedItem ? (
                                                <a href={relatedItem.url} target='_blank' rel='noreferrer' key={relatedItem.id}>
                                                    <figure>
                                                        <img src={resolveImage(relatedItem.image || relatedItem.fallback)} alt={relatedItem.title} loading='lazy' decoding='async' referrerPolicy='no-referrer' />
                                                        {relatedItem.youtubeId ? <span>▶ VIDEO</span> : null}
                                                    </figure>
                                                    <small>{relatedItem.source} · {relatedItem.year}</small>
                                                    <b>{relatedItem.title}</b>
                                                </a>
                                            ) : null)}
                                        </div>
                                    ) : null}
                                </div>
                            </article>
                        );
                    })}

                    <div className='journey-next'>
                        {nextId ? (
                            <button type='button' onClick={() => goToChapter(nextId)}>
                                <span>{c.next}</span>
                                <b>{c.chapters.find(chapter => chapter.id === nextId)?.title}</b>
                                <i aria-hidden='true'>↓</i>
                            </button>
                        ) : (
                            <a href='#now'>{c.complete} ↗</a>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
