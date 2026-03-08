'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, X, Loader2, AlertCircle, Smartphone } from 'lucide-react'

interface EscrowButtonProps {
  listingId: string
  listingType: string
  sellerId: string
  amount: number
  listingTitle: string
}

type PaymentMethod = 'mtn_momo' | 'orange_money'

export function EscrowButton({ listingId, listingType, sellerId, amount, listingTitle }: EscrowButtonProps) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const platformFee = Math.round(amount * 0.03)
  const total = amount + platformFee

  function formatXAF(value: number): string {
    return value.toLocaleString('fr-FR') + ' XAF'
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (phone.length < 9) {
      setError('Veuillez entrer un numéro de téléphone valide.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          listing_type: listingType,
          seller_id: sellerId,
          amount,
          payment_method: paymentMethod,
          phone: `237${phone}`,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Erreur lors de la création du paiement sécurisé.')
        setLoading(false)
        return
      }

      const { escrow_id } = await res.json()
      setShowModal(false)
      router.push(`/escrow/${escrow_id}`)
    } catch {
      setError('Une erreur est survenue. Réessayez.')
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
      >
        <Shield className="w-4 h-4" />
        🔒 Payer en sécurité (Escrow)
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Paiement sécurisé</h2>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Explanation */}
            <div className="bg-blue-50 rounded-xl p-4 mb-5">
              <p className="text-sm text-blue-800 font-medium mb-1">🔒 Comment ça marche ?</p>
              <p className="text-sm text-blue-700">
                Votre paiement est sécurisé. Les fonds sont retenus jusqu'à ce que vous confirmiez la réception du bien ou service.
              </p>
            </div>

            {/* Listing */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="text-xs font-medium text-gray-500 mb-1">Annonce</p>
              <p className="font-semibold text-gray-900 text-sm line-clamp-2">{listingTitle}</p>
            </div>

            {/* Amount breakdown */}
            <div className="space-y-2 mb-5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Montant</span>
                <span className="font-medium">{formatXAF(amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Frais de plateforme (3%)</span>
                <span className="font-medium text-orange-600">+ {formatXAF(platformFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold border-t pt-2">
                <span>Total</span>
                <span className="text-blue-700">{formatXAF(total)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Méthode de paiement
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'mtn_momo' as const, label: 'MTN MoMo', color: 'bg-yellow-400' },
                    { value: 'orange_money' as const, label: 'Orange Money', color: 'bg-orange-500' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${
                        paymentMethod === method.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-6 h-6 ${method.color} rounded-full mx-auto mb-1`} />
                      <div className="text-xs font-medium text-gray-700">{method.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Smartphone className="w-4 h-4 inline mr-1" />
                  Numéro {paymentMethod === 'mtn_momo' ? 'MTN MoMo' : 'Orange Money'}
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600 text-sm">
                    +237
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 9))
                      setError('')
                    }}
                    placeholder={paymentMethod === 'mtn_momo' ? '67X XX XX XX' : '69X XX XX XX'}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || phone.length < 9}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    Payer en sécurité — {formatXAF(total)}
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400">
                Les fonds seront libérés au vendeur après votre confirmation de réception.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
