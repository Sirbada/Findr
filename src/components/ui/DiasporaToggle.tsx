'use client'

import { useDiaspora } from '@/lib/diaspora/context'
import { Globe } from 'lucide-react'

export function DiasporaToggle() {
  const { isDiasporaMode, currency, toggleDiasporaMode, setCurrency } = useDiaspora()

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleDiasporaMode}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
          isDiasporaMode
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        title={isDiasporaMode ? 'Désactiver le mode Diaspora' : 'Activer le mode Diaspora'}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">Mode Diaspora</span>
        {isDiasporaMode && (
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
        )}
      </button>

      {isDiasporaMode && (
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-full px-1 py-1 shadow-sm">
          {(['EUR', 'USD', 'XAF'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition-all ${
                currency === c
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
