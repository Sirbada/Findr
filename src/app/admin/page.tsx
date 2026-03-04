'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard, Users, Home, Car, Flag, Shield, Settings,
  Search, MoreVertical, Check, X, Ban, Eye, Trash2, 
  ChevronDown, Filter, Download, Bell, LogOut,
  TrendingUp, AlertTriangle, Clock, CheckCircle,
  DollarSign, PieChart, BarChart3, Calendar, ArrowUpRight, ArrowDownRight, UserCog
} from 'lucide-react'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { 
  generateDemoTransactions, 
  calculateMonthlyRevenue, 
  formatCurrency,
  type Transaction,
  type MonthlyRevenue,
  PREMIUM_LISTINGS
} from '@/lib/commission/calculator'

// Demo data
const stats = {
  totalUsers: 1247,
  activeListings: 342,
  pendingReview: 18,
  reportedContent: 5,
  newUsersToday: 23,
  listingsToday: 12,
}

const pendingListings = [
  {
    id: '1',
    title: 'Appartement 3 pièces à Bonanjo',
    category: 'housing',
    user: 'Marie Fotso',
    userId: 'u1',
    createdAt: '2026-01-31 14:30',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100',
  },
  {
    id: '2',
    title: 'Toyota Corolla 2022',
    category: 'cars',
    user: 'Jean Kamga',
    userId: 'u2',
    createdAt: '2026-01-31 13:15',
    image: 'https://images.unsplash.com/photo-1568844293986-8c1a5c14e3f7?w=100',
  },
  {
    id: '3',
    title: 'Studio meublé à Bastos',
    category: 'housing',
    user: 'Paul Nkeng',
    userId: 'u3',
    createdAt: '2026-01-31 12:00',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=100',
  },
]

const reportedContent = [
  {
    id: '1',
    type: 'listing',
    title: 'Annonce suspecte - Prix trop bas',
    reportedBy: 'user123',
    reason: 'Arnaque suspectée',
    createdAt: '2026-01-31 10:00',
    status: 'pending',
  },
  {
    id: '2',
    type: 'user',
    title: 'Utilisateur spammeur',
    reportedBy: 'user456',
    reason: 'Spam répétitif',
    createdAt: '2026-01-30 18:30',
    status: 'pending',
  },
]

const recentUsers = [
  { id: '1', name: 'Marie Fotso', email: 'marie@email.com', status: 'active', listings: 5, joined: '2026-01-30' },
  { id: '2', name: 'Jean Kamga', email: 'jean@email.com', status: 'active', listings: 3, joined: '2026-01-29' },
  { id: '3', name: 'Spam User', email: 'spam@fake.com', status: 'banned', listings: 0, joined: '2026-01-31' },
  { id: '4', name: 'Paul Nkeng', email: 'paul@email.com', status: 'pending', listings: 1, joined: '2026-01-31' },
]

const adminRoles = [
  { id: 'sa1', name: 'Bada', email: 'bada@findr.cm', role: 'super_admin', scope: 'global' },
  { id: 'a1', name: 'Marie Fotso', email: 'marie@email.com', role: 'admin', scope: 'global' },
]

// Generate demo transactions for revenue tracking
const demoTransactions = generateDemoTransactions(75)

type Tab = 'overview' | 'listings' | 'users' | 'reports' | 'revenue' | 'roles' | 'settings' | 'verifications'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleForm, setRoleForm] = useState({ userId: '', role: 'admin' })
  const [roleStatus, setRoleStatus] = useState('')
  const [trustForm, setTrustForm] = useState({ userId: '', score: 85 })
  const [trustStatus, setTrustStatus] = useState('')
  const [verifications, setVerifications] = useState<any[]>([])
  const [verificationsLoading, setVerificationsLoading] = useState(false)
  const [verificationActionStatus, setVerificationActionStatus] = useState<Record<string, string>>({})

  const roleSchema = z.object({
    userId: z.string().uuid(),
    role: z.enum(['admin', 'pro', 'user']),
  })

  const trustSchema = z.object({
    userId: z.string().uuid(),
    score: z.number().min(0).max(100),
  })

  const handleAssignRole = async () => {
    setRoleStatus('')
    const parsed = roleSchema.safeParse(roleForm)
    if (!parsed.success) {
      setRoleStatus('ID utilisateur invalide.')
      return
    }
    const supabase = createClient()
    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: roleForm.userId, role: roleForm.role })
    if (error) {
      setRoleStatus('Accès refusé ou erreur réseau.')
      return
    }
    setRoleStatus('Rôle mis à jour.')
  }

  const handleTrustUpdate = async () => {
    setTrustStatus('')
    const parsed = trustSchema.safeParse({
      userId: trustForm.userId,
      score: Number(trustForm.score),
    })
    if (!parsed.success) {
      setTrustStatus('Entrée invalide.')
      return
    }
    const supabase = createClient()
    const { error } = await supabase
      .from('trust_scores')
      .upsert({ user_id: parsed.data.userId, score: parsed.data.score })
    if (error) {
      setTrustStatus('Accès refusé ou erreur réseau.')
      return
    }
    setTrustStatus('Trust Score mis à jour.')
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      {/* Top Bar */}
      <header className="bg-[color:var(--glass)] backdrop-blur-md border-b border-white/40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[color:var(--green-600)] rounded-xl flex items-center justify-center shadow-[var(--shadow-soft-sm)]">
                <span className="text-white font-bold">F</span>
              </div>
              <span className="font-bold text-[color:var(--green-900)]">Findr</span>
            </Link>
            <span className="bg-[color:var(--green-50)] text-[color:var(--green-700)] text-xs font-medium px-2 py-1 rounded-full">
              Admin Panel
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[color:var(--green-700)] hover:bg-[color:var(--green-50)] rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[color:var(--green-50)] rounded-full flex items-center justify-center">
                <span className="text-[color:var(--green-700)] font-semibold text-sm">A</span>
              </div>
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-[color:var(--card)] shadow-sm min-h-[calc(100vh-56px)] p-4">
          <nav className="space-y-1">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Vue d\'ensemble' },
              { id: 'revenue', icon: DollarSign, label: 'Revenus', highlight: true },
              { id: 'listings', icon: Home, label: 'Annonces', badge: stats.pendingReview },
              { id: 'users', icon: Users, label: 'Utilisateurs' },
              { id: 'reports', icon: Flag, label: 'Signalements', badge: stats.reportedContent },
              { id: 'verifications', icon: Shield, label: 'Vérifications' },
              { id: 'roles', icon: UserCog, label: 'Rôles & Admins' },
              { id: 'settings', icon: Settings, label: 'Paramètres' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-[color:var(--green-50)] text-[color:var(--green-700)]'
                    : 'text-[color:var(--green-700)] hover:bg-[color:var(--green-50)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-[color:var(--green-50)] rounded-2xl">
            <p className="text-xs text-gray-500 mb-2">Connecté en tant que</p>
            <p className="font-medium text-gray-900">Super Admin</p>
            <button className="mt-3 flex items-center gap-2 text-sm text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Vue d'ensemble</h1>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <span className="text-green-600 text-sm font-medium flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{stats.newUsersToday}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-gray-500 text-sm">Utilisateurs totaux</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Home className="w-6 h-6 text-emerald-600" />
                    </div>
                    <span className="text-green-600 text-sm font-medium flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +{stats.listingsToday}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeListings}</p>
                  <p className="text-gray-500 text-sm">Annonces actives</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.pendingReview}</p>
                  <p className="text-gray-500 text-sm">En attente de validation</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.reportedContent}</p>
                  <p className="text-gray-500 text-sm">Contenus signalés</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Pending Listings */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Annonces en attente</h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('listings')}>
                      Voir tout
                    </Button>
                  </div>
                  <div className="divide-y">
                    {pendingListings.slice(0, 3).map((listing) => (
                      <div key={listing.id} className="p-4 flex items-center gap-4">
                        <img src={listing.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{listing.title}</p>
                          <p className="text-sm text-gray-500">Par {listing.user}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg" title="Approuver">
                            <Check className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Rejeter">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Signalements récents</h2>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('reports')}>
                      Voir tout
                    </Button>
                  </div>
                  <div className="divide-y">
                    {reportedContent.map((report) => (
                      <div key={report.id} className="p-4 flex items-center gap-4">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <Flag className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{report.title}</p>
                          <p className="text-sm text-gray-500">{report.reason}</p>
                        </div>
                        <Button size="sm" variant="outline">Examiner</Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Listings Tab */}
          {activeTab === 'listings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des annonces</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exporter
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher une annonce..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                    <option>Tous les statuts</option>
                    <option>En attente</option>
                    <option>Approuvé</option>
                    <option>Rejeté</option>
                  </select>
                  <select className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500">
                    <option>Toutes les catégories</option>
                    <option>Immobilier</option>
                    <option>Véhicules</option>
                  </select>
                </div>
              </div>

              {/* Listings Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Annonce</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Catégorie</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {pendingListings.map((listing) => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={listing.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-medium text-gray-900">{listing.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            listing.category === 'housing' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {listing.category === 'housing' ? 'Immobilier' : 'Véhicule'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{listing.user}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{listing.createdAt}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            En attente
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Voir">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Approuver">
                              <Check className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Rejeter">
                              <X className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Supprimer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
              </div>

              {/* Search */}
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher un utilisateur..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <select className="px-4 py-2 border rounded-lg">
                    <option>Tous les statuts</option>
                    <option>Actif</option>
                    <option>En attente</option>
                    <option>Banni</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Annonces</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Inscrit le</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
                      <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {recentUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-emerald-600 font-semibold">{user.email?.charAt(0).toUpperCase() || "U"}</span>
                            </div>
                            <span className="font-medium text-gray-900">{user.email || "User"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 text-gray-600">{user.listings}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{user.joined}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' :
                            user.status === 'banned' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {user.status === 'active' ? 'Actif' : user.status === 'banned' ? 'Banni' : 'En attente'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Voir profil">
                              <Eye className="w-4 h-4" />
                            </button>
                            {user.status !== 'banned' ? (
                              <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Bannir">
                                <Ban className="w-4 h-4" />
                              </button>
                            ) : (
                              <button className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded" title="Débannir">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded" title="Supprimer">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Signalements</h1>
              
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y">
                  {reportedContent.map((report) => (
                    <div key={report.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                            <Flag className="w-6 h-6 text-red-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{report.title}</h3>
                            <p className="text-gray-600 mt-1">{report.reason}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Signalé par {report.reportedBy} • {report.createdAt}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">Ignorer</Button>
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">Action</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Roles Tab */}
          {activeTab === 'roles' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Rôles & Admins</h1>

              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-2">Super Admin</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Le Super Admin peut nommer des admins avec des droits limités. Les admins ne peuvent pas gérer les rôles.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm">Nommer un admin</Button>
                  <Button size="sm" variant="outline">Inviter par email</Button>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-[1.2fr_1fr_auto]">
                  <input
                    value={roleForm.userId}
                    onChange={(e) => setRoleForm({ ...roleForm, userId: e.target.value })}
                    placeholder="ID utilisateur (UUID)"
                    className="rounded-2xl border border-[color:var(--green-100)] bg-white/80 px-4 py-2 text-sm"
                  />
                  <select
                    value={roleForm.role}
                    onChange={(e) => setRoleForm({ ...roleForm, role: e.target.value })}
                    className="rounded-2xl border border-[color:var(--green-100)] bg-white/80 px-4 py-2 text-sm"
                  >
                    <option value="admin">Admin</option>
                    <option value="pro">Pro</option>
                    <option value="user">User</option>
                  </select>
                  <Button size="sm" onClick={handleAssignRole}>
                    Appliquer
                  </Button>
                </div>
                {roleStatus && (
                  <p className="mt-3 text-xs text-[color:var(--green-700)]">{roleStatus}</p>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Administrateurs</h2>
                </div>
                <div className="divide-y">
                  {adminRoles.map((admin) => (
                    <div key={admin.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{admin.name}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          admin.role === 'super_admin'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                        <Button size="sm" variant="outline">
                          Configurer les accès
                        </Button>
                        {admin.role !== 'super_admin' && (
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            Retirer
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-2">Trust Score (Admin)</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Ajustez le score en cas de litige, fraude ou vérification manuelle.
                </p>
                <div className="grid gap-3 md:grid-cols-[1.2fr_auto_auto]">
                  <input
                    placeholder="ID utilisateur (UUID)"
                    value={trustForm.userId}
                    onChange={(e) => setTrustForm({ ...trustForm, userId: e.target.value })}
                    className="rounded-2xl border border-[color:var(--green-100)] bg-white/80 px-4 py-2 text-sm"
                  />
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={trustForm.score}
                    onChange={(e) => setTrustForm({ ...trustForm, score: Number(e.target.value) })}
                    className="rounded-2xl border border-[color:var(--green-100)] bg-white/80 px-4 py-2 text-sm"
                  />
                  <Button size="sm" onClick={handleTrustUpdate}>Mettre à jour</Button>
                </div>
                {trustStatus && (
                  <p className="mt-3 text-xs text-[color:var(--green-700)]">{trustStatus}</p>
                )}
              </div>
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <RevenueTab transactions={demoTransactions} />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Paramètres</h1>
              
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Modération automatique</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Validation automatique des annonces</span>
                      <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded" />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Filtrage des mots interdits</span>
                      <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Détection automatique de spam</span>
                      <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded" defaultChecked />
                    </label>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Notifications</h2>
                  <div className="space-y-4">
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Nouvelle annonce en attente</span>
                      <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded" defaultChecked />
                    </label>
                    <label className="flex items-center justify-between">
                      <span className="text-gray-700">Nouveau signalement</span>
                      <input type="checkbox" className="w-5 h-5 text-emerald-600 rounded" defaultChecked />
                    </label>
                  </div>
                </div>

                {/* Commission Settings */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-semibold text-gray-900 mb-4">Taux de commission</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Immobilier - Location (Vendeur)</label>
                        <input type="number" defaultValue={5} step={0.5} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Immobilier - Location (Acheteur)</label>
                        <input type="number" defaultValue={5} step={0.5} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Immobilier - Vente (Vendeur)</label>
                        <input type="number" defaultValue={2} step={0.5} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Véhicules - Location (Vendeur)</label>
                        <input type="number" defaultValue={10} step={0.5} className="w-full px-3 py-2 border rounded-lg" />
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Sauvegarder</Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Verifications Tab */}
          {activeTab === 'verifications' && (
            <VerificationsTab
              verifications={verifications}
              loading={verificationsLoading}
              actionStatus={verificationActionStatus}
              onLoad={async () => {
                setVerificationsLoading(true)
                const supabase = createClient()
                const { data } = await supabase
                  .from('verification_requests')
                  .select(`
                    id,
                    document_type,
                    document_url,
                    selfie_url,
                    status,
                    submitted_at,
                    admin_notes,
                    user_id,
                    profiles:user_id (full_name, avatar_url)
                  `)
                  .order('submitted_at', { ascending: false })
                setVerifications(data || [])
                setVerificationsLoading(false)
              }}
              onAction={async (id: string, status: 'approved' | 'rejected', notes?: string) => {
                setVerificationActionStatus(prev => ({ ...prev, [id]: 'loading' }))
                const res = await fetch(`/api/verify/${id}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status, admin_notes: notes }),
                })
                if (res.ok) {
                  setVerificationActionStatus(prev => ({ ...prev, [id]: status }))
                  setVerifications(prev =>
                    prev.map(v => v.id === id ? { ...v, status } : v)
                  )
                } else {
                  setVerificationActionStatus(prev => ({ ...prev, [id]: 'error' }))
                }
              }}
            />
          )}
        </main>
      </div>
    </div>
  )
}

// Verifications Tab Component
function VerificationsTab({
  verifications,
  loading,
  actionStatus,
  onLoad,
  onAction,
}: {
  verifications: any[]
  loading: boolean
  actionStatus: Record<string, string>
  onLoad: () => void
  onAction: (id: string, status: 'approved' | 'rejected', notes?: string) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({})

  if (!loaded) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Vérifications d'identité</h1>
        <button
          onClick={() => { onLoad(); setLoaded(true) }}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
        >
          Charger les demandes
        </button>
      </div>
    )
  }

  const docTypeLabels: Record<string, string> = {
    national_id: 'CNI',
    passport: 'Passeport',
    drivers_license: 'Permis de conduire',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  const statusLabels: Record<string, string> = {
    pending: 'En attente',
    approved: 'Approuvé',
    rejected: 'Rejeté',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vérifications d'identité</h1>
        <button
          onClick={onLoad}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Actualiser
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full" />
        </div>
      ) : verifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 text-center">
          <p className="text-gray-500">Aucune demande de vérification.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.map((v) => {
            const profile = Array.isArray(v.profiles) ? v.profiles[0] : v.profiles
            const userName = profile?.full_name || v.user_id?.slice(0, 8) + '...'
            const status = actionStatus[v.id] || v.status
            const isLoading = status === 'loading'

            return (
              <div key={v.id} className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* User Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700 font-semibold text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{userName}</p>
                      <p className="text-sm text-gray-500">
                        {docTypeLabels[v.document_type] || v.document_type}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Soumis le {new Date(v.submitted_at).toLocaleDateString('fr-FR', {
                          year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </p>
                      <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full ${statusColors[v.status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[v.status] || v.status}
                      </span>
                    </div>
                  </div>

                  {/* Document Preview */}
                  <div className="flex gap-3">
                    {v.document_url && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Document</p>
                        <a href={v.document_url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={v.document_url}
                            alt="Document"
                            className="w-24 h-16 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                          />
                        </a>
                      </div>
                    )}
                    {v.selfie_url && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Selfie</p>
                        <a href={v.selfie_url} target="_blank" rel="noopener noreferrer">
                          <img
                            src={v.selfie_url}
                            alt="Selfie"
                            className="w-24 h-16 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                          />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {v.status === 'pending' && (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <input
                        type="text"
                        placeholder="Notes (optionnel)"
                        value={rejectNotes[v.id] || ''}
                        onChange={(e) => setRejectNotes(prev => ({ ...prev, [v.id]: e.target.value }))}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => onAction(v.id, 'approved')}
                          disabled={isLoading}
                          className="flex-1 py-2 px-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Approuver
                        </button>
                        <button
                          onClick={() => onAction(v.id, 'rejected', rejectNotes[v.id])}
                          disabled={isLoading}
                          className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <X className="w-4 h-4" />
                          Rejeter
                        </button>
                      </div>
                      {actionStatus[v.id] === 'error' && (
                        <p className="text-xs text-red-600">Erreur. Réessayez.</p>
                      )}
                    </div>
                  )}

                  {(status === 'approved' || status === 'rejected') && v.status !== 'pending' && (
                    <div className="flex items-center">
                      <span className={`text-sm font-medium px-3 py-1 rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-700'}`}>
                        {statusLabels[status] || status}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// Revenue Tab Component
function RevenueTab({ transactions }: { transactions: Transaction[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | '3months' | 'year'>('month')
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'housing' | 'cars'>('all')

  // Calculate metrics
  const monthlyRevenue = useMemo(() => calculateMonthlyRevenue(transactions), [transactions])
  
  const filteredTransactions = useMemo(() => {
    let filtered = transactions
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }
    return filtered
  }, [transactions, selectedCategory])

  const completedTransactions = filteredTransactions.filter(t => t.status === 'completed')
  
  const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.platformRevenue, 0)
  const totalVolume = completedTransactions.reduce((sum, t) => sum + t.amount, 0)
  const avgCommission = completedTransactions.length > 0 
    ? totalRevenue / completedTransactions.length 
    : 0

  // This month vs last month comparison
  const thisMonth = monthlyRevenue[0]
  const lastMonth = monthlyRevenue[1]
  const revenueChange = thisMonth && lastMonth 
    ? ((thisMonth.totalRevenue - lastMonth.totalRevenue) / lastMonth.totalRevenue * 100).toFixed(1)
    : '0'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h1>
          <p className="text-gray-500 mt-1">Suivez vos commissions et revenus</p>
        </div>
        <div className="flex gap-2">
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">Toutes catégories</option>
            <option value="housing">Immobilier</option>
            <option value="cars">Véhicules</option>
          </select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className={`flex items-center text-sm font-medium ${Number(revenueChange) >= 0 ? 'text-emerald-100' : 'text-red-200'}`}>
              {Number(revenueChange) >= 0 ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
              {revenueChange}%
            </span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(totalRevenue)}</p>
          <p className="text-emerald-100 text-sm mt-1">Revenus totaux (commissions)</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalVolume)}</p>
          <p className="text-gray-500 text-sm mt-1">Volume de transactions</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{completedTransactions.length}</p>
          <p className="text-gray-500 text-sm mt-1">Transactions complétées</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(Math.round(avgCommission))}</p>
          <p className="text-gray-500 text-sm mt-1">Commission moyenne</p>
        </div>
      </div>

      {/* Revenue by Month */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Revenus par mois</h2>
          <div className="space-y-4">
            {monthlyRevenue.slice(0, 6).map((month) => (
              <div key={month.month} className="flex items-center gap-4">
                <div className="w-20 text-sm text-gray-500">
                  {new Date(month.month + '-01').toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' })}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="h-4 bg-emerald-500 rounded"
                      style={{ width: `${(month.totalRevenue / Math.max(...monthlyRevenue.map(m => m.totalRevenue))) * 100}%`, minWidth: '8px' }}
                    />
                    <span className="text-sm font-medium">{formatCurrency(month.totalRevenue)}</span>
                  </div>
                  <p className="text-xs text-gray-400">{month.transactionCount} transactions</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Revenus par catégorie</h2>
          {thisMonth && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <span className="text-sm text-gray-600">Immobilier</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(thisMonth.byCategory.housing.revenue)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(thisMonth.byCategory.housing.revenue / thisMonth.totalRevenue) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{thisMonth.byCategory.housing.count} transactions</p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" />
                    <span className="text-sm text-gray-600">Véhicules</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(thisMonth.byCategory.cars.revenue)}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full" 
                    style={{ width: `${(thisMonth.byCategory.cars.revenue / thisMonth.totalRevenue) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{thisMonth.byCategory.cars.count} transactions</p>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total ce mois</span>
                  <span className="text-xl font-bold text-emerald-600">{formatCurrency(thisMonth.totalRevenue)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Transactions récentes</h2>
          <Button variant="ghost" size="sm">Voir tout</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Transaction</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Commission</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Paiement</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredTransactions.slice(0, 10).map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        tx.category === 'housing' ? 'bg-blue-100' : 'bg-orange-100'
                      }`}>
                        {tx.category === 'housing' ? (
                          <Home className={`w-4 h-4 ${tx.category === 'housing' ? 'text-blue-600' : 'text-orange-600'}`} />
                        ) : (
                          <Car className="w-4 h-4 text-orange-600" />
                        )}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{tx.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      tx.transactionType === 'rental' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {tx.transactionType === 'rental' ? 'Location' : 'Vente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(tx.amount)}</td>
                  <td className="px-6 py-4 text-emerald-600 font-medium">{formatCurrency(tx.platformRevenue)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      tx.paymentMethod === 'orange_money' ? 'bg-orange-100 text-orange-700' :
                      tx.paymentMethod === 'mtn_momo' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {tx.paymentMethod === 'orange_money' ? 'Orange Money' :
                       tx.paymentMethod === 'mtn_momo' ? 'MTN MoMo' : 'Carte'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                      tx.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {tx.status === 'completed' ? 'Complété' :
                       tx.status === 'pending' ? 'En attente' : 'Annulé'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-sm">
                    {new Date(tx.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Listings Revenue */}
      <div className="mt-6 bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Options Premium</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PREMIUM_LISTINGS.map((premium) => (
            <div key={premium.id} className="border rounded-lg p-4 hover:border-emerald-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{premium.name}</span>
                <span className="text-emerald-600 font-bold">{formatCurrency(premium.price)}</span>
              </div>
              <p className="text-sm text-gray-500">{premium.description}</p>
              <p className="text-xs text-gray-400 mt-2">Durée: {premium.duration} jours</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
