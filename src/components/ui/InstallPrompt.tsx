'use client'

import { useState, useEffect } from 'react'
import { X, Download, Smartphone, Share, Plus, Check } from 'lucide-react'
import { Button } from './Button'
import { useTranslation } from '@/lib/i18n/context'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    'beforeinstallprompt': BeforeInstallPromptEvent
  }
}

const installTranslations = {
  fr: {
    install: 'Installer Findr',
    installSubtitle: 'Accédez plus rapidement à vos annonces',
    installButton: 'Installer l\'app',
    notNow: 'Plus tard',
    installed: 'Installée!',
    features: {
      offline: 'Fonctionne hors connexion',
      fast: 'Chargement ultra rapide',
      notifications: 'Notifications instantanées',
    },
    ios: {
      title: 'Installer sur iPhone',
      step1: 'Appuyez sur',
      step2: 'puis "Sur l\'écran d\'accueil"',
      shareIcon: 'Partager',
    },
    android: {
      title: 'Installer sur Android',
      step1: 'Appuyez sur le menu ⋮',
      step2: 'puis "Ajouter à l\'écran d\'accueil"',
    },
    banner: {
      title: 'Installez l\'app Findr',
      subtitle: 'Pour une meilleure expérience',
    }
  },
  en: {
    install: 'Install Findr',
    installSubtitle: 'Access your listings faster',
    installButton: 'Install app',
    notNow: 'Not now',
    installed: 'Installed!',
    features: {
      offline: 'Works offline',
      fast: 'Lightning fast',
      notifications: 'Instant notifications',
    },
    ios: {
      title: 'Install on iPhone',
      step1: 'Tap',
      step2: 'then "Add to Home Screen"',
      shareIcon: 'Share',
    },
    android: {
      title: 'Install on Android',
      step1: 'Tap the menu ⋮',
      step2: 'then "Add to Home Screen"',
    },
    banner: {
      title: 'Install Findr app',
      subtitle: 'For a better experience',
    }
  }
}

/**
 * Detect device type
 */
function useDeviceType() {
  const [device, setDevice] = useState<'ios' | 'android' | 'desktop'>('desktop')

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(ua)) {
      setDevice('ios')
    } else if (/android/.test(ua)) {
      setDevice('android')
    } else {
      setDevice('desktop')
    }
  }, [])

  return device
}

/**
 * Check if app is already installed
 */
function useIsInstalled() {
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if running as PWA
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    const isIOSStandalone = (window.navigator as any).standalone === true
    
    setIsInstalled(isStandalone || isIOSStandalone)
  }, [])

  return isInstalled
}

/**
 * Check if prompt was dismissed recently
 */
function usePromptDismissed() {
  const [dismissed, setDismissed] = useState(true) // Default to true to prevent flash

  useEffect(() => {
    const dismissedAt = localStorage.getItem('findr_install_dismissed')
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24)
      // Show again after 7 days
      setDismissed(daysSince < 7)
    } else {
      setDismissed(false)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem('findr_install_dismissed', Date.now().toString())
    setDismissed(true)
  }

  return { dismissed, dismiss }
}

/**
 * Install Prompt Banner
 * Shows at the bottom of the screen on mobile
 */
export function InstallBanner() {
  const { lang } = useTranslation()
  const t = installTranslations[lang]
  const device = useDeviceType()
  const isInstalled = useIsInstalled()
  const { dismissed, dismiss } = usePromptDismissed()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOSModal, setShowIOSModal] = useState(false)

  // Listen for beforeinstallprompt event (Chrome/Edge/Samsung)
  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  // Don't show if already installed or dismissed
  if (isInstalled || dismissed) {
    return null
  }

  // Don't show on desktop (for now)
  if (device === 'desktop' && !deferredPrompt) {
    return null
  }

  const handleInstall = async () => {
    if (device === 'ios') {
      setShowIOSModal(true)
      return
    }

    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null)
      }
    }
  }

  return (
    <>
      {/* Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-4 shadow-lg">
          <div className="flex items-center justify-between max-w-lg mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-lg">F</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{t.banner.title}</p>
                <p className="text-emerald-100 text-xs">{t.banner.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-white text-emerald-600 hover:bg-emerald-50"
              >
                <Download className="w-4 h-4 mr-1" />
                {t.installButton}
              </Button>
              <button
                onClick={dismiss}
                className="p-2 hover:bg-emerald-500 rounded-full transition-colors"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* iOS Installation Modal */}
      {showIOSModal && (
        <IOSInstallModal onClose={() => setShowIOSModal(false)} />
      )}
    </>
  )
}

/**
 * iOS Installation Instructions Modal
 */
function IOSInstallModal({ onClose }: { onClose: () => void }) {
  const { lang } = useTranslation()
  const t = installTranslations[lang]

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-2xl w-full max-w-md p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">{t.ios.title}</h2>
        </div>

        <div className="space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                {t.ios.step1}{' '}
                <span className="inline-flex items-center bg-gray-100 rounded px-2 py-1">
                  <Share className="w-4 h-4" />
                </span>
                {' '}({t.ios.shareIcon})
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div className="flex-1">
              <p className="text-gray-700">
                {t.ios.step2}{' '}
                <span className="inline-flex items-center bg-gray-100 rounded px-2 py-1">
                  <Plus className="w-4 h-4" />
                </span>
              </p>
            </div>
          </div>
        </div>

        <Button onClick={onClose} className="w-full mt-6">
          {t.notNow}
        </Button>
      </div>
    </div>
  )
}

/**
 * Full Install Prompt Component
 * Can be used as a standalone page or modal
 */
export function InstallPrompt({ onClose }: { onClose?: () => void }) {
  const { lang } = useTranslation()
  const t = installTranslations[lang]
  const device = useDeviceType()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)
    
    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setInstalled(true)
    })

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        setInstalled(true)
      }
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white font-bold text-3xl">F</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">{t.install}</h2>
        <p className="text-gray-500 mt-1">{t.installSubtitle}</p>
      </div>

      {/* Features */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="text-gray-700">{t.features.offline}</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="text-gray-700">{t.features.fast}</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
          <Check className="w-5 h-5 text-emerald-600" />
          <span className="text-gray-700">{t.features.notifications}</span>
        </div>
      </div>

      {/* Actions */}
      {installed ? (
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-green-600 font-semibold">{t.installed}</p>
        </div>
      ) : device === 'ios' ? (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">{t.ios.title}:</p>
            <ol className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-xs flex items-center justify-center">1</span>
                {t.ios.step1} <Share className="w-4 h-4 inline" />
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-600 text-white rounded-full text-xs flex items-center justify-center">2</span>
                {t.ios.step2} <Plus className="w-4 h-4 inline" />
              </li>
            </ol>
          </div>
          {onClose && (
            <Button onClick={onClose} variant="outline" className="w-full">
              {t.notNow}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <Button onClick={handleInstall} className="w-full" size="lg" disabled={!deferredPrompt}>
            <Download className="w-5 h-5 mr-2" />
            {t.installButton}
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="ghost" className="w-full">
              {t.notNow}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Add safe-area-bottom utility for iOS
const styles = `
.safe-area-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
`

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = styles
  document.head.appendChild(style)
}
