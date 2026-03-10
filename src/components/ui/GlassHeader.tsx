'use client'

import { HTMLAttributes } from 'react'

interface GlassHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function GlassHeader({ className = '', ...props }: GlassHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-40 bg-[#FAFAF8]/90 backdrop-blur-[12px] border-b border-[#E5E7EB] ${className}`}
      {...props}
    />
  )
}
