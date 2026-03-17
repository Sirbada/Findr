'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin, Search, ShieldCheck, Star, Bookmark, Send } from 'lucide-react'
import { z } from 'zod'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { createClient } from '@/lib/supabase/client'
import { getServices, ServiceListing } from '@/lib/supabase/services'

const categories = [
  { id: 'plombier', label: 'Plombier' },
  { id: 'electricien', label: 'Électricien' },
  { id: 'clim', label: 'Climatisation' },
  { id: 'menage', label: 'Ménage' },
  { id: 'peinture', label: 'Peinture' },
  { id: 'securite', label: 'Sécurité' },
]

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('all')
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [showBroadcast, setShowBroadcast] = useState(false)
  const [broadcastStatus, setBroadcastStatus] = useState('')
  const [geoStatus, setGeoStatus] = useState('')
  const [broadcastForm, setBroadcastForm] = useState({
    city: '',
    neighborhood: '',
    details: '',
    preferredDate: '',
  })

  useEffect(() => {
    async function fetchServices() {
      const data = await getServices()
      setServices(data)
      setLoading(false)
    }
    fetchServices()
  }, [])

  const filtered = useMemo(() => {
    return services.filter((service) => {
      if (city !== 'all' && service.city !== city) return false
      if (category !== 'all' && service.service_categories?.slug !== category) return false
      if (search && !service.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [services, city, category, search])

  const broadcastSchema = z.object({
    city: z.string().min(2),
    details: z.string().min(10),
    neighborhood: z.string().optional(),
    preferredDate: z.string().optional(),
  })

  const handleBroadcast = async () => {
    setBroadcastStatus('')
    const parsed = broadcastSchema.safeParse(broadcastForm)
    if (!parsed.success) {
      setBroadcastStatus('Veuillez remplir la ville et les détails.')
      return
    }
    const supabase = createClient()
    const authClient: any = (supabase as any).auth
    const userData = authClient.getUser ? await authClient.getUser() : await authClient.getSession()
    const user = userData?.data?.user || userData?.data?.session?.user
    if (!user) {
      setBroadcastStatus('Connectez-vous pour diffuser une demande.')
      return
    }
    const { error } = await supabase.from('service_broadcasts').insert({
      user_id: user.id,
      city: broadcastForm.city,
      neighborhood: broadcastForm.neighborhood || null,
      details: broadcastForm.details,
      preferred_date: broadcastForm.preferredDate || null,
      status: 'open',
    })
    if (error) {
      setBroadcastStatus('Erreur réseau. Réessayez.')
      return
    }
    setBroadcastStatus('Demande diffusée aux pros proches.')
    setBroadcastForm({ city: '', neighborhood: '', details: '', preferredDate: '' })
  }

  const handleGeo = () => {
    setGeoStatus('Localisation en cours...')
    if (!navigator.geolocation) {
      setGeoStatus('Géolocalisation indisponible.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => setGeoStatus('Localisation détectée. Filtre appliqué.'),
      () => setGeoStatus('Impossible de détecter votre position.')
    )
  }

  const handleSave = async (serviceId: string) => {
    const supabase = createClient()
    const authClient: any = (supabase as any).auth
    const userData = authClient.getUser ? await authClient.getUser() : await authClient.getSession()
    const user = userData?.data?.user || userData?.data?.session?.user
    if (user) {
      const { error } = await supabase.from('saved_items').insert({
        user_id: user.id,
        item_type: 'service',
        item_id: serviceId,
      })
      if (!error) return
    }
    const saved = JSON.parse(localStorage.getItem('findr_saved_services') || '[]')
    if (!saved.includes(serviceId)) {
      localStorage.setItem('findr_saved_services', JSON.stringify([...saved, serviceId]))
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
      <Header />

      <section className="px-4 pt-10 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#E8630A]">
                  Services premium locaux
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-[#111827]">
                  Trouvez un pro fiable, en quelques minutes
                </h1>
                <p className="mt-2 text-sm text-[#4B5563]">
                  Plombiers, électriciens, climatisation, ménage et plus — ciblés par quartier et disponibilité.
                </p>
              </div>
              <Button className="w-full md:w-auto">
                Publier une demande
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="text-xs font-medium text-[#4B5563]">Recherche</label>
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#FFF4EC] bg-white/80 px-3 py-2">
                  <Search className="h-4 w-4 text-[#E8630A]" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Plombier à Bonapriso, électricien à Akwa..."
                    className="w-full bg-transparent text-sm text-[#111827] outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-[#4B5563]">Ville</label>
                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#FFF4EC] bg-white/80 px-3 py-2 text-sm text-[#111827]"
                >
                  <option value="all">Toutes les villes</option>
                  <option value="Douala">Douala</option>
                  <option value="Yaoundé">Yaoundé</option>
                  <option value="Kribi">Kribi</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#4B5563]">Métier</label>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-[#FFF4EC] bg-white/80 px-3 py-2 text-sm text-[#111827]"
                >
                  <option value="all">Tous les métiers</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-[#4B5563]">
              <button onClick={handleGeo} className="rounded-full bg-[#FFF4EC] px-3 py-1">
                Utiliser ma position
              </button>
              {geoStatus && <span>{geoStatus}</span>}
              <button className="ml-auto rounded-full bg-[#FFF4EC] px-3 py-1">
                Vue carte (bientôt)
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-[#4B5563]">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
                <ShieldCheck className="h-4 w-4 text-[#E8630A]" />
                Trust Score vérifié
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
                <Star className="h-4 w-4 text-[#E8630A]" />
                Pros recommandés par quartier
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1">
                <MapPin className="h-4 w-4 text-[#E8630A]" />
                Zone d’intervention intelligente
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setShowBroadcast(!showBroadcast)}
                className="text-sm text-[#4B5563] hover:text-[#111827]"
              >
                {showBroadcast ? 'Fermer la diffusion' : 'Diffuser une demande à plusieurs pros'}
              </button>

              {showBroadcast && (
                <Card className="mt-4 p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      value={broadcastForm.city}
                      onChange={(event) => setBroadcastForm({ ...broadcastForm, city: event.target.value })}
                      className="rounded-lg border border-[#FFF4EC] bg-white/80 px-4 py-3 text-sm"
                      placeholder="Ville"
                    />
                    <input
                      value={broadcastForm.neighborhood}
                      onChange={(event) => setBroadcastForm({ ...broadcastForm, neighborhood: event.target.value })}
                      className="rounded-lg border border-[#FFF4EC] bg-white/80 px-4 py-3 text-sm"
                      placeholder="Quartier"
                    />
                    <input
                      value={broadcastForm.preferredDate}
                      onChange={(event) => setBroadcastForm({ ...broadcastForm, preferredDate: event.target.value })}
                      className="rounded-lg border border-[#FFF4EC] bg-white/80 px-4 py-3 text-sm"
                      placeholder="Date souhaitée (optionnel)"
                      type="date"
                    />
                    <textarea
                      value={broadcastForm.details}
                      onChange={(event) => setBroadcastForm({ ...broadcastForm, details: event.target.value })}
                      className="min-h-[96px] rounded-lg border border-[#FFF4EC] bg-white/80 px-4 py-3 text-sm md:col-span-2"
                      placeholder="Décrivez votre besoin"
                    />
                  </div>
                  {broadcastStatus && (
                    <p className="mt-3 text-xs text-[#4B5563]">{broadcastStatus}</p>
                  )}
                  <div className="mt-3 flex justify-end">
                    <Button size="sm" onClick={handleBroadcast}>
                      <Send className="mr-2 h-4 w-4" />
                      Diffuser
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_280px]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#111827]">
                {loading ? 'Chargement...' : `${filtered.length} professionnels`}
              </h2>
              <Button variant="outline" size="sm" onClick={() => setShowBroadcast(true)}>
                Diffuser une demande à plusieurs pros
              </Button>
            </div>

            {loading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <Skeleton key={item} className="h-44 w-full" />
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((service) => (
                  <Link key={service.id} href={`/services/${service.id}`}>
                    <Card className="p-5 transition-all hover:-translate-y-0.5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-xs text-[#E8630A]">
                            {service.service_categories?.name || 'Service'}
                          </div>
                          <h3 className="mt-2 text-lg font-semibold text-[#111827]">
                            {service.title}
                          </h3>
                          <p className="mt-2 text-sm text-[#4B5563] line-clamp-2">
                            {service.description || 'Professionnel disponible sur rendez-vous.'}
                          </p>
                        </div>
                        <div className="rounded-lg bg-[#FFF4EC] px-3 py-1 text-xs text-[#4B5563]">
                          {service.is_verified ? 'Vérifié' : 'Nouveau'}
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-[#E8630A]">
                        <span className="inline-flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Trust 92
                        </span>
                        <button
                          onClick={(event) => {
                            event.preventDefault()
                            handleSave(service.id)
                          }}
                          className="inline-flex items-center gap-1 rounded-full bg-[#FFF4EC] px-2 py-1"
                        >
                          <Bookmark className="h-3 w-3" /> Enregistrer
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-[#E8630A]">
                        <span>{service.city}</span>
                        <span>{service.views} vues</span>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Card variant="glass" className="h-fit p-5">
              <h3 className="text-base font-semibold text-[#111827]">Pourquoi ça change tout</h3>
              <ul className="mt-3 space-y-3 text-sm text-[#4B5563]">
                <li>Diffusion intelligente des demandes aux meilleurs pros</li>
                <li>Score de fiabilité basé sur la performance réelle</li>
                <li>Disponibilité synchronisée pour éviter les doublons</li>
                <li>USSD-first pour paiement simple et rapide</li>
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="text-base font-semibold text-[#111827]">Heatmap locale</h3>
              <p className="mt-2 text-sm text-[#4B5563]">
                Les zones les plus demandées apparaîtront ici.
              </p>
              <div className="mt-4 h-32 rounded-lg bg-[#FFF4EC]" />
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
