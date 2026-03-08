'use client'

import { ShieldCheck, Lock, HeadphonesIcon } from 'lucide-react'
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
      logo: 'https://via.placeholder.com/120x60/1B5E3B/ffffff?text=BICEC',
      alt: 'BICEC'
    },
    {
      name: 'Total Cameroun',
      logo: 'https://logo.clearbit.com/totalenergies.com',
      alt: 'Total Cameroun'
    },
    {
      name: 'Université de Yaoundé',
      logo: 'https://via.placeholder.com/120x60/1B5E3B/ffffff?text=UY1',
      alt: 'Université de Yaoundé I'
    }
  ]

  const trustIndicators = [
    {
      icon: ShieldCheck,
      title: t.trustedBy.verifiedListings,
      description: t.trustedBy.verifiedListingsDesc,
    },
    {
      icon: Lock,
      title: t.trustedBy.secure,
      description: t.trustedBy.secureDesc,
    },
    {
      icon: HeadphonesIcon,
      title: t.trustedBy.support,
      description: t.trustedBy.supportDesc,
    },
  ]

  return (
    <section className="py-24 bg-white border-t border-[#E8E8E4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 animate-slide-up">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#7A7A73] mb-3">
            {t.trustedBy.eyebrow}
          </p>
          <h2 className="text-xl font-semibold text-[#1A1A18] tracking-[-0.01em]">
            {t.trustedBy.title}
          </h2>
        </div>

        {/* Logos grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center mb-20">
          {logos.map((company, index) => (
            <div
              key={company.name}
              className="group flex items-center justify-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden rounded-lg p-4 transition-all duration-200 hover:bg-[#F4F4F1] group-hover:scale-105">
                <img
                  src={company.logo}
                  alt={company.alt}
                  className="h-12 w-auto object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-50 group-hover:opacity-100"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div
                  className="hidden items-center justify-center h-12 bg-[#F4F4F1] rounded-lg text-[#7A7A73] font-semibold text-xs px-3"
                  style={{ display: 'none' }}
                >
                  {company.name}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="grid md:grid-cols-3 gap-6">
          {trustIndicators.map((indicator, index) => {
            const IconComponent = indicator.icon
            return (
              <div
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${0.6 + index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#F0F9F4] rounded-xl flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-[#1B5E3B]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A18] text-sm mb-1">
                      {indicator.title}
                    </h3>
                    <p className="text-sm text-[#7A7A73] leading-relaxed">
                      {indicator.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
