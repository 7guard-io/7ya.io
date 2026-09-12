import type {Locale} from '../locale';

export type L10n = Record<Locale, string>;
export type AlbumDepth = 'media' | 'music' | 'research' | 'starton' | 'evidence' | 'archive' | 'create' | 'leadership';

export type AlbumMedia = {
    id: string;
    src: string;
    kind: 'photo' | 'video-poster' | 'press' | 'document';
    alt: L10n;
    caption: L10n;
    sourceUrl: string;
    sourceLabel: string;
    authenticity: 'original' | 'public-source' | 'source-thumbnail';
    objectPosition?: string;
};

export type AlbumChapter = {
    id: 'origin' | 'service' | 'fatherhood' | 'starton' | 'voice' | 'create' | 'leadership' | 'now';
    index: string;
    era: string;
    kicker: L10n;
    title: L10n;
    age: L10n;
    place: L10n;
    people: L10n;
    moment: L10n;
    story: L10n;
    response: L10n;
    consequence: L10n;
    reflection: L10n;
    capability: L10n;
    publicValue: L10n;
    media?: AlbumMedia;
    sourceUrl: string;
    sourceLabel: L10n;
    depth: AlbumDepth;
    depthLabel: L10n;
};

const l = (he: string, en: string, ru: string): L10n => ({he, en, ru});
const thumb = (id: string) => 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
const WIKIMEDIA = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png/960px-Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png';
const MYNET = 'https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D740%2Cq%3D75/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg';
const HIDABROOT = 'https://storage.hidabroot.org/articles_new/327351_tumb_730X500.jpg';

export const coverMedia: AlbumMedia = {
    id: 'cover-wikimedia',
    src: WIKIMEDIA,
    kind: 'photo',
    alt: l('איגור ופרצקי — דיוקן ציבורי', 'Igor Vepretski — public portrait', 'Игорь Вепрецкий — публичный портрет'),
    caption: l('דיוקן ציבורי · Wikimedia Commons', 'Public portrait · Wikimedia Commons', 'Публичный портрет · Wikimedia Commons'),
    sourceUrl: 'https://commons.wikimedia.org/wiki/File:Igor_vepretski-_Israeli_entrepreneur_and_founder_of_Starton_nonprofit_organisation.png',
    sourceLabel: 'WIKIMEDIA COMMONS · PUBLIC PORTRAIT',
    authenticity: 'public-source',
    objectPosition: '50% 24%',
};

export const albumChapters: AlbumChapter[] = [
    {
        id: 'origin',
        index: '01',
        era: '1990—2011',
        kicker: l('מקור / ילדות / שייכות', 'ORIGIN / CHILDHOOD / BELONGING', 'ИСТОК / ДЕТСТВО / ПРИНАДЛЕЖНОСТЬ'),
        title: l('לפני שהיה סיפור ציבורי, הייתי ילד שמנסה להבין איפה הוא שייך.', 'Before there was a public story, there was a child trying to understand where he belonged.', 'До публичной истории был ребёнок, пытавшийся понять, где его место.'),
        age: l('ילדות → בן 20 בעוגן הציבורי הראשון', 'CHILDHOOD → AGE 20 AT THE FIRST PUBLIC ANCHOR', 'ДЕТСТВО → 20 ЛЕТ В ПЕРВОЙ ПУБЛИЧНОЙ ТОЧКЕ'),
        place: l('חרקוב → בת־ים → חולון / ג׳סי כהן', 'KHARKIV → BAT YAM → HOLON / JESSE COHEN', 'ХАРЬКОВ → БАТ-ЯМ → ХОЛОН / ДЖЕССИ КОЭН'),
        people: l('משפחה, סבתא, בית־ספר והשכונה', 'FAMILY, GRANDMOTHER, SCHOOL AND NEIGHBORHOOD', 'СЕМЬЯ, БАБУШКА, ШКОЛА И РАЙОН'),
        moment: l('עלייה לישראל כילד וההתבגרות בשכונות שלא תמיד ידעו מה לעשות עם ילד שמתקשה להשתלב. מה שנשאר ברשת מתחיל מאוחר יותר — ולכן האלבום לא ממציא צילום ילדות שאין לנו.', 'Immigrating to Israel as a child and growing up in neighborhoods that did not always know what to do with a kid struggling to fit in. The surviving public web record starts later, so the album does not invent childhood imagery we do not have.', 'Репатриация в Израиль ребёнком и взросление в районах, где не всегда знали, что делать с трудным ребёнком. Публичный интернет-след начинается позже, поэтому альбом не придумывает детские фотографии.'),
        story: l('חרקוב, העלייה, בת־ים, חולון וג׳סי כהן הם לא רק רקע. הם המקום שממנו צמחו שאלות על שייכות, הזדמנות ומי רואים בזמן. נקודת העוגן הציבורית המוקדמת שנשמרה היא כתבה מ־2011.', 'Kharkiv, immigration, Bat Yam, Holon and Jesse Cohen are not background copy. They are where questions about belonging, opportunity and who gets seen in time began. The earliest surviving public anchor here is a 2011 press record.', 'Харьков, репатриация, Бат-Ям, Холон и Джесси Коэн — не фон. Здесь появились вопросы о принадлежности, возможностях и о том, кого замечают вовремя. Самая ранняя сохранённая публичная опора здесь — публикация 2011 года.'),
        response: l('אין כרגע קורפוס תגובות ישיר מהילדות עצמה. זה פער אמיתי בארכיון, לא משהו שהאתר יסתיר במספרים.', 'There is no direct audience-response corpus from childhood itself yet. That is a real archival gap, not something the site will hide behind counters.', 'Прямого корпуса реакций из самого детства пока нет. Это реальный пробел архива, а не то, что сайт будет прятать за цифрами.'),
        consequence: l('השאלות של שייכות והזדמנות חזרו מאוחר יותר בשירות, באבהות וב־StartOn.', 'The questions of belonging and opportunity later returned through service, fatherhood and StartOn.', 'Вопросы принадлежности и возможностей позже вернулись через службу, отцовство и StartOn.'),
        reflection: l('היום אני מבין שלא צריך להפוך ילדות קשה למיתולוגיה. צריך לראות מה היא לימדה אותי לזהות אצל ילד אחר לפני שהמערכת מגדירה אותו דרך משבר.', 'Today I understand that a difficult childhood does not need mythology. What matters is what it taught me to notice in another child before a system defines them through crisis.', 'Сегодня я понимаю: трудное детство не нужно превращать в миф. Важно то, чему оно научило меня замечать в другом ребёнке до того, как система определит его через кризис.'),
        capability: l('לראות אדם בתוך הקשר', 'Read a person inside context', 'Видеть человека в контексте'),
        publicValue: l('להתחיל מהאדם, לא מהתווית.', 'Start with the person, not the label.', 'Начинать с человека, а не с ярлыка.'),
        sourceUrl: 'https://www.makorrishon.co.il/nrg/online/54/ART2/235/169.html',
        sourceLabel: l('מקור ראשון / NRG · 2011', 'Makor Rishon / NRG · 2011', 'Makor Rishon / NRG · 2011'),
        depth: 'archive',
        depthLabel: l('לציר החיים המלא', 'Open the full life record', 'Открыть полный жизненный архив'),
    },
    {
        id: 'service',
        index: '02',
        era: '2008—2021',
        kicker: l('שירות / מערכות / אחריות', 'SERVICE / SYSTEMS / RESPONSIBILITY', 'СЛУЖБА / СИСТЕМЫ / ОТВЕТСТВЕННОСТЬ'),
        title: l('חשבתי שאבנה את עצמי בתוך המערכת.', 'I thought I would build myself inside the system.', 'Я думал, что построю себя внутри системы.'),
        age: l('בערך 17 → 31', 'ABOUT AGE 17 → 31', 'ПРИМЕРНО 17 → 31'),
        place: l('ישראל → שירות בחו״ל → תל־אביב', 'ISRAEL → OVERSEAS SERVICE → TEL AVIV', 'ИЗРАИЛЬ → СЛУЖБА ЗА РУБЕЖОМ → ТЕЛЬ-АВИВ'),
        people: l('חיילים, אנשי ביטחון, שוטרים ואזרחים', 'SOLDIERS, SECURITY STAFF, POLICE AND CIVILIANS', 'СОЛДАТЫ, СОТРУДНИКИ БЕЗОПАСНОСТИ, ПОЛИЦЕЙСКИЕ И ГРАЖДАНЕ'),
        moment: l('שנים של צבא, ביטחון ועבודה משטרתית הכניסו אותי עמוק לתוך מוסדות, אחריות ומצבי קצה. החומר הציבורי ששורד מהתקופה אינו אלבום מלא של השירות — חלקו מגיע דרך רפלקציה וראיונות מאוחרים יותר.', 'Years in military, security and police work put me deep inside institutions, responsibility and high-pressure situations. The surviving public record is not a complete service album; some of it reaches us through later reflection and interviews.', 'Годы армии, безопасности и полиции погрузили меня в институты, ответственность и экстремальные ситуации. Сохранившийся публичный след — не полный альбом службы; часть его приходит через более поздние интервью и рефлексию.'),
        story: l('השירות נתן מסגרת, משמעת ואחריות — וגם מפגש יומיומי עם המקום שבו מערכת פוגשת אדם. הפריים כאן הוא ראיון ציבורי מאוחר יותר על המעבר מהשירות למשימה חברתית, לא צילום שמתחזה להיות מאותה תקופה.', 'Service built discipline and responsibility — and daily exposure to the point where institutions meet people. The frame here is a later public interview about moving from service into a social mission, not a photograph pretending to come from the service period.', 'Служба дала дисциплину и ответственность — и ежедневный опыт того, где система встречает человека. Кадр здесь — более позднее интервью о переходе к общественной миссии, а не фотография, притворяющаяся архивной.'),
        response: l('התגובה הציבורית לתקופת השירות נשמרה בעיקר בפוסטים ובראיונות מאוחרים יותר. אין כרגע ארכיון תגובות מלא לשנות השירות עצמן.', 'Public response to the service period survives mainly through later posts and interviews. There is not yet a complete comment archive from the service years themselves.', 'Публичная реакция на годы службы сохранилась главным образом в более поздних постах и интервью. Полного архива комментариев самой службы пока нет.'),
        consequence: l('היציאה מהמסלול הבטוח הפכה את הניסיון המקצועי לשאלה חדשה: מה עושים איתו מחוץ למערכת.', 'Leaving the safe institutional path turned professional experience into a new question: what do you do with it outside the system?', 'Выход из безопасной институциональной траектории превратил профессиональный опыт в новый вопрос: что делать с ним вне системы?'),
        reflection: l('פעם חיפשתי תפקיד שנותן אחריות. היום אני מחפש דרך לקחת אחריות גם בלי לחכות שתפקיד ייתן לי רשות.', 'I once looked for a role that carried responsibility. Today I look for ways to take responsibility without waiting for a role to grant permission.', 'Раньше я искал должность, которая даёт ответственность. Сегодня я ищу способ брать ответственность, не ожидая разрешения от должности.'),
        capability: l('אחריות תחת לחץ', 'Responsibility under pressure', 'Ответственность под давлением'),
        publicValue: l('להבין איפה מערכת פוגשת אדם — ואיפה היא מפספסת אותו.', 'Understand where institutions meet people — and where they miss them.', 'Понимать, где система встречает человека — и где упускает его.'),
        media: {
            id: 'service-channel14',
            src: thumb('O3v309CA4ao'),
            kind: 'video-poster',
            alt: l('איגור ופרצקי בראיון ערוץ 14', 'Igor Vepretski in a Channel 14 interview', 'Игорь Вепрецкий в интервью Channel 14'),
            caption: l('פריים מקור · ערוץ 14 · 2022', 'Source frame · Channel 14 · 2022', 'Кадр источника · Channel 14 · 2022'),
            sourceUrl: 'https://youtu.be/O3v309CA4ao',
            sourceLabel: 'CHANNEL 14 · PUBLIC INTERVIEW · 2022',
            authenticity: 'source-thumbnail',
        },
        sourceUrl: 'https://youtu.be/O3v309CA4ao',
        sourceLabel: l('ראיון ציבורי · ערוץ 14', 'Public interview · Channel 14', 'Публичное интервью · Channel 14'),
        depth: 'media',
        depthLabel: l('לראיונות ולמדיה', 'Open interviews & media', 'Открыть интервью и медиа'),
    },
    {
        id: 'fatherhood',
        index: '03',
        era: '2018—2023',
        kicker: l('אבהות / נוכחות / תיקון', 'FATHERHOOD / PRESENCE / REPAIR', 'ОТЦОВСТВО / ПРИСУТСТВИЕ / ИЗМЕНЕНИЕ'),
        title: l('אבהות הפכה את הסיפור האישי למבחן יומיומי.', 'Fatherhood turned the personal story into a daily test.', 'Отцовство превратило личную историю в ежедневный экзамен.'),
        age: l('בן 27 → 32 · עוגן ציבורי ב־2023', 'AGE 27 → 32 · PUBLIC ANCHOR IN 2023', '27 → 32 ГОДА · ПУБЛИЧНАЯ ТОЧКА В 2023'),
        place: l('הבית → Facebook / LinkedIn → מדיה', 'HOME → FACEBOOK / LINKEDIN → MEDIA', 'ДОМ → FACEBOOK / LINKEDIN → МЕДИА'),
        people: l('הילדים והמשפחה · קהל שפגש את הסיפור', 'CHILDREN AND FAMILY · THE AUDIENCE THAT MET THE STORY', 'ДЕТИ И СЕМЬЯ · АУДИТОРИЯ, ВСТРЕТИВШАЯ ИСТОРИЮ'),
        moment: l('טקסט על אבהות ונוכחות הורית יצא מהפיד והתחיל לחיות אצל אנשים אחרים. כאן לא צריך לחשוף את הילדים כדי להבין את הסיפור — המרכז הוא הבחירה להיות נוכח.', 'A piece about fatherhood and parental presence moved beyond the feed and began living with other people. The children do not need to be exposed for the story to work; the center is the choice to be present.', 'Текст об отцовстве и присутствии родителя вышел за пределы ленты и начал жить у других людей. Для этой истории не нужно раскрывать детей; в центре — выбор быть рядом.'),
        story: l('הסיפור “אבא מושלם” הפך לרגע שבו חוויה משפחתית קיבלה שפה ציבורית. האתר מציג את המקור וההד, אבל מצמצם פרטים מזהים של הילדים.', 'The “perfect father” story became a point where family experience gained a public language. The site shows the source and its echoes while minimizing identifying details about the children.', 'История об «идеальном отце» стала моментом, когда семейный опыт получил публичный язык. Сайт показывает источник и эхо, но минимизирует идентифицирующие данные детей.'),
        response: l('הסיפור קיבל תגובות רבות והפצה בין Facebook, LinkedIn ומדיה. המספרים נשארים קשורים לכל מקור בנפרד; צילומי תגובות וקולות מהקהל מופיעים בשכבת ה־Broadcast.', 'The story received substantial response and distribution across Facebook, LinkedIn and media. Counts remain bound to each source separately; reaction images and audience voices appear in the Broadcast layer.', 'История получила заметный отклик и распространение между Facebook, LinkedIn и медиа. Цифры остаются привязаны к каждому источнику отдельно; скриншоты реакций и голоса аудитории показаны в Broadcast.'),
        consequence: l('החוויה הפרטית הפכה לשיחה על נוכחות, אחריות ומה ילדים זוכרים מהורה.', 'A private experience became a conversation about presence, responsibility and what children remember from a parent.', 'Личный опыт стал разговором о присутствии, ответственности и о том, что дети запоминают от родителя.'),
        reflection: l('הורות בשבילי איננה הוכחה שהצלחתי לתקן את העבר. היא הבחירה לחזור שוב ושוב להיות שם, גם כשאין קהל.', 'For me, fatherhood is not proof that I repaired the past. It is the repeated choice to be there even when there is no audience.', 'Для меня отцовство — не доказательство того, что прошлое исправлено. Это повторяющийся выбор быть рядом, даже когда нет аудитории.'),
        capability: l('להפוך פגיעוּת לאחריות', 'Turn vulnerability into responsibility', 'Превращать уязвимость в ответственность'),
        publicValue: l('לדבר על משפחה בלי להפוך אותה למוצר.', 'Talk about family without turning it into a product.', 'Говорить о семье, не превращая её в продукт.'),
        media: {
            id: 'fatherhood-hidabroot',
            src: HIDABROOT,
            kind: 'press',
            alt: l('כתבת הידברות על הסיפור אבא מושלם', 'Hidabroot article on A Perfect Father', 'Статья Hidabroot об истории «Идеальный отец»'),
            caption: l('מקור מערכת · הידברות · 2023', 'Publisher source · Hidabroot · 2023', 'Источник издателя · Hidabroot · 2023'),
            sourceUrl: 'https://www.hidabroot.org/article/1179015',
            sourceLabel: 'HIDABROOT · PUBLIC ARTICLE · 2023',
            authenticity: 'public-source',
            objectPosition: '50% 20%',
        },
        sourceUrl: 'https://www.hidabroot.org/article/1179015',
        sourceLabel: l('הידברות · מקור ציבורי', 'Hidabroot · public source', 'Hidabroot · публичный источник'),
        depth: 'media',
        depthLabel: l('לתגובות ולהד הציבורי', 'Open audience response & media echo', 'Открыть реакции и медийное эхо'),
    },
    {
        id: 'starton',
        index: '04',
        era: '2022—NOW',
        kicker: l('חזרה / StartOn / בנייה', 'RETURN / STARTON / BUILD', 'ВОЗВРАЩЕНИЕ / STARTON / СОЗДАНИЕ'),
        title: l('חזרתי דווקא למקום שממנו רציתי פעם לצאת.', 'I returned to the place I once wanted to leave.', 'Я вернулся именно туда, откуда когда-то хотел уйти.'),
        age: l('בן 31 · עוגן 2022', 'AGE 31 · 2022 ANCHOR', '31 ГОД · ОПОРНАЯ ТОЧКА 2022'),
        place: l('ג׳סי כהן · חולון', 'JESSE COHEN · HOLON', 'ДЖЕССИ КОЭН · ХОЛОН'),
        people: l('צעירים, אנשי חינוך, שותפים מקומיים ומנטורים', 'YOUNG PEOPLE, EDUCATORS, LOCAL PARTNERS AND MENTORS', 'МОЛОДЁЖЬ, ПЕДАГОГИ, МЕСТНЫЕ ПАРТНЁРЫ И НАСТАВНИКИ'),
        moment: l('ב־2022 ההחלטה לעזוב מסלול בטוח קיבלה צורה פיזית: ניסיון לבנות לצעירים מקום שבו טכנולוגיה, יצירה, מבוגרים תומכים ושייכות נפגשים לפני שהמשבר הופך לזהות.', 'In 2022, leaving a safe path took physical form: an attempt to build a place where technology, creation, supportive adults and belonging meet young people before crisis becomes identity.', 'В 2022 году уход с безопасной траектории получил физическую форму: попытку создать место, где технологии, творчество, поддерживающие взрослые и принадлежность встречают молодёжь до того, как кризис становится идентичностью.'),
        story: l('החזרה לג׳סי כהן סגרה מעגל בין הילד שהייתי לבין המערכת שרציתי לראות קיימת. כאן כבר יש צילום עיתונות אמיתי, שידורים, פוסטים ותיעוד של ההחלטה.', 'Returning to Jesse Cohen connected the child I had been with the system I wanted to exist. Here the archive already contains real press photography, broadcasts, posts and documentation of the decision.', 'Возвращение в Джесси Коэн связало ребёнка, которым я был, с системой, которую хотел видеть существующей. Здесь уже есть настоящая пресс-фотография, эфиры, посты и документация решения.'),
        response: l('שני פוסטי עוגן על ההחלטה והחזון מתועדים עם 105 ו־153 תגובות ב־LinkedIn, כל מספר נשאר קשור לפוסט שלו.', 'Two anchor posts about the decision and vision are documented with 105 and 153 LinkedIn comments respectively; each count remains bound to its own post.', 'Два опорных поста о решении и видении задокументированы с 105 и 153 комментариями в LinkedIn соответственно; каждая цифра остаётся привязанной к своему посту.'),
        consequence: l('הסיפור הפסיק להיות רק רפלקציה והפך לעמותה, מודל מרחב, שותפויות וניסיון מתמשך לבנות.', 'The story stopped being only reflection and became a nonprofit, a space model, partnerships and an ongoing attempt to build.', 'История перестала быть только рефлексией и стала НКО, моделью пространства, партнёрствами и продолжающейся попыткой строить.'),
        reflection: l('החזרה לשכונה לימדה אותי שהישג אישי לא סוגר מעגל. מעגל נסגר רק כשמשהו מהדרך הופך להזדמנות למישהו אחר.', 'Returning to the neighborhood taught me that personal achievement does not close a loop. A loop closes only when something from the path becomes opportunity for someone else.', 'Возвращение в район научило меня: личное достижение не замыкает круг. Круг замыкается, когда часть твоего пути становится возможностью для другого.'),
        capability: l('להפוך ניסיון למודל פעולה', 'Turn experience into an operating model', 'Превращать опыт в рабочую модель'),
        publicValue: l('לבנות הזדמנות מוחשית במקום שבו קל יותר למדוד כשל.', 'Build tangible opportunity where systems too often measure failure.', 'Создавать реальную возможность там, где системы чаще измеряют неудачу.'),
        media: {
            id: 'starton-mynet',
            src: MYNET,
            kind: 'press',
            alt: l('איגור ופרצקי בכתבת mynet על החזרה לג׳סי כהן', 'Igor Vepretski in the mynet story about returning to Jesse Cohen', 'Игорь Вепрецкий в материале mynet о возвращении в Джесси Коэн'),
            caption: l('צילום עיתונות ציבורי · mynet · 13.05.2022', 'Public press photograph · mynet · 13.05.2022', 'Публичная пресс-фотография · mynet · 13.05.2022'),
            sourceUrl: 'https://holon.mynet.co.il/local_news/article/hjxqegkiq',
            sourceLabel: 'MYNET · PUBLIC PRESS PHOTO · 13.05.2022',
            authenticity: 'public-source',
            objectPosition: '50% 28%',
        },
        sourceUrl: 'https://holon.mynet.co.il/local_news/article/hjxqegkiq',
        sourceLabel: l('mynet · חוזר לשכונה', 'mynet · Returning to the neighborhood', 'mynet · Возвращение в район'),
        depth: 'starton',
        depthLabel: l('להיכנס ל־StartOn', 'Enter StartOn', 'Открыть StartOn'),
    },
    {
        id: 'voice',
        index: '05',
        era: '2022—2024',
        kicker: l('קול / הפצה / שיחה', 'VOICE / DISTRIBUTION / CONVERSATION', 'ГОЛОС / РАСПРОСТРАНЕНИЕ / РАЗГОВОР'),
        title: l('פתאום הפוסט כבר לא היה שלי בלבד.', 'Suddenly the post was no longer mine alone.', 'В какой-то момент пост перестал быть только моим.'),
        age: l('בן 31 → 34', 'AGE 31 → 34', '31 → 34 ГОДА'),
        place: l('הרשת → עמודי הפצה → אולפנים', 'THE FEED → PUBLISHER PAGES → STUDIOS', 'ЛЕНТА → СТРАНИЦЫ РАСПРОСТРАНЕНИЯ → СТУДИИ'),
        people: l('עוקבים, עורכים, מארחים, מגיבים ומתנגדים', 'FOLLOWERS, EDITORS, HOSTS, SUPPORTERS AND CRITICS', 'ПОДПИСЧИКИ, РЕДАКТОРЫ, ВЕДУЩИЕ, СТОРОННИКИ И КРИТИКИ'),
        moment: l('אבהות, הונאת קשישים, חינוך, זהות ושירות התחילו לעבור מחשבון אישי לעמודים חיצוניים, כתבות וראיונות. מכאן הסיפור כבר כולל גם את מה שאנשים אחרים עשו איתו.', 'Fatherhood, elder fraud, education, identity and service began moving from a personal account into external pages, articles and interviews. From here, the story also includes what other people did with it.', 'Отцовство, мошенничество против пожилых, образование, идентичность и служба начали переходить из личного аккаунта во внешние страницы, статьи и интервью. С этого момента история включает и то, что другие сделали с ней.'),
        story: l('הונאת הקשישים היא דוגמה ברורה: חוויה אישית עברה מהפיד לשיחה חדשותית ולראיונות המשך. השפעה כאן אינה “מספר גדול”; היא מסלול שאפשר לעקוב אחריו.', 'The elder-fraud story is a clear example: a personal experience moved from the feed into a newsroom conversation and follow-up interviews. Impact here is not a big number; it is a traceable path.', 'История мошенничества против пожилых — ясный пример: личный опыт перешёл из ленты в новостной разговор и последующие интервью. Влияние здесь — не большая цифра, а прослеживаемый путь.'),
        response: l('הקהל לא רק אהב. הוא הזדהה, התווכח, הפיץ ולעיתים התנגד. כל תגובה ומדד נשארים קשורים למשטח שבו נמדדו.', 'The audience did not only like. People resonated, argued, redistributed and sometimes opposed. Every response and metric stays bound to the surface where it was observed.', 'Аудитория не только ставила лайки. Люди сопереживали, спорили, распространяли и иногда возражали. Каждая реакция и метрика остаётся привязанной к площадке, где она наблюдалась.'),
        consequence: l('חלק מהפוסטים קיבלו חיים עצמאיים והפכו לחומר תקשורתי, מקצועי וציבורי.', 'Some posts acquired an independent life and became media, professional and public material.', 'Некоторые посты получили самостоятельную жизнь и стали медийным, профессиональным и общественным материалом.'),
        reflection: l('אני פחות מתעניין היום בשאלה “כמה ראו” ויותר בשאלה “מה עבר מאדם לאדם, ומה השתנה בדרך”.', 'Today I am less interested in “how many saw it” and more in “what moved from person to person, and what changed along the way.”', 'Сегодня меня меньше интересует вопрос «сколько увидели», и больше — «что перешло от человека к человеку и что изменилось по пути».'),
        capability: l('לנסח חוויה שאנשים ממשיכים איתה', 'Frame experience people carry forward', 'Формулировать опыт, который люди несут дальше'),
        publicValue: l('להפוך תשומת לב לשיחה בלי לאבד את המקור.', 'Turn attention into conversation without losing provenance.', 'Превращать внимание в разговор, не теряя происхождение.'),
        media: {
            id: 'voice-fraud-13',
            src: thumb('AE5hDzLM5XU'),
            kind: 'video-poster',
            alt: l('ראיון על הונאת קשישים', 'Interview about elder fraud', 'Интервью о мошенничестве против пожилых'),
            caption: l('חדשות 13 · שיחה ציבורית', 'News 13 · public conversation', 'News 13 · публичный разговор'),
            sourceUrl: 'https://www.youtube.com/watch?v=AE5hDzLM5XU',
            sourceLabel: 'NEWS 13 · PUBLIC INTERVIEW',
            authenticity: 'source-thumbnail',
        },
        sourceUrl: 'https://www.youtube.com/watch?v=AE5hDzLM5XU',
        sourceLabel: l('חדשות 13 · מקור וידאו', 'News 13 · video source', 'News 13 · видеоисточник'),
        depth: 'media',
        depthLabel: l('למפת ההד והמדיה', 'Open the media echo', 'Открыть медийное эхо'),
    },
    {
        id: 'create',
        index: '06',
        era: '2020—2025',
        kicker: l('יצירה / מוזיקה / תרבות', 'CREATE / MUSIC / CULTURE', 'ТВОРЧЕСТВО / МУЗЫКА / КУЛЬТУРА'),
        title: l('גם מוזיקה היא ביוגרפיה.', 'Music is biography too.', 'Музыка — тоже биография.'),
        age: l('בן 29 → 35', 'AGE 29 → 35', '29 → 35 ЛЕТ'),
        place: l('אולפן → YouTube → חשבונות של יוצרים אחרים', 'STUDIO → YOUTUBE → OTHER CREATORS’ ACCOUNTS', 'СТУДИЯ → YOUTUBE → АККАУНТЫ ДРУГИХ АВТОРОВ'),
        people: l('אמנים, יוצרים, קהלי מוזיקה וקהילות וידאו', 'ARTISTS, CREATORS, MUSIC AUDIENCES AND VIDEO COMMUNITIES', 'АРТИСТЫ, АВТОРЫ, МУЗЫКАЛЬНАЯ И ВИДЕО-АУДИТОРИЯ'),
        moment: l('הומור, קליפים ושיתופי פעולה לא היו הפסקה מהחיים “הרציניים”. הם היו דרך אחרת להגיד דברים שלא נכנסים למסמך, תפקיד או נאום.', 'Humour, clips and collaborations were not a break from the “serious” life. They were another way to say things that do not fit inside a document, role or speech.', 'Юмор, клипы и коллаборации не были паузой от «серьёзной» жизни. Это был другой способ говорить о том, что не помещается в документ, должность или речь.'),
        story: l('מ־“מת על אקסל” ועד BIZZI, לצד הופעות אצל יוצרים אחרים, היצירה מספרת שכבה של זהות שלא צריך להצדיק דרך קריירה ציבורית.', 'From “Met Al Excel” to BIZZI and appearances with other creators, creation holds a layer of identity that does not need to justify itself through a public-service career.', 'От «Мет аль Эксель» до BIZZI и появлений у других авторов творчество хранит слой идентичности, которому не нужно оправдываться общественной карьерой.'),
        response: l('חלק מהתגובה נמצאת בחשבונות בבעלותי וחלק בחשבונות של יוצרים אחרים. האתר שומר attribution ברור ולא מעביר צפיות חיצוניות לחשבון שלי.', 'Some response lives on owned accounts and some on other creators’ accounts. The site keeps attribution explicit and does not transfer external views into my account totals.', 'Часть реакции находится в моих аккаунтах, часть — у других авторов. Сайт сохраняет явную атрибуцию и не переносит внешние просмотры в мои итоги.'),
        consequence: l('הקהל הכיר שכבה אחרת של אותו אדם — לא רק שירות, StartOn או פוליטיקה.', 'The audience met another layer of the same person — not only service, StartOn or politics.', 'Аудитория увидела другой слой того же человека — не только службу, StartOn или политику.'),
        reflection: l('אם אני מוחק מהביוגרפיה הומור, מוזיקה ושטויות, אני מוחק חלק גדול מהאדם שבנה את כל השאר.', 'If I delete humour, music and play from the biography, I delete a large part of the person who built everything else.', 'Если убрать из биографии юмор, музыку и игру, исчезнет большая часть человека, который построил всё остальное.'),
        capability: l('לנוע בין שפות, צורות וקהל', 'Move across languages, forms and audiences', 'Переключаться между языками, формами и аудиториями'),
        publicValue: l('לחבר אנשים גם דרך תרבות, לא רק דרך מסמך או נאום.', 'Connect people through culture, not only through documents or speeches.', 'Соединять людей через культуру, а не только через документы и речи.'),
        media: {
            id: 'create-bizzi',
            src: thumb('jRjZjpqAgEw'),
            kind: 'video-poster',
            alt: l('NAWAN ft. VEPRETSKI — BIZZI', 'NAWAN ft. VEPRETSKI — BIZZI', 'NAWAN ft. VEPRETSKI — BIZZI'),
            caption: l('קליפ רשמי · 2025', 'Official video · 2025', 'Официальный клип · 2025'),
            sourceUrl: 'https://www.youtube.com/watch?v=jRjZjpqAgEw',
            sourceLabel: 'YOUTUBE · OFFICIAL VIDEO · 2025',
            authenticity: 'source-thumbnail',
        },
        sourceUrl: 'https://www.youtube.com/watch?v=jRjZjpqAgEw',
        sourceLabel: l('BIZZI · הקליפ הרשמי', 'BIZZI · official video', 'BIZZI · официальный клип'),
        depth: 'music',
        depthLabel: l('לכל המוזיקה', 'Open all music', 'Открыть всю музыку'),
    },
    {
        id: 'leadership',
        index: '07',
        era: '2023—2026',
        kicker: l('מנהיגות / פוליטיקה / מבחן', 'LEADERSHIP / POLITICS / TEST', 'ЛИДЕРСТВО / ПОЛИТИКА / ИСПЫТАНИЕ'),
        title: l('ניסיתי להיכנס לחדר שבו מתקבלות החלטות.', 'I tried to enter the room where decisions are made.', 'Я пытался войти в комнату, где принимаются решения.'),
        age: l('בן 33 → 36', 'AGE 33 → 36', '33 → 36 ЛЕТ'),
        place: l('שטח ציבורי → מפלגה → קהלים בעברית וברוסית', 'PUBLIC FIELD → PARTY → HEBREW AND RUSSIAN AUDIENCES', 'ОБЩЕСТВЕННОЕ ПОЛЕ → ПАРТИЯ → АУДИТОРИИ НА ИВРИТЕ И РУССКОМ'),
        people: l('פעילים, קהלים, אנשי ציבור ונבחרי ציבור', 'ACTIVISTS, AUDIENCES, PUBLIC FIGURES AND ELECTED OFFICIALS', 'АКТИВИСТЫ, АУДИТОРИИ, ОБЩЕСТВЕННЫЕ И ИЗБРАННЫЕ ДЕЯТЕЛИ'),
        moment: l('הקול הציבורי נכנס גם לזירה הפוליטית: תוכן, סיורים, קהלים רב־לשוניים והפצות מפלגתיות. האתר מציג את זה כחלק מהדרך שלי — לא כהוכחה להסכמה ציבורית ולא כקיצור דרך למנהיגות.', 'The public voice also entered politics: content, public activity, multilingual audiences and party distribution. The site presents this as part of my path — not as proof of public agreement and not as a shortcut to leadership.', 'Публичный голос вошёл и в политику: контент, общественная активность, многоязычная аудитория и партийное распространение. Сайт показывает это как часть моего пути — не как доказательство общественного согласия и не как короткий путь к лидерству.'),
        story: l('ב־2026 הפער בין שאיפה לתפקיד לבין המציאות נהיה אישי מאוד. זה לא פרק שנועד “להוכיח” שהייתי צריך לקבל מקום; הוא נועד להראות מה קורה לאדם כשהמסלול שקיווה לו לא נהיה התפקיד שלו.', 'In 2026 the gap between aspiring to a role and reality became deeply personal. This chapter is not here to “prove” I deserved a place; it is here to show what happens when a path you hoped for does not become your role.', 'В 2026 году разрыв между стремлением к роли и реальностью стал очень личным. Эта глава не пытается «доказать», что мне должны были дать место; она показывает, что происходит, когда желаемый путь не становится твоей должностью.'),
        response: l('יש הפצה מפלגתית ושיחה ציבורית בעברית וברוסית. מעורבות אינה מוצגת כתמיכה, הצבעה או הסכמה.', 'There is party distribution and public conversation in Hebrew and Russian. Engagement is not presented as endorsement, voting intent or agreement.', 'Есть партийное распространение и публичный разговор на иврите и русском. Вовлечённость не выдаётся за поддержку, намерение голосовать или согласие.'),
        consequence: l('השאלה השתנתה מ“איזה תפקיד אקבל” ל“איזו אחריות אני יכול לקחת גם בלי תפקיד”.', 'The question changed from “what role will I get?” to “what responsibility can I take even without a role?”', 'Вопрос изменился с «какую должность я получу?» на «какую ответственность я могу взять даже без должности?»'),
        reflection: l('כשלא קיבלתי ב־2026 את המקום שקיוויתי לו, הכאב היה אמיתי. אבל אם כל החזון תלוי בכיסא אחד — זה לא חזון מספיק חזק. מכאן המבחן הוא לבנות גם בלי הכיסא.', 'When I did not receive the place I had hoped for in 2026, the disappointment was real. But if the entire vision depends on one seat, it is not strong enough. The test now is to build without the seat as well.', 'Когда в 2026 году я не получил место, на которое надеялся, разочарование было настоящим. Но если всё видение зависит от одного кресла, оно недостаточно сильное. Теперь испытание — строить и без этого кресла.'),
        capability: l('להפריד בין שליחות לתפקיד', 'Separate mission from title', 'Отделять миссию от должности'),
        publicValue: l('למדוד מנהיגות לפי אחריות ותוצאה, לא רק לפי מיקום ברשימה.', 'Measure leadership by responsibility and outcome, not only by list position.', 'Измерять лидерство ответственностью и результатом, а не только местом в списке.'),
        sourceUrl: 'https://www.facebook.com/beytenu/videos/26702411802682636/',
        sourceLabel: l('הפצה ציבורית · ישראל ביתנו · 2026', 'Public party distribution · Yisrael Beiteinu · 2026', 'Публичное партийное распространение · НДИ · 2026'),
        depth: 'leadership',
        depthLabel: l('למעבדת המנהיגות', 'Open the leadership lab', 'Открыть лабораторию лидерства'),
    },
    {
        id: 'now',
        index: '08',
        era: '2026 → NOW',
        kicker: l('עכשיו / זיכרון / בנייה', 'NOW / MEMORY / BUILD', 'СЕЙЧАС / ПАМЯТЬ / СОЗДАНИЕ'),
        title: l('עכשיו אני מנסה לא לאבד שוב את החוט.', 'Now I am trying not to lose the thread again.', 'Сейчас я пытаюсь больше не терять нить.'),
        age: l('בן 36', 'AGE 36', '36 ЛЕТ'),
        place: l('7YA · StartOn · הרשת הציבורית', '7YA · STARTON · THE PUBLIC WEB', '7YA · STARTON · ПУБЛИЧНАЯ СЕТЬ'),
        people: l('המשפחה, הקהילה, שותפים ומי שנכנס לסיפור', 'FAMILY, COMMUNITY, PARTNERS AND PEOPLE ENTERING THE STORY', 'СЕМЬЯ, СООБЩЕСТВО, ПАРТНЁРЫ И ЛЮДИ, ВХОДЯЩИЕ В ИСТОРИЮ'),
        moment: l('7YA נבנה כדי שהחיים לא יתפרקו שוב לעשרות חשבונות, כתבות, פוסטים, תפקידים ומסמכים שאין ביניהם חוט. ההווה צריך להישאר חי — לא להפוך למוזיאון סגור.', '7YA is being built so the life does not fragment again into dozens of accounts, articles, posts, roles and documents with no connecting thread. The present must stay alive, not become a sealed museum.', '7YA строится, чтобы жизнь снова не распалась на десятки аккаунтов, статей, постов, ролей и документов без общей нити. Настоящее должно оставаться живым, а не превращаться в закрытый музей.'),
        story: l('כאן StartOn, יצירה, מחקר, מדיה, עבודה ציבורית והחיים האישיים חוזרים להיות סיפור אחד — עם מקורות פתוחים, אבל בלי לדרוש מהמבקר להבין את המערכת לפני שהוא מבין את האדם.', 'Here StartOn, creation, research, media, public work and personal life become one story again — with open sources, but without requiring the visitor to understand the system before understanding the person.', 'Здесь StartOn, творчество, исследования, медиа, общественная работа и личная жизнь снова становятся одной историей — с открытыми источниками, но без требования понять систему раньше человека.'),
        response: l('ההווה ממשיך להיכנס דרך פידים ציבוריים, תגובות, שיחות ותנועה באתר. כל אות נשמר במקור שלו; אין “Total” סינתטי שמעמיד פנים שכל המדדים הם אותו דבר.', 'The present continues to enter through public feeds, comments, conversations and site activity. Every signal stays bound to its source; there is no synthetic “Total” pretending different metrics are the same thing.', 'Настоящее продолжает входить через публичные ленты, комментарии, разговоры и активность сайта. Каждый сигнал остаётся у своего источника; синтетического «Total», смешивающего разные метрики, нет.'),
        consequence: l('האתר עצמו נהיה חלק מהדרך: הוא לא רק מספר מה היה, אלא עוזר לבחור מה עושים מכאן.', 'The site itself becomes part of the path: it does not only describe what happened, it helps choose what happens next.', 'Сам сайт становится частью пути: он не только рассказывает, что было, но помогает выбирать, что делать дальше.'),
        reflection: l('אם כל מה שעברתי נשאר רק ארכיון — פספסתי. הערך האמיתי הוא להפוך זיכרון, ניסיון וקהל לתשתית שמאפשרת לאחרים לפעול.', 'If everything I lived through remains only an archive, I missed the point. The real value is turning memory, experience and audience into infrastructure that helps other people act.', 'Если всё пережитое останется только архивом, смысл потерян. Настоящая ценность — превращать память, опыт и аудиторию в инфраструктуру, помогающую другим действовать.'),
        capability: l('לחבר חיים לפעולה', 'Connect life to action', 'Соединять жизнь с действием'),
        publicValue: l('לעבור מזיכרון מתועד לצעד הבא.', 'Move from documented memory to the next move.', 'Переходить от документированной памяти к следующему шагу.'),
        sourceUrl: 'https://www.instagram.com/igor.vepretski/',
        sourceLabel: l('הפיד הציבורי החי', 'Live public feed', 'Живая публичная лента'),
        depth: 'create',
        depthLabel: l('לבנות משהו יחד', 'Build something together', 'Создать что-то вместе'),
    },
];

export const signalMoments = [
    {
        id: 'fraud',
        eyebrow: 'POST → TV',
        title: l('פוסט אישי נכנס לאולפן חדשות.', 'A personal post entered a news studio.', 'Личный пост оказался в новостной студии.'),
        body: l('סיפור על הונאת קשישים יצא מהפיד וקיבל המשך טלוויזיוני.', 'An elder-fraud story moved beyond the feed into television coverage.', 'История о мошенничестве против пожилых вышла из ленты в телевидение.'),
        href: 'https://www.youtube.com/watch?v=AE5hDzLM5XU',
    },
    {
        id: 'father',
        eyebrow: 'STORY → ARTICLE',
        title: l('משפט על אבהות קיבל חיים אצל אחרים.', 'A sentence about fatherhood acquired a life elsewhere.', 'Фраза об отцовстве получила жизнь у других.'),
        body: l('הפצה חיצונית וכתבה הפכו סיפור אישי לשיחה רחבה יותר.', 'External distribution and coverage turned a personal story into a wider conversation.', 'Внешнее распространение и статья превратили личную историю в более широкий разговор.'),
        href: 'https://www.hidabroot.org/article/1179015',
    },
    {
        id: 'starton',
        eyebrow: 'ATTENTION → INSTITUTION',
        title: l('הסיפור חזר לשכונה כ־StartOn.', 'The story returned to the neighborhood as StartOn.', 'История вернулась в район как StartOn.'),
        body: l('תשומת לב נבחנה מול שאלה קשה יותר: האם אפשר לבנות מקום ממשי.', 'Attention faced a harder test: can it become a real place and operating model?', 'Внимание столкнулось с более сложным тестом: можно ли превратить его в реальное место и рабочую модель?'),
        href: 'https://starton.org.il/',
    },
] as const;
