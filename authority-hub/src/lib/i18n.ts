export const locales = ['he', 'en', 'ru'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'he';

export const pageSlugs = ['igor-vepretski', 'starton', 'evidence-wall', 'timeline', 'press'] as const;
export type PageSlug = (typeof pageSlugs)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function isPageSlug(value: string): value is PageSlug {
  return pageSlugs.includes(value as PageSlug);
}

export const localeMeta: Record<Locale, { label: string; dir: 'rtl' | 'ltr' }> = {
  he: { label: 'עברית', dir: 'rtl' },
  en: { label: 'English', dir: 'ltr' },
  ru: { label: 'Русский', dir: 'ltr' }
};

export const dictionaries = {
  he: {
    brand: '7YA AUTHORITY HUB',
    philosophy: 'לא אופנה. כוח.',
    nav: {
      home: 'בית',
      bio: 'איגור ופרצקי',
      starton: 'StartOn',
      evidence: 'קיר הראיות',
      timeline: 'ציר זמן',
      press: 'מדיה'
    },
    home: {
      eyebrow: 'CANONICAL AUTHORITY HUB · HUMAN FIRST · EVIDENCE GOVERNED',
      title: 'לא לבקש אמון. לבנות אותו.',
      lead: '7YA הוא מרכז סמכות ציבורי רב־לשוני שמחבר בין הסיפור של איגור ופרצקי, השליחות של StartOn, מקורות פומביים, גבולות הוכחה ודרך פעולה עבור נוער בסיכון.',
      primary: 'לביוגרפיה המאומתת',
      secondary: 'לקיר הראיות',
      pillars: ['זהות ציבורית ברורה', 'מקור לכל טענה', 'פרטיות כחלק מאמון', 'פעולה חברתית בלי ניפוח']
    },
    pages: {
      'igor-vepretski': {
        eyebrow: 'PUBLIC VERIFIED BIO',
        title: 'איגור ופרצקי',
        lead: 'יזם חברתי, יוצר ציבורי, מייסד StartOn ובונה 7YA. הביוגרפיה מפרידה בין עובדה מתועדת, תיאור עצמי ופרט שאינו מתאים לפרסום.',
        sections: [
          ['זהות ומסע', 'נולד בחרקיב, עלה לישראל בילדותו ובנה זהות ציבורית רב־לשונית מתוך חוויות של הגירה, שכונה, שירות וחיפוש אחר שייכות.'],
          ['שירות ואחריות', 'הרקע הציבורי כולל שירות צבאי, אבטחה, משטרה ושירות מוניציפלי. מידע מבצעי, מקורות ושיטות אינם חלק מהאתר.'],
          ['יצירה ציבורית', 'וידאו, כתיבה, מוזיקה ומערכות דיגיטליות משמשים לבניית שיחה ציבורית, זיכרון והזדמנויות לפעולה.']
        ]
      },
      starton: {
        eyebrow: 'THE NON-PROFIT TRACK',
        title: 'StartOn',
        lead: 'מסגרת חברתית־טכנולוגית שנועדה לבנות לנוער בית בטוח של מסוגלות, קהילה ועתיד.',
        sections: [
          ['Training', 'למידה מעשית, כלים דיגיטליים, יצירה, ליווי ומסלולים להתקדמות.'],
          ['Community', 'שייכות, מנטורים, רשת תמיכה ומרחב שבו מותר לנסות ולהיכשל בבטחה.'],
          ['Experience', 'טכנולוגיה אינטראקטיבית, משחק, מדיה וחוויה שמפחיתה פחד ומגדילה סקרנות.']
        ]
      },
      'evidence-wall': {
        eyebrow: 'TRUST LAYER',
        title: 'קיר הראיות',
        lead: 'כל כרטיס מציג מזהה טענה, מקור, סטטוס, מה הראיה מוכיחה ומה היא אינה מוכיחה.',
        sections: []
      },
      timeline: {
        eyebrow: 'ANCHORED HISTORY',
        title: 'ציר זמן',
        lead: 'שלושה עוגנים ציבוריים: 2011 — עקבה ביוגרפית מוקדמת; 2022 — החזרה לשכונה והמעבר ל־StartOn; 2026 — Snapshot דיגיטלי מתוארך.',
        sections: [
          ['2011 · Legacy', 'פרופיל פומבי מוקדם יצר רציפות ביוגרפית בין קושי, שירות ושאיפה לשינוי.'],
          ['2022 · Return', 'סיקור חיצוני תיעד את החזרה לג׳סי כהן ואת המשימה לבנות מסגרת טכנולוגית לנוער.'],
          ['2026 · Snapshot', 'מדדי TikTok ו־LinkedIn נשמרים כצילום מצב מתוארך, לא כמונה נצחי ולא כהוכחת תוצאה חברתית.']
        ]
      },
      press: {
        eyebrow: 'MEDIA KIT',
        title: 'חדר מדיה',
        lead: 'נכסי מדיה, ביוגרפיות קצרות, קישורים למקורות וכללי שימוש — בלי טקסט כלוא בתוך תמונות.',
        sections: [
          ['Bio · 50 words', 'Igor Vepretski is a social entrepreneur, public creator, founder of StartOn and builder of 7YA, an evidence-governed public authority hub.'],
          ['Verified sources', 'הורדות עתידיות יכללו רשימת מקורות, תמונות מאושרות, קרדיטים ותאריך עדכון.'],
          ['Usage boundary', 'אין להשתמש בלוגו של שותף, במספר משתנה או בטענה תוצאתית ללא מקור והרשאה.']
        ]
      }
    }
  },
  en: {
    brand: '7YA AUTHORITY HUB',
    philosophy: 'NOT FASHION. FORCE.',
    nav: { home: 'Home', bio: 'Igor Vepretski', starton: 'StartOn', evidence: 'Evidence Wall', timeline: 'Timeline', press: 'Press' },
    home: {
      eyebrow: 'CANONICAL AUTHORITY HUB · HUMAN FIRST · EVIDENCE GOVERNED',
      title: 'Do not ask for trust. Build it.',
      lead: '7YA is a multilingual public authority hub connecting Igor Vepretski’s story, StartOn’s mission, public sources, proof boundaries and a path of action for youth at risk.',
      primary: 'Verified biography',
      secondary: 'Evidence Wall',
      pillars: ['Clear public identity', 'A source for every claim', 'Privacy as trust', 'Social action without inflation']
    },
    pages: {
      'igor-vepretski': { eyebrow: 'PUBLIC VERIFIED BIO', title: 'Igor Vepretski', lead: 'Social entrepreneur, public creator, founder of StartOn and builder of 7YA. The biography separates documented facts, self-attributed history and private information.', sections: [['Identity and journey', 'Born in Kharkiv and raised in Israel, his public identity was shaped by migration, neighborhoods, service and the search for belonging.'], ['Service and responsibility', 'The public record includes military, security, police and municipal service. Operational details, sources and methods are excluded.'], ['Public creation', 'Video, writing, music and digital systems are used to build public dialogue, memory and routes to action.']] },
      starton: { eyebrow: 'THE NON-PROFIT TRACK', title: 'StartOn', lead: 'A social-technology framework designed as a safe home for capability, community and a future.', sections: [['Training', 'Practical learning, digital tools, creation, guidance and progression pathways.'], ['Community', 'Belonging, mentors, support networks and a safe place to try and fail.'], ['Experience', 'Interactive technology, gaming and media that reduce fear and expand curiosity.']] },
      'evidence-wall': { eyebrow: 'TRUST LAYER', title: 'Evidence Wall', lead: 'Every card shows a claim ID, source, status, what the evidence proves and what it does not prove.', sections: [] },
      timeline: { eyebrow: 'ANCHORED HISTORY', title: 'Timeline', lead: 'Three public anchors: 2011 legacy, 2022 return and a dated 2026 digital snapshot.', sections: [['2011 · Legacy', 'An early public profile established biographical continuity between hardship, service and change.'], ['2022 · Return', 'External coverage documented the return to Jesse Cohen and the youth-technology mission.'], ['2026 · Snapshot', 'TikTok and LinkedIn numbers are preserved as dated snapshots, not permanent counters or impact proof.']] },
      press: { eyebrow: 'MEDIA KIT', title: 'Press Room', lead: 'Media assets, short biographies, source links and usage rules — with no biography trapped inside an image.', sections: [['Bio · 50 words', 'Igor Vepretski is a social entrepreneur, public creator, founder of StartOn and builder of 7YA, an evidence-governed public authority hub.'], ['Verified sources', 'Future downloads will include approved images, credits, source lists and update dates.'], ['Usage boundary', 'Do not use a partner logo, fluid metric or outcome claim without a source and permission.']] }
    }
  },
  ru: {
    brand: '7YA AUTHORITY HUB',
    philosophy: 'НЕ МОДА. СИЛА.',
    nav: { home: 'Главная', bio: 'Игорь Вепрецкий', starton: 'StartOn', evidence: 'Стена доказательств', timeline: 'Хронология', press: 'Пресса' },
    home: {
      eyebrow: 'CANONICAL AUTHORITY HUB · HUMAN FIRST · EVIDENCE GOVERNED',
      title: 'Не просить доверия. Строить его.',
      lead: '7YA — многоязычный публичный центр авторитета, соединяющий историю Игоря Вепрецкого, миссию StartOn, открытые источники, границы доказательств и путь действия для молодежи группы риска.',
      primary: 'Проверенная биография',
      secondary: 'Стена доказательств',
      pillars: ['Ясная публичная идентичность', 'Источник для каждого утверждения', 'Приватность как доверие', 'Социальное действие без преувеличений']
    },
    pages: {
      'igor-vepretski': { eyebrow: 'PUBLIC VERIFIED BIO', title: 'Игорь Вепрецкий', lead: 'Социальный предприниматель, публичный автор, основатель StartOn и создатель 7YA. Биография разделяет документированные факты, личные заявления и частную информацию.', sections: [['Идентичность и путь', 'Родился в Харькове и вырос в Израиле; публичная идентичность сформирована миграцией, районами, службой и поиском принадлежности.'], ['Служба и ответственность', 'Публичная биография включает военную, охранную, полицейскую и муниципальную службу. Оперативные детали не публикуются.'], ['Публичное творчество', 'Видео, тексты, музыка и цифровые системы используются для диалога, памяти и действия.']] },
      starton: { eyebrow: 'THE NON-PROFIT TRACK', title: 'StartOn', lead: 'Социально-технологическая система безопасного пространства для способностей, сообщества и будущего.', sections: [['Training', 'Практическое обучение, цифровые инструменты, творчество и маршруты развития.'], ['Community', 'Принадлежность, наставники, поддержка и безопасное право на ошибку.'], ['Experience', 'Интерактивные технологии, игры и медиа, снижающие страх и развивающие любопытство.']] },
      'evidence-wall': { eyebrow: 'TRUST LAYER', title: 'Стена доказательств', lead: 'Каждая карточка показывает ID утверждения, источник, статус, что доказательство подтверждает и чего не подтверждает.', sections: [] },
      timeline: { eyebrow: 'ANCHORED HISTORY', title: 'Хронология', lead: 'Три публичные опоры: наследие 2011 года, возвращение 2022 года и датированный цифровой снимок 2026 года.', sections: [['2011 · Legacy', 'Ранняя публикация создала биографическую непрерывность между трудностями, службой и изменением.'], ['2022 · Return', 'Внешние публикации зафиксировали возвращение в Джесси Коэн и молодежную технологическую миссию.'], ['2026 · Snapshot', 'Показатели TikTok и LinkedIn сохраняются как датированные снимки, а не как вечные счетчики или доказательство результата.']] },
      press: { eyebrow: 'MEDIA KIT', title: 'Пресс-центр', lead: 'Медиа-материалы, краткие биографии, ссылки на источники и правила использования — без текста, запертого в изображениях.', sections: [['Bio · 50 words', 'Igor Vepretski is a social entrepreneur, public creator, founder of StartOn and builder of 7YA, an evidence-governed public authority hub.'], ['Verified sources', 'Будущие загрузки включат одобренные изображения, кредиты, список источников и дату обновления.'], ['Usage boundary', 'Нельзя использовать логотип партнера, меняющийся показатель или заявление о результате без источника и разрешения.']] }
    }
  }
} as const;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
