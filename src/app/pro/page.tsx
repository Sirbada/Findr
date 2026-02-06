'use client'

import Link from 'next/link'
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Users, 
  BarChart3, 
  Zap,
  ArrowRight,
  Play,
  Star,
  Quote
} from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

const benefits = [
  {
    icon: TrendingUp,
    title: 'Visibilité maximale',
    description: 'Vos annonces vues par des milliers de chercheurs chaque jour.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Profil vérifié',
    description: 'Badge de confiance qui rassure vos clients potentiels.',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics complets',
    description: 'Suivez vos performances en temps réel.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Outils rapides',
    description: 'Publiez et gérez vos annonces en quelques clics.',
    color: 'from-orange-500 to-red-500',
  },
]

const testimonials = [
  {
    name: 'Jean-Pierre M.',
    role: 'Agent immobilier, Douala',
    content: 'Depuis que j\'utilise Findr Pro, j\'ai triplé mes contacts clients. La plateforme est simple et efficace.',
    rating: 5,
  },
  {
    name: 'Marie-Claire N.',
    role: 'Propriétaire, Yaoundé',
    content: 'J\'ai loué mon appartement en moins d\'une semaine. Les locataires sont sérieux et vérifiés.',
    rating: 5,
  },
  {
    name: 'Agence SAFIM',
    role: 'Agence immobilière, Douala',
    content: 'Le tableau de bord Pro nous permet de gérer plus de 50 biens facilement. Indispensable!',
    rating: 5,
  },
]

const steps = [
  { number: '01', title: 'Créez votre compte', description: 'Inscription gratuite en 2 minutes' },
  { number: '02', title: 'Publiez vos annonces', description: 'Photos, description, prix — c\'est simple' },
  { number: '03', title: 'Recevez des contacts', description: 'Les clients vous contactent directement' },
]

export default function ProPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section - Unique Design */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                Développez votre
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  activité immobilière
                </span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Rejoignez les professionnels qui font confiance à Findr pour 
                trouver des clients qualifiés au Cameroun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup?pro=true">
                  <Button size="lg" className="w-full sm:w-auto group">
                    Commencer gratuitement
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-gray-600 text-white hover:bg-white/10">
                    J'ai déjà un compte
                  </Button>
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="flex items-center gap-8 mt-12 pt-8 border-t border-gray-700">
                <div>
                  <div className="text-3xl font-bold text-emerald-400">500+</div>
                  <div className="text-sm text-gray-400">Professionnels</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400">2 000+</div>
                  <div className="text-sm text-gray-400">Annonces actives</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-400">50k+</div>
                  <div className="text-sm text-gray-400">Visiteurs/mois</div>
                </div>
              </div>
            </div>
            
            {/* Right - Visual */}
            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700 shadow-2xl">
                {/* Mock dashboard preview */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 bg-emerald-500/20 rounded-lg border border-emerald-500/30 flex items-center justify-center">
                      <span className="text-emerald-400 font-bold">12</span>
                    </div>
                    <div className="h-20 bg-blue-500/20 rounded-lg border border-blue-500/30 flex items-center justify-center">
                      <span className="text-blue-400 font-bold">847</span>
                    </div>
                    <div className="h-20 bg-purple-500/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
                      <span className="text-purple-400 font-bold">23</span>
                    </div>
                  </div>
                  <div className="h-32 bg-gray-700/50 rounded-lg"></div>
                </div>
              </div>
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                ✓ Vérifié
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-gray-600 text-lg">
              Trois étapes simples pour commencer
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-emerald-300 to-transparent -translate-x-1/2"></div>
                )}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-3xl font-bold mb-6 shadow-lg shadow-emerald-500/30">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir Findr ?
            </h2>
            <p className="text-gray-600 text-lg">
              Des outils conçus pour votre succès
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit) => (
              <div 
                key={benefit.title}
                className="group relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Hover gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 transition-opacity`}></div>
                
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-gray-400 text-lg">
              Ce que disent nos partenaires professionnels
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name}
                className="bg-gray-800 rounded-2xl p-6 border border-gray-700 hover:border-emerald-500/50 transition-colors"
              >
                <Quote className="w-10 h-10 text-emerald-500/30 mb-4" />
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-12 text-center text-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Prêt à développer votre activité ?
              </h2>
              <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                Créez votre compte Pro gratuitement et commencez à recevoir 
                des demandes de clients qualifiés dès aujourd'hui.
              </p>
              <Link href="/signup?pro=true">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">
                  Créer mon compte Pro — C'est gratuit
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-emerald-200 text-sm mt-4">
                Aucune carte bancaire requise
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
