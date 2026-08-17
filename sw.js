const CACHE_VERSION = '7ya-shell-20260817-brand-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGE_CACHE = `${CACHE_VERSION}-pages`;
const OFFLINE_URL = '/';

const PRECACHE = [
  '/',
  '/igor-vepretski/',
  '/journey/',
  '/starton/',
  '/evidence/',
  '/control/',
  '/site.webmanifest',
  '/favicon.svg',
  '/assets/7ya-app-icon.svg',
  '/assets/7ya-app-icon-180.png',
  '/assets/7ya-app-icon-192.png',
  '/assets/7ya-app-icon-512.png',
  '/assets/7ya-app-icon-maskable-512.png',
  '/styles/7ya-page-upgrade-20260726.css',
  '/styles/7ya-control-layer-20260726.css',
  '/styles/7ya-control-page-20260726.css',
  '/scripts/7ya-control-layer-20260726.js',
  '/scripts/7ya-control-page-20260726.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => !key.startsWith(CACHE_VERSION)).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(request) {
  const cache = await caches.open(PAGE_CACHE);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) || (await caches.match(OFFLINE_URL));
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  const network = fetch(request)
    .then(response => {
      if (response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  return cached || network || Response.error();
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname === '/release.json' || url.pathname.startsWith('/api/health')) {
    event.respondWith(fetch(request, { cache: 'no-store' }).catch(() => new Response(JSON.stringify({ status: 'OFFLINE' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json; charset=utf-8' }
    })));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  if (['style', 'script', 'image', 'font', 'manifest'].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request));
  }
});

self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data?.type === 'CLEAR_7YA_CACHE') {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('7ya-')).map(key => caches.delete(key)))));
  }
});