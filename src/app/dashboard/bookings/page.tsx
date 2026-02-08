'use client'

import { useState, useEffect } from 'react'
import { 
  Calendar, Clock, MapPin, User, CheckCircle, 
  XCircle, AlertTriangle, Phone, MessageSquare,
  CreditCard, FileText, Star
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { UserProfileCard } from '@/components/profile/UserProfileCard'
import { getTenantBookings, getLandlordBookings, Booking } from '@/lib/supabase/booking'
import { getPublicProfile, PublicProfile } from '@/lib/supabase/profiles'
import { useTranslation } from '@/lib/i18n/context'

export default function BookingsPage() {
  const { t, lang } = useTranslation()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'tenant' | 'landlord'>('tenant')

  // Mock current user ID (replace with real auth)
  const currentUserId = 'demo-user-current'

  const content = {
    title: lang === 'fr' ? 'Mes réservations' : 'My bookings',
    asRenter: lang === 'fr' ? 'En tant que locataire' : 'As renter',
    asOwner: lang === 'fr' ? 'En tant que propriétaire' : 'As owner',
    noBookings: lang === 'fr' ? 'Aucune réservation trouvée' : 'No bookings found',
    noBookingsDesc: lang === 'fr' 
      ? 'Vous n\'avez pas encore fait de réservation.'
      : 'You haven\'t made any bookings yet.',
    browseListings: lang === 'fr' ? 'Parcourir les annonces' : 'Browse listings',
    property: lang === 'fr' ? 'Propriété' : 'Property',
    dates: lang === 'fr' ? 'Dates' : 'Dates',
    status: lang === 'fr' ? 'Statut' : 'Status',
    total: lang === 'fr' ? 'Total' : 'Total',
    checkIn: lang === 'fr' ? 'Arrivée' : 'Check-in',
    checkOut: lang === 'fr' ? 'Départ' : 'Check-out',
    monthlyRent: lang === 'fr' ? 'Loyer mensuel' : 'Monthly rent',
    deposit: lang === 'fr' ? 'Caution' : 'Deposit',
    serviceFee: lang === 'fr' ? 'Frais de service' : 'Service fee',
    contact: lang === 'fr' ? 'Contacter' : 'Contact',
    cancel: lang === 'fr' ? 'Annuler' : 'Cancel',
    approve: lang === 'fr' ? 'Approuver' : 'Approve',
    reject: lang === 'fr' ? 'Rejeter' : 'Reject',
    writeReview: lang === 'fr' ? 'Laisser un avis' : 'Write review',
    viewContract: lang === 'fr' ? 'Voir le contrat' : 'View contract',
    payNow: lang === 'fr' ? 'Payer maintenant' : 'Pay now',
    statusLabels: {
      pending: lang === 'fr' ? 'En attente' : 'Pending',
      confirmed: lang === 'fr' ? 'Confirmé' : 'Confirmed',
      active: lang === 'fr' ? 'Actif' : 'Active',
      completed: lang === 'fr' ? 'Terminé' : 'Completed',
      cancelled: lang === 'fr' ? 'Annulé' : 'Cancelled'
    },
    paymentStatusLabels: {
      pending: lang === 'fr' ? 'En attente' : 'Pending payment',
      processing: lang === 'fr' ? 'En cours' : 'Processing',
      completed: lang === 'fr' ? 'Payé' : 'Paid',
      failed: lang === 'fr' ? 'Échoué' : 'Failed',
      refunded: lang === 'fr' ? 'Remboursé' : 'Refunded'
    },
    tenant: lang === 'fr' ? 'Locataire' : 'Tenant',
    landlord: lang === 'fr' ? 'Propriétaire' : 'Landlord',
    message: lang === 'fr' ? 'Message' : 'Message',
    response: lang === 'fr' ? 'Réponse' : 'Response',
    noMessage: lang === 'fr' ? 'Aucun message' : 'No message',
    bookingDetails: lang === 'fr' ? 'Détails de la réservation' : 'Booking details'
  }

  // Get status color
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // Get payment status color
  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-orange-100 text-orange-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-purple-100 text-purple-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  // Get status icon
  const getStatusIcon = (status: string) => {
    const icons = {
      pending: <Clock className="w-4 h-4" />,
      confirmed: <CheckCircle className="w-4 h-4" />,
      active: <CheckCircle className="w-4 h-4" />,
      completed: <CheckCircle className="w-4 h-4" />,
      cancelled: <XCircle className="w-4 h-4" />
    }
    return icons[status as keyof typeof icons] || <AlertTriangle className="w-4 h-4" />
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(
      lang === 'fr' ? 'fr-FR' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    )
  }

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true)
      try {
        let bookingsData: Booking[] = []
        if (activeTab === 'tenant') {
          bookingsData = await getTenantBookings(currentUserId)
        } else {
          bookingsData = await getLandlordBookings(currentUserId)
        }
        setBookings(bookingsData)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [currentUserId, activeTab])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {content.title}
            </h1>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('tenant')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'tenant'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {content.asRenter}
                </button>
                <button
                  onClick={() => setActiveTab('landlord')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'landlord'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {content.asOwner}
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {content.noBookings}
              </h3>
              <p className="text-gray-500 mb-6">
                {content.noBookingsDesc}
              </p>
              <Button onClick={() => window.location.href = '/housing'}>
                {content.browseListings}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-start justify-between p-6 border-b border-gray-100">
                    <div className="flex gap-4">
                      {/* Property Image */}
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {booking.listing?.images?.[0] ? (
                          <img 
                            src={booking.listing.images[0]} 
                            alt={booking.listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        {/* Property Title */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {booking.listing?.title || 'Propriété'}
                        </h3>
                        
                        {/* Location */}
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{booking.listing?.city}</span>
                        </div>

                        {/* Dates */}
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>
                            {formatDate(booking.check_in)}
                            {booking.check_out && ` → ${formatDate(booking.check_out)}`}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="text-lg font-bold text-blue-600">
                          {formatPrice(booking.total_amount)} XAF
                        </div>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {content.statusLabels[booking.status as keyof typeof content.statusLabels]}
                      </span>
                      
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(booking.payment_status)}`}>
                        <CreditCard className="w-3 h-3 mr-1" />
                        {content.paymentStatusLabels[booking.payment_status as keyof typeof content.paymentStatusLabels]}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Booking Details */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          {content.bookingDetails}
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">{content.monthlyRent}:</span>
                            <span className="font-medium">{formatPrice(booking.monthly_rent)} XAF</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{content.deposit}:</span>
                            <span className="font-medium">{formatPrice(booking.deposit_amount)} XAF</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">{content.serviceFee}:</span>
                            <span className="font-medium">{formatPrice(booking.service_fee)} XAF</span>
                          </div>
                          <hr className="my-2" />
                          <div className="flex justify-between font-semibold">
                            <span>{content.total}:</span>
                            <span className="text-blue-600">{formatPrice(booking.total_amount)} XAF</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          {activeTab === 'tenant' ? content.landlord : content.tenant}
                        </h4>
                        {(booking.landlord || booking.tenant) && (
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                              {(booking.landlord?.avatar_url || booking.tenant?.avatar_url) ? (
                                <img 
                                  src={booking.landlord?.avatar_url || booking.tenant?.avatar_url} 
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {booking.landlord?.full_name || booking.tenant?.full_name || 'Utilisateur'}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Button size="sm" variant="secondary">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  {content.contact}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Messages */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">
                          {content.message}
                        </h4>
                        <div className="space-y-3 text-sm">
                          {booking.tenant_message && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <div className="font-medium text-blue-900 mb-1">
                                {content.tenant}:
                              </div>
                              <p className="text-blue-800 text-sm">
                                {booking.tenant_message}
                              </p>
                            </div>
                          )}
                          
                          {booking.landlord_response && (
                            <div className="bg-green-50 p-3 rounded-lg">
                              <div className="font-medium text-green-900 mb-1">
                                {content.landlord}:
                              </div>
                              <p className="text-green-800 text-sm">
                                {booking.landlord_response}
                              </p>
                            </div>
                          )}
                          
                          {!booking.tenant_message && !booking.landlord_response && (
                            <div className="text-gray-500 text-sm">
                              {content.noMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100">
                      {/* Tenant Actions */}
                      {activeTab === 'tenant' && (
                        <>
                          {booking.status === 'pending' && booking.payment_status === 'pending' && (
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <CreditCard className="w-4 h-4 mr-1" />
                              {content.payNow}
                            </Button>
                          )}
                          
                          {booking.status === 'completed' && (
                            <Button size="sm" variant="secondary">
                              <Star className="w-4 h-4 mr-1" />
                              {content.writeReview}
                            </Button>
                          )}
                          
                          {booking.status === 'pending' && (
                            <Button size="sm" variant="secondary">
                              {content.cancel}
                            </Button>
                          )}
                        </>
                      )}

                      {/* Landlord Actions */}
                      {activeTab === 'landlord' && (
                        <>
                          {booking.status === 'pending' && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                {content.approve}
                              </Button>
                              <Button size="sm" variant="secondary">
                                <XCircle className="w-4 h-4 mr-1" />
                                {content.reject}
                              </Button>
                            </>
                          )}
                        </>
                      )}

                      {/* Common Actions */}
                      <Button size="sm" variant="secondary">
                        <FileText className="w-4 h-4 mr-1" />
                        {content.viewContract}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}