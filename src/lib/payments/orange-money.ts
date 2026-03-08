/**
 * Orange Money Integration for Cameroon
 * 
 * Orange Money is the dominant mobile money service in Cameroon
 * Also supports Orange Prepaid Mastercard for online payments
 * 
 * API Documentation: https://developer.orange.com/apis/om-webpay
 * 
 * Payment Flow:
 * 1. Merchant initiates payment request
 * 2. Customer receives USSD prompt on phone
 * 3. Customer enters PIN to authorize
 * 4. Orange sends callback to webhook
 * 5. Merchant confirms payment
 */

export type OrangeMoneyStatus = 
  | 'INITIATED'      // Payment request created
  | 'PENDING'        // Waiting for customer authorization
  | 'PROCESSING'     // Customer authorized, processing
  | 'SUCCESSFUL'     // Payment completed
  | 'FAILED'         // Payment failed
  | 'EXPIRED'        // Customer didn't respond in time
  | 'CANCELLED'      // Customer cancelled

export interface OrangeMoneyConfig {
  merchantId: string
  apiKey: string
  apiSecret: string
  environment: 'sandbox' | 'production'
  callbackUrl: string
}

export interface OrangeMoneyPaymentRequest {
  amount: number
  phone: string
  orderId: string
  description: string
  metadata?: Record<string, string>
}

export interface OrangeMoneyPaymentResponse {
  success: boolean
  transactionId?: string
  status?: OrangeMoneyStatus
  message?: string
  error?: string
  payToken?: string
  notifToken?: string
}

export interface OrangeMoneyCallbackPayload {
  status: OrangeMoneyStatus
  transactionId: string
  orderId: string
  amount: number
  phone: string
  timestamp: string
  signature: string
}

// Default configuration (use environment variables in production)
const defaultConfig: OrangeMoneyConfig = {
  merchantId: process.env.NEXT_PUBLIC_OM_MERCHANT_ID || 'FINDR_CM_001',
  apiKey: process.env.OM_API_KEY || '',
  apiSecret: process.env.OM_API_SECRET || '',
  environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
  callbackUrl: process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/om-callback`
    : 'http://localhost:3000/api/payments/om-callback'
}

/**
 * Mock Orange Money Service for Demo
 * Simulates the real payment flow
 */
class MockOrangeMoneyService {
  private transactions = new Map<string, {
    status: OrangeMoneyStatus
    phone: string
    amount: number
    orderId: string
    createdAt: Date
  }>()

  async initiatePayment(
    request: OrangeMoneyPaymentRequest,
    config: OrangeMoneyConfig = defaultConfig
  ): Promise<OrangeMoneyPaymentResponse> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Validate phone number (Orange Money Cameroon: 69x xxx xxx, 65x xxx xxx)
    const phoneClean = request.phone.replace(/[^0-9]/g, '').replace(/^237/, '')
    const isOrangeNumber = /^(69|65|66)\d{7}$/.test(phoneClean)
    
    if (!isOrangeNumber) {
      return {
        success: false,
        error: 'Ce numéro n\'est pas un numéro Orange Money valide',
        status: 'FAILED'
      }
    }

    // Generate transaction ID
    const transactionId = `OM${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`
    
    // Store transaction
    this.transactions.set(transactionId, {
      status: 'PENDING',
      phone: request.phone,
      amount: request.amount,
      orderId: request.orderId,
      createdAt: new Date()
    })

    // In demo mode, auto-complete after delay
    setTimeout(() => {
      const tx = this.transactions.get(transactionId)
      if (tx && tx.status === 'PENDING') {
        tx.status = 'SUCCESSFUL'
        this.transactions.set(transactionId, tx)
      }
    }, 5000)

    return {
      success: true,
      transactionId,
      status: 'PENDING',
      message: 'Veuillez confirmer le paiement sur votre téléphone Orange',
      payToken: `PAY_${transactionId}`,
      notifToken: `NOTIF_${transactionId}`
    }
  }

  async checkStatus(transactionId: string): Promise<OrangeMoneyPaymentResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const tx = this.transactions.get(transactionId)
    
    if (!tx) {
      return {
        success: false,
        error: 'Transaction introuvable',
        status: 'FAILED'
      }
    }

    return {
      success: tx.status === 'SUCCESSFUL',
      transactionId,
      status: tx.status
    }
  }

  async cancelPayment(transactionId: string): Promise<OrangeMoneyPaymentResponse> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const tx = this.transactions.get(transactionId)
    
    if (tx && tx.status === 'PENDING') {
      tx.status = 'CANCELLED'
      this.transactions.set(transactionId, tx)
    }

    return {
      success: true,
      transactionId,
      status: 'CANCELLED'
    }
  }
}

// Export singleton instance
export const orangeMoneyService = new MockOrangeMoneyService()

/**
 * Production Orange Money Integration
 * Uncomment and configure when ready for production
 */
/*
export async function initiateOrangeMoneyPayment(
  request: OrangeMoneyPaymentRequest,
  config: OrangeMoneyConfig = defaultConfig
): Promise<OrangeMoneyPaymentResponse> {
  const baseUrl = config.environment === 'production'
    ? 'https://api.orange.com/orange-money-webpay/cm/v1'
    : 'https://api.orange.com/orange-money-webpay/cm/v1' // Sandbox URL
  
  // Get access token
  const tokenResponse = await fetch(`${baseUrl}/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${config.apiKey}:${config.apiSecret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  })
  
  if (!tokenResponse.ok) {
    throw new Error('Failed to get Orange Money access token')
  }
  
  const { access_token } = await tokenResponse.json()
  
  // Initiate payment
  const paymentResponse = await fetch(`${baseUrl}/webpayment`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      merchant_key: config.merchantId,
      currency: 'OUV', // XAF
      order_id: request.orderId,
      amount: request.amount,
      return_url: config.callbackUrl,
      cancel_url: config.callbackUrl,
      notif_url: config.callbackUrl,
      lang: 'fr',
      reference: request.description,
      customer: {
        msisdn: request.phone.replace(/[^0-9]/g, '')
      }
    })
  })
  
  const result = await paymentResponse.json()
  
  if (!paymentResponse.ok) {
    return {
      success: false,
      error: result.message || 'Payment initiation failed'
    }
  }
  
  return {
    success: true,
    transactionId: result.pay_token,
    status: 'PENDING',
    payToken: result.pay_token,
    notifToken: result.notif_token,
    message: 'Veuillez confirmer le paiement sur votre téléphone'
  }
}
*/

/**
 * Translations for Orange Money UI
 */
export const orangeMoneyTranslations = {
  fr: {
    buttonLabel: 'Payer avec Orange Money',
    processing: 'Traitement en cours...',
    waitingAuth: 'Veuillez confirmer sur votre téléphone',
    success: 'Paiement réussi!',
    failed: 'Paiement échoué',
    expired: 'Le délai a expiré',
    cancelled: 'Paiement annulé',
    checkPhone: 'Vérifiez votre téléphone Orange',
    enterPin: 'Entrez votre code PIN pour valider',
    fees: 'Frais: 1.5%',
    noFees: 'Sans frais',
    invalidNumber: 'Numéro Orange Money invalide',
  },
  en: {
    buttonLabel: 'Pay with Orange Money',
    processing: 'Processing...',
    waitingAuth: 'Please confirm on your phone',
    success: 'Payment successful!',
    failed: 'Payment failed',
    expired: 'Request expired',
    cancelled: 'Payment cancelled',
    checkPhone: 'Check your Orange phone',
    enterPin: 'Enter your PIN to confirm',
    fees: 'Fees: 1.5%',
    noFees: 'No fees',
    invalidNumber: 'Invalid Orange Money number',
  }
}
