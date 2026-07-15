(() => {
  'use strict';

  const chapters = [...document.querySelectorAll('[data-story-chapter]')];
  const navButtons = [...document.querySelectorAll('[data-story-jump]')];
  const storyProgress = document.querySelector('#infostoryProgress');

  const activateChapter = id => {
    chapters.forEach(chapter => chapter.classList.toggle('is-active', chapter.id === id));
    navButtons.forEach(button => button.classList.toggle('is-active', button.dataset.storyJump === id));
  };

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.getElementById(button.dataset.storyJump)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activateChapter(visible.target.id);
    }, { threshold: [0.35, 0.55, 0.75] });
    chapters.forEach(chapter => observer.observe(chapter));
  }

  const updateStoryProgress = () => {
    if (!storyProgress || !chapters.length) return;
    const start = chapters[0].offsetTop;
    const end = chapters.at(-1).offsetTop + chapters.at(-1).offsetHeight - innerHeight;
    const ratio = Math.max(0, Math.min(1, (scrollY - start) / Math.max(1, end - start)));
    storyProgress.style.transform = `scaleX(${ratio})`;
  };
  addEventListener('scroll', updateStoryProgress, { passive: true });
  addEventListener('resize', updateStoryProgress);
  updateStoryProgress();

  const launcher = document.querySelector('#companionLauncher');
  const panel = document.querySelector('#companionPanel');
  const closeButton = document.querySelector('#companionClose');
  const form = document.querySelector('#companionForm');
  const input = document.querySelector('#companionInput');
  const log = document.querySelector('#companionLog');
  const quickPrompts = [...document.querySelectorAll('[data-companion-prompt]')];

  const openPanel = () => {
    if (!panel) return;
    panel.hidden = false;
    panel.classList.add('is-open');
    launcher?.setAttribute('aria-expanded', 'true');
    setTimeout(() => input?.focus(), 120);
  };

  const closePanel = () => {
    if (!panel) return;
    panel.classList.remove('is-open');
    launcher?.setAttribute('aria-expanded', 'false');
    setTimeout(() => { panel.hidden = true; }, 220);
  };

  launcher?.addEventListener('click', () => panel?.hidden ? openPanel() : closePanel());
  closeButton?.addEventListener('click', closePanel);
  addEventListener('keydown', event => { if (event.key === 'Escape' && panel && !panel.hidden) closePanel(); });

  const escapeHtml = value => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const addMessage = (role, html) => {
    if (!log) return;
    const article = document.createElement('article');
    article.className = `companion-message ${role}`;
    article.innerHTML = html;
    log.append(article);
    log.scrollTop = log.scrollHeight;
  };

  const detectMode = text => {
    const value = text.toLowerCase();
    if (/פוסט|כתוב|כתיבה|caption|linkedin|facebook/.test(value)) return 'post';
    if (/וידאו|סרטון|reel|tiktok|youtube/.test(value)) return 'video';
    if (/פחד|מפחד|ביקורת|תקוע|מחסום/.test(value)) return 'block';
    if (/מטרה|שבוע|יעד|תכנית|תוכנית/.test(value)) return 'goal';
    if (/מיזם|קהילה|פרויקט|עשייה|לעזור/.test(value)) return 'project';
    if (/מוזיקה|שיר|אמנות|עיצוב/.test(value)) return 'creative';
    return 'clarity';
  };

  const firstSentence = text => text.split(/[.!?\n]/).map(part => part.trim()).find(Boolean)?.slice(0, 160) || 'הרעיון שחשוב לך עכשיו';

  const responseFor = text => {
    const mode = detectMode(text);
    const core = firstSentence(text);
    const plans = {
      post: {
        message: 'יש כאן רעיון שיכול לעבוד, אבל הוא צריך משפט אחד ברור לפני שהוא צריך עיצוב.',
        output: `פתח אפשרי: “${core} — וזה מה שלמדתי כשניסיתי להפוך מחשבה לפעולה.”`,
        action: 'כתוב שלוש שורות: מה קרה, מה הבנת, ומה הקורא יכול לעשות היום.'
      },
      video: {
        message: 'הסרטון לא צריך להיות גדול. הוא צריך לפתוח מתח אמיתי בתוך שלוש שניות.',
        output: `Hook: “${core} — אבל החלק שאף אחד לא מספר הוא מה קורה רגע אחרי.”`,
        action: 'צלם גרסה אחת של 25 שניות: Hook, דוגמה אחת, פעולה אחת.'
      },
      block: {
        message: 'המחסום אינו סימן לעצור. הוא סימן להקטין את הסיכון ולפרסם גרסה מדויקת יותר.',
        output: 'גרסת ניסוי: שתף אמת אחת בלי להסביר את כל החיים ובלי לבקש אישור מהקהל.',
        action: 'כתוב טיוטה שלא תפורסם, קרא אותה בקול, ומחק רק את המשפטים שאינם אמת.'
      },
      goal: {
        message: 'מטרה טובה היא תוצאה שאפשר לראות, לא מצב רוח שאי אפשר למדוד.',
        output: `מטרת שבוע: להפוך את “${core}” לנכס אחד גמור ולשתי גרסאות הפצה.`,
        action: 'קבע בלוק של 45 דקות היום: 20 דקות יצירה, 15 דקות עריכה, 10 דקות פרסום.'
      },
      project: {
        message: 'כדי להפוך רצון לעזור למיזם, צריך לבחור אדם אחד, כאב אחד וניסוי אחד.',
        output: `ניסוי 7 ימים: קהל מוגדר → בעיה אחת → פעולה קטנה → משוב מתועד.`,
        action: 'דבר היום עם שלושה אנשים מהקהל לפני שאתה בונה פתרון.'
      },
      creative: {
        message: 'יצירה חזקה מחזיקה רגש אחד ברור ומסגרת שמאפשרת לסיים.',
        output: `כיוון יצירתי: קח את “${core}” והפוך אותו לניגוד — לפני/אחרי, חושך/אור, פחד/תנועה.`,
        action: 'בחר מדיום אחד בלבד והשלם סקיצה של 30 דקות בלי לשפר תוך כדי.'
      },
      clarity: {
        message: 'אני שומע שיש כאן חומר, אבל עדיין לא החלטת מה חשוב יותר: לבטא, לשנות או לבנות.',
        output: `מסר ליבה זמני: “${core}”. עכשיו צריך לבחור למי זה מיועד ומה אתה רוצה שיקרה אחר כך.`,
        action: 'ענה לעצמך בשתי מילים: למי? ומה הצעד הבא?'
      }
    };
    return plans[mode];
  };

  const submitPrompt = value => {
    const text = value.trim();
    if (!text) return;
    addMessage('user', `<p>${escapeHtml(text)}</p>`);
    const answer = responseFor(text);
    addMessage('assistant', `
      <span>7YA CREATOR COMPANION</span>
      <p><b>מה אני שומע:</b> ${escapeHtml(answer.message)}</p>
      <p><b>כיוון:</b> ${escapeHtml(answer.output)}</p>
      <p><b>הצעד הבא:</b> ${escapeHtml(answer.action)}</p>
      <a href="/create/">פתחו מסלול מלא ב־7YA Create →</a>
    `);
  };

  quickPrompts.forEach(button => {
    button.addEventListener('click', () => {
      openPanel();
      submitPrompt(button.dataset.companionPrompt || button.textContent || '');
    });
  });

  form?.addEventListener('submit', event => {
    event.preventDefault();
    submitPrompt(input?.value || '');
    if (input) input.value = '';
  });
})();
