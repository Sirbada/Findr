'use client'

import { HTMLAttributes } from 'react'

interface GlassHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function GlassHeader({ className = '', ...props }: GlassHeaderProps) {
  return (
    <div
      className={`sticky top-0 z-40 bg-[color:var(--glass)] backdrop-blur-md border-b border-white/40 ${className}`}
      {...props}
    />
  )
}
