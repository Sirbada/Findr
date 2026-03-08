'use client'

import { useState } from 'react'
import { X, Calendar, MessageSquare, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createBooking, calculateBookingFees, BookingRequest } from '@/lib/supabase/booking'
import { useTranslation } from '@/lib/i18n/context'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  listing: {
    id: string
    title: string
    price: number
    images: string[]
    user_id: string
    furnished: boolean
    city: string
    neighborhood?: string
  }
  currentUserId?: string
}

export function BookingModal({ isOpen, onClose, listing, currentUserId }: BookingModalProps) {
  const { t, lang } = useTranslation()
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form data
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [message, setMessage] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'orange_money' | 'mtn_momo' | 'paypal'>('orange_money')
  const [bookingId, setBookingId] = useState('')

  const content = {
    title: lang === 'fr' ? 'Réserver ce logement' : 'Book this property',
    step1: lang === 'fr' ? 'Détails de réservation' : 'Booking details',
    step2: lang === 'fr' ? 'Paiement' : 'Payment',
    step3: lang === 'fr' ? 'Confirmation' : 'Confirmation',
    checkInLabel: lang === 'fr' ? 'Date d\'emménagement' : 'Move-in date',
    checkOutLabel: lang === 'fr' ? 'Fin de bail (optionnel)' : 'Move-out date (optional)',
    messageLabel: lang === 'fr' ? 'Message au propriétaire' : 'Message to landlord',
    messagePlaceholder: lang === 'fr' 
      ? 'Présentez-vous et expliquez pourquoi vous êtes intéressé...'
      : 'Introduce yourself and explain why you\'re interested...',
    priceBreakdown: lang === 'fr' ? 'Détail des prix' : 'Price breakdown',
    monthlyRent: lang === 'fr' ? 'Loyer mensuel' : 'Monthly rent',
    serviceFee: lang === 'fr' ? 'Frais de service (5%)' : 'Service fee (5%)',
    deposit: lang === 'fr' ? 'Caution (2 mois)' : 'Security deposit (2 months)',
    total: 'Total',
    paymentMethod: lang === 'fr' ? 'Méthode de paiement' : 'Payment method',
    bookingSuccess: lang === 'fr' ? 'Demande envoyée avec succès!' : 'Booking request sent successfully!',
    bookingSuccessDesc: lang === 'fr' 
      ? 'Le propriétaire va examiner votre demande et vous répondra sous 24h.'
      : 'The landlord will review your request and respond within 24 hours.',
    viewBookings: lang === 'fr' ? 'Voir mes réservations' : 'View my bookings',
    continue: lang === 'fr' ? 'Continuer' : 'Continue',
    payNow: lang === 'fr' ? 'Payer maintenant' : 'Pay now',
    cancel: lang === 'fr' ? 'Annuler' : 'Cancel',
    processing: lang === 'fr' ? 'Traitement...' : 'Processing...',
    loginRequired: lang === 'fr' 
      ? 'Connectez-vous pour faire une réservation'
      : 'Please login to make a booking',
    ownListing: lang === 'fr' 
      ? 'Vous ne pouvez pas réserver votre propre logement'
      : 'You cannot book your own property',
    minDate: lang === 'fr' ? 'La date doit être dans le futur' : 'Date must be in the future',
    fillRequired: lang === 'fr' ? 'Veuillez remplir tous les champs requis' : 'Please fill all required fields'
  }

  if (!isOpen) return null

  // Calculate fees
  const fees = calculateBookingFees(listing.price)

  // Validation
  const isOwnListing = currentUserId === listing.user_id
  const isLoggedIn = !!currentUserId

  const handleBookingSubmit = async () => {
    if (!isLoggedIn) {
      setError(content.loginRequired)
      return
    }

    if (isOwnListing) {
      setError(content.ownListing)
      return
    }

    if (!checkIn || !message.trim()) {
      setError(content.fillRequired)
      return
    }

    const today = new Date().toISOString().split('T')[0]
    if (checkIn <= today) {
      setError(content.minDate)
      return
    }

    setError('')
    setLoading(true)

    try {
      const bookingRequest: BookingRequest & { tenant_id: string } = {
        listing_id: listing.id,
        check_in: checkIn,
        check_out: checkOut || null,
        message: message.trim(),
        tenant_id: currentUserId!
      }

      const booking = await createBooking(bookingRequest)
      setBookingId(booking.id)
      setStep('payment')
    } catch (err) {
      console.error('Booking error:', err)
      setError('Erreur lors de la création de la réservation')
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      setStep('success')
    } catch (err) {
      setError('Erreur lors du paiement')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {content.title}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center ${step === 'details' ? 'text-blue-600' : step === 'payment' || step === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'details' ? 'border-blue-600 bg-blue-50' : step === 'payment' || step === 'success' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                {step === 'payment' || step === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">1</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium">{content.step1}</span>
            </div>
            <div className={`h-px bg-gray-300 flex-1 ${step === 'payment' || step === 'success' ? 'bg-green-600' : ''}`} />
            <div className={`flex items-center ${step === 'payment' ? 'text-blue-600' : step === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'payment' ? 'border-blue-600 bg-blue-50' : step === 'success' ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>
                {step === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">2</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium">{content.step2}</span>
            </div>
            <div className={`h-px bg-gray-300 flex-1 ${step === 'success' ? 'bg-green-600' : ''}`} />
            <div className={`flex items-center ${step === 'success' ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step === 'success' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>
                <span className="text-sm font-medium">3</span>
              </div>
              <span className="ml-2 text-sm font-medium">{content.step3}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Info */}
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {listing.images[0] ? (
                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{listing.title}</h3>
              <p className="text-sm text-gray-500">
                {listing.neighborhood}, {listing.city}
              </p>
              <p className="text-lg font-bold text-blue-600">
                {new Intl.NumberFormat('fr-FR').format(listing.price)} XAF/mois
              </p>
            </div>
          </div>

          {/* Step 1: Booking Details */}
          {step === 'details' && (
            <div className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {/* Login Required */}
              {!isLoggedIn && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <p className="text-blue-700 font-medium mb-3">{content.loginRequired}</p>
                  <Button onClick={() => window.location.href = '/login'}>
                    Se connecter
                  </Button>
                </div>
              )}

              {/* Own Listing */}
              {isOwnListing && isLoggedIn && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
                  <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                  <p className="text-amber-700 font-medium">{content.ownListing}</p>
                </div>
              )}

              {/* Form */}
              {isLoggedIn && !isOwnListing && (
                <>
                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {content.checkInLabel} *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                          min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {content.checkOutLabel}
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="date"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                          min={checkIn || undefined}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {content.messageLabel} *
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-4 w-5 h-5 text-gray-400" />
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={content.messagePlaceholder}
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">{content.priceBreakdown}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{content.monthlyRent}</span>
                        <span>{new Intl.NumberFormat('fr-FR').format(fees.monthlyRent)} XAF</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{content.serviceFee}</span>
                        <span>{new Intl.NumberFormat('fr-FR').format(fees.serviceFee)} XAF</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>{content.deposit}</span>
                        <span>{new Intl.NumberFormat('fr-FR').format(fees.depositAmount)} XAF</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-semibold">
                        <span>{content.total}</span>
                        <span className="text-blue-600">{new Intl.NumberFormat('fr-FR').format(fees.totalAmount)} XAF</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 'payment' && (
            <div className="space-y-6">
              {/* Payment Methods */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">{content.paymentMethod}</h4>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="radio"
                      name="payment"
                      value="orange_money"
                      checked={paymentMethod === 'orange_money'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-500 rounded"></div>
                      <span className="font-medium">Orange Money</span>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="radio"
                      name="payment"
                      value="mtn_momo"
                      checked={paymentMethod === 'mtn_momo'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-yellow-500 rounded"></div>
                      <span className="font-medium">MTN Mobile Money</span>
                    </div>
                  </label>
                  <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-500">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3"
                    />
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded"></div>
                      <span className="font-medium">PayPal</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Total */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900">{content.total}</span>
                  <span className="text-xl font-bold text-blue-600">
                    {new Intl.NumberFormat('fr-FR').format(fees.totalAmount)} XAF
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {content.bookingSuccess}
                </h3>
                <p className="text-gray-600">
                  {content.bookingSuccessDesc}
                </p>
              </div>
              <Button 
                onClick={() => window.location.href = '/dashboard/bookings'}
                className="mx-auto"
              >
                {content.viewBookings}
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'success' && (
          <div className="flex items-center justify-between p-6 border-t bg-gray-50">
            <Button variant="secondary" onClick={onClose}>
              {content.cancel}
            </Button>
            
            {step === 'details' && (
              <Button 
                onClick={handleBookingSubmit}
                disabled={loading || !isLoggedIn || isOwnListing}
              >
                {loading ? content.processing : content.continue}
              </Button>
            )}
            
            {step === 'payment' && (
              <Button onClick={handlePayment} disabled={loading}>
                <CreditCard className="w-4 h-4 mr-2" />
                {loading ? content.processing : content.payNow}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}