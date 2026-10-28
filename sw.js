// Offline support. Network first (so updates show up as soon as the tablet is online), cache as the fallback.
// Bump CACHE when you add or remove files in PRECACHE.
const CACHE = 'pmm-v1';
const PRECACHE = [
  './', 'index.html', 'manifest.webmanifest', 'css/app.css', 'fonts/fredoka-latin-wght-normal.woff2',
  'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'audio/voice/manifest.json',
  'js/main.js', 'js/router.js', 'js/store.js', 'js/audio.js', 'js/data.js', 'js/ui.js', 'js/pet.js', 'js/color.js',
  'js/art/shapes.js', 'js/art/species.js', 'js/art/hair.js', 'js/art/items.js', 'js/art/stickers.js',
  'js/steps/hint.js', 'js/steps/bath.js', 'js/steps/brush.js', 'js/steps/panels.js',
  'js/screens/home.js', 'js/screens/pick.js', 'js/screens/parent.js', 'js/screens/makeover.js',
  'js/screens/showoff.js', 'js/screens/meadow.js', 'js/screens/coloring.js', 'js/screens/stickers.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match('index.html')))
  );
});
