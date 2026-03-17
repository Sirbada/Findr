'use client'

import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass'
  hoverable?: boolean
}

export function Card({ className = '', variant = 'default', hoverable = false, ...props }: CardProps) {
  const base = 'rounded-xl border border-[#E5E7EB] overflow-hidden'
  const variants = {
    default: 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)]',
    glass: 'bg-white/80 backdrop-blur-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.03)]',
  }
  const hover = hoverable ? 'transition-all duration-200 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_4px_rgba(0,0,0,0.04)] hover:border-[#D1D5DB] hover:-translate-y-0.5 cursor-pointer' : ''

  return <div className={`${base} ${variants[variant]} ${hover} ${className}`} {...props} />
}
