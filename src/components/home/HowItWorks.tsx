'use client'

import { Search, MessageCircle, Handshake } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      icon: Search,
      title: t.howItWorksSimple.step1Title,
      description: t.howItWorksSimple.step1Desc,
    },
    {
      icon: MessageCircle,
      title: t.howItWorksSimple.step2Title,
      description: t.howItWorksSimple.step2Desc,
    },
    {
      icon: Handshake,
      title: t.howItWorksSimple.step3Title,
      description: t.howItWorksSimple.step3Desc,
    },
  ]

  return (
    <section className="py-24 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 animate-slide-up">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2D8A5F] mb-3">
            {t.howItWorksSimple.title}
          </p>
          <h2 className="text-[32px] font-semibold text-[#1A1A18] tracking-[-0.015em] mb-4">
            {t.howItWorksSimple.subtitle}
          </h2>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-6 relative">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div
                key={index}
                className="relative group animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-px bg-[#E8E8E4] transform -translate-x-6 z-0" />
                )}

                {/* Step card */}
                <div className="relative bg-white rounded-xl p-8 border border-[#E8E8E4] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-[#D4D4CE] transition-all duration-200 z-10">
                  {/* Step number */}
                  <div className="absolute -top-3.5 left-8 flex items-center justify-center w-7 h-7 bg-white border border-[#E8E8E4] rounded-full text-xs font-semibold text-[#7A7A73]">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F0F9F4] rounded-xl mb-6">
                    <IconComponent className="w-6 h-6 text-[#1B5E3B]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-[#1A1A18] mb-3 tracking-[-0.01em]">
                    {step.title}
                  </h3>

                  <p className="text-sm text-[#4A4A45] leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Badge */}
        <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="inline-flex items-center space-x-2 bg-[#F0F9F4] text-[#1B5E3B] px-4 py-2 rounded-full text-sm font-medium border border-[#E6F2EC]">
            <div className="w-1.5 h-1.5 bg-[#2D8A5F] rounded-full" />
            <span>{t.howItWorksSimple.badge}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
