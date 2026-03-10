'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useTranslation } from '@/lib/i18n/context'
import { pushNotifications } from '@/lib/notifications/push'
import { PushPermissionRequest } from '@/components/notifications/PushPermissionRequest'
import { 
  Bell, BellOff, MessageSquare, TrendingDown, Search, 
  Mail, Smartphone, Save, Check, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface NotificationPreferences {
  new_messages: boolean
  price_drops: boolean
  saved_search_matches: boolean
  listing_updates: boolean
  marketing: boolean
  email_notifications: boolean
  push_notifications: boolean
  sms_notifications: boolean
}

const defaultPreferences: NotificationPreferences = {
  new_messages: true,
  price_drops: true,
  saved_search_matches: true,
  listing_updates: true,
  marketing: false,
  email_notifications: true,
  push_notifications: true,
  sms_notifications: false
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadPreferences()
  }, [user])

  async function loadPreferences() {
    if (!user) return

    setLoading(true)
    try {
      // Check push subscription status
      const subscribed = await pushNotifications.isSubscribed()
      setIsSubscribed(subscribed)

      // Load preferences from database
      const prefs = await pushNotifications.getPreferences()
      if (prefs) {
        setPreferences(prefs)
      }
    } catch (error) {
      console.error('Error loading preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  async function savePreferences() {
    setSaving(true)
    try {
      await pushNotifications.updatePreferences(preferences)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving preferences:', error)
    } finally {
      setSaving(false)
    }
  }

  function updatePreference(key: keyof NotificationPreferences, value: boolean) {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  function NotificationToggle({ 
    id, 
    label, 
    description, 
    enabled, 
    onChange,
    icon: Icon,
    disabled = false
  }: {
    id: string
    label: string
    description: string
    enabled: boolean
    onChange: (enabled: boolean) => void
    icon: any
    disabled?: boolean
  }) {
    return (
      <div className={`flex items-start space-x-4 p-4 rounded-lg border ${
        disabled ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-[#FFF4EC]'
      }`}>
        <div className="flex-shrink-0">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            enabled ? 'bg-[#FFF4EC]' : 'bg-gray-100'
          }`}>
            <Icon className={`w-5 h-5 ${enabled ? 'text-[#E8630A]' : 'text-gray-400'}`} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`text-sm font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {label}
            </h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enabled}
                onChange={(e) => onChange(e.target.checked)}
                disabled={disabled}
                className="sr-only peer"
              />
              <div className={`relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer 
                peer-checked:after:translate-x-full peer-checked:after:border-white 
                after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all 
                ${disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'peer-checked:bg-[#E8630A] hover:bg-gray-300 peer-checked:hover:bg-[#1A1A2E]'
                }`}>
              </div>
            </label>
          </div>
          <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
            {description}
          </p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Connexion requise</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Préférences de notification
                <span className="block text-sm font-normal text-gray-500 mt-0.5">
                  Notification Preferences
                </span>
              </h1>
            </div>
            
            <Link href="/dashboard" className="text-sm text-[#E8630A] hover:text-[#E8630A]">
              ← Retour au tableau de bord
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Push Permission Request */}
        {!isSubscribed && (
          <div className="mb-6">
            <PushPermissionRequest
              onPermissionGranted={() => setIsSubscribed(true)}
              onPermissionDenied={() => setIsSubscribed(false)}
            />
          </div>
        )}

        {/* Status Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              isSubscribed ? 'bg-green-100' : 'bg-yellow-100'
            }`}>
              {isSubscribed ? (
                <Check className="w-6 h-6 text-green-600" />
              ) : (
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {isSubscribed ? 'Notifications activées' : 'Notifications non activées'}
              </h3>
              <p className="text-sm text-gray-500">
                {isSubscribed ? 
                  'Vous recevrez des notifications push sur cet appareil.' :
                  'Activez les notifications pour recevoir des alertes instantanées.'
                }
                <span className="block text-xs mt-0.5">
                  {isSubscribed ?
                    'You will receive push notifications on this device.' :
                    'Enable notifications to receive instant alerts.'
                  }
                </span>
              </p>
            </div>
            
            {saved && (
              <div className="text-green-600">
                <Check className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Content Notifications */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Notifications de contenu
              <span className="block text-sm font-normal text-gray-500 mt-0.5">
                Content Notifications
              </span>
            </h2>
            
            <div className="space-y-3">
              <NotificationToggle
                id="new_messages"
                label="Nouveaux messages • New Messages"
                description="Recevez une notification lorsque quelqu'un vous envoie un message concernant vos annonces. Get notified when someone messages you about your listings."
                enabled={preferences.new_messages}
                onChange={(value) => updatePreference('new_messages', value)}
                icon={MessageSquare}
                disabled={!isSubscribed && !preferences.email_notifications}
              />
              
              <NotificationToggle
                id="price_drops"
                label="Baisses de prix • Price Drops"
                description="Soyez alerté lorsque le prix d'une annonce qui vous intéresse baisse. Get alerted when the price of an interesting listing drops."
                enabled={preferences.price_drops}
                onChange={(value) => updatePreference('price_drops', value)}
                icon={TrendingDown}
                disabled={!isSubscribed && !preferences.email_notifications}
              />
              
              <NotificationToggle
                id="saved_search_matches"
                label="Recherches sauvegardées • Saved Search Matches"
                description="Recevez des notifications pour les nouvelles annonces correspondant à vos recherches sauvegardées. Get notified about new listings matching your saved searches."
                enabled={preferences.saved_search_matches}
                onChange={(value) => updatePreference('saved_search_matches', value)}
                icon={Search}
                disabled={!isSubscribed && !preferences.email_notifications}
              />
              
              <NotificationToggle
                id="listing_updates"
                label="Mises à jour d'annonces • Listing Updates"
                description="Recevez des notifications sur les mises à jour importantes de vos annonces favorites. Get updates about important changes to your favorite listings."
                enabled={preferences.listing_updates}
                onChange={(value) => updatePreference('listing_updates', value)}
                icon={Bell}
                disabled={!isSubscribed && !preferences.email_notifications}
              />
            </div>
          </div>

          {/* Channel Preferences */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Canaux de notification
              <span className="block text-sm font-normal text-gray-500 mt-0.5">
                Notification Channels
              </span>
            </h2>
            
            <div className="space-y-3">
              <NotificationToggle
                id="push_notifications"
                label="Notifications push • Push Notifications"
                description="Recevez des notifications instantanées sur votre navigateur ou appareil. Receive instant notifications on your browser or device."
                enabled={preferences.push_notifications && isSubscribed}
                onChange={(value) => updatePreference('push_notifications', value)}
                icon={Smartphone}
                disabled={!isSubscribed}
              />
              
              <NotificationToggle
                id="email_notifications"
                label="Notifications par email • Email Notifications"
                description="Recevez des notifications par email sur votre adresse enregistrée. Receive notifications via email to your registered address."
                enabled={preferences.email_notifications}
                onChange={(value) => updatePreference('email_notifications', value)}
                icon={Mail}
              />
            </div>
          </div>

          {/* Marketing */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Communications marketing
              <span className="block text-sm font-normal text-gray-500 mt-0.5">
                Marketing Communications
              </span>
            </h2>
            
            <div className="space-y-3">
              <NotificationToggle
                id="marketing"
                label="Offres et actualités • Offers and News"
                description="Recevez des informations sur les nouvelles fonctionnalités, offres spéciales et actualités de Findr. Receive information about new features, special offers, and Findr news."
                enabled={preferences.marketing}
                onChange={(value) => updatePreference('marketing', value)}
                icon={BellOff}
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Les modifications sont automatiquement sauvegardées.
                <span className="block text-xs">
                  Changes are automatically saved.
                </span>
              </p>
              
              <Button
                onClick={savePreferences}
                disabled={saving}
                className="bg-[#E8630A] hover:bg-[#1A1A2E] text-white"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Sauvegarder • Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}