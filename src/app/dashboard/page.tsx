'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Home, Heart, MessageSquare, Settings, LogOut,
  CheckCircle, Clock, AlertCircle, Wallet, TrendingUp, Bell,
  CalendarCheck, Briefcase, ShieldCheck, Sparkles
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

const demoUser = {
  name: 'Jean Kamga',
  email: 'jean.kamga@email.com',
  phone: '+237 6 99 00 00 00',
  isVerified: false,
  balance: 15000,
  trustScore: 92,
  listings: [
    {
      id: '1',
      title: 'Appartement 3 pièces à Bonanjo',
      category: 'housing',
      price: 250000,
      status: 'active',
      views: 145,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200',
    },
    {
      id: '2',
      title: 'Toyota Corolla 2020',
      category: 'cars',
      price: 25000,
      status: 'pending',
      views: 0,
      image: 'https://images.unsplash.com/photo-1568844293986-8c1a5c14e3f7?w=200',
    },
  ],
  bookings: [
    { id: 'b1', title: 'Villa Bonapriso', date: '2026-02-26', status: 'confirmed', price: 420000 },
    { id: 'b2', title: 'Mercedes Classe E', date: '2026-03-02', status: 'pending', price: 75000 },
  ],
  serviceRequests: [
    { id: 's1', title: 'Plombier - fuite cuisine', city: 'Douala', status: 'quoted' },
  ],
  favorites: 5,
  messages: 3,
}

const statusColors = {
  active: 'bg-[#FFF4EC] text-[#4B5563]',
  pending: 'bg-yellow-100 text-yellow-700',
  expired: 'bg-red-100 text-red-700',
  confirmed: 'bg-[#FFF4EC] text-[#4B5563]',
  quoted: 'bg-blue-100 text-blue-700',
}

const statusIcons = {
  active: CheckCircle,
  pending: Clock,
  expired: AlertCircle,
  confirmed: CheckCircle,
  quoted: Clock,
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'bookings' | 'services' | 'favorites' | 'saved' | 'messages' | 'wallet'>('overview')
  const user = demoUser
  const [savedOffline, setSavedOffline] = useState(0)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('findr_saved_services') || '[]')
    setSavedOffline(saved.length)
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <Header />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#FFF4EC] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[#4B5563] font-bold text-2xl">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <h2 className="font-semibold text-[#111827]">{user.email || "User"}</h2>
                <p className="text-sm text-[#E8630A]">{user.phone}</p>
                {!user.isVerified && (
                  <button className="mt-2 text-xs text-[#4B5563] hover:underline">
                    Vérifier mon compte →
                  </button>
                )}
              </div>

              <div className="rounded-xl border border-[#FFF4EC] bg-[#FFF4EC] p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[#4B5563] text-sm">Trust Score</span>
                  <ShieldCheck className="w-5 h-5 text-[#E8630A]" />
                </div>
                <div className="text-2xl font-bold text-[#111827]">
                  {user.trustScore} / 100
                </div>
              </div>

              <div className="bg-[#E8630A] rounded-xl p-4 mb-6 text-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white/80 text-sm">Mon solde</span>
                  <Wallet className="w-5 h-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold">
                  {user.balance.toLocaleString()} <span className="text-sm">XAF</span>
                </div>
                <button className="mt-3 w-full bg-white/20 hover:bg-white/30 text-white text-sm py-2 rounded-xl transition-colors">
                  + Recharger
                </button>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'overview', label: 'Vue d’ensemble', icon: Home },
                  { id: 'listings', label: 'Mes annonces', icon: Home },
                  { id: 'bookings', label: 'Réservations', icon: CalendarCheck },
                  { id: 'services', label: 'Services', icon: Briefcase },
                  { id: 'favorites', label: 'Favoris', icon: Heart },
                  { id: 'saved', label: 'Saved offline', icon: Heart },
                  { id: 'messages', label: 'Messages', icon: MessageSquare },
                  { id: 'wallet', label: 'Portefeuille', icon: Wallet },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-[#FFF4EC] text-[#4B5563]'
                          : 'text-[#4B5563] hover:bg-[#FFF4EC]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  )
                })}
                <hr className="my-2" />
                <Link
                  href="/dashboard/settings"
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[#4B5563] hover:bg-[#FFF4EC]"
                >
                  <Settings className="w-5 h-5" />
                  <span>Paramètres</span>
                </Link>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50">
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </Card>
          </aside>

          <main className="flex-1 space-y-6">
            <Card className="p-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#111827]">Bienvenue, {user.email || "User"}</h1>
                <p className="text-sm text-[#4B5563]">Gérez vos réservations, services et paiements en un seul endroit.</p>
              </div>
              <button className="relative p-2 text-[#4B5563] hover:text-[#111827]">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </Card>

            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#E8630A]">Annonces actives</p>
                        <p className="text-2xl font-bold text-[#111827]">
                          {user.listings.filter(l => l.status === 'active').length}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-[#FFF4EC] rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-[#E8630A]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#E8630A]">Réservations</p>
                        <p className="text-2xl font-bold text-[#111827]">
                          {user.bookings.length}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-[#FFF4EC] rounded-xl flex items-center justify-center">
                        <CalendarCheck className="w-5 h-5 text-[#E8630A]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#E8630A]">Ce mois</p>
                        <p className="text-2xl font-bold text-[#4B5563]">+23%</p>
                      </div>
                      <div className="w-10 h-10 bg-[#FFF4EC] rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-[#E8630A]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#E8630A]">Sauvegardes offline</p>
                        <p className="text-2xl font-bold text-[#111827]">{savedOffline}</p>
                      </div>
                      <div className="w-10 h-10 bg-[#FFF4EC] rounded-xl flex items-center justify-center">
                        <Heart className="w-5 h-5 text-[#E8630A]" />
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[#111827]">Mode Data‑Saver</h2>
                      <p className="text-sm text-[#4B5563]">
                        Téléchargements réduits, images optimisées et mode offline rapide.
                      </p>
                    </div>
                    <Button variant="outline">Configurer</Button>
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'listings' && (
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#111827]">Mes annonces</h2>
                  <Link href="/dashboard/new">
                    <Button>Nouvelle annonce</Button>
                  </Link>
                </div>

                <div className="divide-y">
                  {user.listings.map((listing) => {
                    const StatusIcon = statusIcons[listing.status as keyof typeof statusIcons]
                    return (
                      <div key={listing.id} className="py-4 flex items-center gap-4">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-20 h-20 object-cover rounded-xl"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${statusColors[listing.status as keyof typeof statusColors]}`}>
                              <StatusIcon className="w-3 h-3" />
                              {listing.status}
                            </span>
                          </div>
                          <h3 className="font-medium text-[#111827] truncate">
                            {listing.title}
                          </h3>
                          <p className="text-sm text-[#E8630A]">
                            {listing.price.toLocaleString()} XAF • {listing.views} vues
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            )}

            {activeTab === 'bookings' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#111827]">Réservations</h2>
                  <span className="text-xs text-[#4B5563] inline-flex items-center gap-1 rounded-full bg-[#FFF4EC] px-3 py-1">
                    <ShieldCheck className="h-3 w-3" /> Availability Shield actif
                  </span>
                </div>
                <div className="space-y-3">
                  {user.bookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between rounded-xl border border-[#FFF4EC] px-4 py-3">
                      <div>
                        <p className="font-medium text-[#111827]">{booking.title}</p>
                        <p className="text-xs text-[#E8630A]">{booking.date}</p>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded ${statusColors[booking.status as keyof typeof statusColors]}`}>
                          {booking.status}
                        </div>
                        <div className="text-sm text-[#4B5563]">{booking.price.toLocaleString()} XAF</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'services' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[#111827]">Demandes de services</h2>
                  <Button variant="outline">Nouvelle demande</Button>
                </div>
                <div className="space-y-3">
                  {user.serviceRequests.map((request) => (
                    <div key={request.id} className="flex items-center justify-between rounded-xl border border-[#FFF4EC] px-4 py-3">
                      <div>
                        <p className="font-medium text-[#111827]">{request.title}</p>
                        <p className="text-xs text-[#E8630A]">{request.city}</p>
                      </div>
                      <div className={`text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded ${statusColors[request.status as keyof typeof statusColors]}`}>
                        {request.status}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === 'favorites' && (
              <Card className="p-6 text-center">
                <Heart className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
                <h3 className="text-lg font-medium text-[#111827] mb-2">Aucun favori</h3>
                <p className="text-sm text-[#E8630A] mb-4">
                  Sauvegardez vos annonces préférées pour les retrouver facilement.
                </p>
                <Link href="/">
                  <Button variant="outline">Explorer</Button>
                </Link>
              </Card>
            )}

            {activeTab === 'saved' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-[#111827] mb-4">Sauvegardes offline</h2>
                <p className="text-sm text-[#E8630A] mb-4">
                  Ces éléments sont visibles même sans connexion.
                </p>
                <div className="text-sm text-[#4B5563]">
                  {savedOffline > 0 ? `${savedOffline} éléments sauvegardés.` : 'Aucune sauvegarde.'}
                </div>
              </Card>
            )}

            {activeTab === 'messages' && (
              <Card className="p-6 text-center">
                <MessageSquare className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
                <h3 className="text-lg font-medium text-[#111827] mb-2">Aucun message</h3>
                <p className="text-sm text-[#E8630A]">
                  Vos conversations apparaîtront ici.
                </p>
              </Card>
            )}

            {activeTab === 'wallet' && (
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#111827]">Portefeuille</h2>
                    <p className="text-sm text-[#4B5563]">Optimisé pour Orange Money et MTN MoMo.</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#4B5563]">
                    <Sparkles className="w-4 h-4" />
                    USSD confirmé
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="secondary">Recharger</Button>
                  <Button variant="outline">Historique</Button>
                </div>
              </Card>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
