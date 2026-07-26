(() => {
  'use strict';

  const state = {
    installPrompt: null,
    release: null,
    paletteOpen: false,
    lastFocus: null,
  };

  const routes = [
    { label: 'בית', detail: 'הבית הציבורי של 7YA', url: '/', keywords: 'home ראשי' },
    { label: 'איגור ופרצקי', detail: 'זהות ציבורית קנונית', url: '/igor-vepretski/', keywords: 'igor person אדם' },
    { label: 'המסע', detail: 'שבעה פרקים ומקורות', url: '/journey/', keywords: 'story מסלול חיים' },
    { label: 'StartOn', detail: 'המשימה החברתית', url: '/starton/', keywords: 'youth נוער mission' },
    { label: 'מפת השפעה', detail: 'מדיה, כתיבה והפצה', url: '/influence/', keywords: 'media social' },
    { label: 'ארכיון ראיות', detail: 'מקורות, תאריכים ואימות', url: '/evidence/', keywords: 'proof evidence verify' },
    { label: 'Control', detail: 'מצב אתר, מסלולים וגרסה', url: '/control/', keywords: 'status health release ניהול' },
    { label: 'לתיאום שיחה', detail: 'שותפות, במה או פרויקט', url: '/contact/', keywords: 'contact שיחה partnership' },
  ];

  const actionDefinitions = [
    { id: 'share', label: 'שיתוף העמוד', detail: 'פתיחת שיתוף מערכת או העתקת קישור', keywords: 'share copy', run: sharePage },
    { id: 'copy', label: 'העתקת קישור', detail: 'העתקת כתובת העמוד הנוכחי', keywords: 'clipboard url', run: copyCurrentUrl },
    { id: 'install', label: 'התקנת 7YA', detail: 'הוספה למסך הבית כאפליקציה', keywords: 'pwa app install', run: installApp },
    { id: 'control', label: 'פתיחת Control', detail: 'בדיקות תקינות ומצב גרסה', keywords: 'admin status health', run: () => navigate('/control/') },
  ];

  function track(name, params = {}) {
    window.dispatchEvent(new CustomEvent('7ya:interaction', { detail: { name, ...params } }));
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  function navigate(url) {
    track('control_navigate', { destination: url });
    window.location.assign(url);
  }

  async function copyCurrentUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast('הקישור הועתק');
      track('copy_link');
    } catch {
      window.prompt('העתקת קישור', window.location.href);
    }
    closePalette();
  }

  async function sharePage() {
    const data = { title: document.title, text: document.querySelector('meta[name="description"]')?.content || document.title, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(data);
        track('native_share');
      } else {
        await copyCurrentUrl();
      }
    } catch (error) {
      if (error?.name !== 'AbortError') await copyCurrentUrl();
    }
    closePalette();
  }

  async function installApp() {
    if (state.installPrompt) {
      state.installPrompt.prompt();
      const result = await state.installPrompt.userChoice;
      track('pwa_install_choice', { outcome: result.outcome });
      state.installPrompt = null;
      updateInstallButtons();
    } else {
      toast(/iphone|ipad|ipod/i.test(navigator.userAgent) ? 'ב־iPhone: שיתוף ← הוסף למסך הבית' : 'ההתקנה זמינה דרך תפריט הדפדפן');
    }
    closePalette();
  }

  function toast(message) {
    let node = document.querySelector('.control-toast');
    if (!node) {
      node = document.createElement('div');
      node.className = 'control-toast';
      node.setAttribute('role', 'status');
      document.body.append(node);
    }
    node.textContent = message;
    node.classList.add('is-visible');
    clearTimeout(node._hideTimer);
    node._hideTimer = setTimeout(() => node.classList.remove('is-visible'), 2200);
  }

  function buildControlButton() {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'control-trigger';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'controlPalette');
    button.innerHTML = '<span class="control-trigger-dot" aria-hidden="true"></span><span>Control</span><kbd>⌘K</kbd>';
    button.addEventListener('click', openPalette);
    document.body.append(button);
  }

  function buildPalette() {
    const overlay = document.createElement('div');
    overlay.className = 'control-palette-shell';
    overlay.id = 'controlPalette';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="control-palette-backdrop" data-close-control></div>
      <section class="control-palette" role="dialog" aria-modal="true" aria-labelledby="controlPaletteTitle">
        <header>
          <div><small>7YA COMMAND PALETTE</small><h2 id="controlPaletteTitle">לאן ממשיכים?</h2></div>
          <button type="button" class="control-close" data-close-control aria-label="סגירה">×</button>
        </header>
        <label class="control-search">
          <span class="sr-only">חיפוש פקודה או עמוד</span>
          <input id="controlSearch" type="search" inputmode="search" autocomplete="off" placeholder="חיפוש עמוד, פעולה או כלי…">
          <kbd>ESC</kbd>
        </label>
        <div class="control-results" id="controlResults" role="listbox"></div>
        <footer><span id="controlRelease">בודק גרסה…</span><span>↑↓ ניווט · Enter פתיחה</span></footer>
      </section>`;
    document.body.append(overlay);
    overlay.querySelectorAll('[data-close-control]').forEach(node => node.addEventListener('click', closePalette));
    const input = overlay.querySelector('#controlSearch');
    input.addEventListener('input', () => renderResults(input.value));
    input.addEventListener('keydown', onPaletteKeydown);
    renderResults('');
  }

  function commandItems(query = '') {
    const normalized = query.trim().toLocaleLowerCase('he');
    const routeItems = routes.map(item => ({
      type: 'route',
      label: item.label,
      detail: item.detail,
      search: `${item.label} ${item.detail} ${item.keywords}`.toLocaleLowerCase('he'),
      run: () => navigate(item.url),
    }));
    const actionItems = actionDefinitions.map(item => ({ ...item, type: 'action', search: `${item.label} ${item.detail} ${item.keywords}`.toLocaleLowerCase('he') }));
    return [...routeItems, ...actionItems]
      .filter(item => !normalized || item.search.includes(normalized))
      .filter(item => item.id !== 'install' || state.installPrompt || /iphone|ipad|ipod/i.test(navigator.userAgent));
  }

  function renderResults(query) {
    const container = document.querySelector('#controlResults');
    if (!container) return;
    const items = commandItems(query);
    container.replaceChildren();
    if (!items.length) {
      const empty = document.createElement('p');
      empty.className = 'control-empty';
      empty.textContent = 'לא נמצאה התאמה.';
      container.append(empty);
      return;
    }
    items.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'control-result';
      button.dataset.index = String(index);
      button.setAttribute('role', 'option');
      button.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      button.innerHTML = `<span class="control-result-icon" aria-hidden="true">${item.type === 'route' ? '↗' : '⚡'}</span><span><b>${escapeHtml(item.label)}</b><small>${escapeHtml(item.detail)}</small></span><kbd>Enter</kbd>`;
      button.addEventListener('click', item.run);
      container.append(button);
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
  }

  function onPaletteKeydown(event) {
    const results = [...document.querySelectorAll('.control-result')];
    if (!results.length) return;
    let current = results.findIndex(node => node.getAttribute('aria-selected') === 'true');
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      results[current]?.setAttribute('aria-selected', 'false');
      current = event.key === 'ArrowDown' ? (current + 1) % results.length : (current - 1 + results.length) % results.length;
      results[current].setAttribute('aria-selected', 'true');
      results[current].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter') {
      event.preventDefault();
      results[Math.max(current, 0)]?.click();
    }
  }

  function openPalette() {
    const shell = document.querySelector('#controlPalette');
    if (!shell || state.paletteOpen) return;
    state.lastFocus = document.activeElement;
    state.paletteOpen = true;
    shell.hidden = false;
    document.documentElement.classList.add('control-open');
    const input = shell.querySelector('#controlSearch');
    input.value = '';
    renderResults('');
    requestAnimationFrame(() => input.focus());
    track('command_palette_open');
  }

  function closePalette() {
    const shell = document.querySelector('#controlPalette');
    if (!shell || !state.paletteOpen) return;
    shell.hidden = true;
    state.paletteOpen = false;
    document.documentElement.classList.remove('control-open');
    state.lastFocus?.focus?.();
  }

  async function loadRelease() {
    try {
      const response = await fetch('/release.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`release ${response.status}`);
      state.release = await response.json();
      const label = document.querySelector('#controlRelease');
      if (label) label.textContent = `${state.release.status || 'UNKNOWN'} · ${state.release.release || 'release'}`;
      document.querySelector('.control-trigger-dot')?.classList.toggle('is-ready', state.release.status === 'READY');
    } catch {
      const label = document.querySelector('#controlRelease');
      if (label) label.textContent = navigator.onLine ? 'גרסה לא זמינה' : 'מצב לא מקוון';
    }
  }

  function updateInstallButtons() {
    document.documentElement.classList.toggle('pwa-installable', Boolean(state.installPrompt));
  }

  function registerServiceWorker() {
    if (!('serviceWorker' in navigator) || window.location.protocol !== 'https:') return;
    navigator.serviceWorker.register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .then(registration => registration.update())
      .catch(() => {});
  }

  function bindGlobalShortcuts() {
    window.addEventListener('keydown', event => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        state.paletteOpen ? closePalette() : openPalette();
      } else if (event.key === 'Escape' && state.paletteOpen) {
        closePalette();
      }
    });
    window.addEventListener('beforeinstallprompt', event => {
      event.preventDefault();
      state.installPrompt = event;
      updateInstallButtons();
    });
    window.addEventListener('appinstalled', () => {
      state.installPrompt = null;
      updateInstallButtons();
      toast('7YA הותקנה בהצלחה');
      track('pwa_installed');
    });
    window.addEventListener('online', () => toast('החיבור חזר'));
    window.addEventListener('offline', () => toast('מצב לא מקוון'));
  }

  function init() {
    buildControlButton();
    buildPalette();
    bindGlobalShortcuts();
    registerServiceWorker();
    loadRelease();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
