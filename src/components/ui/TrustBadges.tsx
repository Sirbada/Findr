'use client'

import { CheckCircle, Shield, Clock, Eye, Users, Star, TrendingUp, AlertCircle, Check } from 'lucide-react'

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
    user: 'Utilisateur v\u00e9rifi\u00e9',
    listing: 'Annonce v\u00e9rifi\u00e9e',
    seller: 'Vendeur v\u00e9rifi\u00e9',
  }

  return (
    <span className="inline-flex items-center gap-1 text-[#1B5E3B]" title={labels[type]}>
      <CheckCircle className={sizes[size]} />
      <span className="text-xs font-medium">{labels[type]}</span>
    </span>
  )
}

interface SocialProofProps {
  viewingNow?: number
  recentlyContacted?: string
  totalViews?: number
}

export function SocialProof({ viewingNow, recentlyContacted, totalViews }: SocialProofProps) {
  return (
    <div className="flex flex-wrap gap-3 text-sm">
      {viewingNow && viewingNow > 0 && (
        <span className="inline-flex items-center gap-1 text-[#E8960C] bg-[#FFFBEB] px-2 py-1 rounded-full">
          <Users className="w-3 h-3" />
          <span className="font-medium">{viewingNow} personnes regardent</span>
        </span>
      )}

      {recentlyContacted && (
        <span className="inline-flex items-center gap-1 text-[#4A4A45] bg-[#F4F4F1] px-2 py-1 rounded-full">
          <Clock className="w-3 h-3" />
          <span>Contact\u00e9 {recentlyContacted}</span>
        </span>
      )}

      {totalViews && totalViews > 10 && (
        <span className="inline-flex items-center gap-1 text-[#7A7A73] bg-[#F4F4F1] px-2 py-1 rounded-full">
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
      text: 'text-[#DC2626]',
      defaultMessage: 'Derni\u00e8re disponibilit\u00e9 !',
    },
    popular: {
      icon: TrendingUp,
      bg: 'bg-[#FFFBEB]',
      text: 'text-[#E8960C]',
      defaultMessage: 'Tr\u00e8s demand\u00e9 - 5 personnes ont contact\u00e9 le vendeur aujourd\'hui',
    },
    new: {
      icon: Star,
      bg: 'bg-[#F0F9F4]',
      text: 'text-[#1B5E3B]',
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
      <div className="flex items-center gap-2 text-[#1B5E3B] text-sm">
        <Shield className="w-4 h-4" />
        <span>Protection Findr</span>
      </div>
    )
  }

  return (
    <div className="border border-[#E6F2EC] bg-[#F0F9F4] rounded-xl p-4">
      <div className="flex items-center gap-2 text-[#0D3D24] mb-2">
        <Shield className="w-5 h-5" />
        <span className="font-semibold">Protection Findr</span>
      </div>
      <ul className="text-sm text-[#1B5E3B] space-y-1">
        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Vendeurs v\u00e9rifi\u00e9s</li>
        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Paiement s\u00e9curis\u00e9</li>
        <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Support 24/7</li>
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
        <span className="text-lg font-bold text-[#1A1A18]">{rating.toFixed(1)}</span>
      </div>
      <span className="text-[#7A7A73] text-sm">
        ({reviewCount} avis)
      </span>

      {breakdown && (
        <div className="hidden md:flex items-center gap-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-1">
              <span className="text-xs text-[#ADADAA]">{star}</span>
              <div className="w-16 h-1.5 bg-[#EEECEA] rounded-full overflow-hidden">
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
          <span className="text-[#ADADAA] line-through text-sm">
            {formatPrice(originalPrice)} {currency}
          </span>
          <span className="bg-red-100 text-[#DC2626] text-xs font-medium px-2 py-0.5 rounded">
            -{Math.round((1 - currentPrice / originalPrice) * 100)}%
          </span>
        </div>
      )}

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[#1B5E3B]">
          {formatPrice(currentPrice)} {currency}
        </span>
        {period && (
          <span className="text-[#7A7A73] text-sm">/{period}</span>
        )}
      </div>

      {isGoodDeal && (
        <span className="inline-flex items-center gap-1 text-[#2D8A5F] text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Bon prix pour ce quartier
        </span>
      )}
    </div>
  )
}

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
