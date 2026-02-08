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

    // First, verify user has access to this booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select('tenant_id, landlord_id')
      .eq('id', bookingId)
      .single()

    if (bookingError || !booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      )
    }

    // Check if user is involved in this booking
    if (booking.tenant_id !== user.id && booking.landlord_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'Access denied' },
        { status: 403 }
      )
    }

    // Fetch all rental payments for this booking
    const { data: payments, error: paymentsError } = await supabase
      .from('rental_payments')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: false })

    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch payment history' },
        { status: 500 }
      )
    }

    // Get deposit payment info from booking
    const { data: depositInfo, error: depositError } = await supabase
      .from('bookings')
      .select('deposit_amount, deposit_status, deposit_paid_at, deposit_released_at')
      .eq('id', bookingId)
      .single()

    if (depositError) {
      console.error('Error fetching deposit info:', depositError)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch deposit information' },
        { status: 500 }
      )
    }

    // Calculate payment summary
    const totalPaid = (payments || []).reduce((sum, payment) => {
      return payment.status === 'released' || payment.status === 'escrow' 
        ? sum + payment.amount 
        : sum
    }, 0)

    const pendingPayments = (payments || []).filter(p => p.status === 'pending').length
    const completedPayments = (payments || []).filter(p => p.status === 'released').length

    return NextResponse.json({
      success: true,
      data: {
        rental_payments: payments || [],
        deposit: {
          amount: depositInfo.deposit_amount,
          status: depositInfo.deposit_status,
          paid_at: depositInfo.deposit_paid_at,
          released_at: depositInfo.deposit_released_at
        },
        summary: {
          total_paid: totalPaid,
          pending_payments: pendingPayments,
          completed_payments: completedPayments
        }
      }
    })

  } catch (error) {
    console.error('Payment history API error:', error)
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}