(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const portrait = document.querySelector('.hero-portrait img');

  root.classList.add('js');

  requestAnimationFrame(() => {
    body.classList.add('is-loaded');
  });

  const revealSelectors = [
    '.section-head',
    '.journey-card',
    '.manifesto-quote',
    '.manifesto-copy',
    '.build-card',
    '.evidence-intro',
    '.evidence-item',
    '.stage-grid > *',
    '.social-grid a',
    '.contact-grid > *',
  ];

  const revealTargets = document.querySelectorAll(revealSelectors.join(','));
  revealTargets.forEach((element, index) => {
    element.dataset.reveal = '';
    element.style.setProperty('--reveal-delay', `${Math.min(index % 4, 3) * 70}ms`);
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '0px 0px -8% 0px',
        threshold: 0.12,
      },
    );

    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 18);
  };

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const precisePointer = window.matchMedia('(pointer: fine)').matches;

  if (hero && portrait && !reducedMotion && precisePointer) {
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));

      hero.style.setProperty('--pointer-x', `${Math.round(x * 100)}%`);
      hero.style.setProperty('--pointer-y', `${Math.round(y * 100)}%`);
      portrait.style.setProperty('--portrait-x', `${(x - 0.5) * -10}px`);
      portrait.style.setProperty('--portrait-y', `${(y - 0.5) * -7}px`);
    });

    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--pointer-x', '50%');
      hero.style.setProperty('--pointer-y', '42%');
      portrait.style.setProperty('--portrait-x', '0px');
      portrait.style.setProperty('--portrait-y', '0px');
    });
  }
})();
