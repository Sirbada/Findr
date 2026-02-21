'use client'

import Link from 'next/link'
import { Sparkles, MessageCircle, Phone, CheckCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)]">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-12">
        <div className="rounded-3xl border border-white/50 bg-gradient-to-br from-white via-white/90 to-[color:var(--green-50)] p-8 shadow-[var(--shadow-soft)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--green-50)] px-3 py-1 text-xs text-[color:var(--green-700)]">
            <Sparkles className="h-3 w-3" />
            Onboarding Cameroun
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-[color:var(--green-900)]">
            Bienvenue sur Findr
          </h1>
          <p className="mt-2 text-sm text-[color:var(--green-700)]">
            Le chemin le plus rapide pour réserver, louer et trouver un pro fiable au Cameroun.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { title: '1. Choisissez votre besoin', desc: 'Logement, voiture, service pro.' },
            { title: '2. Comparez en 2 minutes', desc: 'Photos, prix, Trust Score.' },
            { title: '3. Confirmez par USSD', desc: 'Simple, sécurisé, mobile-first.' },
          ].map((step) => (
            <Card key={step.title} className="p-5">
              <h3 className="text-base font-semibold text-[color:var(--green-900)]">{step.title}</h3>
              <p className="mt-2 text-sm text-[color:var(--green-700)]">{step.desc}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-8 p-6">
          <h2 className="text-lg font-semibold text-[color:var(--green-900)]">Démarrage express</h2>
          <p className="mt-2 text-sm text-[color:var(--green-700)]">
            Pas de temps ? Lancez une demande et recevez les meilleures offres.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/services">
              <Button>Diffuser une demande</Button>
            </Link>
            <Link href="/housing">
              <Button variant="outline">Explorer les logements</Button>
            </Link>
            <Link href="/cars">
              <Button variant="outline">Explorer les véhicules</Button>
            </Link>
          </div>
        </Card>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-6 w-6 text-[color:var(--green-600)]" />
              <h3 className="text-base font-semibold text-[color:var(--green-900)]">WhatsApp First</h3>
            </div>
            <p className="mt-2 text-sm text-[color:var(--green-700)]">
              Support instantané et confirmations rapides.
            </p>
            <Button className="mt-3" variant="outline">Discuter sur WhatsApp</Button>
          </Card>
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <Phone className="h-6 w-6 text-[color:var(--green-600)]" />
              <h3 className="text-base font-semibold text-[color:var(--green-900)]">SMS / Appel</h3>
            </div>
            <p className="mt-2 text-sm text-[color:var(--green-700)]">
              Pour les zones à faible connexion.
            </p>
            <Button className="mt-3" variant="outline">Recevoir par SMS</Button>
          </Card>
        </div>

        <Card className="mt-8 p-6">
          <div className="flex items-center gap-2 text-[color:var(--green-700)]">
            <CheckCircle className="h-5 w-5" />
            Paiement sécurisé • Support local • Disponible 24/7
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
