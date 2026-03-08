'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]'

    const variants = {
      primary: 'bg-green-600 text-white hover:bg-green-700 shadow-[0_4px_14px_rgba(22,163,74,0.35)] hover:shadow-[0_6px_20px_rgba(22,163,74,0.45)]',
      secondary: 'bg-white text-green-600 border-[1.5px] border-green-600 hover:bg-green-50',
      outline: 'border border-green-400 text-green-700 hover:bg-green-50',
      ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-5 py-2.5 text-[15px]',
      lg: 'px-6 py-3 text-base',
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
