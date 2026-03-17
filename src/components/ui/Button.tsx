'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#E8630A]/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] min-h-[44px]'

    const variants = {
      primary: 'bg-[#E8630A] text-white hover:bg-[#C55208]',
      secondary: 'bg-white text-[#111827] border border-[#E5E7EB] hover:bg-[#F4F4F1] hover:border-[#D1D5DB]',
      outline: 'border border-[#D1D5DB] text-[#E8630A] hover:bg-[#FFF4EC]',
      ghost: 'text-[#4B5563] hover:bg-[#F4F4F1] hover:text-[#111827]',
      accent: 'bg-gradient-to-r from-[#E8960C] to-[#F59E0B] text-white hover:from-[#D48500] hover:to-[#E8960C]',
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-5 py-2.5 text-sm',
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
