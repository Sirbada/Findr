import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

/**
 * Database Schema Setup
 * Creates missing tables: bookings, transactions, reviews
 * POST /api/schema?key=findr-setup-2026
 */
export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const key = searchParams.get('key')
  
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    return NextResponse.json({ error: 'Service key not configured' }, { status: 500 })
  }
  
  if (key !== 'findr-setup-2026') {
    return NextResponse.json({ error: 'Invalid setup key' }, { status: 403 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey
  )

  const results: Array<{table: string, success: boolean, error?: string}> = []

  // Create bookings table
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS bookings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
          tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          landlord_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          check_in DATE NOT NULL,
          check_out DATE,
          monthly_rent NUMERIC NOT NULL,
          deposit_amount NUMERIC NOT NULL,
          service_fee NUMERIC NOT NULL,
          total_amount NUMERIC NOT NULL,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
          payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
          tenant_message TEXT,
          landlord_response TEXT,
          contract_signed_tenant TIMESTAMP,
          contract_signed_landlord TIMESTAMP,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_bookings_listing ON bookings(listing_id);
        CREATE INDEX IF NOT EXISTS idx_bookings_tenant ON bookings(tenant_id);
        CREATE INDEX IF NOT EXISTS idx_bookings_landlord ON bookings(landlord_id);
      `
    })
    
    results.push({ 
      table: 'bookings', 
      success: !error, 
      error: error?.message 
    })
  } catch (e) {
    results.push({ 
      table: 'bookings', 
      success: false, 
      error: `RPC not available: ${e}` 
    })
  }

  // Create transactions table
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS transactions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          amount NUMERIC NOT NULL,
          currency TEXT DEFAULT 'XAF',
          type TEXT CHECK (type IN ('deposit', 'rent', 'refund', 'commission')),
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled', 'expired')),
          payment_method TEXT CHECK (payment_method IN ('momo', 'orange_money', 'paypal', 'bank')),
          payment_reference TEXT,
          provider_transaction_id TEXT,
          metadata JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_transactions_booking ON transactions(booking_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
        CREATE INDEX IF NOT EXISTS idx_transactions_reference ON transactions(payment_reference);
      `
    })
    
    results.push({ 
      table: 'transactions', 
      success: !error, 
      error: error?.message 
    })
  } catch (e) {
    results.push({ 
      table: 'transactions', 
      success: false, 
      error: `RPC not available: ${e}` 
    })
  }

  // Create reviews table
  try {
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS reviews (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
          reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          reviewee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          title TEXT,
          comment TEXT,
          response TEXT,
          response_at TIMESTAMP,
          is_verified BOOLEAN DEFAULT FALSE,
          is_flagged BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        );
        
        CREATE INDEX IF NOT EXISTS idx_reviews_listing ON reviews(listing_id);
        CREATE INDEX IF NOT EXISTS idx_reviews_reviewer ON reviews(reviewer_id);
        CREATE INDEX IF NOT EXISTS idx_reviews_reviewee ON reviews(reviewee_id);
        
        -- Review votes table for helpful/not helpful
        CREATE TABLE IF NOT EXISTS review_votes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          vote TEXT CHECK (vote IN ('helpful', 'not_helpful')),
          created_at TIMESTAMP DEFAULT NOW(),
          UNIQUE(review_id, user_id)
        );
      `
    })
    
    results.push({ 
      table: 'reviews', 
      success: !error, 
      error: error?.message 
    })
  } catch (e) {
    results.push({ 
      table: 'reviews', 
      success: false, 
      error: `RPC not available: ${e}` 
    })
  }

  return NextResponse.json({
    success: results.every(r => r.success),
    results,
    note: "If RPC is not available, tables need to be created via Supabase Dashboard SQL Editor"
  })
}

export async function GET() {
  return NextResponse.json({ 
    info: 'POST /api/schema?key=findr-setup-2026 to create missing tables',
    tables: ['bookings', 'transactions', 'reviews', 'review_votes']
  })
}