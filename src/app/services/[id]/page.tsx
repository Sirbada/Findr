'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { MapPin, ShieldCheck, Sparkles, PhoneCall, Bookmark } from 'lucide-react'
import { z } from 'zod'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { DatePicker } from '@/components/ui/DatePicker'
import { Skeleton } from '@/components/ui/Skeleton'
import { createClient } from '@/lib/supabase/client'
import { getService, ServiceListing } from '@/lib/supabase/services'

const requestSchema = z.object({
  city: z.string().min(2, 'Ville requise'),
  neighborhood: z.string().optional(),
  preferredDate: z.string().min(1, 'Date requise'),
  preferredTime: z.string().optional(),
  details: z.string().min(10, 'Décrivez votre besoin'),
})

type RequestForm = z.infer<typeof requestSchema>

export default function ServiceDetailPage() {
  const params = useParams<{ id: string }>()
  const [service, setService] = useState<ServiceListing | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<RequestForm>({
    city: '',
    neighborhood: '',
    preferredDate: '',
    preferredTime: '',
    details: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSave = async () => {
    if (!service) return
    const supabase = createClient()
    const authClient: any = (supabase as any).auth
    const userData = authClient.getUser ? await authClient.getUser() : await authClient.getSession()
    const user = userData?.data?.user || userData?.data?.session?.user
    if (user) {
      const { error } = await supabase.from('saved_items').insert({
        user_id: user.id,
        item_type: 'service',
        item_id: service.id,
      })
      if (!error) return
    }
    const saved = JSON.parse(localStorage.getItem('findr_saved_services') || '[]')
    if (!saved.includes(service.id)) {
      localStorage.setItem('findr_saved_services', JSON.stringify([...saved, service.id]))
    }
  }

  useEffect(() => {
    async function fetchService() {
      if (!params?.id) return
      const data = await getService(params.id)
      setService(data)
      setLoading(false)
    }
    fetchService()
  }, [params?.id])

  const handleSubmit = async () => {
    setErrors({})
    setSuccess('')
    const parsed = requestSchema.safeParse(form)
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {}
      parsed.error.errors.forEach((err) => {
        const key = err.path[0]
        if (key) nextErrors[String(key)] = err.message
      })
      setErrors(nextErrors)
      return
    }

    if (!service) return
    setSubmitting(true)
    const supabase = createClient()
    const authClient: any = (supabase as any).auth
    const userData = authClient.getUser ? await authClient.getUser() : await authClient.getSession()
    const user = userData?.data?.user || userData?.data?.session?.user

    if (!user) {
      setSubmitting(false)
      setErrors({ form: 'Connectez-vous pour envoyer une demande.' })
      return
    }

    const { error } = await supabase.from('service_requests').insert({
      user_id: user.id,
      service_id: service.id,
      city: form.city,
      neighborhood: form.neighborhood || null,
      preferred_date: form.preferredDate,
      preferred_time: form.preferredTime || null,
      details: form.details,
      status: 'open',
    })

    if (error) {
      setErrors({ form: "Impossible d'envoyer la demande. Réessayez." })
    } else {
      setSuccess('Demande envoyée. Le pro vous répond rapidement.')
      setForm({
        city: '',
        neighborhood: '',
        preferredDate: '',
        preferredTime: '',
        details: '',
      })
    }
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)]">
        <Header />
        <div className="mx-auto max-w-5xl px-4 py-10">
          <Skeleton className="h-40 w-full" />
        </div>
        <Footer />
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[color:var(--background)]">
        <Header />
        <div className="mx-auto max-w-5xl px-4 py-10 text-[color:var(--green-700)]">
          Service introuvable.
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <Header />

      <section className="px-4 py-10">
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-[color:var(--green-600)]">
                  {service.service_categories?.name || 'Service'}
                </div>
                <h1 className="mt-2 text-2xl font-semibold text-[color:var(--green-900)]">
                  {service.title}
                </h1>
                <p className="mt-3 text-sm text-[color:var(--green-700)]">
                  {service.description || 'Professionnel disponible sur rendez-vous.'}
                </p>
              </div>
              <div className="rounded-2xl bg-[color:var(--green-50)] px-3 py-1 text-xs text-[color:var(--green-700)]">
                {service.is_verified ? 'Vérifié' : 'Nouveau'}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 text-xs text-[color:var(--green-700)]">
              <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--green-50)] px-3 py-1">
                <MapPin className="h-3 w-3" />
                {service.city}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--green-50)] px-3 py-1">
                <ShieldCheck className="h-3 w-3" />
                Trust Score 92
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--green-50)] px-3 py-1">
                <Sparkles className="h-3 w-3" />
                Réponse rapide
              </span>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--green-50)] px-3 py-1"
              >
                <Bookmark className="h-3 w-3" />
                Sauvegarder
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-[color:var(--green-900)]">Trust Score (92)</h3>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-[color:var(--green-700)]">
              <div className="rounded-2xl bg-[color:var(--green-50)] px-3 py-2">Réponse moyenne: 12 min</div>
              <div className="rounded-2xl bg-[color:var(--green-50)] px-3 py-2">Annulations: 2%</div>
              <div className="rounded-2xl bg-[color:var(--green-50)] px-3 py-2">Identité vérifiée</div>
              <div className="rounded-2xl bg-[color:var(--green-50)] px-3 py-2">4.8/5 avis</div>
            </div>
          </Card>

          <Card variant="glass" className="p-6">
            <h2 className="text-lg font-semibold text-[color:var(--green-900)]">Demander un devis</h2>
            <p className="mt-1 text-xs text-[color:var(--green-700)]">
              Paiement USSD : confirmez sur votre téléphone après validation du devis.
            </p>

            <div className="mt-4 grid gap-3">
              <label className="text-xs font-medium text-[color:var(--green-700)]">Ville</label>
              <input
                value={form.city}
                onChange={(event) => setForm({ ...form, city: event.target.value })}
                className="rounded-2xl border border-[color:var(--green-100)] bg-white/80 px-4 py-3 text-sm"
                placeholder="Douala"
              />
              {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}

              <label className="text-xs font-medium text-[color:var(--green-700)]">Quartier</label>
              <input
                value={form.neighborhood}
                onChange={(event) => setForm({ ...form, neighborhood: event.target.value })}
                className="rounded-2xl border border-[color:var(--green-100)] bg-white/80 px-4 py-3 text-sm"
                placeholder="Bonapriso"
              />

              <DatePicker
                label="Date souhaitée"
                value={form.preferredDate}
                onChange={(event) => setForm({ ...form, preferredDate: event.target.value })}
              />
              {errors.preferredDate && <p className="text-xs text-red-500">{errors.preferredDate}</p>}

              <label className="text-xs font-medium text-[color:var(--green-700)]">Heure souhaitée</label>
              <input
                value={form.preferredTime}
                onChange={(event) => setForm({ ...form, preferredTime: event.target.value })}
                className="rounded-2xl border border-[color:var(--green-100)] bg-white/80 px-4 py-3 text-sm"
                placeholder="09:00"
              />

              <label className="text-xs font-medium text-[color:var(--green-700)]">Détails</label>
              <textarea
                value={form.details}
                onChange={(event) => setForm({ ...form, details: event.target.value })}
                className="min-h-[120px] rounded-2xl border border-[color:var(--green-100)] bg-white/80 px-4 py-3 text-sm"
                placeholder="Décrivez le problème, l'accès, et la disponibilité."
              />
              {errors.details && <p className="text-xs text-red-500">{errors.details}</p>}

              {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}
              {success && <p className="text-xs text-[color:var(--green-700)]">{success}</p>}

              <Button onClick={handleSubmit} disabled={submitting}>
                <PhoneCall className="mr-2 h-4 w-4" />
                Envoyer la demande
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-[color:var(--green-900)]">Top 3 devis recommandés</h2>
            <p className="mt-1 text-xs text-[color:var(--green-700)]">
              Comparaison rapide basée sur le Trust Score, le prix et la réactivité.
            </p>
            <div className="mt-4 space-y-3">
              {[
                { name: 'Pro Express', amount: 18000, eta: '10 min', trust: 96 },
                { name: 'Service Pro+', amount: 16500, eta: '20 min', trust: 91 },
                { name: 'Artisan Local', amount: 14000, eta: '35 min', trust: 87 },
              ].map((quote) => (
                <div key={quote.name} className="flex items-center justify-between rounded-2xl border border-[color:var(--green-100)] px-4 py-3">
                  <div>
                    <p className="font-medium text-[color:var(--green-900)]">{quote.name}</p>
                    <p className="text-xs text-[color:var(--green-600)]">Réponse moyenne: {quote.eta} • Trust {quote.trust}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[color:var(--green-700)]">{quote.amount.toLocaleString()} XAF</p>
                    <Button size="sm" variant="outline">Choisir</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  )
}
