import { createClient } from './client'

export type ServiceCategory = {
  id: string
  name: string
  slug: string
  icon: string | null
}

export type ServiceListing = {
  id: string
  pro_id: string
  category_id: string | null
  title: string
  description: string | null
  city: string
  neighborhoods: string[]
  service_area_radius_km: number
  address: string | null
  latitude: number | null
  longitude: number | null
  images: string[]
  skills: string[]
  pricing_type: 'quote'
  status: 'active' | 'paused' | 'archived'
  is_verified: boolean
  views: number
  created_at: string
  service_categories?: { name: string; slug: string } | null
}

export async function getServices(options?: {
  city?: string
  categoryId?: string
  limit?: number
}) {
  const supabase = createClient()
  let query = supabase
    .from('service_listings')
    .select('*, service_categories(name, slug)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (options?.city) query = query.ilike('city', `%${options.city}%`)
  if (options?.categoryId) query = query.eq('category_id', options.categoryId)
  if (options?.limit) query = query.limit(options.limit)

  const { data, error } = await query
  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return data as ServiceListing[]
}

export async function getService(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('service_listings')
    .select('*, service_categories(name, slug)')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching service:', error)
    return null
  }

  return data as ServiceListing
}
