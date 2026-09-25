// Weather Pulse Service Worker for Offline Caching & Web Push Notifications

const CACHE_NAME = 'weather-pulse-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Stale-While-Revalidate for API & Cache First for assets)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update
        fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      });
    })
  );
});

// Web Push Event Handler
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : { title: 'Weather Alert', body: 'Severe weather condition updated.' };
  const options = {
    body: data.body,
    icon: 'https://img.icons8.com/color/192/000000/weather--v1.png',
    badge: 'https://img.icons8.com/color/96/000000/weather--v1.png',
    vibrate: [200, 100, 200],
    data: { url: '/' },
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url || '/'));
});
