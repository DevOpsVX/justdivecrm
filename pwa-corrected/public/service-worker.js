self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  const title = data.title || 'JustDive';
  const options = {
    body: data.body || '',
    icon: '/icons/icon-192.png'
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('/'));
});
