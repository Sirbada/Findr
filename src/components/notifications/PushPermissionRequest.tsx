'use client'

import { useState, useEffect } from 'react'
import { Bell, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { pushNotifications } from '@/lib/notifications/push'
import { useTranslation } from '@/lib/i18n/context'

interface PushPermissionRequestProps {
  onPermissionGranted?: () => void
  onPermissionDenied?: () => void
  className?: string
}

export function PushPermissionRequest({
  onPermissionGranted,
  onPermissionDenied,
  className = ''
}: PushPermissionRequestProps) {
  const { t } = useTranslation()
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    checkNotificationStatus()
  }, [])

  async function checkNotificationStatus() {
    if (!('Notification' in window)) return

    const currentPermission = Notification.permission
    setPermission(currentPermission)

    if (currentPermission === 'granted') {
      const subscribed = await pushNotifications.isSubscribed()
      setIsSubscribed(subscribed)
      
      // Show banner if granted but not subscribed
      setShowBanner(!subscribed)
    } else {
      setShowBanner(currentPermission === 'default')
    }
  }

  async function handleEnableNotifications() {
    setLoading(true)
    try {
      const subscription = await pushNotifications.subscribe()
      if (subscription) {
        setPermission('granted')
        setIsSubscribed(true)
        setShowBanner(false)
        onPermissionGranted?.()
      } else {
        setPermission('denied')
        onPermissionDenied?.()
      }
    } catch (error) {
      console.error('Error enabling notifications:', error)
      setPermission('denied')
      onPermissionDenied?.()
    } finally {
      setLoading(false)
    }
  }

  function handleDismiss() {
    setShowBanner(false)
    // Store in localStorage that user dismissed the banner
    localStorage.setItem('findr-notification-banner-dismissed', 'true')
  }

  // Don't show if notifications are not supported (SSR guard)
  if (typeof window === 'undefined' || !('Notification' in window) || !('serviceWorker' in navigator)) {
    return null
  }

  // Don't show if already granted and subscribed
  if (permission === 'granted' && isSubscribed) {
    return null
  }

  // Don't show if permanently denied
  if (permission === 'denied') {
    return null
  }

  // Don't show if previously dismissed
  if (!showBanner && localStorage.getItem('findr-notification-banner-dismissed')) {
    return null
  }

  if (!showBanner) return null

  return (
    <div className={`bg-emerald-50 border border-emerald-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-emerald-900 mb-1">
            Activer les notifications
            <span className="block text-xs font-normal text-emerald-700 mt-0.5">
              Enable notifications
            </span>
          </h3>
          <p className="text-sm text-emerald-700 mb-3">
            Recevez des alertes instantanées pour les nouveaux messages, les baisses de prix et les annonces correspondant à vos recherches sauvegardées.
            <span className="block text-xs text-emerald-600 mt-1">
              Get instant alerts for new messages, price drops, and listings matching your saved searches.
            </span>
          </p>
          
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleEnableNotifications}
              disabled={loading}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Activation...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Activer • Enable
                </>
              )}
            </Button>
            
            <button
              onClick={handleDismiss}
              className="text-sm text-emerald-600 hover:text-emerald-800 px-3 py-1.5 rounded-md hover:bg-emerald-100 transition-colors"
            >
              Plus tard • Later
            </button>
          </div>
        </div>
        
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 p-1 text-emerald-500 hover:text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// Compact version for smaller spaces
export function PushPermissionBadge({ className = '' }: { className?: string }) {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  async function checkStatus() {
    if (!('Notification' in window)) return

    const currentPermission = Notification.permission
    setPermission(currentPermission)

    if (currentPermission === 'granted') {
      const subscribed = await pushNotifications.isSubscribed()
      setIsSubscribed(subscribed)
    }
  }

  async function handleEnable() {
    setLoading(true)
    try {
      const subscription = await pushNotifications.subscribe()
      if (subscription) {
        setPermission('granted')
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error('Error enabling notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Don't show if not supported or already active (SSR guard)
  if (typeof window === 'undefined' || !('Notification' in window) || 
      !('serviceWorker' in navigator) ||
      (permission === 'granted' && isSubscribed) ||
      permission === 'denied') {
    return null
  }

  return (
    <button
      onClick={handleEnable}
      disabled={loading}
      className={`inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${className}`}
    >
      <Bell className="w-4 h-4" />
      <span>
        {loading ? 'Activation...' : 'Activer les notifications'}
      </span>
    </button>
  )
}