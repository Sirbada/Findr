'use client'

import { useState, useEffect, useRef } from 'react'
import { Home, Car, Users, MapPin } from 'lucide-react'
import { useTranslation } from '@/lib/i18n/context'

interface StatConfig {
  icon: React.ComponentType<{ className?: string }>
  value: number
  labelKey: 'activeListings' | 'activeUsers' | 'vehiclesSold' | 'citiesCovered'
  suffix: string
  color: string
  bgColor: string
}

const statConfigs: StatConfig[] = [
  {
    icon: Home,
    value: 10000,
    labelKey: 'activeListings',
    suffix: '+',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: Users,
    value: 5000,
    labelKey: 'activeUsers',
    suffix: '+',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Car,
    value: 2500,
    labelKey: 'vehiclesSold',
    suffix: '+',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: MapPin,
    value: 50,
    labelKey: 'citiesCovered',
    suffix: '+',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
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
      className="group relative animate-slide-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover-lift border border-gray-100 group-hover:border-green-200">
        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center w-14 h-14 ${stat.bgColor} rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}
        >
          <IconComponent className={`w-7 h-7 ${stat.color}`} />
        </div>

        {/* Number */}
        <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {count.toLocaleString()}
          {stat.suffix}
        </div>

        {/* Label */}
        <div className={`text-sm font-medium ${stat.color} uppercase tracking-wide`}>
          {t.statsCounter[stat.labelKey]}
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </div>
  )
}

export function StatsCounter() {
  const { t } = useTranslation()

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5" />
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t.statsCounter.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.statsCounter.subtitle}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {statConfigs.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* Bottom message */}
        <div className="text-center mt-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm text-gray-700 px-6 py-3 rounded-full text-sm font-medium shadow-lg border border-gray-200">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>{t.statsCounter.badge}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
