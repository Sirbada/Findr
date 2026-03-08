'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, Search, MessageCircle, Share2, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTranslation } from '@/lib/i18n/context'

interface OnboardingStep {
  id: number
  icon: any
  title: {
    fr: string
    en: string
  }
  description: {
    fr: string
    en: string
  }
  image: string
  color: string
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    icon: Search,
    title: {
      fr: 'Recherchez facilement',
      en: 'Search easily'
    },
    description: {
      fr: 'Trouvez ce que vous cherchez parmi des milliers d\'annonces vérifiées à Douala, Yaoundé et partout au Cameroun.',
      en: 'Find what you\'re looking for among thousands of verified listings in Douala, Yaoundé and across Cameroon.'
    },
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    id: 2,
    icon: MessageCircle,
    title: {
      fr: 'Contactez directement',
      en: 'Contact directly'
    },
    description: {
      fr: 'Discutez avec les vendeurs via WhatsApp, téléphone ou notre messagerie sécurisée. Négociez et posez vos questions.',
      en: 'Chat with sellers via WhatsApp, phone, or our secure messaging. Negotiate and ask your questions.'
    },
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400&h=300&fit=crop',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 3,
    icon: Share2,
    title: {
      fr: 'Partagez vos annonces',
      en: 'Share your listings'
    },
    description: {
      fr: 'Publiez vos biens en quelques clics et partagez-les sur Facebook, WhatsApp pour toucher plus d\'acheteurs.',
      en: 'Post your items in just a few clicks and share them on Facebook, WhatsApp to reach more buyers.'
    },
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 4,
    icon: CreditCard,
    title: {
      fr: 'Payez en toute sécurité',
      en: 'Pay securely'
    },
    description: {
      fr: 'Utilisez Orange Money, MTN Mobile Money ou payez en espèces. Vos transactions sont sécurisées.',
      en: 'Use Orange Money, MTN Mobile Money, or pay cash. Your transactions are secure.'
    },
    image: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=400&h=300&fit=crop',
    color: 'from-orange-500 to-orange-600'
  }
]

export function OnboardingFlow() {
  const { lang } = useTranslation()
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem('findr-onboarding-seen')
    if (!hasSeenOnboarding) {
      setIsVisible(true)
    }
  }, [])

  const handleClose = () => {
    localStorage.setItem('findr-onboarding-seen', 'true')
    setIsVisible(false)
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      handleClose()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = () => {
    handleClose()
  }

  if (!isVisible) return null

  const step = steps[currentStep]
  const IconComponent = step.icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="relative p-6 pb-0">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          {/* Progress bar */}
          <div className="flex space-x-2 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                  index <= currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl shadow-lg mb-6`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>

          {/* Image */}
          <div className="mb-6 rounded-xl overflow-hidden">
            <img 
              src={step.image}
              alt={step.title[lang]}
              className="w-full h-48 object-cover"
            />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {step.title[lang]}
          </h2>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            {step.description[lang]}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="text-sm">
                    {lang === 'fr' ? 'Précédent' : 'Previous'}
                  </span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                {lang === 'fr' ? 'Passer' : 'Skip'}
              </button>

              <Button
                onClick={handleNext}
                className={`bg-gradient-to-r ${step.color} hover:shadow-lg px-6`}
              >
                {currentStep === steps.length - 1 ? (
                  lang === 'fr' ? 'Commencer' : 'Get started'
                ) : (
                  <div className="flex items-center space-x-1">
                    <span>{lang === 'fr' ? 'Suivant' : 'Next'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <div className="bg-gray-50 px-6 py-3 text-center">
          <div className="text-sm text-gray-500">
            {currentStep + 1} {lang === 'fr' ? 'sur' : 'of'} {steps.length}
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to manually trigger onboarding
export function useOnboarding() {
  const showOnboarding = () => {
    localStorage.removeItem('findr-onboarding-seen')
    window.location.reload() // Simple way to retrigger
  }

  const hasSeenOnboarding = () => {
    return localStorage.getItem('findr-onboarding-seen') === 'true'
  }

  return { showOnboarding, hasSeenOnboarding }
}