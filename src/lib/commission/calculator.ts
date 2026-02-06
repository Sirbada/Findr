/**
 * Commission Calculator for Findr Platform
 * 
 * Handles commission calculations for:
 * - Housing rentals & sales
 * - Car rentals & sales
 * - Premium listings
 */

export type Category = 'housing' | 'cars'
export type TransactionType = 'rental' | 'sale'

export interface CommissionResult {
  listingPrice: number
  currency: string
  sellerCommission: number
  buyerCommission: number
  totalCommission: number
  sellerReceives: number
  buyerPays: number
  sellerRate: number
  buyerRate: number
}

export interface CommissionRate {
  seller: number
  buyer: number
}

export interface PremiumListing {
  id: string
  name: string
  duration: number // days
  price: number // XAF
  description: string
}

// Commission rates by category and transaction type
const COMMISSION_RATES: Record<Category, Record<TransactionType, CommissionRate>> = {
  housing: {
    rental: { seller: 0.05, buyer: 0.05 },  // 5% each on first month
    sale: { seller: 0.02, buyer: 0 },        // 2% seller only
  },
  cars: {
    rental: { seller: 0.10, buyer: 0.05 },   // 10% seller, 5% buyer per booking
    sale: { seller: 0.03, buyer: 0 },        // 3% seller only
  },
}

// Premium listing options
export const PREMIUM_LISTINGS: PremiumListing[] = [
  {
    id: 'featured_7',
    name: 'Featured (7 jours)',
    duration: 7,
    price: 5000,
    description: 'Votre annonce mise en avant pendant 7 jours',
  },
  {
    id: 'featured_30',
    name: 'Featured (30 jours)',
    duration: 30,
    price: 15000,
    description: 'Votre annonce mise en avant pendant 30 jours',
  },
  {
    id: 'top_7',
    name: 'Top Position (7 jours)',
    duration: 7,
    price: 10000,
    description: 'Votre annonce en haut des résultats pendant 7 jours',
  },
  {
    id: 'top_30',
    name: 'Top Position (30 jours)',
    duration: 30,
    price: 30000,
    description: 'Votre annonce en haut des résultats pendant 30 jours',
  },
]

/**
 * Calculate commission for a transaction
 */
export function calculateCommission(
  price: number,
  category: Category,
  transactionType: TransactionType,
  currency: string = 'XAF'
): CommissionResult {
  const rates = COMMISSION_RATES[category][transactionType]
  
  const sellerCommission = Math.round(price * rates.seller)
  const buyerCommission = Math.round(price * rates.buyer)
  
  return {
    listingPrice: price,
    currency,
    sellerCommission,
    buyerCommission,
    totalCommission: sellerCommission + buyerCommission,
    sellerReceives: price - sellerCommission,
    buyerPays: price + buyerCommission,
    sellerRate: rates.seller * 100,
    buyerRate: rates.buyer * 100,
  }
}

/**
 * Get commission rates for a category and transaction type
 */
export function getCommissionRates(
  category: Category,
  transactionType: TransactionType
): CommissionRate {
  return COMMISSION_RATES[category][transactionType]
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency
}

/**
 * Calculate monthly revenue projections
 */
export function calculateMonthlyRevenue(transactions: Transaction[]): MonthlyRevenue[] {
  const byMonth = new Map<string, MonthlyRevenue>()
  
  transactions.forEach(tx => {
    if (tx.status !== 'completed') return
    
    const monthKey = tx.completedAt 
      ? new Date(tx.completedAt).toISOString().slice(0, 7) 
      : new Date(tx.createdAt).toISOString().slice(0, 7)
    
    const existing = byMonth.get(monthKey) || {
      month: monthKey,
      transactionCount: 0,
      totalVolume: 0,
      totalRevenue: 0,
      byCategory: {
        housing: { count: 0, volume: 0, revenue: 0 },
        cars: { count: 0, volume: 0, revenue: 0 },
      },
    }
    
    existing.transactionCount++
    existing.totalVolume += tx.amount
    existing.totalRevenue += tx.platformRevenue
    
    if (tx.category === 'housing' || tx.category === 'cars') {
      existing.byCategory[tx.category].count++
      existing.byCategory[tx.category].volume += tx.amount
      existing.byCategory[tx.category].revenue += tx.platformRevenue
    }
    
    byMonth.set(monthKey, existing)
  })
  
  return Array.from(byMonth.values()).sort((a, b) => b.month.localeCompare(a.month))
}

// Types
export interface Transaction {
  id: string
  listingId: string
  sellerId: string
  buyerId: string
  category: Category
  transactionType: TransactionType
  amount: number
  currency: string
  sellerCommission: number
  buyerCommission: number
  platformRevenue: number
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  paymentMethod: string
  paymentReference?: string
  createdAt: string
  completedAt?: string
}

export interface MonthlyRevenue {
  month: string
  transactionCount: number
  totalVolume: number
  totalRevenue: number
  byCategory: {
    housing: { count: number; volume: number; revenue: number }
    cars: { count: number; volume: number; revenue: number }
  }
}

export interface RevenueByListing {
  listingId: string
  listingTitle: string
  category: Category
  transactionCount: number
  totalVolume: number
  totalCommission: number
}

/**
 * Demo data generator for testing
 */
export function generateDemoTransactions(count: number = 50): Transaction[] {
  const transactions: Transaction[] = []
  const categories: Category[] = ['housing', 'cars']
  const types: TransactionType[] = ['rental', 'sale']
  const statuses: ('pending' | 'completed' | 'cancelled')[] = ['completed', 'completed', 'completed', 'pending', 'cancelled']
  const paymentMethods = ['orange_money', 'mtn_momo', 'card']
  
  // Generate transactions over the last 6 months
  const now = new Date()
  
  for (let i = 0; i < count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)]
    const transactionType = types[Math.floor(Math.random() * types.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    // Randomize amounts based on category and type
    let amount: number
    if (category === 'housing') {
      amount = transactionType === 'rental'
        ? Math.floor(Math.random() * 300000) + 50000  // 50k - 350k XAF/month
        : Math.floor(Math.random() * 50000000) + 10000000  // 10M - 60M XAF
    } else {
      amount = transactionType === 'rental'
        ? Math.floor(Math.random() * 50000) + 10000  // 10k - 60k XAF/day
        : Math.floor(Math.random() * 10000000) + 1000000  // 1M - 11M XAF
    }
    
    const commission = calculateCommission(amount, category, transactionType)
    
    // Random date in the last 6 months
    const daysAgo = Math.floor(Math.random() * 180)
    const createdDate = new Date(now)
    createdDate.setDate(createdDate.getDate() - daysAgo)
    
    transactions.push({
      id: `tx_${i + 1}`,
      listingId: `listing_${Math.floor(Math.random() * 20) + 1}`,
      sellerId: `seller_${Math.floor(Math.random() * 10) + 1}`,
      buyerId: `buyer_${Math.floor(Math.random() * 30) + 1}`,
      category,
      transactionType,
      amount,
      currency: 'XAF',
      sellerCommission: commission.sellerCommission,
      buyerCommission: commission.buyerCommission,
      platformRevenue: commission.totalCommission,
      status,
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      paymentReference: status === 'completed' ? `REF_${Date.now()}_${i}` : undefined,
      createdAt: createdDate.toISOString(),
      completedAt: status === 'completed' ? createdDate.toISOString() : undefined,
    })
  }
  
  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
