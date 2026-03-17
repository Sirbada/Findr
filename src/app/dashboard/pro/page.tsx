'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Home, Car, Plus, Building2, Calendar, MessageSquare, BarChart3,
  Settings, LogOut, Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle,
  Crown, Star, TrendingUp, Users, Phone, BadgeCheck, Upload, ChevronRight,
  Bell, Wallet, Award, Zap, FileText, Image as ImageIcon, DollarSign
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/lib/i18n/context'
import { Checkout, OrangeMoneyButton, MTNMoMoButton } from '@/components/ui/PaymentButtons'

// Pro Dashboard Translations
const proTranslations = {
  fr: {
    dashboard: 'Tableau de bord Pro',
    overview: 'Vue d\'ensemble',
    listings: 'Mes annonces',
    calendarNav: 'Calendrier',
    requestsNav: 'Demandes',
    statsNav: 'Statistiques',
    verificationNav: 'Vérification',
    settings: 'Paramètres',
    upgrade: 'Améliorer',
    plan: {
      basic: 'Basique',
      pro: 'Pro',
      business: 'Business',
      current: 'Plan actuel',
      upgrade: 'Passer à',
      free: 'Gratuit',
      perMonth: '/mois',
      listings: 'annonces',
      unlimited: 'Illimité',
      features: {
        basic: ['5 annonces', 'Support email', 'Stats basiques'],
        pro: ['50 annonces', 'Badge Pro vérifié', 'Stats avancées', 'Support prioritaire', 'Mise en avant'],
        business: ['Annonces illimitées', 'Badge Business', 'API access', 'Account manager', 'Bulk upload'],
      }
    },
    stats: {
      totalViews: 'Vues totales',
      totalListings: 'Annonces actives',
      totalRequests: 'Demandes reçues',
      conversionRate: 'Taux de conversion',
      thisMonth: 'Ce mois',
      lastMonth: 'Mois dernier',
      trend: 'Tendance',
    },
    verification: {
      title: 'Badge de vérification',
      subtitle: 'Augmentez la confiance des clients',
      status: {
        none: 'Non vérifié',
        pending: 'En attente',
        verified: 'Vérifié',
      },
      steps: {
        identity: 'Pièce d\'identité',
        address: 'Justificatif de domicile',
        phone: 'Numéro de téléphone',
        business: 'Registre de commerce (optionnel)',
      },
      apply: 'Demander la vérification',
      benefits: [
        'Badge visible sur toutes vos annonces',
        'Meilleur classement dans les résultats',
        'Plus de confiance = plus de contacts',
      ]
    },
    calendar: {
      title: 'Disponibilités',
      available: 'Disponible',
      booked: 'Réservé',
      blocked: 'Bloqué',
    },
    bulkUpload: {
      title: 'Import en masse',
      subtitle: 'Ajoutez plusieurs annonces rapidement',
      dragDrop: 'Glissez vos fichiers ici',
      template: 'Télécharger le modèle',
      formats: 'CSV, Excel (.xlsx)',
    },
    requests: {
      title: 'Demandes de contact',
      new: 'Nouvelle',
      replied: 'Répondu',
      archived: 'Archivé',
    }
  },
  en: {
    dashboard: 'Pro Dashboard',
    overview: 'Overview',
    listings: 'My listings',
    calendarNav: 'Calendar',
    requestsNav: 'Requests',
    statsNav: 'Statistics',
    verificationNav: 'Verification',
    settings: 'Settings',
    upgrade: 'Upgrade',
    plan: {
      basic: 'Basic',
      pro: 'Pro',
      business: 'Business',
      current: 'Current plan',
      upgrade: 'Upgrade to',
      free: 'Free',
      perMonth: '/month',
      listings: 'listings',
      unlimited: 'Unlimited',
      features: {
        basic: ['5 listings', 'Email support', 'Basic stats'],
        pro: ['50 listings', 'Pro verified badge', 'Advanced stats', 'Priority support', 'Featured listings'],
        business: ['Unlimited listings', 'Business badge', 'API access', 'Account manager', 'Bulk upload'],
      }
    },
    stats: {
      totalViews: 'Total views',
      totalListings: 'Active listings',
      totalRequests: 'Requests received',
      conversionRate: 'Conversion rate',
      thisMonth: 'This month',
      lastMonth: 'Last month',
      trend: 'Trend',
    },
    verification: {
      title: 'Verification badge',
      subtitle: 'Increase customer trust',
      status: {
        none: 'Not verified',
        pending: 'Pending',
        verified: 'Verified',
      },
      steps: {
        identity: 'ID document',
        address: 'Proof of address',
        phone: 'Phone number',
        business: 'Business registration (optional)',
      },
      apply: 'Apply for verification',
      benefits: [
        'Badge visible on all your listings',
        'Better ranking in search results',
        'More trust = more contacts',
      ]
    },
    calendar: {
      title: 'Availability',
      available: 'Available',
      booked: 'Booked',
      blocked: 'Blocked',
    },
    bulkUpload: {
      title: 'Bulk import',
      subtitle: 'Add multiple listings quickly',
      dragDrop: 'Drop your files here',
      template: 'Download template',
      formats: 'CSV, Excel (.xlsx)',
    },
    requests: {
      title: 'Contact requests',
      new: 'New',
      replied: 'Replied',
      archived: 'Archived',
    }
  }
}

// Demo data
const demoAgent = {
  name: 'Agence Immobilière Prestige',
  email: 'contact@prestige-immo.cm',
  phone: '+237 6 99 00 00 00',
  plan: 'basic' as 'basic' | 'pro' | 'business',
  isVerified: false,
  verificationStatus: 'none' as const,
  stats: {
    views: 2847,
    viewsChange: 23,
    listings: 4,
    listingsLimit: 5,
    requests: 38,
    requestsChange: 12,
    conversionRate: 8.5,
  },
  listings: [
    {
      id: '1',
      title: 'Appartement de luxe à Bonapriso',
      category: 'housing',
      price: 450000,
      status: 'active',
      views: 892,
      requests: 12,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200',
    },
    {
      id: '2',
      title: 'Villa avec piscine à Bonanjo',
      category: 'housing',
      price: 850000,
      status: 'active',
      views: 567,
      requests: 8,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=200',
    },
    {
      id: '3',
      title: 'Bureau moderne centre-ville',
      category: 'housing',
      price: 350000,
      status: 'active',
      views: 234,
      requests: 5,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200',
    },
    {
      id: '4',
      title: 'Studio meublé à Akwa',
      category: 'housing',
      price: 120000,
      status: 'pending',
      views: 0,
      requests: 0,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200',
    },
  ],
  requests: [
    { id: '1', name: 'Marie K.', listing: 'Appartement de luxe', date: '2025-01-31', status: 'new' },
    { id: '2', name: 'Paul N.', listing: 'Villa avec piscine', date: '2025-01-30', status: 'new' },
    { id: '3', name: 'Sophie M.', listing: 'Bureau moderne', date: '2025-01-29', status: 'replied' },
  ]
}

// Pricing plans
const plans = [
  { id: 'basic', price: 0, listings: 5 },
  { id: 'pro', price: 10000, listings: 50 },
  { id: 'business', price: 25000, listings: -1 },
]

export default function ProDashboardPage() {
  const { lang } = useTranslation()
  const t = proTranslations[lang]
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'requests' | 'stats' | 'verification' | 'upgrade'>('overview')
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<'pro' | 'business' | null>(null)
  
  const agent = demoAgent

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1A1A2E] to-[#E8630A] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-[#E8630A] font-bold text-xl">F</span>
                </div>
                <span className="text-xl font-bold">Findr</span>
              </Link>
              <span className="bg-white/20 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" />
                PRO
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/10 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium hidden sm:block">{agent.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-4">
              {/* Plan Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">{t.plan.current}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    agent.plan === 'basic' ? 'bg-gray-100 text-gray-700' :
                    agent.plan === 'pro' ? 'bg-[#FFF4EC] text-[#E8630A]' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {t.plan[agent.plan]}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {agent.stats.listings}/{agent.stats.listingsLimit} {t.plan.listings}
                </div>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#FFF4EC]0 rounded-full transition-all"
                    style={{ width: `${(agent.stats.listings / agent.stats.listingsLimit) * 100}%` }}
                  />
                </div>
                {agent.plan === 'basic' && (
                  <button
                    onClick={() => setActiveTab('upgrade')}
                    className="mt-3 w-full text-sm text-[#E8630A] font-medium hover:underline flex items-center justify-center gap-1"
                  >
                    <Zap className="w-4 h-4" />
                    {t.plan.upgrade} Pro
                  </button>
                )}
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                {[
                  { id: 'overview', icon: BarChart3, label: t.overview },
                  { id: 'listings', icon: Home, label: t.listings },
                  { id: 'requests', icon: MessageSquare, label: t.requestsNav, badge: 2 },
                  { id: 'stats', icon: TrendingUp, label: t.statsNav },
                  { id: 'verification', icon: BadgeCheck, label: t.verificationNav },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === item.id 
                        ? 'bg-[#FFF4EC] text-[#E8630A]' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
                
                <hr className="my-2" />
                
                <button
                  onClick={() => setActiveTab('upgrade')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'upgrade' 
                      ? 'bg-purple-50 text-purple-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Crown className="w-5 h-5" />
                  <span>{t.upgrade}</span>
                </button>
                
                <Link
                  href="/dashboard"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <Settings className="w-5 h-5" />
                  <span>{t.settings}</span>
                </Link>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">{t.overview}</h1>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <span className="text-xs text-green-600 font-medium">+{agent.stats.viewsChange}%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{agent.stats.views.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{t.stats.totalViews}</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <Home className="w-5 h-5 text-[#E8630A]" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{agent.stats.listings}</p>
                    <p className="text-sm text-gray-500">{t.stats.totalListings}</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <MessageSquare className="w-5 h-5 text-purple-500" />
                      <span className="text-xs text-green-600 font-medium">+{agent.stats.requestsChange}%</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{agent.stats.requests}</p>
                    <p className="text-sm text-gray-500">{t.stats.totalRequests}</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{agent.stats.conversionRate}%</p>
                    <p className="text-sm text-gray-500">{t.stats.conversionRate}</p>
                  </div>
                </div>

                {/* Recent Requests */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-4 border-b flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">{t.requests.title}</h2>
                    <button 
                      onClick={() => setActiveTab('requests')}
                      className="text-sm text-[#E8630A] hover:underline"
                    >
                      Voir tout →
                    </button>
                  </div>
                  <div className="divide-y">
                    {agent.requests.map((req) => (
                      <div key={req.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900">{req.name}</p>
                          <p className="text-sm text-gray-500 truncate">{req.listing}</p>
                        </div>
                        {req.status === 'new' && (
                          <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-1 rounded-full">
                            {t.requests.new}
                          </span>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/dashboard/new">
                    <div className="bg-[#FFF4EC] border-2 border-dashed border-[#FFF4EC] rounded-xl p-6 text-center hover:border-[#E8630A] transition-colors cursor-pointer">
                      <Plus className="w-8 h-8 text-[#E8630A] mx-auto mb-2" />
                      <p className="font-medium text-[#E8630A]">Nouvelle annonce</p>
                    </div>
                  </Link>
                  <div 
                    onClick={() => setActiveTab('verification')}
                    className="bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  >
                    <BadgeCheck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="font-medium text-blue-700">{t.verification.apply}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold text-gray-900">{t.listings}</h1>
                  <Link href="/dashboard/new">
                    <Button>
                      <Plus className="w-5 h-5 mr-2" />
                      Nouvelle annonce
                    </Button>
                  </Link>
                </div>

                {/* Bulk Upload (Pro/Business only) */}
                {agent.plan !== 'basic' && (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4">
                    <div className="flex items-center gap-4">
                      <Upload className="w-8 h-8 text-purple-600" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{t.bulkUpload.title}</p>
                        <p className="text-sm text-gray-600">{t.bulkUpload.subtitle}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        {t.bulkUpload.template}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Listings Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Annonce</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Statut</th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Vues</th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Demandes</th>
                          <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {agent.listings.map((listing) => (
                          <tr key={listing.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={listing.image} 
                                  alt={listing.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div>
                                  <p className="font-medium text-gray-900">{listing.title}</p>
                                  <p className="text-sm text-gray-500">{listing.price.toLocaleString()} XAF/mois</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                listing.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                              }`}>
                                {listing.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                {listing.status === 'active' ? 'Actif' : 'En attente'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-gray-900">{listing.views}</td>
                            <td className="px-4 py-3 text-right text-gray-900">{listing.requests}</td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex justify-end gap-1">
                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-[#E8630A] hover:bg-[#FFF4EC] rounded-lg">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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
              </div>
            )}

            {/* Verification Tab */}
            {activeTab === 'verification' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">{t.verification.title}</h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <BadgeCheck className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">{t.verification.title}</h2>
                      <p className="text-gray-600 mb-4">{t.verification.subtitle}</p>
                      
                      {/* Benefits */}
                      <ul className="space-y-2 mb-6">
                        {t.verification.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                      
                      {/* Verification Steps */}
                      <div className="space-y-3">
                        {Object.entries(t.verification.steps).map(([key, label], idx) => (
                          <div key={key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              idx < 2 ? 'bg-gray-200 text-gray-500' : 'bg-[#FFF4EC] text-[#E8630A]'
                            }`}>
                              {idx < 2 ? idx + 1 : <CheckCircle className="w-4 h-4" />}
                            </div>
                            <span className="flex-1 text-gray-700">{label}</span>
                            {idx < 2 && (
                              <Button size="sm" variant="outline">
                                Ajouter
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <Button className="mt-6" size="lg">
                        <BadgeCheck className="w-5 h-5 mr-2" />
                        {t.verification.apply}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upgrade Tab */}
            {activeTab === 'upgrade' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">{t.upgrade}</h1>
                <p className="text-gray-600">Choisissez le plan adapté à votre activité</p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Basic Plan */}
                  <div className={`group relative bg-white rounded-xl p-6 transition-all duration-300 cursor-pointer
                    ${agent.plan === 'basic' 
                      ? 'ring-2 ring-[#E8630A] shadow-lg shadow-[#E8630A]/20' 
                      : 'shadow-sm hover:shadow-xl hover:shadow-[#E8630A]/10 hover:ring-2 hover:ring-[#E8630A]'
                    }`}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#E8630A]/0 to-[#E8630A]/0 group-hover:from-[#E8630A]/5 group-hover:to-[#E8630A]/5 transition-all duration-300"></div>
                    
                    <div className="relative">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#E8630A] transition-colors">{t.plan.basic}</h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-gray-900">{t.plan.free}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">5 {t.plan.listings}</p>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {t.plan.features.basic.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-gray-400 group-hover:text-[#E8630A] transition-colors" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {agent.plan === 'basic' && (
                        <div className="text-center text-sm text-[#E8630A] font-medium py-2 bg-[#FFF4EC] rounded-lg">
                          ✓ {t.plan.current}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pro Plan */}
                  <div className={`group relative bg-white rounded-xl p-6 transition-all duration-300 cursor-pointer
                    ${agent.plan === 'pro' 
                      ? 'ring-2 ring-[#E8630A] shadow-lg shadow-[#E8630A]/20' 
                      : 'shadow-sm hover:shadow-xl hover:shadow-[#E8630A]/20 hover:ring-2 hover:ring-[#E8630A] hover:-translate-y-1'
                    }`}
                  >
                    {/* Popular badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-[#1A1A2E] to-[#E8630A] text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                        ⭐ Populaire
                      </span>
                    </div>
                    
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#E8630A]/0 to-[#E8630A]/0 group-hover:from-[#E8630A]/10 group-hover:to-[#E8630A]/10 transition-all duration-300"></div>
                    
                    <div className="relative">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2 group-hover:text-[#E8630A] transition-colors">
                          <Crown className="w-5 h-5 text-[#E8630A]" />
                          {t.plan.pro}
                        </h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-gray-900 group-hover:text-[#E8630A] transition-colors">15 000</span>
                          <span className="text-gray-500"> XAF{t.plan.perMonth}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">50 {t.plan.listings}</p>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {t.plan.features.pro.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-[#E8630A]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {agent.plan === 'pro' ? (
                        <div className="text-center text-sm text-[#E8630A] font-medium py-2 bg-[#FFF4EC] rounded-lg">
                          ✓ {t.plan.current}
                        </div>
                      ) : (
                        <Button 
                          className="w-full group-hover:bg-[#1A1A2E] transition-colors" 
                          onClick={() => {
                            setSelectedPlan('pro')
                            setShowUpgradeModal(true)
                          }}
                        >
                          {t.plan.upgrade} Pro
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Business Plan */}
                  <div className={`group relative bg-white rounded-xl p-6 transition-all duration-300 cursor-pointer
                    ${agent.plan === 'business' 
                      ? 'ring-2 ring-purple-500 shadow-lg shadow-purple-500/20' 
                      : 'shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:ring-2 hover:ring-purple-400'
                    }`}
                  >
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300"></div>
                    
                    <div className="relative">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-center gap-2 group-hover:text-purple-600 transition-colors">
                          <Award className="w-5 h-5 text-purple-600" />
                          {t.plan.business}
                        </h3>
                        <div className="mt-2">
                          <span className="text-3xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">45 000</span>
                          <span className="text-gray-500"> XAF{t.plan.perMonth}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{t.plan.unlimited}</p>
                      </div>
                      <ul className="space-y-3 mb-6">
                        {t.plan.features.business.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-purple-500" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      {agent.plan === 'business' ? (
                        <div className="text-center text-sm text-purple-600 font-medium py-2 bg-purple-50 rounded-lg">
                          ✓ {t.plan.current}
                        </div>
                      ) : (
                        <Button 
                          variant="outline"
                          className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 group-hover:border-purple-500 transition-colors" 
                          onClick={() => {
                            setSelectedPlan('business')
                            setShowUpgradeModal(true)
                          }}
                        >
                          {t.plan.upgrade} Business
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* FAQ or Additional Info */}
                <div className="bg-gray-50 rounded-xl p-6 mt-8">
                  <h3 className="font-semibold text-gray-900 mb-4">Questions fréquentes</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Puis-je changer de plan à tout moment ?</p>
                      <p className="text-gray-500">Oui, vous pouvez upgrader ou downgrader votre plan quand vous voulez.</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Comment fonctionne le paiement ?</p>
                      <p className="text-gray-500">Paiement mensuel via Orange Money ou MTN Mobile Money. Annulation facile.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">{t.requests.title}</h1>
                
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="divide-y">
                    {agent.requests.map((req) => (
                      <div key={req.id} className="p-4 hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <Users className="w-6 h-6 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900">{req.name}</p>
                              {req.status === 'new' && (
                                <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                                  {t.requests.new}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500">Intéressé par: {req.listing}</p>
                            <p className="text-xs text-gray-400">{req.date}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Phone className="w-4 h-4 mr-1" />
                              Appeler
                            </Button>
                            <Button size="sm">
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Répondre
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900">{t.stats.thisMonth}</h1>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="text-center text-gray-500 py-12">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Graphiques de statistiques disponibles avec le plan Pro</p>
                    <Button 
                      className="mt-4"
                      onClick={() => setActiveTab('upgrade')}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Passer à Pro
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {t.plan.upgrade} {selectedPlan === 'pro' ? 'Pro' : 'Business'}
            </h2>
            <Checkout
              amount={selectedPlan === 'pro' ? 10000 : 25000}
              orderId={`UPGRADE_${Date.now()}`}
              description={`Abonnement Findr ${selectedPlan === 'pro' ? 'Pro' : 'Business'}`}
              onSuccess={(provider, txId) => {
                setShowUpgradeModal(false)
                alert('Félicitations ! Votre abonnement a été activé.')
              }}
              onCancel={() => setShowUpgradeModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
