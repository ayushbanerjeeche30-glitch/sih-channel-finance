const CACHE_NAME = 'sih-master-vault-v10';

self.addEventListener('install', (event) => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(clients.claim()));

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Never intercept Next.js's own build assets — let the browser/CDN handle these natively.
  // Caching these ourselves risks serving stale JS chunks across deployments.
  if (
    event.request.method !== 'GET' ||
    !url.startsWith('http') ||
    url.includes('/_next/')
  ) {
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
        const cachedResponse = await caches.match(event.request, { ignoreSearch: true, ignoreVary: true });
        if (cachedResponse) return cachedResponse;

        if (url.includes('tile.openstreetmap')) {
          return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" style="background-color:#e5e7eb"></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }

        return new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })()
  );
});