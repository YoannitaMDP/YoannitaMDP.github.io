importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

const CACHE_NAME = "submission3ku";

if (workbox) {
  console.log(`Workbox berhasil dimuat`);
  workbox.precaching.precacheAndRoute([
    { url: '/', revision: '1' },
    { url: '/nav.html', revision: '1' },
    { url: '/index.html', revision: '1' },
    { url: '/detaildata.html', revision: '1' },
    { url: '/favicon.ico', revision: '1' },
    { url: '/manifest.json', revision: '1' },
    { url: '/assets/image/icon-512.png', revision: '1' },
    { url: '/assets/image/icon-192.png', revision: '1' },
    { url: '/assets/image/icon-152.png', revision: '1' },
    { url: '/assets/image/icon-128.png', revision: '1' },
    { url: '/assets/image/icon-96.png', revision: '1' },
    { url: '/assets/image/icon-72.png', revision: '1' },
    { url: '/css/materialize.min.css', revision: '1' },
    { url: '/push.js', revision: '1' },
    { url: '/js/materialize.min.js', revision: '1' },
    { url: '/js/api.js', revision: '1' },
    { url: '/js/db.js', revision: '1' },
    { url: '/js/idb.js', revision: '1' },
    { url: '/js/script.js', revision: '1' },
    { url: '/js/sw-register.js', revision: '1' },
    { url: '/js/sw-detail.js', revision: '1' },
    { url: '/pages/about.html', revision: '1' },
    { url: '/pages/contact.html', revision: '1' },
    { url: '/pages/favoritclub.html', revision: '1' },
    { url: '/pages/home.html', revision: '1' },
    { url: '/pages/jadwal.html', revision: '1' },
    { url: 'https://fonts.googleapis.com/icon?family=Material+Icons', revision: '1' },
    { url: 'https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2', revision: '1' }
  ]);
  
  workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate()
  );

  workbox.routing.registerRoute(
    /.*(?:png|gif|jpg|jpeg|svg|ico)$/,
    workbox.strategies.cacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.cacheableResponse.Plugin({
          statuses: [0, 200]
        }),
        new workbox.expiration.Plugin({
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
        }),
      ]
    })
  );

  // Caching Google Fonts
  workbox.routing.registerRoute(
    /.*(?:googleapis|gstatic)\.com/,
    workbox.strategies.staleWhileRevalidate({
      cacheName: 'google-fonts-stylesheets',
    })
  );

  workbox.routing.registerRoute(
    new RegExp('/pages/'),
      workbox.strategies.staleWhileRevalidate({
          cacheName: 'pages'
      })
  );
} else {
  console.log(`Workbox gagal dimuat`);
}

self.addEventListener('push', function(event) {
    var body;
    if (event.data) {
      body = event.data.text();
    } else {
      body = 'Push message no payload';
    }
    var options = {
      body: body,
      icon: '/assets/image/icon-512.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };
    event.waitUntil(
      self.registration.showNotification('Push Notification', options)
    );
});




// let urlsToCache = [
//   "/",
//   "/nav.html",
//   "/index.html",
//   "/detaildata.html",
//   "/favicon.ico",
//   "/manifest.json",
//   "/assets/image/icon-512.png", 
//   "/assets/image/icon-192.png",
//   "/assets/image/icon-152.png", 
//   "/assets/image/icon-128.png",
//   "/assets/image/icon-96.png",
//   "/assets/image/icon-72.png",
//   "/css/materialize.min.css",
//   "/push.js",
//   "/js/materialize.min.js",
//   "/js/api.js",
//   "/js/db.js",
//   "/js/idb.js",
//   "/js/script.js",
//   "/js/sw-register.js",
//   "/pages/about.html",
//   "/pages/contact.html",
//   "/pages/favoritclub.html",
//   "/pages/home.html",
//   "/pages/jadwal.html"
// ];

// self.addEventListener("install", event => {
//   event.waitUntil(
//       caches.open(CACHE_NAME).then(function (cache) {
//           return cache.addAll(urlsToCache);
//       })
//   );
// });

// self.addEventListener("fetch", event => {
//   var base_url = "https://api.football-data.org/v2/";

//   if (event.request.url.indexOf(base_url) > -1) {
//     event.respondWith(
//       caches.open(CACHE_NAME).then(function(cache) {
//         return fetch(event.request).then(function(response) {
//           cache.put(event.request.url, response.clone());
//           return response;
//         })
//       })
//     );
//   } else {
//     event.respondWith(
//       caches.match(event.request, { ignoreSearch: true }).then(function(response) {
//         return response || fetch (event.request);
//       })
//     )
//   }
// });

// self.addEventListener('activate', event => {
//   event.waitUntil(
//   caches.keys().then(function(cacheNames) {
//     return Promise.all(
//       cacheNames.map(function(cacheName){
//         if(cacheName != CACHE_NAME){	
//           console.log("ServiceWorker: cache " + cacheName + " dihapus");
//           return caches.delete(cacheName);
//         }
//       })
//     );
//   })
// );
// });

// self.addEventListener('push', event => {
//     var body;
//     if (event.data) {
//       body = event.data.text();
//     } else {
//       body = 'Push message no payload';
//     }
//     var options = {
//       body: body,
//       icon: '/assets/image/icon-512.png',
//       vibrate: [100, 50, 100],
//       data: {
//         dateOfArrival: Date.now(),
//         primaryKey: 1
//       }
//     };
//     event.waitUntil(
//       self.registration.showNotification('Push Notification', options)
//     );
// });
