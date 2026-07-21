/* SPLIT service worker — offline-capable app shell + font caching. */
const VERSION = 'split-v2';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

/* App shell — paths are relative to the SW scope, so this works whether the
   app is served from a domain root or a GitHub Pages /project/ subpath. */
const SHELL_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/exercises.js',
  './js/scheduler.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL).then((cache) => cache.addAll(SHELL_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

/* Cache-first, then network. Google Fonts are cached at runtime (opaque
   responses are fine to store). Navigations fall back to the cached shell. */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req, RUNTIME));
    return;
  }

  if (url.origin === self.location.origin) {
    if (req.mode === 'navigate') {
      event.respondWith(
        cacheFirst(req, SHELL).catch(() => caches.match('./index.html'))
      );
      return;
    }
    event.respondWith(cacheFirst(req, SHELL));
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  try {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  } catch (e) { /* opaque/uncacheable responses — ignore */ }
  return response;
}
