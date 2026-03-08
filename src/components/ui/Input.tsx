'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label className="block text-[12px] font-semibold text-[#4A4A45] uppercase tracking-[0.06em] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-[#F4F4F1] border border-[#E8E8E4] text-[#1A1A18] text-sm placeholder:text-[#ADADAA] rounded-lg transition-all duration-150 focus:bg-white focus:border-[#1B5E3B] focus:outline-none focus:ring-3 focus:ring-[#1B5E3B]/10 ${error ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/10' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-[13px] text-[#DC2626]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
