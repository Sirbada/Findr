'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle, XCircle, Smartphone, AlertCircle, Globe, ExternalLink } from 'lucide-react'
import { Button } from './Button'
import { orangeMoneyService, orangeMoneyTranslations, OrangeMoneyStatus } from '@/lib/payments/orange-money'
import { mtnMomoService, mtnMomoTranslations, MTNMoMoStatus } from '@/lib/payments/mtn-momo'
import { paypalService, paypalTranslations, convertFromXAF, PayPalStatus } from '@/lib/payments/paypal'
import { formatXAF } from '@/lib/payments/providers'
import { useTranslation } from '@/lib/i18n/context'

type PaymentStatus = 'idle' | 'phone_input' | 'processing' | 'waiting' | 'success' | 'failed'

interface PaymentButtonProps {
  amount: number
  orderId: string
  description: string
  onSuccess?: (transactionId: string) => void
  onError?: (error: string) => void
  disabled?: boolean
}

/**
 * Orange Money Payment Button
 */
export function OrangeMoneyButton({ 
  amount, 
  orderId, 
  description, 
  onSuccess, 
  onError,
  disabled 
}: PaymentButtonProps) {
  const { lang } = useTranslation()
  const t = orangeMoneyTranslations[lang]
  
  const [status, setStatus] = useState<PaymentStatus>('idle')
  const [phone, setPhone] = useState('')
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)

  // Poll for payment status
  useEffect(() => {
    if (status !== 'waiting' || !transactionId) return

    const pollInterval = setInterval(async () => {
      const result = await orangeMoneyService.checkStatus(transactionId)
      
      if (result.status === 'SUCCESSFUL') {
        setStatus('success')
        onSuccess?.(transactionId)
        clearInterval(pollInterval)
      } else if (result.status === 'FAILED' || result.status === 'CANCELLED' || result.status === 'EXPIRED') {
        setStatus('failed')
        setError(t[result.status?.toLowerCase() as keyof typeof t] || t.failed)
        onError?.(result.error || 'Payment failed')
        clearInterval(pollInterval)
      }

      setPollCount(c => c + 1)
      
      // Timeout after 2 minutes
      if (pollCount > 24) {
        setStatus('failed')
        setError(t.expired)
        clearInterval(pollInterval)
      }
    }, 5000)

    return () => clearInterval(pollInterval)
  }, [status, transactionId, pollCount])

  const handleInitiate = async () => {
    if (!phone || phone.length < 9) {
      setError(t.invalidNumber)
      return
    }

    setStatus('processing')
    setError(null)

    try {
      const result = await orangeMoneyService.initiatePayment({
        amount,
        phone: `237${phone}`,
        orderId,
        description
      })

      if (result.success && result.transactionId) {
        setTransactionId(result.transactionId)
        setStatus('waiting')
      } else {
        setStatus('failed')
        setError(result.error || t.failed)
        onError?.(result.error || 'Payment failed')
      }
    } catch (err) {
      setStatus('failed')
      setError(t.failed)
      onError?.('Payment failed')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setPhone('')
    setTransactionId(null)
    setError(null)
    setPollCount(0)
  }

  // Status: Success
  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <p className="font-semibold text-green-700">{t.success}</p>
      </div>
    )
  }

  // Status: Failed
  if (status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="text-center mb-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="font-semibold text-red-700">{error || t.failed}</p>
        </div>
        <Button onClick={handleReset} variant="outline" className="w-full">
          Réessayer
        </Button>
      </div>
    )
  }

  // Status: Waiting for user authorization
  if (status === 'waiting') {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
        <div className="animate-pulse">
          <Smartphone className="w-12 h-12 text-orange-500 mx-auto mb-2" />
        </div>
        <p className="font-semibold text-orange-700 mb-1">{t.waitingAuth}</p>
        <p className="text-sm text-orange-600">{t.checkPhone}</p>
        <p className="text-xs text-orange-500 mt-2">{t.enterPin}</p>
        <div className="mt-4">
          <Loader2 className="w-5 h-5 animate-spin text-orange-500 mx-auto" />
        </div>
      </div>
    )
  }

  // Status: Idle - Show button
  if (status === 'idle') {
    return (
      <button
        onClick={() => setStatus('phone_input')}
        disabled={disabled}
        className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
          <span className="text-orange-600 font-bold text-sm">OM</span>
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-gray-900">Orange Money</p>
          <p className="text-sm text-gray-500">{t.fees}</p>
        </div>
        <span className="font-semibold text-orange-600">{formatXAF(amount)}</span>
      </button>
    )
  }

  // Status: Phone Input
  return (
    <div className="border-2 border-orange-300 bg-orange-50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <span className="text-orange-600 font-bold text-sm">OM</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">Orange Money</p>
          <p className="text-sm text-orange-600 font-medium">{formatXAF(amount)}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numéro Orange Money
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
              setError(null)
            }}
            placeholder="69X XX XX XX"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          onClick={handleInitiate}
          size="sm"
          className="flex-1 bg-orange-500 hover:bg-orange-600"
          disabled={status === 'processing' || phone.length < 9}
        >
          {status === 'processing' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Payer'
          )}
        </Button>
      </div>
    </div>
  )
}

/**
 * MTN Mobile Money Payment Button
 */
export function MTNMoMoButton({ 
  amount, 
  orderId, 
  description, 
  onSuccess, 
  onError,
  disabled 
}: PaymentButtonProps) {
  const { lang } = useTranslation()
  const t = mtnMomoTranslations[lang]
  
  const [status, setStatus] = useState<PaymentStatus>('idle')
  const [phone, setPhone] = useState('')
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)

  // Poll for payment status
  useEffect(() => {
    if (status !== 'waiting' || !referenceId) return

    const pollInterval = setInterval(async () => {
      const result = await mtnMomoService.checkStatus(referenceId)
      
      if (result.status === 'SUCCESSFUL') {
        setStatus('success')
        onSuccess?.(referenceId)
        clearInterval(pollInterval)
      } else if (['FAILED', 'CANCELLED', 'REJECTED', 'TIMEOUT'].includes(result.status || '')) {
        setStatus('failed')
        setError(t[result.status?.toLowerCase() as keyof typeof t] || t.failed)
        onError?.(result.error || 'Payment failed')
        clearInterval(pollInterval)
      }

      setPollCount(c => c + 1)
      
      if (pollCount > 24) {
        setStatus('failed')
        setError(t.timeout)
        clearInterval(pollInterval)
      }
    }, 5000)

    return () => clearInterval(pollInterval)
  }, [status, referenceId, pollCount])

  const handleInitiate = async () => {
    if (!phone || phone.length < 9) {
      setError(t.invalidNumber)
      return
    }

    setStatus('processing')
    setError(null)

    try {
      const result = await mtnMomoService.initiatePayment({
        amount,
        phone: `237${phone}`,
        orderId,
        description
      })

      if (result.success && result.referenceId) {
        setReferenceId(result.referenceId)
        setStatus('waiting')
      } else {
        setStatus('failed')
        setError(result.error || t.failed)
        onError?.(result.error || 'Payment failed')
      }
    } catch (err) {
      setStatus('failed')
      setError(t.failed)
      onError?.('Payment failed')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setPhone('')
    setReferenceId(null)
    setError(null)
    setPollCount(0)
  }

  // Status: Success
  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <p className="font-semibold text-green-700">{t.success}</p>
      </div>
    )
  }

  // Status: Failed
  if (status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="text-center mb-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="font-semibold text-red-700">{error || t.failed}</p>
        </div>
        <Button onClick={handleReset} variant="outline" className="w-full">
          Réessayer
        </Button>
      </div>
    )
  }

  // Status: Waiting for user authorization
  if (status === 'waiting') {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
        <div className="animate-pulse">
          <Smartphone className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
        </div>
        <p className="font-semibold text-yellow-700 mb-1">{t.waitingAuth}</p>
        <p className="text-sm text-yellow-600">{t.checkPhone}</p>
        <p className="text-xs text-yellow-500 mt-2">{t.enterPin}</p>
        <div className="mt-4">
          <Loader2 className="w-5 h-5 animate-spin text-yellow-600 mx-auto" />
        </div>
      </div>
    )
  }

  // Status: Idle - Show button
  if (status === 'idle') {
    return (
      <button
        onClick={() => setStatus('phone_input')}
        disabled={disabled}
        className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-500 hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
          <span className="text-yellow-700 font-bold text-sm">MTN</span>
        </div>
        <div className="flex-1 text-left">
          <p className="font-semibold text-gray-900">MTN Mobile Money</p>
          <p className="text-sm text-gray-500">{t.fees}</p>
        </div>
        <span className="font-semibold text-yellow-600">{formatXAF(amount)}</span>
      </button>
    )
  }

  // Status: Phone Input
  return (
    <div className="border-2 border-yellow-300 bg-yellow-50 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
          <span className="text-yellow-700 font-bold text-sm">MTN</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">MTN Mobile Money</p>
          <p className="text-sm text-yellow-600 font-medium">{formatXAF(amount)}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numéro MTN MoMo
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
              setError(null)
            }}
            placeholder="67X XX XX XX"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleReset}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          onClick={handleInitiate}
          size="sm"
          className="flex-1 bg-yellow-500 hover:bg-yellow-600"
          disabled={status === 'processing' || phone.length < 9}
        >
          {status === 'processing' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            'Payer'
          )}
        </Button>
      </div>
    </div>
  )
}

/**
 * PayPal Payment Button
 * For international users / diaspora
 */
export function PayPalButton({ 
  amount, 
  orderId, 
  description, 
  onSuccess, 
  onError,
  disabled 
}: PaymentButtonProps) {
  const { lang } = useTranslation()
  const t = paypalTranslations[lang]
  
  const [status, setStatus] = useState<PaymentStatus>('idle')
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)
  
  // Convert amount to EUR for display
  const amountEUR = convertFromXAF(amount, 'EUR')

  // Poll for payment status after redirect
  useEffect(() => {
    if (status !== 'waiting' || !paypalOrderId) return

    const pollInterval = setInterval(async () => {
      const result = await paypalService.getOrderStatus(paypalOrderId)
      
      if (result.status === 'APPROVED') {
        // Capture the payment
        const captureResult = await paypalService.captureOrder(paypalOrderId)
        if (captureResult.success) {
          setStatus('success')
          onSuccess?.(captureResult.transactionId || paypalOrderId)
          clearInterval(pollInterval)
        }
      } else if (result.status === 'COMPLETED') {
        setStatus('success')
        onSuccess?.(paypalOrderId)
        clearInterval(pollInterval)
      } else if (result.status === 'VOIDED') {
        setStatus('failed')
        setError(t.cancelled)
        clearInterval(pollInterval)
      }

      setPollCount(c => c + 1)
      
      // Timeout after 5 minutes
      if (pollCount > 60) {
        setStatus('failed')
        setError(t.failed)
        clearInterval(pollInterval)
      }
    }, 5000)

    return () => clearInterval(pollInterval)
  }, [status, paypalOrderId, pollCount])

  const handleInitiate = async () => {
    setStatus('processing')
    setError(null)

    try {
      const result = await paypalService.createOrder({
        amount,
        orderId,
        description
      })

      if (result.success && result.orderId) {
        setPaypalOrderId(result.orderId)
        setStatus('waiting')
        
        // In production, would redirect to result.approvalUrl
        // For demo, we simulate the approval
        console.log('[DEMO] PayPal approval URL:', result.approvalUrl)
      } else {
        setStatus('failed')
        setError(result.error || t.failed)
        onError?.(result.error || 'Payment failed')
      }
    } catch (err) {
      setStatus('failed')
      setError(t.failed)
      onError?.('Payment failed')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setPaypalOrderId(null)
    setError(null)
    setPollCount(0)
  }

  // Status: Success
  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <p className="font-semibold text-green-700">{t.success}</p>
      </div>
    )
  }

  // Status: Failed
  if (status === 'failed') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="text-center mb-4">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
          <p className="font-semibold text-red-700">{error || t.failed}</p>
        </div>
        <Button onClick={handleReset} variant="outline" className="w-full">
          Réessayer
        </Button>
      </div>
    )
  }

  // Status: Waiting for PayPal approval
  if (status === 'waiting') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
        <div className="animate-pulse">
          <Globe className="w-12 h-12 text-blue-600 mx-auto mb-2" />
        </div>
        <p className="font-semibold text-blue-700 mb-1">{t.waitingApproval}</p>
        <p className="text-sm text-blue-600">{t.redirecting}</p>
        <div className="mt-4">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600 mx-auto" />
        </div>
        <p className="text-xs text-blue-500 mt-3">
          {lang === 'fr' ? '(Mode démo: validation auto en 3s)' : '(Demo: auto-approval in 3s)'}
        </p>
      </div>
    )
  }

  // Status: Processing
  if (status === 'processing') {
    return (
      <div className="border-2 border-blue-300 bg-blue-50 rounded-xl p-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
        <p className="text-blue-700">{t.processing}</p>
      </div>
    )
  }

  // Status: Idle - Show button
  return (
    <button
      onClick={handleInitiate}
      disabled={disabled}
      className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="w-12 h-12 bg-[#003087] rounded-xl flex items-center justify-center">
        <span className="text-white font-bold text-xs">Pay</span>
        <span className="text-[#009cde] font-bold text-xs">Pal</span>
      </div>
      <div className="flex-1 text-left">
        <p className="font-semibold text-gray-900">PayPal</p>
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Globe className="w-3 h-3" />
          {t.diaspora}
        </p>
      </div>
      <div className="text-right">
        <span className="font-semibold text-blue-600">€{amountEUR.toFixed(2)}</span>
        <p className="text-xs text-gray-400">{formatXAF(amount)}</p>
      </div>
    </button>
  )
}

/**
 * Complete Checkout Component
 * Shows all available payment methods
 */
interface CheckoutProps {
  amount: number
  orderId: string
  description: string
  onSuccess?: (provider: string, transactionId: string) => void
  onCancel?: () => void
}

export function Checkout({ amount, orderId, description, onSuccess, onCancel }: CheckoutProps) {
  const { lang } = useTranslation()
  const [completedProvider, setCompletedProvider] = useState<string | null>(null)
  const [completedTxId, setCompletedTxId] = useState<string | null>(null)

  const handlePaymentSuccess = (provider: string, txId: string) => {
    setCompletedProvider(provider)
    setCompletedTxId(txId)
    onSuccess?.(provider, txId)
  }

  if (completedProvider && completedTxId) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {lang === 'fr' ? 'Paiement réussi!' : 'Payment successful!'}
          </h2>
          <p className="text-gray-600 mb-4">
            {lang === 'fr' ? 'Votre paiement a été confirmé.' : 'Your payment has been confirmed.'}
          </p>
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <p className="text-gray-500">Transaction ID</p>
            <p className="font-mono text-gray-900">{completedTxId.slice(0, 20)}...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {lang === 'fr' ? 'Choisir un moyen de paiement' : 'Choose payment method'}
        </h2>
        <p className="text-gray-500 mt-1">{description}</p>
        <p className="text-2xl font-bold text-emerald-600 mt-2">{formatXAF(amount)}</p>
      </div>

      {/* Local Payment Methods (Cameroon) */}
      <div className="space-y-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-2">
          🇨🇲 {lang === 'fr' ? 'Paiement local' : 'Local payment'}
        </p>
        
        <OrangeMoneyButton
          amount={amount}
          orderId={orderId}
          description={description}
          onSuccess={(txId) => handlePaymentSuccess('orange_money', txId)}
        />
        
        <MTNMoMoButton
          amount={amount}
          orderId={orderId}
          description={description}
          onSuccess={(txId) => handlePaymentSuccess('mtn_momo', txId)}
        />
      </div>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-gray-500">
            {lang === 'fr' ? 'ou paiement international' : 'or international payment'}
          </span>
        </div>
      </div>

      {/* International Payment (Diaspora) */}
      <div className="space-y-3">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide flex items-center gap-2">
          🌍 {lang === 'fr' ? 'Diaspora / International' : 'Diaspora / International'}
        </p>
        
        <PayPalButton
          amount={amount}
          orderId={orderId}
          description={description}
          onSuccess={(txId) => handlePaymentSuccess('paypal', txId)}
        />

        {/* Wave - Coming Soon */}
        <button
          disabled
          className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl opacity-50 cursor-not-allowed"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-blue-600 font-bold">W</span>
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-gray-900">Wave</p>
            <p className="text-sm text-gray-500">
              {lang === 'fr' ? 'Bientôt disponible' : 'Coming soon'}
            </p>
          </div>
        </button>
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          {lang === 'fr' ? 'Annuler' : 'Cancel'}
        </button>
      )}
    </div>
  )
}
