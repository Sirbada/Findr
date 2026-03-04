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
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      icon: MessageCircle,
      title: t.howItWorksSimple.step2Title,
      description: t.howItWorksSimple.step2Desc,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      icon: Handshake,
      title: t.howItWorksSimple.step3Title,
      description: t.howItWorksSimple.step3Desc,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.howItWorksSimple.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.howItWorksSimple.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div
                key={index}
                className="relative group animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform -translate-x-6 z-0" />
                )}

                {/* Step card */}
                <div
                  className={`relative bg-white rounded-2xl p-8 border-2 ${step.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 hover-lift group-hover:border-opacity-100 z-10`}
                >
                  {/* Step number */}
                  <div className="absolute -top-4 left-8 flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-300 rounded-full text-sm font-bold text-gray-600 group-hover:border-gray-400 transition-colors">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 ${step.bgColor} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">{step.description}</p>

                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            )
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-full text-sm font-medium border border-emerald-200">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span>{t.howItWorksSimple.badge}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
