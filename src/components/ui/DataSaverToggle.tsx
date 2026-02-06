'use client'

import { useState } from 'react'
import { Wifi, WifiOff, Zap, Settings, X, Check } from 'lucide-react'
import { useDataSaver } from '@/lib/data-saver/context'
import { useTranslation } from '@/lib/i18n/context'

interface DataSaverToggleProps {
  variant?: 'compact' | 'full'
}

export function DataSaverToggle({ variant = 'compact' }: DataSaverToggleProps) {
  const { mode, setMode, isDataSaverActive, imageQuality } = useDataSaver()
  const { lang } = useTranslation()
  const [showMenu, setShowMenu] = useState(false)

  const content = {
    title: lang === 'fr' ? 'Économiseur de données' : 'Data Saver',
    description: lang === 'fr' 
      ? 'Réduit la consommation de données mobiles'
      : 'Reduces mobile data usage',
    auto: 'Auto',
    on: lang === 'fr' ? 'Activé' : 'On',
    off: lang === 'fr' ? 'Désactivé' : 'Off',
    autoDesc: lang === 'fr' 
      ? 'Détecte automatiquement votre connexion'
      : 'Automatically detects your connection',
    onDesc: lang === 'fr'
      ? 'Toujours économiser les données'
      : 'Always save data',
    offDesc: lang === 'fr'
      ? 'Qualité maximale'
      : 'Maximum quality',
    currentSavings: lang === 'fr' ? 'Économie actuelle' : 'Current savings',
    imagesAt: lang === 'fr' ? 'Images à' : 'Images at',
  }

  const qualityLabel = {
    low: '30%',
    medium: '60%',
    high: '100%',
  }

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm transition-colors ${
            isDataSaverActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={content.title}
        >
          {isDataSaverActive ? (
            <Zap className="w-4 h-4" />
          ) : (
            <Wifi className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isDataSaverActive ? '📉' : '📶'}
          </span>
        </button>

        {showMenu && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setShowMenu(false)}
            />
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
              <div className="p-3 border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{content.title}</h3>
                  <button 
                    onClick={() => setShowMenu(false)}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">{content.description}</p>
              </div>
              
              <div className="p-2">
                {(['auto', 'on', 'off'] as const).map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setMode(option)
                      setShowMenu(false)
                    }}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      mode === option 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      mode === option 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-300'
                    }`}>
                      {mode === option && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">
                        {option === 'auto' && content.auto}
                        {option === 'on' && content.on}
                        {option === 'off' && content.off}
                      </p>
                      <p className="text-xs text-gray-500">
                        {option === 'auto' && content.autoDesc}
                        {option === 'on' && content.onDesc}
                        {option === 'off' && content.offDesc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 border-t bg-gray-50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{content.imagesAt}</span>
                  <span className={`font-medium ${
                    imageQuality === 'low' ? 'text-green-600' :
                    imageQuality === 'medium' ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {qualityLabel[imageQuality]} {imageQuality === 'low' && '💚'}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )
  }

  // Full variant for settings page
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${
          isDataSaverActive ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          {isDataSaverActive ? (
            <Zap className="w-6 h-6 text-green-600" />
          ) : (
            <Wifi className="w-6 h-6 text-gray-600" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{content.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{content.description}</p>
          
          <div className="flex gap-2 mt-3">
            {(['auto', 'on', 'off'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setMode(option)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  mode === option
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option === 'auto' && content.auto}
                {option === 'on' && content.on}
                {option === 'off' && content.off}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {isDataSaverActive && (
        <div className="mt-3 p-2 bg-green-50 rounded-lg">
          <p className="text-sm text-green-700">
            ✅ {lang === 'fr' 
              ? `Mode économie actif — Images à ${qualityLabel[imageQuality]}`
              : `Data saver active — Images at ${qualityLabel[imageQuality]}`
            }
          </p>
        </div>
      )}
    </div>
  )
}

// Floating indicator for when data saver is active
export function DataSaverIndicator() {
  const { isDataSaverActive } = useDataSaver()
  
  if (!isDataSaverActive) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
        <Zap className="w-3 h-3" />
        <span>Data Saver</span>
      </div>
    </div>
  )
}
