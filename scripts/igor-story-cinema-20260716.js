(() => {
  'use strict';
  const progress = document.querySelector('#pageProgress');
  const topbar = document.querySelector('#topbar');
  const menuToggle = document.querySelector('#menuToggle');
  const mainNav = document.querySelector('#mainNav');
  const railLinks = [...document.querySelectorAll('[data-rail]')];
  const scenes = [...document.querySelectorAll('.scene[id]')];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const updatePage = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    progress?.style.setProperty('transform', `scaleX(${Math.min(1, Math.max(0, scrollY / max))})`);
    topbar?.classList.toggle('is-scrolled', scrollY > 24);
  };
  addEventListener('scroll', updatePage, { passive: true });
  addEventListener('resize', updatePage);
  updatePage();

  menuToggle?.addEventListener('click', () => {
    const open = !mainNav?.classList.contains('is-open');
    mainNav?.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    document.querySelectorAll('.reveal').forEach(node => revealObserver.observe(node));

    const sceneVisibility = new Map(scenes.map(scene => [scene.id, 0]));
    const sceneObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => sceneVisibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      const active = [...sceneVisibility.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
      if (!active) return;
      railLinks.forEach(link => link.classList.toggle('is-active', link.dataset.rail === active));
    }, { threshold: [0, .2, .35, .55, .75] });
    scenes.forEach(scene => sceneObserver.observe(scene));
  } else {
    document.querySelectorAll('.reveal').forEach(node => node.classList.add('is-visible'));
  }

  if (!reducedMotion) {
    const heroMedia = document.querySelector('.hero-media');
    addEventListener('scroll', () => {
      if (scrollY < innerHeight * 1.2 && heroMedia) heroMedia.style.transform = `scale(1.025) translateY(${scrollY * .08}px)`;
    }, { passive: true });
  }
})();
