(() => {
  const current = document.currentScript;
  const origin = 'https://7ya.io';
  const height = current?.dataset?.height || '760';
  const title = current?.dataset?.title || '7YA Social Signal Wall';
  const frame = document.createElement('iframe');

  frame.src = `${origin}/social/?embed=1`;
  frame.title = title;
  frame.loading = 'lazy';
  frame.referrerPolicy = 'strict-origin-when-cross-origin';
  frame.style.width = current?.dataset?.width || '100%';
  frame.style.height = String(height).match(/^\d+$/) ? `${height}px` : height;
  frame.style.border = '0';
  frame.style.borderRadius = current?.dataset?.radius || '24px';
  frame.style.overflow = 'hidden';
  frame.style.background = 'transparent';

  const mountId = current?.dataset?.mount;
  const mount = mountId ? document.getElementById(mountId) : current?.parentElement;
  if (mount) mount.appendChild(frame);

  window.SevenYASocialEmbed = window.SevenYASocialEmbed || {};
  window.SevenYASocialEmbed.mount = (selector, options = {}) => {
    const target = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!target) return null;
    const next = frame.cloneNode(false);
    next.style.height = options.height || frame.style.height;
    next.title = options.title || title;
    target.appendChild(next);
    return next;
  };
})();
