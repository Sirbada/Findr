'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Users, Home, Flag, TrendingUp, AlertTriangle, 
  Clock, CheckCircle, DollarSign, Eye, ArrowUpRight, 
  ArrowDownRight, Calendar, MoreVertical, Check, X, Ban
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { adminQueries, type AdminStats, type UserData, type ListingData, type ReportData } from '@/lib/admin/queries'
import { useTranslation } from '@/lib/i18n/context'

function StatCard({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color = 'emerald',
  onClick 
}: {
  title: string
  value: number
  change?: number
  icon: any
  color?: string
  onClick?: () => void
}) {
  const colorClasses = {
    emerald: 'bg-emerald-100 text-emerald-600',
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600'
  }

  return (
    <div 
      className={`bg-white rounded-lg p-6 shadow-sm ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {value.toLocaleString()}
          </p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
              ) : change < 0 ? (
                <ArrowDownRight className="w-4 h-4 text-red-500 mr-1" />
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
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { t } = useTranslation()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<UserData[]>([])
  const [pendingListings, setPendingListings] = useState<ListingData[]>([])
  const [reportedContent, setReportedContent] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  async function loadDashboardData() {
    setLoading(true)
    try {
      const [statsData, usersData, listingsData, reportsData] = await Promise.all([
        adminQueries.getStats(),
        adminQueries.getUsers(1, 5),
        adminQueries.getListings(1, 5, 'pending'),
        adminQueries.getReports(1, 5, 'pending')
      ])

      setStats(statsData)
      setRecentUsers(usersData.users)
      setPendingListings(listingsData.listings)
      setReportedContent(reportsData.reports)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleListingAction(listingId: string, action: 'approve' | 'reject') {
    try {
      if (action === 'approve') {
        await adminQueries.approveListing(listingId)
      } else {
        const reason = prompt('Raison du rejet:') || 'Non spécifiée'
        await adminQueries.rejectListing(listingId, reason)
      }
      
      // Refresh data
      loadDashboardData()
    } catch (error) {
      console.error('Error handling listing action:', error)
    }
  }

  async function handleUserAction(userId: string, action: 'ban' | 'unban' | 'verify') {
    try {
      if (action === 'ban') {
        const reason = prompt('Raison du bannissement:') || 'Non spécifiée'
        await adminQueries.banUser(userId, reason)
      } else if (action === 'unban') {
        await adminQueries.unbanUser(userId)
      } else if (action === 'verify') {
        await adminQueries.verifyUser(userId)
      }
      
      loadDashboardData()
    } catch (error) {
      console.error('Error handling user action:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Erreur lors du chargement des données</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Vue d'ensemble
          <span className="block text-sm font-normal text-gray-500 mt-1">
            Admin Dashboard Overview
          </span>
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Utilisateurs totaux • Total Users"
          value={stats.totalUsers}
          change={Math.round(((stats.newUsersToday / stats.totalUsers) * 100) * 30)} // Rough monthly estimate
          icon={Users}
          color="blue"
          onClick={() => router.push('/admin/users')}
        />
        
        <StatCard
          title="Annonces actives • Active Listings"
          value={stats.activeListings}
          change={Math.round(((stats.listingsToday / stats.activeListings) * 100) * 30)}
          icon={Home}
          color="emerald"
          onClick={() => router.push('/admin/listings')}
        />
        
        <StatCard
          title="En attente • Pending Review"
          value={stats.pendingListings}
          icon={Clock}
          color="yellow"
          onClick={() => router.push('/admin/listings')}
        />
        
        <StatCard
          title="Signalements • Reports"
          value={stats.reportedContent}
          icon={Flag}
          color="red"
          onClick={() => router.push('/admin/reports')}
        />
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-6 text-white mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 mb-1">
              Revenus du mois • Monthly Revenue
            </p>
            <p className="text-3xl font-bold">
              {stats.revenue.monthly.toLocaleString()} XAF
            </p>
            <p className="text-emerald-100 text-sm">
              {stats.revenue.transactions} transactions • {stats.revenue.total.toLocaleString()} XAF total
            </p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Listings */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Annonces en attente
                <span className="block text-sm font-normal text-gray-500">
                  Pending Listings
                </span>
              </h3>
              <Link 
                href="/admin/listings?status=pending"
                className="text-sm text-emerald-600 hover:text-emerald-800"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingListings.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                Aucune annonce en attente
              </div>
            ) : (
              pendingListings.slice(0, 5).map((listing) => (
                <div key={listing.id} className="p-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {listing.title}
                    </p>
                    <p className="text-sm text-gray-500">
                      {listing.user_name} • {listing.category} • {listing.price.toLocaleString()} XAF
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(listing.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleListingAction(listing.id, 'approve')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                      title="Approuver"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleListingAction(listing.id, 'reject')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Rejeter"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Signalements récents
                <span className="block text-sm font-normal text-gray-500">
                  Recent Reports
                </span>
              </h3>
              <Link 
                href="/admin/reports"
                className="text-sm text-emerald-600 hover:text-emerald-800"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {reportedContent.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                Aucun signalement récent
              </div>
            ) : (
              reportedContent.slice(0, 5).map((report) => (
                <div key={report.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {report.target_title}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Signalé par {report.reporter_name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          report.type === 'listing' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {report.type === 'listing' ? '🏠 Annonce' : '👤 Utilisateur'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {report.reason}
                        </span>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Nouveaux utilisateurs
                <span className="block text-sm font-normal text-gray-500">
                  Recent Users
                </span>
              </h3>
              <Link 
                href="/admin/users"
                className="text-sm text-emerald-600 hover:text-emerald-800"
              >
                Voir tout
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentUsers.slice(0, 5).map((user) => (
              <div key={user.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {user.full_name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {user.full_name || 'Nom non défini'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user.email} • {user.listing_count} annonces
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                    user.is_blocked 
                      ? 'bg-red-100 text-red-700'
                      : user.is_verified
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {user.is_blocked ? 'Banni' : user.is_verified ? 'Vérifié' : 'En attente'}
                  </span>
                  {!user.is_verified && !user.is_blocked && (
                    <button
                      onClick={() => handleUserAction(user.id, 'verify')}
                      className="p-1 text-green-600 hover:bg-green-50 rounded"
                      title="Vérifier"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Actions rapides
              <span className="block text-sm font-normal text-gray-500">
                Quick Actions
              </span>
            </h3>
          </div>
          <div className="p-6 space-y-4">
            <Link 
              href="/admin/listings?status=pending"
              className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-gray-900">Modérer les annonces</p>
                  <p className="text-sm text-gray-500">{stats.pendingListings} en attente</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </Link>

            <Link 
              href="/admin/reports"
              className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Flag className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-gray-900">Traiter les signalements</p>
                  <p className="text-sm text-gray-500">{stats.reportedContent} signalements</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </Link>

            <Link 
              href="/admin/analytics"
              className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900">Voir les statistiques</p>
                  <p className="text-sm text-gray-500">Analyses détaillées</p>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}