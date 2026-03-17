'use client'

import { useState, useEffect, useRef } from 'react'
import { Home, Car, Users, MapPin } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface StatConfig {
  icon: React.ComponentType<{ className?: string }>
  value: number
  labelKey: 'activeListings' | 'activeUsers' | 'vehiclesSold' | 'citiesCovered'
  suffix: string
}

const statConfigs: StatConfig[] = [
  { icon: Home, value: 10000, labelKey: 'activeListings', suffix: '+' },
  { icon: Users, value: 5000, labelKey: 'activeUsers', suffix: '+' },
  { icon: Car, value: 2500, labelKey: 'vehiclesSold', suffix: '+' },
  { icon: MapPin, value: 50, labelKey: 'citiesCovered', suffix: '+' },
]

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )
    if (elementRef.current) observer.observe(elementRef.current)
    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      const easedProgress = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(end * easedProgress))
      if (progress < 1) animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration, isVisible])

  return { count, elementRef }
}

function StatCard({ stat, index }: { stat: StatConfig; index: number }) {
  const { count, elementRef } = useCountUp(stat.value)
  const { t } = useTranslation()
  const IconComponent = stat.icon

  return (
    <div
      ref={elementRef}
      className="group animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="bg-white rounded-xl p-6 md:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)] border border-[#E8E8E4] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:border-[#D4D4CE]">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#F0F9F4] rounded-xl mb-4">
          <IconComponent className="w-6 h-6 text-[#1B5E3B]" />
        </div>

        {/* Number */}
        <div className="text-3xl md:text-4xl font-bold text-[#1A1A18] mb-1 tracking-[-0.02em]">
          {count.toLocaleString()}
          {stat.suffix}
        </div>

        {/* Label */}
        <div className="text-[12px] font-semibold text-[#2D8A5F] uppercase tracking-[0.06em]">
          {t.statsCounter[stat.labelKey]}
        </div>
      </div>
    </div>
  )
}

export function StatsCounter() {
  const { t, lang } = useTranslation()

  return (
    <section className="py-24 bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16 animate-slide-up">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2D8A5F] mb-3">
            {lang === 'fr' ? 'En chiffres' : 'By the numbers'}
          </p>
          <h2 className="text-[32px] font-semibold text-[#1A1A18] tracking-[-0.015em] mb-4">
            {t.statsCounter.title}
          </h2>
          <p className="text-lg text-[#4A4A45] max-w-2xl leading-relaxed">
            {t.statsCounter.subtitle}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {statConfigs.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Badge */}
        <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="inline-flex items-center space-x-2 bg-[#F0F9F4] text-[#1B5E3B] px-4 py-2 rounded-full text-sm font-medium border border-[#E6F2EC]">
            <div className="w-1.5 h-1.5 bg-[#2D8A5F] rounded-full" />
            <span>{t.statsCounter.badge}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
