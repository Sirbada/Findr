import { createClient } from './client'

export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'

export interface Booking {
  id: string
  listing_id: string
  tenant_id: string
  landlord_id: string
  
  // Booking details
  check_in: string
  check_out?: string | null
  monthly_rent: number
  deposit_amount: number
  service_fee: number
  total_amount: number
  
  // Status
  status: BookingStatus
  payment_status: PaymentStatus
  
  // Messages
  tenant_message?: string | null
  landlord_response?: string | null
  
  // Contract
  contract_signed_tenant?: string | null
  contract_signed_landlord?: string | null
  
  created_at: string
  updated_at: string
  
  // Relations
  listing?: any
  tenant?: any
  landlord?: any
}

export interface BookingRequest {
  listing_id: string
  check_in: string
  check_out?: string | null
  message?: string
}

// Calculate booking fees
export function calculateBookingFees(monthlyRent: number, isFirstBooking = false) {
  const serviceFee = Math.round(monthlyRent * 0.05) // 5% service fee
  const depositAmount = monthlyRent * 2 // 2 months deposit
  const totalAmount = monthlyRent + serviceFee + depositAmount
  
  return {
    monthlyRent,
    serviceFee,
    depositAmount,
    totalAmount,
    breakdown: {
      rent: monthlyRent,
      service: serviceFee,
      deposit: depositAmount
    }
  }
}

// Create booking request
export async function createBooking(bookingData: BookingRequest & { tenant_id: string }) {
  const supabase = createClient()
  
  // Get listing details
  const { data: listing, error: listingError } = await supabase
    .from('listings')
    .select('*, user_id')
    .eq('id', bookingData.listing_id)
    .single()
    
  if (listingError || !listing) {
    throw new Error('Listing not found')
  }
  
  // Calculate fees
  const fees = calculateBookingFees(listing.price)
  
  const booking = {
    listing_id: bookingData.listing_id,
    tenant_id: bookingData.tenant_id,
    landlord_id: listing.user_id,
    check_in: bookingData.check_in,
    check_out: bookingData.check_out,
    monthly_rent: listing.price,
    deposit_amount: fees.depositAmount,
    service_fee: fees.serviceFee,
    total_amount: fees.totalAmount,
    status: 'pending' as BookingStatus,
    payment_status: 'pending' as PaymentStatus,
    tenant_message: bookingData.message,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  const { data, error } = await supabase
    .from('bookings')
    .insert([booking])
    .select('*')
    .single()
    
  if (error) {
    console.error('Error creating booking:', error)
    throw error
  }
  
  return data as Booking
}

// Get user bookings (as tenant)
export async function getTenantBookings(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      listing:listings(*)
    `)
    .eq('tenant_id', userId)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching tenant bookings:', error)
    return []
  }
  
  return data as Booking[]
}

// Get landlord bookings (as landlord)
export async function getLandlordBookings(userId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      listing:listings(*),
      tenant:profiles!bookings_tenant_id_fkey(*)
    `)
    .eq('landlord_id', userId)
    .order('created_at', { ascending: false })
    
  if (error) {
    console.error('Error fetching landlord bookings:', error)
    return []
  }
  
  return data as Booking[]
}

// Update booking status
export async function updateBookingStatus(
  bookingId: string, 
  status: BookingStatus,
  landlordResponse?: string
) {
  const supabase = createClient()
  
  const updates: any = {
    status,
    updated_at: new Date().toISOString()
  }
  
  if (landlordResponse) {
    updates.landlord_response = landlordResponse
  }
  
  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select('*')
    .single()
    
  if (error) {
    console.error('Error updating booking status:', error)
    throw error
  }
  
  return data as Booking
}

// Process payment for booking
export async function processBookingPayment(
  bookingId: string,
  paymentMethod: 'orange_money' | 'mtn_momo' | 'paypal',
  paymentReference: string
) {
  const supabase = createClient()
  
  // Update payment status
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({
      payment_status: 'processing',
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select('*')
    .single()
    
  if (error) {
    throw error
  }
  
  // Create transaction record
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert([{
      booking_id: bookingId,
      seller_id: booking.landlord_id,
      buyer_id: booking.tenant_id,
      transaction_type: 'rental',
      category: 'housing',
      amount: booking.total_amount,
      currency: 'XAF',
      commission_seller: booking.service_fee * 0.6, // 60% to platform from service fee
      commission_buyer: booking.service_fee * 0.4,  // 40% to platform from service fee
      platform_revenue: booking.service_fee,
      status: 'processing',
      payment_method: paymentMethod,
      payment_reference: paymentReference,
      created_at: new Date().toISOString()
    }])
    
  if (transactionError) {
    console.error('Error creating transaction:', transactionError)
  }
  
  return booking as Booking
}

// Get booking by ID
export async function getBooking(bookingId: string) {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      listing:listings(*),
      tenant:profiles!bookings_tenant_id_fkey(*),
      landlord:profiles!bookings_landlord_id_fkey(*)
    `)
    .eq('id', bookingId)
    .single()
    
  if (error) {
    console.error('Error fetching booking:', error)
    return null
  }
  
  return data as Booking
}