import { Metadata } from 'next'
import { TerrainPageClient } from './page-client'

export const metadata: Metadata = {
  title: 'Terrains au Cameroun - Findr',
  description: 'Trouvez des terrains titrés et sécurisés au Cameroun. Terrains constructibles, agricoles et commerciaux à Douala, Yaoundé et partout au Cameroun.',
  keywords: ['terrain', 'foncier', 'titre foncier', 'constructible', 'Cameroun', 'Douala', 'Yaoundé', 'immobilier', 'parcelle', 'lot'],
  openGraph: {
    title: 'Terrains au Cameroun - Findr',
    description: 'Trouvez des terrains titrés et sécurisés au Cameroun.',
    url: '/terrain',
    type: 'website',
    images: [
      {
        url: '/og-terrain.jpg',
        width: 1200,
        height: 630,
        alt: 'Terrains au Cameroun sur Findr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terrains au Cameroun - Findr',
    description: 'Trouvez des terrains titrés et sécurisés au Cameroun.',
    images: ['/og-terrain.jpg'],
  },
}

export default function TerrainPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terrains au Cameroun",
            "description": "Trouvez des terrains titrés et sécurisés au Cameroun. Terrains constructibles, agricoles et commerciaux.",
            "url": "https://findr.cm/terrain",
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
                  "name": "Terrains",
                  "item": "https://findr.cm/terrain"
                }
              ]
            },
            "mainEntity": {
              "@type": "RealEstateListing",
              "name": "Terrains au Cameroun",
              "areaServed": {
                "@type": "Country",
                "name": "Cameroun"
              }
            }
          }),
        }}
      />
      <TerrainPageClient />
    </>
  )
}
