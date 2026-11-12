/* Service worker de la raíz: guarda la página de inicio y FLASHI EATS (Clara) para que funcionen sin conexión.
   El celular de María tiene el suyo propio en maria/sw.js (no se pisan).
   Si se cambia algún archivo de acá, subir la VERSION. */
const VERSION = 'flashi-eats-v2';
const ASSETS = ['./', './index.html', './eats.html', './eats.webmanifest', './eats-192.png', './eats-512.png', './eats-apple.png', './delivery.html'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  // Borra sólo las cachés viejas de la raíz; nunca las del celular de María (flashi-maria-*)
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('flashi') && !k.startsWith('flashi-maria') && k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  if (new URL(e.request.url).pathname.includes('/maria/')) return;   // eso lo maneja maria/sw.js
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request)));
});
