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

  const openSignalKey = prompt => {
    const detail = { prompt: String(prompt || '').trim() };
    window.dispatchEvent(new CustomEvent('7ya:creator-seed', { detail }));
  };

  document.querySelectorAll('[data-companion-prompt]').forEach(button => {
    button.addEventListener('click', () => {
      openSignalKey(button.dataset.companionPrompt || button.textContent || '');
    });
  });
})();
