// Database types for Findr platform

export type ListingCategory = 'housing' | 'cars' | 'jobs'
export type ListingStatus = 'active' | 'pending' | 'sold' | 'expired'
export type HousingType = 'apartment' | 'house' | 'studio' | 'land' | 'commercial'
export type RentalPeriod = 'day' | 'week' | 'month' | 'year' | 'sale'

export interface User {
  id: string
  email: string
  phone?: string
  full_name?: string
  avatar_url?: string
  is_verified: boolean
  created_at: string
}

export interface Listing {
  id: string
  user_id: string
  category: ListingCategory
  title: string
  description: string
  price: number
  currency: 'XAF' | 'EUR' | 'USD'
  city: string
  neighborhood?: string
  address?: string
  latitude?: number
  longitude?: number
  images: string[]
  status: ListingStatus
  is_featured: boolean
  is_verified: boolean
  views: number
  created_at: string
  updated_at: string
}

export interface HousingListing extends Listing {
  category: 'housing'
  housing_type: HousingType
  rental_period: RentalPeriod
  rooms?: number
  bathrooms?: number
  surface_m2?: number
  furnished: boolean
  amenities: string[]
}

export interface CarListing extends Listing {
  category: 'cars'
  brand: string
  model: string
  year: number
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  transmission: 'manual' | 'automatic'
  seats: number
  price_per_day: number
  available_from?: string
  available_to?: string
}

export interface JobListing extends Listing {
  category: 'jobs'
  job_type: 'fulltime' | 'parttime' | 'freelance' | 'internship'
  company_name?: string
  salary_min?: number
  salary_max?: number
  experience_years?: number
  remote: boolean
  skills: string[]
}

export interface Message {
  id: string
  sender_id: string
  receiver_id: string
  listing_id?: string
  content: string
  read: boolean
  created_at: string
}

export interface Review {
  id: string
  reviewer_id: string
  reviewed_user_id: string
  listing_id?: string
  rating: number
  comment?: string
  created_at: string
}

// Transaction types for commission tracking
export type TransactionType = 'rental' | 'sale' | 'premium_listing'
export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
export type PaymentMethod = 'orange_money' | 'mtn_momo' | 'wave' | 'card' | 'cash'

export interface Transaction {
  id: string
  listing_id?: string
  seller_id: string
  buyer_id: string
  
  transaction_type: TransactionType
  category: ListingCategory
  
  amount: number
  currency: 'XAF' | 'EUR' | 'USD'
  
  commission_seller: number
  commission_buyer: number
  commission_rate_seller: number
  commission_rate_buyer: number
  platform_revenue: number
  
  status: TransactionStatus
  payment_method: PaymentMethod
  payment_reference?: string
  
  created_at: string
  completed_at?: string
}

export interface CommissionSetting {
  id: number
  category: ListingCategory
  transaction_type: 'rental' | 'sale'
  seller_rate: number
  buyer_rate: number
  min_amount?: number
  max_amount?: number
  active: boolean
  created_at: string
  updated_at: string
}

export interface UserVerification {
  id: string
  user_id: string
  verification_type: 'id_card' | 'passport' | 'phone' | 'email' | 'address'
  status: 'pending' | 'verified' | 'rejected'
  verified_at?: string
  document_url?: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  listing_id: string
  created_at: string
}
