'use client'

import { Edit, MessageCircle, Handshake, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from '@/lib/i18n/context'

export default function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      id: 1,
      title: t.howItWorks.step1Title,
      description: t.howItWorks.step1Desc,
      icon: Edit,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      buttonText: t.howItWorks.step1Button
    },
    {
      id: 2,
      title: t.howItWorks.step2Title,
      description: t.howItWorks.step2Desc,
      icon: MessageCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      buttonText: t.howItWorks.step2Button
    },
    {
      id: 3,
      title: t.howItWorks.step3Title,
      description: t.howItWorks.step3Desc,
      icon: Handshake,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      buttonText: t.howItWorks.step3Button
    }
  ]

  const successStories = [
    { name: 'Sarah', item: 'Voiture Toyota', time: '3 jours', price: '12M FCFA' },
    { name: 'Michel', item: 'Appartement T3', time: '1 semaine', price: '80M FCFA' },
    { name: 'Aminata', item: 'MacBook Pro', time: '2 jours', price: '1.8M FCFA' }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t.howItWorks.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.howItWorks.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, index) => {
              const IconComponent = step.icon
              const isLast = index === steps.length - 1
              
              return (
                <div key={step.id} className="relative">
                  
                  {/* Connection Arrow (Desktop only) */}
                  {!isLast && (
                    <div className="hidden md:block absolute top-20 -right-6 z-10">
                      <ArrowRight className="w-8 h-8 text-gray-300" />
                    </div>
                  )}

                  {/* Step Card */}
                  <div className={`${step.bgColor} ${step.borderColor} border-2 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300 h-full`}>
                    
                    {/* Step Number & Icon */}
                    <div className="relative mb-6">
                      <div className={`w-20 h-20 ${step.bgColor} border-4 ${step.borderColor} rounded-full mx-auto flex items-center justify-center shadow-lg`}>
                        <IconComponent className={`w-10 h-10 ${step.color}`} />
                      </div>
                      <div className={`absolute -top-3 -right-3 w-8 h-8 bg-white border-2 ${step.borderColor} rounded-full flex items-center justify-center shadow-sm`}>
                        <span className={`text-sm font-bold ${step.color}`}>{step.id}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <h3 className={`text-xl md:text-2xl font-bold ${step.color}`}>
                        {step.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed text-base">
                        {step.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6">
                      <button className={`inline-flex items-center gap-2 ${step.color} hover:underline font-medium transition-colors`}>
                        {step.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Additional Tips Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            💡 {t.howItWorks.tipsTitle}
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Pour les vendeurs */}
            <div>
              <h4 className="text-lg font-semibold text-blue-600 mb-4 flex items-center gap-2">
                {t.howItWorks.forSellers}
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{t.howItWorks.tip1Seller}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{t.howItWorks.tip2Seller}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{t.howItWorks.tip3Seller}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <span>{t.howItWorks.tip4Seller}</span>
                </li>
              </ul>
            </div>

            {/* Pour les acheteurs */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#F59E0B' }}>
                {t.howItWorks.forBuyers}
              </h4>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#F59E0B' }} />
                  <span>{t.howItWorks.tip1Buyer}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#F59E0B' }} />
                  <span>{t.howItWorks.tip2Buyer}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#F59E0B' }} />
                  <span>{t.howItWorks.tip3Buyer}</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#F59E0B' }} />
                  <span>{t.howItWorks.tip4Buyer}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              {t.howItWorks.ctaTitle}
            </h3>
            <p className="text-xl text-blue-100 mb-6 max-w-2xl mx-auto">
              {t.howItWorks.ctaSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/post"
                className="text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
                style={{ backgroundColor: '#F59E0B' }}
              >
                {t.howItWorks.ctaPost}
              </Link>
              <Link 
                href="/search"
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-colors backdrop-blur-sm"
              >
                {t.howItWorks.ctaSearch}
              </Link>
            </div>
          </div>
        </div>

        {/* Success Stories Preview */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t.howItWorks.successTitle}
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">✓</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{story.name}</div>
                    <div className="text-sm text-gray-600">{t.howItWorks.soldText}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  <strong>{story.item}</strong> — <strong className="text-green-600">{story.price}</strong>
                </div>
                <div className="text-xs text-gray-500">
                  {t.howItWorks.soldIn} {story.time} 🚀
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
