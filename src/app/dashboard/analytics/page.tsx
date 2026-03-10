'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/context'
import { useTranslation } from '@/lib/i18n/context'
import { getAnalytics, type AnalyticsData } from '@/lib/analytics/queries'
import { 
  TrendingUp, Eye, Search, MessageSquare, Share2, Heart,
  Calendar, Monitor, Smartphone, Tablet, ArrowUp, ArrowDown
} from 'lucide-react'
import Link from 'next/link'

// Simple CSS-only chart components
function SimpleBarChart({ 
  data, 
  title, 
  className = '' 
}: { 
  data: Array<{ date: string; views: number }>
  title: string
  className?: string 
}) {
  const maxValue = Math.max(...data.map(d => d.views))
  
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(-7).map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-16 text-sm text-gray-500">
              {new Date(item.date).toLocaleDateString('fr-FR', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#FFF4EC]0 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(item.views / maxValue) * 100}%` }}
                />
              </div>
            </div>
            <div className="w-12 text-sm font-medium text-gray-900 text-right">
              {item.views}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SimplePieChart({ 
  data, 
  title, 
  className = '' 
}: { 
  data: Array<{ category: string; count: number }>
  title: string
  className?: string 
}) {
  const total = data.reduce((sum, item) => sum + item.count, 0)
  const colors = ['#059669', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5']
  
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.slice(0, 5).map((item, index) => (
          <div key={index} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-3"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700 capitalize">{item.category}</span>
                <span className="text-sm font-medium text-gray-900">
                  {Math.round((item.count / total) * 100)}%
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-1 mt-1">
                <div 
                  className="h-1 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(item.count / total) * 100}%`,
                    backgroundColor: colors[index % colors.length]
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MetricCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  className = '' 
}: {
  title: string
  value: number
  change?: number
  icon: any
  className?: string
}) {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-1">
              {change > 0 ? (
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
              ) : change < 0 ? (
                <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
              ) : null}
              <span className={`text-sm ${
                change > 0 ? 'text-green-600' : 
                change < 0 ? 'text-red-600' : 'text-gray-500'
              }`}>
                {change > 0 ? '+' : ''}{change}% vs dernier mois
              </span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-[#FFF4EC] rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-[#E8630A]" />
        </div>
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { t } = useTranslation()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange, user])

  async function fetchAnalytics() {
    if (!user) return

    setLoading(true)
    try {
      const endDate = new Date().toISOString()
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      
      const data = await getAnalytics(startDate, endDate, user.id)
      setAnalyticsData(data)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Connexion requise</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Erreur lors du chargement des données</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Tableau de bord analytique
                <span className="block text-sm font-normal text-gray-500 mt-0.5">
                  Analytics Dashboard
                </span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  { value: '7d', label: '7j' },
                  { value: '30d', label: '30j' },
                  { value: '90d', label: '90j' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setTimeRange(option.value as any)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                      timeRange === option.value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              <Link href="/dashboard" className="text-sm text-[#E8630A] hover:text-[#E8630A]">
                ← Retour au tableau de bord
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Vues totales • Total Views"
            value={analyticsData.totalViews}
            change={15}
            icon={Eye}
          />
          <MetricCard
            title="Recherches • Searches"
            value={analyticsData.totalSearches}
            change={8}
            icon={Search}
          />
          <MetricCard
            title="Contacts • Contacts"
            value={analyticsData.totalContacts}
            change={-3}
            icon={MessageSquare}
          />
          <MetricCard
            title="Taux de conversion • Conversion"
            value={analyticsData.totalContacts > 0 ? 
              Math.round((analyticsData.totalContacts / analyticsData.totalViews) * 100) : 0}
            change={2}
            icon={TrendingUp}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Views Over Time */}
          <SimpleBarChart
            data={analyticsData.dailyViews}
            title="Vues par jour • Daily Views"
          />

          {/* Popular Categories */}
          <SimplePieChart
            data={analyticsData.popularCategories}
            title="Catégories populaires • Popular Categories"
          />

          {/* Device Breakdown */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Appareils • Device Types
            </h3>
            <div className="space-y-4">
              {analyticsData.deviceBreakdown.map((device, index) => {
                const total = analyticsData.deviceBreakdown.reduce((sum, d) => sum + d.count, 0)
                const percentage = Math.round((device.count / total) * 100)
                
                const Icon = device.device_type === 'mobile' ? Smartphone :
                           device.device_type === 'tablet' ? Tablet : Monitor
                
                return (
                  <div key={index} className="flex items-center">
                    <Icon className="w-5 h-5 text-gray-400 mr-3" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {device.device_type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {device.count} ({percentage}%)
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#FFF4EC]0 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Entonnoir de conversion • Conversion Funnel
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Vues • Views', value: analyticsData.conversionFunnel.views, color: 'bg-[#FFF4EC]0' },
                { label: 'Contacts • Contacts', value: analyticsData.conversionFunnel.contacts, color: 'bg-[#E8630A]' },
                { label: 'Conversions • Conversions', value: analyticsData.conversionFunnel.conversions, color: 'bg-[#E8630A]' }
              ].map((step, index) => {
                const percentage = index === 0 ? 100 : 
                                 Math.round((step.value / analyticsData.conversionFunnel.views) * 100)
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">{step.label}</span>
                      <span className="text-sm text-gray-500">{step.value} ({percentage}%)</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-300 ${step.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Top Listings */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Annonces les plus vues • Top Performing Listings
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annonce • Listing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vues • Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacts • Contacts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taux • Rate
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.topListings.slice(0, 10).map((listing, index) => (
                  <tr key={listing.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {listing.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {listing.contacts.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#FFF4EC] text-[#E8630A]">
                        {listing.views > 0 ? Math.round((listing.contacts / listing.views) * 100) : 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}