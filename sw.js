// Service Worker for 高端養老客群人格匹配系統 PWA
const CACHE_NAME = 'laopo-match-v1';
const URLS_TO_CACHE = [
  '/match/',
  '/match/index.html',
  '/match/manifest.json',
  '/match/icon-192.png',
  '/match/icon-512.png',
  'https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@300;400;600;700&family=Cinzel:wght@400;600&display=swap'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE.filter(url => !url.startsWith('https://fonts')));
    }).catch(err => console.log('Cache install error:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => caches.match('/match/index.html'));
    })
  );
});
