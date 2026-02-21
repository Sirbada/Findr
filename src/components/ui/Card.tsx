'use client'

import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass'
}

export function Card({ className = '', variant = 'default', ...props }: CardProps) {
  const base = 'rounded-3xl border border-white/40'
  const variants = {
    default: 'bg-[color:var(--card)] shadow-[var(--shadow-soft)]',
    glass: 'bg-[color:var(--glass)] backdrop-blur-md shadow-[var(--shadow-soft)]',
  }

  return <div className={`${base} ${variants[variant]} ${className}`} {...props} />
}
