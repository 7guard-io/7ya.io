const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const menuButton = $('.menu-toggle');
const nav = $('#museumNav');
if (menuButton && nav) {
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  $$('#museumNav a').forEach(link => link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }));
}

const progress = $('#readingProgress');
const updateProgress = () => {
  if (!progress) return;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const value = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
  progress.style.width = `${value}%`;
};
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

$$('img[data-fallback]').forEach(img => {
  img.addEventListener('error', () => {
    const fallback = img.dataset.fallback;
    if (fallback && img.src !== fallback) img.src = fallback;
  }, { once: true });
});

const filterButtons = $$('.filter-button');
const writingCards = $$('#writingGrid .archive-item');
const filterResult = $('#filterResult');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter || 'all';
    filterButtons.forEach(item => item.classList.toggle('active', item === button));
    let visible = 0;
    writingCards.forEach(card => {
      const match = filter === 'all' || (card.dataset.kind || '').split(' ').includes(filter);
      card.classList.toggle('hidden', !match);
      if (match) visible += 1;
    });
    if (filterResult) filterResult.textContent = `מוצגים ${visible} פריטי כתיבה.`;
  });
});

const navLinks = $$('#museumNav a[href^="#"]');
const sections = navLinks.map(link => $(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${visible.target.id}`));
  }, { rootMargin: '-25% 0px -65% 0px', threshold: [0, .15, .35] });
  sections.forEach(section => observer.observe(section));
}

const sourceRegistry = $('#sourceRegistry');
const sourceCount = $('#sourceCount');
const statusLabel = {
  verified: 'VERIFIED',
  public: 'PUBLIC',
  context: 'CONTEXT'
};

if (sourceRegistry) {
  fetch('/data/museum-sources.json', { headers: { Accept: 'application/json' } })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then(data => {
      const sources = Array.isArray(data.sources) ? data.sources : [];
      sourceRegistry.innerHTML = '';
      sources.forEach((source, index) => {
        const row = document.createElement('a');
        row.className = 'registry-row';
        row.href = source.url;
        row.target = '_blank';
        row.rel = 'noopener noreferrer';
        row.innerHTML = `
          <b>${String(index + 1).padStart(2, '0')}</b>
          <span class="registry-title"><strong>${escapeHtml(source.title)}</strong><small>${escapeHtml(source.domain)}</small></span>
          <span class="registry-type">${escapeHtml(source.type)}</span>
          <span class="registry-status ${escapeHtml(source.status)}">${statusLabel[source.status] || 'PUBLIC'}</span>`;
        sourceRegistry.appendChild(row);
      });
      if (sourceCount) sourceCount.textContent = `${sources.length} מקורות ציבוריים · עודכן ${data.updatedAt || '2026-07-10'}`;
    })
    .catch(error => {
      sourceRegistry.innerHTML = `<p class="registry-error">מרשם המקורות לא נטען (${escapeHtml(error.message)}). <a href="/data/museum-sources.json">פתיחת קובץ המקור</a></p>`;
      if (sourceCount) sourceCount.textContent = 'המרשם זמין כקובץ JSON';
    });
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

const year = $('#year');
if (year) year.textContent = String(new Date().getFullYear());
