'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function MentionsLegales() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-12">
        <div className="max-w-3xl mx-auto px-4 prose prose-gray">
          <h1 className="text-3xl font-bold mb-8">Mentions Légales</h1>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">1. Éditeur du site</h2>
            <p>
              <strong>Findr</strong> est une plateforme numérique éditée par <strong>Bada Inc.</strong><br />
              Siège social : Douala, Cameroun<br />
              Email : contact@findr.cm<br />
              Téléphone : +237 6XX XXX XXX
            </p>
            <p>
              Directeur de la publication : [Nom du responsable]
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">2. Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              <strong>Supabase Inc.</strong> — San Francisco, CA, USA<br />
              Site web : <a href="https://supabase.com" className="text-blue-600">supabase.com</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. Propriété intellectuelle</h2>
            <p>
              L&apos;ensemble des contenus présents sur le site Findr (textes, images, graphismes, logo, icônes, logiciels) 
              est la propriété exclusive de Bada Inc. ou de ses partenaires et est protégé par les lois camerounaises 
              et internationales relatives à la propriété intellectuelle.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments 
              du site, quel que soit le moyen ou le procédé utilisé, est interdite sauf autorisation écrite préalable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Protection des données personnelles</h2>
            <p>
              Conformément à la loi n° 2010/012 du 21 décembre 2010 relative à la cybersécurité et à la cybercriminalité 
              au Cameroun, Findr s&apos;engage à protéger la vie privée de ses utilisateurs.
            </p>
            <p>
              Les données personnelles collectées (nom, email, téléphone, localisation) sont utilisées uniquement 
              pour le fonctionnement de la plateforme et ne sont jamais vendues à des tiers.
            </p>
            <p>
              Vous disposez d&apos;un droit d&apos;accès, de modification et de suppression de vos données personnelles. 
              Pour exercer ce droit, contactez-nous à : privacy@findr.cm
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">5. Cookies</h2>
            <p>
              Le site utilise des cookies techniques nécessaires au fonctionnement du service. 
              Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Loi applicable</h2>
            <p>
              Les présentes mentions légales sont régies par le droit camerounais. 
              En cas de litige, les tribunaux de Douala seront seuls compétents.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">7. Cadre légal</h2>
            <p>
              Findr opère conformément aux dispositions de :
            </p>
            <ul>
              <li>Loi n° 2010/021 du 21 décembre 2010 régissant le commerce électronique au Cameroun</li>
              <li>Loi n° 2010/012 du 21 décembre 2010 relative à la cybersécurité et à la cybercriminalité</li>
              <li>Loi n° 2010/013 du 21 décembre 2010 régissant les communications électroniques</li>
            </ul>
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
