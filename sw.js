const C='flashi-20260928143449';
const F=["./", "./index.html", "./delivery.html", "./delivery.webmanifest", "./delivery-192.png", "./delivery-512.png", "./delivery-apple.png", "./eats.html", "./eats.webmanifest", "./eats-192.png", "./eats-512.png", "./eats-apple.png"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));});
