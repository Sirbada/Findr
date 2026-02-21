'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, MapPin, Fuel, Settings2, Users, Calendar,
  Heart, Share2, CheckCircle, Phone, MessageSquare, User,
  Car, Shield, ChevronLeft, ChevronRight, Star
} from 'lucide-react'
import { z } from 'zod'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'
import { getVehicle, Vehicle } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'
import { WhatsAppButton, WhatsAppFloatingButton } from '@/components/ui/WhatsAppButton'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export default function CarDetailPage() {
  const params = useParams()
  const { t, lang } = useTranslation()
  const [listing, setListing] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [bookingStatus, setBookingStatus] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingConflicts, setBookingConflicts] = useState<Array<{ start_date: string; end_date: string }>>([])
  const [bookingStep, setBookingStep] = useState<'idle' | 'requested' | 'confirm' | 'done'>('idle')

  const bookingSchema = z.object({
    startDate: z.string().min(1),
    endDate: z.string().min(1),
  })

  const daysBetween = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    const diff = Math.max(0, e.getTime() - s.getTime())
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const handleBooking = async () => {
    setBookingStatus('')
    const parsed = bookingSchema.safeParse({ startDate, endDate })
    if (!parsed.success || !listing) {
      setBookingStatus('Sélectionnez des dates valides.')
      return
    }
    setBookingLoading(true)
    setBookingStep('requested')
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicle_id: listing.id,
        start_date: startDate,
        end_date: endDate,
      }),
    })
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      setBookingStatus(error.error || 'Erreur de réservation. Réessayez.')
      setBookingConflicts(error.conflicts || [])
      setBookingStep('idle')
      setBookingLoading(false)
      return
    }
    setBookingStatus('Réservation créée. Confirmez sur votre téléphone.')
    setBookingConflicts([])
    setBookingStep('confirm')
    setBookingLoading(false)
  }

  useEffect(() => {
    async function fetchListing() {
      if (params.id) {
        const data = await getVehicle(params.id as string)
        setListing(data)
      }
      setLoading(false)
    }
    fetchListing()
  }, [params.id])

  // Translation helpers
  const getFuelType = (fuel: string | null) => {
    if (!fuel) return lang === 'fr' ? 'Non spécifié' : 'Not specified'
    const types: { [key: string]: string } = {
      petrol: t.fuelTypes.essence,
      essence: t.fuelTypes.essence,
      diesel: t.fuelTypes.diesel,
      electric: t.fuelTypes.electric,
      hybrid: t.fuelTypes.hybrid,
    }
    return types[fuel.toLowerCase()] || fuel
  }

  const getTransmission = (trans: string | null) => {
    if (!trans) return t.transmissionTypes.manual
    return trans === 'automatic' ? t.transmissionTypes.automatic : t.transmissionTypes.manual
  }

  // Translated static content
  const content = {
    notFound: lang === 'fr' ? 'Véhicule introuvable' : 'Vehicle not found',
    viewAll: lang === 'fr' ? 'Voir tous les véhicules' : 'View all vehicles',
    verifiedPro: lang === 'fr' ? 'Pro vérifié' : 'Verified Pro',
    fuel: lang === 'fr' ? 'Carburant' : 'Fuel',
    transmission: lang === 'fr' ? 'Transmission' : 'Transmission',
    seats: lang === 'fr' ? 'Places' : 'Seats',
    year: lang === 'fr' ? 'Année' : 'Year',
    description: t.detail.description,
    noDescription: lang === 'fr' 
      ? 'Véhicule en excellent état. Climatisation, Bluetooth, GPS disponibles. Kilométrage illimité. Assurance incluse.'
      : 'Vehicle in excellent condition. Air conditioning, Bluetooth, GPS available. Unlimited mileage. Insurance included.',
    included: lang === 'fr' ? 'Inclus dans la location' : 'Included in rental',
    includedItems: lang === 'fr' 
      ? ['Kilométrage illimité', 'Assurance de base', 'Assistance 24/7', 'Climatisation']
      : ['Unlimited mileage', 'Basic insurance', '24/7 Assistance', 'Air conditioning'],
    perDay: lang === 'fr' ? '/jour' : '/day',
    duration: lang === 'fr' ? 'Durée de location' : 'Rental duration',
    day: lang === 'fr' ? 'jour' : 'day',
    days: lang === 'fr' ? 'jours' : 'days',
    total: 'Total',
    bookNow: lang === 'fr' ? 'Réserver maintenant' : 'Book now',
    contactOwner: lang === 'fr' ? 'Contacter le loueur' : 'Contact owner',
    proOwner: lang === 'fr' ? 'Loueur Pro' : 'Pro Rental',
    reviews: lang === 'fr' ? 'avis' : 'reviews',
    securePayment: lang === 'fr' ? 'Paiement sécurisé' : 'Secure payment',
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{content.notFound}</h1>
            <p className="text-gray-500 mb-4">{t.listings.notFoundDesc}</p>
            <Link href="/cars">
              <Button>{content.viewAll}</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const images = listing.images?.length ? listing.images : ['https://images.unsplash.com/photo-1568844293986-8c1a5c14e3f7?w=800']
  const pricePerDay = listing.price_per_day || 35000
  const rentalDays = startDate && endDate ? daysBetween(startDate, endDate) : 1
  const totalPrice = pricePerDay * rentalDays

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)]">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white/90 border-b backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <Link href="/cars" className="flex items-center text-sm text-gray-600 hover:text-[color:var(--green-700)]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.listings.backToResults}
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery - Sixt Style */}
              <div className="bg-white rounded-3xl overflow-hidden shadow-[var(--shadow-soft-sm)]">
                <div className="relative h-[300px] md:h-[400px]">
                  <img
                    src={images[currentImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Navigation */}
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-[var(--shadow-soft-sm)] hover:bg-gray-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-[var(--shadow-soft-sm)] hover:bg-gray-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {listing.is_verified && (
                      <span className="bg-[color:var(--green-600)] text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        {content.verifiedPro}
                      </span>
                    )}
                  </div>

                  {/* Image counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {currentImage + 1} / {images.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 p-4 overflow-x-auto">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={`flex-shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 ${
                          currentImage === idx ? 'border-[color:var(--green-500)]' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="bg-white rounded-3xl shadow-[var(--shadow-soft-sm)] p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {listing.brand && (
                        <span className="bg-[color:var(--green-50)] text-[color:var(--green-700)] text-sm font-medium px-3 py-1 rounded-full">
                          {listing.brand}
                        </span>
                      )}
                      {listing.year && (
                        <span className="text-gray-500">{listing.year}</span>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {listing.title}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 border rounded-full hover:bg-gray-50">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button className="p-2 border rounded-full hover:bg-gray-50">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600 mb-6">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}</span>
                </div>

                {/* Specifications */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-[color:var(--green-50)] rounded-2xl p-4 text-center">
                    <Fuel className="w-6 h-6 mx-auto mb-2 text-[color:var(--green-600)]" />
                    <p className="text-sm text-gray-500">{content.fuel}</p>
                    <p className="font-semibold">{getFuelType(listing.fuel_type)}</p>
                  </div>
                  <div className="bg-[color:var(--green-50)] rounded-2xl p-4 text-center">
                    <Settings2 className="w-6 h-6 mx-auto mb-2 text-[color:var(--green-600)]" />
                    <p className="text-sm text-gray-500">{content.transmission}</p>
                    <p className="font-semibold">{getTransmission(listing.transmission)}</p>
                  </div>
                  <div className="bg-[color:var(--green-50)] rounded-2xl p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-[color:var(--green-600)]" />
                    <p className="text-sm text-gray-500">{content.seats}</p>
                    <p className="font-semibold">{listing.seats || 5}</p>
                  </div>
                  <div className="bg-[color:var(--green-50)] rounded-2xl p-4 text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-[color:var(--green-600)]" />
                    <p className="text-sm text-gray-500">{content.year}</p>
                    <p className="font-semibold">{listing.year || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-3xl shadow-[var(--shadow-soft-sm)] p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{content.description}</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {listing.description || content.noDescription}
                </p>
              </div>

              {/* Included - Sixt Style */}
              <div className="bg-white rounded-3xl shadow-[var(--shadow-soft-sm)] p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{content.included}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {content.includedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-green-700">
                      <span className="text-lg">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl shadow-[var(--shadow-soft)] p-6">
                {/* Price */}
                <div className="text-center mb-6 pb-6 border-b">
                  <span className="text-4xl font-bold text-[color:var(--green-700)]">
                    {formatPrice(pricePerDay)}
                  </span>
                  <span className="text-gray-500"> XAF{content.perDay}</span>
                </div>

                {/* Date Range */}
                <div className="mb-6 space-y-3">
                  <DatePicker
                    label={lang === 'fr' ? 'Début' : 'Start'}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <DatePicker
                    label={lang === 'fr' ? 'Fin' : 'End'}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>

                <div className="mb-4 rounded-2xl bg-[color:var(--green-50)] px-4 py-3 text-xs text-[color:var(--green-700)]">
                  <div className="flex items-center justify-between">
                    <span className={bookingStep === 'requested' ? 'font-semibold' : ''}>1. Demande</span>
                    <span className={bookingStep === 'confirm' ? 'font-semibold' : ''}>2. Confirmer (USSD)</span>
                    <span className={bookingStep === 'done' ? 'font-semibold' : ''}>3. Terminé</span>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-[color:var(--green-50)] rounded-2xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{content.total}</span>
                    <span className="text-2xl font-bold text-[color:var(--green-700)]">
                      {formatPrice(totalPrice)} XAF
                    </span>
                  </div>
                </div>

                {/* CTA Buttons - WhatsApp Priority */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg" onClick={handleBooking} disabled={bookingLoading}>
                    {bookingLoading ? '...' : content.bookNow}
                  </Button>
                  {bookingStatus && (
                    <p className="text-xs text-[color:var(--green-700)]">{bookingStatus}</p>
                  )}
                  {bookingConflicts.length > 0 && (
                    <div className="text-xs text-red-600">
                      Dates indisponibles :
                      {bookingConflicts.map((c, idx) => (
                        <div key={idx}>
                          {c.start_date} → {c.end_date}
                        </div>
                      ))}
                    </div>
                  )}
                  <WhatsAppButton
                    phone="+237 6 99 00 00 00"
                    listingTitle={listing.title}
                    listingType="cars"
                    variant="outline"
                    size="lg"
                  />
                </div>

                {/* Owner Info */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[color:var(--green-50)] rounded-full flex items-center justify-center">
                      <Car className="w-6 h-6 text-[color:var(--green-600)]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{content.proOwner}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>4.8 (23 {content.reviews})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {content.securePayment}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Floating WhatsApp Button (Mobile) */}
      <WhatsAppFloatingButton
        phone="+237 6 99 00 00 00"
        listingTitle={listing.title}
        listingType="cars"
      />
    </div>
  )
}
