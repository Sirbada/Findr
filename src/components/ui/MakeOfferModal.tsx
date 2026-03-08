'use client'

import { useState } from 'react'
import { X, Tag, CheckCircle } from 'lucide-react'

interface MakeOfferModalProps {
  isOpen: boolean
  onClose: () => void
  listingId: string
  listingType: string
  sellerId: string
  askingPrice: number
  listingTitle: string
}

export function MakeOfferModal({
  isOpen,
  onClose,
  listingId,
  listingType,
  sellerId,
  askingPrice,
  listingTitle,
}: MakeOfferModalProps) {
  const [amount, setAmount] = useState<string>(String(askingPrice))
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  function formatXAF(value: number): string {
    return value.toLocaleString('fr-FR') + ' XAF'
  }

  const parsedAmount = parseInt(amount.replace(/\D/g, ''), 10)
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0
  const percentOfAsking = isValidAmount ? Math.round((parsedAmount / askingPrice) * 100) : 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValidAmount) {
      setError('Veuillez entrer un montant valide.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          listing_type: listingType,
          seller_id: sellerId,
          amount: parsedAmount,
          message: message.trim() || null,
        }),
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
    setAmount(String(askingPrice))
    setMessage('')
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
              <Tag className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Faire une offre</h2>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Offre envoyée !</h3>
            <p className="text-gray-600 mb-6">
              Le vendeur sera notifié et vous contactera bientôt.
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
            {/* Listing info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Annonce</p>
              <p className="font-semibold text-gray-900 text-sm line-clamp-2">{listingTitle}</p>
              <p className="text-green-700 font-bold mt-1">
                Prix demandé : {formatXAF(askingPrice)}
              </p>
            </div>

            {/* Offer amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre offre (XAF)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min={1}
                  step={1000}
                  placeholder="Ex: 150000"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-all bg-gray-50 hover:bg-white pr-20"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">
                  XAF
                </span>
              </div>
              {isValidAmount && (
                <p className={`text-xs mt-1 ${
                  percentOfAsking >= 90 ? 'text-green-600' :
                  percentOfAsking >= 70 ? 'text-yellow-600' : 'text-red-500'
                }`}>
                  {percentOfAsking}% du prix demandé
                  {percentOfAsking >= 90 ? ' — Offre compétitive ✓' :
                   percentOfAsking >= 70 ? ' — Offre raisonnable' : ' — Offre basse'}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message au vendeur <span className="text-gray-400 font-normal">(optionnel)</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Expliquez votre offre, posez des questions..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-300 transition-all bg-gray-50 hover:bg-white resize-none"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isValidAmount}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Tag className="w-4 h-4" />
                  Envoyer l&apos;offre de {isValidAmount ? formatXAF(parsedAmount) : '—'}
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              Le vendeur peut accepter, refuser ou contre-proposer votre offre.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
