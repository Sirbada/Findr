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
          <label className="block text-[12px] font-semibold text-[#4B5563] uppercase tracking-[0.06em] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 bg-[#F4F4F1] border border-[#E5E7EB] text-[#111827] text-sm placeholder:text-[#9CA3AF] rounded-lg transition-all duration-150 focus:bg-white focus:border-[#E8630A] focus:outline-none focus:ring-3 focus:ring-[#E8630A]/10 ${error ? 'border-[#DC2626] focus:border-[#DC2626] focus:ring-[#DC2626]/10' : ''} ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-[13px] text-[#DC2626]">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
