/**
 * Phone/OTP Authentication System for Findr
 * 
 * Cameroon-specific implementation with +237 country code
 * Supports SMS OTP verification via Supabase Phone Auth
 * 
 * Flow:
 * 1. User enters phone number (format: 6XX XXX XXX)
 * 2. System sends 6-digit OTP via SMS
 * 3. User enters OTP
 * 4. System verifies and creates/logs in user
 */

export type PhoneAuthStep = 'phone' | 'otp' | 'success' | 'error'

export interface PhoneAuthState {
  step: PhoneAuthStep
  phone: string
  countryCode: string
  otp: string
  error: string | null
  loading: boolean
  resendCooldown: number
}

export interface OTPVerificationResult {
  success: boolean
  error?: string
  userId?: string
  isNewUser?: boolean
}

// Cameroon phone number regex (mobile)
// Format: 6XX XXX XXX (Orange, MTN, Nexttel)
const CAMEROON_PHONE_REGEX = /^6[0-9]{8}$/

/**
 * Validate Cameroon phone number
 */
export function validateCameroonPhone(phone: string): { valid: boolean; error?: string } {
  // Remove spaces and leading zeros
  const cleaned = phone.replace(/\s/g, '').replace(/^0+/, '')
  
  if (cleaned.length === 0) {
    return { valid: false, error: 'phone.required' }
  }
  
  if (cleaned.length !== 9) {
    return { valid: false, error: 'phone.invalidLength' }
  }
  
  if (!CAMEROON_PHONE_REGEX.test(cleaned)) {
    return { valid: false, error: 'phone.invalidFormat' }
  }
  
  // Check operator prefix
  const prefix = cleaned.substring(0, 2)
  const validPrefixes = ['65', '66', '67', '68', '69', '62', '64', '67', '68'] // Orange, MTN, Nexttel
  
  if (!validPrefixes.some(p => cleaned.startsWith(p))) {
    return { valid: false, error: 'phone.invalidOperator' }
  }
  
  return { valid: true }
}

/**
 * Format phone for display
 */
export function formatCameroonPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '').replace(/^0+/, '')
  if (cleaned.length !== 9) return phone
  
  return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`
}

/**
 * Get full international phone number
 */
export function getInternationalPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, '').replace(/^0+/, '')
  return `+237${cleaned}`
}

/**
 * Validate OTP format
 */
export function validateOTP(otp: string): { valid: boolean; error?: string } {
  const cleaned = otp.replace(/\s/g, '')
  
  if (cleaned.length === 0) {
    return { valid: false, error: 'otp.required' }
  }
  
  if (cleaned.length !== 6) {
    return { valid: false, error: 'otp.invalidLength' }
  }
  
  if (!/^\d{6}$/.test(cleaned)) {
    return { valid: false, error: 'otp.invalidFormat' }
  }
  
  return { valid: true }
}

/**
 * Mock SMS Service for Demo
 * In production, this would use:
 * - Supabase Phone Auth (built-in)
 * - Or external providers like Twilio, Africa's Talking, etc.
 */
class MockSMSService {
  private otpStore: Map<string, { otp: string; expires: number }> = new Map()
  
  async sendOTP(phone: string): Promise<{ success: boolean; error?: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP with 5-minute expiry
    this.otpStore.set(phone, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    })
    
    // Log for demo purposes (remove in production!)
    console.log(`[DEMO] SMS to ${phone}: Your Findr verification code is ${otp}`)
    
    // In demo mode, we'll show the OTP in an alert for testing
    if (typeof window !== 'undefined') {
      // Store in sessionStorage for demo
      sessionStorage.setItem(`findr_demo_otp_${phone}`, otp)
    }
    
    return { success: true }
  }
  
  async verifyOTP(phone: string, otp: string): Promise<OTPVerificationResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const stored = this.otpStore.get(phone)
    
    // Check demo OTP in sessionStorage
    if (typeof window !== 'undefined') {
      const demoOTP = sessionStorage.getItem(`findr_demo_otp_${phone}`)
      if (demoOTP === otp) {
        sessionStorage.removeItem(`findr_demo_otp_${phone}`)
        return { 
          success: true, 
          userId: `user_${Date.now()}`,
          isNewUser: true 
        }
      }
    }
    
    if (!stored) {
      return { success: false, error: 'otp.expired' }
    }
    
    if (Date.now() > stored.expires) {
      this.otpStore.delete(phone)
      return { success: false, error: 'otp.expired' }
    }
    
    if (stored.otp !== otp) {
      return { success: false, error: 'otp.invalid' }
    }
    
    // Clear OTP after successful verification
    this.otpStore.delete(phone)
    
    return { 
      success: true, 
      userId: `user_${Date.now()}`,
      isNewUser: Math.random() > 0.5 // Random for demo
    }
  }
}

export const mockSMSService = new MockSMSService()

/**
 * Supabase Phone Auth Integration
 * 
 * To enable:
 * 1. Go to Supabase Dashboard > Authentication > Providers
 * 2. Enable "Phone" provider
 * 3. Configure SMS provider (Twilio, MessageBird, etc.)
 * 4. Set up webhook for custom SMS provider if needed
 */
export async function sendPhoneOTP(phone: string): Promise<{ success: boolean; error?: string }> {
  const international = getInternationalPhone(phone)
  
  // For demo, use mock service
  // In production, uncomment below:
  /*
  import { createClient } from '@/lib/supabase/client'
  const supabase = createClient()
  
  const { error } = await supabase.auth.signInWithOtp({
    phone: international,
  })
  
  if (error) {
    console.error('Supabase OTP error:', error)
    return { success: false, error: error.message }
  }
  
  return { success: true }
  */
  
  return mockSMSService.sendOTP(international)
}

export async function verifyPhoneOTP(phone: string, otp: string): Promise<OTPVerificationResult> {
  const international = getInternationalPhone(phone)
  
  // For demo, use mock service
  // In production, uncomment below:
  /*
  import { createClient } from '@/lib/supabase/client'
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.verifyOtp({
    phone: international,
    token: otp,
    type: 'sms'
  })
  
  if (error) {
    console.error('Supabase verify OTP error:', error)
    return { success: false, error: error.message }
  }
  
  return { 
    success: true, 
    userId: data.user?.id,
    isNewUser: !data.user?.last_sign_in_at
  }
  */
  
  return mockSMSService.verifyOTP(international, otp)
}

/**
 * Phone Auth Translations
 */
export const phoneAuthTranslations = {
  fr: {
    title: 'Connexion',
    subtitle: 'Entrez votre numéro de téléphone',
    phoneLabel: 'Numéro de téléphone',
    phonePlaceholder: '699 00 00 00',
    sendCode: 'Recevoir le code',
    otpTitle: 'Code de vérification',
    otpSubtitle: 'Entrez le code envoyé au',
    otpPlaceholder: '000000',
    verifyCode: 'Vérifier',
    resendCode: 'Renvoyer le code',
    resendIn: 'Renvoyer dans',
    seconds: 's',
    changeNumber: 'Changer de numéro',
    errors: {
      'phone.required': 'Le numéro de téléphone est requis',
      'phone.invalidLength': 'Le numéro doit contenir 9 chiffres',
      'phone.invalidFormat': 'Format de numéro invalide',
      'phone.invalidOperator': 'Opérateur non reconnu (Orange, MTN, Nexttel)',
      'otp.required': 'Le code est requis',
      'otp.invalidLength': 'Le code doit contenir 6 chiffres',
      'otp.invalidFormat': 'Le code doit contenir uniquement des chiffres',
      'otp.expired': 'Le code a expiré. Demandez un nouveau code.',
      'otp.invalid': 'Code incorrect. Veuillez réessayer.',
      'network': 'Erreur réseau. Veuillez réessayer.',
    },
    demo: {
      notice: '🧪 Mode démo',
      checkConsole: 'Le code SMS apparaît dans la console (F12)',
    }
  },
  en: {
    title: 'Login',
    subtitle: 'Enter your phone number',
    phoneLabel: 'Phone number',
    phonePlaceholder: '699 00 00 00',
    sendCode: 'Get code',
    otpTitle: 'Verification code',
    otpSubtitle: 'Enter the code sent to',
    otpPlaceholder: '000000',
    verifyCode: 'Verify',
    resendCode: 'Resend code',
    resendIn: 'Resend in',
    seconds: 's',
    changeNumber: 'Change number',
    errors: {
      'phone.required': 'Phone number is required',
      'phone.invalidLength': 'Number must be 9 digits',
      'phone.invalidFormat': 'Invalid number format',
      'phone.invalidOperator': 'Unrecognized operator (Orange, MTN, Nexttel)',
      'otp.required': 'Code is required',
      'otp.invalidLength': 'Code must be 6 digits',
      'otp.invalidFormat': 'Code must contain only digits',
      'otp.expired': 'Code expired. Request a new one.',
      'otp.invalid': 'Invalid code. Please try again.',
      'network': 'Network error. Please try again.',
    },
    demo: {
      notice: '🧪 Demo mode',
      checkConsole: 'SMS code appears in console (F12)',
    }
  }
}
