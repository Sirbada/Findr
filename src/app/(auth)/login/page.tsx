'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Phone, Mail, ArrowRight, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PhoneInput, OTPInput } from '@/components/ui/PhoneInput'
import { 
  sendPhoneOTP, 
  verifyPhoneOTP, 
  phoneAuthTranslations,
  getInternationalPhone 
} from '@/lib/auth/phone-auth'
import { useTranslation } from '@/lib/i18n/context'

type AuthStep = 'method' | 'phone' | 'otp' | 'email' | 'success'

export default function LoginPage() {
  const router = useRouter()
  const { lang } = useTranslation()
  const t = phoneAuthTranslations[lang]
  
  const [step, setStep] = useState<AuthStep>('method')
  const [method, setMethod] = useState<'phone' | 'email'>('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  // Cooldown timer for OTP resend
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(c => c - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

  // Handle phone submission
  const handlePhoneSubmit = async (phoneNumber: string) => {
    setLoading(true)
    setError(null)
    setPhone(phoneNumber)
    
    try {
      const result = await sendPhoneOTP(phoneNumber)
      
      if (result.success) {
        setStep('otp')
        setCooldown(60) // 60 seconds cooldown
      } else {
        setError(t.errors[result.error as keyof typeof t.errors] || result.error || t.errors.network)
      }
    } catch (err) {
      setError(t.errors.network)
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP verification
  const handleOTPSubmit = async (otp: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await verifyPhoneOTP(phone, otp)
      
      if (result.success) {
        setStep('success')
        
        // Store auth state (demo)
        if (typeof window !== 'undefined') {
          localStorage.setItem('findr_user', JSON.stringify({
            phone: getInternationalPhone(phone),
            userId: result.userId,
            isNewUser: result.isNewUser,
            createdAt: new Date().toISOString()
          }))
        }
        
        // Redirect after success animation
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setError(t.errors[result.error as keyof typeof t.errors] || result.error || t.errors['otp.invalid'])
      }
    } catch (err) {
      setError(t.errors.network)
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP resend
  const handleResend = async () => {
    if (cooldown > 0) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await sendPhoneOTP(phone)
      
      if (result.success) {
        setCooldown(60)
      } else {
        setError(t.errors[result.error as keyof typeof t.errors] || result.error || t.errors.network)
      }
    } catch (err) {
      setError(t.errors.network)
    } finally {
      setLoading(false)
    }
  }

  // Handle email login
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // TODO: Implement actual email login with Supabase
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Demo: Just redirect
    localStorage.setItem('findr_user', JSON.stringify({
      email,
      userId: `user_${Date.now()}`,
      createdAt: new Date().toISOString()
    }))
    
    router.push('/dashboard')
    setLoading(false)
  }

  // Success screen
  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {lang === 'fr' ? 'Connexion réussie!' : 'Login successful!'}
            </h1>
            <p className="text-gray-500">
              {lang === 'fr' ? 'Redirection en cours...' : 'Redirecting...'}
            </p>
            <div className="mt-4">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">F</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">Findr</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">
            {t.title}
          </h1>
          <p className="mt-2 text-gray-600">
            {step === 'otp' ? t.otpTitle : t.subtitle}
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          {/* Method Selection (only on first step) */}
          {step === 'method' && (
            <>
              {/* Method Toggle */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
                <button
                  onClick={() => setMethod('phone')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    method === 'phone' 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Phone className="w-4 h-4" />
                  {lang === 'fr' ? 'Téléphone' : 'Phone'}
                </button>
                <button
                  onClick={() => setMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    method === 'email' 
                      ? 'bg-white text-emerald-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
              </div>

              {method === 'phone' ? (
                <PhoneInput
                  onSubmit={handlePhoneSubmit}
                  loading={loading}
                  error={error}
                />
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang === 'fr' ? 'Adresse email' : 'Email address'}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vous@exemple.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {lang === 'fr' ? 'Mot de passe' : 'Password'}
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        {lang === 'fr' ? 'Se connecter' : 'Login'}
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </>
          )}

          {/* OTP Step */}
          {step === 'otp' && (
            <OTPInput
              phone={phone}
              onSubmit={handleOTPSubmit}
              onResend={handleResend}
              onChangeNumber={() => {
                setStep('method')
                setError(null)
              }}
              loading={loading}
              error={error}
              cooldown={cooldown}
            />
          )}

          {/* Sign up link */}
          {step !== 'otp' && (
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">
                {lang === 'fr' ? 'Pas encore de compte ?' : "Don't have an account?"}
              </span>{' '}
              <Link href="/signup" className="text-emerald-600 font-medium hover:underline">
                {lang === 'fr' ? "S'inscrire" : 'Sign up'}
              </Link>
            </div>
          )}
        </div>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-emerald-600">
            ← {lang === 'fr' ? "Retour à l'accueil" : 'Back to home'}
          </Link>
        </div>
      </div>
    </div>
  )
}
