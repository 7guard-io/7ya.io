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
    const last = chapters.at(-1);
    const end = last.offsetTop + last.offsetHeight - innerHeight;
    const ratio = Math.max(0, Math.min(1, (scrollY - start) / Math.max(1, end - start)));
    storyProgress.style.transform = `scaleX(${ratio})`;
  };
  addEventListener('scroll', updateStoryProgress, { passive: true });
  addEventListener('resize', updateStoryProgress);
  updateStoryProgress();

  document.querySelector('#companionLauncher')?.remove();
  document.querySelector('#companionPanel')?.remove();

  let signalKeyPromise;
  const ensureSignalKey = () => {
    if (window.__7yaSignalKeyLoaded) return Promise.resolve();
    if (signalKeyPromise) return signalKeyPromise;

    if (!document.querySelector('link[data-7ya-signal-key-assets="20260715"]')) {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href = '/styles/7ya-signal-key-20260715.css';
      style.dataset.yaSignalKeyAssets = '20260715';
      document.head.append(style);
    }

    signalKeyPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-7ya-signal-key-assets="20260715"]');
      if (existing) {
        if (window.__7yaSignalKeyLoaded) resolve();
        else {
          existing.addEventListener('load', resolve, { once: true });
          existing.addEventListener('error', reject, { once: true });
        }
        return;
      }

      const script = document.createElement('script');
      script.src = '/scripts/7ya-signal-key-20260715.js';
      script.defer = true;
      script.dataset.yaSignalKeyAssets = '20260715';
      script.addEventListener('load', resolve, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.body.append(script);
    });

    return signalKeyPromise;
  };

  const openSignalKey = prompt => {
    const detail = { prompt: String(prompt || '').trim() };
    ensureSignalKey()
      .then(() => window.dispatchEvent(new CustomEvent('7ya:creator-seed', { detail })))
      .catch(error => console.warn('7YA Signal Key load failed', error));
  };

  document.querySelectorAll('[data-companion-prompt]').forEach(button => {
    button.addEventListener('click', () => {
      openSignalKey(button.dataset.companionPrompt || button.textContent || '');
    });
  });

  ensureSignalKey().catch(error => console.warn('7YA Signal Key preload failed', error));
})();
