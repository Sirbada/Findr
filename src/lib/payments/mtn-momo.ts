/**
 * MTN Mobile Money (MoMo) Integration for Cameroon
 * 
 * MTN MoMo is widely used across Cameroon
 * Uses USSD push for payment authorization
 * 
 * API Documentation: https://momodeveloper.mtn.com/
 * 
 * Payment Flow:
 * 1. Create payment request via API
 * 2. Customer receives USSD prompt
 * 3. Customer authorizes with PIN
 * 4. Callback notification sent
 * 5. Verify and confirm payment
 */

export type MTNMoMoStatus = 
  | 'PENDING'       // Request created, waiting for user
  | 'PROCESSING'    // User authorizing
  | 'SUCCESSFUL'    // Payment completed
  | 'FAILED'        // Payment failed
  | 'REJECTED'      // User rejected
  | 'TIMEOUT'       // User didn't respond
  | 'CANCELLED'     // Request cancelled

export interface MTNMoMoConfig {
  subscriptionKey: string
  apiUserId: string
  apiKey: string
  environment: 'sandbox' | 'production'
  callbackUrl: string
  targetEnvironment: string
}

export interface MTNMoMoPaymentRequest {
  amount: number
  phone: string
  orderId: string
  description: string
  payerMessage?: string
  payeeNote?: string
}

export interface MTNMoMoPaymentResponse {
  success: boolean
  referenceId?: string
  status?: MTNMoMoStatus
  message?: string
  error?: string
  externalId?: string
}

export interface MTNMoMoCallbackPayload {
  referenceId: string
  status: MTNMoMoStatus
  financialTransactionId?: string
  externalId: string
  amount: {
    amount: string
    currency: string
  }
  payer: {
    partyIdType: string
    partyId: string
  }
  payerMessage: string
  payeeNote: string
}

// Default configuration
const defaultConfig: MTNMoMoConfig = {
  subscriptionKey: process.env.MTN_MOMO_SUBSCRIPTION_KEY || '',
  apiUserId: process.env.MTN_MOMO_API_USER_ID || '',
  apiKey: process.env.MTN_MOMO_API_KEY || '',
  environment: (process.env.NODE_ENV === 'production' ? 'production' : 'sandbox') as 'sandbox' | 'production',
  callbackUrl: process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/momo-callback`
    : 'http://localhost:3000/api/payments/momo-callback',
  targetEnvironment: process.env.MTN_TARGET_ENV || 'sandbox'
}

/**
 * Mock MTN MoMo Service for Demo
 */
class MockMTNMoMoService {
  private transactions = new Map<string, {
    status: MTNMoMoStatus
    phone: string
    amount: number
    orderId: string
    createdAt: Date
  }>()

  async initiatePayment(
    request: MTNMoMoPaymentRequest,
    config: MTNMoMoConfig = defaultConfig
  ): Promise<MTNMoMoPaymentResponse> {
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Validate phone number (MTN Cameroon: 67x xxx xxx, 68x xxx xxx, 65x xxx xxx)
    const phoneClean = request.phone.replace(/[^0-9]/g, '').replace(/^237/, '')
    const isMTNNumber = /^(67|68|65|66)\d{7}$/.test(phoneClean)
    
    if (!isMTNNumber) {
      return {
        success: false,
        error: 'Ce numéro n\'est pas un numéro MTN MoMo valide',
        status: 'FAILED'
      }
    }

    // Generate reference ID (UUID format like MTN API)
    const referenceId = `${Date.now().toString(16)}-${Math.random().toString(16).substring(2, 6)}-4${Math.random().toString(16).substring(2, 5)}-${['8', '9', 'a', 'b'][Math.floor(Math.random() * 4)]}${Math.random().toString(16).substring(2, 5)}-${Math.random().toString(16).substring(2, 14)}`
    
    // Store transaction
    this.transactions.set(referenceId, {
      status: 'PENDING',
      phone: request.phone,
      amount: request.amount,
      orderId: request.orderId,
      createdAt: new Date()
    })

    // Auto-complete after delay (demo mode)
    setTimeout(() => {
      const tx = this.transactions.get(referenceId)
      if (tx && tx.status === 'PENDING') {
        tx.status = 'SUCCESSFUL'
        this.transactions.set(referenceId, tx)
      }
    }, 6000)

    return {
      success: true,
      referenceId,
      status: 'PENDING',
      message: 'Veuillez confirmer le paiement sur votre téléphone MTN',
      externalId: request.orderId
    }
  }

  async checkStatus(referenceId: string): Promise<MTNMoMoPaymentResponse> {
    await new Promise(resolve => setTimeout(resolve, 500))

    const tx = this.transactions.get(referenceId)
    
    if (!tx) {
      return {
        success: false,
        error: 'Transaction introuvable',
        status: 'FAILED'
      }
    }

    return {
      success: tx.status === 'SUCCESSFUL',
      referenceId,
      status: tx.status
    }
  }

  async cancelPayment(referenceId: string): Promise<MTNMoMoPaymentResponse> {
    await new Promise(resolve => setTimeout(resolve, 300))

    const tx = this.transactions.get(referenceId)
    
    if (tx && tx.status === 'PENDING') {
      tx.status = 'CANCELLED'
      this.transactions.set(referenceId, tx)
    }

    return {
      success: true,
      referenceId,
      status: 'CANCELLED'
    }
  }

  async getAccountBalance(): Promise<{ balance: number; currency: string }> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return {
      balance: 1500000,
      currency: 'XAF'
    }
  }
}

// Export singleton instance
export const mtnMomoService = new MockMTNMoMoService()

/**
 * Production MTN MoMo Integration
 * Uncomment and configure when ready
 */
/*
export async function initiateMTNMoMoPayment(
  request: MTNMoMoPaymentRequest,
  config: MTNMoMoConfig = defaultConfig
): Promise<MTNMoMoPaymentResponse> {
  const baseUrl = config.environment === 'production'
    ? 'https://proxy.momoapi.mtn.com'
    : 'https://sandbox.momoapi.mtn.com'
  
  // Generate UUID for this request
  const referenceId = crypto.randomUUID()
  
  // Get access token
  const tokenResponse = await fetch(`${baseUrl}/collection/token/`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${config.apiUserId}:${config.apiKey}`).toString('base64')}`,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
    }
  })
  
  if (!tokenResponse.ok) {
    throw new Error('Failed to get MTN MoMo access token')
  }
  
  const { access_token } = await tokenResponse.json()
  
  // Request payment
  const paymentResponse = await fetch(`${baseUrl}/collection/v1_0/requesttopay`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'X-Reference-Id': referenceId,
      'X-Target-Environment': config.targetEnvironment,
      'Ocp-Apim-Subscription-Key': config.subscriptionKey,
      'Content-Type': 'application/json',
      'X-Callback-Url': config.callbackUrl
    },
    body: JSON.stringify({
      amount: request.amount.toString(),
      currency: 'XAF',
      externalId: request.orderId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: request.phone.replace(/[^0-9]/g, '')
      },
      payerMessage: request.payerMessage || request.description,
      payeeNote: request.payeeNote || `Findr order ${request.orderId}`
    })
  })
  
  if (paymentResponse.status !== 202) {
    const error = await paymentResponse.json()
    return {
      success: false,
      error: error.message || 'Payment initiation failed'
    }
  }
  
  return {
    success: true,
    referenceId,
    status: 'PENDING',
    externalId: request.orderId,
    message: 'Veuillez confirmer le paiement sur votre téléphone MTN'
  }
}

export async function checkMTNMoMoStatus(
  referenceId: string,
  config: MTNMoMoConfig = defaultConfig
): Promise<MTNMoMoPaymentResponse> {
  const baseUrl = config.environment === 'production'
    ? 'https://proxy.momoapi.mtn.com'
    : 'https://sandbox.momoapi.mtn.com'
  
  // Get access token (same as above)
  // ... token request code ...
  
  const statusResponse = await fetch(
    `${baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
    {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'X-Target-Environment': config.targetEnvironment,
        'Ocp-Apim-Subscription-Key': config.subscriptionKey,
      }
    }
  )
  
  const result = await statusResponse.json()
  
  return {
    success: result.status === 'SUCCESSFUL',
    referenceId,
    status: result.status
  }
}
*/

/**
 * Translations for MTN MoMo UI
 */
export const mtnMomoTranslations = {
  fr: {
    buttonLabel: 'Payer avec MTN MoMo',
    processing: 'Traitement en cours...',
    waitingAuth: 'Veuillez confirmer sur votre téléphone',
    success: 'Paiement réussi!',
    failed: 'Paiement échoué',
    timeout: 'Le délai a expiré',
    rejected: 'Paiement refusé',
    cancelled: 'Paiement annulé',
    checkPhone: 'Vérifiez votre téléphone MTN',
    enterPin: 'Entrez votre code PIN MoMo',
    fees: 'Frais: 1.5%',
    noFees: 'Sans frais',
    invalidNumber: 'Numéro MTN MoMo invalide',
    yelloMoney: 'MTN Mobile Money',
  },
  en: {
    buttonLabel: 'Pay with MTN MoMo',
    processing: 'Processing...',
    waitingAuth: 'Please confirm on your phone',
    success: 'Payment successful!',
    failed: 'Payment failed',
    timeout: 'Request timed out',
    rejected: 'Payment rejected',
    cancelled: 'Payment cancelled',
    checkPhone: 'Check your MTN phone',
    enterPin: 'Enter your MoMo PIN',
    fees: 'Fees: 1.5%',
    noFees: 'No fees',
    invalidNumber: 'Invalid MTN MoMo number',
    yelloMoney: 'MTN Mobile Money',
  }
}
