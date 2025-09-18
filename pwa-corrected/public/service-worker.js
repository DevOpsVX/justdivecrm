const CACHE_NAME = 'justdive-v1.0.0'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
]

// Instalar service worker e fazer cache dos recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto')
        return cache.addAll(urlsToCache)
      })
      .catch(error => {
        console.error('Erro ao fazer cache:', error)
      })
  )
})

// Interceptar requisições e servir do cache quando offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna do cache se encontrado, senão busca na rede
        if (response) {
          return response
        }
        return fetch(event.request)
      })
      .catch(() => {
        // Se offline e não encontrado no cache, retorna página offline
        if (event.request.destination === 'document') {
          return caches.match('/')
        }
      })
  )
})

// Limpar caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removendo cache antigo:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Lidar com notificações push
self.addEventListener('push', event => {
  console.log('Push recebido:', event)
  
  const data = event.data?.json() || {}
  const title = data.title || 'JustDive'
  const options = {
    body: data.body || 'Nova notificação da JustDive Academy',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: 'justdive-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Ver Detalhes',
        icon: '/icon-192x192.png'
      },
      {
        action: 'dismiss',
        title: 'Dispensar'
      }
    ],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

// Lidar com cliques em notificações
self.addEventListener('notificationclick', event => {
  console.log('Notificação clicada:', event)
  
  event.notification.close()

  if (event.action === 'dismiss') {
    return
  }

  const urlToOpen = event.notification.data?.url || '/'

  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {
      // Verificar se já existe uma janela aberta
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus()
        }
      }
      
      // Se não existe, abrir nova janela
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen)
      }
    })
  )
})

// Sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'weather-sync') {
    event.waitUntil(syncWeatherData())
  }
})

// Função para sincronizar dados meteorológicos
async function syncWeatherData() {
  try {
    // Simular sincronização de dados meteorológicos
    console.log('Sincronizando dados meteorológicos...')
    
    // Aqui você pode implementar a lógica para:
    // 1. Buscar dados meteorológicos atualizados
    // 2. Atualizar cache local
    // 3. Enviar notificações se necessário
    
    return Promise.resolve()
  } catch (error) {
    console.error('Erro na sincronização:', error)
    return Promise.reject(error)
  }
}

// Lidar com mudanças de conectividade
self.addEventListener('online', () => {
  console.log('Aplicação online')
  // Sincronizar dados quando voltar online
  self.registration.sync.register('weather-sync')
})

self.addEventListener('offline', () => {
  console.log('Aplicação offline')
})

console.log('Service Worker JustDive carregado')

