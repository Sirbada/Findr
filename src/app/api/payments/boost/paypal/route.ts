import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { paypalService } from '@/lib/payments/paypal'

// POST: initiate PayPal payment for a boost
// Body: { boost_id: string, amount: number }
// Returns: { approval_url: string }
export async function POST(request: Request) {
  const supabase = await createClient()
  const authClient: any = (supabase as any).auth
  const sessionData = authClient.getSession
    ? await authClient.getSession()
    : await authClient.getUser()
  const user = sessionData?.data?.session?.user || sessionData?.data?.user

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => null)
  if (!body || !body.boost_id || !body.amount) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { boost_id, amount } = body

  // Verify boost belongs to current user
  const { data: boost, error: boostError } = await supabase
    .from('listing_boosts')
    .select('id, user_id, status')
    .eq('id', boost_id)
    .single()

  if (boostError || !boost) {
    return NextResponse.json({ error: 'Boost not found' }, { status: 404 })
  }

  if (boost.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (boost.status !== 'pending') {
    return NextResponse.json({ error: 'Boost already processed' }, { status: 400 })
  }

  // Call PayPal API to create order
  const result = await paypalService.createOrder({
    amount,
    orderId: boost_id,
    description: `Boost annonce Findr - ${boost_id}`,
  })

  if (!result.success || !result.orderId) {
    return NextResponse.json(
      { error: result.error || 'PayPal order creation failed' },
      { status: 400 }
    )
  }

  // Update boost with PayPal order ID as payment reference
  await supabase
    .from('listing_boosts')
    .update({ payment_reference: result.orderId })
    .eq('id', boost_id)

  // Return the approval URL for redirect
  const approvalUrl = result.approvalUrl || 
    `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/boost/success?boost_id=${boost_id}`

  return NextResponse.json({
    success: true,
    approval_url: approvalUrl,
    order_id: result.orderId,
  })
}
