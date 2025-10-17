const CACHE_NAME = "anthony-sere-v5";
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./assets/app.js",
  "./manifest.json",
  "./anthonysere.vcf",
  "./assets/favicon.png",
  "./assets/anthony-sere.webp",
  "./assets/terra-solaire.webp",
  "./assets/qrcode.webp",
  "./assets/bootstrap.min.css",
  "./assets/bootstrap-icons.css",
  "./assets/bootstrap.min.js",
  "./assets/icon-512.webp",
  "./assets/ico-180.webp",
  "./assets/bootstrap.min.css",
  "./assets/bootstrap-icons.css",
  "./assets/bootstrap.min.js",
];

const EXTERNAL_CACHE = [
  "https://cdn.jsdelivr.net/gh/cnumr/ecoindex_badge@3/assets/js/ecoindex-badge.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE).then(() => {
        return cache.addAll(EXTERNAL_CACHE).catch(err => {
          console.log("Erreur cache externe:", err);
          return Promise.resolve();
        });
      }).catch(err => {
        console.log("Erreur cache local:", err);
        return Promise.resolve();
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      
      return fetch(event.request).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
        
        return new Response('', {
          status: 404,
          statusText: 'Not Found'
        });
      });
    })
  );
});