// AURAX Service Worker — Cache + Web Push Notifications
// Works even when the site/tab is fully closed!

const CACHE_NAME = "aurax-v3";
const STATIC_ASSETS = ["/", "/favicon.svg", "/manifest.json"];

// ─── Install: cache static assets ───
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ─── Activate: clean old caches ───
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch: network-first, fallback to cache ───
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  // Don't cache API requests
  if (e.request.url.includes("/api/")) return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        }
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((cached) => {
          if (cached) return cached;
          // SPA fallback: serve cached index.html for navigation requests
          if (e.request.mode === "navigate") {
            return caches.match("/");
          }
          return new Response("Offline", { status: 503, statusText: "Offline" });
        })
      )
  );
});

// ─── Push: receive notification from server ───
self.addEventListener("push", (e) => {
  let data = {
    title: "🛒 طلب جديد — AURAX",
    body: "وصل طلب جديد! افتح لوحة التحكم.",
    icon: "/favicon.svg",
    badge: "/favicon.svg",
    tag: "new-order",
    data: { url: "/admin" },
  };

  try {
    const parsed = e.data?.json();
    if (parsed) data = { ...data, ...parsed };
  } catch {
    if (e.data?.text()) data.body = e.data.text();
  }

  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      data: data.data,
      vibrate: [200, 100, 200, 100, 200],
      requireInteraction: true,   // stays until user taps it
      actions: [
        { action: "open", title: "📋 عرض الطلب" },
        { action: "dismiss", title: "إغلاق" },
      ],
    })
  );
});

// ─── Notification click: open /admin ───
self.addEventListener("notificationclick", (e) => {
  e.notification.close();

  if (e.action === "dismiss") return;

  const targetUrl = e.notification.data?.url || "/admin";

  e.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clients) => {
        // Focus existing window if already open
        for (const client of clients) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
