'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Home, Car, Plus, Heart, MessageSquare, Settings, LogOut, 
  Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle,
  Wallet, TrendingUp, Bell
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

// Demo user data
const demoUser = {
  name: 'Jean Kamga',
  email: 'jean.kamga@email.com',
  phone: '+237 6 99 00 00 00',
  avatar: null,
  isVerified: false,
  balance: 15000, // XAF
  listings: [
    {
      id: '1',
      title: 'Appartement 3 pièces à Bonanjo',
      category: 'housing',
      price: 250000,
      status: 'active',
      views: 145,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200',
      createdAt: '2026-01-28',
    },
    {
      id: '2',
      title: 'Toyota Corolla 2020',
      category: 'cars',
      price: 25000,
      status: 'pending',
      views: 0,
      image: 'https://images.unsplash.com/photo-1568844293986-8c1a5c14e3f7?w=200',
      createdAt: '2026-01-30',
    },
  ],
  favorites: 5,
  messages: 3,
}

const statusColors = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  expired: 'bg-red-100 text-red-700',
}

const statusIcons = {
  active: CheckCircle,
  pending: Clock,
  expired: AlertCircle,
}

const statusLabels = {
  active: 'Actif',
  pending: 'En attente',
  expired: 'Expiré',
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'listings' | 'favorites' | 'messages' | 'wallet'>('listings')
  const user = demoUser

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Findr</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-blue-600">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold text-2xl">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <h2 className="font-semibold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-500">{user.phone}</p>
                {!user.isVerified && (
                  <button className="mt-2 text-xs text-blue-600 hover:underline">
                    Vérifier mon compte →
                  </button>
                )}
              </div>

              {/* Wallet Balance */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 mb-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-blue-100 text-sm">Mon solde</span>
                  <Wallet className="w-5 h-5 text-blue-200" />
                </div>
                <div className="text-2xl font-bold">
                  {user.balance.toLocaleString()} <span className="text-sm">XAF</span>
                </div>
                <button className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white text-sm py-2 rounded-lg transition-colors">
                  + Recharger
                </button>
              </div>

              {/* Navigation */}
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'listings' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Home className="w-5 h-5" />
                  <span>Mes annonces</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {user.listings.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'favorites' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Favoris</span>
                  <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {user.favorites}
                  </span>
                </button>
                <Link
                  href="/dashboard/messages"
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'messages' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Messages</span>
                  {user.messages > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {user.messages}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => setActiveTab('wallet')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'wallet' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  <span>Portefeuille</span>
                </button>
                <hr className="my-2" />
                <Link
                  href="/dashboard/settings"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <Settings className="w-5 h-5" />
                  <span>Paramètres</span>
                </Link>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">Mes annonces</h1>
                  <Link href="/dashboard/new">
                    <Button>
                      <Plus className="w-5 h-5 mr-2" />
                      Nouvelle annonce
                    </Button>
                  </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Annonces actives</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {user.listings.filter(l => l.status === 'active').length}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Vues totales</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {user.listings.reduce((acc, l) => acc + l.views, 0)}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Ce mois</p>
                        <p className="text-2xl font-bold text-blue-600">+23%</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listings */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {user.listings.length === 0 ? (
                    <div className="p-12 text-center">
                      <Home className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Aucune annonce
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Commencez par créer votre première annonce
                      </p>
                      <Link href="/dashboard/new">
                        <Button>
                          <Plus className="w-5 h-5 mr-2" />
                          Créer une annonce
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {user.listings.map((listing) => {
                        const StatusIcon = statusIcons[listing.status as keyof typeof statusIcons]
                        return (
                          <div key={listing.id} className="p-4 flex items-center gap-4 hover:bg-gray-50">
                            <img
                              src={listing.image}
                              alt={listing.title}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${statusColors[listing.status as keyof typeof statusColors]}`}>
                                  <StatusIcon className="w-3 h-3" />
                                  {statusLabels[listing.status as keyof typeof statusLabels]}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {listing.category === 'housing' ? '🏠' : '🚗'}
                                </span>
                              </div>
                              <h3 className="font-medium text-gray-900 truncate">
                                {listing.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {listing.price.toLocaleString()} XAF • {listing.views} vues
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'wallet' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon portefeuille</h1>
                
                {/* Balance Card */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6">
                  <p className="text-blue-100 mb-1">Solde disponible</p>
                  <p className="text-4xl font-bold mb-4">
                    {user.balance.toLocaleString()} <span className="text-xl">XAF</span>
                  </p>
                  <div className="flex gap-3">
                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      + Recharger
                    </Button>
                    <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                      Historique
                    </Button>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Méthodes de paiement
                  </h2>
                  <div className="grid gap-3">
                    {/* Orange Money */}
                    <button className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 transition-colors">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                        <span className="text-orange-600 font-bold">OM</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">Orange Money</p>
                        <p className="text-sm text-gray-500">Paiement mobile + Mastercard Prepaid</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Disponible</span>
                    </button>

                    {/* MTN MoMo */}
                    <button className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-yellow-500 transition-colors">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <span className="text-yellow-600 font-bold">MTN</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">MTN Mobile Money</p>
                        <p className="text-sm text-gray-500">Paiement mobile instantané</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Disponible</span>
                    </button>

                    {/* Wave */}
                    <button className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <span className="text-blue-600 font-bold">W</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">Wave</p>
                        <p className="text-sm text-gray-500">Transfert d'argent sans frais</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Bientôt</span>
                    </button>

                    {/* Card */}
                    <button className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-400 transition-colors">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                        <span className="text-gray-600 font-bold">💳</span>
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-900">Carte bancaire</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Disponible</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Mes favoris</h1>
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun favori
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Sauvegardez vos annonces préférées pour les retrouver facilement
                  </p>
                  <Link href="/">
                    <Button variant="outline">Explorer les annonces</Button>
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun message
                  </h3>
                  <p className="text-gray-500">
                    Vos conversations avec les vendeurs apparaîtront ici
                  </p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
