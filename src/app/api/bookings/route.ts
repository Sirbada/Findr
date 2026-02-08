import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user (tenant)
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      listing_id, 
      check_in, 
      check_out,
      duration_months,
      tenant_message 
    } = body

    // Validate required fields
    if (!listing_id || !check_in) {
      return NextResponse.json(
        { success: false, error: 'listing_id and check_in are required' },
        { status: 400 }
      )
    }

    // Fetch listing details and landlord info
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select(`
        *,
        profiles!listings_user_id_fkey (
          id,
          full_name
        )
      `)
      .eq('id', listing_id)
      .eq('status', 'active')
      .single()

    if (listingError || !listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found or not available' },
        { status: 404 }
      )
    }

    if (listing.user_id === user.id) {
      return NextResponse.json(
        { success: false, error: 'You cannot book your own listing' },
        { status: 400 }
      )
    }

    // Calculate financial details
    const monthlyRent = listing.price
    const depositAmount = monthlyRent * (listing.deposit_months || 2)
    const serviceFee = Math.ceil(monthlyRent * 0.05) // 5% service fee
    const totalAmount = monthlyRent + depositAmount + serviceFee

    // Create booking
    const bookingData = {
      listing_id,
      tenant_id: user.id,
      landlord_id: listing.user_id,
      check_in,
      check_out: check_out || null,
      duration_months: duration_months || 1,
      monthly_rent: monthlyRent,
      deposit_amount: depositAmount,
      service_fee: serviceFee,
      total_amount: totalAmount,
      tenant_message: tenant_message || null,
      status: 'pending' as const,
      deposit_status: 'pending' as const
    }

    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select(`
        *,
        listings (
          title,
          images,
          city,
          neighborhood
        ),
        tenant:profiles!bookings_tenant_id_fkey (
          id,
          full_name,
          phone
        ),
        landlord:profiles!bookings_landlord_id_fkey (
          id,
          full_name,
          phone
        )
      `)
      .single()

    if (bookingError) {
      console.error('Error creating booking:', bookingError)
      return NextResponse.json(
        { success: false, error: 'Failed to create booking' },
        { status: 500 }
      )
    }

    // TODO: Send notification to landlord about new booking request
    // TODO: Send confirmation email/SMS to tenant

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking request submitted successfully. The landlord will review your request.'
    }, { status: 201 })

  } catch (error) {
    console.error('Create booking API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') // 'tenant' or 'landlord'
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    let query = supabase
      .from('bookings')
      .select(`
        *,
        listings (
          id,
          title,
          images,
          city,
          neighborhood,
          housing_type
        ),
        tenant:profiles!bookings_tenant_id_fkey (
          id,
          full_name,
          phone
        ),
        landlord:profiles!bookings_landlord_id_fkey (
          id,
          full_name,
          phone
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    // Filter by role
    if (role === 'tenant') {
      query = query.eq('tenant_id', user.id)
    } else if (role === 'landlord') {
      query = query.eq('landlord_id', user.id)
    } else {
      // Default: show all bookings where user is involved
      query = query.or(`tenant_id.eq.${user.id},landlord_id.eq.${user.id}`)
    }

    // Filter by status
    if (status) {
      query = query.eq('status', status)
    }

    const { data: bookings, error: bookingsError } = await query

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch bookings' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: bookings || []
    })

  } catch (error) {
    console.error('Get bookings API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}