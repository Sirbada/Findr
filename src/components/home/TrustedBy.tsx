'use client'

import { useTranslation } from '@/lib/i18n/context'

export function TrustedBy() {
  const { t } = useTranslation()

  // Placeholder logos - realistic for Cameroon market
  const logos = [
    {
      name: 'Orange Cameroun',
      logo: 'https://logo.clearbit.com/orange.cm',
      alt: 'Orange Cameroun'
    },
    {
      name: 'MTN Cameroon',
      logo: 'https://logo.clearbit.com/mtn.cm',
      alt: 'MTN Cameroon'
    },
    {
      name: 'Ecobank',
      logo: 'https://logo.clearbit.com/ecobank.com',
      alt: 'Ecobank'
    },
    {
      name: 'BICEC',
      logo: 'https://via.placeholder.com/120x60/059669/ffffff?text=BICEC',
      alt: 'BICEC'
    },
    {
      name: 'Total Cameroun',
      logo: 'https://logo.clearbit.com/totalenergies.com',
      alt: 'Total Cameroun'
    },
    {
      name: 'Université de Yaoundé',
      logo: 'https://via.placeholder.com/120x60/059669/ffffff?text=UY1',
      alt: 'Université de Yaoundé I'
    }
  ]

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-slide-up">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            {t.trustedBy.eyebrow}
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">
            {t.trustedBy.title}
          </h2>
        </div>

        {/* Logos grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {logos.map((company, index) => (
            <div 
              key={company.name}
              className="group flex items-center justify-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-lg p-4 transition-all duration-300 hover:bg-gray-50 group-hover:scale-105">
                <img
                  src={company.logo}
                  alt={company.alt}
                  className="h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                  onError={(e) => {
                    // Fallback to text-based logo if image fails to load
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div 
                  className="hidden items-center justify-center h-12 bg-gray-100 rounded text-gray-600 font-semibold text-xs px-3"
                  style={{ display: 'none' }}
                >
                  {company.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {t.trustedBy.verifiedListings}
            </h3>
            <p className="text-sm text-gray-600">
              {t.trustedBy.verifiedListingsDesc}
            </p>
          </div>

          <div className="text-center animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {t.trustedBy.secure}
            </h3>
            <p className="text-sm text-gray-600">
              {t.trustedBy.secureDesc}
            </p>
          </div>

          <div className="text-center animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v2.25m0 13.5V21m8.25-9H18.75m-13.5 0H3" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">
              {t.trustedBy.support}
            </h3>
            <p className="text-sm text-gray-600">
              {t.trustedBy.supportDesc}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
