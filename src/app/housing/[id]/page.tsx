'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, MapPin, Bed, Bath, Square, Heart, Share2,
  CheckCircle, Calendar, Phone, MessageSquare, User,
  Wifi, Car, Shield, Zap, Droplets, Wind, ChevronLeft, ChevronRight
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { getListing, Listing } from '@/lib/supabase/queries'
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
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(0)
  const [showPhone, setShowPhone] = useState(false)

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
      house: t.housingTypes.house,
      studio: t.housingTypes.studio,
      room: t.housingTypes.room,
      land: t.housingTypes.land,
      villa: t.housingTypes.villa,
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <Link href="/housing" className="flex items-center text-sm text-gray-600 hover:text-blue-600">
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
                      <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded">
                        {getHousingType(listing.housing_type)}
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
                        price: listing.price,
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
              {(listing.rooms || listing.bathrooms || listing.surface_m2) && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-xl shadow-sm">
                  {listing.rooms && (
                    <div className="text-center">
                      <Bed className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold text-gray-900">{listing.rooms}</p>
                      <p className="text-sm text-gray-500">
                        {listing.rooms > 1 ? t.detail.bedroomsPlural : t.detail.bedrooms}
                      </p>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="text-center">
                      <Bath className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold text-gray-900">{listing.bathrooms}</p>
                      <p className="text-sm text-gray-500">
                        {listing.bathrooms > 1 ? t.detail.bathroomsPlural : t.detail.bathrooms}
                      </p>
                    </div>
                  )}
                  {listing.surface_m2 && (
                    <div className="text-center">
                      <Square className="w-6 h-6 mx-auto mb-2 text-blue-600" />
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
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-blue-600" />
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
              <div className="sticky top-24 bg-white rounded-xl shadow-lg p-6">
                {/* Price */}
                <div className="mb-6">
                  <span className="text-3xl font-bold text-blue-600">
                    {formatPrice(listing.price)} XAF
                  </span>
                  {listing.rental_period !== 'sale' && (
                    <span className="text-gray-500"> {t.listings.perMonth}</span>
                  )}
                  {listing.furnished && (
                    <span className="block text-sm text-green-600 mt-1">✓ {t.detail.furnished}</span>
                  )}
                </div>

                {/* Contact Buttons - WhatsApp Priority */}
                <div className="space-y-3">
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
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
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
