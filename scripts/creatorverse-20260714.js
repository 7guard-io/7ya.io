(() => {
  document.documentElement.classList.add('js');

  const canvas = document.querySelector('.cosmos');
  const context = canvas?.getContext('2d');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];
  let width = 0;
  let height = 0;
  let frame = 0;

  function resizeCanvas() {
    if (!canvas || !context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(220, Math.max(90, Math.round((width * height) / 8500)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5 + 0.2,
      alpha: Math.random() * 0.75 + 0.16,
      speed: Math.random() * 0.08 + 0.02,
      drift: (Math.random() - 0.5) * 0.08,
    }));
  }

  function drawStars() {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    stars.forEach((star) => {
      star.y += star.speed;
      star.x += star.drift;
      if (star.y > height + 3) star.y = -3;
      if (star.x > width + 3) star.x = -3;
      if (star.x < -3) star.x = width + 3;
      context.beginPath();
      context.fillStyle = `rgba(255,255,255,${star.alpha})`;
      context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      context.fill();
    });
    if (!reducedMotion) frame = requestAnimationFrame(drawStars);
  }

  if (canvas && context) {
    resizeCanvas();
    drawStars();
    window.addEventListener('resize', resizeCanvas, { passive: true });
  }

  const nav = document.querySelector('.nav');
  if (nav && !nav.querySelector('a[href="/legacy/"]')) {
    const legacyLink = document.createElement('a');
    legacyLink.href = '/legacy/';
    legacyLink.textContent = 'מורשת';
    nav.insertBefore(legacyLink, nav.querySelector('.ai-nav'));
  }

  const constellation = document.querySelector('.constellations');
  if (constellation && !constellation.querySelector('[data-legacy-entry]')) {
    const legacyCard = document.createElement('article');
    legacyCard.className = 'creation-card';
    legacyCard.dataset.legacyEntry = 'true';
    legacyCard.dataset.reveal = '';
    legacyCard.style.setProperty('--glow', 'rgba(243,209,138,.32)');
    legacyCard.innerHTML = '<div class="num"><span>LIVING LEGACY</span><b>07</b></div><h3>Legacy Universe</h3><p>ציר הזמן, השירות, StartOn, אבהות, השפעה, מוזיקה, מערכות ומפת המקורות — עם סטטוס ראיה לכל פריט.</p><a href="/legacy/">למורשת המלאה →</a>';
    constellation.append(legacyCard);
  }

  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.1 });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('visible'));
  }

  const form = document.querySelector('.agent-form');
  const input = form?.querySelector('input');
  const log = document.querySelector('.console-log');

  function addMessage(text, type = 'bot') {
    if (!log) return null;
    const message = document.createElement('div');
    message.className = `console-msg ${type}`;
    message.textContent = text;
    log.append(message);
    log.scrollTop = log.scrollHeight;
    return message;
  }

  function addLinks(links) {
    if (!log || !Array.isArray(links) || links.length === 0) return;
    const row = document.createElement('div');
    row.className = 'console-links';
    links.slice(0, 4).forEach((item) => {
      const anchor = document.createElement('a');
      anchor.href = item.href;
      anchor.textContent = item.label;
      row.append(anchor);
    });
    log.append(row);
    log.scrollTop = log.scrollHeight;
  }

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = input?.value.trim();
    if (!text || !input) return;

    addMessage(text, 'user');
    input.value = '';
    input.disabled = true;
    const waiting = addMessage('מועצת הסוכנים מנתחת את הבקשה…');

    try {
      const response = await fetch('/api/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, path: location.pathname }),
      });
      const data = await response.json();
      waiting?.remove();
      addMessage(data.answer || 'לא התקבלה תשובה. נסו לנסח את השאלה מחדש.');
      addLinks(data.links);
    } catch {
      if (waiting) {
        waiting.textContent = 'החיבור לסוכנים אינו זמין כרגע. אפשר להמשיך דרך מפת היצירות, Legacy Universe וקיר הראיות.';
      }
    } finally {
      input.disabled = false;
      input.focus();
    }
  });

  document.querySelectorAll('[data-agent-prompt]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!input) return;
      input.value = button.dataset.agentPrompt || '';
      input.focus();
      document.querySelector('#agents')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  });

  window.addEventListener('beforeunload', () => cancelAnimationFrame(frame));
})();
