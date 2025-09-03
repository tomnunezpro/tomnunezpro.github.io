// Nom du cache (change-le si tu modifies la liste d'actifs)
const CACHE_NAME = 'budget-courses-v1';

// Fichiers à mettre en cache (offline)
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // Ajoute ici tes icônes si tu veux qu'elles soient accessibles offline :
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// Installation : pré-cache des assets de base
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

// Stratégie réseau-avec-repli-cache
self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    fetch(req)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        return res;
      })
      .catch(() => caches.match(req).then((res) => res || caches.match('./')))
  );
});
