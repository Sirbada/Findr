'use client'

import { useDiaspora } from '@/lib/diaspora/context'

interface PriceDisplayProps {
  xafAmount: number
  className?: string
  showBoth?: boolean // Show both XAF and converted price
}

export function PriceDisplay({ xafAmount, className = '', showBoth = false }: PriceDisplayProps) {
  const { isDiasporaMode, currency, convertPrice } = useDiaspora()

  const { formatted } = convertPrice(xafAmount)

  if (!isDiasporaMode || currency === 'XAF') {
    return (
      <span className={className}>
        {new Intl.NumberFormat('fr-FR').format(xafAmount)} XAF
      </span>
    )
  }

  if (showBoth) {
    const xafFormatted = new Intl.NumberFormat('fr-FR').format(xafAmount) + ' XAF'
    return (
      <span className={className}>
        {formatted}
        <span className="text-gray-400 text-sm ml-1">({xafFormatted})</span>
      </span>
    )
  }

  return <span className={className}>{formatted}</span>
}
