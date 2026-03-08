'use client'

import { useState } from 'react'
import { X, Bell, CheckCircle } from 'lucide-react'

interface SaveSearchModalProps {
  isOpen: boolean
  onClose: () => void
  category: string
  filters: Record<string, any>
  label?: string
}

export function SaveSearchModal({ isOpen, onClose, category, filters, label: initialLabel }: SaveSearchModalProps) {
  const [label, setLabel] = useState(initialLabel || generateLabel(category, filters))
  const [alertFrequency, setAlertFrequency] = useState<'instant' | 'daily' | 'weekly'>('daily')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, filters, label, alert_frequency: alertFrequency }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Une erreur est survenue. Réessayez.')
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
    } catch {
      setError('Une erreur est survenue. Réessayez.')
      setLoading(false)
    }
  }

  function handleClose() {
    setSuccess(false)
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Sauvegarder la recherche</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {success ? (
          /* Success State */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Recherche sauvegardée !</h3>
            <p className="text-gray-600 mb-6">
              Nous vous alerterons quand de nouvelles annonces correspondront à vos critères.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la recherche
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Ex: Appartement 2 chambres à Douala"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-all bg-gray-50 hover:bg-white"
                required
              />
            </div>

            {/* Alert Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fréquence des alertes
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'instant' as const, label: 'Instantané', desc: 'Dès la publication' },
                  { value: 'daily' as const, label: 'Quotidien', desc: 'Résumé du jour' },
                  { value: 'weekly' as const, label: 'Hebdo', desc: 'Résumé de la semaine' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAlertFrequency(option.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      alertFrequency === option.value
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs mt-1 opacity-75">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active filters summary */}
            {Object.keys(filters).filter(k => filters[k] && filters[k] !== 'all').length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-500 mb-2">Filtres actifs :</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters)
                    .filter(([, v]) => v && v !== 'all')
                    .map(([k, v]) => (
                      <span
                        key={k}
                        className="text-xs bg-white border border-gray-200 text-gray-700 px-2 py-1 rounded-lg"
                      >
                        {k}: {String(v)}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  Sauvegarder et activer les alertes
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

function generateLabel(category: string, filters: Record<string, any>): string {
  const parts: string[] = []

  // Category label
  const categoryLabels: Record<string, string> = {
    housing: 'Logement',
    cars: 'Véhicule',
    services: 'Service',
    emplois: 'Emploi',
  }
  parts.push(categoryLabels[category] || category)

  // Type
  if (filters.type && filters.type !== 'all') {
    parts.push(filters.type)
  }

  // City
  if (filters.city && filters.city !== 'all') {
    parts.push(`à ${filters.city}`)
  }

  // Price
  if (filters.price && filters.price !== 'all') {
    parts.push(`(${filters.price} XAF)`)
  }

  return parts.join(' ')
}
