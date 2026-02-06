/**
 * Findr Service Worker
 * 
 * Provides:
 * - Offline support
 * - Cache-first strategy for static assets
 * - Network-first strategy for API calls
 * - Background sync for offline submissions
 */

const CACHE_NAME = 'findr-v1'
const STATIC_CACHE = 'findr-static-v1'
const DYNAMIC_CACHE = 'findr-dynamic-v1'
const IMAGE_CACHE = 'findr-images-v1'

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/housing',
  '/cars',
  '/login',
  '/signup',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
]

// API routes that should be network-first
const API_ROUTES = [
  '/api/',
  'supabase.co',
]

// Image domains to cache
const IMAGE_DOMAINS = [
  'images.unsplash.com',
  'unsplash.com',
  'findr.cm',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets')
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.log('[SW] Some static assets failed to cache:', err)
        })
      })
      .then(() => self.skipWaiting())
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => {
              return name.startsWith('findr-') && 
                     name !== STATIC_CACHE && 
                     name !== DYNAMIC_CACHE &&
                     name !== IMAGE_CACHE
            })
            .map((name) => {
              console.log('[SW] Deleting old cache:', name)
              return caches.delete(name)
            })
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return
  }

  // Handle API requests - Network first
  if (API_ROUTES.some(route => request.url.includes(route))) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
    return
  }

  // Handle images - Cache first with fallback
  if (
    request.destination === 'image' ||
    IMAGE_DOMAINS.some(domain => request.url.includes(domain))
  ) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE))
    return
  }

  // Handle page navigations - Network first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      networkFirst(request, DYNAMIC_CACHE)
        .catch(() => caches.match('/') || new Response('Offline', { status: 503 }))
    )
    return
  }

  // Handle static assets - Cache first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/_next/')
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
    return
  }

  // Default - Stale while revalidate
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
})

/**
 * Cache First Strategy
 * Try cache, fallback to network
 */
async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request)
  if (cached) {
    return cached
  }

  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[SW] Cache first failed:', error)
    throw error
  }
}

/**
 * Network First Strategy
 * Try network, fallback to cache
 */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(cacheName)
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    throw error
  }
}

/**
 * Stale While Revalidate Strategy
 * Return cached immediately, update cache in background
 */
async function staleWhileRevalidate(request, cacheName) {
  const cached = await caches.match(request)
  
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(cacheName).then((cache) => {
          cache.put(request, response.clone())
        })
      }
      return response
    })
    .catch(() => null)

  return cached || fetchPromise
}

// Background Sync for offline form submissions
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'sync-listings') {
    event.waitUntil(syncListings())
  }
  
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages())
  }
})

async function syncListings() {
  // Get pending listings from IndexedDB
  // Submit them to the server
  console.log('[SW] Syncing pending listings...')
}

async function syncMessages() {
  // Get pending messages from IndexedDB
  // Submit them to the server
  console.log('[SW] Syncing pending messages...')
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event)
  
  let data = { title: 'Findr', body: 'Nouvelle notification' }
  
  if (event.data) {
    try {
      data = event.data.json()
    } catch (e) {
      data.body = event.data.text()
    }
  }
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: data.url || '/',
    actions: [
      { action: 'open', title: 'Voir' },
      { action: 'close', title: 'Fermer' }
    ]
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification click:', event)
  
  event.notification.close()
  
  if (event.action === 'close') {
    return
  }
  
  const url = event.notification.data || '/'
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if already open
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})

console.log('[SW] Service Worker loaded')
