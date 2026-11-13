/* Guarda toda la app en el celular para que funcione sin conexión.
   Si se cambia algún archivo, subir el número de VERSION para que los celulares se actualicen
   (abrir la app con internet, cerrarla del todo y volver a abrirla). */
const VERSION = 'flashi-maria-v6';
const ASSETS = [
  './', 'index.html', 'manifest.webmanifest',
  'css/app.css', 'css/flashi.css', 'css/chat.css', 'css/portal.css',
  'js/config.js', 'js/core.js', 'js/flashi.js', 'js/chat.js', 'js/portal.js', 'js/home.js', 'js/scenes.js',
  'fonts/unbounded-500.woff2', 'fonts/unbounded-700.woff2', 'fonts/unbounded-800.woff2',
  'fonts/manrope-400.woff2', 'fonts/manrope-500.woff2', 'fonts/manrope-600.woff2', 'fonts/manrope-700.woff2', 'fonts/manrope-800.woff2',
  'fonts/grand-hotel.woff2',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'icons/portal.png',
  'img/guardado/s-agenda.jpg', 'img/guardado/s-bebe.jpg', 'img/guardado/s-bilardo.jpg', 'img/guardado/s-budin.jpg', 'img/guardado/s-calabacines.jpg', 'img/guardado/s-esposo.jpg', 'img/guardado/s-historias.jpg', 'img/guardado/s-mate.jpg', 'img/guardado/s-pancitos.jpg', 'img/guardado/s-perro.jpg', 'img/guardado/s-piel.jpg', 'img/guardado/s-postres.jpg', 'img/guardado/s-tipografias.jpg', 'img/guardado/s-vitaminac.jpg', 'img/locales/timmys.png', 'img/locales/giandutti.jpg'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith('flashi-maria') && k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok && new URL(e.request.url).origin === location.origin) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match('index.html')))
  );
});
