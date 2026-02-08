'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  MapPin, Bed, Bath, Square, Wifi, Car, Shield, 
  Heart, Share2, Calendar, Users, Star, CheckCircle,
  ArrowLeft, ChevronLeft, ChevronRight, X
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { UserProfileCard } from '@/components/profile/UserProfileCard'
import { ReviewsList } from '@/components/reviews/ReviewsList'
import { BookingModal } from '@/components/booking/BookingModal'
import { getListing, Listing } from '@/lib/supabase/queries'
import { getPublicProfile, PublicProfile } from '@/lib/supabase/profiles'
import { getUserReviews, getUserReviewStats, Review, ReviewStats } from '@/lib/supabase/reviews'
import { useTranslation } from '@/lib/i18n/context'

export default function ListingDetailPage() {
  const params = useParams()
  const listingId = params.id as string
  const { t, lang } = useTranslation()

  const [listing, setListing] = useState<Listing | null>(null)
  const [landlord, setLandlord] = useState<PublicProfile | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showImageModal, setShowImageModal] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Mock current user ID (replace with real auth)
  const currentUserId = 'demo-user-current'

  const content = {
    backToListings: lang === 'fr' ? 'Retour aux annonces' : 'Back to listings',
    bookNow: lang === 'fr' ? 'Réserver' : 'Book now',
    contactOwner: lang === 'fr' ? 'Contacter le propriétaire' : 'Contact owner',
    overview: lang === 'fr' ? 'Aperçu' : 'Overview',
    amenities: lang === 'fr' ? 'Équipements' : 'Amenities',
    location: lang === 'fr' ? 'Emplacement' : 'Location',
    host: lang === 'fr' ? 'Hôte' : 'Host',
    reviews: lang === 'fr' ? 'Avis' : 'Reviews',
    description: lang === 'fr' ? 'Description' : 'Description',
    verified: lang === 'fr' ? 'Vérifié' : 'Verified',
    featured: lang === 'fr' ? 'Mis en avant' : 'Featured',
    furnished: lang === 'fr' ? 'Meublé' : 'Furnished',
    unfurnished: lang === 'fr' ? 'Non meublé' : 'Unfurnished',
    photos: lang === 'fr' ? 'Photos' : 'Photos',
    viewAllPhotos: lang === 'fr' ? 'Voir toutes les photos' : 'View all photos',
    closePhotos: lang === 'fr' ? 'Fermer' : 'Close',
    perMonth: lang === 'fr' ? '/mois' : '/month',
    perYear: lang === 'fr' ? '/an' : '/year',
    forSale: lang === 'fr' ? 'À vendre' : 'For sale',
    notFound: lang === 'fr' ? 'Annonce non trouvée' : 'Listing not found',
    loading: lang === 'fr' ? 'Chargement...' : 'Loading...',
    showPhone: lang === 'fr' ? 'Afficher le téléphone' : 'Show phone',
    sendMessage: lang === 'fr' ? 'Envoyer un message' : 'Send message',
    reportListing: lang === 'fr' ? 'Signaler cette annonce' : 'Report this listing',
    share: lang === 'fr' ? 'Partager' : 'Share',
    save: lang === 'fr' ? 'Sauvegarder' : 'Save'
  }

  // Amenities translation
  const getAmenityLabel = (amenity: string) => {
    const amenitiesMap = {
      wifi: 'Wi-Fi',
      parking: lang === 'fr' ? 'Parking' : 'Parking',
      security: lang === 'fr' ? 'Sécurité' : 'Security',
      pool: lang === 'fr' ? 'Piscine' : 'Pool',
      garden: lang === 'fr' ? 'Jardin' : 'Garden',
      ac: lang === 'fr' ? 'Climatisation' : 'Air Conditioning',
      balcony: lang === 'fr' ? 'Balcon' : 'Balcony',
      elevator: lang === 'fr' ? 'Ascenseur' : 'Elevator',
      gym: lang === 'fr' ? 'Salle de sport' : 'Gym',
      laundry: lang === 'fr' ? 'Buanderie' : 'Laundry'
    }
    return amenitiesMap[amenity as keyof typeof amenitiesMap] || amenity
  }

  // Get amenity icon
  const getAmenityIcon = (amenity: string) => {
    const iconsMap = {
      wifi: <Wifi className="w-5 h-5" />,
      parking: <Car className="w-5 h-5" />,
      security: <Shield className="w-5 h-5" />,
      pool: <div className="w-5 h-5 text-blue-500">🏊</div>,
      garden: <div className="w-5 h-5 text-green-500">🌱</div>,
      ac: <div className="w-5 h-5 text-blue-500">❄️</div>,
      balcony: <div className="w-5 h-5">🏠</div>,
      elevator: <div className="w-5 h-5">⬆️</div>,
      gym: <div className="w-5 h-5">💪</div>,
      laundry: <div className="w-5 h-5">👔</div>
    }
    return iconsMap[amenity as keyof typeof iconsMap] || <div className="w-5 h-5">•</div>
  }

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Get listing
        const listingData = await getListing(listingId)
        if (!listingData) {
          setLoading(false)
          return
        }
        setListing(listingData)

        // Get landlord profile
        if (listingData.user_id) {
          const landlordProfile = await getPublicProfile(listingData.user_id)
          setLandlord(landlordProfile)

          // Get reviews for landlord
          const [landlordReviews, landlordReviewStats] = await Promise.all([
            getUserReviews(listingData.user_id, 5),
            getUserReviewStats(listingData.user_id)
          ])
          setReviews(landlordReviews)
          setReviewStats(landlordReviewStats)
        }
      } catch (error) {
        console.error('Error fetching listing details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [listingId])

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price)
  }

  // Get rental period text
  const getRentalPeriodText = (period: string | null) => {
    if (!period || period === 'sale') return ''
    const periodMap = {
      month: content.perMonth,
      year: content.perYear,
      day: '/jour',
      week: '/semaine'
    }
    return periodMap[period as keyof typeof periodMap] || ''
  }

  // Image navigation
  const nextImage = () => {
    if (!listing?.images) return
    setCurrentImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!listing?.images) return
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">{content.loading}</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {content.notFound}
            </h1>
            <Button onClick={() => window.history.back()}>
              {content.backToListings}
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{content.backToListings}</span>
          </button>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {listing.title}
                  </h1>
                  <div className="flex items-center gap-2">
                    {listing.is_featured && (
                      <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                        {content.featured}
                      </span>
                    )}
                    {listing.is_verified && (
                      <span className="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {content.verified}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-gray-600 mb-3">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <span>
                    {listing.neighborhood && `${listing.neighborhood}, `}{listing.city}
                  </span>
                </div>

                {/* Features */}
                <div className="flex items-center gap-6 text-gray-600">
                  {listing.rooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="w-5 h-5" />
                      <span>{listing.rooms} chambres</span>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="w-5 h-5" />
                      <span>{listing.bathrooms} salles de bain</span>
                    </div>
                  )}
                  {listing.surface_m2 && (
                    <div className="flex items-center gap-1">
                      <Square className="w-5 h-5" />
                      <span>{listing.surface_m2} m²</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm">
                  <Heart className="w-4 h-4 mr-1" />
                  {content.save}
                </Button>
                <Button variant="secondary" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  {content.share}
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                {listing.images && listing.images.length > 0 ? (
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <img
                        src={listing.images[currentImageIndex]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Navigation Arrows */}
                      {listing.images.length > 1 && (
                        <>
                          <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                          <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* View All Photos */}
                      <button
                        onClick={() => setShowImageModal(true)}
                        className="absolute bottom-4 right-4 bg-white/80 hover:bg-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {content.viewAllPhotos} ({listing.images.length})
                      </button>

                      {/* Image Counter */}
                      {listing.images.length > 1 && (
                        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {currentImageIndex + 1} / {listing.images.length}
                        </div>
                      )}
                    </div>

                    {/* Thumbnail Strip */}
                    {listing.images.length > 1 && (
                      <div className="flex gap-2 p-4 overflow-x-auto">
                        {listing.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex 
                                ? 'border-blue-500' 
                                : 'border-transparent hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {content.description}
                </h2>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {listing.description || 'Aucune description disponible.'}
                  </p>
                </div>
              </div>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {content.amenities}
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {getAmenityIcon(amenity)}
                        <span className="font-medium text-gray-700">
                          {getAmenityLabel(amenity)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Host Profile */}
              {landlord && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {content.host}
                  </h2>
                  <UserProfileCard 
                    profile={landlord} 
                    reviewStats={reviewStats || undefined}
                    variant="full"
                    showContact
                    onContact={() => setShowBookingModal(true)}
                  />
                </div>
              )}

              {/* Reviews */}
              {reviews && reviews.length > 0 && (
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    {content.reviews}
                  </h2>
                  <ReviewsList 
                    reviews={reviews}
                    reviewStats={reviewStats || undefined}
                  />
                </div>
              )}
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(listing.price)} XAF
                  </div>
                  {listing.rental_period !== 'sale' && (
                    <div className="text-gray-600">
                      {getRentalPeriodText(listing.rental_period)}
                    </div>
                  )}
                  {listing.furnished && (
                    <div className="text-sm text-green-600 font-medium mt-1">
                      {content.furnished}
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  {listing.rooms && (
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{listing.rooms}</div>
                      <div className="text-sm text-gray-600">Chambres</div>
                    </div>
                  )}
                  {listing.bathrooms && (
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{listing.bathrooms}</div>
                      <div className="text-sm text-gray-600">Salles de bain</div>
                    </div>
                  )}
                  {listing.surface_m2 && (
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{listing.surface_m2}</div>
                      <div className="text-sm text-gray-600">m²</div>
                    </div>
                  )}
                  {reviewStats && reviewStats.total_reviews > 0 && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">
                          {reviewStats.average_rating}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {reviewStats.total_reviews} avis
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {listing.rental_period !== 'sale' ? (
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => setShowBookingModal(true)}
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      {content.bookNow}
                    </Button>
                  ) : (
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => setShowBookingModal(true)}
                    >
                      <Users className="w-5 h-5 mr-2" />
                      {content.contactOwner}
                    </Button>
                  )}
                  
                  <Button variant="secondary" size="lg" className="w-full">
                    {content.sendMessage}
                  </Button>
                </div>

                {/* Safety Note */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Findr Protection</p>
                      <p>Vos paiements sont protégés. Ne payez jamais en dehors de la plateforme.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Image Modal */}
      {showImageModal && listing.images && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors z-10"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={listing.images[currentImageIndex]}
              alt={listing.title}
              className="max-w-full max-h-full object-contain"
            />
            
            {listing.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}
            
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {listing.images.length}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        listing={{
          id: listing.id,
          title: listing.title,
          price: listing.price,
          images: listing.images || [],
          user_id: listing.user_id || '',
          furnished: listing.furnished,
          city: listing.city,
          neighborhood: listing.neighborhood || undefined
        }}
        currentUserId={currentUserId}
      />

      <Footer />
    </div>
  )
}