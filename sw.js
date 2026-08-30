/**
 * FIVIA Progressive Web App - Service Worker
 * Enables offline access to all physics virtual labs, games, and quizzes.
 */

const CACHE_NAME = "fivia-vlab-cache-v1.1.0";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg",
  "./css/main.css",
  "./css/components.css",
  "./css/labs.css",
  "./css/dashboards.css",
  "./js/app.js",
  "./js/auth.js",
  "./js/database.js",
  "./js/labs.js",
  "./js/lkpd.js",
  "./js/quiz.js",
  "./js/detektif.js",
  "./js/ai-tutor.js",
  "./js/dashboards.js",
  "./js/firebase-config.js",
  "./js/firebase-sync.js",
  "./js/fivia-excel-import.js",
  "./js/fivia-group-play.js",
  "./js/fivia-group-play-engine.js",
  "./js/fivia-group-play-session.js",
  "./js/fivia-group-play-sync.js",
  "./js/fivia-group-play-analytics.js",
  "./js/fivia-group-levels.js",
  "./js/fivia-group-level-questions.js",
  "./js/fivia-group-level-engine.js",
  "./js/fivia-group-level-analytics.js"
];

// 1. Install event: Cache all essential application files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[FIVIA SW] Pre-caching offline assets...");
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn("[FIVIA SW] Asset pre-caching non-fatal warning:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate event: Clear previous caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("[FIVIA SW] Clearing legacy cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch event: Stale-While-Revalidate caching strategy
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Ignore non-GET requests or Firebase / Google API real-time queries
  if (request.method !== "GET" || request.url.includes("firestore.googleapis.com") || request.url.includes("identitytoolkit")) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch background update for cache freshness
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
            caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse.clone()));
          }
        }).catch(() => {
          // Offline mode active
        });
        return cachedResponse;
      }

      // If not in cache, fetch from network and cache
      return fetch(request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== "basic") {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // If navigating to an HTML page while offline, return index.html
        if (request.headers.get("accept") && request.headers.get("accept").includes("text/html")) {
          return caches.match("./index.html");
        }
      });
    })
  );
});
