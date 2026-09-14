import type { Locale } from './locale';

export type LocalizedText = Record<Locale, string>;

export type ProjectionMetric = {
  value: string;
  label: LocalizedText;
  note: LocalizedText;
};

export type ProjectionAsset = {
  id: string;
  title: string;
  subtitle: string;
  published: string;
  sourceUrl: string;
  sourceLabel: string;
  coverUrl: string;
  fallbackImage: string;
  status: LocalizedText;
  eyebrow: LocalizedText;
  question: LocalizedText;
  summary: LocalizedText;
  primaryAction: LocalizedText;
  secondaryAction: LocalizedText;
  metric: ProjectionMetric;
  framework: Array<{ label: string; body: LocalizedText }>;
};

export const supernoahAsset: ProjectionAsset = {
  id: 'supernoah-founder-edition',
  title: 'SUPERNOAH',
  subtitle: 'Founder Edition: After the Data Flood',
  published: '2026',
  sourceUrl: 'https://www.academia.edu/168076525/7YA_LEADERSHIP_FOR_THE_ALGORITHMIC_AGE_SUPERNOAH_Founder_Edition_After_the_Data_Flood',
  sourceLabel: 'Academia.edu · public manuscript',
  coverUrl: 'https://0.academia-photos.com/attachment_thumbnails/132974332/mini_magick20260602-1-8h8gxo.png?1780427266=',
  fallbackImage: 'resources/7ya-research.webp',
  status: {
    he: 'Founder Edition · preprint רעיוני עצמאי · טרם עבר ביקורת עמיתים',
    en: 'Founder Edition · independent conceptual preprint · not yet peer reviewed',
    ru: 'Founder Edition · независимый концептуальный препринт · без рецензирования',
  },
  eyebrow: {
    he: 'RIGHT NOW · RESEARCH SIGNAL · 10.09.2026',
    en: 'RIGHT NOW · RESEARCH SIGNAL · 10 SEP 2026',
    ru: 'RIGHT NOW · RESEARCH SIGNAL · 10.09.2026',
  },
  question: {
    he: 'מה צריכה מנהיגות אנושית לשמר כאשר אלגוריתמים, AI ושפע מידע מתחילים להציף קשב, אמון ושיפוט?',
    en: 'What should human leadership preserve when algorithms, AI and information abundance begin to overwhelm attention, trust and judgment?',
    ru: 'Что должно сохранять человеческое лидерство, когда алгоритмы, ИИ и информационное изобилие перегружают внимание, доверие и суждение?',
  },
  summary: {
    he: 'מסגרת ה־Ark מציעה עמידות דיגיטלית כארכיטקטורה של agency: גבולות, זיכרון, אימות, provenance וחזרה מכוונת לחיים אזרחיים ואנושיים.',
    en: 'The Ark framework treats digital resilience as an architecture of agency: boundaries, memory, verification, provenance and deliberate re-entry into civic and human life.',
    ru: 'Модель Ark рассматривает цифровую устойчивость как архитектуру субъектности: границы, память, проверка, происхождение и осознанное возвращение к общественной и человеческой жизни.',
  },
  primaryAction: {
    he: 'לקריאת כתב היד',
    en: 'Read the manuscript',
    ru: 'Читать рукопись',
  },
  secondaryAction: {
    he: 'למפת המחקר',
    en: 'Explore the research map',
    ru: 'Открыть карту исследований',
  },
  metric: {
    value: '20 / 38',
    label: {
      he: 'צפיות במסמך מתוך כלל צפיות המסמכים ב־30 הימים האחרונים',
      en: 'document views out of all document views in the last 30 days',
      ru: 'просмотров документа из всех просмотров документов за последние 30 дней',
    },
    note: {
      he: 'צילום נתוני בעל החשבון ב־Academia · 10.09.2026 · אות, לא טענת ויראליות',
      en: 'Academia owner-analytics snapshot · 10 Sep 2026 · a signal, not a virality claim',
      ru: 'Снимок аналитики владельца Academia · 10.09.2026 · сигнал, а не заявление о вирусности',
    },
  },
  framework: [
    {
      label: 'FLOOD',
      body: {
        he: 'נפח, מהירות, הפרעה, עוצמה רגשית ואותות סינתטיים.',
        en: 'Volume, speed, interruption, emotional intensity and synthetic signals.',
        ru: 'Объём, скорость, прерывания, эмоциональная интенсивность и синтетические сигналы.',
      },
    },
    {
      label: 'ARK',
      body: {
        he: 'תשתיות תחומות ששומרות קשב, זיכרון, אמון ויכולת פעולה.',
        en: 'Bounded infrastructures that preserve attention, memory, trust and agency.',
        ru: 'Ограниченные инфраструктуры, сохраняющие внимание, память, доверие и субъектность.',
      },
    },
    {
      label: 'WINDOW',
      body: {
        he: 'פתיחות ממושמעת: לא בידוד סגור ולא טבילה קבועה.',
        en: 'Disciplined permeability: neither sealed isolation nor permanent immersion.',
        ru: 'Дисциплинированная проницаемость: ни изоляция, ни постоянное погружение.',
      },
    },
    {
      label: 'DOVE + OLIVE LEAF',
      body: {
        he: 'אימות ו־provenance ששומרים מגע עקיב עם המציאות.',
        en: 'Verification and provenance signals that preserve contact with reality.',
        ru: 'Проверка и сигналы происхождения, сохраняющие контакт с реальностью.',
      },
    },
    {
      label: 'COVENANT',
      body: {
        he: 'כללים והתחייבויות שמגבילים אופטימיזציה הרסנית.',
        en: 'Rules and public commitments that limit destructive optimization.',
        ru: 'Правила и публичные обязательства, ограничивающие разрушительную оптимизацию.',
      },
    },
    {
      label: 'RE-ENTRY',
      body: {
        he: 'המטרה איננה בריחה — אלא חזרה למשפחה, חינוך, קהילה ועשייה.',
        en: 'The goal is not escape, but return to family, education, community and action.',
        ru: 'Цель не побег, а возвращение к семье, образованию, сообществу и действию.',
      },
    },
  ],
};
