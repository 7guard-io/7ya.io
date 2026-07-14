(() => {
  document.documentElement.classList.add('js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const app = document.querySelector('#legacy-app');
  const datasetStatus = document.querySelector('#dataset-status');
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const number = new Intl.NumberFormat('en-US');

  function stars() {
    const canvas = document.querySelector('.stars');
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return () => {};
    let width = 0;
    let height = 0;
    let points = [];
    let frame = 0;
    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      const count = Math.min(200, Math.max(80, Math.round((width * height) / 9500)));
      points = Array.from({ length: count }, () => ({ x: Math.random() * width, y: Math.random() * height, r: Math.random() * 1.45 + 0.25, a: Math.random() * 0.7 + 0.15, speed: Math.random() * 0.07 + 0.015 }));
    };
    const draw = () => {
      context.clearRect(0, 0, width, height);
      points.forEach((point) => {
        point.y += point.speed;
        if (point.y > height + 3) point.y = -3;
        context.beginPath();
        context.fillStyle = `rgba(255,255,255,${point.a})`;
        context.arc(point.x, point.y, point.r, 0, Math.PI * 2);
        context.fill();
      });
      if (!reducedMotion) frame = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
    return () => cancelAnimationFrame(frame);
  }

  const stopStars = stars();

  function status(value) {
    const label = String(value || 'DOCUMENTED').replaceAll('_', '-');
    return `<span class="status" data-status="${esc(value)}">${esc(label)}</span>`;
  }

  function sectionHead(code, title, lead) {
    return `<div class="section-head" data-reveal><span class="section-code">${esc(code)}</span><div><h2>${esc(title)}</h2><p class="section-lead">${esc(lead)}</p></div></div>`;
  }

  function render(data) {
    const domains = (data.legacy_domains || []).map((item) => `<article class="legacy-card" data-theme="${esc(item.id)}" data-status="${esc(item.status)}" data-reveal>${status(item.status)}<h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p></article>`).join('');
    const timeline = (data.timeline || []).map((item) => `<article class="timeline-item" data-theme="${esc(item.theme)}" data-status="${esc(item.status)}" data-reveal><time>${esc(item.period)}</time><div><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p>${status(item.status)}</div></article>`).join('');
    const metrics = (data.influence_snapshot?.metrics || []).map((item) => `<article class="metric" data-reveal><b>${esc(number.format(item.value))}</b><span>${esc(item.label)}</span></article>`).join('');
    const stories = (data.public_story_atlas || []).map((item) => `<article class="story" data-theme="${esc(item.theme)}" data-status="${esc(item.status)}" data-reveal>${status(item.status)}<h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p></article>`).join('');
    const sources = (data.sources || []).map((item) => `<a class="source-row" href="${esc(item.url)}" rel="noopener noreferrer" data-reveal><span>${esc(item.status)}</span><span><strong>${esc(item.title)}</strong><small>${esc(item.publisher)}</small></span><em>OPEN SOURCE ↗</em></a>`).join('');
    const spaces = (data.starton?.three_space_model || []).map((item) => `<li>${esc(item)}</li>`).join('');
    const tracks = (data.starton?.creative_tech_pilot?.tracks || []).map((item) => `<li>${esc(item)}</li>`).join('');
    const governance = (data.starton?.creative_tech_pilot?.governance || []).map((item) => `<li>${esc(item)}</li>`).join('');
    const music = (data.music?.works || []).map((item) => `<article class="story" data-theme="music" data-status="DOCUMENTED" data-reveal>${status(item.status)}<h3>${esc(item.title)}</h3><p>${esc(data.music.rights_rule)}</p></article>`).join('');
    const privacy = (data.publication_policy?.privacy_rules || []).map((item) => `<li>${esc(item)}</li>`).join('');

    app.innerHTML = `
      <section id="map" class="section">${sectionHead('01 · LEGACY MAP', 'שמונה עולמות. מסלול אחד.', 'זהות, שירות, StartOn, אבהות, השפעה, השתתפות אזרחית, מוזיקה ומערכות 7YA — עם סטטוס ראיה ברור.')}
        <div class="legacy-search"><input id="legacy-search" type="search" placeholder="חיפוש במורשת: StartOn, שירות, אבהות, מוזיקה, AI…" aria-label="חיפוש במורשת"><span id="result-count">${domains.length} פריטי מורשת</span></div>
        <div class="filterbar" aria-label="סינון מורשת"><button class="active" type="button" data-filter="all">הכול</button><button type="button" data-filter="identity">זהות</button><button type="button" data-filter="service">שירות</button><button type="button" data-filter="starton">StartOn</button><button type="button" data-filter="fatherhood">אבהות</button><button type="button" data-filter="influence">השפעה</button><button type="button" data-filter="civic">אזרחי</button><button type="button" data-filter="music">מוזיקה</button><button type="button" data-filter="systems">7YA</button></div>
        <div class="legacy-grid">${domains}</div>
      </section>
      <section id="timeline" class="section">${sectionHead('02 · LIFELINE', 'מהגירה לבנייה.', 'ציר זמן שמפריד בין מקור ציבורי, תיאור עצמי, מערכת שנבנתה ושאיפה עתידית.')}<div class="timeline">${timeline}</div></section>
      <section id="influence" class="section">${sectionHead('03 · FORENSIC SNAPSHOT', 'השפעה — עם תאריך.', `Snapshot מ־${data.influence_snapshot?.as_of || '2026-06-08'}. המספרים אינם מונה חי ואינם טענה לכיסוי מלא של האינטרנט.`)}
        <div class="snapshot"><aside class="snapshot-intro" data-reveal>${status('DOCUMENTED')}<h3>Public Influence Index</h3><p>${esc(data.influence_snapshot?.warning)}</p><p>Facebook זוהה כשכבת הגברה חיצונית; TikTok כמנוע פרסום מתועד; LinkedIn כשכבת סמכות מקצועית. כל עדכון עתידי דורש רענון או צילום מצב מתוארך.</p></aside><div class="metrics">${metrics}</div></div>
      </section>
      <section class="section">${sectionHead('04 · PUBLIC STORY ATLAS', 'הסיפורים שחצו את הפיד.', 'סיפורים שהותירו עקבה ציבורית דרך כתבה, שיתוף חיצוני, שכפול או מעבר בין רשתות.')}<div class="story-grid">${stories}</div></section>
      <section id="starton" class="section">${sectionHead('05 · STARTON LEGACY', 'הסיפור האישי הופך לתשתית.', data.starton?.positioning || '')}
        <div class="starton-panel"><article class="model" data-reveal>${status('DOCUMENTED')}<h3>שלושה מרחבים</h3><ul class="space-list">${spaces}</ul></article><article class="pilot" data-reveal>${status('PILOT_DESIGN')}<h3>Creative Tech Hub</h3><div class="pilot-meta"><span>${esc(data.starton?.creative_tech_pilot?.duration)}</span><span>TARGET ${esc(data.starton?.creative_tech_pilot?.target_scale)}</span><span>4 LABS</span><span>DEMO + REPORT</span></div><ul class="track-list">${tracks}</ul><h4>Governance promise</h4><ul class="governance-list">${governance}</ul></article></div>
      </section>
      <section class="section">${sectionHead('06 · MUSIC & CULTURE', 'הקול הוא גם מסמך.', data.music?.label || 'Music and creative work by Igor Vepretski.')}<div class="story-grid">${music}</div></section>
      <section id="sources" class="section">${sectionHead('07 · SOURCE ATLAS', 'המקור לפני האגדה.', 'כל עוגן ציבורי תומך רק במה שהוא באמת מוכיח. מקור תקשורתי אינו תחליף למסמך מוסדי, וקישור אינו הוכחת היקף.')}<div class="source-atlas">${sources}<a class="source-row" href="/knowledge/igor-vepretski-legacy.json"><span>OPEN DATA</span><span><strong>Legacy JSON</strong><small>ציר זמן, סטטוסים, Snapshot, פרטיות ומקורות</small></span><em>STRUCTURED DATA ↗</em></a></div></section>
      <section class="section"><div class="privacy" data-reveal><div><span class="section-code">08 · PRIVACY IS LEGACY</span><h3>מה שלא מפרסמים חשוב לא פחות.</h3><p class="section-lead">מורשת ציבורית אינה רישיון לחשוף משפחה, קטינים או מידע רגיש.</p></div><ul class="privacy-list">${privacy}</ul></div></section>`;

    datasetStatus.textContent = `${data.timeline?.length || 0} תחנות · ${data.legacy_domains?.length || 0} תחומי מורשת · ${data.sources?.length || 0} מקורות ציבוריים`;
    bindFilters();
    bindReveals();
  }

  function bindFilters() {
    const buttons = document.querySelectorAll('[data-filter]');
    const cards = document.querySelectorAll('#map [data-theme]');
    const search = document.querySelector('#legacy-search');
    const count = document.querySelector('#result-count');
    let active = 'all';
    const apply = () => {
      const query = (search?.value || '').trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const theme = card.dataset.theme || '';
        const haystack = `${card.textContent} ${theme} ${card.dataset.status || ''}`.toLowerCase();
        const show = (active === 'all' || theme === active) && (!query || haystack.includes(query));
        card.classList.toggle('hidden', !show);
        if (show) visible += 1;
      });
      if (count) count.textContent = `${visible} פריטי מורשת`;
    };
    buttons.forEach((button) => button.addEventListener('click', () => {
      active = button.dataset.filter || 'all';
      buttons.forEach((candidate) => candidate.classList.toggle('active', candidate === button));
      apply();
    }));
    search?.addEventListener('input', apply);
    apply();
  }

  function bindReveals() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window) || reducedMotion) {
      elements.forEach((element) => element.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }), { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    elements.forEach((element) => observer.observe(element));
  }

  fetch('/knowledge/igor-vepretski-legacy.json', { headers: { Accept: 'application/json' } })
    .then((response) => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(render)
    .catch((error) => {
      datasetStatus.textContent = 'שכבת המורשת המובנית לא נטענה.';
      app.innerHTML = `<section class="section"><div class="privacy"><div><span class="section-code">DATA LAYER UNAVAILABLE</span><h3>העמוד נשאר בטוח.</h3><p class="section-lead">לא נטען תוכן חלופי שאינו מגובה במקור.</p></div><ul class="privacy-list"><li>${esc(error.message)}</li><li><a href="/evidence/">עברו ל־Evidence Wall</a></li></ul></div></section>`;
    });

  bindReveals();
  window.addEventListener('beforeunload', stopStars);
})();
