'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Home, Heart, MessageSquare, Settings, LogOut,
  CheckCircle, Clock, AlertCircle, Wallet, TrendingUp, Bell,
  CalendarCheck, Briefcase, ShieldCheck, Sparkles, Loader2
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

type UserProfile = {
  id: string
  phone: string | null
  email: string | null
  full_name: string | null
  is_verified: boolean
}

type Listing = {
  id: string
  title: string
  category: 'housing' | 'cars'
  price: number
  status: string
  views: number
  images: string[]
}

type Booking = {
  id: string
  title: string
  start_date: string
  status: string
  total_price: number
}

const statusColors: Record<string, string> = {
  active: 'bg-[color:var(--green-50)] text-[color:var(--green-700)]',
  pending: 'bg-yellow-100 text-yellow-700',
  expired: 'bg-red-100 text-red-700',
  confirmed: 'bg-[color:var(--green-50)] text-[color:var(--green-700)]',
  quoted: 'bg-blue-100 text-blue-700',
}

const statusIcons: Record<string, typeof CheckCircle> = {
  active: CheckCircle,
  pending: Clock,
  expired: AlertCircle,
  confirmed: CheckCircle,
  quoted: Clock,
}

export default function DashboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'overview' | 'listings' | 'bookings' | 'services' | 'favorites' | 'saved' | 'messages' | 'wallet'>('overview')
  const [user, setUser] = useState<UserProfile | null>(null)
  const [listings, setListings] = useState<Listing[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [savedOffline, setSavedOffline] = useState(0)

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('findr_saved_services') || '[]')
    setSavedOffline(saved.length)
  }, [])

  useEffect(() => {
    async function loadDashboard() {
      const supabase = createClient()
      const authClient: any = (supabase as any).auth
      const userData = authClient.getUser
        ? await authClient.getUser()
        : await authClient.getSession()
      const authUser = userData?.data?.user || userData?.data?.session?.user

      if (!authUser) {
        router.replace('/login')
        return
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, phone, full_name, is_verified')
        .eq('id', authUser.id)
        .single()

      setUser({
        id: authUser.id,
        phone: profile?.phone || authUser.phone || null,
        email: authUser.email || null,
        full_name: profile?.full_name || authUser.user_metadata?.full_name || null,
        is_verified: profile?.is_verified || false,
      })

      // Fetch user's properties
      const { data: properties } = await supabase
        .from('properties')
        .select('id, title, price_per_night, status, views, images')
        .eq('owner_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch user's vehicles
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id, title, price_per_day, status, views, images')
        .eq('owner_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      const allListings: Listing[] = [
        ...(properties || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          category: 'housing' as const,
          price: p.price_per_night,
          status: p.status,
          views: p.views,
          images: p.images || [],
        })),
        ...(vehicles || []).map((v: any) => ({
          id: v.id,
          title: v.title,
          category: 'cars' as const,
          price: v.price_per_day,
          status: v.status,
          views: v.views,
          images: v.images || [],
        })),
      ]
      setListings(allListings)

      // Fetch bookings
      const { data: bookingData } = await supabase
        .from('bookings')
        .select('id, start_date, status, total_price, properties(title), vehicles(title)')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setBookings(
        (bookingData || []).map((b: any) => ({
          id: b.id,
          title: b.properties?.title || b.vehicles?.title || 'Réservation',
          start_date: b.start_date,
          status: b.status,
          total_price: b.total_price,
        }))
      )

      setLoading(false)
    }

    loadDashboard()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    const authClient: any = (supabase as any).auth
    if (authClient.signOut) await authClient.signOut()
    router.replace('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[color:var(--green-600)]" />
      </div>
    )
  }

  if (!user) return null

  const displayName = user.full_name || user.phone || user.email || 'Utilisateur'
  const initials = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[color:var(--green-50)] rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-[color:var(--green-700)] font-bold text-2xl">
                    {initials}
                  </span>
                </div>
                <h2 className="font-semibold text-[color:var(--green-900)]">{displayName}</h2>
                <p className="text-sm text-[color:var(--green-600)]">{user.phone || user.email}</p>
                {!user.is_verified && (
                  <button className="mt-2 text-xs text-[color:var(--green-700)] hover:underline">
                    Vérifier mon compte →
                  </button>
                )}
              </div>

              <div className="rounded-2xl border border-[color:var(--green-100)] bg-[color:var(--green-50)] p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[color:var(--green-700)] text-sm">Trust Score</span>
                  <ShieldCheck className="w-5 h-5 text-[color:var(--green-600)]" />
                </div>
                <div className="text-2xl font-bold text-[color:var(--green-900)]">
                  — / 100
                </div>
              </div>

              <nav className="space-y-1">
                {([
                  { id: 'overview', label: 'Vue d\u2019ensemble', icon: Home },
                  { id: 'listings', label: 'Mes annonces', icon: Home },
                  { id: 'bookings', label: 'R\u00e9servations', icon: CalendarCheck },
                  { id: 'services', label: 'Services', icon: Briefcase },
                  { id: 'favorites', label: 'Favoris', icon: Heart },
                  { id: 'saved', label: 'Saved offline', icon: Heart },
                  { id: 'messages', label: 'Messages', icon: MessageSquare },
                  { id: 'wallet', label: 'Portefeuille', icon: Wallet },
                ] as { id: string; label: string; icon: React.ElementType }[]).map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        activeTab === item.id
                          ? 'bg-[color:var(--green-50)] text-[color:var(--green-700)]'
                          : 'text-[color:var(--green-700)] hover:bg-[color:var(--green-50)]'
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
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-[color:var(--green-700)] hover:bg-[color:var(--green-50)]"
                >
                  <Settings className="w-5 h-5" />
                  <span>Paramètres</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </nav>
            </Card>
          </aside>

          <main className="flex-1 space-y-6">
            <Card className="p-6 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[color:var(--green-900)]">Bienvenue, {displayName}</h1>
                <p className="text-sm text-[color:var(--green-700)]">Gérez vos réservations, services et paiements en un seul endroit.</p>
              </div>
              <button className="relative p-2 text-[color:var(--green-700)] hover:text-[color:var(--green-900)]">
                <Bell className="w-5 h-5" />
              </button>
            </Card>

            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[color:var(--green-600)]">Annonces actives</p>
                        <p className="text-2xl font-bold text-[color:var(--green-900)]">
                          {listings.filter(l => l.status === 'active').length}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-[color:var(--green-50)] rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-[color:var(--green-600)]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[color:var(--green-600)]">Réservations</p>
                        <p className="text-2xl font-bold text-[color:var(--green-900)]">
                          {bookings.length}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-[color:var(--green-50)] rounded-xl flex items-center justify-center">
                        <CalendarCheck className="w-5 h-5 text-[color:var(--green-600)]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[color:var(--green-600)]">Total vues</p>
                        <p className="text-2xl font-bold text-[color:var(--green-700)]">
                          {listings.reduce((sum, l) => sum + l.views, 0)}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-[color:var(--green-50)] rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-[color:var(--green-600)]" />
                      </div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[color:var(--green-600)]">Sauvegardes offline</p>
                        <p className="text-2xl font-bold text-[color:var(--green-900)]">{savedOffline}</p>
                      </div>
                      <div className="w-10 h-10 bg-[color:var(--green-50)] rounded-xl flex items-center justify-center">
                        <Heart className="w-5 h-5 text-[color:var(--green-600)]" />
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-[color:var(--green-900)]">Mode Data‑Saver</h2>
                      <p className="text-sm text-[color:var(--green-700)]">
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
                  <h2 className="text-xl font-semibold text-[color:var(--green-900)]">Mes annonces</h2>
                  <Link href="/dashboard/new">
                    <Button>Nouvelle annonce</Button>
                  </Link>
                </div>

                {listings.length === 0 ? (
                  <div className="text-center py-8 text-[color:var(--green-600)]">
                    <Home className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>Aucune annonce pour l'instant.</p>
                    <Link href="/dashboard/new" className="mt-3 inline-block">
                      <Button size="sm">Publier une annonce</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y">
                    {listings.map((listing) => {
                      const StatusIcon = statusIcons[listing.status] || Clock
                      return (
                        <div key={listing.id} className="py-4 flex items-center gap-4">
                          {listing.images[0] ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="w-20 h-20 object-cover rounded-2xl"
                            />
                          ) : (
                            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
                              <Home className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${statusColors[listing.status] || 'bg-gray-100 text-gray-600'}`}>
                                <StatusIcon className="w-3 h-3" />
                                {listing.status}
                              </span>
                            </div>
                            <h3 className="font-medium text-[color:var(--green-900)] truncate">
                              {listing.title}
                            </h3>
                            <p className="text-sm text-[color:var(--green-600)]">
                              {listing.price.toLocaleString()} XAF • {listing.views} vues
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'bookings' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[color:var(--green-900)]">Réservations</h2>
                  <span className="text-xs text-[color:var(--green-700)] inline-flex items-center gap-1 rounded-full bg-[color:var(--green-50)] px-3 py-1">
                    <ShieldCheck className="h-3 w-3" /> Availability Shield actif
                  </span>
                </div>
                {bookings.length === 0 ? (
                  <div className="text-center py-8 text-[color:var(--green-600)]">
                    <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>Aucune réservation pour l'instant.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between rounded-2xl border border-[color:var(--green-100)] px-4 py-3">
                        <div>
                          <p className="font-medium text-[color:var(--green-900)]">{booking.title}</p>
                          <p className="text-xs text-[color:var(--green-600)]">{booking.start_date}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-xs inline-flex items-center gap-1 px-2 py-0.5 rounded ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                            {booking.status}
                          </div>
                          <div className="text-sm text-[color:var(--green-700)]">{booking.total_price.toLocaleString()} XAF</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}

            {activeTab === 'services' && (
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-[color:var(--green-900)]">Demandes de services</h2>
                  <Link href="/services">
                    <Button variant="outline">Nouvelle demande</Button>
                  </Link>
                </div>
                <div className="text-center py-8 text-[color:var(--green-600)]">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Aucune demande de service pour l'instant.</p>
                </div>
              </Card>
            )}

            {activeTab === 'favorites' && (
              <Card className="p-6 text-center">
                <Heart className="w-10 h-10 text-[color:var(--green-200)] mx-auto mb-3" />
                <h3 className="text-lg font-medium text-[color:var(--green-900)] mb-2">Aucun favori</h3>
                <p className="text-sm text-[color:var(--green-600)] mb-4">
                  Sauvegardez vos annonces préférées pour les retrouver facilement.
                </p>
                <Link href="/">
                  <Button variant="outline">Explorer</Button>
                </Link>
              </Card>
            )}

            {activeTab === 'saved' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-[color:var(--green-900)] mb-4">Sauvegardes offline</h2>
                <p className="text-sm text-[color:var(--green-600)] mb-4">
                  Ces éléments sont visibles même sans connexion.
                </p>
                <div className="text-sm text-[color:var(--green-700)]">
                  {savedOffline > 0 ? `${savedOffline} éléments sauvegardés.` : 'Aucune sauvegarde.'}
                </div>
              </Card>
            )}

            {activeTab === 'messages' && (
              <Card className="p-6 text-center">
                <MessageSquare className="w-10 h-10 text-[color:var(--green-200)] mx-auto mb-3" />
                <h3 className="text-lg font-medium text-[color:var(--green-900)] mb-2">Aucun message</h3>
                <p className="text-sm text-[color:var(--green-600)]">
                  Vos conversations apparaîtront ici.
                </p>
              </Card>
            )}

            {activeTab === 'wallet' && (
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[color:var(--green-900)]">Portefeuille</h2>
                    <p className="text-sm text-[color:var(--green-700)]">Optimisé pour Orange Money et MTN MoMo.</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[color:var(--green-700)]">
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
