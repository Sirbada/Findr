'use client'

import { InputHTMLAttributes } from 'react'

interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function DatePicker({ label, className = '', ...props }: DatePickerProps) {
  return (
    <label className="block">
      {label ? <div className="mb-2 text-sm font-medium text-[color:var(--green-900)]">{label}</div> : null}
      <input
        type="date"
        className={`w-full rounded-2xl border border-[color:var(--green-100)] bg-white/80 px-4 py-3 text-sm text-[color:var(--green-900)] focus:outline-none focus:ring-2 focus:ring-[color:var(--green-300)] ${className}`}
        {...props}
      />
    </label>
  )
}
