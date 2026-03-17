import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { mtnMomoService } from '@/lib/payments/mtn-momo'

// POST: initiate MTN MoMo payment for a boost
// Body: { boost_id: string, amount: number, phone: string }
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
  if (!body || !body.boost_id || !body.amount || !body.phone) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { boost_id, amount, phone } = body

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

  // Call MTN MoMo API
  const result = await mtnMomoService.initiatePayment({
    amount,
    phone,
    orderId: boost_id,
    description: `Boost annonce Findr - ${boost_id}`,
    payerMessage: 'Boost annonce Findr',
    payeeNote: `Boost ${boost_id}`,
  })

  if (!result.success || !result.referenceId) {
    return NextResponse.json(
      { error: result.error || 'Payment initiation failed' },
      { status: 400 }
    )
  }

  // Update boost with payment reference
  await supabase
    .from('listing_boosts')
    .update({ payment_reference: result.referenceId })
    .eq('id', boost_id)

  return NextResponse.json({
    success: true,
    reference: result.referenceId,
    message: result.message,
  })
}
