(() => {
  'use strict';

  const chapters = [...document.querySelectorAll('[data-story-chapter]')];
  const navButtons = [...document.querySelectorAll('[data-story-jump]')];
  const storyProgress = document.querySelector('#infostoryProgress');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const visibility = new Map(chapters.map(chapter => [chapter.id, 0]));

  const activateChapter = id => {
    chapters.forEach(chapter => chapter.classList.toggle('is-active', chapter.id === id));
    navButtons.forEach(button => {
      const active = button.dataset.storyJump === id;
      button.classList.toggle('is-active', active);
      if (active) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
  };

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.storyJump || '');
      target?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => visibility.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      const active = [...visibility.entries()].sort((a, b) => b[1] - a[1])[0];
      if (active?.[1] > 0) activateChapter(active[0]);
    }, { threshold: [0, 0.2, 0.35, 0.55, 0.75] });
    chapters.forEach(chapter => observer.observe(chapter));
  } else if (chapters[0]) {
    activateChapter(chapters[0].id);
  }

  let progressFrame = 0;
  const updateStoryProgress = () => {
    progressFrame = 0;
    if (!storyProgress || !chapters.length) return;
    const start = chapters[0].offsetTop;
    const last = chapters.at(-1);
    const end = last.offsetTop + last.offsetHeight - window.innerHeight;
    const ratio = Math.max(0, Math.min(1, (window.scrollY - start) / Math.max(1, end - start)));
    storyProgress.style.transform = `scaleX(${ratio})`;
  };
  const scheduleProgress = () => {
    if (progressFrame) return;
    progressFrame = window.requestAnimationFrame(updateStoryProgress);
  };
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress);
  scheduleProgress();

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
      style.setAttribute('data-7ya-signal-key-assets', '20260715');
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
      script.async = false;
      script.setAttribute('data-7ya-signal-key-assets', '20260715');
      script.addEventListener('load', () => {
        if (window.__7yaSignalKeyLoaded) resolve();
        else reject(new Error('Signal Key loaded without initialization'));
      }, { once: true });
      script.addEventListener('error', reject, { once: true });
      document.body.append(script);
    }).catch(error => {
      signalKeyPromise = undefined;
      throw error;
    });

    return signalKeyPromise;
  };

  const openSignalKey = prompt => {
    const detail = { prompt: String(prompt || '').trim(), mode: 'create' };
    ensureSignalKey()
      .then(() => window.dispatchEvent(new CustomEvent('7ya:creator-seed', { detail })))
      .catch(error => {
        console.warn('7YA Signal Key load failed', error);
        window.location.assign('/create/');
      });
  };

  document.querySelectorAll('[data-companion-prompt]').forEach(button => {
    button.addEventListener('click', () => {
      openSignalKey(button.dataset.companionPrompt || button.textContent || '');
    });
  });

  ensureSignalKey().catch(error => console.warn('7YA Signal Key preload failed', error));
})();