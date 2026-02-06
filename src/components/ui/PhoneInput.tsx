'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Phone, ArrowRight, Loader2, Edit2, AlertCircle } from 'lucide-react'
import { Button } from './Button'
import { 
  validateCameroonPhone, 
  validateOTP, 
  formatCameroonPhone,
  phoneAuthTranslations 
} from '@/lib/auth/phone-auth'
import { useTranslation } from '@/lib/i18n/context'

interface PhoneInputProps {
  onSubmit: (phone: string) => Promise<void>
  loading?: boolean
  error?: string | null
}

export function PhoneInput({ onSubmit, loading = false, error }: PhoneInputProps) {
  const { lang } = useTranslation()
  const t = phoneAuthTranslations[lang]
  const [phone, setPhone] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    
    const validation = validateCameroonPhone(phone)
    if (!validation.valid) {
      setLocalError(t.errors[validation.error as keyof typeof t.errors] || validation.error || 'Invalid phone')
      return
    }
    
    await onSubmit(phone)
  }

  const displayError = error || localError

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.phoneLabel}
        </label>
        <div className="flex">
          {/* Country Code */}
          <div className="flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl">
            <span className="text-lg mr-2">🇨🇲</span>
            <span className="text-gray-700 font-medium">+237</span>
          </div>
          
          {/* Phone Input */}
          <div className="relative flex-1">
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 9)
                setPhone(value)
                setLocalError(null)
              }}
              placeholder={t.phonePlaceholder}
              className={`w-full px-4 py-3.5 border rounded-r-xl text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                displayError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              disabled={loading}
              autoComplete="tel"
            />
            {phone.length > 0 && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                {phone.length}/9
              </span>
            )}
          </div>
        </div>
        
        {/* Error */}
        {displayError && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {displayError}
          </p>
        )}
        
        {/* Demo Notice */}
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>{t.demo.notice}:</strong> {t.demo.checkConsole}
          </p>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        size="lg" 
        disabled={loading || phone.length < 9}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            {t.sendCode}
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
    </form>
  )
}

interface OTPInputProps {
  phone: string
  onSubmit: (otp: string) => Promise<void>
  onResend: () => Promise<void>
  onChangeNumber: () => void
  loading?: boolean
  error?: string | null
  cooldown?: number
}

export function OTPInput({ 
  phone, 
  onSubmit, 
  onResend, 
  onChangeNumber,
  loading = false, 
  error,
  cooldown = 0
}: OTPInputProps) {
  const { lang } = useTranslation()
  const t = phoneAuthTranslations[lang]
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])
  
  // Auto-submit when all digits entered
  useEffect(() => {
    const code = otp.join('')
    if (code.length === 6 && !loading) {
      handleSubmit()
    }
  }, [otp])

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/[^0-9]/g, '').slice(-1)
    
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    setLocalError(null)
    
    // Move to next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6)
    
    if (pastedData) {
      const newOtp = [...otp]
      pastedData.split('').forEach((char, idx) => {
        if (idx < 6) newOtp[idx] = char
      })
      setOtp(newOtp)
      
      // Focus appropriate input
      const nextEmpty = newOtp.findIndex(d => !d)
      if (nextEmpty === -1) {
        inputRefs.current[5]?.focus()
      } else {
        inputRefs.current[nextEmpty]?.focus()
      }
    }
  }

  const handleSubmit = async () => {
    const code = otp.join('')
    
    const validation = validateOTP(code)
    if (!validation.valid) {
      setLocalError(t.errors[validation.error as keyof typeof t.errors] || validation.error || 'Invalid OTP')
      return
    }
    
    await onSubmit(code)
  }

  const displayError = error || localError

  return (
    <div className="space-y-6">
      {/* Phone display */}
      <div className="text-center">
        <p className="text-gray-600 mb-1">{t.otpSubtitle}</p>
        <div className="flex items-center justify-center gap-2">
          <span className="text-lg font-semibold text-gray-900">
            +237 {formatCameroonPhone(phone)}
          </span>
          <button
            type="button"
            onClick={onChangeNumber}
            className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* OTP Inputs */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={el => { inputRefs.current[index] = el }}
            type="text"
            inputMode="numeric"
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            maxLength={1}
            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors ${
              displayError 
                ? 'border-red-300 bg-red-50' 
                : digit 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-300'
            }`}
            disabled={loading}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      
      {/* Error */}
      {displayError && (
        <p className="text-center text-sm text-red-600 flex items-center justify-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {displayError}
        </p>
      )}
      
      {/* Verify Button */}
      <Button 
        type="button"
        onClick={handleSubmit}
        className="w-full" 
        size="lg" 
        disabled={loading || otp.join('').length < 6}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          t.verifyCode
        )}
      </Button>
      
      {/* Resend */}
      <div className="text-center">
        {cooldown > 0 ? (
          <p className="text-sm text-gray-500">
            {t.resendIn} <span className="font-mono font-semibold">{cooldown}{t.seconds}</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={onResend}
            disabled={loading}
            className="text-sm text-emerald-600 font-medium hover:underline disabled:opacity-50"
          >
            {t.resendCode}
          </button>
        )}
      </div>
    </div>
  )
}
