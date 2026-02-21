'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, MapPin, Bed, Bath, Square, Heart, Share2,
  CheckCircle, Calendar, Phone, MessageSquare, User,
  Wifi, Car, Shield, Zap, Droplets, Wind, ChevronLeft, ChevronRight
} from 'lucide-react'
import { z } from 'zod'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { DatePicker } from '@/components/ui/DatePicker'
import { getProperty, Property } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'
import { WhatsAppButton, WhatsAppFloatingButton } from '@/components/ui/WhatsAppButton'
import { ListingShare, FacebookShareButton, WhatsAppShareButton } from '@/components/ui/SocialShare'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const amenityIcons: { [key: string]: any } = {
  'wifi': Wifi,
  'parking': Car,
  'security': Shield,
  'generator': Zap,
  'hotWater': Droplets,
  'ac': Wind,
}

export default function HousingDetailPage() {
  const params = useParams()
  const { t, lang } = useTranslation()
  const [listing, setListing] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [showPhone, setShowPhone] = useState(false)
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

  const nightsBetween = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    const diff = Math.max(0, e.getTime() - s.getTime())
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)))
  }

  const handleBooking = async () => {
    setBookingStatus('')
    const parsed = bookingSchema.safeParse({ startDate, endDate })
    if (!parsed.success || !listing) {
      setBookingStatus('Veuillez sélectionner des dates valides.')
      return
    }
    setBookingLoading(true)
    setBookingStep('requested')
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        property_id: listing.id,
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
    setBookingStatus('Réservation créée. Confirmez le paiement sur votre téléphone.')
    setBookingConflicts([])
    setBookingStep('confirm')
    setBookingLoading(false)
  }

  useEffect(() => {
    async function fetchListing() {
      if (params.id) {
        const data = await getProperty(params.id as string)
        setListing(data)
      }
      setLoading(false)
    }
    fetchListing()
  }, [params.id])

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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.listings.notFound}</h1>
            <p className="text-gray-500 mb-4">{t.listings.notFoundDesc}</p>
            <Link href="/housing">
              <Button>{t.listings.viewAll}</Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  const images = listing.images?.length ? listing.images : ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800']

  // Get translated housing type
  const getHousingType = (type: string | null) => {
    if (!type) return ''
    const types: { [key: string]: string } = {
      apartment: t.housingTypes.apartment,
      villa: t.housingTypes.villa,
      studio: t.housingTypes.studio,
      hotel_room: lang === 'fr' ? 'Hôtel' : 'Hotel',
      guest_house: lang === 'fr' ? "Maison d'hote" : 'Guest house',
      compound: lang === 'fr' ? 'Compound' : 'Compound',
    }
    return types[type] || type
  }

  // Get translated amenity
  const getAmenityName = (amenity: string) => {
    const amenityMap: { [key: string]: string } = {
      wifi: t.amenities.wifi,
      parking: t.amenities.parking,
      security: t.amenities.security,
      generator: t.amenities.generator,
      hotWater: t.amenities.hotWater,
      ac: t.amenities.ac,
      pool: t.amenities.pool,
      garden: t.amenities.garden,
      furnished: t.amenities.furnished,
    }
    return amenityMap[amenity.toLowerCase()] || amenity
  }

  return (
    <div className="min-h-screen flex flex-col bg-[color:var(--background)]">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <Link href="/housing" className="flex items-center text-sm text-gray-600 hover:text-[color:var(--green-700)]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t.listings.backToResults}
            </Link>
          </div>
        </div>

        {/* Image Gallery - Airbnb Style */}
        <div className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="relative rounded-2xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-[400px] md:h-[500px]">
                {/* Main Image */}
                <div className="relative h-full">
                  <img
                    src={images[currentImage]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Side Images */}
                <div className="hidden md:grid grid-cols-2 gap-2 h-full">
                  {images.slice(1, 5).map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <button 
                    onClick={() => setCurrentImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 md:hidden"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 md:hidden"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              
              {/* Photo count */}
              <button className="absolute bottom-4 right-4 px-4 py-2 bg-white rounded-lg shadow-lg text-sm font-medium hover:bg-gray-100">
                📷 {images.length} {t.listings.photos}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Location */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {listing.is_verified && (
                        <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {t.listings.verified}
                        </span>
                      )}
                      <span className="bg-[color:var(--green-50)] text-[color:var(--green-700)] text-xs font-medium px-2 py-1 rounded">
                        {getHousingType(listing.property_type)}
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {listing.title}
                    </h1>
                  </div>
                  <div className="flex gap-2">
                    <ListingShare 
                      listing={{
                        id: params.id as string,
                        title: listing.title,
                        description: listing.description,
                        price: listing.price_per_night,
                        city: listing.city,
                        images: listing.images
                      }}
                      type="housing"
                      variant="icon"
                    />
                    <button className="p-2 border rounded-full hover:bg-gray-50">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{listing.neighborhood ? `${listing.neighborhood}, ` : ''}{listing.city}</span>
                </div>
              </div>

              {/* Key Features */}
              {(listing.bedrooms || listing.bathrooms || listing.surface_m2) && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-3xl shadow-[var(--shadow-soft-sm)]">
                  {listing.bedrooms && (
                    <div className="text-center">
                      <Bed className="w-6 h-6 mx-auto mb-2 text-[color:var(--green-600)]" />
                      <p className="text-2xl font-bold text-gray-900">{listing.bedrooms}</p>
                      <p className="text-sm text-gray-500">
                        {listing.bedrooms > 1 ? t.detail.bedroomsPlural : t.detail.bedrooms}
                      </p>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="text-center">
                      <Bath className="w-6 h-6 mx-auto mb-2 text-[color:var(--green-600)]" />
                      <p className="text-2xl font-bold text-gray-900">{listing.bathrooms}</p>
                      <p className="text-sm text-gray-500">
                        {listing.bathrooms > 1 ? t.detail.bathroomsPlural : t.detail.bathrooms}
                      </p>
                    </div>
                  )}
                  {listing.surface_m2 && (
                    <div className="text-center">
                      <Square className="w-6 h-6 mx-auto mb-2 text-[color:var(--green-600)]" />
                      <p className="text-2xl font-bold text-gray-900">{listing.surface_m2}</p>
                      <p className="text-sm text-gray-500">m²</p>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.detail.description}</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {listing.description || t.detail.noDescription}
                </p>
              </div>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{t.detail.amenities}</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.amenities.map((amenity, idx) => {
                      const Icon = amenityIcons[amenity.toLowerCase()] || CheckCircle
                      return (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[color:var(--green-50)] rounded-xl flex items-center justify-center">
                            <Icon className="w-5 h-5 text-[color:var(--green-600)]" />
                          </div>
                          <span className="text-gray-700">{getAmenityName(amenity)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Contact Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-3xl shadow-[var(--shadow-soft)] p-6">
                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-[color:var(--green-700)]">
                    {formatPrice(listing.price_per_night)} XAF
                  </span>
                  <span className="text-gray-500"> {t.listings.perNight}</span>
                  {listing.furnished && (
                    <span className="block text-sm text-[color:var(--green-700)] mt-1">? {t.detail.furnished}</span>
                  )}
                </div>

                {/* Booking Dates */}
                <div className="space-y-3 mb-4">
                  <DatePicker
                    label={lang === 'fr' ? 'Arrivée' : 'Check-in'}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <DatePicker
                    label={lang === 'fr' ? 'Départ' : 'Check-out'}
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

                {/* Contact Buttons - WhatsApp Priority */}
                <div className="space-y-3">
                  <Button size="lg" onClick={handleBooking} disabled={bookingLoading} className="w-full">
                    {bookingLoading ? '...' : lang === 'fr' ? 'Réserver maintenant' : 'Book now'}
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
                    listingType="housing"
                    size="lg"
                  />
                </div>

                {/* Owner Info */}
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[color:var(--green-50)] rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-[color:var(--green-600)]" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{t.detail.owner}</p>
                      <p className="text-sm text-gray-500">{t.detail.memberSince} 2025</p>
                    </div>
                  </div>
                </div>

                {/* Safety Tips */}
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    💡 <strong>{t.detail.tip}:</strong> {t.detail.safetyTip}
                  </p>
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
        listingType="housing"
      />
    </div>
  )
}



