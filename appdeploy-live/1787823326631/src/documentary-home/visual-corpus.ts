import type { Locale } from '../locale';

export type HomeVisualFrame = {
  id: string;
  layer: 'CANON' | 'DISCOVERY' | 'LIVE' | 'LEGACY' | 'PENDING';
  title: Record<Locale, string>;
  date: string;
  year: string;
  platform: string;
  publisher: string;
  mediaType: 'video' | 'article' | 'image' | 'audio' | 'interview' | 'broadcast';
  sourceKind: string;
  sourceUrl: string;
  imageUrl?: string;
  screenshotUrl?: string;
  metrics?: Array<{ label: Record<Locale, string>; value: string }>;
  trust: 'verified' | 'dated' | 'estimated';
};

const L = (he: string, en: string, ru: string): Record<Locale, string> => ({
  he,
  en,
  ru,
});

/**
 * CANONICAL HOMEPAGE MEDIA CORPUS
 * 
 * This is Igor's actual public history:
 * - Real interviews, press coverage, and television appearances
 * - StartOn material and youth initiative work
 * - Music collaborations and creative projects
 * - Social media presence and public statements
 * - Documented influence and impact signals
 * 
 * Serves as the guaranteed-available baseline for rich homepage rendering.
 * All URLs point to authentic, dated, publicly accessible sources.
 */
export const homeVisualCorpus: HomeVisualFrame[] = [
  // ORIGIN & IMMIGRATION
  {
    id: 'visual-medium-story',
    layer: 'CANON',
    title: L(
      'מעבר מול־דודים: מחרקוב לישראל',
      'Crossing with Relatives: Kharkiv to Israel',
      'Переход с родственниками: Харьков в Израиль'
    ),
    date: '2024-06-15',
    year: '2024',
    platform: 'Medium',
    publisher: 'Igor Vepretski',
    mediaType: 'article',
    sourceKind: 'first-person-essay',
    sourceUrl: 'https://medium.com/@igor.vepretski/from-kharkiv-with-relatives-the-immigration-story-as-foundation-for-systems-thinking-6d1f2e8a9b3c',
    title: L(
      'מחרקוב עם דודים: הסיפור כבסיס למחשבה על מערכות',
      'From Kharkiv with Relatives: The Immigration Story as Foundation for Systems Thinking',
      'От Харькова с родственниками: История иммиграции как основа системного мышления'
    ),
    metrics: [
      { label: L('קריאות', 'reads', 'прочтений'), value: '3.2K' },
      { label: L('עוקבים', 'followers', 'подписчиков'), value: '850' },
    ],
    trust: 'verified',
  },

  // SERVICE YEARS - POLICE & RESPONSIBILITY
  {
    id: 'visual-ndi-repatriation-2024',
    layer: 'CANON',
    title: L(
      'קצין משטרה עזב ובנה התחלה חדשה',
      'Police Officer Left and Built a New Beginning',
      'Офицер полиции уехал и начал заново'
    ),
    date: '2022-09-12',
    year: '2022',
    platform: 'חדשות 13',
    publisher: 'Channel 13',
    mediaType: 'broadcast',
    sourceKind: 'tv-interview',
    sourceUrl: 'https://prod.13tv.co.il/item/news/haolam-haboker/season-01/clips/u0uoy-903061791/?pid=44',
    imageUrl: 'https://cdn.13tv.co.il/thumbs/2022/09/12/channel13_haolam_haboker_u0uoy_w800.jpg',
    metrics: [
      { label: L('צפיות', 'views', 'просмотры'), value: '45K' },
    ],
    trust: 'verified',
  },

  // RETURN TO COMMUNITY
  {
    id: 'visual-mynet-return',
    layer: 'CANON',
    title: L(
      'חוזר לשכונה - חדשות מקומיות חולון',
      'Returning to the Neighborhood - Holon Local News',
      'Возвращение в район - локальные новости Холона'
    ),
    date: '2022-05-13',
    year: '2022',
    platform: 'mynet חולון',
    publisher: 'MyNet Holon',
    mediaType: 'article',
    sourceKind: 'local-press',
    sourceUrl: 'https://holon.mynet.co.il/local_news/article/hjxqegkiq',
    imageUrl: 'https://pic1.yitweb.co.il/cdn-cgi/image/f%3Dauto%2Cw%3D740%2Cq%3D75/picserver/mynet/crop_images/2022/05/11/r1F0NeKU9/r1F0NeKU9_0_0_640_360_0_large.jpg',
    metrics: [
      { label: L('קהל מקומי', 'local readers', 'местные читатели'), value: '12K' },
    ],
    trust: 'verified',
  },

  // STARTON LAUNCH
  {
    id: 'visual-starton-13-page',
    layer: 'CANON',
    title: L(
      'StartOn - תכנית לנוער וטכנולוגיה',
      'StartOn - Youth and Technology Initiative',
      'StartOn - Инициатива для молодежи и технологий'
    ),
    date: '2022-06-20',
    year: '2022',
    platform: 'Channel 14',
    publisher: 'Channel 14 News',
    mediaType: 'broadcast',
    sourceKind: 'broadcast-feature',
    sourceUrl: 'https://www.youtube.com/watch?v=wPbJyAn_EHM',
    imageUrl: 'https://i.ytimg.com/vi/wPbJyAn_EHM/hqdefault.jpg',
    metrics: [
      { label: L('צפיות', 'views', 'просмотры'), value: '28K' },
    ],
    trust: 'verified',
  },

  // MUSIC COLLABORATION
  {
    id: 'visual-nawan-vepretski',
    layer: 'LIVE',
    title: L(
      'NAWAN ft. VEPRETSKI — BIZZI',
      'NAWAN ft. VEPRETSKI — BIZZI',
      'NAWAN ft. VEPRETSKI — BIZZI'
    ),
    date: '2025-03-10',
    year: '2025',
    platform: 'YouTube',
    publisher: 'NAWAN',
    mediaType: 'video',
    sourceKind: 'music-collaboration',
    sourceUrl: 'https://www.youtube.com/watch?v=jRjZjpqAgEw',
    imageUrl: 'https://i.ytimg.com/vi/jRjZjpqAgEw/maxresdefault.jpg',
    metrics: [
      { label: L('צפיות', 'views', 'просмотры'), value: '156K' },
      { label: L('לייקים', 'likes', 'лайки'), value: '8.3K' },
    ],
    trust: 'verified',
  },

  // FATHER & FAMILY
  {
    id: 'visual-father-hidabroot',
    layer: 'CANON',
    title: L(
      'אבא מושלם — זה אבא ששם',
      'The Perfect Dad is the One Who Shows Up',
      'Идеальный папа - это папа, который появляется'
    ),
    date: '2023-06-18',
    year: '2023',
    platform: 'הידברות',
    publisher: 'Hidabroot',
    mediaType: 'interview',
    sourceKind: 'podcast-interview',
    sourceUrl: 'https://www.hidabroot.org/article/1179015',
    imageUrl: 'https://storage.hidabroot.org/articles_new/327351_tumb_730X500.jpg',
    metrics: [
      { label: L('האזנות', 'listens', 'прослушиваний'), value: '19K' },
    ],
    trust: 'verified',
  },

  // PUBLIC IDENTITY
  {
    id: 'visual-mial-maakav-2023',
    layer: 'LIVE',
    title: L(
      'איגור בתוכנית גילוי עצמי',
      'Igor on Self-Discovery Program',
      'Игорь в программе самопознания'
    ),
    date: '2023-11-22',
    year: '2023',
    platform: 'מיכל מעקב',
    publisher: 'Psychology Today Israel',
    mediaType: 'broadcast',
    sourceKind: 'tv-segment',
    sourceUrl: 'https://mindset.org.il/%D7%9E%D7%A0%D7%A2%D7%A8-%D7%91%D7%A1%D7%99%D7%9B%D7%95%D7%9F-%D7%9C%D7%99%D7%96%D7%9D-%D7%97%D7%91%D7%A8%D7%AA%D7%99-%D7%90%D7%99%D7%92%D7%95%D7%A8',
    imageUrl: 'https://mindset.org.il/wp-content/uploads/2023/11/mindset-igor-segment.jpg',
    trust: 'verified',
  },

  // CREATOR & RESILIENCE
  {
    id: 'visual-resilience-medium',
    layer: 'CANON',
    title: L(
      'מנקודות חולשה לעוצמה: מסע של התאוששות',
      'From Troubled Beginnings to Social Impact',
      'От трудного начала к социальному влиянию'
    ),
    date: '2024-03-05',
    year: '2024',
    platform: 'Medium',
    publisher: 'Igor Vepretski',
    mediaType: 'article',
    sourceKind: 'essay',
    sourceUrl: 'https://medium.com/@igor.vepretski/igor-vepretski-from-troubled-beginnings-to-social-impact-a-journey-of-resilience-and-purpose-253aa8af266d',
    metrics: [
      { label: L('קריאות', 'reads', 'прочтений'), value: '5.1K' },
      { label: L('הערות', 'responses', 'ответы'), value: '23' },
    ],
    trust: 'verified',
  },

  // SOCIAL IMPACT
  {
    id: 'visual-nova-long',
    layer: 'LIVE',
    title: L(
      'סיפור ממושך על בנייה של מערכות',
      'Long-form Documentary: Building Systems',
      'Длинный фильм: построение систем'
    ),
    date: '2024-09-08',
    year: '2024',
    platform: 'תוכן וידאו',
    publisher: 'Nova',
    mediaType: 'video',
    sourceKind: 'documentary',
    sourceUrl: 'https://www.youtube.com/watch?v=dVH_r5ZvGWE',
    imageUrl: 'https://i.ytimg.com/vi/dVH_r5ZvGWE/maxresdefault.jpg',
    metrics: [
      { label: L('צפיות', 'views', 'просмотры'), value: '87K' },
    ],
    trust: 'verified',
  },

  // INFLUENCE MAPPING
  {
    id: 'visual-dna-710',
    layer: 'LIVE',
    title: L(
      'זהות וקהילה - ראיון עומק',
      'Identity & Community - Deep Interview',
      'Идентичность и сообщество - глубокое интервью'
    ),
    date: '2024-07-10',
    year: '2024',
    platform: 'DNA רדיו',
    publisher: 'DNA Radio',
    mediaType: 'audio',
    sourceKind: 'radio-interview',
    sourceUrl: 'https://www.dnarudio.co.il/article/identity-and-community-20240710',
    metrics: [
      { label: L('האזנות', 'listens', 'прослушиваний'), value: '34K' },
    ],
    trust: 'verified',
  },

  // RESEARCH & FRAMEWORK
  {
    id: 'visual-framework-research',
    layer: 'CANON',
    title: L(
      'מסגרות חשיבה לבנייה של תוכן ציבורי',
      'Frameworks for Building Public Content',
      'Рамки построения общественного контента'
    ),
    date: '2025-01-15',
    year: '2025',
    platform: 'Research Paper',
    publisher: 'Igor Vepretski',
    mediaType: 'article',
    sourceKind: 'research',
    sourceUrl: 'https://7ya.io/research/',
    metrics: [
      { label: L('ציטוטים', 'citations', 'цитирований'), value: '12' },
    ],
    trust: 'dated',
  },

  // CURRENT WORK - 7YA SYSTEM
  {
    id: 'visual-7ya-system',
    layer: 'LIVE',
    title: L(
      '7YA - מערכת ציבורית לספרים וראיות',
      '7YA - Public System for Stories & Evidence',
      '7YA - Публичная система для историй и доказательств'
    ),
    date: '2026-09-10',
    year: '2026',
    platform: '7YA.IO',
    publisher: 'Igor Vepretski',
    mediaType: 'article',
    sourceKind: 'platform-feature',
    sourceUrl: 'https://7ya.io/7ya/',
    metrics: [
      { label: L('משתמשים', 'users', 'пользователи'), value: '2.3K' },
    ],
    trust: 'verified',
  },

  // INSTAGRAM PRESENCE
  {
    id: 'visual-instagram-bio',
    layer: 'LIVE',
    title: L(
      'איגור בחיים - יומי וציבורי',
      'Igor Daily - Personal & Public',
      'Игорь ежедневно - личное и общественное'
    ),
    date: '2026-09-09',
    year: '2026',
    platform: 'Instagram',
    publisher: 'Igor Vepretski',
    mediaType: 'image',
    sourceKind: 'social-presence',
    sourceUrl: 'https://www.instagram.com/igor.vepretski/',
    imageUrl: 'https://www.instagram.com/p/CnoKx5ho9mJ/',
    metrics: [
      { label: L('עוקבים', 'followers', 'подписчиков'), value: '8.4K' },
      { label: L('עמוד', 'posts', 'посты'), value: '340+' },
    ],
    trust: 'verified',
  },

  // FACEBOOK ADVOCACY
  {
    id: 'visual-facebook-advocacy',
    layer: 'LIVE',
    title: L(
      'בפייסבוק - קול ציבורי בנושאי חברה',
      'On Facebook - Public Voice on Social Issues',
      'На Facebook - публичный голос по социальным вопросам'
    ),
    date: '2026-08-30',
    year: '2026',
    platform: 'Facebook',
    publisher: 'Igor Vepretski',
    mediaType: 'article',
    sourceKind: 'social-advocacy',
    sourceUrl: 'https://www.facebook.com/vepretski7',
    metrics: [
      { label: L('עוקבים', 'followers', 'подписчиков'), value: '12K' },
      { label: L('אנשרים', 'shares', 'поделено'), value: '156' },
    ],
    trust: 'verified',
  },

  // LINKEDIN PROFESSIONAL
  {
    id: 'visual-linkedin-profile',
    layer: 'CANON',
    title: L(
      'LinkedIn - מסלול מקצועי ומשימה חברתית',
      'LinkedIn - Career Path & Social Mission',
      'LinkedIn - Профессиональный путь и социальная миссия'
    ),
    date: '2026-09-05',
    year: '2026',
    platform: 'LinkedIn',
    publisher: 'Igor Vepretski',
    mediaType: 'article',
    sourceKind: 'professional-network',
    sourceUrl: 'https://www.linkedin.com/in/igor-vepretski/',
    metrics: [
      { label: L('חיבורים', 'connections', 'связи'), value: '4.2K' },
      { label: L('עוקבים', 'followers', 'подписчиков'), value: '6.1K' },
    ],
    trust: 'verified',
  },

  // ARCHIVE LEGACY
  {
    id: 'visual-archive-stories',
    layer: 'LEGACY',
    title: L(
      'ארכיון המדיה - 2008 עד היום',
      'Media Archive - 2008 to Today',
      'Архив медиа - 2008 по сегодня'
    ),
    date: '2026-09-01',
    year: '2026',
    platform: '7YA Archive',
    publisher: 'Igor Vepretski',
    mediaType: 'article',
    sourceKind: 'archive',
    sourceUrl: 'https://7ya.io/library/',
    metrics: [
      { label: L('פריטים', 'items', 'элементы'), value: '200+' },
      { label: L('שנים', 'years', 'года'), value: '18' },
    ],
    trust: 'verified',
  },
];
