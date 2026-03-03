'use client'

import { useState, useEffect } from 'react'
import { 
  Search, Filter, MoreVertical, Check, X, Ban, 
  Shield, Eye, Calendar, MapPin, Phone, Mail
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { adminQueries, type UserData } from '@/lib/admin/queries'
import { useTranslation } from '@/lib/i18n/context'

export default function AdminUsersPage() {
  const { t } = useTranslation()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked' | 'unverified'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [currentPage, statusFilter, searchQuery])

  async function loadUsers() {
    setLoading(true)
    try {
      const { users: usersData, total } = await adminQueries.getUsers(
        currentPage, 
        20, 
        searchQuery || undefined, 
        statusFilter
      )
      
      setUsers(usersData)
      setTotalPages(Math.ceil(total / 20))
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUserAction(userId: string, action: 'ban' | 'unban' | 'verify') {
    setActionLoading(userId)
    try {
      if (action === 'ban') {
        const reason = prompt('Raison du bannissement:') || 'Non spécifiée'
        await adminQueries.banUser(userId, reason)
      } else if (action === 'unban') {
        await adminQueries.unbanUser(userId)
      } else if (action === 'verify') {
        await adminQueries.verifyUser(userId)
      }
      
      await loadUsers()
    } catch (error) {
      console.error('Error handling user action:', error)
      alert('Erreur lors de l\'action. Veuillez réessayer.')
    } finally {
      setActionLoading(null)
    }
  }

  function getUserStatusBadge(user: UserData) {
    if (user.is_blocked) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-700">
          🚫 Banni
        </span>
      )
    }
    
    if (user.is_verified) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
          ✅ Vérifié
        </span>
      )
    }
    
    return (
      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-700">
        ⏳ En attente
      </span>
    )
  }

  function getTrustScoreColor(score: number) {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Gestion des utilisateurs
          <span className="block text-sm font-normal text-gray-500 mt-1">
            User Management
          </span>
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher par nom, email, téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="unverified">Non vérifiés</option>
              <option value="blocked">Bannis</option>
            </select>
          </div>

          {/* Search Button */}
          <Button onClick={loadUsers} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Search className="w-4 h-4 mr-2" />
            Rechercher
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Chargement des utilisateurs...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Aucun utilisateur trouvé</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur • User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut • Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activité • Activity
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-gray-600 font-medium">
                              {user.full_name?.charAt(0) || '?'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.full_name || 'Nom non défini'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.listing_count} annonces • Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.email && (
                            <div className="flex items-center mb-1">
                              <Mail className="w-4 h-4 text-gray-400 mr-2" />
                              {user.email}
                            </div>
                          )}
                          {user.phone && (
                            <div className="flex items-center mb-1">
                              <Phone className="w-4 h-4 text-gray-400 mr-2" />
                              {user.phone}
                            </div>
                          )}
                          {user.city && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                              {user.city}
                            </div>
                          )}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getUserStatusBadge(user)}
                        {user.blocked_reason && (
                          <div className="text-xs text-red-600 mt-1">
                            {user.blocked_reason}
                          </div>
                        )}
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`text-sm font-medium ${getTrustScoreColor(user.trust_score)}`}>
                            {user.trust_score}/100
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          Dernière activité:
                        </div>
                        <div>
                          {new Date(user.last_active_at).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {!user.is_verified && !user.is_blocked && (
                            <button
                              onClick={() => handleUserAction(user.id, 'verify')}
                              disabled={actionLoading === user.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Vérifier l'utilisateur"
                            >
                              {actionLoading === user.id ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Shield className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          
                          {user.is_blocked ? (
                            <button
                              onClick={() => handleUserAction(user.id, 'unban')}
                              disabled={actionLoading === user.id}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Débannir l'utilisateur"
                            >
                              {actionLoading === user.id ? (
                                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUserAction(user.id, 'ban')}
                              disabled={actionLoading === user.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Bannir l'utilisateur"
                            >
                              {actionLoading === user.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>
                          )}
                          
                          <button
                            className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
                            title="Plus d'actions"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm text-gray-700">
                      Page <span className="font-medium">{currentPage}</span> sur{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}