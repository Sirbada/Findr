import { createClient } from './client'
import { updateProfileStats } from './profiles'

export interface Review {
  id: string
  reviewer_id: string
  reviewed_user_id: string
  listing_id?: string | null
  booking_id?: string | null
  
  rating: number
  title?: string | null
  comment?: string | null
  
  // Detailed ratings
  rating_communication?: number | null
  rating_accuracy?: number | null
  rating_cleanliness?: number | null
  rating_location?: number | null
  rating_value?: number | null
  
  // Metadata
  is_verified: boolean
  helpful_votes: number
  created_at: string
  updated_at: string
  
  // Relations
  reviewer?: any
  reviewed_user?: any
  listing?: any
}

export interface ReviewStats {
  average_rating: number
  total_reviews: number
  rating_breakdown: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  detailed_averages?: {
    communication: number
    accuracy: number
    cleanliness: number
    location: number
    value: number
  }
}

export interface CreateReviewData {
  reviewed_user_id: string
  listing_id?: string
  booking_id?: string
  rating: number
  title?: string
  comment?: string
  rating_communication?: number
  rating_accuracy?: number
  rating_cleanliness?: number
  rating_location?: number
  rating_value?: number
}

// Create a review
export async function createReview(reviewData: CreateReviewData & { reviewer_id: string }) {
  const supabase = createClient()
  
  // Check if user already reviewed this user/listing
  let existingQuery = supabase
    .from('reviews')
    .select('id')
    .eq('reviewer_id', reviewData.reviewer_id)
    .eq('reviewed_user_id', reviewData.reviewed_user_id)
    
  if (reviewData.listing_id) {
    existingQuery = existingQuery.eq('listing_id', reviewData.listing_id)
  }
  
  const { data: existing } = await existingQuery.single()
  
  if (existing) {
    throw new Error('You have already reviewed this user/listing')
  }
  
  const review = {
    ...reviewData,
    is_verified: true, // Auto-verify for now
    helpful_votes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select('*')
    .single()
    
  if (error) {
    console.error('Error creating review:', error)
    throw error
  }
  
  // Update profile stats
  await updateProfileStats(reviewData.reviewed_user_id)
  
  return data as Review
}

// Get reviews for a user
export async function getUserReviews(userId: string, limit = 10, offset = 0) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey(
        full_name,
        avatar_url,
        is_verified
      ),
      listing:listings(
        title,
        category
      )
    `)
    .eq('reviewed_user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
    
  if (error) {
    console.error('Error fetching user reviews:', error)
    return []
  }
  
  return data as Review[]
}

// Get review stats for a user
export async function getUserReviewStats(userId: string): Promise<ReviewStats> {
  const supabase = createClient()
  
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('rating, rating_communication, rating_accuracy, rating_cleanliness, rating_location, rating_value')
    .eq('reviewed_user_id', userId)
    
  if (error || !reviews || reviews.length === 0) {
    return {
      average_rating: 0,
      total_reviews: 0,
      rating_breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
  }
  
  const total = reviews.length
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / total
  
  // Count ratings by star
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => {
    const star = Math.round(r.rating) as keyof typeof breakdown
    if (breakdown[star] !== undefined) {
      breakdown[star]++
    }
  })
  
  // Calculate detailed averages if available
  let detailed_averages
  const detailedReviews = reviews.filter(r => r.rating_communication)
  if (detailedReviews.length > 0) {
    detailed_averages = {
      communication: detailedReviews.reduce((sum, r) => sum + (r.rating_communication || 0), 0) / detailedReviews.length,
      accuracy: detailedReviews.reduce((sum, r) => sum + (r.rating_accuracy || 0), 0) / detailedReviews.length,
      cleanliness: detailedReviews.reduce((sum, r) => sum + (r.rating_cleanliness || 0), 0) / detailedReviews.length,
      location: detailedReviews.reduce((sum, r) => sum + (r.rating_location || 0), 0) / detailedReviews.length,
      value: detailedReviews.reduce((sum, r) => sum + (r.rating_value || 0), 0) / detailedReviews.length
    }
  }
  
  return {
    average_rating: Math.round(average * 10) / 10,
    total_reviews: total,
    rating_breakdown: breakdown,
    detailed_averages
  }
}

// Get reviews for a listing
export async function getListingReviews(listingId: string, limit = 5) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewer:profiles!reviews_reviewer_id_fkey(
        full_name,
        avatar_url,
        is_verified,
        location
      )
    `)
    .eq('listing_id', listingId)
    .order('created_at', { ascending: false })
    .limit(limit)
    
  if (error) {
    console.error('Error fetching listing reviews:', error)
    return []
  }
  
  return data as Review[]
}

// Mark review as helpful
export async function voteReviewHelpful(reviewId: string, userId: string) {
  const supabase = createClient()
  
  // Check if user already voted
  const { data: existingVote } = await supabase
    .from('review_votes')
    .select('id')
    .eq('review_id', reviewId)
    .eq('user_id', userId)
    .single()
    
  if (existingVote) {
    throw new Error('You have already voted on this review')
  }
  
  // Add vote
  const { error: voteError } = await supabase
    .from('review_votes')
    .insert([{
      review_id: reviewId,
      user_id: userId,
      created_at: new Date().toISOString()
    }])
    
  if (voteError) {
    throw voteError
  }
  
  // Increment helpful votes count
  const { data, error } = await supabase
    .from('reviews')
    .update({
      helpful_votes: supabase.sql`helpful_votes + 1`,
      updated_at: new Date().toISOString()
    })
    .eq('id', reviewId)
    .select('helpful_votes')
    .single()
    
  if (error) {
    throw error
  }
  
  return data.helpful_votes
}

// Get reviews written by a user (for their profile)
export async function getReviewsByUser(userId: string, limit = 10) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      reviewed_user:profiles!reviews_reviewed_user_id_fkey(
        full_name,
        avatar_url,
        is_pro
      ),
      listing:listings(
        title,
        category,
        city
      )
    `)
    .eq('reviewer_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
    
  if (error) {
    console.error('Error fetching reviews by user:', error)
    return []
  }
  
  return data as Review[]
}

// Check if user can review (after booking completion)
export async function canUserReview(reviewerId: string, reviewedUserId: string, listingId?: string) {
  const supabase = createClient()
  
  // Check if there's a completed booking between these users
  if (listingId) {
    const { data: booking } = await supabase
      .from('bookings')
      .select('id')
      .eq('tenant_id', reviewerId)
      .eq('listing_id', listingId)
      .eq('status', 'completed')
      .single()
      
    if (!booking) {
      return { canReview: false, reason: 'No completed booking found' }
    }
  }
  
  // Check if already reviewed
  let query = supabase
    .from('reviews')
    .select('id')
    .eq('reviewer_id', reviewerId)
    .eq('reviewed_user_id', reviewedUserId)
    
  if (listingId) {
    query = query.eq('listing_id', listingId)
  }
  
  const { data: existingReview } = await query.single()
  
  if (existingReview) {
    return { canReview: false, reason: 'Already reviewed' }
  }
  
  return { canReview: true }
}

// Create demo reviews
export async function createDemoReviews() {
  const supabase = createClient()
  
  const demoReviews = [
    {
      id: 'demo-review-1',
      reviewer_id: 'demo-user-2',
      reviewed_user_id: 'demo-user-1',
      listing_id: 'demo-listing-1',
      rating: 5,
      title: 'Excellent service et logement parfait!',
      comment: 'Jean-Paul est un agent très professionnel. L\'appartement était exactement comme décrit, très propre et bien situé. Je recommande vivement!',
      rating_communication: 5,
      rating_accuracy: 5,
      rating_cleanliness: 5,
      rating_location: 5,
      rating_value: 4,
      is_verified: true,
      helpful_votes: 3,
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z'
    },
    {
      id: 'demo-review-2',
      reviewer_id: 'demo-user-3',
      reviewed_user_id: 'demo-user-2',
      listing_id: 'demo-listing-2',
      rating: 5,
      title: 'Hôte exceptionnelle',
      comment: 'Marie est une hôte formidable! Très accueillante et toujours disponible. Son appartement est magnifique et parfaitement équipé.',
      rating_communication: 5,
      rating_accuracy: 5,
      rating_cleanliness: 5,
      rating_location: 4,
      rating_value: 5,
      is_verified: true,
      helpful_votes: 2,
      created_at: '2024-01-20T14:30:00Z',
      updated_at: '2024-01-20T14:30:00Z'
    },
    {
      id: 'demo-review-3',
      reviewer_id: 'demo-user-1',
      reviewed_user_id: 'demo-user-3',
      listing_id: 'demo-listing-3',
      rating: 4,
      title: 'Bon propriétaire, communication fluide',
      comment: 'Dr. Fomba gère très bien ses biens à distance. Communication claire et rapide. Petit bémol sur l\'équipement qui pourrait être plus moderne.',
      rating_communication: 5,
      rating_accuracy: 4,
      rating_cleanliness: 4,
      rating_location: 4,
      rating_value: 4,
      is_verified: true,
      helpful_votes: 1,
      created_at: '2024-02-01T09:15:00Z',
      updated_at: '2024-02-01T09:15:00Z'
    }
  ]
  
  const { data, error } = await supabase
    .from('reviews')
    .upsert(demoReviews, { onConflict: 'id' })
    .select('*')
    
  if (error) {
    console.error('Error creating demo reviews:', error)
    return []
  }
  
  return data
}