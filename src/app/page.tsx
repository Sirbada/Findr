import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { HeroEnhanced } from '@/components/home/HeroEnhanced'
import { CategoriesEnhanced } from '@/components/home/CategoriesEnhanced'
import { HowItWorks } from '@/components/home/HowItWorks'
import { StatsCounter } from '@/components/home/StatsCounter'
import { Testimonials } from '@/components/home/Testimonials'
import { TrustedBy } from '@/components/home/TrustedBy'

export const metadata: Metadata = {
  title: 'Findr — Trouvez tout au Cameroun',
  description: 'Logements, voitures, terrains, emplois et services — une seule plateforme pour le Cameroun. Trouvez facilement ce que vous cherchez à Douala, Yaoundé et partout au Cameroun.',
  openGraph: {
    title: 'Findr — Trouvez tout au Cameroun',
    description: 'Logements, voitures, terrains, emplois et services — une seule plateforme pour le Cameroun.',
    url: 'https://findr.cm',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroEnhanced />
        <StatsCounter />
        <CategoriesEnhanced />
        <HowItWorks />
        <Testimonials />
        <TrustedBy />
      </main>
      <Footer />
    </div>
  )
}
