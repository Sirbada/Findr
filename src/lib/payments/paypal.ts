/**
 * PayPal Integration for Findr
 * 
 * Targeted at:
 * - Cameroonians in the diaspora (France, USA, Canada, Germany, UK, Belgium)
 * - International users
 * - Family payments (paying for relatives in Cameroon)
 * 
 * API Documentation: https://developer.paypal.com/docs/api/overview/
 * 
 * Payment Flow:
 * 1. Create order via PayPal API
 * 2. Redirect to PayPal checkout or use PayPal buttons
 * 3. User authorizes payment
 * 4. Capture payment on return
 * 5. Webhook confirms completion
 */

export type PayPalStatus = 
  | 'CREATED'       // Order created
  | 'SAVED'         // Order saved (draft)
  | 'APPROVED'      // Buyer approved
  | 'VOIDED'        // Order voided
  | 'COMPLETED'     // Payment captured
  | 'PAYER_ACTION_REQUIRED' // Buyer needs to take action

export interface PayPalConfig {
  clientId: string
  clientSecret: string
  environment: 'sandbox' | 'production'
  returnUrl: string
  cancelUrl: string
  webhookId?: string
}

export interface PayPalPaymentRequest {
  amount: number          // Amount in XAF
  currency?: string       // Default: XAF, can also be EUR, USD
  orderId: string
  description: string
  payerEmail?: string
  recipientName?: string  // For family payments
  recipientPhone?: string // Phone in Cameroon
}

export interface PayPalPaymentResponse {
  success: boolean
  orderId?: string
  status?: PayPalStatus
  approvalUrl?: string    // URL to redirect user for approval
  captureUrl?: string
  error?: string
}

export interface PayPalCaptureResponse {
  success: boolean
  transactionId?: string
  status?: PayPalStatus
  amount?: {
    value: string
    currency: string
  }
  error?: string
}

// Currency conversion rates (approximate, should be fetched from API in production)
const XAF_EXCHANGE_RATES: Record<string, number> = {
  EUR: 655.957,  // Fixed rate (CFA Franc pegged to Euro)
  USD: 600,      // Approximate
  GBP: 780,      // Approximate
  CAD: 450,      // Approximate
}

/**
 * Convert XAF to supported PayPal currency
 */
export function convertFromXAF(amountXAF: number, targetCurrency: string): number {
  const rate = XAF_EXCHANGE_RATES[targetCurrency]
  if (!rate) return amountXAF
  return Math.round((amountXAF / rate) * 100) / 100
}

/**
 * Convert to XAF from foreign currency
 */
export function convertToXAF(amount: number, sourceCurrency: string): number {
  const rate = XAF_EXCHANGE_RATES[sourceCurrency]
  if (!rate) return amount
  return Math.round(amount * rate)
}

// Default configuration
const defaultConfig: PayPalConfig = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'demo_client_id',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
  environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
  returnUrl: process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paypal-return`
    : 'http://localhost:3000/api/payments/paypal-return',
  cancelUrl: process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/paypal-cancel`
    : 'http://localhost:3000/api/payments/paypal-cancel',
}

/**
 * Mock PayPal Service for Demo
 */
class MockPayPalService {
  private orders = new Map<string, {
    status: PayPalStatus
    amountXAF: number
    amountEUR: number
    description: string
    createdAt: Date
    recipientName?: string
  }>()

  async createOrder(
    request: PayPalPaymentRequest,
    config: PayPalConfig = defaultConfig
  ): Promise<PayPalPaymentResponse> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800))

    // Generate order ID
    const orderId = `PAYPAL-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    
    // Convert XAF to EUR for PayPal (PayPal doesn't support XAF directly)
    const amountEUR = convertFromXAF(request.amount, 'EUR')

    // Store order
    this.orders.set(orderId, {
      status: 'CREATED',
      amountXAF: request.amount,
      amountEUR,
      description: request.description,
      createdAt: new Date(),
      recipientName: request.recipientName
    })

    console.log(`[DEMO] PayPal order created: ${orderId}`)
    console.log(`[DEMO] Amount: ${request.amount} XAF = ${amountEUR} EUR`)
    if (request.recipientName) {
      console.log(`[DEMO] For: ${request.recipientName} (${request.recipientPhone})`)
    }

    // In demo mode, auto-approve after a delay
    setTimeout(() => {
      const order = this.orders.get(orderId)
      if (order && order.status === 'CREATED') {
        order.status = 'APPROVED'
        this.orders.set(orderId, order)
        console.log(`[DEMO] PayPal order ${orderId} approved`)
      }
    }, 3000)

    return {
      success: true,
      orderId,
      status: 'CREATED',
      approvalUrl: `https://www.sandbox.paypal.com/checkoutnow?token=${orderId}`,
    }
  }

  async captureOrder(orderId: string): Promise<PayPalCaptureResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000))

    const order = this.orders.get(orderId)
    
    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    if (order.status !== 'APPROVED') {
      return {
        success: false,
        error: 'Order not approved yet',
        status: order.status
      }
    }

    // Mark as completed
    order.status = 'COMPLETED'
    this.orders.set(orderId, order)

    return {
      success: true,
      transactionId: `TXN-${orderId}`,
      status: 'COMPLETED',
      amount: {
        value: order.amountEUR.toString(),
        currency: 'EUR'
      }
    }
  }

  async getOrderStatus(orderId: string): Promise<PayPalPaymentResponse> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const order = this.orders.get(orderId)
    
    if (!order) {
      return {
        success: false,
        error: 'Order not found'
      }
    }

    return {
      success: order.status === 'COMPLETED',
      orderId,
      status: order.status
    }
  }

  async cancelOrder(orderId: string): Promise<PayPalPaymentResponse> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const order = this.orders.get(orderId)
    
    if (order && order.status === 'CREATED') {
      order.status = 'VOIDED'
      this.orders.set(orderId, order)
    }

    return {
      success: true,
      orderId,
      status: 'VOIDED'
    }
  }
}

// Export singleton instance
export const paypalService = new MockPayPalService()

/**
 * Production PayPal Integration
 * Uses PayPal REST API v2
 * Uncomment when ready for production
 */
/*
async function getAccessToken(config: PayPalConfig): Promise<string> {
  const baseUrl = config.environment === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
  
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })
  
  const { access_token } = await response.json()
  return access_token
}

export async function createPayPalOrder(
  request: PayPalPaymentRequest,
  config: PayPalConfig = defaultConfig
): Promise<PayPalPaymentResponse> {
  const baseUrl = config.environment === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
  
  const accessToken = await getAccessToken(config)
  
  // Convert XAF to EUR (PayPal doesn't support XAF)
  const amountEUR = convertFromXAF(request.amount, 'EUR')
  
  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': request.orderId, // Idempotency key
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: request.orderId,
        description: request.description,
        custom_id: request.recipientPhone, // Store recipient phone
        amount: {
          currency_code: 'EUR',
          value: amountEUR.toFixed(2)
        }
      }],
      application_context: {
        brand_name: 'Findr Cameroun',
        locale: 'fr-FR',
        landing_page: 'LOGIN',
        user_action: 'PAY_NOW',
        return_url: config.returnUrl,
        cancel_url: config.cancelUrl
      }
    })
  })
  
  const result = await response.json()
  
  if (!response.ok) {
    return {
      success: false,
      error: result.message || 'Order creation failed'
    }
  }
  
  const approvalLink = result.links?.find((l: any) => l.rel === 'approve')
  
  return {
    success: true,
    orderId: result.id,
    status: result.status,
    approvalUrl: approvalLink?.href
  }
}

export async function capturePayPalOrder(
  orderId: string,
  config: PayPalConfig = defaultConfig
): Promise<PayPalCaptureResponse> {
  const baseUrl = config.environment === 'production'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
  
  const accessToken = await getAccessToken(config)
  
  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  
  const result = await response.json()
  
  if (!response.ok) {
    return {
      success: false,
      error: result.message || 'Capture failed'
    }
  }
  
  const capture = result.purchase_units?.[0]?.payments?.captures?.[0]
  
  return {
    success: result.status === 'COMPLETED',
    transactionId: capture?.id,
    status: result.status,
    amount: capture?.amount
  }
}
*/

/**
 * Translations for PayPal UI
 */
export const paypalTranslations = {
  fr: {
    buttonLabel: 'Payer avec PayPal',
    processing: 'Connexion à PayPal...',
    redirecting: 'Redirection vers PayPal...',
    waitingApproval: 'En attente de validation PayPal',
    success: 'Paiement PayPal réussi!',
    failed: 'Paiement PayPal échoué',
    cancelled: 'Paiement annulé',
    forFamily: 'Paiement pour un proche au Cameroun',
    recipientName: 'Nom du bénéficiaire',
    recipientPhone: 'Téléphone au Cameroun',
    amountEUR: 'Montant en EUR',
    amountXAF: 'Équivalent en XAF',
    diaspora: 'Idéal pour la diaspora',
    international: 'Paiement international',
    securePayment: 'Paiement sécurisé par PayPal',
    noPayPalAccount: 'Vous pouvez aussi payer par carte bancaire',
    conversionNote: 'Conversion automatique XAF ↔ EUR',
  },
  en: {
    buttonLabel: 'Pay with PayPal',
    processing: 'Connecting to PayPal...',
    redirecting: 'Redirecting to PayPal...',
    waitingApproval: 'Waiting for PayPal approval',
    success: 'PayPal payment successful!',
    failed: 'PayPal payment failed',
    cancelled: 'Payment cancelled',
    forFamily: 'Pay for family in Cameroon',
    recipientName: 'Recipient name',
    recipientPhone: 'Phone in Cameroon',
    amountEUR: 'Amount in EUR',
    amountXAF: 'Equivalent in XAF',
    diaspora: 'Ideal for diaspora',
    international: 'International payment',
    securePayment: 'Secured by PayPal',
    noPayPalAccount: 'You can also pay with credit card',
    conversionNote: 'Automatic XAF ↔ EUR conversion',
  }
}

/**
 * Supported countries for diaspora targeting
 */
export const diasporaCountries = [
  { code: 'FR', name: 'France', currency: 'EUR', flag: '🇫🇷' },
  { code: 'US', name: 'États-Unis', currency: 'USD', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { code: 'DE', name: 'Allemagne', currency: 'EUR', flag: '🇩🇪' },
  { code: 'GB', name: 'Royaume-Uni', currency: 'GBP', flag: '🇬🇧' },
  { code: 'BE', name: 'Belgique', currency: 'EUR', flag: '🇧🇪' },
  { code: 'CH', name: 'Suisse', currency: 'EUR', flag: '🇨🇭' },
  { code: 'IT', name: 'Italie', currency: 'EUR', flag: '🇮🇹' },
]
