'use client'

import { HTMLAttributes } from 'react'

interface GlassHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function GlassHeader({ className = '', ...props }: GlassHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-40 bg-white/80 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-gray-200 ${className}`}
      {...props}
    />
  )
}
