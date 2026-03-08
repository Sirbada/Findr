import { createClient } from './client'

export interface UserProfile {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  phone: string | null
  email: string | null
  bio: string | null
  location: string | null
  
  // Verification
  is_verified: boolean
  is_pro: boolean
  verification_level: 'none' | 'phone' | 'id' | 'business'
  
  // Stats
  listings_count: number
  rating: number
  reviews_count: number
  joined_date: string
  last_active: string
  
  // Preferences
  language: 'fr' | 'en'
  currency: 'XAF' | 'EUR' | 'USD'
  notifications_email: boolean
  notifications_sms: boolean
  
  created_at: string
  updated_at: string
}

export interface PublicProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  bio: string | null
  location: string | null
  is_verified: boolean
  is_pro: boolean
  verification_level: string
  listings_count: number
  rating: number
  reviews_count: number
  joined_date: string
}

// Get user profile
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
    
  if (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
  
  return data as UserProfile
}

// Get public profile (for other users to see)
export async function getPublicProfile(userId: string): Promise<PublicProfile | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      avatar_url,
      bio,
      location,
      is_verified,
      is_pro,
      verification_level,
      listings_count,
      rating,
      reviews_count,
      joined_date
    `)
    .eq('user_id', userId)
    .single()
    
  if (error) {
    console.error('Error fetching public profile:', error)
    return null
  }
  
  return data as PublicProfile
}

// Create or update profile
export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  const supabase = createClient()
  
  const profileData = {
    ...updates,
    user_id: userId,
    updated_at: new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert([profileData])
    .select('*')
    .single()
    
  if (error) {
    console.error('Error updating profile:', error)
    throw error
  }
  
  return data as UserProfile
}

// Update profile stats (call this when listings/reviews change)
export async function updateProfileStats(userId: string) {
  const supabase = createClient()
  
  // Get listings count
  const { count: listingsCount } = await supabase
    .from('listings')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'active')
  
  // Get reviews stats
  const { data: reviewStats } = await supabase
    .from('reviews')
    .select('rating')
    .eq('reviewed_user_id', userId)
  
  const rating = reviewStats && reviewStats.length > 0 
    ? reviewStats.reduce((sum, r) => sum + r.rating, 0) / reviewStats.length 
    : 0
  
  const reviews_count = reviewStats?.length || 0
  
  // Update profile
  const { data, error } = await supabase
    .from('profiles')
    .update({
      listings_count: listingsCount || 0,
      rating: Math.round(rating * 10) / 10, // Round to 1 decimal
      reviews_count,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
    .select('*')
    .single()
    
  if (error) {
    console.error('Error updating profile stats:', error)
    return null
  }
  
  return data as UserProfile
}

// Search profiles (for landlord/agent discovery)
export async function searchProfiles(query: string, isProOnly = false) {
  const supabase = createClient()
  
  let queryBuilder = supabase
    .from('profiles')
    .select(`
      id,
      user_id,
      full_name,
      avatar_url,
      bio,
      location,
      is_verified,
      is_pro,
      verification_level,
      listings_count,
      rating,
      reviews_count
    `)
    .or(`full_name.ilike.%${query}%,bio.ilike.%${query}%,location.ilike.%${query}%`)
    .gt('listings_count', 0)
    .order('rating', { ascending: false })
    
  if (isProOnly) {
    queryBuilder = queryBuilder.eq('is_pro', true)
  }
  
  const { data, error } = await queryBuilder.limit(20)
  
  if (error) {
    console.error('Error searching profiles:', error)
    return []
  }
  
  return data as PublicProfile[]
}

// Get profile with user's listings
export async function getProfileWithListings(userId: string) {
  const supabase = createClient()
  
  // Get profile
  const profile = await getPublicProfile(userId)
  if (!profile) return null
  
  // Get user's active listings
  const { data: listings, error: listingsError } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(10)
    
  if (listingsError) {
    console.error('Error fetching user listings:', listingsError)
    return { profile, listings: [] }
  }
  
  return { profile, listings }
}

// Create demo profiles for testing
export async function createDemoProfiles() {
  const supabase = createClient()
  
  const demoProfiles = [
    {
      user_id: 'demo-user-1',
      full_name: 'Jean-Paul Mbarga',
      avatar_url: '/avatars/demo1.jpg',
      bio: 'Agent immobilier spécialisé dans les biens de prestige à Douala. 15 ans d\'expérience.',
      location: 'Douala, Cameroun',
      is_verified: true,
      is_pro: true,
      verification_level: 'business',
      listings_count: 12,
      rating: 4.8,
      reviews_count: 24,
      phone: '+237699123456',
      language: 'fr',
      currency: 'XAF',
      notifications_email: true,
      notifications_sms: true,
      joined_date: '2023-06-15',
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'demo-user-2', 
      full_name: 'Marie Nkomo',
      avatar_url: '/avatars/demo2.jpg',
      bio: 'Propriétaire de plusieurs appartements meublés. Accueil chaleureux garanti!',
      location: 'Yaoundé, Cameroun',
      is_verified: true,
      is_pro: false,
      verification_level: 'id',
      listings_count: 3,
      rating: 4.9,
      reviews_count: 18,
      phone: '+237677987654',
      language: 'fr',
      currency: 'XAF',
      notifications_email: true,
      notifications_sms: true,
      joined_date: '2023-09-22',
      last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h ago
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      user_id: 'demo-user-3',
      full_name: 'Dr. Samuel Fomba',
      avatar_url: '/avatars/demo3.jpg', 
      bio: 'Médecin vivant en France, je gère mes propriétés au Cameroun via Findr.',
      location: 'Paris, France → Bafoussam, Cameroun',
      is_verified: true,
      is_pro: false,
      verification_level: 'id',
      listings_count: 2,
      rating: 4.7,
      reviews_count: 8,
      phone: '+33612345678',
      language: 'fr',
      currency: 'EUR',
      notifications_email: true,
      notifications_sms: false,
      joined_date: '2024-01-10',
      last_active: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
  
  const { data, error } = await supabase
    .from('profiles')
    .upsert(demoProfiles, { onConflict: 'user_id' })
    .select('*')
    
  if (error) {
    console.error('Error creating demo profiles:', error)
    return []
  }
  
  return data
}