'use client'

import { useState } from 'react'
import { 
  User, MapPin, Star, CheckCircle, Shield, Calendar, 
  MessageSquare, Phone, Mail, Award, Building2, Home
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PublicProfile } from '@/lib/supabase/profiles'
import { ReviewStats } from '@/lib/supabase/reviews'
import { useTranslation } from '@/lib/i18n/context'

interface UserProfileCardProps {
  profile: PublicProfile
  reviewStats?: ReviewStats
  variant?: 'compact' | 'full'
  showContact?: boolean
  onContact?: () => void
}

export function UserProfileCard({ 
  profile, 
  reviewStats,
  variant = 'compact',
  showContact = false,
  onContact
}: UserProfileCardProps) {
  const { t, lang } = useTranslation()
  const [showFullBio, setShowFullBio] = useState(false)

  const content = {
    verified: lang === 'fr' ? 'Vérifié' : 'Verified',
    pro: lang === 'fr' ? 'Professionnel' : 'Professional',
    joined: lang === 'fr' ? 'Membre depuis' : 'Member since',
    listings: lang === 'fr' ? 'annonces' : 'listings',
    reviews: lang === 'fr' ? 'avis' : 'reviews',
    rating: 'Rating',
    contactSeller: lang === 'fr' ? 'Contacter' : 'Contact',
    seeMore: lang === 'fr' ? 'Voir plus' : 'See more',
    seeLess: lang === 'fr' ? 'Voir moins' : 'See less',
    noReviews: lang === 'fr' ? 'Aucun avis' : 'No reviews yet',
    responseTime: lang === 'fr' ? 'Temps de réponse' : 'Response time',
    responseRate: lang === 'fr' ? 'Taux de réponse' : 'Response rate',
    languages: lang === 'fr' ? 'Langues' : 'Languages',
    verificationLevels: {
      none: lang === 'fr' ? 'Non vérifié' : 'Not verified',
      phone: lang === 'fr' ? 'Téléphone vérifié' : 'Phone verified',
      id: lang === 'fr' ? 'Identité vérifiée' : 'ID verified',
      business: lang === 'fr' ? 'Entreprise vérifiée' : 'Business verified'
    }
  }

  // Format join date
  const joinedDate = new Date(profile.joined_date).toLocaleDateString(
    lang === 'fr' ? 'fr-FR' : 'en-US',
    { year: 'numeric', month: 'long' }
  )

  // Get verification badge
  const getVerificationBadge = () => {
    if (profile.is_pro) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
          <Building2 className="w-3 h-3" />
          {content.pro}
        </span>
      )
    }
    
    if (profile.is_verified) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          {content.verified}
        </span>
      )
    }
    
    return null
  }

  // Render rating stars
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" style={{
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)'
          }} />
        )
      } else {
        stars.push(
          <Star key={i} className="w-4 h-4 text-gray-300" />
        )
      }
    }
    return stars
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || 'User'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name & Badge */}
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {profile.full_name || 'Utilisateur'}
              </h3>
              {getVerificationBadge()}
            </div>

            {/* Location */}
            {profile.location && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{profile.location}</span>
              </div>
            )}

            {/* Rating & Stats */}
            <div className="flex items-center gap-3 text-sm">
              {reviewStats && reviewStats.total_reviews > 0 ? (
                <>
                  <div className="flex items-center gap-1">
                    {renderStars(reviewStats.average_rating)}
                    <span className="font-medium text-gray-900 ml-1">
                      {reviewStats.average_rating}
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {reviewStats.total_reviews} {content.reviews}
                  </span>
                </>
              ) : (
                <span className="text-gray-500">{content.noReviews}</span>
              )}
              
              <span className="text-gray-500">
                {profile.listings_count} {content.listings}
              </span>
            </div>

            {/* Contact Button */}
            {showContact && onContact && (
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={onContact}
                className="mt-2"
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                {content.contactSeller}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Full profile card
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
            {profile.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt={profile.full_name || 'User'} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Name & Badges */}
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold text-gray-900">
                {profile.full_name || 'Utilisateur'}
              </h1>
              <div className="flex items-center gap-2">
                {getVerificationBadge()}
                {profile.verification_level === 'business' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    <Award className="w-3 h-3" />
                    {content.verificationLevels.business}
                  </span>
                )}
              </div>
            </div>

            {/* Location */}
            {profile.location && (
              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{profile.location}</span>
              </div>
            )}

            {/* Join Date */}
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{content.joined} {joinedDate}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="mt-4">
            <p className={`text-gray-700 ${!showFullBio ? 'line-clamp-2' : ''}`}>
              {profile.bio}
            </p>
            {profile.bio.length > 150 && (
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="text-blue-600 text-sm font-medium mt-1 hover:underline"
              >
                {showFullBio ? content.seeLess : content.seeMore}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Rating */}
          <div className="text-center">
            {reviewStats && reviewStats.total_reviews > 0 ? (
              <>
                <div className="flex items-center justify-center gap-1 mb-1">
                  {renderStars(reviewStats.average_rating)}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {reviewStats.average_rating}
                </div>
                <div className="text-sm text-gray-500">
                  {reviewStats.total_reviews} {content.reviews}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">{content.noReviews}</div>
            )}
          </div>

          {/* Listings */}
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {profile.listings_count}
            </div>
            <div className="text-sm text-gray-500">
              {content.listings}
            </div>
          </div>

          {/* Verification Level */}
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-1">
              {profile.verification_level === 'business' && (
                <Building2 className="w-8 h-8 text-blue-600" />
              )}
              {profile.verification_level === 'id' && (
                <Shield className="w-8 h-8 text-green-600" />
              )}
              {profile.verification_level === 'phone' && (
                <Phone className="w-8 h-8 text-orange-600" />
              )}
              {profile.verification_level === 'none' && (
                <User className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <div className="text-sm text-gray-500">
              {content.verificationLevels[profile.verification_level]}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Actions */}
      {showContact && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button onClick={onContact} className="w-full">
              <MessageSquare className="w-4 h-4 mr-2" />
              {content.contactSeller}
            </Button>
            <Button variant="secondary" className="w-full">
              <Phone className="w-4 h-4 mr-2" />
              Appeler
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}