/* SPLIT service worker — offline-capable app shell + font caching.

   Updates: the app's own files are NETWORK-first, so an online open always
   gets the latest deploy and the cache is only the offline fallback. (This
   used to be cache-first, which kept serving the old version until the
   worker updated *and* the page was reloaded again — and an installed
   home-screen app has no reload button.) When a new version of this worker
   takes over from an older one, it reloads the open app so the change shows
   straight away.

   Keep VERSION in step with APP_VERSION in js/app.js. */
const VERSION = 'split-v24';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;

/* App shell — paths are relative to the SW scope, so this works whether the
   app is served from a domain root or a GitHub Pages /project/ subpath. */
const SHELL_ASSETS = [
  './',
  './index.html',
  './css/styles.css',
  './js/exercises.js',
  './js/exercise-info.js',
  './js/scheduler.js',
  './js/app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png',
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

/* Precache straight from the network. Without cache:'reload' these go through
   the browser's HTTP cache, and GitHub Pages allows 10 minutes of that — enough
   for a new worker to store the previous deploy's files under the new name. */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL)
      .then((cache) => cache.addAll(SHELL_ASSETS.map((u) => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const stale = keys.filter((k) => !k.startsWith(VERSION));
    await Promise.all(stale.map((k) => caches.delete(k)));
    await self.clients.claim();
    // Old caches mean this is an upgrade rather than a first install: reload
    // the open app so it runs the new code instead of what it started with.
    if (stale.length) {
      const wins = await self.clients.matchAll({ type: 'window' });
      wins.forEach((w) => { try { w.navigate(w.url); } catch (e) { /* not navigable */ } });
    }
  })());
});

/* The app's files: network-first, cache as the offline fallback. Fonts and
   icons: cache-first — they don't change between deploys. */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req, RUNTIME));
    return;
  }

  if (url.origin === self.location.origin) {
    if (url.pathname.includes('/icons/')) { event.respondWith(cacheFirst(req, SHELL)); return; }
    event.respondWith(networkFirst(req, SHELL));
  }
});

/* Revalidate with the server (a cheap 304 when nothing changed), keep the
   cache current, and fall back to it when there's no connection.

   The response goes back to the page marked no-cache. GitHub Pages sends
   max-age=600, and with that the browser's in-memory cache treats a script
   as fresh for ten minutes and reuses it on the next load without asking
   this worker at all — so a deploy wouldn't show until it expired. */
async function networkFirst(request, cacheName) {
  try {
    const net = await fetch(request.url, { cache: 'no-cache', credentials: 'same-origin' });
    if (!net || !net.ok) return net;
    const headers = new Headers(net.headers);
    headers.set('Cache-Control', 'no-cache');
    const response = new Response(await net.blob(), { status: net.status, statusText: net.statusText, headers });
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
    return response;
  } catch (err) {
    const hit = await caches.match(request, { ignoreSearch: true });
    if (hit) return hit;
    if (request.mode === 'navigate') {
      const shell = await caches.match('./index.html');
      if (shell) return shell;
    }
    throw err;
  }
}

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
