import { createClient } from './client'

export type Listing = {
  id: string
  category: 'housing' | 'cars' | 'jobs'
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
  // Jobs
  job_type: string | null
  company_name: string | null
  salary_min: number | null
  salary_max: number | null
  created_at: string
}

export type Property = {
  id: string
  owner_id: string | null
  title: string
  description: string | null
  city: string
  neighborhood: string | null
  address: string | null
  images: string[]
  status: string
  is_featured: boolean
  is_verified: boolean
  views: number
  property_type: string
  price_per_night: number
  currency: string
  bedrooms: number | null
  bathrooms: number | null
  surface_m2: number | null
  max_guests: number | null
  furnished: boolean
  amenities: string[]
  created_at: string
}

export type Vehicle = {
  id: string
  owner_id: string | null
  title: string
  description: string | null
  city: string
  neighborhood: string | null
  address: string | null
  images: string[]
  status: string
  is_featured: boolean
  is_verified: boolean
  views: number
  brand: string | null
  model: string | null
  year: number | null
  price_per_day: number
  currency: string
  fuel_type: string | null
  transmission: string | null
  seats: number | null
  mileage_km: number | null
  extras: string[]
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

export async function getProperties(options?: {
  city?: string
  limit?: number
  featured?: boolean
}) {
  const supabase = createClient()
  let query = supabase
    .from('properties')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (options?.city) query = query.ilike('city', `%${options.city}%`)
  if (options?.featured) query = query.eq('is_featured', true)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching properties:', error)
    return []
  }
  return data as Property[]
}

export async function getProperty(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching property:', error)
    return null
  }
  return data as Property
}

export async function getVehicles(options?: {
  city?: string
  limit?: number
  featured?: boolean
}) {
  const supabase = createClient()
  let query = supabase
    .from('vehicles')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (options?.city) query = query.ilike('city', `%${options.city}%`)
  if (options?.featured) query = query.eq('is_featured', true)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching vehicles:', error)
    return []
  }
  return data as Vehicle[]
}

export async function getVehicle(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching vehicle:', error)
    return null
  }
  return data as Vehicle
}
