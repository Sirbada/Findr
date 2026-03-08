import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: '#1B5E3B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  title: 'Findr — Trouvez tout au Cameroun',
  description: 'Logements, voitures, emplois — une seule plateforme pour le Cameroun. Trouvez facilement ce que vous cherchez à Douala, Yaoundé et partout au Cameroun.',
  keywords: ['Cameroun', 'logement', 'appartement', 'voiture', 'emploi', 'Douala', 'Yaoundé', 'immobilier', 'location', 'vente'],
  authors: [{ name: 'Findr' }],
  creator: 'Findr',
  publisher: 'Findr',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://findr.cm'),
  alternates: {
    canonical: '/',
    languages: {
      'fr-CM': '/fr',
      'en-CM': '/en',
    },
  },
  openGraph: {
    title: 'Findr — Trouvez tout au Cameroun',
    description: 'Logements, voitures, emplois — une seule plateforme pour le Cameroun',
    url: 'https://findr.cm',
    siteName: 'Findr',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Findr - Plateforme d\'annonces au Cameroun',
      },
    ],
    locale: 'fr_CM',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Findr — Trouvez tout au Cameroun',
    description: 'Logements, voitures, emplois — une seule plateforme pour le Cameroun',
    images: ['/og-image.jpg'],
    creator: '@findr_cm',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#1B5E3B' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Findr',
  },
  category: 'business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Findr" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Findr" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#1B5E3B" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Splash screens for iOS */}
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-2048-2732.png"
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/splash/apple-splash-1170-2532.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        
        {/* Preconnect to important origins */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
