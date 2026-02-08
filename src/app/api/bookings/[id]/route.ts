import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Fetch booking details with all related data
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        listings (
          id,
          title,
          description,
          price,
          images,
          city,
          neighborhood,
          housing_type,
          rooms,
          bathrooms,
          surface_m2,
          amenities,
          whatsapp_number
        ),
        tenant:profiles!bookings_tenant_id_fkey (
          id,
          full_name,
          email,
          phone
        ),
        landlord:profiles!bookings_landlord_id_fkey (
          id,
          full_name,
          email,
          phone
        )
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError) {
      if (bookingError.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        )
      }
      
      console.error('Error fetching booking:', bookingError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch booking' },
        { status: 500 }
      )
    }

    // Check if user is involved in this booking
    if (booking.tenant_id !== user.id && booking.landlord_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      data: booking
    })

  } catch (error) {
    console.error('Get booking API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: bookingId } = await params
    
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status, landlord_response, cancellation_reason } = body

    // First, fetch the current booking to check permissions
    const { data: currentBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (fetchError || !currentBooking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check permissions and validate status transitions
    const isLandlord = currentBooking.landlord_id === user.id
    const isTenant = currentBooking.tenant_id === user.id

    if (!isLandlord && !isTenant) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Validate status transitions based on user role
    const validTransitions: Record<string, string[]> = {
      'pending': isLandlord ? ['confirmed', 'cancelled'] : ['cancelled'],
      'confirmed': isLandlord || isTenant ? ['deposit_paid', 'cancelled'] : [],
      'deposit_paid': isLandlord ? ['active'] : [],
      'active': isLandlord || isTenant ? ['completed', 'cancelled'] : [],
      'completed': [],
      'cancelled': [],
      'disputed': []
    }

    if (status && !validTransitions[currentBooking.status]?.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Cannot transition from ${currentBooking.status} to ${status}` },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (status) {
      updateData.status = status
    }

    if (landlord_response && isLandlord) {
      updateData.landlord_response = landlord_response
    }

    if (cancellation_reason) {
      updateData.cancellation_reason = cancellation_reason
    }

    // Handle specific status updates
    if (status === 'deposit_paid') {
      updateData.deposit_paid_at = new Date().toISOString()
      updateData.deposit_status = 'escrow'
    }

    // Update booking
    const { data: booking, error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select(`
        *,
        listings (
          title,
          images
        ),
        tenant:profiles!bookings_tenant_id_fkey (
          full_name,
          phone
        ),
        landlord:profiles!bookings_landlord_id_fkey (
          full_name,
          phone
        )
      `)
      .single()

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update booking' },
        { status: 500 }
      )
    }

    // TODO: Send notifications based on status change
    // TODO: Trigger payment flows when status changes to confirmed
    // TODO: Release escrow when status changes to completed

    return NextResponse.json({
      success: true,
      data: booking,
      message: `Booking ${status ? `status updated to ${status}` : 'updated'} successfully`
    })

  } catch (error) {
    console.error('Update booking API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}