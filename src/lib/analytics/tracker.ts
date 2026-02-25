import { createClient } from '@/lib/supabase/client'

export interface AnalyticsEvent {
  event_type: 'page_view' | 'listing_view' | 'listing_contact' | 'listing_call' | 'listing_share' | 'search' | 'user_signup' | 'user_login' | 'listing_favorite' | 'listing_unfavorite' | 'listing_create' | 'click' | 'conversion'
  page_url?: string
  referrer?: string
  listing_id?: string
  search_query?: string
  category?: string
  user_agent?: string
  device_type?: 'mobile' | 'tablet' | 'desktop'
  browser?: string
  os?: string
  country?: string
  city?: string
  page_load_time?: number
  metadata?: Record<string, any>
}

class AnalyticsTracker {
  private supabase = createClient()
  private sessionId: string
  private deviceInfo: {
    device_type: 'mobile' | 'tablet' | 'desktop'
    browser: string
    os: string
    user_agent: string
  }

  constructor() {
    this.sessionId = this.generateSessionId()
    this.deviceInfo = this.getDeviceInfo()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private getDeviceInfo() {
    if (typeof window === 'undefined') {
      return {
        device_type: 'desktop' as const,
        browser: 'unknown',
        os: 'unknown',
        user_agent: 'server'
      }
    }

    const userAgent = navigator.userAgent
    
    // Device type detection
    let device_type: 'mobile' | 'tablet' | 'desktop' = 'desktop'
    if (/Mobi|Android/i.test(userAgent)) {
      device_type = 'mobile'
    } else if (/Tablet|iPad/i.test(userAgent)) {
      device_type = 'tablet'
    }

    // Browser detection
    let browser = 'unknown'
    if (userAgent.includes('Chrome')) browser = 'Chrome'
    else if (userAgent.includes('Firefox')) browser = 'Firefox'
    else if (userAgent.includes('Safari')) browser = 'Safari'
    else if (userAgent.includes('Edge')) browser = 'Edge'
    else if (userAgent.includes('Opera')) browser = 'Opera'

    // OS detection
    let os = 'unknown'
    if (userAgent.includes('Windows')) os = 'Windows'
    else if (userAgent.includes('Mac')) os = 'macOS'
    else if (userAgent.includes('Linux')) os = 'Linux'
    else if (userAgent.includes('Android')) os = 'Android'
    else if (userAgent.includes('iOS')) os = 'iOS'

    return {
      device_type,
      browser,
      os,
      user_agent: userAgent
    }
  }

  async track(event: AnalyticsEvent) {
    try {
      const { data: { user } } = await this.supabase.auth.getUser()
      
      await this.supabase.from('analytics_events').insert({
        session_id: this.sessionId,
        user_id: user?.id || null,
        event_type: event.event_type,
        page_url: event.page_url || (typeof window !== 'undefined' ? window.location.href : null),
        referrer: event.referrer || (typeof document !== 'undefined' ? document.referrer : null),
        listing_id: event.listing_id || null,
        search_query: event.search_query || null,
        category: event.category || null,
        page_load_time: event.page_load_time || null,
        metadata: event.metadata || {},
        ...this.deviceInfo,
        country: 'CM', // Default to Cameroon
        city: event.city || null
      })
    } catch (error) {
      // Fail silently to not impact user experience
      console.warn('Analytics tracking failed:', error)
    }
  }

  // Convenience methods for common events
  async trackPageView(page_url?: string, page_load_time?: number) {
    await this.track({
      event_type: 'page_view',
      page_url,
      page_load_time
    })
  }

  async trackListingView(listing_id: string, category?: string) {
    await this.track({
      event_type: 'listing_view',
      listing_id,
      category
    })
  }

  async trackSearch(query: string, category?: string, results_count?: number) {
    await this.track({
      event_type: 'search',
      search_query: query,
      category,
      metadata: { results_count }
    })
  }

  async trackListingContact(listing_id: string, method: 'whatsapp' | 'call' | 'message') {
    await this.track({
      event_type: 'listing_contact',
      listing_id,
      metadata: { contact_method: method }
    })
  }

  async trackListingShare(listing_id: string, platform: string) {
    await this.track({
      event_type: 'listing_share',
      listing_id,
      metadata: { platform }
    })
  }

  async trackClick(element_id: string, page_url?: string) {
    await this.track({
      event_type: 'click',
      page_url,
      metadata: { element_id }
    })
  }

  async trackConversion(type: string, value?: number, listing_id?: string) {
    await this.track({
      event_type: 'conversion',
      listing_id,
      metadata: { conversion_type: type, value }
    })
  }
}

// Export singleton instance
export const analytics = new AnalyticsTracker()

// React hook for analytics
export function useAnalytics() {
  return analytics
}