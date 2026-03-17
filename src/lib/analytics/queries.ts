import { createClient } from '@/lib/supabase/client'

export interface AnalyticsData {
  totalViews: number
  totalSearches: number
  totalContacts: number
  dailyViews: Array<{ date: string; views: number }>
  topListings: Array<{ id: string; title: string; views: number; contacts: number }>
  popularCategories: Array<{ category: string; count: number }>
  deviceBreakdown: Array<{ device_type: string; count: number }>
  conversionFunnel: {
    views: number
    contacts: number
    conversions: number
  }
}

export interface ListingAnalytics {
  id: string
  views: number
  contacts: number
  shares: number
  favorites: number
  daily_views: Array<{ date: string; views: number }>
  source_breakdown: Array<{ source: string; views: number }>
}

export async function getAnalytics(
  startDate: string,
  endDate: string,
  userId?: string
): Promise<AnalyticsData> {
  const supabase = createClient()
  
  // Base query filter
  let baseQuery = supabase
    .from('analytics_events')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
  
  if (userId) {
    baseQuery = baseQuery.eq('user_id', userId)
  }

  const { data: events, error } = await baseQuery

  if (error) {
    console.error('Error fetching analytics:', error)
    throw error
  }

  // Process the data
  const totalViews = events.filter(e => e.event_type === 'page_view' || e.event_type === 'listing_view').length
  const totalSearches = events.filter(e => e.event_type === 'search').length
  const totalContacts = events.filter(e => e.event_type === 'listing_contact').length

  // Daily views
  const dailyViewsMap = new Map<string, number>()
  events
    .filter(e => e.event_type === 'page_view' || e.event_type === 'listing_view')
    .forEach(event => {
      const date = new Date(event.created_at).toISOString().split('T')[0]
      dailyViewsMap.set(date, (dailyViewsMap.get(date) || 0) + 1)
    })
  
  const dailyViews = Array.from(dailyViewsMap.entries())
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Device breakdown
  const deviceMap = new Map<string, number>()
  events.forEach(event => {
    if (event.device_type) {
      deviceMap.set(event.device_type, (deviceMap.get(event.device_type) || 0) + 1)
    }
  })

  const deviceBreakdown = Array.from(deviceMap.entries())
    .map(([device_type, count]) => ({ device_type, count }))
    .sort((a, b) => b.count - a.count)

  // Popular categories
  const categoryMap = new Map<string, number>()
  events
    .filter(e => e.category)
    .forEach(event => {
      categoryMap.set(event.category!, (categoryMap.get(event.category!) || 0) + 1)
    })

  const popularCategories = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)

  // Top listings (need to join with listings table)
  const { data: listingsData } = await supabase
    .from('listings')
    .select(`
      id, title, views,
      analytics_events!inner(listing_id, event_type, created_at)
    `)
    .gte('analytics_events.created_at', startDate)
    .lte('analytics_events.created_at', endDate)
    .limit(10)

  // Process top listings
  const listingStatsMap = new Map<string, { id: string; title: string; views: number; contacts: number }>()
  
  if (listingsData) {
    listingsData.forEach((listing: any) => {
      if (!listingStatsMap.has(listing.id)) {
        listingStatsMap.set(listing.id, {
          id: listing.id,
          title: listing.title,
          views: 0,
          contacts: 0
        })
      }
      
      const stats = listingStatsMap.get(listing.id)!
      listing.analytics_events.forEach((event: any) => {
        if (event.event_type === 'listing_view') {
          stats.views++
        } else if (event.event_type === 'listing_contact') {
          stats.contacts++
        }
      })
    })
  }

  const topListings = Array.from(listingStatsMap.values())
    .sort((a, b) => b.views - a.views)
    .slice(0, 10)

  // Conversion funnel
  const views = events.filter(e => e.event_type === 'listing_view').length
  const contacts = events.filter(e => e.event_type === 'listing_contact').length
  const conversions = events.filter(e => e.event_type === 'conversion').length

  return {
    totalViews,
    totalSearches,
    totalContacts,
    dailyViews,
    topListings,
    popularCategories,
    deviceBreakdown,
    conversionFunnel: {
      views,
      contacts,
      conversions
    }
  }
}

export async function getListingAnalytics(
  listingId: string,
  startDate: string,
  endDate: string
): Promise<ListingAnalytics> {
  const supabase = createClient()
  
  const { data: events, error } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('listing_id', listingId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)

  if (error) {
    console.error('Error fetching listing analytics:', error)
    throw error
  }

  // Process events
  const views = events.filter(e => e.event_type === 'listing_view').length
  const contacts = events.filter(e => e.event_type === 'listing_contact').length
  const shares = events.filter(e => e.event_type === 'listing_share').length
  const favorites = events.filter(e => e.event_type === 'listing_favorite').length

  // Daily views
  const dailyViewsMap = new Map<string, number>()
  events
    .filter(e => e.event_type === 'listing_view')
    .forEach(event => {
      const date = new Date(event.created_at).toISOString().split('T')[0]
      dailyViewsMap.set(date, (dailyViewsMap.get(date) || 0) + 1)
    })
  
  const daily_views = Array.from(dailyViewsMap.entries())
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => a.date.localeCompare(b.date))

  // Source breakdown (from referrer)
  const sourceMap = new Map<string, number>()
  events
    .filter(e => e.event_type === 'listing_view')
    .forEach(event => {
      let source = 'Direct'
      if (event.referrer) {
        if (event.referrer.includes('google')) source = 'Google'
        else if (event.referrer.includes('facebook')) source = 'Facebook'
        else if (event.referrer.includes('whatsapp')) source = 'WhatsApp'
        else if (event.referrer.includes('findr')) source = 'Internal'
        else source = 'Other'
      }
      sourceMap.set(source, (sourceMap.get(source) || 0) + 1)
    })

  const source_breakdown = Array.from(sourceMap.entries())
    .map(([source, views]) => ({ source, views }))
    .sort((a, b) => b.views - a.views)

  return {
    id: listingId,
    views,
    contacts,
    shares,
    favorites,
    daily_views,
    source_breakdown
  }
}