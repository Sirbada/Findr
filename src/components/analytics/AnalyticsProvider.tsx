'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { analytics } from '@/lib/analytics/tracker'

interface AnalyticsProviderProps {
  children: React.ReactNode
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view on route change
    const startTime = performance.now()
    
    const trackPageView = () => {
      const loadTime = Math.round(performance.now() - startTime)
      analytics.trackPageView(pathname, loadTime)
    }

    // Track immediately for client-side navigation
    trackPageView()

    // Also track when the page is fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', trackPageView)
      return () => document.removeEventListener('DOMContentLoaded', trackPageView)
    }
  }, [pathname])

  return <>{children}</>
}