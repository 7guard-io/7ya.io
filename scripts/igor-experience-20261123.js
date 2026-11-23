(() => {
  'use strict';
  const body = document.body;
  if (!body || !body.classList.contains('home-page')) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.createElement('div');
  progress.className = 'igor-progress';
  progress.setAttribute('aria-hidden', 'true');
  const fill = document.createElement('span');
  progress.append(fill);
  body.prepend(progress);

  const sections = [...document.querySelectorAll('main > section')];
  sections.forEach((section, index) => {
    if (index > 0 && !section.classList.contains('hero')) section.classList.add('igor-reveal');
  });
  body.classList.add('igor-motion-ready');

  let ticking = false;
  const update = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const ratio = Math.min(1, Math.max(0, window.scrollY / max));
    fill.style.transform = 'scaleX(' + ratio + ')';
    ticking = false;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    sections.forEach(section => {
      if (section.classList.contains('igor-reveal')) observer.observe(section);
    });
  } else {
    sections.forEach(section => section.classList.add('is-visible'));
  }

  // Keep mobile navigation usable without replacing the existing menu behavior.
  const menu = document.querySelector('.topbar .menu');
  const nav = document.querySelector('.topbar .nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(open));
      nav.classList.toggle('igor-mobile-open', open);
      document.body.classList.toggle('igor-menu-open', open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('igor-mobile-open');
      menu.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('igor-menu-open');
    }));
  }
  if (!reducedMotion) {
    const hero = document.querySelector('.hero .portrait img');
    if (hero && window.matchMedia('(min-width: 681px)').matches) {
      window.addEventListener('scroll', () => {
        if (window.scrollY < window.innerHeight) {
          hero.style.transform = 'translateY(' + (window.scrollY * 0.035) + 'px) scale(1.015)';
        }
      }, { passive: true });
    }
  }
})();
