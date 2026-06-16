const CACHE_NAME = 'trainer-ultrafit-cache-v2';
const urlsToCache = [
  '/trainer.html',
  '/trainer.css',
  '/trainer.js',
  '/trainer-ultrafit-logo.png',
  '/index.css',
  '/UltraFit logo.png'
];

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});