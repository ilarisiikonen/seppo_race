const CACHE_NAME = 'seppo-race-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/seppo/rotations/south.png',
  '/seppo/rotations/north.png',
  '/seppo/rotations/east.png',
  '/seppo/rotations/west.png',
  '/seppo/rotations/north-east.png',
  '/seppo/rotations/north-west.png',
  '/seppo/rotations/south-east.png',
  '/seppo/rotations/south-west.png',
  '/seppo/animations/drinking/south/frame_000.png',
  '/seppo/animations/drinking/south/frame_001.png',
  '/seppo/animations/drinking/south/frame_002.png',
  '/seppo/animations/drinking/south/frame_003.png',
  '/seppo/animations/drinking/south/frame_004.png',
  '/seppo/animations/drinking/south/frame_005.png',
  '/seppo/animations/falling-back-death/south/frame_000.png',
  '/seppo/animations/falling-back-death/south/frame_001.png',
  '/seppo/animations/falling-back-death/south/frame_002.png',
  '/seppo/animations/falling-back-death/south/frame_003.png',
  '/seppo/animations/falling-back-death/south/frame_004.png',
  '/seppo/animations/falling-back-death/south/frame_005.png',
  '/seppo/animations/falling-back-death/south/frame_006.png',
  '/seppo/animations/breathing-idle/south/frame_000.png',
  '/seppo/animations/breathing-idle/south/frame_001.png',
  '/seppo/animations/breathing-idle/south/frame_002.png',
  '/seppo/animations/breathing-idle/south/frame_003.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Network-first for Firebase/API calls, cache-first for game assets
  if (e.request.url.includes('firebasestorage') || 
      e.request.url.includes('firestore') || 
      e.request.url.includes('googleapis')) {
    e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
