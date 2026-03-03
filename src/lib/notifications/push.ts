import { createClient } from '@/lib/supabase/client'

export interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
    icon?: string
  }>
  vibrate?: number[]
  tag?: string
  renotify?: boolean
  silent?: boolean
  timestamp?: number
}

class PushNotificationManager {
  private supabase = createClient()

  // Request permission for notifications
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      throw new Error('Notifications not supported')
    }

    if (!('serviceWorker' in navigator)) {
      throw new Error('Service Workers not supported')
    }

    return await Notification.requestPermission()
  }

  // Subscribe to push notifications
  async subscribe(): Promise<PushSubscription | null> {
    try {
      const permission = await this.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Notification permission not granted')
      }

      const registration = await navigator.serviceWorker.ready
      
      // Check if already subscribed
      let subscription = await registration.pushManager.getSubscription()
      
      if (!subscription) {
        // VAPID public key (you'll need to generate this)
        const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 'BGxVIYgvKFWL8_6bwFgO8bhFRbTDvQBl_hWUIVg6hYbW0qQTgG8J2-YLfX8iGIbgTt4r5c7NjHg_2cQTcNWQ'
        
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
        })
      }

      // Save subscription to database
      const { data: { user } } = await this.supabase.auth.getUser()
      if (!user) {
        throw new Error('User not authenticated')
      }

      await this.saveSubscription(user.id, subscription)
      
      return subscription.toJSON() as PushSubscription
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
      return null
    }
  }

  // Save subscription to database
  private async saveSubscription(userId: string, subscription: globalThis.PushSubscription) {
    const subscriptionData = subscription.toJSON()
    
    await this.supabase
      .from('push_subscriptions')
      .upsert({
        user_id: userId,
        endpoint: subscription.endpoint,
        p256dh: subscriptionData.keys?.p256dh || '',
        auth: subscriptionData.keys?.auth || '',
        user_agent: navigator.userAgent
      }, {
        onConflict: 'user_id,endpoint'
      })
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      
      if (subscription) {
        await subscription.unsubscribe()
        
        // Remove from database
        const { data: { user } } = await this.supabase.auth.getUser()
        if (user) {
          await this.supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', user.id)
            .eq('endpoint', subscription.endpoint)
        }
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
      return false
    }
  }

  // Check if user is subscribed
  async isSubscribed(): Promise<boolean> {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      return !!subscription
    } catch (error) {
      console.error('Error checking subscription status:', error)
      return false
    }
  }

  // Get user's notification preferences
  async getPreferences() {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await this.supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error) {
      console.error('Error fetching notification preferences:', error)
      return null
    }

    return data
  }

  // Update notification preferences
  async updatePreferences(preferences: {
    new_messages?: boolean
    price_drops?: boolean
    saved_search_matches?: boolean
    listing_updates?: boolean
    marketing?: boolean
    email_notifications?: boolean
    push_notifications?: boolean
    sms_notifications?: boolean
  }) {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) throw new Error('User not authenticated')

    const { data, error } = await this.supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        ...preferences,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Error updating notification preferences:', error)
      throw error
    }

    return data
  }

  // Show a local notification (for testing)
  async showLocalNotification(payload: NotificationPayload) {
    const permission = await this.requestPermission()
    if (permission !== 'granted') {
      throw new Error('Notification permission not granted')
    }

    const options: NotificationOptions = {
      body: payload.body,
      icon: payload.icon || '/icons/icon-192x192.png',
      badge: payload.badge || '/icons/icon-72x72.png',
      image: payload.image,
      data: payload.data,
      actions: payload.actions,
      vibrate: payload.vibrate || [100, 50, 100],
      tag: payload.tag,
      renotify: payload.renotify,
      silent: payload.silent,
      timestamp: payload.timestamp || Date.now()
    }

    return new Notification(payload.title, options)
  }

  // Utility to convert VAPID key
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }

    return outputArray
  }
}

export const pushNotifications = new PushNotificationManager()

// React hook for push notifications
export function usePushNotifications() {
  return pushNotifications
}