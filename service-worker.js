const CACHE_NAME = 'muscle-guide-v1';
const URLS_TO_CACHE = [
  'index.html',
  'workouts.html',
  'diet.html',
  'sleep.html',
  'body-factors.html',
  'myths-and-faqs.html',
  'style.css',
  'manifest.json',
  'icon-192.svg',
  'icon-512.svg',
  'back-exercises.png',
  'nutrition-infographic.png'
];

// Install: cache all pages
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate: delete old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
        return response;
      }).catch(() => caches.match('index.html'));
    })
  );
});
