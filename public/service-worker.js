const CACHE_NAME = 'ultrafit-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/diet.html',
  '/workout.html',
  '/members.html',
  '/shop.html',
  '/index.css',
  '/UltraFit logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});