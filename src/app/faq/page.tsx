'use client'

import { useState } from 'react'
import { ChevronDown, Home, Car, Shield, CreditCard, AlertTriangle, HelpCircle } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { useTranslation } from '@/lib/i18n/context'

// FAQ Data
const faqData = {
  fr: {
    title: 'Questions Fréquentes',
    subtitle: 'Tout ce que vous devez savoir pour utiliser Findr en toute confiance',
    categories: [
      {
        id: 'housing-renter',
        icon: Home,
        title: 'Immobilier — Locataires',
        color: 'blue',
        questions: [
          {
            q: 'Comment savoir si une annonce est fiable ?',
            a: 'Recherchez le badge "Vérifié" ✓ sur le profil du propriétaire. Cela signifie que nous avons vérifié son identité et sa preuve de propriété. Méfiez-vous des annonces sans ce badge et ne payez JAMAIS avant d\'avoir visité le bien en personne.'
          },
          {
            q: 'Pourquoi payer la caution sur Findr plutôt qu\'au propriétaire ?',
            a: 'Votre caution est sécurisée chez nous (système Escrow). Trop de locataires ont perdu leur caution sans raison valable. Avec Findr, votre argent est protégé et automatiquement remboursé sous 48h si tout se passe bien.'
          },
          {
            q: 'Comment récupérer ma caution ?',
            a: 'À la fin de votre bail, vous et le propriétaire faites l\'état des lieux de sortie sur l\'app. Si pas de dégâts, la caution est remboursée sous 48h sur votre Mobile Money. En cas de litige, notre équipe intervient.'
          },
          {
            q: 'L\'appartement ne ressemble pas aux photos, que faire ?',
            a: 'Signalez immédiatement via l\'app AVANT de signer quoi que ce soit. Prenez des photos comme preuve. Si la différence est significative, vous pouvez demander un remboursement complet si vous avez payé via Findr.'
          },
          {
            q: 'Je n\'ai pas de compte bancaire, comment payer ?',
            a: 'Findr accepte MTN Mobile Money et Orange Money. Vous pouvez aussi utiliser la nouvelle carte virtuelle MTN MoMo (liée à Mastercard) pour plus de flexibilité.'
          },
          {
            q: 'Le propriétaire me harcèle ou veut entrer chez moi sans prévenir',
            a: 'Au Cameroun, le propriétaire doit prévenir au moins 24h à l\'avance sauf urgence. Documentez ces incidents via l\'app et contactez notre support. Nous pouvons intervenir.'
          }
        ]
      },
      {
        id: 'housing-owner',
        icon: Home,
        title: 'Immobilier — Propriétaires',
        color: 'blue',
        questions: [
          {
            q: 'Pourquoi dois-je vérifier mon identité ?',
            a: 'La vérification protège tout le monde. Les locataires font plus confiance aux propriétaires vérifiés, ce qui vous apporte plus de contacts sérieux. C\'est gratuit et rapide (5 minutes).'
          },
          {
            q: 'Quand reçois-je le loyer ?',
            a: 'Si votre locataire utilise Findr AutoPay, vous recevez le loyer automatiquement entre le 1er et le 3 de chaque mois sur votre Mobile Money.'
          },
          {
            q: 'Comment réclamer des dégâts sur la caution ?',
            a: 'Faites l\'état des lieux de sortie avec photos dans l\'app. Vous avez 48h après le départ pour signaler des dégâts. Fournissez des preuves (photos avant/après, factures de réparation). Notre équipe analyse et décide.'
          },
          {
            q: 'Le locataire refuse de partir à la fin du bail',
            a: 'C\'est malheureusement fréquent. Findr peut émettre une mise en demeure officielle. Si le locataire persiste, nous vous orientons vers un huissier partenaire à tarif négocié.'
          },
          {
            q: 'Comment éviter les mauvais locataires ?',
            a: 'Avec Findr Pro, vous voyez l\'historique du locataire : avis des anciens propriétaires, ponctualité de paiement, incidents passés. Faites confiance aux données !'
          }
        ]
      },
      {
        id: 'cars-renter',
        icon: Car,
        title: 'Véhicules — Locataires',
        color: 'blue',
        questions: [
          {
            q: 'Comment être sûr que le véhicule est en bon état ?',
            a: 'Recherchez le badge "Vérifié" ✓ qui indique une inspection récente. Lors de l\'état des lieux, vérifiez les pneus, freins, niveaux et feux. Tout défaut doit être noté et photographié AVANT de partir.'
          },
          {
            q: 'L\'assurance est-elle incluse ?',
            a: 'Tous les véhicules sur Findr doivent avoir une assurance RC (Responsabilité Civile) valide. Mais attention : la RC ne couvre PAS les dégâts au véhicule que vous louez ! Nous vous recommandons de prendre la Protection Findr.'
          },
          {
            q: 'Que se passe-t-il si je tombe en panne ?',
            a: 'Avec la Protection Complète Findr, vous avez une assistance 24h. Sinon, contactez immédiatement le propriétaire ET Findr via l\'app. Les frais de panne mécanique (non causée par vous) sont à la charge du propriétaire.'
          },
          {
            q: 'J\'ai eu un accident, que faire ?',
            a: '1) Assurez votre sécurité 2) Prenez des photos de la scène 3) Notez les coordonnées des témoins 4) Signalez IMMÉDIATEMENT dans l\'app Findr 5) Contactez la police si nécessaire. NE QUITTEZ PAS les lieux avant documentation.'
          },
          {
            q: 'Le propriétaire réclame des dégâts que je n\'ai pas causés !',
            a: 'C\'est pour ça que l\'état des lieux départ est crucial ! Si vous avez les photos prouvant que le dommage existait avant, partagez-les. Findr comparera et tranchera en votre faveur.'
          }
        ]
      },
      {
        id: 'cars-owner',
        icon: Car,
        title: 'Véhicules — Propriétaires',
        color: 'blue',
        questions: [
          {
            q: 'Comment rendre mon annonce plus visible ?',
            a: '1) Faites vérifier votre véhicule (badge "Vérifié" ✓) 2) Prenez de belles photos (propre, bonne lumière, 12 angles) 3) Prix compétitif 4) Répondez rapidement aux demandes 5) Abonnement Pro = mise en avant automatique.'
          },
          {
            q: 'Et si le locataire endommage mon véhicule ?',
            a: '1) Documentez les dégâts à l\'état des lieux retour (photos) 2) Signalez sous 24h dans l\'app 3) Demandez un devis de réparation 4) Le montant est déduit de la caution bloquée. Si dépassement, Findr vous aide à récupérer la différence.'
          },
          {
            q: 'Le locataire a disparu avec mon véhicule !',
            a: 'C\'est rare mais grave. Signalez IMMÉDIATEMENT : 1) Dans l\'app Findr (nous avons son identité vérifiée) 2) À la police (dépôt de plainte). Nous coopérons avec les autorités. Si GPS installé, localisation possible.'
          },
          {
            q: 'Comment éviter les mauvais locataires ?',
            a: 'Vérifiez le profil (avis des autres propriétaires). Utilisateurs avec pièce d\'identité et permis vérifiés seulement. Faites confiance à votre instinct lors de la remise des clés.'
          }
        ]
      },
      {
        id: 'cars-sale',
        icon: CreditCard,
        title: 'Achat/Vente Véhicules',
        color: 'pink',
        questions: [
          {
            q: 'Comment éviter les compteurs trafiqués ?',
            a: '1) Vérifiez l\'historique d\'entretien (factures) 2) L\'usure doit correspondre au kilométrage (siège, volant, pédales) 3) Demandez un diagnostic électronique (garage partenaire) 4) Un véhicule "Vérifié" Findr a été inspecté par nos soins.'
          },
          {
            q: 'Comment savoir si le véhicule n\'est pas volé ?',
            a: 'Vérifiez que le numéro de châssis (VIN) correspond à la carte grise. La vérification Findr inclut un contrôle des fichiers de véhicules volés.'
          },
          {
            q: 'Pourquoi payer via Escrow Findr plutôt que directement ?',
            a: 'Protection totale ! L\'argent est bloqué chez Findr jusqu\'à ce que vous confirmiez avoir reçu le véhicule ET les documents de transfert. Si problème, vous récupérez votre argent.'
          },
          {
            q: 'Le vendeur refuse l\'Escrow, c\'est suspect ?',
            a: 'Oui, méfiance ! Les vendeurs sérieux n\'ont rien à perdre avec l\'Escrow (ils reçoivent l\'argent après transfert). Un refus peut indiquer une arnaque ou un problème avec le véhicule.'
          }
        ]
      },
      {
        id: 'security',
        icon: Shield,
        title: 'Sécurité & Conflits',
        color: 'red',
        questions: [
          {
            q: 'Comment fonctionne la médiation Findr ?',
            a: 'Étape 1 : Dialogue direct entre les parties (48h). Étape 2 : Si échec, médiateur Findr assigné — collecte des preuves, appels, proposition de solution (72h). Étape 3 : Si toujours pas d\'accord, décision finale Findr contraignante (7 jours).'
          },
          {
            q: 'Qu\'est-ce que l\'Escrow ?',
            a: 'L\'Escrow (séquestre) est un système où votre argent est bloqué chez Findr — pas chez l\'autre partie. L\'argent n\'est libéré que quand les deux parties confirment que tout est OK. Cela protège locataires ET propriétaires.'
          },
          {
            q: 'Comment signaler une arnaque ?',
            a: 'Utilisez le bouton "Signaler" sur l\'annonce ou le profil concerné. Fournissez tous les détails : messages, captures d\'écran, preuves de paiement. Notre équipe enquête sous 24h et prend des mesures.'
          },
          {
            q: 'Findr garde mes données personnelles ?',
            a: 'Vos données sont protégées et jamais partagées avec des tiers sans votre accord. Nous utilisons le cryptage et respectons les meilleures pratiques de sécurité. Consultez notre politique de confidentialité pour plus de détails.'
          }
        ]
      },
      {
        id: 'general',
        icon: HelpCircle,
        title: 'Général',
        color: 'gray',
        questions: [
          {
            q: 'Findr est-il disponible partout au Cameroun ?',
            a: 'Nous couvrons actuellement Douala, Yaoundé et Bafoussam. D\'autres villes arrivent bientôt : Kribi, Limbé, Garoua.'
          },
          {
            q: 'Combien coûte Findr ?',
            a: 'Locataires : GRATUIT ! Propriétaires : Gratuit jusqu\'à 5 annonces. Pro : 15 000 XAF/mois (50 annonces, badge vérifié, stats). Agence : 45 000 XAF/mois (illimité).'
          },
          {
            q: 'Comment contacter le support ?',
            a: 'WhatsApp : +237 6XX XXX XXX | Email : support@findr.cm | In-app : Bouton "Aide" dans le menu. Réponse garantie sous 24h.'
          }
        ]
      }
    ]
  },
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know to use Findr with confidence',
    categories: [
      {
        id: 'housing-renter',
        icon: Home,
        title: 'Real Estate — Renters',
        color: 'blue',
        questions: [
          {
            q: 'How do I know if a listing is reliable?',
            a: 'Look for the "Verified" ✓ badge on the owner\'s profile. This means we\'ve verified their identity and proof of ownership. Be wary of listings without this badge and NEVER pay before visiting the property in person.'
          },
          {
            q: 'Why pay the deposit through Findr instead of the owner?',
            a: 'Your deposit is secured with us (Escrow system). Too many renters have lost their deposit for no valid reason. With Findr, your money is protected and automatically refunded within 48h if everything goes well.'
          },
          {
            q: 'How do I get my deposit back?',
            a: 'At the end of your lease, you and the owner complete the check-out inspection on the app. If no damage, the deposit is refunded within 48h to your Mobile Money. In case of dispute, our team intervenes.'
          },
          {
            q: 'The apartment doesn\'t match the photos, what should I do?',
            a: 'Report immediately via the app BEFORE signing anything. Take photos as proof. If the difference is significant, you can request a full refund if you paid via Findr.'
          },
          {
            q: 'I don\'t have a bank account, how can I pay?',
            a: 'Findr accepts MTN Mobile Money and Orange Money. You can also use the new MTN MoMo virtual card (linked to Mastercard) for more flexibility.'
          }
        ]
      },
      {
        id: 'housing-owner',
        icon: Home,
        title: 'Real Estate — Owners',
        color: 'blue',
        questions: [
          {
            q: 'Why do I need to verify my identity?',
            a: 'Verification protects everyone. Renters trust verified owners more, which brings you more serious inquiries. It\'s free and quick (5 minutes).'
          },
          {
            q: 'When do I receive the rent?',
            a: 'If your tenant uses Findr AutoPay, you receive rent automatically between the 1st and 3rd of each month to your Mobile Money.'
          },
          {
            q: 'How do I claim damages from the deposit?',
            a: 'Complete the check-out inspection with photos in the app. You have 48h after departure to report damages. Provide evidence (before/after photos, repair invoices). Our team analyzes and decides.'
          },
          {
            q: 'The tenant refuses to leave at the end of the lease',
            a: 'Unfortunately common. Findr can issue an official notice. If the tenant persists, we refer you to a partner bailiff at negotiated rates.'
          }
        ]
      },
      {
        id: 'cars-renter',
        icon: Car,
        title: 'Vehicles — Renters',
        color: 'blue',
        questions: [
          {
            q: 'How can I be sure the vehicle is in good condition?',
            a: 'Look for the "Verified" ✓ badge indicating a recent inspection. During check-out, verify tires, brakes, levels, and lights. Any defects must be noted and photographed BEFORE leaving.'
          },
          {
            q: 'Is insurance included?',
            a: 'All vehicles on Findr must have valid RC (Civil Liability) insurance. But note: RC does NOT cover damage to the vehicle you\'re renting! We recommend getting Findr Protection.'
          },
          {
            q: 'What happens if I break down?',
            a: 'With Findr Complete Protection, you have 24h assistance. Otherwise, immediately contact the owner AND Findr via the app. Mechanical breakdown costs (not caused by you) are the owner\'s responsibility.'
          },
          {
            q: 'I had an accident, what should I do?',
            a: '1) Ensure your safety 2) Take photos of the scene 3) Note witness contact info 4) Report IMMEDIATELY in the Findr app 5) Contact police if necessary. DO NOT leave the scene before documenting.'
          }
        ]
      },
      {
        id: 'cars-owner',
        icon: Car,
        title: 'Vehicles — Owners',
        color: 'blue',
        questions: [
          {
            q: 'How can I make my listing more visible?',
            a: '1) Get your vehicle verified ("Verified" ✓ badge) 2) Take great photos (clean, good lighting, 12 angles) 3) Competitive pricing 4) Respond quickly to requests 5) Pro subscription = automatic promotion.'
          },
          {
            q: 'What if the renter damages my vehicle?',
            a: '1) Document damage at check-in (photos) 2) Report within 24h in the app 3) Get a repair quote 4) Amount is deducted from the blocked deposit. If exceeded, Findr helps recover the difference.'
          },
          {
            q: 'The renter disappeared with my vehicle!',
            a: 'Rare but serious. Report IMMEDIATELY: 1) In the Findr app (we have their verified identity) 2) To the police (file a complaint). We cooperate with authorities. If GPS installed, tracking is possible.'
          }
        ]
      },
      {
        id: 'security',
        icon: Shield,
        title: 'Security & Disputes',
        color: 'red',
        questions: [
          {
            q: 'How does Findr mediation work?',
            a: 'Step 1: Direct dialogue between parties (48h). Step 2: If failed, Findr mediator assigned — evidence collection, calls, solution proposal (72h). Step 3: If still no agreement, final binding Findr decision (7 days).'
          },
          {
            q: 'What is Escrow?',
            a: 'Escrow is a system where your money is held by Findr — not the other party. Money is only released when both parties confirm everything is OK. This protects both renters AND owners.'
          },
          {
            q: 'How do I report a scam?',
            a: 'Use the "Report" button on the listing or profile. Provide all details: messages, screenshots, payment proof. Our team investigates within 24h and takes action.'
          }
        ]
      },
      {
        id: 'general',
        icon: HelpCircle,
        title: 'General',
        color: 'gray',
        questions: [
          {
            q: 'Is Findr available everywhere in Cameroon?',
            a: 'We currently cover Douala, Yaoundé, and Bafoussam. More cities coming soon: Kribi, Limbé, Garoua.'
          },
          {
            q: 'How much does Findr cost?',
            a: 'Renters: FREE! Owners: Free up to 5 listings. Pro: 15,000 XAF/month (50 listings, verified badge, stats). Agency: 45,000 XAF/month (unlimited).'
          },
          {
            q: 'How do I contact support?',
            a: 'WhatsApp: +237 6XX XXX XXX | Email: support@findr.cm | In-app: "Help" button in menu. Response guaranteed within 24h.'
          }
        ]
      }
    ]
  }
}

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  blue: 'bg-blue-100 text-blue-600',
  pink: 'bg-pink-100 text-pink-600',
  red: 'bg-red-100 text-red-600',
  gray: 'bg-gray-100 text-gray-600',
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex items-start justify-between text-left hover:bg-gray-50 transition-colors rounded-lg px-2 -mx-2"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        <p className="text-gray-600 leading-relaxed px-2">{answer}</p>
      </div>
    </div>
  )
}

export default function FAQPage() {
  const { lang } = useTranslation()
  const t = faqData[lang]
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl text-blue-100">{t.subtitle}</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {t.categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
                className={`p-4 rounded-xl text-center transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-blue-600 text-white shadow-lg scale-105' 
                    : 'bg-white hover:shadow-md'
                }`}
              >
                <cat.icon className={`w-8 h-8 mx-auto mb-2 ${
                  activeCategory === cat.id ? 'text-white' : 'text-gray-600'
                }`} />
                <span className={`text-sm font-medium ${
                  activeCategory === cat.id ? 'text-white' : 'text-gray-700'
                }`}>
                  {cat.title.split(' — ')[0]}
                </span>
              </button>
            ))}
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {t.categories
              .filter(cat => !activeCategory || cat.id === activeCategory)
              .map((category) => (
                <div key={category.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <div className={`p-4 flex items-center gap-3 border-b ${colorClasses[category.color as keyof typeof colorClasses]?.split(' ')[0]} bg-opacity-50`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses[category.color as keyof typeof colorClasses]}`}>
                      <category.icon className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">{category.title}</h2>
                  </div>
                  <div className="p-4">
                    {category.questions.map((item, idx) => (
                      <FAQItem key={idx} question={item.q} answer={item.a} />
                    ))}
                  </div>
                </div>
              ))}
          </div>

          {/* Still Have Questions */}
          <div className="mt-12 bg-gray-900 text-white rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              {lang === 'fr' ? 'Encore des questions ?' : 'Still have questions?'}
            </h3>
            <p className="text-gray-400 mb-6">
              {lang === 'fr' 
                ? 'Notre équipe est là pour vous aider'
                : 'Our team is here to help you'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/237600000000" 
                target="_blank"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
              <a 
                href="mailto:support@findr.cm"
                className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
