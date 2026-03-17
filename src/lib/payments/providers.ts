/**
 * Payment Providers for Cameroon
 * 
 * Supported:
 * - Orange Money (+ Prepaid Mastercard)
 * - MTN Mobile Money
 * - Wave (coming soon)
 * - Card payments (Visa/Mastercard via Stripe/Paystack)
 */

export type PaymentProvider = 'orange_money' | 'mtn_momo' | 'wave' | 'card'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

export interface PaymentMethod {
  id: PaymentProvider
  name: string
  description: string
  icon: string
  available: boolean
  fees: number // percentage
  minAmount: number // XAF
  maxAmount: number // XAF
}

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'orange_money',
    name: 'Orange Money',
    description: 'Paiement mobile + Mastercard Prepaid',
    icon: 'OM',
    available: true,
    fees: 1.5,
    minAmount: 100,
    maxAmount: 5000000,
  },
  {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    description: 'Paiement mobile instantané',
    icon: 'MTN',
    available: true,
    fees: 1.5,
    minAmount: 100,
    maxAmount: 5000000,
  },
  {
    id: 'wave',
    name: 'Wave',
    description: 'Transfert d\'argent sans frais',
    icon: 'W',
    available: false, // Coming soon to Cameroon
    fees: 0,
    minAmount: 100,
    maxAmount: 10000000,
  },
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard',
    icon: '💳',
    available: true,
    fees: 2.5,
    minAmount: 500,
    maxAmount: 10000000,
  },
]

export interface Transaction {
  id: string
  userId: string
  amount: number
  currency: 'XAF'
  provider: PaymentProvider
  status: PaymentStatus
  type: 'deposit' | 'withdrawal' | 'payment' | 'refund'
  description: string
  reference: string
  phone?: string
  createdAt: string
  completedAt?: string
}

/**
 * Orange Money Integration
 * 
 * API Documentation: https://developer.orange.com/apis/om-webpay
 * 
 * Flow:
 * 1. Initialize payment with phone number
 * 2. User receives USSD prompt on phone
 * 3. User enters PIN to confirm
 * 4. Webhook receives confirmation
 * 5. Credit user balance
 */
export async function initiateOrangeMoneyPayment(params: {
  amount: number
  phone: string
  orderId: string
}) {
  // TODO: Replace with real Orange Money Web Pay API call
  // Requires merchant account from Orange Cameroon
  // Docs: https://developer.orange.com/apis/om-webpay
  const { amount, phone, orderId } = params
  void amount; void phone; void orderId
  return {
    success: true,
    transactionId: `OM_${Date.now()}`,
    status: 'pending' as PaymentStatus,
    message: 'Veuillez confirmer le paiement sur votre téléphone',
  }
}

/**
 * MTN Mobile Money Integration
 * 
 * API Documentation: https://momodeveloper.mtn.com/
 * 
 * Flow similar to Orange Money
 */
export async function initiateMTNMomoPayment(params: {
  amount: number
  phone: string
  orderId: string
}) {
  // TODO: Replace with real MTN MoMo API call
  // Requires merchant account from MTN Cameroon
  // Docs: https://momodeveloper.mtn.com/
  const { amount, phone, orderId } = params
  void amount; void phone; void orderId
  return {
    success: true,
    transactionId: `MTN_${Date.now()}`,
    status: 'pending' as PaymentStatus,
    message: 'Veuillez confirmer le paiement sur votre téléphone',
  }
}

/**
 * Wave Integration (Coming Soon)
 * 
 * Wave is expanding to Cameroon - will add when available
 * Known for zero-fee transfers in Senegal, Côte d'Ivoire
 */
export async function initiateWavePayment(params: {
  amount: number
  phone: string
  orderId: string
}) {
  return {
    success: false,
    error: 'Wave n\'est pas encore disponible au Cameroun',
  }
}

/**
 * Card Payment via Stripe or Paystack
 * 
 * Paystack is popular in Africa and supports Cameroon
 * https://paystack.com/
 */
export async function initiateCardPayment(params: {
  amount: number
  email: string
  orderId: string
}) {
  // TODO: Replace with real Paystack/Stripe API call
  // Docs: https://paystack.com/docs/api/
  const { amount, email, orderId } = params
  void amount; void email
  return {
    success: true,
    checkoutUrl: `https://checkout.paystack.com/${orderId}`,
    reference: `CARD_${Date.now()}`,
  }
}

/**
 * Verify payment status
 */
export async function verifyPayment(transactionId: string, provider: PaymentProvider) {
  // TODO: Implement verification for each provider
  
  return {
    status: 'completed' as PaymentStatus,
    transactionId,
  }
}

/**
 * Format amount for display
 */
export function formatXAF(amount: number): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' XAF'
}

/**
 * Calculate fees
 */
export function calculateFees(amount: number, provider: PaymentProvider): number {
  const method = paymentMethods.find(m => m.id === provider)
  if (!method) return 0
  return Math.round(amount * (method.fees / 100))
}
