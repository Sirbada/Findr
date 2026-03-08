'use client'

import { useState } from 'react'
import { Star, ThumbsUp, User, Calendar, MapPin, Award, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Review, ReviewStats } from '@/lib/supabase/reviews'
import { useTranslation } from '@/lib/i18n/context'

interface ReviewsListProps {
  reviews: Review[]
  reviewStats?: ReviewStats
  showListingInfo?: boolean
  showLoadMore?: boolean
  onLoadMore?: () => void
  loading?: boolean
}

export function ReviewsList({ 
  reviews, 
  reviewStats,
  showListingInfo = false,
  showLoadMore = false,
  onLoadMore,
  loading = false
}: ReviewsListProps) {
  const { t, lang } = useTranslation()
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set())

  const content = {
    reviews: lang === 'fr' ? 'avis' : 'reviews',
    rating: lang === 'fr' ? 'Note' : 'Rating',
    helpful: lang === 'fr' ? 'Utile' : 'Helpful',
    seeMore: lang === 'fr' ? 'Voir plus' : 'See more',
    seeLess: lang === 'fr' ? 'Voir moins' : 'See less',
    loadMore: lang === 'fr' ? 'Charger plus d\'avis' : 'Load more reviews',
    noReviews: lang === 'fr' ? 'Aucun avis pour le moment' : 'No reviews yet',
    verified: lang === 'fr' ? 'Vérifié' : 'Verified',
    categories: {
      communication: lang === 'fr' ? 'Communication' : 'Communication',
      accuracy: lang === 'fr' ? 'Précision' : 'Accuracy', 
      cleanliness: lang === 'fr' ? 'Propreté' : 'Cleanliness',
      location: lang === 'fr' ? 'Emplacement' : 'Location',
      value: lang === 'fr' ? 'Rapport qualité/prix' : 'Value for money'
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(
      lang === 'fr' ? 'fr-FR' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )
  }

  // Render rating stars
  const renderStars = (rating: number, size = 'sm') => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className={`${starSize} fill-yellow-400 text-yellow-400`} />
        )
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <Star className={`${starSize} text-gray-300`} />
            <Star 
              className={`${starSize} fill-yellow-400 text-yellow-400 absolute top-0 left-0`} 
              style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }}
            />
          </div>
        )
      } else {
        stars.push(
          <Star key={i} className={`${starSize} text-gray-300`} />
        )
      }
    }
    return stars
  }

  // Toggle expanded review
  const toggleExpanded = (reviewId: string) => {
    const newExpanded = new Set(expandedReviews)
    if (newExpanded.has(reviewId)) {
      newExpanded.delete(reviewId)
    } else {
      newExpanded.add(reviewId)
    }
    setExpandedReviews(newExpanded)
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">{content.noReviews}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Stats */}
      {reviewStats && reviewStats.total_reviews > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating Summary */}
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {reviewStats.average_rating}
                </div>
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    {renderStars(reviewStats.average_rating, 'md')}
                  </div>
                  <p className="text-sm text-gray-500">
                    {reviewStats.total_reviews} {content.reviews}
                  </p>
                </div>
              </div>

              {/* Detailed Averages */}
              {reviewStats.detailed_averages && (
                <div className="space-y-2">
                  {Object.entries(reviewStats.detailed_averages).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {content.categories[key as keyof typeof content.categories]}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {renderStars(value)}
                        </div>
                        <span className="font-medium text-gray-900 w-8">
                          {value.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Rating Breakdown */}
            <div>
              <div className="space-y-2">
                {Object.entries(reviewStats.rating_breakdown)
                  .sort(([a], [b]) => parseInt(b) - parseInt(a))
                  .map(([stars, count]) => {
                    const percentage = reviewStats.total_reviews > 0 
                      ? (count / reviewStats.total_reviews) * 100 
                      : 0
                    
                    return (
                      <div key={stars} className="flex items-center gap-2 text-sm">
                        <span className="w-3 font-medium">{stars}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-gray-500 w-8">{count}</span>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isExpanded = expandedReviews.has(review.id)
          const shouldShowToggle = review.comment && review.comment.length > 200

          return (
            <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  {/* Reviewer Avatar */}
                  <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                    {review.reviewer?.avatar_url ? (
                      <img 
                        src={review.reviewer.avatar_url} 
                        alt={review.reviewer.full_name || 'Reviewer'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    {/* Name & Verification */}
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {review.reviewer?.full_name || 'Utilisateur'}
                      </h4>
                      {review.reviewer?.is_verified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                      {review.is_verified && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                          {content.verified}
                        </span>
                      )}
                    </div>

                    {/* Location & Date */}
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      {review.reviewer?.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{review.reviewer.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(review.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                  <span className="ml-2 font-semibold text-gray-900">
                    {review.rating}
                  </span>
                </div>
              </div>

              {/* Title */}
              {review.title && (
                <h5 className="font-semibold text-gray-900 mb-2">
                  {review.title}
                </h5>
              )}

              {/* Listing Info */}
              {showListingInfo && review.listing && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    <span>
                      {review.listing.title} • {review.listing.category}
                    </span>
                  </div>
                </div>
              )}

              {/* Comment */}
              {review.comment && (
                <div className="mb-4">
                  <p className={`text-gray-700 ${!isExpanded && shouldShowToggle ? 'line-clamp-3' : ''}`}>
                    {review.comment}
                  </p>
                  {shouldShowToggle && (
                    <button
                      onClick={() => toggleExpanded(review.id)}
                      className="text-blue-600 text-sm font-medium mt-2 hover:underline"
                    >
                      {isExpanded ? content.seeLess : content.seeMore}
                    </button>
                  )}
                </div>
              )}

              {/* Detailed Ratings */}
              {review.rating_communication && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 pt-4 border-t border-gray-100">
                  {[
                    { key: 'communication', value: review.rating_communication },
                    { key: 'accuracy', value: review.rating_accuracy },
                    { key: 'cleanliness', value: review.rating_cleanliness },
                    { key: 'location', value: review.rating_location },
                    { key: 'value', value: review.rating_value }
                  ].filter(item => item.value).map(({ key, value }) => (
                    <div key={key} className="text-center">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {value}
                      </div>
                      <div className="text-xs text-gray-500">
                        {content.categories[key as keyof typeof content.categories]}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {review.helpful_votes > 0 && (
                    <span>{review.helpful_votes} personnes trouvent cet avis utile</span>
                  )}
                </div>
                
                <Button variant="secondary" size="sm">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {content.helpful}
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Load More */}
      {showLoadMore && onLoadMore && (
        <div className="text-center">
          <Button 
            variant="secondary" 
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Chargement...' : content.loadMore}
          </Button>
        </div>
      )}
    </div>
  )
}