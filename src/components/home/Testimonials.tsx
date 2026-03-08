'use client'

import { useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'
import type { Language } from '@/lib/i18n/translations'

interface Testimonial {
  id: number
  name: string
  role: string
  city: string
  avatar: string
  rating: number
  testimonial: Record<Language, string>
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Marie Ngo',
    role: 'Enseignante',
    city: 'Douala',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1fd?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: {
      fr: "J'ai trouvé mon appartement à Bonanjo en 2 jours seulement ! L'interface est très simple et les annonces sont de qualité.",
      en: 'I found my apartment in Bonanjo in just 2 days! The interface is very simple and the listings are high quality.',
    },
  },
  {
    id: 2,
    name: 'Paul Mbarga',
    role: 'Entrepreneur',
    city: 'Yaoundé',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: {
      fr: "Excellent pour la vente de voitures ! J'ai vendu ma Mercedes en une semaine avec de nombreux contacts qualifiés.",
      en: 'Excellent for selling cars! I sold my Mercedes in one week with many qualified contacts.',
    },
  },
  {
    id: 3,
    name: 'Fatou Sow',
    role: 'Étudiante',
    city: 'Douala',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: {
      fr: "Parfait pour les étudiants ! J'ai trouvé un studio meublé près de l'université à un prix abordable.",
      en: 'Perfect for students! I found a furnished studio near the university at an affordable price.',
    },
  },
  {
    id: 4,
    name: 'Jean-Claude Fotso',
    role: 'Agent immobilier',
    city: 'Bafoussam',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: {
      fr: "Une plateforme professionnelle qui m'aide à gérer mes clients efficacement. Les outils sont vraiment utiles.",
      en: 'A professional platform that helps me manage my clients efficiently. The tools are really useful.',
    },
  },
  {
    id: 5,
    name: 'Aminata Diallo',
    role: 'Comptable',
    city: 'Kribi',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: {
      fr: "Interface très intuitive. J'ai trouvé un emploi à distance grâce aux annonces de qualité disponibles.",
      en: 'Very intuitive interface. I found a remote job thanks to the quality listings available.',
    },
  },
  {
    id: 6,
    name: 'Samuel Nguema',
    role: 'Mécanicien',
    city: 'Yaoundé',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    rating: 5,
    testimonial: {
      fr: "Je recommande vivement ! Ma clientèle a doublé depuis que je propose mes services sur la plateforme.",
      en: 'I highly recommend! My clientele has doubled since I started offering my services on the platform.',
    },
  },
]

export function Testimonials() {
  const { t, lang } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <section className="py-24 bg-[#FAFAF8] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 animate-slide-up">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2D8A5F] mb-3">
            {lang === 'fr' ? 'Témoignages' : 'Testimonials'}
          </p>
          <h2 className="text-[32px] font-semibold text-[#1A1A18] tracking-[-0.015em] mb-4">
            {t.testimonialSection.title}
          </h2>
          <p className="text-lg text-[#4A4A45] max-w-2xl leading-relaxed">
            {t.testimonialSection.subtitle}
          </p>
        </div>

        {/* Main testimonial */}
        <div className="mb-16 animate-scale-in">
          <div className="max-w-3xl">
            <div className="relative bg-white rounded-xl p-8 md:p-12 border border-[#E8E8E4] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)]">
              {/* Quote icon */}
              <div className="absolute top-6 left-6 text-[#2D8A5F] opacity-15">
                <Quote size={48} />
              </div>

              <div className="relative z-10">
                {/* Rating */}
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-[#E8960C] fill-current" />
                  ))}
                </div>

                {/* Testimonial text */}
                <blockquote className="text-xl text-[#1A1A18] mb-8 leading-relaxed">
                  &ldquo;{testimonials[currentIndex].testimonial[lang]}&rdquo;
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].name}
                    className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-[#E6F2EC]"
                  />
                  <div>
                    <div className="font-semibold text-[#1A1A18]">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-sm text-[#7A7A73]">
                      {testimonials[currentIndex].role} &bull; {testimonials[currentIndex].city}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl p-6 border border-[#E8E8E4] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-[#D4D4CE] transition-all duration-200 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#E8960C] fill-current" />
                ))}
              </div>

              {/* Testimonial */}
              <p className="text-[#4A4A45] mb-4 text-sm leading-relaxed">
                &ldquo;{testimonial.testimonial[lang]}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-[#E6F2EC]"
                />
                <div>
                  <div className="font-semibold text-[#1A1A18] text-sm">{testimonial.name}</div>
                  <div className="text-[#7A7A73] text-xs">
                    {testimonial.role} &bull; {testimonial.city}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center space-x-2 mt-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-[#1B5E3B] w-6'
                  : 'bg-[#D4D4CE] hover:bg-[#ADADAA]'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
