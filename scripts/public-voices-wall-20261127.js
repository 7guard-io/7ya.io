/* 7YA · Igor Vepretski public response wall · 2026-11-27 */
(() => {
  'use strict';
  const panel = document.querySelector('[data-public-voices]');
  if (!panel) return;

  const grid = panel.querySelector('#publicVoicesGrid');
  const search = panel.querySelector('#publicVoicesSearch');
  const status = panel.querySelector('#publicVoicesStatus');
  const filterButtons = [...panel.querySelectorAll('[data-voices-filter]')];
  const excerptCount = panel.querySelector('[data-voices-excerpt-count]');
  const threadCount = panel.querySelector('[data-voices-thread-count]');
  const platformCount = panel.querySelector('[data-voices-platform-count]');
  const lang = (document.documentElement.lang || 'he').slice(0, 2).toLowerCase();
  const locale = ({he:'he-IL',en:'en-US',ru:'ru-RU',ar:'ar'}[lang] || 'he-IL');
  const localePrefix = lang === 'he' ? '' : '/' + lang;
  const text = {
    he:{
      title:'הסיפור שלי לא נגמר ברגע הפרסום.',
      intro:'אלה הקולות שחזרו אליי: תמיכה, הזדהות, צחוק, ויכוח וגם ביקורת. לא בחרתי רק מחמאות — כל קטע נשאר מחובר לפרסום המקורי.',
      excerptLabel:'קטעי תגובה ציבוריים',threadLabel:'פרסומים עם תגובות',platformLabel:'פלטפורמות',
      filmKicker:'לפני התגובות — הקול שלי, בלי מתווך',filmTitle:'לשמוע את הסיפור שלי, בקול שלי.',filmLink:'לצפייה בווידאו המקורי ↗',
      searchLabel:'חיפוש בתוך התגובות',searchPlaceholder:'זהות, אבהות, משטרה, אהבה…',
      all:'הכול',owned:'מהחשבון שלי',external:'הפצה חיצונית',status:(n,p)=>'מציגים '+n+' קטעי תגובה מתוך '+p+' פרסומים ציבוריים. פתחו כל כרטיס כדי לראות את השרשור המקורי.',
      noResults:'לא נמצאו תגובות שמתאימות לחיפוש או לסינון.',ownedTag:'פרסום מהחשבון שלי',externalTag:'הפצה חיצונית · לא מהחשבון שלי',
      undated:'תאריך הפרסום לא תועד בקורפוס',sample:(n)=>n+' קטעים נבחרים',source:'לפתיחת הפרסום והתגובות ↗',
      views:'צפיות',reach:'חשיפה',likes:'לייקים',reactions:'תגובות־רגש',comments:'תגובות בפוסט',shares:'שיתופים',saves:'שמירות',interactions:'אינטראקציות',
      liveLabel:'רשומות תגובה מאומתות בשידורי LIVE',
      liveBody:'זהו ארכיון צ׳אט נפרד: תגובות בזמן שידור חי, לא תגובות לפוסטים. שמות מגיבים וטקסטים גולמיים אינם מפורסמים בשכבה הציבורית.',
      ctaText:'אם הגבת בעבר, זיהית את עצמך בשיחה, או יש לך זיכרון שחסר כאן — הוסף/י קול לארכיון. גם תגובה שלא מסכימה איתי שייכת לתמונה.',
      instagramCta:'להמשיך את השיחה ב־Instagram ↗',archiveCta:'לפתוח את הפיד הציבורי המלא ↗',contactCta:'לכתוב לי ישירות ↗',
      integrity:'היקף הפרסום: קטעי התגובה המאומתים שנכללים כרגע בקורפוס הציבורי של 7YA — לא ייצוא מלא של כל תגובה שאי פעם התקבלה בכל פלטפורמה. מדדי התגובות מתייחסים לשרשור המקורי; הקטעים המוצגים הם בחירה קצרה מתוכו. פרסומים חיצוניים מסומנים בנפרד, ופרטים מזהים של קטינים הושמטו.'
    },
    en:{
      title:'My story does not end when I hit publish.',
      intro:'These are some of the voices that came back: support, recognition, humour, disagreement and criticism. The wall does not keep only compliments — every excerpt links to its original public post.',
      excerptLabel:'public comment excerpts',threadLabel:'public posts with responses',platformLabel:'platforms',
      filmKicker:'Before the comments — my voice, unfiltered',filmTitle:'Hear my story, in my own voice.',filmLink:'Watch the original video ↗',
      searchLabel:'Search the comments',searchPlaceholder:'Identity, fatherhood, public service, music…',
      all:'All',owned:'My own posts',external:'External distribution',status:(n,p)=>'Showing '+n+' public comment excerpts across '+p+' posts. Open any card to view the original thread.',
      noResults:'No comments match this search or filter.',ownedTag:'Posted from my account',externalTag:'External distribution · not my account',
      undated:'Publication date not recorded',sample:(n)=>n+' selected excerpts',source:'Open the original post and discussion ↗',
      views:'views',reach:'reach',likes:'likes',reactions:'reactions',comments:'post comments',shares:'shares',saves:'saves',interactions:'interactions',
      liveLabel:'validated comment records in TikTok LIVE',
      liveBody:'This is a separate live-chat archive: comments made during livestreams, not comments on posts. Commenter names and raw text are not published here.',
      ctaText:'Did you comment, recognise a moment in this conversation, or remember something missing? Add your voice to the archive. Disagreement belongs in the picture too.',
      instagramCta:'Continue the conversation on Instagram ↗',archiveCta:'Explore the full public feed ↗',contactCta:'Contact me directly ↗',
      integrity:'Scope: these are the verified comment excerpts currently included in 7YA’s public corpus — not a complete export of every comment ever received on every platform. Comment totals refer to the original thread; the displayed words are a short selection. External distribution is labelled separately, and identifying details about minors are omitted.'
    },
    ru:{
      title:'Моя история не заканчивается после публикации.',
      intro:'Вот голоса, которые вернулись ко мне: поддержка, узнавание, юмор, спор и критика. Здесь не только комплименты — каждый фрагмент связан с исходной публичной публикацией.',
      excerptLabel:'фрагментов публичных комментариев',threadLabel:'публикаций с ответами',platformLabel:'платформы',
      filmKicker:'Сначала — мой голос, без посредников',filmTitle:'Услышать мою историю моим голосом.',filmLink:'Смотреть оригинальное видео ↗',
      searchLabel:'Поиск по комментариям',searchPlaceholder:'Идентичность, отцовство, служба, музыка…',
      all:'Все',owned:'Мои публикации',external:'Внешнее распространение',status:(n,p)=>'Показано '+n+' фрагментов комментариев из '+p+' публичных публикаций. Откройте карточку, чтобы увидеть исходную дискуссию.',
      noResults:'По этому запросу или фильтру комментарии не найдены.',ownedTag:'Публикация с моего аккаунта',externalTag:'Внешнее распространение · не мой аккаунт',
      undated:'Дата публикации не указана',sample:(n)=>n+' выбранных фрагментов',source:'Открыть исходную публикацию и обсуждение ↗',
      views:'просмотры',reach:'охват',likes:'лайки',reactions:'реакции',comments:'комментарии к посту',shares:'репосты',saves:'сохранения',interactions:'взаимодействия',
      liveLabel:'проверенных записей комментариев в TikTok LIVE',
      liveBody:'Это отдельный архив чата прямых эфиров, а не комментарии к публикациям. Имена участников и исходные тексты здесь не публикуются.',
      ctaText:'Вы оставляли комментарий, узнали момент из разговора или помните то, чего здесь не хватает? Добавьте свой голос в архив. Несогласие тоже часть картины.',
      instagramCta:'Продолжить разговор в Instagram ↗',archiveCta:'Открыть полную публичную ленту ↗',contactCta:'Связаться напрямую ↗',
      integrity:'Охват: это проверенные фрагменты комментариев, которые сейчас включены в публичный корпус 7YA, а не полный экспорт всех комментариев на всех платформах. Счётчики относятся к исходным обсуждениям; показанные фразы — короткая выборка. Внешнее распространение отмечено отдельно, идентифицирующие сведения о несовершеннолетних удалены.'
    },
    ar:{
      title:'قصتي لا تنتهي لحظة النشر.',
      intro:'هذه بعض الأصوات التي عادت إليّ: الدعم والتعاطف والفكاهة والاختلاف والنقد. لا نعرض المديح فقط؛ كل مقتطف مرتبط بمنشوره العام الأصلي.',
      excerptLabel:'مقتطفات من التعليقات العامة',threadLabel:'منشورات تضم ردوداً',platformLabel:'منصات',
      filmKicker:'قبل التعليقات — صوتي كما هو',filmTitle:'استمعوا إلى قصتي بصوتي.',filmLink:'شاهدوا الفيديو الأصلي ↗',
      searchLabel:'البحث في التعليقات',searchPlaceholder:'الهوية، الأبوة، الخدمة، الموسيقى…',
      all:'الكل',owned:'من حسابي',external:'انتشار خارجي',status:(n,p)=>'نعرض '+n+' مقتطفاً من التعليقات عبر '+p+' منشورات عامة. افتحوا البطاقة لمشاهدة النقاش الأصلي.',
      noResults:'لا توجد تعليقات تطابق البحث أو التصفية.',ownedTag:'منشور من حسابي',externalTag:'انتشار خارجي · ليس من حسابي',
      undated:'تاريخ النشر غير مسجل',sample:(n)=>n+' مقتطفات مختارة',source:'افتحوا المنشور والنقاش الأصلي ↗',
      views:'مشاهدات',reach:'وصول',likes:'إعجابات',reactions:'تفاعلات',comments:'تعليقات المنشور',shares:'مشاركات',saves:'حفظ',interactions:'تفاعلات',
      liveLabel:'سجلات تعليقات موثقة في TikTok LIVE',
      liveBody:'هذا أرشيف منفصل لمحادثات البث المباشر، وليس تعليقات على المنشورات. لا ننشر أسماء المشاركين أو النصوص الخام.',
      ctaText:'هل علّقتم من قبل، أو تعرفتم على لحظة في هذا الحوار، أو تتذكرون شيئاً ينقص الأرشيف؟ أضيفوا صوتكم. الاختلاف جزء من الصورة أيضاً.',
      instagramCta:'واصلوا الحوار على Instagram ↗',archiveCta:'افتحوا الخلاصة العامة الكاملة ↗',contactCta:'تواصلوا معي مباشرة ↗',
      integrity:'النطاق: هذه مقتطفات التعليقات الموثقة الموجودة حالياً في أرشيف 7YA العام، وليست تصديراً كاملاً لكل تعليق وصل على كل منصة. الأعداد تخص النقاش الأصلي؛ والعبارات المعروضة عينة قصيرة. الانتشار الخارجي موسوم بشكل منفصل، وقد حُذفت التفاصيل التي تكشف هوية القاصرين.'
    }
  };
  const c = text[lang] || text.he;
  const applyCopy = () => {
    panel.querySelectorAll('[data-voices-copy]').forEach(node => {
      const key = node.dataset.voicesCopy;
      if (c[key] && typeof c[key] === 'string') node.textContent = c[key];
    });
    if (search) {
      search.placeholder = c.searchPlaceholder;
      search.setAttribute('aria-label', c.searchLabel);
    }
    const localizedPaths = panel.querySelectorAll('[data-voices-local-path]');
    localizedPaths.forEach(link => { link.href = localePrefix + link.dataset.voicesLocalPath; });
  };
  applyCopy();

  // A child-identifying external repost is intentionally withheld from the public projection.
  const withheldRecordIds = new Set(['facebook-mial-newsonline']);
  let records = [];
  let activeFilter = 'all';

  const dateLabel = (date) => {
    if (!date) return c.undated;
    const parts = String(date).split('-').map(Number);
    if (parts.length !== 3 || parts.some(n => !Number.isFinite(n))) return c.undated;
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString(locale, {year:'numeric',month:'short',day:'numeric'});
  };

  const create = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = String(value);
    return node;
  };

  function makeCard(item) {
    const card = create('article','public-voice-card');
    card.dataset.voiceCard = '';
    card.dataset.recordId = item.id || '';
    card.dataset.platform = item.platform || '';
    card.dataset.ownership = item.owned === true ? 'owned' : 'external';

    const top = create('div','public-voice-card-top');
    top.append(create('span','public-voice-platform',item.platform || 'Public post'));
    top.append(create('span','public-voice-owner ' + (item.owned === true ? 'is-owned' : 'is-external'),
      item.owned === true ? c.ownedTag : c.externalTag));
    card.append(top);

    const date = create('small','public-voice-date',dateLabel(item.date));
    card.append(date);

    const title = create('h4','',item.title || '');
    title.lang = 'he';
    title.dir = 'rtl';
    card.append(title);

    const quotes = Array.isArray(item.audience_reactions) ? item.audience_reactions : [];
    const quoteList = create('div','public-voice-quotes');
    quotes.forEach(quote => {
      const block = create('blockquote','',quote);
      block.lang = 'he';
      block.dir = 'rtl';
      quoteList.append(block);
    });
    card.append(quoteList);

    const metrics = item.metrics && typeof item.metrics === 'object' ? item.metrics : {};
    const labels = {views:c.views,reach:c.reach,likes:c.likes,reactions:c.reactions,comments:c.comments,shares:c.shares,saves:c.saves,interactions:c.interactions};
    const order = ['views','reach','likes','reactions','comments','shares','saves','interactions'];
    const metricBox = create('div','public-voice-metrics');
    order.forEach(key => {
      const value = metrics[key];
      if (value === null || value === undefined || !Number.isFinite(Number(value))) return;
      const wrap = create('span','');
      wrap.append(create('b','',Number(value).toLocaleString(locale)));
      wrap.append(create('small','',labels[key] || key));
      metricBox.append(wrap);
    });
    if (metricBox.childNodes.length) card.append(metricBox);

    if (item.url) {
      const source = create('a','public-voice-source',c.source);
      source.href = item.url;
      source.target = '_blank';
      source.rel = 'noopener noreferrer';
      card.append(source);
    }
    return card;
  }

  function visibleRecords() {
    const query = (search?.value || '').trim().toLocaleLowerCase(locale);
    return records.filter(item => {
      const platform = String(item.platform || '');
      if (activeFilter === 'Facebook' || activeFilter === 'Instagram') {
        if (platform !== activeFilter) return false;
      } else if (activeFilter === 'owned' && item.owned !== true) return false;
      else if (activeFilter === 'external' && item.owned !== false) return false;

      if (!query) return true;
      const haystack = [item.title,item.platform,...(item.audience_reactions || [])].join(' ').toLocaleLowerCase(locale);
      return haystack.includes(query);
    });
  }

  function render() {
    const visible = visibleRecords();
    grid.replaceChildren();
    if (!visible.length) {
      grid.append(create('p','public-voice-empty',c.noResults));
    } else {
      visible.forEach(item => grid.append(makeCard(item)));
    }
    const excerpts = visible.reduce((sum,item)=>sum + (item.audience_reactions?.length || 0),0);
    if (status) status.textContent = c.status(excerpts,visible.length);
  }

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.voicesFilter || 'all';
      filterButtons.forEach(item => {
        const active = item === button;
        item.classList.toggle('active',active);
        item.setAttribute('aria-pressed',String(active));
      });
      render();
    });
  });
  search?.addEventListener('input',render);

  fetch('/knowledge/social-corpus-20260918.json',{cache:'no-store'})
    .then(response => {
      if (!response.ok) throw new Error('Public comment corpus unavailable: ' + response.status);
      return response.json();
    })
    .then(data => {
      const all = Array.isArray(data.moments) ? data.moments : [];
      records = all
        .filter(item => item && item.id && !withheldRecordIds.has(item.id) && item.url &&
          Array.isArray(item.audience_reactions) && item.audience_reactions.length > 0)
        .sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')));
      const excerpts = records.reduce((sum,item)=>sum + item.audience_reactions.length,0);
      const platforms = new Set(records.map(item=>item.platform).filter(Boolean));
      if (excerptCount) excerptCount.textContent = excerpts.toLocaleString(locale);
      if (threadCount) threadCount.textContent = records.length.toLocaleString(locale);
      if (platformCount) platformCount.textContent = platforms.size.toLocaleString(locale);
      render();
    })
    .catch(() => {
      if (status) status.textContent = lang === 'he'
        ? 'הארכיון החי לא נטען כרגע. קטעי המקור שכבר מופיעים כאן נשארים זמינים; אפשר לפתוח כל פרסום ישירות.'
        : c.status(25,8);
      // Keep the source-linked static fallback in the page if the JSON endpoint is unavailable.
    });
})();
