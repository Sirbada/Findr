/**
 * Security & Validation Utilities for Findr
 * 
 * Best Practices Implemented:
 * 1. Input Sanitization (XSS Prevention)
 * 2. Input Validation
 * 3. Rate Limiting Helpers
 * 4. CSRF Protection Helpers
 * 5. Secure Data Handling
 */

// ==========================================
// INPUT SANITIZATION (XSS Prevention)
// ==========================================

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes all HTML tags and dangerous characters
 */
export function sanitizeHtml(input: string): string {
  if (!input) return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/`/g, '&#96;')
}

/**
 * Sanitize user input for database storage
 * Removes potentially dangerous characters
 */
export function sanitizeInput(input: string): string {
  if (!input) return ''
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  if (!filename) return ''
  return filename
    .replace(/\.\./g, '') // Remove path traversal
    .replace(/[\/\\:*?"<>|]/g, '') // Remove invalid chars
    .trim()
}

// ==========================================
// INPUT VALIDATION
// ==========================================

/**
 * Validate Cameroon phone number
 * Format: 6XXXXXXXX (9 digits starting with 6)
 */
export function validateCameroonPhone(phone: string): {
  isValid: boolean
  error?: string
  formatted?: string
} {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Check length
  if (cleaned.length !== 9) {
    return { isValid: false, error: 'Le numéro doit contenir 9 chiffres' }
  }
  
  // Check starts with 6 (mobile) or 2 (landline)
  if (!cleaned.startsWith('6') && !cleaned.startsWith('2')) {
    return { isValid: false, error: 'Numéro invalide pour le Cameroun' }
  }
  
  return { 
    isValid: true, 
    formatted: `+237 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7)}`
  }
}

/**
 * Validate email address
 */
export function validateEmail(email: string): {
  isValid: boolean
  error?: string
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  if (!email) {
    return { isValid: false, error: 'L\'email est requis' }
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Format d\'email invalide' }
  }
  
  return { isValid: true }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
  isValid: boolean
  strength: 'weak' | 'medium' | 'strong'
  errors: string[]
} {
  const errors: string[] = []
  let score = 0
  
  if (password.length < 8) {
    errors.push('Minimum 8 caractères')
  } else {
    score++
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Au moins une minuscule')
  } else {
    score++
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Au moins une majuscule')
  } else {
    score++
  }
  
  if (!/\d/.test(password)) {
    errors.push('Au moins un chiffre')
  } else {
    score++
  }
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak'
  if (score >= 4) strength = 'strong'
  else if (score >= 2) strength = 'medium'
  
  return {
    isValid: errors.length === 0,
    strength,
    errors,
  }
}

/**
 * Validate price input
 */
export function validatePrice(price: string | number): {
  isValid: boolean
  error?: string
  value?: number
} {
  const numPrice = typeof price === 'string' ? parseInt(price, 10) : price
  
  if (isNaN(numPrice)) {
    return { isValid: false, error: 'Prix invalide' }
  }
  
  if (numPrice < 0) {
    return { isValid: false, error: 'Le prix ne peut pas être négatif' }
  }
  
  if (numPrice > 1000000000) { // 1 billion XAF
    return { isValid: false, error: 'Prix trop élevé' }
  }
  
  return { isValid: true, value: numPrice }
}

/**
 * Validate listing title
 */
export function validateTitle(title: string): {
  isValid: boolean
  error?: string
} {
  const cleaned = sanitizeInput(title)
  
  if (cleaned.length < 10) {
    return { isValid: false, error: 'Le titre doit contenir au moins 10 caractères' }
  }
  
  if (cleaned.length > 100) {
    return { isValid: false, error: 'Le titre ne peut pas dépasser 100 caractères' }
  }
  
  return { isValid: true }
}

// ==========================================
// RATE LIMITING HELPERS
// ==========================================

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Simple rate limiter
 * @param key Unique identifier (e.g., IP + action)
 * @param maxRequests Maximum requests allowed
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): { allowed: boolean; remainingRequests: number; resetIn: number } {
  const now = Date.now()
  const entry = rateLimitStore.get(key)
  
  if (!entry || now > entry.resetTime) {
    // New window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return { allowed: true, remainingRequests: maxRequests - 1, resetIn: windowMs }
  }
  
  if (entry.count >= maxRequests) {
    return { 
      allowed: false, 
      remainingRequests: 0, 
      resetIn: entry.resetTime - now 
    }
  }
  
  entry.count++
  return { 
    allowed: true, 
    remainingRequests: maxRequests - entry.count, 
    resetIn: entry.resetTime - now 
  }
}

// ==========================================
// CSRF PROTECTION HELPERS
// ==========================================

/**
 * Generate a CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  if (typeof window !== 'undefined') {
    window.crypto.getRandomValues(array)
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// ==========================================
// SECURE DATA HANDLING
// ==========================================

/**
 * Mask phone number for display
 * e.g., 699000000 -> 699•••000
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return phone
  return `${phone.slice(0, 3)}•••${phone.slice(-3)}`
}

/**
 * Mask email for display
 * e.g., user@example.com -> u***@example.com
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  return `${local.charAt(0)}***@${domain}`
}

/**
 * Check if URL is safe (no javascript:, data:, etc.)
 */
export function isSafeUrl(url: string): boolean {
  if (!url) return false
  
  const lowerUrl = url.toLowerCase().trim()
  
  // Block dangerous protocols
  const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:']
  for (const protocol of dangerousProtocols) {
    if (lowerUrl.startsWith(protocol)) return false
  }
  
  // Allow relative URLs and http(s)
  if (lowerUrl.startsWith('/') || 
      lowerUrl.startsWith('http://') || 
      lowerUrl.startsWith('https://')) {
    return true
  }
  
  return false
}

/**
 * Validate and sanitize image URL
 */
export function validateImageUrl(url: string): {
  isValid: boolean
  error?: string
  sanitized?: string
} {
  if (!url) {
    return { isValid: false, error: 'URL requise' }
  }
  
  if (!isSafeUrl(url)) {
    return { isValid: false, error: 'URL non sécurisée' }
  }
  
  // Check for common image extensions or image hosting services
  const imagePatterns = [
    /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i,
    /images\.unsplash\.com/i,
    /cloudinary\.com/i,
    /supabase\.co\/storage/i,
  ]
  
  const isImage = imagePatterns.some(pattern => pattern.test(url))
  if (!isImage) {
    return { isValid: false, error: 'L\'URL ne semble pas être une image' }
  }
  
  return { isValid: true, sanitized: url }
}
