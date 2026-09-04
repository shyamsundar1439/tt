// Service Worker for SSC CGL Study Companion
// Supports Mobile Push Notifications & Offline Support

const CACHE_NAME = 'study-companion-v4';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Let API requests go directly to network
  if (event.request.url.includes('/api/')) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});

// Client postMessage notification handler (Crucial for Mobile browsers where new Notification() fails)
self.addEventListener('message', event => {
  if (event.data && (event.data.type === 'SHOW_NOTIFICATION' || event.data.type === 'NOTIFICATION_TRIGGER')) {
    const title = event.data.title || 'SSC CGL Study Reminder';
    const body = event.data.body || 'Time for your scheduled study session.';
    const targetView = event.data.target_view || 'today';
    const tag = event.data.tag || 'ssc-study-alert';

    const options = {
      body: body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [200, 100, 200, 100, 300],
      tag: tag,
      renotify: true,
      requireInteraction: false,
      data: {
        target_view: targetView,
        timestamp: Date.now()
      },
      actions: [
        { action: 'open', title: 'Open Study App' }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

// Push notification reception (from Web Push server if configured)
self.addEventListener('push', event => {
  let payload = {
    title: 'Study Reminder',
    body: 'Time for your scheduled study session.',
    target_view: 'today',
    tag: 'ssc-study-push'
  };

  if (event.data) {
    try {
      payload = event.data.json();
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200, 100, 300],
    tag: payload.tag || 'ssc-study-reminder',
    renotify: true,
    data: {
      target_view: payload.target_view || 'today'
    },
    actions: [
      { action: 'open', title: 'Open Study App' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// Notification click behavior
self.addEventListener('notificationclick', event => {
  event.notification.close();
  const targetView = event.notification.data?.target_view || 'today';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (let i = 0; i < clientList.length; i++) {
        let client = clientList[i];
        if ('focus' in client) {
          client.postMessage({ action: 'switchView', view: targetView });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/#' + targetView);
      }
    })
  );
});

