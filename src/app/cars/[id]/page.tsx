'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, MapPin, Fuel, Settings2, Users, Calendar,
  Heart, Share2, CheckCircle, Phone, MessageSquare, User,
  Car, Shield, ChevronLeft, ChevronRight, Star
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getListing, Listing } from '@/lib/supabase/queries'
import { useTranslation } from '@/lib/i18n/context'
import { WhatsAppButton, WhatsAppFloatingButton } from '@/components/ui/WhatsAppButton'

function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR').format(price)
}

export default function CarDetailPage() {
  const params = useParams()
  const { t, lang } = useTranslation()
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [selectedDays, setSelectedDays] = useState(1)

  useEffect(() => {
    async function fetchListing() {
      if (params.id) {
        const data = await getListing(params.id as string)
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
  const totalPrice = pricePerDay * selectedDays

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <Link href="/cars" className="flex items-center text-sm text-gray-600 hover:text-blue-600">
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
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
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
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setCurrentImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {listing.is_verified && (
                      <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
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
                          currentImage === idx ? 'border-blue-500' : 'border-transparent'
                        }`}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Title & Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {listing.car_brand && (
                        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                          {listing.car_brand}
                        </span>
                      )}
                      {listing.car_year && (
                        <span className="text-gray-500">{listing.car_year}</span>
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
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Fuel className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-500">{content.fuel}</p>
                    <p className="font-semibold">{getFuelType(listing.fuel_type)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Settings2 className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-500">{content.transmission}</p>
                    <p className="font-semibold">{getTransmission(listing.transmission)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Users className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-500">{content.seats}</p>
                    <p className="font-semibold">{listing.seats || 5}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-500">{content.year}</p>
                    <p className="font-semibold">{listing.car_year || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{content.description}</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {listing.description || content.noDescription}
                </p>
              </div>

              {/* Included - Sixt Style */}
              <div className="bg-white rounded-xl shadow-sm p-6">
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
              <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
                {/* Price */}
                <div className="text-center mb-6 pb-6 border-b">
                  <span className="text-4xl font-bold text-blue-600">
                    {formatPrice(pricePerDay)}
                  </span>
                  <span className="text-gray-500"> XAF{content.perDay}</span>
                </div>

                {/* Duration Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {content.duration}
                  </label>
                  <div className="flex items-center">
                    <button 
                      onClick={() => setSelectedDays(Math.max(1, selectedDays - 1))}
                      className="px-4 py-2 border rounded-l-lg hover:bg-gray-50"
                    >
                      -
                    </button>
                    <div className="flex-1 text-center py-2 border-t border-b font-medium">
                      {selectedDays} {selectedDays > 1 ? content.days : content.day}
                    </div>
                    <button 
                      onClick={() => setSelectedDays(selectedDays + 1)}
                      className="px-4 py-2 border rounded-r-lg hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{content.total}</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatPrice(totalPrice)} XAF
                    </span>
                  </div>
                </div>

                {/* CTA Buttons - WhatsApp Priority */}
                <div className="space-y-3">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    {content.bookNow}
                  </Button>
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
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-600" />
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
