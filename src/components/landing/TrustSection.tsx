'use client'

import { Shield, Users, Star, Smartphone, CheckCircle, Eye, Clock, Award } from 'lucide-react'

const trustStats = [
  {
    icon: Users,
    number: '12,000+',
    label: 'Utilisateurs actifs',
    description: 'Croissance de 40% par mois',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    icon: CheckCircle,
    number: '8,500+',
    label: 'Annonces publiées',
    description: 'Plus de 150 nouvelles par jour',
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    icon: Star,
    number: '4.8/5',
    label: 'Note moyenne',
    description: 'Basée sur 2,340 évaluations',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50'
  },
  {
    icon: Shield,
    number: '99.2%',
    label: 'Transactions réussies',
    description: 'Sans problème ou litige',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  }
]

const trustFeatures = [
  {
    icon: Shield,
    title: 'Profils vérifiés',
    description: 'Vérification par SMS, email et pièce d\'identité pour les vendeurs professionnels.',
    badge: 'Sécurité'
  },
  {
    icon: Eye,
    title: 'Modération 24/7',
    description: 'Toutes les annonces sont vérifiées par notre équipe avant publication.',
    badge: 'Qualité'
  },
  {
    icon: Smartphone,
    title: 'Paiements sécurisés',
    description: 'Orange Money, MTN MoMo et virements bancaires protégés.',
    badge: 'Fintech'
  },
  {
    icon: Clock,
    title: 'Support rapide',
    description: 'Équipe support francophone disponible du lundi au samedi.',
    badge: 'Service'
  }
]

const paymentMethods = [
  { name: 'Orange Money', logo: '🟠', verified: true },
  { name: 'MTN Mobile Money', logo: '🟡', verified: true },
  { name: 'Virement bancaire', logo: '🏦', verified: true },
  { name: 'Cash (en personne)', logo: '💵', verified: true }
]

export default function TrustSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium mb-6">
            <Shield className="w-5 h-5" />
            Plateforme de confiance
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi nous faire confiance ?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Findr protège chaque transaction avec des technologies de pointe et une équipe dédiée à votre sécurité.
          </p>
        </div>

        {/* Trust Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {trustStats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div key={index} className={`${stat.bgColor} rounded-2xl p-6 text-center border border-gray-100`}>
                <div className="mb-4">
                  <div className={`w-12 h-12 ${stat.color} bg-white rounded-full mx-auto flex items-center justify-center shadow-sm`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                </div>
                <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>
                  {stat.number}
                </div>
                <div className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                  {stat.label}
                </div>
                <div className="text-xs md:text-sm text-gray-600">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>

        {/* Trust Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {trustFeatures.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <div key={index} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {feature.title}
                      </h3>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {feature.badge}
                      </span>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Payment Methods */}
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💳 Moyens de paiement sécurisés
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl p-4 text-center border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{method.logo}</div>
                <div className="font-medium text-gray-900 text-sm mb-1">
                  {method.name}
                </div>
                {method.verified && (
                  <div className="text-xs text-green-600 flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Vérifié
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <p className="text-gray-700 text-sm">
              🔒 Toutes les transactions sont protégées par un cryptage SSL 256 bits
            </p>
          </div>
        </div>

        {/* Verification Badges */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🏆 Système de badges de confiance
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            
            {/* Phone Verified */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Téléphone vérifié</h4>
              <p className="text-sm text-gray-600">
                Numéro de téléphone confirmé par SMS
              </p>
              <div className="mt-2">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  ✓ Vérifié
                </span>
              </div>
            </div>

            {/* ID Verified */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Identité vérifiée</h4>
              <p className="text-sm text-gray-600">
                CNI ou passeport confirmé
              </p>
              <div className="mt-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                  🆔 Premium
                </span>
              </div>
            </div>

            {/* Top Seller */}
            <div className="text-center col-span-2 md:col-span-1">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Vendeur Top</h4>
              <p className="text-sm text-gray-600">
                Plus de 50 ventes avec 4.8+ étoiles
              </p>
              <div className="mt-2">
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  ⭐ Elite
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            💬 Ce que disent nos utilisateurs
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Marie Kouam',
                role: 'Vendeuse d\'immobilier',
                comment: 'J\'ai vendu ma villa en 5 jours grâce à Findr. Interface simple et acheteurs sérieux.',
                rating: 5,
                location: 'Douala'
              },
              {
                name: 'Jean Fotso',
                role: 'Acheteur de voitures',
                comment: 'Système de vérification au top. J\'ai acheté ma Toyota sans stress, vendeur honnête.',
                rating: 5,
                location: 'Yaoundé'
              },
              {
                name: 'Aminata Diallo',
                role: 'Freelance tech',
                comment: 'Parfait pour vendre du matériel informatique. Paiements Orange Money très pratiques.',
                rating: 5,
                location: 'Bafoussam'
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex justify-center mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4 leading-relaxed">
                  "{testimonial.comment}"
                </p>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role} • {testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Rejoins la communauté de confiance
            </h3>
            <p className="text-xl text-green-100 mb-6 max-w-2xl mx-auto">
              Plus de 12,000 utilisateurs nous font déjà confiance pour leurs transactions. Et toi ?
            </p>
            <button className="bg-white text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl">
              Créer mon compte gratuit 🚀
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}