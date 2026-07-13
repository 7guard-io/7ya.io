const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#primary-nav');
if (menuButton && nav) {
  const closeMenu = () => { nav.dataset.open = 'false'; menuButton.setAttribute('aria-expanded', 'false'); };
  menuButton.addEventListener('click', () => { const next = nav.dataset.open !== 'true'; nav.dataset.open = String(next); menuButton.setAttribute('aria-expanded', String(next)); });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });
}
const retireLegacyCaches = async () => {
  const tasks = [];
  if ('serviceWorker' in navigator) tasks.push(navigator.serviceWorker.getRegistrations().then(items => Promise.all(items.map(item => item.unregister()))));
  if ('caches' in window) tasks.push(caches.keys().then(keys => Promise.all(keys.filter(key => key.includes('7ya-legacy')).map(key => caches.delete(key)))));
  await Promise.allSettled(tasks);
};
retireLegacyCaches();
