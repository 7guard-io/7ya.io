(() => {
  document.documentElement.classList.add('js');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.querySelector('.stars');
  const context = canvas?.getContext('2d');
  let width = 0;
  let height = 0;
  let stars = [];
  let frame = 0;

  function resize() {
    if (!canvas || !context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = Math.min(200, Math.max(80, Math.round((width * height) / 9500)));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.45 + 0.25,
      a: Math.random() * 0.7 + 0.15,
      speed: Math.random() * 0.07 + 0.015,
    }));
  }

  function draw() {
    if (!context) return;
    context.clearRect(0, 0, width, height);
    for (const star of stars) {
      star.y += star.speed;
      if (star.y > height + 3) star.y = -3;
      context.beginPath();
      context.fillStyle = `rgba(255,255,255,${star.a})`;
      context.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      context.fill();
    }
    if (!reducedMotion) frame = requestAnimationFrame(draw);
  }

  if (canvas && context) {
    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
  }

  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('visible'));
  }

  const filterButtons = document.querySelectorAll('[data-filter]');
  const cards = document.querySelectorAll('[data-theme]');
  const search = document.querySelector('#legacy-search');
  const resultCount = document.querySelector('#result-count');
  let activeFilter = 'all';

  function applyFilters() {
    const query = (search?.value || '').trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const theme = card.dataset.theme || '';
      const status = card.dataset.status || '';
      const haystack = `${card.textContent} ${theme} ${status}`.toLowerCase();
      const filterMatch = activeFilter === 'all' || theme === activeFilter || status === activeFilter;
      const queryMatch = !query || haystack.includes(query);
      const show = filterMatch && queryMatch;
      card.classList.toggle('hidden', !show);
      if (show) visible += 1;
    });
    if (resultCount) resultCount.textContent = `${visible} פריטי מורשת`;
  }

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      filterButtons.forEach((candidate) => candidate.classList.toggle('active', candidate === button));
      applyFilters();
    });
  });
  search?.addEventListener('input', applyFilters);
  applyFilters();

  const datasetStatus = document.querySelector('#dataset-status');
  fetch('/knowledge/igor-vepretski-legacy.json', { headers: { Accept: 'application/json' } })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!datasetStatus) return;
      const timeline = Array.isArray(data.timeline) ? data.timeline.length : 0;
      const sources = Array.isArray(data.sources) ? data.sources.length : 0;
      const domains = Array.isArray(data.legacy_domains) ? data.legacy_domains.length : 0;
      datasetStatus.textContent = `${timeline} תחנות · ${domains} תחומי מורשת · ${sources} מקורות ציבוריים`;
    })
    .catch(() => {
      if (datasetStatus) datasetStatus.textContent = 'העמוד זמין; שכבת הנתונים המובנית לא נטענה כרגע.';
    });

  window.addEventListener('beforeunload', () => cancelAnimationFrame(frame));
})();
