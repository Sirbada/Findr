'use client'

import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass'
}

export function Card({ className = '', variant = 'default', ...props }: CardProps) {
  const base = 'rounded-2xl border border-[rgba(0,0,0,0.06)]'
  const variants = {
    default: 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.04)]',
    glass: 'bg-white/72 backdrop-blur-[20px] border-white/50 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_8px_24px_rgba(0,0,0,0.04)]',
  }

  return <div className={`${base} ${variants[variant]} ${className}`} {...props} />
}
