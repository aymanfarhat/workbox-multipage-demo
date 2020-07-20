importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');


workbox.core.setCacheNameDetails({
  prefix: 'DemoApp'
});

workbox.precaching.precacheAndRoute([
  { url: '/', revision: null },
  { url: '/about-precache', revision: null },
  { url: '/search.js', revision: null },
]);

workbox.routing.registerRoute(
  new RegExp('\.css$'),
  new workbox.strategies.CacheFirst({
    cacheName: 'cache-css',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 7, // cache for one week
        purgeOnQuotaError: true
      }),
      new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [0, 200]
      })
    ]
  }),
);

workbox.routing.registerRoute(
  new RegExp(/\/api\/.*/),
  new workbox.strategies.CacheFirst({
    cacheName: 'cache-api',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24, // cache for one day
        maxEntries: 20, // only cache 20 request
        purgeOnQuotaError: true
      }),
    ]
  }),
);

workbox.routing.registerRoute(
  new RegExp(/\/related-videos\/.*/),
  new workbox.strategies.CacheFirst({
    cacheName: 'cache-related-videos',
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24, // cache for one day
        maxEntries: 20, // only cache 20 request
        purgeOnQuotaError: true
      }),
    ]
  }),
);