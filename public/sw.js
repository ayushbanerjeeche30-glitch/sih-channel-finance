const CACHE_NAME = 'sih-master-vault-v9';

self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('fetch', (event) => {
  // CRITICAL FIX: Ignore Leaflet 'data:' URIs and browser extensions. They will crash caches.put()
  if (event.request.method !== 'GET' || !event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(event.request);
        
        if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        // Offline Fallback
        const cachedResponse = await caches.match(event.request, { ignoreSearch: true, ignoreVary: true });
        if (cachedResponse) return cachedResponse;

        // Map Tile Gray Square Injection
        if (event.request.url.includes('tile.openstreetmap')) {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" style="background-color:#e5e7eb"></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }

        // Failsafe response to prevent TypeError crashes
        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});