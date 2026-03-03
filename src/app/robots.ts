import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://findr.cm'
  
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/housing',
        '/cars',
        '/terrain',
        '/emplois',
        '/services',
        '/annonces',
        '/faq',
        '/pro',
      ],
      disallow: [
        '/login',
        '/signup',
        '/dashboard',
        '/admin',
        '/api',
        '/verify-email',
        '/_next/',
        '/tmp/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}