const CACHE_NAME = 'snackkribo-v2.0';
const ASSETS = [
  '/',
  '/index.html',
  '/shop.html',
  '/login.html',
  '/affiliate.html',
  '/admin/index.html',
  '/css/landing.css',
  '/css/shop.css',
  '/css/admin.css',
  '/js/app.js',
  '/js/admin.js',
  '/js/data.js',
  '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith('http')) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res && res.status === 200 && res.type === 'basic') {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      }
      return res;
    }).catch(() => {
      return caches.match(e.request).then(cached => {
        if (cached) return cached;
        if (e.request.destination === 'document' || e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
