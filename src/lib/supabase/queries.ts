import { createClient } from './client'

export type Listing = {
  id: string
  category: 'housing' | 'cars' | 'terrain' | 'jobs' | 'services'
  title: string
  description: string | null
  price: number
  city: string
  neighborhood: string | null
  images: string[]
  status: string
  is_featured: boolean
  is_verified: boolean
  views: number
  // Housing
  housing_type: string | null
  rental_period: string | null
  rooms: number | null
  bathrooms: number | null
  surface_m2: number | null
  furnished: boolean
  amenities: string[]
  // Cars
  car_brand: string | null
  car_model: string | null
  car_year: number | null
  price_per_day: number | null
  fuel_type: string | null
  transmission: string | null
  seats: number | null
  // Terrain
  terrain_type: string | null
  zoning: string | null
  title_deed: boolean | null
  // GPS
  latitude: number | null
  longitude: number | null
  // Jobs
  job_type: string | null
  company_name: string | null
  salary_min: number | null
  salary_max: number | null
  whatsapp_number: string | null
  user_id: string
  is_active: boolean
  created_at: string
}

export async function getListings(options?: {
  category?: string
  city?: string
  limit?: number
  featured?: boolean
}) {
  const supabase = createClient()
  
  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.city) {
    query = query.ilike('city', `%${options.city}%`)
  }

  if (options?.featured) {
    query = query.eq('is_featured', true)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching listings:', error)
    return []
  }

  return data as Listing[]
}

export async function getListing(id: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching listing:', error)
    return null
  }

  // TODO: Increment view count when function is created

  return data as Listing
}

export async function searchListings(query: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%,city.ilike.%${query}%,neighborhood.ilike.%${query}%`)
    .order('is_featured', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error searching listings:', error)
    return []
  }

  return data as Listing[]
}

export async function createListing(listingData: Partial<Listing>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .insert([{
      ...listingData,
      status: 'active', // Auto-approve for now
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single()

  if (error) {
    console.error('Error creating listing:', error)
    throw error
  }

  return data as Listing
}

export async function updateListing(id: string, updates: Partial<Listing>) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating listing:', error)
    throw error
  }

  return data as Listing
}

export async function deleteListing(id: string) {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting listing:', error)
    throw error
  }

  return true
}

export async function getUserListings(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching user listings:', error)
    return []
  }

  return data as Listing[]
}
