const CACHE_NAME = 'admin-ultrafit-cache-v1';
const urlsToCache = [
  '/admin.html',
  '/admin.css',
  '/index.css',
  '/admin-ultrafit-logo.png'
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