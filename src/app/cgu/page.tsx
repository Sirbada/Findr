'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function CGU() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 prose prose-gray">
          <h1 className="text-3xl font-bold mb-8">Conditions Générales d&apos;Utilisation</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d&apos;Utilisation (CGU) régissent l&apos;accès et l&apos;utilisation 
              de la plateforme Findr, accessible à l&apos;adresse findr.cm et via l&apos;application mobile.
            </p>
            <p>
              En utilisant Findr, vous acceptez sans réserve les présentes CGU.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Description du service</h2>
            <p>
              Findr est une plateforme de mise en relation entre vendeurs/bailleurs et acheteurs/locataires 
              au Cameroun. Les catégories proposées incluent :
            </p>
            <ul>
              <li><strong>Immobilier</strong> : Location et vente de logements</li>
              <li><strong>Véhicules</strong> : Vente et location de voitures et motos</li>
              <li><strong>Terrains</strong> : Vente de parcelles et terrains</li>
              <li><strong>Emplois</strong> : Offres d&apos;emploi</li>
              <li><strong>Services</strong> : Prestataires de services divers</li>
            </ul>
            <p>
              Findr agit en tant qu&apos;intermédiaire et n&apos;est pas partie aux transactions entre utilisateurs.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Inscription</h2>
            <p>
              L&apos;inscription est gratuite et requiert une adresse email valide ou un numéro de téléphone camerounais. 
              L&apos;utilisateur s&apos;engage à fournir des informations exactes et à les maintenir à jour.
            </p>
            <p>
              Chaque utilisateur est responsable de la confidentialité de son mot de passe.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Publication d&apos;annonces</h2>
            <p>Les annonces doivent :</p>
            <ul>
              <li>Être rédigées en français ou en anglais</li>
              <li>Contenir des informations exactes et vérifiables</li>
              <li>Ne pas contenir de contenu illicite, discriminatoire ou trompeur</li>
              <li>Respecter les prix en FCFA (XAF)</li>
              <li>Utiliser des photos réelles du bien proposé</li>
            </ul>
            <p>
              Findr se réserve le droit de supprimer toute annonce ne respectant pas ces conditions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Paiements</h2>
            <p>
              Les paiements sur Findr sont effectués via MTN Mobile Money et Orange Money. 
              Les frais de service sont de 5% du montant de la transaction, à la charge du locataire/acheteur.
            </p>
            <p>
              Les fonds sont conservés en séquestre jusqu&apos;à confirmation de la prestation par les deux parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Vérification des annonceurs</h2>
            <p>
              Findr propose un système de vérification optionnel. Les annonceurs vérifiés ont fourni :
            </p>
            <ul>
              <li>Une pièce d&apos;identité valide (CNI ou passeport)</li>
              <li>Un numéro de téléphone vérifié</li>
              <li>Pour les professionnels : registre de commerce et patente</li>
            </ul>
            <p>
              La vérification ne constitue pas une garantie de la qualité de la transaction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Responsabilité</h2>
            <p>
              Findr ne peut être tenu responsable :
            </p>
            <ul>
              <li>De la qualité ou de la conformité des biens proposés</li>
              <li>Des litiges entre utilisateurs</li>
              <li>Des interruptions temporaires du service</li>
              <li>Des pertes de données dues à des circonstances extérieures</li>
            </ul>
            <p>
              En cas de litige, Findr s&apos;engage à faciliter la médiation entre les parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Propriété des contenus</h2>
            <p>
              Les annonceurs restent propriétaires de leurs contenus (textes et photos). 
              En publiant sur Findr, ils accordent une licence non-exclusive d&apos;utilisation 
              pour l&apos;affichage sur la plateforme.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Suspension et résiliation</h2>
            <p>
              Findr peut suspendre ou supprimer un compte en cas de :
            </p>
            <ul>
              <li>Violation des présentes CGU</li>
              <li>Publication d&apos;annonces frauduleuses</li>
              <li>Comportement abusif envers d&apos;autres utilisateurs</li>
              <li>Tentative de contournement du système de paiement</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Modification des CGU</h2>
            <p>
              Findr se réserve le droit de modifier les présentes CGU à tout moment. 
              Les utilisateurs seront informés par email ou notification in-app.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">11. Contact</h2>
            <p>
              Pour toute question relative aux CGU :<br />
              Email : legal@findr.cm<br />
              WhatsApp : +237 6XX XXX XXX
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-12">
            Dernière mise à jour : Février 2026
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
