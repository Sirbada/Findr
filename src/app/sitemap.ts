import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://findr.cm'
  
  // Static pages - always included
  const staticPages: MetadataRoute.Sitemap = [
    { 
      url: baseUrl, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 1 
    },
    { 
      url: `${baseUrl}/housing`, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/cars`, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/terrain`, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/emplois`, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/services`, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 0.9 
    },
    { 
      url: `${baseUrl}/annonces`, 
      lastModified: new Date(), 
      changeFrequency: 'daily', 
      priority: 0.8 
    },
    { 
      url: `${baseUrl}/faq`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.3 
    },
    { 
      url: `${baseUrl}/pro`, 
      lastModified: new Date(), 
      changeFrequency: 'monthly', 
      priority: 0.6 
    },
  ]

  return staticPages
}
