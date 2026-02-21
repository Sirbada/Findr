'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[color:var(--green-400)] disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]'
    
    const variants = {
      primary: 'bg-[color:var(--green-600)] text-white hover:bg-[color:var(--green-700)] shadow-[var(--shadow-soft-sm)]',
      secondary: 'bg-[color:var(--green-50)] text-[color:var(--green-900)] hover:bg-[color:var(--green-100)]',
      outline: 'border border-[color:var(--green-400)] text-[color:var(--green-700)] hover:bg-[color:var(--green-50)]',
      ghost: 'text-[color:var(--green-700)] hover:bg-[color:var(--green-50)]',
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-5 py-3 text-lg',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
