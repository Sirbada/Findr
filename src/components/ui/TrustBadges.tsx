'use client'

import { CheckCircle, Shield, Clock, Eye, Users, Star, TrendingUp, AlertCircle } from 'lucide-react'

/**
 * Trust & Urgency Elements inspired by Booking.com and Airbnb
 * 
 * These components increase conversion by:
 * 1. Building trust (verification, reviews)
 * 2. Creating urgency (scarcity, social proof)
 * 3. Reducing friction (clear pricing, guarantees)
 */

interface VerifiedBadgeProps {
  type: 'user' | 'listing' | 'seller'
  size?: 'sm' | 'md' | 'lg'
}

export function VerifiedBadge({ type, size = 'md' }: VerifiedBadgeProps) {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }
  
  const labels = {
    user: 'Utilisateur vérifié',
    listing: 'Annonce vérifiée',
    seller: 'Vendeur vérifié',
  }
  
  return (
    <span className="inline-flex items-center gap-1 text-emerald-600" title={labels[type]}>
      <CheckCircle className={sizes[size]} />
      <span className="text-xs font-medium">{labels[type]}</span>
    </span>
  )
}

interface SocialProofProps {
  viewingNow?: number
  recentlyContacted?: string // "il y a 2 heures"
  totalViews?: number
}

export function SocialProof({ viewingNow, recentlyContacted, totalViews }: SocialProofProps) {
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      {viewingNow && viewingNow > 0 && (
        <span className="inline-flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
          <Users className="w-3 h-3" />
          <span className="font-medium">{viewingNow} personnes regardent</span>
        </span>
      )}
      
      {recentlyContacted && (
        <span className="inline-flex items-center gap-1 text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          <Clock className="w-3 h-3" />
          <span>Contacté {recentlyContacted}</span>
        </span>
      )}
      
      {totalViews && totalViews > 10 && (
        <span className="inline-flex items-center gap-1 text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
          <Eye className="w-3 h-3" />
          <span>{totalViews} vues</span>
        </span>
      )}
    </div>
  )
}

interface ScarcityAlertProps {
  type: 'limited' | 'popular' | 'new'
  message?: string
}

export function ScarcityAlert({ type, message }: ScarcityAlertProps) {
  const configs = {
    limited: {
      icon: AlertCircle,
      bg: 'bg-red-50',
      text: 'text-red-700',
      defaultMessage: 'Dernière disponibilité !',
    },
    popular: {
      icon: TrendingUp,
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      defaultMessage: 'Très demandé - 5 personnes ont contacté le vendeur aujourd\'hui',
    },
    new: {
      icon: Star,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      defaultMessage: 'Nouveau sur Findr',
    },
  }
  
  const config = configs[type]
  const Icon = config.icon
  
  return (
    <div className={`flex items-center gap-2 ${config.bg} ${config.text} px-3 py-2 rounded-lg text-sm`}>
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="font-medium">{message || config.defaultMessage}</span>
    </div>
  )
}

interface TrustGuaranteeProps {
  variant?: 'default' | 'compact'
}

export function TrustGuarantee({ variant = 'default' }: TrustGuaranteeProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-emerald-600 text-sm">
        <Shield className="w-4 h-4" />
        <span>Protection Findr</span>
      </div>
    )
  }
  
  return (
    <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-4">
      <div className="flex items-center gap-2 text-emerald-700 mb-2">
        <Shield className="w-5 h-5" />
        <span className="font-semibold">Protection Findr</span>
      </div>
      <ul className="text-sm text-emerald-600 space-y-1">
        <li>✓ Vendeurs vérifiés</li>
        <li>✓ Paiement sécurisé</li>
        <li>✓ Support 24/7</li>
      </ul>
    </div>
  )
}

interface ReviewSummaryProps {
  rating: number
  reviewCount: number
  breakdown?: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function ReviewSummary({ rating, reviewCount, breakdown }: ReviewSummaryProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        <span className="text-lg font-bold">{rating.toFixed(1)}</span>
      </div>
      <span className="text-gray-500 text-sm">
        ({reviewCount} avis)
      </span>
      
      {breakdown && (
        <div className="hidden md:flex items-center gap-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-1">
              <span className="text-xs text-gray-400">{star}</span>
              <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${(breakdown[star as keyof typeof breakdown] / reviewCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

interface PriceHighlightProps {
  originalPrice?: number
  currentPrice: number
  currency?: string
  period?: string
  isGoodDeal?: boolean
}

export function PriceHighlight({ 
  originalPrice, 
  currentPrice, 
  currency = 'XAF', 
  period,
  isGoodDeal 
}: PriceHighlightProps) {
  const formatPrice = (price: number) => new Intl.NumberFormat('fr-FR').format(price)
  
  return (
    <div className="space-y-1">
      {originalPrice && originalPrice > currentPrice && (
        <div className="flex items-center gap-2">
          <span className="text-gray-400 line-through text-sm">
            {formatPrice(originalPrice)} {currency}
          </span>
          <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-0.5 rounded">
            -{Math.round((1 - currentPrice / originalPrice) * 100)}%
          </span>
        </div>
      )}
      
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-emerald-600">
          {formatPrice(currentPrice)} {currency}
        </span>
        {period && (
          <span className="text-gray-500 text-sm">/{period}</span>
        )}
      </div>
      
      {isGoodDeal && (
        <span className="inline-flex items-center gap-1 text-emerald-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Bon prix pour ce quartier
        </span>
      )}
    </div>
  )
}

// Demo function to generate random social proof data
export function generateSocialProof() {
  const viewingNow = Math.random() > 0.5 ? Math.floor(Math.random() * 8) + 1 : 0
  const hoursAgo = Math.floor(Math.random() * 12) + 1
  const totalViews = Math.floor(Math.random() * 200) + 20
  
  return {
    viewingNow,
    recentlyContacted: `il y a ${hoursAgo}h`,
    totalViews,
  }
}
