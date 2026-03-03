import { Metadata } from 'next'
import { ServicesPageClient } from './page-client'

export const metadata: Metadata = {
  title: 'Services au Cameroun - Findr',
  description: 'Trouvez tous les services dont vous avez besoin au Cameroun. Professionnels vérifiés : plomberie, électricité, ménage, réparation, formation et plus.',
  keywords: ['services', 'prestation', 'professionnel', 'Cameroun', 'Douala', 'Yaoundé', 'plombier', 'électricien', 'ménage', 'réparation', 'formation', 'consulting'],
  openGraph: {
    title: 'Services au Cameroun - Findr',
    description: 'Trouvez tous les services professionnels dont vous avez besoin au Cameroun.',
    url: '/services',
    type: 'website',
    images: [
      {
        url: '/og-services.jpg',
        width: 1200,
        height: 630,
        alt: 'Services professionnels au Cameroun sur Findr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services au Cameroun - Findr',
    description: 'Services professionnels vérifiés au Cameroun.',
    images: ['/og-services.jpg'],
  },
}

export default function ServicesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Services au Cameroun",
            "description": "Trouvez tous les services dont vous avez besoin au Cameroun. Professionnels vérifiés.",
            "url": "https://findr.cm/services",
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Accueil",
                  "item": "https://findr.cm"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Services",
                  "item": "https://findr.cm/services"
                }
              ]
            },
            "mainEntity": {
              "@type": "Service",
              "serviceType": "Professional Services",
              "provider": {
                "@type": "Organization",
                "name": "Findr"
              },
              "areaServed": {
                "@type": "Place",
                "addressLocality": "Cameroun",
                "addressCountry": "CM"
              }
            }
          }),
        }}
      />
      <ServicesPageClient />
    </>
  )
}