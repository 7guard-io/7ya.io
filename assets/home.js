const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');

if (menuButton && nav) {
  const closeMenu = () => {
    nav.dataset.open = 'false';
    menuButton.setAttribute('aria-expanded', 'false');
  };

  menuButton.addEventListener('click', () => {
    const next = nav.dataset.open !== 'true';
    nav.dataset.open = String(next);
    menuButton.setAttribute('aria-expanded', String(next));
  });

  nav.addEventListener('click', event => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeMenu();
  });
}

const revealItems = [...document.querySelectorAll('[data-reveal]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.14, rootMargin: '0px 0px -5% 0px' });

  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

const progress = document.querySelector('.scroll-progress span');
const updateProgress = () => {
  if (!progress) return;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
  progress.style.width = `${ratio * 100}%`;
};

updateProgress();
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);

const retireLegacyCaches = async () => {
  const tasks = [];
  if ('serviceWorker' in navigator) {
    tasks.push(navigator.serviceWorker.getRegistrations().then(items => Promise.all(items.map(item => item.unregister()))));
  }
  if ('caches' in window) {
    tasks.push(caches.keys().then(keys => Promise.all(keys.filter(key => key.includes('7ya-legacy')).map(key => caches.delete(key)))));
  }
  await Promise.allSettled(tasks);
};

retireLegacyCaches();
