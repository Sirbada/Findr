import { Metadata } from 'next'
import { EmploisPageClient } from './page-client'

export const metadata: Metadata = {
  title: 'Emplois au Cameroun - Findr',
  description: 'Trouvez votre prochain emploi au Cameroun. Offres d\'emploi vérifiées à Douala, Yaoundé et dans tout le pays. CDI, CDD, freelance et stages disponibles.',
  keywords: ['emploi', 'travail', 'job', 'carrière', 'Cameroun', 'Douala', 'Yaoundé', 'recrutement', 'offre emploi', 'CDI', 'CDD', 'stage', 'freelance'],
  openGraph: {
    title: 'Emplois au Cameroun - Findr',
    description: 'Trouvez votre prochain emploi au Cameroun. Offres d\'emploi vérifiées dans tout le pays.',
    url: '/emplois',
    type: 'website',
    images: [
      {
        url: '/og-emplois.jpg',
        width: 1200,
        height: 630,
        alt: 'Emplois au Cameroun sur Findr',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emplois au Cameroun - Findr',
    description: 'Trouvez votre prochain emploi au Cameroun. Offres vérifiées.',
    images: ['/og-emplois.jpg'],
  },
}

export default function EmploisPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Emplois au Cameroun",
            "description": "Trouvez votre prochain emploi au Cameroun. Offres d'emploi vérifiées à Douala, Yaoundé et dans tout le pays.",
            "url": "https://findr.cm/emplois",
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
                  "name": "Emplois",
                  "item": "https://findr.cm/emplois"
                }
              ]
            },
            "mainEntity": {
              "@type": "JobPosting",
              "hiringOrganization": {
                "@type": "Organization",
                "name": "Findr"
              },
              "jobLocation": {
                "@type": "Place",
                "addressLocality": "Cameroun",
                "addressCountry": "CM"
              }
            }
          }),
        }}
      />
      <EmploisPageClient />
    </>
  )
}