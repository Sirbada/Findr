'use client'

import { HTMLAttributes } from 'react'

interface SkeletonCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'listing' | 'job' | 'compact'
}

function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] ${className}`}
    />
  )
}

export function SkeletonCard({ variant = 'listing', className = '', ...props }: SkeletonCardProps) {
  if (variant === 'job') {
    return (
      <div
        className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 ${className}`}
        {...props}
      >
        <div className="flex justify-between items-start mb-3">
          <Shimmer className="h-6 w-1/3 rounded" />
          <Shimmer className="h-4 w-20 rounded-full" />
        </div>
        <Shimmer className="h-4 w-1/4 mb-3 rounded" />
        <Shimmer className="h-4 w-full mb-2 rounded" />
        <Shimmer className="h-4 w-3/4 mb-4 rounded" />
        <div className="flex gap-2">
          <Shimmer className="h-6 w-16 rounded-full" />
          <Shimmer className="h-6 w-20 rounded-full" />
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div
        className={`bg-white rounded-2xl overflow-hidden shadow-sm ${className}`}
        {...props}
      >
        <Shimmer className="h-32 w-full rounded-none" />
        <div className="p-3 space-y-2">
          <Shimmer className="h-4 w-3/4 rounded" />
          <Shimmer className="h-3 w-1/2 rounded" />
        </div>
      </div>
    )
  }

  // Default: listing card
  return (
    <div
      className={`bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 ${className}`}
      {...props}
    >
      <Shimmer className="h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Shimmer className="h-5 w-3/4 rounded" />
        <div className="flex items-center gap-2">
          <Shimmer className="h-4 w-4 rounded-full" />
          <Shimmer className="h-4 w-1/2 rounded" />
        </div>
        <div className="flex justify-between items-center pt-1">
          <Shimmer className="h-6 w-1/3 rounded" />
          <Shimmer className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

/** Grid of SkeletonCards — use instead of inline pulse divs */
export function SkeletonCardGrid({
  count = 6,
  variant = 'listing',
  columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}: {
  count?: number
  variant?: SkeletonCardProps['variant']
  columns?: string
}) {
  return (
    <div className={`grid ${columns} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
    </div>
  )
}

/** Vertical list of SkeletonCards — use for job-style lists */
export function SkeletonCardList({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant="job" />
      ))}
    </div>
  )
}
