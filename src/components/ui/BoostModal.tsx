'use client'

import { useState } from 'react'
import { X, Zap, CheckCircle, Star, AlertTriangle, Loader2, Smartphone, AlertCircle } from 'lucide-react'

interface BoostModalProps {
  isOpen: boolean
  onClose: () => void
  listingId: string
  listingType: string
  listingTitle: string
}

type BoostOption = {
  id: string
  boost_type: 'featured' | 'top' | 'urgent'
  duration_days: number
  amount: number
  label: string
  description: string
  icon: React.ReactNode
  badge?: string
}

const BOOST_OPTIONS: BoostOption[] = [
  {
    id: 'featured-3',
    boost_type: 'featured',
    duration_days: 3,
    amount: 2000,
    label: 'Mise en avant — 3 jours',
    description: 'Apparaissez en tête des résultats de recherche',
    icon: <Star className="w-5 h-5 text-yellow-500" />,
  },
  {
    id: 'featured-7',
    boost_type: 'featured',
    duration_days: 7,
    amount: 4000,
    label: 'Mise en avant — 7 jours',
    description: 'Apparaissez en tête des résultats de recherche',
    icon: <Star className="w-5 h-5 text-yellow-500" />,
    badge: 'Populaire',
  },
  {
    id: 'urgent-7',
    boost_type: 'urgent',
    duration_days: 7,
    amount: 1500,
    label: 'Badge URGENT — 7 jours',
    description: 'Badge rouge URGENT visible sur votre annonce',
    icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
  },
]

type PaymentMethod = 'mtn_momo' | 'orange_money' | 'paypal'
type FlowStep = 'select' | 'paying' | 'success'

export function BoostModal({ isOpen, onClose, listingId, listingType, listingTitle }: BoostModalProps) {
  const [selectedOption, setSelectedOption] = useState<BoostOption | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mtn_momo')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<FlowStep>('select')
  const [error, setError] = useState('')

  if (!isOpen) return null

  function formatXAF(value: number): string {
    return value.toLocaleString('fr-FR') + ' XAF'
  }

  function handleClose() {
    setStep('select')
    setError('')
    setSelectedOption(null)
    setPhone('')
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedOption) {
      setError('Veuillez sélectionner une option de boost.')
      return
    }

    // Validate phone for mobile money methods
    if ((paymentMethod === 'mtn_momo' || paymentMethod === 'orange_money') && phone.length < 9) {
      setError('Veuillez entrer un numéro de téléphone valide.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Step 1: Create boost record (status='pending')
      const boostRes = await fetch('/api/boost', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listingId,
          listing_type: listingType,
          boost_type: selectedOption.boost_type,
          duration_days: selectedOption.duration_days,
          amount_paid: selectedOption.amount,
          payment_method: paymentMethod,
        }),
      })

      if (!boostRes.ok) {
        const data = await boostRes.json().catch(() => ({}))
        setError(data.error || 'Erreur lors de la création du boost.')
        setLoading(false)
        return
      }

      const { id: boost_id } = await boostRes.json()

      // Step 2: Initiate payment based on method
      if (paymentMethod === 'mtn_momo') {
        const payRes = await fetch('/api/payments/boost/momo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            boost_id,
            amount: selectedOption.amount,
            phone: `237${phone}`,
          }),
        })

        if (!payRes.ok) {
          const data = await payRes.json().catch(() => ({}))
          setError(data.error || 'Erreur de paiement MTN MoMo.')
          setLoading(false)
          return
        }

        setStep('success')
      } else if (paymentMethod === 'orange_money') {
        const payRes = await fetch('/api/payments/boost/orange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            boost_id,
            amount: selectedOption.amount,
            phone: `237${phone}`,
          }),
        })

        if (!payRes.ok) {
          const data = await payRes.json().catch(() => ({}))
          setError(data.error || 'Erreur de paiement Orange Money.')
          setLoading(false)
          return
        }

        setStep('success')
      } else if (paymentMethod === 'paypal') {
        const payRes = await fetch('/api/payments/boost/paypal', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            boost_id,
            amount: selectedOption.amount,
          }),
        })

        if (!payRes.ok) {
          const data = await payRes.json().catch(() => ({}))
          setError(data.error || 'Erreur de paiement PayPal.')
          setLoading(false)
          return
        }

        const { approval_url } = await payRes.json()
        if (approval_url) {
          window.location.href = approval_url
          return
        }

        setStep('success')
      }
    } catch {
      setError('Une erreur est survenue. Réessayez.')
    } finally {
      setLoading(false)
    }
  }

  const needsPhone = paymentMethod === 'mtn_momo' || paymentMethod === 'orange_money'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Booster l&apos;annonce</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {step === 'success' ? (
          /* Success State */
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Boost activé !</h3>
            <p className="text-gray-600 mb-6">
              Votre annonce sera mise en avant sous peu. Confirmez le paiement sur votre téléphone si demandé.
            </p>
            <button
              onClick={handleClose}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Listing info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Annonce à booster</p>
              <p className="font-semibold text-gray-900 text-sm line-clamp-2">{listingTitle}</p>
            </div>

            {/* Boost options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choisissez votre boost
              </label>
              <div className="space-y-3">
                {BOOST_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOption(option)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all relative ${
                      selectedOption?.id === option.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {option.badge && (
                      <span className="absolute top-3 right-3 text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-medium">
                        {option.badge}
                      </span>
                    )}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                        {option.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-gray-900 text-sm">{option.label}</p>
                          <p className="font-bold text-green-700 text-sm flex-shrink-0">
                            {formatXAF(option.amount)}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Payment method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Méthode de paiement
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'mtn_momo' as const, label: 'MTN MoMo', color: 'bg-yellow-400' },
                  { value: 'orange_money' as const, label: 'Orange Money', color: 'bg-orange-500' },
                  { value: 'paypal' as const, label: 'PayPal', color: 'bg-blue-600' },
                ].map((method) => (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      paymentMethod === method.value
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-6 h-6 ${method.color} rounded-full mx-auto mb-1`} />
                    <div className="text-xs font-medium text-gray-700">{method.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Phone input for mobile money */}
            {needsPhone && (
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
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Vous recevrez une demande de confirmation sur votre téléphone.
                </p>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
                💳 Vous serez redirigé vers PayPal pour finaliser le paiement.
              </div>
            )}

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
              disabled={loading || !selectedOption}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Paiement en cours...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  {selectedOption
                    ? `Payer ${formatXAF(selectedOption.amount)}`
                    : 'Sélectionnez un boost'}
                </>
              )}
            </button>

            <p className="text-xs text-center text-gray-400">
              Le boost sera activé après confirmation du paiement.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
