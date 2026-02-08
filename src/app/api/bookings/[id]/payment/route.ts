import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
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
    const { 
      payment_method, 
      payment_reference, 
      amount,
      payment_type // 'deposit' or 'rent'
    } = body

    // Validate required fields
    if (!payment_method || !payment_reference || !amount || !payment_type) {
      return NextResponse.json(
        { success: false, error: 'payment_method, payment_reference, amount, and payment_type are required' },
        { status: 400 }
      )
    }

    // Fetch booking and verify tenant can make payment
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        listings (title, user_id),
        landlord:profiles!bookings_landlord_id_fkey (full_name, phone)
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Verify user is the tenant
    if (booking.tenant_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Only the tenant can make payments for this booking' },
        { status: 403 }
      )
    }

    if (payment_type === 'deposit') {
      // Handle initial deposit payment
      if (booking.deposit_status !== 'pending') {
        return NextResponse.json(
          { success: false, error: 'Deposit has already been processed' },
          { status: 400 }
        )
      }

      // Update booking with deposit payment
      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({
          deposit_status: 'escrow',
          deposit_paid_at: new Date().toISOString(),
          status: 'deposit_paid',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating booking deposit status:', updateError)
        return NextResponse.json(
          { success: false, error: 'Failed to process deposit payment' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: updatedBooking,
        message: 'Deposit payment recorded successfully. Funds are held in escrow.'
      })

    } else if (payment_type === 'rent') {
      // Handle monthly rent payment
      const periodStart = new Date()
      const periodEnd = new Date(periodStart)
      periodEnd.setMonth(periodEnd.getMonth() + 1)

      // Create rental payment record
      const { data: payment, error: paymentError } = await supabase
        .from('rental_payments')
        .insert([{
          booking_id: bookingId,
          period_start: periodStart.toISOString().split('T')[0],
          period_end: periodEnd.toISOString().split('T')[0],
          amount: amount,
          status: 'escrow', // Hold in escrow before releasing to landlord
          payment_method,
          payment_reference,
          paid_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (paymentError) {
        console.error('Error creating rental payment:', paymentError)
        return NextResponse.json(
          { success: false, error: 'Failed to record rental payment' },
          { status: 500 }
        )
      }

      // TODO: Schedule payout to landlord (after 24h cooling period)
      // TODO: Send receipt to tenant
      // TODO: Notify landlord of payment received

      return NextResponse.json({
        success: true,
        data: payment,
        message: 'Rental payment recorded successfully. Payout will be processed to landlord.'
      }, { status: 201 })
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid payment_type. Must be "deposit" or "rent"' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Payment registration API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}